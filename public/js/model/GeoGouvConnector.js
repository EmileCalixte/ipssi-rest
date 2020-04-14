class GeoGouvConnector {
    constructor() {
        this.openWeatherMapConnector = new OpenWeatherMapConnector();

        $('#location-input').on('input', (e) => {
            this.onInputChange(e.target.value);
        });

        this.apiCallTimeout;
    }

    onInputChange(inputValue) {
        console.log(inputValue);

        window.clearTimeout(this.apiCallTimeout);

        this.apiCallTimeout = window.setTimeout(async () => {
            this.performSearchRequest(inputValue);
        }, 200);
    }

    performSearchRequest(searchValue) {
        $.ajax({
            async: false,
            url: GeoGouvConnector.BASE_URI + 'search',
            method: 'GET',
            data: {
                q: searchValue,
            },
            success: (data) => {
                console.log(data);
                this.updateAutoCompletion(data.features);
            },
            error: (error) => {
                throw new Error(error);
            }
        });
    }

    updateAutoCompletion(responseItems) {
        const autoCompletionList = $('#location-autocompletion-list');
        autoCompletionList.empty();
        responseItems.forEach((item) => {
            const listElement = $('<li>');
            listElement.html('<a href="#">' + item.properties.label + '</a>');
            listElement.on('click', () => {
                console.log(item);
                this.openWeatherMapConnector.getWeather(item.geometry.coordinates[1], item.geometry.coordinates[0])
                    .then((weatherAPIResponse) => {
                        this.updateLocationWeather(weatherAPIResponse);
                    });
            });
            autoCompletionList.append(listElement);
        });
        console.log(responseItems);
    }

    updateLocationWeather(weatherAPIResponse) {
        console.log(weatherAPIResponse.weather[0].main);
        $('#location-weather').text('Weather: ' + weatherAPIResponse.weather[0].main + ' (' + weatherAPIResponse.weather[0].description + ')');
    }
}

GeoGouvConnector.BASE_URI = 'https://api-adresse.data.gouv.fr/';