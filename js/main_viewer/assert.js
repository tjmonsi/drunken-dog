var assert_html = function(value, ul, pass, fail) {
    var li = createElement('li')
    li.className = value ? 'pass' : 'fail';
    if (value) li.appendChild( document.createTextNode( pass ) );
    else li.appendChild( document.createTextNode( fail ) );
    ul.appendChild( li );
}

var assert = function(value, pass, fail) {
    if (value) log(pass, 1);
    else log(fail, 1)
}