const body = document.querySelector("body"),
      nav = document.querySelector("nav"),
      modeToggle = document.querySelector(".dark-light"),
      searchToggle = document.querySelector(".searchToggle"),
      sidebarOpen = document.querySelector(".sidebarOpen"),
      siderbarClose = document.querySelector(".siderbarClose");
      let getMode = localStorage.getItem("mode");
          if(getMode && getMode === "dark-mode"){
            body.classList.add("dark");
          }
      modeToggle.addEventListener("click" , () =>{
        modeToggle.classList.toggle("active");
        body.classList.toggle("dark");
        // js code to keep user selected mode even page refresh or file reopen
        if(!body.classList.contains("dark")){
            localStorage.setItem("mode" , "light-mode");
        }else{
            localStorage.setItem("mode" , "dark-mode");
        }
      });
        searchToggle.addEventListener("click" , () =>{
        searchToggle.classList.toggle("active");
      });

sidebarOpen.addEventListener("click" , () =>{
    nav.classList.add("active");
});
body.addEventListener("click" , e =>{
    let clickedElm = e.target;
    if(!clickedElm.classList.contains("sidebarOpen") && !clickedElm.classList.contains("menu")){
        nav.classList.remove("active");
    }
});

let slider = document.querySelector('.slider .list');
let items = document.querySelectorAll('.slider .list .item');
let next = document.getElementById('next');
let prev = document.getElementById('prev');
let dots = document.querySelectorAll('.container .dots li');


let refreshInterval = setInterval(()=> {next.click()}, 1000000);
function reloadSlider(){
slider.style.left = -items[active].offsetLeft + 'px';
// 
let last_active_dot = document.querySelector('.slider .dots li.active');
last_active_dot.classList.remove('active');
dots[active].classList.add('active');

clearInterval(refreshInterval);
refreshInterval = setInterval(()=> {next.click()}, 1000000);
}

dots.forEach((li, key) => {
li.addEventListener('click', ()=>{
     active = key;
     reloadSlider();
})
})
window.onresize = function(event) {
reloadSlider();
};

setInterval( function() { 
  document.querySelector('.loader').style.display = 'block'
}, 4000  );

setInterval( function() {
  document.querySelector('.loader').style.display = 'none'
}, 4000  );