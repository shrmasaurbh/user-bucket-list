var express = require("express");
var authRoutes = require("./auth.routes");
var userRoutes = require("./user.routes");

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

module.exports = router;