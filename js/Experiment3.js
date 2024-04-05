// Experiment will show N stimuli randomly placed across a 4 x 3 grid
// There will be a signal indicating the colour of the stimuli that participantts need to click

// stimuli will appear randomly across the trial
// The number of stimuli will change from trial to trial (staircase?)
// Trials will be repeated for a fixed amount of times (will this need a way to break out immediately?)
const [stimWidth, stimHeight] = expt3_config.stimulusDims;

// Initialise these at the top level so they can be accessed by functions
var targetColour, loopStart;
var clickedColour = "";
var taskN = 3;

const expt3_trial = {
    type: jsPsychPsychophysics,
    response: "button",
    choices: [],
    canvas_width: canvas.width,
    canvas_height: canvas.height,
    background_color: 'white',
    trial_duration: expt3_config.maxTrialLengthMs,
    stimuli: function() {

        let nStim = expt3_config.startingStimN;
        
        // Empty array to be filled and returned
        let stimArray = [];

        // Sample non-target colours
        let rectCols = jspRand.sampleWithoutReplacement(shufCols, nStim - 1);
        // Add target colour back to the array
        rectCols.push(targetColour);

        // Sample different positions
        let rectPos = jspRand.sampleWithoutReplacement(expt3_config.allPostions, nStim);

        // This sets up the target bar across the bottom of the canvas
        let targetStim = genProtoRect(800, 20);

        targetStim.fill_color = targetColour;
        targetStim.show_start_time = 0;
        targetStim.show_end_time = expt3_config.maxTrialLengthMs;
        stimArray.push(targetStim);

        // Generate and display scores
        var currScore = jsPsych.data.allData.trials.filter(trial => trial.screen === "array").reduce((sum, obj) => sum + obj["correct"], 0);

        const scoreText = {
            obj_type: 'text',
            startX: 100,
            startY: 25,
            content: 'Current Score: ' + currScore,
            font: "22px 'Arial'",
            text_color: 'black',
            show_start_time: 0, // ms after the start of the trial
            show_end_time: expt3_config.maxTrialLengthMs,
        };
        
        const highScore = {
            obj_type: 'text',
            startX: 700,
            startY: 25,
            content: 'High Score: ' + expt3_config.highScore,
            font: "22px 'Arial'",
            text_color: 'blue',
            show_start_time: 0, // ms after the start of the trial
            show_end_time: expt3_config.maxTrialLengthMs,
        };
        
        stimArray.push(scoreText);
        stimArray.push(highScore);
        
        // This draws the individual stimuli on the canvas
        for (let i = 0; i < nStim; i++) {
            var [xPos, yPos] = generatePosGrid(
                rectPos[i],
                expt3_config.squareDims,
                expt3_config.posJitterRange,
                [100, 65]
            );
            
            // Generate random start and end times
            let startTime = jspRand.randomInt(...expt3_config.startTimeRangeMs);
            let endTime = startTime + jspRand.randomInt(...expt3_config.durationRangeMs);
            
            var rectStim = genProtoRect(...expt3_config.rectDims);

            // Update the col stimulus location
            rectStim.startX = xPos;
            rectStim.startY = yPos;
            // Update the col stimulus start and end time
            rectStim.show_start_time = startTime;
            rectStim.show_end_time = endTime;
            // Update the col stimulus colour
            rectStim.fill_color = rectCols[i];
            
            var imgStim = genProtoImg(...expt3_config.stimulusDims);

            // Update the img stimulus location
            imgStim.startX = xPos;
            imgStim.startY = yPos;
            // Update the img stimulus start and end time
            imgStim.show_start_time = startTime;
            imgStim.show_end_time = endTime;

            // Randomly select either L or R facing image and update img stim
            imgStim.file = (Math.random() > 0.5) ? expt3_config.stimImgs[0] : expt3_config.stimImgs[1];
            
            // Add rect and img to stim array
            stimArray.push(rectStim);
            stimArray.push(imgStim);
        }

        return stimArray
    },
    mouse_down_func: function(event) {
        let x = event.offsetX;
        let y = event.offsetY;

        // Only get info for the rect objects
        trial = jsPsych.getCurrentTrial().stim_array.filter(obj => obj.obj_type === "rect");

        // Skip object at index 0 as this is the target
        for (let i = 1; i < trial.length; i++) {
            let x1 = trial[i].startX - (stimWidth/2);
            let x2 = x1 + stimWidth;

            let y1 = trial[i].startY - (stimHeight/2);
            let y2 = y1 + stimHeight;

            let inX = x1 < x & x < x2;
            let inY = y1 < y & y < y2;

            if (inX & inY) {
                clickedColour = trial[i].fill_color;
                jsPsych.getCurrentTrial().end_trial();
            }

        }
    },
    on_finish: function(data) {
        // Record target and clicked colours
        data.target = targetColour;
        data.response = clickedColour;
        if (clickedColour === "") {
            // No Response
            data.correct = 0;
        } else if (clickedColour === targetColour) {
            // Correct response
            data.correct = 1;
        } else {
            // Incorrect response
            data.correct = -1;
        }
        clickedColour = "";
    },
    data: {
        screen: 'array',
        task: taskN,
    },
};

const loop_node = {
    // Repeat the trial until the keepLooping function returns False
    timeline: [expt3_trial],
    loop_function: function() {
        return keepLooping(loopStart, expt3_config.blockTimeLimitMs);
    },
};

function keepLooping(loopStart, limitMs) {
    // Checks to see if the time since 'loopStart' is less that the 'limitSecs'
    let currTime = new Date();
    let elapsedMs = currTime - loopStart;
    return elapsedMs < limitMs
};

const start_timeline = {
    type: jsPsychCallFunction,
    func: function() {
        // Set start time for looping block
        loopStart = new Date();

        // Set target colour for this block
        shufCols = jspRand.shuffle(expt3_config.allColours);
        targetColour = shufCols.shift();
    },
};

const expt3_main = {
    timeline: [start_timeline, loop_node],
    repetitions: expt3_config.loopRepetitions,
};

const expt3_start = {
    type: jsPsychInstructions,
    pages: expt3_inst,
    show_clickable_nav: true,
};

const expt3_prac = {
    timeline: [],
    conditional_function: function() {
        return expt2_config.practice
    },
};

const expt3_end = {
    type: jsPsychHtmlButtonResponse,
    stimulus: '<p>Well done, you have finished <strong>Task ' +taskN+ '</strong></p><p>Press the button below when you are ready to move onto the next task</p>',
    choices: ["Continue"],
};

const expt3_proc = {
    timeline: [
        expt3_start,
        expt3_prac,
        expt3_main,
        expt3_end,
    ],
    conditional_function: function() {
        return expt3_config.run
    },
}

mainTimeline.push(expt3_proc);