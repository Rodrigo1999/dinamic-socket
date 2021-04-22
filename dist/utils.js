"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.tryData = exports.simplesShaper = void 0;

var _shaper2 = _interopRequireDefault(require("./shaper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var expo = {
  tryData: function tryData(data, model) {
    try {
      return data[model] || data;
    } catch (err) {
      return data;
    }
  },
  simplesShaper: function simplesShaper(model, key) {
    var remove = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var data = arguments.length > 3 ? arguments[3] : undefined;
    var overwrite = arguments.length > 4 ? arguments[4] : undefined;
    var store = arguments.length > 5 ? arguments[5] : undefined;
    var _shaper = {};

    if (model && store) {
      var models = (model || '').split(',').map(function (e) {
        return e.trim();
      });
      key = (key || '').split(',').map(function (e) {
        return e.trim();
      });

      var _remove = [].concat(remove);

      _shaper = models.reduce(function (obj, model, i) {
        var method = 'post';
        if (key[i]) method = _remove[i] ? 'delete' : 'put';
        if (overwrite) method = 'get';
        obj[model] = (0, _shaper2["default"])({
          method: method,
          key: key[i],
          model: model,
          data: expo.tryData(data, model),
          store: store
        });
        return obj;
      }, {});
    }

    return _shaper;
  }
};
var simplesShaper = expo.simpleShaper;
exports.simplesShaper = simplesShaper;
var tryData = expo.tryData;
exports.tryData = tryData;
var _default = expo;
exports["default"] = _default;