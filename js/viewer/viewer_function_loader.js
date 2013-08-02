



function load_script_success(data, textStatus, jq) {

    var name = data.substring(2, data.indexOf('\n')).trim()
    var loaded = true;

    try {
	    if (system[name]==null) {
	    	loaded=false;
	    	throw new Error("There's no file/function name called "+name+": "+this.url)
	    }

	    if (system[name].loaded==null) {
			throw new Error("There's no loaded variable for "+name)
	    }

	    system[name].loaded = true
	    eval(data);
	    
	    var t = message_tab(20, this.url.length, 4)

	    if (debug) console.log(this.url+t+system.general.loaded)
	    
	    // check if all scripts are loaded
	    for (var key in system) {
	    	if (key=='general') continue
	  		var file = system[key].file; 		
	  		if (file!=null) {
		    	if (!system[key].loaded) {
		    		loaded=false;
		    		break;
		    	}
	    	}
	    }

	    if (loaded) {
	    	run();
	    }
	} catch (e) {
		console.error(e.stack)
	}
}

function load_script_fail(jq, settings, exception) {
    //console.error(settings)
    //console.error(settings)
    //console.error(exception)
    //system.general.break_down = true;
}

$.cachedScript = function(url, options) {
	// allow user to set any option except for dataType, cache, and url
  	options = $.extend(options || {}, {
    	dataType: "script",
    	cache: true,
    	url: url
  	});
 
  	// Use $.ajax() since it is more flexible than $.getScript
  	// Return the jqXHR object so we can chain callbacks
  	return $.ajax(options);
}

function loadScripts () {

	for (var key in system) {

		if (key=='general') continue;

		var file = system[key].file;

		if (file!=null) {
			//console.log(file)
			$.cachedScript(file).done(load_script_success).fail(load_script_fail);
		}

	}

}
