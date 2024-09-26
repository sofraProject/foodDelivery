const express = require("express");
const router = express.Router();
const MenuItemController = require("../controllers/MenuItem.controller");

router.post("/add", MenuItemController.createMenuItem);
router.get("/", MenuItemController.getAllMenuItems);
router.get("/:id", MenuItemController.getMenuItemById);
router.put("/:id", MenuItemController.updateMenuItem);
router.delete("/:id", MenuItemController.deleteMenuItem);

module.exports = router;
