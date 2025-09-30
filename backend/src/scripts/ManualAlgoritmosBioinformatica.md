# Backend de Algoritmos de Bioinformática

## Arquitectura General del Backend

El backend de NovaUBB utiliza una arquitectura en capas con Express.js que integra algoritmos de bioinformática implementados en Python. La estructura modular organiza las funcionalidades en controladores, servicios, validaciones y rutas específicas para cada algoritmo.

## Algoritmos de Bioinformática Disponibles
### - Permutaciones
**Funcionalidad:** Genera todas las permutaciones posibles de una secuencia utilizando dos enfoques: backtracking personalizado y la librería itertools. Ambos métodos miden tiempo de ejecución y cantidad total de permutaciones.

**Archivo**: ``algoritmo_permutaciones.py``

### - Alineamiento
**Funcionalidad:** Implementa los algoritmos de alineamiento global (Needleman-Wunsch) y local (Smith-Waterman) entre dos secuencias biológicas, devolviendo la matriz de puntuación paso a paso y el alineamiento final.

**Archivo**: ``algoritmo_alineamiento.py``

### - Buscar permutación
**Funcionalidad:** Realiza una búsqueda exhaustiva (brute-force) de una permutación objetivo a partir de una secuencia inicial, retornando el número de pasos y la traza del proceso. Limitado a secuencias de hasta 6 elementos.

**Archivo**: ``algoritmo_busqueda_permutaciones.py``

### - Vertex Cover
**Funcionalidad:** Calcula el conjunto de vértices de cobertura mínima (vertex cover) de un grafo, utilizando tanto una estrategia exacta (fuerza bruta) como una heurística greedy.

**Archivo**: ``algoritmo_vertex_cover.py``

### - Arboles
**Funcionalidad:** Construye árboles jerárquicos a partir de matrices de distancias, generando dos representaciones: ultramétrica (clustering promedio) y aditiva (distancia mínima). Ambas representaciones se entregan como imágenes base64.

**Archivo**: ``algoritmo_arboles.py``

### - Predicción estructura
**Funcionalidad:** Predice pares de bases en estructuras secundarias de secuencias de ADN o ARN usando un enfoque Monte Carlo basado en energía de emparejamiento. Devuelve la estructura con menor energía encontrada y estadísticas del proceso.

**Archivo**: ``algoritmo_predicción_estructura.py``

## Flujo de Procesamiento

El procesamiento de los algoritmos bioinformáticos en NovaUBB sigue una arquitectura modular, donde cada componente del backend cumple una función clara. A continuación, se detalla el flujo general que se aplica a todos los algoritmos:

### 1. Recepción de datos (JSON)
El frontend React envía una solicitud HTTP `POST` al backend con los datos de entrada en formato JSON. Por ejemplo:

```json
{
  "algorithm": "needleman",
  "molecula": "ADN",
  "seq1": "ACGT",
  "seq2": "ACCT",
  "match": 2,
  "mismatch": -1,
  "gap": -2
}
```

### Enrutamiento (routes/)

Cada solicitud es derivada por index.routes.js hacia el archivo de rutas específico del algoritmo, como alignment.routes.js, que define la ruta y el método (POST) asociado.

### Controlador (controllers/)

El controlador correspondiente (por ejemplo alignment.controller.js) recibe la petición y:
- Valida los datos utilizando un esquema Joi (alignment.validation.js).
- En caso de error de validación, utiliza handleErrorClient para retornar un error 400 detallado.
- Si la validación es exitosa, llama al servicio correspondiente (alignment.service.js).

#### Manejo de Respuestas
El backend utiliza handlers estandarizados para mantener consistencia en las respuestas API.

Tipos de respuesta:
- ```handleSuccess()```: Respuestas exitosas con datos
- ```handleErrorClient()```: Errores de validación (400, 401, 403)
- ```handleErrorServer()```: Errores internos del servidor (500)

### Servicio de Ejecución Python (services/)

En esta capa, el servicio:

- Construye la ruta al script Python específico (por ejemplo algoritmo_alineamiento.py).
- Utiliza child_process.spawn para crear un proceso hijo.
- Transforma el objeto JS en una cadena JSON para enviarlo como argumento al script.
- Captura la salida estándar (stdout) del script, la parsea y la retorna al controlador.

```js
const python = spawn('python', [scriptPath, JSON.stringify(data)]);
```

## Dependencias Python

Los algoritmos requieren las siguientes dependencias Python para su funcionamiento: algoritmo_vertex_cover.py:1-8

- **networkx**: Manipulación y análisis de grafos
- **matplotlib**: Generación de visualizaciones
- **numpy**: Operaciones matemáticas y matriciales

- **scipy**: Algoritmos científicos avanzados
