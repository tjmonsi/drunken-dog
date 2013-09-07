<?php
/**
 * Created by JetBrains PhpStorm.
 * User: tjmonsi
 * Date: 7/9/13
 * Time: 10:43 AM
 * To change this template use File | Settings | File Templates.
 */

require_once('connect_to_mongo.php');
require_once('config.php');

$dbase = MongoConnect($username, $pwd, $host, $db);
$col = $dbase->selectCollection('logs');

$arrlength = $col->count();
$array1 = $col->find();

$array2 = array();
foreach ($array1 as $vals) {
    $array2[$vals['id']] = $vals;
}

$data = json_encode($array2);
echo $data;