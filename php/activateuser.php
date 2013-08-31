<?php
/**
 * Created by JetBrains PhpStorm.
 * User: tjmonsi
 * Date: 31/8/13
 * Time: 9:09 PM
 * To change this template use File | Settings | File Templates.
 *
 */

require_once('connect_to_mongo.php');
require_once('config.php');

$dbase = MongoConnect($username, $pwd, $host, $db);
$user = null;
$col = $dbase->selectCollection('user_account');
if (!empty($_POST)) {
    $user = $_POST['user'];
    $test = $_POST['testType'];
}
$message =null;
if ($user!=null) {

    $data = array('id'=> $user, 'activate' => 1, "test" =>  $test);
    $res = insert($col, 'id', $user, $data);
    if ($res==0) {
        $message = "User has been successfully activated";
    } else {
        $message = "User is already activated";
    }
}

?>

<!DOCTYPE html>
<html>
<head>
    <title>Activate users for Interactive Video</title>
    <style>
        body {
            margin: auto;
            text-align: center;
            font-family: "Arial";
            color: black;
            background-color: #DDDDDD;
        }

        #centerCenter {
            margin: auto;
            text-align: center;

        }

        #centerForm {
            text-align: left;
            margin: 0 auto;
            width: 500px;
            margin-top: 200px;

        }

        #centerForm div {
            margin: 20px;
            text-align: center;
        }

        #centerForm input#submitButton {
            font-size: 20px;
        }


    </style>
</head>
<body>

<div id="centerCenter">
    <div id="centerForm">
        <form method="post" action="activateuser.php">
            <div id ="Collection">
                <div id="CollectionTitle">
                    These are the users that has been activate:
                </div>
                <?
                $cursor = $col->find();
                while ($cursor->hasNext()) {

                    $d = $cursor->getNext();
                    ?>
                    <div>
                        <span>
                            <?
                                echo $d['id'];
                            ?>
                        </span>:::
                        <span>
                            <?
                                if ($d['activate']==1) {
                                    echo " waiting to be active ---- test: ";
                                    echo $d['test'];
                                } elseif ($d['activate']==2) {
                                    echo " is working on the test environment... started at: ";
                                    echo $d['start_time'];
                                    echo " ---- test: ";
                                    echo $d['test'];
                                } elseif ($d['activate']==3) {
                                    echo " is done doing the test environment... started at: ";
                                    echo $d['start_time'];
                                    echo " finished at: ";
                                    echo $d['end_time'];
                                    echo " ---- test: ";
                                    echo $d['test'];
                                } else {
                                    echo "something is wrong with this account";
                                }
                            ?>
                        </span>
                    </div>

                <?
                }
                ?>

            </div>
            <div id="Message">
                <?
                if ($message!=null) { echo $message; }
                 ?>
            </div>
            <div id="text1">
                To activate user, please write your user number here...
            </div>
            <div>
                <span>User number: </span><input type="text" name="user"/>&nbsp;&nbsp;
                <span>Test type: </span>
                <select name="testType">
                    <option value="ab">AB</option>
                    <option value="ba">BA</option>
                </select>

            </div>
            <div>
                <input id="submitButton" type="submit" value="activate"/>
            </div>
        </form>
    </div>
</div>

</body>
</html>