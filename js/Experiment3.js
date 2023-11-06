// Experiment will show N stimuli randomly placed across a 4 x 3 grid
// There will be a signal indicating the colour of the stimuli that participantts need to click

// stimuli will appear randomly across the trial
// The number of stimuli will change from trial to trial (staircase?)
// Trials will be repeated for a fixed amount of times (will this need a way to break out immediately?)

const all_cols = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a'];
const all_pos = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const n_rects = 5;
const timeLimit = 60;
const trialLength = 4000

const startRange = [500, 1000];
const durRange = [1500, 2000]; 

const [stimWidth, stimHeight] = [60, 60];
const [squareWidth, squareHeight] = [150, 150];
const jitterRange = [-25, 25];

var loopStart, corrIdx;
var repetition_count = 0;

let proto_rect_obj = {
    obj_type: 'rect', // means a rectangle
    startX: 0, // location in the canvas
    startY: 575,
    width: stimWidth, // of the rectangle
    height: stimHeight,
    line_color: '#ffffff',
    fill_color: 'black',
    show_start_time: 500, // from the trial start (ms)
    show_end_time: 1500
}

function getXYfromPos(pos, stride = 4) {
    let xVal = pos % stride;
    let yVal = Math.floor(pos / stride)

    return [xVal, yVal]
}

const trial = {
    type: jsPsychPsychophysics,
    stimuli: Array(n_rects + 1).fill(proto_rect_obj),
    response: "button",
    choices: [], 
    on_start: function(trial) {
        let rect_cols = jsPsych.randomization.sampleWithoutReplacement(all_cols, n_rects)
        let rect_pos = jsPsych.randomization.sampleWithoutReplacement(all_pos, n_rects)


        let corrPos = jsPsych.randomization.sampleWithoutReplacement(rect_pos, 1)
        corrIdx = rect_pos.indexOf(...corrPos)

        trial.stimuli[0].width = 1600;
        trial.stimuli[0].height = 25;
        trial.stimuli[0].fill_color = rect_cols[corrIdx]
        trial.stimuli[0].show_start_time = 0;
        trial.stimuli[0].show_end_time = trialLength;

        for (let i = 1; i < trial.stimuli.length; i++) {

            let [xLoc, yLoc] = getXYfromPos(rect_pos[i-1])

            jitterX = jsPsych.randomization.randomInt(...jitterRange)
            jitterY = jsPsych.randomization.randomInt(...jitterRange)
    
            let xPos = (stimWidth/2) + (squareWidth/2) + (squareWidth * xLoc) + jitterX
            let yPos = (stimHeight/2) + (squareHeight/2) + (squareHeight * yLoc) + jitterY
            let startTime = jsPsych.randomization.randomInt(...startRange)
            let endTime = startTime + jsPsych.randomization.randomInt(...durRange)
            
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
    trial_duration: trialLength,
    mouse_down_func: function(e) {
        let x = e.offsetX;
        let y = e.offsetY;

        corrCol = jsPsych.getCurrentTrial().stim_array[0].fill_color;
        console.log(corrCol)

        for (let i = 1; i < trial.stimuli.length; i++) {
            let x1 = jsPsych.getCurrentTrial().stim_array[i].startX - (stimWidth/2)
            let x2 = x1 + stimWidth

            let y1 = jsPsych.getCurrentTrial().stim_array[i].startY - (stimHeight/2)
            let y2 = y1 + stimHeight

            let inX = x1 < x & x < x2
            let inY = y1 < y & y < y2

            if (inX & inY) {
                stimCol = jsPsych.getCurrentTrial().stim_array[i].fill_color;
                console.log(stimCol)
                if (stimCol === corrCol) {
                    jsPsych.finishTrial()
                } else {
                    jsPsych.getCurrentTrial().stim_array[i].show_end_time = 0
                }
            }

        }
    }

}

const loop_node = {
    timeline: [trial],

    on_timeline_start: function() {
        repetition_count++;
        console.log('Repetition number ', repetition_count, ' has just started.');
    },
    loop_function: function() {
        return keepLooping(loopStart, timeLimit);
    },
};

function keepLooping(loopStart, limitSecs) {
    let currTime = new Date();
    let elapsedMs = currTime - loopStart;
    return (elapsedMs / 1000) < limitSecs
}

var start_timeline = {
    type: jsPsychCallFunction,
    func: function() {
        loopStart = new Date();
        console.log(loopStart)
    },
};


jsPsych.run([start_timeline, loop_node])