<?php 
include 'db.php';

$id = $_GET['id'];

$result = $conn->prepare("SELECT * FROM students WHERE id = ?");
$result->bind_param("i", $id);
$result->execute();
$data = $result->get_result()->fetch_assoc();

if ($_SERVER['REQUEST_METHOD'] == "POST") {

    $name  = $_POST['name'];
    $email = $_POST['email'];
    $course = $_POST['course'];

    $update = $conn->prepare("UPDATE students SET name=?, email=?, course=? WHERE id=?");
    $update->bind_param("sssi", $name, $email, $course, $id);
    $update->execute();

    header("Location: index.php");
    exit();
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Edit Student</title>
</head>
<body>

<h2>Edit Student</h2>

<form method="POST">
    Name: <input type="text" name="name" value="<?= $data['name']; ?>" required><br><br>
    Email: <input type="email" name="email" value="<?= $data['email']; ?>" required><br><br>
    Course: <input type="text" name="course" value="<?= $data['course']; ?>" required><br><br>

    <button type="submit">Update</button>
</form>

</body>
</html>
