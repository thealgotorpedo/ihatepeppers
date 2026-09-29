<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'db.php';

$rawInput = file_get_contents("php://input");
$inData = json_decode($rawInput, true);

if (!isset($inData['login']) || !isset($inData['password'])) {
    http_response_code(400);
    echo json_encode(["id" => 0, "error" => "Login and password required."]);
    exit();
}

$login = trim($inData['login']);
$password = $inData['password'];

try {
    $sql = "SELECT id, firstName, lastName, password, isAdmin, isSuspended FROM users WHERE login = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$login]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        
        // Block suspended users immediately
        if ($user['isSuspended']) {
            http_response_code(403);
            echo json_encode(["id" => 0, "error" => "Account suspended by administrator."]);
            exit();
        }

        // Successful login
        http_response_code(200);
        echo json_encode([
            "id" => (int)$user['id'],
            "firstName" => $user['firstName'],
            "lastName" => $user['lastName'],
            "isAdmin" => (bool)$user['isAdmin'],
            "error" => ""
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["id" => 0, "error" => "Invalid credentials."]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["id" => 0, "error" => "Server database error."]);
}
?>