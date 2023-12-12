var expt1_config = {
    run: true,
    practice: true,
    fixationDuration: 250,              // Fixation duration in ms
    fixationPostTrial: 0,               // Duration of blank screen after fixation (in ms) 
    stimulusDuration: 1500,             // Stimulus duration in ms
    trialDuration: 2000,             // Duration of blank screen after stimulus (in ms)
    nTrialReps: 10,                     // Number of trial repetitions (actual trial number = this * 2)
    stimDims: [50, 50],                 // Size of the stimulus in pixels
    radius: 250,
    radiusJitter: [0, 0],
    angleJitter: [0, 0],
    colours: ['#a6cee3','#1f78b4',      // Array of potential stimulus colours
              '#b2df8a','#33a02c',
              '#fb9a99','#e31a1c',
              '#fdbf6f','#ff7f00',
              '#cab2d6','#6a3d9a'],
    nPositions: 12, 
    startValue: 2,                      // Starting number of stimuli
    minValue: 2,                        // Minimum number of stimuli
    maxValue: 8,                        // Maximum number of stimuli
    staircaseUp: 3,                     // Number of correct answers to move up the staircase
    staircaseDown: 1                    // Number of incorrect answers to move down the staircase
}