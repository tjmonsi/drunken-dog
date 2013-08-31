<?php
/**
 * Created by JetBrains PhpStorm.
 * User: tjmonsi
 * Date: 31/8/13
 * Time: 1:37 PM
 * To change this template use File | Settings | File Templates.
 */

//ds041178.mongolab.com:41178
function MongoConnect($username, $password, $host, $db) {
    try {
        $connection = new Mongo('mongodb://'.$username.':'.$password.'@'.$host.'/'.$db);
        return $connection->selectDB($db);
    } catch(MongoConnectionException $e) {
        die("Failed to connect to database ".$e->getMessage());
    }
}

function insert($collection, $primarykey_name, $primarykey_val, $data) {
    if ($collection->count(array($primarykey_name=>$primarykey_val))<1) {
        $collection->insert($data);
        return 0;
    } else {
        return 1;
    }
}

function updateOne($collection, $pk_name, $pk_val, $data) {
    if ($collection->count(array($pk_name=>$pk_val))<1) {
        $collection->insert($data);
        return 0;
    } else if ($collection->count(array($pk_name=>$pk_val))==1) {
        $collection->update(array($pk_name=>$pk_val), array('$set' => $data));
        return 0;
    } else {
        return 1;
    }
}

function check($collection, $pk_name, $pk_val) {
    if ($collection->count(array($pk_name=>$pk_val))<1) {
        return false;
    } else {
        return true;
    }
}

function getOne($collection, $pk_name, $pk_val) {
    if ($collection->count(array($pk_name=>$pk_val))==1) {
        //var_dump(array($pk_name=>$pk_val));
        $cursor = $collection->find(array($pk_name=>$pk_val));
        if ($cursor->hasNext()) {
            return $cursor->getNext();
        }
        return 3;
    } else {
        return 2;
    }
}