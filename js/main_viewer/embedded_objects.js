/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 18/8/13
 * Time: 10:39 AM
 * To change this template use File | Settings | File Templates.
 */

var embeddedObject = Class.extend({
    init: function(parent, data) {
        this.parent = parent;
        //console.log(parent);
        //console.log(data);
        this.data = data;
        this.id = data.id;
        this.fromAction = false;
    },

    run: function() {

        this.elementType = null;
        this.attr = {};
        this.css = {};
        this.css.left = this.data.x;
        this.css.top = this.data.y;

        //console.log(this.css);

        this.val = null;
        this.classes = [];
        this.hide = false;

        this.gen_css = {};
        this.gen_css.left = this.data.x-50;
        this.gen_css.top = this.data.y-50;

        if (this.data.object_data.font_size!=null) this.css["font-size"] = this.data.object_data.font_size;
        if (this.data.object_data.width!=null) this.css.width = this.data.object_data.width;
        if (this.data.object_data.color!=null) this.css.color = this.data.object_data.color;
        if (this.data.object_data.background_color!=null) this.css['background-color'] = this.data.object_data.background_color;

        var obj = {
            "id": this.id,
            "video_id": this.data.scene_id,
            "begin": this.data.begin,
            "end": this.data.end
        }

        vD.i("mainTimeline").trigger_bars(obj);

        var obj2 = {
            "id": this.id,
            "retrig": this.data.retrig,
            "triggered": false,
            "video_id": this.data.scene_id,
            "type": this.data.type
        }

        var obj3 = {
            "id": this.id,
            "retrig": this.data.retrig,
            "triggered": false,
            "video_id": this.data.scene_id,
            "type": this.data.type
        }

        if (this.data.begin!=null) {

            obj2.time = this.data.begin;
            obj2.type_trig = "begin";

            vD.triggers(this.data.scene_id, obj2);
            //console.log(obj2);
        }

        if (this.data.end!=null) {
            obj3.time = this.data.end+0.5;
            obj3.type_trig = "end";

            vD.triggers(this.data.scene_id, obj3);
        } else {
            obj3.time = this.data.begin+0.5;
            obj3.type_trig = "end";

            vD.triggers(this.data.scene_id, obj3);
        }

    }
})

var embeddedForm = embeddedObject.extend({
    init: function(parent, data){
        this._super(parent, data);
        this.run();
    },

    run: function() {
        this._super();
        this.elementType = "form";
        this.classes.push('video_form');
        this.hide = true;

        if (!this.hide) this.on_show();
    },

    on_show: function() {
        this.element = saveElement(this.parent, this.elementType, this.id, this.classes, this.attr);
        this.element.css(this.css);
    },

    on_hide: function() {
        if (this.element==null) return
        this.element.remove();
        this.element = null;
    }
})

