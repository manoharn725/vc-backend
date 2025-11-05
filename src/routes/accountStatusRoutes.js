const express = require("express");
const router = express.Router();
const { getAccountStatuses, getAccountStatus, addAccountStatus, updateAccountStatus, deleteAccountStatus } = require("../controllers/accountStatusController");

router.get("/", getAccountStatuses);
router.get("/:id", getAccountStatus);
router.post("/", addAccountStatus);
router.put("/:id", updateAccountStatus);
router.delete("/:id", deleteAccountStatus);

module.exports = router;
