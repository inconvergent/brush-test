/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse,
   windowHeight, windowWidth, cos, sin, random, vec, rndInCirc
*/

let state;


function makeBristles(bnum, blen, rad){
  const bristles = [];
  for (let i=0; i < bnum; i++){
    const r = sqrt(random());
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
    mouse: [],
    speed: 0,
    brush: makeBrush(200, 50.0, 20.0),
    win,
  };
  console.log(state);
}


//function mouseClicked(){
//}

function getDot(xy, df, h, blen){
  return xy.copy().add(df.copy().mult(sqrt(pow(blen, 2.0) - pow(h, 2.0))));
}

function midPos(a){
  const l = a.length;
  const v = vec(0, 0);
  let s = 0;
  for (let i=0; i < l-1; i++){
    v.add(a[i].copy().mult(i));
    s += i;
  }
  return v.div(s);
}

function mouseDiff(){
  const i = state.mouse.length;
  if (i > 1){
    const mp = midPos(state.mouse);
    //const df = state.mouse[i-2].copy().sub(state.mouse[i-1]);
    const df = mp.copy().sub(state.mouse[i-1]);
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
    const i = state.mouse.length;
    const xy = state.mouse[i-1];
    const blen = state.brush.blen;
    const h = (1.0 - w)*blen;

    for (let i=0; i < state.brush.bnum; i++){
      const bristle = state.brush.bristles[i];
      if (bristle.l > h){
        const xya = xy.copy().add(bristle.xy);
        drawStroke(xya, getDot(xya, df, h, blen), 20);
      }
    }
  }
}

function draw(){
  state.mouse.push(vec(mouseX, mouseY));
  if (state.mouse.length>10){
    state.mouse = state.mouse.slice(1, 11);
  }
  const df = mouseDiff();
  const maxSpeed = 100;
  brushDraw(df, pow(1.0 - min(max(0, state.speed), maxSpeed)/maxSpeed, 2.0));
}

