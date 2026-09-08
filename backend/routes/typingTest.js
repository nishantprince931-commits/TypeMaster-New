const express = require("express");
const { createId } = require("@paralleldrive/cuid2");

const router = express.Router();

/* ========================================
   CHECK & UNLOCK ACHIEVEMENTS
   TypingTest + Daily Challenge
======================================== */
async function checkAndUnlockAchievements(pool, userId) {

  try {

    /* ------------------------------------
       TYPING TEST STATS
    ------------------------------------ */

    const typingResult = await pool.query(
      `
      SELECT
        COUNT(*)::int AS "totalTests",
        COALESCE(MAX(wpm), 0) AS "bestWpm",
        COALESCE(MAX(accuracy), 0) AS "bestAccuracy"
      FROM "TypingTest"
      WHERE "userId" = $1
      `,
      [userId]
    );

    const typingStats =
      typingResult.rows[0];


    /* ------------------------------------
       DAILY CHALLENGE STATS
    ------------------------------------ */

    const challengeResult = await pool.query(
      `
      SELECT
        COUNT(*) FILTER (
          WHERE completed = true
        )::int AS "completedChallenges",

        COALESCE(MAX(wpm), 0) AS "bestWpm",

        COALESCE(MAX(accuracy), 0) AS "bestAccuracy"

      FROM "ChallengeAttempt"
      WHERE "userId" = $1
      `,
      [userId]
    );

    const challengeStats =
      challengeResult.rows[0];


    /* ------------------------------------
       COMBINED STATS
    ------------------------------------ */

    const totalTests =
      (Number(typingStats.totalTests) || 0) +
      (Number(challengeStats.completedChallenges) || 0);

    const bestWpm =
      Math.max(
        Number(typingStats.bestWpm) || 0,
        Number(challengeStats.bestWpm) || 0
      );

    const bestAccuracy =
      Math.max(
        Number(typingStats.bestAccuracy) || 0,
        Number(challengeStats.bestAccuracy) || 0
      );


    /* ------------------------------------
       USER STREAK
    ------------------------------------ */

    const userResult = await pool.query(
      `
      SELECT streak
      FROM "User"
      WHERE id = $1
      `,
      [userId]
    );

    const streak =
      userResult.rows.length > 0
        ? Number(userResult.rows[0].streak) || 0
        : 0;


    /* ------------------------------------
       CHECK ACHIEVEMENTS
    ------------------------------------ */

    const achievements = [];


    // First Test
    if (totalTests >= 1) {
      achievements.push(
        "achievement-first-test"
      );
    }


    // Speed Demon
    if (bestWpm >= 50) {
      achievements.push(
        "achievement-speed-demon"
      );
    }


    // Accuracy Master
    if (bestAccuracy >= 95) {
      achievements.push(
        "achievement-accuracy-master"
      );
    }


    // On Fire
    if (streak >= 7) {
      achievements.push(
        "achievement-on-fire"
      );
    }


    /* ------------------------------------
       ACHIEVEMENT DETAILS
    ------------------------------------ */

    const achievementDetails = {
      "achievement-first-test": {
        title: "First Test Unlocked! 🚀",
        message: "Congratulations! You completed your first typing test.",
        icon: "🚀"
      },

      "achievement-speed-demon": {
        title: "Speed Demon Unlocked! ⚡",
        message: "Amazing! You reached 50 WPM.",
        icon: "⚡"
      },

      "achievement-accuracy-master": {
        title: "Accuracy Master Unlocked! 🎯",
        message: "Excellent! You reached 95% accuracy.",
        icon: "🎯"
      },

      "achievement-on-fire": {
        title: "On Fire Unlocked! 🔥",
        message: "Amazing! You maintained a 7 day streak.",
        icon: "🔥"
      }
    };


    /* ------------------------------------
       SAVE UNLOCKED ACHIEVEMENTS
       + CREATE NOTIFICATION
    ------------------------------------ */

    for (const achievementId of achievements) {

      const existing =
        await pool.query(
          `
          SELECT id
          FROM "UserAchievement"
          WHERE "userId" = $1
            AND "achievementId" = $2
          `,
          [
            userId,
            achievementId
          ]
        );


      // Already unlocked
      if (existing.rows.length > 0) {
        continue;
      }


      /* ------------------------------------
         SAVE ACHIEVEMENT
      ------------------------------------ */

      await pool.query(
        `
        INSERT INTO "UserAchievement"
        (
          id,
          "userId",
          "achievementId",
          "unlockedAt"
        )
        VALUES
        (
          $1,
          $2,
          $3,
          NOW()
        )
        `,
        [
          createId(),
          userId,
          achievementId
        ]
      );

      /* ------------------------------------
         CREATE NOTIFICATION
      ------------------------------------ */

      const details =
        achievementDetails[achievementId];

      if (details) {

        await pool.query(
          `
          INSERT INTO "Notification"
          (
            id,
            "userId",
            title,
            message,
            icon,
            "isRead",
            "createdAt"
          )
          VALUES
          (
            $1,
            $2,
            $3,
            $4,
            $5,
            false,
            NOW()
          )
          `,
          [
            createId(),
            userId,
            details.title,
            details.message,
            details.icon
          ]
        );
      }

    }

  } catch (error) {

    console.error(
      "Achievement unlock error:",
      error
    );

  }

}
// ========================================
// CREATE PERSONAL BEST NOTIFICATION
// ========================================

