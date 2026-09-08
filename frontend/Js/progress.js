// ========================================
// TYPEMASTER PROFESSIONAL PROGRESS
// ========================================

let testHistory = [];


// ========================================
// LOAD HISTORY FROM DATABASE
// ========================================

async function loadHistory() {

  const userId =
    localStorage.getItem("typemaster-user-id");

  // Login nahi hai
  if (!userId) {

    testHistory = [];

    return;

  }


  try {

    const response = await fetch(
      `https://typemaster-backend-01.onrender.com/api/typing-test/history/${encodeURIComponent(userId)}`
    );


    const data = await response.json();


    if (!response.ok || !data.success) {

      throw new Error(
        data.message ||
        "Could not load typing history"
      );

    }


    testHistory =
      Array.isArray(data.history)
        ? data.history.map((item) => ({

          title: "Typing Test",

          wpm:
            Number(item.wpm) || 0,

          accuracy:
            Number(item.accuracy) || 0,

          mistakes:
            Number(item.wrongCharacters) || 0,

          duration:
            Number(item.durationSeconds) || 0,

          correctCharacters:
            Number(item.correctCharacters) || 0,

          wrongCharacters:
            Number(item.wrongCharacters) || 0,

          text:
            item.typingText || item.text || "",

          typedText:
            item.typedText || "",
          date:
            item.createdAt

        }))
        : [];


  } catch (error) {

    console.error(
      "Database history loading error:",
      error
    );

    testHistory = [];

  }

}


// ========================================
// ELEMENTS
// ========================================

const totalTestsEl =
  document.getElementById("totalTests");

const bestWpmEl =
  document.getElementById("bestWpm");

const averageWpmEl =
  document.getElementById("averageWpm");

const bestAccuracyEl =
  document.getElementById("bestAccuracy");

const historyContainer =
  document.getElementById(
    "historyContainer"
  );

const clearHistoryButton =
  document.getElementById(
    "clearHistory"
  );

const wpmImprovementEl =
  document.getElementById(
    "wpmImprovement"
  );

const accuracyImprovementEl =
  document.getElementById(
    "accuracyImprovement"
  );

const wpmImprovementText =
  document.getElementById(
    "wpmImprovementText"
  );

const accuracyImprovementText =
  document.getElementById(
    "accuracyImprovementText"
  );

const streakEl =
  document.getElementById("streak");

const statusText =
  document.getElementById("statusText");


// ========================================
// VALUE HELPERS
// ========================================

function getWpm(test) {

  return Number(
    test?.wpm
  ) || 0;

}


function getAccuracy(test) {

  return Number(
    String(
      test?.accuracy || "0"
    ).replace("%", "")
  ) || 0;

}


function getDate(test) {

  if (!test?.date) {

    return null;

  }


  const date =
    new Date(test.date);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return null;

  }


  return date;

}
function formatHistoryDate(value) {

  if (!value) {
    return "Completed";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Completed";
  }

  return date.toLocaleString(
    undefined,
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }
  );

}


// ========================================
// STATISTICS
// ========================================

function updateStatistics() {

  const count =
    testHistory.length;


  totalTestsEl.textContent =
    count;


  if (count === 0) {

    bestWpmEl.textContent = "0";

    averageWpmEl.textContent = "0";

    bestAccuracyEl.textContent =
      "0%";

    return;

  }


  const wpms =
    testHistory.map(getWpm);


  const accuracies =
    testHistory.map(
      getAccuracy
    );


  const bestWpm =
    Math.max(...wpms);


  const totalWpm =
    wpms.reduce(
      (sum, value) =>
        sum + value,
      0
    );


  const averageWpm =
    Math.round(
      totalWpm / wpms.length
    );


  const bestAccuracy =
    Math.max(...accuracies);


  bestWpmEl.textContent =
    bestWpm;


  averageWpmEl.textContent =
    averageWpm;


  bestAccuracyEl.textContent =
    `${bestAccuracy}%`;

}


// ========================================
// IMPROVEMENT
// ========================================

