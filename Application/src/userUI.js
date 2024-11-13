// This file provides the functionality to display the users in the room on the screen.

function AddUser(Name, OS) {
    const user = document.createElement('div');
    const h2_os = document.createElement('h2');
    const p = document.createElement('p');
    const img = document.createElement('img');
    const usercontainer = document.querySelector('.users');
    user.classList.add('user');
    h2_os.textContent = OS;
    p.textContent = Name;
    img.src = OS === 'Android' || OS === 'iOS' ? 'icns/mobile.svg' : 'icns/desktop.svg';
    user.appendChild(img);
    user.appendChild(h2_os);
    user.appendChild(p);
    usercontainer.appendChild(user);
    UpdateUserContainer();
}



function RemoveUser(Name) {
    const user = [...document.querySelectorAll('.user')].find((user) => user.querySelector('p').textContent === Name);
    user.remove();
    UpdateUserContainer();
}

function UpdateUserContainer() {
    // set hidden class if there is only one user (self) in the room
    const info = document.querySelector('.info');
    if(document.querySelectorAll('.user').length > 0) {info.classList.add('hidden');}
    else {info.classList.remove('hidden');}

    // set the position of the users
    const centerelement = document.querySelector('.userinfo');
    const users = document.querySelectorAll('.user');
    const num = users.length; // Use the actual number of users

    if (num === 1) {
        // Set Position to 90° on the half Circle
        const userRadius = Math.min(window.innerWidth, window.innerHeight) / 4;
        const rect = centerelement.getBoundingClientRect();
        const center = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2 - 250
        };
        users[0].style.left = `${center.x}px`;
        users[0].style.top = `${center.y - userRadius}px`;
        return;
    }

    // Calculate the position of the users if there are more than one user
    for (let i = 0; i < num; i++) {
        const angle = Math.PI + i / (num - 1) * Math.PI;
        // should always fit to screen
        const userRadius = Math.min(window.innerWidth, window.innerHeight) / 4;
        const rect = centerelement.getBoundingClientRect();
        const center = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2 - 250
        };
        users[i].style.left = `${center.x + Math.cos(angle) * userRadius}px`;
        users[i].style.top = `${center.y + Math.sin(angle) * userRadius}px`;
    }
}

window.onresize = async function() {
    UpdateUserContainer();
}