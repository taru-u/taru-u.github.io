let currentGroup = null;
const tol = 1; // tolerance value to make sure there are no >1 pixel gaps
const imageFolder = 'images/';

let x = 0; 
let y = 0;
let vx = 0;
let vy = 0; 
let vrot = 0;
let image = null; 
let gridRotationAngle = 0;
let canvas = null;
let canvasdiag = 0;

let guessingMode = false;

const images = ['001.webp','002.webp','003.webp','004.webp','005.webp','007.webp','008.webp','009.webp',
                '010.webp','011.webp'];
const groups = ['p1', 'p2', 'pm', 'pg', 'pmm', 'pmg', 'p4', 'p4m', 'p4g', 'cm', 'cmm', 'pgg', 'p3', 'p3m1', 'p31m', 'p6', 'p6m'];

const keyToButtonMap = {
    'q': document.querySelector('[data-group="p1"]'),
    'w': document.querySelector('[data-group="p2"]'),
    'e': document.querySelector('[data-group="pm"]'),
    'r': document.querySelector('[data-group="pg"]'),
    't': document.querySelector('[data-group="cm"]'),
    'y': document.querySelector('[data-group="pmm"]'),
    
    'a': document.querySelector('[data-group="pmg"]'),
    's': document.querySelector('[data-group="pgg"]'),
    'd': document.querySelector('[data-group="cmm"]'),
    'f': document.querySelector('[data-group="p4"]'),
    'g': document.querySelector('[data-group="p4m"]'),
    'h': document.querySelector('[data-group="p4g"]'),
    
    'z': document.querySelector('[data-group="p3"]'),
    'x': document.querySelector('[data-group="p3m1"]'),
    'c': document.querySelector('[data-group="p31m"]'),
    'v': document.querySelector('[data-group="p6"]'),
    'b': document.querySelector('[data-group="p6m"]'),
};

const challengeButton = document.getElementById('minute-challenge-button');
const animationCheckbox = document.getElementById('animation-checkbox');
const challengeInfoBox = document.getElementById('challenge-info-box');
const timeLeftElement = document.getElementById('time-left');
const currentScoreElement = document.getElementById('current-score');
const scoreAnnouncementBox = document.getElementById('score-announcement-box');
const finalScoreText = document.getElementById('final-score-text');
const container = document.querySelector('.container');
const controlContainer = document.querySelector('.control-container');

let animate = true;

function preloadImages(imageFilenames) {
    imageFilenames.forEach(function(filename) {
        const img = new Image();
        img.src = `./images/${filename}`;
    });
}

window.onload = function() {
    preloadImages(images);
};

document.addEventListener('keydown', function(event) {
    const key = event.key.toLowerCase(); 

    
    if (keyToButtonMap[key]) {
        keyToButtonMap[key].click();
    }
});

let fadeTimeout;
let isInBottom = true;

function fadeOutElements() {
    container.style.transition = 'opacity 2s ease';
    controlContainer.style.transition = 'opacity 2s ease';
    container.style.opacity = 0;
    controlContainer.style.opacity = 0;
}

function fadeInElements() {
    container.style.transition = 'opacity 0.5s ease';
    controlContainer.style.transition = 'opacity 0.5s ease';
    container.style.opacity = 1;
    controlContainer.style.opacity = 1;
}

function isMouseInBottom(mouseY) {
    const windowHeight = window.innerHeight;
    return mouseY > (windowHeight - 300);
}

document.addEventListener('mousemove', function(event) {

    if (isMouseInBottom(event.clientY)) {
        clearTimeout(fadeTimeout);
        fadeInElements();
        isInBottom = true;

    } else {
        if (isInBottom) {
            // If the mouse just left the bottom area, start the timer
            clearTimeout(fadeTimeout);
            fadeTimeout = setTimeout(fadeOutElements, 1500);

            // Update the flag to indicate that the mouse has left the bottom
            isInBottom = false;
        }
    }
});
document.addEventListener('mouseleave', function() {
    clearTimeout(fadeTimeout);
    fadeTimeout = setTimeout(fadeOutElements, 1500);
});

challengeButton.addEventListener('click', startChallenge);
animationCheckbox.addEventListener('change', function() {
    if (animationCheckbox.checked) {
        animate = true;
        requestAnimationFrame(animateTessellation);
    } else {
        animate = false;
    }
});

