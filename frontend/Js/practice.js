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
// ========================================
// CUSTOM PRACTICE
// ========================================

const customTextInput =
  document.getElementById("customPracticeText");

const startCustomPractice =
  document.getElementById("startCustomPractice");

if (customTextInput && startCustomPractice) {

  startCustomPractice.addEventListener("click", () => {

    const customText =
      customTextInput.value.trim();

    if (!customText) {
      alert("Please enter some text before starting practice.");
      customTextInput.focus();
      return;
    }

    localStorage.setItem(
      "typemaster-custom-text",
      customText
    );

    localStorage.setItem(
      "typemaster-selected-test",
      "custom"
    );

    const activeDurationButton =
      document.querySelector(
        ".duration-buttons button.active"
      );

    const customDuration =
      Number(
        activeDurationButton?.dataset.duration
      ) || 1;

    localStorage.setItem(
      "typemaster-test-duration",
      String(customDuration)
    );

    localStorage.setItem(
      "typemaster-duration-source",
      "practice"
    );

    window.location.href =
      "typing-test.html";
  });

}
// ========================================
// CUSTOM PRACTICE COUNTER
// ========================================

const customPracticeTitle =
  document.getElementById("customPracticeTitle");

const customWordCount =
  document.getElementById("customWordCount");

const customCharacterCount =
  document.getElementById("customCharacterCount");


function updateCustomPracticeCount() {

  if (!customTextInput) {
    return;
  }

  const text =
    customTextInput.value;

  const trimmedText =
    text.trim();

  const wordCount =
    trimmedText
      ? trimmedText.split(/\s+/).length
      : 0;

  const characterCount =
    text.length;


  if (customWordCount) {

    customWordCount.textContent =
      `${wordCount} words`;

  }


  if (customCharacterCount) {

    customCharacterCount.textContent =
      `${characterCount} characters`;

  }

}


if (customTextInput) {

  customTextInput.addEventListener(
    "input",
    updateCustomPracticeCount
  );

  updateCustomPracticeCount();

}
// ========================================
// SAVE CUSTOM PRACTICE
// ========================================

const saveCustomPractice =
  document.getElementById("saveCustomPractice");


if (saveCustomPractice) {

  saveCustomPractice.addEventListener(
    "click",
    async () => {

      const userId =
        localStorage.getItem(
          "typemaster-user-id"
        );

      const title =
        customPracticeTitle?.value.trim() || "";

      const text =
        customTextInput?.value.trim() || "";


      if (!userId) {

        alert(
          "Please login before saving a custom practice."
        );

        return;

      }


      if (!title) {

        alert(
          "Please enter a practice title."
        );

        customPracticeTitle?.focus();

        return;

      }


      if (!text) {

        alert(
          "Please enter some practice text."
        );

        customTextInput?.focus();

        return;

      }


      saveCustomPractice.disabled = true;

      saveCustomPractice.textContent =
        "Saving...";


      try {

        const response =
          await fetch(
            "https://typemaster-backend-01.onrender.com/api/custom-practice/save",
            {
              method: "POST",

              headers: {
                "Content-Type": "application/json"
              },

              body: JSON.stringify({
                userId,
                title,
                text
              })
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
            "Could not save practice."
          );

        }


        alert(
          "Practice saved successfully!"
        );


        customPracticeTitle.value =
          "";

        customTextInput.value =
          "";

        updateCustomPracticeCount();


      } catch (error) {

        console.error(
          "Save custom practice error:",
          error
        );

        alert(
          error.message ||
          "Could not save practice."
        );

      } finally {

        saveCustomPractice.disabled =
          false;

        saveCustomPractice.textContent =
          "💾 Save Practice";

      }

    }
  );

}
// ========================================
// LOAD SAVED CUSTOM PRACTICES
// ========================================

const savedCustomPractices =
  document.getElementById("savedCustomPractices");


