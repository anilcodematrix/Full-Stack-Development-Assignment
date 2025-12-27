<?php
require_once 'includes/header.php';
require_once 'functions.php'; 

function getStudents() {
    $students = [];
    
    if (file_exists(STUDENTS_FILE)) {
        // --- FIX START: Replacing problematic file() call ---
        // Safer way to read the file content as a string
        $content = file_get_contents(STUDENTS_FILE);
        if ($content === false) {
             // Basic error handling if file exists but can't be read
             error_log("Failed to read student data file.");
             return $students;
        }

        // Split the content by newline, then filter out empty lines
        $lines = explode("\n", $content);
        $lines = array_filter($lines, 'trim'); 
        // --- FIX END ---
        
        foreach ($lines as $line) {
            // Explode by the comma delimiter
            $parts = explode(',', trim($line), 3); 
            
            if (count($parts) === 3) {
                list($name, $email, $skills_string) = $parts;
                
                // Convert skills string back into an array using ';' delimiter
                $skills_array = explode(';', $skills_string);
                
                $students[] = [
                    'name' => htmlspecialchars($name),
                    'email' => htmlspecialchars($email),
                    'skills' => $skills_array, 
                ];
            }
        }
    }
    return $students;
}

$students = getStudents();
?>

<h2>View All Students</h2>

<?php if (empty($students)): ?>
    <p>No student records found yet.</p>
<?php else: ?>
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Skills</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($students as $student): ?>
                <tr>
                    <td><?php echo $student['name']; ?></td>
                    <td><?php echo $student['email']; ?></td>
                    <td>
                        <?php 
                        // Display skills from the array
                        echo implode(', ', $student['skills']); 
                        ?>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
<?php endif; ?>

<?php
require_once 'includes/footer.php';
?>