var embeddedInput = embeddedObject.extend({
    init: function(parent, data){
        this._super(parent, data);
        this.run();
    },

    run: function() {
        this._super();


        if (this.data.object_data.sub_type=="input_box") {
            this.elementType = "input";
            this.classes.push('video_form');
            this.attr['type']="text";
            this.attr['name']=this.id;
            this.attr['value']=this.data.object_data.value;
        } else if (this.data.object_data.sub_type=="mcq") {
            this.elementType = "div";
            this.classes.push('mcq');
            this.mcqval = [];
            for (var i in this.data.object_data.value) {
                this.mcqval[i] = {}
                this.mcqval[i]['type'] = 'radio';
                this.mcqval[i]['name'] = this.id;
                this.mcqval[i]['value'] = this.data.object_data.value[i].val
            }

        }

        this.hide = true;

        if (!this.hide) this.on_show();
    },

    on_show: function() {
        console.log(this.data)
        if (this.element!=null) return;

        if (this.data.object_data.sub_type=="input_box") {
            this.element = saveElement(this.parent, this.elementType, this.id, this.classes, this.attr);
            if (this.val!=null) this.element.val(this.val);
        } else if (this.data.object_data.sub_type=="mcq") {
            this.element = saveElement(this.parent, this.elementType, this.id, this.classes);
            this.mcq_elements = {};
            console.log("enter")
            for (var i in this.data.object_data.value) {


                this.mcq_elements[this.id+"_mcqval_"+this.data.object_data.value[i].val] = saveElement(this.element,
                    "input",
                    this.id+"_mcqval_"+this.data.object_data.value[i].val,
                    ["mcq"],
                    this.mcqval[i]
                );
                this.mcq_elements[this.id+"_mcqvalText_"+this.data.object_data.value[i].val] = saveElement(this.element,
                    "span",
                    this.id+"_mcqvalText_"+this.data.object_data.value[i].val,
                    ["mcqtext"])
                this.mcq_elements[this.id+"_mcqvalText_"+this.data.object_data.value[i].val].append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+this.data.object_data.value[i].text)
                this.element.append(br());
            }
        }

        this.wrongPNG = saveElement(this.parent, "img", this.id+"_wrongPNG", ['wrongPNG', 'hide']);
        this.rightPNG = saveElement(this.parent, "img", this.id+"_rightPNG", ['rightPNG', 'hide']);
        this.wrongPNG.attr("src", "./images/wrong.png");
        this.rightPNG.attr("src", "./images/right.png");
        this.wrongPNG.css(this.gen_css);
        this.rightPNG.css(this.gen_css);


        this.element.css(this.css);
    },

    on_hide: function() {
        if (this.element==null) return
        //console.log(this.element)
        if (this.mcq_elements != null) {
            for (var i in this.mcq_elements) {
                this.mcq_elements[i].empty();
                this.mcq_elements[i].remove();

            }

            this.mcq_elements=null
            this.mcqval = null;
        }

        this.element.empty()
        this.element.remove();



        this.wrongPNG.empty()
        this.wrongPNG.remove();
        this.rightPNG.empty()
        this.rightPNG.remove();
        this.wrongPNG = null;
        this.rightPNG = null;
        this.element = null;
    }
})

var embeddedText_label = embeddedObject.extend({
    init: function(parent, data){
        this._super(parent, data);
        this.run();
    },

    run: function() {
        this._super();
        this.elementType = "div";
        this.classes.push('text_label');
        this.val = this.data.object_data.value;
        this.hide = true;

        if (!this.hide) this.on_show();
    },

    on_show: function() {
        //console.log("Text Label show")
        if (this.element==null) {
            this.element = saveElement(this.parent, this.elementType, this.id, this.classes, this.attr);
            this.element.css(this.css);
            this.element.append(this.val);
        }
        /*try {
            if (this.id=="textlabel2") throw new Error("Hey show!");
        } catch(e) {

            console.log(e.stack)
        }*/
    },

    on_hide: function() {
        if (this.element==null) return
        this.element.remove();
        this.element = null;

    }
})

var embeddedButton = embeddedObject.extend({
    init: function(parent, data){
        this._super(parent, data);
        this.run();
    },

    run: function() {
        this._super();
        this.classes.push('video_button');
        this.added_id = "_ordinaryButton"
        this.hide = true;

        if (!this.hide) this.on_show();
    },

    on_show: function() {
        this.button = new buttonClass(this.parent, this.data.object_data.value, this.id+this.added_id, $.proxy(this.callback, this))
        this.element = this.button.element;
        for (var class_i in this.classes) {
            this.element.addClass(this.classes[class_i])
        }
        this.element.css(this.css);
    },

    on_hide: function() {
        if (this.element==null) return
        ///console.log(this.element);
        this.button.close();
        this.element.remove();
        this.element = null;
    },

    callback: function() {
        for (var key in this.data.object_data.action) {
            vD.i(this.data.object_data.action[key]).trigger();
        }
    }
})

