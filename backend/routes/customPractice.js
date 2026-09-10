const express = require("express");
const router = express.Router();


// ========================================
// SAVE CUSTOM PRACTICE
// POST /api/custom-practice/save
// ========================================

router.post("/save", async (req, res) => {

  const pool = req.app.locals.pool;

  try {

    const {
      userId,
      title,
      text
    } = req.body;


    if (!userId || !title || !text) {

      return res.status(400).json({
        success: false,
        message: "User ID, title and text are required"
      });

    }


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


    const id =
      `custom-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;


    const result = await pool.query(
      `
      INSERT INTO "CustomPractice"
      (
        id,
        "userId",
        title,
        text,
        "createdAt"
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        NOW()
      )
      RETURNING
        id,
        "userId",
        title,
        text,
        "createdAt"
      `,
      [
        id,
        userId,
        title.trim(),
        text.trim()
      ]
    );


    res.json({
      success: true,
      practice: result.rows[0]
    });


  } catch (error) {

    console.error(
      "Save custom practice error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Could not save custom practice"
    });

  }

});


// ========================================
// GET CUSTOM PRACTICES
// GET /api/custom-practice/:userId
// ========================================

router.get("/:userId", async (req, res) => {

  const pool = req.app.locals.pool;

  try {

    const {
      userId
    } = req.params;


    const result = await pool.query(
      `
      SELECT
        id,
        "userId",
        title,
        text,
        "createdAt"
      FROM "CustomPractice"
      WHERE "userId" = $1
      ORDER BY "createdAt" DESC
      `,
      [userId]
    );


    res.json({
      success: true,
      practices: result.rows
    });


  } catch (error) {

    console.error(
      "Get custom practices error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Could not load custom practices"
    });

  }

});


// ========================================
// DELETE CUSTOM PRACTICE
// DELETE /api/custom-practice/:id
// ========================================

router.delete("/:id", async (req, res) => {

  const pool = req.app.locals.pool;

  try {

    const {
      id
    } = req.params;

    const {
      userId
    } = req.body;


    if (!userId) {

      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });

    }


    const result = await pool.query(
      `
      DELETE FROM "CustomPractice"
      WHERE id = $1
        AND "userId" = $2
      RETURNING id
      `,
      [
        id,
        userId
      ]
    );


    if (result.rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Custom practice not found"
      });

    }


    res.json({
      success: true,
      message: "Custom practice deleted"
    });


  } catch (error) {

    console.error(
      "Delete custom practice error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Could not delete custom practice"
    });

  }

});


module.exports = router;