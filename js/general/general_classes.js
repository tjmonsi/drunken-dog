//general_classes

"use strict";

/*---------------------- button_UI -------------------------*/

var button_Class = function(parent, label, id, callback, color, mousein, mouseout) {
	this.classType = "button_Class"
	this.parent = parent;
	this.label = label;

	this.mousein_flag = true;
	this.mouseout_flag = true;

	if (typeof(id)==='undefined') id="";
	if (typeof(color)==='undefined') color="black";
	if (typeof(mousein)==='undefined') this.mousein_flag=false;
	if (typeof(mouseout)==='undefined') this.mouseout_flag=false;

	this.id = id;
	
	this.cb = callback;
	this.mousein = mousein;
	this.mouseout = mouseout;

	this.color = color;

	this.start();

}

button_Class.prototype = {

    start: function() {
        if (this.parent!='test') this.init();
        else this.test();
    },

	init: function() {
		this.element = save_element(this.parent, "a", this.id, ["button", this.color], {"href":"#"});
		this.element.append(this.label);
		this.element.click($.proxy(this.on_click, this));

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
            if (this[key]==null) continue;
            if (this[key].classType!=null) {
                this[key].destroy();
            }
        }

        //add more here
        this.cb=null;
        this.element.empty();

        // this should be last
        vData.delete_instances(this.id);
    },

	on_click: function(event){
		try {
			//console.log(this.cb)
			this.cb();
		} catch (err) {
			console.log(err.stack)
		}
    },

    on_mouse_in: function(event){
    	if (this.mousein_flag) {};//this.mousein();
    },

    on_mouse_out: function(event){
    	if (this.mouseout_flag) {};//this.mouseout();
    },

    update_label: function(new_label){
    	this.label = new_label;
    	this.element.empty();
    	this.element.append(this.label);
    }
}

/*-------------------------- button Icon Class ------------------------*/

var button_Icon_Class = function(parent, id, icon, label, callback, color, mousein, mouseout) {
	this.classType = "button_Icon_Class"
	this.parent = parent
	this.icon = icon;
	this.id = id;
	this.cb = callback;
	this.mousin = mousein;
	this.mouseout = mouseout;
	this.label = label;

	this.color = color;

	this.start();

}

button_Icon_Class.prototype = {

    start: function() {
        if (this.parent!='test') this.init();
        else this.test();
    },

	init: function() {
		this.element = save_element(this.parent, "a", this.id, ["ui-icon", this.icon], {'href':"#", "title":this.label});
		this.element.append(this.label);
		this.element.click($.proxy(this.on_click, this));

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
            if (this[key]==null) continue;
            if (this[key].classType!=null) {
                this[key].destroy();
            }
        }

        //add more here
        this.cb=null;
        this.element.empty();

        // this should be last
        vData.delete_instances(this.id);
    },

	on_click: function(event){
		try {
			//console.log(this.cb)
			this.cb();
		} catch (err) {
			console.log(err.stack)
		}
    },

    on_mouse_in: function(event){
    	if (this.mousein) {};//this.mousein();
    },

    on_mouse_out: function(event){
    	if (this.mouseout) {};//this.mouseout();
    },

    update_label: function(new_label){
    	this.label = new_label;
    	this.element.attr('title',this.label)
    	this.element.empty();
    	this.element.append(this.label);
    }
}

/*-------------------------- window classes ------------------------*/

var window_Class = function(parent, data, draggable, pad){
	this.classType = "window_Class"
	this.parent = parent;
	this.data = data;
	//this.content = content;
	this.draggable = draggable;

	if (typeof(pad)==='undefined') this.pad=10;
	else this.pad=pad;

	this.start();

}

window_Class.prototype = {

    start: function() {
        if (this.parent!='test') this.init();
        else this.test();
    },

	init: function() {
		this.id = this.data.id;
		this.window = save_element(this.parent.parent, "div", this.id, ['window_Class']);

        this.window.css({"left": this.data.x, "top": this.data.y})

        this.window.addClass(this.data.class);


		this.window_handler = save_element(this.window, "div", this.id+"_handler", ['window_Class_handler'])

        this.window_handler_title = save_element(this.window_handler, "div", this.id+"_handler_title", ['window_Class_handler_title']);

        this.window_handler_title.append(this.data.window_name);

        this.window_handler_icons = save_element(this.window_handler, "div", this.id+"_handler_icons", ['window_Class_handler_icons']);

		this.window_exit = new button_Icon_Class(this.window_handler_icons, this.id+"_handler_exit", 'ui-icon-circle-close', 'Exit', $.proxy(this.close_window, this))

        vData.add_instances(this.window_exit)
		this.window_exit.element.addClass('window_handler_exit_icon');

        if (this.draggable) {
            console.log("draggable");
            //add draggable here
        }

		//this.window.data({'data': this.data})

		//this.element = $(this.data.jquery_selector);

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
            if (key=="parent") continue;
            if (this[key]==null) continue;
            if (this[key].classType!=null) {
                this[key].destroy();
            }
        }

        //add more here
        this.window.empty();
        this.window.remove();

        // this should be last
        vData.delete_instances(this.id);
    },

	close_window: function() {
		/*! ADD DELETE OF THE ELEMENT */
		//this.destroy();

        this.parent.destroy();
	},

    setxy: function(x,y) {
        this.data.x = x;
        this.data.y = y;
        this.window.css({"left": this.data.x, "top": this.data.y})
    }

}


/*---------------------- General_class checker ---------------------*/

function general_classes(){
    this.test = function() {
        return 0;
    }
}