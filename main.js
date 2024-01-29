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
function drawDot() {
  dotcoords.forEach((dot) => {
    // Draw a dot
    c.beginPath();
    c.arc(dot.x, dot.y, 2, 0, Math.PI * 2, false);
    c.stroke();
    c.fill();
  });
}

// Draw dot at mouse cursor
function drawMouse() {
  c.beginPath();
  c.arc(mcoord.x, mcoord.y, 2, 0, Math.PI * 2, false);
  c.stroke();
  c.fill();
}

// Draw line between dots
function drawLine() {
  c.beginPath();
  dotcoords.forEach((dot1) => {
    c.moveTo(dot1.x, dot1.y);
    // If dot is close to cursor draw line
    if (getDistance(mcoord, dot1) < sep * 1.5) {
      c.lineTo(mcoord.x, mcoord.y);
    }
    dotcoords.forEach((dot2) => {
      // If dot is close to another dot draw line
      if (getDistance(dot1, dot2) < sep) {
        c.lineTo(dot2.x, dot2.y);
      }
    });
  });
  c.stroke();
}

function getDistance(p1, p2) {
  const dx = Math.pow(p2.x - p1.x, 2);
  const dy = Math.pow(p2.y - p1.y, 2);
  return Math.sqrt(dx + dy);
}

// Set new coordinates for all dots
function update() {
  dotcoords.forEach((dot) => {
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
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  drawMouse();
  drawDot();
  drawLine();
  update();
}

animate();
