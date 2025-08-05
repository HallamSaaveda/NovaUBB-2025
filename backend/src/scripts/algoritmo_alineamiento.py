import sys
import json

def align_sequences(data):
    seq1 = data["seq1"].strip().upper()
    seq2 = data["seq2"].strip().upper()
    match = data["match"]
    mismatch = data["mismatch"]
    gap = data["gap"]
    algorithm = data["algorithm"].strip().lower()

    n = len(seq1) + 1
    m = len(seq2) + 1
    score = [[0 for _ in range(n)] for _ in range(m)]
    trace = [[None for _ in range(n)] for _ in range(m)]
    steps = []

    # Inicialización
    for i in range(m):
        score[i][0] = gap * i if algorithm == "needleman" else 0
    for j in range(n):
        score[0][j] = gap * j if algorithm == "needleman" else 0

    # Llenado de matriz
    for i in range(1, m):
        for j in range(1, n):
            diag = score[i-1][j-1] + (match if seq1[j-1] == seq2[i-1] else mismatch)
            up = score[i-1][j] + gap
            left = score[i][j-1] + gap

            if algorithm == "smith":
                best = max(0, diag, up, left)
            else:
                best = max(diag, up, left)

            score[i][j] = best

            if best == diag:
                trace[i][j] = "diagonal"
            elif best == up:
                trace[i][j] = "up"
            elif best == left:
                trace[i][j] = "left"
            else:
                trace[i][j] = "none"

            # Guardar paso
            steps.append({
                "matrix": [row[:] for row in score],
                "highlight": {"row": i, "col": j},
                "from": trace[i][j]
            })

    # Retroceso
    i, j = (m-1, n-1) if algorithm == "needleman" else max(((i, j) for i in range(m) for j in range(n)), key=lambda x: score[x[0]][x[1]])
    align1 = ""
    align2 = ""

    if algorithm == "needleman":
        while i > 0 or j > 0:
            if trace[i][j] == "diagonal":
                align1 = seq1[j-1] + align1
                align2 = seq2[i-1] + align2
                i -= 1
                j -= 1
            elif trace[i][j] == "left":
                align1 = seq1[j-1] + align1
                align2 = "-" + align2
                j -= 1
            elif trace[i][j] == "up":
                align1 = "-" + align1
                align2 = seq2[i-1] + align2
                i -= 1
            else:
                break
    else:  # smith-waterman
        while (i > 0 or j > 0) and score[i][j] > 0:
            if trace[i][j] == "diagonal":
                align1 = seq1[j-1] + align1
                align2 = seq2[i-1] + align2
                i -= 1
                j -= 1
            elif trace[i][j] == "left":
                align1 = seq1[j-1] + align1
                align2 = "-" + align2
                j -= 1
            elif trace[i][j] == "up":
                align1 = "-" + align1
                align2 = seq2[i-1] + align2
                i -= 1
            else:
                break

    return {
        "matrix_steps": steps,
        "final_alignment": {
            "seq1": align1,
            "seq2": align2
        }
    }

# 🔽 Bloque principal del script
if __name__ == "__main__":
    try:
        entrada = json.loads(sys.argv[1])
        resultado = align_sequences(entrada)
        print(json.dumps(resultado))
    except Exception as e:
        print(json.dumps({"error": f"Error inesperado: {str(e)}"}))
        sys.exit(1)
