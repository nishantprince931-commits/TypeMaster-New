const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { createId } = require("@paralleldrive/cuid2");

const router = express.Router();
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
/* ========================================
   REGISTER
======================================== */

router.post("/register", async (req, res) => {
  const pool = req.app.locals.pool;

  try {
    const {
      name,
      email,
      password,
      country
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    const existingUser = await pool.query(
      'SELECT id FROM "User" WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    const passwordHash = await bcrypt.hash(
      password,
      12
    );

    const id = createId();

    const result = await pool.query(
      `INSERT INTO "User"
      (
        id,
        name,
        email,
        "passwordHash",
        avatar,
        country,
        role,
        level,
        xp,
        streak,
        "bestWpm",
        "averageWpm",
        "averageAccuracy",
        "createdAt",
        "updatedAt"
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        NULL,
        $5,
        'USER',
        1,
        0,
        0,
        0,
        0,
        0,
        NOW(),
        NOW()
      )
      RETURNING
        id,
        name,
        email,
        avatar,
        country,
        role,
        level,
        xp,
        streak,
        "bestWpm",
        "averageWpm",
        "averageAccuracy",
        "createdAt",
        "updatedAt"`,
      [
        id,
        name,
        email,
        passwordHash,
        country || "India"
      ]
    );

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: result.rows[0]
    });

  } catch (error) {

    console.error(
      "Register error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Registration failed"
    });
  }
});


/* ========================================
   LOGIN
======================================== */

router.post("/login", async (req, res) => {
  const pool = req.app.locals.pool;

  try {

    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const result = await pool.query(
      'SELECT * FROM "User" WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const user = result.rows[0];

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.passwordHash
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    delete user.passwordHash;

    res.json({
      success: true,
      message: "Login successful",
      user
    });

  } catch (error) {

    console.error(
      "Login error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
});


/* ========================================
   FORGOT PASSWORD
======================================== */

router.post(
  "/forgot-password",
  async (req, res) => {

    const pool = req.app.locals.pool;

    try {

      const {
        email
      } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required"
        });
      }

      const userResult = await pool.query(
        'SELECT id, email FROM "User" WHERE email = $1',
        [email]
      );

      /*
        Security:
        Do not reveal whether an email exists.
      */

      if (userResult.rows.length === 0) {
        return res.json({
          success: true,
          message:
            "If this email exists, a reset request has been created."
        });
      }

      const user =
        userResult.rows[0];

      /*
        Remove old reset tokens
        for this user.
      */

      await pool.query(
        `DELETE FROM "PasswordResetToken"
         WHERE "userId" = $1`,
        [user.id]
      );

      /*
        Create secure random token.
      */

      const token =
        crypto.randomBytes(32).toString("hex");

      const tokenId =
        createId();

      /*
        Token expires in 15 minutes.
      */

      const expiresAt =
        new Date(
          Date.now() + 15 * 60 * 1000
        );

      await pool.query(
        `INSERT INTO "PasswordResetToken"
  (
    id,
    "userId",
    token,
    "tokenHash",
    "expiresAt",
    "createdAt"
  )
  VALUES
  ($1, $2, $3, $3, $4, NOW())`,
        [
          tokenId,
          user.id,
          token,
          expiresAt
        ]
      );

      /*
        Development mode:
        Return token so we can test locally.

        Later we can send this token
        through email.
      */

      const resetLink =
        `http://127.0.0.1:5500/frontend/reset-password.html?token=${encodeURIComponent(token)}`;

      await transporter.sendMail({
        from: `"TypeMaster" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "TypeMaster - Reset Your Password",
        html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2>TypeMaster Password Reset</h2>

      <p>You requested to reset your TypeMaster password.</p>

      <p>Click the button below to create a new password:</p>

      <p>
        <a
          href="${resetLink}"
          style="
            display: inline-block;
            padding: 12px 20px;
            background: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 8px;
          "
        >
          Reset Password
        </a>
      </p>

      <p>This link will expire in 15 minutes.</p>

      <p>If you did not request this password reset, you can ignore this email.</p>

      <p>— TypeMaster Team</p>
    </div>
  `
      });

      res.json({
        success: true,
        message: "Password reset link has been sent to your email."
      });

    } catch (error) {

      console.error(
        "Forgot password error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Could not create password reset request"
      });
    }
  }
);


/* ========================================
   RESET PASSWORD
======================================== */

