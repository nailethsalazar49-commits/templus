// ====== DATOS DE INCIDENCIAS ======
const incidencias = {
    "2025-09-02": "falta",
    "2025-09-05": "tarde",
    "2025-09-09": "sancion",
    "2025-09-12": "falta",
    "2025-09-15": "tarde",
    "2025-09-20": "sancion"
};

// ====== CONFIGURACIÓN ======
const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

// ====== FUNCIÓN PARA GENERAR CALENDARIO ======
function generarCalendario() {
    const calendario = document.getElementById("calendar");
    const mesActual = document.getElementById("currentMonth");
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

// ====== FUNCIÓN PARA TOGGLE DROPDOWN ======
function toggleDropdown() {
    const dropdown = document.getElementById("dropdown");
    dropdown.style.display = (dropdown.style.display === "block") ? "none" : "block";
}

// ====== CERRAR DROPDOWN AL HACER CLIC FUERA ======
window.onclick = function(event) {
    if (!event.target.closest(".user-info")) {
        document.getElementById("dropdown").style.display = "none";
    }
}

// ====== ANIMACIONES DE ENTRADA ======
document.addEventListener("DOMContentLoaded", function() {
    // Generar el calendario al cargar la página
    generarCalendario();
    
    // Animación para las cards
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

    // Animación para las filas de la tabla
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
});

// ====== EFECTOS HOVER SUAVES EN STATS ======
document.querySelectorAll('.stat').forEach(stat => {
    stat.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// ====== FUNCIONALIDAD PARA EL BOTÓN DE DESCARGA ======
document.querySelector('.btn').addEventListener('click', function(e) {
    e.preventDefault();
    
    // Animación del botón
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = 'translateY(-4px)';
    }, 100);
    
    // Aquí puedes agregar la lógica para descargar el reporte
    console.log('Descargando reporte...');
    
    // Simulación de descarga (puedes reemplazar esto con tu lógica real)
    setTimeout(() => {
        alert('¡Reporte descargado exitosamente! 📊');
    }, 500);
});

// ====== FUNCIONALIDAD PARA BÚSQUEDA ======
const searchBox = document.querySelector('.search-box');
searchBox.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
            row.style.opacity = '1';
        } else {
            row.style.display = 'none';
            row.style.opacity = '0';
        }
    });
});

// ====== FUNCIONALIDAD PARA CERRAR SESIÓN ======
document.querySelector('.logout-btn').addEventListener('click', function() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        console.log('Cerrando sesión...');
        // Aquí puedes agregar la lógica para cerrar sesión
        // window.location.href = '/login';
        alert('Sesión cerrada exitosamente');
    }
});

// ====== AÑADIR INTERACTIVIDAD A LOS DÍAS DEL CALENDARIO ======
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('day') && !e.target.classList.contains('day-header')) {
        const fecha = e.target.title || `Día ${e.target.textContent}`;
        
        // Crear un pequeño tooltip o mostrar información
        const existingTooltip = document.querySelector('.day-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
        
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

// ====== ACTUALIZAR ESTADÍSTICAS DINÁMICAMENTE ======
function actualizarEstadisticas() {
    // Esta función podría conectarse a una API para obtener datos reales
    const stats = {
        presentes: 120,
        faltas: 8,
        tardanzas: 5,
        sanciones: 2
    };
    
    // Aquí podrías actualizar los valores si vienen de una API
    console.log('Estadísticas actualizadas:', stats);
}

// ====== EFECTO DE PARALLAX SUAVE EN EL SCROLL ======
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const header = document.querySelector('header');
    
    if (header) {
        const offset = scrollTop * 0.3;
        header.style.transform = `translateY(${offset}px)`;
    }
    
    lastScrollTop = scrollTop;
});

// ====== INICIALIZAR TODO AL CARGAR ======
console.log('✅ Sistema TEMPLUS cargado correctamente');
console.log('📅 Calendario generado');
console.log('📊 Estadísticas listas');