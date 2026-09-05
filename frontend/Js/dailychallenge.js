// =====================================================
// TYPEMASTER - DAILY CHALLENGE
// PostgreSQL connected version
// =====================================================


// =====================================================
// API
// =====================================================

const DAILY_API_BASE =
    "http://localhost:5000/api/daily-challenge";


// =====================================================
// USER ID
// =====================================================

function getCurrentUserId() {

    return localStorage.getItem(
        "typemaster-user-id"
    );

}


// =====================================================
// GLOBAL DAILY DATA
// =====================================================

let dailyChallengeFromDB = null;

let dailyHistoryFromDB = [];

let dailyStatsFromDB = {
    streak: 0,
    bestWpm: 0,
    bestAccuracy: 0,
    completed: 0
};


// =====================================================
// GET TODAY KEY
// =====================================================

function getTodayKey() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(now.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(now.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;

}


// =====================================================
// FORMAT DATE
// =====================================================

function formatHistoryDate(dateString) {

    if (!dateString) {
        return "";
    }

    const date =
        new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


// =====================================================
// LOAD TODAY'S CHALLENGE FROM DATABASE
// =====================================================

async function loadTodayChallenge() {

    try {

        const response =
            await fetch(
                `${DAILY_API_BASE}/today`
            );

        const data =
            await response.json();

        if (
            !response.ok ||
            !data.success
        ) {
            throw new Error(
                data.message ||
                "Could not load today's challenge"
            );
        }

        dailyChallengeFromDB =
            data.challenge;

        const dailyText =
            document.getElementById(
                "dailyText"
            );

        if (dailyText) {

            dailyText.textContent =
                dailyChallengeFromDB.content || "";

        }

        const challengeDate =
            document.getElementById(
                "challengeDate"
            );

        if (challengeDate) {

            challengeDate.textContent =
                new Date(
                    dailyChallengeFromDB.date
                ).toLocaleDateString(
                    "en-US",
                    {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                    }
                );

        }

        const timer =
            document.getElementById(
                "dailyTimer"
            );

        if (timer) {

            const seconds =
                Number(
                    dailyChallengeFromDB.durationSeconds
                ) || 60;

            const minutes =
                Math.floor(seconds / 60);

            const remainingSeconds =
                seconds % 60;

            timer.textContent =
                `${String(minutes).padStart(2, "0")}:${String(
                    remainingSeconds
                ).padStart(2, "0")}`;

        }

        return dailyChallengeFromDB;

    } catch (error) {

        console.error(
            "Daily challenge database error:",
            error
        );

        return null;
    }

}


// =====================================================
// LOAD USER DAILY HISTORY FROM DATABASE
// =====================================================

async function loadDailyHistoryFromDB() {

    const userId =
        getCurrentUserId();

    if (!userId) {

        dailyHistoryFromDB = [];

        return [];
    }


    try {

        const response =
            await fetch(
                `${DAILY_API_BASE}/history/${encodeURIComponent(
                    userId
                )}`
            );

        const data =
            await response.json();

        if (
            !response.ok ||
            !data.success
        ) {
            throw new Error(
                data.message ||
                "Could not load daily history"
            );
        }

        dailyHistoryFromDB =
            Array.isArray(data.history)
                ? data.history
                : [];


        calculateDailyStats();


        return dailyHistoryFromDB;

    } catch (error) {

        console.error(
            "Daily history database error:",
            error
        );

        dailyHistoryFromDB = [];

        calculateDailyStats();

        return [];
    }

}


// =====================================================
// CALCULATE DAILY STATS
// =====================================================

function calculateDailyStats() {

    const history =
        dailyHistoryFromDB
            .filter(
                item =>
                    item.completed === true ||
                    item.completed === "true"
            );


    dailyStatsFromDB.completed =
        history.length;


    const wpms =
        history.map(
            item =>
                Number(item.wpm) || 0
        );


    const accuracies =
        history.map(
            item =>
                Number(item.accuracy) || 0
        );


    dailyStatsFromDB.bestWpm =
        wpms.length > 0
            ? Math.max(...wpms)
            : 0;


    dailyStatsFromDB.bestAccuracy =
        accuracies.length > 0
            ? Math.max(...accuracies)
            : 0;


    dailyStatsFromDB.streak =
        calculateStreakFromHistory(
            history
        );

}


// =====================================================
// CALCULATE STREAK FROM DATABASE HISTORY
// =====================================================

function calculateStreakFromHistory(
    history
) {

    if (
        !Array.isArray(history) ||
        history.length === 0
    ) {
        return 0;
    }


    const dates = history
        .map(item => {

            const value =
                item.date ||
                item.createdAt;

            if (!value) {
                return null;
            }

            const date =
                new Date(value);

            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {
                return null;
            }

            date.setHours(
                0,
                0,
                0,
                0
            );

            return date;

        })
        .filter(Boolean);


    const uniqueDates =
        Array.from(
            new Set(
                dates.map(
                    date =>
                        date.getTime()
                )
            )
        )
            .sort(
                (a, b) => b - a
            );


    if (
        uniqueDates.length === 0
    ) {
        return 0;
    }


    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const yesterday =
        new Date(today);

    yesterday.setDate(
        yesterday.getDate() - 1
    );


    const latestDate =
        new Date(
            uniqueDates[0]
        );


    const latestIsToday =
        latestDate.getTime() ===
        today.getTime();


    const latestIsYesterday =
        latestDate.getTime() ===
        yesterday.getTime();


    if (
        !latestIsToday &&
        !latestIsYesterday
    ) {
        return 0;
    }


    let streak = 1;


    for (
        let i = 1;
        i < uniqueDates.length;
        i++
    ) {

        const previous =
            new Date(
                uniqueDates[i - 1]
            );

        const current =
            new Date(
                uniqueDates[i]
            );


        const difference =
            (
                previous.getTime() -
                current.getTime()
            ) /
            (
                1000 *
                60 *
                60 *
                24
            );


        if (
            Math.round(
                difference
            ) === 1
        ) {

            streak++;

        } else {

            break;

        }

    }


    return streak;

}


// =====================================================
// UPDATE STATS UI
// =====================================================

function updateDailyStatsUI() {

    const streakValue =
        document.getElementById(
            "streakValue"
        );


    const bestWpm =
        document.getElementById(
            "bestWpm"
        );


    if (streakValue) {

        const streak =
            Number(
                dailyStatsFromDB.streak
            ) || 0;

        streakValue.textContent =
            `${streak} ${streak === 1
                ? "day"
                : "days"
            }`;

    }


    if (bestWpm) {

        bestWpm.textContent =
            `${Number(
                dailyStatsFromDB.bestWpm
            ) || 0
            } WPM`;

    }

}


// =====================================================
// RENDER DAILY HISTORY
// =====================================================

function renderDailyChallengeHistory() {

    const historyList =
        document.getElementById(
            "dailyHistoryList"
        );


    if (!historyList) {
        return;
    }


    const history =
        dailyHistoryFromDB.filter(
            item =>
                item.completed === true ||
                item.completed === "true"
        );


    if (
        history.length === 0
    ) {

        historyList.innerHTML = `
            <div class="daily-history-empty">
                No challenge history yet.
            </div>
        `;

        return;

    }


    historyList.innerHTML =
        history
            .map(
                item => {

                    const date =
                        item.date ||
                        item.createdAt;

                    const wpm =
                        Number(
                            item.wpm
                        ) || 0;

                    const accuracy =
                        Number(
                            item.accuracy
                        ) || 0;

                    const mistakes =
                        Number(
                            item.errors
                        ) || 0;

                    const score =
                        Math.max(
                            0,
                            Math.round(
                                wpm *
                                (
                                    accuracy /
                                    100
                                )
                            )
                        );


                    return `
                        <div class="daily-history-row">

                            <div class="history-date">

                                <strong>
                                    ${formatHistoryDate(date)}
                                </strong>

                                <small>
                                    Daily Challenge
                                </small>

                            </div>


                            <div class="history-stat">

                                <span>
                                    WPM
                                </span>

                                <strong>
                                    ${wpm}
                                </strong>

                            </div>


                            <div class="history-stat">

                                <span>
                                    Accuracy
                                </span>

                                <strong>
                                    ${accuracy}%
                                </strong>

                            </div>


                            <div class="history-stat">

                                <span>
                                    Mistakes
                                </span>

                                <strong>
                                    ${mistakes}
                                </strong>

                            </div>


                            <div class="history-stat">

                                <span>
                                    Score
                                </span>

                                <strong>
                                    ${score}
                                </strong>

                            </div>

                        </div>
                    `;

                }
            )
            .join("");

}


// =====================================================
// SAVE DAILY ATTEMPT TO DATABASE
// =====================================================

async function saveDailyAttemptToDB(
    wpm,
    accuracy,
    mistakes,
    completed = true
) {

    const userId =
        getCurrentUserId();


    if (!userId) {

        console.warn(
            "Daily challenge not saved: user is not logged in."
        );

        return null;

    }


    if (
        !dailyChallengeFromDB ||
        !dailyChallengeFromDB.id
    ) {

        console.error(
            "Daily challenge ID is missing."
        );

        return null;

    }


    try {

        const response =
            await fetch(
                `${DAILY_API_BASE}/attempt`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            {
                                userId:
                                    userId,

                                challengeId:
                                    dailyChallengeFromDB.id,

                                wpm:
                                    Number(
                                        wpm
                                    ) || 0,

                                accuracy:
                                    Number(
                                        accuracy
                                    ) || 0,

                                errors:
                                    Number(
                                        mistakes
                                    ) || 0,

                                completed:
                                    completed === true
                            }
                        )
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Daily challenge attempt could not be saved."
            );

        }

        return data.attempt;

    } catch (error) {

        console.error(
            "Daily challenge save error:",
            error
        );

        return null;
    }

}


