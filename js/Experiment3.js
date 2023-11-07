// Experiment will show N stimuli randomly placed across a 4 x 3 grid
// There will be a signal indicating the colour of the stimuli that participantts need to click

// stimuli will appear randomly across the trial
// The number of stimuli will change from trial to trial (staircase?)
// Trials will be repeated for a fixed amount of times (will this need a way to break out immediately?)

let nStim = expt3_config.startingStimN;

const [stimWidth, stimHeight] = expt3_config.stimulusDims;
const [squareWidth, squareHeight] = expt3_config.squareDims;
const jitterRange = expt3_config.posJitterRange;

// Initialise these at the top level so they can be accessed by functions
var targetColour, loopStart;
var clickedColour = ""

let proto_rect_obj = {
    obj_type: 'rect', // means a rectangle
    startX: 0, // location in the canvas
    startY: 575,
    width: stimWidth, // of the rectangle
    height: stimHeight,
    line_color: '#ffffff',
    fill_color: 'black',
    show_start_time: 500, // from the trial start (ms)
    show_end_time: expt3_config.maxTrialLengthMs,
}

function getXYfromPos(pos, stride = 4) {
    let xVal = pos % stride;
    let yVal = Math.floor(pos / stride)

    return [xVal, yVal]
}

const trial = {
    type: jsPsychPsychophysics,
    stimuli: Array(nStim + 1).fill(proto_rect_obj),
    response: "button",
    choices: [], 
    on_start: function(trial) {
        // Sample non-target colours
        let rect_cols = jsPsych.randomization.sampleWithoutReplacement(shufCols, nStim - 1)
        // Add target colour back to the array
        rect_cols.push(targetColour)

        // Sample different positions
        let rect_pos = jsPsych.randomization.sampleWithoutReplacement(expt3_config.allPostions, nStim)

        // This draws the target bar across the bottom of the canvas
        trial.stimuli[0].width = 1600; // Not sure why this is double the width of the canvas
        trial.stimuli[0].height = 25;
        trial.stimuli[0].fill_color = targetColour

        // This draws the individual stimuli on the canvas
        for (let i = 1; i < trial.stimuli.length; i++) {

            // Generate x and y locations from numerical position
            let [xLoc, yLoc] = getXYfromPos(rect_pos[i-1])

            // Generate some jitter for x and y
            let jitterX = jsPsych.randomization.randomInt(...jitterRange)
            let jitterY = jsPsych.randomization.randomInt(...jitterRange)
    
            // Generate x and y coords from locations and jitter
            let xPos = (stimWidth/2) + (squareWidth/2) + (squareWidth * xLoc) + jitterX
            let yPos = (stimHeight/2) + (squareHeight/2) + (squareHeight * yLoc) + jitterY
            
            // Generate random start and end times
            let startTime = jsPsych.randomization.randomInt(...expt3_config.startTimeRangeMs)
            let endTime = startTime + jsPsych.randomization.randomInt(...expt3_config.durationRangeMs)
            
            // Update the stimulus
            trial.stimuli[i].startX = xPos // location in the canvas
            trial.stimuli[i].startY = yPos
            trial.stimuli[i].fill_color = rect_cols[i-1]
            trial.stimuli[i].show_start_time = startTime
            trial.stimuli[i].show_end_time = endTime
        }
    },
    canvas_width: canvas.width,
    canvas_height: canvas.height,
    background_color: 'white', // The HEX color means green.
    trial_duration: expt3_config.maxTrialLengthMs,
    mouse_down_func: function(e) {
        let x = e.offsetX;
        let y = e.offsetY;

        for (let i = 1; i < trial.stimuli.length; i++) {
            let x1 = jsPsych.getCurrentTrial().stim_array[i].startX - (stimWidth/2)
            let x2 = x1 + stimWidth

            let y1 = jsPsych.getCurrentTrial().stim_array[i].startY - (stimHeight/2)
            let y2 = y1 + stimHeight

            let inX = x1 < x & x < x2
            let inY = y1 < y & y < y2

            if (inX & inY) {
                clickedColour = jsPsych.getCurrentTrial().stim_array[i].fill_color;
                jsPsych.getCurrentTrial().end_trial()
            }

        }
    },
    on_finish: function(data) {
        // Record target and clicked colours
        data.target = targetColour
        data.response = clickedColour
        if (clickedColour === "") {
            // No Response
            data.correct = -1
        } else if (clickedColour === targetColour) {
            // Correct response
            data.correct = 1
        } else {
            // Incorrect response
            data.correct = 0
        }
        clickedColour = ""
    },
}

const loop_node = {

    // Repeat the trial until the keepLooping function returns False
    timeline: [trial],
    loop_function: function() {
        return keepLooping(loopStart, expt3_config.blockTimeLimitMs);
    },
};

function keepLooping(loopStart, limitMs) {
    // Checks to see if the time since 'loopStart' is less that the 'limitSecs'
    let currTime = new Date();
    let elapsedMs = currTime - loopStart;
    return elapsedMs < limitMs
}

var start_timeline = {
    type: jsPsychCallFunction,
    func: function() {
        // Set start time for looping block
        loopStart = new Date();

        // Set target colour for this block
        shufCols = jspShuffle(expt3_config.allColours)
        targetColour = shufCols.shift()
    },
};

const top_node = {
    timeline: [start_timeline, loop_node],
    repetitions: 5
}

jsPsych.run([top_node])