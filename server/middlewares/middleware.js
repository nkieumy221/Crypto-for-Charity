const Web3Token = require("web3-token");

const ADMIN_ADDRESS = "0xffdD3befA24a5f2B68E2BEB42450E3f33706da31";

module.exports = async (req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "missing token" });
  }
  token = token.split(" ")[1];
  try {
    const { address, body } = await Web3Token.verify(token);
    console.log(address);
    if (address.toLowerCase() !== ADMIN_ADDRESS.toLowerCase()) {
      return res.status(401).json({ message: "not permission" });
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "token expired" });
  }
  next();
};
