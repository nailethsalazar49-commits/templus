// ====== DATOS DE INCIDENCIAS ======
const incidencias = {
    "2025-09-02": "falta",
    "2025-09-05": "tarde",
    "2025-09-09": "sancion",
    "2025-09-12": "falta",
    "2025-09-15": "tarde",
    "2025-09-20": "sancion"
};


const datosEstudiante = {
    documento: datosEstudianteFromPHP.DOCUMENTO,
    numeroMatricula: datosEstudianteFromPHP.NUMERO_MATRICULA,
    idAcudiente: datosEstudianteFromPHP.D_ACUDIENTE,
    idGrupo: datosEstudianteFromPHP.ID_GRUPO,
    idEstado: datosEstudianteFromPHP.ID_ESTADO
};

// ====== VERIFICAR DATOS NULL AL CARGAR ======
function verificarDatosIncompletos() {
    const datosIncompletos = Object.keys(datosEstudiante).filter(key => 
        key !== 'documento' && (datosEstudiante[key] === null || datosEstudiante[key] === 'NULL' || datosEstudiante[key] === '')
    );

    if (datosIncompletos.length > 0) {
        console.log('⚠️ Datos incompletos encontrados:', datosIncompletos);
        mostrarModalDatos();
        // Bloquear scroll del body
        document.body.style.overflow = 'hidden';
        return true;
    }
    console.log('✅ Todos los datos están completos');
    return false;
}

// ====== MOSTRAR MODAL ======
function mostrarModalDatos() {
    const modal = document.getElementById('modalDatos');
    modal.classList.add('active');
}

// ====== OCULTAR MODAL (Solo después de guardar exitosamente) ======
function ocultarModalDatos() {
    const modal = document.getElementById('modalDatos');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ====== VALIDAR CAMPO INDIVIDUAL ======
function validarCampo(campo) {
    const valor = campo.value.trim();
    const nombreCampo = campo.name;
    const errorElement = document.getElementById(`error${nombreCampo.charAt(0).toUpperCase() + nombreCampo.slice(1)}`);

    // Limpiar error previo
    campo.classList.remove('error');
    if (errorElement) {
        errorElement.classList.remove('show');
        errorElement.textContent = '';
    }

    // Validaciones específicas
    if (!valor) {
        mostrarError(campo, errorElement, 'Este campo es obligatorio');
        return false;
    }

    // Validación de matrícula
    if (nombreCampo === 'numeroMatricula') {
        if (valor.length < 5) {
            mostrarError(campo, errorElement, 'El número de matrícula debe tener al menos 5 caracteres');
            return false;
        }
    }

    // Validación de documento del acudiente
    if (nombreCampo === 'idAcudiente') {
        if (!/^\d+$/.test(valor)) {
            mostrarError(campo, errorElement, 'El documento debe contener solo números');
            return false;
        }
        if (valor.length < 6 || valor.length > 12) {
            mostrarError(campo, errorElement, 'El documento debe tener entre 6 y 12 dígitos');
            return false;
        }
    }

    // Validación de selects
    if (campo.tagName === 'SELECT' && valor === '') {
        mostrarError(campo, errorElement, 'Debes seleccionar una opción');
        return false;
    }

    return true;
}

// ====== MOSTRAR ERROR ======
function mostrarError(campo, errorElement, mensaje) {
    campo.classList.add('error');
    if (errorElement) {
        errorElement.textContent = mensaje;
        errorElement.classList.add('show');
    }
}

// ====== MANEJAR ENVÍO DEL FORMULARIO ======
document.getElementById('formCompletarDatos').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Obtener todos los campos requeridos
    const campos = this.querySelectorAll('input[required], select[required]');
    let formularioValido = true;

    // Validar todos los campos
    campos.forEach(campo => {
        if (!validarCampo(campo)) {
            formularioValido = false;
        }
    });

    if (!formularioValido) {
        mostrarNotificacion('❌ Por favor completa todos los campos correctamente', 'error');
        return;
    }

    // Obtener valores del formulario
    const datosFormulario = {
        documento: datosEstudiante.documento, // Importante: enviar el documento
        numeroMatricula: document.getElementById('numeroMatricula').value.trim(),
        idAcudiente: document.getElementById('idAcudiente').value.trim(),
        idGrupo: document.getElementById('idGrupo').value,
        idEstado: document.getElementById('idEstado').value
    };

    // Deshabilitar botón durante el envío
    const btnSubmit = this.querySelector('.btn-submit');
    const btnTextoOriginal = btnSubmit.innerHTML;
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<span>⏳</span> Guardando...';

    try {
        // Llamar a la API para guardar los datos
        const resultado = await guardarDatosEstudiante(datosFormulario);

        // Actualizar datos locales solo si fue exitoso
        Object.assign(datosEstudiante, {
            numeroMatricula: datosFormulario.numeroMatricula,
            idAcudiente: datosFormulario.idAcudiente,
            idGrupo: datosFormulario.idGrupo,
            idEstado: datosFormulario.idEstado
        });

        // Mostrar mensaje de éxito
        btnSubmit.innerHTML = '<span>✅</span> ¡Datos guardados!';
        btnSubmit.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';

        // Cerrar modal después de 1.5 segundos
        setTimeout(() => {
            ocultarModalDatos();
            btnSubmit.innerHTML = btnTextoOriginal;
            btnSubmit.disabled = false;
            btnSubmit.style.background = '';
            
            // Mostrar notificación de éxito
            mostrarNotificacion('✅ Información completada exitosamente. ¡Bienvenido!', 'success');
        }, 1500);

    } catch (error) {
        console.error('❌ Error al guardar datos:', error);
        
        btnSubmit.innerHTML = '<span>❌</span> Error al guardar';
        btnSubmit.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        
        setTimeout(() => {
            btnSubmit.innerHTML = btnTextoOriginal;
            btnSubmit.disabled = false;
            btnSubmit.style.background = '';
        }, 2000);

        mostrarNotificacion('❌ Error al guardar la información. Intenta nuevamente.', 'error');
    }
});
async function guardarDatosEstudiante(datos) {
    try {
        const formData = new FormData();
        formData.append('completar_datos', '1');
        formData.append('numeroMatricula', datos.numeroMatricula);
        formData.append('idAcudiente', datos.idAcudiente);
        formData.append('idGrupo', datos.idGrupo);
        formData.append('idEstado', datos.idEstado);

        const response = await fetch('estudiante.php', {
            method: 'POST',
            body: formData
        });

        const resultado = await response.json();
        
        if (!resultado.success) {
            throw new Error(resultado.message || 'Error al guardar datos');
        }

        console.log('✅ Datos guardados exitosamente:', resultado);
        return resultado;

    } catch (error) {
        console.error('❌ Error en la petición:', error);
        throw error;
    }
}




