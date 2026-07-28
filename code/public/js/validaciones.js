// Validaciones del centro de adopción.
// Reglas de negocio que exigen las historias US y los casos de prueba CP-01..CP-03.
// Sin dependencias: corren igual en el navegador y en Node (para las pruebas).

// CP-01 · RF-01: el id_perro no puede repetirse.
function idPerroDisponible(perros, idNuevo) {
  return !perros.some((p) => p.id_perro === idNuevo);
}

// CP-02: no se registra una vacuna sin fecha.
function vacunaValida(vacuna) {
  return Boolean(vacuna && vacuna.vacuna && vacuna.fecha);
}

// CP-03: solo se crea solicitud si el perro está 'disponible'.
function puedeSolicitar(perro) {
  return Boolean(perro && perro.estado === 'disponible');
}

if (typeof module !== 'undefined') {
  module.exports = { idPerroDisponible, vacunaValida, puedeSolicitar };
}
