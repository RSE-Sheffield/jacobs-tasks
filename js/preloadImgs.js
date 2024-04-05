var allStims = genImgList(expt2_config.nImages)
var pracStims = genImgList(expt2_config.nPracImages, "./img/Practice")
var feedbackImgs = expt2_config.feedbackImgs
var overlayImgs = expt3_config.stimImgs

var allImages = allStims.concat(pracStims, feedbackImgs, overlayImgs)

// Preload stimuli
const preload = {
    type: jsPsychPreload,
    images: allImages,
}

mainTimeline.push(preload);