function escapeHtml(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


async function loadSavedCustomPractices() {

  if (!savedCustomPractices) {
    return;
  }


  const userId =
    localStorage.getItem(
      "typemaster-user-id"
    );


  if (!userId) {

    savedCustomPractices.innerHTML = `
      <p class="saved-practices-empty">
        Please login to view your saved practices.
      </p>
    `;

    return;

  }


  try {

    const response =
      await fetch(
        `https://typemaster-backend-01.onrender.com/api/custom-practice/${encodeURIComponent(userId)}`
      );


    const data =
      await response.json();


    if (
      !response.ok ||
      !data.success
    ) {

      throw new Error(
        data.message ||
        "Could not load saved practices."
      );

    }


    const practices =
      Array.isArray(data.practices)
        ? data.practices
        : [];


    if (practices.length === 0) {

      savedCustomPractices.innerHTML = `
        <p class="saved-practices-empty">
          No saved practices yet. Create your first custom practice above.
        </p>
      `;

      return;

    }


    savedCustomPractices.innerHTML =
      practices.map(practice => {

        const title =
          escapeHtml(
            practice.title
          );

        const text =
          escapeHtml(
            practice.text
          );


        return `
          <article
            class="saved-custom-practice-card"
            data-id="${escapeHtml(practice.id)}">

            <h3>
              ${title}
            </h3>

            <p>
              ${text}
            </p>

            <div class="saved-custom-practice-actions">

              <button
                type="button"
                class="saved-practice-button"
                data-action="practice"
                data-id="${escapeHtml(practice.id)}">
                ▶ Practice
              </button>

              <button
                type="button"
                class="delete-practice-button"
                data-action="delete"
                data-id="${escapeHtml(practice.id)}">
                🗑 Delete
              </button>

            </div>

          </article>
        `;

      }).join("");


  } catch (error) {

    console.error(
      "Load custom practices error:",
      error
    );

    savedCustomPractices.innerHTML = `
      <p class="saved-practices-empty">
        Could not load saved practices.
      </p>
    `;

  }

}


loadSavedCustomPractices();
// ========================================
// SAVED PRACTICE ACTIONS
// ========================================

if (savedCustomPractices) {

  savedCustomPractices.addEventListener(
    "click",
    async (event) => {

      const button =
        event.target.closest("button[data-action]");

      if (!button) {
        return;
      }


      const action =
        button.dataset.action;

      const practiceId =
        button.dataset.id;

      const userId =
        localStorage.getItem(
          "typemaster-user-id"
        );


      if (!userId || !practiceId) {
        return;
      }


      // ========================================
      // PRACTICE
      // ========================================

      if (action === "practice") {

        try {

          const response =
            await fetch(
              `https://typemaster-backend-01.onrender.com/api/custom-practice/${encodeURIComponent(userId)}`
            );


          const data =
            await response.json();


          if (
            !response.ok ||
            !data.success
          ) {

            throw new Error(
              data.message ||
              "Could not load practice."
            );

          }


          const practice =
            data.practices.find(
              item =>
                item.id === practiceId
            );


          if (!practice) {

            alert(
              "This practice could not be found."
            );

            return;

          }


          localStorage.setItem(
            "typemaster-custom-title",
            practice.title
          );


          localStorage.setItem(
            "typemaster-custom-text",
            practice.text
          );


          localStorage.setItem(
            "typemaster-selected-test",
            "custom"
          );


          const activeDurationButton =
            document.querySelector(
              ".duration-buttons button.active"
            );


          const customDuration =
            Number(
              activeDurationButton?.dataset.duration
            ) || 1;


          localStorage.setItem(
            "typemaster-test-duration",
            String(customDuration)
          );


          localStorage.setItem(
            "typemaster-duration-source",
            "practice"
          );


          window.location.href =
            "typing-test.html";


        } catch (error) {

          console.error(
            "Practice load error:",
            error
          );

          alert(
            "Could not start this practice."
          );

        }

        return;
      }


      // ========================================
      // DELETE
      // ========================================

      if (action === "delete") {

        const confirmed =
          confirm(
            "Are you sure you want to delete this practice?"
          );


        if (!confirmed) {
          return;
        }


        button.disabled = true;

        button.textContent =
          "Deleting...";


        try {

          const response =
            await fetch(
              `https://typemaster-backend-01.onrender.com/api/custom-practice/${encodeURIComponent(practiceId)}`,
              {
                method: "DELETE",

                headers: {
                  "Content-Type": "application/json"
                },

                body: JSON.stringify({
                  userId
                })
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
              "Could not delete practice."
            );

          }


          await loadSavedCustomPractices();


        } catch (error) {

          console.error(
            "Delete custom practice error:",
            error
          );

          alert(
            error.message ||
            "Could not delete practice."
          );


          button.disabled = false;

          button.textContent =
            "🗑 Delete";

        }

      }

    }
  );

}