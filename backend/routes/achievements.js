const express = require("express");
const router = express.Router();

/* ========================================
   GET ALL ACHIEVEMENTS FOR USER
======================================== */

router.get("/:userId", async (req, res) => {
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
        a.id,
        a.title,
        a.description,
        a.icon,
        a.type,
        a.target,
        a."xpReward",
        ua."unlockedAt",
        CASE
          WHEN ua.id IS NOT NULL THEN true
          ELSE false
        END AS unlocked
      FROM "Achievement" a
      LEFT JOIN "UserAchievement" ua
        ON ua."achievementId" = a.id
        AND ua."userId" = $1
      ORDER BY a."createdAt" ASC
      `,
      [userId]
    );

    return res.json({
      success: true,
      achievements: result.rows
    });

  } catch (error) {

    console.error(
      "Get achievements error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch achievements"
    });
  }
});


/* ========================================
   EXPORT
======================================== */

module.exports = router;