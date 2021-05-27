const express = require("express");
// import controller
const userController = require("../controllers/userController");

// ini router
const router = express.Router();

// @route       POST api/users
// @access      Public (no auth needed)
// @desc        add User 
router.post("/", userController.addUser);

// @route       PUT api/users/:id
// @access      Public (no auth needed)
// @desc        update User 
router.put("/:id", userController.updUser);

// @route       DELETE api/users/:id
// @access      Public (no auth needed)
// @desc        remove User 
router.delete("/:id", userController.remUser);

// @route       GET api/users
// @access      Public (no auth needed)
// @desc        get Users list
router.get("/:skip&:limit", userController.getUsers);

module.exports = router;