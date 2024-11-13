// This file provides the functionality to decode files and upload individual chunks to the server.
// It also provides the functionality to download files and combine chunks back into a single file.

// Function to send files to the server
async function sendFiles(TargetName, files) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const base64string = await fileToBase64(file);
    const chunks = splitIntoChunks(file.name, base64string);
    chunks.forEach(chunk => sendChunk(TargetName, chunk, i, files.length));
  }
}

// Function to send a chunk to the server
function sendChunk(TargetName, chunk, indexOfFile, totalFiles) {
  ws.send(JSON.stringify({ type: 'file', target: TargetName, chunk, indexOfFile, totalFiles }));
}

// Function to convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
  }

// Function to split base64 into chunks
function splitIntoChunks(filename, base64String) {
  const chunkSize = 1024;
  const totalChunks = Math.ceil(base64String.length / chunkSize);
  const chunks = [];

  for (let i = 0; i < totalChunks; i++) {
      const chunk = base64String.substring(i * chunkSize, (i + 1) * chunkSize);
      chunks.push({ filename, index: i, data: chunk, totalChunks });
  }

  return chunks;
}

// Function to combine chunks
function combineChunks(chunks) {
  let combinedBase64 = '';
  chunks.sort((a, b) => a.index - b.index).forEach(chunk => {
      combinedBase64 += chunk.data;
  });
  return combinedBase64;
}

// Function to convert base64 to file
function base64ToFile(filename, base64String) {
  const byteCharacters = atob(base64String);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new File([byteArray], filename, { type: 'application/octet-stream' });
}

// Function to download file
function downloadFile(file) {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  }