async function createPersonalBestNotification(
  pool,
  userId,
  newWpm,
  currentTestId
) {

  try {

    const previousResult = await pool.query(
      `
            SELECT
                COALESCE(MAX(wpm), 0) AS "bestWpm"
            FROM "TypingTest"
            WHERE "userId" = $1
              AND id <> $2
            `,
      [
        userId,
        currentTestId
      ]
    );

    const previousBest =
      Number(previousResult.rows[0].bestWpm) || 0;


    // New personal best
    if (Number(newWpm) > previousBest) {

      await pool.query(
        `
                INSERT INTO "Notification"
                (
                    id,
                    "userId",
                    title,
                    message,
                    icon,
                    "isRead",
                    "createdAt"
                )
                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    false,
                    NOW()
                )
                `,
        [
          createId(),
          userId,
          "New Personal Best!",
          `Amazing! You reached ${Number(newWpm)} WPM.`,
          "🎯"
        ]
      );
    }

  } catch (error) {

    console.error(
      "Personal best notification error:",
      error
    );

  }
}
// =====================================================
// SAVE TYPING TEST
// POST /api/typing-test/save
// =====================================================

router.post("/save", async (req, res) => {

  const pool = req.app.locals.pool;

  try {

    const {
      userId,
      typingTextId,
      typingText,
      testType,
      durationSeconds,
      wpm,
      accuracy,
      correctCharacters,
      wrongCharacters,
      errors,
      practiceSeconds
    } = req.body;


    if (!userId) {

      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });

    }


    // Check user exists
    const userResult = await pool.query(
      'SELECT id FROM "User" WHERE id = $1',
      [userId]
    );


    if (userResult.rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }


    const id = createId();


    const result = await pool.query(

      `INSERT INTO "TypingTest"
  (
    id,
    "userId",
    "typingTextId",
    "typingText",
    "testType",
    "durationSeconds",
    wpm,
    accuracy,
    "correctCharacters",
    "wrongCharacters",
    errors,
    "practiceSeconds",
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
    $9,
    $10,
    $11,
    $12,
    NOW()
  )
  RETURNING *`,

      [
        id,
        userId,
        typingTextId || null,
        typingText || null,
        typedText || null,
        testType || "typing-test",
        Number(durationSeconds) || 0,
        Number(wpm) || 0,
        Number(accuracy) || 0,
        Number(correctCharacters) || 0,
        Number(wrongCharacters) || 0,
        Number(errors) || 0,
        Number(practiceSeconds) || 0
      ]

    );
    await checkAndUnlockAchievements(
      pool,
      userId
    );
    await createPersonalBestNotification(
      pool,
      userId,
      wpm,
      result.rows[0].id
    );

    return res.status(201).json({

      success: true,

      message: "Typing test saved successfully",

      test: result.rows[0]

    });


  } catch (error) {

    console.error(
      "Save typing test error:",
      error
    );


    return res.status(500).json({

      success: false,

      message: "Failed to save typing test"

    });

  }

});


// =====================================================
// GET USER TYPING HISTORY
// GET /api/typing-test/history/:userId
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

      `SELECT
        id,
        "userId",
        "typingTextId",
        "typingText",
        "typedText"
        "testType",
        "durationSeconds",
        wpm,
        accuracy,
        "correctCharacters",
        "wrongCharacters",
        errors,
        "practiceSeconds",
        "createdAt"
      FROM "TypingTest"
      WHERE "userId" = $1
      ORDER BY "createdAt" ASC`,

      [userId]

    );


    return res.json({

      success: true,

      history: result.rows

    });


  } catch (error) {

    console.error(
      "Get typing history error:",
      error
    );


    return res.status(500).json({

      success: false,

      message: "Failed to fetch typing history"

    });

  }

});
// =====================================================
// GET LEADERBOARD
// GET /api/typing-test/leaderboard
// =====================================================

