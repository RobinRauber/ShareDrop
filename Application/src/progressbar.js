// This file provides the functionality to display a progress bar on the screen.

const progressOverlay = document.querySelector('.progressOverlay');
const progressBar = document.querySelector('.progress');
const progressTitle = document.querySelector('.progressWindow h1');
const progressText = document.querySelector('.progressText');
let startTime = Date.now();
let lastUpdateTime = 0;
let elapsedTime = 0;
let totalTime = 0;
let remainingTime = 0;
let hours = 0;
let minutes = 0;
let seconds = 0;

function UpdateProgressbar(Progress, title) {

    // do once log the start time
    if(progressOverlay.classList.contains('hidden')) {
        startTime = Date.now();
    }

    Progress = Math.round(Progress * 100) / 100;

    // what is the difference between const let and var? -> 
    // const is a constant and cannot be changed
    // let is a variable that can be changed
    // var is a variable that can be changed but is function scoped
    
    // Calculate remaining time only if a second has passed since the last calculation
    if (Date.now() - lastUpdateTime >= 1000) {
        elapsedTime = Date.now() - startTime;
        totalTime = elapsedTime / Progress; // Total time taken for 100% progress
        remainingTime = totalTime * (100 - Progress); // Remaining time for remaining progress
        hours = Math.floor(remainingTime / 3600000);
        minutes = Math.floor((remainingTime % 3600000) / 60000);
        seconds = Math.floor((remainingTime % 60000) / 1000);

        lastUpdateTime = Date.now(); // Update last update time
    }
    progressText.innerHTML = Progress + '%' + '<br>' + hours + 'h ' + minutes + 'm ' + seconds + 's';
    progressBar.style.width = Progress + '%';
    progressTitle.textContent = title;
    progressOverlay.classList.remove('hidden');
    
    if (Progress === 100) {
        setTimeout(() => {
            progressOverlay.classList.add('hidden');
        }, 500);
    }
}

