/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 3/8/13
 * Time: 11:29 AM
 * To change this template use File | Settings | File Templates.
 */

"use strict";

var embedded_objects = function(parent, data) {
    this.classType = "embedded_objects"
    this.parent = parent;
    this.data = data;

    this.start();
}

embedded_objects.prototype = {

    start: function() {
        if (this.parent!='test') this.init();
        else this.test();
    },

    init: function() {
        this.id = this.data.id

        var element_type=null;
        var attr = {};
        var css = {};
        var val = null;
        var classes = [];
        var hide = false;

        var obj = this.data.object_data

        css.left = this.data.x;
        css.top = this.data.y;

        if (obj.font_size!=null) css["font-size"] =  obj.font_size;

        if (obj.width!=null) css.width = obj.width;

        if (obj.color!=null) css.color = obj.color;

        if (obj.background_color!=null) css["background-color"] = obj.background_color;


        if (this.data.type=="form") {

            element_type = "form";
            classes.push('video_form');
            hide = true

        } else if (this.data.type == "input") {

            element_type = "input";
            hide = true;

            if (obj.sub_type=="input_box") {
                classes.push('input_box');
                attr[type]="text";
                attr[name]=this.id
                val = obj.value;

            }

        } else if (this.data.type == "text_label") {

            element_type = "div";
            hide = true
            classes.push('text_label');
            val = obj.value;


        } else if (this.data.type == "submit") {

            this.button = new button_UI(this.parent, obj.value, this.id+"_submit_button", $.proxy(this.callback, this));
            classes.push('submit_button');
            hide = true;

            this.correct_flag = true;
            this.submit_status=1;

        } else if (this.data.type == "hint") {

            this.button = new button_UI(this.parent, "hint", this.id+"_hint_button", $.proxy(this.callback, this));
            classes.push("hint_button");
            hide = true

            this.currentShow = false;


        } else if (this.data.type == "video") {

            element_type = "div";
            classes.push("sub_video");
            hide = true;

        } else if (this.data.type == "button") {

            this.button = new button_UI(this.parent, obj.value, this.id+"_ordinary_button", $.proxy(this.callback, this));
            classes.push("video_button");
            hide = true;
        }

        if (this.button!=null) {

            vData.add_instances(this.button);
            this.element = this.button.element;
            this.element.addClass(classes)

        } else {

            this.element = save_element(this.parent, element_type, this.id, classes, attr);

        }

        if (hide) this.element.addClass('hide');

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
    }

}