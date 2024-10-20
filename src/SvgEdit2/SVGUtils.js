function convertSvgPathData(pathData) {
    // Improved regex to match SVG path commands and their parameters
    const commands = pathData.match(/[MmLlHhVvCcSsQqTtAaZz][^MmLlHhVvCcSsQqTtAaZz]*/g);
    const result = [];
    let currentPoint = { x: 0, y: 0 };

    if (!commands) {
        throw new Error("Invalid SVG path data.");
    }

    commands.forEach(command => {
        const type = command[0];
        const params = command.slice(1).trim().split(/[\s,]+/).map(Number);

        // Determine if the command is uppercase or lowercase
        const isLowerCase = type.toLowerCase() === type;

        // Adjust for lowercase commands (relative coordinates)
        if (isLowerCase) {
            if (type === 'm' || type === 'l') {
                currentPoint = {
                    x: currentPoint.x + params[0],
                    y: currentPoint.y + params[1]
                };
                result.push({ x: currentPoint.x, y: currentPoint.y });
            } else if (type === 'q' && params.length >= 4) {
                const cp = { x: currentPoint.x + params[0], y: currentPoint.y + params[1] };
                currentPoint = {
                    x: currentPoint.x + params[2],
                    y: currentPoint.y + params[3]
                };
                result.push({ x: currentPoint.x, y: currentPoint.y, q: cp });
            } else if (type === 'c' && params.length >= 6) {
                const controlPoints = [
                    { x: currentPoint.x + params[0], y: currentPoint.y + params[1] },
                    { x: currentPoint.x + params[2], y: currentPoint.y + params[3] }
                ];
                currentPoint = {
                    x: currentPoint.x + params[4],
                    y: currentPoint.y + params[5]
                };
                result.push({ x: currentPoint.x, y: currentPoint.y, c: controlPoints });
            } else if (type === 'a' && params.length >= 7) {
                const rx = params[0];
                const ry = params[1];
                const rot = params[2];
                const laf = params[3];
                const sf = params[4];
                currentPoint = {
                    x: currentPoint.x + params[5],
                    y: currentPoint.y + params[6]
                };
                result.push({
                    x: currentPoint.x,
                    y: currentPoint.y,
                    a: { rx, ry, rot, laf, sf }
                });
            }
        } else {
            // Uppercase commands use absolute coordinates
            if (type === 'M' || type === 'L') {
                currentPoint = { x: params[0], y: params[1] };
                result.push({ x: currentPoint.x, y: currentPoint.y });
            } else if (type === 'Q' && params.length >= 4) {
                const cp = { x: params[0], y: params[1] };
                currentPoint = { x: params[2], y: params[3] };
                result.push({ x: currentPoint.x, y: currentPoint.y, q: cp });
            } else if (type === 'C' && params.length >= 6) {
                const controlPoints = [
                    { x: params[0], y: params[1] },
                    { x: params[2], y: params[3] }
                ];
                currentPoint = { x: params[4], y: params[5] };
                result.push({ x: currentPoint.x, y: currentPoint.y, c: controlPoints });
            } else if (type === 'A' && params.length >= 7) {
                const rx = params[0];
                const ry = params[1];
                const rot = params[2];
                const laf = params[3];
                const sf = params[4];
                currentPoint = { x: params[5], y: params[6] };
                result.push({
                    x: currentPoint.x,
                    y: currentPoint.y,
                    a: { rx, ry, rot, laf, sf }
                });
            }
        }
    });

    return result;
}

export function createStrokeJSON(xmlString) {
    // Parse the XML string
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");

    // Extract the word
    const word = xmlDoc.getElementsByTagName("Word")[0].getAttribute('unicode');

    // Extract strokes
    const strokes = Array.from(xmlDoc.getElementsByTagName("Stroke")).map(stroke => {
        const outlinePoints = Array.from(stroke.getElementsByTagName("Outline")[0].children);
        const trackPoints = Array.from(stroke.getElementsByTagName("Track")[0].children);

        // Create path string from outline points
        let path = "";
        outlinePoints.forEach(point => {
            const type = point.tagName;
            const x = point.getAttribute("x");
            const y = point.getAttribute("y");
            const x1 = point.getAttribute("x1");
            const y1 = point.getAttribute("y1");
            const x2 = point.getAttribute("x2");
            const y2 = point.getAttribute("y2");

            if (type === "MoveTo") {
                path += `M${x},${y} `;
            } else if (type === "LineTo") {
                path += `L${x},${y} `;
            } else if (type === "QuadTo") {
                path += `Q${x1},${y1} ${x2},${y2} `;
            }
        });

        // Create track string from track points
        const track = trackPoints.map(point => [point.getAttribute("x"),point.getAttribute("y")]);

        return {
            d: path.trim(),
            ps: track
        };
    });

    return {
        word: word,
        stroke: strokes
    };
}
export { convertSvgPathData };


