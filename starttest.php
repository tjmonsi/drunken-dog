<?php
/**
 * Created by JetBrains PhpStorm.
 * User: tjmonsi
 * Date: 31/8/13
 * Time: 11:10 PM
 * To change this template use File | Settings | File Templates.
 */
if (!isset($_COOKIE["user"])){
    $message = "Please use a username";
    header("Location: index.php?message=".$message);
    exit;
}
//var_dump($_COOKIE);
//exit;


$env = null;

$trial = "1";
if (isset($_COOKIE["env"])) {
    $env = $_COOKIE["env"];
}
if (isset($_COOKIE["trial"])){
    if (strcmp($_COOKIE["trial"],"2")==0) {
        //$trial ="n";
        header("Location: endeval_start.php");
        exit;
    } elseif (strcmp($_COOKIE["trial"],"1")==0) {
        $trial = "2";
    } elseif (strcmp($_COOKIE["trial"],"0")==0) {
            $trial = "1";

    } else {
        $message = $_COOKIE["trial"]." Something is wrong with the interface";
        header("Location: index.php?message=".$message);
        exit;
    }

}
//exit;

setcookie("trial", $trial, time()+(3600*3));

$ref = $_COOKIE["user"];
$test = $_COOKIE["test"];

//b = invcble = elbcvni
//a = udacity = cvinelb

if (strcmp($test,"ab")==0) {
    if ($env==null) {
        setcookie("env", "cvinelb", time()+(3600*3));
    } elseif (strcmp($env, "elbcvni")==0) {
        setcookie("env", "cvinelb", time()+(3600*3));
    } elseif (strcmp($env, "cvinelb")==0) {
        setcookie("env", "elbcvni", time()+(3600*3));
    } else {
        $message = $env.": something wrong with test parameters";
        header("Location: index.php?message=".$message);
        exit;
    }

} elseif (strcmp($test, "ba")==0) {
    if ($env==null) {
        setcookie("env", "elbcvni", time()+(3600*3));
    } elseif (strcmp($env, "elbcvni")==0) {
        setcookie("env", "cvinelb", time()+(3600*3));
    } elseif (strcmp($env, "cvinelb")==0) {
        setcookie("env", "elbcvni", time()+(3600*3));
    } else {
        $message = $env.": something wrong with test parameters";
        header("Location: index.php?message=".$message);
        exit;
    }
} else {
    $message = $test.": something wrong with test parameters";
    header("Location: index.php?message=".$message);
    exit;
}
//var_dump($_COOKIE);
//header("Location: testbed/catcher.php");

header("Location: pre_test_start.php");
exit;