function updateImprovement() {

  if (testHistory.length < 2) {

    wpmImprovementEl.textContent =
      "+0%";

    accuracyImprovementEl.textContent =
      "+0%";

    wpmImprovementText.textContent =
      "Complete another test to compare";

    accuracyImprovementText.textContent =
      "Complete another test to compare";

    return;

  }


  const first =
    testHistory[0];


  const latest =
    testHistory[
    testHistory.length - 1
    ];


  const firstWpm =
    getWpm(first);


  const latestWpm =
    getWpm(latest);


  const firstAccuracy =
    getAccuracy(first);


  const latestAccuracy =
    getAccuracy(latest);


  let wpmChange = 0;

  let accuracyChange = 0;


  if (firstWpm > 0) {

    wpmChange =
      Math.round(
        (
          (
            latestWpm -
            firstWpm
          ) /
          firstWpm
        ) *
        100
      );

  }


  if (firstAccuracy > 0) {

    accuracyChange =
      Math.round(
        (
          (
            latestAccuracy -
            firstAccuracy
          ) /
          firstAccuracy
        ) *
        100
      );

  }


  wpmImprovementEl.textContent =
    `${wpmChange >= 0 ? "+" : ""}${wpmChange}%`;


  accuracyImprovementEl.textContent =
    `${accuracyChange >= 0 ? "+" : ""}${accuracyChange}%`;


  wpmImprovementText.textContent =
    latestWpm >= firstWpm
      ? `${firstWpm} → ${latestWpm} WPM`
      : `${firstWpm} → ${latestWpm} WPM`;


  accuracyImprovementText.textContent =
    `${firstAccuracy}% → ${latestAccuracy}%`;

}


// ========================================
// STREAK
// ========================================

function calculateStreak() {

  const dates =
    testHistory
      .map(getDate)
      .filter(Boolean)
      .sort(
        (a, b) =>
          b - a
      );


  if (dates.length === 0) {

    streakEl.textContent =
      "0 days";

    return;

  }


  const uniqueDays = [];


  dates.forEach(
    date => {

      const key =
        date.toDateString();


      if (
        !uniqueDays.includes(key)
      ) {

        uniqueDays.push(key);

      }

    }
  );


  let streak = 1;


  for (
    let i = 1;
    i < uniqueDays.length;
    i++
  ) {

    const current =
      new Date(
        uniqueDays[i - 1]
      );


    const previous =
      new Date(
        uniqueDays[i]
      );


    const difference =
      Math.round(
        (
          current -
          previous
        ) /
        (
          1000 *
          60 *
          60 *
          24
        )
      );


    if (difference === 1) {

      streak++;

    } else {

      break;

    }

  }


  streakEl.textContent =
    `${streak} ${streak === 1 ? "day" : "days"}`;

}


// ========================================
// STATUS
// ========================================

function updateStatus() {

  if (
    testHistory.length === 0
  ) {

    statusText.textContent =
      "Start your journey";

    return;

  }


  if (
    testHistory.length >= 10
  ) {

    statusText.textContent =
      "Excellent consistency";

  } else if (
    testHistory.length >= 5
  ) {

    statusText.textContent =
      "Great progress";

  } else {

    statusText.textContent =
      "Keep practicing";

  }

}


// ========================================
// HISTORY
// ========================================

