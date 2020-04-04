function carFactory(order) {
    let enginePower = [{
            power: 90,
            volume: 1800
        },
        {
            power: 120,
            volume: 2400
        },
        {
            power: 200,
            volume: 3500
        }
    ]
    let car = {
        model: order.model,
        engine: enginePower.find((p) => order.power <= p.power),
        color: order.color,
        carriage: {
            type: order.carriage,
            color: order.color
        },
        wheels: Array(4).fill(order.wheelsize % 2 === 0 ? order.wheelsize - 1 : order.wheelsize)
    };

    return car;
}
carFactory({
    model: 'Opel Vectra',
    power: 110,
    color: 'grey',
    carriage: 'coupe',
    wheelsize: 17
});
carFactory({
    model: 'VW Golf II',
    power: 90,
    color: 'blue',
    carriage: 'hatchback',
    wheelsize: 14
});