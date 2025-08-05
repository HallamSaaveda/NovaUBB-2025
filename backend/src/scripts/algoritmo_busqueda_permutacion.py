from itertools import permutations

def buscar_secuencia_objetivo(inicial, objetivo):
    if len(inicial) > 6 or len(objetivo) > 6:
        return {"error": "Las listas no pueden tener más de 6 elementos"}

    permutaciones = list(permutations(inicial))
    pasos = 0
    log_pasos = []

    for perm in permutaciones:
        pasos += 1
        log_pasos.append(f"Paso {pasos}: {list(perm)}")
        if list(perm) == objetivo:
            return {"pasos": pasos, "permutacion": list(perm), "log_pasos": log_pasos}

    return {"pasos": pasos, "permutacion": None, "log_pasos": log_pasos}

if __name__ == "__main__":
    import sys
    import json
    try:
        entrada = json.loads(sys.argv[1])
        inicial = entrada.get("inicial", [])
        objetivo = entrada.get("objetivo", [])
        resultado = buscar_secuencia_objetivo(inicial, objetivo)
        print(json.dumps(resultado))
    except Exception as e:
        print(json.dumps({"error": f"Error inesperado: {str(e)}"}))
        sys.exit(1)