function renderHistory() {

  if (!historyContainer) {
    return;
  }


  if (
    testHistory.length === 0
  ) {

    historyContainer.innerHTML = `

      <div class="empty">

        <div class="empty-icon">
          📝
        </div>

        <strong>
          No tests completed yet
        </strong>

        <p>
          Complete your first typing test to start tracking progress.
        </p>

      </div>

    `;

    return;

  }


  const recent =
    [
      ...testHistory
    ]
      .reverse()
      .slice(0, 10);


  historyContainer.innerHTML =
    "";


  recent.forEach(
    (test, index) => {

      const row =
        document.createElement(
          "div"
        );


      row.className =
        "history-row";


      row.innerHTML = `

        <div class="history-number">
          ${testHistory.length - index}
        </div>


        <div class="history-info">

          <strong>
            ${test.title || "Typing Test"}
          </strong>

          <span>
            ${formatHistoryDate(test.date)} • ${Math.round((Number(test.duration) || 0) / 60)} min
          </span>
        </div>


        <div class="history-result">

          <div>

            <small>
              WPM
            </small>

            <strong>
              ${getWpm(test)}
            </strong>

          </div>


          <div>

            <small>
              ACCURACY
            </small>

            <strong>
              ${getAccuracy(test)}%
            </strong>

          </div>


          <div>

            <small>
              MISTAKES
            </small>

            <strong>
              ${Number(test.mistakes) || 0}
            </strong>

          </div>

        </div>
        <button
           class="history-print-button"
           type="button"
          onclick="printHistoryTest(${index})"
           >
           🖨️ Print
           </button>
      `;


      historyContainer.appendChild(
        row
      );

    }
  );

}
function printHistoryTest(index) {

  const recent =
    [...testHistory]
      .reverse()
      .slice(0, 10);

  const test = recent[index];
  const savedProfile = localStorage.getItem("typemaster-profile");

  let userName = "TypeMaster User";

  if (savedProfile) {
    try {
      const profile = JSON.parse(savedProfile);

      if (profile?.name) {
        userName = profile.name;
      }
    } catch (error) {
      console.error("Could not load profile name:", error);
    }
  }

  if (!test) {
    return;
  }

  const printWindow =
    window.open("", "_blank");

  if (!printWindow) {
    alert("Please allow pop-ups to print the report.");
    return;
  }

  const duration =
    Math.round(
      (Number(test.duration) || 0) / 60
    );

  const wpm =
    getWpm(test);

  const accuracy =
    getAccuracy(test);

  const mistakes =
    Number(test.mistakes) || 0;

  const correctCharacters =
    Number(test.correctCharacters) || 0;

  const wrongCharacters =
    Number(test.wrongCharacters) || mistakes;

  const totalCharacters =
    correctCharacters + wrongCharacters;
  let typedReport = [];

  try {
    typedReport = JSON.parse(test.typedText || "[]");
  } catch (error) {
    console.error("Could not parse typed text:", error);
  }

  const typedHtml = typedReport
    .map((item) => {
      if (item.typed === item.correct) {
        return `<span>${item.typed}</span>`;
      }

      return `
      <span class="wrong-char">${item.typed}</span>
      <span class="correct-char">→ ${item.correct}</span>
    `;
    })
    .join("");
  printWindow.document.write(`

    <!DOCTYPE html>

    <html>

    <head>

      <meta charset="UTF-8">

      <title>
        TypeMaster - Typing Test Report
      </title>

      <style>

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 40px;
          background: #f8fafc;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          color: #0f172a;
        }

        .report {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }

        .header {
          padding: 30px 35px;
          border-bottom: 1px solid #e2e8f0;
        }

        .brand {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .subtitle {
          font-size: 14px;
          color: #64748b;
        }

        .test-title {
          margin-top: 25px;
          font-size: 22px;
          font-weight: 700;
        }

        .date {
          margin-top: 7px;
          font-size: 13px;
          color: #64748b;
        }

        .content {
          padding: 30px 35px;
        }

        .section-title {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 15px;
        }

        .stats {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 30px;
        }

        .stat {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 18px;
        }

        .stat-label {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 25px;
          font-weight: 800;
        }

        .details {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 30px;
        }

        .detail {
          background: #f8fafc;
          border-radius: 10px;
          padding: 15px;
        }

        .detail-label {
          font-size: 11px;
          color: #64748b;
          margin-bottom: 5px;
        }

        .detail-value {
          font-size: 17px;
          font-weight: 700;
        }

        .typing-box {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 22px;
          line-height: 1.8;
          font-size: 15px;
          white-space: pre-wrap;
          color: #334155;
        }
          .wrong-char {
          color: #dc2626;
          font-weight: 700;
          text-decoration: underline;
        }

        .correct-char {
          color: #16a34a;
          font-weight: 700;
          margin-left: 4px;
        }

        .footer {
          padding: 20px 35px;
          border-top: 1px solid #e2e8f0;
          font-size: 12px;
          color: #64748b;
          text-align: center;
        }

        @media print {

          body {
            padding: 0;
            background: white;
          }

          .report {
            border: none;
            border-radius: 0;
            max-width: none;
          }

        }

      </style>

    </head>

    <body>

      <div class="report">

        <div class="header">

          <div class="brand">
            TypeMaster
          </div>

          <div class="subtitle">
            Professional Typing Test Report
          </div>

           <div class="test-title">
             Typing Test Results
           </div>

           <div class="user-name">
             ${userName}
           </div>

           <div class="date">
            ${formatHistoryDate(test.date)}
          </div>

        </div>


        <div class="content">

          <div class="section-title">
            PERFORMANCE
          </div>


          <div class="stats">

            <div class="stat">

              <div class="stat-label">
                WPM
              </div>

              <div class="stat-value">
                ${wpm}
              </div>

            </div>


            <div class="stat">

              <div class="stat-label">
                ACCURACY
              </div>

              <div class="stat-value">
                ${accuracy}%
              </div>

            </div>


            <div class="stat">

              <div class="stat-label">
                TEST DURATION
              </div>

              <div class="stat-value">
                ${duration} min
              </div>

            </div>


            <div class="stat">

              <div class="stat-label">
                MISTAKES
              </div>

              <div class="stat-value">
                ${mistakes}
              </div>

            </div>

          </div>


          <div class="section-title">
            TEST DETAILS
          </div>


          <div class="details">

            <div class="detail">

              <div class="detail-label">
                CORRECT CHARACTERS
              </div>

              <div class="detail-value">
                ${correctCharacters}
              </div>

            </div>


            <div class="detail">

              <div class="detail-label">
                WRONG CHARACTERS
              </div>

              <div class="detail-value">
                ${wrongCharacters}
              </div>

            </div>


            <div class="detail">

              <div class="detail-label">
                TOTAL CHARACTERS
              </div>

              <div class="detail-value">
                ${totalCharacters}
              </div>

            </div>

          </div>


          <div class="section-title">
            TYPING TEXT
          </div>
          <div class="typing-box">
            ${typedHtml}
          </div>
        </div>


        <div class="footer">
          Generated by TypeMaster
        </div>

      </div>

    </body>

    </html>

  `);

  printWindow.document.close();

  printWindow.focus();

  setTimeout(
    () => {
      printWindow.print();
    },
    300
  );

}
// ========================================
// MODERN CHART
// ========================================

