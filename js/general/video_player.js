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


    this.start();

}

video_Player.prototype = {
    start: function() {
        if (this.parent!='test') this.init();
        else this.test();
    },

	init: function() {

        this.id = this.data.id
        this.player = null;
        this.triggers = {};

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

        this.timeline = new timeline_Player(this.player_container, this.id+"_timeline");

        if (this.sceneflag) {
            this.timeline.element.addClass('hide');
            this.timeline.scrubber.addClass('hide');
        }

        this.element = save_element(this.player_container, "div", this.id+"_area", ["player_area"]);
        this.element.css({"width":this.width, "height": height});

        this.player_element = $("object#"+this.playerID);
        this.player = document.getElementById(this.playerID);



        this.element.click($.proxy(this.on_click, this));

        //this.element.bind("contextmenu", $.proxy(this.right_click, this));

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
        //this.contextmenu = new video_contextmenu(this.element, this.data.id+"_context_menu", this.data.id);





        this.on_back();

        
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
            if (this[key].classType!=null) {
                this[key].destroy();
            }
        }

        this.player_container.empty();

        vData.delete_instance(this.id);
    },

	right_click: function(event) {
        this.contextmenu.setxy(event.offsetX, event.offsetY);
        this.contextmenu.element.removeClass('hide')

        this.pause();
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
			this.timeline.timelength = this.player.getDuration();
			this.interval_sets['checkposition'] = setInterval($.proxy(this.checkposition, this), 250);
            this.interval_sets['check_trigger'] = setInterval($.proxy(this.fire_trigger, this), 250);
		} else {
			this.playerflag=false;
			clearInterval(this.interval_sets['checkposition']);
            clearInterval(this.interval_sets['check_trigger']);
		}
		if (event=='5') {
			this.loaded = true;
			this.timeline.timelength = this.player.getDuration();
		}
	},

    fire_trigger: function() {
        var time = this.player.getCurrentTime()

        /*var t_1 = time-0.1;
        var t_2 = time+0.1;

        console.log(time)

        if (vData.triggers[time]!=null) {
            var arr = vData.triggers[time];
            this.interval_sets['t_0'] = setInterval($.proxy(this.trigger_objects, this, arr, 't_0'), 10)
        } else if (vData.triggers[t_1]!=null) {
            var arr = vData.triggers[t_1];
            this.interval_sets['t_1'] = setInterval($.proxy(this.trigger_objects, this, arr, 't_1'), 10)
        } else if (vData.triggers[t_2]!=null) {
            var arr = vData.triggers[t_2];
            this.interval_sets['t_2'] = setInterval($.proxy(this.trigger_objects, this, arr, 't_2'), 10)
        }*/

        //console.log(this.triggers)
        for (var key in this.triggers) {
            var time_trigger = parseFloat(key);


            if ((time<=time_trigger) && (time+0.25>time_trigger)) {
            //if ((time<=time_trigger) && (time+0.25>=time_trigger)) {
                var obj = this.triggers[key];
                this.interval_sets[key] = setInterval($.proxy(this.trigger_objects, this, obj, key, key), 50);
            }


        }

    },

    add_triggers: function(obj) {
        console.log(obj)
        var time = obj.time
        console.log(time)

        if (this.check_triggers(time)==null) {

            this.triggers[time.toString()]=[obj];

        } else {

            this.triggers[time.toString()].push(obj);

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


    trigger_objects: function(arr, key, interval) {
        clearInterval(this.interval_sets[interval]);

        for (var i=0; i<arr.length; i++) {

            var obj = arr[i];

            if (!obj.triggered) {

                if (obj.show){

                    vData.instances[obj.id].element.removeClass('hide');
                } else
                if (obj.hide) {

                    vData.instances[obj.id].element.addClass('hide');
                }

                if (obj.pause)
                    this.pause();

                obj.triggered = true
                arr[i] = obj
            }


        }

        this.triggers[key] = arr;

    },

    on_show: function() {
        this.player_container.css('z-index', 11000);
        this.element.css('z-index', 11000);
        this.player_element.css('z-index', 11000);
    },

    on_back: function() {
        this.player_container.css('z-index', "-11000");
        this.element.css('z-index', "-11000");
        this.player_element.css('z-index', "-11000");

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

	on_click: function(event) {

        //this.contextmenu.element.addClass('hide')

        if (event.target.id==this.element.attr('id')){
            
            if (this.sceneflag) {
                console.log(event.offsetX+", "+event.offsetY);

/*!CHANGE PART HERE*/
                if (/*VData.timeline.passable*/ true) {
            		if (this.playerflag) {
            			this.pause();
            		} else {
            			this.play();
            		}
                }
            } else {
                if (this.playerflag) {
                    this.pause();
                } else {
                    this.play();
                } 
            }
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
                this.seekpause(vidstart);
                this.on_back();
            }
            else if (this.player.getCurrentTime()>vidend){


                this.pause();
                this.on_back();

                var next = this.data.next
                var nextstart = vData.instances[next].data.begin

                if (next!=null) {
                	vData.instances[next].on_show();
                	vData.instances[next].seek(nextstart);
                }

            } else {
            	/*CHANGE PART HERE*/
            	//vData.global_Timeline.update_timeline(this.data.id, this.player.getCurrentTime());
                //VData.timeline.update_timeline(index, this.player.getCurrentTime());
            }



        }
    }
	
}
