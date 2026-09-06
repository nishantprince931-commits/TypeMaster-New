// ========================================
// TYPEMASTER PROFILE
// PROFILE STATS + MILESTONES
// ========================================



let dbTypingHistory = [];
// ========================================
// DATABASE ACHIEVEMENTS
// ========================================

let dbAchievements = [];

async function loadDbAchievements() {

  const userId =
    localStorage.getItem("typemaster-user-id");

  if (!userId) {
    dbAchievements = [];
    return;
  }

  try {

    const response = await fetch(
      `https://typemaster-backend-01.onrender.com/api/achievements/${encodeURIComponent(userId)}`
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Could not load achievements"
      );
    }

    dbAchievements =
      Array.isArray(data.achievements)
        ? data.achievements
        : [];

  } catch (error) {

    console.error(
      "Database achievements error:",
      error
    );

    dbAchievements = [];
  }
}

async function loadDbTypingHistory() {

  const userId =
    localStorage.getItem("typemaster-user-id");

  // Login nahi hai
  if (!userId) {
    dbTypingHistory = [];
    return;
  }

  try {

    const response = await fetch(
      `https://typemaster-backend-01.onrender.com/api/typing-test/history/${encodeURIComponent(userId)}`
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Could not load typing history"
      );
    }

    dbTypingHistory = Array.isArray(data.history)
      ? data.history.map((item) => ({
        title: "Typing Test",
        wpm: Number(item.wpm) || 0,
        accuracy: Number(item.accuracy) || 0,
        mistakes: Number(item.wrongCharacters) || 0,
        duration: Number(item.durationSeconds) || 0,
        date: item.createdAt
      }))
      : [];

  } catch (error) {

    console.error(
      "Database typing history error:",
      error
    );

    dbTypingHistory = [];
  }
}


function getTypingHistory() {

  return dbTypingHistory;

}
// ========================================
// LOAD PROFILE FROM DATABASE
// ========================================

const profilePageUserName =
  document.getElementById("profilePageUserName");

const profilePageAvatar =
  document.getElementById("profilePageAvatar");

const profilePageMainName =
  document.getElementById("profilePageMainName");

const profilePageDescription =
  document.getElementById("profilePageDescription");

async function loadDbProfile() {

  const userId =
    localStorage.getItem("typemaster-user-id");

  if (!userId) {
    return;
  }

  try {

    const response = await fetch(
      `https://typemaster-backend-01.onrender.com/api/auth/profile/${encodeURIComponent(userId)}`
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Could not load profile"
      );
    }

    const user = data.user;

    if (
      profilePageMainName &&
      user?.name
    ) {
      profilePageMainName.textContent =
        user.name;
    }

    if (
      profilePageDescription &&
      user?.description
    ) {
      profilePageDescription.textContent =
        user.description;
    }
    const profileMemberSince =
      document.getElementById("profileMemberSince");

    if (
      profileMemberSince &&
      user?.createdAt
    ) {
      const memberYear =
        new Date(user.createdAt).getFullYear();

      profileMemberSince.textContent =
        `Member since ${memberYear}`;
    }

    if (
      profilePageUserName &&
      user?.name
    ) {
      profilePageUserName.textContent =
        user.name;
    }

    if (
      profilePageAvatar &&
      user?.name
    ) {
      profilePageAvatar.textContent =
        user.name.charAt(0).toUpperCase();
    }

    localStorage.setItem(
      "dailyStreak",
      String(Number(user.streak) || 0)
    );

    const streakElement =
      document.getElementById("profileStreak");

    if (streakElement) {
      streakElement.textContent =
        Number(user.streak) || 0;
    }

  } catch (error) {

    console.error(
      "Database profile error:",
      error
    );

  }
}

// ========================================
// GET ALL HISTORY
// ========================================

function getAllHistory() {
  return getTypingHistory();
}

// ========================================
// GET BEST WPM
// ========================================

function getBestWpm() {

  const history =
    getAllHistory();

  const wpms =
    history.map(item =>
      Number(item?.wpm) || 0
    );

  return Math.max(
    0,
    ...wpms
  );

}


// ========================================
// GET BEST ACCURACY
// ========================================

