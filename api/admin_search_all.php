<?php
header("Content-Type: application/json; charset=UTF-8");
require_once 'db.php';
$inData = json_decode(file_get_contents("php://input"), true);
$search = "%" . $inData['search'] . "%";
try {
    $stmt = $conn->prepare("SELECT c.*, u.login as owner FROM contacts c JOIN users u ON c.userId = u.id WHERE c.firstName LIKE ? OR c.lastName LIKE ? OR u.login LIKE ?");
    $stmt->execute([$search, $search, $search]);
    echo json_encode(["results" => $stmt->fetchAll(), "error" => ""]);
} catch (PDOException $e) {
    echo json_encode(["error" => "Global search failed."]);
}
?>