function drawLineChart(
  canvas,
  values,
  maxValue,
  suffix,
  lineColor
) {

  if (!canvas) {
    return;
  }


  const wrapper =
    canvas.parentElement;


  const width =
    wrapper.clientWidth || 500;


  const height =
    wrapper.clientHeight || 285;


  const ratio =
    window.devicePixelRatio || 1;


  canvas.width =
    width * ratio;

  canvas.height =
    height * ratio;


  canvas.style.width =
    width + "px";

  canvas.style.height =
    height + "px";


  const ctx =
    canvas.getContext("2d");


  ctx.setTransform(
    ratio,
    0,
    0,
    ratio,
    0,
    0
  );


  ctx.clearRect(
    0,
    0,
    width,
    height
  );


  // ======================================
  // EMPTY
  // ======================================

  if (
    values.length === 0
  ) {

    ctx.fillStyle =
      "#94a3b8";

    ctx.font =
      "14px Arial";

    ctx.textAlign =
      "center";

    ctx.fillText(
      "Complete a test to see your progress",
      width / 2,
      height / 2
    );

    return;

  }


  // ======================================
  // PADDING
  // ======================================

  const left = 48;

  const right = 24;

  const top = 28;

  const bottom = 45;


  const chartWidth =
    width -
    left -
    right;


  const chartHeight =
    height -
    top -
    bottom;


  // ======================================
  // GRID
  // ======================================

  ctx.strokeStyle =
    "#e5eaf1";

  ctx.lineWidth = 1;


  for (
    let i = 0;
    i <= 5;
    i++
  ) {

    const y =
      top +
      chartHeight -
      (
        i / 5
      ) *
      chartHeight;


    ctx.beginPath();

    ctx.moveTo(
      left,
      y
    );

    ctx.lineTo(
      width - right,
      y
    );

    ctx.stroke();


    const label =
      Math.round(
        (
          maxValue *
          i
        ) / 5
      );


    ctx.fillStyle =
      "#94a3b8";

    ctx.font =
      "11px Arial";

    ctx.textAlign =
      "right";


    ctx.fillText(
      `${label}${suffix}`,
      left - 8,
      y + 4
    );

  }


  // ======================================
  // POINTS
  // ======================================

  const points =
    values.map(
      (value, index) => {

        const x =
          values.length === 1

            ? left +
            chartWidth / 2

            : left +
            (
              chartWidth *
              index /
              (
                values.length - 1
              )
            );


        const safeValue =
          Math.max(
            0,
            Math.min(
              value,
              maxValue
            )
          );


        const y =
          top +
          chartHeight -
          (
            safeValue /
            maxValue
          ) *
          chartHeight;


        return {
          x,
          y,
          value
        };

      }
    );


  // ======================================
  // GRADIENT
  // ======================================

  const gradient =
    ctx.createLinearGradient(
      0,
      top,
      0,
      height
    );


  gradient.addColorStop(
    0,
    lineColor === "#2563eb"
      ? "rgba(37,99,235,0.25)"
      : "rgba(22,163,74,0.22)"
  );


  gradient.addColorStop(
    1,
    lineColor === "#2563eb"
      ? "rgba(37,99,235,0.01)"
      : "rgba(22,163,74,0.01)"
  );


  // ======================================
  // AREA
  // ======================================

  ctx.beginPath();


  points.forEach(
    (point, index) => {

      if (index === 0) {

        ctx.moveTo(
          point.x,
          point.y
        );

      } else {

        ctx.lineTo(
          point.x,
          point.y
        );

      }

    }
  );


  ctx.lineTo(
    points[
      points.length - 1
    ].x,
    top + chartHeight
  );


  ctx.lineTo(
    points[0].x,
    top + chartHeight
  );


  ctx.closePath();


  ctx.fillStyle =
    gradient;

  ctx.fill();


  // ======================================
  // SMOOTH LINE
  // ======================================

  ctx.beginPath();


  if (
    points.length === 1
  ) {

    ctx.moveTo(
      points[0].x,
      points[0].y
    );

    ctx.lineTo(
      points[0].x,
      points[0].y
    );

  } else {

    ctx.moveTo(
      points[0].x,
      points[0].y
    );


    for (
      let i = 1;
      i < points.length;
      i++
    ) {

      const previous =
        points[i - 1];


      const current =
        points[i];


      const middleX =
        (
          previous.x +
          current.x
        ) / 2;


      ctx.bezierCurveTo(
        middleX,
        previous.y,
        middleX,
        current.y,
        current.x,
        current.y
      );

    }

  }


  ctx.strokeStyle =
    lineColor;

  ctx.lineWidth = 3;

  ctx.lineCap =
    "round";

  ctx.lineJoin =
    "round";

  ctx.stroke();


  // ======================================
  // POINTS
  // ======================================

  points.forEach(
    point => {

      ctx.beginPath();

      ctx.arc(
        point.x,
        point.y,
        8,
        0,
        Math.PI * 2
      );


      ctx.fillStyle =
        "#ffffff";

      ctx.fill();


      ctx.beginPath();

      ctx.arc(
        point.x,
        point.y,
        5,
        0,
        Math.PI * 2
      );


      ctx.fillStyle =
        lineColor;

      ctx.fill();


      ctx.fillStyle =
        "#0f172a";

      ctx.font =
        "bold 12px Arial";

      ctx.textAlign =
        "center";


      ctx.fillText(
        `${point.value}${suffix}`,
        point.x,
        point.y - 14
      );

    }
  );


  // ======================================
  // TEST LABELS
  // ======================================

  points.forEach(
    (point, index) => {

      ctx.fillStyle =
        "#94a3b8";

      ctx.font =
        "11px Arial";

      ctx.textAlign =
        "center";


      ctx.fillText(
        `Test ${index + 1}`,
        point.x,
        height - 15
      );

    }
  );

}


