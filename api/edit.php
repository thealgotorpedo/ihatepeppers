<?php
header("Content-Type: application/json; charset=UTF-8");
require_once 'db.php';

$inData = json_decode(file_get_contents("php://input"), true);

try {
    $stmt = $conn->prepare("UPDATE contacts SET firstName = ?, lastName = ?, phone = ?, email = ?, hated_pepper = ? WHERE id = ?");
    $stmt->execute([
        $inData['firstName'], 
        $inData['lastName'], 
        $inData['phone'], 
        $inData['email'], 
        $inData['hatedPepper'], 
        $inData['id']
    ]);
    echo json_encode(["error" => ""]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to update contact."]);
}
?>