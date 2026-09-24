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
    $sql = "SELECT id, firstName, lastName, password FROM users WHERE login = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$login]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        // Successful login: 200 OK
        http_response_code(200);
        echo json_encode([
            "id" => (int)$user['id'],
            "firstName" => $user['firstName'],
            "lastName" => $user['lastName'],
            "error" => ""
        ]);
    } else {
        // Failed login: 401 Unauthorized
        http_response_code(401);
        echo json_encode([
            "id" => 0,
            "firstName" => "",
            "lastName" => "",
            "error" => "Invalid credentials."
        ]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "id" => 0,
        "error" => $e->getMessage()]);
}
?>
