Prueba la IA directamente en tus apps favoritas … Usa Gemini para generar borradores y perfeccionar contenido, y obtén Gemini Pro con acceso a la IA de nueva generación de Google
<?php
// Configuración básica
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Headers para CORS y JSON
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

// Log para debugging
error_log("registro.php: Recibida petición " . $_SERVER['REQUEST_METHOD']);

// Verificar que es una petición POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false, 
        'message' => 'Método no permitido. Se requiere POST.'
    ]);
    exit;
}

// Función para enviar respuesta JSON
function sendResponse($success, $message, $redirect = null) {
    $response = [
        'success' => $success,
        'message' => $message
    ];
    if ($redirect) {
        $response['redirect'] = $redirect;
    }
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
}

// Log de datos recibidos
error_log("Datos POST recibidos: " . print_r($_POST, true));

// Verificar si se recibieron los datos
if (!isset($_POST['documento']) || !isset($_POST['primer_nombre']) || 
    !isset($_POST['primer_apellido']) || !isset($_POST['contraseña'])) {
    sendResponse(false, 'Faltan datos requeridos en el formulario');
}

// Obtener y limpiar datos
$documento = trim($_POST['documento']);
$primer_nombre = trim($_POST['primer_nombre']);
$segundo_nombre = trim($_POST['segundo_nombre'] ?? '');
$primer_apellido = trim($_POST['primer_apellido']);
$segundo_apellido = trim($_POST['segundo_apellido'] ?? '');
$contraseña = $_POST['contraseña'];

// Validaciones básicas
if (empty($documento) || !is_numeric($documento) || strlen($documento) < 6) {
    sendResponse(false, 'El documento debe ser numérico y tener al menos 6 dígitos');
}

if (empty($primer_nombre) || strlen($primer_nombre) < 2) {
    sendResponse(false, 'El primer nombre es requerido y debe tener al menos 2 caracteres');
}

if (empty($primer_apellido) || strlen($primer_apellido) < 2) {
    sendResponse(false, 'El primer apellido es requerido y debe tener al menos 2 caracteres');
}

if (empty($contraseña) || strlen($contraseña) < 6) {
    sendResponse(false, 'La contraseña debe tener al menos 6 caracteres');
}

// Configuración de base de datos
$servidor = "localhost";
$usuario = "root";
$clave = "";
$base = "templus"; // Asegúrate que coincida con tu base de datos

// Intentar conectar a la base de datos
$enlace = @mysqli_connect($servidor, $usuario, $clave, $base);

if (!$enlace) {
    error_log("Error de conexión DB: " . mysqli_connect_error());
    sendResponse(false, 'Error de conexión a la base de datos. Verifica que XAMPP esté corriendo.');
}

// Establecer charset
mysqli_set_charset($enlace, "utf8");

try {
    // Verificar si el documento ya existe
    $stmt = mysqli_prepare($enlace, "SELECT DOCUMENTO FROM usuario WHERE DOCUMENTO = ?");
    if (!$stmt) {
        throw new Exception('Error en la preparación de consulta de verificación: ' . mysqli_error($enlace));
    }

    mysqli_stmt_bind_param($stmt, "s", $documento);
    mysqli_stmt_execute($stmt);
    $resultado = mysqli_stmt_get_result($stmt);

    if (mysqli_num_rows($resultado) > 0) {
        mysqli_stmt_close($stmt);
        mysqli_close($enlace);
        sendResponse(false, 'El documento ya está registrado en el sistema');
    }

    mysqli_stmt_close($stmt);

    // Hash de la contraseña
    $contraseña_hash = password_hash($contraseña, PASSWORD_DEFAULT);

    // Insertar nuevo usuario
    $sql = "INSERT INTO usuario (DOCUMENTO, PRIMER_NOMBRE, SEGUNDO_NOMBRE, PRIMER_APELLIDO, SEGUNDO_APELLIDO, CONTRASEÑA) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = mysqli_prepare($enlace, $sql);

    if (!$stmt) {
        throw new Exception('Error en la preparación de consulta de inserción: ' . mysqli_error($enlace));
    }

    mysqli_stmt_bind_param($stmt, "ssssss", 
        $documento, 
        $primer_nombre, 
        $segundo_nombre, 
        $primer_apellido, 
        $segundo_apellido, 
        $contraseña_hash
    );

    if (mysqli_stmt_execute($stmt)) {
        mysqli_stmt_close($stmt);
        mysqli_close($enlace);
        error_log("Usuario registrado exitosamente: " . $documento);
        sendResponse(true, '¡Registro exitoso! Bienvenido a Templus', 'login.html');
    } else {
        $error = mysqli_stmt_error($stmt);
        mysqli_stmt_close($stmt);
        mysqli_close($enlace);
        error_log("Error al insertar usuario: " . $error);
        throw new Exception('Error al registrar usuario: ' . $error);
    }

} catch (Exception $e) {
    if (isset($stmt) && $stmt) {
        mysqli_stmt_close($stmt);
    }
    if (isset($enlace) && $enlace) {
        mysqli_close($enlace);
    }
    error_log("Exception: " . $e->getMessage());
    sendResponse(false, $e->getMessage());
}
?>