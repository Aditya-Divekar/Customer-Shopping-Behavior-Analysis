#!/usr/bin/env python3
"""
Simple HTTP server to serve the website files
This allows you to test the frontend without Node.js/MongoDB
"""

import http.server
import socketserver
import os
import json
from urllib.parse import urlparse, parse_qs

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory='public', **kwargs)
    
    def do_POST(self):
        """Handle POST requests to API endpoints"""
        parsed_path = urlparse(self.path)
        
        if parsed_path.path.startswith('/api/'):
            # Read the request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                print(f"📝 Received data: {data}")
                
                # Send success response
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response = {
                    "success": True,
                    "message": "Data received successfully! (Demo mode - not stored in database)",
                    "data": data
                }
                
                self.wfile.write(json.dumps(response).encode('utf-8'))
                
            except json.JSONDecodeError:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {"success": False, "message": "Invalid JSON data"}
                self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def main():
    PORT = 3000
    
    # Change to the public directory
    if os.path.exists('public'):
        os.chdir('public')
    
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"🚀 Simple server running at http://localhost:{PORT}")
        print("📝 This is a demo server - data will NOT be stored in MongoDB")
        print("💡 To enable MongoDB, install Node.js and run: npm install && npm start")
        print("🛑 Press Ctrl+C to stop the server")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped.")

if __name__ == "__main__":
    main()

