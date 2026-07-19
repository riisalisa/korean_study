/* ==========================
   画面取得
========================== */

const homeScreen = document.getElementById("homeScreen");
const studySettingScreen = document.getElementById("studySettingScreen");
const studyScreen = document.getElementById("studyScreen");
const addScreen = document.getElementById("addScreen");
const listScreen = document.getElementById("listScreen");
const bulkScreen = document.getElementById("bulkScreen");
const finishScreen = document.getElementById("finishScreen");

/* 全画面 */
const screens = document.querySelectorAll(".screen");


/* ==========================
   ボタン取得
========================== */

/* ホーム */
const studyBtn = document.getElementById("studyBtn");
const addBtn = document.getElementById("addBtn");
const bulkBtn = document.getElementById("bulkBtn");
const listBtn = document.getElementById("listBtn");

/* 戻る */
const backHomeSetting = document.getElementById("backHomeSetting");
const backHome1 = document.getElementById("backHome1");
const backHome2 = document.getElementById("backHome2");
const backHome3 = document.getElementById("backHome3");
const backHome4 = document.getElementById("backHome4");
const backHomeFinish = document.getElementById("backHomeFinish");

/* 学習 */
const startStudyBtn = document.getElementById("startStudyBtn");
const showAnswerBtn = document.getElementById("showAnswerBtn");
const checkBtn = document.getElementById("checkBtn");
const restartStudyBtn = document.getElementById("restartStudyBtn");
const speakBtn = document.getElementById("speakBtn");
const reviewBtn = document.getElementById("reviewBtn");
const reviewIcon = document.getElementById("reviewIcon");

/* 例文追加・一括登録 */
const saveSentence = document.getElementById("saveSentence");
const bulkSaveBtn = document.getElementById("bulkSaveBtn");

/* 例文一覧　*/
const normalModeBtn = document.getElementById("normalModeBtn");
const cardModeBtn = document.getElementById("cardModeBtn");

/* 編集ダイアログ */
const cancelEditBtn = document.getElementById("cancelEditBtn");
const saveEditBtn = document.getElementById("saveEditBtn");

/* ==========================
   入力欄取得
========================== */

/* 学習設定 */
const startIdInput = document.getElementById("startIdInput");
const questionCountInput = document.getElementById("questionCountInput");

/* 学習 */
const answerInput = document.getElementById("answerInput");

/* 例文追加 */
const languageSelect = document.getElementById("languageSelect");
const jpInput = document.getElementById("jpInput");
const krInput = document.getElementById("krInput");
const favoriteCheck = document.getElementById("favoriteCheck");

/* 一括登録 */
const bulkText = document.getElementById("bulkText");

/* 編集ダイアログ */
const editJpInput = document.getElementById("editJpInput");
const editKrInput = document.getElementById("editKrInput");
const editFavoriteCheck = document.getElementById("editFavoriteCheck");


/* ==========================
   表示エリア取得
========================== */

/* 学習 */
const progressText = document.getElementById("progressText");
const jpText = document.getElementById("jpText");
const resultArea = document.getElementById("resultArea");
const answerArea = document.getElementById("answerArea");

/* 一括登録 */
const bulkResult = document.getElementById("bulkResult");

/* 例文一覧 */
const sentenceList = document.getElementById("sentenceList");

/* 編集ダイアログ */
const editModal = document.getElementById("editModal");


/* ==========================
   状態変数（State）
========================== */

/* 保存されている例文 */
let questions = [];

/* 学習で使用する例文 */
let studyList = [];

/* 現在の問題番号 */
let currentIndex = 0;

/* 答えを表示しているか */
let answerVisible = false;

/* 判定済みか */
let answered = false;

/* 編集中の例文 */
let editingQuestion = null;

/* 編集前の内容 */
let originalEditData = null;

/* 例文一覧の表示モード
   false = 通常
   true = 暗記カード */
let cardMode = false;

/* ==========================
   共通処理（Common）
========================== */

/* 画面を切り替える */
function showScreen(screen) {

    document
        .querySelectorAll(".screen")
        .forEach(s => s.classList.add("hidden"));

    screen.classList.remove("hidden");

}

/* データを保存 */
function saveQuestions() {

    localStorage.setItem(
        "questions",
        JSON.stringify(questions)
    );

}

/* データを読み込む */
function loadQuestions() {

    const saved =
        localStorage.getItem("questions");

    if (saved) {

        questions = JSON.parse(saved);

    }

}

/* 例文追加フォームを初期化 */
function clearAddForm() {

    languageSelect.value = "ko";

    jpInput.value = "";

    krInput.value = "";

    favoriteCheck.checked = false;

}

