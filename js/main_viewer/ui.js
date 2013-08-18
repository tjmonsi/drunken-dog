/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 17/8/13
 * Time: 10:39 PM
 * To change this template use File | Settings | File Templates.
 */

"use strict";

var viewerUI = Class.extend({
    init: function(parent, id) {
        this.parent = parent;
        this.id = id;

        this.run();
    },

    run: function() {

        this.element = saveElement(this.parent, "div", this.id);

        vD.i(new mainVideoPlayer(this.element, {"id": "mainVideoPlayer"}));



    },

    set_Triggers: function() {

        for (var i in vD.data.data.embedded_objects) {

        }

    }

})
