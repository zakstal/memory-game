this.JST = {"index": function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <title></title>\n  </head>\n  <link rel="stylesheet" href="/css/mg.css">\n  <body>Yes its working</body>\n  <script src="/js/vendor.js"></script>\n  <script src="/js/myScripts.js"></script>\n  <script src="/js/JST.js"></script>\n</html>';

}
return __p
},
"components/card/card": function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '\n<div class="container">\n  <div class="cube">';
 console.log('gif url', gifUrl) ;
__p += '\n    <div class="figure top top-bottom"></div>\n    <div class="figure bottom top-bottom"></div>\n    <div class="figure left left-right"></div>\n    <div class="figure right left-right"></div>\n    <div class="figure front faces"></div>\n    <div class="figure back faces"><img src="' +
((__t = ( gifUrl )) == null ? '' : __t) +
'" data-view="test"/></div>\n  </div>\n</div>';

}
return __p
},
"components/cards/cards": function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '\n<div class="cards">';
 console.log('in template') ;
__p += '</div>';

}
return __p
}};