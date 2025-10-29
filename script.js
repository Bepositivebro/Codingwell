// Script File

// Home Section Starts
var menuBtn = document.querySelector('.main-navbar .menu-btn');
var menuList = document.querySelector('.main-navbar .nav-list');
var menuListItems = document.querySelectorAll('.nav-list li a');

menuBtn.addEventListener('click', function(){
	menuBtn.classList.toggle('active');
	menuList.classList.toggle('active');
});

for(var i = 0; i < menuListItems.length; i++){
	menuListItems[i].addEventListener('click', menuItemClicked);
}
function menuItemClicked(){
	menuBtn.classList.remove('active');
	menuList.classList.remove('active');
}

var homeSection = document.querySelector('.home');
window.addEventListener('scroll', pageScrollFunction);
window.addEventListener('load', pageScrollFunction);

function pageScrollFunction(){
	if(window.scrollY > 120){
		homeSection.classList.add('active');
	}
	else{
		homeSection.classList.remove('active');
	}
}
// Home Section Ends

// Partners Section Starts 
$('.partners-slider').owlCarousel({
    loop:true,
    autoplay:true,
    autoplayTimeout:3000,
    margin:10,
    nav:true,
    navText:["<i class='fa-solid fa-arrow-left'></i>",
             "<i class='fa-solid fa-arrow-right'></i>"],
    responsive:{
        0:{
            items:1
        },
        500:{
            items:2
        },
        700:{
            items:3
        },
        1000:{
        	items:5
        }
    }
})
// Partners Section Ends 

// Testimonials Section Starts
$('.testimonials-slider').owlCarousel({
    loop:true,
    autoplay:true,
    autoplayTimeout:6000,
    margin:10,
    nav:true,
    navText:["<i class='fa-solid fa-arrow-left'></i>",
             "<i class='fa-solid fa-arrow-right'></i>"],
    responsive:{
        0:{
            items:1
        },
        768:{
            items:2
        }
    }
})
// Testimonials Section Ends

$(".owl-carousel").owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    navText: [
      "<i class='fa-solid fa-arrow-left'></i>",
      "<i class='fa-solid fa-arrow-right'></i>"
    ],
    autoplay: true,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      1000: {
        items: 3
      }
    }
  });
  
//   IMAGE ANIMATION

var sparks=75; // how many sparks per clicksplosion
var speed=33; // how fast - smaller is faster
var bangs=5; // how many can be launched simultaneously (note that using too many can slow the script down)
var colours=new Array('#03f', '#f03', '#0e0', '#93f', '#0cf', '#f93', '#f0c'); 
//                     blue    red     green   purple  cyan    orange  pink

/****************************
*   Clicksplosion Effect    *
*(c)2012-3 mf2fm web-design *
*  http://www.mf2fm.com/rv  *
* DON'T EDIT BELOW THIS BOX *
****************************/
var intensity=new Array();
var Xpos=new Array();
var Ypos=new Array();
var dX=new Array();
var dY=new Array();
var stars=new Array();
var decay=new Array();
var timers=new Array();
var swide=800;
var shigh=600;
var sleft=sdown=0;
var count=0;

function addLoadEvent(funky) {
  var oldonload=window.onload;
  if (typeof(oldonload)!='function') window.onload=funky;
  else window.onload=function() {
    if (oldonload) oldonload();
    funky();
  }
}

addLoadEvent(clicksplode);

function clicksplode() { if (document.getElementById) {
  var i, j;
  window.onscroll=set_scroll;
  window.onresize=set_width;
  document.onclick=eksplode;
  set_width();
  set_scroll();
  for (i=0; i<bangs; i++) for (j=sparks*i; j<sparks+sparks*i; j++) {
    stars[j]=createDiv('*', 13);
    document.body.appendChild(stars[j]);
  }
}}

function createDiv(char, size) {
  var div, sty;
  div=document.createElement('div');
  sty=div.style;
  sty.font=size+'px monospace';
  sty.position='absolute';
  sty.backgroundColor='transparent';
  sty.visibility='hidden';
  sty.zIndex='101';
  div.appendChild(document.createTextNode(char));
  return (div);
}

