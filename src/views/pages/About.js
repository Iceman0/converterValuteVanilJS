function convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat)
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/')
}

let getPostsList = async () => {
    try {
        let myDate = convertDate(new Date());
        const myInit = {
            mode: 'no-cors',
            headers: {'Content-Type': 'text/xml'}
        };
        return await fetch(`https://www.cbr-xml-daily.ru/daily_json.js`)
            .then((response) => {
                return response.json();
            })
    } catch (err) {
        console.log('Error getting documents', err)
    }
}
let values = [];
let About = {
    render : async () => {
        let posts = await getPostsList();
        values = [];
        if (posts && posts.Valute) {
            values = Object.values(posts.Valute)
        }
        const date = new Date(posts.Date);
        const optionsDateFormat = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };
        let resultDate = date.toLocaleDateString('ru-RU', optionsDateFormat);
        const checkedCheckbox = (e) => {
            console.log(e);
        };
        let favorites = [];
        if (values && values.length) {
            for (let item of values) {
                if (localStorage[item.ID]) favorites.push(item)
            }
        }
        let view = (values && values.length) ? `
            <section class="section">
                <h1> Курсы валют </h1>
                <p>Последнее обновление: <b class="date">${resultDate}</b></p>
                <table class="data">
                  <tbody>
                    <tr>
                      <th class="firstTh">Избранное</th>
                      <th class="firstTh">Цифр. код</th>
                      <th class="firstTh">Букв. код</th>
                      <th class="firstTh">Единиц</th>
                      <th class="firstTh">Валюта</th>
                      <th class="firstTh">Курс</th>
                    </tr>
                    <tr>
                        ${ favorites.map((post, index) =>
                        ` <tr>
                            <th style="width: 100px; text-align: center"> 
                            <input type="checkbox" class="favorite" id=${post.ID}>
                            </th>
                            <th>${post.NumCode}</th>
                            <th>${post.CharCode}</th>
                            <th>${post.Nominal}</th>
                            <th>${post.Name}</th>
                            <th>${post.Value}</th>
                          </tr>`
                        ).join('\n ')
                        }
                        ${ values.filter(word => {if (!localStorage[word.ID]) return word}).map((post, index) =>
                        ` <tr>
                          <th style="width: 100px; text-align: center"> 
                          <input type="checkbox" class="favorite" id=${post.ID}>
                          </th>
                          <th>${post.NumCode}</th>
                          <th>${post.CharCode}</th>
                          <th>${post.Nominal}</th>
                          <th>${post.Name}</th>
                          <th>${post.Value}</th></tr>`
                            ).join('\n ')
                        }
                  </tbody>
                </table>
            </section>
        ` :  `
            <section class="section">
                <h1> Курсы валют! </h1>
            </section>
        `;
        return view;

    },
    after_render: async () => {
        let checkbox = document.querySelectorAll('.favorite');

        for (let item of checkbox) {
            if (localStorage[item.id]) item.checked = true;
            item.addEventListener('change', function () {
                if (this.checked && item.id) {
                    let id = item.id;
                    localStorage.setItem(id, values[id]);
                } else {
                    localStorage.removeItem(item.id);
                }
            });
        }
    }
        
}

export default About;