function updateCanvasSize() {
    canvas = document.getElementById('tessellationCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasdiag = Math.sqrt(canvas.height**2 + canvas.width**2)
    if (currentGroup){
        
        
        if (currentGroup == 'p1' || currentGroup == 'p2'|| currentGroup == 'pmm' || currentGroup == 'pmg'){
            tileWidth = Math.max(Math.max(canvasdiag*0.06, 80), tileWidth);
            tileHeight = Math.max(Math.max(canvasdiag*0.06, 80), tileHeight);
        }
        else if (currentGroup == 'pm'  || currentGroup == 'pg'){
            tileWidth = Math.max(Math.max(canvasdiag*0.075, 100), tileWidth);
            tileHeight = Math.max(Math.max(canvasdiag*0.06, 80), tileHeight);
        }
        else if (currentGroup == 'cm' || currentGroup == 'cmm'){
            tileWidth = Math.max(Math.max(canvasdiag*0.09, 120), tileWidth);
            tileHeight = Math.max(Math.max(canvasdiag*0.045, 60), tileHeight);
        }
        else if (currentGroup == 'pgg'){
            tileWidth = Math.max(Math.max(canvasdiag*0.09, 120), tileWidth);
            tileHeight = Math.max(Math.max(canvasdiag*0.075, 100), tileHeight);
        }
        else if (currentGroup == 'p4' || currentGroup == 'p4m' || currentGroup == 'p4g'){
            tileWidth = Math.max(Math.max(canvasdiag*0.09, 120), tileWidth);
            tileHeight = tileWidth
        }
        else if (currentGroup == 'p3'){
            tileHeight = Math.max(Math.max(canvasdiag*0.038, 50), tileHeight);
            tileWidth = Math.sqrt(3)/2*tileHeight
            tileOverhang = tileWidth/2
        }
        else if ( currentGroup == 'p31m' || currentGroup == 'p3m1' || currentGroup == 'p6' || currentGroup == 'p6m'){
            tileHeight = Math.max(Math.max(canvasdiag*0.06, 80), tileHeight);
            tileWidth = Math.sqrt(3)/2*tileHeight
            tileOverhang = tileWidth/2
        }

    }
}

window.addEventListener('resize', updateCanvasSize);

document.addEventListener('DOMContentLoaded', () => {
    updateCanvasSize();
    currentGroup = groups[Math.floor(Math.random() * groups.length)];
    challengeInfoBox.classList.add('hidden');
    setupAttributes();
});


document.querySelectorAll('.symmetry-button').forEach(button => {
    button.addEventListener('click', () => handleSymmetryButtons(button.getAttribute('data-group')));
});

let tileWidth = 0;
let tileHeight = 0;
let tileOverhang = 0;

function setupAttributes() {
    const randomImage = images[Math.floor(Math.random() * images.length)];
    if (guessingMode){
        currentGroup = groups[Math.floor(Math.random() * groups.length)];
    }
    image = new Image();

    if (currentGroup == 'p1' || currentGroup == 'p2'){
        tileWidth = Math.max(canvasdiag*0.06, 80) + Math.random() *  80;
        tileHeight = tileWidth
        tileOverhang = 0;
        if (Math.random() < 0.7){
            tileHeight = Math.max(canvasdiag*0.06, 80) + Math.random()* 80;
            if (Math.random() < 0.7){
                tileOverhang = Math.random() * (tileWidth/2);
            }
        }
    }
    else if (currentGroup == 'pm' || currentGroup == 'pg'){
        tileWidth = Math.max(canvasdiag*0.075, 100) + Math.random() *  100;
        tileHeight = Math.max(canvasdiag*0.06, 80) + Math.random() *  80;
    }
    else if (currentGroup == 'pmg'|| currentGroup == 'pmm'){
        tileWidth = Math.max(canvasdiag*0.06, 80) + Math.random() *  80;
        tileHeight = Math.max(canvasdiag*0.06, 80) + Math.random() *  100;
    }
    else if (currentGroup == 'cm' || currentGroup == 'cmm'){
        tileWidth = Math.max(canvasdiag*0.09, 120) + Math.random() * 100;
        tileHeight = Math.max(canvasdiag*0.045, 60) + Math.random()* 50;
    }
    else if (currentGroup == 'pgg'){
        tileWidth = Math.max(canvasdiag*0.09, 120) + Math.random() *  100;
        tileHeight = Math.max(canvasdiag*0.075, 100) + Math.random()* 130;
    }
    else if (currentGroup == 'p4' || currentGroup == 'p4m' || currentGroup == 'p4g'){
        tileWidth = Math.max(canvasdiag*0.09, 120) + Math.random() * 80;
        tileHeight = tileWidth
    }
    else if (currentGroup == 'p3'){
        tileHeight = Math.max(canvasdiag*0.038, 50) + Math.random() *  50;
        tileWidth = Math.sqrt(3)/2*tileHeight
        colwidth = tileWidth*2
        rowheight = tileHeight *1.5
        tilesizemulti = 1.5
    }
    else if ( currentGroup == 'p31m' || currentGroup == 'p3m1' || currentGroup == 'p6' || currentGroup == 'p6m'){
        tileHeight = Math.max(canvasdiag*0.06, 80) + Math.random() * 50;
        tileWidth = Math.sqrt(3)/2*tileHeight
        colwidth = tileWidth*2
        rowheight = tileHeight *1.5
        tilesizemulti = 1.5
    }
    image.onload = function () {

        gridRotationAngle = Math.random() * 2 * Math.PI;
        vrot = 0;
        while (Math.abs(vrot) < 0.0007){
            vrot = Math.random()*0.005 - 0.0025
        }
        
        x =  Math.floor(Math.random() * (image.width*0.75));
        y =  Math.floor( Math.random() * (image.height*0.75));

        vx = 0; 
        vy = 0; 
        while (Math.sqrt(vx**2 + vy**2) < 0.05){
            vx = Math.random()*0.8 - 0.4
            vy = Math.random()*0.8 - 0.4
        }
            requestAnimationFrame(animateTessellation);
    };
    image.src = imageFolder + randomImage;
}

let lastFrameTime = 0;
const fps = 100;
const frameDuration = 1000 / fps;

function animateTessellation(timestamp) {
    const timeElapsed = timestamp - lastFrameTime;
    if (timeElapsed >= frameDuration) {

        lastFrameTime = timestamp;
        x += vx;
        y += vy;
        gridRotationAngle += vrot;

        tessellate(image, tileWidth, tileHeight, tileOverhang);
    }
    if (animate){
        requestAnimationFrame(animateTessellation);
    }   
}

function calculateTileGrid(boundingBoxWidth, boundingBoxHeight, tileWidth, tileHeight) {
    const columns = Math.ceil(boundingBoxWidth / tileWidth); // Extra to ensure complete coverage
    const rows = Math.ceil(boundingBoxHeight / tileHeight);   // Extra to ensure complete coverage
    return { columns, rows };
}

function tessellate(image, width, height, overhang) {
    const canvas = document.getElementById('tessellationCanvas');
    const ctx = canvas.getContext('2d');
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    //ctx.clearRect(0,0,canvasWidth,canvasHeight);
    let heightmult = 1
    let rowheight = height
    let colwidth = width

    if (currentGroup == 'p3' || currentGroup == 'p31m' || currentGroup == 'p3m1' || currentGroup == 'p6' || currentGroup == 'p6m'){
        rowheight = height*1.5
        colwidth = width*2
        heightmult = 1.5
    }
    
    if (x > image.width - (width+overhang) || x < 0){
        vx *= -1;
        x += vx*2
    }
    if (y > image.height - height*heightmult|| y < 0){
        vy *= -1;
        y += vy*2
    }
    
    const { columns, rows } = calculateTileGrid(canvasdiag, canvasdiag, colwidth, rowheight);
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.rotate(gridRotationAngle);
    ctx.translate(-canvasWidth / 2, -canvasHeight / 2);

    ct = 0;
    let row = 0;
    
    for (let j = canvasHeight/2-rowheight*rows/2; j < canvasHeight/2+rowheight*(rows+1)/2; j += rowheight) {
        for (let i = canvasWidth/2-colwidth*(columns+1)/2; i < canvasWidth/2+colwidth*columns/2; i += colwidth) {

            drawTile(image,ctx,i,j,width,height,overhang,row,x,y)
        }
        ++row;
    }
    //console.log('drew ', ct, columns, rows )
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

let ct = 0

function drawTile(image,ctx,i,j,width, height, overhang, row,x,y){
    if (currentGroup == 'p1'){
        let offset = overhang*row % width;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i - tol - overhang, j - tol);
        ctx.lineTo(offset + i  + width + tol - overhang, j - tol);
        ctx.lineTo(offset + i  + width + tol, j + height + tol);
        ctx.lineTo(offset + i  - tol, j + height + tol);
        ctx.closePath();
        ctx.clip();
        drawImageWrapAround(ctx,
            image,
            x, y,
            width + overhang + tol*2, height + tol*2,
            offset + i-tol - overhang, j-tol,
            width + overhang + tol*2, height + tol*2
        );
        ctx.restore();
    }
    else if (currentGroup == 'p2'){
        
        let offset = overhang*row % width;
                
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i - tol - overhang, j - tol*2);
        ctx.lineTo(offset + i  + width + tol - overhang, j - tol*2);
        ctx.lineTo(offset + i  + width + tol - overhang/2, j + height/2 + tol*2);
        ctx.lineTo(offset + i  - tol - overhang/2, j + height/2 + tol*2);
        ctx.closePath();
        ctx.clip();
        drawImageWrapAround(ctx,
            image,
            x, y,
            width + overhang + tol*2, height + tol*2,
            offset + i-tol - overhang, j-tol,
            width + overhang + tol*2, height + tol*2
        );
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i  - tol - overhang/2, j + height/2 + tol);
        ctx.lineTo(offset + i  + width + tol - overhang/2, j + height/2 + tol);
        ctx.lineTo(offset + i  + width + tol, j + height + tol);
        ctx.lineTo(offset + i  - tol, j + height + tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i  - overhang/2, j + height/2 )
        ctx.rotate(Math.PI);
        drawImageWrapAround(ctx,
            image,
            x, y,
            width + overhang + tol*2, height/2 + tol*2,
            -overhang/2 - width - tol , -height/2-tol,
            width + overhang + tol*2, height/2 + tol*2
        );
        ctx.restore();
    }
    else if (currentGroup == 'pm'){
        drawImageWrapAround(ctx,
            image,
            x, y,
            width / 2, height,
            i- tol, j,
            width / 2 + tol, height + tol
        );

        ctx.save();
        ctx.translate(i + width / 2, j + height / 2);
        ctx.scale(-1, 1);
        drawImageWrapAround(ctx,
            image,
            x, y,
            width / 2, height, 
             width / 2, -height / 2,
            width / 2 + tol, height + tol
        );
        ctx.restore();
    }
    else if (currentGroup == 'pg'){
        drawImageWrapAround(ctx,
            image,
            x, y,
            width / 2, height,
            i, j,
            width / 2 + tol, height + tol
        );

        ctx.save();
        ctx.translate(i + width / 2, j);
        ctx.scale(1, -1);
        drawImageWrapAround(ctx,
            image,
            x, y, 
            width / 2, height, 
            0, -height,
            width / 2 + tol, height + tol
        );
        ctx.restore();
    }
    else if (currentGroup == 'cm'){
        let offset = (row % 2)* width/2
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i - tol*2, j - tol);
        ctx.lineTo(offset + i  + width + tol * 2, j - tol);
        ctx.lineTo(offset + i  + width/2, j + height + tol);
        ctx.closePath();
        ctx.clip();
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height + tol*2,
            offset + i-tol, j-tol,
            width  + tol*2, height + tol*2
        );
        ctx.restore();
        
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i - tol*2, j + tol);
        ctx.lineTo(offset + i  + width/2, j - height - tol);
        ctx.lineTo(offset + i  + width + tol * 2, j + tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i, j - height )
        ctx.scale(1,-1);
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height + tol*2,
            0-tol, -height-tol,
            width  + tol*2, height + tol*2
        );
        ctx.restore();
        ++row;
    }
    else if (currentGroup == 'cmm'){
        let offset = (row % 2)* width/2

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i - tol, j - tol);
        ctx.lineTo(offset + i  + width/2 + tol, j - tol);
        ctx.lineTo(offset + i  + width/2 + tol, j + height + tol*2);
        ctx.closePath();
        ctx.clip();
        drawImageWrapAround(ctx,
            image,
            x, y,
            width/2  + tol*2, height + tol*2,
            offset + i-tol, j-tol,
            width/2  + tol*2, height + tol*2
        );
        ctx.restore();
        
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i  + width/2 - tol, j - tol);
        ctx.lineTo(offset + i  + width + tol, j - tol);
        ctx.lineTo(offset + i  + width/2 + tol, j + height + tol*2);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i, j)
        ctx.scale(-1,1);
        drawImageWrapAround(ctx,
            image,
            x, y,
            width/2  + tol*2, height + tol*2,
            -width-tol, 0-tol,
            width/2  + tol*2, height + tol*2
        );
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i - tol, j + tol);
        ctx.lineTo(offset + i  + width/2 + tol, j - height - tol*2);
        ctx.lineTo(offset + i  + width/2 + tol, j + tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i, j - height )
        ctx.scale(1,-1);
        drawImageWrapAround(ctx,
            image,
            x, y,
            width/2  + tol*2, height + tol*2,
            0-tol, -height-tol,
            width/2  + tol*2, height + tol*2
        );
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i  + width/2 - tol, j - height - tol*2);
        ctx.lineTo(offset + i  + width + tol, j + tol);
        ctx.lineTo(offset + i  + width/2 - tol, j + tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i, j - height )
        ctx.scale(-1,-1);
        drawImageWrapAround(ctx,
            image,
            x, y,
            width/2  + tol*2, height + tol*2,
            -width-tol, -height-tol,
            width/2 + tol*2, height + tol*2
        );
        ctx.restore();
    }
    else if (currentGroup == 'pmm'){
        drawImageWrapAround(ctx,
            image,
            x, y,
            width / 2+ tol, height / 2+ tol,
            i-tol, j-tol,
            width / 2+ tol*2, height / 2+ tol*2
        );

        ctx.save();
        ctx.translate(i + width / 2, j);
        ctx.scale(-1, 1);
        drawImageWrapAround(ctx,
            image,
            x, y,
            width / 2+ tol, height / 2+ tol, 
             width / 2-tol, 0-tol,
            width / 2+ tol*2, height / 2+ tol*2
        );
        ctx.restore();

        ctx.save();
        ctx.translate(i, j + height / 2);
        ctx.scale(1, -1);
        drawImageWrapAround(ctx,
            image,
            x, y,
            width / 2+ tol, height / 2+ tol,
            0-tol, -height / 2-tol, 
            width / 2+ tol*2, height / 2+ tol*2
        );
        ctx.restore();

        ctx.save();
        ctx.translate(i + width / 2, j + height / 2);
        ctx.scale(-1, -1);
        drawImageWrapAround(ctx,
            image,
            x, y,
            width / 2+ tol, height / 2+ tol,
             width / 2-tol, -height / 2-tol,
            width / 2+ tol*2, height / 2+ tol*2
        );
        ctx.restore();
    }
    else if (currentGroup == 'pmg'){
        
        ctx.save();
        ctx.beginPath();
        ctx.moveTo( i - tol, j - tol);
        ctx.lineTo( i  + width/2 + tol*2 , j - tol);
        ctx.lineTo( i  + width/2 + tol*2, j + height/2 + tol);
        ctx.lineTo( i - tol, j + height/2 + tol);
        ctx.closePath();
        ctx.clip();
        drawImageWrapAround(ctx,
            image,
            x, y,
            width / 2+ tol*2, height / 2+ tol,
            i-tol, j-tol,
            width / 2+ tol*2, height / 2+ tol
        );
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo( i + width + tol, j - tol);
        ctx.lineTo( i  + width/2 - tol , j - tol);
        ctx.lineTo( i  + width/2 - tol, j + height/2 + tol);
        ctx.lineTo( i + width + tol, j + height/2 + tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(i + width, j);
        ctx.scale(-1, 1); 
        drawImageWrapAround(ctx,
            image,
            x, y,
            width / 2+ tol, height / 2+ tol,
            -tol, -tol,
            width / 2+ tol, height / 2+ tol
        );
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo( i - tol, j + height + tol);
        ctx.lineTo( i  + width/2 + tol*2 , j + height + tol);
        ctx.lineTo( i  + width/2 + tol*2, j + height/2 - tol);
        ctx.lineTo( i - tol, j + height/2 - tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(i + width / 2, j + height);
        ctx.rotate(Math.PI);
        drawImageWrapAround(ctx,
            image,
            x, y,
            width / 2+ tol*2, height / 2+ tol,
            -tol, -tol,
            width / 2+ tol*2, height / 2+ tol
        );
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo( i + width+ tol, j + height + tol);
        ctx.lineTo( i  + width/2 - tol , j + height + tol);
        ctx.lineTo( i  + width/2 - tol, j + height/2 - tol);
        ctx.lineTo( i + width+ tol, j + height/2 - tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(i + width / 2, j + height);
        ctx.scale(1, -1);
        drawImageWrapAround(ctx,
            image,
            x, y,
            width / 2+ tol, height / 2+ tol, 
            -tol, -tol,
            width / 2+ tol, height / 2+ tol
        );
        ctx.restore();
    }
    else if (currentGroup == 'pgg'){
        ctx.save();
        ctx.beginPath();
        ctx.moveTo( i - tol, j - tol);
        ctx.lineTo( i  + width + tol , j - tol);
        ctx.lineTo( i  + width/2, j + height/2 + tol);
        ctx.closePath();
        ctx.clip();
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height/2 + tol*2,
                i-tol, j-tol,
            width  + tol*2, height/2 + tol*2
        );
        ctx.restore();
        
        ctx.save();
        ctx.beginPath();
        ctx.moveTo( i - tol, j + tol);
        ctx.lineTo( i  + width/2, j - height/2 - tol);
        ctx.lineTo( i  + width + tol, j + tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate( i+ width, j )
        ctx.rotate(Math.PI)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height/2 + tol*2,
            0-tol, 0-tol,
            width  + tol*2, height/2 + tol*2
        );
        ctx.restore();
        
        ctx.save();
        ctx.beginPath();
        ctx.moveTo( i + width/2 - tol, j - height/2 - tol);
        ctx.lineTo( i + width/2  + width + tol , j - height/2- tol);
        ctx.lineTo( i  + width , j + tol);
        ctx.clip();
        ctx.translate( i+ width/2+ width, j-height/2 )
        ctx.scale(-1,1)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height/2 + tol*2,
                0-tol, 0-tol,
            width  + tol*2, height/2 + tol*2
        );
        ctx.restore();
        ctx.save();
        ctx.beginPath();
        ctx.moveTo( i + width, j - tol);
        ctx.lineTo( i + width/2  + width + tol , j + height/2 + tol);
        ctx.lineTo( i  + width/2 - tol , j + height/2 + tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate( i+ width/2, j+height/2 )
        ctx.scale(1,-1)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height/2 + tol*2,
                0-tol, 0-tol,
            width  + tol*2, height/2 + tol*2
        );
        ctx.restore();
    }
    else if (currentGroup == 'p4'){
        drawImageWrapAround(ctx,
            image,
            x, y,
            width / 2+tol, width / 2+tol,
            i-tol, j-tol,
            width / 2+tol*2, width / 2+tol*2
        );

        ctx.save();
        ctx.translate(i + width / 2, j);
        ctx.rotate(90 * Math.PI / 180);
        drawImageWrapAround(ctx,
            image,
            x, y,
            width / 2+tol, width / 2+tol,
            0-tol, -width / 2-tol,
            width / 2+tol*2, width / 2+tol*2
        );
        ctx.restore();

        ctx.save();
        ctx.translate(i + width / 2, j + width / 2);
        ctx.rotate(180 * Math.PI / 180);
        drawImageWrapAround(ctx,
            image,
            x, y,
            width / 2+tol, width / 2+tol,
            -width / 2-tol, -width / 2-tol,
            width / 2+tol*2, width / 2+tol*2
        );
        ctx.restore();

        ctx.save();
        ctx.translate(i, j + width / 2);
        ctx.rotate(270 * Math.PI / 180);
        drawImageWrapAround(ctx,
            image,
            x, y,
            width / 2+tol, width / 2+tol,
            -width / 2-tol, 0-tol,
            width / 2+tol*2, width / 2+tol*2
        );
        ctx.restore();
    }
    else if (currentGroup == 'p4m'){
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(i-tol, j-tol);
        ctx.lineTo(i + width/2+ tol, j + width/2+ tol);
        ctx.lineTo(i-tol, j + width/2+ tol);
        ctx.closePath();
        ctx.clip();
        drawImageWrapAround(ctx,
            image,
            x, y,
            width/2+tol*2, width/2+tol*2,
            i-tol, j-tol,
            width/2+tol*2, width/2+tol*2
        );
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(i - tol*2, j- tol);
        ctx.lineTo(i + width/2+ tol, j)- tol;
        ctx.lineTo(i + width/2+ tol, j + width/2+ tol*2); 
        ctx.closePath();
        ctx.clip();
        ctx.translate(i + width/2, j + width/2);
        ctx.scale(-1, 1);
        ctx.rotate(Math.PI / 2);
        drawImageWrapAround(ctx,
            image,
            x, y, 
            width/2+tol*2, width/2+tol*2,
            -width/2-tol, -width/2-tol,
            width/2+tol*2, width/2+tol*2
        );
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(i + width/2 - tol, j -tol);
        ctx.lineTo(i + width +tol, j-tol);
        ctx.lineTo(i + width/2- tol, j + width/2+tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(i + width, j + width/2);
        ctx.rotate(Math.PI / 2);
        drawImageWrapAround(ctx,
            image,
            x, y,
            width/2+tol*2, width/2+tol*2, 
            -width/2-tol, 0-tol,
            width/2+tol*2, width/2+tol*2
        );
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(i + width + tol, j -tol*2);
        ctx.lineTo(i + width+ tol, j+ width/2+ tol); 
        ctx.lineTo(i + width/2- tol*2, j + width/2+ tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(i + width, j + width/2);
        ctx.scale(1, -1);
        ctx.rotate(Math.PI);
        drawImageWrapAround(ctx,
            image,
            x, y, 
            width/2+tol*2, width/2+tol*2, 
            0-tol, -width/2-tol,
            width/2+tol*2, width/2 +tol*2
        );
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(i+ width/2 - tol, j + width/2- tol); 
        ctx.lineTo(i + width+ tol, j + width/2- tol);
        ctx.lineTo(i+ width+ tol, j + width+ tol); 
        ctx.closePath();
        ctx.clip();
        ctx.translate(i + width, j + width);
        ctx.rotate(Math.PI); 
        drawImageWrapAround(ctx,
            image,
            x, y,          
            width/2+tol*2, width/2+tol*2,
            0-tol, 0-tol,
            width/2+tol*2, width/2+tol*2
        );
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(i+ width/2 - tol, j + width/2- tol*2);
        ctx.lineTo(i + width+ tol*2, j + width+ tol);
        ctx.lineTo(i+ width/2- tol, j + width+ tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(i + width/2, j + width);
        ctx.scale(1, -1);
        ctx.rotate(Math.PI / 2);
        drawImageWrapAround(ctx,
            image,
            x, y,
            width/2+tol*2, width/2+tol*2,
            0-tol, -width/2-tol,
            width/2+tol*2, width/2+tol*2
        );
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(i+ width/2 + tol, j + width/2 -tol);
        ctx.lineTo(i + width/2+ tol, j + width+ tol);
        ctx.lineTo(i - tol, j + width+ tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(i + width/2, j + width/2);
        ctx.rotate(-Math.PI / 2);
        drawImageWrapAround(ctx,
            image,
            x, y,
            width/2+tol*2, width/2+tol*2,
            -width/2-tol, -width/2-tol,
            width/2+tol*2, width/2+tol*2
        );
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(i-tol, j + width/2-tol);
        ctx.lineTo(i+tol*2 + width/2, j + width/2-tol);
        ctx.lineTo(i-tol, j + width+tol*2);
        ctx.closePath();
        ctx.clip();
        ctx.translate(i + width/2, j + width/2);
        ctx.scale(1, -1);
        drawImageWrapAround(ctx,
            image,
            x, y,
            width/2+tol*2, width/2+tol*2,
            -width/2-tol, -width/2-tol,
            width/2+tol*2, width/2+tol*2
        );
        ctx.restore();
    }
    else if (currentGroup == 'p4g'){
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(i-tol, j-tol);
        ctx.lineTo(i + width/2+ tol, j - tol);
        ctx.lineTo(i-tol, j + width/2+ tol);
        ctx.closePath();
        ctx.clip();
        drawImageWrapAround(ctx,
            image,
            x, y,
            width/2+tol*2, width/2+tol*2,
            i-tol, j-tol,
            width/2+tol*2, width/2+tol*2
        );
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(i + width/2 + tol, j- tol*2);
        ctx.lineTo(i + width/2+ tol, j + width/2+ tol);
        ctx.lineTo(i - tol*2, j + width/2+ tol); 
        ctx.closePath();
        ctx.clip();
        ctx.translate(i, j);
        ctx.scale(-1, 1);
        ctx.rotate(-Math.PI / 2);
        drawImageWrapAround(ctx,
            image,
            x, y, 
            width/2+tol*2, width/2+tol*2,
            -width/2-tol, -width/2-tol,
            width/2+tol*2, width/2+tol*2
        );
        ctx.restore();
        
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(i + width/2 - tol, j - tol);
        ctx.lineTo(i + width + tol, j - tol);
        ctx.lineTo(i + width + tol, j + width/2 + tol); 
        ctx.closePath();
        ctx.clip();
        ctx.translate(i+ width, j);
        ctx.rotate(Math.PI / 2);
        drawImageWrapAround(ctx,
            image,
            x, y, 
            width/2+tol*2, width/2+tol*2,
            0-tol, 0-tol,
            width/2+tol*2, width/2+tol*2
        );
        ctx.restore();
        
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(i + width/2 - tol, j - tol*2);
        ctx.lineTo(i + width + tol*2, j + width/2 + tol);
        ctx.lineTo(i + width/2 - tol, j + width/2+ tol); 
        ctx.closePath();
        ctx.clip();
        ctx.translate(i+ width, j);
        ctx.scale(1, -1);
        drawImageWrapAround(ctx,
            image,
            x, y, 
            width/2+tol*2, width/2+tol*2,
            -width/2-tol, -width/2-tol,
            width/2+tol*2, width/2+tol*2
        );
        ctx.restore();
        
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(i + width + tol, j + width/2 - tol);
        ctx.lineTo(i + width + tol, j + width + tol);
        ctx.lineTo(i + width/2 - tol, j + width + tol); 
        ctx.closePath();
        ctx.clip();
        ctx.translate(i + width, j + width);
        ctx.rotate(Math.PI);
        drawImageWrapAround(ctx,
            image,
            x, y, 
            width/2+tol*2, width/2+tol*2,
            0-tol, 0-tol,
            width/2+tol*2, width/2+tol*2
        );
        ctx.restore();
        
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(i + width/2 - tol, j + width/2 - tol);
        ctx.lineTo(i + width + tol*2, j + width/2 - tol);
        ctx.lineTo(i + width/2 - tol, j + width + tol*2); 
        ctx.closePath();
        ctx.clip();
        ctx.translate(i + width, j + width);
        ctx.rotate(-Math.PI/2);
        ctx.scale(-1, 1);
        drawImageWrapAround(ctx,
            image,
            x, y, 
            width/2+tol*2, width/2+tol*2,
            -width/2-tol, -width/2-tol,
            width/2+tol*2, width/2+tol*2
        );
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(i - tol, j + width/2 - tol);
        ctx.lineTo(i + width/2 + tol, j + width + tol);
        ctx.lineTo(i - tol, j + width + tol); 
        ctx.closePath();
        ctx.clip();
        ctx.translate(i, j + width);
        ctx.rotate(-Math.PI/2);
        drawImageWrapAround(ctx,
            image,
            x, y, 
            width/2+tol*2, width/2+tol*2,
            0-tol, 0-tol,
            width/2+tol*2, width/2+tol*2
        );
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(i - tol*2, j + width/2 - tol);
        ctx.lineTo(i + width/2 + tol, j + width/2 - tol);
        ctx.lineTo(i + width/2 + tol, j + width + tol*2); 
        ctx.closePath();
        ctx.clip();
        ctx.translate(i, j + width);
        ctx.scale(-1, 1);
        drawImageWrapAround(ctx,
            image,
            x, y, 
            width/2+tol*2, width/2+tol*2,
            -width/2-tol, -width/2-tol,
            width/2+tol*2, width/2+tol*2
        );
        ctx.restore();
    }
    else if (currentGroup == 'p3'){
        let offset = (row % 2)*width

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i - tol, j - tol);
        ctx.lineTo(offset + i + width  + tol , j + height*0.5 - tol);
        ctx.lineTo(offset + i + width  + tol , j + height*1.5 + tol);
        ctx.lineTo(offset + i - tol , j + height + tol);
        ctx.closePath();
        ctx.clip();
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height*1.5 + tol*2,
            offset + i-tol, j-tol,
            width  + tol*2, height*1.5 + tol*2
        );
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i - tol, j);
        ctx.lineTo(offset + i + width, j - height*0.5 - tol);
        ctx.lineTo(offset + i + width*2 + tol, j);
        ctx.lineTo(offset + i + width, j + height*0.5 + tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i +width*2, j)
        ctx.rotate(Math.PI/3*2)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height*1.5 + tol*2,
            0-tol, 0-tol,
            width  + tol*2, height*1.5 + tol*2
        );
        ctx.restore();
        
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i + width  - tol , j + height*0.5 - tol);
        ctx.lineTo(offset + i + width*2 + tol, j - tol);
        ctx.lineTo(offset + i + width*2 + tol, j + height + tol);
        ctx.lineTo(offset + i + width  - tol , j + height*1.5 + tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i + width , j + height*1.5)
        ctx.rotate(-Math.PI/3*2)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height*1.5 + tol*2,
            0-tol, 0-tol,
            width  + tol*2, height*1.5 + tol*2
        );
        ctx.restore();
    }
    else if (currentGroup == 'p31m'){
        let offset = (row % 2)*width
                
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i - tol, j - tol);
        ctx.lineTo(offset + i + width  + tol , j + height*0.5 - tol);
        ctx.lineTo(offset + i + width , j + height*1.5 + tol*2);
        ctx.closePath();
        ctx.clip();
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height*1.5+ tol*2,
            offset + i-tol, j-tol,
                width  + tol*2, height*1.5 + tol*2
        );
        ctx.restore();

        
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i + width  + tol , j + height*1.5 + tol);
        ctx.lineTo(offset + i - tol , j + height + tol);
        ctx.lineTo(offset + i , j - tol*2);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i, j)
        ctx.rotate(-Math.PI/3)
        ctx.scale(-1,1)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height*1.5 + tol*2,
            -tol, -tol,
                width  + tol*2, height*1.5 + tol*2
        );
        ctx.restore();
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i - tol, j - tol);
        ctx.lineTo(offset + i + width*2 + tol, j -tol);
        ctx.lineTo(offset + i + width, j + height*0.5 + tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i + width*2 , j )
        ctx.rotate(Math.PI/3*2)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height*1.5 + tol*2,
            -tol, -tol,
                width  + tol*2, height*1.5 + tol*2
        );
        ctx.restore();
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i - tol, j + tol);
        ctx.lineTo(offset + i + width, j - height*0.5 - tol);
        ctx.lineTo(offset + i + width*2 + tol, j +tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i +width*2, j)
        ctx.rotate(-Math.PI/3*2)
        ctx.scale(1,-1)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height*1.5 + tol*2,
            -tol, -tol,
                width  + tol*2, height*1.5 + tol*2
        );
        ctx.restore();
        
        
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i + width  - tol , j + height*0.5 -tol);
        ctx.lineTo(offset + i + width*2 + tol, j - tol);
        ctx.lineTo(offset + i + width  , j + height*1.5 + tol*2);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i + width, j + height*1.5)
        ctx.rotate(-Math.PI/3*2)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height*1.5 + tol*2,
            -tol, -tol,
                width  + tol*2, height*1.5 + tol*2
        );
        ctx.restore();
        
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i + width*2+tol, j + height+tol);
        ctx.lineTo(offset + i + width*2, j - tol*2);
        ctx.lineTo(offset + i + width - tol, j + height*1.5 + tol*2);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i + width , j + height*1.5)
        ctx.rotate(Math.PI)
        ctx.scale(-1,1)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height*1.5 + tol*2,
            -tol, -tol,
                width  + tol*2, height*1.5 + tol*2
        );
        ctx.restore();
    }
    else if (currentGroup == 'p3m1'){
                
        let offset = (row % 2)*width

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i - tol, j - tol);
        ctx.lineTo(offset + i + width  + tol , j + height*0.5);
        ctx.lineTo(offset + i - tol , j + height + tol);
        ctx.closePath();
        ctx.clip();
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height+ tol*2,
            offset + i-tol, j-tol,
            width  + tol*2, height + tol*2
        );
        ctx.restore();
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i + width  + tol , j + height*1.5 + tol);
        ctx.lineTo(offset + i - tol , j + height);
        ctx.lineTo(offset + i + width  + tol , j + height*0.5 -tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i + width, j + height*1.5)
        ctx.rotate(-Math.PI/3)
        ctx.scale(1,-1)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height + tol*2,
            -tol, -tol,
            width  + tol*2, height + tol*2
        );
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i - tol, j);
        ctx.lineTo(offset + i + width + tol, j - height*0.5 - tol);
        ctx.lineTo(offset + i + width + tol, j + height*0.5 + tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i, j)
        ctx.rotate(Math.PI/3)
        ctx.scale(1,-1)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height + tol*2,
            -tol, -tol,
            width  + tol*2, height + tol*2
        );
        ctx.restore();
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i + width- tol, j - height*0.5 - tol);
        ctx.lineTo(offset + i + width*2 + tol, j);
        ctx.lineTo(offset + i + width- tol, j + height*0.5 + tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i +width*2, j)
        ctx.rotate(Math.PI/3*2)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height + tol*2,
            -tol, -tol,
            width  + tol*2, height + tol*2
        );
        ctx.restore();
        
        
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i + width  - tol , j + height*0.5);
        ctx.lineTo(offset + i + width*2 + tol, j - tol);
        ctx.lineTo(offset + i + width*2 + tol, j + height + tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i + width*2, j)
        ctx.scale(-1,1)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height + tol*2,
            -tol, -tol,
            width  + tol*2, height + tol*2
        );
        ctx.restore();
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i + width -tol, j + height*0.5-tol);
        ctx.lineTo(offset + i + width*2+tol, j + height);
        ctx.lineTo(offset + i + width  - tol , j + height*1.5 + tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i + width , j + height*1.5)
        ctx.rotate(-Math.PI/3*2)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height + tol*2,
            -tol, -tol,
            width  + tol*2, height + tol*2
        );
        ctx.restore();
    }
    else if (currentGroup == 'p6'){
        let offset = (row % 2)*width

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i - tol, j - tol);
        ctx.lineTo(offset + i + width  + tol , j + height*0.5 - tol);
        ctx.lineTo(offset + i + width , j + height*1.5 + tol*2);
        ctx.closePath();
        ctx.clip();
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height*1.5+ tol*2,
            offset + i-tol, j-tol,
            width  + tol*2, height*1.5 + tol*2
        );
        ctx.restore();
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i + width  + tol , j + height*1.5 + tol);
        ctx.lineTo(offset + i - tol , j + height + tol);
        ctx.lineTo(offset + i , j - tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i + width , j + height*1.5)
        ctx.rotate(Math.PI)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height*1.5 + tol*2,
            -tol, -tol,
            width  + tol*2, height*1.5 + tol*2
        );
        ctx.restore();
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i - tol, j - tol);
        ctx.lineTo(offset + i + width*2 + tol, j -tol);
        ctx.lineTo(offset + i + width, j + height*0.5 + tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i + width*2 , j )
        ctx.rotate(Math.PI/3*2)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height*1.5 + tol*2,
            -tol, -tol,
            width  + tol*2, height*1.5 + tol*2
        );
        ctx.restore();
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i - tol, j );
        ctx.lineTo(offset + i + width, j - height*0.5 - tol);
        ctx.lineTo(offset + i + width*2 + tol, j );
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i, j)
        ctx.rotate(-Math.PI/3)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height*1.5 + tol*2,
            -tol, -tol,
            width  + tol*2, height*1.5 + tol*2
        );
        ctx.restore();
        
        
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i + width  - tol , j + height*0.5 -tol);
        ctx.lineTo(offset + i + width*2 + tol, j - tol);
        ctx.lineTo(offset + i + width  , j + height*1.5 + tol*2);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i + width, j + height*1.5)
        ctx.rotate(-Math.PI/3*2)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height*1.5 + tol*2,
            -tol, -tol,
            width  + tol*2, height*1.5 + tol*2
        );
        ctx.restore();
        
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i + width*2+tol, j + height+tol);
        ctx.lineTo(offset + i + width*2, j - tol*2);
        ctx.lineTo(offset + i + width - tol, j + height*1.5 + tol*2);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i + width*2 , j)
        ctx.rotate(Math.PI/3)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height*1.5 + tol*2,
            -tol, -tol,
            width  + tol*2, height*1.5 + tol*2
        );
        ctx.restore();
    }
    else if (currentGroup == 'p6m'){
        let offset = (row % 2)*width

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i - tol, j - tol);
        ctx.lineTo(offset + i + width  + tol , j + height*0.5);
        ctx.lineTo(offset + i + width/2 , j + height*0.75 + tol);
        ctx.closePath();
        ctx.clip();
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height*0.75+ tol*2,
            offset + i-tol, j-tol,
            width  + tol*2, height*0.75 + tol*2
        );
        ctx.restore();
        
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i - tol, j - tol*2);
        ctx.lineTo(offset + i + width/2 + tol, j + height*0.75);
        ctx.lineTo(offset + i -tol, j + height + tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i,j)
        ctx.rotate(-Math.PI/3)
        ctx.scale(-1,1)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height*0.75+ tol*2,
            -tol, -tol,
            width  + tol*2, height*0.75 + tol*2
        );
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i + width  + tol , j + height*1.5 + tol);
        ctx.lineTo(offset + i - tol , j + height);
        ctx.lineTo(offset + i + width/2, j + height*0.75 - tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i + width, j + height*1.5)
        ctx.rotate(Math.PI)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height*0.75 + tol*2,
            -tol, -tol,
            width  + tol*2, height*0.75 + tol*2
        );
        ctx.restore();
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i + width  + tol , j + height*1.5 + tol*2);
        ctx.lineTo(offset + i + width/2 -tol, j + height*0.75);
        ctx.lineTo(offset + i +width +tol, j +height/2 - tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i + width, j + height*1.5)
        ctx.rotate(-Math.PI/3)
        ctx.scale(1,-1)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height*0.75 + tol*2,
            -tol, -tol,
            width  + tol*2, height*0.75 + tol*2
        );
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i - tol*2, j - tol);
        ctx.lineTo(offset + i + width + tol, j -tol);
        ctx.lineTo(offset + i + width+ tol, j + height*0.5 + tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i , j )
        ctx.rotate(Math.PI/3)
        ctx.scale(1,-1)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height*0.75+ tol*2,
            -tol, -tol,
            width  + tol*2, height*0.75 + tol*2
        );
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i - tol*2, j + tol);
        ctx.lineTo(offset + i + width + tol, j +tol);
        ctx.lineTo(offset + i + width+ tol, j - height*0.5 - tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i , j )
        ctx.rotate(-Math.PI/3)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height*0.75 + tol*2,
            -tol, -tol,
            width  + tol*2, height*0.75 + tol*2
        );
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i + width*2 + tol*2, j -tol);
        ctx.lineTo(offset + i + width - tol, j -tol);
        ctx.lineTo(offset + i + width- tol, j + height*0.5 + tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i +width*2, j)
        ctx.rotate(Math.PI/3*2)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height*0.75 + tol*2,
            -tol, -tol,
            width  + tol*2, height*0.75 + tol*2
        );
        ctx.restore();
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i + width*2 + tol*2, j +tol);
        ctx.lineTo(offset + i + width - tol, j +tol);
        ctx.lineTo(offset + i + width- tol, j - height*0.5 - tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i +width*2, j)
        ctx.rotate(-Math.PI/3*2)
        ctx.scale(1,-1)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height*0.75 + tol*2,
            -tol, -tol,
            width  + tol*2, height*0.75+ tol*2
        );
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i + width  - tol , j + height*0.5);
        ctx.lineTo(offset + i + width*2 + tol*2, j - tol*2);
        ctx.lineTo(offset + i + width*1.5  , j + height*0.75 + tol);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i +width*2, j)
        ctx.scale(-1,1)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height*0.75 + tol*2,
            -tol, -tol,
            width  + tol*2, height*0.75 + tol*2
        );
        ctx.restore();
        
        
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i + width*2  + tol , j + height +tol);
        ctx.lineTo(offset + i + width*2 + tol, j - tol*2);
        ctx.lineTo(offset + i + width*1.5  -tol, j + height*0.75);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i +width*2, j)
        ctx.rotate(Math.PI/3)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height*0.75 + tol*2,
            -tol, -tol,
            width  + tol*2, height*0.75 + tol*2
        );
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i + width  - tol , j + height*0.5 -tol*2);
        ctx.lineTo(offset + i + width*1.5 + tol, j+ height*0.75 - tol);
        ctx.lineTo(offset + i + width - tol, j + height*1.5 + tol*2);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i + width , j + height*1.5)
        ctx.rotate(-Math.PI/3*2)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height*0.75 + tol*2,
            -tol, -tol,
            width  + tol*2, height*0.75 + tol*2
        );
        ctx.restore();
        
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(offset + i + width*2+tol, j + height);
        ctx.lineTo(offset + i + width*1.5, j+ height*0.75 - tol);
        ctx.lineTo(offset + i + width - tol*2, j + height*1.5 + tol*2);
        ctx.closePath();
        ctx.clip();
        ctx.translate(offset + i + width , j + height*1.5)
        ctx.rotate(Math.PI)
        ctx.scale(-1,1)
        drawImageWrapAround(ctx,
            image,
            x, y,
            width  + tol*2, height*0.75 + tol*2,
            -tol, -tol,
            width  + tol*2, height*0.75 + tol*2
        );
        ctx.restore();
    }
}

