"use strict";

var log = function(message, flag) {
    var timestamp = new Date();
    if (flag) {
        console.log(message);
        console.log(timestamp);
        console.log("--------------------------------------------------------------------------")
    }

    if ((flag==null)||(flag==1)) {
        var data = {data: message, timestamp: timestamp};
        log_data.push(data);
    }
}

var log_data = [];