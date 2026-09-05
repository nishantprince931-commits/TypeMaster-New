const express = require("express");
const { createId } = require("@paralleldrive/cuid2");

const router = express.Router();


// ========================================
// GET USER NOTIFICATIONS
// ========================================

router.get("/:userId", async (req, res) => {

  const pool = req.app.locals.pool;

  try {

    const { userId } = req.params;

    const result = await pool.query(
      `SELECT
        id,
        "userId",
        title,
        message,
        icon,
        "isRead",
        "createdAt"
       FROM "Notification"
       WHERE "userId" = $1
       ORDER BY "createdAt" DESC`,
      [userId]
    );

    res.json({
      success: true,
      notifications: result.rows
    });

  } catch (error) {

    console.error(
      "Get notifications error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load notifications"
    });

  }

});


// ========================================
// CREATE NOTIFICATION
// ========================================

router.post("/", async (req, res) => {

  const pool = req.app.locals.pool;

  try {

    const {
      userId,
      title,
      message,
      icon
    } = req.body;

    if (!userId || !title || !message) {

      return res.status(400).json({
        success: false,
        message: "userId, title and message are required"
      });

    }

    const id = createId();

    const result = await pool.query(
      `INSERT INTO "Notification"
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
      ($1, $2, $3, $4, $5, false, NOW())
      RETURNING
        id,
        "userId",
        title,
        message,
        icon,
        "isRead",
        "createdAt"`,
      [
        id,
        userId,
        title,
        message,
        icon || "🔔"
      ]
    );

    res.status(201).json({
      success: true,
      notification: result.rows[0]
    });

  } catch (error) {

    console.error(
      "Create notification error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create notification"
    });

  }

});
// =====================================================
// DELETE ALL USER NOTIFICATIONS
// =====================================================

router.delete("/:userId", async (req, res) => {

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
            DELETE FROM "Notification"
            WHERE "userId" = $1
            `,
            [userId]
        );

        return res.json({
            success: true,
            message: "All notifications deleted successfully",
            deletedCount: result.rowCount
        });

    } catch (error) {

        console.error(
            "Delete notifications error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to delete notifications"
        });

    }

});
module.exports = router;