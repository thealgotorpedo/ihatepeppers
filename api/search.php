<?php
header("Content-Type: application/json; charset=UTF-8");
require_once 'db.php';

$inData = json_decode(file_get_contents("php://input"), true);
$search = "%" . $inData['search'] . "%";

try {
    $stmt = $conn->prepare("SELECT * FROM contacts WHERE userId = ? AND (firstName LIKE ? OR lastName LIKE ?)");
    $stmt->execute([$inData['userId'], $search, $search]);
    $results = $stmt->fetchAll();
    echo json_encode(["results" => $results, "error" => ""]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Search failed."]);
}
?>