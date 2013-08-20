/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 20/8/13
 * Time: 4:54 PM
 * To change this template use File | Settings | File Templates.
 */

var windowedElement = Class.extend({
    init: function(parent, data, draggable, pad) {
        this.parent = parent;
        this.data = data;
        this.id = this.data.id;
        this.draggable = draggable
        this.pad = pad;
    },

    run: function() {
        this.window = saveElement(this.parent, "div", this.id+"_window", ['windowClass']);
        this.window.css({"left": this.data.x, "top": this.data.y});
        this.window.addClass(this.data.class);

        this.windowHandler = saveElement(this.window, "div", this.id+"_windowHandler", ['windowClassHandler']);
        this.windowHandlerTitle = saveElement(this.windowHandler, "div", this.id+"_windowHandlerTitle", ['windowClassHandlerTitle']);
        this.windowHandlerTitle.append(this.data.windowName);

        this.windowHanlerIcons =saveElement(this.windowHandler, "div", this.id+"_windowHandlerIcons", ['windowClassHandlerIcons']);
        this.windowExit = new button
        //saveElement(this.windowHandlerIcons, "div", this.id+"_windowHanlderExit", )
    }
})
