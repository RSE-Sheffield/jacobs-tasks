/**
 * Draw multiple rectangles on the canvas one for each colour provided in the
 * 'selectedCols' array.
 * These are positioned on screen according to the genLoc function, and will 
 * keep regenerating locations until a set with no overlaps are found.
 * The size of the area checked for overlaps can include a border around the
 * stimulus (which is set by the stimBord variable in expt1_config)
 * 
 * @param {number} posN - Integer indicating position on circumference of circle
 * @param {number} radius - Integer indicating radius of circle (dist of stim from centre)
 * @param {number[]} [radiusJitter=[0, 0]] - Array of 2 integers indicating bounds of jitter for radius
 * @param {number[]} [angleJitter=[0, 0]] - Array of 2 integers indicating bounds of jitter for angle
 * @param {number} [nPos=12] - Integer indicating number of potential positions around circle
 */
function generatePosCircle(posN, radius, radiusJitter = [0, 0], angleJitter = [0, 0], nPos = 12) {
    let angleDeg = 360/nPos;
    posN = posN % nPos

    let jitterRad = radius + jspRand.randomInt(...radiusJitter)
    let jitterAngle = (posN * angleDeg) + jspRand.randomInt(...angleJitter)

    let angleRad = jitterAngle * (Math.PI/180)

    let xPos = Math.round(Math.sin(angleRad) * jitterRad)
    let yPos = Math.round(Math.cos(angleRad) * jitterRad)

    return [xPos, yPos]
}

function generatePosGrid(posN, squareDims, jitterRange, stride = 4) {
    let [squareWidth, squareHeight] = squareDims;
    let [xLoc, yLoc] = getXYfromPos(posN, stride);
            
    // Generate some jitter for x and y
    let jitterX = jspRand.randomInt(...jitterRange);
    let jitterY = jspRand.randomInt(...jitterRange);
    
    // Generate x and y coords from locations and jitter
    let xPos = (squareWidth/2) + (squareWidth * xLoc) + jitterX
    let yPos = (squareHeight/2) + (squareHeight * yLoc) + jitterY

    return [xPos, yPos]
}

function getXYfromPos(pos, stride) {
    let xVal = pos % stride;
    let yVal = Math.floor(pos / stride)

    return [xVal, yVal]
}