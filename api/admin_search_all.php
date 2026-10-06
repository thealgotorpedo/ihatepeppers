<?php
header("Content-Type: application/json; charset=UTF-8");
require_once 'db.php';
$inData = json_decode(file_get_contents("php://input"), true);
$search = "%" . $inData['search'] . "%";
try {
    // Query users table instead of contacts
    $stmt = $conn->prepare("SELECT id, firstName, lastName, login, isAdmin, isSuspended FROM users WHERE firstName LIKE ? OR lastName LIKE ? OR login LIKE ?");
    $stmt->execute([$search, $search, $search]);
    echo json_encode(["results" => $stmt->fetchAll(PDO::FETCH_ASSOC), "error" => ""]);
} catch (PDOException $e) {
    echo json_encode(["error" => "Global search failed."]);
}
?>