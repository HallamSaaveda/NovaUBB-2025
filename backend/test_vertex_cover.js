import { ejecutarVertexCoverPython } from './src/services/vertex-cover.service.js';

async function testVertexCover() {
  try {
    console.log('🧪 Probando módulo Vertex Cover...\n');
    
    const testData = {
      nodos: "A, B, C, D, E",
      aristas: "[('A', 'B'), ('A', 'C'), ('B', 'D'), ('C', 'D'), ('C', 'E')]"
    };
    
    console.log('📤 Enviando datos de prueba:');
    console.log(JSON.stringify(testData, null, 2));
    console.log('\n⏳ Ejecutando algoritmo...\n');
    
    const resultado = await ejecutarVertexCoverPython(testData);
    
    console.log('✅ Resultado obtenido:');
    console.log(JSON.stringify(resultado, null, 2));
    
    console.log('\n📊 Resumen:');
    console.log(`- Total nodos: ${resultado.total_nodos}`);
    console.log(`- Total aristas: ${resultado.total_aristas}`);
    console.log(`- Fuerza bruta: ${resultado.fuerza_bruta.tamaño} nodos (${resultado.fuerza_bruta.tiempo_ms}ms)`);
    console.log(`- Greedy: ${resultado.greedy.tamaño} nodos (${resultado.greedy.tiempo_ms}ms)`);
    console.log(`- Gráfico generado: ${resultado.grafico_base64 ? '✅' : '❌'}`);
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
}

testVertexCover(); 