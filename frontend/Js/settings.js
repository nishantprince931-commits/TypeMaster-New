// ========================================
// TYPEMASTER SETTINGS
// ========================================

document.addEventListener("DOMContentLoaded", () => {

  // ======================================
  // DEFAULT SETTINGS
  // ======================================

  const DEFAULTS = {

    theme: "light",

    reduceAnimations: false,

    soundEffects: true,
    liveWpm: true,
    liveAccuracy: true,
    highlightMistakes: true,

    paragraphFontSize: "medium",
    textWidth: "normal",
    cursorStyle: "line",
    virtualKeyboard: false,

    defaultDuration: "5",

    autoStart: false,

    showTimer: true,

    wpmGoal: 60,
    accuracyGoal: 95,
    practiceGoal: 15,

    dailyChallengeNotification: true,
    achievementNotification: true,
    practiceNotification: false

  };


  // ======================================
  // ELEMENTS
  // ======================================

  const themeSetting =
    document.getElementById("themeSetting");

  const reduceAnimations =
    document.getElementById("reduceAnimations");

  const soundEffects =
    document.getElementById("soundEffects");

  const liveWpm =
    document.getElementById("liveWpm");

  const liveAccuracy =
    document.getElementById("liveAccuracy");

  const highlightMistakes =
    document.getElementById("highlightMistakes");

  const paragraphFontSize =
    document.getElementById("paragraphFontSize");

  const textWidth =
    document.getElementById("textWidth");

  const cursorStyle =
    document.getElementById("cursorStyle");

  const virtualKeyboard =
    document.getElementById("virtualKeyboard");

  const defaultDuration =
    document.getElementById("defaultDuration");

  const autoStart =
    document.getElementById("autoStart");

  const showTimer =
    document.getElementById("showTimer");

  const wpmGoal =
    document.getElementById("wpmGoal");

  const accuracyGoal =
    document.getElementById("accuracyGoal");

  const practiceGoal =
    document.getElementById("practiceGoal");

  const dailyChallengeNotification =
    document.getElementById(
      "dailyChallengeNotification"
    );

  const achievementNotification =
    document.getElementById(
      "achievementNotification"
    );

  const practiceNotification =
    document.getElementById(
      "practiceNotification"
    );

  const saveButton =
    document.getElementById(
      "saveSettingsButton"
    );

  const resetButton =
    document.getElementById(
      "resetSettingsButton"
    );

  const clearHistoryButton =
    document.getElementById(
      "clearHistoryButton"
    );

  const resetProgressButton =
    document.getElementById(
      "resetProgressButton"
    );

  const clearAllDataButton =
    document.getElementById(
      "clearAllDataButton"
    );

  const saveMessage =
    document.getElementById(
      "saveMessage"
    );


  // ======================================
  // LOAD SETTINGS
  // ======================================

  let settings = {
    ...DEFAULTS
  };

  async function loadSettingsFromDB() {

    const userId =
      localStorage.getItem(
        "typemaster-user-id"
      );

    // If user is not logged in,
    // use localStorage settings.
    if (!userId) {

      try {

        const saved =
          localStorage.getItem(
            "typemaster-settings"
          );

        if (saved) {

          settings = {
            ...DEFAULTS,
            ...JSON.parse(saved)
          };

        }

      } catch (error) {

        console.error(
          "Could not load local settings:",
          error
        );

        settings = {
          ...DEFAULTS
        };

      }

      return;

    }

    try {

      const response =
        await fetch(
          `http://localhost:5000/api/auth/settings/${encodeURIComponent(userId)}`
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
          "Could not load settings."
        );
      }

      settings = {
        ...DEFAULTS,
        ...(data.settings || {})
      };

      // Keep localStorage in sync
      localStorage.setItem(
        "typemaster-settings",
        JSON.stringify(settings)
      );

    } catch (error) {

      console.error(
        "Could not load settings from database:",
        error
      );

      // DB unavailable → fallback to localStorage
      try {

        const saved =
          localStorage.getItem(
            "typemaster-settings"
          );

        if (saved) {

          settings = {
            ...DEFAULTS,
            ...JSON.parse(saved)
          };

        }

      } catch (localError) {

        console.error(
          "Could not load fallback settings:",
          localError
        );

        settings = {
          ...DEFAULTS
        };

      }

    }

  }
  // ======================================
  // THEME
  // ======================================

  function applyTheme(theme) {

    if (
      theme !== "dark" &&
      theme !== "light"
    ) {
      theme = "light";
    }


    // IMPORTANT:
    // TypeMaster uses BODY as the main theme element.

    if (theme === "dark") {

      document.body.classList.add(
        "dark-mode"
      );

    } else {

      document.body.classList.remove(
        "dark-mode"
      );

    }


    // Save theme separately

    localStorage.setItem(
      "typemaster-theme",
      theme
    );


    // Keep settings object updated

    settings.theme = theme;


    // Keep Settings dropdown synchronized

    if (themeSetting) {

      themeSetting.value = theme;

    }


    updateThemeButton();

  }


  // ======================================
  // TOP-RIGHT THEME BUTTON
  // ======================================

  const themeButton =
    document.getElementById(
      "themeButton"
    );


  function updateThemeButton() {

    if (!themeButton) {
      return;
    }


    const dark =
      document.body.classList.contains(
        "dark-mode"
      );


    themeButton.textContent =
      dark
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";

  }


  // ======================================
  // IMPORTANT
  // ======================================
  // app.js already handles the top-right
  // theme button.
  //
  // So settings.js DOES NOT add another
  // click event to that button.
  //
  // This prevents double-toggle problems.
  // ======================================


  // ======================================
  // FILL FORM
  // ======================================

  function loadForm() {

    if (themeSetting) {

      themeSetting.value =
        settings.theme;

    }


    if (reduceAnimations) {

      reduceAnimations.checked =
        settings.reduceAnimations;

    }


    if (soundEffects) {

      soundEffects.checked =
        settings.soundEffects;

    }


    if (liveWpm) {

      liveWpm.checked =
        settings.liveWpm;

    }


    if (liveAccuracy) {

      liveAccuracy.checked =
        settings.liveAccuracy;

    }


    if (highlightMistakes) {

      highlightMistakes.checked =
        settings.highlightMistakes;

    }


    if (paragraphFontSize) {

      paragraphFontSize.value =
        settings.paragraphFontSize;

    }


    if (textWidth) {

      textWidth.value =
        settings.textWidth;

    }


    if (cursorStyle) {

      cursorStyle.value =
        settings.cursorStyle;

    }


    if (virtualKeyboard) {

      virtualKeyboard.checked =
        settings.virtualKeyboard;

    }


    if (defaultDuration) {

      defaultDuration.value =
        settings.defaultDuration;

    }


    if (autoStart) {

      autoStart.checked =
        settings.autoStart;

    }


    if (showTimer) {

      showTimer.checked =
        settings.showTimer;

    }


    if (wpmGoal) {

      wpmGoal.value =
        settings.wpmGoal;

    }


    if (accuracyGoal) {

      accuracyGoal.value =
        settings.accuracyGoal;

    }


    if (practiceGoal) {

      practiceGoal.value =
        settings.practiceGoal;

    }


    if (dailyChallengeNotification) {

      dailyChallengeNotification.checked =
        settings.dailyChallengeNotification;

    }


    if (achievementNotification) {

      achievementNotification.checked =
        settings.achievementNotification;

    }


    if (practiceNotification) {

      practiceNotification.checked =
        settings.practiceNotification;

    }

  }


  // ======================================
  // GET FORM VALUES
  // ======================================

  function getFormValues() {

    return {

      theme:
        themeSetting
          ? (
            themeSetting.value === "dark"
              ? "dark"
              : "light"
          )
          : settings.theme,


      reduceAnimations:
        reduceAnimations
          ? reduceAnimations.checked
          : DEFAULTS.reduceAnimations,


      soundEffects:
        soundEffects
          ? soundEffects.checked
          : DEFAULTS.soundEffects,


      liveWpm:
        liveWpm
          ? liveWpm.checked
          : DEFAULTS.liveWpm,


      liveAccuracy:
        liveAccuracy
          ? liveAccuracy.checked
          : DEFAULTS.liveAccuracy,


      highlightMistakes:
        highlightMistakes
          ? highlightMistakes.checked
          : DEFAULTS.highlightMistakes,


      paragraphFontSize:
        paragraphFontSize
          ? paragraphFontSize.value
          : DEFAULTS.paragraphFontSize,


      textWidth:
        textWidth
          ? textWidth.value
          : DEFAULTS.textWidth,


      cursorStyle:
        cursorStyle
          ? cursorStyle.value
          : DEFAULTS.cursorStyle,


      virtualKeyboard:
        virtualKeyboard
          ? virtualKeyboard.checked
          : DEFAULTS.virtualKeyboard,


      defaultDuration:
        defaultDuration
          ? defaultDuration.value
          : DEFAULTS.defaultDuration,


      autoStart:
        autoStart
          ? autoStart.checked
          : DEFAULTS.autoStart,


      showTimer:
        showTimer
          ? showTimer.checked
          : DEFAULTS.showTimer,


      wpmGoal:
        wpmGoal
          ? Number(wpmGoal.value) || DEFAULTS.wpmGoal
          : DEFAULTS.wpmGoal,


      accuracyGoal:
        accuracyGoal
          ? Number(accuracyGoal.value) || DEFAULTS.accuracyGoal
          : DEFAULTS.accuracyGoal,


      practiceGoal:
        practiceGoal
          ? Number(practiceGoal.value) || DEFAULTS.practiceGoal
          : DEFAULTS.practiceGoal,


      dailyChallengeNotification:
        dailyChallengeNotification
          ? dailyChallengeNotification.checked
          : DEFAULTS.dailyChallengeNotification,


      achievementNotification:
        achievementNotification
          ? achievementNotification.checked
          : DEFAULTS.achievementNotification,


      practiceNotification:
        practiceNotification
          ? practiceNotification.checked
          : DEFAULTS.practiceNotification

    };

  }


  // ======================================
  // SAVE SETTINGS
  // ======================================

  async function saveSettings(showMessage = true) {

    settings =
      getFormValues();


    // Save complete settings locally

    localStorage.setItem(
      "typemaster-settings",
      JSON.stringify(settings)
    );


    // Apply theme immediately

    applyTheme(
      settings.theme
    );


    // Save auto-start separately too

    localStorage.setItem(
      "typemaster-auto-start",
      settings.autoStart
        ? "true"
        : "false"
    );


    // Reduce animations

    if (settings.reduceAnimations) {

      document.body.classList.add(
        "reduce-animations"
      );

    } else {

      document.body.classList.remove(
        "reduce-animations"
      );

    }


    // ======================================
    // SAVE SETTINGS TO DATABASE
    // ======================================

    const userId =
      localStorage.getItem(
        "typemaster-user-id"
      );

    if (userId) {

      try {

        const response =
          await fetch(
            `http://localhost:5000/api/auth/settings/${encodeURIComponent(userId)}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(settings)
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
            "Could not save settings."
          );
        }

      } catch (error) {

        console.error(
          "Could not save settings to database:",
          error
        );

        if (
          showMessage &&
          saveMessage
        ) {

          saveMessage.textContent =
            "⚠ Settings saved locally, but database save failed.";

          return;

        }

      }

    }


    // ======================================
    // SHOW SAVE MESSAGE
    // ======================================

    if (
      showMessage &&
      saveMessage
    ) {

      saveMessage.textContent =
        "✓ Settings saved successfully.";


      setTimeout(() => {

        saveMessage.textContent =
          "Your settings are saved automatically.";

      }, 2000);

    }

  }


  // ======================================
  // SAVE BUTTON
  // ======================================

  if (saveButton) {

    saveButton.addEventListener(
      "click",
      () => {

        saveSettings(true);

      }
    );

  }


  // ======================================
  // AUTO SAVE SETTINGS
  // ======================================

  const autoSaveElements = [

    reduceAnimations,
    soundEffects,
    liveWpm,
    liveAccuracy,
    highlightMistakes,

    paragraphFontSize,
    textWidth,
    cursorStyle,
    virtualKeyboard,

    defaultDuration,
    autoStart,
    showTimer,

    wpmGoal,
    accuracyGoal,
    practiceGoal,

    dailyChallengeNotification,
    achievementNotification,
    practiceNotification

  ];


  autoSaveElements.forEach(
    element => {

      if (!element) {
        return;
      }


      element.addEventListener(
        "change",
        () => {

          saveSettings(true);

        }
      );

    }
  );


  // ======================================
  // THEME SELECT
  // ======================================

  if (themeSetting) {

    themeSetting.addEventListener(
      "change",
      async () => {

        const selectedTheme =
          themeSetting.value === "dark"
            ? "dark"
            : "light";


        settings.theme =
          selectedTheme;


        // Apply immediately

        applyTheme(
          selectedTheme
        );


        // Save complete settings to database

        await saveSettings(true);

        if (saveMessage) {

          saveMessage.textContent =
            "✓ Theme updated.";


          setTimeout(() => {

            saveMessage.textContent =
              "Your settings are saved automatically.";

          }, 2000);

        }

      }
    );

  }


// ======================================
// RESET SETTINGS
// ======================================

if (resetButton) {

  resetButton.addEventListener("click", async () => {

    const confirmed = confirm(
      "Reset all settings to default values?"
    );

    if (!confirmed) return;

    settings = {
      ...DEFAULTS
    };

    try {

      // Save default settings to database
      const userId =
        localStorage.getItem("typemaster-user-id");

      if (userId) {

        const response = await fetch(
          `http://localhost:5000/api/auth/settings/${encodeURIComponent(userId)}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(settings)
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Could not reset settings."
          );
        }
      }

      // Keep local settings in sync
      localStorage.setItem(
        "typemaster-settings",
        JSON.stringify(settings)
      );

      localStorage.setItem(
        "typemaster-theme",
        settings.theme
      );

      localStorage.setItem(
        "typemaster-auto-start",
        settings.autoStart
          ? "true"
          : "false"
      );

      // Load default values into form
      loadForm();

      // Apply default theme
      applyTheme(settings.theme);

      updateThemeButton();

      if (saveMessage) {

        saveMessage.textContent =
          "✓ Settings reset to default successfully.";

        setTimeout(() => {

          saveMessage.textContent =
            "Your settings are saved automatically.";

        }, 2000);

      }

    } catch (error) {

      console.error(
        "Could not reset settings:",
        error
      );

      if (saveMessage) {

        saveMessage.textContent =
          "⚠ Could not reset settings.";

      }

    }

  });

}


  // ======================================
  // CLEAR HISTORY
  // ======================================

  if (clearHistoryButton) {

    clearHistoryButton.addEventListener(
      "click",
      async () => {

        const confirmed =
          confirm(
            "Delete all typing test history?"
          );

        if (!confirmed) {
          return;
        }

        const userId =
          localStorage.getItem(
            "typemaster-user-id"
          );

        if (!userId) {
          alert(
            "User is not logged in."
          );
          return;
        }

        try {

          const response =
            await fetch(
              `http://localhost:5000/api/typing-test/history/${encodeURIComponent(userId)}`,
              {
                method: "DELETE"
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
              "Could not clear typing history."
            );
          }

          localStorage.removeItem(
            "typemaster-history"
          );

          alert(
            "Typing history has been cleared."
          );

        } catch (error) {

          console.error(
            "Clear typing history error:",
            error
          );

          alert(
            "Could not clear typing history."
          );

        }

      }
    );

  }


  // ======================================
  // RESET PROGRESS
  // ======================================

  if (resetProgressButton) {

    resetProgressButton.addEventListener(
      "click",
      async () => {

        const confirmed =
          confirm(
            "Reset all lesson progress?"
          );

        if (!confirmed) {
          return;
        }

        const userId =
          localStorage.getItem(
            "typemaster-user-id"
          );

        if (!userId) {
          alert(
            "User is not logged in."
          );
          return;
        }

        try {

          const response =
            await fetch(
              `http://localhost:5000/api/lessons/progress/${encodeURIComponent(userId)}`,
              {
                method: "DELETE"
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
              "Could not reset lesson progress."
            );
          }

          localStorage.removeItem(
            "typemaster-completed-lessons"
          );

          alert(
            "Lesson progress has been reset."
          );

        } catch (error) {

          console.error(
            "Reset lesson progress error:",
            error
          );

          alert(
            "Could not reset lesson progress."
          );

        }

      }
    );

  }

  // ======================================
  // CLEAR ALL DATA
  // ======================================

  if (clearAllDataButton) {

    clearAllDataButton.addEventListener(
      "click",
      async () => {

        const confirmed =
          confirm(
            "WARNING: This will permanently delete all your TypeMaster data. Continue?"
          );

        if (!confirmed) {
          return;
        }

        const userId =
          localStorage.getItem(
            "typemaster-user-id"
          );

        if (!userId) {
          alert(
            "User is not logged in."
          );
          return;
        }

        try {

          const response =
            await fetch(
              `http://localhost:5000/api/typing-test/clear-all/${encodeURIComponent(userId)}`,
              {
                method: "DELETE"
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
              "Could not clear all data."
            );
          }

          localStorage.clear();

          alert(
            "All TypeMaster data has been cleared."
          );

          window.location.reload();

        } catch (error) {

          console.error(
            "Clear all data error:",
            error
          );

          alert(
            "Could not clear all data."
          );

        }

      }
    );

  }


  // ======================================
  // INITIALIZE
  // ======================================

  const savedTheme =
    localStorage.getItem(
      "typemaster-theme"
    );


  if (
    savedTheme === "dark" ||
    savedTheme === "light"
  ) {

    settings.theme =
      savedTheme;

  }


  // Apply saved theme

  applyTheme(
    settings.theme
  );


  // Load settings from database first,
  // then fill the form.

  loadSettingsFromDB().then(() => {

    loadForm();

  });


  // Update button

  updateThemeButton();


});