<?php

define('STUDENTS_FILE', 'students.txt');

function formatName(string $name): string {
    return ucwords(trim($name)); // [cite: 29]
}

function validateEmail(string $email): bool {
    return filter_var(trim($email), FILTER_VALIDATE_EMAIL) !== false; // [cite: 30]
}

function cleanSkills(string $string): string {
    $cleaned = preg_replace('/\s*,\s*/', ',', $string);
    return strtolower(trim($cleaned)); // [cite: 31]
}

function saveStudent(string $name, string $email, array $skillsArray): bool {
    $skills_string = implode(';', $skillsArray);
    $student_data = $name . "," . $email . "," . $skills_string . "\n"; // [cite: 32]

    try {
        if (file_put_contents(STUDENTS_FILE, $student_data, FILE_APPEND | LOCK_EX) !== false) { // [cite: 14]
            return true;
        } else {
            throw new Exception("Could not write data to " . STUDENTS_FILE);
        }
    } catch (Exception $e) { // [cite: 15]
        error_log("File Save Error: " . $e->getMessage());
        return false;
    }
}

function uploadPortfolioFile(array $file): string|false { // [cite: 33]
    $allowed_types = ['application/pdf', 'image/jpeg', 'image/png']; // [cite: 17]
    $max_size = 2 * 1024 * 1024; // 2MB [cite: 18]
    $upload_dir = __DIR__ . '/uploads/'; // [cite: 20]

    if ($file['error'] !== UPLOAD_ERR_OK) {
        return false;
    }

    try {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime_type = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mime_type, $allowed_types)) {
            throw new Exception("Invalid file format. Only PDF, JPG, and PNG are allowed."); // [cite: 17]
        }

        if ($file['size'] > $max_size) {
            throw new Exception("File size exceeds 2MB limit."); // [cite: 18]
        }

        $file_info = pathinfo($file['name']);
        $extension = $file_info['extension'];
        $new_file_name = uniqid('portfolio_', true) . '_' . time() . '.' . strtolower($extension); // [cite: 19]

        if (!is_dir($upload_dir)) {
            if (!mkdir($upload_dir, 0777, true)) {
                throw new Exception("Failed to create upload directory: " . $upload_dir); // [cite: 21]
            }
        }

        $destination = $upload_dir . $new_file_name;
        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            throw new Exception("Error moving the uploaded file.");
        }

        return $new_file_name;

    } catch (Exception $e) { // [cite: 21]
        echo "<p style='color: red;'>Upload Error: " . htmlspecialchars($e->getMessage()) . "</p>";
        error_log("Upload Error: " . $e->getMessage());
        return false;
    }
}
?>