router.get("/leaderboard", async (req, res) => {

  const pool = req.app.locals.pool;

  try {

    const result = await pool.query(
      `
      SELECT
        u.id,
        u.name,
        COALESCE(MAX(t.wpm), 0) AS score
      FROM "User" u
      LEFT JOIN "TypingTest" t
        ON t."userId" = u.id
      GROUP BY u.id, u.name
      ORDER BY score DESC, u.name ASC
      `
    );

    return res.json({
      success: true,
      leaderboard: result.rows
    });

  } catch (error) {

    console.error(
      "Leaderboard error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard"
    });

  }

});
// =====================================================
// GET ACCURACY LEADERBOARD
// GET /api/typing-test/accuracy-leaderboard
// =====================================================

router.get("/accuracy-leaderboard", async (req, res) => {

  const pool = req.app.locals.pool;

  try {

    const result = await pool.query(
      `
      SELECT
        u.id,
        u.name,
        COALESCE(MAX(t.accuracy), 0) AS score
      FROM "User" u
      LEFT JOIN "TypingTest" t
        ON t."userId" = u.id
      GROUP BY u.id, u.name
      ORDER BY score DESC, u.name ASC
      `
    );

    return res.json({
      success: true,
      leaderboard: result.rows
    });

  } catch (error) {

    console.error(
      "Accuracy leaderboard error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch accuracy leaderboard"
    });

  }

});


// =====================================================
// GET DAILY CHALLENGE LEADERBOARD
// GET /api/typing-test/daily-leaderboard
// =====================================================

router.get("/daily-leaderboard", async (req, res) => {

  const pool = req.app.locals.pool;

  try {

    const result = await pool.query(
      `
      SELECT
        u.id,
        u.name,
        COALESCE(MAX(ca.wpm), 0) AS score
      FROM "User" u
      LEFT JOIN "ChallengeAttempt" ca
        ON ca."userId" = u.id
        AND ca.completed = true
      GROUP BY u.id, u.name
      ORDER BY score DESC, u.name ASC
      `
    );

    return res.json({
      success: true,
      leaderboard: result.rows
    });

  } catch (error) {

    console.error(
      "Daily leaderboard error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch daily leaderboard"
    });

  }

});
// =====================================================
// GET USER TYPING STATISTICS
// GET /api/typing-test/stats/:userId
// =====================================================

router.get("/stats/:userId", async (req, res) => {

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

      `SELECT
        COUNT(*)::int AS "totalTests",

        COALESCE(MAX(wpm), 0) AS "bestWpm",

        COALESCE(
          ROUND(AVG(wpm)::numeric, 0),
          0
        ) AS "averageWpm",

        COALESCE(MAX(accuracy), 0) AS "bestAccuracy"

      FROM "TypingTest"

      WHERE "userId" = $1`,

      [userId]

    );


    return res.json({

      success: true,

      stats: result.rows[0]

    });


  } catch (error) {

    console.error(
      "Get typing stats error:",
      error
    );


    return res.status(500).json({

      success: false,

      message: "Failed to fetch typing statistics"

    });

  }

});

// =====================================================
// CLEAR ALL USER DATA
// DELETE /api/typing-test/clear-all/:userId
// =====================================================

router.delete(
  "/clear-all/:userId",
  async (req, res) => {

    const pool = req.app.locals.pool;

    try {

      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required"
        });
      }

      // Delete typing test history
      await pool.query(
        `
        DELETE FROM "TypingTest"
        WHERE "userId" = $1
        `,
        [userId]
      );

      // Delete lesson progress
      await pool.query(
        `
        DELETE FROM "LessonProgress"
        WHERE "userId" = $1
        `,
        [userId]
      );

      // Delete daily challenge attempts
      await pool.query(
        `
        DELETE FROM "ChallengeAttempt"
        WHERE "userId" = $1
        `,
        [userId]
      );

      // Delete unlocked achievements
      await pool.query(
        `
        DELETE FROM "UserAchievement"
        WHERE "userId" = $1
        `,
        [userId]
      );

      // Delete notifications
      await pool.query(
        `
        DELETE FROM "Notification"
        WHERE "userId" = $1
        `,
        [userId]
      );

      // Reset user statistics
      await pool.query(
        `
        UPDATE "User"
        SET
          streak = 0,
          "bestWpm" = 0,
          "averageWpm" = 0,
          "averageAccuracy" = 0,
          xp = 0,
          level = 1,
          "updatedAt" = NOW()
        WHERE id = $1
        `,
        [userId]
      );

      return res.json({
        success: true,
        message: "All user data cleared successfully"
      });

    } catch (error) {

      console.error(
        "Clear all user data error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to clear all user data"
      });

    }

  }
);

module.exports = router;
// =====================================================
// CLEAR USER TYPING HISTORY
// DELETE /api/typing-test/history/:userId
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
            DELETE FROM "TypingTest"
            WHERE "userId" = $1
            `,
      [userId]
    );

    return res.json({
      success: true,
      message: "Typing test history cleared successfully",
      deletedCount: result.rowCount
    });

  } catch (error) {

    console.error(
      "Clear typing history error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to clear typing history"
    });

  }

});