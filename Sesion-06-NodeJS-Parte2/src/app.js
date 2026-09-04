import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { Readable, Transform } from 'node:stream';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export function generarId() {
    return `r-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

export function rutaAbsoluta(rutaRelativa) {
    return join(__dirname, rutaRelativa);
}

export function parsearEnv(contenido) {
    const resultado = {};
    const lineas = contenido.split('\n');

    for (const linea of lineas) {
        const limpia = linea.trim();
        if (!limpia || limpia.startsWith('#')) continue;

        const idx = limpia.indexOf('=');
        if (idx === -1) continue;

        const clave = limpia.slice(0, idx).trim().toUpperCase();
        const valor = limpia.slice(idx + 1).trim();
        resultado[clave] = valor;
    }

    return resultado;
}

export async function filtrarLogs(origen, destino, texto) {
    throw new Error('Not implemented: filtrarLogs');
}

export async function leerLineas(ruta) {
    throw new Error('Not implemented: leerLineas');
}