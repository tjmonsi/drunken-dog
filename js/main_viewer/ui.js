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
        try {
            this.element = saveElement(this.parent, "div", this.id);

            vD.i(new mainVideoPlayer(this.element, {"id": "mainVideoPlayer"}));

            for (var i in vD.data.data.embedded_objects) {
                var obj = vD.data.data.embedded_objects[i];

                for (var j in vD.data.data.embedded_objects) {
                    var obj2 = vD.data.data.embedded_objects[j];

                    if (obj2.id == obj.parent) break
                    else obj2 = null;

                }

                for (var key in obj) {
                    if (obj[key]=="inherit") {
                        if (obj2!= null) obj[key] = obj2[key];
                        else throw new Error ("Something is wrong with inherit");
                    }
                }
                var layer = "";

                if ((obj.object_data.on_element) || (obj.draggable)) layer = "element";
                else layer = "objectLayer"

                if (window['embedded'+capFirst(obj.type)]==null) throw new Error ("No object yet for "+obj.type);
                vD.i(new window['embedded'+capFirst(obj.type)](vD.i(obj.scene_id)[layer], obj));

                /*if (obj.type == "form") {
                    var element =
                }*/
            }

            // add all action objects;

            for (var i in vD.data.data.actions) {
                var obj = vD.data.data.actions[i];
                vD.i(new actionObject(this.element,obj));
            }

            //console.log(vD.discussion_set);
            for (var i in vD.discussion_set) {
                vD.createComments(vD.discussion_set[i]);
            }

        } catch (e) {
            console.error(e.stack);
            log(e.stack.toString());
        }

    },

    set_Triggers: function() {

        for (var i in vD.data.data.embedded_objects) {

        }

    }

})
