// ========================================
// TYPEMASTER APP
// COMMON THEME + PROFILE + NOTIFICATIONS
// ========================================

document.addEventListener("DOMContentLoaded", () => {

  // ======================================
  // THEME
  // ======================================

  const themeButton =
    document.getElementById("themeButton");


  function applyTheme() {

    const savedTheme =
      localStorage.getItem("typemaster-theme") || "light";

    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    updateThemeButton();
  }


  function updateThemeButton() {

    if (!themeButton) {
      return;
    }

    const dark =
      document.body.classList.contains("dark-mode");

    themeButton.textContent =
      dark
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";
  }


  // ======================================
  // THEME BUTTON
  // ======================================

  if (themeButton) {

    themeButton.addEventListener(
      "click",
      () => {

        const dark =
          document.body.classList.toggle("dark-mode");

        localStorage.setItem(
          "typemaster-theme",
          dark ? "dark" : "light"
        );

        updateThemeButton();
      }
    );
  }


  applyTheme();


  // ======================================
  // NOTIFICATION BUTTON
  // ======================================

  const notificationButton =
    document.getElementById("notificationButton");

  const notificationPanel =
    document.getElementById("notificationPanel");


  if (notificationButton && notificationPanel) {

    notificationButton.addEventListener(
      "click",
      (event) => {

        event.stopPropagation();

        notificationPanel.classList.toggle("show");

      }
    );


    document.addEventListener(
      "click",
      (event) => {

        if (
          !notificationPanel.contains(event.target) &&
          !notificationButton.contains(event.target)
        ) {

          notificationPanel.classList.remove("show");

        }

      }
    );

  }


  // ======================================
  // PROFILE MENU
  // ======================================

  const profileButton =
    document.getElementById("profileButton");

  const profileMenu =
    document.getElementById("profileMenu");


  if (profileButton && profileMenu) {

    profileButton.addEventListener(
      "click",
      (event) => {

        event.stopPropagation();

        profileMenu.classList.toggle("show");

      }
    );


    document.addEventListener(
      "click",
      (event) => {

        if (
          !profileMenu.contains(event.target) &&
          !profileButton.contains(event.target)
        ) {

          profileMenu.classList.remove("show");

        }

      }
    );

  }


  // ======================================
  // COMMON PROFILE
  // ======================================

  loadCommonProfile();
  loadCommonStreak();

});


// ========================================
// LOAD COMMON PROFILE
// ========================================

async function loadCommonProfile() {

  const userId =
    localStorage.getItem("typemaster-user-id");


  // ======================================
  // GUEST
  // ======================================

  if (!userId) {

    updateCommonProfile({
      name: "Guest",
      description:
        "Please sign in to view your profile."
    });

    return;
  }


  // ======================================
  // LOAD USER FROM DATABASE
  // ======================================

  try {

    const response =
      await fetch(
        `https://typemaster-backend-01.onrender.com/api/auth/profile/${encodeURIComponent(userId)}`
      );


    const data =
      await response.json();


    if (
      !response.ok ||
      !data.success
    ) {

      throw new Error(
        data.message ||
        "Could not load profile."
      );

    }


    const user =
      data.user || data.profile;

    if (!user || !user.name) {

      throw new Error(
        "Invalid profile data."
      );

    }


    updateCommonProfile({

      name:
        user.name,

      description:
        user.description ||
        "Typing enthusiast"

    });


    // Keep local profile synchronized

    localStorage.setItem(
      "typemaster-profile",
      JSON.stringify({

        name:
          user.name,

        description:
          user.description ||
          "Typing enthusiast"

      })
    );


  } catch (error) {

    console.error(
      "Could not load common profile:",
      error
    );


    // Fallback to saved profile

    try {

      const saved =
        localStorage.getItem(
          "typemaster-profile"
        );


      if (saved) {

        const profile =
          JSON.parse(saved);


        if (
          profile &&
          profile.name
        ) {

          updateCommonProfile(
            profile
          );

          return;
        }

      }

    } catch (localError) {

      console.error(
        "Could not load saved profile:",
        localError
      );

    }


    // Final fallback

    updateCommonProfile({

      name: "Guest",

      description:
        "Please sign in to view your profile."

    });

  }

}


