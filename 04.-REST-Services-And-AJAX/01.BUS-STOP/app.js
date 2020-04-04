function getInfo() {
    const stopId = document.getElementById('stopId');
    const stopNameDiv = document.getElementById('stopName');
    const busesLi = document.getElementById('buses');

    const busesURL = `https://judgetests.firebaseio.com/businfo/${stopId.value}.json`;
    //clear field
    stopNameDiv.textContent = '';
    busesLi.innerHTML = '';
    //ajax
    fetch(busesURL)
        .then(response => response.json())
        .then(data => {
            //DOM manipulation
            const {name, buses} = data; //destructuring
            stopNameDiv.textContent = name;
            Object.entries(buses)
            .forEach(([busId, busTime]) => {
                const li = document.createElement('li');
                li.textContent = `Bus ${busId} arrives in ${busTime} minutes.`;
                busesLi.appendChild(li);
            });
        })
        .catch((err)=>{
            stopNameDiv.textContent = 'Error';
        })
}