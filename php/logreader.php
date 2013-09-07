<?php
/**
 * Created by JetBrains PhpStorm.
 * User: tjmonsi
 * Date: 6/9/13
 * Time: 10:25 PM
 * To change this template use File | Settings | File Templates.
 */

require_once('connect_to_mongo.php');
require_once('config.php');

$dbase = MongoConnect($username, $pwd, $host, $db);
$col = $dbase->selectCollection('logs');

$arrlength = $col->count();
$array1 = $col->find();

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
            width: 1200px;
            margin-top:50px;

        }

        #centerForm div {
            margin: 20px;
            text-align: center;
        }

        #centerForm input.button {
            font-size: 20px;
            float: left;
        }
        #text1 {
            text-align: left !important;
        }

        div.button {
            float: left;
            width: 48%;
            border: 1px solid black;
            background-color: transparent;
        }

        div.button:hover {
            background-color: #00FF00;
        }

        .hide {
            display: none !important;
        }

    </style>


    <script type="text/javascript" src="../js/jquery-2.0.2.min.js"></script>
    <script type="text/javascript" src="../js/main_viewer/general_functions.js"></script>
    <script type="text/javascript" src="../js/main_viewer/base_class.js"></script>
    <script type="text/javascript" src="js/data.js"></script>

    <script type="text/javascript" >
        var run = function(){

            //log("Start running", 1);
            var root = $("body");

            // create new dataModel
            vD = new dataModel(root, "vData");

        }

        $(document).ready(run);

    </script>
</head>
<body>

<div id="centerCenter">
    <div id="centerForm">
        <div id="NavBar">
            <input id="overall" type="button" class="button" value="overall" />
            <?php
                foreach($array1 as $vals) {
                    ?>

                    <input id="<?php echo $vals['id'];?>" type="button" class="button" value="<?php echo $vals['id'];?>" />
            <?php

                }

            ?>
        </div>
        <?php
            foreach ($array1 as $vals) {
                $id = $vals['id'];
                $mainViewLog = $vals['logMainViewer'];
                $otherViewLog = $vals['logOtherViewer'];
        ?>
            <div id="<?php echo $id;?>" class="usertest">
                <div class="div_navbar">
                    <div id="<?php echo $id;?>_mainButton" class="button divleft">InVCBLE Data</div>
                    <div id="<?php echo $id;?>_otherButton" class="button divleft">Other Interface Data</div>
                </div>
                <div id="<?php echo $id;?>_content" class="div_contentArea">
                    <div id="<?php echo $id;?>_mainContent" class="div_content">
                        <div id="<?php echo $id;?>_mainSummary" class="div_summary">

                        </div>
                        <?php
                        $mainnum = count($mainViewLog);
                        foreach ($mainViewLog as $mainvals) {
                            $data = $mainvals['data'];
                            $timestamp = $mainvals['timestamp'];
                        ?>
                        <div class="div_detail">
                            <?php echo $data;?>
                            <br/>
                            <?php echo $timestamp;?>
                            <br/><br/>

                        </div>
                        <?php
                        }
                        ?>

                    </div>
                    <div id="<?php echo $id;?>_otherContent" class="div_content">

                    </div>



                </div>


            </div>
        <?php

            }
        ?>
    </div>
</div>

</body>
</html>