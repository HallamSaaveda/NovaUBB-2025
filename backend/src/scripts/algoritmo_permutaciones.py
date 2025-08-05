import sys
import json
import time
from itertools import permutations as itertools_permutations

MAX_PERMUTACIONES_MOSTRAR = 1000

def generate_permutations(seq: str) -> tuple[float, int, list]:
    seen = set()

    def backtrack(s, path):
        if not s:
            seen.add(path)
            return
        for i in range(len(s)):
            backtrack(s[:i] + s[i+1:], path + s[i])

    start = time.perf_counter()
    backtrack(seq, "")
    end = time.perf_counter()

    tiempo_ms = round((end - start) * 1000, 4)
    perms = list(seen)
    perms.sort()

    return tiempo_ms, len(perms), perms[:MAX_PERMUTACIONES_MOSTRAR]

def generate_itertools_permutations(seq: str) -> tuple[float, int, list]:
    start = time.perf_counter()
    perms = list(itertools_permutations(seq))
    end = time.perf_counter()

    perms_str = [''.join(p) for p in perms]
    perms_str.sort()

    tiempo_ms = round((end - start) * 1000, 4)
    return tiempo_ms, len(perms_str), perms_str[:MAX_PERMUTACIONES_MOSTRAR]

if __name__ == "__main__":
    try:
        entrada = json.loads(sys.argv[1])
        tipo = entrada.get("tipo", "").lower()
        secuencia = entrada.get("secuencia", "").strip().upper()

        tiempo_bt, cantidad_bt, perm_bt = generate_permutations(secuencia)
        tiempo_it, cantidad_it, perm_it = generate_itertools_permutations(secuencia)

        resultado = {
            "tipo": tipo,
            "secuencia": secuencia,
            "backtracking": {
                "tiempo_ms": tiempo_bt,
                "total_permutaciones": cantidad_bt,
                "permutaciones": perm_bt
            },
            "itertools": {
                "tiempo_ms": tiempo_it,
                "total_permutaciones": cantidad_it,
                "permutaciones": perm_it
            }
        }

        print(json.dumps(resultado))

    except Exception as e:
        print(json.dumps({"error": f"Error inesperado: {str(e)}"}))
        sys.exit(1)
