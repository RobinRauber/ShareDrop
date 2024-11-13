// This file provides funcitonality to get the OS of the client

function getOS() {
    ClientOS = window.navigator.userAgent;
    if (ClientOS.includes("Android")) {
        ClientOS = "Android";
    } else if (ClientOS.includes("iPhone") || ClientOS.includes("iPad")) {
        ClientOS = "iOS";
    } else if (ClientOS.includes("Windows")) {
        ClientOS = "Windows";
    } else if (ClientOS.includes("CrOS")) {
        ClientOS = "ChromeOS";
    } else if (ClientOS.includes("Linux")) {
        ClientOS = "Linux";
    } else if (ClientOS.includes("Mac")) {
        ClientOS = "MacOS";
    } else {
        ClientOS = "Unknown";
    }
    return ClientOS;
}