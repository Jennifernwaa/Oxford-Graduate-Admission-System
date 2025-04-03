<?php
// Establish MySQL connection
$servername = "localhost";
$username = "root"; // MAMP default user
$password = "root"; // MAMP default password
$dbname = "users"; // Database name

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Check if form is submitted
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Safely retrieve POST data
    $username = isset($_POST['username']) ? $_POST['username'] : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';

    // Query to check if username and password match
    $sql = "SELECT * FROM login WHERE username = '$username' AND password = '$password'";
    $result = mysqli_query($conn, $sql);
    if (mysqli_num_rows($result) > 0) {
        // User found, check user type
        $row = mysqli_fetch_assoc($result); // Fetch row data

        if ($row["role"] == "user") {
            $_SESSION["username"] = $username;
            header("location: Applicant/index.php");
            exit(); // Make sure no further code is executed after header redirection

        } elseif ($row["role"] == "admin") {
            $_SESSION["username"] = $username;
            header("location: Admin/admin_landing_page.php");
            exit();

        } elseif ($row["role"] == "reviewer") {
            $_SESSION["username"] = $username;
            header("location: Reviewer/reviewer_landing_page.php");
            exit();

        } else {
            // If role doesn't match any known role
            echo "User not recognized.";
        }

    } else {
        // Username or password incorrect
        echo "Username or password incorrect";
    }
    
} else {
    echo "Please enter both username and password.";
}


// Close connection
mysqli_close($conn);
?>




<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
</head>

<body>
<header class="oxford-blue-header header">
        <img src="oxlogo-rect-border.svg" alt="logo" class="logo">
</header>
<h1>Login</h1>
<br><br>
<div style ="background-color: grey; width: 500px;">

<form action="login_page.php" method="POST">
    <div>
        <label>username</label>
        <input type="text" name="username" required>
    </div>
<br><br>

    <div>
        <label>password</label>
        <input type="password" name="password" required>
    </div>


        <input class="btn btn-warning" type="submit" value="Login">

</form>
</body>

</html>