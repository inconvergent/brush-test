/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse,
   windowHeight, windowWidth, cos, sin, random, vec, rndInCirc
*/

let state;


function makeBristles(bnum, blen, rad){
  const bristles = [];
  for (let i=0; i < bnum; i++){
    const r = random();
    const a = random(-PI, PI);
    bristles.push({
      xy: vec(cos(a)*r*rad, sin(a)*r*rad),
      l: blen * (1.0 - r)});
  }
  return bristles;
}


function makeBrush(bnum, blen, rad){
  return {
    blen, bnum, rad,
    bristles: makeBristles(bnum, blen, rad)
  };
}


function setup(){
  //win = vec(windowHeight, windowWidth);
  win = vec(1000, 1000);
  angleMode(RADIANS);
  createCanvas(win.x, win.y);
  //strokeWeight(2);
  fill('rgba(0,0,0,0.03)');
  noStroke();

  state = {
    mouse: null,
    mousePrev: null,
    speed: 0,
    brush: makeBrush(100, 60.0, 30.0),
    win,
  };
  console.log(state);
}


//function mouseClicked(){
//}

function getDot(xy, df, h, blen){
  return xy.copy().add(df.copy().mult(sqrt(pow(blen, 2.0) - pow(h, 2.0))));
}

function mouseDiff(){
  if (state.mouse && state.mousePrev){
    const df = state.mousePrev.copy().sub(state.mouse);
    const l = df.mag();
    if (l <= 0.001){
      state.speed = 0;
      return null;
    }
    state.speed = l;
    return df.div(l);
  }
  return null;
}

function drawStroke(a, b, n){
  for (let i=0; i < n; i++){
    const xy = p5.Vector.lerp(a, b, random());
    square(xy.x, xy.y, 1);
  }
}

function brushDraw(df, w=0.5){
  if (df && w){
    console.log(w)
    const xy = state.mouse;
    const blen = state.brush.blen;
    const h = (1.0 - w)*blen;

    for (let i=0; i < state.brush.bnum; i++){
      const bristle = state.brush.bristles[i];
      if (bristle.l > h){
        const xya = xy.copy().add(bristle.xy);
        drawStroke(xya, getDot(xya, df, h, blen), 40);
      }
    }
  }
}

function draw(){
  state.mousePrev = state.mouse;
  state.mouse = vec(mouseX, mouseY);
  const df = mouseDiff();
  const maxSpeed = 10;
  brushDraw(df, 1.0 - min(max(0, state.speed), maxSpeed)/maxSpeed);
}
