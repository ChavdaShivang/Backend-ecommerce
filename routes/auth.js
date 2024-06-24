const router = require("express").Router();
const crypto = require("crypto-js");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
	const newUser = new User({
		username: req.body.username,
		email: req.body.email,
		password: crypto.AES.encrypt(
			req.body.password,
			process.env.PASS_SEC
		).toString(),
	});

	try {
		const savedUser = await newUser.save();
		res.status(201).json(savedUser);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.post("/login", async (req, res) => {
	const user = await User.findOne({ username: req.body.username });

	if (!user) {
		return res.status(401).json("Wrong username!");
	}

	const hashedPassword = crypto.AES.decrypt(
		user.password,
		process.env.PASS_SEC
	);
	const originalPassword = hashedPassword.toString(crypto.enc.Utf8);

	if (originalPassword !== req.body.password) {
		return res.status(401).json("Wrong password!");
	}

	const accessToken = jwt.sign(
		{
			id: user._id,
			isAdmin: user.isAdmin,
		},
		process.env.JWT_SEC,
		{
			expiresIn: "1d",
		}
	);
	const { password, ...others } = user._doc;
	return res.status(200).json({ ...others, accessToken });
});

module.exports = router;
