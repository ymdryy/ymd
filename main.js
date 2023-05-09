// JSONデータを読み込む
fetch('quiz.json')
    .then(response => response.json())
    .then(data => {
        // データを表示するためのHTML文字列を作成する
        const dataHTML = data.map(item => `
<div class="box data-item ${item.subject}">
        <div class="date" style="background: ${item.color};">${item.date}</div>
        <div class="right">
            <div class="info">
                <span class="subject">${item.subject}</span>
                <span class="category">${item.category}</span>
            </div>
            <h3>${item.title} ${item.range}</h3>
        </div>
    </div>
`).join('');

        // HTMLにデータを表示する
        const dataContainer = document.getElementById('data-container');
        dataContainer.innerHTML = dataHTML;

        // 選択されたフィルターボタンを追跡するための配列
        let selectedFilters = [];

        // ボタンを取得する
        const filterButtons = document.querySelectorAll('.filter-button');

        // ボタンがクリックされたら、データを絞り込んで表示する
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;

                // ボタンの選択状態を更新する
                if (selectedFilters.includes(filter)) {
                    // 選択を解除する
                    selectedFilters = selectedFilters.filter(f => f !== filter);
                    button.classList.remove('selected');
                } else {
                    // 選択する
                    selectedFilters.push(filter);
                    button.classList.add('selected');
                }

                // 選択されたデータアイテムのみ表示する
                const dataItems = document.querySelectorAll('.data-item');
                dataItems.forEach(item => {
                    const subjects = item.classList;
                    if (selectedFilters.length === 0 || Array.from(subjects).some(s => selectedFilters.includes(s))) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    });

//カウントダウン
let countdown = setInterval(function () {
    const now = new Date()
    const target = new Date("2023/5/22 8:45:00") //ターゲット日時を取得
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

// 今日の日付
var today = new Date();
var month = today.getMonth() + 1;
var day = today.getDate();
var date = today.toLocaleDateString('ja-JP', { weekday: 'short' });
var dateString = month + '/' + day + '（' + date + '）';
document.getElementById('today').textContent = dateString;