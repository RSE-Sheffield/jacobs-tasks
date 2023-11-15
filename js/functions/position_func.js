/**
 * Generate the X and Y coordinates for a stimulus placed in the edge of a circle.
 * Position is passed numerically (e.g. 2) and then the corresponding coordinates are calculated.
 * This also factors in individual jitter for both the radius and angle.
 * 
 * @param {number} posN - Integer indicating position on circumference of circle
 * @param {number} radius - Integer indicating radius of circle (dist of stim from centre)
 * @param {number[]} [radiusJitter=[0, 0]] - Array of 2 integers indicating bounds of jitter for radius
 * @param {number[]} [angleJitter=[0, 0]] - Array of 2 integers indicating bounds of jitter for angle
 * @param {number} [nPos=12] - Integer indicating number of potential positions around circle
 * 
 * @returns {number[]} - Array of X and Y coordinates for stimulus
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

/**
 * Generate the X and Y coordinates for a stimulus placed in a grid.
 * Position is passed numerically (e.g. 4) and the location in the grid and corresponding
 * coordinates are calculated.
 * This also factors in a degree of jitter away from the grid intersections.
 * 
 * @param {number} posN - Integer indicating position within the grid (0 top left, increasing across cols)
 * @param {number[]} squareDims - Array of 2 integers indicating the dimensions of the grid square containing the stimulus
 * @param {number[]} [jitterRange=[0, 0]] - Array of 2 integers indicating the range of jitter for both X and Y coordinates
 * @param {number} stride - Integer indicating the number of squares to a row in the grid
 * 
 * @returns {number[]} - Array of X and Y coordinates for stimulus
 */
function generatePosGrid(posN, squareDims, jitterRange = [0,0], stride = 4) {
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

/**
 * Generates the X and Y locations for a numerical position within a grid.
 * 
 * @param {number} posN - Integer indicating position within the grid
 * @param {number} stride - Integer indicating the number of squares to a row in the grid
 * 
 * @returns {number[]} - Array of X and Y locations
 */

function getXYfromPos(posN, stride) {
    let xLoc = posN % stride;
    let yLoc = Math.floor(posN / stride)

    return [xLoc, yLoc]
}