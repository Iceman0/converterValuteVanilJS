// --------------------------------
//  Define Data Sources
// --------------------------------
const axios = require('axios');
import sass from '../../css/index.sass';

let getPostsList = async () => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const response = await fetch(`https://5bb634f6695f8d001496c082.mockapi.io/api/posts`, options)
        const json = await response.json();
        // console.log(json)
        return json
    } catch (err) {
        console.log('Error getting documents', err)
    }
}

let Home = {
    render: async () => {
        let posts = await getPostsList()
        let view = /*html*/`
            <section class="section">
                <div class="converter">
                    <div class="container">
                        <h2>Конвертер валют</h2>
                        <p>Последнее обновление: <b class="date">31.01.2021 10:35:57</b></p>
                        <div class="group">
                            <input type="number" class="first-input">
                            <select class="first-select"></select>
        
                            <input type="number" class="second-input">
                            <select class="second-select"></select>
                        </div>
                    </div>
                </div>
            </section>
        `
        return view
    }
    , after_render: async () => {
        const container = document.querySelector('.container .group');
        const currencyDate = document.querySelector('.container .date');

        const firstInput = container.querySelector('.first-input');
        const secondInput = container.querySelector('.second-input');

        const firstSelect = container.querySelector('.first-select');
        const secondSelect = container.querySelector('.second-select');

        firstInput.addEventListener('input', () => firstHandle());
        secondInput.addEventListener('input', () => secondHandle());

        firstSelect.addEventListener('change', () => firstHandle());
        secondSelect.addEventListener('change', () => secondHandle());

        const firstHandle = () => {
            const value = firstInput.value;
            const currency = firstSelect.options[firstSelect.selectedIndex].dataset.currency;
            secondInput.value = value * currency;
        };
        const secondHandle = () => {
            const value = secondInput.value;
            const currency = secondSelect.options[secondSelect.selectedIndex].dataset.currency;
            firstInput.value = value * currency;
        };

        const handleInput = () => {
            const first = firstSelect.options[firstSelect.selectedIndex].dataset.currency;
            const second = secondSelect.options[secondSelect.selectedIndex].dataset.currency;

            firstInput.value = 1;
            firstHandle();
        };

        const handleRequest = ({ data }) => {
            const date = new Date(data.Date);
            const optionsDateFormat = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            };

            currencyDate.innerHTML = date.toLocaleDateString('ru-RU', optionsDateFormat);


            Object.values(data.Valute).forEach(valute => {
                const option = document.createElement('option');
                const option2 = document.createElement('option');

                option.innerHTML = valute.Name;
                option.dataset.currency = valute.Value;
                if (valute.CharCode === 'EUR')
                    option.selected = true;

                option2.innerHTML = valute.Name;
                option2.dataset.currency = valute.Value;
                if (valute.CharCode === 'RUB')
                    option2.selected = true;

                firstSelect.append(option);
                secondSelect.append(option2);
            });

            handleInput();
        }

        const options = {
            headers: { 'Content-Type': 'application/json' }
        }
        axios.get('https://www.cbr-xml-daily.ru/daily_json.js', options)
            .then(handleRequest).catch();
    }

}

export default Home;