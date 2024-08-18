const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
const clearBtn = document.getElementById('clearBtn');
const brushSizeInput = document.getElementById('brushSize');
const toolSelect = document.getElementById('tool');

let tileSize = parseInt(brushSizeInput.value); 
let drawing = false;
let currentTool = 'draw';


const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight - 50; 

canvas.width = canvasWidth * 2;
canvas.height = canvasHeight * 2;
canvas.style.width = `${canvasWidth}px`;
canvas.style.height = `${canvasHeight}px`;
const scale = 2;
ctx.scale(scale, scale);

function drawPixel(x, y) {
    const pixelX = Math.floor(x / tileSize) * tileSize;
    const pixelY = Math.floor(y / tileSize) * tileSize;

    ctx.fillStyle = '#000';
    ctx.fillRect(pixelX, pixelY, tileSize, tileSize);
}

function erasePixel(x, y) {
    const pixelX = Math.floor(x / tileSize) * tileSize;
    const pixelY = Math.floor(y / tileSize) * tileSize;

    ctx.fillStyle = '#fff'; 
    ctx.fillRect(pixelX, pixelY, tileSize, tileSize);
}

function drawLine(x1, y1, x2, y2) {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;

    let x = x1;
    let y = y1;

    while (true) {
        if (currentTool === 'draw') {
            drawPixel(x, y);
        } else if (currentTool === 'erase') {
            erasePixel(x, y);
        }
        if (x === x2 && y === y2) break;
        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x += sx;
        }
        if (e2 < dx) {
            err += dx;
            y += sy;
        }
    }
}

function startDrawing(e) {
    drawing = true;
    lastX = e.clientX;
    lastY = e.clientY - 50; 
}

function endDrawing() {
    drawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!drawing) return;

    const x = e.clientX;
    const y = e.clientY - 50; 

    drawLine(lastX, lastY, x, y);
    lastX = x;
    lastY = y;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateBrushSize() {
    tileSize = parseInt(brushSizeInput.value);
}

clearBtn.addEventListener('click', clearCanvas);
brushSizeInput.addEventListener('input', updateBrushSize);
toolSelect.addEventListener('change', (e) => {
    currentTool = e.target.value;
});

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', endDrawing);
canvas.addEventListener('mousemove', draw);
