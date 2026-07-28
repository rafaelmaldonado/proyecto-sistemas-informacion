-- Datos de ejemplo para capturas y prueba de rendimiento.
-- Ejecuta después de schema.sql:  sqlite3 centro-adopcion.db < seed.sql

INSERT INTO perro (id_perro, nombre, raza, edad, estado) VALUES
  (1, 'Firulais', 'Criollo', 3, 'disponible'),
  (2, 'Luna', 'Labrador', 2, 'disponible'),
  (3, 'Rocky', 'Pastor', 5, 'adoptado');

INSERT INTO solicitante (id_solicitante, nombre, telefono) VALUES
  (1, 'Ana López', '5551234567'),
  (2, 'Carlos Ruiz', '5559876543');

INSERT INTO vacuna_aplicada (id_vacuna, id_perro, vacuna, fecha) VALUES
  (1, 1, 'Rabia', '2026-01-15'),
  (2, 1, 'Parvovirus', '2026-02-10'),
  (3, 2, 'Rabia', '2026-03-01');

INSERT INTO solicitud_adopcion (id_solicitud, id_perro, id_solicitante, fecha, estado) VALUES
  (1, 1, 1, '2026-04-05', 'pendiente'),
  (2, 3, 2, '2026-03-20', 'aprobada');
