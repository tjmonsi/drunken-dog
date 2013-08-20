/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 18/8/13
 * Time: 1:38 PM
 * To change this template use File | Settings | File Templates.
 */

var interactionElement = Class.extend({
    init: function(parent, data) {
        this.parent = parent;
        this.data = data;
        this.id = this.data.id;
        this.mode = this.data.defaultMode;

        if (this.parent==null) throw new Error ("parent should not be null");
        if (this.id==null) throw new Error ("Forgot creating data in data");
        if (this.data==null) throw new Error ("data should not be null");
        if (this.mode==null) throw new Error ("there's no defaultMode in data");

        this.mousedown_flag=false;
        this.mouseover_flag=false;

        this.run();
    },

    run: function() {
        this.element = saveElement(this.parent, "div", this.id, this.data.class);
        this.element.css(this.data.css);
        this.createMouseInteractions();
    },

    // set mouse interactions
    createMouseInteractions: function() {

        // mouse click
        this.element.click($.proxy(this.on_click, this));
        this.element.bind("contextmenu", $.proxy(this.right_click, this));

        //mouse up and down
        this.element.mousedown($.proxy(this.on_mousedown, this));
        this.element.mousemove($.proxy(this.on_mousemove, this));
        this.element.mouseup($.proxy(this.on_mouseup, this));

        //enter and leaving target area
        this.element.mouseleave($.proxy(this.on_mouseleave, this));
        this.element.mouseenter($.proxy(this.on_mouseenter, this));

    },

    consolidateEvent: function(e, data) {
        var event = {};
        event.target = e.target;
        event.button = e.button;
        event.x = e.pageX - this.element.offset().left;
        event.y = e.pageY - this.element.offset().top;
        event.data = {};
        event.data.mousedown_flag = this.mousedown_flag;
        event.data.mouseover_flag = this.mouseover_flag;
        event.data.timeStamp = e.timeStamp;

        if (data!=null) {
            event.data.object_data = data;
            event.default_return_val = data.default_return_val;
        } else {
            event.default_return_val = null;
        }

        return event
    },

    mouseevent: function(mouseevent, e) {
        if (this.data[mouseevent]==null) return e.default_return_val;
        if (this.data[mouseevent][this.mode]==null) return e.default_return_val;
        return this.data[mouseevent][this.mode](e);
    },

    on_click: function(e) {
        // catches right click
        if (e.button==2) return;
        var event = this.consolidateEvent(e, this.data.on_click.data);

        return this.mouseevent("on_click", event);
    },

    right_click: function(e) {
        var event = this.consolidateEvent(e, this.data.right_click.data);
        return this.mouseevent("right_click", event);
    },

    on_mousedown: function(e) {
        if (e.button==2) return;
        this.mousedown_flag = true;
        //e.preventDefault();
        var event = this.consolidateEvent(e, this.data.on_mousedown.data);
        return this.mouseevent("on_mousedown", event);
    },

    on_mousemove: function(e) {
        var event = this.consolidateEvent(e, this.data.on_mousemove.data);
        return this.mouseevent("on_mousemove", event);
    },

    on_mouseup: function(e) {
        this.mousedown_flag = false;
        var event = this.consolidateEvent(e, this.data.on_mouseup.data);
        return this.mouseevent("on_mouseup", event);
    },

    on_mouseleave: function(e) {
        this.mouseover_flag = false;
        var event = this.consolidateEvent(e, this.data.on_mouseleave.data);
        return this.mouseevent("on_mouseleave", event);
    },

    on_mouseenter: function(e){
        this.mouseover_flag = true;
        var event = this.consolidateEvent(e, this.data.on_mouseenter.data);
        return this.mouseevent("on_mouseenter", event);
    }


})