var embeddedSubmit = embeddedButton.extend({
    init: function(parent, data){
        this._super(parent, data);
        this.run();
    },

    run: function() {
        this._super();
        this.classes.push('submit_button');
        this.added_id = "_submitButton"
        this.submit_status = 1;
        this.correct_flag = true;
        this.hide = true;

        if (!this.hide) this.on_show();
    },

    callback: function() {

        var arr = vD.i(this.data.parent).data.object_data.input;

        if (this.submit_status == 1) {
            var correct_status = true;

            for (var i in arr) {
                var obj = vD.i(arr[i]);

                var correct = obj.data.object_data.correct;
                var input_type = obj.data.object_data.input_type;



                if (correct == null) {
                    // add something if there's no real correct value
                    continue;
                }

                if (input_type == "number") {
                    var input_value = obj.element.val();
                    obj.element.prop('disabled', true);
                    input_value = toFloat(toStringNum(input_value));
                    correct = toFloat(toStringNum(correct));

                } else if (input_type == "mcq") {

                    var val = $("input[type='radio'][name='"+obj.id+"']:checked")

                    if (val.length>0) {
                        input_value = val.val();
                    }

                    console.log(input_value)
                    console.log(correct)
                    //$('input[name='+obj.id+']:radio:checked')

                }


                if (input_value!=correct) {
                    correct_status = false;
                    //console.log(obj);
                    obj.wrongPNG.removeClass('hide');
                    for (var key in this.data.object_data.wrong_1) {
                        vD.i(this.data.object_data.wrong_1[key]).trigger();
                    }
                } else {
                    obj.rightPNG.removeClass('hide');
                    for (var key in this.data.object_data.right_1) {
                        vD.i(this.data.object_data.right_1[key]).trigger();
                    }
                }
            }

            if (correct_status) {
                this.element.empty();
                this.element.append(this.data.object_data.value_correct);
                this.submit_status = 2;
            } else {
                this.element.empty();
                this.element.append(this.data.object_data.value_wrong);
                this.submit_status = 3;
            }

        } else if (this.submit_status == 2) {
            for (var key in this.data.object_data.right_2) {
                vD.i(this.data.object_data.right_2[key]).trigger();
            }

            for (var i in arr) {
                var obj = vD.i(arr[i]);
                obj.wrongPNG.addClass('hide');
                obj.rightPNG.addClass('hide');
            }
        } else if (this.submit_status == 3) {
            for (var key in this.data.object_data.wrong_2) {
                vD.i(this.data.object_data.wrong_2[key]).trigger();
            }

            this.element.empty();
            this.element.append(this.data.object_data.value);

            this.submit_status = 1;

            for (var i in arr) {
                var obj = vD.i(arr[i]);
                obj.wrongPNG.addClass('hide');
                obj.rightPNG.addClass('hide');
                obj.element.prop('disabled', false);
            }

        }

    },

    on_hide: function() {
        this._super();
        this.submit_status = 1;
        this.correct_flag = true;
    }
})

var embeddedHint = embeddedButton.extend({
    init: function(parent, data){
        this._super(parent, data);
        this.run();
    },

    run: function() {
        this._super();
        this.val="hint";
        this.classes.push('hint_button');
        this.added_id = "_hintButton"
        this.hide = true;

        if (!this.hide) this.on_show();
    }
})

var embeddedVideo = embeddedObject.extend({
    init: function(parent, data){
        this._super(parent, data);
        this.run();
    },

    run: function() {
        this._super();
        this.elementType = "div"
        this.classes.push('sub_video');
        this.hide = true;

        if (!this.hide) this.on_show();
    },

    on_show: function() {
        this.element = saveElement(this.parent, this.elementType, this.id, this.classes, this.attr);
        this.element.css(this.css);
        this.video = new videoPlayer(this.element, this.data.object_data, this.data.object_data.width, false);
        vD.i(this.video);
    },

    on_hide: function() {
        if (this.element==null) return
        this.video.close();
        this.element.remove();
        this.element = null;
    }


})



