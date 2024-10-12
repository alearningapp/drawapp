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
