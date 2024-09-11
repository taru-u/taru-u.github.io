const canvas = document.getElementById('visualSnow');
const context = canvas.getContext('2d');

function getUrlParam(param, defaultValue) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param) || defaultValue;
}

const noiseType = getUrlParam('noiseType', 'static');


const fpsInput = document.getElementById('fpsInput');
const pixelSizeInput = document.getElementById('pixelSizeInput');
const updateButton = document.getElementById('updateButton');
const fpsCounter = document.getElementById('fpsCounter');
const menu = document.getElementById('menu');

let pixelSize = 2;
let fpsMax = 30;
let fps = 0; // To track actual FPS
let lastFrameTime = 0;
let frameCount = 0;
let fpsLastTime = performance.now();
let fadeTimeout = null; // To track the timeout for fading

function resizeCanvas() {
    const scale = 1 / pixelSize;
    canvas.width = window.innerWidth * scale;
    canvas.height = window.innerHeight * scale;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function gaussianRand(n) {
    var rand = 0;
    for (var i = 0; i < n; i += 1) {
      rand += Math.random();
    }
    return rand / n;
  }

function drawVisualSnow() {
    const width = canvas.width;
    const height = canvas.height;
    const imageData = context.createImageData(width, height);
    const pixels = imageData.data;

    for (let i = 0; i < pixels.length; i += 4) {
        let randomValue
        if (noiseType === 'grayscale') {
            randomValue = Math.random() * 256
        }
        else if (noiseType === 'gaussian') {
            randomValue = gaussianRand(5) * 256
        } else {
            if (Math.random() > 0.5 ) randomValue = 255
            else randomValue = 0
        }
        pixels[i] = randomValue;     // Red
        pixels[i + 1] = randomValue; // Green
        pixels[i + 2] = randomValue; // Blue
        pixels[i + 3] = 255;         // Alpha
    }

    context.putImageData(imageData, 0, 0);
}


function animate(timestamp) {
    if (timestamp - lastFrameTime >= 1000 / fpsMax) {
        drawVisualSnow();
        lastFrameTime = timestamp;

        frameCount++;
    }

    if (timestamp - fpsLastTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        fpsLastTime = timestamp;

        fpsCounter.textContent = `FPS: ${fps}`;
    }

    requestAnimationFrame(animate);
}

animate();

function updateSettings() {
    let newFps = parseInt(fpsInput.value);
    let newPixelSize = parseInt(pixelSizeInput.value);

    if (newFps === 0 || newFps > 1000) {
        fpsMax = 1000;
        fpsInput.value = 1000;
    } else {
        fpsMax = newFps;
    }

    if (newPixelSize != pixelSize){
        if (newPixelSize === 0) {
            pixelSize = 1;
            pixelSizeInput.value = 1;
        } else {
            pixelSize = newPixelSize;
        }

        resizeCanvas();
    }

}

updateButton.addEventListener('click', updateSettings);


function startFadeOutTimer() {
    if (fadeTimeout) {
        clearTimeout(fadeTimeout);
    }
    fadeTimeout = setTimeout(() => {
        menu.classList.add('hidden');
    }, 3000);
}

function handleMouseMove(event) {
    if (event.clientY <= 200) {
        menu.classList.remove('hidden');
        startFadeOutTimer();
    }
}

function handleMouseLeave() {
    menu.classList.add('hidden');
}

window.addEventListener('mousemove', handleMouseMove);
window.addEventListener('mouseleave', handleMouseLeave);

startFadeOutTimer();