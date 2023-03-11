fetch("quiz.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (quiz) {
        let placeholder = document.querySelector("#quiz-output");
        let out = "";
        for (let q of quiz) {
            out += `
			<div class="box">
                <div class="date" style="background: ${q.color};">${q.date}</div>
                <div class="right">
                    <div class="info">
                        <span class="subject">${q.subject}</span>
                        <span class="category">${q.category}</span>
                    </div>
                    <h3>${q.title} ${q.range}</h3>
                </div>
            </div>
		`;
        }

        placeholder.innerHTML = out;
    });


//
(async () => {
    const Data = await (await fetch("quiz.json")).json();
    const Out = document.querySelector("#quiz-output");

    const Highlight = (source, text) => source.replace(text, `<span style="background-color: #fb07; border-radius: 2px;">${text}</span>`)

    function Search(text) {
        [...Out.children].forEach(x => Out.removeChild(x));
        const Matched = [];
        const Others = [];
        for (const Info of Data.map(x => JSON.parse(JSON.stringify(x)))) {
            let matched = false;
            if (Info.title.includes(text)) {
                Info.title = Highlight(Info.title, text);
                matched = true;
            }
            if (Info.category.includes(text)) {
                Info.category = Highlight(Info.category, text);
                matched = true;
            }
            if (Info.subject.includes(text)) {
                Info.subject = Highlight(Info.subject, text);
                matched = true;
            }
            if (Info.range.includes(text)) {
                Info.range = Highlight(Info.range, text);
                matched = true;
            }
            if (Info.date.includes(text)) {
                Info.date = Highlight(Info.date, text);
                matched = true;
            }
            if (matched) Matched.push(Info);
            else Others.push(Info);
        }
        Matched.forEach(x => Out.appendChild(MakeElement(x)));
        Others.forEach(x => Out.appendChild(MakeElement(x)));
    }

    function MakeElement(q) {
        const result = document.createElement("div");
        result.className = "box";
        result.innerHTML = `\
        <div class="date" style="background: ${q.color};">${q.date}</div>
                <div class="right">
                    <div class="info">
                        <span class="subject">${q.subject}</span>
                        <span class="category">${q.category}</span>
                    </div>
                    <h3>${q.title} ${q.range}</h3>
                </div>`
        return result;
    }

    document.getElementById("quiz-search").oninput = e => Search(e.target.value);
})();

//カウントダウン
let countdown = setInterval(function () {
    const now = new Date()
    const target = new Date("2023/4/7 0:00:00") //ターゲット日時を取得
    const remainTime = target - now

    if (remainTime < 0) return false

    const difDay = Math.floor(remainTime / 1000 / 60 / 60 / 24)
    const difHour = Math.floor(remainTime / 1000 / 60 / 60) % 24
    const difMin = Math.floor(remainTime / 1000 / 60) % 60
    const difSec = Math.floor(remainTime / 1000) % 60

    document.getElementById("countdown-day").textContent = difDay
    document.getElementById("countdown-hour").textContent = difHour
    document.getElementById("countdown-min").textContent = difMin
    document.getElementById("countdown-sec").textContent = difSec

    if (remainTime < 0) clearInterval(countdown)

}, 1000)


var today = new Date();
var weekdays = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];
var weekday = weekdays[today.getDay()];

document.getElementById("day").innerHTML = weekday;