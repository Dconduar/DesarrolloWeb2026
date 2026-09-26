export async function registrarLogAsync(accion, detalle) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  if (!accion) throw new Error('Acción requerida para log');
  
  console.log(`[FIRE-AND-FORGET LOG] ${new Date().toISOString()} | ${accion} | ${detalle}`);
}