// Código simplificado de la aplicación de Diario de Hábitos

// Constantes para almacenamiento local
const STORAGE_KEYS = {
    REGISTROS: 'diario_registros',
    OBJETIVOS: 'diario_objetivos'
};

// Cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Identificar en qué página estamos por el nombre del archivo o la ruta
    const rutaActual = window.location.pathname;
    const esRegistroPagina = rutaActual.includes('index.html') || rutaActual.endsWith('/') || rutaActual.endsWith('\\');
    const esObjetivosPagina = rutaActual.includes('objetivos.html');
    
    console.log('Ruta actual:', rutaActual);
    console.log('Es página de registro:', esRegistroPagina);
    console.log('Es página de objetivos:', esObjetivosPagina);
    
    // Inicializar la página correspondiente
    if (esRegistroPagina) {
        inicializarPaginaRegistro();
    } else if (esObjetivosPagina) {
        inicializarPaginaObjetivos();
    }
});

//----------------------------------------
// Funciones de utilidad general
//----------------------------------------

// Mostrar notificación
function mostrarNotificacion(mensaje) {
    // Eliminar notificaciones anteriores
    const notificacionesAnteriores = document.querySelectorAll('.notificacion');
    notificacionesAnteriores.forEach(n => n.remove());
    
    // Crear notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    // Mostrar y ocultar con animación
    setTimeout(() => notificacion.classList.add('mostrar'), 10);
    setTimeout(() => {
        notificacion.classList.remove('mostrar');
        setTimeout(() => notificacion.remove(), 300);
    }, 3000);
}

// Formatear fecha para mostrar
function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
    });
}

// Obtener fecha de hoy en formato YYYY-MM-DD
function obtenerFechaHoy() {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
}

// Funciones para la página de Registro

function inicializarPaginaRegistro() {
    console.log('Inicializando página de registro...');
    
    // Referencias a elementos del DOM
    const formularioRegistro = document.getElementById('registro-form');
    const fechaInput = document.getElementById('fecha');
    const registrosContainer = document.getElementById('registros-container');
    
    if (!formularioRegistro) {
        console.error('No se encontró el formulario de registro');
        return;
    }
    
    console.log('Elementos encontrados correctamente');
    
    // Establecer la feha de hoy
    fechaInput.value = obtenerFechaHoy();
    
    // Cargar los registros existentes
    cargarRegistrosRecientes();
    
    // Escuchar el envío del formulario
    formularioRegistro.addEventListener('submit', (e) => {
        e.preventDefault();
        guardarRegistro();
    });
    
    console.log('Inicialización completada');
}

// Guardar un nuevo registr
function guardarRegistro() {
    // Obtener valores del foremulario
    const fecha = document.getElementById('fecha').value;
    const animo = document.getElementById('animo').value;
    const notas = document.getElementById('notas').value;
    
    // Obtener hábitos marcados
    const habitosSeleccionados = [];
    const habitosChecked = document.querySelectorAll('#habitos-container input[type="checkbox"]:checked');
    habitosChecked.forEach(cb => {
        habitosSeleccionados.push({
            id: cb.value,
            nombre: cb.nextElementSibling.textContent
        });
    });
    
    // Crear objeto de registro
    const registro = {
        id: Date.now().toString(),
        fecha,
        animo,
        notas,
        habitos: habitosSeleccionados,
        timestamp: new Date().toISOString()
    };
    
    // Guardar en localStorage
    const registros = obtenerRegistros();
    
    // Verificar si ya existe un registro para esta fecha
    const indiceExistente = registros.findIndex(r => r.fecha === fecha);
    if (indiceExistente >= 0) {
        // Actualizar registro existente
        registros[indiceExistente] = registro;
    } else {
        // Agregar nuevo registro
        registros.push(registro);
    }
    
    // Guardar y actualizar interfaz
    localStorage.setItem(STORAGE_KEYS.REGISTROS, JSON.stringify(registros));
    cargarRegistrosRecientes();
    mostrarNotificacion('Registro guardado correctamente');
    
    // Limpiar el formulario
    document.getElementById('notas').value = '';
    const todosCheckboxes = document.querySelectorAll('#habitos-container input[type="checkbox"]');
    todosCheckboxes.forEach(cb => cb.checked = false);
}

// Obtener registros del localStorage
function obtenerRegistros() {
    const registrosGuardados = localStorage.getItem(STORAGE_KEYS.REGISTROS);
    return registrosGuardados ? JSON.parse(registrosGuardados) : [];
}

