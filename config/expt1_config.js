var expt1_config = {
    fixationDuration: 250,              // Fixation duration in ms
    fixationPostTrial: 0,               // Duration of blank screen after fixation (in ms) 
    stimulusDuration: 1500,             // Stimulus duration in ms
    stimulusPostTrial: 500,             // Duration of blank screen after stimulus (in ms)
    nTrialReps: 10,                     // Number of trial repetitions (actual trial number = this * 2)
    stimSize: 50,                       // Size of the stimulus in pixels
    stimBord: 20,                       // Size of the border around the stimulus in pixels
    colours: ["red", "blue", "yellow",  // Array of potential stimulus colours
                "green", "orange", "purple",
                "magenta", "cyan"],
    startValue: 2,                      // Starting number of stimuli
    minValue: 2,                        // Minimum number of stimuli
    maxValue: 8,                        // Maximum number of stimuli
    staircaseUp: 3,                     // Number of correct answers to move up the staircase
    staircaseDown: 1                    // Number of incorrect answers to move down the staircase
}