<?php
header("Content-Type: application/json; charset=UTF-8");
require_once 'db.php';
$inData = json_decode(file_get_contents("php://input"), true);

try {
    $stmt = $conn->prepare("SELECT id, firstName, lastName, password, isAdmin, isSuspended FROM users WHERE login = ?");
    $stmt->execute([$inData['login']]);
    
    if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        
        // 1. Check if the user was suspended by an admin
        if ($row['isSuspended']) {
            echo json_encode(["error" => "Account suspended by administrator"]);
            exit();
        }
        
        // 2. Verify password and return the isAdmin flag from the database
        if ($inData['password'] === $row['password'] || password_verify($inData['password'], $row['password'])) {
            echo json_encode([
                "id" => $row['id'],
                "firstName" => $row['firstName'],
                "lastName" => $row['lastName'],
                "isAdmin" => $row['isAdmin'] ? "true" : "false", 
                "error" => ""
            ]);
        } else {
            echo json_encode(["error" => "Incorrect password."]);
        }
    } else {
        echo json_encode(["error" => "User not found."]);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => "API Error."]);
}
?>