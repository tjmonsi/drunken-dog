<?php
/**
 * Created by JetBrains PhpStorm.
 * User: tjmonsi
 * Date: 1/9/13
 * Time: 12:45 AM
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
$ref = $_COOKIE["user"];
$env = $_COOKIE["env"];
$trial = $_COOKIE["trial"];

if (strcmp($env, "elbcvni")==0) {
    // start invcble
    include("main_viewer.html");
} elseif (strcmp($env, "cvinelb")==0) {
   // start other
    include("other_viewer.html");
} else {
    $message = $env." There's no parameter for this test...";
    header("Location: index.php?message=".$message);
    exit;
}