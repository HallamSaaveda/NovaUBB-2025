import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

export const ejecutarArbolesPython = (data) => {
    return new Promise((resolve, reject) => {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const scriptPath = path.join(__dirname, '..', 'scripts', 'algoritmo_arboles.py');

        const pythonProcess = spawn('python', [scriptPath, JSON.stringify(data)]);

        let stdout = '';
        let stderr = '';

        pythonProcess.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error('Error en Python script:', stderr);
                reject(new Error(`Error en ejecución de Python: ${stderr}`));
                return;
            }

            try {
                const resultado = JSON.parse(stdout);
                if (resultado.error) {
                    reject(new Error(resultado.error));
                } else {
                    resolve(resultado);
                }
            } catch (error) {
                reject(new Error(`Error al parsear resultado: ${error.message}`));
            }
        });

        pythonProcess.on('error', (error) => {
            reject(new Error(`Error al ejecutar Python: ${error.message}`));
        });
    });
}; 