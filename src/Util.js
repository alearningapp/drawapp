export const hexToRgb = (color) => {
    if (typeof color === 'string' && color !== '' && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
        const tempDiv = document.createElement('div');
        tempDiv.style.color = color;
        document.body.appendChild(tempDiv);
        const rgb = getComputedStyle(tempDiv).color;
        document.body.removeChild(tempDiv);
        const rgbArray = rgb.match(/\d+/g);
        return { r: parseInt(rgbArray[0]), g: parseInt(rgbArray[1]), b: parseInt(rgbArray[2]) };
    }

    const bigint = parseInt(color.replace('#', ''), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
};

export function getComplementaryColor(hex) {
    // Remove the hash at the start if it's there
    hex = hex.replace(/^#/, '');

    // Parse the red, green, and blue components
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Calculate the complementary color
    let compR = 255 - r;
    let compG = 255 - g;
    let compB = 255 - b;

    // Convert back to hex and pad with zero if necessary
    let compHex = '#' +
        ((1 << 24) + (compR << 16) + (compG << 8) + compB)
        .toString(16)
        .slice(1)
        .toUpperCase();

    return compHex;
}

export async function createPlayAudio(audioFile) {

    return new Promise((resolve,reject)=>{

        const audio = new Audio(audioFile);
        return  audio.play().then(() => {
             resolve();
            })
            .catch(error => {
              reject();
            });
    
    })

}

export function drawText2(canvas,ctx,text){
        
    const margin = 10; // Define the margin
    let fontSize = 10; // Start with a small font size
    ctx.font = `${fontSize}px Arial`;
    const offsetX = 40;
     let width = canvas.width-offsetX;
    // Measure the text and increase the font size until it fits within the canvas minus margin
    while (true) {
        ctx.font = `${fontSize}px Arial`;
        const textWidth = ctx.measureText(text).width;
        const textHeight = fontSize; // Approximate height as fontSize for simplicity

        // Check if the text exceeds canvas dimensions with margins
        if (textWidth > (width - margin * 2) || textHeight > (canvas.height - margin * 2)) {
            fontSize--; // Decrease font size if it overflows
            break; // Exit the loop
        }

        fontSize++; // Increase font size
    }

    // Center the text with margin
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const x = width / 2;
    const y = canvas.height / 2;

    // Set opacity
    ctx.globalAlpha = 0.5;

    // Draw the text with the margin applied
    ctx.fillText(text, x+offsetX, y);

     ctx.globalAlpha = 1.0;
}