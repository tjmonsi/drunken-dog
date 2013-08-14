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
        //console.log(this.data)
        this.element = save_element(this.parent, "div", this.id+"_discussion_trigger", ['discussion_trigger']);
        this.element.css({"left": this.data.x, "top": this.data.y});
        this.element.append(this.data.primary_comment_list.length);


        this.element.click($.proxy(this.on_click, this));
        this.show_discussion = false;
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
        //1-4272676914

        // this should be last
        vData.delete_instances(this.id);
    },

    on_click: function(event) {

        if (this.show_discussion) {
            this.close_window();
            return
        }

        vData.instances[this.data.video_id].normal_mode_movement=false;
        this.element.css({"opacity": 1});
        vData.instances[this.data.video_id].seekpause(this.data.time);
        this.show_discussion = true;
        var window_data = {
            "id": this.id+"_window",
            "x": this.data.data.bounding_box.x+this.data.data.bounding_box.width,
            "y": this.data.data.bounding_box.y+this.data.data.bounding_box.height,
            "class": "discussion_thread_window",
            "window_name": "Discussions"
        }

        this.window = new window_Class(this, window_data, true, 10)
        vData.add_instances(this.window);

        this.bounding_box_ui = save_element(this.parent, "div", this.data.data.bounding_box.id, ['discussion_bounding_box']);
        this.bounding_box_ui.css({"width": this.data.data.bounding_box.width,
            "height": this.data.data.bounding_box.height,
            "top": this.data.data.bounding_box.y,
            "left": this.data.data.bounding_box.x})

        this.bounding_box_ui.click($.proxy(this.on_click, this));

        this.content_element = save_element(vData.instances[this.id+"_window"].window, "div", this.id+"_window_content", ['comment_thread']);
        this.content_element.addClass("pad"+vData.instances[this.id+"_window"].pad);

        this.comment_list_elements = {};




        for (var i in this.data.primary_comment_list) {
            this.comment_list_elements[this.data.primary_comment_list[i]] = save_element(
                this.content_element,
                'div',
                this.data.primary_comment_list[i],
                ['comment']);

            this.comment_list_elements[this.data.primary_comment_list[i]+"_comment_el"] = save_element(
                this.comment_list_elements[this.data.primary_comment_list[i]],
                'div',
                this.data.primary_comment_list[i]+"_comment_el",
                ['comment_el']);

            this.comment_list_elements[this.data.primary_comment_list[i]+"_comment_user"] = save_element(
                this.comment_list_elements[this.data.primary_comment_list[i]],
                'div',
                this.data.primary_comment_list[i]+"_comment_user",
                ['comment_user']);



            this.comment_list_elements[this.data.primary_comment_list[i]+"_comment_additional_data"] = save_element(
                this.comment_list_elements[this.data.primary_comment_list[i]],
                'div',
                this.data.primary_comment_list[i]+"_comment_additional_data",
                ['comment_additional_data']);



            var comment_data = vData.comments(this.data.primary_comment_list[i]);

            console.log(comment_data);
            vData.instances[this.data.video_id].draw_annotations(comment_data.objects);

            var comment = comment_data.comment;
            if (comment=="") comment=" "

            this.comment_list_elements[this.data.primary_comment_list[i]+"_comment_el"].append(comment_data.commenter+" says:<br/>"+comment+"<hr/>");
            this.comment_list_elements[this.data.primary_comment_list[i]+"_comment_user"].append("Date made: "+comment_data.time_made.toString());

            this.comment_list_elements[this.data.primary_comment_list[i]+"_comment_additional_data"].append("Number of replies: "+comment_data.replies.length)

            this.comment_list_elements[this.data.primary_comment_list[i]].data({
                "data": comment_data,
                "last": this.data.primary_comment_list[i]});

            this.comment_list_elements[this.data.primary_comment_list[i]+"_comment_button_area"] = save_element(
                this.comment_list_elements[this.data.primary_comment_list[i]],
                'div',
                this.data.primary_comment_list[i]+"_comment_button_area",
                ['comment_user_area']);

            this.comment_list_elements[this.data.primary_comment_list[i]+"_comment_reply"] = new button_Class(
                this.comment_list_elements[this.data.primary_comment_list[i]],
                "Reply",
                this.data.primary_comment_list[i]+"_comment_reply",
                $.proxy(this.add_comment, this, this.data.primary_comment_list[i]));

            vData.add_instances(this.comment_list_elements[this.data.primary_comment_list[i]+"_comment_reply"])

            this.comment_list_elements[this.data.primary_comment_list[i]+"_see_discussion"] = new button_Class(
                this.comment_list_elements[this.data.primary_comment_list[i]],
                "See Discussion",
                this.data.primary_comment_list[i]+"_see_discussion");

            vData.add_instances(this.comment_list_elements[this.data.primary_comment_list[i]+"_see_discussion"])

            /*this.comment_list_elements[this.data.primary_comment_list[i]+"_see_discussion"] = new button_Class(
                this.comment_list_elements[this.data.primary_comment_list[i]],
                "See Discussion",
                this.data.primary_comment_list[i]+"_see_discussion");

            vData.add_instances(this.comment_list_elements[this.data.primary_comment_list[i]+"_see_discussion"])*/
        }

        /*for (var i in this.data.comment_list) {

            var comment_data = vData.comments(this.data.comment_list[i]);

            this.comment_list_elements[this.data.comment_list[i]] = save_element_after(this.comment_list_elements[comment_data.reply_to)], 'div', this.data.comment_list[i], ['comment']);

            this.comment_list_elements[this.data.comment_list[i]+"_comment_user"] = save_element(this.comment_list_elements[this.data.comment_list[i]], 'div', this.data.comment_list[i]+"_comment_user", ['comment_user']);
            this.comment_list_elements[this.data.comment_list[i]+"_comment_el"] = save_element(this.comment_list_elements[this.data.comment_list[i]], 'div', this.data.comment_list[i]+"_comment_el", ['comment_el']);



            this.comment_list_elements[this.data.comment_list[i]+"_comment_el"].append(comment_data.comment);
            this.comment_list_elements[this.data.comment_list[i]+"_comment_user"].append(comment_data.commenter);

            this.comment_list_elements[this.data.comment_list[i]].data({"data": comment_data});

        }  */




    },

    close_window: function() {
        this.bounding_box_ui.remove();
        this.content_element.remove();
        this.window.destroy();
        this.show_discussion=false;
        vData.instances[this.data.video_id].clear_annotations();
        vData.instances[this.data.video_id].normal_mode_movement=true

    },

    add_comment: function(last_comment_id) {

        var comment_id = makeID(global_id_length);

        //console.log(vData.comments(this.new_comment_id))
        while (vData.comments(comment_id)!=null) {
            //console.log(this.new_comment_id);
            comment_id = makeID(global_id_length);
        }

        this.comment_list_elements[last_comment_id+"_comment_reply"].element.addClass('hide');

        this.comment_list_elements[comment_id+"_commentboxarea"] = save_element(
            this.comment_list_elements[last_comment_id],
            "div",
            comment_id+"_commentboxarea",
            ['commentboxarea']);

        this.comment_list_elements[comment_id+"_comment_box"] = save_element(
            this.comment_list_elements[comment_id+"_commentboxarea"],
            "textarea",
            comment_id+"_new_comment",
            ['new_comment_box']);

        this.comment_list_elements[comment_id+"_commentboxarea"].append(br());
        this.comment_list_elements[comment_id+"_commenter"] = save_element(
            this.comment_list_elements[comment_id+"_commentboxarea"],
            "input",
            comment_id+"_commenter",
            ['new_commenter']);

        this.comment_list_elements[comment_id+"_commenter"].val("user")

        this.comment_list_elements[comment_id+"_new_commentbutton_area"] = save_element(
            this.comment_list_elements[last_comment_id],
            "div", comment_id+"_new_commentbutton_area",
            ['commentbutton_area']);


        this.comment_list_elements[comment_id+"_clear_comment"] = new button_Class(
            this.comment_list_elements[comment_id+"_new_commentbutton_area"],
            "Erase",
            comment_id+"_clear_comment");

        vData.add_instances(this.comment_list_elements[comment_id+"_clear_comment"]);

        this.comment_list_elements[comment_id+"_submit_comment"] = new button_Class(
            this.comment_list_elements[comment_id+"_new_commentbutton_area"],
            "Submit",
            comment_id+"_submit_comment",
            $.proxy(this.save_new_comment, this, comment_id, last_comment_id));

        vData.add_instances(this.comment_list_elements[comment_id+"_submit_comment"]);


        this.comment_list_elements[comment_id+"_cancel_comment"] = new button_Class(
            this.comment_list_elements[comment_id+"_new_commentbutton_area"] ,
            "Cancel",
            comment_id+"_cancel_comment",
            $.proxy(this.close_new_comment, this, comment_id, last_comment_id));
        vData.add_instances(this.comment_list_elements[comment_id+"_cancel_comment"]);

        this.comment_list_elements[comment_id+"_new_commentbutton_area"].append(br());

        this.comment_list_elements[comment_id+"_draw_button"] = new button_Class(
            this.comment_list_elements[comment_id+"_new_commentbutton_area"] ,
            "Draw Annotation",
            comment_id+"_draw_annotation",
            $.proxy(this.draw_annotation, this, comment_id));
        vData.add_instances(this.comment_list_elements[comment_id+"_draw_button"]);

        this.comment_objects = []

    },

    draw_annotation: function(comment_id) {

        if (vData.instances[this.data.video_id].canvas.data().visible_flag) {
            vData.instances[this.data.video_id].on_stop_draw();
        } else {
            console.log("draw")
            vData.instances[this.data.video_id].on_draw(this.id, comment_id);
        }
    },

    close_new_comment: function(comment_id, last_comment_id) {


        this.comment_list_elements[comment_id+"_submit_comment"].destroy();
        this.comment_list_elements[comment_id+"_submit_comment"]=null;
        this.comment_list_elements[comment_id+"_cancel_comment"].destroy();
        this.comment_list_elements[comment_id+"_cancel_comment"]=null
        this.comment_list_elements[comment_id+"_draw_button"].destroy();
        this.comment_list_elements[comment_id+"_draw_button"]=null;

        this.comment_list_elements[comment_id+"_comment_box"].remove();
        this.comment_list_elements[comment_id+"_comment_box"]=null;
        this.comment_list_elements[comment_id+"_commenter"].remove();
        this.comment_list_elements[comment_id+"_commenter"] = null;
        this.comment_list_elements[comment_id+"_new_commentbutton_area"].remove();
        this.comment_list_elements[comment_id+"_new_commentbutton_area"] = null;

        this.comment_list_elements[comment_id+"_commentboxarea"].remove();
        this.comment_list_elements[comment_id+"_commentboxarea"]=null;


        this.comment_list_elements[last_comment_id+"_comment_reply"].element.removeClass('hide');
        this.comment_objects = [];
    },

    save_new_comment: function(comment_id, last_comment_id) {
        // create new comment

        var comment_data = {
            "id": comment_id,
            "commenter": this.comment_list_elements[comment_id+"_commenter"].val(),
            "comment": this.comment_list_elements[comment_id+"_comment_box"].val(),
            "x": this.data.x,
            "y": this.data.y,
            "discussion_id": this.data.id,
            "objects": this.comment_objects,
            "reply_to": last_comment_id,
            "replies": [],
            "time_made": new Date()
        }

        vData.comments(last_comment_id).replies.push(comment_id);

        this.comment_list_elements[last_comment_id+"_comment_additional_data"].empty();
        this.comment_list_elements[last_comment_id+"_comment_additional_data"].append("Number of replies: "+vData.comments(last_comment_id).replies.length)


        this.data.comment_list.push(comment_data.id);

        /*var discussion_data = {
            "time": this.data.time,
            "id": this.new_discussion_id,
            "comment_list": [],
            "primary_comment_list": [this.new_comment_id],
            "data": this.data,
            "x": this.data.bounding_box.x,
            "y": this.data.bounding_box.y,
            "video_id": this.data.video_id
        }*/

        //this.comment_objects = [];

        //console.log(discussion_data)

        /*var discussion_trigger = {
         "time": this.data.time,
         "id": this.new_discussion_id,
         "x": this.data.bounding_box.x,
         "y": this.data.bounding_box.y,
         "bounding_box": this.data.bounding_box
         }*/

        vData.comments(comment_data);
        //vData.discussions(discussion_data);

        //vData.instances[this.data.video_id].discussion_trigger(discussion_data);
        vData.instances[this.data.video_id].clear_annotations();


        console.log(vData.comment_set);
        console.log(vData.discussion_set);

        //this.destroy();
        this.close_new_comment(comment_id, last_comment_id)

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

        vData.instances[this.data.video_id].seekpause(this.data.time);
        this.element = save_element(this.parent, "div", this.id+"_discussion_content", ['discussion_content']);
        this.element.addClass("pad10");

        this.bounding_box_ui = save_element(vData.instances[this.data.video_id].element, "div", this.data.data.bounding_box.id, ['discussion_content_bounding_box']);
        this.bounding_box_ui.css({"width": this.data.data.bounding_box.width,
            "height": this.data.data.bounding_box.height,
            "top": this.data.data.bounding_box.y,
            "left": this.data.data.bounding_box.x})

        this.bounding_box_ui.addClass('hide');

        this.comment_list_elements = {};

        for (var i in this.data.primary_comment_list) {
            this.comment_list_elements[this.data.primary_comment_list[i]] = save_element(
                this.element,
                'div',
                this.data.primary_comment_list[i],
                ['discussion_comment']);

            this.comment_list_elements[this.data.primary_comment_list[i]+"_discussion_comment_el"] = save_element(
                this.comment_list_elements[this.data.primary_comment_list[i]],
                'div',
                this.data.primary_comment_list[i]+"_discussion_comment_el",
                ['comment_el']);

            this.comment_list_elements[this.data.primary_comment_list[i]+"_discussion_comment_user"] = save_element(
                this.comment_list_elements[this.data.primary_comment_list[i]],
                'div',
                this.data.primary_comment_list[i]+"_discussion__comment_user",
                ['discussion_comment_user']);



            this.comment_list_elements[this.data.primary_comment_list[i]+"_discussion_comment_additional_data"] = save_element(
                this.comment_list_elements[this.data.primary_comment_list[i]],
                'div',
                this.data.primary_comment_list[i]+"_discussion_comment_additional_data",
                ['discussion_comment_additional_data']);



            var comment_data = vData.comments(this.data.primary_comment_list[i]);

            console.log(comment_data);
            vData.instances[this.data.video_id].draw_annotations(comment_data.objects);

            var comment = comment_data.comment;
            if (comment=="") comment=" "

            this.comment_list_elements[this.data.primary_comment_list[i]+"_discussion_comment_el"].append(comment_data.commenter+" says:<br/>"+comment+"<hr/>");
            this.comment_list_elements[this.data.primary_comment_list[i]+"_discussion_comment_user"].append("Date made: "+comment_data.time_made.toString());

            this.comment_list_elements[this.data.primary_comment_list[i]+"_discussion_comment_additional_data"].append("Number of replies: "+comment_data.replies.length)

            this.comment_list_elements[this.data.primary_comment_list[i]].data({
                "data": comment_data,
                "last": this.data.primary_comment_list[i]});

            this.comment_list_elements[this.data.primary_comment_list[i]+"_discussion_comment_button_area"] = save_element(
                this.comment_list_elements[this.data.primary_comment_list[i]],
                'div',
                this.data.primary_comment_list[i]+"_discussion_comment_button_area",
                ['discussion_comment_user_area']);

            this.comment_list_elements[this.data.primary_comment_list[i]+"_discussion_comment_reply"] = new button_Class(
                this.comment_list_elements[this.data.primary_comment_list[i]],
                "Reply",
                this.data.primary_comment_list[i]+"_discussion_comment_reply",
                $.proxy(this.add_comment, this, this.data.primary_comment_list[i]));

            vData.add_instances(this.comment_list_elements[this.data.primary_comment_list[i]+"_discussion_comment_reply"])

            this.comment_list_elements[this.data.primary_comment_list[i]+"_discussion_see_discussion"] = new button_Class(
                this.comment_list_elements[this.data.primary_comment_list[i]],
                "See Discussion",
                this.data.primary_comment_list[i]+"_discussion_see_discussion");

            vData.add_instances(this.comment_list_elements[this.data.primary_comment_list[i]+"_discussion_see_discussion"])

            /*this.comment_list_elements[this.data.primary_comment_list[i]+"_see_discussion"] = new button_Class(
             this.comment_list_elements[this.data.primary_comment_list[i]],
             "See Discussion",
             this.data.primary_comment_list[i]+"_see_discussion");

             vData.add_instances(this.comment_list_elements[this.data.primary_comment_list[i]+"_see_discussion"])*/
        }
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