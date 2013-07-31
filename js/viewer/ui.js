//viewer_UI

"use strict";

var viewer_UI = function(parent, id) {
	this.classType = "viewer_UI"
	this.parent = parent
	this.id = id

	this.start();
}

viewer_UI.prototype = {

    start: function() {
        if (this.parent!='test') this.init();
        else this.test();
    },

	init: function() {
		this.element = save_element(this.parent, "div", this.id);
		vData.add_instances(new main_Video_Player(this.element, {id:"main_VideoPlayer"}));

		if (debug) creation_success(this.classType, this.id)
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