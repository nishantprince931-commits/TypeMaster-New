const express = require("express");
const { createId } = require("@paralleldrive/cuid2");

const router = express.Router();


// =====================================================
// GET ALL LESSONS
// =====================================================

router.get("/", async (req, res) => {

    const pool = req.app.locals.pool;

    try {

        const result = await pool.query(
            `
      SELECT
        id,
        title,
        subtitle,
        description,
        content,
        difficulty,
        "order",
        locked,
        "createdAt",
        "updatedAt"
      FROM "Lesson"
      ORDER BY "order" ASC, "createdAt" ASC
      `
        );

        return res.json({
            success: true,
            lessons: result.rows
        });

    } catch (error) {

        console.error(
            "Get lessons error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch lessons"
        });

    }

});
// =====================================================
// GET USER LESSON PROGRESS
// =====================================================

router.get(
    "/progress/:userId",
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


            const result = await pool.query(
                `
SELECT
  lp.id,
  lp."userId",
  lp."lessonId",
  l."order" AS "lessonNumber",
  lp.progress,
  lp."bestWpm",
  lp.accuracy,
  lp.completed,
  lp."completedAt"
FROM "LessonProgress" lp
JOIN "Lesson" l
  ON l.id = lp."lessonId"
WHERE lp."userId" = $1
ORDER BY l."order" ASC
        `,
                [userId]
            );


            return res.json({
                success: true,
                progress: result.rows
            });

        } catch (error) {

            console.error(
                "Get lesson progress error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to fetch lesson progress"
            });

        }

    }
);
// =====================================================
// GET SINGLE LESSON
// =====================================================

router.get("/:lessonId", async (req, res) => {

    const pool = req.app.locals.pool;

    try {

        const { lessonId } = req.params;

        if (!lessonId) {

            return res.status(400).json({
                success: false,
                message: "Lesson ID is required"
            });

        }


        const result = await pool.query(
            `
      SELECT
        id,
        title,
        subtitle,
        description,
        content,
        difficulty,
        "order",
        locked,
        "createdAt",
        "updatedAt"
      FROM "Lesson"
      WHERE id = $1
      `,
            [lessonId]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Lesson not found"
            });

        }


        return res.json({
            success: true,
            lesson: result.rows[0]
        });

    } catch (error) {

        console.error(
            "Get single lesson error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch lesson"
        });

    }

});

// =====================================================
// SAVE / UPDATE USER LESSON PROGRESS
// =====================================================

router.post(
    "/progress",
    async (req, res) => {

        const pool = req.app.locals.pool;

        try {

            const {
                userId,
                lessonId,
                progress,
                bestWpm,
                accuracy,
                completed
            } = req.body;


            // -------------------------------------------------
            // VALIDATION
            // -------------------------------------------------

            if (!userId) {

                return res.status(400).json({
                    success: false,
                    message: "User ID is required"
                });

            }


            if (!lessonId) {

                return res.status(400).json({
                    success: false,
                    message: "Lesson ID is required"
                });

            }


            // -------------------------------------------------
            // CHECK USER
            // -------------------------------------------------

            const userResult =
                await pool.query(
                    `
          SELECT id
          FROM "User"
          WHERE id = $1
          `,
                    [userId]
                );


            if (
                userResult.rows.length === 0
            ) {

                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });

            }


            // -------------------------------------------------
            // CHECK LESSON
            // -------------------------------------------------

            const lessonResult =
                await pool.query(
                    `
                     SELECT id
                     FROM "Lesson"
                     WHERE "order" = $1
                     `,
                    [lessonId]
                );

            if (
                lessonResult.rows.length === 0
            ) {

                return res.status(404).json({
                    success: false,
                    message: "Lesson not found"
                });

            }


            const progressValue =
                Math.max(
                    0,
                    Math.min(
                        100,
                        Number(progress) || 0
                    )
                );


            const bestWpmValue =
                Number(bestWpm) || 0;


            const accuracyValue =
                Math.max(
                    0,
                    Math.min(
                        100,
                        Number(accuracy) || 0
                    )
                );


            const completedValue =
                completed === true ||
                completed === "true";


            // -------------------------------------------------
            // INSERT OR UPDATE
            // -------------------------------------------------

            const id =
                createId();


            const result =
                await pool.query(
                    `
          INSERT INTO "LessonProgress"
          (
            id,
            "userId",
            "lessonId",
            progress,
            "bestWpm",
            accuracy,
            completed,
            "completedAt"
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
            $8
          )

          ON CONFLICT ("userId", "lessonId")
          DO UPDATE SET
            progress = EXCLUDED.progress,
            "bestWpm" = GREATEST(
              "LessonProgress"."bestWpm",
              EXCLUDED."bestWpm"
            ),
            accuracy = GREATEST(
              "LessonProgress".accuracy,
              EXCLUDED.accuracy
            ),
            completed = EXCLUDED.completed,
            "completedAt" = EXCLUDED."completedAt"

          RETURNING *
          `,
                    [
                        id,
                        userId,
                        lessonResult.rows[0].id,
                        progressValue,
                        bestWpmValue,
                        accuracyValue,
                        completedValue,
                        completedValue
                            ? new Date()
                            : null
                    ]
                );


            return res.status(200).json({
                success: true,
                message: "Lesson progress saved successfully",
                progress: result.rows[0]
            });

        } catch (error) {

            console.error(
                "Save lesson progress error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to save lesson progress"
            });

        }

    }
);

// =====================================================
// DELETE / RESET USER LESSON PROGRESS
// =====================================================

router.delete(
    "/progress/:userId",
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

            await pool.query(
                `
                DELETE FROM "LessonProgress"
                WHERE "userId" = $1
                `,
                [userId]
            );

            return res.json({
                success: true,
                message: "Lesson progress reset successfully"
            });

        } catch (error) {

            console.error(
                "Reset lesson progress error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to reset lesson progress"
            });

        }

    }
);

module.exports = router;