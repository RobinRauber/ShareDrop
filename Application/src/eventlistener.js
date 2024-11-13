// This adds a event listener to the document and listens for the 'click' event

var selectedUser = "";
var fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.multiple = true;

fileInput.addEventListener('change', function() {
    sendFiles(selectedUser, fileInput.files);
});

document.addEventListener('click', (event) => {
    // Check if the clicked element is a user
    const user = event.target.closest('.user');
    if (user) {
        // username is in .user > p
        selectedUser = user.querySelector('p').textContent;
        fileInput.click();
    }
});