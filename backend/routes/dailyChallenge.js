const express = require("express");
const { createId } = require("@paralleldrive/cuid2");

const router = express.Router();
// =====================================================
// UPDATE USER STREAK IN POSTGRESQL
// =====================================================

async function updateUserStreak(pool, userId) {

  try {

    const result = await pool.query(
      `
      SELECT DISTINCT
        DATE(dc.date) AS challenge_date
      FROM "ChallengeAttempt" ca
      JOIN "DailyChallenge" dc
        ON dc.id = ca."challengeId"
      WHERE ca."userId" = $1
        AND ca.completed = true
      ORDER BY challenge_date DESC
      `,
      [userId]
    );


    const dates =
      result.rows.map(
        row => {

          const date =
            new Date(
              row.challenge_date
            );

          date.setHours(
            0,
            0,
            0,
            0
          );

          return date;

        }
      );


    if (dates.length === 0) {

      await pool.query(
        `
        UPDATE "User"
        SET streak = 0,
            "updatedAt" = NOW()
        WHERE id = $1
        `,
        [userId]
      );

      return 0;

    }


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
      dates[0];


    const latestIsToday =
      latestDate.getTime() ===
      today.getTime();


    const latestIsYesterday =
      latestDate.getTime() ===
      yesterday.getTime();


    // If latest completed challenge
    // is older than yesterday,
    // current streak is 0.
    if (
      !latestIsToday &&
      !latestIsYesterday
    ) {

      await pool.query(
        `
        UPDATE "User"
        SET streak = 0,
            "updatedAt" = NOW()
        WHERE id = $1
        `,
        [userId]
      );

      return 0;

    }


    let streak = 1;


    for (
      let i = 1;
      i < dates.length;
      i++
    ) {

      const current =
        dates[i - 1];


      const previous =
        dates[i];


      const difference =
        Math.round(
          (
            current.getTime() -
            previous.getTime()
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


    await pool.query(
      `
      UPDATE "User"
      SET streak = $1,
          "updatedAt" = NOW()
      WHERE id = $2
      `,
      [
        streak,
        userId
      ]
    );

    return streak;

  } catch (error) {

    console.error(
      "Update user streak error:",
      error
    );

    return 0;

  }

}

// =====================================================
// GET TODAY'S DAILY CHALLENGE
// =====================================================

router.get("/today", async (req, res) => {
  const pool = req.app.locals.pool;

  try {

    // Check if today's challenge already exists
    let result = await pool.query(
      `
      SELECT
        id,
        date,
        title,
        content,
        "durationSeconds",
        "targetWpm",
        "targetAccuracy",
        "xpReward",
        "createdAt"
      FROM "DailyChallenge"
      WHERE DATE(date) = CURRENT_DATE
      ORDER BY "createdAt" DESC
      LIMIT 1
      `
    );


    // If today's challenge does not exist,
    // create it automatically.
    if (result.rows.length === 0) {

      const challenges = [
        "Practice makes progress. Type carefully, keep your fingers relaxed, and focus on accuracy before speed.",

        "Good typing comes from consistent practice. Keep your eyes on the screen and let your fingers learn the correct movement.",

        "The fastest typists are not rushing. They build speed by developing accurate and comfortable typing habits.",

        "Stay relaxed while typing. Use the correct fingers, keep a steady rhythm, and avoid looking down at the keyboard.",

        "Every mistake is a chance to improve. Slow down when necessary and focus on building clean and accurate typing.",

        "Small improvements every day can make a big difference. Practice regularly and your typing speed will naturally grow.",

        "Keep your hands in the correct position and maintain a smooth rhythm. Accuracy and consistency are the keys to better typing."
      ];


      const today = new Date();

      const dateKey =
        `${today.getFullYear()}-${String(
          today.getMonth() + 1
        ).padStart(2, "0")}-${String(
          today.getDate()
        ).padStart(2, "0")}`;


      // Same daily text for the whole day
      let hash = 0;

      for (let i = 0; i < dateKey.length; i++) {
        hash =
          ((hash << 5) - hash) +
          dateKey.charCodeAt(i);

        hash |= 0;
      }

      const index =
        Math.abs(hash) % challenges.length;


      const challengeId = createId();


      await pool.query(
        `
        INSERT INTO "DailyChallenge"
        (
          id,
          date,
          title,
          content,
          "durationSeconds",
          "targetWpm",
          "targetAccuracy",
          "xpReward",
          "createdAt"
        )
        VALUES
        (
          $1,
          CURRENT_DATE,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          NOW()
        )
        `,
        [
          challengeId,
          "Daily Typing Challenge",
          challenges[index],
          60,
          50,
          95,
          50
        ]
      );


      // Fetch newly created challenge
      result = await pool.query(
        `
        SELECT
          id,
          date,
          title,
          content,
          "durationSeconds",
          "targetWpm",
          "targetAccuracy",
          "xpReward",
          "createdAt"
        FROM "DailyChallenge"
        WHERE id = $1
        `,
        [challengeId]
      );
    }


    return res.json({
      success: true,
      challenge: result.rows[0]
    });

  } catch (error) {

    console.error(
      "Get daily challenge error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch daily challenge"
    });
  }
});


// =====================================================
// SAVE DAILY CHALLENGE ATTEMPT
// =====================================================

router.post("/attempt", async (req, res) => {
  const pool = req.app.locals.pool;

  try {

    const {
      userId,
      challengeId,
      wpm,
      accuracy,
      errors,
      completed
    } = req.body;


    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }


    if (!challengeId) {
      return res.status(400).json({
        success: false,
        message: "Challenge ID is required"
      });
    }


    // Check user
    const userResult = await pool.query(
      `
      SELECT id
      FROM "User"
      WHERE id = $1
      `,
      [userId]
    );


    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }


    // Get challenge
    const challengeResult = await pool.query(
      `
      SELECT
        id,
        "xpReward"
      FROM "DailyChallenge"
      WHERE id = $1
      `,
      [challengeId]
    );


    if (challengeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Daily challenge not found"
      });
    }


    const challenge =
      challengeResult.rows[0];


    const isCompleted =
      completed === true ||
      completed === "true";


    const xpAwarded =
      isCompleted
        ? Number(challenge.xpReward) || 0
        : 0;


    const attemptId = createId();


    const result = await pool.query(
      `
  INSERT INTO "ChallengeAttempt"
  (
    id,
    "userId",
    "challengeId",
    wpm,
    accuracy,
    errors,
    completed,
    "xpAwarded",
    "createdAt"
  )
  VALUES
  (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    NOW()
  )

  ON CONFLICT ("userId", "challengeId")
  DO UPDATE SET
    wpm = EXCLUDED.wpm,
    accuracy = EXCLUDED.accuracy,
    errors = EXCLUDED.errors,
    completed = EXCLUDED.completed,
    "xpAwarded" = EXCLUDED."xpAwarded"

  RETURNING *
  `,
      [
        attemptId,
        userId,
        challengeId,
        Number(wpm) || 0,
        Number(accuracy) || 0,
        Number(errors) || 0,
        isCompleted,
        xpAwarded
      ]
    );


    // =====================================================
    // UPDATE USER STREAK
    // =====================================================

    const currentStreak =
      await updateUserStreak(
        pool,
        userId
      );


    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(201).json({
      success: true,
      message: "Daily challenge attempt saved successfully",
      attempt: result.rows[0],
      streak: currentStreak
    });

  } catch (error) {

    console.error(
      "Save daily challenge attempt error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to save daily challenge attempt"
    });
  }
});


