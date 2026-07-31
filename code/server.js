const { readFileSync } = require('node:fs');
const { createServer } = require('node:http');
const { join } = require('node:path');

const [versionMayor, versionMenor] = process.versions.node.split('.').map(Number);
if (versionMayor < 22 || (versionMayor === 22 && versionMenor < 5)) {
  throw new Error('Este prototipo requiere Node 22.5 o posterior; instala Node 24 LTS.');
}

const { DatabaseSync } = require('node:sqlite');

const BASE_DIR = __dirname;
const DB_PATH = join(BASE_DIR, 'database', 'centro-adopcion.db');
const PUBLIC_DIR = join(BASE_DIR, 'public');

function abrirBase(ruta = DB_PATH) {
  const base = new DatabaseSync(ruta);
  base.exec('PRAGMA foreign_keys = ON');
  base.exec(readFileSync(join(BASE_DIR, 'database', 'schema.sql'), 'utf8'));
  return base;
}

function listarPerros(base) {
  return base.prepare(
    'SELECT id_perro, nombre, estado FROM perro ORDER BY id_perro',
  ).all();
}

function crearPerro(datos, base) {
  const id = Number(datos.id_perro);
  const nombre = String(datos.nombre ?? '').trim();
  const raza = String(datos.raza ?? '').trim() || null;
  if (!Number.isInteger(id) || id <= 0 || !nombre) {
    throw new Error('Captura un ID positivo y un nombre.');
  }

  try {
    base.prepare(
      'INSERT INTO perro (id_perro, nombre, raza) VALUES (?, ?, ?)',
    ).run(id, nombre, raza);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed: perro.id_perro')) {
      throw new Error('Ya existe un perro con ese ID.');
    }
    throw error;
  }
  return { id_perro: id, nombre };
}

function responderJson(respuesta, estado, contenido) {
  const cuerpo = JSON.stringify(contenido);
  respuesta.writeHead(estado, { 'Content-Type': 'application/json; charset=utf-8' });
  respuesta.end(cuerpo);
}

function crearAplicacion(base = abrirBase()) {
  const archivos = {
    '/': ['index.html', 'text/html; charset=utf-8'],
    '/index.html': ['index.html', 'text/html; charset=utf-8'],
    '/registrar.html': ['registrar.html', 'text/html; charset=utf-8'],
    '/perros.html': ['perros.html', 'text/html; charset=utf-8'],
    '/app.js': ['app.js', 'text/javascript; charset=utf-8'],
    '/styles.css': ['styles.css', 'text/css; charset=utf-8'],
  };

  return createServer((peticion, respuesta) => {
    if (peticion.method === 'GET' && peticion.url === '/api/perros') {
      return responderJson(respuesta, 200, listarPerros(base));
    }
    if (peticion.method === 'GET' && archivos[peticion.url]) {
      const [archivo, tipo] = archivos[peticion.url];
      respuesta.writeHead(200, { 'Content-Type': tipo });
      return respuesta.end(readFileSync(join(PUBLIC_DIR, archivo)));
    }
    if (peticion.method !== 'POST' || peticion.url !== '/api/perros') {
      respuesta.writeHead(404);
      return respuesta.end();
    }

    const partes = [];
    let longitud = 0;
    peticion.on('data', (parte) => {
      longitud += parte.length;
      if (longitud <= 10_000) partes.push(parte);
    });
    peticion.on('end', () => {
      try {
        if (!longitud || longitud > 10_000) throw new Error('Solicitud inválida.');
        const datos = JSON.parse(Buffer.concat(partes));
        if (!datos || Array.isArray(datos) || typeof datos !== 'object') {
          throw new Error('El contenido debe ser un objeto JSON.');
        }
        responderJson(respuesta, 201, crearPerro(datos, base));
      } catch (error) {
        responderJson(respuesta, 400, { error: error.message });
      }
    });
  });
}

if (require.main === module) {
  crearAplicacion().listen(8000, 'localhost', () => {
    console.log('Prototipo disponible en http://localhost:8000');
  });
}

module.exports = { abrirBase, listarPerros, crearPerro, crearAplicacion };
