"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.tryData = exports.simplesDispatch = void 0;

var _dispatch2 = _interopRequireDefault(require("./dispatch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var expo = {
  tryData: function tryData(data, model) {
    try {
      return data[model] || data;
    } catch (err) {
      return data;
    }
  },
  simplesDispatch: function simplesDispatch(model, key) {
    var remove = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var data = arguments.length > 3 ? arguments[3] : undefined;
    var overwrite = arguments.length > 4 ? arguments[4] : undefined;
    var store = arguments.length > 5 ? arguments[5] : undefined;
    var _dispatch = {};

    if (model && store) {
      var models = (model || '').split(',').map(function (e) {
        return e.trim();
      });
      key = (key || '').split(',').map(function (e) {
        return e.trim();
      });

      var _remove = [].concat(remove);

      _dispatch = models.reduce(function (obj, model, i) {
        var method = 'post';
        if (key[i]) method = _remove[i] ? 'delete' : 'put';
        if (overwrite) method = 'get';
        obj[model] = (0, _dispatch2["default"])({
          method: method,
          key: key[i],
          model: model,
          data: expo.tryData(data, model),
          store: store
        });
        return obj;
      }, {});
    }

    return _dispatch;
  }
};
var simplesDispatch = expo.simplesDispatch;
exports.simplesDispatch = simplesDispatch;
var tryData = expo.tryData;
exports.tryData = tryData;
var _default = expo;
exports["default"] = _default;