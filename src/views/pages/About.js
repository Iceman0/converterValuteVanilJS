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

let About = {
    render : async () => {
        let posts = await getPostsList();
        let values = [];
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
        let view = (values && values.length) ? `
            <section class="section">
                <h1> Курсы валют </h1>
                <p>Последнее обновление: <b class="date">${resultDate}</b></p>
                <table class="data">
                  <tbody>
                    <tr>
                      <th class="firstTh">Цифр. код</th>
                      <th class="firstTh">Букв. код</th>
                      <th class="firstTh">Единиц</th>
                      <th class="firstTh">Валюта</th>
                      <th class="firstTh">Курс</th>
                    </tr>
                    <tr>
                        ${ values.map(post =>
                        ` <tr>
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
    after_render: async () => {}
        
}

export default About;