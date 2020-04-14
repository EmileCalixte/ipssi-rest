class OpenWeatherMapConnector {
    constructor() {

    }

    getWeather(latitude, longitude) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: OpenWeatherMapConnector.BASE_URI + 'weather',
                method: 'GET',
                data: {
                    appid: OpenWeatherMapConnector.APP_ID,
                    lat: latitude,
                    lon: longitude,
                },
                success: (data) => {
                    resolve(data);
                },
                error: (error) => {
                    reject(error);
                },
            })
        });
    }
}

OpenWeatherMapConnector.APP_ID = '8a1137489b86579295acd47e6e875f20';
OpenWeatherMapConnector.BASE_URI = 'https://api.openweathermap.org/data/2.5/';