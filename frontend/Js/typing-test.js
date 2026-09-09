// ========================================
// TYPEMASTER - TYPING TEST
// ========================================

document.addEventListener("DOMContentLoaded", () => {

  // ========================================
  // TEXT DATA
  // ========================================

  const TEXTS = {

    journey: {
      title: "A Journey Through Learning",
      text: `Improving your typing speed is a simple skill that can make everyday computer work much easier. Whether you are writing emails, preparing assignments, chatting with friends, creating reports, or working online, good typing skills can save you a lot of time. The best way to become a faster typist is to practice regularly and focus on accuracy before speed. When you type, try to keep your fingers in the correct position and use all of your fingers instead of relying on only a few. Avoid looking at the keyboard too often because learning where the keys are located will help your hands move naturally.

Every day, spend at least ten to fifteen minutes practicing. Start with simple sentences and gradually move to longer paragraphs. Do not worry if your speed is slow at first. It is more important to type the correct words without making many mistakes. As you become more comfortable, your speed will naturally increase. Try to maintain a steady rhythm rather than rushing through every sentence. If you make a mistake, correct it and continue. Over time, your fingers will remember common words and letter combinations, making typing easier and faster.

Reading while typing is also a useful exercise because it improves both concentration and coordination. Choose different topics such as travel, technology, nature, education, sports, or daily life. This will expose you to a wider variety of words and sentence structures. You can also practice punctuation, numbers, and capital letters to become a more complete typist.

Remember that progress takes time. Even a few minutes of practice every day can produce noticeable results after several weeks. Stay relaxed, sit comfortably, keep your wrists in a natural position, and concentrate on accuracy. With patience, consistency, and regular practice, you can gradually increase your typing speed while keeping your mistakes low.`
    },

    habits: {
      title: "Building Better Habits",
      text: `Good habits are built through small actions repeated with consistency. A person does not need to change everything at once. In fact, trying to make too many changes together can create stress and make it difficult to continue. A better approach is to choose one simple behavior, practice it regularly, and allow it to become part of the daily routine.

Habits influence how people use their time, energy, and attention. A short period of focused work can be more valuable than several hours of distracted activity. Turning off unnecessary notifications, keeping a clean workspace, and deciding what to do before starting can make concentration easier.

Practice is also a habit. If someone wants to improve typing speed, reading ability, communication, or another skill, regular practice is more useful than occasional intense effort. Ten or fifteen focused minutes each day can create meaningful results over time.`
    },

    technology: {
      title: "The Future of Technology",
      text: `Technology changes the way people learn, communicate, work, and solve problems. Computers and mobile devices have become everyday tools, while the internet allows information to travel across the world in seconds. New technologies continue to appear, and each generation must learn how to use these tools responsibly and effectively.

One important benefit of technology is access to education. A student can watch a lesson, read an article, practice a skill, or communicate with a teacher without being in the same place. Digital libraries and learning platforms provide opportunities for people who may not have access to traditional resources.

Technology can also improve productivity. Software can organize information, automate repetitive tasks, and help teams communicate. The challenge is learning which tools are useful and avoiding technology that creates unnecessary distraction.`
    },

    daily: {
      title: "Power of Daily Practice",
      text: `Daily practice is one of the simplest ways to improve a skill. It does not require a perfect schedule or a large amount of free time. What matters most is focused attention and regular repetition.

When learning to type, beginners may look at the keyboard frequently. They may pause before pressing a key or make mistakes with unfamiliar words. This is a normal stage of learning. With repeated practice, the hands begin to recognize patterns automatically.

Accuracy is an important foundation. If a learner focuses only on speed, mistakes can become a habit. A good practice session therefore combines comfortable speed with careful attention.`
    },

    places: {
      title: "Discovering New Places",
      text: `Travel gives people an opportunity to discover new places, cultures, languages, and ways of life. A journey does not have to be far away to be meaningful. Even a visit to a nearby town can reveal new food, local history, interesting buildings, and conversations with people who have different experiences.

Exploring a new place encourages curiosity. Travelers must pay attention to signs, directions, schedules, and unfamiliar surroundings. These small challenges can develop confidence and problem solving.

Culture is one of the most valuable parts of travel. Food, music, festivals, clothing, architecture, and daily routines can vary greatly between communities.`
    },

    future: {
      title: "A Bright Future",
      text: `A bright future is built through education, effort, confidence, and responsible choices. People often imagine success as one large achievement, but meaningful progress usually develops through many smaller decisions.

Education provides knowledge, but it also develops the ability to ask questions and solve problems. A good learner does not simply memorize information. They try to understand how ideas connect.

Confidence grows through action. Waiting until everything feels easy can prevent progress. A person becomes more confident by attempting difficult tasks, making mistakes, and discovering that mistakes can be corrected.`
    }

  };


  // ========================================
  // GET SELECTION
  // ========================================

  const selectedId =
    localStorage.getItem(
      "typemaster-selected-test"
    ) || "journey";

  const test =
    TEXTS[selectedId] || TEXTS.journey;


  // ========================================
  // GET TEST DURATION
  // ========================================

  let selectedDuration = 1;

  const durationSource =
    localStorage.getItem(
      "typemaster-duration-source"
    );


  // ========================================
  // PRACTICE DURATION HAS PRIORITY
  // ========================================

  if (durationSource === "practice") {

    selectedDuration =
      Number(
        localStorage.getItem(
          "typemaster-test-duration"
        )
      ) || 1;

  } else {

    // ======================================
    // USE SETTINGS DEFAULT DURATION
    // ======================================

    try {

      const settings =
        JSON.parse(
          localStorage.getItem(
            "typemaster-settings"
          ) || "{}"
        );

      selectedDuration =
        Number(
          settings.defaultDuration
        ) || 1;

    } catch (error) {

      console.error(
        "Could not load duration settings:",
        error
      );

      selectedDuration = 1;

    }

  }


  // ========================================
  // KEEP BETWEEN 1 AND 30 MINUTES
  // ========================================

  selectedDuration =
    Math.min(
      Math.max(
        selectedDuration,
        1
      ),
      30
    );


  // ========================================
  // CONVERT MINUTES → SECONDS
  // ========================================

  const duration =
    selectedDuration * 60;


  // ========================================
  // ELEMENTS
  // ========================================

  const titleEl =
    document.getElementById("testTitle");

  const textEl =
    document.getElementById("testText");

  const inputEl =
    document.getElementById("typingInput");

  const timerEl =
    document.getElementById("timer");

  const wpmEl =
    document.getElementById("wpm");

  const accuracyEl =
    document.getElementById("accuracy");

  const mistakesEl =
    document.getElementById("mistakes");

  const finishButton =
    document.getElementById("finishButton");

  const resetButton =
    document.getElementById("resetButton");

  const startTestButton =
    document.getElementById(
      "startTestButton"
    );

  const resultBox =
    document.getElementById("resultBox");

  const backButton =
    document.getElementById("backButton");


  // ========================================
  // VARIABLES
  // ========================================

  let timeLeft = duration;
  let started = false;
  let finished = false;
  let timerId = null;

  // Practice se selected paragraph
  const currentText = test.text;
  let typedTextForReport = "";
  let typedCharactersForReport = [];
  let lastReportedLength = 0;
  let totalCorrect = 0;
  let totalWrong = 0;

  // ========================================
  // INITIAL
  // ========================================

  titleEl.textContent =
    test.title;

  inputEl.value = "";

  finishButton.disabled = true;


  // ========================================
  // AUTO START SETTING
  // ========================================

  let autoStart = false;

  try {

    const settings = JSON.parse(
      localStorage.getItem(
        "typemaster-settings"
      ) || "{}"
    );

    autoStart =
      settings.autoStart === true;

  } catch (error) {

    autoStart = false;

  }


  // ========================================
  // INITIAL STATE
  // ========================================

  if (startTestButton) {

    startTestButton.style.setProperty(
      "display",
      autoStart
        ? "none"
        : "inline-flex",
      "important"
    );

  }

  inputEl.disabled = !autoStart;

  updateStats();

  renderText("");


  // ========================================
  // TIMER FORMAT
  // ========================================

  function formatTime(seconds) {

    const minutes =
      Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0");

    const secs =
      (seconds % 60)
        .toString()
        .padStart(2, "0");

    return `${minutes}:${secs}`;

  }


  // ========================================
  // APPLY TYPING SETTINGS
  // ========================================

  function applyTypingSettings() {

    let settings = {};

    try {

      settings =
        JSON.parse(
          localStorage.getItem(
            "typemaster-settings"
          ) || "{}"
        );

    } catch (error) {

      console.error(
        "Could not load TypeMaster settings:",
        error
      );

    }


    // ======================================
    // PARAGRAPH FONT SIZE
    // ======================================

    const fontSizes = {

      small: "16px",
      medium: "18px",
      large: "22px",
      "extra-large": "26px"

    };


    if (textEl) {

      textEl.style.setProperty(
        "font-size",
        fontSizes[
        settings.paragraphFontSize
        ] || "18px",
        "important"
      );

      textEl.style.setProperty(
        "line-height",
        "1.8",
        "important"
      );

    }


    // ======================================
    // TEXT WIDTH
    // ======================================

    if (textEl) {

      textEl.classList.remove(
        "text-width-compact",
        "text-width-normal",
        "text-width-wide"
      );

      textEl.classList.add(
        "text-width-" +
        (settings.textWidth || "normal")
      );

    }


    // ======================================
    // CURSOR STYLE
    // ======================================

    if (textEl) {

      textEl.classList.remove(
        "cursor-line",
        "cursor-block"
      );

      textEl.classList.add(
        "cursor-" +
        (settings.cursorStyle || "line")
      );

    }


    // ======================================
    // SHOW TIMER
    // ======================================

    if (timerEl) {

      timerEl.style.display =
        settings.showTimer === false
          ? "none"
          : "";

    }


    // ======================================
    // LIVE WPM
    // ======================================

    if (wpmEl) {

      wpmEl.style.display =
        settings.liveWpm === false
          ? "none"
          : "";

    }


    // ======================================
    // LIVE ACCURACY
    // ======================================

    if (accuracyEl) {

      accuracyEl.style.display =
        settings.liveAccuracy === false
          ? "none"
          : "";

    }


    // ======================================
    // HIGHLIGHT MISTAKES
    // ======================================

    if (textEl) {

      textEl.classList.toggle(
        "hide-mistakes",
        settings.highlightMistakes === false
      );

    }

  }


  // ========================================
  // RENDER TEXT
  // ========================================

  function renderText(value) {

    textEl.innerHTML = "";

    const fragment =
      document.createDocumentFragment();

    let currentSpan = null;

    [...currentText].forEach(
      (character, index) => {

        const span =
          document.createElement("span");

        span.textContent =
          character;

        if (index < value.length) {

          if (
            value[index] === character
          ) {

            span.className =
              "correct";

          } else {

            span.className =
              "incorrect";
          }

        }
        else if (
          index === value.length &&
          started &&
          !finished
        ) {

          span.className =
            "current";

          currentSpan = span;
        }

        fragment.appendChild(span);
      }
    );

    textEl.appendChild(fragment);

    applyTypingSettings();

    const textContainer = textEl;

    if (currentSpan && started && !finished) {
      const containerTop =
        textContainer.getBoundingClientRect().top;

      const containerBottom =
        textContainer.getBoundingClientRect().bottom;

      const currentTop =
        currentSpan.getBoundingClientRect().top;

      const currentBottom =
        currentSpan.getBoundingClientRect().bottom;

      if (currentTop < containerTop) {
        textContainer.scrollTop -=
          containerTop - currentTop;
      }

      if (currentBottom > containerBottom) {
        textContainer.scrollTop +=
          currentBottom - containerBottom;
      }
    }

  }
  function getStats() {

    const value = inputEl.value;

    let currentCorrect = 0;
    let currentWrong = 0;

    // Current running paragraph ke stats
    for (let i = 0; i < value.length; i++) {

      if (value[i] === currentText[i]) {
        currentCorrect++;
      } else {
        currentWrong++;
      }

    }

    // Pehle complete paragraphs + current paragraph
    const correct =
      totalCorrect + currentCorrect;

    const wrong =
      totalWrong + currentWrong;

    const total =
      correct + wrong;

    const accuracy =
      total > 0
        ? Math.round((correct / total) * 100)
        : 100;

    const elapsed =
      duration - timeLeft;

    const minutes =
      elapsed / 60;

    // WPM poore test ke correct characters se
    const wpm =
      minutes > 0
        ? Math.round((correct / 5) / minutes)
        : 0;

    return {
      correct,
      wrong,
      accuracy,
      wpm
    };

  }


  // ========================================
  // UPDATE STATS
  // ========================================

  function updateStats() {

    const stats =
      getStats();

    timerEl.textContent =
      formatTime(timeLeft);

    wpmEl.textContent =
      stats.wpm;

    accuracyEl.textContent =
      `${stats.accuracy}%`;

    mistakesEl.textContent =
      stats.wrong;

  }


  // ========================================
  // START TIMER
  // ========================================

  function startTimer() {

    if (
      timerId ||
      finished
    ) {

      return;

    }


    timerId =
      setInterval(
        () => {

          timeLeft--;

          updateStats();


          if (
            timeLeft <= 0
          ) {

            finishTest();

          }

        },
        1000
      );

  }


  // ========================================
  // START TEST
  // ========================================

  function startTest() {

    if (
      started ||
      finished
    ) {

      return;

    }


    // Test started
    started = true;


    // Enable typing
    inputEl.disabled = false;


    // Enable Finish button
    finishButton.disabled = false;


    // Hide Start Test button
    if (startTestButton) {

      startTestButton.style.setProperty(
        "display",
        "none",
        "important"
      );

    }


    // Start timer
    startTimer();


    // Render text
    renderText(
      inputEl.value
    );


    // Focus textarea
    inputEl.focus();

  }

  // ========================================
  // SAVE RESULT FOR PROGRESS
  // ========================================

  async function saveResultForProgress(stats) {
    const userId = localStorage.getItem("typemaster-user-id");

    // User login nahi hai to result save nahi hoga
    if (!userId) {
      console.warn("Typing result not saved: user is not logged in.");
      return;
    }

    console.log("TYPED REPORT BEFORE SAVE:", typedCharactersForReport);

    const resultData = {
      userId: userId,

      typingTextId: null,

      typingText: currentText,
      typedText: JSON.stringify(typedCharactersForReport),

      testType: "typing-test",

      durationSeconds: (Number(selectedDuration) || 0) * 60,

      wpm: Number(stats.wpm) || 0,

      accuracy: Number(stats.accuracy) || 0,

      correctCharacters: Number(stats.correct) || 0,

      wrongCharacters: Number(stats.wrong) || 0,

      errors: Number(stats.wrong) || 0,

      practiceSeconds: Math.max(
        0,
        (Number(duration) || 0) - (Number(timeLeft) || 0)
      )
    };

    try {
      const response = await fetch(
        "https://typemaster-backend-01.onrender.com/api/typing-test/save",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(resultData)
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Typing test could not be saved."
        );
      }

    } catch (error) {

      console.error(
        "Typing test save error:",
        error
      );

    }
  }
  // ========================================
  // FINISH
  // ========================================

  function finishTest() {

    if (finished) {

      return;

    }


    finished = true;


    clearInterval(
      timerId
    );

    timerId = null;


    inputEl.disabled =
      true;

    finishButton.disabled =
      true;


    if (startTestButton) {

      startTestButton.style.setProperty(
        "display",
        "none",
        "important"
      );

    }


    updateStats();


    const stats =
      getStats();


    // SAVE RESULT
    saveResultForProgress(
      stats
    );


    // SHOW RESULT

    resultBox.innerHTML = `

      <strong>
        Test Complete!
      </strong>

      <div class="result-grid">

        <div>
          <span>WPM</span>

          <strong>
            ${stats.wpm}
          </strong>
        </div>

        <div>
          <span>Accuracy</span>

          <strong>
            ${stats.accuracy}%
          </strong>
        </div>

        <div>
          <span>Mistakes</span>

          <strong>
            ${stats.wrong}
          </strong>
        </div>

      </div>

    `;


    resultBox.classList.add(
      "show"
    );


    renderText(
      inputEl.value
    );

  }


  // ========================================
  // TYPING
  // ========================================
  inputEl.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Backspace") {
        event.preventDefault();
      }

    }
  );

  inputEl.addEventListener(
    "input",

    () => {
      const finishMessage =
        document.getElementById("finishMessage");

      if (finishMessage) {
        finishMessage.remove();
      }

      const settings =
        JSON.parse(
          localStorage.getItem(
            "typemaster-settings"
          ) || "{}"
        );


      // ====================================
      // AUTO START ONLY WHEN TRUE
      // ====================================

      const autoStart =
        settings.autoStart === true;


      if (
        !started &&
        autoStart
      ) {

        startTest();

      }


      if (finished) {

        return;

      }


      if (
        inputEl.value.length >
        test.text.length
      ) {

        inputEl.value =
          inputEl.value.slice(
            0,
            test.text.length
          );

      }
      for (
        let i = lastReportedLength;
        i < inputEl.value.length;
        i++
      ) {
        typedCharactersForReport.push({
          typed: inputEl.value[i],
          correct: currentText[i]
        });
      }

      lastReportedLength = inputEl.value.length;


      updateStats();


      renderText(
        inputEl.value
      );

      if (
        inputEl.value.length ===
        currentText.length
      ) {

        // Current paragraph ke final stats total mein add karo
        let paragraphCorrect = 0;
        let paragraphWrong = 0;

        for (
          let i = 0;
          i < currentText.length;
          i++
        ) {

          if (
            inputEl.value[i] === currentText[i]
          ) {

            paragraphCorrect++;

          } else {

            paragraphWrong++;

          }

        }

        totalCorrect += paragraphCorrect;
        totalWrong += paragraphWrong;

        // Same selected paragraph dobara start
        // Same selected paragraph dobara start
        inputEl.value = "";
        lastReportedLength = 0;

        renderText("");
        inputEl.focus();

      }

    }
  );


  // ========================================
  // START BUTTON
  // ========================================

  if (startTestButton) {

    startTestButton.addEventListener(
      "click",
      () => {

        startTest();

        inputEl.focus();

      }
    );

  }

  finishButton.addEventListener(
    "click",
    () => {

      if (!started || finished) {
        return;
      }

      let finishMessage =
        document.getElementById("finishMessage");

      if (!finishMessage) {

        finishMessage =
          document.createElement("div");

        finishMessage.id =
          "finishMessage";

        finishMessage.style.marginTop =
          "12px";

        finishMessage.style.padding =
          "10px 14px";

        finishMessage.style.borderRadius =
          "10px";

        finishMessage.style.background =
          "#eff6ff";

        finishMessage.style.border =
          "1px solid #bfdbfe";

        finishMessage.style.color =
          "#1d4ed8";

        finishMessage.style.fontSize =
          "13px";

        finishMessage.style.fontWeight =
          "600";

        finishMessage.style.lineHeight =
          "1.5";

        finishButton.parentElement.parentElement
          .appendChild(finishMessage);
      }

      finishMessage.textContent =
        "Please continue typing until the timer reaches 00:00. Your result will be saved automatically.";

    }
  );


  // ========================================
  // RESET
  // ========================================

  resetButton.addEventListener(
    "click",
    () => {

      clearInterval(
        timerId
      );

      timerId = null;

      started = false;

      finished = false;

      timeLeft = duration;

      inputEl.value = "";
      timeLeft = duration;
      inputEl.value = "";

      totalCorrect = 0;
      totalWrong = 0;

      finishButton.disabled =
        true;


      // ====================================
      // READ AUTO START AGAIN
      // ====================================

      let resetSettings = {};

      try {

        resetSettings =
          JSON.parse(
            localStorage.getItem(
              "typemaster-settings"
            ) || "{}"
          );

      } catch (error) {

        resetSettings = {};

      }


      const resetAutoStart =
        resetSettings.autoStart === true;


      // ====================================
      // RESET INPUT
      // ====================================

      inputEl.disabled =
        !resetAutoStart;


      // ====================================
      // RESET START BUTTON
      // ====================================

      if (startTestButton) {

        startTestButton.style.setProperty(
          "display",
          resetAutoStart
            ? "none"
            : "inline-flex",
          "important"
        );

      }


      resultBox.classList.remove(
        "show"
      );

      resultBox.innerHTML =
        "";


      updateStats();

      renderText("");


      if (resetAutoStart) {

        inputEl.focus();

      }

    }
  );


  // ========================================
  // BACK
  // ========================================

  if (backButton) {

    backButton.addEventListener(
      "click",
      () => {

        window.location.href =
          "practice.html";

      }
    );

  }

});