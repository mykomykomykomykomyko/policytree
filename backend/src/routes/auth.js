const express = require('express')
const passport = require('passport')
const router = express.Router()

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000')
  }
)

// Microsoft OAuth routes
router.get('/microsoft',
  passport.authenticate('microsoft', { scope: ['user.read'] })
)

router.get('/microsoft/callback',
  passport.authenticate('microsoft', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000')
  }
)

// Get current user
router.get('/user', (req, res) => {
  if (req.user) {
    res.json({
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role
    })
  } else {
    res.status(401).json({ error: 'Not authenticated' })
  }
})

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error logging out' })
    }
    res.json({ message: 'Logged out successfully' })
  })
})

module.exports = router 