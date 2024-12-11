const imageUpload = document.getElementById('imageUpload');
const memeCanvas = document.getElementById('memeCanvas');
const ctx = memeCanvas.getContext('2d');
const topTextInput = document.getElementById('topText');
const bottomTextInput = document.getElementById('bottomText');
const fontSizeInput = document.getElementById('fontSize');
const fontColorInput = document.getElementById('fontColor');
const textBgColorInput = document.getElementById('textBgColor'); // New input for text background color
const stickerUpload = document.getElementById('stickerUpload');
const generateMemeButton = document.getElementById('generateMeme');
const downloadMemeButton = document.getElementById('downloadMeme');

let img = new Image(); // Main image
let stickers = []; // Array to hold stickers
let currentStickerIndex = -1; // Track the currently selected sticker for resizing and moving
let isResizing = false; // Flag to track resizing state
let isDragging = false; // Flag to track dragging state
let offsetX, offsetY; // Variables to track the mouse offset for dragging

// Upload main image
imageUpload.addEventListener('change', function() {
    const file = this.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        img.src = event.target.result; // Set the source of the image
        img.onload = function() {
            memeCanvas.width = img.width;
            memeCanvas.height = img.height;
            drawMeme(); // Draw the initial meme
        }
    }
    reader.readAsDataURL(file);
});

// Upload sticker
stickerUpload.addEventListener('change', function() {
    const file = this.files[0];
    const stickerImg = new Image();
    const reader = new FileReader();
    reader.onload = function(event) {
        stickerImg.src = event.target.result; // Set the source of the sticker
        stickerImg.onload = function() {
            stickers.push({ img: stickerImg, width: 100, height: 100, x: 50, y: 50 }); // Add sticker to the array with default size and position
            drawMeme(); // Redraw the meme
        }
    }
    reader.readAsDataURL(file);
});

// Draw the meme
function drawMeme() {
    ctx.clearRect(0, 0, memeCanvas.width, memeCanvas.height); // Clear the canvas
    ctx.drawImage(img, 0, 0); // Draw the main image

    const fontSize = fontSizeInput.value || 40; // Default to 40 if empty
    ctx.font = `${fontSize}px Impact`;
    ctx.fillStyle = fontColorInput.value || "#ffffff"; // Default to white if empty
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.textAlign = "center";

    const topText = topTextInput.value;
    const bottomText = bottomTextInput.value;
    const textBgColor = textBgColorInput.value; // Get the selected background color

    // Draw top text background
    if (topText) {
        const textWidth = ctx.measureText(topText).width; // Measure text width
        const textHeight = fontSize; // Use font size as height
        const textX = (memeCanvas.width - textWidth) / 2; // Calculate X position
        const textY = 50; // Fixed Y position for top text

        // Draw background rectangle directly behind the text
        ctx.fillStyle = textBgColor; // Set background color
        ctx.fillRect(textX - 5, textY - textHeight + 10, textWidth + 10, textHeight); // Draw background rectangle
        ctx.fillStyle = fontColorInput.value || "#ffffff"; // Reset to text color
        ctx.fillText(topText, memeCanvas.width / 2, textY); // Draw the text
        ctx.strokeText(topText, memeCanvas.width / 2, textY); // Add stroke
    }

    // Draw bottom text background
    if (bottomText) {
        const textWidth = ctx.measureText(bottomText).width; // Measure text width
        const textHeight = fontSize; // Use font size as height
        const textX = (memeCanvas.width - textWidth) / 2; // Calculate X position
        const textY = memeCanvas.height - 20; // Fixed Y position for bottom text

        // Draw background rectangle directly behind the text
        ctx.fillStyle = textBgColor; // Set background color
        ctx.fillRect(textX - 5, textY - textHeight - 10, textWidth + 10, textHeight); // Draw background rectangle
        ctx.fillStyle = fontColorInput.value || "#ffffff"; // Reset to text color
        ctx.fillText(bottomText, memeCanvas.width / 2, textY); // Draw the text
        ctx.strokeText(bottomText, memeCanvas.width / 2, textY); // Add stroke
    }

    // Draw stickers
    stickers.forEach((sticker) => {
        ctx.drawImage(sticker.img, sticker.x, sticker.y, sticker.width, sticker.height); // Draw each sticker with its dimensions
    });
}

// Start dragging sticker
memeCanvas.addEventListener('mousedown', function(event) {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    // Check if the mouse is over any sticker
    stickers.forEach((sticker, index) => {
        if (mouseX >= sticker.x && mouseX <= sticker.x + sticker.width &&
            mouseY >= sticker.y && mouseY <= sticker.y + sticker.height) {
            currentStickerIndex = index; // Set the current sticker index
            offsetX = mouseX - sticker.x; // Calculate offset for dragging
            offsetY = mouseY - sticker.y;
            isDragging = true; // Begin dragging
        }
    });

    if (currentStickerIndex !== -1) {
        isResizing = false; // Stop resizing if dragging
    }
});

// Move sticker on mouse move
memeCanvas.addEventListener('mousemove', function(event) {
    if (isDragging && currentStickerIndex !== -1) {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;

        // Update the position of the selected sticker
        stickers[currentStickerIndex].x = mouseX - offsetX;
        stickers[currentStickerIndex].y = mouseY - offsetY;
        drawMeme(); // Redraw the meme with updated sticker position
    } else if (isResizing && currentStickerIndex !== -1) {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;

        // Update the width and height of the selected sticker
        stickers[currentStickerIndex].width = mouseX - stickers[currentStickerIndex].x;
        stickers[currentStickerIndex].height = mouseY - stickers[currentStickerIndex].y;
        drawMeme(); // Redraw the meme with updated sticker size
    }
});

// Stop dragging or resizing sticker on mouse up
memeCanvas.addEventListener('mouseup', function() {
    isDragging = false; // Stop dragging
    isResizing = false; // Stop resizing
    currentStickerIndex = -1; // Reset current sticker index
});

// Generate meme
generateMemeButton.addEventListener('click', drawMeme);

// Download meme
downloadMemeButton.addEventListener('click', function() {
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = memeCanvas.toDataURL('image/png'); // Get the data URL of the canvas
    link.click(); // Trigger the download
});