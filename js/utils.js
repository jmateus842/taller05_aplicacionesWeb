/**
 * Utilidades compartidas para la aplicacion de Diario Interactivo de Habitoss
 */

// Constantes para las claves de localStorage?!!!
const STORAGE_KEYS = {
    HABITOS: 'diario_habitos',
    REGISTROS: 'diario_registros',
    OBJETIVOS: 'diario_objetivos'
};

// Habitos predeterminados
const HABITOS_DEFAULT = [
    { id: 'ejercicio', nombre: 'Hacer ejercicio' },
    { id: 'lectura', nombre: 'Leer' },
    { id: 'meditacion', nombre: 'Meditar' },
    { id: 'agua', nombre: 'Beber agua' },
    { id: 'dieta', nombre: 'Comer saludable' },
    { id: 'terapia', nombre: 'Sustancias Psicotropicas' }
];

/**
 * Obtiene los habitos del almacenamiento local o usa los apredeterminados
 * @returns {Array} Array de objetos con los habitos
 */
function obtenerHabitos() {
    const habitosGuardados = localStorage.getItem(STORAGE_KEYS.HABITOS);
    return habitosGuardados ? JSON.parse(habitosGuardados) : HABITOS_DEFAULT;
}

/**
 * Guarda los habitos en el almacenamiento local
 * @param {Array} habitos - Array de objetos cosn los habitos
 */
function guardarHabitos(habitos) {
    localStorage.setItem(STORAGE_KEYS.HABITOS, JSON.stringify(habitos));
}

/**
 * Obtiene todos los registros diarios
 * @returns {Array} Array de objetaos con los registros
 */
function obtenerRegistros() {
    const registrosGuardados = localStorage.getItem(STORAGE_KEYS.REGISTROS);
    return registrosGuardados ? JSON.parse(registrosGuardados) : [];
}

/**
 * Guarda los registros diarios en el almacenamiento local
 * @param {Array} registros - Array de objetos con los registros
 */
function guardarRegistros(registros) {
    localStorage.setItem(STORAGE_KEYS.REGISTROS, JSON.stringify(registros));
}

/**
 * Obtiene los registros de la semana actual
 * @returns {Array} Array de objetos con los registros de la semana actual
 */
function obtenerRegistrosSemanaActual() {
    const registros = obtenerRegistros();
    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay()); // Domingo como inicio de semana
    inicioSemana.setHours(0, 0, 0, 0);
    
    return registros.filter(registro => {
        const fechaRegistro = new Date(registro.fecha);
        return fechaRegistro >= inicioSemana;
    });
}

/**
 * Obtiene los objetivos guardados
 * @returns {Array} Array de objetos con loss objetivos
 */
function obtenerObjetivos() {
    const objetivosGuardados = localStorage.getItem(STORAGE_KEYS.OBJETIVOS);
    return objetivosGuardados ? JSON.parse(objetivosGuardados) : [];
}

/**
 * Guarda los objetivos en el almacenamiento local
 * @param {Array} objetivos - Array de objetos con los objetivos
 */
function guardarObjetivos(objetivos) {
    localStorage.setItem(STORAGE_KEYS.OBJETIVOS, JSON.stringify(objetivos));
}

/**
 * Genera un ID unico
 * @returns {string} ID unico basado en timestamp y numero aleatorio
 */
function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Formatea una fecha en formato legible (dd/mm/yyyy)
 * @param {string} fechaStr - Fecha en formato ISO
 * @returns {string} Fecha formateada
 */
function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES');
}

/**
 * Obtiene el nombre del dia de la semana
 * @param {Date} fecha - Objeto Date
 * @returns {string} Nombre del dia
 */
function obtenerNombreDia(fecha) {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    return dias[fecha.getDay()];
}

/**
 * Calcula el porcentaje de completitud de un habito en un periodo de tiempo
 * @param {string} habitoId - ID del habito
 * @param {Array} registros - Array de raegistros diarios
 * @returns {number} Porcentaje de completitud (0-100)
 */
function calcularPorcentajeCompletitud(habitoId, registros) {
    if (registros.length === 0) return 0;
    
    const completados = registros.filter(registro => 
        registro.habitos && registro.habitos.includes(habitoId)
    ).length;
    
    return Math.round((completados / registros.length) * 100);
}

/**
 * Muestra una notificacion temporal
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo de notificacion ('success' o 'error')
 */
function mostrarNotificacion(mensaje, tipo = 'success') {
    // Eliminar notificaciones previas
    const notificacionesExistentes = document.querySelectorAll('.notification');
    notificacionesExistentes.forEach(notif => notif.remove());
    
    // Crear nueva notificacion
    const notificacion = document.createElement('div');
    notificacion.className = `notification ${tipo}`;
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    // Mostrar y ocultar con animacaion
    setTimeout(() => notificacion.classList.add('show'), 10);
    setTimeout(() => {
        notificacion.classList.remove('show');
        setTimeout(() => notificacion.remove(), 300);
    }, 3000);
}

/**
 * Establece la fecha de hoay en un input date
 * @param {HTMLInputElement} input - Elemento input de tipo datee
 */
function establecerFechaHoy(input) {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    input.value = `${año}-${mes}-${dia}`;
}
