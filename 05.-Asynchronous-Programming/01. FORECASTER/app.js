function attachEvents() {

    let BASE_URL = `https://judgetests.firebaseio.com/locations.json`;
    let TODAY_URL = `https://judgetests.firebaseio.com/forecast/{status}/{code}.json`;

    const inputLocation = document.getElementById('location');
    const submitBtn = document.getElementById('submit');
    const notifyHeading = document.getElementsByClassName('notification')[0];
    const currentDiv = document.getElementById('current');
    const upcomingDiv = document.getElementById('upcoming');

    const forecastDiv = document.getElementById('forecast');

    const errorHandler = (e) => {
        notifyHeading.textContent = e.message;
    }

    const weatherSymbols = {
        'sunny': '☀',
        'partly sunny': '⛅',
        'overcast': '☁',
        'rain': '☂',
        'degrees': '°'
    }

    const jsonResponse = (r) => r.json();

    submitBtn.addEventListener('click', submitHandler);

    function submitHandler() {
        const location = inputLocation.value;

        fetch(BASE_URL)
            .then(jsonResponse)
            .then(data => {
                // console.log(data);
                const {
                    name,
                    code
                } = data.find((obj) => obj.name === location);
                // console.log(locationData);
                // TODAY_URL = TODAY_URL.replace('{status}/{code}', `today/${code}`);
                TODAY_URL = `https://judgetests.firebaseio.com/forecast/today/${code}.json`;
                UPCOMING_URL = `https://judgetests.firebaseio.com/forecast/upcoming/${code}.json`;

                Promise.all([
                        fetch(TODAY_URL).then(jsonResponse),
                        fetch(UPCOMING_URL).then(jsonResponse)
                    ])
                    .then(showLocationForecast)
                    .catch(errorHandler);

                // fetch(TODAY_URL)
                // .then(jsonResponse)
                // .then(data=>{
                //     console.log(data);
                // })
                // .catch(errorHandler);
            })
            .catch(errorHandler)
    }

    function showLocationForecast(responses) {
        const [todayData, upcomingData] = responses;

        let forecastsDIV = createHTMLElement('div', ['forecasts']);

        const {
            condition,
            high,
            low
        } = todayData.forecast;
        let weatherSymbol = weatherSymbols[condition.toLowerCase()];
        let symbolSPAN = createHTMLElement('span', ['condition', 'symbol'], weatherSymbol);

        let conditionSPAN = createHTMLElement('span', ['condition']);

        let forecastFirstDataSPAN = createHTMLElement('span', ['forecast-data'], todayData.name);

        let temperature = `${low}${weatherSymbols.degrees}/${high}${weatherSymbols.degrees}`;
        let forecastSecondDataSPAN = createHTMLElement('span', ['forecast-data'], temperature);

        let forecastThirdDataSPAN = createHTMLElement('span', ['forecast-data'], condition);

        conditionSPAN.appendChild(forecastFirstDataSPAN);
        conditionSPAN.appendChild(forecastSecondDataSPAN);
        conditionSPAN.appendChild(forecastThirdDataSPAN);

        forecastsDIV.appendChild(symbolSPAN);
        forecastsDIV.appendChild(conditionSPAN);

        currentDiv.appendChild(forecastsDIV);
        forecastDiv.style.display = 'block';

        showLocationUpcomingForecast(upcomingData);

    }

    function showLocationUpcomingForecast(upcomingData) {
        const {
            forecast,
            name
        } = upcomingData;

        let forecastInfoDIV = createHTMLElement('div', ['forecast-info']);
        forecast.forEach((day) => {
            let upcomingSPAN = createHTMLElement('span', ['upcoming']);

            let weatherSymbol = weatherSymbols[day.condition.toLowerCase()];
            let symbolSPAN = createHTMLElement('span', ['symbol'], weatherSymbol);

            let temperature = `${day.low}${weatherSymbols.degrees}/${day.high}${weatherSymbols.degrees}`;
            let degreeSPAN = createHTMLElement('span', ['forecast-data'], temperature);

            let conditionSPAN = createHTMLElement('span', ['forecast-data'], day.condition);

            upcomingSPAN.appendChild(symbolSPAN);
            upcomingSPAN.appendChild(degreeSPAN);
            upcomingSPAN.appendChild(conditionSPAN);

            forecastInfoDIV.appendChild(upcomingSPAN);
        });

        upcomingDiv.appendChild(forecastInfoDIV);
    }
}

function createHTMLElement(tag, classNames, textContent) {
    let element = document.createElement(tag);

    if (classNames) {
        element.classList.add(...classNames);
    }

    if (textContent) {
        element.textContent = textContent;
    }

    return element;
}

attachEvents();