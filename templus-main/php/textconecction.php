<?php
// Archivo para probar la conexión
// Guarda esto como test_connection.php en la misma carpeta

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Test de Conexión - Templus</h2>";

// Configuración de base de datos
$servidor = "localhost";
$usuario = "root";
$clave = "";
$base = "templus";

echo "<p><strong>Intentando conectar con:</strong></p>";
echo "<ul>";
echo "<li>Servidor: $servidor</li>";
echo "<li>Usuario: $usuario</li>";
echo "<li>Base de datos: $base</li>";
echo "</ul>";

// Test de conexión
$enlace = @mysqli_connect($servidor, $usuario, $clave, $base);

if (!$enlace) {
    echo "<p style='color: red;'><strong>❌ Error de conexión:</strong> " . mysqli_connect_error() . "</p>";
    
    // Intentar conectar sin especificar base de datos
    $enlace_sin_bd = @mysqli_connect($servidor, $usuario, $clave);
    if ($enlace_sin_bd) {
        echo "<p style='color: orange;'><strong>⚠️ Conexión OK, pero la base de datos 'templus' no existe</strong></p>";
        
        // Mostrar bases de datos disponibles
        $result = mysqli_query($enlace_sin_bd, "SHOW DATABASES");
        echo "<p><strong>Bases de datos disponibles:</strong></p>";
        echo "<ul>";
        while ($row = mysqli_fetch_array($result)) {
            echo "<li>" . $row[0] . "</li>";
        }
        echo "</ul>";
        
        mysqli_close($enlace_sin_bd);
    } else {
        echo "<p style='color: red;'><strong>❌ No se puede conectar al servidor MySQL</strong></p>";
        echo "<p>Verifica que XAMPP esté corriendo y MySQL esté activo</p>";
    }
} else {
    echo "<p style='color: green;'><strong>✅ Conexión exitosa!</strong></p>";
    
    // Verificar si existe la tabla usuario
    $result = @mysqli_query($enlace, "SHOW TABLES LIKE 'usuario'");
    if (mysqli_num_rows($result) == 0) {
        echo "<p style='color: orange;'><strong>⚠️ La tabla 'usuario' no existe</strong></p>";
        echo "<p>Ejecuta este SQL en phpMyAdmin:</p>";
        echo "<textarea style='width: 100%; height: 200px;'>";
        echo "CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    DOCUMENTO VARCHAR(20) UNIQUE NOT NULL,
    PRIMER_NOMBRE VARCHAR(50) NOT NULL,
    SEGUNDO_NOMBRE VARCHAR(50),
    PRIMER_APELLIDO VARCHAR(50) NOT NULL,
    SEGUNDO_APELLIDO VARCHAR(50),
    CONTRASEÑA VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);";
        echo "</textarea>";
    } else {
        echo "<p style='color: green;'><strong>✅ Tabla 'usuario' existe!</strong></p>";
        
        // Mostrar estructura de la tabla
        $result = mysqli_query($enlace, "DESCRIBE usuario");
        echo "<p><strong>Estructura de la tabla:</strong></p>";
        echo "<table border='1' style='border-collapse: collapse;'>";
        echo "<tr><th>Campo</th><th>Tipo</th><th>Nulo</th><th>Clave</th></tr>";
        while ($row = mysqli_fetch_assoc($result)) {
            echo "<tr>";
            echo "<td>" . $row['Field'] . "</td>";
            echo "<td>" . $row['Type'] . "</td>";
            echo "<td>" . $row['Null'] . "</td>";
            echo "<td>" . $row['Key'] . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    }
    
    mysqli_close($enlace);
}

echo "<hr>";
echo "<p><strong>Información del servidor:</strong></p>";
echo "<ul>";
echo "<li>PHP Version: " . phpversion() . "</li>";
echo "<li>Directorio actual: " . __DIR__ . "</li>";
echo "<li>Archivo actual: " . __FILE__ . "</li>";
echo "</ul>";
?>

<script>
// Test de conectividad desde JavaScript
fetch('registro.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'test=1'
})
.then(response => response.text())
.then(data => {
    console.log('Respuesta del servidor:', data);
    document.body.innerHTML += '<p><strong>Test de conectividad JavaScript:</strong> Ver consola del navegador (F12)</p>';
})
.catch(error => {
    console.error('Error:', error);
    document.body.innerHTML += '<p style="color: red;"><strong>❌ Error de conectividad JavaScript:</strong> ' + error.message + '</p>';
});
</script><?php
// Archivo para probar la conexión
// Guarda esto como test_connection.php en la misma carpeta

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Test de Conexión - Templus</h2>";

