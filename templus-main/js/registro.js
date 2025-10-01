// Función para mostrar notificaciones
    function showNotification(message, type = 'success') {
      const existingNotification = document.querySelector('.notification');
      if (existingNotification) {
        existingNotification.remove();
      }

      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.2rem;">${type === 'success' ? '✅' : '❌'}</span>
          <span>${message}</span>
        </div>
      `;

      document.body.appendChild(notification);

      setTimeout(() => {
        notification.classList.add('show');
      }, 100);

      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 300);
      }, 5000);
    }

    // Validación básica
    function validateForm() {
      const documento = document.getElementById('documento').value.trim();
      const primerNombre = document.getElementById('primerNombre').value.trim();
      const primerApellido = document.getElementById('primerApellido').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      if (!documento || documento.length < 6) {
        showNotification('El documento debe tener al menos 6 dígitos', 'error');
        return false;
      }

      if (!primerNombre || primerNombre.length < 2) {
        showNotification('El primer nombre es requerido', 'error');
        return false;
      }

      if (!primerApellido || primerApellido.length < 2) {
        showNotification('El primer apellido es requerido', 'error');
        return false;
      }

      if (!password || password.length < 6) {
        showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
        return false;
      }

      if (password !== confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'error');
        return false;
      }

      return true;
    }

    // Manejo del formulario
    document.getElementById('registrationForm').addEventListener('submit', function(e) {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      const submitBtn = document.getElementById('submitBtn');
      const spinner = document.getElementById('spinner');
      const btnText = document.getElementById('btnText');

      // Mostrar loading
      submitBtn.disabled = true;
      spinner.style.display = 'inline-block';
      btnText.textContent = 'REGISTRANDO...';

      // Enviar formulario usando fetch
      const formData = new FormData(this);

      fetch('registro.php', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers.get('content-type'));
        
        return response.text().then(text => {
          console.log('Raw response:', text);
          
          // Intentar parsear como JSON
          try {
            return JSON.parse(text);
          } catch (e) {
            // Si no es JSON válido, crear un objeto de respuesta
            if (text.includes('Registro exitoso') || text.includes('Bienvenido')) {
              return { success: true, message: 'Registro exitoso', redirect: 'login.html' };
            } else {
              return { success: false, message: text || 'Error desconocido' };
            }
          }
        });
      })
      .then(data => {
        console.log('Parsed data:', data);
        
        if (data.success) {
          showNotification(data.message, 'success');
          this.reset();
          
          if (data.redirect) {
            setTimeout(() => {
              window.location.href = data.redirect;
            }, 2000);
          }
        } else {
          showNotification(data.message, 'error');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        showNotification('Error de conexión. Verifica que el servidor esté ejecutándose.', 'error');
      })
      .finally(() => {
        // Restaurar botón
        submitBtn.disabled = false;
        spinner.style.display = 'none';
        btnText.textContent = 'REGISTRARSE';
      });
    });

    // Validación en tiempo real
    document.getElementById('documento').addEventListener('input', function() {
      this.value = this.value.replace(/[^0-9]/g, '');
    });

    document.getElementById('confirmPassword').addEventListener('input', function() {
      const password = document.getElementById('password').value;
      const confirmPassword = this.value;
      
      if (confirmPassword && password !== confirmPassword) {
        this.classList.add('invalid');
        this.classList.remove('valid');
      } else if (confirmPassword && password === confirmPassword) {
        this.classList.add('valid');
        this.classList.remove('invalid');
      }
    });