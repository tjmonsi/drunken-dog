//data_Model

"use strict";

var data_Model = function(parent, id) {
	this.classType = "data_Model"
	this.parent = parent
	this.instances = {};
	this.id = id;
    this.data = null;
	this.start();

}

data_Model.prototype = {

    start: function() {
        if (this.parent!='test') this.init();
        else this.test();
    },

	init: function() {
		this.add_instances(new main_Timeline(this.parent, "global_Timeline"))

        try {
            var vars = this.get_url_vars();
            var file = "";
            if (vars!=null) {
                if (vars.file!=null) {
                    file = vars.file;
                } else {
                    file = "data/iv_sample2.json"
                }
            } else {
                throw new Error("Something is wrong with vars file")
            }

            this.data = $.parseJSON(this.load_file(file));

            if (debug) console.log(file+"\t\t\t\t\t\t\t\t\t\t\t"+system.general.data_loaded)
        } catch (e) {
            console.error(e);
            return
        }

		if (debug) creation_success(this.classType, this.id)
	},

    test: function(){
        var test_code = 0;

        if (test_run) {
            
        }

        return test_code;
    },

    get_url_vars: function() {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },

    load_file: function(filename) {
        var oRequest = new XMLHttpRequest();
        var sURL = "http://"+ self.location.hostname + "/faq/requested_file.htm";

        oRequest.open("GET",filename,false);
        oRequest.setRequestHeader("Chrome",navigator.userAgent);
        oRequest.send(null)

        if (oRequest.status==200) return oRequest.responseText;
        else alert("Error executing XMLHttpRequest call!");


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

//@ sourceURL=../general/data_model.js