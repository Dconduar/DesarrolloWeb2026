const API = '/alumnos';
const API_KEY = 'umg-2026'; // debe coincidir con config.env

const cabeceras = (conJson = true) => ({
    ...(conJson ? { 'Content-Type': 'application/json' } : {}),
    'x-api-key': API_KEY,
});

const tabla = document.querySelector('#tablaAlumnos tbody');
const mensaje = document.querySelector('#mensaje');
const dialogoForm = document.querySelector('#dialogoForm');
const dialogoEliminar = document.querySelector('#dialogoEliminar');
const form = document.querySelector('#formAlumno');
const tituloForm = document.querySelector('#tituloForm');
const nombreEliminar = document.querySelector('#nombreEliminar');

let idEnEdicion = null;
let idAEliminar = null;

async function cargarAlumnos() {
    const res = await fetch(API);
    const alumnos = await res.json();

    tabla.innerHTML = '';

    alumnos.forEach((alumno, indice) => {
        const fila = document.createElement('tr');

        fila.innerHTML = `
            <td>${indice + 1}</td>
            <td>${alumno.nombre}</td>
            <td>${alumno.apellido}</td>
            <td>${alumno.email}</td>
            <td>${alumno.edad ?? ''}</td>
            <td>
                <button type="button" class="btn-editar">Editar</button>
                <button type="button" class="btn-eliminar">Eliminar</button>
            </td>
        `;

        fila.querySelector('.btn-editar').addEventListener('click', () => abrirDialogoEditar(alumno.id));
        fila.querySelector('.btn-eliminar').addEventListener('click', () => eliminarAlumno(alumno.id));

        tabla.appendChild(fila);
    });
}

function abrirDialogoNuevo() {
    form.reset();
    idEnEdicion = null;
    tituloForm.textContent = 'Nuevo alumno';
    dialogoForm.showModal();
}

async function abrirDialogoEditar(id) {
    const res = await fetch(`${API}/${id}`);
    const alumno = await res.json();

    document.querySelector('#nombre').value = alumno.nombre ?? '';
    document.querySelector('#apellido').value = alumno.apellido ?? '';
    document.querySelector('#email').value = alumno.email ?? '';
    document.querySelector('#edad').value = alumno.edad ?? '';

    idEnEdicion = id;
    tituloForm.textContent = 'Editar alumno';
    dialogoForm.showModal();
}

async function guardarAlumno(event) {
    event.preventDefault();

    const datos = {
        nombre: document.querySelector('#nombre').value,
        apellido: document.querySelector('#apellido').value,
        email: document.querySelector('#email').value,
        edad: document.querySelector('#edad').value ? Number(document.querySelector('#edad').value) : undefined,
    };

    try {
        const esEdicion = idEnEdicion !== null;
        const url = esEdicion ? `${API}/${idEnEdicion}` : API;
        const metodo = esEdicion ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method: metodo,
            headers: cabeceras(),
            body: JSON.stringify(datos),
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.error || 'No se pudo guardar el alumno');
        }

        dialogoForm.close();
        await cargarAlumnos();
        mostrarMensaje(esEdicion ? 'Alumno actualizado' : 'Alumno creado', 'ok');
    } catch (err) {
        mostrarMensaje(err.message, 'error');
    }
}

function eliminarAlumno(id) {
    const fila = [...tabla.querySelectorAll('tr')].find((tr) =>
        tr.querySelector('.btn-eliminar')?.onclick !== undefined || true
    );
    idAEliminar = id;

    const nombreFila = document.querySelector(`#tablaAlumnos tbody`).textContent;
    nombreEliminar.textContent = fila ? fila.children[1]?.textContent ?? '' : '';

    dialogoEliminar.showModal();
}

function mostrarMensaje(texto, tipo = 'ok') {
    mensaje.textContent = texto;
    mensaje.className = tipo === 'error' ? 'error' : 'exito';
}

document.addEventListener('DOMContentLoaded', () => {
    cargarAlumnos();

    document.querySelector('#btnNuevo').addEventListener('click', abrirDialogoNuevo);
    form.addEventListener('submit', guardarAlumno);

    document.querySelector('#btnCancelar').addEventListener('click', () => dialogoForm.close());
    document.querySelector('#btnCancelarEliminar').addEventListener('click', () => dialogoEliminar.close());

    document.querySelector('#btnConfirmarEliminar').addEventListener('click', async () => {
        try {
            const res = await fetch(`${API}/${idAEliminar}`, {
                method: 'DELETE',
                headers: cabeceras(false),
            });

            if (!res.ok) {
                throw new Error('No se pudo eliminar el alumno');
            }

            dialogoEliminar.close();
            await cargarAlumnos();
            mostrarMensaje('Alumno eliminado', 'ok');
        } catch (err) {
            mostrarMensaje(err.message, 'error');
        }
    });
});