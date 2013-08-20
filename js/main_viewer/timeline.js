/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 18/8/13
 * Time: 9:25 AM
 * To change this template use File | Settings | File Templates.
 */

var timeLine = Class.extend({
    init: function(parent, data, timelength, time_begin) {
        this.parent = parent;
        this.data = data;
        this.id = this.data.id;
        this.timelength = timelength;
        this.begin = time_begin;

        this.video_id = this.id.replace("_timeline", "");
        this.mousedown_flag = false;
        this.mouseover_flag = false;
        this.timelength = 0;
        this.truetime = 0;

        console.log(this.parent)
        this.width = this.data.width
        this.posy = this.data.height;
        this.height = 10;

        this.run();
    },

    run: function() {
        this.createMouseInteractions();
        this.scrubber = saveElement(this.element, "div", this.id+"_scrubber", ["scrubber"]);
        this.scrubber.css({"top": 0, "left": 0});

        this.scrubber.draggable(this.scrubber_fx);



        log("Timeline: "+this.id+" created successfully", 1);
    },

    createMouseInteractions: function() {

        this.interactionElementData = {
            "id": this.id+"_timeline_area",
            "defaultMode": "normal",
            "class": ["timeline"],
            "default_return_val": true,
            "css": {
                "top": this.posy+10,
                "left": 0,
                "width": this.width,
                "height": this.height
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
        this.interactionElement = new interactionElement(this.parent, this.interactionElementData);
        vD.i(this.interactionElement);
        this.element = this.interactionElement.element;
    },

    setupInteractionElement: function() {
        this.interactionElementData.on_mousedown.normal = $.proxy(this.on_mousedown, this);
        this.interactionElementData.on_mousemove.normal = $.proxy(this.on_mousemove, this);
        this.interactionElementData.on_mouseup.normal = $.proxy(this.on_mouseup, this);
        this.interactionElementData.on_mouseenter.normal = $.proxy(this.on_mouseenter, this);
        this.interactionElementData.on_mouseleave.normal = $.proxy(this.on_mouseleave, this);
    },

    on_mousedown: function(event) {
        if (event.data.mousedown_flag) {
            this.element.css({"cursor": "pointer"})
            this.timelineScrubFX(event.x-5);
        }
    },

    on_mousemove: function(event) {
        if (event.data.mousedown_flag) {
            this.element.css({"cursor": "pointer"})
            this.timelineScrubFX(event.x-5);
        }
    },

    on_mouseup: function(event) {
        this.element.css({"cursor": ""})
    },

    on_mouseleave: function(event) {
        if (event.data.mousedown_flag) {
            this.interactionElement.mousedown_flag=false;
            this.timelineScrubFX(event.x-5)
        }
    },

    on_mouseenter: function(event) {
        if (event.data.mousedown_flag) {
            this.interactionElement.mousedown_flag=false;
        }
    },

    timelineScrubFX: function(posx) {
        var timer = (posx * this.timelength) / (this.element.width()-10);
        this.scrubber.css({"left": posx});

        vD.i(this.video_id).seek(timer+this.begin);
    },

    updatepos: function(time) {
        this.truetime = time-this.begin;

        var posx = (this.truetime*(this.element.width()-10))/this.timelength;
        this.scrubber.css({"left": posx});
    },

    scrubber_fx: {
        axis: 'x',
        containment: 'parent',
        cursor: 'pointer',
        start: function() {
            var target =vD.i(this.id.replace("_timeline_scrubber",""));
            target.pause();
        },
        drag: function(){

        },
        stop: function() {
            var target = vD.i(this.id.replace("_timeline_scrubber",""));
            var posx = target.timeline.scrubber.position().left;

            target.timeline.truetime = (posx * target.timeline.timelength)/(target.timeline.element.width()-10);
            target.seek(target.timeline.truetime+target.timeline.begin);
        }
    }


})
