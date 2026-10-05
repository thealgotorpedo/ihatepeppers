<?php
require_once 'db.php';
try {
    $hash = password_hash('admin123', PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO users (firstName, lastName, login, password, isAdmin, isSuspended) VALUES ('Application', 'Administrator', 'root', ?, TRUE, FALSE)");
    $stmt->execute([$hash]);
    echo "Root admin successfully seeded. You can log in with username: root, password: admin123";
} catch (Exception $e) {
    echo "Error or root already exists: " . $e->getMessage();
}
?>