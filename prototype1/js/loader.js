/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 6/24/13
 * Time: 10:14 AM
 * To change this template use File | Settings | File Templates.
 */
"use strict";

var Loader = {
    init: function() {
        try {
            UI.videoset = $.parseJSON(Loader.load_file("data/video.json")).data;
            UI.commentset = $.parseJSON(Loader.load_file("data/comment.json")).chunk   ;
            UI.basic = $.parseJSON(Loader.load_file("data/basic.json")).data;
            //UI.transcript = $.parseJSON(Loader.load_file("data/transcript.json")).transcript;
            UI.init();
        } catch (e) {
            console.log(e);
        }
    },

    load_file: function(filename) {
        var oRequest = new XMLHttpRequest();
        var sURL = "http://"+ self.location.hostname + "/faq/requested_file.htm";

        oRequest.open("GET",filename,false);
        oRequest.setRequestHeader("User-Agent",navigator.userAgent);
        oRequest.send(null)

        if (oRequest.status==200) return oRequest.responseText;
        else alert("Error executing XMLHttpRequest call!");


    }
}

window.addEventListener('load', Loader.init)