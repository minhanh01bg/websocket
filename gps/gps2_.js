var dataTemporary = [
    [21.03063, 105.81699],
    [21.03065, 105.81716],
    [21.03067, 105.81726],
    [21.03067, 105.81726],
    [21.03086, 105.81722],
    [21.03086, 105.81722],
    [21.03088, 105.81735],
    [21.03097, 105.818],
    [21.03097, 105.818],
    [21.03108, 105.81798],
    [21.03112, 105.81798],
    [21.03112, 105.81798],
    [21.03114, 105.81814],
    [21.03128, 105.81913],
    [21.03131, 105.81938],
    [21.03135, 105.81965],
    [21.03138, 105.81983],
    [21.0314, 105.81997],
    [21.03142, 105.8201],
    [21.03146, 105.82037],
    [21.03148, 105.82047],
    [21.0315, 105.82063],
    [21.03155, 105.82101],
    [21.03155, 105.82101],
    [21.03158, 105.82118],
    [21.03165, 105.82121],
    [21.0318, 105.82138],
    [21.0318, 105.82138],
    [21.0316, 105.8215],
    [21.03148, 105.82157],
    [21.03131, 105.82166],
    [21.03115, 105.82169],
    [21.03108, 105.82172],
    [21.03077, 105.82202],
    [21.03065, 105.82213],
    [21.03037, 105.82243],
    [21.03026, 105.82254],
    [21.03018, 105.82261],
    [21.03003, 105.82276],
    [21.02991, 105.82288],
    [21.02948, 105.82329],
    [21.02934, 105.82342],
    [21.02916, 105.82359],
    [21.0291, 105.82364],
    [21.02906, 105.82368],
    [21.02902, 105.82371],
    [21.02898, 105.82375],
    [21.02876, 105.82395],
    [21.02871, 105.82399],
    [21.0285, 105.82418],
    [21.02835, 105.82431],
    [21.02792, 105.82469],
    [21.02783, 105.82476],
    [21.02783, 105.82476],
    [21.02805, 105.82503],
    [21.02825, 105.82528],
    [21.02841, 105.82551],
    [21.02871, 105.82595],
    [21.02871, 105.82595],
    [21.02856, 105.82607],
    [21.02846, 105.82593],
    [21.02841, 105.82586],
    [21.02825, 105.82564],
    [21.02811, 105.82547],
    [21.02773, 105.82497],
    [21.02773, 105.82497],
    [21.02763, 105.82484],
    [21.02763, 105.82484],
    [21.02756, 105.82491],
    [21.02735, 105.82509],
    [21.02717, 105.82527],
    [21.02697, 105.82557],
    [21.02686, 105.82574],
    [21.02679, 105.82589],
    [21.02666, 105.82619],
    [21.02655, 105.8265],
    [21.02653, 105.82656],
    [21.02643, 105.82688],
    [21.02635, 105.82712],
    [21.02621, 105.82752],
    [21.02621, 105.82752],
    [21.02636, 105.82756],
    [21.02636, 105.82756],
    [21.02632, 105.82772],
    [21.02632, 105.82772],
    [21.02649, 105.82777],
    [21.02653, 105.8278],
    [21.02668, 105.82786],
    [21.02672, 105.82786],
    [21.02672, 105.82786],
    [21.02679, 105.82788],
    [21.02687, 105.82786],
    [21.02687, 105.82786],
    [21.02694, 105.82793],
    [21.02705, 105.82807],
    [21.02736, 105.82871],
    [21.02749, 105.82898],
    [21.02755, 105.82911],
    [21.02769, 105.82943],
    [21.02774, 105.82963],
    [21.02765, 105.83019],
    [21.0276, 105.83058],
    [21.02753, 105.83105],
    [21.02753, 105.8312],
    [21.02755, 105.83132],
    [21.02758, 105.83144],
    [21.02762, 105.83151],
    [21.02766, 105.83154],
    [21.02801, 105.83161],
    [21.02819, 105.83165],
    [21.02819, 105.83165],
    [21.02813, 105.83189],
    [21.02813, 105.83189]
];
dataTemporary = dataTemporary.filter((item, index) => dataTemporary.indexOf(item) === index);
const base_url = 'ws://map-ws-exp.cleverapps.io?id=gps_2'
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
        id: "gps_2",
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