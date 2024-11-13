import asyncio
import websockets
import socket
import random
import json
from sys import platform
import subprocess as sb

def getIP():
    if platform == "linux" or platform == "linux2": ip = sb.run(["ipconfig", "getifaddr", "en0"], capture_output=True)
    elif platform == "darwin": ip = sb.run(["ipconfig", "getifaddr", "en0"], capture_output=True)
    elif platform == "win32": ip = sb.run(["ipconfig", "| findstr /i" "ipv4"],capture_output=True)
    return ip.stdout.decode().strip()

# Constants
PORT = 3000
version = "Sharedrop 1.0.1"
ip = getIP()
firstName = ["Robo", "Cyber", "Rainbow", "Magical", "Hero", "Sparkling", "Cute", "Sweet", "Lovely", "Space"]
lastName = ["Unicorn", "Cat", "Dog", "Elephant", "Lion", "Tiger", "Bear", "Wolf", "Fox", "Panda"]

# Dictionary to store connections
connections = {}

# Function to generate a random username
def generate_username(id):
    random.seed(id)
    return random.choice(firstName) + " " + random.choice(lastName)

# Function to send back the upload progress
async def UpdateProgress(progress, websocket):
    await websocket.send(json.dumps({"type": "uploadProgress", "progress": progress}))

# Function to handle signals
async def handle_signal(websocket, path):
    try:

        # Store the new connection
        print(f"New connection {websocket.remote_address}")
        websocket.username = generate_username(id(websocket))
        connections[id(websocket)] = websocket

        # Send the current state to the new connection and ask for the operating system
        await websocket.send(json.dumps({"type": "setup", "username": websocket.username, "version": version, "shareLink": f"{ip}:8000", "users": [{"username": conn.username, "operatingSystem": conn.operatingSystem} for conn_id, conn in connections.items() if conn_id != id(websocket)]}))
        await websocket.send(json.dumps({"type": "getOperatingSystem"}))


        # Handle messages from the new connection
        async for message in websocket:

            # Handle the return after asking for the operating system
            if json.loads(message)["type"] == "returnOperatingSystem":
                websocket.operatingSystem = json.loads(message)["operatingSystem"]
                # Send the new connection to all the other connections
                for conn_id, conn in connections.items():
                    if conn_id != id(websocket):
                        await conn.send(json.dumps({"type": "newConnection", "username": websocket.username, "operatingSystem": websocket.operatingSystem}))
            
            # Handle the file transfer
            elif json.loads(message)["type"] == "file":
                target = json.loads(message)["target"]
                chunk = json.loads(message)["chunk"]
                chunkindex = json.loads(message)["chunk"]["index"]
                totalchunks = json.loads(message)["chunk"]["totalChunks"]
                indexOfFile = json.loads(message)["indexOfFile"]
                totalFiles = json.loads(message)["totalFiles"]
                progress = (indexOfFile + (chunkindex / totalchunks)) / totalFiles * 100
                if chunkindex == totalchunks - 1 and indexOfFile == totalFiles - 1:
                    progress = 100
                for conn_id, conn in connections.items():
                    if conn.username == target:
                        await conn.send(json.dumps({"type": "file", "sender": websocket.username, "chunk": chunk, "indexOfFile": indexOfFile, "totalFiles": totalFiles}))
                        await UpdateProgress(progress, websocket)

    # Error handling
    except websockets.exceptions.ConnectionClosedError:
        pass

    # Close Handling
    finally:
        # Remove the connection when closed
        print(f"Connection closed {websocket.remote_address}")
        del connections[id(websocket)]
        for conn_id, conn in connections.items():
            await conn.send(json.dumps({"type": "disconnect", "username": websocket.username}))

# Start the server
start_server = websockets.serve(handle_signal, ip, PORT)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()