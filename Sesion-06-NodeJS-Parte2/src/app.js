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

export async function leerLineas(ruta) {
    return new Promise((resolve, reject) => {
        const stream = createReadStream(ruta, 'utf-8');
        let datos = '';

        stream.on('data', (chunk) => {
            datos += chunk;
        });

        stream.on('end', () => {
            const lineas = datos
                .split('\n')
                .map((linea) => linea.trim())
                .filter((linea) => linea.length > 0);
            resolve(lineas);
        });

        stream.on('error', (err) => {
            reject(err);
        });
    });
}

export async function filtrarLogs(origen, destino, texto) {
    let contador = 0;
    let buffer = '';

    const filtro = new Transform({
        transform(chunk, encoding, callback) {
            buffer += chunk.toString();
            const partes = buffer.split('\n');
            buffer = partes.pop();

            let salida = '';
            for (const linea of partes) {
                if (linea.includes(texto)) {
                    salida += linea + '\n';
                    contador++;
                }
            }
            callback(null, salida);
        },
        flush(callback) {
            if (buffer.includes(texto)) {
                contador++;
                callback(null, buffer + '\n');
            } else {
                callback();
            }
        },
    });

    await pipeline(
        createReadStream(origen, 'utf-8'),
        filtro,
        createWriteStream(destino)
    );

    return contador;
}