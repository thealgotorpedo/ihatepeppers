<?php
header("Content-Type: application/json; charset=UTF-8");
require_once 'db.php';
try {
    $stmt = $conn->query("SELECT id, firstName, lastName, login, isAdmin, isSuspended FROM users");
    echo json_encode(["results" => $stmt->fetchAll(), "error" => ""]);
} catch (PDOException $e) {
    echo json_encode(["error" => "Failed to fetch users."]);
}
?>