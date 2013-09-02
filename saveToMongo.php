<?php
if (empty($_POST)) {
    echo "No Post";
    exit;
}

$collectionname = $_POST['type'];
$somecontent = $_POST["data"];
$pk_key = $_POST['pk_key'];
$pk_val = $_POST['pk_val'];

require_once('php/connect_to_mongo.php');
require_once('php/config.php');

$dbase = MongoConnect($username, $pwd, $host, $db);
$user = null;
$col = $dbase->selectCollection($collectionname);

$data = json_decode($somecontent, true);
$res = updateOne($col, $pk_key, $pk_val, $data);

if ($res==0) {
    echo "Success, wrote ($somecontent) to MongoDB";

    insert($dbase->selectCollection('systemlog'), 'id', rand(0, 100), array("string"=>"Success of some kind", "data"=>$data));

} else {
    echo "Something went wrong";
    insert($dbase->selectCollection('systemlog'), 'id', rand(0, 100), array("string"=>"Something went wrong", "data"=>$data));
}
// Let's make sure the file exists and is writable first.
/*if (is_writable($filename)) {

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
}*/




echo "Success, wrote ($somecontent) to MongoDB";

?>