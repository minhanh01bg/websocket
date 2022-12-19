// Create WebSocket connection.
//const WebSocket = require('ws')
//const socket = new WebSocket('ws://localhost:3000?id=gps_1');
var dataTemporary = [[21.03155, 105.83629],
[21.03117, 105.83622],
[21.03061, 105.83612],
[21.03061, 105.83612],
[21.03051, 105.83613],
[21.03045, 105.83613],
[21.03037, 105.83609],
[21.03028, 105.83603],
[21.03005, 105.83585],
[21.02999, 105.83581],
[21.02999, 105.83581],
[21.02997, 105.83584],
[21.02996, 105.83587],
[21.02991, 105.83599],
[21.0297, 105.83591],
[21.0297, 105.83591],
[21.02966, 105.83602],
[21.02958, 105.83628],
[21.0295, 105.83652],
[21.02946, 105.83663],
[21.02944, 105.83672],
[21.02944, 105.83672],
[21.02872, 105.83644],
[21.02872, 105.83644],
[21.0287, 105.83657],
[21.02864, 105.83692],
[21.02863, 105.83701],
[21.02862, 105.83709],
[21.02856, 105.8374],
[21.02846, 105.83791],
[21.02843, 105.83803],
[21.0284, 105.83821],
[21.02838, 105.83832],
[21.02835, 105.83845],
[21.02826, 105.83877],
[21.02815, 105.83916],
[21.02791, 105.84004],
[21.02776, 105.84046],
[21.02776, 105.8405],
[21.02772, 105.84079],
[21.02767, 105.84121],
[21.02764, 105.84142],
[21.02763, 105.84151],
[21.02763, 105.84151],
[21.0275, 105.84151],
[21.02664, 105.84149],
[21.02649, 105.84149],
[21.02614, 105.8415],
[21.0261, 105.8415],
[21.02602, 105.8415],
[21.02602, 105.8415],
[21.02602, 105.84145],
[21.02603, 105.84107],
[21.02603, 105.84107],
[21.02602, 105.84145],
[21.02602, 105.8415],
[21.02602, 105.8415],
[21.0261, 105.8415],
[21.02614, 105.8415],
[21.02649, 105.84149],
[21.02664, 105.84149],
[21.0275, 105.84151],
[21.02763, 105.84151],
[21.02772, 105.84152],
[21.02818, 105.84153],
[21.02868, 105.84153],
[21.02882, 105.84154],
[21.02896, 105.84154],
[21.02947, 105.84155],
[21.02958, 105.84157],
[21.02975, 105.84159],
[21.02989, 105.84162],
[21.03011, 105.84166],
[21.03011, 105.84166],
[21.03023, 105.84156],
[21.03038, 105.84144],
[21.03054, 105.84132],
[21.03064, 105.84121],
[21.03091, 105.8409],
[21.03105, 105.84076],
[21.03109, 105.84067],
[21.03127, 105.8405],
[21.03133, 105.84044],
[21.03133, 105.84044],
[21.03142, 105.84046],
[21.03205, 105.84058],
[21.0324, 105.84064],
[21.0328, 105.84072],
[21.03285, 105.84072],
[21.03285, 105.84072],
[21.03279, 105.84104],
[21.03279, 105.84104]];
dataTemporary = dataTemporary.filter((item, index) => dataTemporary.indexOf(item) === index);
const base_url = 'ws://map-ws-exp.cleverapps.io?id=gps_3'
// const base_url = 'ws://192.168.1.86:3000/2'
// const base_url = 'ws://172.20.10.3:3000/2'

const ws = new WebSocket(base_url)

let connection_resolvers = [];
let checkConnection = () => {
return new Promise((resolve, reject) => {
    if (ws.readyState === WebSocket.OPEN) {
    resolve();
    }
    else {
    connection_resolvers.push({ resolve, reject });
    }
});
}

ws.addEventListener('open', () => {
connection_resolvers.forEach(r => r.resolve())
});

function updateService(dataTemporary) {
for (let i = 0; i < dataTemporary.length; i++) {
    setTimeout(function () {
    const gps = {
        id: "gps_3",
        lat: dataTemporary[i][0],
        long: dataTemporary[i][1]
    }
    ws.send(JSON.stringify(gps));
    }, 500 * i);
}
}

const sendMessage = () => {
checkConnection().then(() => {
        updateService(dataTemporary);
    });
}
// Connection opened
// socket.addEventListener('open', function (event) {
//     console.log('Connected to WS Server')
// });
// const reader = new FileReader();
// // Listen for messages
// socket.addEventListener('message', function (event) {
//     console.log('Message from server ', event.data);
//     $('.chat').append(JSON.parse(event.data));
// });

// const sendMessage = () => {
//     //let mess = $('#mess').val();
//     let mess={
//         id:"gps_1",
//         lat:123.213,
//         long:12313
//     }
//     //socket.on('open', function open() {
//         socket.send(JSON.stringify(mess));
//     //});
// }