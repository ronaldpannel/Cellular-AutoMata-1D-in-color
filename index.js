const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ruleSetValue = document.getElementById("ruleSetValue");
const sliderValue = document.getElementById("sliderValue");
const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
grad.addColorStop(0.2, "rgb(2, 4, 8)");
grad.addColorStop(0.4, "rgb(27, 40, 66)");
grad.addColorStop(0.6, "rgb(58, 75, 110)");
grad.addColorStop(0.8, "rgb(58, 75, 110)");

ctx;

let cells = [];
let width = 5; // Cell width
let y = 0; // Tracks the vertical position for drawing
let ruleValue;
let ruleSet;

// Initialize the canvas and pattern with the selected rule
function init() {
  ruleValue = Number(ruleSetValue.value);
  ruleSet = ruleValue.toString(2);

  // Ensure the ruleSet is 8 bits long by padding with leading zeros
  while (ruleSet.length < 8) {
    ruleSet = "0" + ruleSet;
  }

  // Reset the y position and clear the canvas
  y = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Initialize the cells array
  let total = Math.floor(canvas.width / width); // Ensure total is an integer
  cells = new Array(total).fill(0); // Initialize all cells to 0

  // Start with a single middle cell set to 1
  cells[Math.floor(total / 2)] = 1;
}
init();

// Update the slider value label
function updateLabel() {
  sliderValue.innerHTML = ruleSetValue.value;
}

// Generate the cellular automaton pattern
function genPattern() {
  for (let i = 0; i < cells.length; i++) {
    let x = i * width;
    let hue = i * 0.5;
    ctx.fillStyle = cells[i] === 1 ? `hsl(${hue}, 100%, 50%)` : grad;
    ctx.fillRect(x, y, width, width);
  }

  y += width;

  // Calculate the next generation of cells
  let nextCells = [];
  nextCells[0] = cells[0];
  nextCells[cells.length - 1] = cells[cells.length - 1];
  let len = cells.length;

  for (let i = 1; i < cells.length - 1; i++) {
    let left = cells[(i - 1 + len) % len];
    let right = cells[(i + 1 + len) % len];
    let state = cells[i];
    let newState = calcState(left, state, right);
    nextCells[i] = newState;
  }
  cells = nextCells;
}

// Handle ruleSetValue change to dynamically update the pattern
ruleSetValue.addEventListener("change", (e) => {
  updateLabel(); // Update the label display
  init(); // Reinitialize with the new rule
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  genPattern();
}
animate();

// Calculate the new state of a cell based on its neighborhood
function calcState(a, b, c) {
  let neighborhood = "" + a + b + c;
  let value = 7 - parseInt(neighborhood, 2);
  return parseInt(ruleSet[value]);
}
