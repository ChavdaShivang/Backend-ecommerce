const router = require("express").Router();
const crypto = require("crypto-js");
const User = require("../models/user");
const Cart = require("../models/cart");

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

// router.post("/logout", verifyTokenAndAuthorization, async (req, res) => {
//   try {
//     const { user, cart } = JSON.parse(req.body.data);

//     if (!user || !cart) {
//       return res.status(400).json({ message: "Invalid data" });
//     }

//     // Ensure the userId is available
//     const userId = user._id;
//     if (!userId) {
//       return res.status(400).json({ message: "User ID is required" });
//     }

//     // Find the user's cart
//     let existingCart = await Cart.findOne({ userId });

//     if (existingCart) {
//       existingCart.products = cart.products.map((product) => ({
//         productId: product._id,
//         quantity: product.quantity,
//       }));
//       await existingCart.save();
//     } else {
//       const newCart = new Cart({
//         userId,
//         products: cart.products.map((product) => ({
//           productId: product._id,
//           quantity: product.quantity,
//         })),
//       });
//       await newCart.save();
//     }

//     res.status(200).json({ message: "Logout successful and data saved" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = crypto.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await User.aggregate([
      {
        $match: { createdAt: { $gte: lastYear } },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