// ====== VALIDACIÓN EN TIEMPO REAL ======
document.querySelectorAll('#formCompletarDatos input, #formCompletarDatos select').forEach(campo => {
    // Validar al perder el foco
    campo.addEventListener('blur', function() {
        validarCampo(this);
    });

    // Limpiar error mientras escribe
    campo.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            this.classList.remove('error');
            const errorElement = document.getElementById(`error${this.name.charAt(0).toUpperCase() + this.name.slice(1)}`);
            if (errorElement) {
                errorElement.classList.remove('show');
            }
        }
    });
});

// ====== NOTIFICACIÓN TOAST ======
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: ${tipo === 'success' ? 'rgba(34, 197, 94, 0.95)' : 'rgba(239, 68, 68, 0.95)'};
        backdrop-filter: blur(20px);
        padding: 16px 24px;
        border-radius: 16px;
        color: white;
        font-weight: 600;
        font-size: 0.95rem;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
        z-index: 10001;
        animation: slideInRight 0.4s ease, slideOutRight 0.4s ease 2.6s;
        border: 1px solid ${tipo === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
        max-width: 400px;
    `;
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);

    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

// Agregar animaciones para notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// ====== CONFIGURACIÓN CALENDARIO ======
const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

// ====== FUNCIÓN PARA GENERAR CALENDARIO ======
function generarCalendario() {
    const calendario = document.getElementById("calendar");
    const mesActual = document.getElementById("currentMonth");
    
    if (!calendario || !mesActual) return;
    
    calendario.innerHTML = "";

    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = hoy.getMonth();

    // Mostrar mes y año actual
    mesActual.textContent = `${meses[month]} ${year}`;

    // Headers de días de la semana
    diasSemana.forEach(dia => {
        const header = document.createElement("div");
        header.classList.add("day-header");
        header.textContent = dia;
        calendario.appendChild(header);
    });

    // Calcular días del mes
    const primerDia = new Date(year, month, 1);
    const ultimoDia = new Date(year, month + 1, 0);
    const totalDias = ultimoDia.getDate();
    const inicioSemana = primerDia.getDay();

    // Espacios vacíos antes del primer día
    for (let i = 0; i < inicioSemana; i++) {
        const empty = document.createElement("div");
        calendario.appendChild(empty);
    }

    // Generar días del mes
    for (let d = 1; d <= totalDias; d++) {
        const fecha = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day");

        // Añadir clase si hay incidencia
        if (incidencias[fecha]) {
            dayDiv.classList.add(incidencias[fecha]);
            
            // Agregar tooltip con el tipo de incidencia
            const tipoIncidencia = incidencias[fecha].charAt(0).toUpperCase() + incidencias[fecha].slice(1);
            dayDiv.title = `${d} - ${tipoIncidencia}`;
        }

        dayDiv.textContent = d;
        calendario.appendChild(dayDiv);
    }
}

// ====== TOGGLE DROPDOWN ======
function toggleDropdown() {
    const dropdown = document.getElementById("dropdown");
    if (dropdown) {
        dropdown.style.display = (dropdown.style.display === "block") ? "none" : "block";
    }
}

// ====== CERRAR DROPDOWN AL HACER CLIC FUERA ======
window.onclick = function(event) {
    if (!event.target.closest(".user-info")) {
        const dropdown = document.getElementById("dropdown");
        if (dropdown) {
            dropdown.style.display = "none";
        }
    }
}

// ====== INICIALIZAR TODO AL CARGAR ======
document.addEventListener("DOMContentLoaded", function() {
    console.log('🚀 Iniciando sistema TEMPLUS...');
    
    // IMPORTANTE: Verificar datos incompletos PRIMERO
    const datosIncompletos = verificarDatosIncompletos();
    
    // Generar el calendario
    generarCalendario();
    
    // Animación para las cards (solo si no hay modal)
    if (!datosIncompletos) {
        animarElementos();
    }
    
    console.log('✅ Sistema TEMPLUS cargado correctamente');
});

// ====== ANIMACIONES DE ELEMENTOS ======
function animarElementos() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });

    const rows = document.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            row.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            row.style.opacity = '1';
            row.style.transform = 'translateX(0)';
        }, 800 + (index * 100));
    });
}

// ====== FUNCIONALIDAD PARA CERRAR SESIÓN ======
const logoutBtn = document.querySelector('.logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
            console.log('🔒 Cerrando sesión...');
            // Redirigir a la página de login
            window.location.href = '/login'; // Cambia esto a tu ruta de login
        }
    });
}

// ====== INTERACTIVIDAD EN LOS DÍAS DEL CALENDARIO ======
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('day') && !e.target.classList.contains('day-header')) {
        const fecha = e.target.title || `Día ${e.target.textContent}`;
        
        // Eliminar tooltip anterior si existe
        const existingTooltip = document.querySelector('.day-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
        
        // Mostrar tooltip si hay incidencia
        if (e.target.classList.contains('falta') || 
            e.target.classList.contains('tarde') || 
            e.target.classList.contains('sancion')) {
            
            const tooltip = document.createElement('div');
            tooltip.className = 'day-tooltip';
            tooltip.style.cssText = `
                position: fixed;
                left: ${e.pageX + 10}px;
                top: ${e.pageY + 10}px;
                background: rgba(15, 23, 42, 0.95);
                backdrop-filter: blur(20px);
                padding: 12px 16px;
                border-radius: 12px;
                border: 1px solid rgba(59, 130, 246, 0.3);
                color: #f1f5f9;
                font-size: 0.9rem;
                z-index: 10000;
                pointer-events: none;
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
            `;
            tooltip.textContent = fecha;
            document.body.appendChild(tooltip);
            
            setTimeout(() => {
                tooltip.remove();
            }, 2000);
        }
    }
});

console.log('📋 Sistema de validación activo');
console.log('🔐 Módulo de datos obligatorios cargado');