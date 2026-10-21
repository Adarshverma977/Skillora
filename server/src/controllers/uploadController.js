const imageKit = require("../config/imageKit");

const getImageKitAuth = (req, res) => {
  const authenticationParameters = imageKit.getAuthenticationParameters();

  res.status(200).json({
    success: true,
    data: authenticationParameters,
  });
};

module.exports = { getImageKitAuth };
