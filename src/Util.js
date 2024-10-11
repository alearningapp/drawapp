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