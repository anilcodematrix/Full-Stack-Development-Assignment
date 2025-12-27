<?php 
include 'db.php';

// Get the student ID
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id > 0) {
    // First, get student info for potential logging
    $stmt = $conn->prepare("SELECT name FROM students WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $student = $result->fetch_assoc();
        $student_name = $student['name'];
        
        // Delete the student
        $deleteStmt = $conn->prepare("DELETE FROM students WHERE id = ?");
        $deleteStmt->bind_param("i", $id);
        
        if ($deleteStmt->execute()) {
            // Optional: Log the deletion (you could add a log table)
            // $logStmt = $conn->prepare("INSERT INTO deletion_logs (student_id, student_name, deleted_at) VALUES (?, ?, NOW())");
            // $logStmt->bind_param("is", $id, $student_name);
            // $logStmt->execute();
            
            // Redirect with success parameter
            header("Location: index.php?deleted=1&name=" . urlencode($student_name));
        } else {
            header("Location: index.php?error=delete_failed");
        }
        
        $deleteStmt->close();
    } else {
        header("Location: index.php?error=student_not_found");
    }
    
    $stmt->close();
} else {
    header("Location: index.php?error=invalid_id");
}

exit();
?>