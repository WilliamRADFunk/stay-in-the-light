<?php
header("content-type:application/json");
header("Access-Control-Allow-Origin: *");
include_once "config2.php";

/* 
Galactic Fighter Engine v0.2.2
Last Updated: 2017-August-13
Author: William R.A.D. Funk - http://WilliamRobertFunk.com 
*/

$input = file_get_contents('php://input');
$object = json_encode($input, JSON_FORCE_OBJECT);

$inputArray = explode(",", $input);
$initials = substr($inputArray[0], 13, 3);
$score = substr($inputArray[1], 8, (strlen($inputArray[1]) - 1 - 8));

// Create connection
$conn = new mysqli($hostname, $username, $password, $dbname);
// Check connection
if ($conn->connect_error)
{
    die("Connection failed: " . $conn->connect_error);
}
// If value received, send query to insert.
if(is_string($initials) && is_numeric($score))
{
	$sql = "INSERT INTO Top_Scores (initials, scores) VALUES ('" . $initials . "', '" . $score . "')";

	if($conn->query($sql) === TRUE)
	{
		echo "\nNew record successfully created.";
	}
	else
	{
		echo "\nRecord creation failed.";
	}
}
else echo "Failed to insert a new record.";

$conn->close();
?>