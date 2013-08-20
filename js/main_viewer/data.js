"use strict";

var dataModel = Class.extend({
    init: function(parent, id) {
        this.parent = parent;
        this.id = id;

        this.data = null;
        this.instance_set = {};
        this.trigger_set = {};

        this.run();
    },

    run: function() {
        try {
            var vars = this.getURLVars();
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

            this.data = $.parseJSON(this.loadFile(file));
            // ADD LOAD OF COMMENTS HERE

            log("Loaded all data", 1);
            //log(this.data, 2);

        } catch (e) {
            console.error(e.stack);
            log(e.stack.toString());
        }
    },

    getURLVars: function() {
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

    loadFile: function(filename) {
        var oRequest = new XMLHttpRequest();
        var sURL = "http://"+ self.location.hostname + "/faq/requested_file.htm";

        oRequest.open("GET",filename,false);
        oRequest.setRequestHeader("Chrome",navigator.userAgent);
        oRequest.send(null)

        if (oRequest.status==200) return oRequest.responseText;
        else alert("Error executing XMLHttpRequest call!");
    },

    instances: function(val, del) {
        try {
            var id = null;
            var obj = null;

            //if (val==null && del==true) return 2;
            // checks if value is an object with id or if it is just an id
            if (val.id!=null) {
                id = val.id;
                obj = val;
            } else {
                id = val;
            }

            // check if id is null... then throw error
            if (id==null) {
                throw new Error("id is needed to do CRD for instances")
                return;
            }

            // if del flag is true, delete object
            if (del) {
                //console.log(id);
                //console.log(this.instance_set[id])
                if (this.instance_set[id]!=null) {
                    this.instance_set[id]=null;
                    return 2
                } else {
                    return 3
                }

            }

            // check if id -> obj in instance_set exists;
            if (this.instance_set[id]!=null) {
                //if (obj!=null) this.instance_set[id] = obj;
                //else
                return this.instance_set[id];

            // if it doesn't exist (meaning id is free to connect to obj)
            // and val is an object to be saved... then save
            } else if (obj!=null) {
                this.instance_set[id] = obj;
                return 1

            // if obj doesn't exist
            // then return null
            } else if (obj==null) {
                return null;
            }

            // if something happened that these things didn't catch, throw error
            throw new Error ("don't know what to do with instances:\nval: "+val.toString()+" \ndel: "+del);

        } catch (e) {
            console.error(val)
            console.error(e.stack);
            log(e.stack.toString());
            return;
        }
    },

    reset_triggers: function(video, val) {
        if (video==null) throw new Error("There's no video id");
        if (val==null) throw new Error("There's no time");

        var time = val.toString();

        if (this.trigger_set[video]==null) return null;

        var arr_set = [];

        // return hashtable of objects for time
        for (var k in this.trigger_set[video]) {

            if (parseFloat(time)<= parseFloat(k)) {
                arr_set.push(this.trigger_set[video][k])
            }
        }
        //console.log(arr_set)

        for (var i in arr_set) {
            for (var j in arr_set[i]) {
                var obj = arr_set[i][j];

                if (vD.i(obj.id).fromAction) {
                    vD.i(obj.id).fromAction = false;
                } else {
                    vD.i(obj.id).on_hide();
                }

                if (obj.retrig) {
                    obj.triggered=false;
                    this.triggers(video, obj);
                    //if (obj.id=="textlabel2") console.log(vD.trigger_set[video]);
                }
            }
        }


    },

    triggers: function(video, val, del, val2) {
        try {
            var time = null;
            var obj = null;

            // checks if value is an object with id or if it is just an id
            if (val.time!=null) {
                time = val.time.toString();
                obj = val;
            } else {
                time = val.toString();
            }


            // checks if 2nd value after delete is the object that we want to delete: used only for delete
            // if obj doesn't exist, all objects will be deleted in that time
            if (val2!=null) {
                obj = val;
            }

            if (video==null) {
                throw new Error ("video_id is needed to CRD object")
                return;
            }
            // check if id is null... then throw error
            if (time==null) {
                throw new Error("time is needed to CRD object ")
                return;
            }

            if ((!del) && (val2!=null)) {
                throw new Error("val2 should be null");
                return 6
            }

            // if del flag is true, delete object
            if (del) {
                if (this.trigger_set[video]!=null) {
                    if (this.trigger_set[video][time]!=null) {
                        if (obj!=null) {
                            var id = obj.id;
                            if (this.trigger_set[video][time][id]!=null) {
                                this.trigger_set[video][time][id]=null;
                                return 2;
                            } else {
                                return 3;
                            }
                        } else {
                            for (var key in this.trigger_set[video][time]) {
                                this.trigger_set[video][time][key]=null
                            }
                            this.trigger_set[video][time]=null;
                            return 4;
                        }
                    } else {
                        return 3;
                    }
                } else {
                    return 3;
                }

            }

            // catch val2... if val2 exists... object should be null for this operation
            if (val2!=null) obj=null;

            // search first


            if (this.trigger_set[video]!=null) {
                if (this.trigger_set[video][time]!=null) {
                    if (obj!=null) {
                        // if object exist... put it on the set
                        var id = obj.id
                        this.trigger_set[video][time][id]=obj;
                        return 1;
                    } else {

                        return this.trigger_set[video][time];
                    }
                } else if (obj!=null) {
                    // if object exist... put it on the set
                    var id = obj.id;
                    this.trigger_set[video][time] = {};
                    this.trigger_set[video][time][id]=obj;
                    return 1;
                } else if (obj==null) {
                    // there's no object... nothing to save
                    //return null;
                    // search first
                    var arr_set = [];

                    // return hashtable of objects for time
                    for (var k in this.trigger_set[video]) {

                        if (parseFloat(time)>= parseFloat(k)) {
                            arr_set.push(this.trigger_set[video][k])
                        }
                    }
                    //console.log(arr_set)
                    return arr_set;
                }
            } else if (obj!=null) {
                var id = obj.id;
                this.trigger_set[video]={};
                this.trigger_set[video][time] = {};
                this.trigger_set[video][time][id]=obj;
                return 1;
            } else if (obj==null) {
                // there's no object... nothing to save
                return null;
            }

            // if something happened that these things didn't catch, throw error
            throw new Error ("don't know what to do with triggers:\nval: "+val.toString()+" \ndel: "+del);

        } catch (e) {
            console.error(val)
            console.error(e.stack);
            log(e.stack.toString());
            return;
        }
    },

    // shortcut for instances
    i: function(val, del) {
        return this.instances(val, del);
    }

});