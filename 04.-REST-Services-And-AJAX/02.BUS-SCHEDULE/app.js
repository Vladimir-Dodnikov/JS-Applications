function solve() {
    //get DOM elements
    const infoSpan = document.getElementsByClassName('info')[0];
    const departBtn = document.getElementById('depart');
    const arriveBtn = document.getElementById('arrive');

    let currentId = 'depot';
    let currentName;

    function depart() {
        fetch(`https://judgetests.firebaseio.com/schedule/${currentId}.json`)
            .then(response => response.json())
            .then(departSucceed)
            .catch(err => {
                infoSpan.textContent = `Invalid station ID!`;
                console.log(err);
            })
    }

    function arrive() {
        infoSpan.textContent = `Arriving at ${currentName}`;

        departBtn.disabled = false;
        arriveBtn.disabled = true;
    }

    function departSucceed(data) {
        const {
            name,
            next
        } = data;

        currentId = next;
        currentName = name;

        departBtn.disabled = true;
        arriveBtn.disabled = false;
        infoSpan.textContent = `Next stop ${currentName}`;
    }

    return {
        depart,
        arrive
    };
}

let result = solve();