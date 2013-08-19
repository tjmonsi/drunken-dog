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
        this.timeline_container.css({"width": vid_max_width});
        this.visual_element = saveElement(this.timeline_container, "div", this.id+"_visual_element");
        this.visual_element.css({"width": vid_max_width});

        // this.element

    },

    timeline: function(data, flag) {

        var t_index = null;
        var index = null;

        if (flag==null) flag="add";

        if ((flag=="add") && (flag=="temp")) {

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
                    for (var i in this.temporary_set) {
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

        for (var i in arr) {

            var obj = arr[i];
            var length = obj.end - obj.begin;

            var pix_length = main_t_bar * (length/time_length);

            obj.element = save_element(this.timeline_set_element[t_index], "div", obj.id+"_"+t_index+"_timeline_bars", ["timeline_bar"]);
            obj.element.css({"width": pix_length-4});

            arr[i] = obj;

        }

        this.timeline_arr[t_index].arr = arr;
    },

    trigger_bars: function(obj, flag) {

        if (flag==null) flag="add";

        if (flag=="add") {

            var id = obj.id;
            var t_index = this.scene_set[obj.video_id].t_index;
            var index = this.scene_set[obj.video_id].index;

            var arr = this.timeline_arr[t_index];
            var new_obj = arr[index];

            var vid_begin = vD.i(obj.video_id).data.begin;
            var vid_end = vD.i(obj.video_id).data.end;

            var time_start = obj.begin-vid_begin;
            var time_end;

            if (obj.end!=null) time_end = obj.end-vid_begin;
            else time_end = (obj.begin+0.15)-vid_begin;

            var time_end = (obj.begin+0.15)-vid_begin;

            var width = new_obj.element.width();
            var time_length = vid_end-vid_begin;

            var strip_width = (width * strip_time)/time_length;
            var posx = (width * time_start)/time_length;
            posx = posx + new_obj.element.position().left+10;

            if (strip_width < 2) strip_width = 2;




        }
    }

})