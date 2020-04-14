class InseeConnector {
    constructor() {
        console.log('Retrieving access token from local storage');
        const localStorageAccessToken = this.getAccessTokenDataFromLocalStorage();
        if(localStorageAccessToken === null) {
            console.log('Access token data not found in local storage');
            this.generateNewAccessToken();
        } else {
            console.log('Access token found in local storage: ' + localStorageAccessToken.token);
        }

        this.refreshAccessTokenIfCurrentIsExpired();
        setInterval(() => {
            this.refreshAccessTokenIfCurrentIsExpired();
        }, 10000);

        $('#perform-request-button').on('click', () => {
            console.log('Button clicked to perform a sample request');
            this.performSampleRequest();
        });
    }

    generateNewAccessToken() {
        console.log('Generating new access token');
        $.ajax({
            async: false,
            url: InseeConnector.BASE_URI + 'token',
            method: 'POST',
            data: {
                grant_type: 'client_credentials',
                validity_period: 60,
                client_id: InseeConnector.CONSUMER_KEY,
                client_secret: InseeConnector.CONSUMER_SECRET,
            },
            success: (data) => {
                const expirationDate = new Date();
                expirationDate.setSeconds(expirationDate.getSeconds() + data.expires_in);
                this.setAccessTokenDataInLocalStorage(data.access_token, expirationDate, data.scope);
                console.log('Access token: ' + data.access_token);
            },
            error: (error) => {
                throw new Error(error);
            }
        });
    }

    refreshAccessTokenIfCurrentIsExpired() {
        console.log('Checking if current access token is expired');

        const currentTokenExpirationDate = this.getAccessTokenDataFromLocalStorage().expirationDate;

        if((new Date()) >= currentTokenExpirationDate) {
            this.generateNewAccessToken();
        }
    }

    setAccessTokenDataInLocalStorage(token, expirationDate, scope) {
        const localStorageAccessToken = {};
        localStorageAccessToken.token = token;
        localStorageAccessToken.expirationDate = expirationDate.toString();
        localStorageAccessToken.scope = scope;
        Util.setValueInLocalStorage('inseeAccessToken', JSON.stringify(localStorageAccessToken));
    }

    getAccessTokenDataFromLocalStorage() {
        let localStorageAccessToken = Util.getValueInLocalStorage('inseeAccessToken');

        if(localStorageAccessToken === null) {
            return null;
        }

        localStorageAccessToken = JSON.parse(localStorageAccessToken);

        if(localStorageAccessToken.token === undefined) {
            return null;
        }

        if(localStorageAccessToken.expirationDate === undefined) {
            return null;
        }

        if(localStorageAccessToken.scope === undefined) {
            return null;
        }

        return {
            token: localStorageAccessToken.token,
            expirationDate: new Date(localStorageAccessToken.expirationDate),
            scope: localStorageAccessToken.scope,
        };
    }

    performSampleRequest() {
        this.refreshAccessTokenIfCurrentIsExpired();
        const response = this.performSampleRequestAjaxCall();
        console.log('Request response', response);
    }

    performSampleRequestAjaxCall() {
        console.log('Calling API');
        let response;
        $.ajax({
            async: false,
            url: InseeConnector.NOMENCLATURES_BASE_URI + 'geo/commune/55323',
            headers: {
                Authorization: 'Bearer ' + this.getAccessTokenDataFromLocalStorage().token,
            },
            success: (data) => {
                response = data;
            },
            error: (error) => {
                throw new Error(error);
            }
        });

        return response;
    }
}

InseeConnector.BASE_URI = 'https://api.insee.fr/';
InseeConnector.NOMENCLATURES_BASE_URI = 'https://api.insee.fr/metadonnees/nomenclatures/v1/';
InseeConnector.CONSUMER_KEY = 'Mg9fodRmAVc4fYfRFZod3AS3U5Ma';
InseeConnector.CONSUMER_SECRET = 'sj4osijsZT0IJWx92kD6cyGgE3sa';