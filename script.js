// ==========================
// 韓国語タイピングアプリ
// script.js Part 1
// ==========================

// --------------------------
// 画面
// --------------------------

const homeScreen = document.getElementById("homeScreen");
const studyScreen = document.getElementById("studyScreen");
const addScreen = document.getElementById("addScreen");
const listScreen = document.getElementById("listScreen");
const bulkScreen = document.getElementById("bulkScreen");
const studySettingScreen = document.getElementById("studySettingScreen");
const finishScreen = document.getElementById("finishScreen");

// --------------------------
// ホーム画面ボタン
// --------------------------

const studyBtn = document.getElementById("studyBtn");
const addBtn = document.getElementById("addBtn");
const listBtn = document.getElementById("listBtn");
const bulkBtn = document.getElementById("bulkBtn");

// --------------------------
// 戻るボタン
// --------------------------

const backHome1 = document.getElementById("backHome1");
const backHome2 = document.getElementById("backHome2");
const backHome3 = document.getElementById("backHome3");
const backHome4 = document.getElementById("backHome4");
const backHomeSetting = document.getElementById("backHomeSetting");
const restartStudyBtn = document.getElementById("restartStudyBtn");
const backHomeFinish = document.getElementById("backHomeFinish");

// --------------------------
// 学習画面
// --------------------------

const jpText = document.getElementById("jpText");
const answerInput = document.getElementById("answerInput");
const checkBtn = document.getElementById("checkBtn");
const showAnswerBtn = document.getElementById("showAnswerBtn");
const nextBtn = document.getElementById("nextBtn");
const resultArea = document.getElementById("resultArea");
const progressText = document.getElementById("progressText");

// --------------------------
// 学習設定
// --------------------------

const startIdInput = document.getElementById("startIdInput");
const questionCountInput = document.getElementById("questionCountInput");
const startStudyBtn = document.getElementById("startStudyBtn");

// --------------------------
// 一文追加
// --------------------------

const jpInput = document.getElementById("jpInput");
const krInput = document.getElementById("krInput");
const favoriteCheck = document.getElementById("favoriteCheck");
const saveSentence = document.getElementById("saveSentence");

// --------------------------
// 一覧
// --------------------------

const sentenceList = document.getElementById("sentenceList");

// --------------------------
// 一括登録
// --------------------------

const bulkText = document.getElementById("bulkText");
const bulkSaveBtn = document.getElementById("bulkSaveBtn");
const bulkResult = document.getElementById("bulkResult");

// --------------------------
// データ
// --------------------------

let questions = JSON.parse(localStorage.getItem("questions")) || [];

let currentIndex = 0;

let randomMode = false;

let studyList = [];

let editingId = null;

// ==========================
// script.js Part 2
// 画面切り替え
// ==========================

function hideAllScreens() {

    homeScreen.classList.add("hidden");
    studySettingScreen.classList.add("hidden");
    studyScreen.classList.add("hidden");
    addScreen.classList.add("hidden");
    listScreen.classList.add("hidden");
    bulkScreen.classList.add("hidden");
    finishScreen.classList.add("hidden");

}

function showScreen(screen) {

    hideAllScreens();
    screen.classList.remove("hidden");

}

// --------------------------
// ホーム画面ボタン
// --------------------------

studyBtn.addEventListener("click", () => {

    showScreen(studySettingScreen);

});

addBtn.addEventListener("click", () => {

    editingId = null;

    jpInput.value = "";
    krInput.value = "";
    favoriteCheck.checked = false;

    saveSentence.textContent = "保存";

    showScreen(addScreen);

});

listBtn.addEventListener("click", () => {

    renderSentenceList();
    showScreen(listScreen);

});

bulkBtn.addEventListener("click", () => {

    bulkResult.innerHTML = "";
    bulkText.value = "";

    showScreen(bulkScreen);

});


// --------------------------
// ホームへ戻る
// --------------------------

backHome1.addEventListener("click", () => {

    showScreen(homeScreen);

});

