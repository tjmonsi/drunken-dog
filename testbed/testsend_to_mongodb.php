<?php
/**
 * Created by JetBrains PhpStorm.
 * User: tjmonsi
 * Date: 31/8/13
 * Time: 1:18 AM
 * To change this template use File | Settings | File Templates.
 */

/*function MongoConnect($username, $password, $database, $host) {
    echo "test2";

    $con = new Mongo("mongodb://{$username}:{$password}@{$host}"); // Connect to Mongo Server
    $db = $con->selectDB($database); // Connect to Database
    echo $con;
    /*
    $string = file_get_contents("../data/myosin_actin1.json");
    echo $string;

    $data = json_decode($string);

    $collection = $db->test;

    $collection->insert($data);

    echo "hello there";
}*/

try
{
    $connection = new Mongo('mongodb://tjmonsi_drunken:drunken_machine@ds041178.mongolab.com:41178/drunken_dog_1');
    $database   = $connection->selectDB('drunken_dog_1');

    //$list = $database->listCollections();
    //foreach ($list as $collection) {
    //    echo "removing $collection... ";
    //    //collection->drop();
    //    echo "gone\n";
   // //}


    $collection = $database->selectCollection('test');
    //echo $collection;

}
catch(MongoConnectionException $e)
{
    die("Failed to connect to database ".$e->getMessage());
}
//echo "all working fine";

echo $collection;
$cursor = $collection->find();

//echo $cursor;

//echo json_encode($cursor);

while ($cursor->hasNext()) {
    $task = $cursor->getNext();
    echo json_encode($task);
    echo $task['id'];
    echo "<br/>-------<br/>";
}

$json = "{\"id\": \"help\", \"this\":\"is the only way\"}";
echo $json."<br/>";

$json = '{"a":1,"b":2,"c":3,"d":4,"e":5}';

$json = '{"id": "newone", "this": "is the only way"}';


//var_dump(json_decode($json));
//var_dump(json_decode($json, true));


try {
    $data = json_decode($json, true);
    echo $data['id'];
    //echo "<br/>".$data."</br>";
    echo "is there?";

    if ($collection->count(array('id'=>$data['id']))<1) {
        $collection->insert($data);
    } else {
        echo "<br/>already there<br/>";
        echo $collection->count(array('id'=>$data['id']));
    }

} catch(ErrorException $e) {
    echo "error";
    die($e->getMessage());
}
echo "success?";

$cursor = $collection->find(array('id'=>'newone'));

while ($cursor->hasNext()){
    $task = $cursor->getNext();
    var_dump($task);
}
//echo $cursor = $collection->find();
