document.addEventListener("DOMContentLoaded", () => {
  loadHomeStats();
  loadHomeUser();
  loadNotifications();
});

async function loadHomeStats() {
  const userId = localStorage.getItem("typemaster-user-id");

  if (!userId) {
    console.warn("No logged-in user found.");
    return;
  }

  try {
    const response = await apiRequest(
      `/api/typing-test/history/${encodeURIComponent(userId)}`
    );

    const history = response.history || [];

    if (history.length === 0) {
      const currentStreak = await loadHomeStreak();

      updateHomeStats(
        0,
        0,
        0,
        currentStreak
      );

      return;
    }

    const bestWpm = Math.max(
      ...history.map(test => Number(test.wpm) || 0)
    );

    const bestAccuracy = Math.max(
      ...history.map(test => Number(test.accuracy) || 0)
    );

    const totalTests = history.length;

    const currentStreak = await loadHomeStreak();

    updateHomeStats(
      bestWpm,
      bestAccuracy,
      totalTests,
      currentStreak
    );

  } catch (error) {
    console.error("Failed to load Home stats:", error);
  }
}

function updateHomeStats(
  bestWpm,
  bestAccuracy,
  totalTests,
  currentStreak
) {
  const heroBestWpm = document.getElementById("heroBestWpm");
  const homeBestWpm = document.getElementById("homeBestWpm");
  const homeBestAccuracy = document.getElementById("homeBestAccuracy");
  const homeTotalTests = document.getElementById("homeTotalTests");
  const homeCurrentStreak = document.getElementById("homeCurrentStreak");
  const homeStreakValue = document.getElementById("homeStreakValue");

  if (heroBestWpm) {
    heroBestWpm.textContent = bestWpm;
  }

  if (homeBestWpm) {
    homeBestWpm.textContent = bestWpm;
  }

  if (homeBestAccuracy) {
    homeBestAccuracy.textContent = `${bestAccuracy}%`;
  }

  if (homeTotalTests) {
    homeTotalTests.textContent = totalTests;
  }

  if (homeCurrentStreak) {
    homeCurrentStreak.textContent =
      `${currentStreak} ${currentStreak === 1 ? "Day" : "Days"}`;
  }

  if (homeStreakValue) {
    homeStreakValue.textContent = currentStreak;
  }
}
async function loadHomeUser() {
  const userId =
    localStorage.getItem("typemaster-user-id");

  const nameElement =
    document.getElementById("homeUserName");

  const profileNameElement =
    document.getElementById("homeProfileName");

  const avatarElement =
    document.getElementById("homeAvatar");

  const largeAvatarElement =
    document.getElementById("homeLargeAvatar");

  // User logged out
  if (!userId) {
    const guestName = "Guest";

    if (nameElement) {
      nameElement.textContent = guestName;
    }

    if (profileNameElement) {
      profileNameElement.textContent = guestName;
    }

    if (avatarElement) {
      avatarElement.textContent = "G";
    }

    if (largeAvatarElement) {
      largeAvatarElement.textContent = "G";
    }

    return;
  }

  try {
    const response = await apiRequest(
      `/api/auth/profile/${encodeURIComponent(userId)}`
    );

    const user = response.user;

    if (!user) {
      console.warn("Logged-in user not found.");
      return;
    }

    const userName =
      user.name || "User";

    if (nameElement) {
      nameElement.textContent = userName;
    }

    if (profileNameElement) {
      profileNameElement.textContent = userName;
    }

    const firstLetter =
      userName.trim().charAt(0).toUpperCase();

    if (avatarElement) {
      avatarElement.textContent = firstLetter;
    }

    if (largeAvatarElement) {
      largeAvatarElement.textContent = firstLetter;
    }

  } catch (error) {
    console.error(
      "Failed to load Home user:",
      error
    );
  }
}
async function loadNotifications() {
  const userId = localStorage.getItem("typemaster-user-id");

  if (!userId) {
    console.warn("No logged-in user found.");
    return;
  }

  try {
    const response = await apiRequest(
      `/api/notifications/${encodeURIComponent(userId)}`
    );

    const notifications = response.notifications || [];

    const notificationList =
      document.getElementById("notificationList");

    const notificationCount =
      document.getElementById("notificationCount");

    if (!notificationList) {
      return;
    }

    if (notifications.length === 0) {

      notificationList.innerHTML = `
        <div class="notification-item">
          <div class="notification-icon">🔔</div>
          <div>
            <strong>No notifications</strong>
            <p>You're all caught up!</p>
          </div>
        </div>
      `;

      if (notificationCount) {
        notificationCount.textContent = "0";
      }

      return;
    }

    notificationList.innerHTML =
      notifications
        .map(notification => `
          <div class="notification-item">
            <div class="notification-icon">
              ${notification.icon || "🔔"}
            </div>

            <div>
              <strong>
                ${notification.title}
              </strong>

              <p>
                ${notification.message}
              </p>
            </div>
          </div>
        `)
        .join("");

    if (notificationCount) {
      notificationCount.textContent =
        notifications.filter(
          notification => !notification.isRead
        ).length;
    }

  } catch (error) {

    console.error(
      "Failed to load notifications:",
      error
    );

  }
}
// =====================================================
// CLEAR ALL NOTIFICATIONS
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

  const clearNotificationsButton =
    document.getElementById("clearNotifications");

  if (clearNotificationsButton) {

    clearNotificationsButton.addEventListener(
      "click",
      async function () {

        const userId =
          localStorage.getItem("typemaster-user-id");

        if (!userId) {
          alert("Please login first.");
          return;
        }

        const confirmed =
          confirm(
            "Are you sure you want to delete all notifications?"
          );

        if (!confirmed) {
          return;
        }

        try {

          const response =
            await fetch(
              `https://typemaster-backend-01.onrender.com/api/notifications/${encodeURIComponent(userId)}`,
              {
                method: "DELETE"
              }
            );

          const data =
            await response.json();

          if (!response.ok || !data.success) {
            throw new Error(
              data.message ||
              "Failed to delete notifications."
            );
          }

          alert(
            "All notifications deleted successfully."
          );

          // Clear notifications from current screen
          const notificationList =
            document.getElementById("notificationList");

          if (notificationList) {
            notificationList.innerHTML =
              "<p>No notifications yet.</p>";
          }

        } catch (error) {

          console.error(
            "Delete notifications error:",
            error
          );

          alert(
            "Could not delete notifications."
          );

        }

      }
    );

  }

});
// ========================================
// FIX SIDEBAR CURRENT STREAK
// ========================================

function fixSidebarStreak() {

  const userId =
    localStorage.getItem("typemaster-user-id");

  const streakElements =
    document.querySelectorAll(
      ".sidebar strong, .sidebar .streak-value, .current-streak strong"
    );

  streakElements.forEach(element => {

    if (
      element.textContent.includes("undefined") ||
      element.textContent.includes("Days")
    ) {

      element.textContent =
        userId ? "0 Days" : "0 Days";

    }

  });

}

document.addEventListener(
  "DOMContentLoaded",
  fixSidebarStreak
); async function loadHomeStreak() {

  const userId =
    localStorage.getItem("typemaster-user-id");

  if (!userId) {
    return 0;
  }

  try {

    const response =
      await fetch(
        `https://typemaster-backend-01.onrender.com/api/auth/profile/${encodeURIComponent(userId)}`
      );

    const data =
      await response.json();

    if (!response.ok || !data.success) {
      return 0;
    }

    const user =
      data.user || data.profile;

    return Number(user?.streak) || 0;

  } catch (error) {

    console.error(
      "Could not load Home streak:",
      error
    );

    return 0;
  }
}