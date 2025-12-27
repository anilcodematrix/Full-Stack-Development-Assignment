// Start session for storing form data between redirects
session_start();

// Initialize variables
$errors = [];
$success_message = '';
$error_message = '';

// Define JSON file path
$json_file = 'users.json';

// Function to validate email
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Function to validate password strength
function validatePassword($password) {
    // Minimum 8 characters, at least one uppercase, one lowercase, one number and one special character
    $pattern = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/';
    return preg_match($pattern, $password);
}

// Process form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get and sanitize form data
    $name = trim($_POST['name'] ?? '');
    $email = strtolower(filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL));
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? ''; 
    
    // Validate name
    if (empty($name)) {
        $errors['name'] = 'Name is required';
    } elseif (strlen($name) < 2) {
        $errors['name'] = 'Name must be at least 2 characters long';
    }
    
    // Validate email
    if (empty($email)) {
        $errors['email'] = 'Email is required';
    } elseif (!validateEmail($email)) {
        $errors['email'] = 'Please enter a valid email address';
    }
    
    // Validate password
    if (empty($password)) {
        $errors['password'] = 'Password is required';
    } elseif (!validatePassword($password)) {
        $errors['password'] = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }
    
    // Validate confirm password
    if (empty($confirm_password)) {
        $errors['confirm_password'] = 'Please confirm your password';
    } elseif ($password !== $confirm_password) {
        $errors['confirm_password'] = 'Passwords do not match';
    }

    // Validate terms checkbox
    if (empty($_POST['terms'])) {
        $errors['terms'] = 'You must agree to the Terms & Conditions';
    }
    
    // If no validation errors, process registration
    if (empty($errors)) {
        try {
            // Check if JSON file exists, if not create it with empty array
            if (!file_exists($json_file)) {
                if (file_put_contents($json_file, json_encode([]), LOCK_EX) === false) {
                    error_log('Could not create users file: ' . $json_file);
                    throw new Exception('Could not create users file');
                }
            }
            
            // Read existing users
            $json_data = file_get_contents($json_file);
            if ($json_data === false) {
                error_log('Could not read users file: ' . $json_file);
                throw new Exception('Could not read users file');
            }
            
            $users = json_decode($json_data, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                error_log('JSON decode error in users.json: ' . json_last_error_msg());
                throw new Exception('Error decoding JSON data');
            }
            
            // Check if email already exists
            foreach ($users as $user) {
                if (isset($user['email']) && strtolower($user['email']) === $email) {
                    throw new Exception('Email already registered');
                }
            }
            
            // Hash the password
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            
            // Create user array
            $new_user = [
                'id' => uniqid('user_', true),
                'name' => htmlspecialchars($name, ENT_QUOTES, 'UTF-8'),
                'email' => $email,
                'password' => $hashed_password,
                'registered_at' => date('Y-m-d H:i:s')
            ];
            
            // Add new user to array
            $users[] = $new_user;
            
            // Write back to JSON file
            $json_result = json_encode($users, JSON_PRETTY_PRINT);
            if ($json_result === false) {
                error_log('Error encoding JSON result: ' . json_last_error_msg());
                throw new Exception('Error encoding JSON data');
            }
            
            if (file_put_contents($json_file, $json_result, LOCK_EX) === false) {
                error_log('Could not save user data to file: ' . $json_file);
                throw new Exception('Could not save user data');
            }
            
            // Set success message
            $success_message = 'Registration successful! Welcome, ' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '!';
            
            // Clear form data
            $_POST = [];
            
        } catch (Exception $e) {
            error_log('Registration error: ' . $e->getMessage());
            $error_message = 'Registration failed. Please try again later.';
        }
    }
}

// Include the HTML file to display the form
include 'registration.html';