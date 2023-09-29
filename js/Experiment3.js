var startTime;
var limitSecs = 30;
var repetition_count = 0;

var fixation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<div style="font-size:60px;">+</div>',
    choices: "NO_KEYS",
    trial_duration: 1000,
};

function drawRect(ctx, xPos, yPos, xSize, ySize, fillColour = "white", strokeColour = "black") {
    ctx.beginPath();
    ctx.fillStyle = fillColour;
    ctx.fillRect(xPos, yPos, xSize, ySize);
    ctx.strokeStyle = strokeColour
    ctx.strokeRect(xPos, yPos, xSize, ySize);
}

function drawBar(ctx) {
    drawRect(ctx, 240, 400, 120, 50)
}

function drawGap(ctx) {
    drawRect(ctx, 200, 50, 50, 50, "blue")
    drawRect(ctx, 350, 50, 50, 50, "blue")
}

var trial = {
    type: jsPsychCanvasButtonResponse,
    stimulus: function(c) {
        const ctx = c.getContext("2d");
        ctx.translate(0, 0);
        drawBar(ctx);
        drawGap(ctx);
    },
    prompt: "Will the bar fit through the gap?",
    choices: ["Yes", "No"],
    canvas_size: [canvas.width, canvas.height],
    on_finish: function(data) {
        if (data.response == 0) {
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