function drawImageWrapAround(ctx,image,x,y,width,height,i,j,tilew,tileh){
    
    ctx.drawImage(image, x, y, width, height, i, j, tilew, tileh);
    ++ct;
    return

    // Calculate the actual coordinates in the source image based on x and y
    let sx = x;
    let sy = y;

    if (sx + width <= image.width && sy + height <= image.height){
        // No wrapping needed in x direction
        ctx.drawImage(image, sx, sy, width, height, i, j, tilew, tileh);
        ++ct;
        return
    }

    if (sx + width > image.width && sy + height > image.height) {
        // In case both x and y directions need wrapping, handle it
        let widthToEdge = image.width - sx;
        let heightToEdge = image.height - sy;

        // Draw the part that fits within the image width
        ctx.drawImage(image, sx, sy, widthToEdge, height, i, j, widthToEdge, tileh);

        // Draw the wrapped part from the left edge of the image
        let remainingWidth = width - widthToEdge;
        ctx.drawImage(image, 0, sy, remainingWidth, height, i + widthToEdge, j, remainingWidth+tol, tileh);

        // Draw the wrapped part from the top edge of the image
        let remainingHeight = height - heightToEdge;
        ctx.drawImage(image, sx, 0, width, remainingHeight, i, j + heightToEdge, tilew, remainingHeight+tol);

        // Draw top-right corner of the tile
        ctx.drawImage(image, 0, 0, width - widthToEdge, height - heightToEdge, i + widthToEdge, j + heightToEdge, tilew - widthToEdge, tileh - heightToEdge);
        ct += 4;
        return;
    }

    // Handle wrapping in the x direction
    if (sx + width > image.width) {
        // Draw the part that fits within the image width
        let widthToEdge = image.width - sx;
        ctx.drawImage(image, sx, sy, widthToEdge, height, i, j, widthToEdge, tileh);

        // Draw the wrapped part from the left edge of the image
        let remainingWidth = width - widthToEdge;
        ctx.drawImage(image, 0, sy, remainingWidth, height, i + widthToEdge, j, remainingWidth+tol, tileh);
        ct += 2;
        return;
    } 

    // Handle wrapping in the y direction
    if (sy + height > image.height) {
        // Draw the part that fits within the image height
        let heightToEdge = image.height - sy;
        ctx.drawImage(image, sx, sy, width, heightToEdge, i, j, tilew, heightToEdge);

        // Draw the wrapped part from the top edge of the image
        let remainingHeight = height - heightToEdge;
        ctx.drawImage(image, sx, 0, width, remainingHeight, i, j + heightToEdge, tilew, remainingHeight+tol);
        ct += 2;
    } 

}


