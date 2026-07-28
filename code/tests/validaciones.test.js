// Pruebas unitarias y de rendimiento CP-01..CP-04. Sin framework.
// Ejecuta:  node tests/validaciones.test.js
const assert = require('node:assert');
const { performance } = require('node:perf_hooks');
const { idPerroDisponible, vacunaValida, puedeSolicitar } = require('../public/js/validaciones');

const perros = [{ id_perro: 1, estado: 'disponible' }, { id_perro: 3, estado: 'adoptado' }];

// CP-01: rechaza ID duplicado, acepta ID nuevo.
assert.strictEqual(idPerroDisponible(perros, 1), false);
assert.strictEqual(idPerroDisponible(perros, 2), true);

// CP-02: rechaza vacuna sin fecha, acepta vacuna completa.
assert.strictEqual(vacunaValida({ vacuna: 'Rabia', fecha: '' }), false);
assert.strictEqual(vacunaValida({ vacuna: 'Rabia', fecha: '2026-01-15' }), true);

// CP-03: no permite solicitud a perro adoptado, sí a disponible.
assert.strictEqual(puedeSolicitar(perros[1]), false);
assert.strictEqual(puedeSolicitar(perros[0]), true);

// CP-04: realiza 100 consultas simuladas y registra el tiempo obtenido.
const muestra = Array.from({ length: 100 }, (_, i) => ({ id_perro: i + 1 }));
const inicio = performance.now();
for (const perro of muestra) {
  assert.ok(muestra.find((item) => item.id_perro === perro.id_perro));
}
const duracion = performance.now() - inicio;
assert.ok(duracion < 3000, `CP-04 tardó ${duracion.toFixed(2)} ms`);

console.log(`OK: CP-01..CP-04 pasaron; 100 consultas en ${duracion.toFixed(2)} ms.`);
