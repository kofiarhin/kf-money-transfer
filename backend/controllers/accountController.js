// get list of all accounts
const Account = require("../model/accountModel");
const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find().populate("user");
    res.status(200).json(accounts);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: "internal server error" });
  }
};

const deleteAccounts = async (req, res) => {
  await Account.deleteMany();
  res.json({ message: "account cleared" });
};

const getAccount = async (req, res) => {
  const account = await Account.findOne({ user: req.user._id });
  return res.status(200).json(account);
};

module.exports = {
  getAccounts,
  deleteAccounts,
  getAccount,
};
