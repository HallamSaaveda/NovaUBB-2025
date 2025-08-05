import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ejecutarVertexCoverPython = (data) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(__dirname, '../scripts/algoritmo_vertex_cover.py');
    const python = spawn('python', [scriptPath, JSON.stringify(data)]);

    let output = '';
    let errorOutput = '';

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    python.on('close', (code) => {
      try {
        const parsed = JSON.parse(output);
        if (parsed.error) {
          reject(parsed.error);
        } else {
          resolve(parsed);
        }
      } catch (err) {
        reject(`Salida inválida del script Python: ${errorOutput || err.message}`);
      }
    });

    python.on('error', (err) => {
      reject(`Error al ejecutar el script Python: ${err.message}`);
    });
  });
}; 