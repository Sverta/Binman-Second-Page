function toggle_visibility(id) {
  if (window.screen.width < 991){
     var e = document.getElementById(id);
     if(e.style.display == 'block')
      e.style.display = 'none';
    else
      e.style.display = 'block';
  }
}