function bang(N) {
  var i, Z, A=0;
  for (i=sparks*N; i<sparks*(N+1); i++) { 
    if (decay[i]) {
      Z=stars[i].style;
      Xpos[i]+=dX[i];
      Ypos[i]+=(dY[i]+=1.25/intensity[N]);
      if (Xpos[i]>=swide || Xpos[i]<0 || Ypos[i]>=shigh+sdown || Ypos[i]<0) decay[i]=1;
	  else {
        Z.left=Xpos[i]+'px';
        Z.top=Ypos[i]+'px';
	  }
      if (decay[i]==15) Z.fontSize='7px';
      else if (decay[i]==7) Z.fontSize='2px';
      else if (decay[i]==1) Z.visibility='hidden';
	  decay[i]--;
	}
	else A++;
  }
  if (A!=sparks) timers[N]=setTimeout('bang('+N+')', speed);
}

function eksplode(e) { 
  var x, y, i, M, Z, N;
  set_scroll();
  y=(e)?e.pageY:event.y+sdown;
  x=(e)?e.pageX:event.x+sleft;
  N=++count%bangs;
  M=Math.floor(Math.random()*3*colours.length);
  intensity[N]=5+Math.random()*4;
  for (i=N*sparks; i<(N+1)*sparks; i++) {
    Xpos[i]=x;
    Ypos[i]=y-5;
    dY[i]=(Math.random()-0.5)*intensity[N];
    dX[i]=(Math.random()-0.5)*(intensity[N]-Math.abs(dY[i]))*1.25;
    decay[i]=16+Math.floor(Math.random()*16);
    Z=stars[i].style;
    if (M<colours.length) Z.color=colours[i%2?count%colours.length:M];
    else if (M<2*colours.length) Z.color=colours[count%colours.length];
    else Z.color=colours[i%colours.length];
    Z.fontSize='13px';
    Z.visibility='visible';
  }
  clearTimeout(timers[N]);
  bang(N);
} 

function set_width() {
  var sw_min=999999;
  var sh_min=999999;
  if (document.documentElement && document.documentElement.clientWidth) {
    if (document.documentElement.clientWidth>0) sw_min=document.documentElement.clientWidth;
    if (document.documentElement.clientHeight>0) sh_min=document.documentElement.clientHeight;
  }
  if (typeof(self.innerWidth)=='number' && self.innerWidth) {
    if (self.innerWidth>0 && self.innerWidth<sw_min) sw_min=self.innerWidth;
    if (self.innerHeight>0 && self.innerHeight<sh_min) sh_min=self.innerHeight;
  }
  if (document.body.clientWidth) {
    if (document.body.clientWidth>0 && document.body.clientWidth<sw_min) sw_min=document.body.clientWidth;
    if (document.body.clientHeight>0 && document.body.clientHeight<sh_min) sh_min=document.body.clientHeight;
  }
  if (sw_min==999999 || sh_min==999999) {
    sw_min=800;
    sh_min=600;
  }
  swide=sw_min-7;
  shigh=sh_min-7;
}

function set_scroll() {
  if (typeof(self.pageYOffset)=='number') {
    sdown=self.pageYOffset;
    sleft=self.pageXOffset;
  }
  else if (document.body && (document.body.scrollTop || document.body.scrollLeft)) {
    sdown=document.body.scrollTop;
    sleft=document.body.scrollLeft;
  }
  else if (document.documentElement && (document.documentElement.scrollTop || document.documentElement.scrollLeft)) {
    sleft=document.documentElement.scrollLeft;
    sdown=document.documentElement.scrollTop;
  }
  else {
    sdown=0;
    sleft=0;
  }
}



    // List of available courses/subjects
    const courses = [
        { name: "C++", link: "https://cpp.maxoncodes.com/" },
        { name: "C Programming", link: "https://clanguage.maxoncodes.com/" },
        { name: "Java", link: "https://java.maxoncodes.com/" },
        { name: "PHP", link: "https://php.maxoncodes.com/" },
        { name: "HTML", link: "https://html.maxoncodes.com/" },
        { name: "CSS", link: "https://css.maxoncodes.com/" },
        { name: "JavaScript", link: "https://javascript.maxoncodes.com/" },
        { name: "SQL", link: "course_sql.html" },
        { name: "Python", link: "https://python.maxoncodes.com/" },
        //{ name: "Ruby", link: "course_ruby.html" },
       // { name: "Swift", link: "course_swift.html" }
    ];

   
    

      // Wait for the page to load
      window.onload = function () {
        const searchInput = document.getElementById('searchInput');

        // Automatically redirect when typing in the search field
        searchInput.addEventListener('input', function () {
            const queryValue = searchInput.value.trim();

            if (queryValue) {
                // Redirect to search results page with the query parameter
                window.location.href = `search-results.html?query=${queryValue}`;
            } else {
                // If the search input is cleared, redirect to the main page
                window.location.href = 'index.html';
            }
        });
    };







