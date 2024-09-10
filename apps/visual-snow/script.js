const canvas = document.getElementById('visualSnow');
const context = canvas.getContext('2d');


// Get form elements
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

function drawVisualSnow() {
    const width = canvas.width;
    const height = canvas.height;
    const imageData = context.createImageData(width, height);
    const pixels = imageData.data;

    for (let i = 0; i < pixels.length; i += 4) {
        const randomValue = Math.random() > 0.5 ? 0 : 255; // Black or white
        pixels[i] = randomValue;     // Red
        pixels[i + 1] = randomValue; // Green
        pixels[i + 2] = randomValue; // Blue
        pixels[i + 3] = 255;         // Alpha
    }

    context.putImageData(imageData, 0, 0);
}


// Animation loop
function animate(timestamp) {
    // Control the frame rate based on fpsMax
    if (timestamp - lastFrameTime >= 1000 / fpsMax) {
        drawVisualSnow();
        lastFrameTime = timestamp;

        // Track the actual frame count for FPS calculation
        frameCount++;
    }

    // Calculate and update FPS every second
    if (timestamp - fpsLastTime >= 1000) {
        fps = frameCount; // Number of frames in the last second
        frameCount = 0;
        fpsLastTime = timestamp;

        // Update FPS counter in the DOM
        fpsCounter.textContent = `FPS: ${fps}`;
    }

    // Request next frame
    requestAnimationFrame(animate);
}

animate();

// Function to update fpsMax and pixelSize
function updateSettings() {
    let newFps = parseInt(fpsInput.value);
    let newPixelSize = parseInt(pixelSizeInput.value);

    // If the user enters 0 for FPS, set fpsMax to 1000 and change input field to display 'max'
    if (newFps === 0 || newFps > 1000) {
        fpsMax = 1000;
        fpsInput.value = 1000;
    } else {
        fpsMax = newFps;
    }

    // If the user enters 0 for pixel size, default to 1 and change input field to display '1'
    if (newPixelSize != pixelSize){
        if (newPixelSize === 0) {
            pixelSize = 1;
            pixelSizeInput.value = 1;
        } else {
            pixelSize = newPixelSize;
        }

        // Resize canvas after updating pixel size
        resizeCanvas();
    }

}

// Event listener for update button
updateButton.addEventListener('click', updateSettings);


// Fade-out logic
function startFadeOutTimer() {
    if (fadeTimeout) {
        clearTimeout(fadeTimeout);
    }
    fadeTimeout = setTimeout(() => {
        menu.classList.add('hidden');
    }, 3000); // Fade out after 3 seconds of inactivity
}

// Show menu and restart fade timer when mouse moves to top 200px
function handleMouseMove(event) {
    if (event.clientY <= 200) {
        menu.classList.remove('hidden'); // Show the menu
        startFadeOutTimer(); // Restart fade-out timer
    }
}

// Hide the menu if the mouse leaves the window
function handleMouseLeave() {
    menu.classList.add('hidden');
}

// Add event listeners to manage menu visibility
window.addEventListener('mousemove', handleMouseMove);
window.addEventListener('mouseleave', handleMouseLeave);

// Start the fade-out timer when the page loads
startFadeOutTimer();