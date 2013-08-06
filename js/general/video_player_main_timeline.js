//main_Timeline

"use strict";

/*---------  Main Time Line ------------- */
var main_Timeline = function(parent, id) {
	this.parent = parent;
	this.id = id;
	this.classType = "main_Timeline"
	this.timeline_set = [];
    this.timeline_lengths = [];
    this.scene_set = {};
    this.temporary_set = [];
    this.timeline_set_element = [];
    this.trigger_elements = {};

    this.mousehold_flag=false;

	this.start();
}

main_Timeline.prototype = {

    start: function() {
        if (this.parent!='test') this.init();
        else this.test();
    },

	init: function() {

        try {
            //console.log(vData.data)
            if (vData.data.data.scene_objects.length==0) console.log("ehh")

            for (var i=0; i<vData.data.data.scene_objects.length; i++){

                this.add_to_timeline(vData.data.data.scene_objects[i]);

            }



            this.element = save_element(this.parent, "div", this.id);
            this.element.css({"width": vid_max_width});
            this.scrubber = save_element(this.element, "div", this.timeline_set[0][0].id+"_main_scrubber", ["main_scrubber"]);



            this.scrubber.css({"top": 0, "left": 0});
            this.scrubber.draggable(this.scrubber_fx);

            this.set_primary_timeline(0);

            this.element.mousedown($.proxy(this.timeline_scrub_start,this));
            //this.element.mousemove($.proxy(this.timeline_scrub,this))
            this.element.mouseup($.proxy(this.timeline_scrub_end,this));
            this.element.mouseleave($.proxy(this.timeline_scrub_mouseleave(),this))
            this.element.mouseenter($.proxy(this.timeline_scrub_mouseenter(),this))
            this.mousehold_flag=false;

		    if (debug) creation_success(this.classType, this.id)

            if (debug2) console.log(this)

        } catch (e) {
            console.error(e.stack);
            //console.log("Error at aisle 41")
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
            if (this[key].classType!=null) {
                this[key].destroy();
            }
        }

        //add more here


        // this should be last
        vData.delete_instance(this.id);
    },

    add_to_timeline: function(data, flag) {

        var t_index = null;
        var index = null;

        var new_data = {"id": data.id,
            "prev": data.prev,
            "next": data.next,
            "begin": data.begin,
            "end": data.end}

        // if the scene is at the start of the timeline
        if (data.prev==null) {

            var timeline = [];

            timeline.push(new_data);
            index = timeline.indexOf(new_data);

            this.timeline_set.push(timeline);
            t_index = this.timeline_set.indexOf(timeline);

        } else {

            // checks if the previous scene is already been loaded
            if (this.scene_set[data.prev]!=null) {

                t_index = this.scene_set[data.prev].t_index;
                index = this.scene_set[data.prev].index+1;
                var timeline = this.timeline_set[t_index];

                timeline.splice(index, 0, new_data);

                this.timeline_set[t_index] = timeline;

            } else {

                if (flag==null) this.temporary_set.push(data);

            }

        }

        if ((index!=null) && (t_index!=null)) {
            this.scene_set[data.id] = {"index": index, "t_index": t_index};

            this.update_timeline_lengths(t_index);

            if (flag==null) {
                for (var i = 0; i<this.temporary_set.length; i++) {
                    if (this.add_to_timeline(this.temporary_set[i], true)) {
                        i = 0;
                    }
                }
            }

            return true
        } else {
            return false
        }


    },

    update_timeline_lengths: function(t_index) {

        var timeline = this.timeline_set[t_index];

        var timeline_length = 0;

        var scene_length;

        for (var i=0; i<timeline.length; i++) {

            scene_length = timeline[i].end - timeline[i].begin;
            timeline_length += scene_length;

        }

        this.timeline_lengths[t_index] = timeline_length

    },

    set_primary_timeline: function(t_index) {

        var arr = this.timeline_set[t_index];
        var time_length = this.timeline_lengths[t_index];

        this.timeline_set_element[t_index] = save_element(this.element, "div", "main_timeline_bar_"+t_index, ["main_timeline_bar"]);

        this.timeline_set_element[t_index].css({"width": vid_max_width})

        var main_t_bar = vid_max_width;

        for (var i in arr) {

            var obj = arr[i];
            var length = obj.end - obj.begin;

            var pix_length = main_t_bar * (length/time_length);

            obj.element = save_element(this.timeline_set_element[t_index], "div", obj.id+"_"+t_index+"_timeline_bars", ["timeline_bar"]);

            obj.element.css({"width":pix_length-4});

            arr[i] = obj

        }

        this.timeline_set[t_index] = arr;

    },

    add_trigger_strips: function(obj) {

        //console.log(obj);

        var id = obj.id;
        var t_index = this.scene_set[obj.video_id].t_index;
        var index = this.scene_set[obj.video_id].index;

        var arr = this.timeline_set[t_index];
        var new_obj = arr[index];

        var vid_begin = vData.instances[obj.video_id].data.begin;
        var vid_end = vData.instances[obj.video_id].data.end;

        var time_start = obj.begin-vid_begin;
        var time_end;

        if (obj.end!=null) time_end = obj.end-vid_begin;
        else time_end = (obj.begin+0.15)-vid_begin;

        var strip_time = time_end - time_start;

        //console.log(strip_time)

        var width = new_obj.element.width();
        var time_length = vid_end-vid_begin;

        //console.log(width);
        //console.log(time_length);

        var strip_width = (width*strip_time)/time_length;
        var posx = (width*time_start)/time_length;
        //console.log(new_obj.element.position().left)
        var posx = posx+new_obj.element.position().left+10
        //console.log(posx)
        //console.log(strip_width)

        if (strip_width<2) strip_width=2;

        this.trigger_elements[obj.id+"_timeline_strip"] = (save_element(new_obj.element, "div", obj.id+"_timeline_strip", ['timeline_strip']));

        this.trigger_elements[obj.id+"_timeline_strip"].css({"width": strip_width});
        this.trigger_elements[obj.id+"_timeline_strip"].css({"left": posx});
        this.trigger_elements[obj.id+"_timeline_strip"].css({"background-color": "#00FF00"});

    },

    updatepos: function(time, video_id){
        this.scrubber.attr("id", video_id+"_main_scrubber");
        //console.log(time);
        //console.log(video_id)
        var t_index = this.scene_set[video_id].t_index;
        var index = this.scene_set[video_id].index;

        var timeline = this.timeline_set[t_index];
        var obj = timeline[index];

        var scene_length = 0;

        var true_time = time-obj.begin;

        for (var i in timeline) {

            if (i==index) break;
            scene_length += (timeline[i].end-timeline[i].begin);

        }

        var posx = ((true_time+scene_length)*this.timeline_set_element[t_index].width()-40)/this.timeline_lengths[t_index];

        //console.log(posx)

        if (posx>=this.timeline_set_element[t_index]-10) posx=this.timeline_set_element[t_index]-10

        this.scrubber.css({"left": posx});

    },

    scrubber_fx: {
        containment: 'parent',
        cursor: 'move',
        grid: [1, 15],
        start: function() {
            var target = vData.instances[this.id.replace("_main_scrubber", "")];
            target.pause();
        },

        drag: function() {

        },

        stop: function() {
            var prevtarget = vData.instances[this.id.replace("_main_scrubber", "")];


            var timeline = vData.instances["main_Timeline"];

            var posx = timeline.scrubber.position().left;

            var posy = timeline.scrubber.position().top;

            var int_y = parseInt(posy/15)

            var el_width = timeline.timeline_set_element[int_y].width();

            var pos_el = timeline.timeline_set_element[int_y].position().left;

            var time_length = timeline.timeline_lengths[int_y];

            var arr = timeline.timeline_set[int_y];

            var true_time = ((posx*time_length)/(el_width-10))-pos_el;

            var scene_length = 0;
            var prev_scene_length = 0;
            var i = 0;
            for (i in arr) {

                scene_length += arr[i].end - arr[i].begin

                if (true_time<scene_length) break;

                prev_scene_length = scene_length;

            }

            var obj = arr[i];

            prevtarget.on_back();

            timeline.scrubber.attr("id", obj.id+"_main_scrubber");
            vData.instances[obj.id].on_show();
            vData.instances[obj.id].seek((true_time-prev_scene_length)+vData.instances[obj.id].data.begin);

        }
    },

    return_if_timeline: function(id) {

        var concat_id = id.replace("_timeline_bars", "");
        var arr_id = concat_id.split("_");

        var real_id = arr_id[0];

        if (this.scene_set[real_id]!=null) {
            return true;
        } else {
            return false
        }


    },

    timeline_scrub_start: function(e) {
        console.log(e)
        if (e.target.id.indexOf("_main_scrubber")==-1) {
            this.mousehold_flag = true;
        }

        if (this.mousehold_flag) {
            var id = e.target.id;
            var strip = null

            if (e.target.id.indexOf("_timeline_bars")==-1) {
                id = e.target.parentElement.id
                strip = e.target.id
            }
            this.timeline_scrub_function(e.offsetX-10, e.offsetY, id, strip);
        }

    },

    timeline_scrub: function(e) {
        if (this.mousehold_flag) {
            var id = e.target.id;
            var strip = null

            if (e.target.id.indexOf("_timeline_bars")==-1) {
                id = e.target.parentElement.id
                strip = e.target.id
            }
            this.timeline_scrub_function(e.offsetX-10, e.offsetY, id, strip);
        }
    },

    timeline_scrub_end: function(e) {
        this.mousehold_flag=false;
    },


    timeline_scrub_mouseleave: function(e) {

        //console.log(e);
        if (this.mousehold_flag) {
            var id = e.target.id;
            var strip = null

            if (e.target.id.indexOf("_timeline_bars")==-1) {
                id = e.target.parentElement.id
                strip = e.target.id
            }
            this.timeline_scrub_function(e.offsetX-10, e.offsetY, id, strip);
        }
    },

    timeline_scrub_mouseenter: function(e) {
        if (this.mousehold_flag) {
            this.mousehold_flag=false;
        }
    },

    timeline_scrub_function: function(posx, posy, id, strip) {
        var prevtarget = vData.instances[this.scrubber.attr("id").replace("_main_scrubber", "")];

        var posy = parseInt(posy/15)

        var el_width = this.timeline_set_element[posy].width();

        var pos_el = this.timeline_set_element[posy].position().left;

        var time_length = this.timeline_lengths[posy];

        var arr = this.timeline_set[posy];

        var concat_id = id.replace("_timeline_bars", "");
        var arr_id = concat_id.split("_");

        var real_id = arr_id[0];

        var index = this.scene_set[real_id].index;

        var element = arr[index].element;

        var addposx = 0;

        if (strip!=null) {
            console.log(strip)
            addposx = this.trigger_elements[strip].position().left
        }

        posx = posx+element.position().left;
        posx += addposx

        var true_time = ((posx*time_length)/(el_width))-pos_el;

        this.scrubber.css({"left": posx, "top": posy*15});

        var scene_length = 0;
        var prev_scene_length = 0;
        var i = 0;
        for (i in arr) {

            scene_length += arr[i].end - arr[i].begin

            if (true_time<scene_length) break;

            prev_scene_length = scene_length;

        }

        var obj = arr[i];

        prevtarget.on_back();

        this.scrubber.attr("id", obj.id+"_main_scrubber");
        vData.instances[obj.id].on_show();
        vData.instances[obj.id].seek((true_time-prev_scene_length)+vData.instances[obj.id].data.begin);

    }

};