const correctSound = new Audio('sound/correct.wav');
const incorrectSound = new Audio('sound/incorrect.wav');

function handleSymmetryButtons(group) {
    if (guessingMode){
        if (group === currentGroup) {
            challengeScore++;
            currentScoreElement.textContent = `${challengeScore} points`;
            correctSound.play();
        } else {
            challengeScore = Math.max(0, challengeScore-1);
            currentScoreElement.textContent = `${challengeScore} points`;
            incorrectSound.play();
        }
        setupAttributes();
        return
    }
    currentGroup = group;
    setupAttributes();
}

function hideAnnouncementBox(){
    scoreAnnouncementBox.classList.add('hidden'); 
}

let challengeScore = 0;
let countdownInterval = null; 


function startChallenge() {
    
    if (countdownInterval !== null) {
        clearInterval(countdownInterval);
    }
    guessingMode = true;

    let timeLeft = 60;
    timeLeftElement.textContent = `60 seconds left`;

    challengeScore = 0;
    currentScoreElement.textContent = `${challengeScore} points`;

    challengeInfoBox.classList.remove('hidden');
    scoreAnnouncementBox.classList.add('hidden'); 

    setupAttributes();

    countdownInterval = setInterval(() => {

        timeLeft--;
        timeLeftElement.textContent = `${timeLeft} seconds left`;

        
        if (timeLeft <= 0) {
            finalScoreText.textContent = `You scored ${challengeScore} points!`;
            scoreAnnouncementBox.classList.remove('hidden'); 
            challengeInfoBox.classList.add('hidden');
            setTimeout(hideAnnouncementBox, 5000);
            
            clearInterval(countdownInterval);
            countdownInterval = null;
            guessingMode = false;
        }

    }, 1000);
}