// Cargar y mostrar registros recientes
function cargarRegistrosRecientes() {
    const registrosContainer = document.getElementById('registros-container');
    if (!registrosContainer) {
        console.error('No se encontró el contenedor de registros');
        return;
    }
    
    // Obtener registros y ordenarlos por fecha (más reciente primero)
    const registrosGuardados = obtenerRegistros();
    console.log('Registros guardados:', registrosGuardados);
    
    const registros = registrosGuardados
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 5); // Mostrar solo los 5 más recientes
    
    // Limpiar contenedor
    registrosContainer.innerHTML = '';
    
    // Mostrar mensaje si no hay registros
    if (registros.length === 0) {
        registrosContainer.innerHTML = '<p class="empty-message">No hay registros recientes.</p>';
        return;
    }
    
    // Crear elementos para cada registrro
    registros.forEach(registro => {
        const registroItem = document.createElement('div');
        registroItem.className = 'registro-item';
        
        const fecha = document.createElement('div');
        fecha.className = 'registro-fecha';
        fecha.textContent = formatearFecha(registro.fecha);
        
        const habitosDiv = document.createElement('div');
        habitosDiv.className = 'habitos-completados';
        
        if (registro.habitos && registro.habitos.length > 0) {
            registro.habitos.forEach(habito => {
                const habitoTag = document.createElement('span');
                habitoTag.className = 'habito-tag';
                habitoTag.textContent = habito.nombre;
                habitosDiv.appendChild(habitoTag);
            });
        } else {
            habitosDiv.textContent = 'No se completaron hábitos';
        }
        
        const animoDiv = document.createElement('div');
        animoDiv.textContent = `Estado: ${registro.animo}`;
        
        const notasDiv = document.createElement('div');
        notasDiv.className = 'registro-notas';
        if (registro.notas) {
            notasDiv.textContent = registro.notas;
        }
        
        registroItem.appendChild(fecha);
        registroItem.appendChild(habitosDiv);
        registroItem.appendChild(animoDiv);
        if (registro.notas) registroItem.appendChild(notasDiv);
        
        registrosContainer.appendChild(registroItem);
    });
}


// Funciones para la página de Objettivos

function inicializarPaginaObjetivos() {
    // Referencias a elementos del DOM
    const objetivoForm = document.getElementById('objetivo-form');
    const objetivosLista = document.getElementById('objetivos-lista');
    
    // Cargar objetivos existentess
    cargarObjetivos();
    
    // Escuchar el envío del formulario
    if (objetivoForm) {
        objetivoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            guardarObjetivo();
        });
    }
}

// Guardar un nuevo objetivo
function guardarObjetivo() {
    // Obtener valores del formulario
    const nombreInput = document.getElementById('nombre-objetivo');
    const frecuenciaSelect = document.getElementById('frecuencia');
    
    const nombre = nombreInput.value.trim();
    const frecuencia = frecuenciaSelect.value;
    
    if (!nombre) {
        mostrarNotificacion('Debes ingresar un nombre para el objetivo');
        return;
    }
    
    // Crear objeto de objetivo
    const objetivo = {
        id: Date.now().toString(),
        nombre,
        frecuencia,
        fechaCreacion: new Date().toISOString()
    };
    
    // Guardar en localStorage
    const objetivos = obtenerObjetivos();
    objetivos.push(objetivo);
    localStorage.setItem(STORAGE_KEYS.OBJETIVOS, JSON.stringify(objetivos));
    
    // Actualizar interfaz
    cargarObjetivos();
    mostrarNotificacion('Objetivo guardado correctamente');
    
    // Limpiar formulario
    nombreInput.value = '';
}

// Eliminar un objetivo
function eliminarObjetivo(id) {
    if (!confirm('¿Estás seguro de eliminar este objetivo?')) return;
    
    // Obtener objetivos y filtrar el eliminado
    const objetivos = obtenerObjetivos();
    const objetivosFiltrados = objetivos.filter(obj => obj.id !== id);
    
    // Guardar y actualizar interfaz
    localStorage.setItem(STORAGE_KEYS.OBJETIVOS, JSON.stringify(objetivosFiltrados));
    cargarObjetivos();
    mostrarNotificacion('Objetivo eliminado correctamente');
}

// Obtener objetivos del localStorage
function obtenerObjetivos() {
    const objetivosGuardados = localStorage.getItem(STORAGE_KEYS.OBJETIVOS);
    return objetivosGuardados ? JSON.parse(objetivosGuardados) : [];
}

// Cargar y mostrar objetivos
function cargarObjetivos() {
    const objetivosLista = document.getElementById('objetivos-lista');
    if (!objetivosLista) return;
    
    // Obtener objetivos
    const objetivos = obtenerObjetivos();
    
    // Limpiar contefnedor
    objetivosLista.innerHTML = '';
    
    // Mostrar mensaje si no hay objetivos
    if (objetivos.length === 0) {
        objetivosLista.innerHTML = '<li class="empty-message">No hay objetivos definidos.</li>';
        return;
    }
    
    // Crear elementos para cada objeetivo
    objetivos.forEach(objetivo => {
        const li = document.createElement('li');
        li.className = 'objetivo-item';
        
        const infoDiv = document.createElement('div');
        
        const nombre = document.createElement('div');
        nombre.className = 'objetivo-nombre';
        nombre.textContent = objetivo.nombre;
        
        const frecuencia = document.createElement('div');
        frecuencia.className = 'objetivo-frecuencia';
        frecuencia.textContent = `Frecuencia: ${objetivo.frecuencia}`;
        
        infoDiv.appendChild(nombre);
        infoDiv.appendChild(frecuencia);
        
        const eliminarBtn = document.createElement('button');
        eliminarBtn.className = 'objetivo-eliminar';
        eliminarBtn.textContent = '🗑️';
        eliminarBtn.title = 'Eliminar objetivo';
        eliminarBtn.onclick = () => eliminarObjetivo(objetivo.id);
        
        li.appendChild(infoDiv);
        li.appendChild(eliminarBtn);
        
        objetivosLista.appendChild(li);
    });
}