// Configuración de base de datos
$servidor = "localhost";
$usuario = "root";
$clave = "";
$base = "templus";

echo "<p><strong>Intentando conectar con:</strong></p>";
echo "<ul>";
echo "<li>Servidor: $servidor</li>";
echo "<li>Usuario: $usuario</li>";
echo "<li>Base de datos: $base</li>";
echo "</ul>";

// Test de conexión
$enlace = @mysqli_connect($servidor, $usuario, $clave, $base);

if (!$enlace) {
    echo "<p style='color: red;'><strong>❌ Error de conexión:</strong> " . mysqli_connect_error() . "</p>";
    
    // Intentar conectar sin especificar base de datos
    $enlace_sin_bd = @mysqli_connect($servidor, $usuario, $clave);
    if ($enlace_sin_bd) {
        echo "<p style='color: orange;'><strong>⚠️ Conexión OK, pero la base de datos 'templus' no existe</strong></p>";
        
        // Mostrar bases de datos disponibles
        $result = mysqli_query($enlace_sin_bd, "SHOW DATABASES");
        echo "<p><strong>Bases de datos disponibles:</strong></p>";
        echo "<ul>";
        while ($row = mysqli_fetch_array($result)) {
            echo "<li>" . $row[0] . "</li>";
        }
        echo "</ul>";
        
        mysqli_close($enlace_sin_bd);
    } else {
        echo "<p style='color: red;'><strong>❌ No se puede conectar al servidor MySQL</strong></p>";
        echo "<p>Verifica que XAMPP esté corriendo y MySQL esté activo</p>";
    }
} else {
    echo "<p style='color: green;'><strong>✅ Conexión exitosa!</strong></p>";
    
    // Verificar si existe la tabla usuario
    $result = @mysqli_query($enlace, "SHOW TABLES LIKE 'usuario'");
    if (mysqli_num_rows($result) == 0) {
        echo "<p style='color: orange;'><strong>⚠️ La tabla 'usuario' no existe</strong></p>";
        echo "<p>Ejecuta este SQL en phpMyAdmin:</p>";
        echo "<textarea style='width: 100%; height: 200px;'>";
        echo "CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    DOCUMENTO VARCHAR(20) UNIQUE NOT NULL,
    PRIMER_NOMBRE VARCHAR(50) NOT NULL,
    SEGUNDO_NOMBRE VARCHAR(50),
    PRIMER_APELLIDO VARCHAR(50) NOT NULL,
    SEGUNDO_APELLIDO VARCHAR(50),
    CONTRASEÑA VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);";
        echo "</textarea>";
    } else {
        echo "<p style='color: green;'><strong>✅ Tabla 'usuario' existe!</strong></p>";
        
        // Mostrar estructura de la tabla
        $result = mysqli_query($enlace, "DESCRIBE usuario");
        echo "<p><strong>Estructura de la tabla:</strong></p>";
        echo "<table border='1' style='border-collapse: collapse;'>";
        echo "<tr><th>Campo</th><th>Tipo</th><th>Nulo</th><th>Clave</th></tr>";
        while ($row = mysqli_fetch_assoc($result)) {
            echo "<tr>";
            echo "<td>" . $row['Field'] . "</td>";
            echo "<td>" . $row['Type'] . "</td>";
            echo "<td>" . $row['Null'] . "</td>";
            echo "<td>" . $row['Key'] . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    }
    
    mysqli_close($enlace);
}

echo "<hr>";
echo "<p><strong>Información del servidor:</strong></p>";
echo "<ul>";
echo "<li>PHP Version: " . phpversion() . "</li>";
echo "<li>Directorio actual: " . __DIR__ . "</li>";
echo "<li>Archivo actual: " . __FILE__ . "</li>";
echo "</ul>";
?>

<script>
// Test de conectividad desde JavaScript
fetch('registro.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'test=1'
})
.then(response => response.text())
.then(data => {
    console.log('Respuesta del servidor:', data);
    document.body.innerHTML += '<p><strong>Test de conectividad JavaScript:</strong> Ver consola del navegador (F12)</p>';
})
.catch(error => {
    console.error('Error:', error);
    document.body.innerHTML += '<p style="color: red;"><strong>❌ Error de conectividad JavaScript:</strong> ' + error.message + '</p>';
});
</script>