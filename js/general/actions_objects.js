/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 3/8/13
 * Time: 11:19 PM
 * To change this template use File | Settings | File Templates.
 */

"use strict";

/*---------------------- button_UI -------------------------*/

var action_objects = function(parent, data) {
    this.classType = "action_objects"
    this.parent = parent;
    this.data = data;

    this.start();

}

action_objects.prototype = {

    start: function() {
        if (this.parent!='test') this.init();
        else this.test();
    },

    init: function() {
        this.id = this.data.id

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

    trigger: function() {

        if (this.data.play!=null) {
            vData.instances[this.data.scene_id].time_gate = false;
            if  (this.data.play=="current")
                vData.instances[this.data.scene_id].play();
            else
                vData.instances[this.data.scene_id].seek(this.data.play)
        }

        if (this.data.pause) {
            vData.instances[this.data.scene_id].pause();
        }

        for (var key in this.data.show) {

            vData.instances[this.data.show[key]].element.removeClass('hide')

        }

        for (var key in this.data.show_all) {

            vData.instances[this.data.show_all[key]].data.show=true;
            vData.instances[this.data.show_all[key]].element.removeClass('hide')

        }


        for (var key in this.data.hide) {
            vData.instances[this.data.hide[key]].element.addClass('hide')

        }

        for (var key in this.data.hide_all) {
            vData.instances[this.data.hide_all[key]].element.addClass('hide')
            vData.instances[this.data.hide_all[key]].data.show=false;
        }

        for (var key in this.data.clear_val) {
            vData.instances[this.data.clear_val[key]].element.val("");
        }

        for (var key in this.data.change_val) {
            vData.instances[this.data.clear_val[key].element].element.val(this.data.clear_val[key].val);
        }

    }

}