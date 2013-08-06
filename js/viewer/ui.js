//viewer_UI

"use strict";

var viewer_UI = function(parent, id) {
	this.classType = "viewer_UI"
	this.parent = parent
	this.id = id
    this.embedded_objects = {}
    this.actions = {}

	this.start();
}

viewer_UI.prototype = {

    start: function() {
        if (this.parent!='test') this.init();
        else this.test();
    },

	init: function() {
		this.element = save_element(this.parent, "div", this.id);

        //create video players of scene objects
        this.main_VideoPlayer = new main_Video_Player(this.element, {id:"main_VideoPlayer"})
        vData.add_instances(this.main_VideoPlayer);

        var vid_height = vData.instances["main_VideoPlayer"].element.outerHeight(true)

        //create main timeline object
        this.main_Timeline = new main_Timeline(this.element, "main_Timeline")
        vData.add_instances(this.main_Timeline);



        //add all embedded objects
        for (var i=0; i<vData.data.data.embedded_objects.length; i++) {

            var obj = vData.data.data.embedded_objects[i];

            for (var j=0; j<vData.data.data.embedded_objects.length; j++) {
                var obj2 = vData.data.data.embedded_objects[j];
                if (obj2.id==obj.parent) {
                    break;
                } else {
                   obj2=null;
                }
            }

            for (var key in obj) {

                if (obj[key]=="inherit") {
                    obj[key]=obj2[key];
                }

            }

            //this.embedded_objects[obj.id] = new embedded_objects(vData.instances[obj.scene_id].element, obj)
            vData.add_instances(new embedded_objects(vData.instances[obj.scene_id].element, obj));

        }

        //add  all action objeccts;

        for (var i=0; i<vData.data.data.actions.length; i++){

            var obj = vData.data.data.actions[i];
            //this.actions[obj.id] =  new action_objects(this.element, obj)
            vData.add_instances(new action_objects(this.element, obj));

        }

		if (debug) creation_success(this.classType, this.id)
        if (debug2) console.log(this);
	},

	test: function(){
        var test_code = 0;

        if (test_run) {
            
        }

        return test_code;
    },

    destroy: function() {
        for (var key in this) {
            if (this[key].classType!=null) {
                this[key].destroy();
            }
        }

        //add more here
        this.element.empty();
    }


}