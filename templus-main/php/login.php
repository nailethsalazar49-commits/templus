<?php
session_start();

// Conexión a la base de datos
$conexion = new mysqli("localhost", "root", "", "templus");
if ($conexion->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos']));
}

// Verificar si se envió el formulario
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Obtener datos del POST
    $correo = $_POST["email"] ?? '';
    $contrasena = $_POST["password"] ?? '';

    // Validar que los campos no estén vacíos
    if (empty($correo) || empty($contrasena)) {
        echo json_encode(['success' => false, 'message' => 'Por favor completa todos los campos']);
        exit();
    }

    // Buscar usuario por correo
    $sql = "SELECT u.DOCUMENTO, u.PRIMER_NOMBRE, u.SEGUNDO_NOMBRE, u.PRIMER_APELLIDO, u.SEGUNDO_APELLIDO, u.CONTRASENA, u.CORREO,
            CASE 
                WHEN e.DOCUMENTO IS NOT NULL THEN 'ESTUDIANTE'
                WHEN p.DOCUMENTO IS NOT NULL THEN 'PROFESOR'
                WHEN a.DOCUMENTO IS NOT NULL THEN 'ACUDIENTE'
                ELSE 'DESCONOCIDO'
            END as TIPO_USUARIO
            FROM usuario u
            LEFT JOIN estudiante e ON u.DOCUMENTO = e.DOCUMENTO
            LEFT JOIN profesor p ON u.DOCUMENTO = p.DOCUMENTO
            LEFT JOIN acudiente a ON u.DOCUMENTO = a.DOCUMENTO
            WHERE u.CORREO = ?";
    
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("s", $correo);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows === 1) {
        $usuario = $resultado->fetch_assoc();
        
        // Verificar contraseña
        if (password_verify($contrasena, $usuario['CONTRASENA'])) {
            // Login exitoso
            $_SESSION['documento'] = $usuario['DOCUMENTO'];
            $_SESSION['nombre'] = $usuario['PRIMER_NOMBRE'] . ' ' . $usuario['PRIMER_APELLIDO'];
            $_SESSION['correo'] = $usuario['CORREO'];
            $_SESSION['tipo_usuario'] = $usuario['TIPO_USUARIO'];
            
            // Preparar datos para enviar al cliente
            $userData = [
                'documento' => $usuario['DOCUMENTO'],
                'nombre' => $usuario['PRIMER_NOMBRE'] . ' ' . $usuario['PRIMER_APELLIDO'],
                'primerNombre' => $usuario['PRIMER_NOMBRE'],
                'segundoNombre' => $usuario['SEGUNDO_NOMBRE'],
                'primerApellido' => $usuario['PRIMER_APELLIDO'],
                'segundoApellido' => $usuario['SEGUNDO_APELLIDO'],
                'correo' => $usuario['CORREO'],
                'tipoUsuario' => $usuario['TIPO_USUARIO']
            ];
            
            echo json_encode([
                'success' => true, 
                'message' => '¡Login exitoso!',
                'user' => $userData
            ]);
        } else {
            // Contraseña incorrecta
            echo json_encode(['success' => false, 'message' => 'Credenciales incorrectas']);
        }
    } else {
        // Usuario no encontrado
        echo json_encode(['success' => false, 'message' => 'Credenciales incorrectas']);
    }

    $stmt->close();
    $conexion->close();
    exit();
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Principal</title>
    <link rel="stylesheet" href="../styles/login.css">
</head>
<body>
    <!-- Orbes decorativos -->
  <div class="orb"></div>
  <div class="orb"></div>
  <div class="orb"></div>

  <!-- Header -->
  <header class="header">
    <div class="logo">
      <div class="logo-text">TEMPLUS</div>
    </div>
    <div class="header-actions">
      <a href="../pages/bienvenida.html" class="back-link">← Volver al inicio</a>
    </div>
  </header>

  <!-- Contenedor principal -->
  <div class="login-screen">
    <!-- Panel izquierdo -->
    <div class="left-panel">
      <div class="welcome-content">
        <h1>Bienvenido<br>de vuelta</h1>
        <p class="welcome-description">
          Tu espacio educativo te espera. Accede a tu cuenta y continúa construyendo tu futuro académico con nosotros.
        </p>
        <p class="motivational-text">
          Cada sesión es una oportunidad de crecimiento. Tu progreso está a un clic de distancia.
        </p>
      </div>
    </div>

    <!-- Panel derecho - Formulario -->
    <div class="right-panel">
      <form class="login-form" id="loginForm">
        <div class="form-logo">
          <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 15px; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 1.8rem;">
            🔐
          </div>
        </div>

        <h2 class="form-title">INICIAR SESIÓN</h2>

        <!-- Mensajes -->
        <div class="success-message" id="successMessage">
          ¡Login exitoso! Redirigiendo al dashboard...
        </div>
        <div class="error-message" id="errorMessage">
          Credenciales incorrectas. Por favor verifica tu email y contraseña.
        </div>

        <div class="form-group">
          <input 
            type="email" 
            class="form-input" 
            id="email" 
            name="email"
            placeholder="Correo Electrónico" 
            required
          >
          <span class="input-icon">📧</span>
        </div>

        <div class="form-group">
          <input 
            type="password" 
            class="form-input" 
            id="password" 
            name="password"
            placeholder="Contraseña" 
            required
          >
          <span class="input-icon">🔒</span>
        </div>

        <div class="forgot-password">
          <a href="#" onclick="alert('¿Olvidaste tu contraseña?'); return false;">¿Olvidaste tu contraseña?</a>
        </div>

        <button type="submit" class="submit-btn" id="submitBtn">
          <span class="loading-spinner" id="loadingSpinner"></span>
          <span class="btn-text">INICIAR SESIÓN</span>
        </button>
      </form>
    </div>
  </div>

    <script src="../js/login.js"></script>
</body>
</html>