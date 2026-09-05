// ========================================
// TYPEMASTER - PRACTICE
// ========================================

document.addEventListener("DOMContentLoaded", () => {

  const cards =
    document.querySelectorAll(".practice-card");

  const durationButtons =
    document.querySelectorAll(
      ".duration-buttons button"
    );


  // ========================================
  // GET SETTINGS
  // ========================================

  function getSettings() {

    try {

      return JSON.parse(
        localStorage.getItem(
          "typemaster-settings"
        ) || "{}"
      );

    } catch (error) {

      console.error(
        "Settings load error:",
        error
      );

      return {};

    }

  }


  // ========================================
  // DEFAULT DURATION FROM SETTINGS
  // ========================================

  const settings =
    getSettings();

  let selectedDuration =
    Number(
      settings.defaultDuration
    ) || 1;


  // ========================================
  // LIMIT DURATION
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
  // SET ACTIVE DURATION BUTTON
  // ========================================

  function updateDurationButton() {

    durationButtons.forEach(button => {

      button.classList.remove(
        "active"
      );

      if (
        Number(button.dataset.duration) ===
        selectedDuration
      ) {

        button.classList.add(
          "active"
        );

      }

    });

  }


  updateDurationButton();


  // ========================================
  // DURATION BUTTONS
  // ========================================

  durationButtons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        selectedDuration =
          Number(
            button.dataset.duration
          ) || 1;


        durationButtons.forEach(
          item => {

            item.classList.remove(
              "active"
            );

          }
        );


        button.classList.add(
          "active"
        );


        // Save selected practice duration
        localStorage.setItem(
          "typemaster-test-duration",
          String(selectedDuration)
        );
        localStorage.setItem(
          "typemaster-duration-source",
          "practice"
        );

      }
    );

  });


  // ========================================
  // PRACTICE CARD
  // ========================================

  cards.forEach(card => {

    card.addEventListener(
      "click",
      () => {

        const selectedId =
          card.dataset.id;


        if (!selectedId) {
          return;
        }


        // Remove old selection
        cards.forEach(item => {

          item.classList.remove(
            "selected"
          );

        });


        // Select current card
        card.classList.add(
          "selected"
        );


        // Save selected paragraph
        localStorage.setItem(
          "typemaster-selected-test",
          selectedId
        );


        // Save selected duration
        localStorage.setItem(
          "typemaster-test-duration",
          String(selectedDuration)
        );


        // Open Typing Test
        window.location.href =
          "typing-test.html";

      }
    );

  });

});