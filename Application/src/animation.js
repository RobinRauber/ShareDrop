// This file contains the code for the animation of the signal circles

// Parameters
let updateInterval = 10;
let scalespeed = 10;
let spawninterval = 2000;
let lifetime = 1000;
let fadein = 500;
let fadeout = 5000;
let startradius = 200;

var canvas = document.querySelector('.circles');
var ctx = canvas.getContext('2d');
var circles = [];

window.onload = function() {

    // set the canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // set the center of the circles
    var userinfo = document.querySelector('.userinfo');
    var rect = userinfo.getBoundingClientRect();
    var center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2 - 25
    };

    // spawn new circles
    setInterval(function() {
        var circle = {
            x: center.x,
            y: center.y,
            radius: startradius,
            opacity: 0,
            birth: Date.now()
        };
        circles.push(circle);
    }, spawninterval);

    // draw the circles
    setInterval(function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            rect = userinfo.getBoundingClientRect();
            center = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2 - 25
            };
        for (var i = 0; i < circles.length; i++) {
            var circle = circles[i];
            circle.x = center.x;
            circle.y = center.y;

            var age = Date.now() - circle.birth;
            if (age > lifetime + fadeout) {
                circles.splice(i, 1);
                i--;
            } else if (age < fadein) {
                circle.opacity = age / fadein;
            } else if (age > lifetime) {
                circle.opacity = 1 - (age - lifetime) / fadeout;
            } else {
                circle.opacity = 1;
            }
            circle.radius = startradius + (age / scalespeed);
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
            ctx.strokeStyle = 'rgba(255, 255, 255, ' + circle.opacity + ')';
            ctx.lineWidth = 5;
            ctx.stroke();
        }
    }, updateInterval);

    // spawn first one directly and not wait for the interval
    var circle = {
        x: center.x,
        y: center.y,
        radius: startradius,
        opacity: 0,
        birth: Date.now()
    };
    circles.push(circle);
}

// update cycels to new center
function updateAnimationCanvas() {
    userinfo = document.querySelector('.userinfo');
};