backHome2.addEventListener("click", () => {

    showScreen(homeScreen);

});

backHome3.addEventListener("click", () => {

    showScreen(homeScreen);

});

backHome4.addEventListener("click", () => {

    showScreen(homeScreen);

});

backHomeSetting.addEventListener("click", () => {

    showScreen(homeScreen);

});

backHomeFinish.addEventListener("click", () => {

    showScreen(homeScreen);

});

restartStudyBtn.addEventListener("click", () => {

    currentIndex = 0;

    showScreen(studyScreen);

    jpText.textContent = studyList[currentIndex].jp;

    progressText.textContent =
        `${currentIndex + 1} / ${studyList.length} 問`;

    answerInput.value = "";
    resultArea.textContent = "";

    checkBtn.disabled = false;
    nextBtn.disabled = false;

});

// ==========================
// script.js Part 3
// 一文追加・一覧表示
// ==========================

// --------------------------
// IDを取得
// --------------------------

function getNextId() {

    if (questions.length === 0) {
        return 1;
    }

    return Math.max(...questions.map(q => q.id || 0)) + 1;

}

// --------------------------
// 一文追加
// --------------------------

saveSentence.addEventListener("click", () => {

    const jp = jpInput.value.trim();
    const kr = krInput.value.trim();

    if (jp === "" || kr === "") {

        alert("日本語と韓国語を入力してください。");
        return;

    }

    // 編集モード
    if (editingId !== null) {

        saveSentence.textContent = "保存";

        const target = questions.find(q => q.id === editingId);

        if (target) {

            target.jp = jp;
            target.kr = kr;
            target.favorite = favoriteCheck.checked;

        }

        localStorage.setItem(
            "questions",
            JSON.stringify(questions)
        );

        editingId = null;

        jpInput.value = "";
        krInput.value = "";
        favoriteCheck.checked = false;

        alert("更新しました！");

        showScreen(listScreen);
        renderSentenceList();

        return;

    }

    questions.push({

        id: getNextId(),
        jp: jp,
        kr: kr,
        favorite: favoriteCheck.checked

    });

    localStorage.setItem(
        "questions",
        JSON.stringify(questions)
    );

    jpInput.value = "";
    krInput.value = "";
    favoriteCheck.checked = false;

    alert("保存しました！");

});

// --------------------------
// 一覧表示
// --------------------------

function renderSentenceList() {

    sentenceList.innerHTML = "";

    if (questions.length === 0) {

        sentenceList.innerHTML = "<p>まだ例文がありません。</p>";
        return;

    }

    questions.forEach((q) => {

        const card = document.createElement("div");

        card.className = "sentenceCard";

        card.innerHTML = `

            <div class="sentenceId">
                ${q.id}
            </div>

            <p class="jpSentence">
                ${q.jp}
            </p>

            <p class="krSentence">
                ${q.kr}
            </p>

            <p>
                ${q.favorite ? "⭐ お気に入り" : ""}
            </p>

            <div class="buttonRow">

                <button class="editBtn" data-id="${q.id}">
                    編集
                </button>

                <button class="deleteBtn" data-id="${q.id}">
                    削除
                </button>

            </div>

        `;

        sentenceList.appendChild(card);

    });

    // 編集ボタン
    document.querySelectorAll(".editBtn").forEach(btn => {

        btn.addEventListener("click", () => {

            const id = Number(btn.dataset.id);

            const sentence = questions.find(q => q.id === id);

            if (!sentence) return;

            editingId = id;

            jpInput.value = sentence.jp;
            krInput.value = sentence.kr;
            favoriteCheck.checked = sentence.favorite;

            saveSentence.textContent = "更新";

            showScreen(addScreen);

        });

    });


    // 削除ボタン
    document.querySelectorAll(".deleteBtn").forEach(btn => {

        btn.addEventListener("click", () => {

            const id = Number(btn.dataset.id);

            const ok = confirm("本当に削除しますか？");

            if (!ok) return;

            questions = questions.filter(q => q.id !== id);

            localStorage.setItem(
                "questions",
                JSON.stringify(questions)
            );

            renderSentenceList();

        });

    });
}

