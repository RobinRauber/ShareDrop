// This file handles the WebSocket connection to the server and the incoming messages from the server.

const ws = new WebSocket(`ws://${window.location.hostname}:3000`);
const version = document.querySelector('.version h2');
const username = document.querySelector('.userinfo p strong');
const shareLink = document.querySelector('.title h2');
const usercontainer = document.querySelector('.users');

let receivedChunks = {};
let receivedFiles = {};

// Incoming messages from the server
ws.onmessage = function (event) {
  const message = JSON.parse(event.data);
  if (message.type === 'setup') {
    version.textContent = message.version;
    username.textContent = message.username;
    shareLink.textContent = message.shareLink;
    message.users.forEach(user => AddUser(user.username, user.operatingSystem));
  }
  if (message.type === 'getOperatingSystem') {ws.send(JSON.stringify({ type: 'returnOperatingSystem', operatingSystem: getOS() }));}
  if (message.type === 'disconnect') {RemoveUser(message.username);}
  if (message.type === 'newConnection') {AddUser(message.username, message.operatingSystem);}
  if (message.type === 'uploadProgress') {UpdateProgressbar(message.progress, "Uploading...");}
  if (message.type === 'file') {
    UpdateProgressbar(((message.indexOfFile + (message.chunk.index + 1) / message.chunk.totalChunks) / message.totalFiles * 10000) / 100, "Downloading...");
    let chunk = message.chunk;
    if (!receivedChunks[chunk.filename]) {receivedChunks[chunk.filename] = [];}
    receivedChunks[chunk.filename].push(chunk);
    if (receivedChunks[chunk.filename].length === chunk.totalChunks) {
      const combinedBase64 = combineChunks(receivedChunks[chunk.filename]);
      const file = base64ToFile(chunk.filename, combinedBase64);
      receivedChunks[chunk.filename] = [];
      receivedFiles[chunk.filename] = file;

      if ((message.indexOfFile + 1) == message.totalFiles) {
        Object.keys(receivedFiles).forEach((filename, index) => {
          setTimeout(() => {
            downloadFile(receivedFiles[filename]);
            // if its the last file clear the object
            if (index + 1 == Object.keys(receivedFiles).length) {receivedFiles = {};}
          }, 100 * index);
        });
      }
    }
  }
}

ws.onclose = function () {
    document.body.innerHTML = '<h1>Connection lost. Please reload the page.</h1>';
    document.querySelector('link').remove();
}