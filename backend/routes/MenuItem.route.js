const express = require("express");
const router = express.Router();
const MenuItemController = require("../controllers/MenuItem.controller");

router.post("/add", MenuItemController.createMenuItem);
router.get("/", MenuItemController.getAllMenuItems);
router.get("/:id", MenuItemController.getMenuItemById);
router.put("/:id", MenuItemController.updateMenuItem);
router.delete("/:id", MenuItemController.deleteMenuItem);
router.get("/name", MenuItemController.getMenuItemsByName);
router.get("/cat/:category_id", MenuItemController.getMenuItemsByCategory);
module.exports = router;