/* 音声を読み上げる */
function speak(text, language) {

    if (!text) return;

    speechSynthesis.cancel();

    const utterance =
        new SpeechSynthesisUtterance(text);

    utterance.lang = language;

    speechSynthesis.speak(utterance);

}

/* 音声ボタンを表示 */
function showSpeakButton() {

    speakBtn.classList.add("show");

}

/* 音声ボタンを非表示 */
function hideSpeakButton() {

    speakBtn.classList.remove("show");

}

/* 編集内容が変更されたか確認 */
function updateSaveButton() {

    const changed =

        editJpInput.value.trim() !== originalEditData.jp ||

        editKrInput.value.trim() !== originalEditData.kr ||

        editFavoriteCheck.checked !==
        originalEditData.review

    saveEditBtn.disabled = !changed;

}

/* ==========================
   ホーム画面（Home）
========================== */

/* 学習画面へ */
studyBtn.addEventListener("click", () => {

    showScreen(studySettingScreen);

});

/* 例文追加画面へ */
addBtn.addEventListener("click", () => {

    clearAddForm();

    showScreen(addScreen);

});

/* 一括登録画面へ */
bulkBtn.addEventListener("click", () => {

    bulkText.value = "";
    bulkResult.textContent = "";

    showScreen(bulkScreen);

});

/* 例文一覧画面へ */
listBtn.addEventListener("click", () => {

    /* 通常モードに戻す */
    cardMode = false;

    normalModeBtn.classList.add("active");
    cardModeBtn.classList.remove("active");

    renderSentenceList();

    showScreen(listScreen);

});

/* ==========================
   学習設定画面（Study Setting）
========================== */

/* ホームへ戻る */
backHomeSetting.addEventListener("click", () => {

    showScreen(homeScreen);

});

/* 学習開始 */
startStudyBtn.addEventListener("click", () => {

    // 学習設定を取得
    const startId = Number(startIdInput.value);

    const questionCount = Number(questionCountInput.value);

    const studyMode =
        document.querySelector(
            'input[name="studyMode"]:checked'
        ).value;

    // 指定範囲の例文を取得
    studyList = questions.filter(q => {

        return q.id >= startId &&
            q.id < startId + questionCount;

    });

    // 範囲内に例文がない
    if (studyList.length === 0) {

        alert("指定した範囲に例文がありません。");
        return;

    }

    // ランダム出題
    if (studyMode === "random") {

        studyList.sort(() => Math.random() - 0.5);

    }

    // 学習開始
    currentIndex = 0;

    showScreen(studyScreen);

    // 最初の問題を表示
    jpText.textContent = studyList[currentIndex].jp;

    progressText.textContent =
        `${currentIndex + 1} / ${studyList.length} 問`;

    // 学習画面を初期化
    answerInput.value = "";

    resultArea.innerHTML = "";

    answerArea.textContent = "";

    hideSpeakButton();

    answerVisible = false;

    showAnswerBtn.textContent = "答えを表示";

    answered = false;

    checkBtn.textContent = "判定";

    checkBtn.style.background = "#2d7ef7";

});

/* ==========================
   学習画面（Study）
========================== */

/* ホームへ戻る */
backHome1.addEventListener("click", () => {

    showScreen(homeScreen);

});

/* 読み上げ */
speakBtn.addEventListener("click", () => {

    if (studyList.length === 0) return;

    const question =
        studyList[currentIndex];

    const languageMap = {

        ko: "ko-KR",
        en: "en-US",
        zh: "zh-CN",
        fr: "fr-FR"

    };

    speak(

        question.kr,

        languageMap[question.language] || "ko-KR"

    );

});

/* 復習ボタン */
reviewBtn.addEventListener("click", toggleStudyReview);

/* 復習切り替え */
function toggleStudyReview() {

    if (studyList.length === 0) return;

    const question = studyList[currentIndex];

    question.review = !question.review;

    saveQuestions();

    updateReviewIcon();

}

function updateReviewIcon() {

    if (studyList.length === 0) return;

    const question = studyList[currentIndex];

    if (question.review) {

        reviewIcon.classList.add("filled");

    } else {

        reviewIcon.classList.remove("filled");

    }

}

/* 答えを表示・非表示 */
showAnswerBtn.addEventListener("click", () => {

    if (studyList.length === 0) return;

    answerVisible = !answerVisible;

    if (answerVisible) {

        answerArea.textContent =
            studyList[currentIndex].kr;

        showSpeakButton();

        showAnswerBtn.textContent =
            "答えを隠す";

    } else {

        answerArea.textContent = "";

        hideSpeakButton();

        showAnswerBtn.textContent =
            "答えを表示";

    }

});

