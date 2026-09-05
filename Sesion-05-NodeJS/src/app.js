import http from 'node:http';
import { EventEmitter } from 'node:events';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs/promises';

export function generarId() {
    return `m-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function leerBody(req) {
    return new Promise((resolve, reject) => {
        let data = '';
        req.on('data', (chunk) => (data += chunk));
        req.on('end', () => resolve(data));
        req.on('error', reject);
    });
}

export function parsearArgumentos(argv) {
    const args = argv.slice(2);
    let nombre = 'invitado';
    let puerto = 3000;

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--nombre' && args[i + 1] !== undefined) {
            nombre = args[i + 1];
            i++;
        } else if (args[i] === '--puerto' && args[i + 1] !== undefined) {
            puerto = Number(args[i + 1]);
            i++;
        }
    }

    return { nombre, puerto };
}

export function obtenerConfig(env) {
    return {
        puerto: env.PORT ? Number(env.PORT) : 3000,
        nombreApp: env.NOMBRE_APP || 'mensajes-api',
        archivoDatos: env.ARCHIVO_DATOS || 'data/mensajes.json',
    };
}

export function infoSistema() {
    return {
        plataforma: os.platform(),
        nucleos: os.cpus().length,
        memoriaLibreMB: Math.round(os.freemem() / (1024 * 1024)),
        hostname: os.hostname(),
    };
}

export function crearLogger() {
    const emisor = new EventEmitter();

    return {
        registrar(mensaje) {
            emisor.emit('registro', `[${new Date().toISOString()}] ${mensaje}`);
        },
        onRegistro(fn) {
            emisor.on('registro', fn);
        },
    };
}

export async function leerMensajes(archivoDatos) {
    try {
        const contenido = await fs.readFile(archivoDatos, 'utf-8');
        const datos = JSON.parse(contenido);
        return Array.isArray(datos) ? datos : [];
    } catch (err) {
        return [];
    }
}

export async function agregarMensaje(archivoDatos, texto) {
    const limpio = (texto || '').trim();
    if (!limpio) return null;

    const mensajes = await leerMensajes(archivoDatos);
    const nuevo = {
        id: generarId(),
        texto: limpio,
        fecha: new Date().toISOString(),
    };
    mensajes.push(nuevo);

    await fs.mkdir(path.dirname(archivoDatos), { recursive: true });
    await fs.writeFile(archivoDatos, JSON.stringify(mensajes, null, 2), 'utf-8');

    return nuevo;
}

export function crearServidor(config = {}) {
    throw new Error('Not implemented: crearServidor');
}

export function iniciarServidor(config = {}) {
    throw new Error('Not implemented: iniciarServidor');
}