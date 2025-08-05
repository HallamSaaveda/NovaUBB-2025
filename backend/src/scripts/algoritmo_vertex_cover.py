import sys
import json
import time
from itertools import combinations
import networkx as nx
import matplotlib.pyplot as plt
import base64
from io import BytesIO

def is_vertex_cover(graph, subset):
    """Verifica si un subconjunto de nodos es un vertex cover."""
    for u, v in graph.edges():
        if u not in subset and v not in subset:
            return False
    return True

def brute_force_vertex_cover(graph):
    """Algoritmo de fuerza bruta para encontrar el vertex cover mínimo."""
    nodes = list(graph.nodes())
    for k in range(1, len(nodes) + 1):
        for subset in combinations(nodes, k):
            if is_vertex_cover(graph, subset):
                return set(subset)
    return set()

def greedy_vertex_cover(graph):
    """Algoritmo greedy para encontrar una aproximación del vertex cover."""
    G = graph.copy()
    cover = set()
    while G.number_of_edges() > 0:
        max_degree_node = max(G.degree, key=lambda x: x[1])[0]
        cover.add(max_degree_node)
        G.remove_node(max_degree_node)
    return cover

def generar_grafico_vertex_cover(nodos, aristas, bf_cover, greedy_cover):
    """Genera un gráfico matplotlib del vertex cover y lo convierte a base64."""
    try:
        G = nx.Graph()
        G.add_nodes_from(nodos)
        G.add_edges_from(aristas)

        pos = nx.spring_layout(G, seed=42)
        
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 6))
        ax1.set_title("Fuerza Bruta (Óptimo)")
        ax2.set_title("Greedy (Aproximado)")

        # Gráfico fuerza bruta
        nx.draw(G, pos, ax=ax1, with_labels=True, node_color='lightblue', 
                edge_color='gray', node_size=1000)
        nx.draw_networkx_nodes(G, pos, nodelist=bf_cover, ax=ax1, 
                              node_color='green', node_size=1200)

        # Gráfico greedy
        nx.draw(G, pos, ax=ax2, with_labels=True, node_color='lightblue', 
                edge_color='gray', node_size=1000)
        nx.draw_networkx_nodes(G, pos, nodelist=greedy_cover, ax=ax2, 
                              node_color='orange', node_size=1200)

        plt.tight_layout()
        
        # Convertir a base64
        buffer = BytesIO()
        fig.savefig(buffer, format='png', bbox_inches='tight', dpi=150)
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        plt.close(fig)
        
        return image_base64
    except Exception as e:
        raise ValueError(f"Error al generar gráfico: {e}")

def calcular_vertex_cover_desde_entrada(nodos_str: str, aristas_str: str):
    """Función principal que procesa la entrada y calcula vertex covers."""
    try:
        # Validar y procesar nodos
        nodos = [n.strip() for n in nodos_str.split(',') if n.strip()]
        if not nodos:
            raise ValueError("Debe proporcionar al menos un nodo.")
        
        # Validar y procesar aristas
        try:
            aristas = eval(aristas_str)
            if not isinstance(aristas, list):
                raise ValueError("Las aristas deben ser una lista de tuplas.")
        except Exception as e:
            raise ValueError(f"Formato de aristas inválido: {e}")

        # Crear grafo
        G = nx.Graph()
        G.add_nodes_from(nodos)
        G.add_edges_from(aristas)

        # Validar que todas las aristas referencien nodos existentes
        for u, v in aristas:
            if u not in nodos or v not in nodos:
                raise ValueError(f"Arista ({u}, {v}) referencia nodos inexistentes.")

        # Calcular vertex covers
        start_bf = time.perf_counter()
        bf_cover = brute_force_vertex_cover(G.copy())
        end_bf = time.perf_counter()
        tiempo_bf = round((end_bf - start_bf) * 1000, 4)

        start_greedy = time.perf_counter()
        greedy_cover = greedy_vertex_cover(G.copy())
        end_greedy = time.perf_counter()
        tiempo_greedy = round((end_greedy - start_greedy) * 1000, 4)

        # Generar gráfico
        imagen_base64 = generar_grafico_vertex_cover(nodos, aristas, bf_cover, greedy_cover)

        return {
            "nodos": nodos,
            "aristas": aristas,
            "fuerza_bruta": {
                "tiempo_ms": tiempo_bf,
                "vertex_cover": list(bf_cover),
                "tamaño": len(bf_cover)
            },
            "greedy": {
                "tiempo_ms": tiempo_greedy,
                "vertex_cover": list(greedy_cover),
                "tamaño": len(greedy_cover)
            },
            "grafico_base64": imagen_base64,
            "total_nodos": len(nodos),
            "total_aristas": len(aristas)
        }

    except Exception as e:
        raise ValueError(f"Error al procesar los datos: {e}")

if __name__ == "__main__":
    try:
        entrada = json.loads(sys.argv[1])
        nodos = entrada.get("nodos", "").strip()
        aristas = entrada.get("aristas", "").strip()

        if not nodos or not aristas:
            raise ValueError("Se requieren tanto nodos como aristas.")

        resultado = calcular_vertex_cover_desde_entrada(nodos, aristas)
        print(json.dumps(resultado))

    except Exception as e:
        print(json.dumps({"error": f"Error inesperado: {str(e)}"}))
        sys.exit(1) 