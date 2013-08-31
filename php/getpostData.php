<?php
/**
 * Created by JetBrains PhpStorm.
 * User: tjmonsi
 * Date: 31/8/13
 * Time: 9:13 PM
 * To change this template use File | Settings | File Templates.
 */

function getPost() {
    if (!empty($_POST)) {
        // handle post data
        return $_POST;
    } else {
        return null;
    }
}