/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 18/8/13
 * Time: 9:25 AM
 * To change this template use File | Settings | File Templates.
 */

var timeLine = Class.extend({
    init: function(parent, id, timelength, time_begin) {
        this.parent = parent;
        this.id = id;
        this.timelength = timelength;
        this.time_begin = time_begin;

        this.video_id = this.id.replace("_timeline", "");
        this.mousedown_flag = false;
        this.mouseover_flag = false;
        this.timelength = 0;
        this.truetime = 0;

        this.run();
    },

    run: function() {
        this.element = saveElement(this.parent, "div", ["timeline"]);
        this.scrubber = saveElement(this.element, "div", this.id+"_scrubber", ["scrubber"]);
        this.scrubber.css({"top": 0, "left": 0});

        this.scrubber.draggable(this.scrubber_fx);

        this.createMouseInteractions();

        log("Timeline: "+this.id+" created successfully", 1);
    },

    createMouseInteractions: function() {

        // mouse click
        this.element.click($.proxy(this.on_click, this));
        this.element.bind("contextmenu", $.proxy(this.right_click, this));

        //mouse up and down
        this.element.mousedown($.proxy(this.on_mousedown), this);
        this.element.mousemove($.proxy(this.on_mousemove), this);
        this.element.mouseup($.proxy(this.on_mouseup), this);

        //enter and leaving target area
        this.element.mouseleave($.proxy(this.on_mouseleave), this);
        this.element.mouseenter($.proxy(this.on_mouseenter), this);

    },

    on_click: function(e) {

        // catches right click
        if (e.button==2) return;

        switch(this.mouse_option) {
            case 1:
                break;
            default:
                return;
        }
    },

    right_click: function(e) {

        return false;
    },

    on_mousedown: function(e) {
        this.mousedown_flag = true;

        switch(this.mouse_option) {
            case 1:
                break;
            default:
                return;
        }
    },

    on_mousemove: function(e) {
        switch(this.mouse_option) {
            case 1:
                break;
            default:
                return;
        }
    },

    on_mouseup: function(e) {
        this.mousedown_flag = false;

        switch(this.mouse_option) {
            case 1:
                break;
            default:
                return;
        }
    },

    on_mouseleave: function(e) {
        this.mouseover_flag = false;

        switch(this.mouse_option) {
            case 1:
                break;
            default:
                return;
        }
    },

    on_mouseenter: function(e){
        this.mouseover_flag = true;

        switch(this.mouse_option) {
            case 1:
                break;
            default:
                return;
        }
    },
})
