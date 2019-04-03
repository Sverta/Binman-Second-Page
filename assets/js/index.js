// var ajax = new XMLHttpRequest();
// ajax.open("GET", "sprites/sprite.svg", true);
// ajax.send();
// ajax.onload = function(e) {
//   var div = document.createElement("div");
//   div.innerHTML = ajax.responseText;
//   document.body.insertBefore(div, document.body.childNodes[0]);
// }

 function toggle_visibility(id) {
   var e = document.getElementById(id);
   if(e.style.display == 'block')
    e.style.display = 'none';
  else
    e.style.display = 'block';
}




