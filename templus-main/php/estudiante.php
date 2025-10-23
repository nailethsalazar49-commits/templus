<?php
session_start();

// ========== CONEXIÓN A LA BASE DE DATOS ==========
$conexion = new mysqli("localhost", "root", "", "templus");
if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

// ========== VERIFICAR QUE HAY SESIÓN ACTIVA ==========
if (!isset($_SESSION['documento']) || !isset($_SESSION['tipo_usuario'])) {
    header('Location: login.php');
    exit();
}

// ========== VERIFICAR QUE ES ESTUDIANTE ==========
if ($_SESSION['tipo_usuario'] !== 'ESTUDIANTE') {
    die("Acceso denegado. Solo para estudiantes.");
}

$documento = $_SESSION['documento'];

// ========== PROCESAR FORMULARIO DE COMPLETAR DATOS ==========
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['completar_datos'])) {
    header('Content-Type: application/json');
    
    $numeroMatricula = trim($_POST['numeroMatricula']);
    $idAcudiente = trim($_POST['idAcudiente']);
    $idGrupo = intval($_POST['idGrupo']);
    $idEstado = intval($_POST['idEstado']);
    
    // Actualizar datos en la base de datos
    $sqlUpdate = "UPDATE estudiante SET 
                    NUMERO_MATRICULA = ?,
                    D_ACUDIENTE = ?,
                    ID_GRUPO = ?,
                    ID_ESTADO = ?
                  WHERE DOCUMENTO = ?";
    
    $stmt = $conexion->prepare($sqlUpdate);
    $stmt->bind_param("ssiii", $numeroMatricula, $idAcudiente, $idGrupo, $idEstado, $documento);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Datos actualizados correctamente']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al actualizar: ' . $stmt->error]);
    }
    
    $stmt->close();
    $conexion->close();
    exit();
}

// ========== OBTENER DATOS DEL ESTUDIANTE ==========
$sqlEstudiante = "SELECT 
                    e.DOCUMENTO,
                    e.NUMERO_MATRICULA,
                    e.D_ACUDIENTE,
                    e.ID_GRUPO,
                    e.ID_ESTADO,
                    u.PRIMER_NOMBRE,
                    u.SEGUNDO_NOMBRE,
                    u.PRIMER_APELLIDO,
                    u.SEGUNDO_APELLIDO,
                    u.CORREO
                  FROM estudiante e
                  INNER JOIN usuario u ON e.DOCUMENTO = u.DOCUMENTO
                  WHERE e.DOCUMENTO = ?";

$stmt = $conexion->prepare($sqlEstudiante);
$stmt->bind_param("i", $documento);
$stmt->execute();
$resultado = $stmt->get_result();
$datosEstudiante = $resultado->fetch_assoc();
$stmt->close();

// Convertir a JSON para JavaScript
$datosEstudianteJSON = json_encode($datosEstudiante);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel Estudiante - TEMPLUS</title>
    <link rel="stylesheet" href="../styles/estudiante.css">
