/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 20/8/13
 * Time: 1:07 AM
 * To change this template use File | Settings | File Templates.
 */

var buttonClass = Class.extend({
    init: function(parent, label, id, callback, color) {
        this.parent = parent;
        this.label = label;
        this.id = id;
        this.callback = callback;
        this.color = color;

        if (this.color==null) this.color="black";

        vD.i(this);
        this.run();
    },

    run: function() {
        this.element = saveElement(this.parent, "div", this.id, ["button", this.color]);
        this.element.append(this.label);
        this.element.click($.proxy(this.on_click, this));
    },

    on_click: function(e) {
        try {
            this.callback();
        } catch (error) {
            console.error(error.stack);
            log(error.stack.toString());
        }
    },

    update_label: function(new_label) {
        this.label = new_label;
        this.element.empty();
        this.element.append(this.label);
    },

    update_color: function(color) {
        this.element.removeClass(this.color);
        this.color = color;
        this.element.addClass(this.color);
    }
})

var buttonIcon = buttonClass.extend({
    init: function(parent, icon, id, label, callback, color) {
        this.icon = icon;
        this._super(parent, label, id, callback, color);

        //this.run();
    },

    run: function() {
        this.element = saveElement(this.parent, "div", this.id, ["ui-icon", this.icon], {"title": this.label});
        this.element.append(this.label);
        this.element.click($.proxy(this.on_click, this));
    },

    update_label: function(new_label) {
        this._super(new_label);
        this.element.attr('title', this.label);
    }
})