/* 判定・次の問題 */
checkBtn.addEventListener("click", () => {

    // 未判定なら判定
    if (!answered) {

        const userAnswer =
            answerInput.value.trim();

        const correctAnswer =
            studyList[currentIndex].kr.trim();

        if (userAnswer === correctAnswer) {

            resultArea.innerHTML =
                '<span class="correctText">⭕ 正解！</span>';

        } else {

            resultArea.innerHTML =
                '<span class="wrongText">❌ 不正解</span>';

            answerArea.textContent =
                correctAnswer;

            showSpeakButton();

        }

        answered = true;

        checkBtn.textContent =
            "次へ";

        checkBtn.style.background =
            "#22c55e";

        return;

    }

    // 次の問題へ
    currentIndex++;

    // 学習終了
    if (currentIndex >= studyList.length) {

        showScreen(finishScreen);

        return;

    }

    // 問題を更新
    jpText.textContent =
        studyList[currentIndex].jp;

    progressText.textContent =
        `${currentIndex + 1} / ${studyList.length} 問`;

    updateReviewIcon();

    // 学習画面を初期化
    answerInput.value = "";

    resultArea.innerHTML = "";

    answerArea.textContent = "";

    hideSpeakButton();

    answerVisible = false;

    showAnswerBtn.textContent =
        "答えを表示";

    answered = false;

    checkBtn.textContent =
        "判定";

    checkBtn.style.background =
        "#2d7ef7";

});

/* ==========================
   学習終了画面（Finish）
========================== */

/* もう一度学習 */
restartStudyBtn.addEventListener("click", () => {

    currentIndex = 0;

    showScreen(studyScreen);

    // 最初の問題を表示
    jpText.textContent = studyList[currentIndex].jp;

    progressText.textContent =
        `${currentIndex + 1} / ${studyList.length} 問`;

    updateReviewIcon();

    // 学習画面を初期化
    answerInput.value = "";

    resultArea.innerHTML = "";

    answerArea.textContent = "";

    answerVisible = false;

    showAnswerBtn.textContent = "答えを表示";

    answered = false;

    checkBtn.textContent = "判定";

    checkBtn.style.background = "#2d7ef7";

});

/* ホームへ戻る */
backHomeFinish.addEventListener("click", () => {

    showScreen(homeScreen);

});

/* ==========================
   例文追加画面（Add Sentence）
========================== */

/* ホームへ戻る */
backHome2.addEventListener("click", () => {

    showScreen(homeScreen);

});

/* 例文を保存 */
saveSentence.addEventListener("click", () => {

    const language = languageSelect.value;

    const jp = jpInput.value.trim();

    const kr = krInput.value.trim();

    // 入力チェック
    if (!jp || !kr) {

        alert("日本語・韓国語を入力してください。");

        return;

    }

    // 重複チェック
    const exists = questions.some(q =>
        q.jp === jp && q.kr === kr
    );

    if (exists) {

        alert("同じ例文が登録されています。");

        return;

    }

    // 新しい例文を追加
    questions.push({

        id: questions.length + 1,

        language,

        jp,

        kr,

        review: false

    });

    // 保存
    saveQuestions();

    alert("保存しました。");

    // 入力欄を初期化
    clearAddForm();

});

/* ==========================
   一括登録画面（Bulk Register）
========================== */

/* ホームへ戻る */
backHome4.addEventListener("click", () => {

    showScreen(homeScreen);

});

/* 一括登録 */
bulkSaveBtn.addEventListener("click", () => {

    const lines =
        bulkText.value.trim().split("\n");

    let count = 0;

    let duplicateCount = 0;

    lines.forEach(line => {

        const parts = line.split("|");

        // 形式チェック
        if (parts.length !== 2) {

            return;

        }

        const jp = parts[0].trim();

        const kr = parts[1].trim();

        // 空欄チェック
        if (!jp || !kr) {

            return;

        }

        // 重複チェック
        const exists = questions.some(q =>
            q.jp === jp && q.kr === kr
        );

        if (exists) {

            duplicateCount++;

            return;

        }

        // 新しい例文を追加
        questions.push({

            id: questions.length + 1,

            language: "ko",

            jp,

            kr,

            review: false

        });

        count++;

    });

    // 保存
    saveQuestions();

    // 登録結果を表示
    bulkResult.innerHTML =
        `${count}件登録しました`;

    if (duplicateCount > 0) {

        bulkResult.innerHTML +=
            `<br>${duplicateCount}件は既に登録済みです`;

    }
    // 入力欄を初期化
    bulkText.value = "";

});

/* ==========================
   例文一覧画面（Sentence List）
========================== */

