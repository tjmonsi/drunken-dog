<?php
/**
 * Created by JetBrains PhpStorm.
 * User: tjmonsi
 * Date: 5/9/13
 * Time: 4:32 PM
 * To change this template use File | Settings | File Templates.
 */

$past = time() - 3600*3;
foreach ( $_COOKIE as $key => $value )
{
    $value = '';
    setcookie( $key, $value, $past );
    setcookie( $key, $value, $past, '/' );
    unset($_COOKIE[$key]);
}

header("Location: index.php");