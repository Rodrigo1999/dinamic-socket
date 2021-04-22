"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

function _default(action) {
  var method = action.method,
      key = action.key,
      model = action.model,
      data = action.data,
      _store = action.store;
  var store = Object.assign({}, _store);

  switch (method) {
    case 'post':
      if (data instanceof Array) {
        store[model] = data;
      } else if (store[model] instanceof Array) {
        store[model].unshift(data);
      } else {
        store[model] = data;
      }

      break;

    case 'put':
      if (key) {
        if (model.endsWith('s')) {
          store[model] = store[model].map(function (e) {
            return e[key] == data[key] ? data : e;
          });
        } else {
          store[model] = data;
        }
      } else {
        store[model] = data;
      }

      break;

    case 'delete':
      if (key) {
        store[model] = store[model].filter(function (e) {
          return e[key] != data[key];
        });
      } else {
        store[model] = data;
      }

      break;

    case 'get':
      store[model] = data;
      break;

    default:
      break;
  }

  return store[model];
}