/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 3/8/13
 * Time: 11:29 AM
 * To change this template use File | Settings | File Templates.
 */

"use strict";

var embedded_objects = function(parent, data) {
    this.classType = "embedded_objects";
    this.parent = parent;
    this.data = data;

    this.start();
};

embedded_objects.prototype = {

    start: function() {
        if (this.parent!='test') this.init();
        else this.test();
    },

    init: function() {
        this.id = this.data.id;


        try {

            var element_type=null;
            var attr = {};
            var css = {};
            var val = null;
            var classes = [];
            var hide = false;

            var obj = this.data.object_data;

            css.left = this.data.x;
            css.top = this.data.y;

            var gen_css = {};
            gen_css.left = this.data.x-50;
            gen_css.top = this.data.y-50;

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
                    attr['type']="text";
                    attr['name']=this.id
                    attr['value']=obj.value;


                }

                this.wrong_png = save_element(this.parent, "img", this.id+"_wrong_png", ['wrong_png', 'hide']);
                this.right_png = save_element(this.parent, "img", this.id+"_right_png", ['right_png', 'hide']);

                this.wrong_png.attr("src", "./images/wrong.png")
                this.right_png.attr("src", "./images/right.png")

                this.wrong_png.css(gen_css);
                this.right_png.css(gen_css);

            } else if (this.data.type == "text_label") {

                element_type = "div";
                hide = true
                classes.push('text_label');
                val = obj.value;


            } else if (this.data.type == "submit") {

                this.button = new button_Class(this.parent, obj.value, this.id+"_submit_button", $.proxy(this.callback, this));
                classes.push('submit_button');
                hide = true;

                this.correct_flag = true;
                this.submit_status=1;

            } else if (this.data.type == "hint") {

                this.button = new button_Class(this.parent, "hint", this.id+"_hint_button", $.proxy(this.callback, this));

                classes.push("hint_button");
                hide = true

                this.currentShow = false;


            } else if (this.data.type == "video") {

                element_type = "div";
                classes.push("sub_video");
                hide = true;

            } else if (this.data.type == "button") {

                this.button = new button_Class(this.parent, obj.value, this.id+"_ordinary_button", $.proxy(this.callback, this));
                classes.push("video_button");
                hide = true;
            }

            if (this.button!=null) {

                vData.add_instances(this.button);
                this.element = this.button.element;

                for (var class_i in classes) {
                    this.element.addClass(classes[class_i])
                }

            } else {

                this.element = save_element(this.parent, element_type, this.id, classes, attr);

                if (this.data.type == "video") {

                    this.video = new video_Player(this.element, this.data.object_data, this.data.object_data.width, false);

                    vData.add_instances(this.video);

                }

            }

            this.element.css(css)

            if (val!=null) {
                this.element.append(val);
            }

            var obj4 = {"id": this.id, "video_id": this.data.scene_id, "begin": this.data.begin, "end": this.data.end}

            vData.instances['main_Timeline'].add_trigger_strips(obj4);

            if (this.data.begin!=null) {
                var time = this.data.begin

                var obj3 = {"id": this.id, "type_trig": "begin", "time": time, "retrig": this.data.retrig, "triggered": false, "video_id": this.data.scene_id, "type": this.data.type};

                //vData.add_triggers(obj3);
                vData.instances[this.data.scene_id].add_triggers(obj3);
            }

            if (this.data.end!=null) {
                var time = this.data.end
                var obj3 = {"id": this.id, "type_trig": "end", "time": time, "retrig": this.data.retrig, "triggered": false, "video_id": this.data.scene_id, "type": this.data.type}

                //vData.add_triggers(obj3)
                vData.instances[this.data.scene_id].add_triggers(obj3);
            } else {
                var time =this.data.begin
                var obj3 = {"id": this.id, "type_trig": "end", "time": time+0.25, "retrig": this.data.retrig, "triggered": false, "video_id": this.data.scene_id, "type": this.data.type }

                //vData.add_triggers(obj3)
                vData.instances[this.data.scene_id].add_triggers(obj3);
            }

            if (hide) this.element.addClass('hide');

            if (debug) creation_success(this.classType, this.id)
        } catch (e) {
            console.error(e.stack)
        }
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
    },

    callback: function() {

        if (this.data.type=="submit") {

            var input_array = vData.instances[this.data.parent].data.object_data.input;

            if (this.submit_status==1) {

                var correct_status = true;

                for (var i in input_array) {
                    var obj = vData.instances[input_array[i]];

                    var correct = obj.data.object_data.correct;
                    var input_type = obj.data.object_data.input_type;
                    var input_value = obj.element.val();
                    obj.element.prop('disabled', true);

                    if (correct==null) {
                        // add something here
                        continue;
                    }

                    if (input_type=="number") {

                        // sanitize input_value

                        input_value = eval(input_value);
                        correct = parseFloat(correct);


                    }

                    if (input_value!=correct) {
                        correct_status=false;
                        // add x mark
                        obj.wrong_png.removeClass('hide');
                        for (var key in this.data.object_data.wrong_1) {
                            vData.instances[this.data.object_data.wrong_1[key]].trigger();
                        }
                    } else {

                        obj.right_png.removeClass('hide');
                        // add check mark
                        for (var key in this.data.object_data.right_1) {
                            vData.instances[this.data.object_data.right_1[key]].trigger();
                        }
                    }

                }

                if (correct_status) {

                    this.element.empty();
                    this.element.append(this.data.object_data.value_correct);
                    this.submit_status=2;
                } else {

                    this.element.empty();
                    this.element.append(this.data.object_data.value_wrong)
                    this.submit_status=3;
                }

            } else if (this.submit_status==2) {

                // do correct
                for (var key in this.data.object_data.right_2) {
                    vData.instances[this.data.object_data.right_2[key]].trigger();
                }

                for (var i in input_array) {
                    var obj = vData.instances[input_array[i]];
                    obj.wrong_png.addClass('hide');
                    obj.right_png.addClass('hide');


                }

            } else if (this.submit_status==3) {

                // do wrong
                for (var key in this.data.object_data.wrong_2) {
                    vData.instances[this.data.object_data.wrong_2[key]].trigger();
                }

                this.element.empty();
                this.element.append(this.data.object_data.value);

                this.submit_status=1;

                for (var i in input_array) {
                    var obj = vData.instances[input_array[i]];
                    obj.wrong_png.addClass('hide');
                    obj.element.prop('disabled', false);

                }

            }



        } else if (this.data.type == "hint") {
            for (var key in this.data.object_data.action) {
                vData.instances[this.data.object_data.action[key]].trigger();
            }
        } else if (this.data.type == "button") {
            for (var key in this.data.object_data.action) {
                vData.instances[this.data.object_data.action[key]].trigger();
            }
        }

    },

    reset: function() {

        if (this.data.type=="submit") {

            var input_array = vData.instances[this.data.parent].data.object_data.input;
            for (var i in input_array) {
                var obj = vData.instances[input_array[i]];
                obj.right_png.addClass('hide');
                obj.wrong_png.addClass('hide');
                obj.element.val("")
                obj.element.prop('disabled', false);
            //this.element
            }

            this.element.empty();
            this.element.append(this.data.object_data.value);

            this.submit_status=1;

        }

    }

}