<?php
// 1️⃣ Conexión a la base de datos
$conexion = new mysqli("localhost", "root", "", "templus");
if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

// 2️⃣ Verificar si se envió el formulario
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Recibir datos del formulario
    $DOCUMENTO = $_POST["DOCUMENTO"];
    $PRIMER_NOMBRE = $_POST["PRIMER_NOMBRE"];
    $SEGUNDO_NOMBRE = isset($_POST["SEGUNDO_NOMBRE"]) ? $_POST["SEGUNDO_NOMBRE"] : "";
    $PRIMER_APELLIDO = $_POST["PRIMER_APELLIDO"];
    $SEGUNDO_APELLIDO = isset($_POST["SEGUNDO_APELLIDO"]) ? $_POST["SEGUNDO_APELLIDO"] : "";
    $CONTRASENA = $_POST["CONTRASENA"];
    $CONFIRMAR_CONTRASENA = $_POST["CONFIRMAR_CONTRASENA"];
    $CORREO = $_POST["CORREO"];
    $TIPO_USUARIO = $_POST["TIPO_USUARIO"];

    // 3️⃣ Validar contraseñas
    if ($CONTRASENA !== $CONFIRMAR_CONTRASENA) {
        echo "<script>alert('❌ Las contraseñas no coinciden'); window.history.back();</script>";
        exit();
    }

    // 4️⃣ Hash de contraseña (recomendado por seguridad)
    $CONTRASENA_HASH = password_hash($CONTRASENA, PASSWORD_DEFAULT);

    // 5️⃣ Verificar si el documento ya existe
    $checkDoc = $conexion->prepare("SELECT DOCUMENTO FROM usuario WHERE DOCUMENTO = ?");
    $checkDoc->bind_param("i", $DOCUMENTO);
    $checkDoc->execute();
    $checkDoc->store_result();

    if ($checkDoc->num_rows > 0) {
        echo "<script>alert('❌ El documento ya está registrado'); window.history.back();</script>";
        $checkDoc->close();
        $conexion->close();
        exit();
    }
    $checkDoc->close();

    // 6️⃣ Insertar en tabla usuario
    $sqlUsuario = "INSERT INTO usuario (DOCUMENTO, PRIMER_NOMBRE, SEGUNDO_NOMBRE, PRIMER_APELLIDO, SEGUNDO_APELLIDO, CONTRASENA, CORREO) VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conexion->prepare($sqlUsuario);
    $stmt->bind_param("issssss", $DOCUMENTO, $PRIMER_NOMBRE, $SEGUNDO_NOMBRE, $PRIMER_APELLIDO, $SEGUNDO_APELLIDO, $CONTRASENA_HASH, $CORREO);

    if ($stmt->execute()) {
        // 7️⃣ Insertar según el tipo de usuario
        $registroExitoso = false;
        
        if ($TIPO_USUARIO === "ESTUDIANTE") {
            // Solo insertamos DOCUMENTO, los demás campos quedan en NULL
            $sqlEst = "INSERT INTO estudiante (DOCUMENTO) VALUES (?)";
            $stmt2 = $conexion->prepare($sqlEst);
            $stmt2->bind_param("i", $DOCUMENTO);
            if ($stmt2->execute()) {
                $registroExitoso = true;
            } else {
                echo "<script>alert('❌ Error específico en estudiante: " . $stmt2->error . "');</script>";
            }
            $stmt2->close();
            
        } elseif ($TIPO_USUARIO === "PROFESOR") {
            $sqlProf = "INSERT INTO profesor (DOCUMENTO) VALUES (?)";
            $stmt3 = $conexion->prepare($sqlProf);
            $stmt3->bind_param("i", $DOCUMENTO);
            if ($stmt3->execute()) {
                $registroExitoso = true;
            } else {
                echo "<script>alert('❌ Error específico en profesor: " . $stmt3->error . "');</script>";
            }
            $stmt3->close();
            
        } elseif ($TIPO_USUARIO === "ACUDIENTE") {
            // El campo TELEFONO queda en NULL
            $sqlAcud = "INSERT INTO acudiente (DOCUMENTO, TELEFONO) VALUES (?, NULL)";
            $stmt4 = $conexion->prepare($sqlAcud);
            $stmt4->bind_param("i", $DOCUMENTO);
            if ($stmt4->execute()) {
                $registroExitoso = true;
            } else {
                echo "<script>alert('❌ Error específico en acudiente: " . $stmt4->error . "');</script>";
            }
            $stmt4->close();
        }

        if ($registroExitoso) {
            echo "<script>alert('✅ Registro exitoso como " . $TIPO_USUARIO . "'); window.location.href='../pages/bienvenida.html';</script>";
        } else {
            echo "<script>alert('⚠️ Usuario creado pero hubo un error al asignar el rol'); window.history.back();</script>";
        }
    } else {
        echo "<script>alert('❌ Error al registrar usuario: " . $stmt->error . "'); window.history.back();</script>";
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
    <title>Registro - TEMPLUS</title>
    <link rel="stylesheet" href="../styles/registro.css">
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
        <a href="../pages/bienvenida.html" class="back-link">← Volver al inicio</a>
    </header>

    <!-- Contenedor principal -->
    <div class="main-container">
        <div class="left-panel">
            <div class="welcome-content">
                <h1>Únete a<br>templus</h1>
                <p class="welcome-description">
                    Confianza que se construye día a día, cada asistencia cuenta y deja huella.
                </p>
                <p class="motivational-text">
                    Únete y toma el control desde hoy. Forma parte de una comunidad educativa moderna y eficiente.
                </p>
            </div>
        </div>

        <div class="right-panel">
            <form class="registration-form" id="registrationForm" method="POST" action="">
                <div class="form-logo">
                    <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 12px; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                        📚
                    </div>
                </div>

                <h2 class="form-title">REGISTRO</h2>

                <!-- Documento -->
                <div class="form-group">
                    <input type="number" class="form-input" id="documento" name="DOCUMENTO" placeholder="Documento" required>
                    <span class="input-icon">📄</span>
                </div>

                <!-- Nombres -->
                <div class="form-row">
                    <div class="form-group">
                        <input type="text" class="form-input" id="primerNombre" name="PRIMER_NOMBRE" placeholder="Primer Nombre" required>
                        <span class="input-icon">👤</span>
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-input" id="segundoNombre" name="SEGUNDO_NOMBRE" placeholder="Segundo Nombre">
                        <span class="input-icon">👤</span>
                    </div>
                </div>

                <!-- Apellidos -->
                <div class="form-row">
                    <div class="form-group">
                        <input type="text" class="form-input" id="primerApellido" name="PRIMER_APELLIDO" placeholder="Primer Apellido" required>
                        <span class="input-icon">👥</span>
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-input" id="segundoApellido" name="SEGUNDO_APELLIDO" placeholder="Segundo Apellido">
                        <span class="input-icon">👥</span>
                    </div>
                </div>

                <!-- Correo -->
                <div class="form-group">
                    <input type="email" class="form-input" id="correo" name="CORREO" placeholder="Correo electrónico" required>
                    <span class="input-icon">📧</span>
                </div>

                <!-- Contraseña -->
                <div class="form-group">
                    <input type="password" class="form-input" id="password" name="CONTRASENA" placeholder="Contraseña" required minlength="6">
                    <span class="input-icon">🔒</span>
                </div>

                <!-- Confirmar Contraseña -->
                <div class="form-group">
                    <input type="password" class="form-input" id="confirmPassword" name="CONFIRMAR_CONTRASENA" placeholder="Confirmar Contraseña" required minlength="6">
                    <span class="input-icon">🔒</span>
                </div>

                <!-- Tipo de usuario -->
                <div class="form-group">
                    <select class="form-input" name="TIPO_USUARIO" id="tipoUsuario" required>
                        <option value="">Selecciona el tipo de usuario</option>
                        <option value="ESTUDIANTE">Estudiante</option>
                        <option value="PROFESOR">Profesor</option>
                        <option value="ACUDIENTE">Acudiente</option>
                    </select>
                    <span class="input-icon">🎓</span>
                </div>

                <button type="submit" name="registro" class="submit-btn" id="submitBtn">
                    <div class="spinner" id="spinner"></div>
                    <span id="btnText">REGISTRARSE</span>
                </button>

                <div class="login-link">
                    <span>¿Ya tienes cuenta?</span> 
                    <a href="../pages/bienvenida.html">Inicia sesión</a>
                </div>
            </form>
        </div>
    </div>

    <script src="../scripts/registro.js"></script>
</body>
</html>