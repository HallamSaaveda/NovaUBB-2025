import sys
import json
import numpy as np
import networkx as nx
import matplotlib.pyplot as plt
from scipy.cluster.hierarchy import linkage
import base64
from io import BytesIO

def parse_matrix(text: str) -> np.ndarray:
    """
    Convierte texto crudo en matriz NumPy.
    Ejemplo de entrada: [[0, 2, 4], [2, 0, 5], [4, 5, 0]]
    """
    try:
        matrix = eval(text)
        matrix = np.array(matrix)

        # Validaciones
        if not isinstance(matrix, np.ndarray):
            raise ValueError("No es una matriz válida.")
        if matrix.shape[0] != matrix.shape[1]:
            raise ValueError("La matriz debe ser cuadrada.")
        if not np.allclose(matrix, matrix.T):
            raise ValueError("La matriz debe ser simétrica.")
        if not np.all(np.diag(matrix) == 0):
            raise ValueError("La diagonal principal debe contener solo ceros.")

        return matrix
    except Exception as e:
        raise ValueError(f"Error al procesar la matriz: {e}")

def generar_arbol(matrix_text: str, metodo: str = 'average'):
    """
    Genera un árbol jerárquico (ultramétrico o aditivo) a partir de una matriz de distancias.
    método: 'average' → ultramétrico, 'single' → aditivo
    """
    matrix = parse_matrix(matrix_text)
    triu = matrix[np.triu_indices(len(matrix), 1)]
    linked = linkage(triu, method=metodo)

    # Crear grafo a partir de linkage
    G = nx.Graph()
    n = len(matrix)
    for i, (a, b, dist, _) in enumerate(linked):
        node_id = n + i
        G.add_edge(int(a), node_id, weight=round(dist, 2))
        G.add_edge(int(b), node_id, weight=round(dist, 2))

    pos = nx.spring_layout(G, seed=42)
    labels = nx.get_edge_attributes(G, 'weight')

    fig, ax = plt.subplots(figsize=(10, 8))
    nx.draw(G, pos, with_labels=True, node_color='lightblue', node_size=700, ax=ax)
    nx.draw_networkx_edge_labels(G, pos, edge_labels=labels, font_size=8, ax=ax)
    ax.set_title(f"Árbol {'Ultramétrico' if metodo == 'average' else 'Aditivo'}")
    
    return fig

def generar_arboles_desde_entrada(matriz_str: str):
    """Función principal que procesa la entrada y genera ambos tipos de árboles."""
    try:
        # Validar matriz
        matrix = parse_matrix(matriz_str)
        
        # Generar árbol ultramétrico
        fig_ultrametrico = generar_arbol(matriz_str, metodo='average')
        
        # Generar árbol aditivo
        fig_aditivo = generar_arbol(matriz_str, metodo='single')
        
        # Convertir árbol ultramétrico a base64
        buffer_ultra = BytesIO()
        fig_ultrametrico.savefig(buffer_ultra, format='png', bbox_inches='tight', dpi=150)
        buffer_ultra.seek(0)
        imagen_ultra_base64 = base64.b64encode(buffer_ultra.getvalue()).decode('utf-8')
        plt.close(fig_ultrametrico)
        
        # Convertir árbol aditivo a base64
        buffer_adi = BytesIO()
        fig_aditivo.savefig(buffer_adi, format='png', bbox_inches='tight', dpi=150)
        buffer_adi.seek(0)
        imagen_adi_base64 = base64.b64encode(buffer_adi.getvalue()).decode('utf-8')
        plt.close(fig_aditivo)
        
        # Calcular estadísticas
        n = len(matrix)
        total_distancias = n * (n - 1) // 2
        
        return {
            "matriz_original": matrix.tolist(),
            "tamaño_matriz": n,
            "total_distancias": total_distancias,
            "arbol_ultrametrico": {
                "metodo": "average",
                "descripcion": "Clustering jerárquico usando promedio de distancias",
                "imagen_base64": imagen_ultra_base64
            },
            "arbol_aditivo": {
                "metodo": "single",
                "descripcion": "Clustering jerárquico usando distancia mínima",
                "imagen_base64": imagen_adi_base64
            }
        }

    except Exception as e:
        raise ValueError(f"Error al procesar los datos: {e}")

if __name__ == "__main__":
    try:
        entrada = json.loads(sys.argv[1])
        matriz = entrada.get("matriz", "").strip()

        if not matriz:
            raise ValueError("Se requiere la matriz de distancias.")

        resultado = generar_arboles_desde_entrada(matriz)
        print(json.dumps(resultado))

    except Exception as e:
        print(json.dumps({"error": f"Error inesperado: {str(e)}"}))
        sys.exit(1) 