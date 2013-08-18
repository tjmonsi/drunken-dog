//general_functions

"use strict";

/* updateSize = update the size of the global variables width and height of the document */
function updateSize(){
    win_width = $(document).width();
    win_height = $(document).height();

    //UI.asset_bar.asset_bar_list_resize();
}

// create a random id string of a specified length
function makeID(length){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

// santize input as a number input
function toNum(num) {
    var possible = "0123456789./ ";
    for (var i in num) {
        var flag = false;
        for (var j in possible) {
            if (num[i]==possible[j]) {
                flag=true;
                break;
            }
        }
        if (!flag) {
            num = num.slice(0,i)+num.slice(i, num.length-1);
        }
    }
    return num;
}

// create an element and appends it to parent. Must have id
function saveElement(parent, el, id, classes, attributes){
    try {
        var element = createElement(el, id, classes, attributes);
        parent.append(element);
        return $(el+"#"+id);
    } catch(e) {
        console.error(e.stack)
    }
}

// creates an elements and appends it after a sibling. Must have id
function saveElementAfter(before, el, id, classes, attributes) {
    try {
        var element = createElement(el, id, classes, attributes);
        before.after(element);
        return $(el+"#"+id)
    } catch (e) {
        console.error(e.stack)
    }

}

// checks element if within a specified area
function withinArea(x, y, x2, y2, area) {

    if (((x>=x2-area) && (x<=x2+area)) && ((y>=y2-area) && (y<=y2+area))) {
        return true
    } else {
        return false
    }

}

// create a br element
function br(){
    return createElement('br');
}

// create an element
function createElement(el, id, classes, attributes) {
    var element = document.createElement(el);
    // add id
    if (id) element.id = id;
    // add classes
    if (classes) {
        for (var classname in classes) {
            element.classList.add(classes[classname]);
        }
    }
    // add other attributes
    if (attributes) {
        var key;
        for (key in attributes) {
            var value = attributes[key];
            if (key == 'textContent') {
                element.textContent = value;
            }
            else {
                element.setAttribute(key, value);
            }
        }
    }
    return element;
}