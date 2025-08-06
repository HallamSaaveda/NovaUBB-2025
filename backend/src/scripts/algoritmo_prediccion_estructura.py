import sys
import json
import time
import random

# Reglas de emparejamiento
PAIRS = {
    "ARN": {('A', 'U'): -2, ('U', 'A'): -2, ('G', 'C'): -3, ('C', 'G'): -3, ('G', 'U'): -1, ('U', 'G'): -1},
    "ADN": {('A', 'T'): -2, ('T', 'A'): -2, ('G', 'C'): -3, ('C', 'G'): -3}
}

def is_valid_pair(base1, base2, tipo):
    return (base1, base2) in PAIRS[tipo]

def compute_energy(pairs, sequence, tipo):
    return sum(PAIRS[tipo].get((sequence[i], sequence[j]), 0) for i, j in pairs)

def generate_random_structure(sequence, tipo):
    n = len(sequence)
    pairs = []
    used = set()
    for i in range(n):
        if i in used:
            continue
        for j in range(i + 3, n): 
            if j in used:
                continue
            if is_valid_pair(sequence[i], sequence[j], tipo) and random.random() < 0.2:
                pairs.append((i, j))
                used.add(i)
                used.add(j)
                break
    return pairs

def monte_carlo_prediction(sequence, tipo, iterations=1000):
    best_structure = []
    best_energy = 0
    start = time.perf_counter()

    for _ in range(iterations):
        structure = generate_random_structure(sequence, tipo)
        energy = compute_energy(structure, sequence, tipo)
        if energy < best_energy:
            best_structure = structure
            best_energy = energy

    end = time.perf_counter()
    tiempo_ms = round((end - start) * 1000, 4)
    return best_structure, best_energy, tiempo_ms

def pares_como_bases(pares, secuencia):
    return [[secuencia[i], secuencia[j]] for i, j in pares]

if __name__ == "__main__":
    try:
        entrada = json.loads(sys.argv[1])
        tipo = entrada.get("tipo", "").upper()
        secuencia = entrada.get("secuencia", "").strip().upper()
        iteraciones = int(entrada.get("iteraciones", 1000))

        if tipo not in PAIRS:
            raise ValueError(f"Tipo '{tipo}' no reconocido. Usa 'ADN' o 'ARN'.")

        estructura, energia, tiempo = monte_carlo_prediction(secuencia, tipo, iteraciones)
        pares_bases = pares_como_bases(estructura, secuencia)

        resultado = {
            "tipo": tipo,
            "secuencia": secuencia,
            "estructura": {
                "pares": estructura,
                "pares_bases": pares_bases,
                "energia_total": energia,
                "tiempo_ms": tiempo,
            }
        }

        print(json.dumps(resultado))

    except Exception as e:
        print(json.dumps({"error": f"Error inesperado: {str(e)}"}))
        sys.exit(1)
