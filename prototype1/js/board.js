/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 6/21/13
 * Time: 4:35 PM
 * To change this template use File | Settings | File Templates.
 */
"use strict";

/*
 *  Board object
 */

var Board = function(parent) {
    var element = create_element("div", "board");
    parent.append(element);
    this.element = $("div#board");

    //this.element.click($.proxy(this.on_click, this));

    /*this.element.hover($.proxy(this.on_mouse_in, this), $.proxy(this.on_mouse_out, this));
    this.element.mousemove($.proxy(this.on_mouse_in, this));      */
}

Board.prototype = {
    on_click: function(event){

    },

    on_mouse_in: function(event){

    },

    on_mouse_out: function(event){

    }

}