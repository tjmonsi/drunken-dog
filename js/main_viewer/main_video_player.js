/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 17/8/13
 * Time: 10:39 PM
 * To change this template use File | Settings | File Templates.
 */

"use strict";

var mainVideoPlayer = Class.extend({
    init: function(parent, data) {
        this.parent = parent;
        this.data = data;
        this.id = this.data.id;

        this.video_set = {};

        this.run();
    },

    run: function() {
        try {
            this.element = saveElement(this.parent, "div", this.id);
            this.element.css({"top": 10, "left": 20});
            // check if scene_objects has elements

            if (vD.data.data.scene_objects.length==0) throw new Error ("No scenes at data to load video. please check");

            for (var i in vD.data.data.scene_objects) {
                var data = vD.data.data.scene_objects[i];

                var obj = new videoPlayer(this.element, data, vid_max_width, true);

                var res = vD.i(obj);
                if (res==null) throw new Error ("Cannot create object videoPlayer");

                //set height
            }

            vD.i(vD.data.start_scene).on_show();

            this.mainTimeline = new mainTimeline(this.element, "mainTimeline");
            vD.i(this.mainTimeline);

            log("Main Video Player is created", 1);

        } catch (e) {
            console.error(e.stack);
            log(e.stack.toString());
        }
    }


})