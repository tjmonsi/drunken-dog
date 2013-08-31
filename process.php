<?php
/**
 * Created by JetBrains PhpStorm.
 * User: tjmonsi
 * Date: 31/8/13
 * Time: 12:29 AM
 * To change this template use File | Settings | File Templates.
 */

require_once('php/connect_to_mongo.php');
require_once('php/config.php');

$dbase = MongoConnect($username, $pwd, $host, $db);
$user = null;
$col = $dbase->selectCollection('user_account');

if (!empty($_POST)) {
    $user = $_POST['user'];
    //echo "hello";
} else {
    header("Location: index.php");
    /* Make sure that code below does not get executed when we redirect. */
    exit;
}
//echo $user;
if (check($col, 'id', $user)) {
    $data = getOne($col, 'id', $user);
    //var_dump($data);
    //exit;
    if ($data['activate']==1) {
        $newd = array('activate'=>2, 'start_time'=> date(DATE_RFC822));
        $res = updateOne($col, 'id', $user, $newd);
        if ($res==0) {
            setcookie("user", $user, time()+(3600*3));
            setcookie("test", $data["test"]);
            header("Location: start.php");
            exit;
        } else {
            $message = "'".$user."' account has an error in updating it... maybe multiple accounts...";
            header("Location: index.php?message=".$message);
            exit;
        }

    } elseif ($data['activate']==2) {
        $message = "'".$user."' is being used. He is currently doing the test right now";
        header("Location: index.php?message=".$message);
        exit;
    } elseif ($data['activate']==3) {
        $message = "'".$user."' has been used. We do not allow re-using this usernumber";
        header("Location: index.php?message=".$message);
        exit;
    } else {
        $message = "'".$user." ".$data['activate'].' '.$data['id']."' has an error... Please use another username";
        //var_dump($data);
        header("Location: index.php?message=".$message);
        exit;
    }



} else {
    //echo "hello";
    $message = "'".$user."' doesn't exists in db...<br/>please wait for this username to be activated";
    header("Location: index.php?message=".$message);
    exit;
}

?>