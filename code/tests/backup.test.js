const assert = require('node:assert/strict');
const { cifrar, descifrar } = require('../backup');

const original = Buffer.from('base SQLite de prueba');
const respaldo = cifrar(original, 'clave-de-prueba-2026');

assert.notDeepEqual(respaldo, original);
assert.deepEqual(descifrar(respaldo, 'clave-de-prueba-2026'), original);
assert.throws(() => descifrar(respaldo, 'clave-incorrecta-2026'));

console.log('OK: el respaldo se cifra, se restaura y rechaza una clave incorrecta.');
