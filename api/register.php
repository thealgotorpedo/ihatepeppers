<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'db.php';

// Helper to grab raw JSON body
$rawInput = file_get_contents("php://input");
$inData = json_decode($rawInput, true);

if (!isset($inData['firstName']) || !isset($inData['lastName']) || !isset($inData['login']) || !isset($inData['password'])) {
    http_response_code(400);
    echo json_encode(["error" => "All fields are required."]);
    exit();
}

$firstName = trim($inData['firstName']);
$lastName  = trim($inData['lastName']);
$login     = trim($inData['login']);
$password  = $inData['password'];

if (empty($firstName) || empty($lastName) || empty($login) || empty($password)) {
    http_response_code(400);
    echo json_encode(["error" => "Fields cannot be blank."]);
    exit();
}

try {
    // Check if username is already taken
    $checkQuery = "SELECT id FROM users WHERE login = ?";
    $checkStmt = $conn->prepare($checkQuery);
    $checkStmt->execute([$login]);

    if ($checkStmt->fetch()) {
        http_response_code(409);
        echo json_encode(["error" => "Username already exists."]);
        exit();
    }

    // Hash password and insert
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $insertQuery = "INSERT INTO users (firstName, lastName, login, password) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($insertQuery);
    $stmt->execute([$firstName, $lastName, $login, $hashedPassword]);

    $newId = (int)$conn->lastInsertId();

    // 201 Created requirement
    http_response_code(201);
    echo json_encode([
        "id" => $newId,
        "message" => "Registration successful.",
        "error" => ""
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error during registration."]);
}
?>