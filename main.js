const canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let c = canvas.getContext("2d");
c.strokeStyle = "white";
c.fillStyle = "white";

// List of all dots
let dotcoords = [];
// Number of dots
const count = 400;
// distance for line drawing
const sep = 55;

// Store mouse coordinates
let mcoord = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (m) => {
  mcoord.x = m.x;
  mcoord.y = m.y;
});

// Generate coordinates for all dots
for (let i = 0; i < count; i++) {
  dotcoords.push({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    // "new x" and "new y", how much to translate each dot by
    nx: Math.random() * (Math.random() < 0.5 ? -1 : 1) * 0.2,
    ny: Math.random() * (Math.random() < 0.5 ? -1 : 1) * 0.6,
  });
}

// Draw all dots
function renderDots() {
  dotcoords.forEach((dot) => {
    // Draw a dot
    c.beginPath();
    c.lineWidth = 3;
    c.arc(dot.x, dot.y, 2, 0, Math.PI * 2, false);
    c.stroke();
    c.fill();
  });
}

// Draw dot at mouse cursor
function renderMouse() {
  c.beginPath();
  c.lineWidth = 3;
  c.arc(mcoord.x, mcoord.y, 2, 0, Math.PI * 2, false);
  c.stroke();
  c.fill();
}

// Decide whether or not to draw a line
function decideDraw(p1, p2) {
  // TODO: Test if this actually optimises anything or its more efficient to just calculate distance no matter what
  if (Math.abs(p1.x - p2.x) < sep && Math.abs(p1.y - p2.y) < sep) {
    const d = getDistance(p1, p2);
    if (d < sep) {
      renderLine(p1, p2, d);
    }
  }
}

// Draw a line from p1 to p2
function renderLine(p1, p2, d) {
  // TODO: Shorten line width the further away the points are
  c.beginPath();
  c.moveTo(p1.x, p1.y);
  c.lineWidth = 1;
  c.lineTo(p2.x, p2.y);
  c.stroke();
}

// Draw line between dots
function drawLines() {
  // TODO: Improve efficiency of drawing lines (dont use nested foreach)
  dotcoords.forEach((dot1) => {
    // If dot is close to cursor draw line
    decideDraw(mcoord, dot1);
    dotcoords.forEach((dot2) => {
      // If dot is close to another dot draw line
      decideDraw(dot1, dot2);
    });
  });
}

function getDistance(p1, p2) {
  const dx = Math.pow(p2.x - p1.x, 2);
  const dy = Math.pow(p2.y - p1.y, 2);
  return Math.sqrt(dx + dy);
}

// Set new coordinates for all dots
function update() {
  dotcoords.forEach((dot) => {
    // Make sure dots dont go off screen
    if (dot.x < 0 || dot.x > canvas.width) {
      dot.nx = -dot.nx;
    }
    if (dot.y < 0 || dot.y > canvas.height) {
      dot.ny = -dot.ny;
    }
    dot.x += dot.nx;
    dot.y += dot.ny;
  });
}

function animate() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  renderMouse();
  renderDots();
  drawLines();
  update();
  requestAnimationFrame(animate);
}

animate();
