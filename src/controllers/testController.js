const { asyncHandler } = require("../middleware/async");

/**
 * desc         
 * route         
 * access        
 */
exports.testRoute = asyncHandler(async (req, res, next) => {
    res.status(200).json({
        data: [],
        message: "Test Route Called",
      })
  });