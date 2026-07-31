const formulario = document.querySelector('#formulario');
const mensaje = document.querySelector('#mensaje');
const tabla = document.querySelector('#perros');

async function cargarPerros() {
  const respuesta = await fetch('/api/perros');
  const perros = await respuesta.json();
  tabla.replaceChildren(...perros.map((perro) => {
    const fila = document.createElement('tr');
    for (const valor of [perro.id_perro, perro.nombre, perro.estado]) {
      const celda = document.createElement('td');
      celda.textContent = valor;
      fila.append(celda);
    }
    return fila;
  }));
  mensaje.textContent = perros.length ? '' : 'No hay expedientes registrados.';
}

if (formulario) {
  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    mensaje.textContent = 'Guardando…';
    try {
      const respuesta = await fetch('/api/perros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(formulario))),
      });
      const resultado = await respuesta.json();
      mensaje.textContent = respuesta.ok ? `Se guardó a ${resultado.nombre}.` : resultado.error;
      if (respuesta.ok) formulario.reset();
    } catch {
      mensaje.textContent = 'No fue posible conectar con el servidor.';
    }
  });
}

if (tabla) {
  cargarPerros().catch(() => { mensaje.textContent = 'No fue posible consultar la base de datos.'; });
}