function getBestAccuracy() {

  const history =
    getAllHistory();

  const accuracies =
    history.map(item => {

      return Number(
        String(
          item?.accuracy || 0
        ).replace("%", "")
      ) || 0;

    });

  return Math.max(
    0,
    ...accuracies
  );

}


// ========================================
// GET TEST COUNT
// ========================================

function getTestsCompleted() {

  return getAllHistory().length;

}


// ========================================
// GET STREAK
// ========================================

function getStreak() {

  const possibleKeys = [
    "typeMasterDailyStreak",
    "typemasterDailyStreak",
    "dailyStreak"
  ];

  for (const key of possibleKeys) {

    const saved =
      localStorage.getItem(key);

    if (saved !== null) {

      const value =
        Number(saved);

      if (
        Number.isFinite(value) &&
        value >= 0
      ) {

        return value;

      }

    }

  }

  return 0;

}


// ========================================
// UPDATE PROFILE STATS
// ========================================

function updateProfileStats() {

  const bestWpm =
    getBestWpm();

  const bestAccuracy =
    getBestAccuracy();

  const tests =
    getTestsCompleted();

  const streak =
    getStreak();


  const bestWpmElement =
    document.getElementById(
      "profileBestWpm"
    );

  const bestAccuracyElement =
    document.getElementById(
      "profileBestAccuracy"
    );

  const streakElement =
    document.getElementById(
      "profileStreak"
    );

  const testsElement =
    document.getElementById(
      "profileTests"
    );


  if (bestWpmElement) {

    bestWpmElement.textContent =
      bestWpm;

  }


  if (bestAccuracyElement) {

    bestAccuracyElement.textContent =
      `${bestAccuracy}%`;

  }


  if (streakElement) {

    streakElement.textContent =
      streak;

  }


  if (testsElement) {

    testsElement.textContent =
      tests;

  }

  updateMilestones();

}


// ========================================
// MILESTONE HELPER
// ========================================

function findMilestoneCard(title) {

  const cards =
    document.querySelectorAll(
      ".milestone-card, .achievement-card, .milestone-item"
    );

  for (const card of cards) {

    const text =
      card.textContent
        .trim()
        .toLowerCase();

    if (
      text.includes(
        title.toLowerCase()
      )
    ) {

      return card;

    }

  }

  return null;

}


// ========================================
// UPDATE ONE MILESTONE
// ========================================

function setMilestone(
  title,
  completed,
  message
) {

  const card =
    findMilestoneCard(title);

  if (!card) {
    return;
  }


  // Remove old state

  card.classList.remove(
    "milestone-completed"
  );

  card.classList.remove(
    "milestone-locked"
  );


  // Find status element

  let status =
    card.querySelector(
      ".milestone-status"
    );


  // Create status if missing

  if (!status) {

    status =
      document.createElement(
        "span"
      );

    status.className =
      "milestone-status";

    card.appendChild(status);

  }


  if (completed) {

    card.classList.add(
      "milestone-completed"
    );

    status.textContent =
      "✓ Completed";

    status.classList.remove(
      "locked"
    );

    status.classList.add(
      "completed"
    );

  } else {

    card.classList.add(
      "milestone-locked"
    );

    status.textContent =
      message;

    status.classList.remove(
      "completed"
    );

    status.classList.add(
      "locked"
    );

  }

}


// ========================================
// UPDATE MILESTONES FROM DATABASE
// ========================================

function updateMilestones() {

  if (!Array.isArray(dbAchievements)) {
    return;
  }

  dbAchievements.forEach((achievement) => {

    const title =
      achievement.title || "";

    const unlocked =
      achievement.unlocked === true ||
      achievement.unlocked === "true";

    let lockedMessage =
      achievement.description ||
      "Complete this achievement.";

    if (!unlocked) {

      const target =
        Number(achievement.target) || 0;

      const type =
        achievement.type || "";

      if (type === "tests") {
        lockedMessage =
          `Complete ${target} typing test${target === 1 ? "" : "s"}.`;
      }

      else if (type === "wpm") {
        lockedMessage =
          `Reach ${target} WPM.`;
      }

      else if (type === "accuracy") {
        lockedMessage =
          `Reach ${target}% accuracy.`;
      }

      else if (type === "streak") {
        lockedMessage =
          `Maintain a ${target} day streak.`;
      }

    }

    setMilestone(
      title,
      unlocked,
      lockedMessage
    );

  });

}

