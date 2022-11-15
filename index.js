const express = require('express')
const app = express()
const server = require('http').createServer(app)
const WebSocket = require('ws')
const wss = new WebSocket.Server({ server: server })
const url = require('url')


let vehicles = {}
let gpss = {}
let admins={}
wss.on('connection', function connection(ws,req) {
    console.log('A new client connected')
    // var userID = parseInt(req.url.substr(1), 10)
    // console.log(userID)
    
    const parameters = url.parse(req.url, true);
    let id = parameters.query.id;
    console.log(id)
    if(id[0]=='v'){
        id = id.substr(id.length-1)
        vehicles[id] = ws
    }
    if(id[0]=='g'){
        id = id.substr(id.length-1)
        gpss[id] = ws
    }
    if(id[0]=='a'){
        id = id.substr(id.length-1)
        admins[id] = ws
    }
    ws.on('message', function (message) {
        console.log(message);
        var messageArray = JSON.parse(message)
        // console.log(messageArray)
        // var toUser = clients[messageArray["id"]]
        // console.log(messageArray["id"])
        // if (toUser) {
        //     const update = [
        //         messageArray["lat"],
        //         messageArray["long"]
        //     ]
        //     toUser.send(JSON.stringify(update));
        // }
        // gps
        let gps = messageArray['id'].substr(0, 3)
        if(gps == 'gps'){
            let gpsID = messageArray['id'].substr(4)
            console.log('gps connection' + gpsID)
            let vehicle = vehicles[gpsID]
            const update =[
                gpsID,
                messageArray['lat'],
                messageArray['long']
            ]
            if(vehicle){
                console.log('sending to vehicle')
                vehicle.send(JSON.stringify(update))
            }
            for (const [key, value] of Object.entries(admins)){
                console.log('sending to admin')
                value.send(JSON.stringify(update))
            }
        }
        let vehicle = messageArray['id'].substr(0, 7)
        console.log(vehicle)
        if(vehicle == 'vehicle'){
            let vehicleID = messageArray['id'].substr(messageArray['id'].length-1)
            console.log('vehicle connection' + vehicleID)
            const update =[
                vehicleID,
                'car breakdown'
            ]
            for (const [key, value] of Object.entries(admins)){
                console.log('sending to admin')
                value.send(JSON.stringify(update))
            }
        }
        
    })
    ws.on('close', function () {
        ws.close()
        console.log('deleted: ' + id)
    })
})
app.get('/', (req, res) => {
    res.sendFile('hello world!');
})

server.listen(3000, () => console.log(`listen on port: 3000`))
