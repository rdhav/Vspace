let numArcs = 2000;
let zoomScale = 3;

function setup (){
  createCanvas();
  colorMode(HSB, 1, 1, 1);
  windowResized();
}

let spaceObject = ({col, hue, len, angle, radius, speed, target, isPlanet=false}) => 
                  ({col, hue, len, angle, radius, speed, target, isPlanet});

let rInt = (b, a=0) => floor(random(min(a, b), max(a, b)));

let init = () => {
  window.arcs       = [];
  window.planets    = [];
  window.stars      = [];
  
  window.numCircles = rInt(70, 120);
  window.radius     = min(width, height)*.45;
  window.arcSize    = radius/numCircles;
  window.center     = {x:0, y:0, radius, len:radius/2};
  
  window.baseHue  = random();
  window.hueRange = random(.2, .7)*(random() < .5 ? -1 : 1);
  window.colorMap = (amt, hueShift=0) => [(baseHue+amt*hueRange+hueShift)%1, amt, 1-amt];
  
  let variance = random(.05, .4);
  
  for (let i = 0; i < numArcs; i++){
    let radius = rInt(numCircles);
    let amt    = radius/numCircles + random(-variance, variance);
    amt = constrain(amt, 0, 1);
    
    arcs.push(spaceObject({
      col    : colorMap(amt),
      len    : random() < .2 ? 1/(TAU*radius) : random(PI/2),
      angle  : random(TAU),
      radius : radius*arcSize,
      speed  : random(0, .3) * (random() < .5 ? 1 : -1) * .02,
    }));
  }
  
  arcs = arcs.sort((a, b) => b.len-a.len);
  
  let numPlanets = rInt(2, 7);
  for (let i = 0; i < numPlanets; i++){
    let targetCenter = (planets.length > 0) && (random() < .5);
    let target = targetCenter ? planets[rInt(0, planets.length)] : center;
    let len    = random(.5, .7)*target.len;
    
    planets.push(spaceObject({
      hue      : random(-.15, .15), len,
      angle    : random(TAU),
      radius   : targetCenter ?  random(target.len/4) + (len+target.len)/2 : random(radius/numPlanets) + radius*((i/numPlanets)*.7 + .3),
      speed    : random(.2, .5) * .005,
      target, isPlanet : true,
    }))
  }
  
  for (let i = 0; i < 1000; i++) stars.push({
    x:random(width),
    y:random(height),
    size:random(2, 5),
    hue:random(-.2, .2)+baseHue,
    sat:random(.7),
    idx:random(1e7),
    speed:random(.1, .01)
  });
}

function draw(){
  background(0);
  
  if (mouseDown){
    translate(width/2, height/2);
    scale(zoomScale);
    translate(-mouseX, -mouseY);
  }
  
  pushPop(() => {
    translate(width/2, height/2);

    noStroke();
    for (let i = numCircles; i >= 0; i--){
      fill(colorMap((i/numCircles)*.9));
      ellipse(0, 0, i*arcSize*2);
    }

    pushPop(() => {
      translate(-width/2, -height/2);
      blendMode(ADD);
      for (let s of stars){
        let lum = noise(s.idx, s.idx+frameCount*s.speed);
        stroke(s.hue, s.sat, lum*.7);
        line(s.x-s.size/2, s.y, s.x+s.size/2, s.y);
        line(s.x, s.y-s.size/2, s.x, s.y+s.size/2);
      }
    });

    noFill();
    strokeWeight(arcSize);
  
    for (let o of arcs){
      o.angle += o.speed;
      stroke(...o.col, .5);
      arc(0, 0, o.radius*2, o.radius*2, o.angle, o.angle+o.len);
    }

    for (let o of planets){
      o.angle += o.speed;
      o.x = cos(o.angle)*o.radius + o.target.x;
      o.y = sin(o.angle)*o.radius + o.target.y;
      
      pushPop(() => {
        translate(o.x, o.y);
        let a = atan2(o.y, o.x);
        rotate(a);
        noStroke();
        let percent = (1-(Math.hypot(o.x, o.y)/radius)*.4);

        for (let i = o.len; i >= 0; i -= mouseDown ? 2/zoomScale : 2){
          let amt = i/o.len;
          let amt2 = (1-amt**5)*(percent) + (1-percent);
          fill(colorMap(amt2, o.hue));
          ellipse(-o.len*amt/2 +o.len/2-1, 0, o.len*amt, sin(amt*PI/2)*o.len);
        }
      });
    }
  });
}

let mouseDown = false;
function mousePressed(evt){
  if (evt.button == 2) init();
  else mouseDown = true;
  return false;
}

function mouseReleased(){
  mouseDown = false;
}

document.addEventListener('contextmenu', event => {
    event.preventDefault();
});

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  init();
}

let pushPop = f => {push(); f(); pop();}