<?php
/**
 * Created by JetBrains PhpStorm.
 * User: tjmonsi
 * Date: 31/8/13
 * Time: 10:47 PM
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
$ref = $_COOKIE["user"];
$env = $_COOKIE["env"];
?>
<!DOCTYPE html>
<html>
<head>
    <title>TestBed for Interactive Video</title>
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
        #text1 {
            text-align: left !important;
        }


    </style>
</head>
<body>

<div id="centerCenter">
    <div id="centerForm">
        <form method="post" action="pre_test.php">
            <div id="text1">
                The test will start... 
                <br/>Ref# <?php echo $ref; ?> 
                <br/>Sys# <?php echo $env; ?><br/><br/>

                We will start by doing a pre-test. This test measures your knowledge about the topic you will learn later.
                <br/>Don't worry if you don't know anything yet. We just want to know how much you know about the topic.<br/>
                <br/>If you have questions, please feel free to ask the investigator for this experiment run.
                <br/>If you are ready. Click the start button below.
            </div>
            <div>

            </div>

            <div>
                <input id="submitButton" type="submit" value="Start"/>
            </div>
        </form>
    </div>
</div>

</body>
</html>