<?php
/**
 * Created by JetBrains PhpStorm.
 * User: tjmonsi
 * Date: 1/9/13
 * Time: 2:01 AM
 * To change this template use File | Settings | File Templates.
 */

if (!isset($_COOKIE["user"])){
    $message = "Please use a username";
    header("Location: index.php?message=".$message);
    exit;
}
if (!isset($_COOKIE["env"])){
    $message = "There's no parameter for this test...";
    header("Location: index.php?message=".$message);
    exit;
}
if (!isset($_COOKIE["trial"])){
    $message = "There's no trial parameter for this test...";
    header("Location: index.php?message=".$message);
    exit;
}
$user = $_COOKIE["user"];
$env = $_COOKIE["env"];
$trial = $_COOKIE["trial"];

require_once('php/connect_to_mongo.php');
require_once('php/config.php');

$dbase = MongoConnect($username, $pwd, $host, $db);
//$user = null;
$col = $dbase->selectCollection('user_account');

if (check($col, 'id', $user)) {
    $data = getOne($col, 'id', $user);

    if ($data['activate']==2) {
        $newd = array('activate'=>3, 'end_time'=> date(DATE_RFC822));
        $res = updateOne($col, 'id', $user, $newd);
        if ($res==0) {
            header("Location: endlast.php");
            exit;
        } else {
            $message = "'".$user."' account has an error in updating it... maybe multiple accounts...";
            header("Location: index.php?message=".$message);
            exit;
        }
    } elseif ($data['activate']==1) {
        $message = "'".$user."' how did this get passed?";
        header("Location: index.php?message=".$message);
        exit;
    } elseif ($data['activate']==3) {
        $message = "'".$user."' how did this get passed with this being done?";
        header("Location: index.php?message=".$message);
        exit;
    } else {
        $message = "'".$user."' has an error... Please use another username";
        header("Location: index.php?message=".$message);
        exit;
    }

} else {
    //echo "hello";
    $message = "'".$user."' doesn't exists in db...<br/>please wait for this username to be activated";
    header("Location: index.php?message=".$message);
    exit;
}