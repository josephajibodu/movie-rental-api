// Modules for handling errors generally for the routes
// Can only handle routes that uses the async and await 
// Then and catch is not supported
module.exports = function(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res)
    } catch (err) {
      next(err)
    }
  }
}