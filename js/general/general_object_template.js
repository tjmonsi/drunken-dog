"use strict";

/*---------------------- button_UI -------------------------*/

var general_object = function(parent, data) {
	this.classType = "general_object"
	this.parent = parent;
	this.data = data;

	this.start();

}

general_object.prototype = {

    start: function() {
        if (this.parent!='test') this.init();
        else this.test();
    },

	init: function() {
		 this.id = this.data.id

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


        // this should be last
        vData.delete_instance(this.id);
    }

}