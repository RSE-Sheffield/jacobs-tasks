var startTime;
var limitSecs = 30;
var repetition_count = 0;

var fixation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<div style="font-size:60px;">+</div>',
    choices: "NO_KEYS",
    trial_duration: 1000,
};

let trialCombos_expt3 = jsPsych.randomization.factorial({
    answer: ["fit", "nofit"],
    difficulty: ["easy", "medium", "difficult"],
});

function drawRect(ctx, xPos, yPos, xSize, ySize, fillColour = "white", strokeColour = "black") {
    ctx.beginPath();
    ctx.fillStyle = fillColour;
    ctx.fillRect(xPos, yPos, xSize, ySize);
    ctx.strokeStyle = strokeColour
    ctx.strokeRect(xPos, yPos, xSize, ySize);
}

function drawBar(ctx, width) {
    let half_width = -Math.floor(width/2)
    drawRect(ctx, half_width, 400, width, 50)
}

function drawGap(ctx, gap) {

    let half_gap = Math.floor(gap/2);
    let neg_gap = -(half_gap + 50)
    let pos_gap = half_gap
    drawRect(ctx, neg_gap, 50, 50, 50, "blue")
    drawRect(ctx, pos_gap, 50, 50, 50, "blue")
}

function generateWidth(gap, difficulty, answer) {
    let diff, width
    switch (difficulty) {
        case "easy":
            diff = jsPsych.randomization.randomInt(35, 45);
            break;
        case "medium":
            diff = jsPsych.randomization.randomInt(20, 30);
            break;
        case "difficult":
            diff = jsPsych.randomization.randomInt(5, 15);
            break;
    }

    console.log(difficulty, diff)
    switch (answer) {
        case "fit":
            width = gap - diff;
            break;
        case "nofit":
            width = gap + diff;
            break;
    }
    console.log(answer, width)
            
    return width
};

var trial = {
    type: jsPsychCanvasButtonResponse,
    on_start: function(trial) {
        gap = jsPsych.randomization.randomInt(100, 300)
        console.log("gap:", gap)
        let difficulty = jsPsych.timelineVariable('difficulty')
        let answer = jsPsych.timelineVariable('answer')
        width = generateWidth(gap, difficulty, answer)
    },
    stimulus: function(c) {
        const ctx = c.getContext("2d");
        ctx.translate(300, 0);
        drawBar(ctx, width);
        drawGap(ctx, gap);
    },
    prompt: "Will the bar fit through the gap?",
    choices: ["Yes", "No"],
    canvas_size: [canvas.width, canvas.height],
    on_finish: function(data) {
        let answer = jsPsych.timelineVariable('answer')
        if (data.response == 0 && answer == "fit") {
            data.correct = true;
        } else if (data.response == 1 && answer == "nofit") {
            data.correct = true;
        } else {
            data.correct = false;
        }
    }
};

var feedback = {
    type: jsPsychHtmlKeyboardResponse,
    trial_duration: 3000,
    stimulus: function(){
        var last_trial_correct = jsPsych.data.get().last(1).values()[0].correct;
        if(last_trial_correct){
          return "<p>Correct!</p>"; // the parameter value has to be returned from the function
        } else {
          return "<p>Wrong.</p>"; // the parameter value has to be returned from the function
        }
    }
}

var loop_node = {
    timeline: [fixation, trial, feedback],
    on_timeline_start: function() {
        repetition_count++;
        console.log('Repetition number ', repetition_count, ' has just started.');
    },
    loop_function: function(data) {
        return keepLooping(startTime, limitSecs);
    }
};

function keepLooping(startTime, limitSecs) {
    currTime = new Date();
    elapsedMs = currTime - startTime;
    return (elapsedMs / 1000) < limitSecs
}

var end_screen = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "You're out of the loop.",
    trial_duration: 3000,
};

var start_timeline = {
    type: jsPsychCallFunction,
    func: function() {
        startTime = new Date();
        console.log(startTime)
    },
};
mainTimeline.push(start_timeline);
mainTimeline.push(loop_node);
mainTimeline.push(end_screen);
