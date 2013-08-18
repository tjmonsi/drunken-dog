//video_Player

"use strict";

/* onYouTubePlayerReady

Called when a videoPlayer object has been created.
This initializes the videoPlayer and loads the video from Youtube.
Comes with the Youtube API and is a necessary function

Requirements:
playerId - identification ID of the player. playerId should be videoID+videoPlayerID.

*/
function onYouTubePlayerReady(playerId) {

    //gets the videoID... It substracts videoPlayerID length, which is the global_id_length
    var video_id = playerId.substring(0, playerId.length-global_id_length);
    var video_Player_id = playerId.replace(video_id, "");

    var pre_corrected_Id = playerId;
    for (var i; i<playerId.length; i++) {
        if (playerId[i]=='_') pre_corrected_Id += '1'+i;
        else if (playerId[i]=='-') pre_corrected_Id += '2'+i;
    }
    var corrected_Id = pre_corrected_Id.replace(/\W/g, '');

    try {
        vData.instances[video_Player_id].player.addEventListener("onError", "onPlayerError"+corrected_Id);
        vData.instances[video_Player_id].player.addEventListener("onStateChange", "onStateChange"+corrected_Id);
    } catch (e) {
        console.error(e.stack)
    }

    window["onPlayerError" + corrected_Id] = function(state) {
        vData.instances[video_Player_id].on_player_Error(state);
    };

    window["onStateChange" + corrected_Id] = function(state) {
        vData.instances[video_Player_id].on_player_State_Change(state);
    };

    vData.instances[video_Player_id].player.loadVideoById(video_id, vData.instances[video_Player_id].data.begin);
    vData.instances[video_Player_id].player.setPlaybackQuality("default");
    vData.instances[video_Player_id].seekstart();

}


/* video_Player */

var video_Player = function(parent, data, width, sceneflag) {

    this.classType = "video_Player"
    this.parent = parent;
    this.data = data;

    this.width = width;
    this.sceneflag = sceneflag;
    this.mouse_events_configured=false

    this.start();

}

