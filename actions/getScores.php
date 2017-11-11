<?php
header("content-type:application/json");
header("Access-Control-Allow-Origin: *");
include_once "config2.php";

/*
Stay in the Light v0.0.26
Last Updated: 2017-November-10
Authors: 
	William R.A.D. Funk - http://WilliamRobertFunk.com
	Jorge Rodriguez - http://jitorodriguez.com/
*/

// Create connection
$conn = new mysqli($hostname, $username, $password, $dbname);
// Check connection
if ($conn->connect_error)
{
    die("Connection failed: " . $conn->connect_error);
}
// Get top five scores
$sql = "SELECT * FROM Top_Scores ORDER BY scores DESC LIMIT 5";
$result = $conn->query($sql);

$scores = '{"scores":[';
while ( $db_row = $result->fetch_array(MYSQLI_ASSOC) )
{
	$scores .= '{"initials":"' . $db_row['initials'] . '", "score":' . $db_row['scores'] . '},';
}
$scores = rtrim($scores, ",");
$scores .= ']}';
print $scores;

$conn->close();
?>