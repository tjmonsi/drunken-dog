/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 18/8/13
 * Time: 4:50 PM
 * To change this template use File | Settings | File Templates.
 */

"use strict";

var mainTimeline = Class.extend({
    init: function(parent, id) {
        this.parent = parent;
        this.id = id;

        //this.timeline_set = {};
        //this.

        this.timeline_arr = [];
        this.temporary_arr = [];
        this.scene_set = {};
        this.trigger_elements = {};

        this.run();
    },

    run: function() {

        if (vD.data.data.scene_objects.length==0) {
            console.log("scene_objects is non-existend ");
            return null;
        }

        for (var i in vD.data.data.scene_objects) {
            this.timeline(vD.data.data.scene_objects[i]);
        }



        this.timeline_container = saveElement(this.parent, "div", this.id);
        this.timeline_container.css({"width": vid_max_width, "top": vid_max_width*(9/16)});
        this.visual_element = saveElement(this.timeline_container, "div", this.id+"_visual_element");
        this.visual_element.css({"width": vid_max_width});

        this.mainTimelineData = {
            "id": this.id+"_mainTimeline",
            "defaultMode": "normal",
            "class": ["mainTimeline"],
            "css": {
                "top": 0,
                "left": 0,
                "width": vid_max_width,
                "height": 15
            },
            "on_click": {},
            "right_click": {},
            "on_mousedown": {},
            "on_mousemove": {},
            "on_mouseup": {},
            "on_mouseenter": {},
            "on_mouseleave": {}
        }

        this.setupInteractionElement();
        this.interactionElement = new interactionElement(this.timeline_container, this.mainTimelineData);
        vD.i(this.interactionElement);
        this.element = this.interactionElement.element;
        this.element.css({"z-index": 11000});
        this.scrubber = saveElement(this.element, "div", this.timeline_arr[0].arr[0].id+"_main_scrubber", ["main_scrubber"]);

        this.scrubber.css({"top": 0, "left": 0, "width": 10, "height": 15});
        this.scrubber.draggable(this.scrubber_fx);

        this.set_primary_timeline(0);

        //this.mainTimeline = new

        // this.element
        //log("main_Timeline created", 1);
    },

    setupInteractionElement: function() {
        this.mainTimelineData.on_mousedown.normal = $.proxy(this.timeline_scrub_start, this);
    },

    timeline: function(data, flag) {
        //console.log(data);
        var t_index = null;
        var index = null;

        if (flag==null) flag="add";
        //console.log(flag);
        if ((flag=="add") || (flag=="temp")) {
            //console.log(flag)
            var new_data = {
                "id": data.id,
                "prev": data.prev,
                "next": data.next,
                "begin": data.begin,
                "end": data.end
            }

            if (data.prev == null) {

                var timeline = [];

                timeline.push(new_data);
                index = timeline.indexOf(new_data);

                this.timeline_arr.push({"arr":timeline});
                t_index = this.timeline_arr.length-1;

            } else {

                // checks if the previous scene is already been loaded
                if (this.scene_set[data.prev] != null) {

                    t_index = this.scene_set[data.prev].t_index;
                    index = this.scene_set[data.prev].index+1;
                    var timeline = this.timeline_arr[t_index].arr;

                    timeline.splice(index, 0, new_data);

                    this.timeline_arr[t_index].arr = timeline;

                } else {

                    if (flag == "add") this.temporary_arr.push(data);

                }

            }

            if ((index!=null) && (t_index!=null)) {
                this.scene_set[data.id] = {"index": index, "t_index": t_index};

                this.update_timeline_lengths(t_index);

                if (flag=="add") {
                    for (var i=0; this.temporary_arr.length; i++) {
                        if (this.timeline(this.temporary_set[i], "temp")) {
                            i=0;
                        }
                    }
                }

                return true;
            } else {
                return false;
            }

        } // other flag
    },

    update_timeline_lengths: function(t_index) {

        var timeline = this.timeline_arr[t_index].arr;
        var timeline_length = 0;

        var scene_length;

        for (var i in timeline) {
            scene_length = timeline[i].end - timeline[i].begin;
            timeline_length += scene_length;
        }

        this.timeline_arr[t_index].length = timeline_length;

    },

    set_primary_timeline: function(t_index) {

        var arr = this.timeline_arr[t_index].arr;
        var time_length = this.timeline_arr[t_index].length;

        this.timeline_arr[t_index].element = saveElement(this.visual_element, "div", "main_timeline_bar_"+t_index, ["main_timeline_bar"]);
        this.timeline_arr[t_index].element.css({"width": vid_max_width});

        var main_t_bar = vid_max_width;

        var posx = 0;

        for (var i in arr) {

            var obj = arr[i];
            var length = obj.end - obj.begin;

            var pix_length = main_t_bar * (length/time_length);

            obj.element = saveElement(this.timeline_arr[t_index].element, "div", obj.id+"_"+t_index+"_timeline_bars", ["timeline_bar"]);
            obj.element.css({"width": pix_length-2, "height": 15, "left": posx});

            posx += pix_length;

            arr[i] = obj;

        }

        this.timeline_arr[t_index].arr = arr;
    },

    trigger_bars: function(obj, flag, color) {

        if (flag==null) flag="add";

        if (color==null) color = "#00FF00"

        if (flag=="add") {

            var id = obj.id;
            var t_index = this.scene_set[obj.video_id].t_index;
            var index = this.scene_set[obj.video_id].index;

            //console.log(obj);
            //console.log(this.scene_set[obj.video_id]);

            var arr = this.timeline_arr[t_index].arr;
            var new_obj = arr[index];

            var vid_begin = vD.i(obj.video_id).data.begin;
            var vid_end = vD.i(obj.video_id).data.end;

            //console.log(vid_begin);
            //console.log(vid_end);

            var time_start = obj.begin-vid_begin;
            var time_end;

            //console.log(time_start);

            if (obj.end!=null) time_end = obj.end-vid_begin;
            else time_end = (obj.begin+0.15)-vid_begin;

            //var time_end = (obj.begin+0.15)-vid_begin
            // ;
            var strip_time = time_end - time_start;

            //console.log(strip_time);

            var width = new_obj.element.width();
            var time_length = vid_end-vid_begin;

            //console.log(width);
            //console.log(time_length);

            var strip_width = (width * strip_time)/time_length;
            var posx = (width * time_start)/time_length;

            //console.log(posx);

            //var tempx =

            //posx = posx - new_obj.element.position().left+10;

            if (strip_width < 2) strip_width = 2;

            this.trigger_elements[obj.id+"_timeline_bar"] = saveElement(new_obj.element, "div", obj.id+"_timeline_bar", ["timeline_bar"]);
            this.trigger_elements[obj.id+"_timeline_bar"].css({"width": strip_width, "z-index": 11000, "height": 15});
            this.trigger_elements[obj.id+"_timeline_bar"].css({"left": posx});
            this.trigger_elements[obj.id+"_timeline_bar"].css({"background-color": color});

        } // other flags

    },

    updatepos: function(time, video_id) {
        this.scrubber.attr("id", video_id+"_main_scrubber");

        var t_index = this.scene_set[video_id].t_index;
        var index = this.scene_set[video_id].index;

        var timeline = this.timeline_arr[t_index].arr;
        var obj = timeline[index];

        var scene_length = 0;
        var true_time = time - obj.begin;

        for (var i in timeline) {
            if (i == index) break;
            scene_length += (timeline[i].end - timeline[i].begin);
        }

        var posx = ((true_time + scene_length) * this.timeline_arr[t_index].element.width()-40) / this.timeline_arr[t_index].length;

        if (posx >= this.timeline_arr[t_index].element.position().left+(this.timeline_arr[t_index].element.width())-10) posx = this.timeline_arr[t_index].element.position().left-10;


        this.scrubber.css({"left": posx});
    },

    scrubber_fx: {
        containment: 'parent',
        cursor: 'pointer',
        grid: [1, 15],
        start: function() {
            var target = vD.i(this.id.replace("_main_scrubber", ""));
            target.pause();
            log("mainTimeline:start_scrub:"+this.id.split("_")[0])
        },

        drag: function() {

        },

        stop: function() {
            log("mainTimeline:stop_scrub:"+this.id.split("_")[0])
            var prevtarget = vD.i(this.id.replace("_main_scrubber", ""));
            var timeline = vD.i("mainTimeline");
            var posx = timeline.scrubber.position().left;
            var posy = timeline.scrubber.position().top;
            var int_y = parseInt(posy/15);

            var el_width = timeline.timeline_arr[int_y].element.width();
            var pos_el = timeline.timeline_arr[int_y].element.position().left;
            var time_length = timeline.timeline_arr[int_y].length;
            var arr = timeline.timeline_arr[int_y].arr;
            var true_time = ((posx * time_length) / (el_width-10)) - pos_el;
            var scene_length = 0;
            var prev_scene_length = 0;

            for (var i in arr) {
                scene_length += arr[i].end - arr[i].begin;

                if (true_time < scene_length) break;
                prev_scene_length = scene_length;
            }

            var obj = arr[i];
            prevtarget.on_back();

            timeline.scrubber.attr("id", obj.id+"_main_scrubber");
            vD.i(obj.id).on_show();
            vD.i(obj.id).seek((true_time - prev_scene_length) + vD.i(obj.id).data.begin);
        }
    },

    timeline_scrub_start: function(e) {
        if (e.data.mousedown_flag) {
            var id = e.target.id;
            this.timeline_scrub_function(e, id);
        }
    },

    timeline_scrub_function: function(e) {

        var prevtarget = vD.i(this.scrubber.attr("id").replace("_main_scrubber", ""));
        var posy = parseInt(e.y/15);

        var el_width = this.timeline_arr[posy].element.width();
        var pos_el = this.timeline_arr[posy].element.position().left;
        var time_length = this.timeline_arr[posy].length;
        var arr = this.timeline_arr[posy].arr;

        var posx = e.x

        var true_time = ((posx * time_length) / (el_width)) - pos_el;

        this.scrubber.css({"left": posx, "top": posy*15});

        var scene_length =0;
        var prev_scene_length = 0;

        for (var i in arr) {
            scene_length += arr[i].end - arr[i].begin;
            if (true_time < scene_length) break;
            prev_scene_length = scene_length;

        }

        var obj = arr[i];

        prevtarget.on_back();

        this.scrubber.attr("id", obj.id+"_main_scrubber");
        vD.i(obj.id).on_show();
        vD.i(obj.id).seek((true_time-prev_scene_length)+vD.i(obj.id).data.begin)


        log("mainTimeline:timeline_click:"+this.id.split("_")[0])

    }

})