// Pruebas unitarias CP-01..CP-03. Sin framework.
// Ejecuta:  node tests/validaciones.test.js
const assert = require('node:assert');
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

console.log('OK: 6 aserciones pasaron (CP-01, CP-02, CP-03).');
