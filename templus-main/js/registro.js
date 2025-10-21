// 🔔 Función para mostrar notificaciones modernas
function showNotification(message, type = 'success') {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="font-size: 1.3rem;">${type === 'success' ? '✅' : '⚠️'}</span>
      <span>${message}</span>
    </div>
  `;
  document.body.appendChild(notification);

  // Animación
  setTimeout(() => notification.classList.add('show'), 50);
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// 🧾 Función de validación
function validateForm() {
  const documento = document.getElementById('documento').value.trim();
  const primerNombre = document.getElementById('primerNombre').value.trim();
  const primerApellido = document.getElementById('primerApellido').value.trim();
  const email = document.getElementById('email')?.value.trim() || '';
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // Validaciones
  if (!/^\d{6,}$/.test(documento)) {
    showNotification('El documento debe tener al menos 6 dígitos numéricos.', 'error');
    return false;
  }

  if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,}$/.test(primerNombre)) {
    showNotification('El primer nombre debe contener solo letras y tener al menos 2 caracteres.', 'error');
    return false;
  }

  if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,}$/.test(primerApellido)) {
    showNotification('El primer apellido debe contener solo letras y tener al menos 2 caracteres.', 'error');
    return false;
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showNotification('El correo electrónico no es válido.', 'error');
    return false;
  }

  if (password.length < 6) {
    showNotification('La contraseña debe tener al menos 6 caracteres.', 'error');
    return false;
  }

  if (password !== confirmPassword) {
    showNotification('Las contraseñas no coinciden.', 'error');
    return false;
  }

  return true;
}

// 🧠 Manejo del envío del formulario
document.getElementById('registrationForm').addEventListener('submit', function (e) {
  e.preventDefault();

  if (!validateForm()) return;

  const submitBtn = document.getElementById('submitBtn');
  const spinner = document.getElementById('spinner');
  const btnText = document.getElementById('btnText');

  submitBtn.disabled = true;
  spinner.style.display = 'inline-block';
  btnText.textContent = 'REGISTRANDO...';

  const formData = new FormData(this);

  fetch('registro.php', { method: 'POST', body: formData })
    .then(async (response) => {
      const text = await response.text();
      console.log('Raw response:', text);

      try {
        return JSON.parse(text);
      } catch {
        if (text.includes('Registro exitoso') || text.includes('Bienvenido')) {
          return { success: true, message: 'Registro exitoso', redirect: 'login.html' };
        } else {
          return { success: false, message: text || 'Error desconocido' };
        }
      }
    })
    .then((data) => {
      if (data.success) {
        showNotification(data.message, 'success');
        document.getElementById('registrationForm').reset();
        if (data.redirect) {
          setTimeout(() => (window.location.href = data.redirect), 2000);
        }
      } else {
        showNotification(data.message, 'error');
      }
    })
    .catch(() => {
      showNotification('Error de conexión. Verifica el servidor.', 'error');
    })
    .finally(() => {
      submitBtn.disabled = false;
      spinner.style.display = 'none';
      btnText.textContent = 'REGISTRARSE';
    });
});

// ⏱️ Validación en tiempo real
document.getElementById('documento').addEventListener('input', function () {
  this.value = this.value.replace(/[^0-9]/g, '');
});

document.getElementById('confirmPassword').addEventListener('input', function () {
  const password = document.getElementById('password').value;
  if (this.value && this.value !== password) {
    this.classList.add('invalid');
    this.classList.remove('valid');
  } else if (this.value && this.value === password) {
    this.classList.add('valid');
    this.classList.remove('invalid');
  } else {
    this.classList.remove('valid', 'invalid');
  }
});
