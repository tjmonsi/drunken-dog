"use strict";

var Loader = {
    init: function() {
        try {
            //console.log(Loader.load_file("data/iv_sample1.json"))
            var tData = $.parseJSON(Loader.load_file("data/iv_sample1.json"));
            VData.load(tData)
            //console.log("Hello");
            //console.log(tData);
        } catch (e) {

            throw e
            //throw new Error e;
        }
    },

    load_file: function(filename) {
        var oRequest = new XMLHttpRequest();
        var sURL = "http://"+ self.location.hostname + "/faq/requested_file.htm";

        oRequest.open("GET",filename,false);
        oRequest.setRequestHeader("Chrome",navigator.userAgent);
        oRequest.send(null)

        if (oRequest.status==200) return oRequest.responseText;
        else alert("Error executing XMLHttpRequest call!");


    }
}