/* ホームへ戻る */
backHome3.addEventListener("click", () => {

    showScreen(homeScreen);

});

/* 通常モード */
normalModeBtn.addEventListener("click", () => {

    cardMode = false;

    normalModeBtn.classList.add("active");
    cardModeBtn.classList.remove("active");

    renderSentenceList();

});

/* 暗記モード */
cardModeBtn.addEventListener("click", () => {

    cardMode = true;

    cardModeBtn.classList.add("active");
    normalModeBtn.classList.remove("active");

    renderSentenceList();

});

/* 例文一覧を表示 */
function renderSentenceList() {

    sentenceList.innerHTML = "";

    questions.forEach(question => {

        const card = document.createElement("div");

        card.className = "sentenceCard";

        card.innerHTML = `
            <div class="sentenceHeader">

                <div class="sentenceId">
                    ${question.id}
                </div>

                <div class="headerButtons">

                    <button
                        class="listSpeakBtn"
                        onclick="speakSentence(${question.id})">

                        ▶︎

                    </button>

                    <button
                        class="favoriteBtn"
                        onclick="toggleReview(${question.id})">

                        <span class="material-symbols-outlined ${question.review ? "filled" : ""}">
                            push_pin
                        </span>

                    </button>

                </div>

            </div>

            <div class="jpSentence">
                ${question.jp}
            </div>

            <div
                class="krSentence ${cardMode ? "hiddenSentence" : ""}"
                onclick="${cardMode ? "toggleSentence(this)" : ""}">

                ${question.kr}

            </div>

            ${cardMode ? "" : `
            <div class="buttonRow">

                <button
                    class="editBtn"
                    onclick="editSentence(${question.id})">
                    編集
                </button>

                <button
                    class="deleteBtn"
                    onclick="deleteSentence(${question.id})">
                    削除
                </button>

            </div>
            `}
        `;

        sentenceList.appendChild(card);

    });

}

/* 例文を読み上げ */
function speakSentence(id) {

    const question = questions.find(q => q.id === id);

    if (!question) return;

    const languageMap = {

        ko: "ko-KR",
        en: "en-US",
        zh: "zh-CN",
        fr: "fr-FR"

    };

    speak(

        question.kr,

        languageMap[question.language] || "ko-KR"

    );

}

/* 韓国語の表示・非表示 */
window.toggleSentence = function (element) {

    element.classList.toggle("hiddenSentence");

};

/* お気に入り切り替え */
function toggleFavorite(id) {

    const question = questions.find(q => q.id === id);

    if (!question) return;

    question.favorite = !question.favorite;

    saveQuestions();

    renderSentenceList();

}

/* 復習切り替え */
function toggleReview(id) {

    const question = questions.find(q => q.id === id);

    if (!question) return;

    question.review = !question.review;

    saveQuestions();

    renderSentenceList();

}

/* 例文を編集 */
function editSentence(id) {

    editingQuestion =
        questions.find(q => q.id === id);

    if (!editingQuestion) return;

    editJpInput.value =
        editingQuestion.jp;

    editKrInput.value =
        editingQuestion.kr;

    editFavoriteCheck.checked =
        editingQuestion.review;

    originalEditData = {

        jp: editingQuestion.jp,
        kr: editingQuestion.kr,
        review: editingQuestion.review

    };

    saveEditBtn.disabled = true;

    editModal.classList.remove("hidden");

}

/* 編集をキャンセル */
cancelEditBtn.addEventListener("click", () => {

    editModal.classList.add("hidden");

    editingQuestion = null;

});

/* 編集内容変更 */
editJpInput.addEventListener("input", updateSaveButton);

editKrInput.addEventListener("input", updateSaveButton);

editFavoriteCheck.addEventListener("change", updateSaveButton);

/* 編集内容を保存 */
saveEditBtn.addEventListener("click", () => {

    if (!editingQuestion) return;

    const jp = editJpInput.value.trim();

    const kr = editKrInput.value.trim();

    if (!jp || !kr) {

        alert("日本語・韓国語を入力してください。");

        return;

    }

    editingQuestion.jp = jp;

    editingQuestion.kr = kr;

    editingQuestion.review =
        editFavoriteCheck.checked;

    saveQuestions();

    renderSentenceList();

    editModal.classList.add("hidden");

    editingQuestion = null;

});

/* 例文を削除 */
function deleteSentence(id) {

    if (!confirm("削除しますか？")) return;

    questions = questions.filter(q => q.id !== id);

    // IDを振り直す
    questions.forEach((q, index) => {

        q.id = index + 1;

    });

    saveQuestions();

    renderSentenceList();

}

/* ==========================
   初期化
========================== */

loadQuestions();
showScreen(homeScreen);