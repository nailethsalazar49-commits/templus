<?php
// CABECERAS CORS
header("Access-Control-Allow-Origin: *"); // Reemplaza * por el origen específico si deseas restringir
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// CONEXIÓN A LA BASE DE DATOS
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "templus";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "msg" => "Error de conexión a la base de datos"]));
}

// RECIBIR JSON
$data = json_decode(file_get_contents("php://input"), true);
$documento = $data["estudiante"] ?? null; 
$jornada = 1; // AM por defecto
$tipo = 1;    // PRESENTE

if (!$documento) {
    echo json_encode(["status" => "error", "msg" => "No se recibió documento"]);
    exit;
}

// FECHA ACTUAL
$fecha = date('Y-m-d H:i:s');

// PREPARAR CONSULTA
$stmt = $conn->prepare("
    INSERT INTO asistencia (FECHA_HORA, D_ESTUDIANTE, ID_Jornada, ID_Tipo_Asistencia)
    VALUES (?, ?, ?, ?)
");
$stmt->bind_param("siii", $fecha, $documento, $jornada, $tipo);

// EJECUTAR E INSERTAR
if ($stmt->execute()) {
    echo json_encode(["status" => "ok", "documento" => $documento]);
} else {
    echo json_encode(["status" => "error", "msg" => "Error al insertar asistencia"]);
}

$conn->close();
?>
