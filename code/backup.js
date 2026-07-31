const { existsSync, readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');
const { createCipheriv, createDecipheriv, randomBytes, scryptSync } = require('node:crypto');

const DIRECTORIO = join(__dirname, 'database');
const BASE = join(DIRECTORIO, 'centro-adopcion.db');
const RESPALDO = join(DIRECTORIO, 'centro-adopcion.db.enc');
const RESTAURADA = join(DIRECTORIO, 'centro-adopcion.restaurada.db');

function cifrar(datos, clave) {
  const sal = randomBytes(16);
  const vector = randomBytes(12);
  const cifrador = createCipheriv('aes-256-gcm', scryptSync(clave, sal, 32), vector);
  const contenido = Buffer.concat([cifrador.update(datos), cifrador.final()]);
  return Buffer.concat([sal, vector, cifrador.getAuthTag(), contenido]);
}

function descifrar(datos, clave) {
  const sal = datos.subarray(0, 16);
  const vector = datos.subarray(16, 28);
  const etiqueta = datos.subarray(28, 44);
  const contenido = datos.subarray(44);
  const descifrador = createDecipheriv('aes-256-gcm', scryptSync(clave, sal, 32), vector);
  descifrador.setAuthTag(etiqueta);
  return Buffer.concat([descifrador.update(contenido), descifrador.final()]);
}

if (require.main === module) {
  const accion = process.argv[2];
  const clave = process.env.BACKUP_PASSWORD ?? '';
  if (clave.length < 12) throw new Error('Define BACKUP_PASSWORD con al menos 12 caracteres.');

  if (accion === 'crear') {
    if (!existsSync(BASE)) throw new Error('Primero inicia la aplicación para crear la base de datos.');
    writeFileSync(RESPALDO, cifrar(readFileSync(BASE), clave));
    console.log(`OK: respaldo cifrado creado en ${RESPALDO}`);
  } else if (accion === 'restaurar') {
    if (!existsSync(RESPALDO)) throw new Error('No existe un respaldo cifrado para restaurar.');
    writeFileSync(RESTAURADA, descifrar(readFileSync(RESPALDO), clave), { flag: 'wx' });
    console.log(`OK: prueba de restauración creada en ${RESTAURADA}`);
  } else {
    throw new Error('Usa: node code/backup.js crear | restaurar');
  }
}

module.exports = { cifrar, descifrar };
