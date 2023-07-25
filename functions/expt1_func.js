//@ts-check

/**
 * Draw multiple rectangles on the canvas one for each colour provided in the
 * 'selectedCols' array.
 * These are positioned on screen according to the genLoc function, and will 
 * keep regenerating locations until a set with no overlaps are found.
 * The size of the area checked for overlaps can include a border around the
 * stimulus (which is set by the stimBord variable in expt1_config)
 * 
 * @param {*} canvas 
 * @param {string[]} selectedCols 
 */
function drawRects(canvas, selectedCols) {

    var fullSize = config.stimSize + 2 * config.stimBord
    
    var canvasLims = genLims(canvas, fullSize);

    var allLocs = [];
    for (let colour of selectedCols) {
        var locNeeded = true;
        
        while (locNeeded) {
            // Generate a new location
            var newLoc = genLoc(...canvasLims);
            
            // If it's the first position, or if it doesn't overlap with any
            // existing square, then add it to all locs and draw it
            if (allLocs.length < 1 || !anyOverlap(newLoc, allLocs, fullSize)) {
                allLocs.push(newLoc);
                var locNeeded = false;
            }
        }
        
        // @ts-ignore
        var [xBord, yBord] = newLoc;
        
        //drawRect(ctx, xBord, yBord, fullSize, 'rgba(225,225,225,0.5)', "red")
        
        // Calulate the position if the stimulus relative to the border
        // coordinates
        var xStim = xBord + config.stimBord;
        var yStim = yBord + config.stimBord;
        drawRect(canvas, xStim, yStim, config.stimSize, colour)
    }
}

/**
 * Draw a single rectangle with user specified size and fill colour, and a
 * black border on the canvas
 * 
 * @param {*} canvas 
 * @param {number} xPos
 * @param {number} yPos 
 * @param {number} size 
 * @param {string} fillColour 
 * @param {string} [strokeColour = "black"]
 */
function drawRect(canvas, xPos, yPos, size, fillColour, strokeColour = "black") {
    var ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.fillStyle = fillColour;
    ctx.fillRect(xPos, yPos, size, size);
    ctx.strokeStyle = strokeColour
    ctx.strokeRect(xPos, yPos, size, size);
}

/** @typedef {[number[], number[]]} canvasLimsTuple */
/**
 * Generates the limits within which the stimuli can be drawn on the canvas
 * 
 * @param {*} canvas 
 * @param {number} size - Size of the stimulus (including bounding box)
 * @returns {canvasLimsTuple} Nested array of canvas limits
 */
function genLims(canvas, size) {
    var xLims = [0, canvas.width - size];
    var yLims = [0, canvas.height - size];
    
    return([xLims, yLims])
}

/**
 * Generates random xy coordinates within the canvas limit
 * 
 * @param {number[]} xLim 
 * @param {number[]} yLim 
 * @returns {number[]} X & Y coordinates
 */
function genLoc(xLim, yLim) {
    // @ts-ignore
    var xPos = jsPsych.randomization.randomInt(...xLim);
    // @ts-ignore
    var yPos = jsPsych.randomization.randomInt(...yLim);
    return([xPos, yPos])
}