// ========================================
// DRAW CHARTS
// ========================================

function drawCharts() {

  const wpmCanvas =
    document.getElementById(
      "wpmChart"
    );


  const accuracyCanvas =
    document.getElementById(
      "accuracyChart"
    );


  const recent =
    testHistory.slice(-10);


  const wpmValues =
    recent.map(getWpm);


  const accuracyValues =
    recent.map(getAccuracy);


  // ======================================
  // DYNAMIC WPM SCALE
  // ======================================

  const highestWpm =
    Math.max(
      0,
      ...wpmValues
    );


  let wpmMax;


  if (
    highestWpm <= 0
  ) {

    wpmMax = 40;

  } else {

    wpmMax =
      Math.ceil(
        (
          highestWpm * 1.25
        ) / 10
      ) * 10;

  }


  wpmMax =
    Math.max(
      40,
      wpmMax
    );


  drawLineChart(
    wpmCanvas,
    wpmValues,
    wpmMax,
    "",
    "#2563eb"
  );


  drawLineChart(
    accuracyCanvas,
    accuracyValues,
    100,
    "%",
    "#16a34a"
  );

}


// ========================================
// CLEAR HISTORY
// ========================================

// ========================================
// CLEAR HISTORY
// ========================================

if (clearHistoryButton) {

  clearHistoryButton.addEventListener(
    "click",
    async () => {

      if (testHistory.length === 0) {
        return;
      }

      const confirmed =
        confirm(
          "Are you sure you want to clear all typing test history?"
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
          "Please login first."
        );

        return;

      }

      try {

        const response =
          await fetch(
            `https://typemaster-backend-01.onrender.com/api/typing-test/history/${encodeURIComponent(userId)}`,
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
            "Failed to clear history"
          );

        }

        // Clear old local data too
        localStorage.removeItem(
          "typemaster-history"
        );

        // Clear current page data
        testHistory = [];

        updateStatistics();
        drawCharts();

        alert(
          "Typing test history cleared successfully."
        );

      } catch (error) {

        console.error(
          "Clear history error:",
          error
        );

        alert(
          "Could not clear history. Please try again."
        );

      }

    }
  );

}


