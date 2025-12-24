<?php
include 'connection.php';

$name = $_POST['name'];
$mobile = $_POST['mobile'];
$eventdate = $_POST['eventdate'];
$venue = $_POST['venue'];
$extraInfo = $_POST['additionalinstruction'];

$query = "INSERT INTO `eventform`(`name`, `mobile`, `eventDate`, `venue` , `additionalinfo`) VALUES('$name', '$mobile', '$eventdate', '$venue','extraInfo')";
$result = mysqli_query($conn, $query);

if($result)
{
    echo ("<SCRIPT LANGUAGE='JavaScript'>
    window.alert('Thank You !!')
    window.location.href='javascript:history.go(-1)';
    </SCRIPT>");
    header("Location: ./ws.html");
}
else
{
    echo ("<SCRIPT LANGUAGE='JavaScript'>
    window.alert('Try Again !!')
    window.location.href='javascript:history.go(-1)';
    </SCRIPT>");
    header("Location: ./service.html");
}


?>