/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 5/8/13
 * Time: 3:33 PM
 * To change this template use File | Settings | File Templates.
 */

"use strict";

/*---------------------- button_UI -------------------------*/

var context_menu = function(parent, data) {
    this.classType = "context_menu"
    this.parent = parent;
    this.data = data;

    this.start();

}

context_menu.prototype = {

    start: function() {
        if (this.parent!='test') this.init();
        else this.test();
    },

    init: function() {
        this.id = this.data.id
        this.video_id = this.data.video_id;
        this.menu_item = [];

        this.x = 0;
        this.y = 0;

        this.element = save_element(this.parent, "div", this.id, ['context_menu']);

        for (var index in this.data.object_data) {

            this.menu_item[index]=(save_element(this.element, "div", this.id+"_"+this.data.object_data[index].id, ['context_menu_item']));

            this.menu_item[index].append(this.data.object_data[index].value);

            this.menu_item[index].click($.proxy(this.data.object_data[index].callback, this));

        }

        this.element.css({"left": this.x, "top": this.y});

        this.element.addClass('hide');


        if (debug) creation_success(this.classType, this.id)
    },

    test: function(){
        var test_code = 0;

        if (test_run) {

        }

        return test_code;
    },

    destroy: function() {
        for (var key in this) {
            if (this[key].classType!=null) {
                this[key].destroy();
            }
        }

        //add more here


        // this should be last
        vData.delete_instance(this.id);
    },

    setxy: function(x,y) {
        this.x=x;
        this.y=y;
        this.element.css({"left": this.x, "top": this.y});
    }

}