const { Router } = require("express");
const { auth } = require("../middleware/auth");
const {
  getAccounts,
  deleteAccounts,
  getAccount,
} = require("../controllers/accountController");

const router = Router();

// get list of all accounts
router.get("/", auth, getAccount);
router.get("/all", getAccounts);
// detele all accounts
router.delete("/", deleteAccounts);

module.exports = router;