// ========================================
// INITIALIZE
// ========================================

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    await loadDbTypingHistory();

    await loadDbProfile();

    await loadDbAchievements();

    updateProfileStats();

  }
);
// ========================================
// EDIT PROFILE
// ========================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const editButton =
      document.getElementById(
        "editProfileButton"
      );

    if (!editButton) {
      return;
    }


    editButton.addEventListener(
      "click",
      () => {

        // Get current profile data

        const savedProfile =
          localStorage.getItem(
            "typemaster-profile"
          );


        let profile = {

          name: "Neel",

          description:
            "Typing enthusiast"

        };


        if (savedProfile) {

          try {

            const parsed =
              JSON.parse(savedProfile);

            if (parsed) {

              profile.name =
                parsed.name ||
                profile.name;

              profile.description =
                parsed.description ||
                profile.description;

            }

          } catch (error) {

            console.error(
              "Profile data error:",
              error
            );

          }

        }


        // Remove old modal

        const oldModal =
          document.querySelector(
            ".edit-profile-modal"
          );

        if (oldModal) {
          oldModal.remove();
        }


        // Create modal

        const modal =
          document.createElement("div");

        modal.className =
          "edit-profile-modal";


        modal.innerHTML = `

          <div class="edit-profile-box">

            <h2>
              Edit Profile
            </h2>

            <p>
              Update your profile information.
            </p>


            <div class="edit-profile-field">

              <label>
                Name
              </label>

              <input
                id="editProfileName"
                type="text"
                value="${profile.name}"
                maxlength="30"
                autocomplete="off"
              >

            </div>


            <div class="edit-profile-field">

              <label>
                Description
              </label>

              <textarea
                id="editProfileDescription"
                maxlength="100"
              >${profile.description}</textarea>

            </div>


            <div class="edit-profile-buttons">

              <button
                id="editProfileCancel"
                class="edit-profile-cancel"
                type="button">

                Cancel

              </button>


              <button
                id="editProfileSave"
                class="edit-profile-save"
                type="button">

                Save Changes

              </button>

            </div>

          </div>

        `;


        document.body.appendChild(modal);


        // ==================================
        // ELEMENTS
        // ==================================

        const nameInput =
          document.getElementById(
            "editProfileName"
          );

        const descriptionInput =
          document.getElementById(
            "editProfileDescription"
          );

        const saveButton =
          document.getElementById(
            "editProfileSave"
          );

        const cancelButton =
          document.getElementById(
            "editProfileCancel"
          );


        // Focus name

        nameInput.focus();


        // ==================================
        // CANCEL
        // ==================================

        cancelButton.addEventListener(
          "click",
          () => {

            modal.remove();

          }
        );


        // ==================================
        // SAVE
        // ==================================

        saveButton.addEventListener(
          "click",
          async () => {

            const name =
              nameInput.value.trim();

            const description =
              descriptionInput.value.trim();

            if (!name) {
              nameInput.focus();
              return;
            }

            const userId =
              localStorage.getItem(
                "typemaster-user-id"
              );

            if (!userId) {
              alert("Please login first.");
              return;
            }

            const newProfile = {
              name: name,
              description:
                description ||
                "Typing enthusiast"
            };

            try {

              const response =
                await fetch(
                  `https://typemaster-backend-01.onrender.com/api/auth/profile/${encodeURIComponent(userId)}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newProfile)
                  }
                );

              const data =
                await response.json();

              if (!response.ok || !data.success) {
                throw new Error(
                  data.message ||
                  "Profile update failed."
                );
              }

              localStorage.setItem(
                "typemaster-profile",
                JSON.stringify({
                  name: data.user.name,
                  description:
                    data.user.description ||
                    "Typing enthusiast"
                })
              );

              updateProfileDisplay({
                name: data.user.name,
                description:
                  data.user.description ||
                  "Typing enthusiast"
              });

              modal.remove();

              alert(
                "Profile updated successfully!"
              );

            } catch (error) {

              console.error(
                "Profile update error:",
                error
              );

              alert(
                error.message ||
                "Could not update profile."
              );

            }

          }
        );

        // ==================================
        // CLICK OUTSIDE
        // ==================================

        modal.addEventListener(
          "click",
          (event) => {

            if (
              event.target === modal
            ) {

              modal.remove();

            }

          }
        );

      }
    );


    // ====================================
    // LOAD PROFILE
    // ====================================

    loadSavedProfile();

  }
);


// ========================================
// UPDATE PROFILE DISPLAY
// ========================================

function updateProfileDisplay(
  profile
) {

  const nameElements =
    document.querySelectorAll(
      ".profile-info h1, .home-profile span"
    );


  nameElements.forEach(
    element => {

      element.textContent =
        profile.name;

    }
  );


  const description =
    document.querySelector(
      ".profile-info p"
    );


  if (description) {

    description.textContent =
      profile.description;

  }


  // Avatar initial

  const initial =
    profile.name
      .charAt(0)
      .toUpperCase();


  const avatars =
    document.querySelectorAll(
      ".profile-avatar, .home-avatar"
    );


  avatars.forEach(
    avatar => {

      avatar.textContent =
        initial;

    }
  );

}


// ========================================
// LOAD SAVED PROFILE
// ========================================

function loadSavedProfile() {

  const saved =
    localStorage.getItem(
      "typemaster-profile"
    );


  if (!saved) {
    return;
  }


  try {

    const profile =
      JSON.parse(saved);


    if (
      profile &&
      profile.name
    ) {

      updateProfileDisplay(
        profile
      );

    }

  } catch (error) {

    console.error(
      "Could not load profile:",
      error
    );

  }

}
// ========================================
// SIGN IN + CREATE ACCOUNT + LOGOUT
// ========================================

const signInButton =
  document.getElementById("signInButton");

const logoutButton =
  document.getElementById("logoutButton");


// ========================================
// UPDATE AUTH BUTTONS
// ========================================

function updateAuthButtons() {

  const signedIn =
    localStorage.getItem(
      "typemaster-signed-in"
    ) === "true";


  if (signInButton) {

    signInButton.style.display =
      signedIn
        ? "none"
        : "block";

  }


  if (logoutButton) {

    logoutButton.style.display =
      signedIn
        ? "block"
        : "none";

  }

}


// ========================================
// CREATE ACCOUNT
// ========================================

function showCreateAccount() {

  const old =
    document.querySelector(
      ".signin-modal"
    );

  if (old) {
    old.remove();
  }


  const modal =
    document.createElement("div");

  modal.className =
    "edit-profile-modal signin-modal";


  modal.innerHTML = `

    <div class="edit-profile-box">

      <h2>Create Account</h2>

      <p>
        Create your TypeMaster account.
      </p>


      <div class="edit-profile-field">

        <label>Name</label>

        <input
          id="createName"
          type="text"
          placeholder="Enter your name"
          maxlength="30"
        >

      </div>


      <div class="edit-profile-field">

        <label>Email</label>

        <input
          id="createEmail"
          type="email"
          placeholder="Enter your email"
        >

      </div>


      <div class="edit-profile-field">

        <label>Password</label>

        <input
          id="createPassword"
          type="password"
          placeholder="At least 6 characters"
        >

      </div>


      <div class="edit-profile-buttons">

        <button
          id="createCancel"
          class="edit-profile-cancel"
          type="button">

          Cancel

        </button>


        <button
          id="backToSignIn"
          class="edit-profile-cancel"
          type="button">

          Sign In

        </button>


        <button
          id="createSubmit"
          class="edit-profile-save"
          type="button">

          Create Account

        </button>

      </div>

    </div>

  `;


  document.body.appendChild(modal);


  const name =
    document.getElementById(
      "createName"
    );

  const email =
    document.getElementById(
      "createEmail"
    );

  const password =
    document.getElementById(
      "createPassword"
    );

  const cancel =
    document.getElementById(
      "createCancel"
    );

  const back =
    document.getElementById(
      "backToSignIn"
    );

  const submit =
    document.getElementById(
      "createSubmit"
    );


  name.focus();


  cancel.addEventListener(
    "click",
    () => {

      modal.remove();

    }
  );


  back.addEventListener(
    "click",
    () => {

      modal.remove();

      showSignIn();

    }
  );


  submit.addEventListener(
    "click",
    async () => {

      const nameValue = name.value.trim();
      const emailValue = email.value.trim();
      const passwordValue = password.value.trim();
      const countryValue = "India";
      if (!nameValue || !emailValue || !passwordValue) {
        alert("Please fill in all required fields.");
        return;
      }

      try {

        const data = await apiRequest(
          "/api/auth/register",
          {
            method: "POST",
            body: JSON.stringify({
              name: nameValue,
              email: emailValue,
              password: passwordValue,
              country: countryValue || "India"
            })
          }
        );

        if (!data.success) {
          alert(data.message || "Registration failed.");
          return;
        }

        const user = data.user;

        localStorage.setItem(
          "typemaster-signed-in",
          "true"
        );

        localStorage.setItem(
          "typemaster-user-email",
          user.email
        );
        localStorage.setItem(
          "typemaster-user-id",
          user.id
        );

        localStorage.setItem(
          "typemaster-profile",
          JSON.stringify({
            name: user.name,
            description: "Typing enthusiast"
          })
        );

        updateProfileDisplay({
          name: user.name,
          description: "Typing enthusiast"
        });

        modal.remove();

        updateAuthButtons();

        alert("Account created successfully!");

      } catch (error) {

        console.error(
          "Registration error:",
          error
        );

        alert(
          error.message ||
          "Could not create account."
        );
      }

    }
  );


  modal.addEventListener(
    "click",
    event => {

      if (
        event.target === modal
      ) {

        modal.remove();

      }

    }
  );

}


// ========================================
// SIGN IN
// ========================================

function showSignIn() {

  const old =
    document.querySelector(
      ".signin-modal"
    );

  if (old) {
    old.remove();
  }


  const modal =
    document.createElement("div");

  modal.className =
    "edit-profile-modal signin-modal";


  modal.innerHTML = `

    <div class="edit-profile-box">

      <h2>Sign In</h2>

      <p>
        Sign in to your TypeMaster account.
      </p>


      <div class="edit-profile-field">

        <label>Email</label>

        <input
          id="signinEmail"
          type="email"
          placeholder="Enter your email"
        >

      </div>


      <div class="edit-profile-field">

        <label>Password</label>

<input
  id="signinPassword"
  type="password"
  placeholder="Enter your password"
  autocomplete="current-password"
>
<button
  id="forgotPasswordButton"
  type="button"
  class="forgot-password-button">
  Forgot Password?
</button>

      </div>


      <div class="edit-profile-buttons">

        <button
          id="signinCancel"
          class="edit-profile-cancel"
          type="button">

          Cancel

        </button>


        <button
          id="createAccountButton"
          class="edit-profile-cancel"
          type="button">

          Create Account

        </button>


        <button
          id="signinSubmit"
          class="edit-profile-save"
          type="button">

          Sign In

        </button>

      </div>

    </div>

  `;


  document.body.appendChild(modal);


  const email =
    document.getElementById(
      "signinEmail"
    );

  const password =
    document.getElementById(
      "signinPassword"
    );

  const cancel =
    document.getElementById(
      "signinCancel"
    );

  const create =
    document.getElementById(
      "createAccountButton"
    );

  const submit =
    document.getElementById(
      "signinSubmit"
    );
  const forgotPassword =
    document.getElementById(
      "forgotPasswordButton"
    );


  // ======================================
  // FORGOT PASSWORD - BACKEND
  // ======================================

  if (forgotPassword) {

    forgotPassword.addEventListener(
      "click",
      async () => {

        const emailValue =
          email.value.trim();

        if (!emailValue) {

          alert(
            "Please enter your email first."
          );

          email.focus();

          return;
        }

        try {

          const data =
            await apiRequest(
              "/api/auth/forgot-password",
              {
                method: "POST",

                body: JSON.stringify({
                  email: emailValue
                })
              }
            );

          if (!data.success) {

            alert(
              data.message ||
              "Could not start password reset."
            );

            return;
          }

          /*
            Development mode:
            Backend gives us a reset token.
          */

          const resetToken =
            data.resetToken;

          if (!resetToken) {

            alert(
              "Password reset request created. Please check your email."
            );

            return;
          }

          const newPassword =
            prompt(
              "Enter your new password (minimum 6 characters):"
            );

          if (newPassword === null) {
            return;
          }

          const passwordValue =
            newPassword.trim();

          if (passwordValue.length < 6) {

            alert(
              "Password must be at least 6 characters."
            );

            return;
          }

          const resetData =
            await apiRequest(
              "/api/auth/reset-password",
              {
                method: "POST",

                body: JSON.stringify({
                  token: resetToken,
                  newPassword: passwordValue
                })
              }
            );

          if (!resetData.success) {

            alert(
              resetData.message ||
              "Could not reset password."
            );

            return;
          }

          password.value = "";

          alert(
            "Password changed successfully! You can now sign in with your new password."
          );

        } catch (error) {

          console.error(
            "Forgot password error:",
            error
          );

          alert(
            error.message ||
            "Could not reset password."
          );
        }
      }
    );

  }
  email.focus();


  cancel.addEventListener(
    "click",
    () => {

      modal.remove();

    }
  );


  create.addEventListener(
    "click",
    () => {

      modal.remove();

      showCreateAccount();

    }
  );


  submit.addEventListener(
    "click",
    async () => {

      const emailValue =
        email.value.trim();

      const passwordValue =
        password.value.trim();

      if (!emailValue || !passwordValue) {
        alert("Please enter email and password.");
        return;
      }

      try {

        const data = await apiRequest(
          "/api/auth/login",
          {
            method: "POST",
            body: JSON.stringify({
              email: emailValue,
              password: passwordValue
            })
          }
        );

        if (!data.success) {
          alert(data.message || "Login failed.");
          return;
        }

        const user = data.user;

        localStorage.setItem(
          "typemaster-signed-in",
          "true"
        );

        localStorage.setItem(
          "typemaster-user-email",
          user.email
        );
        localStorage.setItem(
          "typemaster-user-id",
          user.id
        );


        localStorage.setItem(
          "typemaster-profile",
          JSON.stringify({
            name: user.name,
            description: "Typing enthusiast"
          })
        );

        updateProfileDisplay({
          name: user.name,
          description: "Typing enthusiast"
        });

        modal.remove();

        updateAuthButtons();

        await loadDbTypingHistory();
        await loadDbProfile();
        await loadDbAchievements();

        updateProfileStats();

        if (typeof loadCommonProfile === "function") {
          await loadCommonProfile();
        }

        if (typeof loadCommonStreak === "function") {
          await loadCommonStreak();
        }

        alert("Signed in successfully!");
      } catch (error) {

        console.error(
          "Sign in error:",
          error
        );

        alert(
          error.message ||
          "Could not sign in."
        );
      }

    }
  );


  modal.addEventListener(
    "click",
    event => {

      if (
        event.target === modal
      ) {

        modal.remove();

      }

    }
  );

}


// ========================================
// SIGN IN BUTTON
// ========================================

if (signInButton) {

  signInButton.addEventListener(
    "click",
    () => {

      showSignIn();

    }
  );

}


// ========================================
// LOGOUT
// ========================================

if (logoutButton) {

  logoutButton.addEventListener(
    "click",
    () => {

      const confirmed =
        confirm(
          "Are you sure you want to logout?"
        );


      if (!confirmed) {
        return;
      }


      localStorage.removeItem(
        "typemaster-signed-in"
      );

      localStorage.removeItem(
        "typemaster-profile"
      );

      localStorage.removeItem(
        "typemaster-user-email"
      );
      localStorage.removeItem(
        "typemaster-user-id"
      );
      localStorage.removeItem("dailyStreak");
      localStorage.removeItem("typeMasterDailyStreak");
      localStorage.removeItem("typemasterDailyStreak");

      updateAuthButtons();

      updateProfileDisplay({
        name: "Guest",
        description: "Please sign in to view your profile."
      });

      dbTypingHistory = [];
      dbAchievements = [];

      updateProfileStats();

      const guestStreak = document.getElementById("profileStreak");
      if (guestStreak) {
        guestStreak.textContent = "0";
      }

      const sidebarStreaks = document.querySelectorAll("#sidebarStreak");
      sidebarStreaks.forEach(element => {
        element.textContent = "0 Days";
      });


      alert(
        "You have been logged out."
      );

    }
  );

}


// ========================================
// INITIALIZE AUTH
// ========================================

updateAuthButtons();