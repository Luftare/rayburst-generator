const previewCanvas = document.getElementById('preview');
const productionCanvas = document.getElementById('production');

window.addEventListener('resize', () => {
  handleScreenSize();
  paint(previewCanvas);
});

const state = {
  rayCount: 10,
  rayColorEven: 'black',
  rayColorOdd: 'grey',
  centerCoreRadius: 0.01,
  centerShadeRadius: 0.5,
  centerColor: 'white',
  fileName: 'rayburst',
  imageWidth: 600,
  imageHeight: 600
};

document.getElementById('ray-count').addEventListener('input', (e) => {
  state.rayCount = parseInt(e.target.value);
  paint(previewCanvas);
});

document.getElementById('center-core-radius').addEventListener('input', (e) => {
  state.centerCoreRadius = parseFloat(e.target.value);
  paint(previewCanvas);
});

document.getElementById('center-shade-radius').addEventListener('input', (e) => {
  state.centerShadeRadius = parseFloat(e.target.value);
  paint(previewCanvas);
});

document.getElementById('ray-color-even').addEventListener('change', (e) => {
  state.rayColorEven = e.target.value;
  paint(previewCanvas);
});

document.getElementById('ray-color-odd').addEventListener('change', (e) => {
  state.rayColorOdd = e.target.value;
  paint(previewCanvas);
});

document.getElementById('center-color').addEventListener('change', (e) => {
  state.centerColor = e.target.value;
  paint(previewCanvas);
});

document.getElementById('file-name').addEventListener('input', (e) => {
  state.fileName = e.target.value;
});

document.getElementById('image-width').addEventListener('input', (e) => {
  state.imageWidth = parseInt(e.target.value);
});

document.getElementById('image-height').addEventListener('input', (e) => {
  state.imageHeight = parseInt(e.target.value);
});

document.getElementById('download').addEventListener('click', (e) => {
  productionCanvas.width = state.imageWidth;
  productionCanvas.height = state.imageHeight;

  paint(productionCanvas);

  e.target.setAttribute('download', `${state.fileName}.png`);
  const dataURL = productionCanvas.toDataURL('image/png');
  e.target.href = dataURL;
});

function paint(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = state.rayColorEven;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = state.rayColorOdd;
  const center = [canvas.width / 2, canvas.height / 2];
  const maxSide = Math.max(canvas.width, canvas.height);

  [...Array(state.rayCount)].forEach((_, i) => {
    if(i % 2) return;
    const angleA = (i / state.rayCount) * Math.PI * 2;
    const angleB = ((i + 1) / state.rayCount) * Math.PI * 2;
    const pointA = pointAtAngle(angleA, canvas);
    const pointB = pointAtAngle(angleB, canvas);
    ctx.beginPath();
    ctx.moveTo(center[0], center[1]);
    ctx.lineTo(pointA[0], pointA[1]);
    ctx.lineTo(pointB[0], pointB[1]);
    ctx.closePath();
    ctx.fill();
  });

  const gradient = ctx.createRadialGradient(center[0], center[1], state.centerCoreRadius * maxSide, center[0], center[1], state.centerShadeRadius * maxSide);
  gradient.addColorStop(0, state.centerColor);
  gradient.addColorStop(1, 'transparent');

  ctx.fillStyle = gradient;
  ctx.fillRect(0,0, canvas.width, canvas.height);
}

function pointAtAngle(angle, canvas) {
  const size = Math.max(canvas.width, canvas.height) * 1.5;
  const center = [canvas.width / 2, canvas.height / 2];

  return [
    center[0] + Math.cos(angle) * size,
    center[1] + Math.sin(angle) * size,
  ];
}

function handleScreenSize() {
  const width = Math.floor(innerWidth);
  const height = Math.floor(innerHeight);

  previewCanvas.width = width;
  previewCanvas.height = height;
  document.querySelector('#image-width').innerHTML = width;
  document.querySelector('#image-height').innerHTML = height;
}

function boot() {
  handleScreenSize();
  paint(previewCanvas);
}

boot();