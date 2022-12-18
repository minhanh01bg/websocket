const base_url = 'ws://127.0.0.1:5000?id=routing_machine_1'
// const base_url = 'ws://192.168.1.86:3000/2'
// const base_url = 'ws://172.20.10.3:3000/2'

const socket = new WebSocket(base_url)


socket.addEventListener('open', function (event) {
    console.log('Connected to WS Server')
});
const reader = new FileReader();
// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server ', JSON.parse(event.data));
    // $('.chat').append(JSON.parse(event.data));
    var map = L.map('map');

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    data = JSON.parse(event.data)
    bin = data[1]
    vehicle = data[2]
    var control = L.Routing.control(L.extend(window.lrmConfig, {
        waypoints: [
            L.latLng(bin.lat, bin.long),
            L.latLng(vehicle.lat, vehicle.long)
        ],
        geocoder: L.Control.Geocoder.nominatim(),
        routeWhileDragging: true,
        reverseWaypoints: true,
        showAlternatives: true,
        altLineOptions: {
            styles: [
                {color: 'black', opacity: 0.15, weight: 9},
                {color: 'white', opacity: 0.8, weight: 6},
                {color: 'blue', opacity: 0.5, weight: 2}
            ]
        }
    }))
    .addTo(map);
    L.Routing.errorControl(control).addTo(map);
    let waypoints = control.getWaypoints();
    let routing = control.getRouter();
    let route = routing.route(waypoints, function(err, routes) {
        console.log(routes);
        for(let i = 0; i < routes[0].coordinates.length; i++) {
            console.log(routes[0].coordinates[i].lat);
            console.log(routes[0].coordinates[i].lng);
        }
    }, control.options);
    // console.log(routing)
    // for(let i = 0;i<waypoints.length;i++){
    //     console.log(waypoints[i].latLng.lat);
    //     console.log(waypoints[i].latLng.lng);
    // }
});

const sendMessage = () => {
    //let mess = $('#mess').val();
    let mess={
        id:"routing_1",
        //bin:[21.0419, 105.821],
        //vehicle:[21.03155, 105.83629]
    }
    socket.send(JSON.stringify(mess));
}