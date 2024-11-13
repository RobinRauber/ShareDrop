import http.server
import socketserver
import socket
from sys import platform
import subprocess as sb

def getIP():
    if platform == "linux" or platform == "linux2": ip = sb.run(["ipconfig", "getifaddr", "en0"], capture_output=True)
    elif platform == "darwin": ip = sb.run(["ipconfig", "getifaddr", "en0"], capture_output=True)
    elif platform == "win32": ip = sb.run(["ipconfig", "| findstr /i" "ipv4"],capture_output=True)
    return ip.stdout.decode().strip()

PORT = 8000
ip = getIP()

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        try:
            if self.path == '/':
                self.path = 'index.html'
            return http.server.SimpleHTTPRequestHandler.do_GET(self)
        except Exception as e:
            pass

Handler = MyHttpRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    # print the link
    print("http://" + ip + ":" + str(PORT))
    httpd.serve_forever()