// ========================================
// UPDATE PROFILE EVERYWHERE
// ========================================

function updateCommonProfile(profile) {

  const name =
    profile.name || "Guest";

  const description =
    profile.description ||
    "Typing enthusiast";


  const initial =
    name
      .charAt(0)
      .toUpperCase();


  // ======================================
  // TOP-RIGHT PROFILE NAME
  // ======================================

  const homeProfileName =
    document.querySelector(
      ".home-profile span"
    );

  if (homeProfileName) {

    homeProfileName.textContent =
      name;

  }


  // ======================================
  // HOME LARGE PROFILE
  // ======================================

  const homeLargeName =
    document.querySelector(
      ".home-profile-top strong"
    );

  if (homeLargeName) {

    homeLargeName.textContent =
      name;

  }


  const homeDescription =
    document.querySelector(
      ".home-profile-top small"
    );

  if (homeDescription) {

    homeDescription.textContent =
      description;

  }


  // ======================================
  // HOME AVATAR
  // ======================================

  const homeAvatar =
    document.querySelector(
      ".home-avatar"
    );

  if (homeAvatar) {

    homeAvatar.textContent =
      initial;

  }


  const homeLargeAvatar =
    document.querySelector(
      ".home-large-avatar"
    );

  if (homeLargeAvatar) {

    homeLargeAvatar.textContent =
      initial;

  }


  // ======================================
  // ALL OTHER PAGE TOP-RIGHT AVATARS
  // ======================================

  const headerAvatars =
    document.querySelectorAll(
      ".header .avatar, #dailyProfileAvatar"
    );

  headerAvatars.forEach(
    avatar => {

      avatar.textContent =
        initial;

    }
  );

  // ======================================
  // PROFILE PAGE NAME
  // ======================================

  const profileName =
    document.querySelector(
      ".profile-info h1"
    );

  if (profileName) {

    profileName.textContent =
      name;

  }


  // ======================================
  // PROFILE PAGE DESCRIPTION
  // ======================================

  const profileDescription =
    document.querySelector(
      ".profile-info p"
    );

  if (profileDescription) {

    profileDescription.textContent =
      description;

  }


  // ======================================
  // PROFILE PAGE AVATAR
  // ======================================

  const profileAvatar =
    document.querySelector(
      ".profile-avatar"
    );

  if (profileAvatar) {

    profileAvatar.textContent =
      initial;

  }

}
// ========================================
// LOAD COMMON SIDEBAR STREAK
// ========================================

async function loadCommonStreak() {

  const streakElements =
    document.querySelectorAll(
      "#sidebarStreak"
    );

  if (!streakElements.length) {
    return;
  }

  const userId =
    localStorage.getItem(
      "typemaster-user-id"
    );

  // Guest
  if (!userId) {

    streakElements.forEach(
      element => {

        element.textContent =
          "0 Days";

      }
    );

    return;
  }

  try {

    const response =
      await fetch(
        `https://typemaster-backend-01.onrender.com/api/auth/profile/${encodeURIComponent(userId)}`
      );

    const data =
      await response.json();

    if (
      !response.ok ||
      !data.success
    ) {
      throw new Error(
        data.message ||
        "Could not load streak."
      );
    }

    const user =
      data.user || data.profile;

    const streak =
      Number(user?.streak) || 0;

    streakElements.forEach(
      element => {

        element.textContent =
          `${streak} ${streak === 1 ? "Day" : "Days"}`;

      }
    );

  } catch (error) {

    console.error(
      "Could not load common streak:",
      error
    );

    streakElements.forEach(
      element => {

        element.textContent =
          "0 Days";

      }
    );

  }

}