// ========================================
// RESIZE
// ========================================

window.addEventListener(
  "resize",
  () => {

    drawCharts();

  }
);

// =====================================================
// LESSONS PROGRESS - POSTGRESQL
// =====================================================

let lessonsProgress = [];

async function loadLessonsProgress() {
  const userId = localStorage.getItem("typemaster-user-id");

  if (!userId) {
    lessonsProgress = [];
    return;
  }

  try {
    const response = await fetch(
      `https://typemaster-backend-01.onrender.com/api/lessons/progress/${encodeURIComponent(userId)}`
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Could not load Lessons progress"
      );
    }

    lessonsProgress = Array.isArray(data.progress)
      ? data.progress
      : [];

  } catch (error) {
    console.error(
      "Lessons progress database error:",
      error
    );

    lessonsProgress = [];
  }
}


// =====================================================
// UPDATE LESSONS PROGRESS
// =====================================================

function updateLessonsProgress() {
  const totalLessons = 12;

  const completedLessons = lessonsProgress.filter(
    lesson => lesson.completed === true
  ).length;

  const overallProgress = Math.round(
    (completedLessons / totalLessons) * 100
  );

  const completedElement =
    document.getElementById("lessonsCompleted");

  const progressElement =
    document.getElementById("lessonsOverallProgress");

  const progressFill =
    document.getElementById("lessonsProgressFill");

  if (completedElement) {
    completedElement.textContent =
      `${completedLessons} / ${totalLessons}`;
  }

  if (progressElement) {
    progressElement.textContent =
      `${overallProgress}%`;
  }

  if (progressFill) {
    progressFill.style.width =
      `${overallProgress}%`;
  }

  const breakdown =
    document.getElementById("lessonBreakdown");

  if (!breakdown) return;

  breakdown.innerHTML = "";

  for (
    let lessonNumber = 1;
    lessonNumber <= totalLessons;
    lessonNumber++
  ) {

    const lesson = lessonsProgress.find(
      item => Number(item.lessonNumber) === lessonNumber
    );

    const progress = lesson
      ? Math.max(
        0,
        Math.min(100, Number(lesson.progress) || 0)
      )
      : 0;

    const completed =
      lesson?.completed === true;

    const card =
      document.createElement("div");

    card.className =
      `lesson-breakdown-card${completed ? " completed" : ""}`;

    card.innerHTML = `
      <div class="lesson-breakdown-top">

        <div class="lesson-breakdown-number">
          ${completed
        ? "✓"
        : String(lessonNumber).padStart(2, "0")
      }
        </div>

        <span class="lesson-breakdown-status">
          ${completed
        ? "Completed"
        : progress > 0
          ? "In Progress"
          : "Not Started"
      }
        </span>

      </div>

      <span class="lesson-breakdown-title">
        Lesson ${lessonNumber}
      </span>

      <span class="lesson-breakdown-meta">
        ${completed
        ? "Lesson completed"
        : progress > 0
          ? "Keep practicing"
          : "Start this lesson"
      }
      </span>

      <div class="lesson-breakdown-track">
        <div
          class="lesson-breakdown-fill"
          style="width: ${progress}%;">
        </div>
      </div>

      <span class="lesson-breakdown-percent">
        ${progress}%
      </span>
    `;

    breakdown.appendChild(card);
  }

}

