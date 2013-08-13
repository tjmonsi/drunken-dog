/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 13/8/13
 * Time: 10:43 AM
 * To change this template use File | Settings | File Templates.
 */

"use strict";

/*---------------------- discussion_trigger -------------------------*/

var discussion_trigger = function(parent, data) {
    this.classType = "discussion_trigger"
    this.parent = parent;
    this.data = data;

    this.start();

}

discussion_trigger.prototype = {

    start: function() {
        if (this.parent!='test') this.init();
        else this.test();
    },

    init: function() {
        this.id = this.data.id

        this.element = save_element(this.parent, "div", this.id+"_discussion_trigger", ['discussion_trigger']);
        this.element.css({"left": this.data.x, "top": this.data.y});
        this.element.append(this.data.length);

        //this.element = save_element(this.parent, "div", this.id+"_discussion_thread", ['discussion_thread'])

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
            if (this[key]==null) continue;
            if (this[key].classType!=null) {
                this[key].destroy();
            }
        }

        //add more here


        // this should be last
        vData.delete_instances(this.id);
    }

}


/*---------------------- discussion_thread -------------------------*/

var discussion_thread = function(parent, data) {
    this.classType = "discussion_thread"
    this.parent = parent;
    this.data = data;

    this.start();

}

discussion_thread.prototype = {

    start: function() {
        if (this.parent!='test') this.init();
        else this.test();
    },

    init: function() {
        this.id = this.data.id

        //this.element = save_element(this.parent, "div", this.id+"_discussion_thread", ['discussion_thread'])

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
            if (this[key]==null) continue;
            if (this[key].classType!=null) {
                this[key].destroy();
            }
        }

        //add more here


        // this should be last
        vData.delete_instances(this.id);
    }

}