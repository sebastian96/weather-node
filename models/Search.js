const fs = require('fs');
const axios = require('axios');

class Search {
    history = [];
    path = './db/data.json';

    constructor() {
        this.getData();
    }

    get paramsMapBox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsOpenWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es',
        }
    }

    async city(place = '') {
        const instance = axios.create({
            baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
            params: this.paramsMapBox
        })
        const response = await instance.get();

        return response.data.features.map(place => ({
            id: place.id,
            name: place.place_name,
            lng: place.center[0],
            lat: place.center[1],
        }));
    }

    async weatherCity(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsOpenWeather, lat, lon }
            })

            const response = await instance.get();
            const { weather, main } = response.data;

            return {
                description: weather[0].description,
                temp_min: main.temp_min,
                temp_max: main.temp_max,
                temp: main.temp
            };
        } catch (e) {
            console.error(e)
        }
    }

    addHistory(place = {}) {
        const exist = this.history.find(item => item.id === place.id);

        if (!exist) {
            this.history = [place, ...this.history];
        }

        this.history = this.history.splice(0, 5);

        this.saveData();
    }

    saveData() {
        const payload = {
            history: this.history
        };

        fs.writeFileSync(this.path, JSON.stringify(payload));
    }

    getData() {
        if (fs.existsSync(this.path)) {
            let data = fs.readFileSync(this.path, { encoding: 'utf-8' });
            data = JSON.parse(data);

            this.history = data.history;
        }
    }
}

module.exports = Search;