<?php
require_once 'includes/header.php';
require_once 'functions.php';

$message = '';
$error = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get raw input
    $name_raw = $_POST['name'] ?? '';
    $email_raw = $_POST['email'] ?? '';
    $skills_raw = $_POST['skills'] ?? '';

    // Handle submission using string functions and validation [cite: 12]
    $name = formatName($name_raw); 
    $email = trim($email_raw);
    $cleaned_skills = cleanSkills($skills_raw); 

    if (empty($name) || empty($email) || empty($cleaned_skills)) {
        $error = "All fields are required.";
    } elseif (!validateEmail($email)) { 
        $error = "Invalid email format.";
    } else {
        // Convert skills string into an array using explode() [cite: 13]
        $skills_array = explode(',', $cleaned_skills);
        $skills_array = array_filter($skills_array);

        // Save student info into students.txt [cite: 14]
        if (saveStudent($name, $email, $skills_array)) {
            $message = "Student record for **" . htmlspecialchars($name) . "** successfully saved!";
        } else {
            $error = "Failed to save student data due to a file error. Check server logs.";
        }
    }
}
?>

<h2>Add New Student Information</h2> <?php if ($message): ?>
    <p class="success"><?php echo $message; ?></p>
<?php endif; ?>

<?php if ($error): ?>
    <p class="error"><?php echo $error; ?></p>
<?php endif; ?>

<form action="add_student.php" method="post"> <label for="name">Name:</label><br>
    <input type="text" id="name" name="name" required><br><br>

    <label for="email">Email:</label><br>
    <input type="email" id="email" name="email" required><br><br>

    <label for="skills">Skills (comma-separated, e.g., PHP, SQL, HTML):</label><br>
    <input type="text" id="skills" name="skills" required><br><br>

    <input type="submit" value="Add Student">
</form>

<?php
require_once 'includes/footer.php';
?>