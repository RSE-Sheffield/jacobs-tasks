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