</head>
<body>
    <!-- NAVBAR -->
    <nav>
        <div class="logo">TEMPLUS</div>
        <input type="text" class="search-box" placeholder="🔍 Buscar registros...">
        <div class="user-section">
            <div class="user-info" onclick="toggleDropdown()">
                <img src="https://i.pravatar.cc/150?img=3" alt="Foto Usuario">
                <span class="user-name"><?php echo $datosEstudiante['PRIMER_NOMBRE'] . ' ' . $datosEstudiante['PRIMER_APELLIDO']; ?></span>
            </div>
            <button class="logout-btn">Cerrar Sesión</button>
        </div>
    </nav>

    <!-- Dropdown con info estudiante -->
    <div class="dropdown" id="dropdown">
        <img src="https://i.pravatar.cc/150?img=3" alt="Foto Usuario">
        <h3><?php echo $datosEstudiante['PRIMER_NOMBRE'] . ' ' . $datosEstudiante['PRIMER_APELLIDO']; ?></h3>
        <p><b>Documento:</b> <?php echo $datosEstudiante['DOCUMENTO']; ?></p>
        <p><b>Correo:</b> <?php echo $datosEstudiante['CORREO']; ?></p>
        <p><b>Matrícula:</b> <?php echo $datosEstudiante['NUMERO_MATRICULA'] ?? 'No asignada'; ?></p>
    </div>

    <!-- Modal para completar datos obligatorios -->
    <div class="modal-overlay" id="modalDatos">
        <div class="modal-container">
            <div class="modal-header">
                <h2>⚠️ Completa tu Información</h2>
                <p>Necesitamos que completes los siguientes datos para continuar</p>
            </div>
            
            <form class="modal-form" id="formCompletarDatos">
                <div class="form-group">
                    <label for="numeroMatricula">
                        <span class="label-icon">📋</span>
                        Número de Matrícula
                        <span class="required">*</span>
                    </label>
                    <input 
                        type="text" 
                        id="numeroMatricula" 
                        name="numeroMatricula" 
                        placeholder="Ej: MAT-2025-001"
                        required
                    >
                    <span class="error-message" id="errorMatricula"></span>
                </div>

                <div class="form-group">
                    <label for="idAcudiente">
                        <span class="label-icon">👨‍👩‍👦</span>
                        Documento del Acudiente
                        <span class="required">*</span>
                    </label>
                    <input 
                        type="text" 
                        id="idAcudiente" 
                        name="idAcudiente" 
                        placeholder="Ej: 1234567890"
                        required
                    >
                    <span class="error-message" id="errorAcudiente"></span>
                </div>

                <div class="form-group">
                    <label for="idGrupo">
                        <span class="label-icon">👥</span>
                        Grupo
                        <span class="required">*</span>
                    </label>
                    <select id="idGrupo" name="idGrupo" required>
                        <option value="">Selecciona tu grupo</option>
                        <option value="1">11-A</option>
                        <option value="2">11-B</option>
                        <option value="3">11-C</option>
                        <option value="4">10-A</option>
                        <option value="5">10-B</option>
                        <option value="6">9-A</option>
                        <option value="7">9-B</option>
                    </select>
                    <span class="error-message" id="errorGrupo"></span>
                </div>

                <div class="form-group">
                    <label for="idEstado">
                        <span class="label-icon">✅</span>
                        Estado
                        <span class="required">*</span>
                    </label>
                    <select id="idEstado" name="idEstado" required>
                        <option value="">Selecciona tu estado</option>
                        <option value="1">Activo</option>
                        <option value="2">Inactivo</option>
                        <option value="3">En Proceso</option>
                        <option value="4">Retirado</option>
                    </select>
                    <span class="error-message" id="errorEstado"></span>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn-submit">
                        <span>💾</span>
                        Guardar Información
                    </button>
                </div>

                <p class="form-note">
                    <span>ℹ️</span>
                    Todos los campos son obligatorios. No podrás acceder al sistema hasta completar esta información.
                </p>
            </form>
        </div>
    </div>

    <!-- HEADER -->
    <header>
        <h1>Panel del Estudiante</h1>
        <p>Consulta tu asistencia, faltas y sanciones de manera intuitiva y moderna</p>
    </header>

    <!-- MAIN -->
    <main class="container">
        <!-- Resumen -->
        <section class="card card-summary">
            <h2>Resumen General</h2>
            <div class="stats">
                <div class="stat">
                    <span class="stat-icon">✅</span>
                    <div class="stat-label">Presentes</div>
                    <div class="stat-value">120</div>
                </div>
                <div class="stat">
                    <span class="stat-icon">❌</span>
                    <div class="stat-label">Faltas</div>
                    <div class="stat-value">8</div>
                </div>
                <div class="stat">
                    <span class="stat-icon">⏰</span>
                    <div class="stat-label">Tardanzas</div>
                    <div class="stat-value">5</div>
                </div>
                <div class="stat">
                    <span class="stat-icon">⚠️</span>
                    <div class="stat-label">Sanciones</div>
                    <div class="stat-value">2</div>
                </div>
            </div>
        </section>

        <!-- Calendario -->
        <section class="card card-calendar">
            <h2>Calendario de Asistencia</h2>
            <div class="calendar-header">
                <div class="calendar-month" id="currentMonth"></div>
            </div>
            <div id="calendar"></div>
            <div class="legend">
                <div class="legend-item">
                    <div class="legend-color" style="background:linear-gradient(135deg, #ef4444, #dc2626);"></div>
                    <span>Falta</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background:linear-gradient(135deg, #f97316, #ea580c);"></div>
                    <span>Tarde</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background:linear-gradient(135deg, #8b5cf6, #7c3aed);"></div>
                    <span>Sanción</span>
                </div>
            </div>
        </section>

        <!-- Historial -->
        <section class="card card-history">
            <h2>Historial de Registros</h2>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Tipo</th>
                            <th>Comentario</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>02/09/2025</td>
                            <td><span class="type-badge falta">❌ Falta</span></td>
                            <td>No presentó excusa</td>
                        </tr>
                        <tr>
                            <td>05/09/2025</td>
                            <td><span class="type-badge tarde">⏰ Tarde</span></td>
                            <td>Retraso de transporte</td>
                        </tr>
                        <tr>
                            <td>09/09/2025</td>
                            <td><span class="type-badge sancion">⚠️ Sanción</span></td>
                            <td>Suspensión por 1 día</td>
                        </tr>
                        <tr>
                            <td>15/09/2025</td>
                            <td><span class="type-badge presente">✅ Presente</span></td>
                            <td>Asistencia completa</td>
                        </tr>
                        <tr>
                            <td>18/09/2025</td>
                            <td><span class="type-badge tarde">⏰ Tarde</span></td>
                            <td>Retraso justificado</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <button class="btn">
                <span>📊</span>
                Descargar Reporte Completo
            </button>
        </section>
    </main>

    <!-- PASAR DATOS PHP A JAVASCRIPT -->
    <script>
        const datosEstudianteFromPHP = <?php echo $datosEstudianteJSON; ?>;
    </script>
    <script src="../js/estudiante.js"></script>
</body>
</html>