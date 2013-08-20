/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 20/8/13
 * Time: 9:40 AM
 * To change this template use File | Settings | File Templates.
 */

var contextMenu = Class.extend({
    init: function(parent, data){
        this.parent = parent;
        this.data = data;
        this.id = this.data.id;
        this.video_id = this.data.video_id;

        this.x = 0;
        this.y = 0;

        this.element = null
        this.menu_item = [];

        this.run();
    },

    run: function() {

    },

    on_show: function(x,y) {
        if (this.element==null) {
            this.element = saveElement(this.parent, "div", this.id, ['contextMenu']);

            for (var i in this.data.object_data) {
                this.menu_item[i] = saveElement(this.element, "div", this.id+"_"+this.data.object_data[i].id, ['contextMenuItem']);
                this.menu_item[i].append(this.data.object_data[i].value);
                this.menu_item[i].click($.proxy(this.data.object_data[i].callback, this));
            }
        }

        this.element.css({"left": x, "top": y, "z-index": 12000});

    },

    on_hide: function() {
        if (this.element == null) return;
        this.element.remove();
        this.menu_item = [];
        this.element = null;
    }
})