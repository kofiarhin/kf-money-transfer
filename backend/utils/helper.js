const jwt = require("jsonwebtoken");

const generateAccountNumber = () => {
  const date = Date.now();
  const strDate = date.toString();
  const firstFour = strDate.slice(0, 4);

  // generate random number between 0 and 10000
  const randomNumber = Math.floor(Math.random() * 10000 + 1);
  const strRandom = randomNumber.toString();
  // firstfour + randomNumber
  const strAccount = firstFour + strRandom;

  const accountNumber = parseInt(strAccount);
  return accountNumber;
};

//generate pin
const generatePin = () => {
  const randomNumber = 10000 + Math.floor(Math.random() * 1000 + 1);
  const strRandomNumber = randomNumber.toString().slice(0, 4);

  const pin = parseInt(strRandomNumber);
  return pin;
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

module.exports = {
  generateAccountNumber,
  generatePin,
  generateToken,
};
