/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 6/21/13
 * Time: 3:13 PM
 * To change this template use File | Settings | File Templates.
 */
"use strict";

/* UI Start here */

var UI = {
    init: function() {
        UI.frame_width = UI.basic.width;
        UI.frame_height = UI.basic.height;
        UI.root = $("div#root");

        UI.board = new Board(UI.root);



    }
}
