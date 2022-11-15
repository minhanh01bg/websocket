const express = require('express')
const app = express()
const server = require('http').createServer(app)
const WebSocket = require('ws')
const wss = new WebSocket.Server({ server: server })

wss.on('connection', function connection(ws, req) {
    console.log('A new client connected')

    ws.on('message', function (message) {
        var messageArray = JSON.parse(message)
        
        const update = [
            messageArray.lat,
            messageArray.long
        ]
        ws.send(JSON.stringify(update));
    })
})
app.get('/', (req, res) => {
    res.sendFile('hello world!');
})

server.listen(3002, () => console.log("listen on port: 3002"))