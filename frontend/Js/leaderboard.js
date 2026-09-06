// =====================================================
// DATABASE LEADERBOARD DATA
// =====================================================

let dbLeaderboards = {
  wpm: [],
  accuracy: [],
  daily: []
};


// =====================================================
// LOAD LEADERBOARDS FROM POSTGRESQL
// =====================================================

async function loadDbLeaderboards() {

  try {

    const [
      wpmResponse,
      accuracyResponse,
      dailyResponse
    ] = await Promise.all([

      fetch(
        "https://typemaster-backend-01.onrender.com/api/typing-test/leaderboard"
      ),

      fetch(
        "https://typemaster-backend-01.onrender.com/api/typing-test/accuracy-leaderboard"
      ),

      fetch(
        "https://typemaster-backend-01.onrender.com/api/typing-test/daily-leaderboard"
      )

    ]);


    const wpmData =
      await wpmResponse.json();

    const accuracyData =
      await accuracyResponse.json();

    const dailyData =
      await dailyResponse.json();


    if (
      !wpmResponse.ok ||
      !wpmData.success
    ) {
      throw new Error(
        wpmData.message ||
        "Could not load WPM leaderboard"
      );
    }


    if (
      !accuracyResponse.ok ||
      !accuracyData.success
    ) {
      throw new Error(
        accuracyData.message ||
        "Could not load accuracy leaderboard"
      );
    }


    if (
      !dailyResponse.ok ||
      !dailyData.success
    ) {
      throw new Error(
        dailyData.message ||
        "Could not load daily leaderboard"
      );
    }


    dbLeaderboards.wpm =
      Array.isArray(wpmData.leaderboard)
        ? wpmData.leaderboard
        : [];


    dbLeaderboards.accuracy =
      Array.isArray(accuracyData.leaderboard)
        ? accuracyData.leaderboard
        : [];


    dbLeaderboards.daily =
      Array.isArray(dailyData.leaderboard)
        ? dailyData.leaderboard
        : [];

  } catch (error) {

    console.error(
      "Leaderboard database error:",
      error
    );

  }

}
// ========================================
// TYPEMASTER LEADERBOARD
// ========================================

const leaderboardList =
  document.getElementById("leaderboardList");

const yourRank =
  document.getElementById("yourRank");

const yourBestWpm =
  document.getElementById("yourBestWpm");

const yourBestLabel =
  document.getElementById("yourBestLabel");

const leaderboardUserName =
  document.getElementById("leaderboardUserName");

const leaderboardAvatar =
  document.getElementById("leaderboardAvatar");

const leaderboardMenuUserName =
  document.getElementById("leaderboardMenuUserName");

const leaderboardMenuAvatar =
  document.getElementById("leaderboardMenuAvatar");

const filterButtons =
  document.querySelectorAll(
    ".leaderboard-filter"
  );


let players = [];

// ========================================
// RENDER LEADERBOARD
// ========================================

function renderLeaderboard() {

  if (!leaderboardList) {
    return;
  }


  const sortedPlayers =
    [...players].sort(
      (a, b) =>
        b.score - a.score
    );
  updatePodium(
    sortedPlayers,
    "WPM"
  );

  leaderboardList.innerHTML =
    "";


  sortedPlayers.forEach(
    (player, index) => {

      const row =
        document.createElement(
          "div"
        );


      row.className =
        "leaderboard-row";


      const rank =
        index + 1;


      row.innerHTML = `

        <div class="leaderboard-row-rank">
          ${rank}
        </div>

        <div class="leaderboard-row-avatar">
          ${player.name.charAt(0)}
        </div>

        <div class="leaderboard-row-name">
          <strong>
            ${player.name}
          </strong>

          <span>
            Typing player
          </span>
        </div>

        <div class="leaderboard-row-score">
          <small>
            WPM
          </small>

          <strong>
            ${player.score}
          </strong>
        </div>

      `;


      const currentUserId =
        localStorage.getItem("typemaster-user-id");

      if (
        player.id === currentUserId
      ) {

        row.classList.add(
          "current-user"
        );

      }

      leaderboardList.appendChild(
        row
      );
      updateUserRank(
        sortedPlayers
      );

    }
  );
  if (yourBestLabel) {
    yourBestLabel.textContent = "BEST WPM";
  }
}
// ========================================
// USER RANK
// ========================================

