// JSONデータを読み込む
fetch('quiz.json')
    .then(response => response.json())
    .then(data => {
        // データを表示するためのHTML文字列を作成する
        const dataHTML = data.map(item => `
        <input type="checkbox" id="${item.date}">
                        <label class="box data-item ${item.subject}" for="${item.date}">
                            <div class="date" style="background: ${item.color};">${item.dateopen}</div>
                            <div class="right">
                                <div class="info">
                                    <span class="subject">${item.subject}</span>
                                    <span class="category">${item.category}</span>
                                </div>
                                <h3>${item.title} ${item.range}</h3>
                            </div>
                        </label>
                        <article>
                            <div class="inarea">
                                <p class="subj"><span style="background: ${item.color};">${item.subject}</span></p>
                                <h4>${item.title}</h4>
                                <h5 style="color: ${item.color};">${item.dateopen}</h5>
                                <p class="cate">${item.category}</p>
                                <p class="rang">範囲：${item.range}</p>
                                <p class="explain">${item.explain}</p>
                                <label for="${item.date}" class="close">閉じる</label>
                            </div>
                            <label class="backclose" for="${item.date}"></label>
                        </article>
`).join('');

        // HTMLにデータを表示するF
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
let countdown;

function updateCountdown(targetTime) {
    countdown = setInterval(function () {
        const now = new Date();
        const target = new Date(targetTime); // ターゲット日時を取得

        const remainTime = target - now;

        if (remainTime < 0) {
            clearInterval(countdown);
            // ここで新しい予定を読み込む関数を呼び出す
            loadNextSchedule();
            return false;
        }

        const difDay = Math.floor(remainTime / 1000 / 60 / 60 / 24);
        const difHour = Math.floor(remainTime / 1000 / 60 / 60) % 24;
        const difMin = Math.floor(remainTime / 1000 / 60) % 60;
        const difSec = Math.floor(remainTime / 1000) % 60;

        document.getElementById("countdown-day").textContent = difDay;
        document.getElementById("countdown-hour").textContent = difHour;
        document.getElementById("countdown-min").textContent = difMin;
        document.getElementById("countdown-sec").textContent = difSec;

    }, 1000);
}

function loadNextSchedule() {
    // ここでJSONファイルから次に開始が近い予定を読み込む処理を行う
    fetch('schedule.json')
        .then(response => response.json())
        .then(data => {
            // 今の時刻より未来の予定をフィルタリングし、最も近い予定を取得する
            const now = new Date();
            const futureEvents = data.filter(event => new Date(event.datestart + ' ' + event.datestarttime) > now);
            const nextEvent = futureEvents.reduce((closestEvent, event) => {
                const eventTime = new Date(event.datestart + ' ' + event.datestarttime);
                const closestEventTime = new Date(closestEvent.datestart + ' ' + closestEvent.datestarttime);
                return eventTime < closestEventTime ? event : closestEvent;
            }, futureEvents[0]);

            const targetDate = nextEvent.datestart;
            const targetTime = `${targetDate} ${nextEvent.datestarttime}`;
            const title = nextEvent.title;

            document.getElementById("countdown-title").textContent = `${title}まで`;
            updateCountdown(targetTime);
        })
        .catch(error => console.error('Error fetching schedule:', error));
}

// 初回読み込み時に最初の予定をロードする
loadNextSchedule();




// 今日の日付
var today = new Date();
var month = today.getMonth() + 1;
var day = today.getDate();
var date = today.toLocaleDateString('ja-JP', { weekday: 'short' });
var dateString = month + '/' + day + '（' + date + '）';
document.getElementById('today').textContent = dateString;




// 予定/スケジュールのやつ
// schedule.json ファイルのURL
const scheduleUrl = 'schedule.json';

// 日付文字列を解析して Date オブジェクトに変換する関数
function parseDate(dateString) {
    const [year, month, day] = dateString.split('/');
    return new Date(year, month - 1, day);
}

// 日付の差分を計算して返す関数
function getDaysDifference(dateString) {
    const today = new Date();
    const eventDate = parseDate(dateString);
    const timeDifference = eventDate.getTime() - today.getTime();
    const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return dayDifference;
}

// スケジュールデータを取得して表示する関数
async function populateSchedule() {
    try {
        // schedule.json ファイルの読み込み
        const response = await fetch(scheduleUrl);
        const scheduleData = await response.json();

        // スケジュールデータを表示する要素
        const scheduleBoxes = document.getElementById('scheduleboxes');

        // リロードメッセージを削除
        const reloadMessage = document.getElementById('reloadMessage');
        reloadMessage.parentNode.removeChild(reloadMessage);

        // scheduleData から各イベントの情報を取得し、HTML に挿入する
        scheduleData.forEach(event => {
            const { size, category, title, dateopen, plus, datestart, datefinish } = event;

            // 日付の差分を計算
            let daysDifference = '';
            if (datestart) {
                const daysDiff = getDaysDifference(datestart);
                if (daysDiff >= 2) {
                    daysDifference = `${daysDiff}日後`;
                } else if (daysDiff === 1) {
                    daysDifference = '明日';
                } else if (daysDiff === 0) {
                    daysDifference = '進行中';
                } else if (daysDiff < 0) {
                    daysDifference = '進行中';
                }
            }

            // スケジュールが終了している場合は非表示にする
            if (datefinish && parseDate(datefinish) < new Date()) {
                return;
            }

            // 各イベントの情報を HTML 形式で生成
            const htmlContent = `
        <article class="${size}" style="${datefinish && parseDate(datefinish) < new Date() ? 'display: none;' : ''}">
          <div class="top">
            <div>
                <p class="category">${category}</p>
                <h3>${title}</h3>
                <p class="date">${dateopen}</p>
            </div>
            ${datestart ? `<p class="datestart"><span>${daysDifference}</span></p>` : ''}
          </div>
          <p class="plus">${plus}</p>
        </article>
      `;

            // HTML を #scheduleboxes 要素に挿入
            scheduleBoxes.insertAdjacentHTML('beforeend', htmlContent);
        });
    } catch (error) {
        console.error('Error fetching or parsing schedule data: ', error);
    }
}

// ページ読み込み後に populateSchedule 関数を実行する
window.onload = populateSchedule;