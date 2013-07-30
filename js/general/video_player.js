"use strict";

/* video_Player key-value array */

var vP_Array = {};

/* video_Player */

var video_Player = function(parent, data, width, sceneflag) {
	this.data = data;
	this.parent = parent;
	this.width = width;
	this.player = null;
	this.playerID = this.data.video_data.id+this.data.id

	if (typeof(sceneflag)==='undefined') {
        this.sceneflag = false;
    } else {
        this.sceneflag = sceneflag;
    }

    var player_container_class;
    if (!this.sceneflag) player_container_class='player_container'
    else player_container_class='main_player_container'

    this.player_container = save_element(this.parent, "div", this.data.id+"_container", [player_container_class]);

	 var address = "http://www.youtube.com/apiplayer?controls=0"+
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
    
    this.timeline = new timeline_Player(this.player_container, this.data.id);

    if (this.sceneflag) {
        this.timeline.element.addClass('hide');
        this.timeline.scrubber.addClass('hide'); 
    }

    this.player_area = save_element(this.player_container, "div", this.data.id+"_area", ["player_area"]);
    this.player_area.css({"width":this.width, "height": height});

    this.player_element = $("object#"+this.data.id);
	this.player = document.getElementById(this.data.id);

	this.player_area.click($.proxy(this.on_click, this));

    this.player_area.bind("contextmenu", $.proxy(this.right_click, this));

    this.playerflag=false;
    this.loaded=false;

    this.interval = null;

    this.player_element.data({
        "data":this.data,
        "width": this.width,
        "scenflag": this.sceneflag
    });

    this.contextmenu = new video_contextmenu(this.player_area, this.data.id+"_context_menu", this.data.id);

    this.init();

}

video_Player.prototype = {
	init: function() {
		vp_Array[this.data.id]=this;
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
			//console.log(e);
		}
    },

	on_player_State_Change: function(event) {

		if (event=='1') {
			this.playerflag=true;
			this.timeline.timelength = this.player.getDuration();
			this.interval = setInterval($.proxy(this.checkposition, this), 250);
		} else {
			this.playerflag=false;
			clearInterval(this.interval);
		}
		if (event=='5') {
			this.loaded = true;
            this.seekload(VData.scene_objects[this.idnum].start);
			this.timeline.timelength = this.player.getDuration();
		}
	},

    on_show: function() {
        this.player_container.css('z-index', 11000);
        this.player_area.css('z-index', 11000);
        this.player_element.css('z-index', 11000);
    },

    on_back: function() {
        this.player_container.css('z-index', "-11000");
        this.player_area.css('z-index', "-11000");
        this.player_element.css('z-index', "-11000");
    },

    hide: function() {
        this.player_container.addClass('hide');
        this.player_area.addClass('hide');
        this.player_element.addClass('hide');
    },

    unhide: function() {
        this.player_container.removeClass('hide');
        this.player_area.removeClass('hide');
        this.player_element.removeClass('hide');
    },

	on_player_Error: function(event) {
		//console.log(event);
		//console.log(data.title);
	},

	on_click: function(event) {

        this.contextmenu.element.addClass('hide')

        if (event.target.id==this.player_area.attr('id')){
            
            if (this.sceneflag) {
                console.log(event.offsetX);
                console.log(event.offsetY);

/*!CHANGE PART HERE*/
                if (VData.timeline.passable) {
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
                if (this.video_start!=null) {
                    if (this.player.getCurrentTime()<this.video_start) {
                        this.player.seekTo(this.video_start+0.1, false);
                    }

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
    	this.player.stopVideo();
        this.player.seekTo(seconds, false);
        this.player.playVideo();
		this.player.pauseVideo();	
    },

    set_start_end: function(start, end) {
        if (!this.sceneflag) {
            this.video_start=start;
            this.video_end=end;
        }
    },


	checkposition: function() {

        if (!this.sceneflag){

            if ((this.video_start!=null) && (this.video_end!=null)) {
                if (this.player.getCurrentTime()<this.video_start) {
                    this.seek(this.video_start)
                } else if (this.player.getCurrentTime()>this.video_end) {
                    this.seekpause(this.video_start)
                }
            }

            var timer = this.player.getCurrentTime();
            this.timeline.updatepos(timer);
                

        } else {

            var vidstart = this.data.start
            var vidend = this.data.end

            /*CHANGE PART HERE*/
            //var index = VData.timeline.timeline_index[this.idnum];

            if (this.player.getCurrentTime()<vidstart) {
                this.seekpause(vidstart);
                this.on_back();
            }
            else if (this.player.getCurrentTime()>vidend){
                this.pause();
                this.on_back();

                var next = this.data.next
                var nextstart = vP_Array[next].data.start
            
                //var next = VData.timeline.timeline[index+1]
                //var nextstart = VData.timeline.timeline_timepts[index+1].video_start
                if (next!=null) {
                	vP_Array[next].on_show();
                	vP_Array[next].seek(nextstart);
                    //VUI.main_VideoPlayer.videoset[next].on_show();
                    //VUI.main_VideoPlayer.videoset[next].seek(nextstart);
                }


            } else {
            	/*CHANGE PART HERE*/
            	global_Timeline.update_timeline(this.data.id, this.player.getCurrentTime());
                //VData.timeline.update_timeline(index, this.player.getCurrentTime());
            }



        }
    }
	
}
}