async function clearDailyHistoryFromDB() {

    const userId =
        getCurrentUserId();

    if (!userId) {
        alert("Please login first.");
        return;
    }

    const confirmed =
        confirm(
            "Are you sure you want to clear all Daily Challenge history?"
        );

    if (!confirmed) {
        return;
    }

    try {

        const response =
            await fetch(
                `http://localhost:5000/api/daily-challenge/history/${encodeURIComponent(userId)}`,
                {
                    method: "DELETE"
                }
            );

        const data =
            await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.message ||
                "Failed to clear Daily Challenge history."
            );
        }

        // Clear current page data immediately
        dailyHistoryFromDB = [];

        // Reset stats immediately
        dailyStatsFromDB = {
            streak: 0,
            bestWpm: 0,
            bestAccuracy: 0,
            completed: 0
        };

        // Update UI immediately
        updateDailyStatsUI();

        renderDailyChallengeHistory();

        // Update sidebar immediately
        if (typeof loadCommonStreak === "function") {
            await loadCommonStreak();
        }

        alert(
            "Daily Challenge history cleared successfully."
        );

    } catch (error) {

        console.error(
            "Clear Daily Challenge history error:",
            error
        );

        alert(
            "Could not clear Daily Challenge history."
        );
    }
}

// =====================================================
// DOM CONTENT LOADED
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        // -------------------------------------------------
        // ELEMENTS
        // -------------------------------------------------

        const challengeDate =
            document.getElementById(
                "challengeDate"
            );


        const streakValue =
            document.getElementById(
                "streakValue"
            );


        const bestWpm =
            document.getElementById(
                "bestWpm"
            );


        const startDailyButton =
            document.getElementById(
                "startDailyButton"
            );


        const dailyStartScreen =
            document.getElementById(
                "dailyStartScreen"
            );


        const dailyTypingScreen =
            document.getElementById(
                "dailyTypingScreen"
            );


        const dailyResultScreen =
            document.getElementById(
                "dailyResultScreen"
            );


        const dailyText =
            document.getElementById(
                "dailyText"
            );


        const dailyInput =
            document.getElementById(
                "dailyInput"
            );


        const dailyTimer =
            document.getElementById(
                "dailyTimer"
            );


        const dailyWpm =
            document.getElementById(
                "dailyWpm"
            );


        const dailyAccuracy =
            document.getElementById(
                "dailyAccuracy"
            );


        const dailyMistakes =
            document.getElementById(
                "dailyMistakes"
            );


        const dailyMessage =
            document.getElementById(
                "dailyMessage"
            );


        const resultWpm =
            document.getElementById(
                "resultWpm"
            );


        const resultAccuracy =
            document.getElementById(
                "resultAccuracy"
            );


        const resultMistakes =
            document.getElementById(
                "resultMistakes"
            );


        const resultScore =
            document.getElementById(
                "resultScore"
            );


        const resultMessage =
            document.getElementById(
                "resultMessage"
            );


        const tryAgainButton =
            document.getElementById(
                "tryAgainButton"
            );


        const darkModeButton =
            document.getElementById(
                "darkModeButton"
            );


        // -------------------------------------------------
        // LOAD DATABASE DATA
        // -------------------------------------------------

        await loadTodayChallenge();

        await loadDailyHistoryFromDB();

        updateDailyStatsUI();

        renderDailyChallengeHistory();


        // -------------------------------------------------
        // DATE FALLBACK
        // -------------------------------------------------

        if (
            challengeDate &&
            !dailyChallengeFromDB
        ) {

            challengeDate.textContent =
                new Date().toLocaleDateString(
                    "en-US",
                    {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                    }
                );

        }


        // -------------------------------------------------
        // DAILY TEXT FALLBACK
        // -------------------------------------------------

        if (
            dailyText &&
            !dailyChallengeFromDB
        ) {

            dailyText.textContent =
                "Daily challenge could not be loaded. Please make sure the backend is running.";

        }


        // -------------------------------------------------
        // DARK MODE
        // -------------------------------------------------

        if (darkModeButton) {

            darkModeButton.addEventListener(
                "click",
                () => {

                    document.body.classList.toggle(
                        "dark-mode"
                    );


                    const isDark =
                        document.body.classList.contains(
                            "dark-mode"
                        );


                    localStorage.setItem(
                        "typeMasterDailyDarkMode",
                        isDark
                            ? "true"
                            : "false"
                    );


                    darkModeButton.textContent =
                        isDark
                            ? "☀️ Light Mode"
                            : "🌙 Dark Mode";

                }
            );

        }


        const savedDarkMode =
            localStorage.getItem(
                "typeMasterDailyDarkMode"
            );


        if (
            savedDarkMode === "true"
        ) {

            document.body.classList.add(
                "dark-mode"
            );


            if (darkModeButton) {

                darkModeButton.textContent =
                    "☀️ Light Mode";

            }

        }


        // -------------------------------------------------
        // START BUTTON
        // -------------------------------------------------

        if (startDailyButton) {

            startDailyButton.addEventListener(
                "click",
                () => {

                    if (dailyStartScreen) {

                        dailyStartScreen.classList.add(
                            "hidden"
                        );

                    }


                    if (dailyTypingScreen) {

                        dailyTypingScreen.classList.remove(
                            "hidden"
                        );

                    }


                    if (dailyResultScreen) {

                        dailyResultScreen.classList.add(
                            "hidden"
                        );

                    }


                    if (dailyInput) {

                        dailyInput.value = "";

                        dailyInput.focus();

                    }


                    if (dailyMessage) {

                        dailyMessage.textContent =
                            "Start typing the text above.";

                        dailyMessage.className =
                            "daily-message";

                    }


                    const seconds =
                        dailyChallengeFromDB
                            ? Number(
                                dailyChallengeFromDB.durationSeconds
                            ) || 60
                            : 60;


                    if (dailyTimer) {

                        const minutes =
                            Math.floor(
                                seconds / 60
                            );

                        const remainingSeconds =
                            seconds % 60;

                        dailyTimer.textContent =
                            `${String(minutes).padStart(
                                2,
                                "0"
                            )}:${String(
                                remainingSeconds
                            ).padStart(
                                2,
                                "0"
                            )}`;

                    }


                    if (dailyWpm) {

                        dailyWpm.textContent =
                            "0";

                    }


                    if (dailyAccuracy) {

                        dailyAccuracy.textContent =
                            "100%";

                    }


                    if (dailyMistakes) {

                        dailyMistakes.textContent =
                            "0";

                    }

                }
            );

        }


        // -------------------------------------------------
        // EXPOSE DATA
        // -------------------------------------------------

        window.dailyChallengeData = {

            todayKey:
                getTodayKey(),

            challengeText:
                dailyChallengeFromDB
                    ? dailyChallengeFromDB.content
                    : "",

            challengeId:
                dailyChallengeFromDB
                    ? dailyChallengeFromDB.id
                    : null
        };

        // -------------------------------------------------
        // UPDATE INITIAL TIMER
        // -------------------------------------------------

        if (dailyTimer) {

            const seconds =
                dailyChallengeFromDB
                    ? Number(
                        dailyChallengeFromDB.durationSeconds
                    ) || 60
                    : 60;


            const minutes =
                Math.floor(
                    seconds / 60
                );


            const remainingSeconds =
                seconds % 60;


            dailyTimer.textContent =
                `${String(minutes).padStart(
                    2,
                    "0"
                )}:${String(
                    remainingSeconds
                ).padStart(
                    2,
                    "0"
                )}`;

        }

    }
);


