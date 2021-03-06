/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 30/8/13
 * Time: 9:24 AM
 * To change this template use File | Settings | File Templates.
 */

"use strict";

var dataModel = Class.extend({
    init: function(parent, id) {
        this.parent = parent;
        this.id = id;

        this.data = null;
        this.instance_set = {};
        this.trigger_set = {};
        this.comment_set = {};
        this.discussion_set = {};
        this.annotation_set = {};
        this.discussion_trigger_set = {};

        this.run();
    },

    run: function() {
        try {
            var vars = this.getURLVars();
            var file = "";
            var filename = ""

            if (vars!=null) {
                if (vars.file!=null) {
                    filename = vars.file;
                } else {
                    filename = "myosin_actin1"
                }
                file = "data/"+filename+"_other.json"

                if (vars.debug2!=null) {
                    debug2 = vars.debug2
                }
                if (vars.debug!=null) {
                    debug = vars.debug
                }

                if (vars.source_comments!=null) {
                    var source_file = "data/"+vars.source_comments+".comments.json"
                    if (vars.user==null) vars.user = vars.source_comments
                } else {
                    var source_file = "data/source_comments_"+filename+".comments.json"
                    //if (vars.user==null) vars.user = "source_comments_"+vars.file
                }


                if (vars.user!=null) {
                    this.user = vars.user
                } else {
                    this.user = "user_"+makeID(3);
                }




            } else {
                throw new Error("Something is wrong with vars file")
            }


            this.data = $.parseJSON(this.loadFile(file));
            // ADD LOAD OF COMMENTS HERE

            if (source_file!=null) {

                try {
                    var scd = $.parseJSON(this.loadFile(source_file))
                } catch (e) {
                    console.error(e.stack);
                    scd = null;
                }
                if (scd!=null) {
                    this.comment_set = scd.comment_set;
                    this.discussion_set = scd.discussion_set;
                    this.annotation_set = scd.annotation_set;
                }
                if (this.comment_set==null) this.comment_set = {}
                if (this.discussion_set==null) this.discussion_set = {}
                if (this.annotation_set==null) this.annotation_set = {}

            }



            //log("Loaded all data", 1);
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

        if (oRequest.status==200) {
            var text =  oRequest.responseText;
            //console.log(text);
            return text;
        }
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
    i: function(val, del) {
        return this.instances(val, del);
    },

    createComments: function(dData) {

        /*var discussion_trigger = {
            "time": dData.time,
            "id": dData.id,
            "video_id": dData.video_id
        }

        var discussion_trigger_bar = {
            "id": dData.id,
            "video_id": dData.video_id,
            "begin": dData.time,
            "end": null
        }

        this.dt(dData.video_id, discussion_trigger);
        this.i("mainTimeline").trigger_bars(discussion_trigger_bar, null, "#FF0000")
        // create both discussionthreads and discussionpts
        this.i(new discussionPt(this.i(dData.video_id).element, dData)); */
    },

    comments: function(val, del){
        try {

            if (val.id!=null) {
                var id = val.id;
                var obj = val;
            } else {
                var id = val;
            }

            // check if id is null... then throw error
            if (id==null) {
                throw new Error("id is needed to do CRD for instances")
                return;
            }

            if (del) {
                if (this.comment_set[id]!=null) {
                    this.comment_set[id]=null;
                    return 2
                } else {
                    return 3
                }
            }

            if (this.comment_set[id]!=null) {
                if (obj!=null) {
                    this.comment_set[id] = obj
                    return 1
                } else {
                    return this.comment_set[id];
                }
            } else if (obj!=null) {
                this.comment_set[id] = obj
                return 1

                // if obj doesn't exist
                // then return null
            } else if (obj==null) {
                return null;
            }

            throw new Error ("don't know what to do with comments:\nval: "+val.toString()+" \ndel: "+del);

        } catch (e) {
            console.error(val)
            console.error(e.stack);
            log(e.stack.toString());
            return;
        }
    },
    c: function(val, del) {
        return this.comments(val, del);
    },

    discussions: function(val, del){
        try {

            if (val.id!=null) {
                var id = val.id;
                var obj = val;
            } else {
                var id = val;
            }

            // check if id is null... then throw error
            if (id==null) {
                throw new Error("id is needed to do CRD for instances")
                return;
            }

            if (del) {
                if (this.discussion_set[id]!=null) {
                    this.discussion_set[id]=null;
                    return 2
                } else {
                    return 3
                }
            }

            if (this.discussion_set[id]!=null) {
                if (obj!=null) {
                    this.discussion_set[id] = obj
                    return 1
                } else {
                    return this.discussion_set[id];
                }

            } else if (obj!=null) {
                this.discussion_set[id] = obj
                return 1

                // if obj doesn't exist
                // then return null
            } else if (obj==null) {
                return null;
            }

            throw new Error ("don't know what to do with comments:\nval: "+val.toString()+" \ndel: "+del);

        } catch (e) {
            console.error(val)
            console.error(e.stack);
            log(e.stack.toString());
            return;
        }
    },
    d: function(val, del) {
        return this.discussions(val, del)
    },

    annotations: function(val, del) {
        try {

            if (val.name!=null) {
                var id = val.name;
                var obj = val;
            } else {
                var id = val;
            }

            // check if id is null... then throw error
            if (id==null) {
                throw new Error("id is needed to do CRD for instances")
                return;
            }

            if (del) {
                if (this.annotation_set[id]!=null) {
                    this.annotation_set[id]=null;
                    return 2
                } else {
                    return 3
                }
            }

            if (this.annotation_set[id]!=null) {

                return this.annotation_set[id];

            } else if (obj!=null) {
                this.annotation_set[id] = obj
                return 1

                // if obj doesn't exist
                // then return null
            } else if (obj==null) {
                return null;
            }

            throw new Error ("don't know what to do with comments:\nval: "+val.toString()+" \ndel: "+del);

        } catch (e) {
            console.error(val)
            console.error(e.stack);
            log(e.stack.toString());
            return;
        }
    },
    a: function(val, del) {
        return this.annotations(val, del);
    },

    discussion_triggers: function(video, val, del, val2) {
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
                if (this.discussion_trigger_set[video]!=null) {
                    if (this.discussion_trigger_set[video][time]!=null) {
                        if (obj!=null) {
                            var id = obj.id;
                            if (this.discussion_trigger_set[video][time][id]!=null) {
                                this.discussion_trigger_set[video][time][id]=null;
                                return 2;
                            } else {
                                return 3;
                            }
                        } else {
                            for (var key in this.discussion_trigger_set[video][time]) {
                                this.discussion_trigger_set[video][time][key]=null
                            }
                            this.discussion_trigger_set[video][time]=null;
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


            if (this.discussion_trigger_set[video]!=null) {
                if (this.discussion_trigger_set[video][time]!=null) {
                    if (obj!=null) {
                        // if object exist... put it on the set
                        var id = obj.id
                        this.discussion_trigger_set[video][time][id]=obj;
                        return 1;
                    } else {

                        return this.discussion_trigger_set[video][time];
                    }
                } else if (obj!=null) {
                    // if object exist... put it on the set
                    var id = obj.id;
                    this.discussion_trigger_set[video][time] = {};
                    this.discussion_trigger_set[video][time][id]=obj;
                    return 1;
                } else if (obj==null) {
                    // there's no object... nothing to save
                    //return null;
                    // search first
                    var arr_set = [];

                    // return hashtable of objects for time
                    for (var k in this.discussion_trigger_set[video]) {
                        var time_trigger = parseFloat(k);
                        var t = parseFloat(time);

                        //console.log(time_trigger);

                        if ((t>=time_trigger-comment_time) && (t<time_trigger+comment_time+1)) {
                            //if ((parseFloat(time)>= parseFloat(k)) {
                            arr_set.push(this.discussion_trigger_set[video][k])
                            //console.log(arr_set)
                        }
                    }
                    //console.log(arr_set)
                    return arr_set;
                }
            } else if (obj!=null) {
                var id = obj.id;
                this.discussion_trigger_set[video]={};
                this.discussion_trigger_set[video][time] = {};
                this.discussion_trigger_set[video][time][id]=obj;
                return 1;
            } else if (obj==null) {
                // there's no object... nothing to save
                return null;
            }

            // if something happened that these things didn't catch, throw error
            throw new Error ("don't know what to do with discussion triggers:\nval: "+val.toString()+" \ndel: "+del);
        } catch (e) {
            console.error(val)
            console.error(e.stack);
            log(e.stack.toString());
            return;
        }

    },

    dt: function(video, val, del, val2){
        return this.discussion_triggers(video,val,del,val2)
    },

    saveData: function() {
        var comments = this.comment_set;
        var annotations = this.annotation_set;
        var discussions = this.discussion_set;
        var data = JSON.stringify({"id": vD.user, "comment_set": comments, "annotation_set": annotations, "discussion_set": discussions});

        saveComment(data);
        /*var data = JSON.stringify({"comment_set": comments, "annotation_set": annotations, "discussion_set": discussions});
        console.log(data)
        var res = $.post('savefile.php', {"data": data, "file": "other_data/"+this.user+".comments.json"});

        res.done(function(d) {
            console.log(d)
        })*/
    }
});
