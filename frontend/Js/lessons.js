document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     LESSON DATA
  ===================================================== */

  const lessons = [
    {
      id: 1,
      title: "Home Row Basics",
      level: "Beginner",
      description: "Learn the correct starting position for your fingers.",
      icon: "🖐️",
      subLessons: [
        { id: "1.1", title: "Touch Typing Basics", time: 3, sequence: "asdf jkl;" },
        { id: "1.2", title: "New Keys: Home Row", time: 3, sequence: "a s d f j k l ;" },
        { id: "1.3", title: "Understanding Results", time: 3, sequence: "asdf fdsa jkl; ;lkj" },
        { id: "1.4", title: "Key Drill", time: 3, sequence: "a a s s d d f f j j k k l l ; ;" },
        { id: "1.5", title: "Typing Test", time: 3, sequence: "asdf jkl; asdf jkl;" },
        { id: "1.6", title: "Word Drill", time: 4, sequence: "ask sad dad fall lad flask" },
        { id: "1.7", title: "Paragraph Drill", time: 5, sequence: "a sad lad had a flask" }
      ]
    },

    {
      id: 2,
      title: "Keys E and I",
      level: "Beginner",
      description: "Learn the E and I keys and combine them with the home row.",
      icon: "☝️",
      subLessons: [
        { id: "2.1", title: "New Keys: E and I", time: 4, sequence: "e i e i" },
        { id: "2.2", title: "Optimal Duration", time: 3, sequence: "e i d k e i d k" },
        { id: "2.3", title: "Word Drill", time: 4, sequence: "did kid ski lie die" },
        { id: "2.4", title: "Sentence Drill", time: 4, sequence: "I did it. I like it." },
        { id: "2.5", title: "Tip: Typing Meter", time: 3, sequence: "i like to type" },
        { id: "2.6", title: "Paragraph Drill", time: 5, sequence: "I like typing and I practice every day." }
      ]
    },

    {
      id: 3,
      title: "Right Hand Practice",
      level: "Beginner",
      description: "Build confidence using the right hand and common patterns.",
      icon: "🖐️",
      subLessons: [
        { id: "3.1", title: "J and K Keys", time: 3, sequence: "j k j k" },
        { id: "3.2", title: "L and Semicolon", time: 3, sequence: "l ; l ;" },
        { id: "3.3", title: "Right Hand Drill", time: 4, sequence: "j k l ; ; l k j" },
        { id: "3.4", title: "Word Drill", time: 4, sequence: "jill kill like look" },
        { id: "3.5", title: "Sentence Drill", time: 4, sequence: "Jill likes skill." }
      ]
    },

    {
      id: 4,
      title: "Top Row Practice",
      level: "Intermediate",
      description: "Improve your reach with the top row keys.",
      icon: "⬆️",
      subLessons: [
        { id: "4.1", title: "Q W E R Keys", time: 4, sequence: "q w e r" },
        { id: "4.2", title: "T Y Keys", time: 3, sequence: "t y t y" },
        { id: "4.3", title: "U I O P Keys", time: 4, sequence: "u i o p" },
        { id: "4.4", title: "Top Row Drill", time: 5, sequence: "qwerty uiop" },
        { id: "4.5", title: "Top Row Words", time: 5, sequence: "type write quiet power" }
      ]
    },

    {
      id: 5,
      title: "Number Row",
      level: "Intermediate",
      description: "Learn to type numbers quickly without looking.",
      icon: "🔢",
      subLessons: [
        { id: "5.1", title: "Numbers 1 to 5", time: 4, sequence: "1 2 3 4 5" },
        { id: "5.2", title: "Numbers 6 to 0", time: 4, sequence: "6 7 8 9 0" },
        { id: "5.3", title: "Number Drill", time: 5, sequence: "12345 67890" },
        { id: "5.4", title: "Mixed Numbers", time: 5, sequence: "12 34 56 78 90" }
      ]
    },

    {
      id: 6,
      title: "Speed Building",
      level: "Advanced",
      description: "Increase typing speed while maintaining accuracy.",
      icon: "⚡",
      subLessons: [
        { id: "6.1", title: "Speed Warmup", time: 4, sequence: "the and you" },
        { id: "6.2", title: "Common Patterns", time: 5, sequence: "tion ing ment able" },
        { id: "6.3", title: "Speed Drill", time: 5, sequence: "the and for are but not" },
        { id: "6.4", title: "Rhythm Practice", time: 5, sequence: "keep a steady typing rhythm" }
      ]
    },

    {
      id: 7,
      title: "Common Words",
      level: "Advanced",
      description: "Practice frequently used English words.",
      icon: "📚",
      subLessons: [
        { id: "7.1", title: "Common Words I", time: 4, sequence: "the and for are" },
        { id: "7.2", title: "Common Words II", time: 4, sequence: "with this that from" },
        { id: "7.3", title: "Word Groups", time: 5, sequence: "you your they their" },
        { id: "7.4", title: "Fast Word Drill", time: 5, sequence: "people time work day way" }
      ]
    },

    {
      id: 8,
      title: "Sentence Practice",
      level: "Advanced",
      description: "Practice complete sentences with better rhythm.",
      icon: "📝",
      subLessons: [
        { id: "8.1", title: "Short Sentences", time: 4, sequence: "I can type well." },
        { id: "8.2", title: "Daily Sentences", time: 5, sequence: "I practice typing every day." },
        { id: "8.3", title: "Long Sentences", time: 5, sequence: "Good typing comes from regular practice." },
        { id: "8.4", title: "Sentence Rhythm", time: 5, sequence: "Focus on accuracy before increasing speed." }
      ]
    },

    {
      id: 9,
      title: "Punctuation",
      level: "Advanced",
      description: "Practice commas, periods, question marks and symbols.",
      icon: ".,",
      subLessons: [
        { id: "9.1", title: "Periods and Commas", time: 4, sequence: "Hello, world." },
        { id: "9.2", title: "Question Marks", time: 4, sequence: "How are you?" },
        { id: "9.3", title: "Exclamation Marks", time: 4, sequence: "Great job!" },
        { id: "9.4", title: "Punctuation Drill", time: 5, sequence: "Hello, how are you? Great!" }
      ]
    },

    {
      id: 10,
      title: "Accuracy Mastery",
      level: "Advanced",
      description: "Reduce mistakes and develop consistent typing habits.",
      icon: "🎯",
      subLessons: [
        { id: "10.1", title: "Accuracy Warmup", time: 4, sequence: "accuracy first" },
        { id: "10.2", title: "Slow and Correct", time: 5, sequence: "slow typing creates good habits" },
        { id: "10.3", title: "Mistake Control", time: 5, sequence: "focus carefully and avoid mistakes" },
        { id: "10.4", title: "Accuracy Challenge", time: 6, sequence: "Accuracy is more important than speed." }
      ]
    },

    {
      id: 11,
      title: "Speed Challenge",
      level: "Advanced",
      description: "Challenge yourself with faster typing sequences.",
      icon: "🚀",
      subLessons: [
        { id: "11.1", title: "Speed Warmup", time: 4, sequence: "ready set type" },
        { id: "11.2", title: "Fast Words", time: 5, sequence: "quick fast steady accurate" },
        { id: "11.3", title: "Speed Drill", time: 6, sequence: "Keep a steady rhythm and avoid mistakes." },
        { id: "11.4", title: "Speed Test", time: 6, sequence: "type faster while keeping accuracy" }
      ]
    },

    {
      id: 12,
      title: "Final Typing Challenge",
      level: "Advanced",
      description: "Complete the final typing challenge.",
      icon: "🏆",
      subLessons: [
        { id: "12.1", title: "Final Warmup", time: 4, sequence: "ready for the final challenge" },
        { id: "12.2", title: "Mixed Keys", time: 5, sequence: "asdf qwer jkl uiop" },
        { id: "12.3", title: "Final Sentence", time: 6, sequence: "Practice makes typing faster and more accurate." },
        { id: "12.4", title: "Final Challenge", time: 7, sequence: "You are ready to complete the final typing challenge." }
      ]
    }
  ];


  /* =====================================================
     DATABASE PROGRESS
  ===================================================== */

  let completed = {};
  let lessonDbProgress = {};

  function getCurrentUserId() {
    return localStorage.getItem("typemaster-user-id");
  }

  async function loadProgressFromDB() {

    const userId = getCurrentUserId();

    if (!userId) {
      console.warn("No logged-in user found.");
      return;
    }

    try {

      const response = await getLessonProgress(userId);

      const progress = response.progress || [];

      completed = {};
      lessonDbProgress = {};

      progress.forEach(row => {

        const lessonId = Number(row.lessonNumber);
        const lesson = lessons.find(
          item => item.id === lessonId
        );

        if (!lesson) return;

        lessonDbProgress[lessonId] = row;

        const percent = Math.max(
          0,
          Math.min(100, Number(row.progress) || 0)
        );

        const completedCount = row.completed
          ? lesson.subLessons.length
          : Math.floor(
            (percent / 100) *
            lesson.subLessons.length
          );

        lesson.subLessons
          .slice(0, completedCount)
          .forEach(sub => {

            completed[
              subKey(
                lesson.id,
                sub.id
              )
            ] = true;

          });

      });

    } catch (error) {

      console.error(
        "Failed to load lesson progress:",
        error
      );

    }
  }


  async function saveProgressToDB(lesson) {

    const userId = getCurrentUserId();

    if (!userId) {
      console.warn(
        "Cannot save progress: user not logged in."
      );
      return;
    }

    try {

      const completedCount =
        lesson.subLessons.filter(sub =>
          isSubCompleted(
            lesson.id,
            sub.id
          )
        ).length;

      const progress = Math.round(
        (completedCount /
          lesson.subLessons.length) *
        100
      );

      const existing =
        lessonDbProgress[lesson.id] || {};

      const response =
        await saveLessonProgress({

          userId: userId,

          lessonId: lesson.id,

          progress: progress,

          bestWpm:
            Number(existing.bestWpm) || 0,

          accuracy:
            Number(existing.accuracy) || 0,

          completed:
            completedCount ===
            lesson.subLessons.length

        });

      if (response && response.progress) {

        lessonDbProgress[
          lesson.id
        ] = response.progress;

      }

    } catch (error) {

      console.error(
        "Failed to save lesson progress:",
        error
      );

    }
  }


  function subKey(
    lessonId,
    subId
  ) {

    return `${lessonId}-${subId}`;

  }


  function isSubCompleted(
    lessonId,
    subId
  ) {

    return (
      completed[
      subKey(
        lessonId,
        subId
      )
      ] === true
    );

  }


  function isLessonCompleted(
    lesson
  ) {

    return lesson.subLessons.every(
      sub =>
        isSubCompleted(
          lesson.id,
          sub.id
        )
    );

  }


  function isLessonUnlocked(id) {

    if (id === 1)
      return true;

    const previous =
      lessons.find(
        lesson =>
          lesson.id === id - 1
      );

    return previous
      ? isLessonCompleted(previous)
      : false;

  }
  /* =====================================================
     PAGE ELEMENTS
  ===================================================== */

  const grid = document.getElementById("lessonsGrid");
  const progressText = document.getElementById("progressText");
  const progressBar = document.getElementById("progressBar");
  const continueButton = document.getElementById("continueButton");
  const nextLessonNumber = document.getElementById("nextLessonNumber");
  const nextLessonTitle = document.getElementById("nextLessonTitle");
  const nextLessonDescription = document.getElementById("nextLessonDescription");
  const nextLessonMeta = document.getElementById("nextLessonMeta");


  /* =====================================================
     PAGE PROGRESS
  ===================================================== */

  function updatePageProgress() {

    if (!progressText || !progressBar) return;

    const done = lessons.filter(
      isLessonCompleted
    ).length;

    const percent = Math.round(
      (done / lessons.length) * 100
    );

    progressText.textContent =
      `${done} / ${lessons.length}`;

    progressBar.style.width =
      `${percent}%`;
  }


  function getNextLesson() {
    return lessons.find(
      lesson => !isLessonCompleted(lesson)
    );
  }


  function isLessonStarted(lesson) {
    return lesson.subLessons.some(sub =>
      isSubCompleted(lesson.id, sub.id)
    );
  }


  function updateContinue() {

    if (
      !continueButton ||
      !nextLessonNumber ||
      !nextLessonTitle ||
      !nextLessonDescription ||
      !nextLessonMeta
    ) return;

    const next = getNextLesson();

    if (!next) {

      nextLessonNumber.textContent =
        "COURSE COMPLETE";

      nextLessonTitle.textContent =
        "Congratulations! 🎉";

      nextLessonDescription.textContent =
        "You completed all 12 typing lessons.";

      nextLessonMeta.textContent =
        "All lessons completed";

      continueButton.textContent =
        "Completed ✓";

      continueButton.disabled = true;

      return;
    }

    nextLessonNumber.textContent =
      `LESSON ${String(next.id).padStart(2, "0")}`;

    nextLessonTitle.textContent =
      next.title;

    nextLessonDescription.textContent =
      next.description;

    nextLessonMeta.textContent =
      `${next.level} · ${next.subLessons.length} exercises`;

    continueButton.disabled = false;

    continueButton.textContent =
      isLessonStarted(next)
        ? "Continue Lesson →"
        : "Start Lesson →";
  }


  /* =====================================================
     LESSON CARDS
  ===================================================== */

  function renderCards(filter = "all") {

    if (!grid) return;

    grid.innerHTML = "";

    lessons.forEach(lesson => {

      if (
        filter !== "all" &&
        lesson.level !== filter
      ) return;

      const unlocked =
        isLessonUnlocked(lesson.id);

      const finished =
        isLessonCompleted(lesson);

      const count =
        lesson.subLessons.filter(sub =>
          isSubCompleted(
            lesson.id,
            sub.id
          )
        ).length;

      const card =
        document.createElement("article");

      card.className = "lesson-card";

      if (!unlocked)
        card.classList.add("locked");

      if (finished)
        card.classList.add("completed");

      card.innerHTML = `
        <div class="lesson-card-top">
          <div class="lesson-number">
            ${finished ? "✓" :
          String(lesson.id).padStart(2, "0")}
          </div>

          <span class="lesson-status">
            ${finished
          ? "Completed"
          : unlocked
            ? "Available"
            : "🔒 Locked"
        }
          </span>
        </div>

        <span class="lesson-level">
          ${lesson.level.toUpperCase()}
        </span>

        <h3>
          ${lesson.icon}
          ${lesson.title}
        </h3>

        <p>
          ${lesson.description}
        </p>

        <div class="lesson-meta">
          ${count}/${lesson.subLessons.length}
          exercises complete
        </div>

        <button
          class="lesson-button"
          type="button"
          ${!unlocked ? "disabled" : ""}
        >
          ${finished
          ? "Review Lesson →"
          : count > 0
            ? "Continue Lesson →"
            : "Start Lesson →"
        }
        </button>
      `;

      const button =
        card.querySelector(".lesson-button");

      if (unlocked) {

        button.addEventListener("click", e => {

          e.preventDefault();
          e.stopPropagation();

          openCourse(lesson.id);

        });

      }

      grid.appendChild(card);
    });
  }


  /* =====================================================
     FILTERS
  ===================================================== */

  document
    .querySelectorAll(".filter-button")
    .forEach(button => {

      button.addEventListener("click", () => {

        document
          .querySelectorAll(".filter-button")
          .forEach(item =>
            item.classList.remove("active")
          );

        button.classList.add("active");

        renderCards(
          button.dataset.filter
        );
      });

    });


  /* =====================================================
     COURSE STATE
  ===================================================== */

  let currentMainLesson = 1;
  let currentSubLesson = null;
  let overlay = null;
  let typingState = null;


  /* =====================================================
     OPEN COURSE
  ===================================================== */

  function openCourse(lessonId) {

    const lesson =
      lessons.find(
        item => item.id === lessonId
      );

    if (!lesson) return;

    if (!isLessonUnlocked(lessonId)) {

      alert(
        `Complete Lesson ${lessonId - 1} first.`
      );

      return;
    }

    currentMainLesson = lessonId;
    currentSubLesson = null;

    createOverlay();
    renderCourseHome();
  }
  /* =====================================================
   CREATE COURSE OVERLAY
===================================================== */

  function createOverlay() {

    if (overlay) {
      overlay.remove();
    }

    overlay = document.createElement("div");

    overlay.className = "course-overlay";

    overlay.innerHTML = `
      <main class="course-main">

        <header class="course-top">

          <div class="course-title">

            <div class="course-play">
              ▶
            </div>

            <div>
              <h1>
                Fast Touch Typing Course
              </h1>

              <p>
                Learn touch typing step by step.
              </p>
            </div>

          </div>

          <button
            class="course-close"
            id="courseClose"
            type="button"
          >
            ×
          </button>

        </header>

        <div
          id="courseTabs"
          class="course-tabs"
        ></div>

        <div
          id="courseContent"
          class="course-content"
        ></div>

      </main>

      <aside class="course-side">

        <div class="side-header">
          <h2>📊 Your Progress</h2>
        </div>

        <div
          id="sideProgress"
          class="side-progress"
        ></div>

        <div class="side-time">

          <span>
            Time
          </span>

          <strong id="sideTimer">
            00:00
          </strong>

        </div>

        <div
          id="sideInfo"
          class="side-info"
        ></div>

        <div class="side-buttons">

          <button
            id="sideNext"
            class="side-next"
            type="button"
            disabled
          >
            Next
          </button>

          <button
            id="sideCancel"
            class="side-cancel"
            type="button"
          >
            Cancel
          </button>

        </div>

      </aside>
    `;

    document.body.appendChild(overlay);


    const closeButton =
      document.getElementById(
        "courseClose"
      );

    if (closeButton) {
      closeButton.addEventListener(
        "click",
        closeCourse
      );
    }


    const cancelButton =
      document.getElementById(
        "sideCancel"
      );

    if (cancelButton) {

      cancelButton.addEventListener(
        "click",
        () => {

          if (currentSubLesson) {
            renderCourseHome();
          } else {
            closeCourse();
          }

        }
      );

    }


    const nextButton =
      document.getElementById(
        "sideNext"
      );

    if (nextButton) {

      nextButton.addEventListener(
        "click",
        () => {

          if (
            typingState &&
            typingState.finished
          ) {

            goToNextSubLesson();

          }

        }
      );

    }

  }


  /* =====================================================
     CLOSE COURSE
  ===================================================== */

  function closeCourse() {

    stopTyping();

    if (overlay) {

      overlay.remove();

      overlay = null;

    }

    currentSubLesson = null;

    updatePageProgress();

    updateContinue();

    renderCards();
  }


  /* =====================================================
     COURSE TABS
  ===================================================== */

  function renderCourseTabs() {

    const tabs =
      document.getElementById(
        "courseTabs"
      );

    if (!tabs) {
      return;
    }

    tabs.innerHTML = "";


    lessons.forEach(
      lesson => {

        const button =
          document.createElement(
            "button"
          );

        button.className =
          "course-tab";


        const unlocked =
          isLessonUnlocked(
            lesson.id
          );


        const finished =
          isLessonCompleted(
            lesson
          );


        if (
          lesson.id ===
          currentMainLesson
        ) {

          button.classList.add(
            "active"
          );

        }


        if (!unlocked) {

          button.classList.add(
            "locked"
          );

        } else {

          button.classList.add(
            "available"
          );

        }


        button.textContent =
          lesson.id;


        if (unlocked) {

          button.addEventListener(
            "click",
            () => {

              stopTyping();

              currentMainLesson =
                lesson.id;

              currentSubLesson =
                null;

              renderCourseHome();

            }
          );

        }


        if (finished) {

          button.title =
            "Completed";

        }


        tabs.appendChild(
          button
        );

      }
    );

  }


  /* =====================================================
     COURSE HOME
  ===================================================== */

  function renderCourseHome() {

    stopTyping();

    currentSubLesson = null;

    renderCourseTabs();


    const lesson =
      lessons.find(
        item =>
          item.id ===
          currentMainLesson
      );


    const content =
      document.getElementById(
        "courseContent"
      );


    if (
      !lesson ||
      !content
    ) {
      return;
    }


    content.innerHTML = `

      <div class="course-content-inner">

        <h2>
          Lesson ${lesson.id}:
          ${lesson.title}
        </h2>

        <div
          id="sublessonList"
          class="sublesson-list"
        ></div>

        <div class="course-navigation">

          <button
            id="previousMain"
            class="course-nav-button"
            type="button"
          >
            ← Previous
          </button>

          <button
            id="nextMain"
            class="course-nav-button"
            type="button"
          >
            Next Lesson →
          </button>

        </div>

      </div>

    `;


    const list =
      document.getElementById(
        "sublessonList"
      );


    lesson.subLessons.forEach(
      (sub, index) => {

        const done =
          isSubCompleted(
            lesson.id,
            sub.id
          );


        const previous =
          index === 0 ||
          isSubCompleted(
            lesson.id,
            lesson.subLessons[
              index - 1
            ].id
          );


        const unlocked =
          previous ||
          done;


        const row =
          document.createElement(
            "div"
          );


        row.className =
          "sublesson";


        if (!unlocked) {

          row.classList.add(
            "locked"
          );

        }


        if (done) {

          row.classList.add(
            "completed"
          );

        }


        row.innerHTML = `

          <div class="sublesson-check">
            ${done ? "✓" : ""}
          </div>

          <div class="sublesson-title">
            ${sub.id}
            &nbsp;
            ${sub.title}
          </div>

          <div class="sublesson-time">
            ${sub.time} min
          </div>

        `;


        if (unlocked) {

          row.addEventListener(
            "click",
            () => {

              startSubLesson(
                lesson,
                sub
              );

            }
          );

        }


        list.appendChild(
          row
        );

      }
    );


    const previousButton =
      document.getElementById(
        "previousMain"
      );


    const nextButton =
      document.getElementById(
        "nextMain"
      );


    if (previousButton) {

      previousButton.disabled =
        lesson.id === 1;


      if (lesson.id > 1) {

        previousButton.textContent =
          `← Lesson ${lesson.id - 1}`;


        previousButton.onclick =
          () => {

            currentMainLesson--;

            renderCourseHome();

          };

      }

    }


    if (nextButton) {

      nextButton.disabled =
        lesson.id === lessons.length ||
        !isLessonCompleted(
          lesson
        );


      if (
        lesson.id <
        lessons.length
      ) {

        nextButton.textContent =
          `Lesson ${lesson.id + 1} →`;


        nextButton.onclick =
          () => {

            if (
              isLessonCompleted(
                lesson
              )
            ) {

              currentMainLesson++;

              renderCourseHome();

            }

          };

      }

    }


    updateSidePanel(
      lesson,
      null
    );

  }


  /* =====================================================
     START SUB LESSON
  ===================================================== */

  function startSubLesson(
    lesson,
    sub
  ) {

    stopTyping();


    currentMainLesson =
      lesson.id;


    currentSubLesson =
      sub.id;


    /*
      IMPORTANT:
      Every sub-lesson receives
      a completely new timer.
    */

    typingState = {

      lesson: lesson,

      sub: sub,

      chars:
        Array.from(
          sub.sequence
        ),

      index: 0,

      mistakes: 0,

      correct: 0,

      started: false,

      finished: false,

      timer: null,

      seconds:
        Number(sub.time) * 60

    };


    renderTypingScreen();


    renderSequence();

    highlightKeyboard();


    updateFinger(
      typingState.chars[0]
    );


    updateTimer();


    startTimer();


    document.removeEventListener(
      "keydown",
      handleTypingKey
    );


    document.addEventListener(
      "keydown",
      handleTypingKey
    );

  }
  /* =====================================================
   TYPING SCREEN
===================================================== */

  function renderTypingScreen() {

    renderCourseTabs();

    const content =
      document.getElementById(
        "courseContent"
      );

    if (
      !content ||
      !typingState
    ) return;

    content.innerHTML = `
      <div class="course-content-inner">

        <div class="sequence-title">
          TYPE THE KEY SEQUENCE
        </div>

        <div
          id="sequenceBox"
          class="sequence-box"
        ></div>

        <div class="keyboard-title">
          Follow the highlighted key on the keyboard
        </div>

        <div class="virtual-keyboard">
          ${keyboardRows()}
        </div>

        <div class="finger-area">

          <div class="hand-box">

            <div class="hand realistic-hand left-realistic-hand">
              ${realisticHandSVG("left")}
            </div>

            <div
              id="leftFingers"
              class="finger-dots"
            >
              ${fingerDots()}
            </div>

            <div
              id="leftFingerLabel"
              class="finger-label"
            >
              Left Hand
            </div>

          </div>

          <div class="hand-box">

            <div class="hand realistic-hand right-realistic-hand">
              ${realisticHandSVG("right")}
            </div>

            <div
              id="rightFingers"
              class="finger-dots"
            >
              ${fingerDots()}
            </div>

            <div
              id="rightFingerLabel"
              class="finger-label"
            >
              Right Hand
            </div>

          </div>

        </div>

        <div
          id="typingMessage"
          class="typing-message"
        >
          Press the highlighted key to begin.
        </div>

      </div>
    `;

    updateSidePanel(
      typingState.lesson,
      typingState.sub
    );
  }


  /* =====================================================
     KEYBOARD
  ===================================================== */

  function keyboardRows() {

    return `
      <div class="keyboard-row">

        ${key("`", "~")}
        ${key("1", "1")}
        ${key("2", "2")}
        ${key("3", "3")}
        ${key("4", "4")}
        ${key("5", "5")}
        ${key("6", "6")}
        ${key("7", "7")}
        ${key("8", "8")}
        ${key("9", "9")}
        ${key("0", "0")}
        ${key("-", "-")}
        ${key("=", "=")}

        <div class="key wide">
          Back
        </div>

      </div>

      <div class="keyboard-row">

        <div class="key">
          Tab
        </div>

        ${key("q", "Q")}
        ${key("w", "W")}
        ${key("e", "E")}
        ${key("r", "R")}
        ${key("t", "T")}
        ${key("y", "Y")}
        ${key("u", "U")}
        ${key("i", "I")}
        ${key("o", "O")}
        ${key("p", "P")}
        ${key("[", "[")}
        ${key("]", "]")}
        ${key("\\", "\\")}

      </div>

      <div class="keyboard-row">

        <div class="key wide">
          Caps
        </div>

        ${key("a", "A")}
        ${key("s", "S")}
        ${key("d", "D")}
        ${key("f", "F")}
        ${key("g", "G")}
        ${key("h", "H")}
        ${key("j", "J")}
        ${key("k", "K")}
        ${key("l", "L")}
        ${key(";", ";")}
        ${key("'", "'")}

        <div class="key wide">
          Enter
        </div>

      </div>

      <div class="keyboard-row">

        <div class="key wide">
          Shift
        </div>

        ${key("z", "Z")}
        ${key("x", "X")}
        ${key("c", "C")}
        ${key("v", "V")}
        ${key("b", "B")}
        ${key("n", "N")}
        ${key("m", "M")}
        ${key(",", ",")}
        ${key(".", ".")}
        ${key("/", "/")}

        <div class="key wide">
          Shift
        </div>

      </div>

      <div class="keyboard-row">

        <div class="key wide">
          Ctrl
        </div>

        <div
          class="key space"
          data-key=" "
        >
          Space
        </div>

        <div class="key wide">
          Ctrl
        </div>

      </div>
    `;
  }


  function key(value, label) {

    return `
      <div
        class="key"
        data-key="${escapeAttribute(value)}"
      >
        ${label}
      </div>
    `;
  }


  function escapeAttribute(value) {

    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }


  /* =====================================================
     REALISTIC HUMAN HAND
  ===================================================== */

  function realisticHandSVG(side) {

    const uid =
      `hand-${side}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;

    const isRight =
      side === "right";

    return `
      <svg
        class="hand-svg realistic-hand-svg"
        viewBox="0 0 240 210"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="${isRight ? "Right" : "Left"} hand"
      >

        <defs>

          <linearGradient
            id="${uid}-skin"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0%"
              stop-color="#ffe9d7"
            />

            <stop
              offset="30%"
              stop-color="#efb38f"
            />

            <stop
              offset="65%"
              stop-color="#d88b69"
            />

            <stop
              offset="100%"
              stop-color="#b8664e"
            />
          </linearGradient>


          <linearGradient
            id="${uid}-finger"
            x1="0"
            y1="0"
            x2=".85"
            y2="1"
          >
            <stop
              offset="0%"
              stop-color="#ffe5d0"
            />

            <stop
              offset="45%"
              stop-color="#edb08c"
            />

            <stop
              offset="100%"
              stop-color="#c87658"
            />
          </linearGradient>


          <radialGradient
            id="${uid}-palm"
            cx="42%"
            cy="35%"
            r="72%"
          >
            <stop
              offset="0%"
              stop-color="#ffd9c0"
            />

            <stop
              offset="55%"
              stop-color="#e5a07d"
            />

            <stop
              offset="100%"
              stop-color="#bd6d53"
            />
          </radialGradient>


          <linearGradient
            id="${uid}-nail"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stop-color="#fffdfb"
            />

            <stop
              offset="65%"
              stop-color="#f3ddd5"
            />

            <stop
              offset="100%"
              stop-color="#c9988a"
            />
          </linearGradient>


          <filter
            id="${uid}-shadow"
            x="-40%"
            y="-35%"
            width="180%"
            height="190%"
          >

            <feDropShadow
              dx="0"
              dy="7"
              stdDeviation="5.5"
              flood-color="#334155"
              flood-opacity=".28"
            />

          </filter>

        </defs>


        <g
          ${isRight
        ? `transform="translate(240 0) scale(-1 1)"`
        : ""
      }
          filter="url(#${uid}-shadow)"
        >

          <!-- WRIST -->

          <path
            d="
              M76 181
              C80 163 84 148 87 136
              C101 142 117 146 134 145
              C150 144 163 140 169 134
              C171 150 165 168 163 181
              Z
            "
            fill="url(#${uid}-skin)"
            stroke="#a85f49"
            stroke-width="1.7"
          />


          <!-- PALM -->

          <path
            d="
              M76 142
              C69 132 68 119 70 106
              L76 72

              C77 65 82 61 88 62
              C94 63 97 68 96 75
              L93 105

              C94 106 95 106 96 104
              L98 43

              C98 34 103 29 110 30
              C117 30 120 36 119 44
              L116 103

              C117 104 119 104 120 102
              L122 33

              C122 24 128 19 135 20
              C142 21 146 27 145 36
              L141 103

              C142 104 144 104 145 102
              L149 45

              C150 36 155 31 162 32
              C169 33 172 39 171 48
              L167 108

              C168 109 169 109 170 107
              L173 68

              C174 59 179 55 185 57
              C191 59 193 65 192 73
              L186 118

              C184 136 175 151 160 161

              C145 172 124 176 104 170

              C91 166 82 156 76 142
              Z
            "
            fill="url(#${uid}-palm)"
            stroke="#a85f49"
            stroke-width="2"
            stroke-linejoin="round"
          />


          <!-- THUMB -->

          <g
            class="hand-finger hand-thumb"
            data-finger="thumb"
          >

            <path
              d="
                M82 129
                C72 125 59 117 48 107
                C40 100 39 92 44 86
                C49 80 57 81 64 87
                L91 111
                C98 118 94 130 82 129
                Z
              "
              fill="url(#${uid}-finger)"
              stroke="#a85f49"
              stroke-width="2"
            />

            <path
              d="M47 88 C51 84 57 85 62 89"
              fill="none"
              stroke="#fff3e9"
              stroke-width="3"
              stroke-linecap="round"
              opacity=".42"
            />

          </g>


          <!-- LITTLE FINGER -->

          <g
            class="hand-finger hand-pinky"
            data-finger="pinky"
          >

            <path
              d="
                M172 70
                L175 62
                C177 56 182 54 186 56
                C191 58 192 63 191 69
                L186 114
                C184 119 180 121 176 119
                C172 117 170 113 171 108
                Z
              "
              fill="url(#${uid}-finger)"
              stroke="#a85f49"
              stroke-width="1.6"
            />

            <path
              d="M178 63 C181 59 186 59 189 62"
              fill="none"
              stroke="#fff3e9"
              stroke-width="2.5"
              stroke-linecap="round"
              opacity=".48"
            />

          </g>


          <!-- RING FINGER -->

          <g
            class="hand-finger hand-ring"
            data-finger="ring"
          >

            <path
              d="
                M148 47
                L150 39
                C151 33 156 30 162 32
                C168 33 171 38 170 45
                L166 108
                C165 114 161 117 157 116
                C152 115 150 111 150 106
                Z
              "
              fill="url(#${uid}-finger)"
              stroke="#a85f49"
              stroke-width="1.7"
            />

            <path
              d="M154 40 C157 35 164 35 167 39"
              fill="none"
              stroke="#fff3e9"
              stroke-width="2.7"
              stroke-linecap="round"
              opacity=".5"
            />

          </g>


          <!-- MIDDLE FINGER -->

          <g
            class="hand-finger hand-middle"
            data-finger="middle"
          >

            <path
              d="
                M122 35
                L123 28
                C124 21 129 18 135 20
                C141 21 145 26 144 34
                L141 106
                C140 112 136 115 132 114
                C127 113 124 109 124 104
                Z
              "
              fill="url(#${uid}-finger)"
              stroke="#a85f49"
              stroke-width="1.8"
            />

            <path
              d="M128 29 C131 24 138 24 141 28"
              fill="none"
              stroke="#fff3e9"
              stroke-width="2.8"
              stroke-linecap="round"
              opacity=".52"
            />

          </g>


          <!-- INDEX FINGER -->

          <g
            class="hand-finger hand-index"
            data-finger="index"
          >

            <path
              d="
                M98 47
                L99 40
                C100 33 104 29 110 30
                C116 31 119 36 118 43
                L115 106
                C114 112 110 114 106 113
                C101 112 98 108 98 103
                Z
              "
              fill="url(#${uid}-finger)"
              stroke="#a85f49"
              stroke-width="1.8"
            />

            <path
              d="M104 40 C107 35 113 35 116 39"
              fill="none"
              stroke="#fff3e9"
              stroke-width="2.8"
              stroke-linecap="round"
              opacity=".52"
            />

          </g>


          <!-- PALM CREASES -->

          <g
            fill="none"
            stroke="#985640"
            stroke-linecap="round"
          >

            <path
              d="M82 116 C98 128 120 134 145 128"
              stroke-width="2"
              opacity=".42"
            />

            <path
              d="M91 137 C108 149 132 151 152 141"
              stroke-width="1.8"
              opacity=".38"
            />

            <path
              d="M101 153 C115 159 134 159 146 153"
              stroke-width="1.5"
              opacity=".35"
            />

          </g>


          <!-- NAILS -->

          <g
            fill="url(#${uid}-nail)"
            stroke="#bd897a"
            stroke-width="1.2"
          >

            <path
              d="
                M101 42
                C101 35 105 32 110 33
                C115 33 117 37 116 43
                L115 50
                C111 53 105 53 101 50
                Z
              "
            />

            <path
              d="
                M126 32
                C126 25 130 22 135 22
                C140 23 143 27 142 33
                L141 41
                C137 44 131 44 127 41
                Z
              "
            />

            <path
              d="
                M153 43
                C153 37 157 34 162 34
                C166 35 169 39 168 44
                L167 51
                C163 54 157 54 153 51
                Z
              "
            />

            <path
              d="
                M178 63
                C178 58 182 55 186 57
                C190 58 191 62 190 67
                L189 72
                C185 75 181 74 178 71
                Z
              "
            />

          </g>


          <!-- NAIL HIGHLIGHTS -->

          <g
            fill="#fff"
            opacity=".62"
          >

            <ellipse
              cx="106"
              cy="38"
              rx="3.2"
              ry="1.4"
            />

            <ellipse
              cx="132"
              cy="27"
              rx="3.4"
              ry="1.5"
            />

            <ellipse
              cx="158"
              cy="39"
              rx="3.1"
              ry="1.4"
            />

            <ellipse
              cx="183"
              cy="61"
              rx="2.4"
              ry="1.1"
            />

          </g>


          <!-- PALM LIGHT -->

          <path
            d="M88 132 C101 144 120 148 138 144"
            fill="none"
            stroke="#fff7f0"
            stroke-width="4"
            stroke-linecap="round"
            opacity=".28"
          />

        </g>

      </svg>
    `;
  }
  /* =====================================================
   FINGER DOTS
===================================================== */

  function fingerDots() {

    return `
      <span class="finger-dot"></span>
      <span class="finger-dot"></span>
      <span class="finger-dot"></span>
      <span class="finger-dot"></span>
      <span class="finger-dot"></span>
    `;
  }


  /* =====================================================
     SEQUENCE DISPLAY
  ===================================================== */

  function renderSequence() {

    if (!typingState) return;

    const box =
      document.getElementById(
        "sequenceBox"
      );

    if (!box) return;

    box.innerHTML = "";

    typingState.chars.forEach(
      (char, index) => {

        const item =
          document.createElement("div");

        item.className =
          "sequence-key";

        if (
          index <
          typingState.index
        ) {
          item.classList.add("done");
        }

        if (
          index ===
          typingState.index
        ) {
          item.classList.add("active");
        }

        item.textContent =
          char === " "
            ? "Space"
            : char;

        box.appendChild(item);
      }
    );
  }


  /* =====================================================
     KEYBOARD HIGHLIGHT
  ===================================================== */

  function highlightKeyboard() {

    if (!typingState) return;

    document
      .querySelectorAll(
        ".virtual-keyboard .key"
      )
      .forEach(keyElement => {

        keyElement.classList.remove(
          "active"
        );

      });

    const expected =
      typingState.chars[
      typingState.index
      ];

    if (
      expected === undefined
    ) {
      return;
    }

    document
      .querySelectorAll(
        ".virtual-keyboard .key"
      )
      .forEach(keyElement => {

        if (
          keyElement.dataset.key ===
          expected
        ) {

          keyElement.classList.add(
            "active"
          );

        }

      });

    updateFinger(expected);
  }


  /* =====================================================
     FINGER MAPPING
  ===================================================== */

  function getFinger(value) {

    const key =
      String(value).toLowerCase();

    const map = {

      /* LEFT PINKY */

      "`": ["left", 0, "Left Pinky"],
      "1": ["left", 0, "Left Pinky"],
      "q": ["left", 0, "Left Pinky"],
      "a": ["left", 0, "Left Pinky"],
      "z": ["left", 0, "Left Pinky"],


      /* LEFT RING */

      "2": ["left", 1, "Left Ring"],
      "w": ["left", 1, "Left Ring"],
      "s": ["left", 1, "Left Ring"],
      "x": ["left", 1, "Left Ring"],


      /* LEFT MIDDLE */

      "3": ["left", 2, "Left Middle"],
      "e": ["left", 2, "Left Middle"],
      "d": ["left", 2, "Left Middle"],
      "c": ["left", 2, "Left Middle"],


      /* LEFT INDEX */

      "4": ["left", 3, "Left Index"],
      "5": ["left", 3, "Left Index"],
      "r": ["left", 3, "Left Index"],
      "t": ["left", 3, "Left Index"],
      "f": ["left", 3, "Left Index"],
      "g": ["left", 3, "Left Index"],
      "v": ["left", 3, "Left Index"],
      "b": ["left", 3, "Left Index"],


      /* RIGHT INDEX */

      "6": ["right", 3, "Right Index"],
      "7": ["right", 3, "Right Index"],
      "y": ["right", 3, "Right Index"],
      "u": ["right", 3, "Right Index"],
      "h": ["right", 3, "Right Index"],
      "j": ["right", 3, "Right Index"],
      "n": ["right", 3, "Right Index"],
      "m": ["right", 3, "Right Index"],


      /* RIGHT MIDDLE */

      "8": ["right", 2, "Right Middle"],
      "i": ["right", 2, "Right Middle"],
      "k": ["right", 2, "Right Middle"],


      /* RIGHT RING */

      "9": ["right", 1, "Right Ring"],
      "o": ["right", 1, "Right Ring"],
      "l": ["right", 1, "Right Ring"],


      /* RIGHT PINKY */

      "0": ["right", 0, "Right Pinky"],
      "-": ["right", 0, "Right Pinky"],
      "=": ["right", 0, "Right Pinky"],
      "p": ["right", 0, "Right Pinky"],
      "[": ["right", 0, "Right Pinky"],
      "]": ["right", 0, "Right Pinky"],
      "\\": ["right", 0, "Right Pinky"],
      ";": ["right", 0, "Right Pinky"],
      "'": ["right", 0, "Right Pinky"],
      "/": ["right", 0, "Right Pinky"],


      /* THUMB */

      " ": ["right", 4, "Thumb"]
    };

    return (
      map[key] ||
      ["right", 4, "Thumb"]
    );
  }


  /* =====================================================
     UPDATE FINGER
  ===================================================== */

  function updateFinger(value) {

    const [
      hand,
      finger,
      name
    ] = getFinger(value);


    /* Remove old dot highlight */

    document
      .querySelectorAll(".finger-dot")
      .forEach(dot => {

        dot.classList.remove(
          "active"
        );

      });


    /* Select correct hand */

    const selector =
      hand === "left"
        ? "#leftFingers"
        : "#rightFingers";


    const dots =
      document.querySelectorAll(
        `${selector} .finger-dot`
      );


    if (dots[finger]) {

      dots[finger].classList.add(
        "active"
      );

    }


    /* Remove old realistic-hand highlight */

    document
      .querySelectorAll(".hand-finger")
      .forEach(item => {

        item.classList.remove(
          "active-finger"
        );

      });


    /*
      SVG finger names:
      pinky
      ring
      middle
      index
      thumb
    */

    const fingerNames = [
      "pinky",
      "ring",
      "middle",
      "index",
      "thumb"
    ];


    const svgFinger =
      name === "Thumb"
        ? "thumb"
        : (
          fingerNames[finger] ||
          "index"
        );


    const handSelector =
      hand === "left"
        ? ".left-realistic-hand"
        : ".right-realistic-hand";


    const activeFinger =
      document.querySelector(
        `${handSelector} .hand-finger[data-finger="${svgFinger}"]`
      );


    if (activeFinger) {

      activeFinger.classList.add(
        "active-finger"
      );

    }


    /* Finger name */

    const label =
      document.getElementById(
        hand === "left"
          ? "leftFingerLabel"
          : "rightFingerLabel"
      );


    if (label) {

      label.textContent =
        name;

    }
  }


  /* =====================================================
     TIMER
  ===================================================== */

  function startTimer() {

    if (!typingState) return;


    clearInterval(
      typingState.timer
    );


    /*
      Every sub-lesson gets
      its own fresh timer.
    */

    typingState.started = true;


    updateTimer();


    typingState.timer =
      setInterval(() => {

        if (
          !typingState ||
          typingState.finished
        ) {

          clearInterval(
            typingState?.timer
          );

          return;
        }


        typingState.seconds--;


        updateTimer();


        if (
          typingState.seconds <= 0
        ) {

          finishCurrentSubLesson();

        }

      }, 1000);
  }


  function updateTimer() {

    if (!typingState)
      return;


    const total =
      Math.max(
        0,
        typingState.seconds
      );


    const minutes =
      Math.floor(
        total / 60
      );


    const seconds =
      total % 60;


    const timer =
      document.getElementById(
        "sideTimer"
      );


    if (timer) {

      timer.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    }
  }


  function stopTyping() {

    if (!typingState)
      return;


    if (typingState.timer) {

      clearInterval(
        typingState.timer
      );

      typingState.timer = null;

    }


    document.removeEventListener(
      "keydown",
      handleTypingKey
    );


    typingState = null;
  }


  /* =====================================================
     KEYBOARD INPUT
  ===================================================== */

  function handleTypingKey(event) {

    if (
      !typingState ||
      typingState.finished
    ) {
      return;
    }


    /*
      Ignore browser shortcuts.
    */

    if (
      event.ctrlKey ||
      event.altKey ||
      event.metaKey
    ) {
      return;
    }


    let pressed =
      event.key;


    /*
      Space must not scroll
      the page.
    */

    if (
      pressed === " "
    ) {

      event.preventDefault();

    }


    if (
      pressed.length === 1
    ) {

      pressed =
        pressed.toLowerCase();

    }


    const expected =
      typingState.chars[
      typingState.index
      ];


    if (
      expected === undefined
    ) {

      finishCurrentSubLesson();

      return;
    }


    /*
      Correct key
    */

    if (
      pressed ===
      expected.toLowerCase()
    ) {

      typingState.correct++;

      typingState.index++;


      const message =
        document.getElementById(
          "typingMessage"
        );


      if (message) {

        message.textContent =
          "Correct!";

        message.className =
          "typing-message success";

      }


      renderSequence();

      highlightKeyboard();


      /*
        Sequence finished
      */

      if (
        typingState.index >=
        typingState.chars.length
      ) {

        finishCurrentSubLesson();

      }

      return;
    }


    /* =====================================================
      Wrong key
   ===================================================== */

    typingState.mistakes++;
    /* Show wrong key on virtual keyboard */

    const wrongKey =
      document.querySelector(
        `.virtual-keyboard .key[data-key="${CSS.escape(pressed)}"]`
      );

    if (wrongKey) {

      wrongKey.classList.add("wrong");

      setTimeout(() => {
        wrongKey.classList.remove("wrong");
      }, 400);

    }


    /* Show error message */

    const message =
      document.getElementById(
        "typingMessage"
      );

    if (message) {

      message.textContent =
        "✕ Wrong key — try again.";

      message.className =
        "typing-message error";

    }
  }


  /* =====================================================
     FINISH CURRENT SUB LESSON
  ===================================================== */
  async function finishCurrentSubLesson() {

    if (
      !typingState ||
      typingState.finished
    ) {
      return;
    }

    typingState.finished = true;

    /* STOP TIMER IMMEDIATELY */

    if (typingState.timer) {
      clearInterval(
        typingState.timer
      );

      typingState.timer = null;
    }

    document.removeEventListener(
      "keydown",
      handleTypingKey
    );

    /* Save completed sub-lesson */

    completed[
      subKey(
        typingState.lesson.id,
        typingState.sub.id
      )
    ] = true;

    await saveProgressToDB(
      typingState.lesson
    );

    const message =
      document.getElementById(
        "typingMessage"
      );

    if (message) {
      message.textContent =
        "✓ Completed! Loading next lesson...";

      message.className =
        "typing-message success";
    }

    const next =
      document.getElementById(
        "sideNext"
      );

    if (next) {
      next.disabled = false;
      next.textContent = "Next →";
    }

    updatePageProgress();
    renderCards();
    updateContinue();

    /* Automatically open next sub-lesson */

    setTimeout(() => {

      if (
        typingState &&
        typingState.finished
      ) {
        goToNextSubLesson();
      }

    }, 700);
  }

  /* =====================================================
     NEXT SUB LESSON
  ===================================================== */

  function goToNextSubLesson() {

    if (
      !typingState ||
      !currentSubLesson
    ) {
      return;
    }


    const lesson =
      lessons.find(
        item =>
          item.id ===
          currentMainLesson
      );


    if (!lesson) {
      return;
    }


    const currentIndex =
      lesson.subLessons.findIndex(
        sub =>
          sub.id ===
          currentSubLesson
      );


    if (currentIndex < 0) {
      return;
    }


    const nextSub =
      lesson.subLessons[
      currentIndex + 1
      ];


    /*
      NEXT SUB-LESSON
    */

    if (nextSub) {

      startSubLesson(
        lesson,
        nextSub
      );

      return;
    }


    /*
      CURRENT MAIN LESSON
      IS COMPLETE
    */

    if (
      isLessonCompleted(lesson)
    ) {

      const nextLesson =
        lessons.find(
          item =>
            item.id ===
            lesson.id + 1
        );


      /*
        Automatically move to
        first sub-lesson of next
        main lesson.
      */

      if (nextLesson) {

        currentMainLesson =
          nextLesson.id;

        startSubLesson(
          nextLesson,
          nextLesson.subLessons[0]
        );

        return;
      }


      /*
        ALL 12 LESSONS COMPLETE
      */

      const message =
        document.getElementById(
          "typingMessage"
        );


      if (message) {

        message.textContent =
          "🎉 Congratulations! You completed the entire course.";

        message.className =
          "typing-message success";

      }
    }
  }


  /* =====================================================
     SIDE PANEL
  ===================================================== */

  function updateSidePanel(
    lesson,
    sub
  ) {

    if (!lesson) {
      return;
    }


    /*
      SUB-LESSON PROGRESS BARS
    */

    const progress =
      document.getElementById(
        "sideProgress"
      );


    if (progress) {

      progress.innerHTML = "";


      lesson.subLessons.forEach(
        item => {

          const bar =
            document.createElement(
              "span"
            );


          bar.className =
            "side-bar";


          if (
            isSubCompleted(
              lesson.id,
              item.id
            )
          ) {

            bar.classList.add(
              "active"
            );

          }


          if (
            sub &&
            item.id === sub.id
          ) {

            bar.classList.add(
              "active"
            );

          }


          progress.appendChild(
            bar
          );

        }
      );
    }


    /*
      LESSON INFORMATION
    */

    const info =
      document.getElementById(
        "sideInfo"
      );


    if (info) {

      if (sub) {

        info.innerHTML = `
          <span>
            LESSON
            ${String(lesson.id).padStart(2, "0")}
          </span>

          <strong>
            ${lesson.title}
          </strong>

          <small>
            ${sub.id} · ${sub.title}
          </small>
        `;

      } else {

        info.innerHTML = `
          <span>
            LESSON
            ${String(lesson.id).padStart(2, "0")}
          </span>

          <strong>
            ${lesson.title}
          </strong>

          <small>
            ${lesson.level}
          </small>
        `;

      }
    }


    /*
      NEXT BUTTON
    */

    const next =
      document.getElementById(
        "sideNext"
      );


    if (next) {

      next.disabled =
        true;

      next.textContent =
        "Next";


      if (
        sub &&
        isSubCompleted(
          lesson.id,
          sub.id
        )
      ) {

        next.disabled =
          false;

        next.textContent =
          "Next →";

      }
    }


    updateTimer();
  }


  /* =====================================================
     CONTINUE BUTTON
  ===================================================== */

  if (continueButton) {

    continueButton.addEventListener(
      "click",
      () => {

        const lesson =
          getNextLesson();


        if (!lesson) {
          return;
        }


        /*
          Find first unfinished
          sub-lesson.
        */

        const sub =
          lesson.subLessons.find(
            item =>
              !isSubCompleted(
                lesson.id,
                item.id
              )
          ) ||
          lesson.subLessons[0];


        currentMainLesson =
          lesson.id;


        currentSubLesson =
          null;


        createOverlay();


        startSubLesson(
          lesson,
          sub
        );

      }
    );
  }


  /* =====================================================
     KEYBOARD / BROWSER SAFETY
  ===================================================== */

  document.addEventListener(
    "keydown",
    event => {

      /*
        Do not let Space scroll
        the page while typing.
      */

      if (
        typingState &&
        event.key === " "
      ) {

        event.preventDefault();

      }

    },
    {
      passive: false
    }
  );


  /* =====================================================
     START APPLICATION
  ===================================================== */

  async function initializeLessons() {

    await loadProgressFromDB();

    renderCards();

    updatePageProgress();

    updateContinue();

  }

  initializeLessons();
});