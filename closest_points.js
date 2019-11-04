var points;
var closest;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background(255);
  frameRate(30);
  textFont("Helvetica");
  textSize(12);

  step = 0;
  
  var n = 15;
  points = new Array(n);
  for (var i = 0; i < n; i++) {
    points[i] = createVector(random(100, width-100), random(100, height-100));
  }
  
  Px = sortbyX(points);
  Py = sortbyY(points);
  
  closest = CPR(Px, Py);
}

function draw() {
  clear();

  //draw points
  for (var i = 0; i < points.length; i++) {
    noStroke();
    fill(20, 80, 200);
    ellipse(points[i].x, points[i].y, 5, 5);
    
    noStroke();
    fill(0);
    text(round(points[i].x) + ", " + round(points[i].y), points[i].x + 5, points[i].y, 1000, 12);  
  }

  // highlight closest points
  stroke(220, 80, 20);
  line(closest[0].x, closest[0].y, closest[1].x, closest[1].y);
  fill(220, 80, 20);
  ellipse(closest[0].x, closest[0].y, 5, 5);
  ellipse(closest[1].x, closest[1].y, 5, 5);
}

function distance(p1, p2) {
  return sqrt(pow(p1.x-p2.x, 2) + pow(p1.y-p2.y, 2));
}

function sortbyX(P) {  
  var temp = P.slice();
  temp.sort(function(p1, p2) {
    return p1.x - p2.x;
  });
  return temp;
}

function sortbyY(P) {  
  var temp = P.slice();
  temp.sort(function(p1, p2) {
    return p1.y - p2.y;
  });
  return temp;
}

function logPoints(P) {
  for (var i = 0; i < P.length; i++)
    console.log(round(P[i].x) + ", " + round(P[i].y));
}

function CPR(Px, Py) {
	console.log("Px: ");
	logPoints(Px);

  // base cases: explicit distance calculation between points
  if (Px.length == 3) {
	  var closest = [Px[0], Px[1]];
    var minDist = distance(Px[0], Px[1]);
      
    if (distance(Px[1], Px[2]) <= minDist) {
      closest = [Px[1], Px[2]];
      minDist = distance(Px[1], Px[2]);
    }
    else if (distance(Px[0], Px[2]) <= minDist) {
      closest = [Px[0], Px[2]];
      minDist = distance(Px[0], Px[2]);
    }
    return closest;
  }
  
  if (Px.length == 2) {
    return [Px[0], Px[1]];
  }
  
  // split P from midpoint using x coordinates
  console.log("Midpoint: " + ceil(Px.length/2));
  var Q = Px.slice(0, ceil(Px.length/2));
  var R = Px.slice(ceil(Px.length/2), Px.length);
  
  console.log("Q");
  logPoints(Q);
  console.log("R");
  logPoints(R);
  
  var Qx = sortbyX(Q);
  var Qy = sortbyY(Q);  
  var Rx = sortbyX(R);
  var Ry = sortbyY(R);
  
  console.log("");
  
  var leftCP = CPR(Qx, Qy);  // (q1, q2) closest pair of points in Q
  console.log("Left CP:");
  logPoints(leftCP);
  
  console.log("+");
  
  var rightCP = CPR(Rx, Ry); // (r1, r2) closest pair of points in R
  console.log("Right CP:");
  logPoints(rightCP);
  
  // calculate delta
  var delta = min(distance(leftCP[0], leftCP[1]), distance(rightCP[0], rightCP[1]));
  console.log("delta: " + delta);
  var xstar = Q[Q.length-1].x;
  
  // create set S of points within distance delta of line x = xstar
  var S = new Array();
  for (var i = 0; i < Px.length; i++) {
    if (abs(Px[i].x - xstar) <= delta)
      S.push(Px[i]);
  }
  var Sy = sortbyY(S);
  
  console.log("Sy: ");
  logPoints(Sy);
  
  var sminDist = 1000000;
  var s1;
  var s2;
  for (var i = 0; i < Sy.length; i++) {
    for (var j = i+1; j < min(i+16, Sy.length); j++) {
      if (distance(Sy[i], Sy[j]) < sminDist) {
        s1 = Sy[i];
        s2 = Sy[j];
        sminDist = distance(Sy[i], Sy[j]);
      }
    }
  }
  
  if (sminDist < delta) {
    console.log("[s1, s2]: ");
    logPoints([s1, s2]);
    return [s1, s2];
  }
  else if (distance(leftCP[0], leftCP[1]) < distance(rightCP[0], rightCP[1]))
    return leftCP;
  else
    return rightCP;
  
  return null;
}