// =====================================================
// GET USER DAILY CHALLENGE HISTORY
// =====================================================

router.get("/history/:userId", async (req, res) => {
  const pool = req.app.locals.pool;

  try {

    const { userId } = req.params;


    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }


    const result = await pool.query(
      `
      SELECT
        ca.id,
        ca."userId",
        ca."challengeId",
        ca.wpm,
        ca.accuracy,
        ca.errors,
        ca.completed,
        ca."xpAwarded",
        ca."createdAt",
        dc.date,
        dc.title
      FROM "ChallengeAttempt" ca
      JOIN "DailyChallenge" dc
        ON dc.id = ca."challengeId"
      WHERE ca."userId" = $1
      ORDER BY ca."createdAt" DESC
      `,
      [userId]
    );


    return res.json({
      success: true,
      history: result.rows
    });

  } catch (error) {

    console.error(
      "Get daily challenge history error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch daily challenge history"
    });
  }
});

// =====================================================
// CLEAR USER DAILY CHALLENGE HISTORY
// =====================================================

router.delete("/history/:userId", async (req, res) => {
  const pool = req.app.locals.pool;

  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const result = await pool.query(
      `
      DELETE FROM "ChallengeAttempt"
      WHERE "userId" = $1
      `,
      [userId]
    );
    await pool.query(
      `
  UPDATE "User"
  SET streak = 0,
      "updatedAt" = NOW()
  WHERE id = $1
  `,
      [userId]
    );
    return res.json({
      success: true,
      message: "Daily Challenge history cleared successfully",
      deletedCount: result.rowCount
    });

  } catch (error) {
    console.error(
      "Clear daily challenge history error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to clear Daily Challenge history"
    });
  }
});
module.exports = router;