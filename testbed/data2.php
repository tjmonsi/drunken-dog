<?php
$filename = 'data/'.$_POST['file'];

$handle = fopen($filename, 'w') or die('Cannot open file:  '.$my_file);
$fclose($filename);
//$filename = 'test.txt';
$somecontent = $_POST["data"];

// Let's make sure the file exists and is writable first.
if (is_writable($filename)) {

    // In our example we're opening $filename in append mode.
    // The file pointer is at the bottom of the file hence
    // that's where $somecontent will go when we fwrite() it.
    if (!$handle = fopen($filename, 'w')) {
         echo "Cannot open file ($filename)";
         exit;
    }

    // Write $somecontent to our opened file.
    if (fwrite($handle, $somecontent) === FALSE) {
        echo "Cannot write to file ($filename)";
        exit;
    }

    echo "Success, wrote ($somecontent) to file ($filename)";

    fclose($handle);

} else {
    //header("Content-type: text/json");
    //header("Content-Disposition", "attachment; filename=data.json");
    //header("Pragma: no-cache");
    //header("Expires: 0");
    echo "The file '$filename' is not writable\n";
    echo "$somecontent";
}
?>