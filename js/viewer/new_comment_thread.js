/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 6/8/13
 * Time: 1:48 PM
 * To change this template use File | Settings | File Templates.
 */

"use strict";

/*---------------------- button_UI -------------------------*/

var new_comment_thread_form = function(parent, data) {
    this.classType = "new_comment_thread_form"
    this.parent = parent;
    this.data = data;

    this.start();

}

new_comment_thread_form.prototype = {

    start: function() {
        if (this.parent!='test') this.init();
        else this.test();
    },

    init: function() {
        this.id = this.data.id

        var window_data = {
            "id": this.id+"_window",
            "x": this.data.x,
            "y": this.data.y,
            "class": "new_comment_window",
            "window_name": "New Comment Thread"
        }

        var new_comment_id = makeID(global_id_length);

        while (vData.check_instances(new_comment_id)!=null) {
            new_comment_id = makeID(global_id_length);
        }
        this.window = new window_Class(this, window_data, false, 10)
        vData.add_instances(this.window);

        this.element = save_element(vData.instances[this.id+"_window"].window, "div", this.id+"_window_content", ['new_comment_thread']);
        this.element.addClass("pad"+vData.instances[this.id+"_window"].pad);

        this.commentboxarea = save_element(this.element, "div", this.id+"_commentboxarea", ['commentboxarea']);

        this.comment_box = save_element(this.commentboxarea, "textarea", this.id+"_comment", ['new_comment_box']);
        this.commentboxarea.append(br());
        this.commenter = save_element(this.commentboxarea, "input", this.id+"_commenter", ['new_commenter']);
        this.commenter.val("user")

        this.commentbutton_area = save_element(this.element, "div", this.id+"_commentbutton_area", ['commentbutton_area']);

        this.clear_comment = new button_Class(this.commentbutton_area, "Erase", this.id+"_clear_comment");
        vData.add_instances(this.clear_comment);
        this.submit_comment = new button_Class(this.commentbutton_area, "Submit", this.id+"_submit_comment");
        vData.add_instances(this.submit_comment);
        this.cancel_comment = new button_Class(this.commentbutton_area, "Cancel", this.id+"_cancel_comment", $.proxy(this.destroy, this));
        vData.add_instances(this.cancel_comment);


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