function updateUserRank(sortedPlayers, unit) {

  const currentUserId =
    localStorage.getItem("typemaster-user-id");

  const userIndex =
    sortedPlayers.findIndex(
      player =>
        player.id === currentUserId
    );

  const currentUser =
    userIndex >= 0
      ? sortedPlayers[userIndex]
      : null;

  if (yourBestWpm) {

    yourBestWpm.textContent =
      currentUser
        ? Number(currentUser.score) || 0
        : 0;

  }

  if (yourRank) {

    yourRank.textContent =
      userIndex >= 0
        ? `#${userIndex + 1}`
        : "—";

  }

}
// ========================================
// LEADERBOARD FILTERS
// ========================================

filterButtons.forEach(button => {

  button.addEventListener("click", () => {

    // Active button change
    filterButtons.forEach(item => {
      item.classList.remove("active");
    });

    button.classList.add("active");


    const board =
      button.dataset.board;


    // SPEED
    if (board === "wpm") {

      renderLeaderboard();

      return;
    }


    // ACCURACY
    if (board === "accuracy") {

      renderAccuracyLeaderboard();

      return;
    }


    // DAILY CHALLENGE
    if (board === "daily") {

      renderDailyLeaderboard();

      return;
    }

  });

});


// ========================================
// ACCURACY LEADERBOARD
// ========================================

function renderAccuracyLeaderboard() {

  if (!leaderboardList) {
    return;
  }

  const accuracyPlayers =
    dbLeaderboards.accuracy.map(
      (player) => ({
        id: player.id,
        name: player.name,
        score:
          Number(player.score) || 0
      })
    );

  accuracyPlayers.sort(
    (a, b) =>
      b.score - a.score
  );

  updatePodium(
    accuracyPlayers,
    "%"
  );

  renderGenericLeaderboard(
    accuracyPlayers,
    "%"
  );
  if (yourBestLabel) {
    yourBestLabel.textContent = "BEST ACCURACY";
  }
}


function renderDailyLeaderboard() {

  if (!leaderboardList) {
    return;
  }

  const dailyPlayers =
    dbLeaderboards.daily.map(
      (player) => ({
        id: player.id,
        name: player.name,
        score:
          Number(player.score) || 0
      })
    );

  dailyPlayers.sort(
    (a, b) =>
      b.score - a.score
  );

  updatePodium(
    dailyPlayers,
    "WPM"
  );

  renderGenericLeaderboard(
    dailyPlayers,
    "WPM"
  );
  if (yourBestLabel) {
    yourBestLabel.textContent = "BEST WPM";
  }
}

// ========================================
// GENERIC LIST
// ========================================

function renderGenericLeaderboard(
  list,
  unit
) {

  leaderboardList.innerHTML = "";

  list.forEach(
    (player, index) => {

      const row =
        document.createElement("div");

      row.className =
        "leaderboard-row";

      row.innerHTML = `

        <div class="leaderboard-row-rank">
          ${index + 1}
        </div>

        <div class="leaderboard-row-avatar">
          ${player.name.charAt(0)}
        </div>

        <div class="leaderboard-row-name">

          <strong>
            ${player.name}
          </strong>

          <span>
            Typing player
          </span>

        </div>

        <div class="leaderboard-row-score">

          <small>
            ${unit}
          </small>

          <strong>
            ${player.score}
          </strong>

        </div>

      `;

      const currentUserId =
        localStorage.getItem(
          "typemaster-user-id"
        );

      if (player.id === currentUserId) {
        row.classList.add("current-user");
      }

      leaderboardList.appendChild(row);

    }
  );


  const currentUserId =
    localStorage.getItem(
      "typemaster-user-id"
    );

  const currentUserIndex =
    list.findIndex(
      player =>
        player.id === currentUserId
    );

  if (yourRank) {
    yourRank.textContent =
      currentUserIndex >= 0
        ? `#${currentUserIndex + 1}`
        : "—";
  }

  if (yourBestWpm) {
    yourBestWpm.textContent =
      currentUserIndex >= 0
        ? Number(list[currentUserIndex].score) || 0
        : 0;
  }

}

