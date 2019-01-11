/**
 * `EsiError` error.
 *
 * @constructor
 * @param {string} [message]
 * @param {string} [code]
 * @access public
 */
function EsiError(message, code) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'EsiError';
  this.message = message;
  this.code = code;
}

// Inherit from `Error`.
EsiError.prototype.__proto__ = Error.prototype;


// Expose constructor.
module.exports = EsiError;
