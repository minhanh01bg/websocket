// const { default: axios } = require('axios');
const url = require('url');
const { Vehicle,VehicleStateLog } = require('./models/ver1/models');
const { Bin,BinStateLog } = require('./models/ver1/models');

const webSocketServices = (wss) => {
    let vehicles = {};
    let gpss = {};
    let admins = {};
    let routing ={};
    wss.on('connection', function connection(ws, req) {
        console.log('A new client connected');
        // var userID = parseInt(req.url.substr(1), 10)
        // console.log(userID)

        const parameters = url.parse(req.url, true);
        let id = parameters.query.id;
        console.log(id);
        if (id[0] == 'v') {
            id = id.substr(id.length - 1);
            vehicles[id] = ws;
        }
        if (id[0] == 'g') {
            id = id.substr(id.length - 1);
            gpss[id] = ws;
        }
        if (id[0] == 'a') {
            id = id.substr(id.length - 1);
            admins[id] = ws;
        }
        if(id[0] == 'r'){
            id = id.substr(id.length - 1);
            routing[id] = ws;
        }
        ws.on('message', async function (message) {
            console.log(message);
            var messageArray = JSON.parse(message);
            let gps = messageArray['id'].substr(0, 3);
            if (gps == 'gps') {
                let gpsID = messageArray['id'].substr(4);
                console.log('gps connection ' + gpsID);
                let vehicle = vehicles[gpsID];
                const update = [
                    gpsID,
                    messageArray['lat'],
                    messageArray['long']
                ];
                if (vehicle) {
                    console.log('sending to vehicle');
                    vehicle.send(JSON.stringify(update));
                }
                await Vehicle.update(
                    {
                        latitude: messageArray['lat'],
                        longitude: messageArray['long']
                    },
                    {
                        where: {
                            id: gpsID
                        },
                        raw: true
                    }
                );
                // const getVehicle = async () => {
                //     try {
                //         const vehicledbs = await Vehicle.findAll({raw: true});

                //         return vehicledbs;
                //     } catch (err) {
                //         return err;
                //     }
                // };
                // let vehis = await getVehicle();
                // for (let i = 0; i < vehis.length; i++) {
                //     if (vehis[i].code == gpsID) {
                //         vehis[i].latitude = messageArray['lat'];
                //         vehis[i].longitude = messageArray['long'];
                //         console.log(
                //             vehis[i].latitude,
                //             vehis[i].longitude
                //         );
                //     }
                // }
                // console.log(vehis)
                // for (const [key, value] of Object.entries(admins)) {
                //     console.log('sending to admin');
                //     value.send(JSON.stringify(vehis));
                // }
                for (const [key, value] of Object.entries(admins)) {
                    console.log('sending to admin');
                    value.send(JSON.stringify(update));
                }
            }
            let vehicle = messageArray['id'].substr(0, 7);
            // console.log(vehicle);

            if (vehicle == 'vehicle') {
                let vehicleID = messageArray['id'].substr(
                    messageArray['id'].length - 1
                );
                console.log('vehicle connection ' + vehicleID);

                let vehicle_break = await Vehicle.findOne({
                    where: {
                        id: vehicleID
                    },
                    raw: true
                });
                await VehicleStateLog.create({
                    latitude:vehicle_break.latitude,
                    longitude:vehicle_break.longitude,
                    altitude:vehicle_break.altitude,
                    speed:vehicle_break.speed,
                    angle:vehicle_break.angle,
                    odometer:vehicle_break.odometer,
                    description:"car breakdown",
                    status:vehicle_break.status,
                    vehicleId:vehicle_break.id,
                },{raw: true});
                // update vehicleStatelog
                const update = ['alert', vehicle_break, 'car breakdown'];
                for (const [key, value] of Object.entries(admins)) {
                    console.log('sending to admin');
                    value.send(JSON.stringify(update));
                }
            }
            let bin = messageArray['id'].substr(0, 3);
            if (bin == 'bin') {
                let binID = messageArray['id'].substr(
                    messageArray['id'].length - 1
                );
                console.log('bin connection ' + binID);
                let bin_full = await Bin.findOne({
                    where: {
                        id: binID
                    },
                    raw: true
                });
                console.log(bin_full);
                await BinStateLog.create({
                    latitude:bin_full.latitude,
                    longitude:bin_full.longitude,
                    weight: bin_full.weight,
                    description:"bin full",
                    status: 'full',
                    binId:bin_full.id
                },
                    {raw: true}
                );
                const update = ['alert', bin_full, 'bin full'];
                for (const [key, value] of Object.entries(admins)) {
                    console.log('sending to admin');
                    value.send(JSON.stringify(update));
                }
            }
            let request = messageArray['id'].substr(0, messageArray['id'].length - 2);
            if(request == "request"){
                // let routeID = messageArray['id'].substr(
                //     messageArray['id'].length - 1
                // );
                console.log('request ');
                const update = [
                    messageArray['id'],
                    messageArray['bin'],
                    messageArray['vehicle']
                ];
                
                for (const [key, value] of Object.entries(routing)) {
                    console.log('sending to routing_machine');
                    value.send(JSON.stringify(update));
                }
            }
        });
        ws.on('close', function () {
            ws.close();
            console.log('deleted: ' + id);
        });
    });
};

module.exports = webSocketServices;
