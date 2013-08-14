//data_Model

"use strict";

var data_Model = function(parent, id) {
	this.classType = "data_Model"
	this.parent = parent
	this.instances = {};
    this.triggers = {};
    this.comment_set = {};
    this.annotation_set = {};
    this.discussion_set = {};
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
        try {
            var vars = this.get_url_vars();
            var file = "";
            if (vars!=null) {
                if (vars.file!=null) {
                    file = vars.file;
                } else {
                    file = "data/iv_sample2.json"
                }

                if (vars.debug2!=null) {
                    debug2 = vars.debug2
                }

                if (vars.debug!=null) {
                    debug = vars.debug
                }
            } else {
                throw new Error("Something is wrong with vars file")
            }

            this.data = $.parseJSON(this.load_file(file));

            if (debug) console.log("\n\n"+file+"\t\t\t\t\t\t\t\t\t\t\t"+system.general.data_loaded+"\n\n")
        } catch (e) {
            console.error(e.stack);
            return
        }

        //this.add_instances(new main_Timeline(this.parent, "global_Timeline"))

		if (debug) creation_success(this.classType, this.id)
        if (debug2) console.log(this);
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

    	if (this.check_instances(obj.id)==null) {
    		this.instances[obj.id] = obj

            //if (debug) console.log(obj)
    		return true
    	} else {

            if (debug) {

                console.log("adding instance error")
                console.log(obj)
            }
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
    },

    comments: function(val, del) {

        try {

            if (val.id!=null) {
                var id = val.id
                var obj = val

            } else {
                var id = val;
            }

            if (del) {
                this.comment_set[id].destroy();
                return
            }

            if (this.comment_set[id]!=null) {

                return this.comment_set[id];

            } else if (obj!=null) {
                this.comment_set[id] = obj
                return
            } else {
                return
            }

            throw new Error ("don't know what to do with comments:\nval: "+val.toString()+" \ndel: "+del);

        } catch (e) {
            console.error(val)
            console.error(e.stack);
        }

    },

    annotations: function(val, del) {
        try {

            if (val.name!=null) {
                var id = val.name
                var obj = val

            } else {
                var id = val;
            }
            console.log(val);
            if (del) {


                if (this.annotation_set[id].destroy!=null) this.annotation_set[id].destroy()
                this.annotation_set[id] = null;
                return
            }

            if (this.annotation_set[id]!=null) {

                return this.annotation_set[id];

            } else if (obj!=null) {
                this.annotation_set[id] = obj
                return
            } else {
                return
            }

            throw new Error ("don't know what to do with annotation_set:\nval: "+val.toString()+" \ndel: "+del);

        } catch (e) {
            console.error(val)
            console.error(e.stack);
        }
    },

    discussions: function(val, del) {
        try {

            if (val.id!=null) {
                var id = val.id
                var obj = val

            } else {
                var id = val;
            }

            if (del) {
                this.discussion_set[id].destroy();
                return
            }

            if (this.discussion_set[id]!=null) {

                return this.discussion_set[id];

            } else if (obj!=null) {
                this.discussion_set[id] = obj
                return
            } else {
                return
            }

            throw new Error ("don't know what to do with discussion:\nval: "+val.toString()+"\ndel: "+del);

        } catch (e) {
            console.error(val)
            console.error(e.stack);
        }
    }


}

//@ sourceURL=../general/data_model.js