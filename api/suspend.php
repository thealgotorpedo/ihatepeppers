<?php
header("Content-Type: application/json; charset=UTF-8");
require_once 'db.php';

$inData = json_decode(file_get_contents("php://input"), true);

try {
    $stmt = $conn->prepare("UPDATE users SET isSuspended = TRUE WHERE login = ?");
    $stmt->execute([$inData['targetLogin']]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(["error" => ""]);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "User not found."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to suspend user."]);
}
?>