// ========================================
// INITIALIZE
// ========================================

(async function initializeProgress() {
  await loadHistory();

  await loadLessonsProgress();

  updateStatistics();
  updateImprovement();
  calculateStreak();
  updateStatus();
  renderHistory();

  updateLessonsProgress();

  requestAnimationFrame(() => {
    drawCharts();
  });
})();


// Wait for layout

requestAnimationFrame(
  () => {

    drawCharts();

  }
);


// =====================================================
// DAILY CHALLENGE PROGRESS - POSTGRESQL
// =====================================================

let dailyChallengeHistory = [];


// =====================================================
// LOAD DAILY CHALLENGE HISTORY FROM DATABASE
// =====================================================

async function loadDailyChallengeHistory() {

  const userId =
    localStorage.getItem("typemaster-user-id");

  if (!userId) {

    dailyChallengeHistory = [];

    return;

  }


  try {

    const response =
      await fetch(
        `https://typemaster-backend-01.onrender.com/api/daily-challenge/history/${encodeURIComponent(userId)}`
      );


    const data =
      await response.json();


    if (
      !response.ok ||
      !data.success
    ) {

      throw new Error(
        data.message ||
        "Could not load Daily Challenge history"
      );

    }


    dailyChallengeHistory =
      Array.isArray(data.history)
        ? data.history
        : [];


  } catch (error) {

    console.error(
      "Daily Challenge database history error:",
      error
    );


    dailyChallengeHistory = [];

  }

}


// =====================================================
// GET COMPLETED DAILY ATTEMPTS
// =====================================================

function getCompletedDailyAttempts() {

  return dailyChallengeHistory.filter(
    item =>
      item.completed === true ||
      item.completed === "true"
  );

}


// =====================================================
// UPDATE DAILY CHALLENGE PROGRESS
// =====================================================

