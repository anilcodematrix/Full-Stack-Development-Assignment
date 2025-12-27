<?php include 'db.php';

if ($_SERVER['REQUEST_METHOD'] == "POST") {

    $name  = $_POST['name'];
    $email = $_POST['email'];
    $course = $_POST['course'];

    // prepared statement (security)
    $stmt = $conn->prepare("INSERT INTO students (name, email, course) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $name, $email, $course);
    $stmt->execute();

    header("Location: index.php");
    exit();
}

?>

<!DOCTYPE html>
<html>
<head>
    <title>Add Student</title>
</head>
<body>

<h2>Add New Student</h2>

<form method="POST">
    Name: <input type="text" name="name" required><br><br>
    Email: <input type="email" name="email" required><br><br>
    Course: <input type="text" name="course" required><br><br>
    <button type="submit">Add Student</button>
</form>

</body>
</html>
