let selectedUserType = 'estudiante';

    // Credenciales de estudiante
    const studentCredentials = {
      email: 'estudiante@templus.edu',
      password: '123456',
      name: 'Juan Pérez'
    };

    // Función para seleccionar tipo de usuario
    function selectUserType(type) {
      if (type !== 'estudiante') {
        showError('Esta función estará disponible próximamente. Solo el acceso de estudiante está habilitado actualmente.');
        return;
      }
      
      selectedUserType = type;
      
      // Actualizar botones
      document.querySelectorAll('.user-type-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      document.querySelector(`[onclick="selectUserType('${type}')"]`).classList.add('active');
    }

    // Toggle para mostrar/ocultar credenciales
    function toggleCredentials() {
      const credentialsDiv = document.getElementById('testCredentials');
      credentialsDiv.classList.toggle('show');
    }

    // Función para llenar credenciales automáticamente
    function fillCredentials(email, password) {
      document.getElementById('email').value = email;
      document.getElementById('password').value = password;
      
      // Animación para indicar que se llenaron los campos
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      
      emailInput.style.background = 'rgba(34, 197, 94, 0.2)';
      passwordInput.style.background = 'rgba(34, 197, 94, 0.2)';
      
      setTimeout(() => {
        emailInput.style.background = '';
        passwordInput.style.background = '';
      }, 2000);
    }

    // Función de login
    function handleLogin(email, password) {
      // Verificar credenciales
      if (email === studentCredentials.email && password === studentCredentials.password) {
        return { success: true, user: studentCredentials };
      }
      return { success: false };
    }

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

    // Función para guardar datos del usuario en localStorage y redirigir
    function redirectToStudentDashboard(user) {
      // Guardar información del usuario para usarla en la página de destino
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('userType', selectedUserType);
      localStorage.setItem('loginTime', new Date().toISOString());
      
      // Redirigir a la página del estudiante
      window.location.href = 'estudiante.html';
    }

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

      if (selectedUserType !== 'estudiante') {
        showError('Por favor selecciona "Estudiante" para continuar.');
        return;
      }
      
      // Mostrar loading
      submitBtn.disabled = true;
      loadingSpinner.style.display = 'inline-block';
      document.getElementById('successMessage').style.display = 'none';
      document.getElementById('errorMessage').style.display = 'none';
      
      // Simular delay de autenticación
      setTimeout(() => {
        const loginResult = handleLogin(email, password);
        
        if (loginResult.success) {
          // Login exitoso
          showSuccess('¡Login exitoso! Redirigiendo al dashboard...');
          
          // Redirigir después de un breve delay
          setTimeout(() => {
            redirectToStudentDashboard(loginResult.user);
          }, 1500);
        } else {
          // Login fallido
          showError('Credenciales incorrectas. Por favor verifica tu email y contraseña.');
          submitBtn.disabled = false;
          loadingSpinner.style.display = 'none';
        }
      }, 1500);
    });

    // Cerrar credenciales al hacer clic fuera
    document.addEventListener('click', function(e) {
      const credentialsDiv = document.getElementById('testCredentials');
      const credentialsBtn = document.querySelector('.test-credentials-btn');
      
      if (credentialsDiv && credentialsBtn &&
          !credentialsDiv.contains(e.target) && 
          !credentialsBtn.contains(e.target)) {
        credentialsDiv.classList.remove('show');
      }
    });