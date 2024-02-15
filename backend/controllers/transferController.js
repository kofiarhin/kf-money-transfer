const User = require("../model/userModel");
const Account = require("../model/accountModel");
const Transfer = require("../model/transferModel");

// make transfer
const makeTransfer = async (req, res) => {
  const { accountNumber, amount, name } = req.body;

  const receiver = await Account.findOne({ accountNumber }).populate("user");

  // todo check if name match
  if (!receiver.user.name.toLowerCase() === name.toLowerCase()) {
    return res.status(400).json({ message: "name does not match account" });
  }
  if (!receiver) {
    return res.status(400).json({ message: "account number incorrect" });
  }

  const receiverId = receiver.user._id;
  const sender = await Account.findOne({ user: req.user._id });

  // senderId = req.user._id;

  // check to see if sender has sufficient amount in account
  if (sender.balance < amount) {
    console.log("insufficient amount");
    return res.status(400).json({ message: "insufficient amount" });
  }

  // save changes
  receiver.balance += amount;
  sender.balance -= amount;
  await receiver.save();
  await sender.save();

  console.log({ senderId: req.user._id, receiverId });

  const transfer = new Transfer({
    senderId: req.user._id,
    receiverId,
    amount,
  });

  await transfer.save();

  return res.json(transfer);
};

const deleteTransfers = async (req, res) => {
  await Transfer.deleteMany();
  res.json({ message: "transfers cleared" });
};

const getTransfers = async (req, res) => {
  try {
    const userId = req.user._id;
    const transfers = await Transfer.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .sort({ createdAt: -1 })
      .populate("receiverId")
      .populate("senderId");
    if (!transfers) {
      return res.status(400);
    }
    res.status(200).json(transfers);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};
module.exports = {
  makeTransfer,
  deleteTransfers,
  getTransfers,
};
