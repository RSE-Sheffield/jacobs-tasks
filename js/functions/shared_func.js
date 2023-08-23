function generateFixation(duration, postTrial){
    // Standard fixation object
    return {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: '<div style="font-size:60px;">+</div>',
        choices: "NO_KEYS",
        trial_duration: duration,
        post_trial_gap: postTrial, 
        data: {
            screen: 'fixation'
        }
    };
}

