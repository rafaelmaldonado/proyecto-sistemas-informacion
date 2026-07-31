const assert = require('node:assert/strict');
const { mkdtempSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { abrirBase, crearPerro, listarPerros } = require('../server');

const directorio = mkdtempSync(join(tmpdir(), 'prototipo-'));
const base = abrirBase(join(directorio, 'prueba.db'));

try {
  crearPerro({ id_perro: 1, nombre: 'Luna', raza: 'Mestiza' }, base);
  assert.equal(listarPerros(base)[0].nombre, 'Luna');
  assert.throws(() => crearPerro({ id_perro: 1, nombre: 'Rocky' }, base), /Ya existe/);
  assert.throws(() => crearPerro({ id_perro: 2, nombre: '' }, base), /Captura/);
  console.log('OK: alta, consulta y rechazo de datos inválidos.');
} finally {
  base.close();
  rmSync(directorio, { recursive: true });
}
