// Traducciones
const translations = {
  es: {
    nav_home: "inicio",
    nav_project: "proyecto",
    nav_services: "servicios",
    nav_contact: "contacto",
    nav_about: "acerca de",
    search_placeholder: "Buscar...",
    register: "Registrarse",
    login: "Iniciar sesión",
    hero_title: "welcome to templus",
    hero_subtitle: "Asistente de gestión templus",
    hero_description: "organiza tu tiempo con nosotros",
    hero_cta: "INGRESAR AL SISTEMA",
    features_title: "Todo lo que necesitas para gestionar",
    features_subtitle: "Templus es una plataforma completa que te ayuda a organizar horarios, controlar asistencias y gestionar tu institución educativa de manera eficiente.",
    feature1_title: "Gestión Inteligente",
    feature1_description: "Establece una estructura inteligente y organizada para gestionar horarios, roles y registros académicos con estilo moderno.",
    feature2_title: "Registros Completos",
    feature2_description: "Mantén registros detallados de asistencia, llegadas tarde y sanciones con trazabilidad completa y reportes en tiempo real.",
    feature3_title: "Colaboración Fácil",
    feature3_description: "Involucra a docentes, coordinadores y acudientes con un sistema intuitivo y amigable para la comunicación efectiva.",
    about_title: "Transformando la educación",
    about_description: "Somos un equipo comprometido con la transformación educativa mediante soluciones digitales. Nuestro sistema está diseñado para facilitar la gestión, el control y la interacción en los entornos académicos.",
    about_cta: "Utiliza nuestra plataforma",
    login_title: "Iniciar Sesión",
    login_message: "Funcionalidad de inicio de sesión próximamente disponible.",
    register_title: "Registro",
    register_message: "Funcionalidad de registro próximamente disponible.",
    contact_title: "Contacto",
    contact_message: "Email:templus@gmail.com<br>Teléfono: +57 321 6063045<br>Medellín, Antioquia, Colombia",
    system_title: "Acceso al Sistema",
    system_message: "El sistema completo estará disponible próximamente. ¡Gracias por tu interés!",
    close: "Cerrar"
  },
  en: {
    nav_home: "home",
    nav_project: "project",
    nav_services: "services",
    nav_contact: "contact",
    nav_about: "about",
    search_placeholder: "Search...",
    register: "Sign Up",
    login: "Log In",
    hero_title: "welcome to templus",
    hero_subtitle: "Templus Management Assistant",
    hero_description: "organize your time with us",
    hero_cta: "ENTER SYSTEM",
    features_title: "Everything you need to manage",
    features_subtitle: "Templus is a comprehensive platform that helps you organize schedules, control attendance and manage your educational institution efficiently.",
    feature1_title: "Smart Management",
    feature1_description: "Establish an intelligent and organized structure to manage schedules, roles and academic records with modern style.",
    feature2_title: "Complete Records",
    feature2_description: "Keep detailed records of attendance, tardiness and sanctions with complete traceability and real-time reports.",
    feature3_title: "Easy Collaboration",
    feature3_description: "Involve teachers, coordinators and guardians with an intuitive and friendly system for effective communication.",
    about_title: "Transforming education",
    about_description: "We are a team committed to educational transformation through digital solutions. Our system is designed to facilitate management, control and interaction in academic environments.",
    about_cta: "Use our platform",
    login_title: "Login",
    login_message: "Login functionality coming soon.",
    register_title: "Sign Up",
    register_message: "Registration functionality coming soon.",
    contact_title: "Contact",
    contact_message: "Email:templus@gmail.com<br>Phone: +57 321 6063045<br>Medellín, Antioquia, Colombia",
    system_title: "System Access",
    system_message: "The complete system will be available soon. Thank you for your interest!",
    close: "Close"
  }
};

let currentLanguage = 'es';

// Función para cambiar idioma
function changeLanguage(lang) {
  currentLanguage = lang;
  
  // Actualizar botones de idioma
  document.querySelectorAll('.language-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById(`btn-${lang}`).classList.add('active');
  
  // Actualizar el atributo lang del HTML
  document.documentElement.lang = lang;
  
  // Actualizar todos los elementos con data-translate
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    if (translations[lang][key]) {
      element.innerHTML = translations[lang][key];
    }
  });
  
  // Actualizar placeholders
  document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
    const key = element.getAttribute('data-translate-placeholder');
    if (translations[lang][key]) {
      element.placeholder = translations[lang][key];
    }
  });
  
  // Guardar preferencia de idioma
  localStorage.setItem('preferredLanguage', lang);
}

