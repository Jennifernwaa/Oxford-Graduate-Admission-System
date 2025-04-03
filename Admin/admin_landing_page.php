<?php
session_start();
if(!isset($_SESSION["username"]))
{
	header("location:login_page.php");
}

?>

<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>

<h1>THIS IS ADMIN HOME PAGE</h1><?php echo $_SESSION["username"] ?>

<a href="logout.php">Logout</a>
</body>
</html>