// ==========================
// script.js Part 4
// 一括登録
// ==========================

bulkSaveBtn.addEventListener("click", () => {

    const text = bulkText.value.trim();

    if (text === "") {

        alert("入力してください。");
        return;

    }

    const lines = text.split("\n");

    let added = 0;
    let duplicated = 0;

    lines.forEach((line) => {

        const parts = line.split("|");

        if (parts.length !== 2) {
            return;
        }

        const jp = parts[0].trim();
        const kr = parts[1].trim();

        if (jp === "" || kr === "") {
            return;
        }

        // 重複チェック
        const exists = questions.some((q) => {

            return q.jp === jp && q.kr === kr;

        });

        if (exists) {

            duplicated++;
            return;

        }

        questions.push({

            id: getNextId(),
            jp: jp,
            kr: kr,
            favorite: false

        });

        added++;

    });

    localStorage.setItem(

        "questions",
        JSON.stringify(questions)

    );

    // 結果表示

    if (added === 0 && duplicated > 0) {

        bulkResult.innerHTML =
            `ℹ️ これらの例文はすべて登録済みです。`;

    } else {

        bulkResult.innerHTML =
            `✅ ${added}件追加されました。`;

        if (duplicated > 0) {

            bulkResult.innerHTML +=
                `<br>ℹ️ 重複した${duplicated}件は追加されませんでした。`;

        }

    }

    bulkText.value = "";


});

// ==========================
// 学習開始
// ==========================

startStudyBtn.addEventListener("click", () => {

    const startId = Number(startIdInput.value);

    const questionCount = Number(questionCountInput.value);

    const studyMode =
        document.querySelector('input[name="studyMode"]:checked').value;

    // 指定範囲の例文だけ取得
    studyList = questions.filter(q => {

        return q.id >= startId &&
            q.id < startId + questionCount;

    });

    // 範囲に例文が無い
    if (studyList.length === 0) {

        alert("指定した範囲に例文がありません。");
        return;

    }

    // ランダム
    if (studyMode === "random") {

        studyList.sort(() => Math.random() - 0.5);

    }

    currentIndex = 0;

    showScreen(studyScreen);

    jpText.textContent = studyList[currentIndex].jp;

    progressText.textContent =
        `${currentIndex + 1} / ${studyList.length} 問`;

    answerInput.value = "";
    resultArea.textContent = "";

    checkBtn.disabled = false;
    nextBtn.disabled = false;

});

// ==========================
// 判定
// ==========================

checkBtn.addEventListener("click", () => {

    const answer = answerInput.value.trim();

    const correct = studyList[currentIndex].kr.trim();

    if (answer === "") {

        alert("韓国語を入力してください。");
        return;

    }

    if (answer === correct) {

        resultArea.textContent = "⭕ 正解！";
        resultArea.className = "correct";

    } else {

        resultArea.innerHTML =
            `<span style="color:#d1242f;">❌ 不正解</span><br><br>
            <span style="color:#222;">答え：${correct}</span>`;

        resultArea.className = "wrong";

    }

    checkBtn.disabled = true;
    nextBtn.disabled = false;

});

// ==========================
// 次へ
// ==========================

nextBtn.addEventListener("click", () => {

    currentIndex++;

    // 学習終了
    if (currentIndex >= studyList.length) {

        showScreen(finishScreen);

        return;

    }

    // 次の問題を表示
    jpText.textContent = studyList[currentIndex].jp;

    progressText.textContent =
        `${currentIndex + 1} / ${studyList.length} 問`;

    answerInput.value = "";
    resultArea.textContent = "";

    checkBtn.disabled = false;
    nextBtn.disabled = false;

});

// ==========================
// わからない
// ==========================

showAnswerBtn.addEventListener("click", () => {

    const correct = studyList[currentIndex].kr;

    resultArea.innerHTML =
        `<span style="color:#222;">答え：${correct}</span>`;

    resultArea.className = "";

});