async function updateDailyChallengeProgress() {

  const dailyBestWpm =
    document.getElementById(
      "dailyBestWpm"
    );


  const dailyAccuracy =
    document.getElementById(
      "dailyAccuracy"
    );


  const dailyStreak =
    document.getElementById(
      "dailyStreak"
    );


  const dailyCompleted =
    document.getElementById(
      "dailyCompleted"
    );


  // Load Daily Challenge data from PostgreSQL
  await loadDailyChallengeHistory();


  const dailyHistory =
    getCompletedDailyAttempts();


  // -----------------------------------------------------
  // COMPLETED
  // -----------------------------------------------------

  if (dailyCompleted) {

    dailyCompleted.textContent =
      dailyHistory.length;

  }


  // -----------------------------------------------------
  // NO RESULTS
  // -----------------------------------------------------

  if (
    dailyHistory.length === 0
  ) {

    if (dailyBestWpm) {

      dailyBestWpm.textContent =
        "0";

    }


    if (dailyAccuracy) {

      dailyAccuracy.textContent =
        "0%";

    }


    if (dailyStreak) {

      dailyStreak.textContent =
        "0 days";

    }


    return;

  }


  // -----------------------------------------------------
  // BEST WPM
  // -----------------------------------------------------

  const wpms =
    dailyHistory.map(
      item =>
        Number(item.wpm) || 0
    );


  const bestWpm =
    Math.max(...wpms);


  if (dailyBestWpm) {

    dailyBestWpm.textContent =
      bestWpm;

  }


  // -----------------------------------------------------
  // BEST ACCURACY
  // -----------------------------------------------------

  const accuracies =
    dailyHistory.map(
      item =>
        Number(
          String(
            item.accuracy || 0
          ).replace(
            "%",
            ""
          )
        ) || 0
    );


  const bestAccuracy =
    Math.max(...accuracies);


  if (dailyAccuracy) {

    dailyAccuracy.textContent =
      `${bestAccuracy}%`;

  }


  // -----------------------------------------------------
  // DAILY STREAK
  // -----------------------------------------------------

  const dates =
    dailyHistory
      .map(item => {

        const value =
          item.date ||
          item.createdAt;


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
      .filter(Boolean)
      .sort(
        (a, b) => b - a
      );


  const uniqueDays = [];


  dates.forEach(
    date => {

      const key =
        date.toDateString();


      if (
        !uniqueDays.includes(key)
      ) {

        uniqueDays.push(key);

      }

    }
  );


  if (
    uniqueDays.length === 0
  ) {

    if (dailyStreak) {

      dailyStreak.textContent =
        "0 days";

    }

    return;

  }


  // -----------------------------------------------------
  // STREAK
  // -----------------------------------------------------

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
      uniqueDays[0]
    );


  latestDate.setHours(
    0,
    0,
    0,
    0
  );


  const latestIsToday =
    latestDate.getTime() ===
    today.getTime();


  const latestIsYesterday =
    latestDate.getTime() ===
    yesterday.getTime();


  let streak = 0;


  if (
    latestIsToday ||
    latestIsYesterday
  ) {

    streak = 1;


    for (
      let i = 1;
      i < uniqueDays.length;
      i++
    ) {

      const current =
        new Date(
          uniqueDays[i - 1]
        );


      const previous =
        new Date(
          uniqueDays[i]
        );


      current.setHours(
        0,
        0,
        0,
        0
      );


      previous.setHours(
        0,
        0,
        0,
        0
      );


      const difference =
        Math.round(
          (
            current -
            previous
          ) /
          (
            1000 *
            60 *
            60 *
            24
          )
        );


      if (
        difference === 1
      ) {

        streak++;

      } else {

        break;

      }

    }

  }


  if (dailyStreak) {

    dailyStreak.textContent =
      `${streak} ${streak === 1
        ? "day"
        : "days"
      }`;

  }

}


// =====================================================
// RUN DAILY CHALLENGE PROGRESS
// =====================================================

(async function initializeDailyChallengeProgress() {

  await updateDailyChallengeProgress();

})();