// Funciones para mostrar modales
function showContactModal() {
  document.getElementById('contactModal').style.display = 'block';
}

function enterSystem() {
  document.getElementById('systemModal').style.display = 'block';
}

function usePlatform() {
  document.getElementById('systemModal').style.display = 'block';
}

// Función para cerrar modales
function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// Cerrar modal al hacer clic fuera de él
window.onclick = function(event) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
}

// Crear partículas
function createParticles() {
  const particlesContainer = document.querySelector('.particles');
  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 12 + 's';
    particle.style.animationDuration = (Math.random() * 3 + 10) + 's';
    particlesContainer.appendChild(particle);
  }
}

// Función de búsqueda mejorada
function searchFunction() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  if (searchTerm.trim()) {
    console.log('Buscando:', searchTerm);
    
    // Buscar en el contenido de la página
    const searchableElements = document.querySelectorAll('h1, h2, h3, p, .feature-title, .feature-description');
    let found = false;
    
    searchableElements.forEach(element => {
      const text = element.textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.style.backgroundColor = 'rgba(102, 126, 234, 0.2)';
        setTimeout(() => {
          element.style.backgroundColor = '';
        }, 2000);
        found = true;
        return;
      }
    });
    
    if (!found) {
      alert(currentLanguage === 'es' ? 'No se encontraron resultados' : 'No results found');
    }
  }
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(26, 26, 46, 0.95)'};
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    border: 1px solid rgba(102, 126, 234, 0.3);
    backdrop-filter: blur(10px);
    z-index: 3000;
    font-weight: 500;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    animation: slideInRight 0.3s ease-out;
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Remover después de 3 segundos
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  createParticles();
  
  // Cargar idioma guardado
  const savedLanguage = localStorage.getItem('preferredLanguage') || 'es';
  changeLanguage(savedLanguage);
  
  // Búsqueda con Enter
  document.getElementById('search-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      searchFunction();
    }
  });

  // Smooth scroll para links de navegación
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Efecto de escritura en el hero title
  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;
    
    function typeWriter() {
      if (i < originalText.length) {
        heroTitle.textContent += originalText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    }
    
    // Comenzar el efecto después de 1 segundo
    setTimeout(typeWriter, 1000);
  }

  // Mostrar notificación de bienvenida
  setTimeout(() => {
    const welcomeMessage = currentLanguage === 'es' ? 
      '¡Bienvenido a Templus! 🚀' : 
      'Welcome to Templus! 🚀';
    showNotification(welcomeMessage, 'success');
  }, 2000);
});

// Efecto parallax sutil en hero
window.addEventListener('scroll', function() {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.style.transform = `translateY(${scrolled * 0.3}px)`;
  }
  
  // Efecto de desvanecimiento en header
  const header = document.querySelector('header');
  if (scrolled > 100) {
    header.style.background = 'rgba(15, 15, 35, 0.98)';
  } else {
    header.style.background = 'rgba(15, 15, 35, 0.95)';
  }
});

// Eventos de teclado para navegación rápida
document.addEventListener('keydown', function(e) {
  // ESC para cerrar modales
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.style.display = 'none';
    });
  }
  
  // Ctrl + K para enfocar búsqueda
  if (e.ctrlKey && e.key === 'k') {
    e.preventDefault();
    document.getElementById('search-input').focus();
  }
  
  // Alt + 1,2,3 para cambiar secciones
  if (e.altKey) {
    switch(e.key) {
      case '1':
        document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
        break;
      case '2':
        document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
        break;
      case '3':
        document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
        break;
    }
  }
});

// Animación de contador para las feature cards
function animateCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
        entry.target.style.animationDelay = `${Array.from(entry.target.parentNode.children).indexOf(entry.target) * 0.2}s`;
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feature-card').forEach(card => {
    observer.observe(card);
  });
}

// Inicializar animaciones cuando la página esté lista
window.addEventListener('load', animateCounters);

// Función para detectar dispositivos móviles
function isMobile() {
  return window.innerWidth <= 768;
}

// Ajustar comportamiento en móviles
if (isMobile()) {
  // Reducir número de partículas en móviles
  document.querySelector('.particles').style.display = 'none';
}

// Console message para desarrolladores
console.log('%c¡Hola desarrollador! 👋', 'color: #667eea; font-size: 16px; font-weight: bold;');
console.log('%cTemplus está construido con tecnologías modernas.', 'color: #764ba2; font-size: 12px;');
console.log('%c¿Interesado en contribuir? ¡Contáctanos!', 'color: #f093fb; font-size: 12px;');