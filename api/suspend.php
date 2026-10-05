<?php
header("Content-Type: application/json; charset=UTF-8");
require_once 'db.php';
$inData = json_decode(file_get_contents("php://input"), true);
try {
    $stmt = $conn->prepare("UPDATE users SET isSuspended = ? WHERE login = ?");
    $stmt->execute([$inData['state'], $inData['targetLogin']]);
    echo json_encode(["error" => ""]);
} catch (PDOException $e) {
    echo json_encode(["error" => "Failed to update user status."]);
}
?>