require('dotenv').config();

const { getMenu, pause, readInput, listPlaces } = require("./helpers/inquirer");
const Search = require('./models/Search');

const main = async() => {
    const searches = new Search();
    let menuOption;

    do {
        menuOption = await getMenu();

        switch (menuOption) {
            case 1:
                const place = await readInput('Ciudad: ');
                const places = await searches.city(place);
                const chosePlace = await listPlaces(places);

                if (chosePlace === 0) continue;

                const findPlace = places.find(place => place.id === chosePlace);

                searches.addHistory(findPlace);

                const weather = await searches.weatherCity(findPlace.lat, findPlace.lng);

                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', findPlace.name.green);
                console.log('Clima:', weather.description.green);
                console.log('Temperatura:', `${weather.temp}°C`.green);
                console.log('Temperatura minima:', `${weather.temp_min}°C`.green);
                console.log('Temperatura maxima:', `${weather.temp_max}°C`.green);
                console.log('Latitud:', `${findPlace.lat}`.green);
                console.log('Longitud:', `${findPlace.lng}`.green);

                break;
            case 2:
                searches.history.forEach((place, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${place.name}`)
                });



        }

        if (menuOption !== 0) await pause();

    } while (menuOption !== 0);
}


main();