"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "io", {
  enumerable: true,
  get: function get() {
    return _socket["default"];
  }
});
exports["default"] = exports.emit = exports.on = exports.create = void 0;

var _socket = _interopRequireDefault(require("socket.io-client"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var expo = {
  create: function create(_ref) {
    var host = _ref.host,
        _ref$namespace = _ref.namespace,
        namespace = _ref$namespace === void 0 ? '' : _ref$namespace,
        options = _ref.options,
        store = _ref.store,
        other = _objectWithoutProperties(_ref, ["host", "namespace", "options", "store"]);

    var o = {};
    return Object.keys(expo).reduce(function (obj, e) {
      o = _objectSpread({
        host: host,
        namespace: namespace,
        options: options,
        store: store,
        $socket: _socket["default"].connect(host + namespace, options)
      }, other);

      if (typeof expo[e] == 'function') {
        obj[e] = expo[e].bind(o);
      }

      if (!obj.socket) {
        obj.socket = o.$socket;
      }

      return obj;
    }, {});
  },
  on: function on(name, model, _key, _remove) {
    var _this = this;

    var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : function () {
      return null;
    };

    if (typeof name != 'string') {
      model = name.model;
      _key = name.key;
      _remove = name.remove;
      callback = name.callback;
      name = name.name;
    }

    if (Object.keys(this.$socket.io._callbacks).find(function (e) {
      return e == '$' + name;
    })) {
      this.$socket.removeListener(name);
    }

    this.$socket.on(name, function (data) {
      var _this$onSuccess, _callback;

      var control = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var key = control.key || _key;
      var remove = control.remove || _remove;
      var overwrite = control.overwrite;
      var returning = {
        type: 'on',
        data: data,
        host: _this.host,
        namespace: _this.namespace,
        options: _this.options,
        dispatch: (0, _utils.simplesDispatch)(model, key, remove, data, overwrite, _this === null || _this === void 0 ? void 0 : _this.store)
      };
      _this === null || _this === void 0 ? void 0 : (_this$onSuccess = _this.onSuccess) === null || _this$onSuccess === void 0 ? void 0 : _this$onSuccess.call(_this, returning);
      (_callback = callback) === null || _callback === void 0 ? void 0 : _callback(returning);
    });
  },
  emit: function emit(name, obj, model, key, remove, overwrite) {
    var _this2 = this;

    if (typeof name != 'string') {
      model = name.model;
      obj = name.body;
      key = name.key;
      remove = name.remove;
      overwrite = name.overwrite;
      name = name.name;
    }

    return new Promise(function (resolve, reject) {
      _this2.$socket.emit(name, obj, function (data, err) {
        if (!err) {
          var _this2$onSuccess;

          var returning = {
            type: 'emit',
            data: data,
            host: _this2.host,
            namespace: _this2.namespace,
            options: _this2.options,
            dispatch: (0, _utils.simplesDispatch)(model, key, remove, data, overwrite, _this2 === null || _this2 === void 0 ? void 0 : _this2.store)
          };
          _this2 === null || _this2 === void 0 ? void 0 : (_this2$onSuccess = _this2.onSuccess) === null || _this2$onSuccess === void 0 ? void 0 : _this2$onSuccess.call(_this2, returning);
          resolve(returning);
        } else {
          reject(err);
        }
      });
    });
  }
};
var create = expo.create;
exports.create = create;
var on = expo.on;
exports.on = on;
var emit = expo.emit;
exports.emit = emit;
var _default = expo;
exports["default"] = _default;