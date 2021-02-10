"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var _react = _interopRequireWildcard(require("react"));

var _socket = _interopRequireDefault(require("socket.io-client"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
        socket: (other.io || _socket["default"]).connect(host + namespace, options)
      }, other);

      if (typeof expo[e] == 'function') {
        obj[e] = expo[e].bind(o);
      }

      if (!obj.socket) {
        obj.socket = o.socket;
      }

      return obj;
    }, {});
  },
  on: function on(name, model, _key, _remove) {
    var _this$onStart,
        _this2 = this;

    var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : function () {
      return null;
    };
    var $callback = arguments.length > 5 ? arguments[5] : undefined;

    if (typeof name != 'string') {
      model = name.model;
      _key = name.key;
      _remove = name.remove;
      callback = name.callback;
      name = name.name;
    }

    if ([true, undefined].includes(this === null || this === void 0 ? void 0 : this.removeListener) || $callback != undefined) {
      var _this$socket;

      if (Object.keys(((_this$socket = this.socket) === null || _this$socket === void 0 ? void 0 : _this$socket._callbacks) || {}).find(function (e) {
        return e == '$' + name;
      })) {
        this.socket.removeListener(name);
      }
    }

    var host = this.host,
        namespace = this.namespace,
        options = this.options,
        store = this.store;

    var _this = this;

    this === null || this === void 0 ? void 0 : (_this$onStart = this.onStart) === null || _this$onStart === void 0 ? void 0 : _this$onStart.call(this, {
      host: host,
      namespace: namespace,
      options: options,
      isHook: $callback != undefined,
      type: 'on',
      socket: this.socket,
      name: name,
      model: model,
      key: _key,
      remove: _remove
    });

    function listen(data) {
      var _this$onSuccess, _callback;

      var control = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var key = control.key || _key;
      var remove = control.remove || _remove;
      var overwrite = control.overwrite;
      var returning = {
        type: 'on',
        data: data,
        host: host,
        namespace: namespace,
        options: options,
        name: name,
        model: model,
        key: _key,
        remove: _remove,
        dispatch: (0, _utils.simplesDispatch)(model, key, remove, data, overwrite, store)
      };
      _this === null || _this === void 0 ? void 0 : (_this$onSuccess = _this.onSuccess) === null || _this$onSuccess === void 0 ? void 0 : _this$onSuccess.call(_this, returning);
      (_callback = callback) === null || _callback === void 0 ? void 0 : _callback(returning);
      $callback === null || $callback === void 0 ? void 0 : $callback(returning);
    }

    this.socket.on(name, listen);
    return {
      removeListener: function removeListener() {
        return _this2.socket.removeListener(name, listen);
      },
      socket: this.socket
    };
  },
  $on: function $on(name, model, _key, _remove) {
    var _this3 = this;

    var _useState = (0, _react.useState)({
      type: '',
      data: null,
      host: this.host,
      namespace: this.namespace,
      options: this.options,
      dispatch: {},
      name: name,
      model: model,
      key: _key,
      remove: _remove,
      removeListener: function removeListener() {}
    }),
        _useState2 = _slicedToArray(_useState, 2),
        data = _useState2[0],
        setData = _useState2[1];

    (0, _react.useEffect)(function () {
      var socket = expo.on.call(_this3, name, model, _key, _remove, null, function (data) {
        setData(function (_data) {
          return _objectSpread(_objectSpread({}, _data), data);
        });
      });
      setData(function (data) {
        return _objectSpread(_objectSpread({}, data), socket);
      });
    }, []);
    return data;
  },
  emit: function emit(name, obj, model, key, remove, overwrite, configs) {
    var _this$onStart2,
        _this4 = this;

    var host = this.host,
        namespace = this.namespace,
        options = this.options,
        socket = this.socket;

    if (typeof name != 'string') {
      model = name.model;
      obj = name.body;
      key = name.key;
      remove = name.remove;
      overwrite = name.overwrite;
      name = name.name;
    }

    var cb = {
      host: host,
      namespace: namespace,
      options: options,
      type: 'emit',
      socket: socket,
      name: name,
      model: model,
      key: key,
      remove: remove,
      overwrite: overwrite,
      body: obj
    };
    this === null || this === void 0 ? void 0 : (_this$onStart2 = this.onStart) === null || _this$onStart2 === void 0 ? void 0 : _this$onStart2.call(this, cb);
    return new Promise(function (resolve, reject) {
      _this4.socket.emit(name, obj, function (data, err) {
        if (!err) {
          var _this4$onSuccess;

          var returning = _objectSpread(_objectSpread({}, cb), {}, {
            data: data,
            socket: _this4.socket,
            dispatch: (0, _utils.simplesDispatch)(model, key, remove, data, overwrite, _this4 === null || _this4 === void 0 ? void 0 : _this4.store)
          });

          _this4 === null || _this4 === void 0 ? void 0 : (_this4$onSuccess = _this4.onSuccess) === null || _this4$onSuccess === void 0 ? void 0 : _this4$onSuccess.call(_this4, returning);
          resolve(returning);
        } else {
          var _this4$onError;

          _this4 === null || _this4 === void 0 ? void 0 : (_this4$onError = _this4.onError) === null || _this4$onError === void 0 ? void 0 : _this4$onError.call(_this4, _objectSpread(_objectSpread({}, cb), {}, {
            err: err
          }));
          reject(_objectSpread(_objectSpread({}, cb), {}, {
            err: err
          }));
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