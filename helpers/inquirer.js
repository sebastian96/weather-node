const inquirer = require('inquirer');
require('colors');

const questions = [{
    type: 'list',
    name: 'option',
    message: 'What would you like to do?',
    choices: [{
            value: 1,
            name: `${ '1.'.green } Search city`
        },
        {
            value: 2,
            name: `${ '2.'.green } History`
        },
        {
            value: 0,
            name: `${ '0.'.green } Exit`
        }
    ]
}];

const getMenu = async() => {
    console.clear();
    console.log('=========================='.green);
    console.log('  Seleccione una opción'.white);
    console.log('==========================\n'.green);

    const { option } = await inquirer.prompt(questions);
    return option;
}

const pause = async() => {
    const question = [{
        type: 'input',
        name: 'enter',
        message: `Presione ${ 'enter'.green } para continuar`
    }];

    console.log('\n');
    await inquirer.prompt(question);
}

const readInput = async(message) => {

    const question = [{
        type: 'input',
        name: 'desc',
        message,
        validate(value) {
            if (value.length === 0) {
                return 'Por favor ingrese un valor';
            }
            return true;
        }
    }];
    const { desc } = await inquirer.prompt(question);
    return desc;
}

const listPlaces = async(places) => {
    const choices = places.map((place, i) => {
        const idx = `${i + 1}.`.green;

        return {
            value: place.id,
            name: `${idx} ${place.name}`
        }
    });

    choices.unshift({
        value: 0,
        name: '0.'.green + 'Cancelar'
    });

    const questions = [{
        type: 'list',
        name: 'id',
        message: 'seleccione un lugar',
        choices
    }]

    const { id } = await inquirer.prompt(questions);
    return id;
}

module.exports = {
    getMenu,
    pause,
    readInput,
    listPlaces
}