// =====================================================
// DAILY CHALLENGE TYPING LOGIC
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        // -------------------------------------------------
        // ELEMENTS
        // -------------------------------------------------

        const startButton =
            document.getElementById(
                "startDailyButton"
            );


        const tryAgainButton =
            document.getElementById(
                "tryAgainButton"
            );


        const startScreen =
            document.getElementById(
                "dailyStartScreen"
            );


        const typingScreen =
            document.getElementById(
                "dailyTypingScreen"
            );


        const resultScreen =
            document.getElementById(
                "dailyResultScreen"
            );


        const textElement =
            document.getElementById(
                "dailyText"
            );


        const input =
            document.getElementById(
                "dailyInput"
            );


        const timerElement =
            document.getElementById(
                "dailyTimer"
            );


        const wpmElement =
            document.getElementById(
                "dailyWpm"
            );


        const accuracyElement =
            document.getElementById(
                "dailyAccuracy"
            );


        const mistakesElement =
            document.getElementById(
                "dailyMistakes"
            );


        const messageElement =
            document.getElementById(
                "dailyMessage"
            );


        const resultWpm =
            document.getElementById(
                "resultWpm"
            );


        const resultAccuracy =
            document.getElementById(
                "resultAccuracy"
            );


        const resultMistakes =
            document.getElementById(
                "resultMistakes"
            );


        const resultScore =
            document.getElementById(
                "resultScore"
            );


        const resultMessage =
            document.getElementById(
                "resultMessage"
            );


        // -------------------------------------------------
        // STATE
        // -------------------------------------------------

        let timeLeft =
            dailyChallengeFromDB
                ? Number(
                    dailyChallengeFromDB.durationSeconds
                ) || 60
                : 60;


        let timer = null;

        let started = false;

        let finished = false;

        let startTime = null;

        let totalKeystrokes = 0;

        let mistakes = 0;


        // -------------------------------------------------
        // GET CHALLENGE TEXT
        // -------------------------------------------------

        function getChallengeText() {

            if (
                window.dailyChallengeData &&
                window.dailyChallengeData.challengeText
            ) {

                return window.dailyChallengeData.challengeText;

            }


            return textElement
                ? textElement.textContent.trim()
                : "";

        }


        // -------------------------------------------------
        // RESET
        // -------------------------------------------------

        function resetChallenge() {

            clearInterval(timer);

            timer = null;


            timeLeft =
                dailyChallengeFromDB
                    ? Number(
                        dailyChallengeFromDB.durationSeconds
                    ) || 60
                    : 60;


            started = false;

            finished = false;

            startTime = null;

            totalKeystrokes = 0;

            mistakes = 0;


            updateTimer();


            if (wpmElement) {

                wpmElement.textContent =
                    "0";

            }


            if (accuracyElement) {

                accuracyElement.textContent =
                    "100%";

            }


            if (mistakesElement) {

                mistakesElement.textContent =
                    "0";

            }


            if (input) {

                input.value = "";

            }


            if (messageElement) {

                messageElement.textContent =
                    "Start typing the text above.";

                messageElement.className =
                    "daily-message";

            }


            if (startScreen) {

                startScreen.classList.add(
                    "hidden"
                );

            }


            if (typingScreen) {

                typingScreen.classList.remove(
                    "hidden"
                );

            }


            if (resultScreen) {

                resultScreen.classList.add(
                    "hidden"
                );

            }


            renderTypingText();

        }


        // -------------------------------------------------
        // RENDER TEXT
        // -------------------------------------------------

        function renderTypingText() {

            if (!textElement) {
                return;
            }


            const text =
                getChallengeText();


            const typed =
                input
                    ? input.value
                    : "";


            let html = "";


            for (
                let i = 0;
                i < text.length;
                i++
            ) {

                const character =
                    text[i];


                const escaped =
                    character
                        .replace(
                            /&/g,
                            "&amp;"
                        )
                        .replace(
                            /</g,
                            "&lt;"
                        )
                        .replace(
                            />/g,
                            "&gt;"
                        )
                        .replace(
                            /"/g,
                            "&quot;"
                        );


                if (
                    i < typed.length
                ) {

                    if (
                        typed[i] ===
                        character
                    ) {

                        html +=
                            `<span class="correct">${escaped}</span>`;

                    } else {

                        html +=
                            `<span class="incorrect">${escaped}</span>`;

                    }

                } else if (
                    i === typed.length
                ) {

                    html +=
                        `<span class="current">${escaped}</span>`;

                } else {

                    html += escaped;

                }

            }


            textElement.innerHTML =
                html;

        }


        // -------------------------------------------------
        // START TIMER
        // -------------------------------------------------

        function startTimer() {

            clearInterval(timer);


            timer =
                setInterval(
                    () => {

                        if (finished) {

                            clearInterval(
                                timer
                            );

                            return;

                        }


                        timeLeft--;


                        updateTimer();


                        updateLiveStats();


                        if (
                            timeLeft <= 0
                        ) {

                            finishChallenge();

                        }

                    },
                    1000
                );

        }


        // -------------------------------------------------
        // TIMER DISPLAY
        // -------------------------------------------------

        function updateTimer() {

            if (!timerElement) {
                return;
            }


            const minutes =
                Math.floor(
                    timeLeft / 60
                );


            const seconds =
                timeLeft % 60;


            timerElement.textContent =
                `${String(minutes).padStart(
                    2,
                    "0"
                )}:${String(
                    seconds
                ).padStart(
                    2,
                    "0"
                )}`;

        }


        // -------------------------------------------------
        // ACCURACY
        // -------------------------------------------------

        function calculateAccuracy() {

            if (
                totalKeystrokes <= 0
            ) {

                return 100;

            }


            const correct =
                totalKeystrokes -
                mistakes;


            return Math.max(
                0,
                Math.round(
                    (
                        correct /
                        totalKeystrokes
                    ) *
                    100
                )
            );

        }


        // -------------------------------------------------
        // WPM
        // -------------------------------------------------

        function calculateWpm() {

            if (!startTime) {
                return 0;
            }


            const elapsed =
                (
                    Date.now() -
                    startTime
                ) / 1000;


            if (
                elapsed <= 0
            ) {

                return 0;

            }


            const typed =
                input
                    ? input.value.length
                    : 0;


            const words =
                typed / 5;


            const minutes =
                elapsed / 60;


            return Math.max(
                0,
                Math.round(
                    words /
                    minutes
                )
            );

        }


        // -------------------------------------------------
        // LIVE STATS
        // -------------------------------------------------

        function updateLiveStats() {

            const wpm =
                calculateWpm();


            const accuracy =
                calculateAccuracy();


            if (wpmElement) {

                wpmElement.textContent =
                    String(wpm);

            }


            if (accuracyElement) {

                accuracyElement.textContent =
                    `${accuracy}%`;

            }


            if (mistakesElement) {

                mistakesElement.textContent =
                    String(mistakes);

            }

        }


        // -------------------------------------------------
        // BEGIN TYPING
        // -------------------------------------------------

        function beginTyping() {

            if (
                started ||
                finished
            ) {

                return;

            }


            started = true;


            startTime =
                Date.now();


            if (messageElement) {

                messageElement.textContent =
                    "Keep going...";

            }


            startTimer();

        }


        // -------------------------------------------------
        // INPUT
        // -------------------------------------------------

        if (input) {

            input.addEventListener(
                "input",
                () => {

                    if (finished) {
                        return;
                    }


                    const text =
                        getChallengeText();


                    const typed =
                        input.value;


                    if (!started) {

                        beginTyping();

                    }


                    totalKeystrokes =
                        typed.length;


                    mistakes = 0;


                    for (
                        let i = 0;
                        i < typed.length;
                        i++
                    ) {

                        if (
                            typed[i] !==
                            text[i]
                        ) {

                            mistakes++;

                        }

                    }


                    renderTypingText();


                    updateLiveStats();


                    // -----------------------------------------
                    // COMPLETED TEXT
                    // -----------------------------------------

                    if (
                        typed.length >=
                        text.length
                    ) {

                        finishChallenge();

                        return;

                    }


                    // -----------------------------------------
                    // MESSAGE
                    // -----------------------------------------

                    if (
                        mistakes > 0
                    ) {

                        if (
                            messageElement
                        ) {

                            messageElement.textContent =
                                `${mistakes} mistake${mistakes === 1
                                    ? ""
                                    : "s"
                                } — keep going.`;

                            messageElement.className =
                                "daily-message error";

                        }

                    } else {

                        if (
                            messageElement
                        ) {

                            messageElement.textContent =
                                "Perfect so far — keep typing.";

                            messageElement.className =
                                "daily-message success";

                        }

                    }

                }
            );

        }


        // -------------------------------------------------
        // START BUTTON
        // -------------------------------------------------

        if (startButton) {

            startButton.addEventListener(
                "click",
                () => {

                    resetChallenge();


                    setTimeout(
                        () => {

                            if (input) {

                                input.focus();

                            }

                        },
                        50
                    );

                }
            );

        }


        // -------------------------------------------------
        // FINISH
        // -------------------------------------------------

        async function finishChallenge() {

            if (finished) {
                return;
            }


            finished = true;


            clearInterval(timer);

            timer = null;


            const finalWpm =
                calculateWpm();


            const finalAccuracy =
                calculateAccuracy();


            const finalMistakes =
                mistakes;


            const score =
                Math.max(
                    0,
                    Math.round(
                        finalWpm *
                        (
                            finalAccuracy /
                            100
                        )
                    )
                );


            // ---------------------------------------------
            // RESULT
            // ---------------------------------------------

            if (resultWpm) {

                resultWpm.textContent =
                    String(finalWpm);

            }


            if (resultAccuracy) {

                resultAccuracy.textContent =
                    `${finalAccuracy}%`;

            }


            if (resultMistakes) {

                resultMistakes.textContent =
                    String(finalMistakes);

            }


            if (resultScore) {

                resultScore.textContent =
                    String(score);

            }


            // ---------------------------------------------
            // RESULT MESSAGE
            // ---------------------------------------------

            if (resultMessage) {

                if (
                    finalAccuracy >= 95
                ) {

                    resultMessage.textContent =
                        "Excellent accuracy! 🔥";

                } else if (
                    finalAccuracy >= 85
                ) {

                    resultMessage.textContent =
                        "Great job! Keep practicing. 🎯";

                } else if (
                    finalAccuracy >= 70
                ) {

                    resultMessage.textContent =
                        "Good effort! Focus on accuracy. 💪";

                } else {

                    resultMessage.textContent =
                        "Keep practicing and improve your accuracy. 🚀";

                }

            }


            // ---------------------------------------------
            // SAVE TO POSTGRESQL
            // ---------------------------------------------

            const savedAttempt =
                await saveDailyAttemptToDB(
                    finalWpm,
                    finalAccuracy,
                    finalMistakes,
                    true
                );


            // ---------------------------------------------
            // RELOAD DB HISTORY
            // ---------------------------------------------

            if (savedAttempt) {
                await loadDailyHistoryFromDB();
                updateDailyStatsUI();
                renderDailyChallengeHistory();

                if (typeof loadCommonStreak === "function") {
                    await loadCommonStreak();
                }
            }

            // ---------------------------------------------
            // SHOW RESULT
            // ---------------------------------------------

            if (typingScreen) {

                typingScreen.classList.add(
                    "hidden"
                );

            }


            if (resultScreen) {

                resultScreen.classList.remove(
                    "hidden"
                );

            }


            // ---------------------------------------------
            // DAILY COMPLETION MESSAGE
            // ---------------------------------------------

            if (resultMessage) {

                const streak =
                    Number(
                        dailyStatsFromDB.streak
                    ) || 0;


                resultMessage.textContent =
                    `Daily Challenge completed! 🔥 ${streak
                    } ${streak === 1
                        ? "day"
                        : "days"
                    } streak`;

            }

        }


        // -------------------------------------------------
        // TRY AGAIN
        // -------------------------------------------------

        if (tryAgainButton) {

            tryAgainButton.addEventListener(
                "click",
                () => {

                    clearInterval(timer);

                    timer = null;


                    timeLeft =
                        dailyChallengeFromDB
                            ? Number(
                                dailyChallengeFromDB.durationSeconds
                            ) || 60
                            : 60;


                    started = false;

                    finished = false;

                    startTime = null;

                    totalKeystrokes = 0;

                    mistakes = 0;


                    updateTimer();


                    if (wpmElement) {

                        wpmElement.textContent =
                            "0";

                    }


                    if (accuracyElement) {

                        accuracyElement.textContent =
                            "100%";

                    }


                    if (mistakesElement) {

                        mistakesElement.textContent =
                            "0";

                    }


                    if (input) {

                        input.value = "";

                    }


                    if (messageElement) {

                        messageElement.textContent =
                            "Start typing the text above.";

                        messageElement.className =
                            "daily-message";

                    }


                    if (resultScreen) {

                        resultScreen.classList.add(
                            "hidden"
                        );

                    }


                    if (typingScreen) {

                        typingScreen.classList.remove(
                            "hidden"
                        );

                    }


                    renderTypingText();


                    setTimeout(
                        () => {

                            if (input) {

                                input.focus();

                            }

                        },
                        100
                    );

                }
            );

        }


        // -------------------------------------------------
        // INITIAL DISPLAY
        // -------------------------------------------------

        updateTimer();

        renderTypingText();

    }
);


// =====================================================
// PUBLIC FUNCTIONS
// =====================================================

window.getDailyChallengeHistory =
    function () {

        return dailyHistoryFromDB;

    };


window.getDailyChallengeStats =
    function () {

        return dailyStatsFromDB;

    };


window.loadDailyChallengeData =
    async function () {
        await loadTodayChallenge();
        await loadDailyHistoryFromDB();
        updateDailyStatsUI();
        renderDailyChallengeHistory();

        if (typeof loadCommonStreak === "function") {
            await loadCommonStreak();
        }
    };
document.addEventListener("DOMContentLoaded", function () {

    const clearHistoryButton =
        document.getElementById("clearDailyHistory");


    if (clearHistoryButton) {

        clearHistoryButton.addEventListener("click", function () {

            clearDailyHistoryFromDB();

        });

    }

});