// Event listener para el formulario de login
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const submitBtn = document.getElementById('submitBtn');
  const loadingSpinner = document.getElementById('loadingSpinner');
  
  // Validaciones básicas
  if (!email || !password) {
    showError('Por favor completa todos los campos.');
    return;
  }
  
  if (!email.includes('@')) {
    showError('Por favor ingresa un email válido.');
    return;
  }
  
  // Mostrar loading
  submitBtn.disabled = true;
  loadingSpinner.style.display = 'inline-block';
  document.getElementById('successMessage').style.display = 'none';
  document.getElementById('errorMessage').style.display = 'none';
  
  // Crear FormData para enviar por POST
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);
  
  // Enviar datos al servidor PHP
  fetch('../php/login.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Login exitoso
      showSuccess(data.message + ' Redirigiendo...');
      
      // Guardar información del usuario en localStorage
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      localStorage.setItem('userType', data.user.tipoUsuario);
      localStorage.setItem('loginTime', new Date().toISOString());
      
      // Redirigir según el tipo de usuario
      setTimeout(() => {
        if (data.user.tipoUsuario === 'ESTUDIANTE') {
          window.location.href = '../pages/estudiante.html';
        } else if (data.user.tipoUsuario === 'PROFESOR') {
          window.location.href = '../pages/profesor.html';
        } else if (data.user.tipoUsuario === 'ACUDIENTE') {
          window.location.href = '../pages/acudiente.html';
        } else {
          window.location.href = '../pages/bienvenida.html';
        }
      }, 1500);
    } else {
      // Login fallido
      showError(data.message);
      submitBtn.disabled = false;
      loadingSpinner.style.display = 'none';
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showError('Error al conectar con el servidor. Por favor intenta de nuevo.');
    submitBtn.disabled = false;
    loadingSpinner.style.display = 'none';
  });
});

// Mostrar mensajes
function showSuccess(message) {
  const successEl = document.getElementById('successMessage');
  const errorEl = document.getElementById('errorMessage');
  successEl.textContent = message;
  successEl.style.display = 'block';
  errorEl.style.display = 'none';
}

function showError(message) {
  const successEl = document.getElementById('successMessage');
  const errorEl = document.getElementById('errorMessage');
  errorEl.textContent = message;
  errorEl.style.display = 'block';
  successEl.style.display = 'none';
}
