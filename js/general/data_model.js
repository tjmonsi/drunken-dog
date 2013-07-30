"use strict";

var data_Model = function(parent, id) {
	this.classType = "data_Model"
	this.parent = parent
	this.instances = {};
	this.id = id;
	this.start();

}

data_Model.prototype = {

    start: function() {
        if (this.parent!='test') this.init();
        else this.test();
    },

	init: function() {
		this.add_instances(new main_Timeline(this.parent, "global_Timeline"))

		if (debug) creation_success(this.classType, this.id)
	},

    test: function(){
        var test_code = 0;

        if (test_run) {
            
        }

        return test_code;
    },

    add_instances: function(obj) {

    	if (this.check_instances(obj.id)!=null) {
    		this.instances[obj.id] = obj
    		return true
    	} else {
    		return false
    	}
    },

    check_instances: function(id) {
    	if (this.instances[id]!=null) {
    		return this.instances[id].classType
    	} else {
    		return null
    	}
    },

    delete_instances: function(id) {
    	this.instances[id]=null;
    }






}