router.post(
  "/reset-password",
  async (req, res) => {

    const pool = req.app.locals.pool;

    try {

      const {
        token,
        newPassword
      } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          message:
            "Reset token and new password are required"
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message:
            "Password must be at least 6 characters"
        });
      }

      /*
        Find token.
      */

      const tokenResult =
        await pool.query(
          `SELECT *
           FROM "PasswordResetToken"
           WHERE token = $1`,
          [token]
        );

      if (tokenResult.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid or expired reset token"
        });
      }

      const resetToken =
        tokenResult.rows[0];

      /*
        Check expiration.
      */

      if (
        new Date(resetToken.expiresAt)
        <= new Date()
      ) {

        await pool.query(
          `DELETE FROM "PasswordResetToken"
           WHERE id = $1`,
          [resetToken.id]
        );

        return res.status(400).json({
          success: false,
          message:
            "Reset token has expired"
        });
      }

      /*
        Hash new password.
      */

      const passwordHash =
        await bcrypt.hash(
          newPassword,
          12
        );

      /*
        Update user password.
      */

      await pool.query(
        `UPDATE "User"
         SET
           "passwordHash" = $1,
           "updatedAt" = NOW()
         WHERE id = $2`,
        [
          passwordHash,
          resetToken.userId
        ]
      );

      /*
        Delete used token.
      */

      await pool.query(
        `DELETE FROM "PasswordResetToken"
         WHERE id = $1`,
        [resetToken.id]
      );

      res.json({
        success: true,
        message:
          "Password reset successfully"
      });

    } catch (error) {

      console.error(
        "Reset password error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Could not reset password"
      });
    }
  }
);
/* ========================================
   GET PROFILE
======================================== */

router.get(
  "/profile/:userId",
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

      const result =
        await pool.query(
          `
          SELECT
            id,
            name,
            email,
            description,
            avatar,
            country,
            role,
            level,
            xp,
            streak,
            "bestWpm",
            "averageWpm",
            "averageAccuracy",
            "createdAt",
            "updatedAt"
          FROM "User"
          WHERE id = $1
          `,
          [userId]
        );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      return res.json({
        success: true,
        user: result.rows[0]
      });

    } catch (error) {

      console.error(
        "Get profile error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Could not load profile"
      });

    }
  }
);
/* ========================================
   UPDATE PROFILE
======================================== */

router.put(
  "/profile/:userId",
  async (req, res) => {

    const pool = req.app.locals.pool;

    try {

      const {
        name,
        description
      } = req.body;

      const {
        userId
      } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required"
        });
      }

      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name is required"
        });
      }

      const result =
        await pool.query(
          `
          UPDATE "User"
          SET
            name = $1,
            description = $2,
            "updatedAt" = NOW()
          WHERE id = $3
          RETURNING
            id,
            name,
            email,
            description,
            avatar,
            country,
            role,
            level,
            xp,
            streak,
            "bestWpm",
            "averageWpm",
            "averageAccuracy",
            "createdAt",
            "updatedAt"
          `,
          [
            name.trim(),
            description?.trim() ||
            "Typing enthusiast",
            userId
          ]
        );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      return res.json({
        success: true,
        message: "Profile updated successfully",
        user: result.rows[0]
      });

    } catch (error) {

      console.error(
        "Update profile error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Profile update failed"
      });

    }
  }
);

/* ========================================
   EXPORT
======================================== */

// ========================================
// GET USER SETTINGS
// ========================================

router.get(
  "/settings/:userId",
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
          id,
          settings
        FROM "User"
        WHERE id = $1
        `,
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      return res.json({
        success: true,
        settings: result.rows[0].settings || {}
      });

    } catch (error) {

      console.error(
        "Get user settings error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Could not load settings"
      });

    }

  }
);


// ========================================
// SAVE USER SETTINGS
// ========================================

router.put(
  "/settings/:userId",
  async (req, res) => {

    const pool = req.app.locals.pool;

    try {

      const { userId } = req.params;
      const settings = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required"
        });
      }

      if (
        !settings ||
        typeof settings !== "object" ||
        Array.isArray(settings)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid settings data"
        });
      }

      const result = await pool.query(
        `
        UPDATE "User"
        SET
          settings = $1::jsonb,
          "updatedAt" = NOW()
        WHERE id = $2
        RETURNING id, settings
        `,
        [
          JSON.stringify(settings),
          userId
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      return res.json({
        success: true,
        message: "Settings saved successfully",
        settings: result.rows[0].settings
      });

    } catch (error) {

      console.error(
        "Save user settings error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Could not save settings"
      });

    }

  }
);

module.exports = router;