video_Player.prototype = {
    start: function() {
        if (this.parent!='test') this.init();
        else this.test();
    },

	init: function() {

        this.time_gate = false;
        this.currentTime = 0;
        this.new_comment_form_flag = false;
        this.reply_comment_form_flag = false;

        this.id = this.data.id
        this.player = null;
        this.triggers = {};
        this.discussion_triggers = {};
        this.discussion_trigpoint = {};
        this.discussion_threads = {};

        this.normal_mode_movement = true;

        var height = this.width*(9/16)

        var player_container_class;
        if (!this.sceneflag) player_container_class='player_container'
        else player_container_class='main_player_container'

        this.playerID = this.data.object_data.id+this.id
        this.player_container = save_element(this.parent, "div", this.id+"_container", [player_container_class]);

        var address = "//www.youtube.com/apiplayer?controls=0"+
            "&enablejsapi=1"+
            "&rel=0"+
            "&showinfo=0"+
            "&autohide=1"+
            "&playerapiid="+this.playerID+
            "&version=3"+
            "&autoplay=0";

        var element = create_element("object", this.playerID, ["video_player"], {"type":"application/x-shockwave-flash",
            "data": address,
            "width":this.width,
            "height": height})

        var param = create_element("param", null, null, {"name":"allowScriptAccess", "value":"always"})
        var param2 = create_element("param", null, null, {"name":"wmode", "value":"opaque"})

        element.appendChild(param);
        element.appendChild(param2);

        this.player_container.append(element);

        this.timeline = new timeline_Player(this.player_container, this.id+"_timeline", this.data.end-this.data.begin, this.data.begin);

        if (this.sceneflag) {
            this.timeline.element.addClass('hide');
            this.timeline.scrubber.addClass('hide');
        }

        this.canvas = save_element(this.player_container, "canvas", this.id+"_canvas", ["canvas_area"], {"width": this.width, "height": height});
        this.canvas.css({"z-index": -11000});
        this.canvas.data({"visible_flag": false});

        this.discussion_area = save_element(this.player_container, "div", this.id+"_discussion_area", ["discussion_area"]);
        this.discussion_area.css({"height": height});

        this.element = save_element(this.player_container, "div", this.id+"_area", ["player_area"]);
        this.element.css({"width":this.width, "height": height});

        this.player_element = $("object#"+this.playerID);
        this.player = document.getElementById(this.playerID);






        //this.element.click($.proxy(this.on_click, this));

        this.element.mousedown($.proxy(this.on_mouse_down, this));
        this.element.mousemove($.proxy(this.on_mouse_move, this));
        this.element.mouseup($.proxy(this.on_mouse_up, this));



        this.playerflag=false;
        this.loaded=false;

        this.interval = null;

        this.player_element.data({
            "data":this.data,
            "width": this.width,
            "sceneflag": this.sceneflag
        });

        this.interval_sets = {};

        //!!! TASK MAKE CONTEXT MENU AVAILABLE AGAIN
        this.context_menu_data = {
            "id": this.id+"_context_menu",
            "video_id": this.id,
            "object_data": [
                {
                    "id": this.id+"_add_comment",
                    "value": "Add Comment Thread",
                    callback: ($.proxy(this.context_menu_add_comment_thread, this))
                },
                {
                    "id": this.id+"_debug",
                    "value": "Debug",
                    callback: ($.proxy(this.context_menu_debug, this))
                },
                {
                    "id": this.id+"_save_data",
                    "value": "Save Data",
                    callback: ($.proxy(this.save_data, this))
                }
            ]
        }

        this.context_menu = new context_menu(this.element, this.context_menu_data)
        vData.add_instances(this.context_menu);

        this.element.bind("contextmenu", $.proxy(this.right_click, this));
        //this.contextmenu = new video_contextmenu(this.element, this.data.id+"_context_menu", this.data.id);

        if (this.sceneflag) this.on_back();

        
        if (debug) creation_success(this.classType, this.id)
        if (debug2) console.log(this);
	},

    test: function(){
        var test_code = 0;

        if (test_run) {
            
        }

        return test_code;
    },

    destroy: function(){

        for (var key in this) {
            if (this[key]==null) continue;
            if (this[key].classType!=null) {
                this[key].destroy();
            }
        }

        this.player_container.empty();

        vData.delete_instances(this.id);
    },

	right_click: function(event) {
        //this.contextmenu.setxy(event.offsetX, event.offsetY);
        //this.contextmenu.element.removeClass('hide')
        vData.instances[this.context_menu_data.id].setxy(event.offsetX, event.offsetY)
        vData.instances[this.context_menu_data.id].element.removeClass('hide')

        this.pause();

        this.configure_mouse_events();



        return false
    },

	on_playing: function() {
		try {
			if (this.player.getPlayerState()==1) {
				this.checkposition();
			}
		} catch(e){
			console.error(e.stack)
		}
    },

	on_player_State_Change: function(event) {

		if (event=='1') {
			this.playerflag=true;
			this.timeline.timelength = this.data.end-this.data.begin;
			this.interval_sets['checkposition'] = setInterval($.proxy(this.checkposition, this), 250);
            this.interval_sets['check_trigger'] = setInterval($.proxy(this.fire_trigger, this), 250);
		} else {
			this.playerflag=false;
            for (var key in this.interval_sets) {
                clearInterval(this.interval_sets[key]);
            }

		}
		if (event=='5') {
			this.loaded = true;
			this.timeline.timelength = this.data.end-this.data.begin;
		}
	},

    fire_trigger: function() {

        var time = this.player.getCurrentTime()



        //console.log(this.triggers)
        for (var key in this.triggers) {
            var time_trigger = parseFloat(key);

            if (time>=time_trigger) {

                for (var i=0; i<this.triggers[key].length; i++) {

                    //console.log(this.triggers[key][i].triggered);
                    if (this.triggers[key][i].triggered==false) {

                        if (this.triggers[key][i].type_trig=="begin") {
                            if (vData.instances[this.triggers[key][i].id].data.show){
                                vData.instances[this.triggers[key][i].id].element.removeClass('hide');
                                this.triggers[key][i].triggered = true
                            }
                            if (vData.instances[this.triggers[key][i].id].data.pause) {
                                this.pause();
                                if (vData.instances[this.triggers[key][i].id].data.object_data.time_gate) {
                                    this.time_gate = true;
                                }
                                this.triggers[key][i].triggered = true
                            }
                        } else if (this.triggers[key][i].type_trig=="end") {
                            vData.instances[this.triggers[key][i].id].element.addClass('hide');
                            this.triggers[key][i].triggered = true
                        }

                    }
                    //console.log(this.triggers[key][i].triggered);

                }

            } else {
                for (var i=0; i<this.triggers[key].length; i++) {
                    if (this.triggers[key][i].type_trig=="begin") {
                        vData.instances[this.triggers[key][i].id].element.addClass('hide');
                        vData.instances[this.triggers[key][i].id].reset();
                        this.triggers[key][i].triggered = false
                    }
                }
            }
        }

        for (var key in this.discussion_triggers) {
            var time_trigger = parseFloat(key);

            if ((time>=time_trigger-comment_time) && (time<time_trigger+comment_time+1)) {

                for (var i=0; i<this.discussion_triggers[key].length; i++) {
                    var obj = this.discussion_triggers[key][i];
                    console.log(this.discussion_trigpoint[obj.id])
                    this.discussion_trigpoint[obj.id].element.removeClass('hide');
                    this.discussion_threads[obj.id].element.removeClass('hide');

                }

            } else {
                for (var i=0; i<this.discussion_triggers[key].length; i++) {
                    var obj = this.discussion_triggers[key][i];
                    this.discussion_trigpoint[obj.id].element.addClass('hide');
                    this.discussion_threads[obj.id].element.addClass('hide');
                }
            }



        }

    },

    trigger_object_hide: function(arr, key){
        clearInterval(this.interval_sets[key+"_hide"]);

        for (var i=0; i<arr.length; i++) {
            var obj = arr[i];



            vData.instances[obj.id].element.addClass('hide')



            obj.triggered = false;
            arr[i] = obj
        }

        this.triggers[key] = arr;

    },

    add_triggers: function(obj) {

        var time = obj.time

        if (this.check_triggers(time)==null) {

            this.triggers[time.toString()]=[obj];

        } else {

            this.triggers[time.toString()].push(obj);

        }



    },

    discussion_trigger: function(val, del) {
        try {

            if (val.id!=null) {
                var id = val.time.toString();
                var obj = val

            } else {
                var id = val;
            }

            if (del) {
                //this.discussion_triggers[id.toString()]=null;
                return
            }

            if (this.discussion_triggers[id]!=null) {
                if (obj!=null) {

                    this.discussion_trigpoint[obj.id] = new discussion_trigger(this.element, obj);
                    this.discussion_threads[obj.id] = new discussion_thread(this.discussion_area, obj);
                    vData.add_instances(this.discussion_trigpoint[obj.id]);
                    this.discussion_triggers[id].push(obj)
                    return
                } else {
                    return this.discussion_triggers[id];
                }
            } else if (obj!=null) {

                this.discussion_triggers[id] = [obj];

                this.discussion_trigpoint[obj.id] = new discussion_trigger(this.element, obj);
                this.discussion_threads[obj.id] = new discussion_thread(this.discussion_area, obj);
                vData.add_instances(this.discussion_trigpoint[obj.id]);

                return
            } else {
                return
            }

            throw new Error ("don't know what to do with discussion:\nval: "+val.toString()+"\ndel: "+del);

        } catch (e) {
            console.error(val)
            console.error(e.stack);
        }
    },



    check_triggers: function(time) {
        if (this.triggers[time.toString()]!=null) {
            return this.triggers[time.toString()]
        } else {
            return null
        }
    },

    delete_triggers: function(obj) {

        var time = obj.time
        time = time.toString();
        var arr = this.triggers[time];
        var index = arr.indexOf(obj);

        arr.splice(index, 1);

        if (arr.length==0) {
            this.triggers[time]=null;
        } else {
            this.triggers[time]=arr;
        }

    },


    trigger_objects: function(arr, key) {
        //clearInterval(this.interval_sets[key]);
        //console.log(arr);
        for (var i=0; i<arr.length; i++) {

            var obj = arr[i];

            //console.log(obj)
            //console.log(obj.triggered)

            if (obj.triggered==false) {
                console.log(vData.instances[obj.id].data)
                if (vData.instances[obj.id].data.show){

                    vData.instances[obj.id].element.removeClass('hide');
                    //obj.triggered = true
                } else
                if (vData.instances[obj.id].data.hide) {

                    vData.instances[obj.id].element.addClass('hide');
                    //obj.triggered = true
                }

                if (vData.instances[obj.id].data.pause) {
                    this.pause();
                    if (vData.instances[obj.id].data.object_data.time_gate) {
                        this.time_gate = true;
                    }
                    //obj.triggered = true

                }

                obj.triggered = true
                //console.log(obj.triggered);
                arr[i] = obj
            }


        }

        this.triggers[key] = arr;
        //console.log(this.triggers[key]);

    },

    trigger_object_ends: function(arr, key) {
        clearInterval(this.interval_sets[key+"_end"]);

        for (var i=0; i<arr.length; i++) {
            var obj = arr[i];

            if (!obj.triggered) {

                if (obj.hide) {
                    vData.instances[obj.id].element.addClass('hide');
                }

            }

            obj.triggered = true;
            arr[i] = obj
        }

        this.triggers[key] = arr;
    },

    on_show: function() {
        this.player_container.css('z-index', 11000);
        this.element.css('z-index', 11000);
        this.player_element.css('z-index', 11000);
        this.canvas.css('z-index', 11000);
    },

    on_back: function() {
        if (this.player.pauseVideo!=null) {
            this.pause();
        }
        this.player_container.css('z-index', "-11000");
        this.element.css('z-index', "-11000");
        this.player_element.css('z-index', "-11000");
        this.canvas.css('z-index', -11000);

    },

    on_draw: function(val, val2) {
        console.log(vData.instances[val]);
        this.comment_window = val;
        this.new_comment_id = val2;

        this.canvas.css('z-index', 11000);
        this.canvas.data({"visible_flag": true});

        this.element.unbind('mousedown', $.proxy(this.on_mouse_down, this))
        this.element.unbind('mousemove', $.proxy(this.on_mouse_move, this))
        this.element.unbind('mouseup', $.proxy(this.on_mouse_up, this))
        this.element.unbind('click', $.proxy(this.on_click, this))

        this.element.mousedown($.proxy(this.on_mouse_down_draw, this))
        this.element.mousemove($.proxy(this.on_mouse_move_draw, this))
        this.element.mouseup($.proxy(this.on_mouse_up_draw, this))
    },

    on_stop_draw: function() {

        //this.new_comment = false;
        //this.reply_to_comment=false

        this.canvas.data({"visible_flag": false});

        this.element.unbind("mousedown", $.proxy(this.on_mouse_down_draw, this));
        this.element.unbind("mousemove", $.proxy(this.on_mouse_move_draw, this))
        this.element.unbind("mouseup", $.proxy(this.on_mouse_up_draw, this))

        this.element.click($.proxy(this.on_click, this))

        //this.element.mousedown($.proxy(this.on_mouse_down, this));
        //this.element.mousemove($.proxy(this.on_mouse_move, this));
        //this.element.mouseup($.proxy(this.on_mouse_up, this));

    },

    on_mouse_down_draw: function(event) {
        this.drawing_mouse = true;

        if (event.target.id==this.element.attr('id')){
            var drawing_id = makeID(global_id_length+global_id_length);
            while (vData.annotations(drawing_id)!=null) {
                drawing_id = makeID(global_id_length+global_id_length);
            }

            this.drawing_object = {
                type: "line",
                strokeStyle: "#585",
                name: drawing_id,
                strokeWidth: 6,
                rounded: true,
                visible: true,
                "x1": event.offsetX, "y1": event.offsetY,
                "data": {
                    "video_id": this.data.id,
                    "comment": this.new_comment_id
                }
            }

            this.drawing_pts = [{"x": event.offsetX, "y": event.offsetY}];

            for (var i=1; i<this.drawing_pts.length ; i++) {
                var val = i+1;
                this.drawing_object['x'+(val)]=this.drawing_pts[i].x
                this.drawing_object['y'+(val)]=this.drawing_pts[i].y
            }



            console.log(this.drawing_object)

            this.canvas.addLayer(this.drawing_object).drawLayers();
        }

    },

    on_mouse_move_draw: function(event) {
        if (this.drawing_mouse) {

            if (event.target.id==this.element.attr('id')){
                this.drawing_pts.push({"x": event.offsetX, "y":event.offsetY});
                for (var i=1; i<this.drawing_pts.length ; i++) {
                    var val = i+1;
                    this.drawing_object['x'+val]=this.drawing_pts[i].x
                    this.drawing_object['y'+val]=this.drawing_pts[i].y
                }

                this.canvas.setLayer(this.drawing_object.name ,this.drawing_object).drawLayers()
            }


        }
    },

    on_mouse_up_draw: function(event){

        this.drawing_mouse = false;

        if (event.target.id==this.element.attr('id')){
            vData.instances[this.comment_window].comment_objects.push(this.drawing_object)
           // console.log(this.drawing_object)
            vData.annotations(this.drawing_object);
        }
       // console.log(vData)
    },

    draw_annotations: function(array) {
        this.clear_annotations();
        for (var i in array) {
            console.log(array[i])
            this.canvas.addLayer(array[i]).drawLayers();
        }
    },

    clear_annotations: function() {
        this.canvas.removeLayers();
        this.canvas.clearCanvas();
    },

    hide: function() {
        this.player_container.addClass('hide');
        this.element.addClass('hide');
        this.player_element.addClass('hide');
    },

    unhide: function() {
        this.player_container.removeClass('hide');
        this.element.removeClass('hide');
        this.player_element.removeClass('hide');
    },

	on_player_Error: function(event) {
		//console.log(event);
		//console.log(data.title);
	},

    on_mouse_down: function(event) {
        vData.instances[this.context_menu_data.id].element.addClass('hide');
        console.log(event)

        if (event.button==2) return;
        this.mouse_down_flag = true;

        if (event.target.id==this.element.attr('id')){

            if (this.sceneflag) {
                console.log(event.offsetX+", "+event.offsetY);

                if (!this.time_gate) {
                    if (this.playerflag) {

                        this.pause();
                        this.from_play = true;
                        this.from_pause = false
                    } else {

                        //console.log("should play")
                        this.from_pause= true;
                        this.from_play = false;
                        //this.play();
                    }
                }
            } else {
                if (this.playerflag) {
                    this.pause();
                    this.from_play = true;
                    this.from_pause = false
                } else {
                    this.from_pause= true;
                    this.from_play = false;
                    //this.play();
                }
            }


            this.mouse_down_time = event.timeStamp;
            this.b_box_data = {
                x: event.offsetX,
                y: event.offsetY,
                upleft_x: event.offsetX,
                upleft_y: event.offsetY,
                lowright_x: event.offsetX,
                lowright_y: event.offsetY
            }

            // if video == pause, wait... for mouse up... then play
            // if video == play, pause


        } else {
            //event.stopImmediatePropagation()
        }
    },

    on_mouse_move: function(event) {
        var new_x = event.offsetX;
        var new_y = event.offsetY;

        if (this.mouse_down_flag) {

            if (event.target.id==this.element.attr('id')){

            } else {
                new_x = this.b_box_data.upleft_x+new_x;
                new_y = this.b_box_data.upleft_y+new_y;
            }

            var b_box = this.get_bounding_box(new_x, new_y);

            if (b_box == null) return;

            b_box.id = this.id+"_temp_bounding_box_id";
            if (this.bounding_box_ui_temp==null) this.bounding_box_ui_temp = save_element(this.element, "div", b_box.id, ['discussion_bounding_box']);
            this.bounding_box_ui_temp.css({"width": b_box.width,
                "height": b_box.height,
                "top": b_box.y,
                "left": b_box.x});

            //console.log(this.bounding_box_ui_temp)



        } else if (this.normal_mode_movement) {

            if (event.target.id==this.element.attr('id')){
                //console.log("movement")
                var time = this.player.getCurrentTime();

                for (var key in this.discussion_triggers) {
                    var time_trigger = parseFloat(key);

                    if ((time>=time_trigger-comment_time) && (time<time_trigger+comment_time+1)) {

                        for (var i=0; i<this.discussion_triggers[key].length; i++) {
                            var obj = this.discussion_triggers[key][i];
                            var area = 200;

                            if (withinarea(new_x, new_y, obj.x, obj.y, area)) {

                                var xval = Math.abs((new_x-obj.x)/area);
                                var yval = Math.abs((new_y-obj.y)/area);
                                var tval = Math.abs((time-time_trigger)/comment_time)

                                var op = 1 - ((xval+yval)/2)
                                //op = op-tval;

                                //console.log(op)
                                //console.log(this.discussion_trigpoint[obj.id].element);
                                this.discussion_trigpoint[obj.id].element.css({"opacity": op});

                            } else {
                                this.discussion_trigpoint[obj.id].element.css({"opacity": 0});
                            }
                            //console.log(this.discussion_trigpoint[obj.id])


                            //this.discussion_trigpoint[obj.id].element.;


                        }

                    }

                }

            }

        }

        // record delta pxx and delta pxy
    },

    get_bounding_box: function(x,y) {

        if (this.b_box_data!=null) {

            if (x < this.b_box_data.x) {
                this.b_box_data.upleft_x = x;
                this.b_box_data.lowright_x = this.b_box_data.x;
            } else {
                //console.log(x)
                this.b_box_data.lowright_x = x;
                this.b_box_data.upleft_x = this.b_box_data.x;
            }

            if (y < this.b_box_data.y) {
                this.b_box_data.upleft_y = y;
                this.b_box_data.lowright_y = this.b_box_data.y;
            } else {
                this.b_box_data.lowright_y = y;
                this.b_box_data.upleft_y = this.b_box_data.y;
            }

            var width = this.b_box_data.lowright_x-this.b_box_data.upleft_x;
            var height = this.b_box_data.lowright_y-this.b_box_data.upleft_y;

            //console.log(this.b_box_data)
            return {
                "width": width,
                "height": height,
                "x": this.b_box_data.upleft_x,
                "y": this.b_box_data.upleft_y
            }

        } else {
            return null
        }

    },

    on_mouse_up: function(event){

        this.mouse_down_flag = false;
        var new_x = event.offsetX;
        var new_y = event.offsetY;


        if (event.target.id==this.element.attr('id')){
            // add here to close all discussion triggers
        } else {

            if (this.b_box_data==null) return;
            new_x = this.b_box_data.upleft_x+new_x;
            new_y = this.b_box_data.upleft_y+new_y;
        }

        this.mouse_up_time = event.timeStamp;

        var b_box = this.get_bounding_box(new_x, new_y);
        console.log((this.mouse_up_time-this.mouse_down_time))
        if (b_box!=null) {

            b_box.id = this.id+"_temp_bounding_box_id";
            if (this.bounding_box_ui_temp==null) this.bounding_box_ui_temp = save_element(this.element, "div", b_box.id, ['discussion_bounding_box']);
            this.bounding_box_ui_temp.css({"width": b_box.width,
                "height": b_box.height,
                "top": b_box.y,
                "left": b_box.x});

            if ((this.mouse_up_time-this.mouse_down_time)<=200) {

                if (this.from_pause) {
                    console.log(this.from_pause);
                    this.play();
                }
            } else {
                if ((b_box.width>=min_bounding_box_val) && (b_box.height>=min_bounding_box_val)) {
                    //create bounding box with new comment

                    vData.add_instances(new new_comment_thread_form(this.element, {"id": this.id+"_add_new_comment_thread", "video_id": this.id, "x": this.context_menu.x, "y": this.context_menu.y, "time": this.player.getCurrentTime(), "bounding_box": b_box}));
                    //console.log(b_box);
                } else {
                    //console.log(b_box);
                    console.log("should play")
                    if (this.from_play) {
                        this.play();
                    }

                }

            }


            this.bounding_box_ui_temp.remove();
            this.bounding_box_ui_temp = null;
            this.b_box_data = null;

        } else {
            console.log("bbox null")
        }

    },

	on_click: function(event) {
        //console.log(event.target.id)
        //this.contextmenu.element.addClass('hide')

        vData.instances[this.context_menu_data.id].element.addClass('hide');



        if (event.target.id==this.element.attr('id')){

            if (vData.check_instances(this.id+"_add_new_comment_thread")) {
                vData.instances[this.id+"_add_new_comment_thread"].destroy();
            }
            
            if (this.sceneflag) {
                console.log(event.offsetX+", "+event.offsetY);


                /*if (!this.time_gate) {
            		if (this.playerflag) {
                        this.from_play = true;
                        this.from_pause = false
            			this.pause();
            		} else {
                        this.from_play = false;
                        this.from_pause = true
            			this.play();
            		}
                } */
            } else {
                /*if (this.playerflag) {
                    this.from_play = true;
                    this.from_pause = false
                    this.pause();
                } else {
                    this.from_play = false;
                    this.from_pause = true
                    this.play();
                } */
            }

            this.return_mouse_events();
        }


	},

    return_mouse_events: function() {

        if (this.mouse_events_configured) {
            this.element.mousedown($.proxy(this.on_mouse_down, this));
            this.element.mousemove($.proxy(this.on_mouse_move, this));
            this.element.mouseup($.proxy(this.on_mouse_up, this));

            this.element.unbind('click', $.proxy(this.on_click, this));

            console.log("return mouse events")

            this.mouse_events_configured=false
        }
    },

    configure_mouse_events: function() {

        console.log("configure mouse events")

        if (!this.mouse_events_configured) {
            this.element.click($.proxy(this.on_click, this));
            this.element.unbind('mousedown', $.proxy(this.on_mouse_down, this))
            this.element.unbind('mousemove', $.proxy(this.on_mouse_move, this))
            this.element.unbind('mouseup', $.proxy(this.on_mouse_up, this))
            this.mouse_events_configured=true
        }
    },

    play: function() {
		if (this.loaded){
            if (!this.sceneflag) {

                if (this.player.getCurrentTime()<this.data.begin) {
                    this.player.seekTo(this.data.begin+0.1, false);
                }


            }

			this.player.playVideo();
		} else {
			console.log("not loaded");	
		}     
    },

    pause: function() {
        this.player.pauseVideo();

        
    },

    seek: function(seconds) {
        this.player.stopVideo();
        this.player.seekTo(seconds, false);
        this.play();
    },
 
    seekpause: function(seconds) {
    	this.seek(seconds);
		this.pause();	
    },

    seekload: function(seconds) {
        try {
    	this.player.stopVideo();
        this.player.seekTo(seconds, false);
        this.player.playVideo();
		this.player.pauseVideo();
        } catch (e) {
            console.error(e.stack)
        }
    },

    seekstart: function() {
        this.player.stopVideo();
        this.player.seekTo(this.data.begin, false);
        this.player.playVideo();
        this.player.pauseVideo();
    },

	checkposition: function() {

        if (this.parent.hasClass("hide")) {
            //this.pause();
            for (var key in this.interval_sets) {
                clearInterval(this.interval_sets[key]);
                console.log(key)
            }

            return;
        }

        if ((this.player.getCurrentTime()-this.data.begin)>=this.currentTime) {



            this.currentTime = this.player.getCurrentTime()-this.data.begin;
        } else {
            console.log((this.player.getCurrentTime()-this.data.begin))

            var arr1 = null;
            var obj1 = null;
            for (var key in this.triggers) {

                arr1 = this.triggers[key];

                for (var i in arr1) {

                    obj1 = arr1[i];
                    //vData.instances[obj1.id].element.addClass('hide');
                    this.time_gate=false;
                    if (obj1.retrig) {
                        obj1.triggered = false;
                    }

                    arr1[i]=obj1
                }

                this.triggers[key]=arr1;



            }

            this.currentTime = this.player.getCurrentTime()-this.data.begin;
        }

        if (!this.sceneflag){


            if (this.player.getCurrentTime()<this.data.begin) {
                this.seek(this.data.begin)
            } else if (this.player.getCurrentTime()>this.data.end) {
                this.seekpause(this.data.begin)
            }


            var timer = this.player.getCurrentTime();
            this.timeline.updatepos(timer);
                

        } else {

            var vidstart = this.data.begin
            var vidend = this.data.end

            /*CHANGE PART HERE*/
            //var index = VData.timeline.timeline_index[this.idnum];

            if (this.player.getCurrentTime()<vidstart-0.1) {

                if (this.data.prev==null) {
                    this.seek(vidstart);
                } else {
                    this.seekpause(vidstart);
                    this.on_back();

                }


            }
            else if (this.player.getCurrentTime()>vidend){


                this.pause();
                this.on_back();

                var next = this.data.next


                if (next!=null) {
                    var nextstart = vData.instances[next].data.begin
                	vData.instances[next].on_show();
                	vData.instances[next].seek(nextstart);
                }

            } else {

                var timer = this.player.getCurrentTime();
                vData.instances['main_Timeline'].updatepos(timer, this.id);
            	/*CHANGE PART HERE*/
            	//vData.global_Timeline.update_timeline(this.data.id, this.player.getCurrentTime());
                //VData.timeline.update_timeline(index, this.player.getCurrentTime());
            }



        }
    },

    context_menu_add_comment_thread: function(event) {

        console.log(event);
        vData.add_instances(new new_comment_thread_form(this.element, {"id": this.id+"_add_new_comment_thread", "video_id": this.id, "x": this.context_menu.x, "y": this.context_menu.y, "time": this.player.getCurrentTime()}));

    },

    context_menu_debug: function(event) {
        console.log(vData);
        console.log(vUI);
    },

    save_data: function(event) {
        var d1 = vData;
        //var d2 = vUI;
        var d3 = vData.comment_set
        var d4 = vData.discussion_set

        var data1 = JSON.stringify({"vData": d1.data});
        var data2 = JSON.stringify({"comment_set": d3, "discussion_set": d4});

        var x = $.post('data2.php', {"data": data1, "file": "data1.json"});
        var y = $.post('data2.php', {"data":data2, "file": "data2.json"});

        x.done(function(data) {
            console.log(data);
        })
        y.done(function(data) {
            console.log(data);
        })
    },

    success_download: function(data, var2, var3) {
        console.log(data);
        console.log(var2);
        console.log(var3);
    }
	
}
