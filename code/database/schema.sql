-- Centro de Adopción de Perros — modelo relacional normalizado (3FN)
-- Coincide con el diagrama ER de la lección 4. SQLite.
-- Ejecuta:  sqlite3 centro-adopcion.db < schema.sql

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS perro (
  id_perro INTEGER PRIMARY KEY,
  nombre   TEXT NOT NULL,
  raza     TEXT,
  edad     INTEGER CHECK (edad >= 0),
  estado   TEXT NOT NULL DEFAULT 'disponible'
           CHECK (estado IN ('disponible','en_proceso','adoptado'))
);

CREATE TABLE IF NOT EXISTS solicitante (
  id_solicitante INTEGER PRIMARY KEY,
  nombre         TEXT NOT NULL,
  telefono       TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS vacuna_aplicada (
  id_vacuna INTEGER PRIMARY KEY,
  id_perro  INTEGER NOT NULL,
  vacuna    TEXT NOT NULL,
  fecha     DATE NOT NULL,
  FOREIGN KEY (id_perro) REFERENCES perro(id_perro)
);

CREATE TABLE IF NOT EXISTS solicitud_adopcion (
  id_solicitud   INTEGER PRIMARY KEY,
  id_perro       INTEGER NOT NULL,
  id_solicitante INTEGER NOT NULL,
  fecha          DATE NOT NULL,
  estado         TEXT NOT NULL DEFAULT 'pendiente'
                 CHECK (estado IN ('pendiente','aprobada','rechazada')),
  FOREIGN KEY (id_perro) REFERENCES perro(id_perro),
  FOREIGN KEY (id_solicitante) REFERENCES solicitante(id_solicitante)
);