// ========================================
// UPDATE PODIUM
// ========================================

function updatePodium(list, unit) {

  const first =
    list[0];

  const second =
    list[1];

  const third =
    list[2];

  const firstName =
    document.getElementById(
      "podiumFirstName"
    );

  const firstScore =
    document.getElementById(
      "podiumFirstScore"
    );

  const firstAvatar =
    document.getElementById(
      "podiumFirstAvatar"
    );

  const secondName =
    document.getElementById(
      "podiumSecondName"
    );

  const secondScore =
    document.getElementById(
      "podiumSecondScore"
    );

  const secondAvatar =
    document.getElementById(
      "podiumSecondAvatar"
    );

  const thirdName =
    document.getElementById(
      "podiumThirdName"
    );

  const thirdScore =
    document.getElementById(
      "podiumThirdScore"
    );

  const thirdAvatar =
    document.getElementById(
      "podiumThirdAvatar"
    );


  if (first) {

    firstName.textContent =
      first.name;

    firstScore.textContent =
      `${Number(first.score) || 0} ${unit}`;

    firstAvatar.textContent =
      first.name
        ? first.name.charAt(0).toUpperCase()
        : "—";

  } else {

    firstName.textContent = "—";
    firstScore.textContent = "—";
    firstAvatar.textContent = "—";

  }


  if (second) {

    secondName.textContent =
      second.name;

    secondScore.textContent =
      `${Number(second.score) || 0} ${unit}`;

    secondAvatar.textContent =
      second.name
        ? second.name.charAt(0).toUpperCase()
        : "—";

  } else {

    secondName.textContent = "—";
    secondScore.textContent = "—";
    secondAvatar.textContent = "—";

  }


  if (third) {

    thirdName.textContent =
      third.name;

    thirdScore.textContent =
      `${Number(third.score) || 0} ${unit}`;

    thirdAvatar.textContent =
      third.name
        ? third.name.charAt(0).toUpperCase()
        : "—";

  } else {

    thirdName.textContent = "—";
    thirdScore.textContent = "—";
    thirdAvatar.textContent = "—";

  }

}
// ========================================
// INITIALIZE
// ========================================

(async function initializeLeaderboard() {

  await loadDbLeaderboards();

  players =
    dbLeaderboards.wpm.map(
      (player) => ({
        id: player.id,
        name: player.name,
        score: Number(player.score) || 0,
        type: "wpm"
      })
    );

  renderLeaderboard();

})();
async function loadLeaderboardProfile() {

  const userId =
    localStorage.getItem(
      "typemaster-user-id"
    );

  if (!userId) {
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
        "Could not load profile"
      );
    }

    const user =
      data.user;

    if (
      leaderboardUserName &&
      user?.name
    ) {
      leaderboardUserName.textContent =
        user.name;
    }

    if (
      leaderboardAvatar &&
      user?.name
    ) {
      leaderboardAvatar.textContent =
        user.name.charAt(0).toUpperCase();
    }
    if (
      leaderboardMenuUserName &&
      user?.name
    ) {
      leaderboardMenuUserName.textContent =
        user.name;
    }

    if (
      leaderboardMenuAvatar &&
      user?.name
    ) {
      leaderboardMenuAvatar.textContent =
        user.name.charAt(0).toUpperCase();
    }

  } catch (error) {

    console.error(
      "Leaderboard profile error:",
      error
    );

  }

}
loadLeaderboardProfile();