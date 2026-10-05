<?php
header("Content-Type: application/json; charset=UTF-8");
require_once 'db.php';
$inData = json_decode(file_get_contents("php://input"), true);
try {
    $hash = password_hash($inData['password'], PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO users (firstName, lastName, login, password, isAdmin, isSuspended) VALUES (?, ?, ?, ?, TRUE, FALSE)");
    $stmt->execute([$inData['firstName'], $inData['lastName'], $inData['login'], $hash]);
    echo json_encode(["error" => ""]);
} catch (PDOException $e) {
    echo json_encode(["error" => "Failed to create admin account."]);
}
?>