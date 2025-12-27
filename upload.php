<?php
require_once 'includes/header.php';
require_once 'functions.php';

$upload_message = '';

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_FILES["portfolio_file"])) {
    // Use the custom function which handles validation, renaming, and error handling [cite: 16, 21]
    $new_file_name = uploadPortfolioFile($_FILES["portfolio_file"]);

    if ($new_file_name !== false) {
        $upload_message = "<p class='success'>File successfully uploaded! Stored as: **" . htmlspecialchars($new_file_name) . "**</p>";
    } else {
        $upload_message .= "<p class='error'>File upload failed. Please check the error message above.</p>";
    }
}
?>

<h2>Upload Student Portfolio File</h2>

<?php echo $upload_message; ?>

<p>Requirements:</p>
<ul>
    <li>Accepts only: **PDF, JPG, PNG** [cite: 17]</li>
    <li>Maximum size: **2MB** [cite: 18]</li>
</ul>

<form action="upload.php" method="post" enctype="multipart/form-data">
    <label for="portfolio_file">Select Portfolio File:</label><br>
    <input type="file" id="portfolio_file" name="portfolio_file" required><br><br>
    <input type="submit" value="Upload File">
</form>

<?php
require_once 'includes/footer.php';
?>