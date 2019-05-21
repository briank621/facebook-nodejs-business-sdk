(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('fs'), require('path')) :
  typeof define === 'function' && define.amd ? define(['exports', 'fs', 'path'], factory) :
  (factory((global.fb = global.fb || {}),global.fs,global.path));
}(this, (function (exports,fs,path) { 'use strict';

fs = 'default' in fs ? fs['default'] : fs;
path = 'default' in path ? path['default'] : path;

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

// HTTP Status Code
var HTTP_STATUS = {
  OK: '200',
  NOT_MODIFIED: '304'
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get$1 = function get$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get$1(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



var set$1 = function set$1(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set$1(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};















var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
var _requestPromise = require('request-promise');

/**
 * Isomorphic Http Promise Requests Class
 * 
 */

var Http = function () {
  function Http() {
    classCallCheck(this, Http);
  }

  createClass(Http, null, [{
    key: 'request',

    /**
     * Request
     * @param   {String}  method
     * @param   {String}  url
     * @param   {Object}  [data]
     * @return  {Promise}
     */
    value: function request(method, url, data, files, useMultipartFormData) {
      if (typeof window !== 'undefined' && window.XMLHttpRequest) {
        return Http.xmlHttpRequest(method, url, data);
      }
      return Http.requestPromise(method, url, data, files, useMultipartFormData);
    }

    /**
     * XmlHttpRequest request
     * @param   {String}  method
     * @param   {String}  url
     * @param   {Object}  [data]
     * @return  {Promise}
     */

  }, {
    key: 'xmlHttpRequest',
    value: function xmlHttpRequest(method, url, data) {
      return new Promise(function (resolve, reject) {
        var request = new window.XMLHttpRequest();
        request.open(method, url);
        request.onload = function () {
          try {
            var response = JSON.parse(request.response);

            if (request.status.toString() === HTTP_STATUS.OK) {
              resolve(response);
            } else {
              reject(new Error({
                body: response,
                status: request.status
              }));
            }
          } catch (e) {
            reject(new Error({
              body: request.responseText,
              status: request.status
            }));
          }
        };
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('Accept', 'application/json');
        request.send(JSON.stringify(data));
      });
    }

    /**
     * Request Promise
     * @param   {String}  method The HTTP method name (e.g. 'GET').
     * @param   {String}  url A full URL string.
     * @param   {Object}  [data] A mapping of request parameters where a key
     *   is the parameter name and its value is a string or an object
     *   which can be JSON-encoded.
     * @param   {Object}  [files] An optional mapping of file names to ReadStream
     *   objects. These files will be attached to the request.
     * @param   {Boolean} [useMultipartFormData] An optional flag to call with
     *   multipart/form-data.
     * @return  {Promise}
     */

  }, {
    key: 'requestPromise',
    value: function requestPromise(method, url, data, files) {
      var useMultipartFormData = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

      var options = {
        method: method,
        uri: url,
        json: !useMultipartFormData,
        headers: { 'User-Agent': 'fbbizsdk-nodejs-' + FacebookAdsApi.VERSION },
        body: Object
      };
      // Prevent null or undefined input
      // because it can be merged with the files argument later
      if (!data) {
        data = {};
      }

      options.body = data;

      // Handle file attachments if provided
      if (useMultipartFormData || files && Object.keys(files).length > 0) {
        // Use formData instead of body (required by the request-promise library)
        options.formData = Object.assign(data, files);
        delete options.body;
      }

      return _requestPromise(options).catch(function (response) {
        throw response;
      });
    }
  }]);
  return Http;
}();

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

// request-promise error types
var REQUEST_ERROR = 'RequestError';
var STATUS_CODE_ERROR = 'StatusCodeError';

function FacebookError(error) {
  this.name = 'FacebookError';
  this.message = error.message;
  this.stack = new Error().stack;
}
FacebookError.prototype = Object.create(Error.prototype);
FacebookError.prototype.constructor = FacebookError;

/**
 * Raised when an api request fails.
 */
var FacebookRequestError = function (_FacebookError) {
  inherits(FacebookRequestError, _FacebookError);

  /**
   * @param  {[Object}  response
   * @param  {String}   method
   * @param  {String}   url
   * @param  {Object}   data
   */
  function FacebookRequestError(response, method, url, data) {
    classCallCheck(this, FacebookRequestError);

    var errorResponse = constructErrorResponse(response);

    var _this = possibleConstructorReturn(this, (FacebookRequestError.__proto__ || Object.getPrototypeOf(FacebookRequestError)).call(this, errorResponse));

    _this.name = 'FacebookRequestError';
    _this.message = errorResponse.message;
    _this.status = errorResponse.status;
    _this.response = errorResponse.body;
    _this.method = method;
    _this.url = url;
    if (data) {
      _this.data = data;
    }
    return _this;
  }

  return FacebookRequestError;
}(FacebookError);

/**
 * Error response has several structures depended on called APIs or errors.
 * This method contructs and formats the response into the same structure for
 * creating a FacebookRequestError object.
 */
function constructErrorResponse(response) {
  var body = void 0;
  var message = void 0;
  var status = void 0;

  // Batch request error contains code and body fields
  var isBatchResponse = response.code && response.body;

  if (isBatchResponse) {
    // Handle batch response
    body = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
    status = response.code;
    message = body.error.message;
  } else {
    // Handle single response
    if (response.name === STATUS_CODE_ERROR) {
      // Handle when we can get response error code
      body = response.error ? response.error : response;
      body = typeof body === 'string' ? JSON.parse(body) : body;
      // Construct an error message from subfields in body.error
      message = body.error.error_user_msg ? body.error.error_user_title + ': ' + body.error.error_user_msg : body.error.message;
      status = response.statusCode;
    } else if (response.name === REQUEST_ERROR) {
      // Handle network errors e.g. timeout, destination unreachable
      body = { error: response.error };
      // An error message is in the response already
      message = response.message;
      // Network errors have no status code
      status = null;
    }
  }

  return { body: body, message: message, status: status };
}

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 * @format
 */
/**
 * Facebook Ads API
 */

var FacebookAdsApi = function () {
  createClass(FacebookAdsApi, null, [{
    key: 'VERSION',
    get: function get() {
      return 'v3.3';
    }
  }, {
    key: 'GRAPH',
    get: function get() {
      return 'https://graph.facebook.com';
    }
  }, {
    key: 'GRAPH_VIDEO',
    get: function get() {
      return 'https://graph-video.facebook.com';
    }

    /**
     * @param {String} accessToken
     * @param {String} [locale]
     */

  }]);

  function FacebookAdsApi(accessToken) {
    var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'en_US';
    classCallCheck(this, FacebookAdsApi);

    if (!accessToken) {
      throw new Error('Access token required');
    }
    this.accessToken = accessToken;
    this.locale = locale;
    this._debug = false;
  }

  /**
   * Instantiate an API and store it as the default
   * @param  {String} accessToken
   * @param  {String} [locale]
   * @return {FacebookAdsApi}
   */


  createClass(FacebookAdsApi, [{
    key: 'setDebug',
    value: function setDebug(flag) {
      this._debug = flag;
      return this;
    }

    /**
     * Http Request
     * @param  {String} method
     * @param  {String} path
     * @param  {Object} [params]
     * @param  {Object} [files]
     * @return {Promise}
     */

  }, {
    key: 'call',
    value: function call(method, path$$1) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var files = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      var _this = this;

      var useMultipartFormData = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      var urlOverride = arguments[5];

      var url = void 0;
      var data = {};
      if (method === 'POST' || method === 'PUT') {
        data = params;
        params = {};
      }
      var domain = urlOverride || FacebookAdsApi.GRAPH;
      if (typeof path$$1 !== 'string' && !(path$$1 instanceof String)) {
        url = [domain, FacebookAdsApi.VERSION].concat(toConsumableArray(path$$1)).join('/');
        params['access_token'] = this.accessToken;
        url += '?' + FacebookAdsApi._encodeParams(params);
      } else {
        url = path$$1;
      }
      var strUrl = url;
      return Http.request(method, strUrl, data, files, useMultipartFormData).then(function (response) {
        if (_this._debug) {
          console.log('200 ' + method + ' ' + url + ' ' + (data ? JSON.stringify(data) : ''));
          console.log('Response: ' + (response ? JSON.stringify(response) : ''));
        }
        return Promise.resolve(response);
      }).catch(function (response) {
        if (_this._debug) {
          console.log(response.status + ' ' + method + ' ' + url + '\n            ' + (data ? JSON.stringify(data) : ''));
        }
        throw new FacebookRequestError(response, method, url, data);
      });
    }
  }], [{
    key: 'init',
    value: function init(accessToken) {
      var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'en_US';

      var api = new this(accessToken, locale);
      this.setDefaultApi(api);
      return api;
    }
  }, {
    key: 'setDefaultApi',
    value: function setDefaultApi(api) {
      this._defaultApi = api;
    }
  }, {
    key: 'getDefaultApi',
    value: function getDefaultApi() {
      return this._defaultApi;
    }
  }, {
    key: '_encodeParams',
    value: function _encodeParams(params) {
      return Object.keys(params).map(function (key) {
        var param = params[key];
        if ((typeof param === 'undefined' ? 'undefined' : _typeof(param)) === 'object') {
          param = param ? JSON.stringify(param) : '';
        }
        return encodeURIComponent(key) + '=' + encodeURIComponent(param);
      }).join('&');
    }
  }]);
  return FacebookAdsApi;
}();

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 * @format
 */
/**
 * Represents an API request
 */

var APIRequest = function () {

  /**
   * @param {string} nodeId The node id to perform the api call.
   * @param {string} method The HTTP method of the call.
   * @param {string} endpoint The edge of the api call.
   */
  function APIRequest(nodeId, method, endpoint) {
    classCallCheck(this, APIRequest);

    this._nodeId = nodeId;
    this._method = method;
    this._endpoint = endpoint.replace('/', '');
    this._path = [nodeId, this.endpoint];
    this._fields = [];
    this._fileParams = Object.create(null);
    this._params = Object.create(null);
    this._fileCounter = 0;
  }

  /**
   * Getter function for node ID
   * @return {string} Node ID
   */


  createClass(APIRequest, [{
    key: 'addFile',


    /**
     * @param {string} filePath Path to file attached to the request
     * @return {APIReqeust} APIRequest instance
     */
    value: function addFile(filePath) {
      var fileKey = 'source' + this._fileCounter;
      var stats = fs.lstatSync(filePath);

      if (!stats.isFile()) {
        throw Error('Cannot find file ' + filePath + '!');
      }

      this._fileParams[fileKey] = filePath;
      this._fileCounter += 1;

      return this;
    }

    /**
     * @param {string[]} filePaths Array of paths to files attached to the request
     * @return {APIRequest} APIRequest instance
     */

  }, {
    key: 'addFiles',
    value: function addFiles(filePaths) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = filePaths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var filePath = _step.value;

          this.addFile(filePath);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return this;
    }

    /**
     * @param {string} field Requested field
     * @return {APIReqeust} APIRequest instance
     */

  }, {
    key: 'addField',
    value: function addField(field) {
      if (!this._fields.includes(field)) {
        this._fields.push(field);
      }

      return this;
    }

    /**
     * @param {string[]} fields Array of requested fields
     * @return {APIRequest} APIRequest instance
     */

  }, {
    key: 'addFields',
    value: function addFields(fields) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = fields[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var field = _step2.value;

          this.addField(field);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return this;
    }

    /**
     * @param {string} key Param key
     * @param {*} value Param value
     * @return {APIRequest} APIRequest instance
     */

  }, {
    key: 'addParam',
    value: function addParam(key, value) {
      this._params[key] = value;

      return this;
    }

    /**
     * @param {Object} params An object containing param keys and values
     * @return {APIRequest} APIRequest instance
     */

  }, {
    key: 'addParams',
    value: function addParams(params) {
      this._params = params;

      return this;
    }
  }, {
    key: 'nodeId',
    get: function get() {
      return this._nodeId;
    }

    /**
     * Getter function for HTTP method e.g. GET, POST
     * @return {string} HTTP method
     */

  }, {
    key: 'method',
    get: function get() {
      return this._method;
    }

    /**
     * Getter function for the edge of the API call
     * @return {string} Endpoint edge
     */

  }, {
    key: 'endpoint',
    get: function get() {
      return this._endpoint;
    }

    /**
     * Getter function for path tokens
     * @return {Array<string>} Array of path tokens
     */

  }, {
    key: 'path',
    get: function get() {
      return this._path;
    }

    /**
     * Getter function for requested fields
     * @return {Array<string>} Array of request fields
     */

  }, {
    key: 'fields',
    get: function get() {
      return this._fields;
    }

    /**
     * Getter function for API params
     * @return {Object} Object containing API Params
     */

  }, {
    key: 'params',
    get: function get() {
      // Deep cloning when object value is not a function
      return JSON.parse(JSON.stringify(this._params));
    }
  }]);
  return APIRequest;
}();

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 * @format
 */

/**
 * Encapsulates an http response from Facebook's Graph API.
 */

var APIResponse = function () {
  function APIResponse(response, call) {
    classCallCheck(this, APIResponse);

    response.body = JSON.parse(response.body);
    this._body = response.body;
    this._httpStatus = response.code;
    this._headers = response.headers;
    this._call = call;
    this._response = response;
  }

  /**
   * @return {Object} The response body
   */


  createClass(APIResponse, [{
    key: 'body',
    get: function get() {
      return this._body;
    }
  }, {
    key: 'headers',
    get: function get() {
      return this._headers;
    }
  }, {
    key: 'etag',
    get: function get() {
      return this._headers['ETag'];
    }
  }, {
    key: 'status',
    get: function get() {
      return this._httpStatus;
    }
  }, {
    key: 'isSuccess',
    get: function get() {
      var body = this._body;

      if ('error' in body) {
        return false;
      } else if (Object.keys(body).length !== 0) {
        if ('success' in body) {
          return body['success'];
        }
        return !('Service Unavailable' in body);
      } else if (this._httpStatus === HTTP_STATUS.NOT_MODIFIED) {
        // ETag Hit
        return true;
      } else if (this._httpStatus === HTTP_STATUS.OK) {
        // HTTP OK
        return true;
      } else {
        // Something else
        return false;
      }
    }
  }, {
    key: 'error',
    get: function get() {
      if (this.isSuccess) {
        return null;
      }

      return new FacebookRequestError(this._response, this._call.method, this._call.relativeUrl, this._call.body);
    }
  }]);
  return APIResponse;
}();

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 * @format
 */
/**
 * Facebook Ads API Batch
 */

var FacebookAdsApiBatch = function () {

  /**
   * @param {FacebookAdsApi} api
   * @param {Function} successCallback
   * @param {Function} failureCallback
   */
  function FacebookAdsApiBatch(api, successCallback, failureCallback) {
    classCallCheck(this, FacebookAdsApiBatch);

    this._api = api;
    this._files = [];
    this._batch = [];
    this._requests = [];
    this._successCallbacks = [];
    this._failureCallbacks = [];

    if (successCallback != null) {
      this._successCallbacks.push(successCallback);
    }

    if (failureCallback != null) {
      this._failureCallbacks.push(failureCallback);
    }
  }

  /**
   * Adds a call to the batch.
   * @param  {string} method The HTTP method name (e.g. 'GET').
   * @param  {string[]|string} relativePath An array of path tokens or
   *   a relative URL string. An array will be translated to a url as follows:
   *     <graph url>/<tuple[0]>/<tuple[1]>...
   *   It will be assumed that if the path is not a string, it will be iterable.
   * @param  {Object} [params] A mapping of request parameters
   *   where a key is the parameter name and its value is a string or an object
   *   which can be JSON-encoded.
   * @param {Object} [files] An optional mapping of file names to binary open
   *   file objects. These files will be attached to the request.
   * @param {Function} [successCallback] A callback function which will be
   *   called with the response of this call if the call succeeded.
   * @param {Function} [failureCallback] A callback function which will be
   *   called with the response of this call if the call failed.
   * @param {APIRequest} [request] The APIRequest object
   * @return {Object} An object describing the call
   */


  createClass(FacebookAdsApiBatch, [{
    key: 'add',
    value: function add(method, relativePath, params, files, successCallback, failureCallback, request) {
      // Construct a relaitveUrl from relateivePath by assuming that
      // relativePath can only be a string or an array of strings
      var relativeUrl = typeof relativePath === 'string' ? relativePath : relativePath.join('/');
      // A Call object that will be used in a batch request
      var call = {
        method: method,
        relative_url: relativeUrl
      };

      // Contruct key-value pairs from params for GET querystring or POST body
      if (params != null) {
        var keyVals = [];

        for (var key in params) {
          var value = params[key];
          if (_typeof(params[key]) === 'object' && !(params[key] instanceof Date)) {
            value = JSON.stringify(value);
          }
          keyVals.push(key + '=' + value);
        }

        if (method === 'GET') {
          call['relative_url'] += '?' + keyVals.join('&');
        } else {
          call['body'] = keyVals.join('&');
        }

        if (params && params['name']) {
          call['name'] = params['name'];
        }
      }

      // Handle attached files
      if (files != null) {
        call['attachedFiles'] = Object.keys(files).join(',');
      }

      this._batch.push(call);
      this._files.push(files);
      this._successCallbacks.push(successCallback);
      this._failureCallbacks.push(failureCallback);
      this._requests.push(request);

      return call;
    }

    /**
     * Interface to add a APIRequest to the batch.
     * @param  {APIRequest} request The APIRequest object to add
     * @param  {Function} [successCallback] A callback function which
     *   will be called with response of this call if the call succeeded.
     * @param  {Function} [failureCallback] A callback function which
     *   will be called with the FacebookResponse of this call if the call failed.
     * @return {Object} An object describing the call
     */

  }, {
    key: 'addRequest',
    value: function addRequest(request, successCallback, failureCallback) {
      var updatedParams = request.params;
      updatedParams['fields'] = request.fields.join();

      return this.add(request.method, request.path, updatedParams, request.fileParams, successCallback, failureCallback, request);
    }

    /**
     * Makes a batch call to the api associated with this object.
     * For each individual call response, calls the success or failure callback
     * function if they were specified.
     * Note: Does not explicitly raise exceptions. Individual exceptions won't
     * be thrown for each call that fails. The success and failure callback
     * functions corresponding to a call should handle its success or failure.
     * @return {FacebookAdsApiBatch|None} If some of the calls have failed,
     *   returns a new FacebookAdsApiBatch object with those calls.
     *   Otherwise, returns None.
     */

  }, {
    key: 'execute',
    value: function execute() {
      var _this = this;

      if (this._batch.length < 1) {
        return;
      }

      var method = 'POST';
      var path$$1 = []; // request to root domain for a batch request
      var params = {
        batch: this._batch
      };

      // Call to the batch endpoint (WIP)
      return this._api.call(method, path$$1, params).then(function (responses) {
        // Keep track of batch indices that need to retry
        var retryIndices = [];

        // Check each response
        for (var index = 0; index < responses.length; index++) {
          var response = responses[index];

          if (response != null) {
            var apiResponse = new APIResponse(response, _this._batch[index]);

            // Call the success callback if provided
            if (apiResponse.isSuccess) {
              if (_this._successCallbacks[index]) {
                _this._successCallbacks[index](apiResponse);
              }
            } else {
              // Call the failure callback if provided
              if (_this._failureCallbacks[index]) {
                _this._failureCallbacks[index](apiResponse);
              }
            }
          } else {
            // Do not get response, so, we keep track of the index to retry
            retryIndices.push(index);
          }
        }

        // Create and return new batch if we need to retry
        if (retryIndices.length > 0) {
          // Create a new batch from retry indices in the current batch
          var newBatch = new FacebookAdsApiBatch(_this.api);

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = retryIndices[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var _index = _step.value;

              newBatch._files.push(_this._files[_index]);
              newBatch._batch.push(_this._batch[_index]);
              newBatch._successCallbacks.push(_this._successCallbacks[_index]);
              newBatch._failureCallbacks.push(_this._failureCallbacks[_index]);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          return newBatch;
        }

        // No retry
        return null;
      }).catch(function (error) {
        throw error;
      });
    }
  }]);
  return FacebookAdsApiBatch;
}();

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Abstract Object
 * Manages object data fields and provides matching properties
 *
 * 
 * @format
 */
var AbstractObject = function () {
  createClass(AbstractObject, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({});
    }
  }]);

  function AbstractObject() {
    var _this = this;

    classCallCheck(this, AbstractObject);

    this._data = {};
    if (this.constructor.Fields === undefined) {
      throw new Error('A "Fields" frozen object must be defined in the object class');
    }
    var fields = this.constructor.Fields;
    this._fields = Object.keys(fields);
    this._fields.forEach(function (field) {
      _this._defineProperty(field);
    });
  }

  /**
   * Define data getter and setter field
   * @param {String} field
   */


  createClass(AbstractObject, [{
    key: '_defineProperty',
    value: function _defineProperty(field) {
      var _this2 = this;

      Object.defineProperty(this, field, {
        get: function get() {
          return _this2._data[field];
        },
        set: function set(value) {
          _this2._data[field] = value;
        },
        enumerable: true
      });
    }

    /**
     * Set data field
     * @param {String} field
     * @param {Mixed} value
     * @return this
     */

  }, {
    key: 'set',
    value: function set(field, value) {
      if (this._fields.indexOf(field) < 0) {
        this._defineProperty(field);
      }
      var that = this;
      that[field] = value;
      return this;
    }

    /**
     * Set multiple data fields
     * @param {Object} data
     * @return this
     */

  }, {
    key: 'setData',
    value: function setData(data) {
      var _this3 = this;

      Object.keys(data).forEach(function (key) {
        _this3.set(key, data[key]);
      });
      return this;
    }

    /**
     * Export object data
     * @return {Object}
     */

  }, {
    key: 'exportData',
    value: function exportData() {
      return this._data;
    }
  }]);
  return AbstractObject;
}();

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 * @format
 */
var Utils = function () {
  function Utils() {
    classCallCheck(this, Utils);
  }

  createClass(Utils, null, [{
    key: 'normalizeEndpoint',
    value: function normalizeEndpoint(str) {
      return str.replace(/^\/|\/$/g, '');
    }
  }, {
    key: 'removePreceedingSlash',
    value: function removePreceedingSlash(str) {
      return str.length && str[0] === '/' ? str.slice(1) : str;
    }
  }]);
  return Utils;
}();

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Cursor
 * Iterates over edge objects and controls pagination
 * 
 * @format
 */
var Cursor = function (_Array) {
  inherits(Cursor, _Array);

  /**
   * @param  {Object} sourceObject
   * @param  {Object} targetClass
   * @param  {Object} [params]
   * @param  {String} [endpoint]
   */
  function Cursor(sourceObject, targetClass, params, endpoint) {
    classCallCheck(this, Cursor);

    var _this = possibleConstructorReturn(this, (Cursor.__proto__ || Object.getPrototypeOf(Cursor)).call(this));

    var next = [sourceObject.getId()];
    if (endpoint) {
      next.push(Utils.normalizeEndpoint(endpoint));
    } else {
      throw new Error('No endpoint specified for the target edge.');
    }
    _this._api = sourceObject.getApi();
    _this._targetClass = targetClass;
    _this.paging = { next: next };

    _this.clear = function () {
      _this.length = 0;
    };

    _this.set = function (array) {
      _this.clear();
      _this.push.apply(_this, toConsumableArray(array));
    };

    _this.next = function () {
      if (!_this.hasNext()) {
        return Promise.reject(new RangeError('end of pagination'));
      }
      return _this._loadPage(_this.paging.next);
    };

    _this.hasNext = function () {
      return Boolean(_this.paging) && Boolean(_this.paging.next);
    };

    _this.previous = function () {
      if (!_this.hasPrevious()) {
        return Promise.reject(new RangeError('start of pagination'));
      }
      return _this._loadPage(_this.paging.previous);
    };

    _this.hasPrevious = function () {
      return Boolean(_this.paging) && Boolean(_this.paging.previous);
    };

    _this._loadPage = function (path$$1) {
      var promise = new Promise(function (resolve, reject) {
        _this._api.call('GET', path$$1, params).then(function (response) {
          var objects = _this._buildObjectsFromResponse(response);
          _this.set(objects);
          _this.paging = response.paging;
          _this.summary = response.summary;
          resolve(_this);
        }).catch(reject);
      });
      if (params) {
        params = undefined;
      }
      return promise;
    };

    _this._buildObjectsFromResponse = function (response) {
      return response.data.map(function (item) {
        var That = _this._targetClass;
        if (That.name === 'AbstractObject') {
          var result = new That();
          result.setData(item);
          return result;
        }
        return new That(item && item.id ? item.id : null, item, undefined, _this._api);
      });
    };
    return _this;
  }

  return Cursor;
}(Array);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 * 
 */
/**
 * Abstract Crud Object
 * Facebook Object basic persistence functions
 * @extends AbstractObject
 * 
 */
var AbstractCrudObject = function (_AbstractObject) {
  inherits(AbstractCrudObject, _AbstractObject);

  /**
   * @param  {Object} data
   * @param  {String} parentId
   * @param  {FacebookAdApi} [api]
   */
  function AbstractCrudObject() {
    var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var parentId = arguments[2];
    var api = arguments[3];
    classCallCheck(this, AbstractCrudObject);

    var _this = possibleConstructorReturn(this, (AbstractCrudObject.__proto__ || Object.getPrototypeOf(AbstractCrudObject)).call(this));

    _this._parentId = parentId;
    _this._api = api || FacebookAdsApi.getDefaultApi();
    if (id) {
      data.id = id;
    }
    if (data) {
      get$1(AbstractCrudObject.prototype.__proto__ || Object.getPrototypeOf(AbstractCrudObject.prototype), 'setData', _this).call(_this, data);
    }
    return _this;
  }

  /**
   * Define data getter and setter recording changes
   * @param {String} field
   */


  createClass(AbstractCrudObject, [{
    key: '_defineProperty',
    value: function _defineProperty(field) {
      var _this2 = this;

      if (this._changes === undefined) {
        this._changes = {};
      }
      Object.defineProperty(this, field, {
        get: function get() {
          return _this2._data[field];
        },
        set: function set(value) {
          _this2._changes[field] = value;
          _this2._data[field] = value;
        },
        enumerable: true
      });
    }

    /**
     * Set object data as if it were read from the server. Wipes related changes
     * @param {Object} data
     * @return this
     */

  }, {
    key: 'setData',
    value: function setData(data) {
      var _this3 = this;

      get$1(AbstractCrudObject.prototype.__proto__ || Object.getPrototypeOf(AbstractCrudObject.prototype), 'setData', this).call(this, data);
      Object.keys(data).forEach(function (key) {
        delete _this3._changes[key];
      });
      return this;
    }

    /**
     * Export changed object data
     * @return {Object}
     */

  }, {
    key: 'exportData',
    value: function exportData() {
      return this._changes;
    }

    /**
     * Export object data
     * @return {Object}
     */

  }, {
    key: 'exportAllData',
    value: function exportAllData() {
      return this._data;
    }

    /**
     * Clear change history
     * @return this
     */

  }, {
    key: 'clearHistory',
    value: function clearHistory() {
      this._changes = {};
      return this;
    }

    /**
     * @throws {Error} if object has no id
     * @return {String}
     */

  }, {
    key: 'getId',
    value: function getId() {
      if (!this.id) {
        throw new Error(this.constructor.name + ' Id not defined');
      }
      return this.id;
    }

    /**
     * @throws {Error} if object has no parent id
     * @return {String}
     */

  }, {
    key: 'getParentId',
    value: function getParentId() {
      if (!this._parentId) {
        throw new Error(this.constructor.name + ' parentId not defined');
      }
      return this._parentId;
    }

    /**
     * @return {String}
     */

  }, {
    key: 'getNodePath',
    value: function getNodePath() {
      return this.getId();
    }

    /**
     * Return object API instance
     * @throws {Error} if object doesn't hold an API
     * @return {FacebookAdsApi}
     */

  }, {
    key: 'getApi',
    value: function getApi() {
      var api = this._api;
      if (!api) {
        throw new Error(this.constructor.name + ' does not yet have an\n        associated api object.\n Did you forget to\n        instantiate an API session with:\n        "FacebookAdsApi.init"?');
      }
      return api;
    }

    /**
     * Read object data
     * @param   {Array}   [fields]
     * @param   {Object}  [params]
     * @return  {Promise}
     */

  }, {
    key: 'read',
    value: function read(fields) {
      var _this4 = this;

      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var api = this.getApi();
      var path$$1 = [this.getNodePath()];
      if (fields) {
        params['fields'] = fields.join(',');
      }
      return new Promise(function (resolve, reject) {
        api.call('GET', path$$1, params).then(function (data) {
          return resolve(_this4.setData(data));
        }).catch(reject);
      });
    }

    /**
     * Update object
     * @param   {Object}  [params]
     * @return  {Promise}
     */

  }, {
    key: 'update',
    value: function update() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var api = this.getApi();
      var path$$1 = [this.getNodePath()];
      params = Object.assign(params, this.exportData());
      return new Promise(function (resolve, reject) {
        api.call('POST', path$$1, params).then(function (data) {
          return resolve(data);
        }).catch(reject);
      });
    }

    /**
     * Delete object
     * @param   {Object}  [params]
     * @return  {Promise}
     */

  }, {
    key: 'delete',
    value: function _delete() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var api = this.getApi();
      var path$$1 = [this.getNodePath()];
      params = Object.assign(params, this.exportData());
      return new Promise(function (resolve, reject) {
        api.call('DELETE', path$$1, params).then(function (data) {
          return resolve(data);
        }).catch(reject);
      });
    }

    /**
     * Initialize Cursor to paginate on edges
     * @param  {Object}  targetClass
     * @param  {Array}   [fields]
     * @param  {Object}  [params]
     * @param  {Boolean} [fetchFirstPage]
     * @param  {String}  [endpoint]
     * @return {Cursor}
     */

  }, {
    key: 'getEdge',
    value: function getEdge(targetClass, fields) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var fetchFirstPage = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      var endpoint = arguments[4];

      if (params == null) {
        params = {};
      }
      if (fields) {
        params['fields'] = fields.join(',');
      }
      var sourceObject = this;
      var cursor = new Cursor(sourceObject, targetClass, params, endpoint);
      if (fetchFirstPage) {
        return cursor.next();
      }
      return cursor;
    }

    /**
     * Create edge object
     * @param   {String}  [endpoint]
     * @param   {Array}  [fields]
     * @param   {Object}  [params]
     * @param   {Function} [targetClassConstructor]
     * @return  {Promise}
     */

  }, {
    key: 'createEdge',
    value: function createEdge(endpoint, fields) {
      var _this5 = this;

      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var targetClassConstructor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

      if (params == null) {
        params = {};
      }
      if (fields && fields.length > 0) {
        params['fields'] = fields.join(',');
      }
      var api = this.getApi();
      var path$$1 = [this.getNodePath(), Utils.removePreceedingSlash(endpoint)];
      params = Object.assign(params, this.exportData());
      return new Promise(function (resolve, reject) {
        api.call('POST', path$$1, params).then(function (data) {
          resolve(
          /* eslint new-cap: "off" */
          targetClassConstructor === null ? _this5.setData(data) : new targetClassConstructor(data.id, data));
        }).catch(reject);
      });
    }

    /**
     * Delete edge object
     * @param   {String}  [endpoint]
     * @param   {Object}  [params]
     * @return  {Promise}
     */

  }, {
    key: 'deleteEdge',
    value: function deleteEdge(endpoint) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var api = this.getApi();
      var path$$1 = [this.getNodePath(), Utils.removePreceedingSlash(endpoint)];
      params = Object.assign(params, this.exportData());
      return new Promise(function (resolve, reject) {
        api.call('DELETE', path$$1, params).then(function (data) {
          return resolve(data);
        }).catch(reject);
      });
    }

    /**
     * Read Objects by Ids
     * @param  {Array}          ids
     * @param  {Array}          [fields]
     * @param  {Object}         [params]
     * @param  {FacebookAdsApi} [api]
     * @return {Promise}
     */

  }], [{
    key: 'getByIds',
    value: function getByIds(ids, fields) {
      var _this6 = this;

      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var api = arguments[3];

      api = api || FacebookAdsApi.getDefaultApi();
      if (fields) {
        params['fields'] = fields.join(',');
      }
      params['ids'] = ids.join(',');
      return new Promise(function (resolve, reject) {
        return api.call('GET', [''], params).then(function (response) {
          var result = [];
          for (var id in response) {
            var data = response[id];
            var That = _this6;
            var object = new That(data);
            result.push(object);
          }
          resolve(result);
        }).catch(reject);
      });
    }
  }]);
  return AbstractCrudObject;
}(AbstractObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdPreview
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdPreview = function (_AbstractCrudObject) {
  inherits(AdPreview, _AbstractCrudObject);

  function AdPreview() {
    classCallCheck(this, AdPreview);
    return possibleConstructorReturn(this, (AdPreview.__proto__ || Object.getPrototypeOf(AdPreview)).apply(this, arguments));
  }

  createClass(AdPreview, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        body: 'body'
      });
    }
  }, {
    key: 'AdFormat',
    get: function get() {
      return Object.freeze({
        audience_network_instream_video: 'AUDIENCE_NETWORK_INSTREAM_VIDEO',
        audience_network_instream_video_mobile: 'AUDIENCE_NETWORK_INSTREAM_VIDEO_MOBILE',
        audience_network_outstream_video: 'AUDIENCE_NETWORK_OUTSTREAM_VIDEO',
        audience_network_rewarded_video: 'AUDIENCE_NETWORK_REWARDED_VIDEO',
        desktop_feed_standard: 'DESKTOP_FEED_STANDARD',
        facebook_story_mobile: 'FACEBOOK_STORY_MOBILE',
        instagram_standard: 'INSTAGRAM_STANDARD',
        instagram_story: 'INSTAGRAM_STORY',
        instant_article_standard: 'INSTANT_ARTICLE_STANDARD',
        instream_video_desktop: 'INSTREAM_VIDEO_DESKTOP',
        instream_video_mobile: 'INSTREAM_VIDEO_MOBILE',
        marketplace_mobile: 'MARKETPLACE_MOBILE',
        messenger_mobile_inbox_media: 'MESSENGER_MOBILE_INBOX_MEDIA',
        mobile_banner: 'MOBILE_BANNER',
        mobile_feed_basic: 'MOBILE_FEED_BASIC',
        mobile_feed_standard: 'MOBILE_FEED_STANDARD',
        mobile_fullwidth: 'MOBILE_FULLWIDTH',
        mobile_interstitial: 'MOBILE_INTERSTITIAL',
        mobile_medium_rectangle: 'MOBILE_MEDIUM_RECTANGLE',
        mobile_native: 'MOBILE_NATIVE',
        right_column_standard: 'RIGHT_COLUMN_STANDARD',
        suggested_video_desktop: 'SUGGESTED_VIDEO_DESKTOP',
        suggested_video_mobile: 'SUGGESTED_VIDEO_MOBILE',
        watch_feed_mobile: 'WATCH_FEED_MOBILE'
      });
    }
  }, {
    key: 'RenderType',
    get: function get() {
      return Object.freeze({
        fallback: 'FALLBACK'
      });
    }
  }]);
  return AdPreview;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCreative
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCreative = function (_AbstractCrudObject) {
  inherits(AdCreative, _AbstractCrudObject);

  function AdCreative() {
    classCallCheck(this, AdCreative);
    return possibleConstructorReturn(this, (AdCreative.__proto__ || Object.getPrototypeOf(AdCreative)).apply(this, arguments));
  }

  createClass(AdCreative, [{
    key: 'deleteAdLabels',
    value: function deleteAdLabels(params) {
      return get$1(AdCreative.prototype.__proto__ || Object.getPrototypeOf(AdCreative.prototype), 'deleteEdge', this).call(this, '/adlabels', params);
    }
  }, {
    key: 'createAdLabel',
    value: function createAdLabel(fields, params) {
      return this.createEdge('/adlabels', fields, params, AdCreative);
    }
  }, {
    key: 'getPreviews',
    value: function getPreviews(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdPreview, fields, params, fetchFirstPage, '/previews');
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(AdCreative.prototype.__proto__ || Object.getPrototypeOf(AdCreative.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(AdCreative.prototype.__proto__ || Object.getPrototypeOf(AdCreative.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        actor_id: 'actor_id',
        adlabels: 'adlabels',
        applink_treatment: 'applink_treatment',
        asset_feed_spec: 'asset_feed_spec',
        authorization_category: 'authorization_category',
        auto_update: 'auto_update',
        body: 'body',
        branded_content_sponsor_page_id: 'branded_content_sponsor_page_id',
        bundle_folder_id: 'bundle_folder_id',
        call_to_action_type: 'call_to_action_type',
        categorization_criteria: 'categorization_criteria',
        category_media_source: 'category_media_source',
        destination_set_id: 'destination_set_id',
        dynamic_ad_voice: 'dynamic_ad_voice',
        effective_authorization_category: 'effective_authorization_category',
        effective_instagram_story_id: 'effective_instagram_story_id',
        effective_object_story_id: 'effective_object_story_id',
        enable_direct_install: 'enable_direct_install',
        enable_launch_instant_app: 'enable_launch_instant_app',
        id: 'id',
        image_crops: 'image_crops',
        image_hash: 'image_hash',
        image_url: 'image_url',
        instagram_actor_id: 'instagram_actor_id',
        instagram_permalink_url: 'instagram_permalink_url',
        instagram_story_id: 'instagram_story_id',
        interactive_components_spec: 'interactive_components_spec',
        link_deep_link_url: 'link_deep_link_url',
        link_og_id: 'link_og_id',
        link_url: 'link_url',
        messenger_sponsored_message: 'messenger_sponsored_message',
        name: 'name',
        object_id: 'object_id',
        object_store_url: 'object_store_url',
        object_story_id: 'object_story_id',
        object_story_spec: 'object_story_spec',
        object_type: 'object_type',
        object_url: 'object_url',
        place_page_set_id: 'place_page_set_id',
        platform_customizations: 'platform_customizations',
        playable_asset_id: 'playable_asset_id',
        portrait_customizations: 'portrait_customizations',
        product_set_id: 'product_set_id',
        recommender_settings: 'recommender_settings',
        status: 'status',
        template_url: 'template_url',
        template_url_spec: 'template_url_spec',
        thumbnail_url: 'thumbnail_url',
        title: 'title',
        url_tags: 'url_tags',
        use_page_actor_override: 'use_page_actor_override',
        video_id: 'video_id'
      });
    }
  }, {
    key: 'ApplinkTreatment',
    get: function get() {
      return Object.freeze({
        deeplink_with_appstore_fallback: 'deeplink_with_appstore_fallback',
        deeplink_with_web_fallback: 'deeplink_with_web_fallback',
        web_only: 'web_only'
      });
    }
  }, {
    key: 'CallToActionType',
    get: function get() {
      return Object.freeze({
        add_to_cart: 'ADD_TO_CART',
        apply_now: 'APPLY_NOW',
        book_travel: 'BOOK_TRAVEL',
        buy: 'BUY',
        buy_now: 'BUY_NOW',
        buy_tickets: 'BUY_TICKETS',
        call: 'CALL',
        call_me: 'CALL_ME',
        contact: 'CONTACT',
        contact_us: 'CONTACT_US',
        donate: 'DONATE',
        donate_now: 'DONATE_NOW',
        download: 'DOWNLOAD',
        event_rsvp: 'EVENT_RSVP',
        find_a_group: 'FIND_A_GROUP',
        find_your_groups: 'FIND_YOUR_GROUPS',
        follow_news_storyline: 'FOLLOW_NEWS_STORYLINE',
        get_directions: 'GET_DIRECTIONS',
        get_offer: 'GET_OFFER',
        get_offer_view: 'GET_OFFER_VIEW',
        get_quote: 'GET_QUOTE',
        get_showtimes: 'GET_SHOWTIMES',
        install_app: 'INSTALL_APP',
        install_mobile_app: 'INSTALL_MOBILE_APP',
        learn_more: 'LEARN_MORE',
        like_page: 'LIKE_PAGE',
        listen_music: 'LISTEN_MUSIC',
        listen_now: 'LISTEN_NOW',
        message_page: 'MESSAGE_PAGE',
        mobile_download: 'MOBILE_DOWNLOAD',
        moments: 'MOMENTS',
        no_button: 'NO_BUTTON',
        open_link: 'OPEN_LINK',
        order_now: 'ORDER_NOW',
        play_game: 'PLAY_GAME',
        record_now: 'RECORD_NOW',
        say_thanks: 'SAY_THANKS',
        see_more: 'SEE_MORE',
        sell_now: 'SELL_NOW',
        share: 'SHARE',
        shop_now: 'SHOP_NOW',
        sign_up: 'SIGN_UP',
        sotto_subscribe: 'SOTTO_SUBSCRIBE',
        subscribe: 'SUBSCRIBE',
        update_app: 'UPDATE_APP',
        use_app: 'USE_APP',
        use_mobile_app: 'USE_MOBILE_APP',
        video_annotation: 'VIDEO_ANNOTATION',
        visit_pages_feed: 'VISIT_PAGES_FEED',
        watch_more: 'WATCH_MORE',
        watch_video: 'WATCH_VIDEO',
        whatsapp_message: 'WHATSAPP_MESSAGE',
        woodhenge_support: 'WOODHENGE_SUPPORT'
      });
    }
  }, {
    key: 'ObjectType',
    get: function get() {
      return Object.freeze({
        application: 'APPLICATION',
        domain: 'DOMAIN',
        event: 'EVENT',
        invalid: 'INVALID',
        offer: 'OFFER',
        page: 'PAGE',
        photo: 'PHOTO',
        share: 'SHARE',
        status: 'STATUS',
        store_item: 'STORE_ITEM',
        video: 'VIDEO'
      });
    }
  }, {
    key: 'Status',
    get: function get() {
      return Object.freeze({
        active: 'ACTIVE',
        deleted: 'DELETED'
      });
    }
  }, {
    key: 'AuthorizationCategory',
    get: function get() {
      return Object.freeze({
        none: 'NONE',
        political: 'POLITICAL'
      });
    }
  }, {
    key: 'CategorizationCriteria',
    get: function get() {
      return Object.freeze({
        brand: 'brand',
        category: 'category',
        product_type: 'product_type'
      });
    }
  }, {
    key: 'CategoryMediaSource',
    get: function get() {
      return Object.freeze({
        category: 'CATEGORY',
        mixed: 'MIXED',
        products_collage: 'PRODUCTS_COLLAGE',
        products_slideshow: 'PRODUCTS_SLIDESHOW'
      });
    }
  }, {
    key: 'DynamicAdVoice',
    get: function get() {
      return Object.freeze({
        dynamic: 'DYNAMIC',
        story_owner: 'STORY_OWNER'
      });
    }
  }, {
    key: 'Operator',
    get: function get() {
      return Object.freeze({
        all: 'ALL',
        any: 'ANY'
      });
    }
  }]);
  return AdCreative;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdRuleHistory
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdRuleHistory = function (_AbstractCrudObject) {
  inherits(AdRuleHistory, _AbstractCrudObject);

  function AdRuleHistory() {
    classCallCheck(this, AdRuleHistory);
    return possibleConstructorReturn(this, (AdRuleHistory.__proto__ || Object.getPrototypeOf(AdRuleHistory)).apply(this, arguments));
  }

  createClass(AdRuleHistory, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        evaluation_spec: 'evaluation_spec',
        exception_code: 'exception_code',
        exception_message: 'exception_message',
        execution_spec: 'execution_spec',
        is_manual: 'is_manual',
        results: 'results',
        schedule_spec: 'schedule_spec',
        timestamp: 'timestamp'
      });
    }
  }, {
    key: 'Action',
    get: function get() {
      return Object.freeze({
        budget_not_redistributed: 'BUDGET_NOT_REDISTRIBUTED',
        changed_bid: 'CHANGED_BID',
        changed_budget: 'CHANGED_BUDGET',
        email: 'EMAIL',
        endpoint_pinged: 'ENDPOINT_PINGED',
        error: 'ERROR',
        facebook_notification_sent: 'FACEBOOK_NOTIFICATION_SENT',
        message_sent: 'MESSAGE_SENT',
        not_changed: 'NOT_CHANGED',
        paused: 'PAUSED',
        unpaused: 'UNPAUSED'
      });
    }
  }]);
  return AdRuleHistory;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdRule
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdRule = function (_AbstractCrudObject) {
  inherits(AdRule, _AbstractCrudObject);

  function AdRule() {
    classCallCheck(this, AdRule);
    return possibleConstructorReturn(this, (AdRule.__proto__ || Object.getPrototypeOf(AdRule)).apply(this, arguments));
  }

  createClass(AdRule, [{
    key: 'createExecute',
    value: function createExecute(fields, params) {
      return this.createEdge('/execute', fields, params);
    }
  }, {
    key: 'getHistory',
    value: function getHistory(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdRuleHistory, fields, params, fetchFirstPage, '/history');
    }
  }, {
    key: 'createPreview',
    value: function createPreview(fields, params) {
      return this.createEdge('/preview', fields, params, AdRule);
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(AdRule.prototype.__proto__ || Object.getPrototypeOf(AdRule.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(AdRule.prototype.__proto__ || Object.getPrototypeOf(AdRule.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        created_by: 'created_by',
        created_time: 'created_time',
        evaluation_spec: 'evaluation_spec',
        execution_spec: 'execution_spec',
        id: 'id',
        name: 'name',
        schedule_spec: 'schedule_spec',
        status: 'status',
        updated_time: 'updated_time'
      });
    }
  }, {
    key: 'Status',
    get: function get() {
      return Object.freeze({
        deleted: 'DELETED',
        disabled: 'DISABLED',
        enabled: 'ENABLED'
      });
    }
  }]);
  return AdRule;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdsInsights
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdsInsights = function (_AbstractCrudObject) {
  inherits(AdsInsights, _AbstractCrudObject);

  function AdsInsights() {
    classCallCheck(this, AdsInsights);
    return possibleConstructorReturn(this, (AdsInsights.__proto__ || Object.getPrototypeOf(AdsInsights)).apply(this, arguments));
  }

  createClass(AdsInsights, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        account_currency: 'account_currency',
        account_id: 'account_id',
        account_name: 'account_name',
        action_values: 'action_values',
        actions: 'actions',
        activity_recency: 'activity_recency',
        ad_click_actions: 'ad_click_actions',
        ad_format_asset: 'ad_format_asset',
        ad_id: 'ad_id',
        ad_impression_actions: 'ad_impression_actions',
        ad_name: 'ad_name',
        adset_id: 'adset_id',
        adset_name: 'adset_name',
        age: 'age',
        age_targeting: 'age_targeting',
        auction_bid: 'auction_bid',
        auction_competitiveness: 'auction_competitiveness',
        auction_max_competitor_bid: 'auction_max_competitor_bid',
        body_asset: 'body_asset',
        buying_type: 'buying_type',
        call_to_action_asset: 'call_to_action_asset',
        campaign_id: 'campaign_id',
        campaign_name: 'campaign_name',
        canvas_avg_view_percent: 'canvas_avg_view_percent',
        canvas_avg_view_time: 'canvas_avg_view_time',
        clicks: 'clicks',
        conversion_values: 'conversion_values',
        conversions: 'conversions',
        cost_per_10_sec_video_view: 'cost_per_10_sec_video_view',
        cost_per_15_sec_video_view: 'cost_per_15_sec_video_view',
        cost_per_2_sec_continuous_video_view: 'cost_per_2_sec_continuous_video_view',
        cost_per_action_type: 'cost_per_action_type',
        cost_per_ad_click: 'cost_per_ad_click',
        cost_per_conversion: 'cost_per_conversion',
        cost_per_dda_countby_convs: 'cost_per_dda_countby_convs',
        cost_per_estimated_ad_recallers: 'cost_per_estimated_ad_recallers',
        cost_per_inline_link_click: 'cost_per_inline_link_click',
        cost_per_inline_post_engagement: 'cost_per_inline_post_engagement',
        cost_per_one_thousand_ad_impression: 'cost_per_one_thousand_ad_impression',
        cost_per_outbound_click: 'cost_per_outbound_click',
        cost_per_thruplay: 'cost_per_thruplay',
        cost_per_unique_action_type: 'cost_per_unique_action_type',
        cost_per_unique_click: 'cost_per_unique_click',
        cost_per_unique_conversion: 'cost_per_unique_conversion',
        cost_per_unique_inline_link_click: 'cost_per_unique_inline_link_click',
        cost_per_unique_outbound_click: 'cost_per_unique_outbound_click',
        country: 'country',
        cpc: 'cpc',
        cpm: 'cpm',
        cpp: 'cpp',
        created_time: 'created_time',
        creative_fingerprint: 'creative_fingerprint',
        ctr: 'ctr',
        date_start: 'date_start',
        date_stop: 'date_stop',
        dda_countby_convs: 'dda_countby_convs',
        description_asset: 'description_asset',
        device_platform: 'device_platform',
        dma: 'dma',
        estimated_ad_recall_rate: 'estimated_ad_recall_rate',
        estimated_ad_recall_rate_lower_bound: 'estimated_ad_recall_rate_lower_bound',
        estimated_ad_recall_rate_upper_bound: 'estimated_ad_recall_rate_upper_bound',
        estimated_ad_recallers: 'estimated_ad_recallers',
        estimated_ad_recallers_lower_bound: 'estimated_ad_recallers_lower_bound',
        estimated_ad_recallers_upper_bound: 'estimated_ad_recallers_upper_bound',
        frequency: 'frequency',
        frequency_value: 'frequency_value',
        gender: 'gender',
        gender_targeting: 'gender_targeting',
        hourly_stats_aggregated_by_advertiser_time_zone: 'hourly_stats_aggregated_by_advertiser_time_zone',
        hourly_stats_aggregated_by_audience_time_zone: 'hourly_stats_aggregated_by_audience_time_zone',
        image_asset: 'image_asset',
        impression_device: 'impression_device',
        impressions: 'impressions',
        impressions_dummy: 'impressions_dummy',
        inline_link_click_ctr: 'inline_link_click_ctr',
        inline_link_clicks: 'inline_link_clicks',
        inline_post_engagement: 'inline_post_engagement',
        labels: 'labels',
        link_url_asset: 'link_url_asset',
        location: 'location',
        media_asset: 'media_asset',
        mobile_app_purchase_roas: 'mobile_app_purchase_roas',
        objective: 'objective',
        outbound_clicks: 'outbound_clicks',
        outbound_clicks_ctr: 'outbound_clicks_ctr',
        place_page_id: 'place_page_id',
        place_page_name: 'place_page_name',
        placement: 'placement',
        platform_position: 'platform_position',
        product_id: 'product_id',
        publisher_platform: 'publisher_platform',
        purchase_roas: 'purchase_roas',
        reach: 'reach',
        region: 'region',
        relevance_score: 'relevance_score',
        rule_asset: 'rule_asset',
        social_spend: 'social_spend',
        spend: 'spend',
        title_asset: 'title_asset',
        unique_actions: 'unique_actions',
        unique_clicks: 'unique_clicks',
        unique_conversions: 'unique_conversions',
        unique_ctr: 'unique_ctr',
        unique_inline_link_click_ctr: 'unique_inline_link_click_ctr',
        unique_inline_link_clicks: 'unique_inline_link_clicks',
        unique_link_clicks_ctr: 'unique_link_clicks_ctr',
        unique_outbound_clicks: 'unique_outbound_clicks',
        unique_outbound_clicks_ctr: 'unique_outbound_clicks_ctr',
        unique_video_continuous_2_sec_watched_actions: 'unique_video_continuous_2_sec_watched_actions',
        unique_video_view_10_sec: 'unique_video_view_10_sec',
        unique_video_view_15_sec: 'unique_video_view_15_sec',
        updated_time: 'updated_time',
        video_10_sec_watched_actions: 'video_10_sec_watched_actions',
        video_15_sec_watched_actions: 'video_15_sec_watched_actions',
        video_30_sec_watched_actions: 'video_30_sec_watched_actions',
        video_asset: 'video_asset',
        video_avg_percent_watched_actions: 'video_avg_percent_watched_actions',
        video_avg_time_watched_actions: 'video_avg_time_watched_actions',
        video_continuous_2_sec_watched_actions: 'video_continuous_2_sec_watched_actions',
        video_p100_watched_actions: 'video_p100_watched_actions',
        video_p25_watched_actions: 'video_p25_watched_actions',
        video_p50_watched_actions: 'video_p50_watched_actions',
        video_p75_watched_actions: 'video_p75_watched_actions',
        video_p95_watched_actions: 'video_p95_watched_actions',
        video_play_actions: 'video_play_actions',
        video_play_curve_actions: 'video_play_curve_actions',
        video_play_retention_0_to_15s_actions: 'video_play_retention_0_to_15s_actions',
        video_play_retention_20_to_60s_actions: 'video_play_retention_20_to_60s_actions',
        video_play_retention_graph_actions: 'video_play_retention_graph_actions',
        video_thruplay_watched_actions: 'video_thruplay_watched_actions',
        video_time_watched_actions: 'video_time_watched_actions',
        website_ctr: 'website_ctr',
        website_purchase_roas: 'website_purchase_roas',
        wish_bid: 'wish_bid'
      });
    }
  }, {
    key: 'ActionAttributionWindows',
    get: function get() {
      return Object.freeze({
        value_1d_click: '1d_click',
        value_1d_view: '1d_view',
        value_28d_click: '28d_click',
        value_28d_view: '28d_view',
        value_7d_click: '7d_click',
        value_7d_view: '7d_view',
        default: 'default'
      });
    }
  }, {
    key: 'ActionBreakdowns',
    get: function get() {
      return Object.freeze({
        action_canvas_component_name: 'action_canvas_component_name',
        action_carousel_card_id: 'action_carousel_card_id',
        action_carousel_card_name: 'action_carousel_card_name',
        action_destination: 'action_destination',
        action_device: 'action_device',
        action_reaction: 'action_reaction',
        action_target_id: 'action_target_id',
        action_type: 'action_type',
        action_video_sound: 'action_video_sound',
        action_video_type: 'action_video_type'
      });
    }
  }, {
    key: 'ActionReportTime',
    get: function get() {
      return Object.freeze({
        conversion: 'conversion',
        impression: 'impression'
      });
    }
  }, {
    key: 'Breakdowns',
    get: function get() {
      return Object.freeze({
        ad_format_asset: 'ad_format_asset',
        age: 'age',
        body_asset: 'body_asset',
        call_to_action_asset: 'call_to_action_asset',
        country: 'country',
        description_asset: 'description_asset',
        device_platform: 'device_platform',
        dma: 'dma',
        frequency_value: 'frequency_value',
        gender: 'gender',
        hourly_stats_aggregated_by_advertiser_time_zone: 'hourly_stats_aggregated_by_advertiser_time_zone',
        hourly_stats_aggregated_by_audience_time_zone: 'hourly_stats_aggregated_by_audience_time_zone',
        image_asset: 'image_asset',
        impression_device: 'impression_device',
        link_url_asset: 'link_url_asset',
        place_page_id: 'place_page_id',
        platform_position: 'platform_position',
        product_id: 'product_id',
        publisher_platform: 'publisher_platform',
        region: 'region',
        title_asset: 'title_asset',
        video_asset: 'video_asset'
      });
    }
  }, {
    key: 'DatePreset',
    get: function get() {
      return Object.freeze({
        last_14d: 'last_14d',
        last_28d: 'last_28d',
        last_30d: 'last_30d',
        last_3d: 'last_3d',
        last_7d: 'last_7d',
        last_90d: 'last_90d',
        last_month: 'last_month',
        last_quarter: 'last_quarter',
        last_week_mon_sun: 'last_week_mon_sun',
        last_week_sun_sat: 'last_week_sun_sat',
        last_year: 'last_year',
        lifetime: 'lifetime',
        this_month: 'this_month',
        this_quarter: 'this_quarter',
        this_week_mon_today: 'this_week_mon_today',
        this_week_sun_today: 'this_week_sun_today',
        this_year: 'this_year',
        today: 'today',
        yesterday: 'yesterday'
      });
    }
  }, {
    key: 'Level',
    get: function get() {
      return Object.freeze({
        account: 'account',
        ad: 'ad',
        adset: 'adset',
        campaign: 'campaign'
      });
    }
  }, {
    key: 'SummaryActionBreakdowns',
    get: function get() {
      return Object.freeze({
        action_canvas_component_name: 'action_canvas_component_name',
        action_carousel_card_id: 'action_carousel_card_id',
        action_carousel_card_name: 'action_carousel_card_name',
        action_destination: 'action_destination',
        action_device: 'action_device',
        action_reaction: 'action_reaction',
        action_target_id: 'action_target_id',
        action_type: 'action_type',
        action_video_sound: 'action_video_sound',
        action_video_type: 'action_video_type'
      });
    }
  }]);
  return AdsInsights;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdReportRun
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdReportRun = function (_AbstractCrudObject) {
  inherits(AdReportRun, _AbstractCrudObject);

  function AdReportRun() {
    classCallCheck(this, AdReportRun);
    return possibleConstructorReturn(this, (AdReportRun.__proto__ || Object.getPrototypeOf(AdReportRun)).apply(this, arguments));
  }

  createClass(AdReportRun, [{
    key: 'getInsights',
    value: function getInsights(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdsInsights, fields, params, fetchFirstPage, '/insights');
    }
  }, {
    key: 'createRetry',
    value: function createRetry(fields, params) {
      return this.createEdge('/retry', fields, params, AdReportRun);
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(AdReportRun.prototype.__proto__ || Object.getPrototypeOf(AdReportRun.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(AdReportRun.prototype.__proto__ || Object.getPrototypeOf(AdReportRun.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        async_percent_completion: 'async_percent_completion',
        async_status: 'async_status',
        date_start: 'date_start',
        date_stop: 'date_stop',
        emails: 'emails',
        friendly_name: 'friendly_name',
        id: 'id',
        is_bookmarked: 'is_bookmarked',
        is_running: 'is_running',
        schedule_id: 'schedule_id',
        time_completed: 'time_completed',
        time_ref: 'time_ref'
      });
    }
  }]);
  return AdReportRun;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdKeywordStats
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdKeywordStats = function (_AbstractCrudObject) {
  inherits(AdKeywordStats, _AbstractCrudObject);

  function AdKeywordStats() {
    classCallCheck(this, AdKeywordStats);
    return possibleConstructorReturn(this, (AdKeywordStats.__proto__ || Object.getPrototypeOf(AdKeywordStats)).apply(this, arguments));
  }

  createClass(AdKeywordStats, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        actions: 'actions',
        clicks: 'clicks',
        cost_per_total_action: 'cost_per_total_action',
        cost_per_unique_click: 'cost_per_unique_click',
        cpc: 'cpc',
        cpm: 'cpm',
        cpp: 'cpp',
        ctr: 'ctr',
        frequency: 'frequency',
        id: 'id',
        impressions: 'impressions',
        name: 'name',
        reach: 'reach',
        spend: 'spend',
        total_actions: 'total_actions',
        total_unique_actions: 'total_unique_actions',
        unique_actions: 'unique_actions',
        unique_clicks: 'unique_clicks',
        unique_ctr: 'unique_ctr',
        unique_impressions: 'unique_impressions'
      });
    }
  }]);
  return AdKeywordStats;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Lead
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Lead = function (_AbstractCrudObject) {
  inherits(Lead, _AbstractCrudObject);

  function Lead() {
    classCallCheck(this, Lead);
    return possibleConstructorReturn(this, (Lead.__proto__ || Object.getPrototypeOf(Lead)).apply(this, arguments));
  }

  createClass(Lead, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        ad_id: 'ad_id',
        ad_name: 'ad_name',
        adset_id: 'adset_id',
        adset_name: 'adset_name',
        campaign_id: 'campaign_id',
        campaign_name: 'campaign_name',
        created_time: 'created_time',
        custom_disclaimer_responses: 'custom_disclaimer_responses',
        field_data: 'field_data',
        form_id: 'form_id',
        id: 'id',
        is_organic: 'is_organic',
        partner_name: 'partner_name',
        platform: 'platform',
        post: 'post',
        retailer_item_id: 'retailer_item_id'
      });
    }
  }]);
  return Lead;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * TargetingSentenceLine
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var TargetingSentenceLine = function (_AbstractCrudObject) {
  inherits(TargetingSentenceLine, _AbstractCrudObject);

  function TargetingSentenceLine() {
    classCallCheck(this, TargetingSentenceLine);
    return possibleConstructorReturn(this, (TargetingSentenceLine.__proto__ || Object.getPrototypeOf(TargetingSentenceLine)).apply(this, arguments));
  }

  createClass(TargetingSentenceLine, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        id: 'id',
        params: 'params',
        targetingsentencelines: 'targetingsentencelines'
      });
    }
  }]);
  return TargetingSentenceLine;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Ad
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Ad = function (_AbstractCrudObject) {
  inherits(Ad, _AbstractCrudObject);

  function Ad() {
    classCallCheck(this, Ad);
    return possibleConstructorReturn(this, (Ad.__proto__ || Object.getPrototypeOf(Ad)).apply(this, arguments));
  }

  createClass(Ad, [{
    key: 'getAdCreatives',
    value: function getAdCreatives(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdCreative, fields, params, fetchFirstPage, '/adcreatives');
    }
  }, {
    key: 'deleteAdLabels',
    value: function deleteAdLabels(params) {
      return get$1(Ad.prototype.__proto__ || Object.getPrototypeOf(Ad.prototype), 'deleteEdge', this).call(this, '/adlabels', params);
    }
  }, {
    key: 'createAdLabel',
    value: function createAdLabel(fields, params) {
      return this.createEdge('/adlabels', fields, params, Ad);
    }
  }, {
    key: 'getAdRulesGoverned',
    value: function getAdRulesGoverned(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdRule, fields, params, fetchFirstPage, '/adrules_governed');
    }
  }, {
    key: 'getCopies',
    value: function getCopies(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Ad, fields, params, fetchFirstPage, '/copies');
    }
  }, {
    key: 'createCopy',
    value: function createCopy(fields, params) {
      return this.createEdge('/copies', fields, params, Ad);
    }
  }, {
    key: 'getInsights',
    value: function getInsights(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdsInsights, fields, params, fetchFirstPage, '/insights');
    }
  }, {
    key: 'getInsightsAsync',
    value: function getInsightsAsync(fields, params) {
      return this.createEdge('/insights', fields, params, AdReportRun);
    }
  }, {
    key: 'getKeywordStats',
    value: function getKeywordStats(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdKeywordStats, fields, params, fetchFirstPage, '/keywordstats');
    }
  }, {
    key: 'getLeads',
    value: function getLeads(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Lead, fields, params, fetchFirstPage, '/leads');
    }
  }, {
    key: 'getPreviews',
    value: function getPreviews(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdPreview, fields, params, fetchFirstPage, '/previews');
    }
  }, {
    key: 'getTargetingSentenceLines',
    value: function getTargetingSentenceLines(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(TargetingSentenceLine, fields, params, fetchFirstPage, '/targetingsentencelines');
    }
  }, {
    key: 'createTrackingTag',
    value: function createTrackingTag(fields, params) {
      return this.createEdge('/trackingtag', fields, params);
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(Ad.prototype.__proto__ || Object.getPrototypeOf(Ad.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(Ad.prototype.__proto__ || Object.getPrototypeOf(Ad.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        ad_review_feedback: 'ad_review_feedback',
        adlabels: 'adlabels',
        adset: 'adset',
        adset_id: 'adset_id',
        bid_amount: 'bid_amount',
        bid_info: 'bid_info',
        bid_type: 'bid_type',
        campaign: 'campaign',
        campaign_id: 'campaign_id',
        configured_status: 'configured_status',
        conversion_specs: 'conversion_specs',
        created_time: 'created_time',
        creative: 'creative',
        demolink_hash: 'demolink_hash',
        display_sequence: 'display_sequence',
        effective_status: 'effective_status',
        engagement_audience: 'engagement_audience',
        failed_delivery_checks: 'failed_delivery_checks',
        id: 'id',
        issues_info: 'issues_info',
        last_updated_by_app_id: 'last_updated_by_app_id',
        name: 'name',
        priority: 'priority',
        recommendations: 'recommendations',
        source_ad: 'source_ad',
        source_ad_id: 'source_ad_id',
        status: 'status',
        targeting: 'targeting',
        tracking_and_conversion_with_defaults: 'tracking_and_conversion_with_defaults',
        tracking_specs: 'tracking_specs',
        updated_time: 'updated_time'
      });
    }
  }, {
    key: 'BidType',
    get: function get() {
      return Object.freeze({
        absolute_ocpm: 'ABSOLUTE_OCPM',
        cpa: 'CPA',
        cpc: 'CPC',
        cpm: 'CPM',
        multi_premium: 'MULTI_PREMIUM'
      });
    }
  }, {
    key: 'ConfiguredStatus',
    get: function get() {
      return Object.freeze({
        active: 'ACTIVE',
        archived: 'ARCHIVED',
        deleted: 'DELETED',
        paused: 'PAUSED'
      });
    }
  }, {
    key: 'EffectiveStatus',
    get: function get() {
      return Object.freeze({
        active: 'ACTIVE',
        adset_paused: 'ADSET_PAUSED',
        archived: 'ARCHIVED',
        campaign_paused: 'CAMPAIGN_PAUSED',
        deleted: 'DELETED',
        disapproved: 'DISAPPROVED',
        paused: 'PAUSED',
        pending_billing_info: 'PENDING_BILLING_INFO',
        pending_review: 'PENDING_REVIEW',
        preapproved: 'PREAPPROVED',
        with_issues: 'WITH_ISSUES'
      });
    }
  }, {
    key: 'Status',
    get: function get() {
      return Object.freeze({
        active: 'ACTIVE',
        archived: 'ARCHIVED',
        deleted: 'DELETED',
        paused: 'PAUSED'
      });
    }
  }, {
    key: 'DatePreset',
    get: function get() {
      return Object.freeze({
        last_14d: 'last_14d',
        last_28d: 'last_28d',
        last_30d: 'last_30d',
        last_3d: 'last_3d',
        last_7d: 'last_7d',
        last_90d: 'last_90d',
        last_month: 'last_month',
        last_quarter: 'last_quarter',
        last_week_mon_sun: 'last_week_mon_sun',
        last_week_sun_sat: 'last_week_sun_sat',
        last_year: 'last_year',
        lifetime: 'lifetime',
        this_month: 'this_month',
        this_quarter: 'this_quarter',
        this_week_mon_today: 'this_week_mon_today',
        this_week_sun_today: 'this_week_sun_today',
        this_year: 'this_year',
        today: 'today',
        yesterday: 'yesterday'
      });
    }
  }, {
    key: 'ExecutionOptions',
    get: function get() {
      return Object.freeze({
        include_recommendations: 'include_recommendations',
        synchronous_ad_review: 'synchronous_ad_review',
        validate_only: 'validate_only'
      });
    }
  }, {
    key: 'Operator',
    get: function get() {
      return Object.freeze({
        all: 'ALL',
        any: 'ANY'
      });
    }
  }, {
    key: 'StatusOption',
    get: function get() {
      return Object.freeze({
        active: 'ACTIVE',
        inherited_from_source: 'INHERITED_FROM_SOURCE',
        paused: 'PAUSED'
      });
    }
  }]);
  return Ad;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdActivity
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdActivity = function (_AbstractCrudObject) {
  inherits(AdActivity, _AbstractCrudObject);

  function AdActivity() {
    classCallCheck(this, AdActivity);
    return possibleConstructorReturn(this, (AdActivity.__proto__ || Object.getPrototypeOf(AdActivity)).apply(this, arguments));
  }

  createClass(AdActivity, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        actor_id: 'actor_id',
        actor_name: 'actor_name',
        application_id: 'application_id',
        application_name: 'application_name',
        date_time_in_timezone: 'date_time_in_timezone',
        event_time: 'event_time',
        event_type: 'event_type',
        extra_data: 'extra_data',
        object_id: 'object_id',
        object_name: 'object_name',
        object_type: 'object_type',
        translated_event_type: 'translated_event_type'
      });
    }
  }, {
    key: 'EventType',
    get: function get() {
      return Object.freeze({
        account_spending_limit_reached: 'account_spending_limit_reached',
        ad_account_add_user_to_role: 'ad_account_add_user_to_role',
        ad_account_billing_charge: 'ad_account_billing_charge',
        ad_account_billing_charge_failed: 'ad_account_billing_charge_failed',
        ad_account_billing_chargeback: 'ad_account_billing_chargeback',
        ad_account_billing_chargeback_reversal: 'ad_account_billing_chargeback_reversal',
        ad_account_billing_decline: 'ad_account_billing_decline',
        ad_account_billing_refund: 'ad_account_billing_refund',
        ad_account_remove_spend_limit: 'ad_account_remove_spend_limit',
        ad_account_remove_user_from_role: 'ad_account_remove_user_from_role',
        ad_account_reset_spend_limit: 'ad_account_reset_spend_limit',
        ad_account_set_business_information: 'ad_account_set_business_information',
        ad_account_update_spend_limit: 'ad_account_update_spend_limit',
        ad_account_update_status: 'ad_account_update_status',
        ad_review_approved: 'ad_review_approved',
        ad_review_declined: 'ad_review_declined',
        add_funding_source: 'add_funding_source',
        add_images: 'add_images',
        billing_event: 'billing_event',
        campaign_ended: 'campaign_ended',
        campaign_spending_limit_reached: 'campaign_spending_limit_reached',
        create_ad: 'create_ad',
        create_ad_set: 'create_ad_set',
        create_audience: 'create_audience',
        create_campaign_group: 'create_campaign_group',
        create_campaign_legacy: 'create_campaign_legacy',
        delete_audience: 'delete_audience',
        delete_images: 'delete_images',
        di_ad_set_learning_stage_exit: 'di_ad_set_learning_stage_exit',
        edit_and_update_ad_creative: 'edit_and_update_ad_creative',
        edit_images: 'edit_images',
        first_delivery_event: 'first_delivery_event',
        funding_event_initiated: 'funding_event_initiated',
        funding_event_successful: 'funding_event_successful',
        lifetime_budget_spent: 'lifetime_budget_spent',
        receive_audience: 'receive_audience',
        remove_funding_source: 'remove_funding_source',
        remove_shared_audience: 'remove_shared_audience',
        share_audience: 'share_audience',
        unknown: 'unknown',
        unshare_audience: 'unshare_audience',
        update_ad_bid_info: 'update_ad_bid_info',
        update_ad_bid_type: 'update_ad_bid_type',
        update_ad_creative: 'update_ad_creative',
        update_ad_friendly_name: 'update_ad_friendly_name',
        update_ad_labels: 'update_ad_labels',
        update_ad_run_status: 'update_ad_run_status',
        update_ad_run_status_to_be_set_after_review: 'update_ad_run_status_to_be_set_after_review',
        update_ad_set_ad_keywords: 'update_ad_set_ad_keywords',
        update_ad_set_bid_adjustments: 'update_ad_set_bid_adjustments',
        update_ad_set_bid_strategy: 'update_ad_set_bid_strategy',
        update_ad_set_bidding: 'update_ad_set_bidding',
        update_ad_set_budget: 'update_ad_set_budget',
        update_ad_set_duration: 'update_ad_set_duration',
        update_ad_set_name: 'update_ad_set_name',
        update_ad_set_optimization_goal: 'update_ad_set_optimization_goal',
        update_ad_set_run_status: 'update_ad_set_run_status',
        update_ad_set_target_spec: 'update_ad_set_target_spec',
        update_ad_targets_spec: 'update_ad_targets_spec',
        update_adgroup_stop_delivery: 'update_adgroup_stop_delivery',
        update_audience: 'update_audience',
        update_campaign_ad_scheduling: 'update_campaign_ad_scheduling',
        update_campaign_budget: 'update_campaign_budget',
        update_campaign_delivery_type: 'update_campaign_delivery_type',
        update_campaign_duration: 'update_campaign_duration',
        update_campaign_group_ad_scheduling: 'update_campaign_group_ad_scheduling',
        update_campaign_group_delivery_type: 'update_campaign_group_delivery_type',
        update_campaign_group_spend_cap: 'update_campaign_group_spend_cap',
        update_campaign_name: 'update_campaign_name',
        update_campaign_run_status: 'update_campaign_run_status'
      });
    }
  }, {
    key: 'Category',
    get: function get() {
      return Object.freeze({
        account: 'ACCOUNT',
        ad: 'AD',
        ad_keywords: 'AD_KEYWORDS',
        ad_set: 'AD_SET',
        audience: 'AUDIENCE',
        bid: 'BID',
        budget: 'BUDGET',
        campaign: 'CAMPAIGN',
        date: 'DATE',
        status: 'STATUS',
        targeting: 'TARGETING'
      });
    }
  }]);
  return AdActivity;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdPlacePageSet
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdPlacePageSet = function (_AbstractCrudObject) {
  inherits(AdPlacePageSet, _AbstractCrudObject);

  function AdPlacePageSet() {
    classCallCheck(this, AdPlacePageSet);
    return possibleConstructorReturn(this, (AdPlacePageSet.__proto__ || Object.getPrototypeOf(AdPlacePageSet)).apply(this, arguments));
  }

  createClass(AdPlacePageSet, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(AdPlacePageSet.prototype.__proto__ || Object.getPrototypeOf(AdPlacePageSet.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        id: 'id',
        location_types: 'location_types',
        name: 'name',
        pages_count: 'pages_count',
        parent_page: 'parent_page'
      });
    }
  }, {
    key: 'LocationTypes',
    get: function get() {
      return Object.freeze({
        home: 'home',
        recent: 'recent'
      });
    }
  }, {
    key: 'TargetedAreaType',
    get: function get() {
      return Object.freeze({
        custom_radius: 'CUSTOM_RADIUS',
        marketing_area: 'MARKETING_AREA',
        none: 'NONE'
      });
    }
  }]);
  return AdPlacePageSet;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCampaignDeliveryEstimate
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCampaignDeliveryEstimate = function (_AbstractCrudObject) {
  inherits(AdCampaignDeliveryEstimate, _AbstractCrudObject);

  function AdCampaignDeliveryEstimate() {
    classCallCheck(this, AdCampaignDeliveryEstimate);
    return possibleConstructorReturn(this, (AdCampaignDeliveryEstimate.__proto__ || Object.getPrototypeOf(AdCampaignDeliveryEstimate)).apply(this, arguments));
  }

  createClass(AdCampaignDeliveryEstimate, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        daily_outcomes_curve: 'daily_outcomes_curve',
        estimate_dau: 'estimate_dau',
        estimate_mau: 'estimate_mau',
        estimate_ready: 'estimate_ready'
      });
    }
  }, {
    key: 'OptimizationGoal',
    get: function get() {
      return Object.freeze({
        ad_recall_lift: 'AD_RECALL_LIFT',
        app_downloads: 'APP_DOWNLOADS',
        app_installs: 'APP_INSTALLS',
        brand_awareness: 'BRAND_AWARENESS',
        clicks: 'CLICKS',
        derived_events: 'DERIVED_EVENTS',
        engaged_users: 'ENGAGED_USERS',
        event_responses: 'EVENT_RESPONSES',
        impressions: 'IMPRESSIONS',
        landing_page_views: 'LANDING_PAGE_VIEWS',
        lead_generation: 'LEAD_GENERATION',
        link_clicks: 'LINK_CLICKS',
        none: 'NONE',
        offer_claims: 'OFFER_CLAIMS',
        offsite_conversions: 'OFFSITE_CONVERSIONS',
        page_engagement: 'PAGE_ENGAGEMENT',
        page_likes: 'PAGE_LIKES',
        post_engagement: 'POST_ENGAGEMENT',
        reach: 'REACH',
        replies: 'REPLIES',
        social_impressions: 'SOCIAL_IMPRESSIONS',
        thruplay: 'THRUPLAY',
        two_second_continuous_video_views: 'TWO_SECOND_CONTINUOUS_VIDEO_VIEWS',
        value: 'VALUE',
        video_views: 'VIDEO_VIEWS'
      });
    }
  }]);
  return AdCampaignDeliveryEstimate;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdSet
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdSet = function (_AbstractCrudObject) {
  inherits(AdSet, _AbstractCrudObject);

  function AdSet() {
    classCallCheck(this, AdSet);
    return possibleConstructorReturn(this, (AdSet.__proto__ || Object.getPrototypeOf(AdSet)).apply(this, arguments));
  }

  createClass(AdSet, [{
    key: 'getActivities',
    value: function getActivities(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdActivity, fields, params, fetchFirstPage, '/activities');
    }
  }, {
    key: 'getAdStudies',
    value: function getAdStudies(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdStudy, fields, params, fetchFirstPage, '/ad_studies');
    }
  }, {
    key: 'getAdCreatives',
    value: function getAdCreatives(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdCreative, fields, params, fetchFirstPage, '/adcreatives');
    }
  }, {
    key: 'deleteAdLabels',
    value: function deleteAdLabels(params) {
      return get$1(AdSet.prototype.__proto__ || Object.getPrototypeOf(AdSet.prototype), 'deleteEdge', this).call(this, '/adlabels', params);
    }
  }, {
    key: 'createAdLabel',
    value: function createAdLabel(fields, params) {
      return this.createEdge('/adlabels', fields, params, AdSet);
    }
  }, {
    key: 'getAdRulesGoverned',
    value: function getAdRulesGoverned(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdRule, fields, params, fetchFirstPage, '/adrules_governed');
    }
  }, {
    key: 'getAds',
    value: function getAds(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Ad, fields, params, fetchFirstPage, '/ads');
    }
  }, {
    key: 'createCopy',
    value: function createCopy(fields, params) {
      return this.createEdge('/copies', fields, params, AdSet);
    }
  }, {
    key: 'getDeliveryEstimate',
    value: function getDeliveryEstimate(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdCampaignDeliveryEstimate, fields, params, fetchFirstPage, '/delivery_estimate');
    }
  }, {
    key: 'getInsights',
    value: function getInsights(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdsInsights, fields, params, fetchFirstPage, '/insights');
    }
  }, {
    key: 'getInsightsAsync',
    value: function getInsightsAsync(fields, params) {
      return this.createEdge('/insights', fields, params, AdReportRun);
    }
  }, {
    key: 'getTargetingSentenceLines',
    value: function getTargetingSentenceLines(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(TargetingSentenceLine, fields, params, fetchFirstPage, '/targetingsentencelines');
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(AdSet.prototype.__proto__ || Object.getPrototypeOf(AdSet.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(AdSet.prototype.__proto__ || Object.getPrototypeOf(AdSet.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        ad_keywords: 'ad_keywords',
        adlabels: 'adlabels',
        adset_schedule: 'adset_schedule',
        asset_feed_id: 'asset_feed_id',
        attribution_spec: 'attribution_spec',
        best_creative: 'best_creative',
        bid_adjustments: 'bid_adjustments',
        bid_amount: 'bid_amount',
        bid_constraints: 'bid_constraints',
        bid_info: 'bid_info',
        bid_strategy: 'bid_strategy',
        billing_event: 'billing_event',
        budget_remaining: 'budget_remaining',
        campaign: 'campaign',
        campaign_id: 'campaign_id',
        configured_status: 'configured_status',
        created_time: 'created_time',
        creative_sequence: 'creative_sequence',
        daily_budget: 'daily_budget',
        daily_min_spend_target: 'daily_min_spend_target',
        daily_spend_cap: 'daily_spend_cap',
        destination_type: 'destination_type',
        effective_status: 'effective_status',
        end_time: 'end_time',
        frequency_control_specs: 'frequency_control_specs',
        full_funnel_exploration_mode: 'full_funnel_exploration_mode',
        id: 'id',
        instagram_actor_id: 'instagram_actor_id',
        is_dynamic_creative: 'is_dynamic_creative',
        issues_info: 'issues_info',
        lifetime_budget: 'lifetime_budget',
        lifetime_imps: 'lifetime_imps',
        lifetime_min_spend_target: 'lifetime_min_spend_target',
        lifetime_spend_cap: 'lifetime_spend_cap',
        name: 'name',
        optimization_goal: 'optimization_goal',
        optimization_sub_event: 'optimization_sub_event',
        pacing_type: 'pacing_type',
        promoted_object: 'promoted_object',
        recommendations: 'recommendations',
        recurring_budget_semantics: 'recurring_budget_semantics',
        review_feedback: 'review_feedback',
        rf_prediction_id: 'rf_prediction_id',
        source_adset: 'source_adset',
        source_adset_id: 'source_adset_id',
        start_time: 'start_time',
        status: 'status',
        targeting: 'targeting',
        time_based_ad_rotation_id_blocks: 'time_based_ad_rotation_id_blocks',
        time_based_ad_rotation_intervals: 'time_based_ad_rotation_intervals',
        updated_time: 'updated_time',
        use_new_app_click: 'use_new_app_click'
      });
    }
  }, {
    key: 'BidStrategy',
    get: function get() {
      return Object.freeze({
        lowest_cost_without_cap: 'LOWEST_COST_WITHOUT_CAP',
        lowest_cost_with_bid_cap: 'LOWEST_COST_WITH_BID_CAP',
        target_cost: 'TARGET_COST'
      });
    }
  }, {
    key: 'BillingEvent',
    get: function get() {
      return Object.freeze({
        app_installs: 'APP_INSTALLS',
        clicks: 'CLICKS',
        impressions: 'IMPRESSIONS',
        link_clicks: 'LINK_CLICKS',
        none: 'NONE',
        offer_claims: 'OFFER_CLAIMS',
        page_likes: 'PAGE_LIKES',
        post_engagement: 'POST_ENGAGEMENT',
        thruplay: 'THRUPLAY',
        video_views: 'VIDEO_VIEWS'
      });
    }
  }, {
    key: 'ConfiguredStatus',
    get: function get() {
      return Object.freeze({
        active: 'ACTIVE',
        archived: 'ARCHIVED',
        deleted: 'DELETED',
        paused: 'PAUSED'
      });
    }
  }, {
    key: 'EffectiveStatus',
    get: function get() {
      return Object.freeze({
        active: 'ACTIVE',
        archived: 'ARCHIVED',
        deleted: 'DELETED',
        paused: 'PAUSED'
      });
    }
  }, {
    key: 'OptimizationGoal',
    get: function get() {
      return Object.freeze({
        ad_recall_lift: 'AD_RECALL_LIFT',
        app_downloads: 'APP_DOWNLOADS',
        app_installs: 'APP_INSTALLS',
        brand_awareness: 'BRAND_AWARENESS',
        clicks: 'CLICKS',
        derived_events: 'DERIVED_EVENTS',
        engaged_users: 'ENGAGED_USERS',
        event_responses: 'EVENT_RESPONSES',
        impressions: 'IMPRESSIONS',
        landing_page_views: 'LANDING_PAGE_VIEWS',
        lead_generation: 'LEAD_GENERATION',
        link_clicks: 'LINK_CLICKS',
        none: 'NONE',
        offer_claims: 'OFFER_CLAIMS',
        offsite_conversions: 'OFFSITE_CONVERSIONS',
        page_engagement: 'PAGE_ENGAGEMENT',
        page_likes: 'PAGE_LIKES',
        post_engagement: 'POST_ENGAGEMENT',
        reach: 'REACH',
        replies: 'REPLIES',
        social_impressions: 'SOCIAL_IMPRESSIONS',
        thruplay: 'THRUPLAY',
        two_second_continuous_video_views: 'TWO_SECOND_CONTINUOUS_VIDEO_VIEWS',
        value: 'VALUE',
        video_views: 'VIDEO_VIEWS'
      });
    }
  }, {
    key: 'Status',
    get: function get() {
      return Object.freeze({
        active: 'ACTIVE',
        archived: 'ARCHIVED',
        deleted: 'DELETED',
        paused: 'PAUSED'
      });
    }
  }, {
    key: 'DatePreset',
    get: function get() {
      return Object.freeze({
        last_14d: 'last_14d',
        last_28d: 'last_28d',
        last_30d: 'last_30d',
        last_3d: 'last_3d',
        last_7d: 'last_7d',
        last_90d: 'last_90d',
        last_month: 'last_month',
        last_quarter: 'last_quarter',
        last_week_mon_sun: 'last_week_mon_sun',
        last_week_sun_sat: 'last_week_sun_sat',
        last_year: 'last_year',
        lifetime: 'lifetime',
        this_month: 'this_month',
        this_quarter: 'this_quarter',
        this_week_mon_today: 'this_week_mon_today',
        this_week_sun_today: 'this_week_sun_today',
        this_year: 'this_year',
        today: 'today',
        yesterday: 'yesterday'
      });
    }
  }, {
    key: 'DestinationType',
    get: function get() {
      return Object.freeze({
        app: 'APP',
        applinks_automatic: 'APPLINKS_AUTOMATIC',
        messenger: 'MESSENGER',
        undefined: 'UNDEFINED',
        website: 'WEBSITE'
      });
    }
  }, {
    key: 'ExecutionOptions',
    get: function get() {
      return Object.freeze({
        include_recommendations: 'include_recommendations',
        validate_only: 'validate_only'
      });
    }
  }, {
    key: 'FullFunnelExplorationMode',
    get: function get() {
      return Object.freeze({
        extended_exploration: 'EXTENDED_EXPLORATION',
        limited_exploration: 'LIMITED_EXPLORATION',
        none_exploration: 'NONE_EXPLORATION'
      });
    }
  }, {
    key: 'OptimizationSubEvent',
    get: function get() {
      return Object.freeze({
        none: 'NONE',
        travel_intent: 'TRAVEL_INTENT',
        travel_intent_bucket_01: 'TRAVEL_INTENT_BUCKET_01',
        travel_intent_bucket_02: 'TRAVEL_INTENT_BUCKET_02',
        travel_intent_bucket_03: 'TRAVEL_INTENT_BUCKET_03',
        travel_intent_bucket_04: 'TRAVEL_INTENT_BUCKET_04',
        travel_intent_bucket_05: 'TRAVEL_INTENT_BUCKET_05',
        travel_intent_no_destination_intent: 'TRAVEL_INTENT_NO_DESTINATION_INTENT',
        trip_consideration: 'TRIP_CONSIDERATION',
        video_sound_on: 'VIDEO_SOUND_ON'
      });
    }
  }, {
    key: 'Operator',
    get: function get() {
      return Object.freeze({
        all: 'ALL',
        any: 'ANY'
      });
    }
  }, {
    key: 'StatusOption',
    get: function get() {
      return Object.freeze({
        active: 'ACTIVE',
        inherited_from_source: 'INHERITED_FROM_SOURCE',
        paused: 'PAUSED'
      });
    }
  }]);
  return AdSet;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Campaign
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Campaign = function (_AbstractCrudObject) {
  inherits(Campaign, _AbstractCrudObject);

  function Campaign() {
    classCallCheck(this, Campaign);
    return possibleConstructorReturn(this, (Campaign.__proto__ || Object.getPrototypeOf(Campaign)).apply(this, arguments));
  }

  createClass(Campaign, [{
    key: 'deleteAdLabels',
    value: function deleteAdLabels(params) {
      return get$1(Campaign.prototype.__proto__ || Object.getPrototypeOf(Campaign.prototype), 'deleteEdge', this).call(this, '/adlabels', params);
    }
  }, {
    key: 'createAdLabel',
    value: function createAdLabel(fields, params) {
      return this.createEdge('/adlabels', fields, params, Campaign);
    }
  }, {
    key: 'getAdRulesGoverned',
    value: function getAdRulesGoverned(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdRule, fields, params, fetchFirstPage, '/adrules_governed');
    }
  }, {
    key: 'getAds',
    value: function getAds(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Ad, fields, params, fetchFirstPage, '/ads');
    }
  }, {
    key: 'getAdSets',
    value: function getAdSets(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdSet, fields, params, fetchFirstPage, '/adsets');
    }
  }, {
    key: 'getCopies',
    value: function getCopies(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Campaign, fields, params, fetchFirstPage, '/copies');
    }
  }, {
    key: 'createCopy',
    value: function createCopy(fields, params) {
      return this.createEdge('/copies', fields, params, Campaign);
    }
  }, {
    key: 'getInsights',
    value: function getInsights(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdsInsights, fields, params, fetchFirstPage, '/insights');
    }
  }, {
    key: 'getInsightsAsync',
    value: function getInsightsAsync(fields, params) {
      return this.createEdge('/insights', fields, params, AdReportRun);
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(Campaign.prototype.__proto__ || Object.getPrototypeOf(Campaign.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(Campaign.prototype.__proto__ || Object.getPrototypeOf(Campaign.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        adlabels: 'adlabels',
        bid_strategy: 'bid_strategy',
        boosted_object_id: 'boosted_object_id',
        brand_lift_studies: 'brand_lift_studies',
        budget_rebalance_flag: 'budget_rebalance_flag',
        budget_remaining: 'budget_remaining',
        buying_type: 'buying_type',
        can_create_brand_lift_study: 'can_create_brand_lift_study',
        can_use_spend_cap: 'can_use_spend_cap',
        configured_status: 'configured_status',
        created_time: 'created_time',
        daily_budget: 'daily_budget',
        effective_status: 'effective_status',
        id: 'id',
        issues_info: 'issues_info',
        last_budget_toggling_time: 'last_budget_toggling_time',
        lifetime_budget: 'lifetime_budget',
        name: 'name',
        objective: 'objective',
        pacing_type: 'pacing_type',
        promoted_object: 'promoted_object',
        recommendations: 'recommendations',
        source_campaign: 'source_campaign',
        source_campaign_id: 'source_campaign_id',
        spend_cap: 'spend_cap',
        start_time: 'start_time',
        status: 'status',
        stop_time: 'stop_time',
        topline_id: 'topline_id',
        updated_time: 'updated_time'
      });
    }
  }, {
    key: 'BidStrategy',
    get: function get() {
      return Object.freeze({
        lowest_cost_without_cap: 'LOWEST_COST_WITHOUT_CAP',
        lowest_cost_with_bid_cap: 'LOWEST_COST_WITH_BID_CAP',
        target_cost: 'TARGET_COST'
      });
    }
  }, {
    key: 'ConfiguredStatus',
    get: function get() {
      return Object.freeze({
        active: 'ACTIVE',
        archived: 'ARCHIVED',
        deleted: 'DELETED',
        paused: 'PAUSED'
      });
    }
  }, {
    key: 'EffectiveStatus',
    get: function get() {
      return Object.freeze({
        active: 'ACTIVE',
        archived: 'ARCHIVED',
        deleted: 'DELETED',
        paused: 'PAUSED'
      });
    }
  }, {
    key: 'Status',
    get: function get() {
      return Object.freeze({
        active: 'ACTIVE',
        archived: 'ARCHIVED',
        deleted: 'DELETED',
        paused: 'PAUSED'
      });
    }
  }, {
    key: 'DatePreset',
    get: function get() {
      return Object.freeze({
        last_14d: 'last_14d',
        last_28d: 'last_28d',
        last_30d: 'last_30d',
        last_3d: 'last_3d',
        last_7d: 'last_7d',
        last_90d: 'last_90d',
        last_month: 'last_month',
        last_quarter: 'last_quarter',
        last_week_mon_sun: 'last_week_mon_sun',
        last_week_sun_sat: 'last_week_sun_sat',
        last_year: 'last_year',
        lifetime: 'lifetime',
        this_month: 'this_month',
        this_quarter: 'this_quarter',
        this_week_mon_today: 'this_week_mon_today',
        this_week_sun_today: 'this_week_sun_today',
        this_year: 'this_year',
        today: 'today',
        yesterday: 'yesterday'
      });
    }
  }, {
    key: 'ExecutionOptions',
    get: function get() {
      return Object.freeze({
        include_recommendations: 'include_recommendations',
        validate_only: 'validate_only'
      });
    }
  }, {
    key: 'Objective',
    get: function get() {
      return Object.freeze({
        app_installs: 'APP_INSTALLS',
        brand_awareness: 'BRAND_AWARENESS',
        conversions: 'CONVERSIONS',
        event_responses: 'EVENT_RESPONSES',
        lead_generation: 'LEAD_GENERATION',
        link_clicks: 'LINK_CLICKS',
        local_awareness: 'LOCAL_AWARENESS',
        messages: 'MESSAGES',
        offer_claims: 'OFFER_CLAIMS',
        page_likes: 'PAGE_LIKES',
        post_engagement: 'POST_ENGAGEMENT',
        product_catalog_sales: 'PRODUCT_CATALOG_SALES',
        reach: 'REACH',
        video_views: 'VIDEO_VIEWS'
      });
    }
  }, {
    key: 'Operator',
    get: function get() {
      return Object.freeze({
        all: 'ALL',
        any: 'ANY'
      });
    }
  }, {
    key: 'StatusOption',
    get: function get() {
      return Object.freeze({
        active: 'ACTIVE',
        inherited_from_source: 'INHERITED_FROM_SOURCE',
        paused: 'PAUSED'
      });
    }
  }]);
  return Campaign;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdStudyCell
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdStudyCell = function (_AbstractCrudObject) {
  inherits(AdStudyCell, _AbstractCrudObject);

  function AdStudyCell() {
    classCallCheck(this, AdStudyCell);
    return possibleConstructorReturn(this, (AdStudyCell.__proto__ || Object.getPrototypeOf(AdStudyCell)).apply(this, arguments));
  }

  createClass(AdStudyCell, [{
    key: 'getAdAccounts',
    value: function getAdAccounts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAccount, fields, params, fetchFirstPage, '/adaccounts');
    }
  }, {
    key: 'getAdSets',
    value: function getAdSets(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdSet, fields, params, fetchFirstPage, '/adsets');
    }
  }, {
    key: 'getCampaigns',
    value: function getCampaigns(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Campaign, fields, params, fetchFirstPage, '/campaigns');
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(AdStudyCell.prototype.__proto__ || Object.getPrototypeOf(AdStudyCell.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(AdStudyCell.prototype.__proto__ || Object.getPrototypeOf(AdStudyCell.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        ad_entities_count: 'ad_entities_count',
        control_percentage: 'control_percentage',
        id: 'id',
        name: 'name',
        treatment_percentage: 'treatment_percentage'
      });
    }
  }, {
    key: 'CreationTemplate',
    get: function get() {
      return Object.freeze({
        automatic_placements: 'AUTOMATIC_PLACEMENTS',
        brand_awareness: 'BRAND_AWARENESS',
        facebook: 'FACEBOOK',
        facebook_audience_network: 'FACEBOOK_AUDIENCE_NETWORK',
        facebook_instagram: 'FACEBOOK_INSTAGRAM',
        facebook_news_feed: 'FACEBOOK_NEWS_FEED',
        facebook_news_feed_in_stream_video: 'FACEBOOK_NEWS_FEED_IN_STREAM_VIDEO',
        high_frequency: 'HIGH_FREQUENCY',
        instagram: 'INSTAGRAM',
        in_stream_video: 'IN_STREAM_VIDEO',
        low_frequency: 'LOW_FREQUENCY',
        medium_frequency: 'MEDIUM_FREQUENCY',
        mobile_optimized_video: 'MOBILE_OPTIMIZED_VIDEO',
        page_post_engagement: 'PAGE_POST_ENGAGEMENT',
        reach: 'REACH',
        tv_commercial: 'TV_COMMERCIAL',
        tv_facebook: 'TV_FACEBOOK',
        video_view_optimization: 'VIDEO_VIEW_OPTIMIZATION'
      });
    }
  }]);
  return AdStudyCell;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdsTALHealthCheckError
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdsTALHealthCheckError = function (_AbstractCrudObject) {
  inherits(AdsTALHealthCheckError, _AbstractCrudObject);

  function AdsTALHealthCheckError() {
    classCallCheck(this, AdsTALHealthCheckError);
    return possibleConstructorReturn(this, (AdsTALHealthCheckError.__proto__ || Object.getPrototypeOf(AdsTALHealthCheckError)).apply(this, arguments));
  }

  createClass(AdsTALHealthCheckError, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        error_code: 'error_code',
        target_id: 'target_id'
      });
    }
  }]);
  return AdsTALHealthCheckError;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AssignedUser
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AssignedUser = function (_AbstractCrudObject) {
  inherits(AssignedUser, _AbstractCrudObject);

  function AssignedUser() {
    classCallCheck(this, AssignedUser);
    return possibleConstructorReturn(this, (AssignedUser.__proto__ || Object.getPrototypeOf(AssignedUser)).apply(this, arguments));
  }

  createClass(AssignedUser, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        business: 'business',
        id: 'id',
        name: 'name',
        user_type: 'user_type'
      });
    }
  }]);
  return AssignedUser;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * CustomAudiencePrefillState
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var CustomAudiencePrefillState = function (_AbstractCrudObject) {
  inherits(CustomAudiencePrefillState, _AbstractCrudObject);

  function CustomAudiencePrefillState() {
    classCallCheck(this, CustomAudiencePrefillState);
    return possibleConstructorReturn(this, (CustomAudiencePrefillState.__proto__ || Object.getPrototypeOf(CustomAudiencePrefillState)).apply(this, arguments));
  }

  createClass(CustomAudiencePrefillState, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        description: 'description',
        num_added: 'num_added',
        status: 'status'
      });
    }
  }]);
  return CustomAudiencePrefillState;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * CustomAudienceSession
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var CustomAudienceSession = function (_AbstractCrudObject) {
  inherits(CustomAudienceSession, _AbstractCrudObject);

  function CustomAudienceSession() {
    classCallCheck(this, CustomAudienceSession);
    return possibleConstructorReturn(this, (CustomAudienceSession.__proto__ || Object.getPrototypeOf(CustomAudienceSession)).apply(this, arguments));
  }

  createClass(CustomAudienceSession, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        end_time: 'end_time',
        num_invalid_entries: 'num_invalid_entries',
        num_matched: 'num_matched',
        num_received: 'num_received',
        progress: 'progress',
        session_id: 'session_id',
        stage: 'stage',
        start_time: 'start_time'
      });
    }
  }]);
  return CustomAudienceSession;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * CustomAudiencesharedAccountInfo
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var CustomAudiencesharedAccountInfo = function (_AbstractCrudObject) {
  inherits(CustomAudiencesharedAccountInfo, _AbstractCrudObject);

  function CustomAudiencesharedAccountInfo() {
    classCallCheck(this, CustomAudiencesharedAccountInfo);
    return possibleConstructorReturn(this, (CustomAudiencesharedAccountInfo.__proto__ || Object.getPrototypeOf(CustomAudiencesharedAccountInfo)).apply(this, arguments));
  }

  createClass(CustomAudiencesharedAccountInfo, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        account_name: 'account_name',
        business_id: 'business_id',
        business_name: 'business_name',
        sharing_status: 'sharing_status'
      });
    }
  }]);
  return CustomAudiencesharedAccountInfo;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * CustomAudience
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var CustomAudience = function (_AbstractCrudObject) {
  inherits(CustomAudience, _AbstractCrudObject);

  function CustomAudience() {
    classCallCheck(this, CustomAudience);
    return possibleConstructorReturn(this, (CustomAudience.__proto__ || Object.getPrototypeOf(CustomAudience)).apply(this, arguments));
  }

  createClass(CustomAudience, [{
    key: 'deleteAdAccounts',
    value: function deleteAdAccounts(params) {
      return get$1(CustomAudience.prototype.__proto__ || Object.getPrototypeOf(CustomAudience.prototype), 'deleteEdge', this).call(this, '/adaccounts', params);
    }
  }, {
    key: 'getAdAccounts',
    value: function getAdAccounts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAccount, fields, params, fetchFirstPage, '/adaccounts');
    }
  }, {
    key: 'createAdAccount',
    value: function createAdAccount(fields, params) {
      return this.createEdge('/adaccounts', fields, params, CustomAudience);
    }
  }, {
    key: 'getAds',
    value: function getAds(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Ad, fields, params, fetchFirstPage, '/ads');
    }
  }, {
    key: 'createCapability',
    value: function createCapability(fields, params) {
      return this.createEdge('/capabilities', fields, params);
    }
  }, {
    key: 'createDatum',
    value: function createDatum(fields, params) {
      return this.createEdge('/data', fields, params);
    }
  }, {
    key: 'getPrefills',
    value: function getPrefills(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(CustomAudiencePrefillState, fields, params, fetchFirstPage, '/prefills');
    }
  }, {
    key: 'getSessions',
    value: function getSessions(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(CustomAudienceSession, fields, params, fetchFirstPage, '/sessions');
    }
  }, {
    key: 'getSharedAccountInfo',
    value: function getSharedAccountInfo(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(CustomAudiencesharedAccountInfo, fields, params, fetchFirstPage, '/shared_account_info');
    }
  }, {
    key: 'deleteUpload',
    value: function deleteUpload(params) {
      return get$1(CustomAudience.prototype.__proto__ || Object.getPrototypeOf(CustomAudience.prototype), 'deleteEdge', this).call(this, '/upload', params);
    }
  }, {
    key: 'createUpload',
    value: function createUpload(fields, params) {
      return this.createEdge('/upload', fields, params, CustomAudience);
    }
  }, {
    key: 'deleteUsers',
    value: function deleteUsers(params) {
      return get$1(CustomAudience.prototype.__proto__ || Object.getPrototypeOf(CustomAudience.prototype), 'deleteEdge', this).call(this, '/users', params);
    }
  }, {
    key: 'createUser',
    value: function createUser(fields, params) {
      return this.createEdge('/users', fields, params, CustomAudience);
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(CustomAudience.prototype.__proto__ || Object.getPrototypeOf(CustomAudience.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(CustomAudience.prototype.__proto__ || Object.getPrototypeOf(CustomAudience.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        approximate_count: 'approximate_count',
        customer_file_source: 'customer_file_source',
        data_source: 'data_source',
        data_source_types: 'data_source_types',
        datafile_custom_audience_uploading_status: 'datafile_custom_audience_uploading_status',
        delivery_status: 'delivery_status',
        description: 'description',
        excluded_custom_audiences: 'excluded_custom_audiences',
        external_event_source: 'external_event_source',
        household_audience: 'household_audience',
        id: 'id',
        included_custom_audiences: 'included_custom_audiences',
        is_household: 'is_household',
        is_snapshot: 'is_snapshot',
        is_value_based: 'is_value_based',
        lookalike_audience_ids: 'lookalike_audience_ids',
        lookalike_spec: 'lookalike_spec',
        name: 'name',
        operation_status: 'operation_status',
        opt_out_link: 'opt_out_link',
        permission_for_actions: 'permission_for_actions',
        pixel_id: 'pixel_id',
        regulated_audience_spec: 'regulated_audience_spec',
        retention_days: 'retention_days',
        rev_share_policy_id: 'rev_share_policy_id',
        rule: 'rule',
        rule_aggregation: 'rule_aggregation',
        rule_v2: 'rule_v2',
        seed_audience: 'seed_audience',
        sharing_status: 'sharing_status',
        subtype: 'subtype',
        time_content_updated: 'time_content_updated',
        time_created: 'time_created',
        time_updated: 'time_updated'
      });
    }
  }, {
    key: 'ClaimObjective',
    get: function get() {
      return Object.freeze({
        automotive_model: 'AUTOMOTIVE_MODEL',
        collaborative_ads: 'COLLABORATIVE_ADS',
        home_listing: 'HOME_LISTING',
        media_title: 'MEDIA_TITLE',
        product: 'PRODUCT',
        travel: 'TRAVEL',
        vehicle: 'VEHICLE',
        vehicle_offer: 'VEHICLE_OFFER'
      });
    }
  }, {
    key: 'ContentType',
    get: function get() {
      return Object.freeze({
        automotive_model: 'AUTOMOTIVE_MODEL',
        destination: 'DESTINATION',
        flight: 'FLIGHT',
        home_listing: 'HOME_LISTING',
        hotel: 'HOTEL',
        media_title: 'MEDIA_TITLE',
        product: 'PRODUCT',
        vehicle: 'VEHICLE',
        vehicle_offer: 'VEHICLE_OFFER'
      });
    }
  }, {
    key: 'CustomerFileSource',
    get: function get() {
      return Object.freeze({
        both_user_and_partner_provided: 'BOTH_USER_AND_PARTNER_PROVIDED',
        partner_provided_only: 'PARTNER_PROVIDED_ONLY',
        user_provided_only: 'USER_PROVIDED_ONLY'
      });
    }
  }, {
    key: 'Subtype',
    get: function get() {
      return Object.freeze({
        app: 'APP',
        bag_of_accounts: 'BAG_OF_ACCOUNTS',
        claim: 'CLAIM',
        custom: 'CUSTOM',
        engagement: 'ENGAGEMENT',
        fox: 'FOX',
        lookalike: 'LOOKALIKE',
        managed: 'MANAGED',
        measurement: 'MEASUREMENT',
        offline_conversion: 'OFFLINE_CONVERSION',
        partner: 'PARTNER',
        regulated_categories_audience: 'REGULATED_CATEGORIES_AUDIENCE',
        study_rule_audience: 'STUDY_RULE_AUDIENCE',
        video: 'VIDEO',
        website: 'WEBSITE'
      });
    }
  }]);
  return CustomAudience;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * DACheck
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var DACheck = function (_AbstractCrudObject) {
  inherits(DACheck, _AbstractCrudObject);

  function DACheck() {
    classCallCheck(this, DACheck);
    return possibleConstructorReturn(this, (DACheck.__proto__ || Object.getPrototypeOf(DACheck)).apply(this, arguments));
  }

  createClass(DACheck, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        action_uri: 'action_uri',
        description: 'description',
        key: 'key',
        result: 'result',
        title: 'title',
        user_message: 'user_message'
      });
    }
  }]);
  return DACheck;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdAccountCreationRequest
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdAccountCreationRequest = function (_AbstractCrudObject) {
  inherits(AdAccountCreationRequest, _AbstractCrudObject);

  function AdAccountCreationRequest() {
    classCallCheck(this, AdAccountCreationRequest);
    return possibleConstructorReturn(this, (AdAccountCreationRequest.__proto__ || Object.getPrototypeOf(AdAccountCreationRequest)).apply(this, arguments));
  }

  createClass(AdAccountCreationRequest, [{
    key: 'getAdAccounts',
    value: function getAdAccounts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAccount, fields, params, fetchFirstPage, '/adaccounts');
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(AdAccountCreationRequest.prototype.__proto__ || Object.getPrototypeOf(AdAccountCreationRequest.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        ad_accounts_currency: 'ad_accounts_currency',
        ad_accounts_info: 'ad_accounts_info',
        additional_comment: 'additional_comment',
        address_in_chinese: 'address_in_chinese',
        address_in_english: 'address_in_english',
        address_in_local_language: 'address_in_local_language',
        advertiser_business: 'advertiser_business',
        appeal_reason: 'appeal_reason',
        business: 'business',
        business_registration_id: 'business_registration_id',
        chinese_legal_entity_name: 'chinese_legal_entity_name',
        contact: 'contact',
        creator: 'creator',
        credit_card_id: 'credit_card_id',
        disapproval_reasons: 'disapproval_reasons',
        english_legal_entity_name: 'english_legal_entity_name',
        extended_credit_id: 'extended_credit_id',
        id: 'id',
        is_smb: 'is_smb',
        is_test: 'is_test',
        is_under_authorization: 'is_under_authorization',
        legal_entity_name_in_local_language: 'legal_entity_name_in_local_language',
        oe_request_id: 'oe_request_id',
        official_website_url: 'official_website_url',
        planning_agency_business: 'planning_agency_business',
        planning_agency_business_id: 'planning_agency_business_id',
        promotable_app_ids: 'promotable_app_ids',
        promotable_page_ids: 'promotable_page_ids',
        promotable_urls: 'promotable_urls',
        request_change_reasons: 'request_change_reasons',
        status: 'status',
        subvertical: 'subvertical',
        time_created: 'time_created',
        vertical: 'vertical'
      });
    }
  }, {
    key: 'Subvertical',
    get: function get() {
      return Object.freeze({
        accounting_and_taxes_and_legal: 'ACCOUNTING_AND_TAXES_AND_LEGAL',
        agriculture_and_farming: 'AGRICULTURE_AND_FARMING',
        air: 'AIR',
        air_freight_or_package: 'AIR_FREIGHT_OR_PACKAGE',
        apparel_and_accessories: 'APPAREL_AND_ACCESSORIES',
        arts: 'ARTS',
        auctions: 'AUCTIONS',
        automotive_manufacturer: 'AUTOMOTIVE_MANUFACTURER',
        auto_agency: 'AUTO_AGENCY',
        auto_rental: 'AUTO_RENTAL',
        b2b: 'B2B',
        b2b_manufacturing: 'B2B_MANUFACTURING',
        beauty_and_personal_care: 'BEAUTY_AND_PERSONAL_CARE',
        beer_and_wine_and_liquor: 'BEER_AND_WINE_AND_LIQUOR',
        bookstores: 'BOOKSTORES',
        business_support_services: 'BUSINESS_SUPPORT_SERVICES',
        bus_and_taxi_and_auto_retal: 'BUS_AND_TAXI_AND_AUTO_RETAL',
        cable_and_satellite: 'CABLE_AND_SATELLITE',
        career: 'CAREER',
        computing_and_peripherals: 'COMPUTING_AND_PERIPHERALS',
        console_developer: 'CONSOLE_DEVELOPER',
        console_device: 'CONSOLE_DEVICE',
        construction_and_mining: 'CONSTRUCTION_AND_MINING',
        consulting: 'CONSULTING',
        consumer_electronics: 'CONSUMER_ELECTRONICS',
        consumer_tech: 'CONSUMER_TECH',
        credit_and_financing_and_mortages: 'CREDIT_AND_FINANCING_AND_MORTAGES',
        cruises_and_marine: 'CRUISES_AND_MARINE',
        cvb_convention_and_visitors_bureau: 'CVB_CONVENTION_AND_VISITORS_BUREAU',
        dailydeals: 'DAILYDEALS',
        dating: 'DATING',
        dealership: 'DEALERSHIP',
        department_store: 'DEPARTMENT_STORE',
        desktop_software: 'DESKTOP_SOFTWARE',
        digital_advertising_and_marketing_or_untagged_agencies: 'DIGITAL_ADVERTISING_AND_MARKETING_OR_UNTAGGED_AGENCIES',
        ecatalog: 'ECATALOG',
        ecommerce_agriculture_and_farming: 'ECOMMERCE_AGRICULTURE_AND_FARMING',
        education_resources: 'EDUCATION_RESOURCES',
        ed_tech: 'ED_TECH',
        elearning_and_massive_online_open_courses: 'ELEARNING_AND_MASSIVE_ONLINE_OPEN_COURSES',
        engineering_and_design: 'ENGINEERING_AND_DESIGN',
        events: 'EVENTS',
        family_and_health: 'FAMILY_AND_HEALTH',
        fitness: 'FITNESS',
        food: 'FOOD',
        footwear: 'FOOTWEAR',
        for_profit_colleges_and_universities: 'FOR_PROFIT_COLLEGES_AND_UNIVERSITIES',
        gambling: 'GAMBLING',
        government: 'GOVERNMENT',
        grocery_and_drug_and_convenience: 'GROCERY_AND_DRUG_AND_CONVENIENCE',
        highways: 'HIGHWAYS',
        home_and_office: 'HOME_AND_OFFICE',
        home_improvement: 'HOME_IMPROVEMENT',
        home_service: 'HOME_SERVICE',
        hotel_and_accomodation: 'HOTEL_AND_ACCOMODATION',
        household_goods: 'HOUSEHOLD_GOODS',
        industrial_and_farm_vehicle: 'INDUSTRIAL_AND_FARM_VEHICLE',
        insurance: 'INSURANCE',
        investment_bank_and_brokerage: 'INVESTMENT_BANK_AND_BROKERAGE',
        media: 'MEDIA',
        mobile_and_social: 'MOBILE_AND_SOCIAL',
        mobile_apps: 'MOBILE_APPS',
        motorcycles: 'MOTORCYCLES',
        movies: 'MOVIES',
        museums_and_parks_and_libraries: 'MUSEUMS_AND_PARKS_AND_LIBRARIES',
        music_and_radio: 'MUSIC_AND_RADIO',
        non_profit: 'NON_PROFIT',
        not_for_profit_colleges_and_universities: 'NOT_FOR_PROFIT_COLLEGES_AND_UNIVERSITIES',
        office: 'OFFICE',
        oil_and_gas_and_consumable_fuel: 'OIL_AND_GAS_AND_CONSUMABLE_FUEL',
        online_or_software: 'ONLINE_OR_SOFTWARE',
        other_wireline_services: 'OTHER_WIRELINE_SERVICES',
        parts_and_service: 'PARTS_AND_SERVICE',
        pet: 'PET',
        pet_retail: 'PET_RETAIL',
        pharmaceutical_or_health: 'PHARMACEUTICAL_OR_HEALTH',
        photography_and_filming_services: 'PHOTOGRAPHY_AND_FILMING_SERVICES',
        political: 'POLITICAL',
        pr: 'PR',
        publishing_internet: 'PUBLISHING_INTERNET',
        railroads: 'RAILROADS',
        real_estate: 'REAL_ESTATE',
        real_money_or_skilled_gaming: 'REAL_MONEY_OR_SKILLED_GAMING',
        recreational: 'RECREATIONAL',
        religious: 'RELIGIOUS',
        restaurant: 'RESTAURANT',
        retail_and_credit_union_and_commercial_bank: 'RETAIL_AND_CREDIT_UNION_AND_COMMERCIAL_BANK',
        school_and_early_children_edcation: 'SCHOOL_AND_EARLY_CHILDREN_EDCATION',
        seasonal_political_spenders: 'SEASONAL_POLITICAL_SPENDERS',
        smb_agents_and_promoters: 'SMB_AGENTS_AND_PROMOTERS',
        smb_artists_and_performers: 'SMB_ARTISTS_AND_PERFORMERS',
        smb_canvas: 'SMB_CANVAS',
        smb_catalog: 'SMB_CATALOG',
        smb_consumer_mobile_device: 'SMB_CONSUMER_MOBILE_DEVICE',
        smb_cross_platform: 'SMB_CROSS_PLATFORM',
        smb_electronics_and_appliances: 'SMB_ELECTRONICS_AND_APPLIANCES',
        smb_energy: 'SMB_ENERGY',
        smb_game_and_toy: 'SMB_GAME_AND_TOY',
        smb_information: 'SMB_INFORMATION',
        smb_navigation_and_measurement: 'SMB_NAVIGATION_AND_MEASUREMENT',
        smb_operations_and_other: 'SMB_OPERATIONS_AND_OTHER',
        smb_other: 'SMB_OTHER',
        smb_personal_care: 'SMB_PERSONAL_CARE',
        smb_religious: 'SMB_RELIGIOUS',
        smb_rentals: 'SMB_RENTALS',
        smb_repair_and_maintenance: 'SMB_REPAIR_AND_MAINTENANCE',
        software: 'SOFTWARE',
        sporting: 'SPORTING',
        sports: 'SPORTS',
        streaming: 'STREAMING',
        television: 'TELEVISION',
        tobacco: 'TOBACCO',
        toy_and_hobby: 'TOY_AND_HOBBY',
        trade_school: 'TRADE_SCHOOL',
        transportation_equipment: 'TRANSPORTATION_EQUIPMENT',
        traval_agency: 'TRAVAL_AGENCY',
        truck_and_moving: 'TRUCK_AND_MOVING',
        utilities_and_energy_equipment_and_services: 'UTILITIES_AND_ENERGY_EQUIPMENT_AND_SERVICES',
        water_and_soft_drink_and_baverage: 'WATER_AND_SOFT_DRINK_AND_BAVERAGE',
        wireless_services: 'WIRELESS_SERVICES'
      });
    }
  }, {
    key: 'Vertical',
    get: function get() {
      return Object.freeze({
        advertising_and_marketing: 'ADVERTISING_AND_MARKETING',
        automotive: 'AUTOMOTIVE',
        auto_agency: 'AUTO_AGENCY',
        consumer_packaged_goods: 'CONSUMER_PACKAGED_GOODS',
        cpg_and_beverage: 'CPG_AND_BEVERAGE',
        ecommerce: 'ECOMMERCE',
        education: 'EDUCATION',
        energy_and_utilities: 'ENERGY_AND_UTILITIES',
        entertainment_and_media: 'ENTERTAINMENT_AND_MEDIA',
        financial_services: 'FINANCIAL_SERVICES',
        gaming: 'GAMING',
        goverment_and_politics: 'GOVERMENT_AND_POLITICS',
        motorcycles: 'MOTORCYCLES',
        organizations_and_associations: 'ORGANIZATIONS_AND_ASSOCIATIONS',
        other: 'OTHER',
        professional_services: 'PROFESSIONAL_SERVICES',
        retail: 'RETAIL',
        technology: 'TECHNOLOGY',
        telecom: 'TELECOM',
        travel: 'TRAVEL'
      });
    }
  }]);
  return AdAccountCreationRequest;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdNetworkAnalyticsSyncQueryResult
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdNetworkAnalyticsSyncQueryResult = function (_AbstractCrudObject) {
  inherits(AdNetworkAnalyticsSyncQueryResult, _AbstractCrudObject);

  function AdNetworkAnalyticsSyncQueryResult() {
    classCallCheck(this, AdNetworkAnalyticsSyncQueryResult);
    return possibleConstructorReturn(this, (AdNetworkAnalyticsSyncQueryResult.__proto__ || Object.getPrototypeOf(AdNetworkAnalyticsSyncQueryResult)).apply(this, arguments));
  }

  createClass(AdNetworkAnalyticsSyncQueryResult, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        query_id: 'query_id',
        results: 'results'
      });
    }
  }, {
    key: 'AggregationPeriod',
    get: function get() {
      return Object.freeze({
        day: 'DAY',
        total: 'TOTAL'
      });
    }
  }, {
    key: 'Breakdowns',
    get: function get() {
      return Object.freeze({
        age: 'AGE',
        app: 'APP',
        clicked_view_tag: 'CLICKED_VIEW_TAG',
        country: 'COUNTRY',
        deal: 'DEAL',
        deal_ad: 'DEAL_AD',
        deal_page: 'DEAL_PAGE',
        delivery_method: 'DELIVERY_METHOD',
        display_format: 'DISPLAY_FORMAT',
        fail_reason: 'FAIL_REASON',
        gender: 'GENDER',
        placement: 'PLACEMENT',
        placement_name: 'PLACEMENT_NAME',
        platform: 'PLATFORM',
        property: 'PROPERTY',
        sdk_version: 'SDK_VERSION'
      });
    }
  }, {
    key: 'Metrics',
    get: function get() {
      return Object.freeze({
        fb_ad_network_bidding_bid_rate: 'FB_AD_NETWORK_BIDDING_BID_RATE',
        fb_ad_network_bidding_request: 'FB_AD_NETWORK_BIDDING_REQUEST',
        fb_ad_network_bidding_response: 'FB_AD_NETWORK_BIDDING_RESPONSE',
        fb_ad_network_bidding_revenue: 'FB_AD_NETWORK_BIDDING_REVENUE',
        fb_ad_network_bidding_win_rate: 'FB_AD_NETWORK_BIDDING_WIN_RATE',
        fb_ad_network_click: 'FB_AD_NETWORK_CLICK',
        fb_ad_network_cpm: 'FB_AD_NETWORK_CPM',
        fb_ad_network_ctr: 'FB_AD_NETWORK_CTR',
        fb_ad_network_filled_request: 'FB_AD_NETWORK_FILLED_REQUEST',
        fb_ad_network_fill_rate: 'FB_AD_NETWORK_FILL_RATE',
        fb_ad_network_imp: 'FB_AD_NETWORK_IMP',
        fb_ad_network_request: 'FB_AD_NETWORK_REQUEST',
        fb_ad_network_revenue: 'FB_AD_NETWORK_REVENUE',
        fb_ad_network_show_rate: 'FB_AD_NETWORK_SHOW_RATE',
        fb_ad_network_video_guarantee_revenue: 'FB_AD_NETWORK_VIDEO_GUARANTEE_REVENUE',
        fb_ad_network_video_mrc: 'FB_AD_NETWORK_VIDEO_MRC',
        fb_ad_network_video_mrc_rate: 'FB_AD_NETWORK_VIDEO_MRC_RATE',
        fb_ad_network_video_view: 'FB_AD_NETWORK_VIDEO_VIEW',
        fb_ad_network_video_view_rate: 'FB_AD_NETWORK_VIDEO_VIEW_RATE'
      });
    }
  }, {
    key: 'OrderingColumn',
    get: function get() {
      return Object.freeze({
        metric: 'METRIC',
        time: 'TIME',
        value: 'VALUE'
      });
    }
  }, {
    key: 'OrderingType',
    get: function get() {
      return Object.freeze({
        ascending: 'ASCENDING',
        descending: 'DESCENDING'
      });
    }
  }]);
  return AdNetworkAnalyticsSyncQueryResult;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdNetworkAnalyticsAsyncQueryResult
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdNetworkAnalyticsAsyncQueryResult = function (_AbstractCrudObject) {
  inherits(AdNetworkAnalyticsAsyncQueryResult, _AbstractCrudObject);

  function AdNetworkAnalyticsAsyncQueryResult() {
    classCallCheck(this, AdNetworkAnalyticsAsyncQueryResult);
    return possibleConstructorReturn(this, (AdNetworkAnalyticsAsyncQueryResult.__proto__ || Object.getPrototypeOf(AdNetworkAnalyticsAsyncQueryResult)).apply(this, arguments));
  }

  createClass(AdNetworkAnalyticsAsyncQueryResult, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        data: 'data',
        error: 'error',
        query_id: 'query_id',
        results: 'results',
        status: 'status'
      });
    }
  }]);
  return AdNetworkAnalyticsAsyncQueryResult;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * BusinessAdvertisableApplicationsResult
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var BusinessAdvertisableApplicationsResult = function (_AbstractCrudObject) {
  inherits(BusinessAdvertisableApplicationsResult, _AbstractCrudObject);

  function BusinessAdvertisableApplicationsResult() {
    classCallCheck(this, BusinessAdvertisableApplicationsResult);
    return possibleConstructorReturn(this, (BusinessAdvertisableApplicationsResult.__proto__ || Object.getPrototypeOf(BusinessAdvertisableApplicationsResult)).apply(this, arguments));
  }

  createClass(BusinessAdvertisableApplicationsResult, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        has_insight_permission: 'has_insight_permission',
        id: 'id',
        name: 'name',
        photo_url: 'photo_url'
      });
    }
  }]);
  return BusinessAdvertisableApplicationsResult;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdPlacement
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdPlacement = function (_AbstractCrudObject) {
  inherits(AdPlacement, _AbstractCrudObject);

  function AdPlacement() {
    classCallCheck(this, AdPlacement);
    return possibleConstructorReturn(this, (AdPlacement.__proto__ || Object.getPrototypeOf(AdPlacement)).apply(this, arguments));
  }

  createClass(AdPlacement, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        bundle_id: 'bundle_id',
        display_format: 'display_format',
        external_placement_id: 'external_placement_id',
        google_display_format: 'google_display_format',
        id: 'id',
        name: 'name',
        platform: 'platform',
        status: 'status'
      });
    }
  }]);
  return AdPlacement;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AtlasURL
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AtlasURL = function (_AbstractCrudObject) {
  inherits(AtlasURL, _AbstractCrudObject);

  function AtlasURL() {
    classCallCheck(this, AtlasURL);
    return possibleConstructorReturn(this, (AtlasURL.__proto__ || Object.getPrototypeOf(AtlasURL)).apply(this, arguments));
  }

  createClass(AtlasURL, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        url: 'url'
      });
    }
  }]);
  return AtlasURL;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * OracleTransaction
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var OracleTransaction = function (_AbstractCrudObject) {
  inherits(OracleTransaction, _AbstractCrudObject);

  function OracleTransaction() {
    classCallCheck(this, OracleTransaction);
    return possibleConstructorReturn(this, (OracleTransaction.__proto__ || Object.getPrototypeOf(OracleTransaction)).apply(this, arguments));
  }

  createClass(OracleTransaction, [{
    key: 'getData',
    value: function getData(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AtlasURL, fields, params, fetchFirstPage, '/data');
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        ad_account_ids: 'ad_account_ids',
        amount: 'amount',
        amount_due: 'amount_due',
        billed_amount_details: 'billed_amount_details',
        billing_period: 'billing_period',
        currency: 'currency',
        download_uri: 'download_uri',
        due_date: 'due_date',
        entity: 'entity',
        id: 'id',
        invoice_date: 'invoice_date',
        invoice_id: 'invoice_id',
        invoice_type: 'invoice_type',
        liability_type: 'liability_type',
        payment_status: 'payment_status',
        payment_term: 'payment_term',
        type: 'type'
      });
    }
  }, {
    key: 'Type',
    get: function get() {
      return Object.freeze({
        cm: 'CM',
        inv: 'INV'
      });
    }
  }]);
  return OracleTransaction;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * PageAdminNote
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var PageAdminNote = function (_AbstractCrudObject) {
  inherits(PageAdminNote, _AbstractCrudObject);

  function PageAdminNote() {
    classCallCheck(this, PageAdminNote);
    return possibleConstructorReturn(this, (PageAdminNote.__proto__ || Object.getPrototypeOf(PageAdminNote)).apply(this, arguments));
  }

  createClass(PageAdminNote, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        body: 'body',
        from: 'from',
        id: 'id',
        user: 'user'
      });
    }
  }]);
  return PageAdminNote;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ProfilePictureSource
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ProfilePictureSource = function (_AbstractCrudObject) {
  inherits(ProfilePictureSource, _AbstractCrudObject);

  function ProfilePictureSource() {
    classCallCheck(this, ProfilePictureSource);
    return possibleConstructorReturn(this, (ProfilePictureSource.__proto__ || Object.getPrototypeOf(ProfilePictureSource)).apply(this, arguments));
  }

  createClass(ProfilePictureSource, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        bottom: 'bottom',
        cache_key: 'cache_key',
        height: 'height',
        is_silhouette: 'is_silhouette',
        left: 'left',
        right: 'right',
        top: 'top',
        url: 'url',
        width: 'width'
      });
    }
  }, {
    key: 'Type',
    get: function get() {
      return Object.freeze({
        album: 'album',
        small: 'small',
        thumbnail: 'thumbnail'
      });
    }
  }]);
  return ProfilePictureSource;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Profile
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Profile = function (_AbstractCrudObject) {
  inherits(Profile, _AbstractCrudObject);

  function Profile() {
    classCallCheck(this, Profile);
    return possibleConstructorReturn(this, (Profile.__proto__ || Object.getPrototypeOf(Profile)).apply(this, arguments));
  }

  createClass(Profile, [{
    key: 'getPicture',
    value: function getPicture(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProfilePictureSource, fields, params, fetchFirstPage, '/picture');
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        can_post: 'can_post',
        id: 'id',
        link: 'link',
        name: 'name',
        pic: 'pic',
        pic_crop: 'pic_crop',
        pic_large: 'pic_large',
        pic_small: 'pic_small',
        pic_square: 'pic_square',
        profile_type: 'profile_type',
        username: 'username'
      });
    }
  }, {
    key: 'ProfileType',
    get: function get() {
      return Object.freeze({
        application: 'application',
        event: 'event',
        group: 'group',
        page: 'page',
        user: 'user'
      });
    }
  }, {
    key: 'Type',
    get: function get() {
      return Object.freeze({
        angry: 'ANGRY',
        haha: 'HAHA',
        like: 'LIKE',
        love: 'LOVE',
        none: 'NONE',
        pride: 'PRIDE',
        sad: 'SAD',
        thankful: 'THANKFUL',
        wow: 'WOW'
      });
    }
  }]);
  return Profile;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Comment
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Comment = function (_AbstractCrudObject) {
  inherits(Comment, _AbstractCrudObject);

  function Comment() {
    classCallCheck(this, Comment);
    return possibleConstructorReturn(this, (Comment.__proto__ || Object.getPrototypeOf(Comment)).apply(this, arguments));
  }

  createClass(Comment, [{
    key: 'getComments',
    value: function getComments(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Comment, fields, params, fetchFirstPage, '/comments');
    }
  }, {
    key: 'deleteLikes',
    value: function deleteLikes(params) {
      return get$1(Comment.prototype.__proto__ || Object.getPrototypeOf(Comment.prototype), 'deleteEdge', this).call(this, '/likes', params);
    }
  }, {
    key: 'getLikes',
    value: function getLikes(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Profile, fields, params, fetchFirstPage, '/likes');
    }
  }, {
    key: 'createLike',
    value: function createLike(fields, params) {
      return this.createEdge('/likes', fields, params, Comment);
    }
  }, {
    key: 'getReactions',
    value: function getReactions(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Profile, fields, params, fetchFirstPage, '/reactions');
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(Comment.prototype.__proto__ || Object.getPrototypeOf(Comment.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(Comment.prototype.__proto__ || Object.getPrototypeOf(Comment.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        admin_creator: 'admin_creator',
        application: 'application',
        attachment: 'attachment',
        can_comment: 'can_comment',
        can_hide: 'can_hide',
        can_like: 'can_like',
        can_remove: 'can_remove',
        comment_count: 'comment_count',
        created_time: 'created_time',
        from: 'from',
        id: 'id',
        is_hidden: 'is_hidden',
        is_private: 'is_private',
        like_count: 'like_count',
        live_broadcast_timestamp: 'live_broadcast_timestamp',
        message: 'message',
        message_tags: 'message_tags',
        object: 'object',
        parent: 'parent',
        permalink_url: 'permalink_url',
        user_likes: 'user_likes'
      });
    }
  }, {
    key: 'CommentPrivacyValue',
    get: function get() {
      return Object.freeze({
        default_privacy: 'DEFAULT_PRIVACY',
        friends_and_post_owner: 'FRIENDS_AND_POST_OWNER',
        friends_only: 'FRIENDS_ONLY',
        graphql_multiple_value_hack_do_not_use: 'GRAPHQL_MULTIPLE_VALUE_HACK_DO_NOT_USE',
        owner_or_commenter: 'OWNER_OR_COMMENTER',
        side_conversation: 'SIDE_CONVERSATION',
        side_conversation_and_post_owner: 'SIDE_CONVERSATION_AND_POST_OWNER'
      });
    }
  }, {
    key: 'Filter',
    get: function get() {
      return Object.freeze({
        stream: 'stream',
        toplevel: 'toplevel'
      });
    }
  }, {
    key: 'LiveFilter',
    get: function get() {
      return Object.freeze({
        filter_low_quality: 'filter_low_quality',
        no_filter: 'no_filter'
      });
    }
  }, {
    key: 'Order',
    get: function get() {
      return Object.freeze({
        chronological: 'chronological',
        reverse_chronological: 'reverse_chronological'
      });
    }
  }]);
  return Comment;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * InsightsResult
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var InsightsResult = function (_AbstractCrudObject) {
  inherits(InsightsResult, _AbstractCrudObject);

  function InsightsResult() {
    classCallCheck(this, InsightsResult);
    return possibleConstructorReturn(this, (InsightsResult.__proto__ || Object.getPrototypeOf(InsightsResult)).apply(this, arguments));
  }

  createClass(InsightsResult, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        description: 'description',
        description_from_api_doc: 'description_from_api_doc',
        id: 'id',
        name: 'name',
        period: 'period',
        title: 'title',
        values: 'values'
      });
    }
  }, {
    key: 'Metric',
    get: function get() {
      return Object.freeze({
        messages_sent: 'messages_sent'
      });
    }
  }, {
    key: 'DatePreset',
    get: function get() {
      return Object.freeze({
        last_14d: 'last_14d',
        last_28d: 'last_28d',
        last_30d: 'last_30d',
        last_3d: 'last_3d',
        last_7d: 'last_7d',
        last_90d: 'last_90d',
        last_month: 'last_month',
        last_quarter: 'last_quarter',
        last_week_mon_sun: 'last_week_mon_sun',
        last_week_sun_sat: 'last_week_sun_sat',
        last_year: 'last_year',
        lifetime: 'lifetime',
        this_month: 'this_month',
        this_quarter: 'this_quarter',
        this_week_mon_today: 'this_week_mon_today',
        this_week_sun_today: 'this_week_sun_today',
        this_year: 'this_year',
        today: 'today',
        yesterday: 'yesterday'
      });
    }
  }, {
    key: 'Period',
    get: function get() {
      return Object.freeze({
        day: 'day',
        days_28: 'days_28',
        lifetime: 'lifetime',
        month: 'month',
        week: 'week'
      });
    }
  }]);
  return InsightsResult;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * InstagramComment
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var InstagramComment = function (_AbstractCrudObject) {
  inherits(InstagramComment, _AbstractCrudObject);

  function InstagramComment() {
    classCallCheck(this, InstagramComment);
    return possibleConstructorReturn(this, (InstagramComment.__proto__ || Object.getPrototypeOf(InstagramComment)).apply(this, arguments));
  }

  createClass(InstagramComment, [{
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(InstagramComment.prototype.__proto__ || Object.getPrototypeOf(InstagramComment.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(InstagramComment.prototype.__proto__ || Object.getPrototypeOf(InstagramComment.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        comment_type: 'comment_type',
        created_at: 'created_at',
        id: 'id',
        instagram_comment_id: 'instagram_comment_id',
        instagram_user: 'instagram_user',
        mentioned_instagram_users: 'mentioned_instagram_users',
        message: 'message'
      });
    }
  }]);
  return InstagramComment;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * RTBDynamicPost
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var RTBDynamicPost = function (_AbstractCrudObject) {
  inherits(RTBDynamicPost, _AbstractCrudObject);

  function RTBDynamicPost() {
    classCallCheck(this, RTBDynamicPost);
    return possibleConstructorReturn(this, (RTBDynamicPost.__proto__ || Object.getPrototypeOf(RTBDynamicPost)).apply(this, arguments));
  }

  createClass(RTBDynamicPost, [{
    key: 'getInstagramComments',
    value: function getInstagramComments(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(InstagramComment, fields, params, fetchFirstPage, '/instagram_comments');
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        child_attachments: 'child_attachments',
        created: 'created',
        description: 'description',
        id: 'id',
        image_url: 'image_url',
        link: 'link',
        message: 'message',
        owner_id: 'owner_id',
        place_id: 'place_id',
        product_id: 'product_id',
        title: 'title'
      });
    }
  }]);
  return RTBDynamicPost;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Post
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Post = function (_AbstractCrudObject) {
  inherits(Post, _AbstractCrudObject);

  function Post() {
    classCallCheck(this, Post);
    return possibleConstructorReturn(this, (Post.__proto__ || Object.getPrototypeOf(Post)).apply(this, arguments));
  }

  createClass(Post, [{
    key: 'getAttachments',
    value: function getAttachments(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/attachments');
    }
  }, {
    key: 'getComments',
    value: function getComments(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Comment, fields, params, fetchFirstPage, '/comments');
    }
  }, {
    key: 'createComment',
    value: function createComment(fields, params) {
      return this.createEdge('/comments', fields, params, Comment);
    }
  }, {
    key: 'getDynamicPosts',
    value: function getDynamicPosts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(RTBDynamicPost, fields, params, fetchFirstPage, '/dynamic_posts');
    }
  }, {
    key: 'getInsights',
    value: function getInsights(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(InsightsResult, fields, params, fetchFirstPage, '/insights');
    }
  }, {
    key: 'deleteLikes',
    value: function deleteLikes(params) {
      return get$1(Post.prototype.__proto__ || Object.getPrototypeOf(Post.prototype), 'deleteEdge', this).call(this, '/likes', params);
    }
  }, {
    key: 'getLikes',
    value: function getLikes(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Profile, fields, params, fetchFirstPage, '/likes');
    }
  }, {
    key: 'createLike',
    value: function createLike(fields, params) {
      return this.createEdge('/likes', fields, params, Post);
    }
  }, {
    key: 'createPromotion',
    value: function createPromotion(fields, params) {
      return this.createEdge('/promotions', fields, params);
    }
  }, {
    key: 'getReactions',
    value: function getReactions(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Profile, fields, params, fetchFirstPage, '/reactions');
    }
  }, {
    key: 'getSeen',
    value: function getSeen(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(User, fields, params, fetchFirstPage, '/seen');
    }
  }, {
    key: 'getSharedPosts',
    value: function getSharedPosts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Post, fields, params, fetchFirstPage, '/sharedposts');
    }
  }, {
    key: 'getTo',
    value: function getTo(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Profile, fields, params, fetchFirstPage, '/to');
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(Post.prototype.__proto__ || Object.getPrototypeOf(Post.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(Post.prototype.__proto__ || Object.getPrototypeOf(Post.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        actions: 'actions',
        admin_creator: 'admin_creator',
        allowed_advertising_objectives: 'allowed_advertising_objectives',
        application: 'application',
        backdated_time: 'backdated_time',
        call_to_action: 'call_to_action',
        caption: 'caption',
        child_attachments: 'child_attachments',
        comments_mirroring_domain: 'comments_mirroring_domain',
        coordinates: 'coordinates',
        created_time: 'created_time',
        description: 'description',
        event: 'event',
        expanded_height: 'expanded_height',
        expanded_width: 'expanded_width',
        feed_targeting: 'feed_targeting',
        from: 'from',
        full_picture: 'full_picture',
        height: 'height',
        icon: 'icon',
        id: 'id',
        instagram_eligibility: 'instagram_eligibility',
        is_app_share: 'is_app_share',
        is_eligible_for_promotion: 'is_eligible_for_promotion',
        is_expired: 'is_expired',
        is_hidden: 'is_hidden',
        is_instagram_eligible: 'is_instagram_eligible',
        is_popular: 'is_popular',
        is_published: 'is_published',
        is_spherical: 'is_spherical',
        link: 'link',
        message: 'message',
        message_tags: 'message_tags',
        multi_share_end_card: 'multi_share_end_card',
        multi_share_optimized: 'multi_share_optimized',
        name: 'name',
        object_id: 'object_id',
        parent_id: 'parent_id',
        permalink_url: 'permalink_url',
        picture: 'picture',
        place: 'place',
        privacy: 'privacy',
        promotable_id: 'promotable_id',
        promotion_status: 'promotion_status',
        properties: 'properties',
        scheduled_publish_time: 'scheduled_publish_time',
        shares: 'shares',
        source: 'source',
        status_type: 'status_type',
        story: 'story',
        story_tags: 'story_tags',
        subscribed: 'subscribed',
        target: 'target',
        targeting: 'targeting',
        timeline_visibility: 'timeline_visibility',
        type: 'type',
        updated_time: 'updated_time',
        via: 'via',
        video_buying_eligibility: 'video_buying_eligibility',
        width: 'width'
      });
    }
  }, {
    key: 'BackdatedTimeGranularity',
    get: function get() {
      return Object.freeze({
        day: 'day',
        hour: 'hour',
        min: 'min',
        month: 'month',
        none: 'none',
        year: 'year'
      });
    }
  }, {
    key: 'FeedStoryVisibility',
    get: function get() {
      return Object.freeze({
        hidden: 'hidden',
        visible: 'visible'
      });
    }
  }, {
    key: 'TimelineVisibility',
    get: function get() {
      return Object.freeze({
        forced_allow: 'forced_allow',
        hidden: 'hidden',
        normal: 'normal'
      });
    }
  }]);
  return Post;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * TaggableSubject
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var TaggableSubject = function (_AbstractCrudObject) {
  inherits(TaggableSubject, _AbstractCrudObject);

  function TaggableSubject() {
    classCallCheck(this, TaggableSubject);
    return possibleConstructorReturn(this, (TaggableSubject.__proto__ || Object.getPrototypeOf(TaggableSubject)).apply(this, arguments));
  }

  createClass(TaggableSubject, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        id: 'id',
        name: 'name'
      });
    }
  }]);
  return TaggableSubject;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Photo
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Photo = function (_AbstractCrudObject) {
  inherits(Photo, _AbstractCrudObject);

  function Photo() {
    classCallCheck(this, Photo);
    return possibleConstructorReturn(this, (Photo.__proto__ || Object.getPrototypeOf(Photo)).apply(this, arguments));
  }

  createClass(Photo, [{
    key: 'getComments',
    value: function getComments(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Comment, fields, params, fetchFirstPage, '/comments');
    }
  }, {
    key: 'createComment',
    value: function createComment(fields, params) {
      return this.createEdge('/comments', fields, params, Comment);
    }
  }, {
    key: 'getInsights',
    value: function getInsights(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(InsightsResult, fields, params, fetchFirstPage, '/insights');
    }
  }, {
    key: 'getLikes',
    value: function getLikes(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Profile, fields, params, fetchFirstPage, '/likes');
    }
  }, {
    key: 'createLike',
    value: function createLike(fields, params) {
      return this.createEdge('/likes', fields, params, Photo);
    }
  }, {
    key: 'getReactions',
    value: function getReactions(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Profile, fields, params, fetchFirstPage, '/reactions');
    }
  }, {
    key: 'getSharedPosts',
    value: function getSharedPosts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Post, fields, params, fetchFirstPage, '/sharedposts');
    }
  }, {
    key: 'getTags',
    value: function getTags(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(TaggableSubject, fields, params, fetchFirstPage, '/tags');
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(Photo.prototype.__proto__ || Object.getPrototypeOf(Photo.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        album: 'album',
        alt_text: 'alt_text',
        alt_text_custom: 'alt_text_custom',
        backdated_time: 'backdated_time',
        backdated_time_granularity: 'backdated_time_granularity',
        can_backdate: 'can_backdate',
        can_delete: 'can_delete',
        can_tag: 'can_tag',
        created_time: 'created_time',
        event: 'event',
        from: 'from',
        height: 'height',
        icon: 'icon',
        id: 'id',
        images: 'images',
        link: 'link',
        name: 'name',
        name_tags: 'name_tags',
        page_story_id: 'page_story_id',
        picture: 'picture',
        place: 'place',
        position: 'position',
        source: 'source',
        target: 'target',
        updated_time: 'updated_time',
        webp_images: 'webp_images',
        width: 'width'
      });
    }
  }, {
    key: 'BackdatedTimeGranularity',
    get: function get() {
      return Object.freeze({
        day: 'day',
        hour: 'hour',
        min: 'min',
        month: 'month',
        none: 'none',
        year: 'year'
      });
    }
  }, {
    key: 'UnpublishedContentType',
    get: function get() {
      return Object.freeze({
        ads_post: 'ADS_POST',
        draft: 'DRAFT',
        inline_created: 'INLINE_CREATED',
        published: 'PUBLISHED',
        scheduled: 'SCHEDULED'
      });
    }
  }, {
    key: 'Type',
    get: function get() {
      return Object.freeze({
        profile: 'profile',
        tagged: 'tagged',
        uploaded: 'uploaded'
      });
    }
  }]);
  return Photo;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Album
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Album = function (_AbstractCrudObject) {
  inherits(Album, _AbstractCrudObject);

  function Album() {
    classCallCheck(this, Album);
    return possibleConstructorReturn(this, (Album.__proto__ || Object.getPrototypeOf(Album)).apply(this, arguments));
  }

  createClass(Album, [{
    key: 'getComments',
    value: function getComments(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Comment, fields, params, fetchFirstPage, '/comments');
    }
  }, {
    key: 'createComment',
    value: function createComment(fields, params) {
      return this.createEdge('/comments', fields, params, Comment);
    }
  }, {
    key: 'getLikes',
    value: function getLikes(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Profile, fields, params, fetchFirstPage, '/likes');
    }
  }, {
    key: 'createLike',
    value: function createLike(fields, params) {
      return this.createEdge('/likes', fields, params, Album);
    }
  }, {
    key: 'getPhotos',
    value: function getPhotos(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Photo, fields, params, fetchFirstPage, '/photos');
    }
  }, {
    key: 'createPhoto',
    value: function createPhoto(fields, params) {
      return this.createEdge('/photos', fields, params, Photo);
    }
  }, {
    key: 'getPicture',
    value: function getPicture(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProfilePictureSource, fields, params, fetchFirstPage, '/picture');
    }
  }, {
    key: 'getReactions',
    value: function getReactions(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Profile, fields, params, fetchFirstPage, '/reactions');
    }
  }, {
    key: 'getSharedPosts',
    value: function getSharedPosts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Post, fields, params, fetchFirstPage, '/sharedposts');
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        backdated_time: 'backdated_time',
        backdated_time_granularity: 'backdated_time_granularity',
        can_backdate: 'can_backdate',
        can_upload: 'can_upload',
        count: 'count',
        cover_photo: 'cover_photo',
        created_time: 'created_time',
        description: 'description',
        edit_link: 'edit_link',
        event: 'event',
        from: 'from',
        id: 'id',
        is_user_facing: 'is_user_facing',
        link: 'link',
        location: 'location',
        modified_major: 'modified_major',
        name: 'name',
        photo_count: 'photo_count',
        place: 'place',
        privacy: 'privacy',
        type: 'type',
        updated_time: 'updated_time',
        video_count: 'video_count'
      });
    }
  }]);
  return Album;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AppRequestFormerRecipient
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AppRequestFormerRecipient = function (_AbstractCrudObject) {
  inherits(AppRequestFormerRecipient, _AbstractCrudObject);

  function AppRequestFormerRecipient() {
    classCallCheck(this, AppRequestFormerRecipient);
    return possibleConstructorReturn(this, (AppRequestFormerRecipient.__proto__ || Object.getPrototypeOf(AppRequestFormerRecipient)).apply(this, arguments));
  }

  createClass(AppRequestFormerRecipient, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        id: 'id',
        recipient_id: 'recipient_id'
      });
    }
  }]);
  return AppRequestFormerRecipient;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AppRequest
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AppRequest = function (_AbstractCrudObject) {
  inherits(AppRequest, _AbstractCrudObject);

  function AppRequest() {
    classCallCheck(this, AppRequest);
    return possibleConstructorReturn(this, (AppRequest.__proto__ || Object.getPrototypeOf(AppRequest)).apply(this, arguments));
  }

  createClass(AppRequest, [{
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(AppRequest.prototype.__proto__ || Object.getPrototypeOf(AppRequest.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        action_type: 'action_type',
        application: 'application',
        created_time: 'created_time',
        data: 'data',
        from: 'from',
        id: 'id',
        message: 'message',
        object: 'object',
        to: 'to'
      });
    }
  }]);
  return AppRequest;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AutomotiveModel
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AutomotiveModel = function (_AbstractCrudObject) {
  inherits(AutomotiveModel, _AbstractCrudObject);

  function AutomotiveModel() {
    classCallCheck(this, AutomotiveModel);
    return possibleConstructorReturn(this, (AutomotiveModel.__proto__ || Object.getPrototypeOf(AutomotiveModel)).apply(this, arguments));
  }

  createClass(AutomotiveModel, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        applinks: 'applinks',
        automotive_model_id: 'automotive_model_id',
        availability: 'availability',
        body_style: 'body_style',
        currency: 'currency',
        custom_label_0: 'custom_label_0',
        description: 'description',
        drivetrain: 'drivetrain',
        exterior_color: 'exterior_color',
        finance_description: 'finance_description',
        finance_type: 'finance_type',
        fuel_type: 'fuel_type',
        generation: 'generation',
        id: 'id',
        images: 'images',
        interior_color: 'interior_color',
        interior_upholstery: 'interior_upholstery',
        make: 'make',
        model: 'model',
        price: 'price',
        sanitized_images: 'sanitized_images',
        title: 'title',
        transmission: 'transmission',
        trim: 'trim',
        url: 'url',
        year: 'year'
      });
    }
  }]);
  return AutomotiveModel;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * DynamicItemDisplayBundleFolder
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var DynamicItemDisplayBundleFolder = function (_AbstractCrudObject) {
  inherits(DynamicItemDisplayBundleFolder, _AbstractCrudObject);

  function DynamicItemDisplayBundleFolder() {
    classCallCheck(this, DynamicItemDisplayBundleFolder);
    return possibleConstructorReturn(this, (DynamicItemDisplayBundleFolder.__proto__ || Object.getPrototypeOf(DynamicItemDisplayBundleFolder)).apply(this, arguments));
  }

  createClass(DynamicItemDisplayBundleFolder, [{
    key: 'deleteBundles',
    value: function deleteBundles(params) {
      return get$1(DynamicItemDisplayBundleFolder.prototype.__proto__ || Object.getPrototypeOf(DynamicItemDisplayBundleFolder.prototype), 'deleteEdge', this).call(this, '/bundles', params);
    }
  }, {
    key: 'createBundle',
    value: function createBundle(fields, params) {
      return this.createEdge('/bundles', fields, params, DynamicItemDisplayBundleFolder);
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(DynamicItemDisplayBundleFolder.prototype.__proto__ || Object.getPrototypeOf(DynamicItemDisplayBundleFolder.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(DynamicItemDisplayBundleFolder.prototype.__proto__ || Object.getPrototypeOf(DynamicItemDisplayBundleFolder.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        categorization_criteria: 'categorization_criteria',
        id: 'id',
        name: 'name',
        product_catalog: 'product_catalog',
        product_set: 'product_set',
        valid_labels: 'valid_labels'
      });
    }
  }]);
  return DynamicItemDisplayBundleFolder;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * DynamicItemDisplayBundle
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var DynamicItemDisplayBundle = function (_AbstractCrudObject) {
  inherits(DynamicItemDisplayBundle, _AbstractCrudObject);

  function DynamicItemDisplayBundle() {
    classCallCheck(this, DynamicItemDisplayBundle);
    return possibleConstructorReturn(this, (DynamicItemDisplayBundle.__proto__ || Object.getPrototypeOf(DynamicItemDisplayBundle)).apply(this, arguments));
  }

  createClass(DynamicItemDisplayBundle, [{
    key: 'getBundleFolders',
    value: function getBundleFolders(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(DynamicItemDisplayBundleFolder, fields, params, fetchFirstPage, '/bundle_folders');
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(DynamicItemDisplayBundle.prototype.__proto__ || Object.getPrototypeOf(DynamicItemDisplayBundle.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(DynamicItemDisplayBundle.prototype.__proto__ || Object.getPrototypeOf(DynamicItemDisplayBundle.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        additional_urls: 'additional_urls',
        description: 'description',
        id: 'id',
        name: 'name',
        product_set: 'product_set',
        text_tokens: 'text_tokens',
        url: 'url'
      });
    }
  }]);
  return DynamicItemDisplayBundle;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ProductCatalogCategory
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ProductCatalogCategory = function (_AbstractCrudObject) {
  inherits(ProductCatalogCategory, _AbstractCrudObject);

  function ProductCatalogCategory() {
    classCallCheck(this, ProductCatalogCategory);
    return possibleConstructorReturn(this, (ProductCatalogCategory.__proto__ || Object.getPrototypeOf(ProductCatalogCategory)).apply(this, arguments));
  }

  createClass(ProductCatalogCategory, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        criteria_value: 'criteria_value',
        description: 'description',
        destination_uri: 'destination_uri',
        image_url: 'image_url',
        name: 'name',
        num_items: 'num_items',
        tokens: 'tokens'
      });
    }
  }, {
    key: 'CategorizationCriteria',
    get: function get() {
      return Object.freeze({
        brand: 'BRAND',
        category: 'CATEGORY',
        product_type: 'PRODUCT_TYPE'
      });
    }
  }]);
  return ProductCatalogCategory;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * CheckBatchRequestStatus
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var CheckBatchRequestStatus = function (_AbstractCrudObject) {
  inherits(CheckBatchRequestStatus, _AbstractCrudObject);

  function CheckBatchRequestStatus() {
    classCallCheck(this, CheckBatchRequestStatus);
    return possibleConstructorReturn(this, (CheckBatchRequestStatus.__proto__ || Object.getPrototypeOf(CheckBatchRequestStatus)).apply(this, arguments));
  }

  createClass(CheckBatchRequestStatus, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        errors: 'errors',
        errors_total_count: 'errors_total_count',
        handle: 'handle',
        invalid_item_ids: 'invalid_item_ids',
        status: 'status',
        warnings: 'warnings',
        warnings_total_count: 'warnings_total_count'
      });
    }
  }]);
  return CheckBatchRequestStatus;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Destination
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Destination = function (_AbstractCrudObject) {
  inherits(Destination, _AbstractCrudObject);

  function Destination() {
    classCallCheck(this, Destination);
    return possibleConstructorReturn(this, (Destination.__proto__ || Object.getPrototypeOf(Destination)).apply(this, arguments));
  }

  createClass(Destination, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        address: 'address',
        applinks: 'applinks',
        currency: 'currency',
        description: 'description',
        destination_id: 'destination_id',
        id: 'id',
        images: 'images',
        name: 'name',
        price: 'price',
        price_change: 'price_change',
        sanitized_images: 'sanitized_images',
        types: 'types',
        url: 'url'
      });
    }
  }]);
  return Destination;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ProductEventStat
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ProductEventStat = function (_AbstractCrudObject) {
  inherits(ProductEventStat, _AbstractCrudObject);

  function ProductEventStat() {
    classCallCheck(this, ProductEventStat);
    return possibleConstructorReturn(this, (ProductEventStat.__proto__ || Object.getPrototypeOf(ProductEventStat)).apply(this, arguments));
  }

  createClass(ProductEventStat, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        date_start: 'date_start',
        date_stop: 'date_stop',
        device_type: 'device_type',
        event: 'event',
        event_source: 'event_source',
        total_content_ids_matched_other_catalogs: 'total_content_ids_matched_other_catalogs',
        total_matched_content_ids: 'total_matched_content_ids',
        total_unmatched_content_ids: 'total_unmatched_content_ids',
        unique_content_ids_matched_other_catalogs: 'unique_content_ids_matched_other_catalogs',
        unique_matched_content_ids: 'unique_matched_content_ids',
        unique_unmatched_content_ids: 'unique_unmatched_content_ids'
      });
    }
  }, {
    key: 'DeviceType',
    get: function get() {
      return Object.freeze({
        desktop: 'desktop',
        mobile_android_phone: 'mobile_android_phone',
        mobile_android_tablet: 'mobile_android_tablet',
        mobile_ipad: 'mobile_ipad',
        mobile_iphone: 'mobile_iphone',
        mobile_ipod: 'mobile_ipod',
        mobile_phone: 'mobile_phone',
        mobile_tablet: 'mobile_tablet',
        mobile_windows_phone: 'mobile_windows_phone',
        unknown: 'unknown'
      });
    }
  }, {
    key: 'Event',
    get: function get() {
      return Object.freeze({
        addtocart: 'AddToCart',
        addtowishlist: 'AddToWishlist',
        initiatecheckout: 'InitiateCheckout',
        lead: 'Lead',
        purchase: 'Purchase',
        search: 'Search',
        subscribe: 'Subscribe',
        viewcontent: 'ViewContent'
      });
    }
  }, {
    key: 'Breakdowns',
    get: function get() {
      return Object.freeze({
        device_type: 'DEVICE_TYPE'
      });
    }
  }]);
  return ProductEventStat;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ExternalEventSource
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ExternalEventSource = function (_AbstractCrudObject) {
  inherits(ExternalEventSource, _AbstractCrudObject);

  function ExternalEventSource() {
    classCallCheck(this, ExternalEventSource);
    return possibleConstructorReturn(this, (ExternalEventSource.__proto__ || Object.getPrototypeOf(ExternalEventSource)).apply(this, arguments));
  }

  createClass(ExternalEventSource, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        id: 'id',
        name: 'name',
        source_type: 'source_type'
      });
    }
  }]);
  return ExternalEventSource;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Flight
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Flight = function (_AbstractCrudObject) {
  inherits(Flight, _AbstractCrudObject);

  function Flight() {
    classCallCheck(this, Flight);
    return possibleConstructorReturn(this, (Flight.__proto__ || Object.getPrototypeOf(Flight)).apply(this, arguments));
  }

  createClass(Flight, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        applinks: 'applinks',
        currency: 'currency',
        description: 'description',
        destination_airport: 'destination_airport',
        destination_city: 'destination_city',
        flight_id: 'flight_id',
        id: 'id',
        images: 'images',
        oneway_currency: 'oneway_currency',
        oneway_price: 'oneway_price',
        origin_airport: 'origin_airport',
        origin_city: 'origin_city',
        price: 'price',
        sanitized_images: 'sanitized_images',
        url: 'url'
      });
    }
  }]);
  return Flight;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * HomeListing
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var HomeListing = function (_AbstractCrudObject) {
  inherits(HomeListing, _AbstractCrudObject);

  function HomeListing() {
    classCallCheck(this, HomeListing);
    return possibleConstructorReturn(this, (HomeListing.__proto__ || Object.getPrototypeOf(HomeListing)).apply(this, arguments));
  }

  createClass(HomeListing, [{
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(HomeListing.prototype.__proto__ || Object.getPrototypeOf(HomeListing.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(HomeListing.prototype.__proto__ || Object.getPrototypeOf(HomeListing.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        ac_type: 'ac_type',
        additional_fees_description: 'additional_fees_description',
        address: 'address',
        agent_company: 'agent_company',
        agent_email: 'agent_email',
        agent_fb_page_id: 'agent_fb_page_id',
        agent_name: 'agent_name',
        agent_phone: 'agent_phone',
        applinks: 'applinks',
        area_size: 'area_size',
        area_unit: 'area_unit',
        availability: 'availability',
        co_2_emission_rating_eu: 'co_2_emission_rating_eu',
        currency: 'currency',
        days_on_market: 'days_on_market',
        description: 'description',
        energy_rating_eu: 'energy_rating_eu',
        furnish_type: 'furnish_type',
        group_id: 'group_id',
        heating_type: 'heating_type',
        home_listing_id: 'home_listing_id',
        id: 'id',
        images: 'images',
        laundry_type: 'laundry_type',
        listing_type: 'listing_type',
        max_currency: 'max_currency',
        max_price: 'max_price',
        min_currency: 'min_currency',
        min_price: 'min_price',
        name: 'name',
        num_baths: 'num_baths',
        num_beds: 'num_beds',
        num_rooms: 'num_rooms',
        num_units: 'num_units',
        parking_type: 'parking_type',
        partner_verification: 'partner_verification',
        pet_policy: 'pet_policy',
        price: 'price',
        property_type: 'property_type',
        sanitized_images: 'sanitized_images',
        url: 'url',
        year_built: 'year_built'
      });
    }
  }]);
  return HomeListing;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ProductCatalogHotelRoomsBatch
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ProductCatalogHotelRoomsBatch = function (_AbstractCrudObject) {
  inherits(ProductCatalogHotelRoomsBatch, _AbstractCrudObject);

  function ProductCatalogHotelRoomsBatch() {
    classCallCheck(this, ProductCatalogHotelRoomsBatch);
    return possibleConstructorReturn(this, (ProductCatalogHotelRoomsBatch.__proto__ || Object.getPrototypeOf(ProductCatalogHotelRoomsBatch)).apply(this, arguments));
  }

  createClass(ProductCatalogHotelRoomsBatch, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        errors: 'errors',
        errors_total_count: 'errors_total_count',
        handle: 'handle',
        status: 'status'
      });
    }
  }]);
  return ProductCatalogHotelRoomsBatch;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * DynamicPriceConfigByDate
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var DynamicPriceConfigByDate = function (_AbstractCrudObject) {
  inherits(DynamicPriceConfigByDate, _AbstractCrudObject);

  function DynamicPriceConfigByDate() {
    classCallCheck(this, DynamicPriceConfigByDate);
    return possibleConstructorReturn(this, (DynamicPriceConfigByDate.__proto__ || Object.getPrototypeOf(DynamicPriceConfigByDate)).apply(this, arguments));
  }

  createClass(DynamicPriceConfigByDate, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        checkin_date: 'checkin_date',
        prices: 'prices',
        prices_pretty: 'prices_pretty',
        id: 'id'
      });
    }
  }]);
  return DynamicPriceConfigByDate;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * HotelRoom
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var HotelRoom = function (_AbstractCrudObject) {
  inherits(HotelRoom, _AbstractCrudObject);

  function HotelRoom() {
    classCallCheck(this, HotelRoom);
    return possibleConstructorReturn(this, (HotelRoom.__proto__ || Object.getPrototypeOf(HotelRoom)).apply(this, arguments));
  }

  createClass(HotelRoom, [{
    key: 'getPricingVariables',
    value: function getPricingVariables(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(DynamicPriceConfigByDate, fields, params, fetchFirstPage, '/pricing_variables');
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(HotelRoom.prototype.__proto__ || Object.getPrototypeOf(HotelRoom.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(HotelRoom.prototype.__proto__ || Object.getPrototypeOf(HotelRoom.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        applinks: 'applinks',
        base_price: 'base_price',
        currency: 'currency',
        description: 'description',
        id: 'id',
        images: 'images',
        margin_level: 'margin_level',
        name: 'name',
        room_id: 'room_id',
        sale_price: 'sale_price',
        url: 'url'
      });
    }
  }]);
  return HotelRoom;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Hotel
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Hotel = function (_AbstractCrudObject) {
  inherits(Hotel, _AbstractCrudObject);

  function Hotel() {
    classCallCheck(this, Hotel);
    return possibleConstructorReturn(this, (Hotel.__proto__ || Object.getPrototypeOf(Hotel)).apply(this, arguments));
  }

  createClass(Hotel, [{
    key: 'getHotelRooms',
    value: function getHotelRooms(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(HotelRoom, fields, params, fetchFirstPage, '/hotel_rooms');
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(Hotel.prototype.__proto__ || Object.getPrototypeOf(Hotel.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(Hotel.prototype.__proto__ || Object.getPrototypeOf(Hotel.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        address: 'address',
        applinks: 'applinks',
        brand: 'brand',
        currency: 'currency',
        description: 'description',
        guest_ratings: 'guest_ratings',
        hotel_id: 'hotel_id',
        id: 'id',
        images: 'images',
        lowest_base_price: 'lowest_base_price',
        loyalty_program: 'loyalty_program',
        margin_level: 'margin_level',
        name: 'name',
        phone: 'phone',
        sale_price: 'sale_price',
        sanitized_images: 'sanitized_images',
        star_rating: 'star_rating',
        url: 'url'
      });
    }
  }]);
  return Hotel;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ProductCatalogPricingVariablesBatch
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ProductCatalogPricingVariablesBatch = function (_AbstractCrudObject) {
  inherits(ProductCatalogPricingVariablesBatch, _AbstractCrudObject);

  function ProductCatalogPricingVariablesBatch() {
    classCallCheck(this, ProductCatalogPricingVariablesBatch);
    return possibleConstructorReturn(this, (ProductCatalogPricingVariablesBatch.__proto__ || Object.getPrototypeOf(ProductCatalogPricingVariablesBatch)).apply(this, arguments));
  }

  createClass(ProductCatalogPricingVariablesBatch, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        errors: 'errors',
        errors_total_count: 'errors_total_count',
        handle: 'handle',
        status: 'status'
      });
    }
  }]);
  return ProductCatalogPricingVariablesBatch;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Vehicle
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Vehicle = function (_AbstractCrudObject) {
  inherits(Vehicle, _AbstractCrudObject);

  function Vehicle() {
    classCallCheck(this, Vehicle);
    return possibleConstructorReturn(this, (Vehicle.__proto__ || Object.getPrototypeOf(Vehicle)).apply(this, arguments));
  }

  createClass(Vehicle, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(Vehicle.prototype.__proto__ || Object.getPrototypeOf(Vehicle.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        address: 'address',
        applinks: 'applinks',
        availability: 'availability',
        body_style: 'body_style',
        condition: 'condition',
        currency: 'currency',
        custom_label_0: 'custom_label_0',
        date_first_on_lot: 'date_first_on_lot',
        dealer_communication_channel: 'dealer_communication_channel',
        dealer_email: 'dealer_email',
        dealer_id: 'dealer_id',
        dealer_name: 'dealer_name',
        dealer_phone: 'dealer_phone',
        dealer_privacy_policy_url: 'dealer_privacy_policy_url',
        description: 'description',
        drivetrain: 'drivetrain',
        exterior_color: 'exterior_color',
        fb_page_id: 'fb_page_id',
        features: 'features',
        fuel_type: 'fuel_type',
        id: 'id',
        images: 'images',
        interior_color: 'interior_color',
        legal_disclosure_impressum_url: 'legal_disclosure_impressum_url',
        make: 'make',
        mileage: 'mileage',
        model: 'model',
        previous_currency: 'previous_currency',
        previous_price: 'previous_price',
        price: 'price',
        sale_currency: 'sale_currency',
        sale_price: 'sale_price',
        sanitized_images: 'sanitized_images',
        state_of_vehicle: 'state_of_vehicle',
        title: 'title',
        transmission: 'transmission',
        trim: 'trim',
        url: 'url',
        vehicle_id: 'vehicle_id',
        vehicle_registration_plate: 'vehicle_registration_plate',
        vehicle_specifications: 'vehicle_specifications',
        vehicle_type: 'vehicle_type',
        vin: 'vin',
        year: 'year'
      });
    }
  }, {
    key: 'Availability',
    get: function get() {
      return Object.freeze({
        available: 'AVAILABLE',
        not_available: 'NOT_AVAILABLE'
      });
    }
  }, {
    key: 'BodyStyle',
    get: function get() {
      return Object.freeze({
        convertible: 'CONVERTIBLE',
        coupe: 'COUPE',
        crossover: 'CROSSOVER',
        hatchback: 'HATCHBACK',
        minivan: 'MINIVAN',
        none: 'NONE',
        other: 'OTHER',
        sedan: 'SEDAN',
        small_car: 'SMALL_CAR',
        suv: 'SUV',
        truck: 'TRUCK',
        van: 'VAN',
        wagon: 'WAGON'
      });
    }
  }, {
    key: 'Condition',
    get: function get() {
      return Object.freeze({
        excellent: 'EXCELLENT',
        fair: 'FAIR',
        good: 'GOOD',
        none: 'NONE',
        other: 'OTHER',
        poor: 'POOR',
        very_good: 'VERY_GOOD'
      });
    }
  }, {
    key: 'Drivetrain',
    get: function get() {
      return Object.freeze({
        awd: 'AWD',
        four_wd: 'FOUR_WD',
        fwd: 'FWD',
        none: 'NONE',
        other: 'OTHER',
        rwd: 'RWD',
        two_wd: 'TWO_WD'
      });
    }
  }, {
    key: 'FuelType',
    get: function get() {
      return Object.freeze({
        diesel: 'DIESEL',
        electric: 'ELECTRIC',
        flex: 'FLEX',
        gasoline: 'GASOLINE',
        hybrid: 'HYBRID',
        none: 'NONE',
        other: 'OTHER',
        petrol: 'PETROL',
        plugin_hybrid: 'PLUGIN_HYBRID'
      });
    }
  }, {
    key: 'StateOfVehicle',
    get: function get() {
      return Object.freeze({
        cpo: 'CPO',
        new: 'NEW',
        used: 'USED'
      });
    }
  }, {
    key: 'Transmission',
    get: function get() {
      return Object.freeze({
        automatic: 'AUTOMATIC',
        manual: 'MANUAL',
        none: 'NONE',
        other: 'OTHER'
      });
    }
  }, {
    key: 'VehicleType',
    get: function get() {
      return Object.freeze({
        boat: 'BOAT',
        car_truck: 'CAR_TRUCK',
        commercial: 'COMMERCIAL',
        motorcycle: 'MOTORCYCLE',
        other: 'OTHER',
        powersport: 'POWERSPORT',
        rv_camper: 'RV_CAMPER',
        trailer: 'TRAILER'
      });
    }
  }]);
  return Vehicle;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ProductSet
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ProductSet = function (_AbstractCrudObject) {
  inherits(ProductSet, _AbstractCrudObject);

  function ProductSet() {
    classCallCheck(this, ProductSet);
    return possibleConstructorReturn(this, (ProductSet.__proto__ || Object.getPrototypeOf(ProductSet)).apply(this, arguments));
  }

  createClass(ProductSet, [{
    key: 'getAutomotiveModels',
    value: function getAutomotiveModels(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AutomotiveModel, fields, params, fetchFirstPage, '/automotive_models');
    }
  }, {
    key: 'getDestinations',
    value: function getDestinations(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Destination, fields, params, fetchFirstPage, '/destinations');
    }
  }, {
    key: 'getFlights',
    value: function getFlights(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Flight, fields, params, fetchFirstPage, '/flights');
    }
  }, {
    key: 'getHomeListings',
    value: function getHomeListings(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(HomeListing, fields, params, fetchFirstPage, '/home_listings');
    }
  }, {
    key: 'getHotels',
    value: function getHotels(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Hotel, fields, params, fetchFirstPage, '/hotels');
    }
  }, {
    key: 'getProducts',
    value: function getProducts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProductItem, fields, params, fetchFirstPage, '/products');
    }
  }, {
    key: 'getVehicles',
    value: function getVehicles(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Vehicle, fields, params, fetchFirstPage, '/vehicles');
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(ProductSet.prototype.__proto__ || Object.getPrototypeOf(ProductSet.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(ProductSet.prototype.__proto__ || Object.getPrototypeOf(ProductSet.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        auto_creation_url: 'auto_creation_url',
        filter: 'filter',
        id: 'id',
        name: 'name',
        product_catalog: 'product_catalog',
        product_count: 'product_count'
      });
    }
  }]);
  return ProductSet;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ProductItem
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ProductItem = function (_AbstractCrudObject) {
  inherits(ProductItem, _AbstractCrudObject);

  function ProductItem() {
    classCallCheck(this, ProductItem);
    return possibleConstructorReturn(this, (ProductItem.__proto__ || Object.getPrototypeOf(ProductItem)).apply(this, arguments));
  }

  createClass(ProductItem, [{
    key: 'getProductSets',
    value: function getProductSets(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProductSet, fields, params, fetchFirstPage, '/product_sets');
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(ProductItem.prototype.__proto__ || Object.getPrototypeOf(ProductItem.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(ProductItem.prototype.__proto__ || Object.getPrototypeOf(ProductItem.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        additional_image_cdn_urls: 'additional_image_cdn_urls',
        additional_image_urls: 'additional_image_urls',
        additional_variant_attributes: 'additional_variant_attributes',
        age_group: 'age_group',
        applinks: 'applinks',
        availability: 'availability',
        brand: 'brand',
        capability_to_review_status: 'capability_to_review_status',
        category: 'category',
        color: 'color',
        commerce_insights: 'commerce_insights',
        condition: 'condition',
        currency: 'currency',
        custom_data: 'custom_data',
        custom_label_0: 'custom_label_0',
        custom_label_1: 'custom_label_1',
        custom_label_2: 'custom_label_2',
        custom_label_3: 'custom_label_3',
        custom_label_4: 'custom_label_4',
        description: 'description',
        expiration_date: 'expiration_date',
        gender: 'gender',
        gtin: 'gtin',
        id: 'id',
        image_cdn_urls: 'image_cdn_urls',
        image_url: 'image_url',
        inventory: 'inventory',
        manufacturer_part_number: 'manufacturer_part_number',
        material: 'material',
        mobile_link: 'mobile_link',
        name: 'name',
        ordering_index: 'ordering_index',
        pattern: 'pattern',
        price: 'price',
        product_catalog: 'product_catalog',
        product_feed: 'product_feed',
        product_group: 'product_group',
        product_type: 'product_type',
        retailer_id: 'retailer_id',
        retailer_product_group_id: 'retailer_product_group_id',
        review_rejection_reasons: 'review_rejection_reasons',
        review_status: 'review_status',
        sale_price: 'sale_price',
        sale_price_end_date: 'sale_price_end_date',
        sale_price_start_date: 'sale_price_start_date',
        shipping_weight_unit: 'shipping_weight_unit',
        shipping_weight_value: 'shipping_weight_value',
        short_description: 'short_description',
        size: 'size',
        start_date: 'start_date',
        url: 'url',
        visibility: 'visibility'
      });
    }
  }, {
    key: 'AgeGroup',
    get: function get() {
      return Object.freeze({
        adult: 'adult',
        all_ages: 'all ages',
        infant: 'infant',
        kids: 'kids',
        newborn: 'newborn',
        teen: 'teen',
        toddler: 'toddler'
      });
    }
  }, {
    key: 'Availability',
    get: function get() {
      return Object.freeze({
        available_for_order: 'available for order',
        discontinued: 'discontinued',
        in_stock: 'in stock',
        out_of_stock: 'out of stock',
        pending: 'pending',
        preorder: 'preorder'
      });
    }
  }, {
    key: 'Condition',
    get: function get() {
      return Object.freeze({
        cpo: 'cpo',
        new: 'new',
        open_box_new: 'open_box_new',
        refurbished: 'refurbished',
        used: 'used'
      });
    }
  }, {
    key: 'Gender',
    get: function get() {
      return Object.freeze({
        female: 'female',
        male: 'male',
        unisex: 'unisex'
      });
    }
  }, {
    key: 'ReviewStatus',
    get: function get() {
      return Object.freeze({
        approved: 'approved',
        outdated: 'outdated',
        pending: 'pending',
        rejected: 'rejected'
      });
    }
  }, {
    key: 'ShippingWeightUnit',
    get: function get() {
      return Object.freeze({
        g: 'g',
        kg: 'kg',
        lb: 'lb',
        oz: 'oz'
      });
    }
  }, {
    key: 'Visibility',
    get: function get() {
      return Object.freeze({
        published: 'published',
        staging: 'staging'
      });
    }
  }]);
  return ProductItem;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ProductFeedRule
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ProductFeedRule = function (_AbstractCrudObject) {
  inherits(ProductFeedRule, _AbstractCrudObject);

  function ProductFeedRule() {
    classCallCheck(this, ProductFeedRule);
    return possibleConstructorReturn(this, (ProductFeedRule.__proto__ || Object.getPrototypeOf(ProductFeedRule)).apply(this, arguments));
  }

  createClass(ProductFeedRule, [{
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(ProductFeedRule.prototype.__proto__ || Object.getPrototypeOf(ProductFeedRule.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(ProductFeedRule.prototype.__proto__ || Object.getPrototypeOf(ProductFeedRule.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        attribute: 'attribute',
        id: 'id',
        params: 'params',
        rule_type: 'rule_type'
      });
    }
  }, {
    key: 'RuleType',
    get: function get() {
      return Object.freeze({
        fallback_rule: 'fallback_rule',
        letter_case_rule: 'letter_case_rule',
        mapping_rule: 'mapping_rule',
        regex_replace_rule: 'regex_replace_rule',
        value_mapping_rule: 'value_mapping_rule'
      });
    }
  }]);
  return ProductFeedRule;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ProductFeedUploadErrorSample
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ProductFeedUploadErrorSample = function (_AbstractCrudObject) {
  inherits(ProductFeedUploadErrorSample, _AbstractCrudObject);

  function ProductFeedUploadErrorSample() {
    classCallCheck(this, ProductFeedUploadErrorSample);
    return possibleConstructorReturn(this, (ProductFeedUploadErrorSample.__proto__ || Object.getPrototypeOf(ProductFeedUploadErrorSample)).apply(this, arguments));
  }

  createClass(ProductFeedUploadErrorSample, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        id: 'id',
        retailer_id: 'retailer_id',
        row_number: 'row_number'
      });
    }
  }]);
  return ProductFeedUploadErrorSample;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ProductFeedRuleSuggestion
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ProductFeedRuleSuggestion = function (_AbstractCrudObject) {
  inherits(ProductFeedRuleSuggestion, _AbstractCrudObject);

  function ProductFeedRuleSuggestion() {
    classCallCheck(this, ProductFeedRuleSuggestion);
    return possibleConstructorReturn(this, (ProductFeedRuleSuggestion.__proto__ || Object.getPrototypeOf(ProductFeedRuleSuggestion)).apply(this, arguments));
  }

  createClass(ProductFeedRuleSuggestion, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        attribute: 'attribute',
        params: 'params',
        type: 'type'
      });
    }
  }]);
  return ProductFeedRuleSuggestion;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ProductFeedUploadError
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ProductFeedUploadError = function (_AbstractCrudObject) {
  inherits(ProductFeedUploadError, _AbstractCrudObject);

  function ProductFeedUploadError() {
    classCallCheck(this, ProductFeedUploadError);
    return possibleConstructorReturn(this, (ProductFeedUploadError.__proto__ || Object.getPrototypeOf(ProductFeedUploadError)).apply(this, arguments));
  }

  createClass(ProductFeedUploadError, [{
    key: 'getSamples',
    value: function getSamples(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProductFeedUploadErrorSample, fields, params, fetchFirstPage, '/samples');
    }
  }, {
    key: 'getSuggestedRules',
    value: function getSuggestedRules(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProductFeedRuleSuggestion, fields, params, fetchFirstPage, '/suggested_rules');
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        affected_surfaces: 'affected_surfaces',
        description: 'description',
        error_type: 'error_type',
        id: 'id',
        severity: 'severity',
        summary: 'summary',
        total_count: 'total_count'
      });
    }
  }, {
    key: 'AffectedSurfaces',
    get: function get() {
      return Object.freeze({
        dynamic_ads: 'Dynamic Ads',
        marketplace: 'Marketplace',
        us_marketplace: 'US Marketplace'
      });
    }
  }, {
    key: 'Severity',
    get: function get() {
      return Object.freeze({
        fatal: 'fatal',
        warning: 'warning'
      });
    }
  }]);
  return ProductFeedUploadError;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ProductFeedUpload
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ProductFeedUpload = function (_AbstractCrudObject) {
  inherits(ProductFeedUpload, _AbstractCrudObject);

  function ProductFeedUpload() {
    classCallCheck(this, ProductFeedUpload);
    return possibleConstructorReturn(this, (ProductFeedUpload.__proto__ || Object.getPrototypeOf(ProductFeedUpload)).apply(this, arguments));
  }

  createClass(ProductFeedUpload, [{
    key: 'createErrorReport',
    value: function createErrorReport(fields, params) {
      return this.createEdge('/error_report', fields, params, ProductFeedUpload);
    }
  }, {
    key: 'getErrors',
    value: function getErrors(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProductFeedUploadError, fields, params, fetchFirstPage, '/errors');
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        end_time: 'end_time',
        error_count: 'error_count',
        error_report: 'error_report',
        filename: 'filename',
        id: 'id',
        input_method: 'input_method',
        num_deleted_items: 'num_deleted_items',
        num_detected_items: 'num_detected_items',
        num_invalid_items: 'num_invalid_items',
        num_persisted_items: 'num_persisted_items',
        start_time: 'start_time',
        url: 'url',
        warning_count: 'warning_count'
      });
    }
  }, {
    key: 'InputMethod',
    get: function get() {
      return Object.freeze({
        manual_upload: 'Manual Upload',
        reupload_last_file: 'Reupload Last File',
        server_fetch: 'Server Fetch',
        user_initiated_server_fetch: 'User initiated server fetch'
      });
    }
  }]);
  return ProductFeedUpload;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ProductFeed
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ProductFeed = function (_AbstractCrudObject) {
  inherits(ProductFeed, _AbstractCrudObject);

  function ProductFeed() {
    classCallCheck(this, ProductFeed);
    return possibleConstructorReturn(this, (ProductFeed.__proto__ || Object.getPrototypeOf(ProductFeed)).apply(this, arguments));
  }

  createClass(ProductFeed, [{
    key: 'getAutomotiveModels',
    value: function getAutomotiveModels(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AutomotiveModel, fields, params, fetchFirstPage, '/automotive_models');
    }
  }, {
    key: 'getDestinations',
    value: function getDestinations(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Destination, fields, params, fetchFirstPage, '/destinations');
    }
  }, {
    key: 'getFlights',
    value: function getFlights(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Flight, fields, params, fetchFirstPage, '/flights');
    }
  }, {
    key: 'getHomeListings',
    value: function getHomeListings(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(HomeListing, fields, params, fetchFirstPage, '/home_listings');
    }
  }, {
    key: 'getHotels',
    value: function getHotels(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Hotel, fields, params, fetchFirstPage, '/hotels');
    }
  }, {
    key: 'getProducts',
    value: function getProducts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProductItem, fields, params, fetchFirstPage, '/products');
    }
  }, {
    key: 'getRules',
    value: function getRules(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProductFeedRule, fields, params, fetchFirstPage, '/rules');
    }
  }, {
    key: 'createRule',
    value: function createRule(fields, params) {
      return this.createEdge('/rules', fields, params, ProductFeedRule);
    }
  }, {
    key: 'getUploads',
    value: function getUploads(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProductFeedUpload, fields, params, fetchFirstPage, '/uploads');
    }
  }, {
    key: 'createUpload',
    value: function createUpload(fields, params) {
      return this.createEdge('/uploads', fields, params, ProductFeedUpload);
    }
  }, {
    key: 'getVehicles',
    value: function getVehicles(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Vehicle, fields, params, fetchFirstPage, '/vehicles');
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(ProductFeed.prototype.__proto__ || Object.getPrototypeOf(ProductFeed.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(ProductFeed.prototype.__proto__ || Object.getPrototypeOf(ProductFeed.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        country: 'country',
        created_time: 'created_time',
        default_currency: 'default_currency',
        deletion_enabled: 'deletion_enabled',
        delimiter: 'delimiter',
        encoding: 'encoding',
        file_name: 'file_name',
        id: 'id',
        latest_upload: 'latest_upload',
        name: 'name',
        override_type: 'override_type',
        product_count: 'product_count',
        qualified_product_count: 'qualified_product_count',
        quoted_fields_mode: 'quoted_fields_mode',
        schedule: 'schedule',
        update_schedule: 'update_schedule'
      });
    }
  }, {
    key: 'Delimiter',
    get: function get() {
      return Object.freeze({
        autodetect: 'AUTODETECT',
        bar: 'BAR',
        comma: 'COMMA',
        semicolon: 'SEMICOLON',
        tab: 'TAB',
        tilde: 'TILDE'
      });
    }
  }, {
    key: 'QuotedFieldsMode',
    get: function get() {
      return Object.freeze({
        autodetect: 'AUTODETECT',
        off: 'OFF',
        on: 'ON'
      });
    }
  }, {
    key: 'Encoding',
    get: function get() {
      return Object.freeze({
        autodetect: 'AUTODETECT',
        latin1: 'LATIN1',
        utf16be: 'UTF16BE',
        utf16le: 'UTF16LE',
        utf32be: 'UTF32BE',
        utf32le: 'UTF32LE',
        utf8: 'UTF8'
      });
    }
  }, {
    key: 'FeedType',
    get: function get() {
      return Object.freeze({
        auto: 'AUTO',
        destination: 'DESTINATION',
        flight: 'FLIGHT',
        home_listing: 'HOME_LISTING',
        hotel: 'HOTEL',
        hotel_room: 'HOTEL_ROOM',
        local_inventory: 'LOCAL_INVENTORY',
        market: 'MARKET',
        media_title: 'MEDIA_TITLE',
        products: 'PRODUCTS',
        vehicles: 'VEHICLES',
        vehicle_offer: 'VEHICLE_OFFER'
      });
    }
  }, {
    key: 'OverrideType',
    get: function get() {
      return Object.freeze({
        country: 'COUNTRY',
        language: 'LANGUAGE'
      });
    }
  }]);
  return ProductFeed;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ProductGroup
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ProductGroup = function (_AbstractCrudObject) {
  inherits(ProductGroup, _AbstractCrudObject);

  function ProductGroup() {
    classCallCheck(this, ProductGroup);
    return possibleConstructorReturn(this, (ProductGroup.__proto__ || Object.getPrototypeOf(ProductGroup)).apply(this, arguments));
  }

  createClass(ProductGroup, [{
    key: 'getProducts',
    value: function getProducts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProductItem, fields, params, fetchFirstPage, '/products');
    }
  }, {
    key: 'createProduct',
    value: function createProduct(fields, params) {
      return this.createEdge('/products', fields, params, ProductItem);
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(ProductGroup.prototype.__proto__ || Object.getPrototypeOf(ProductGroup.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(ProductGroup.prototype.__proto__ || Object.getPrototypeOf(ProductGroup.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        id: 'id',
        product_catalog: 'product_catalog',
        retailer_id: 'retailer_id',
        variants: 'variants'
      });
    }
  }]);
  return ProductGroup;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ProductCatalogProductSetsBatch
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ProductCatalogProductSetsBatch = function (_AbstractCrudObject) {
  inherits(ProductCatalogProductSetsBatch, _AbstractCrudObject);

  function ProductCatalogProductSetsBatch() {
    classCallCheck(this, ProductCatalogProductSetsBatch);
    return possibleConstructorReturn(this, (ProductCatalogProductSetsBatch.__proto__ || Object.getPrototypeOf(ProductCatalogProductSetsBatch)).apply(this, arguments));
  }

  createClass(ProductCatalogProductSetsBatch, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        errors: 'errors',
        errors_total_count: 'errors_total_count',
        handle: 'handle',
        status: 'status'
      });
    }
  }]);
  return ProductCatalogProductSetsBatch;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ProductCatalog
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ProductCatalog = function (_AbstractCrudObject) {
  inherits(ProductCatalog, _AbstractCrudObject);

  function ProductCatalog() {
    classCallCheck(this, ProductCatalog);
    return possibleConstructorReturn(this, (ProductCatalog.__proto__ || Object.getPrototypeOf(ProductCatalog)).apply(this, arguments));
  }

  createClass(ProductCatalog, [{
    key: 'deleteAgencies',
    value: function deleteAgencies(params) {
      return get$1(ProductCatalog.prototype.__proto__ || Object.getPrototypeOf(ProductCatalog.prototype), 'deleteEdge', this).call(this, '/agencies', params);
    }
  }, {
    key: 'getAgencies',
    value: function getAgencies(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Business, fields, params, fetchFirstPage, '/agencies');
    }
  }, {
    key: 'createAgency',
    value: function createAgency(fields, params) {
      return this.createEdge('/agencies', fields, params, ProductCatalog);
    }
  }, {
    key: 'deleteAssignedUsers',
    value: function deleteAssignedUsers(params) {
      return get$1(ProductCatalog.prototype.__proto__ || Object.getPrototypeOf(ProductCatalog.prototype), 'deleteEdge', this).call(this, '/assigned_users', params);
    }
  }, {
    key: 'getAssignedUsers',
    value: function getAssignedUsers(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AssignedUser, fields, params, fetchFirstPage, '/assigned_users');
    }
  }, {
    key: 'createAssignedUser',
    value: function createAssignedUser(fields, params) {
      return this.createEdge('/assigned_users', fields, params, ProductCatalog);
    }
  }, {
    key: 'getAutomotiveModels',
    value: function getAutomotiveModels(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AutomotiveModel, fields, params, fetchFirstPage, '/automotive_models');
    }
  }, {
    key: 'createBatch',
    value: function createBatch(fields, params) {
      return this.createEdge('/batch', fields, params, ProductCatalog);
    }
  }, {
    key: 'createBundleFolder',
    value: function createBundleFolder(fields, params) {
      return this.createEdge('/bundle_folders', fields, params, DynamicItemDisplayBundleFolder);
    }
  }, {
    key: 'createBundle',
    value: function createBundle(fields, params) {
      return this.createEdge('/bundles', fields, params, DynamicItemDisplayBundle);
    }
  }, {
    key: 'getCategories',
    value: function getCategories(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProductCatalogCategory, fields, params, fetchFirstPage, '/categories');
    }
  }, {
    key: 'createCategory',
    value: function createCategory(fields, params) {
      return this.createEdge('/categories', fields, params, ProductCatalogCategory);
    }
  }, {
    key: 'getCheckBatchRequestStatus',
    value: function getCheckBatchRequestStatus(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(CheckBatchRequestStatus, fields, params, fetchFirstPage, '/check_batch_request_status');
    }
  }, {
    key: 'getDestinations',
    value: function getDestinations(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Destination, fields, params, fetchFirstPage, '/destinations');
    }
  }, {
    key: 'getEventStats',
    value: function getEventStats(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProductEventStat, fields, params, fetchFirstPage, '/event_stats');
    }
  }, {
    key: 'deleteExternalEventSources',
    value: function deleteExternalEventSources(params) {
      return get$1(ProductCatalog.prototype.__proto__ || Object.getPrototypeOf(ProductCatalog.prototype), 'deleteEdge', this).call(this, '/external_event_sources', params);
    }
  }, {
    key: 'getExternalEventSources',
    value: function getExternalEventSources(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ExternalEventSource, fields, params, fetchFirstPage, '/external_event_sources');
    }
  }, {
    key: 'createExternalEventSource',
    value: function createExternalEventSource(fields, params) {
      return this.createEdge('/external_event_sources', fields, params, ProductCatalog);
    }
  }, {
    key: 'getFlights',
    value: function getFlights(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Flight, fields, params, fetchFirstPage, '/flights');
    }
  }, {
    key: 'getHomeListings',
    value: function getHomeListings(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(HomeListing, fields, params, fetchFirstPage, '/home_listings');
    }
  }, {
    key: 'createHomeListing',
    value: function createHomeListing(fields, params) {
      return this.createEdge('/home_listings', fields, params, HomeListing);
    }
  }, {
    key: 'getHotelRoomsBatch',
    value: function getHotelRoomsBatch(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProductCatalogHotelRoomsBatch, fields, params, fetchFirstPage, '/hotel_rooms_batch');
    }
  }, {
    key: 'createHotelRoomsBatch',
    value: function createHotelRoomsBatch(fields, params) {
      return this.createEdge('/hotel_rooms_batch', fields, params, ProductCatalog);
    }
  }, {
    key: 'getHotels',
    value: function getHotels(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Hotel, fields, params, fetchFirstPage, '/hotels');
    }
  }, {
    key: 'createHotel',
    value: function createHotel(fields, params) {
      return this.createEdge('/hotels', fields, params, Hotel);
    }
  }, {
    key: 'createItemsBatch',
    value: function createItemsBatch(fields, params) {
      return this.createEdge('/items_batch', fields, params, ProductCatalog);
    }
  }, {
    key: 'getPricingVariablesBatch',
    value: function getPricingVariablesBatch(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProductCatalogPricingVariablesBatch, fields, params, fetchFirstPage, '/pricing_variables_batch');
    }
  }, {
    key: 'createPricingVariablesBatch',
    value: function createPricingVariablesBatch(fields, params) {
      return this.createEdge('/pricing_variables_batch', fields, params, ProductCatalog);
    }
  }, {
    key: 'getProductFeeds',
    value: function getProductFeeds(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProductFeed, fields, params, fetchFirstPage, '/product_feeds');
    }
  }, {
    key: 'createProductFeed',
    value: function createProductFeed(fields, params) {
      return this.createEdge('/product_feeds', fields, params, ProductFeed);
    }
  }, {
    key: 'getProductGroups',
    value: function getProductGroups(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProductGroup, fields, params, fetchFirstPage, '/product_groups');
    }
  }, {
    key: 'createProductGroup',
    value: function createProductGroup(fields, params) {
      return this.createEdge('/product_groups', fields, params, ProductGroup);
    }
  }, {
    key: 'getProductSets',
    value: function getProductSets(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProductSet, fields, params, fetchFirstPage, '/product_sets');
    }
  }, {
    key: 'createProductSet',
    value: function createProductSet(fields, params) {
      return this.createEdge('/product_sets', fields, params, ProductSet);
    }
  }, {
    key: 'getProductSetsBatch',
    value: function getProductSetsBatch(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProductCatalogProductSetsBatch, fields, params, fetchFirstPage, '/product_sets_batch');
    }
  }, {
    key: 'createProductSetsBatch',
    value: function createProductSetsBatch(fields, params) {
      return this.createEdge('/product_sets_batch', fields, params, ProductCatalog);
    }
  }, {
    key: 'getProducts',
    value: function getProducts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProductItem, fields, params, fetchFirstPage, '/products');
    }
  }, {
    key: 'createProduct',
    value: function createProduct(fields, params) {
      return this.createEdge('/products', fields, params, ProductItem);
    }
  }, {
    key: 'getVehicles',
    value: function getVehicles(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Vehicle, fields, params, fetchFirstPage, '/vehicles');
    }
  }, {
    key: 'createVehicle',
    value: function createVehicle(fields, params) {
      return this.createEdge('/vehicles', fields, params, Vehicle);
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(ProductCatalog.prototype.__proto__ || Object.getPrototypeOf(ProductCatalog.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(ProductCatalog.prototype.__proto__ || Object.getPrototypeOf(ProductCatalog.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        business: 'business',
        cpas_parent_catalog_settings: 'cpas_parent_catalog_settings',
        da_display_settings: 'da_display_settings',
        default_image_url: 'default_image_url',
        fallback_image_url: 'fallback_image_url',
        feed_count: 'feed_count',
        id: 'id',
        name: 'name',
        product_count: 'product_count',
        qualified_product_count: 'qualified_product_count',
        vertical: 'vertical'
      });
    }
  }, {
    key: 'Vertical',
    get: function get() {
      return Object.freeze({
        commerce: 'commerce',
        destinations: 'destinations',
        flights: 'flights',
        home_listings: 'home_listings',
        hotels: 'hotels',
        vehicles: 'vehicles'
      });
    }
  }, {
    key: 'PermittedRoles',
    get: function get() {
      return Object.freeze({
        admin: 'ADMIN',
        advertiser: 'ADVERTISER'
      });
    }
  }, {
    key: 'PermittedTasks',
    get: function get() {
      return Object.freeze({
        advertise: 'ADVERTISE',
        manage: 'MANAGE'
      });
    }
  }, {
    key: 'Tasks',
    get: function get() {
      return Object.freeze({
        advertise: 'ADVERTISE',
        manage: 'MANAGE'
      });
    }
  }, {
    key: 'Standard',
    get: function get() {
      return Object.freeze({
        google: 'google'
      });
    }
  }]);
  return ProductCatalog;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * UnifiedThread
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var UnifiedThread = function (_AbstractCrudObject) {
  inherits(UnifiedThread, _AbstractCrudObject);

  function UnifiedThread() {
    classCallCheck(this, UnifiedThread);
    return possibleConstructorReturn(this, (UnifiedThread.__proto__ || Object.getPrototypeOf(UnifiedThread)).apply(this, arguments));
  }

  createClass(UnifiedThread, [{
    key: 'getMessages',
    value: function getMessages(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/messages');
    }
  }, {
    key: 'createMessage',
    value: function createMessage(fields, params) {
      return this.createEdge('/messages', fields, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        can_reply: 'can_reply',
        former_participants: 'former_participants',
        id: 'id',
        is_subscribed: 'is_subscribed',
        link: 'link',
        message_count: 'message_count',
        name: 'name',
        participants: 'participants',
        scoped_thread_key: 'scoped_thread_key',
        senders: 'senders',
        snippet: 'snippet',
        subject: 'subject',
        unread_count: 'unread_count',
        updated_time: 'updated_time',
        wallpaper: 'wallpaper'
      });
    }
  }]);
  return UnifiedThread;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * NullNode
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var NullNode = function (_AbstractCrudObject) {
  inherits(NullNode, _AbstractCrudObject);

  function NullNode() {
    classCallCheck(this, NullNode);
    return possibleConstructorReturn(this, (NullNode.__proto__ || Object.getPrototypeOf(NullNode)).apply(this, arguments));
  }

  createClass(NullNode, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({});
    }
  }]);
  return NullNode;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * LiveVideoError
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var LiveVideoError = function (_AbstractCrudObject) {
  inherits(LiveVideoError, _AbstractCrudObject);

  function LiveVideoError() {
    classCallCheck(this, LiveVideoError);
    return possibleConstructorReturn(this, (LiveVideoError.__proto__ || Object.getPrototypeOf(LiveVideoError)).apply(this, arguments));
  }

  createClass(LiveVideoError, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        creation_time: 'creation_time',
        error_code: 'error_code',
        error_message: 'error_message',
        error_type: 'error_type',
        id: 'id'
      });
    }
  }]);
  return LiveVideoError;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * VideoPoll
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var VideoPoll = function (_AbstractCrudObject) {
  inherits(VideoPoll, _AbstractCrudObject);

  function VideoPoll() {
    classCallCheck(this, VideoPoll);
    return possibleConstructorReturn(this, (VideoPoll.__proto__ || Object.getPrototypeOf(VideoPoll)).apply(this, arguments));
  }

  createClass(VideoPoll, [{
    key: 'getPollOptions',
    value: function getPollOptions(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/poll_options');
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(VideoPoll.prototype.__proto__ || Object.getPrototypeOf(VideoPoll.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        close_after_voting: 'close_after_voting',
        default_open: 'default_open',
        id: 'id',
        question: 'question',
        show_gradient: 'show_gradient',
        show_results: 'show_results',
        status: 'status'
      });
    }
  }, {
    key: 'Action',
    get: function get() {
      return Object.freeze({
        attach_to_video: 'ATTACH_TO_VIDEO',
        close: 'CLOSE',
        delete_poll: 'DELETE_POLL',
        show_results: 'SHOW_RESULTS',
        show_voting: 'SHOW_VOTING'
      });
    }
  }]);
  return VideoPoll;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * LiveVideo
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var LiveVideo = function (_AbstractCrudObject) {
  inherits(LiveVideo, _AbstractCrudObject);

  function LiveVideo() {
    classCallCheck(this, LiveVideo);
    return possibleConstructorReturn(this, (LiveVideo.__proto__ || Object.getPrototypeOf(LiveVideo)).apply(this, arguments));
  }

  createClass(LiveVideo, [{
    key: 'getBlockedUsers',
    value: function getBlockedUsers(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(User, fields, params, fetchFirstPage, '/blocked_users');
    }
  }, {
    key: 'getComments',
    value: function getComments(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Comment, fields, params, fetchFirstPage, '/comments');
    }
  }, {
    key: 'getCrosspostSharedPages',
    value: function getCrosspostSharedPages(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Page, fields, params, fetchFirstPage, '/crosspost_shared_pages');
    }
  }, {
    key: 'getCrosspostedBroadcasts',
    value: function getCrosspostedBroadcasts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(LiveVideo, fields, params, fetchFirstPage, '/crossposted_broadcasts');
    }
  }, {
    key: 'getErrors',
    value: function getErrors(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(LiveVideoError, fields, params, fetchFirstPage, '/errors');
    }
  }, {
    key: 'getLikes',
    value: function getLikes(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Profile, fields, params, fetchFirstPage, '/likes');
    }
  }, {
    key: 'getPolls',
    value: function getPolls(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(VideoPoll, fields, params, fetchFirstPage, '/polls');
    }
  }, {
    key: 'createPoll',
    value: function createPoll(fields, params) {
      return this.createEdge('/polls', fields, params, VideoPoll);
    }
  }, {
    key: 'getReactions',
    value: function getReactions(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Profile, fields, params, fetchFirstPage, '/reactions');
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(LiveVideo.prototype.__proto__ || Object.getPrototypeOf(LiveVideo.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(LiveVideo.prototype.__proto__ || Object.getPrototypeOf(LiveVideo.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        ad_break_config: 'ad_break_config',
        ad_break_failure_reason: 'ad_break_failure_reason',
        broadcast_start_time: 'broadcast_start_time',
        copyright: 'copyright',
        creation_time: 'creation_time',
        dash_ingest_url: 'dash_ingest_url',
        dash_preview_url: 'dash_preview_url',
        description: 'description',
        embed_html: 'embed_html',
        from: 'from',
        id: 'id',
        ingest_streams: 'ingest_streams',
        is_manual_mode: 'is_manual_mode',
        is_reference_only: 'is_reference_only',
        live_encoders: 'live_encoders',
        live_views: 'live_views',
        permalink_url: 'permalink_url',
        planned_start_time: 'planned_start_time',
        seconds_left: 'seconds_left',
        secure_stream_url: 'secure_stream_url',
        status: 'status',
        stream_url: 'stream_url',
        targeting: 'targeting',
        title: 'title',
        total_views: 'total_views',
        video: 'video'
      });
    }
  }, {
    key: 'Projection',
    get: function get() {
      return Object.freeze({
        cubemap: 'CUBEMAP',
        equirectangular: 'EQUIRECTANGULAR',
        half_equirectangular: 'HALF_EQUIRECTANGULAR'
      });
    }
  }, {
    key: 'SpatialAudioFormat',
    get: function get() {
      return Object.freeze({
        ambix_4: 'ambiX_4'
      });
    }
  }, {
    key: 'Status',
    get: function get() {
      return Object.freeze({
        live_now: 'LIVE_NOW',
        scheduled_canceled: 'SCHEDULED_CANCELED',
        scheduled_live: 'SCHEDULED_LIVE',
        scheduled_unpublished: 'SCHEDULED_UNPUBLISHED',
        unpublished: 'UNPUBLISHED'
      });
    }
  }, {
    key: 'StereoscopicMode',
    get: function get() {
      return Object.freeze({
        left_right: 'LEFT_RIGHT',
        mono: 'MONO',
        top_bottom: 'TOP_BOTTOM'
      });
    }
  }, {
    key: 'StreamType',
    get: function get() {
      return Object.freeze({
        ambient: 'AMBIENT',
        regular: 'REGULAR'
      });
    }
  }, {
    key: 'BroadcastStatus',
    get: function get() {
      return Object.freeze({
        live: 'LIVE',
        live_stopped: 'LIVE_STOPPED',
        processing: 'PROCESSING',
        scheduled_canceled: 'SCHEDULED_CANCELED',
        scheduled_expired: 'SCHEDULED_EXPIRED',
        scheduled_live: 'SCHEDULED_LIVE',
        scheduled_unpublished: 'SCHEDULED_UNPUBLISHED',
        unpublished: 'UNPUBLISHED',
        vod: 'VOD'
      });
    }
  }, {
    key: 'Source',
    get: function get() {
      return Object.freeze({
        owner: 'owner',
        target: 'target'
      });
    }
  }, {
    key: 'LiveCommentModerationSetting',
    get: function get() {
      return Object.freeze({
        discussion: 'DISCUSSION',
        follower: 'FOLLOWER',
        protected_mode: 'PROTECTED_MODE',
        restricted: 'RESTRICTED',
        slow: 'SLOW',
        supporter: 'SUPPORTER'
      });
    }
  }]);
  return LiveVideo;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Event
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Event = function (_AbstractCrudObject) {
  inherits(Event, _AbstractCrudObject);

  function Event() {
    classCallCheck(this, Event);
    return possibleConstructorReturn(this, (Event.__proto__ || Object.getPrototypeOf(Event)).apply(this, arguments));
  }

  createClass(Event, [{
    key: 'getAdmins',
    value: function getAdmins(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Profile, fields, params, fetchFirstPage, '/admins');
    }
  }, {
    key: 'getComments',
    value: function getComments(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(NullNode, fields, params, fetchFirstPage, '/comments');
    }
  }, {
    key: 'getFeed',
    value: function getFeed(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(NullNode, fields, params, fetchFirstPage, '/feed');
    }
  }, {
    key: 'createFeed',
    value: function createFeed(fields, params) {
      return this.createEdge('/feed', fields, params);
    }
  }, {
    key: 'getLiveVideos',
    value: function getLiveVideos(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(NullNode, fields, params, fetchFirstPage, '/live_videos');
    }
  }, {
    key: 'createLiveVideo',
    value: function createLiveVideo(fields, params) {
      return this.createEdge('/live_videos', fields, params, LiveVideo);
    }
  }, {
    key: 'getPhotos',
    value: function getPhotos(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(NullNode, fields, params, fetchFirstPage, '/photos');
    }
  }, {
    key: 'createPhoto',
    value: function createPhoto(fields, params) {
      return this.createEdge('/photos', fields, params, Photo);
    }
  }, {
    key: 'getPicture',
    value: function getPicture(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(NullNode, fields, params, fetchFirstPage, '/picture');
    }
  }, {
    key: 'getPosts',
    value: function getPosts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(NullNode, fields, params, fetchFirstPage, '/posts');
    }
  }, {
    key: 'getRoles',
    value: function getRoles(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Profile, fields, params, fetchFirstPage, '/roles');
    }
  }, {
    key: 'getVideos',
    value: function getVideos(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(NullNode, fields, params, fetchFirstPage, '/videos');
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        attending_count: 'attending_count',
        can_guests_invite: 'can_guests_invite',
        category: 'category',
        cover: 'cover',
        declined_count: 'declined_count',
        description: 'description',
        discount_code_enabled: 'discount_code_enabled',
        end_time: 'end_time',
        event_times: 'event_times',
        guest_list_enabled: 'guest_list_enabled',
        id: 'id',
        interested_count: 'interested_count',
        is_canceled: 'is_canceled',
        is_draft: 'is_draft',
        is_page_owned: 'is_page_owned',
        maybe_count: 'maybe_count',
        name: 'name',
        noreply_count: 'noreply_count',
        owner: 'owner',
        parent_group: 'parent_group',
        place: 'place',
        scheduled_publish_time: 'scheduled_publish_time',
        start_time: 'start_time',
        ticket_uri: 'ticket_uri',
        ticket_uri_start_sales_time: 'ticket_uri_start_sales_time',
        ticketing_privacy_uri: 'ticketing_privacy_uri',
        ticketing_terms_uri: 'ticketing_terms_uri',
        timezone: 'timezone',
        type: 'type',
        updated_time: 'updated_time'
      });
    }
  }, {
    key: 'Type',
    get: function get() {
      return Object.freeze({
        community: 'community',
        group: 'group',
        private: 'private',
        public: 'public'
      });
    }
  }, {
    key: 'EventStateFilter',
    get: function get() {
      return Object.freeze({
        canceled: 'canceled',
        draft: 'draft',
        published: 'published',
        scheduled_draft_for_publication: 'scheduled_draft_for_publication'
      });
    }
  }, {
    key: 'TimeFilter',
    get: function get() {
      return Object.freeze({
        past: 'past',
        upcoming: 'upcoming'
      });
    }
  }, {
    key: 'PromotableEventTypes',
    get: function get() {
      return Object.freeze({
        offsite_ticket: 'OFFSITE_TICKET',
        onsite_ticket: 'ONSITE_TICKET',
        rsvp: 'RSVP'
      });
    }
  }]);
  return Event;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * FriendList
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var FriendList = function (_AbstractCrudObject) {
  inherits(FriendList, _AbstractCrudObject);

  function FriendList() {
    classCallCheck(this, FriendList);
    return possibleConstructorReturn(this, (FriendList.__proto__ || Object.getPrototypeOf(FriendList)).apply(this, arguments));
  }

  createClass(FriendList, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        id: 'id',
        list_type: 'list_type',
        name: 'name',
        owner: 'owner'
      });
    }
  }]);
  return FriendList;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * VideoThumbnail
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var VideoThumbnail = function (_AbstractCrudObject) {
  inherits(VideoThumbnail, _AbstractCrudObject);

  function VideoThumbnail() {
    classCallCheck(this, VideoThumbnail);
    return possibleConstructorReturn(this, (VideoThumbnail.__proto__ || Object.getPrototypeOf(VideoThumbnail)).apply(this, arguments));
  }

  createClass(VideoThumbnail, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        height: 'height',
        id: 'id',
        is_preferred: 'is_preferred',
        name: 'name',
        scale: 'scale',
        uri: 'uri',
        width: 'width'
      });
    }
  }]);
  return VideoThumbnail;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 * 
 */
/**
 * Video uploader that can upload videos to adaccount
 **/

var VideoUploader = function () {
  function VideoUploader() {
    classCallCheck(this, VideoUploader);

    this._session = null;
  }

  /**
   * Upload the given video file.
   * @param {AdVideo} video The AdVideo object that will be uploaded
   * @param {Boolean} [waitForEncoding] Whether to wait until encoding
   *   is finished
   **/


  createClass(VideoUploader, [{
    key: 'upload',
    value: function upload(video, waitForEncoding) {
      // Check there is no existing session
      if (this._session) {
        throw Error('There is already an upload session for this video uploader');
      }

      // Initate an upload session
      this._session = new VideoUploadSession(video, waitForEncoding);
      var result = this._session.start();
      this._session = null;
      return result;
    }
  }]);
  return VideoUploader;
}();

var VideoUploadSession = function () {
  function VideoUploadSession(video) {
    var waitForEncoding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    classCallCheck(this, VideoUploadSession);

    this._video = video;
    this._api = video.getApi();

    if (video[AdVideo.Fields.filepath]) {
      this._filePath = video[AdVideo.Fields.filepath];
      this._slideshowSpec = null;
    } else if (video[AdVideo.Fields.slideshow_spec]) {
      this._slideshowSpec = video[AdVideo.Fields.slideshow_spec];
      this._filepath = null;
    }

    this._accountId = video.getParentId();
    this._waitForEncoding = waitForEncoding;
    // Setup start request manager
    this._startRequestManager = new VideoUploadStartRequestManager(this._api);
    // Setup transfer request manager
    this._transferRequestManager = new VideoUploadTransferRequestManager(this._api);
    // Setup finish request manager
    this._finishRequestManager = new VideoUploadFinishRequestManager(this._api);
  }

  createClass(VideoUploadSession, [{
    key: 'start',
    value: function start() {
      var videoId,
          startResponse,
          finishResponse,
          body,
          _this5 = this;

      return Promise.resolve().then(function () {
        videoId = void 0;

        // Run start request manager

        return _this5._startRequestManager.sendRequest(_this5.getStartRequestContext());
      }).then(function (_resp) {
        startResponse = _resp;

        _this5._startOffset = parseInt(startResponse['start_offset']);
        _this5._endOffset = parseInt(startResponse['end_offset']);
        _this5._sessionId = startResponse['upload_session_id'];
        videoId = startResponse['video_id'];
        // Run transfer request manager
        return _this5._transferRequestManager.sendRequest(_this5.getTransferRequestContext());
      }).then(function () {
        return _this5._finishRequestManager.sendRequest(_this5.getFinishRequestContext());
      }).then(function (_resp) {
        // Run finish request manager
        finishResponse = _resp;
        // Populate the video info

        body = finishResponse;

        body.id = videoId;
        delete body.success;

        return body;
      });
    }
  }, {
    key: 'getStartRequestContext',
    value: function getStartRequestContext() {
      var context = new VideoUploadRequestContext();

      if (this._filePath) {
        // Read file size
        context.fileSize = fs.statSync(this._filePath).size;
      }
      context.accountId = this._accountId;

      return context;
    }
  }, {
    key: 'getTransferRequestContext',
    value: function getTransferRequestContext() {
      var context = new VideoUploadRequestContext();

      context.sessionId = this._sessionId;
      context.startOffset = this._startOffset;
      context.endOffset = this._endOffset;

      if (this._filePath) {
        context.filePath = this._filePath;
      }
      if (this._slideshowSpec) {
        context.slideshowSpec = this._slideshowSpec;
      }
      context.accountId = this._accountId;

      return context;
    }
  }, {
    key: 'getFinishRequestContext',
    value: function getFinishRequestContext() {
      var context = new VideoUploadRequestContext();

      context.sessionId = this._sessionId;
      context.accountId = this._accountId;

      if (this._filePath) {
        context.fileName = path.basename(this._filePath);
      }

      return context;
    }
  }]);
  return VideoUploadSession;
}();

/**
 * Abstract class for request managers
 **/


var VideoUploadRequestManager = function VideoUploadRequestManager(api) {
  classCallCheck(this, VideoUploadRequestManager);

  this._api = api;

  // Check subclass method implementation
  if (this.sendRequest === undefined) {
    throw new TypeError('Class extending VideoUploadRequestManager must implement ' + 'sendRequest method');
  }

  // Check subclass method implementation
  if (this.getParamsFromContext === undefined) {
    throw new TypeError('Class extending VideoUploadRequestManager must implement ' + 'getParamsFromContext method');
  }
};

var VideoUploadStartRequestManager = function (_VideoUploadRequestMa) {
  inherits(VideoUploadStartRequestManager, _VideoUploadRequestMa);

  function VideoUploadStartRequestManager() {
    classCallCheck(this, VideoUploadStartRequestManager);
    return possibleConstructorReturn(this, (VideoUploadStartRequestManager.__proto__ || Object.getPrototypeOf(VideoUploadStartRequestManager)).apply(this, arguments));
  }

  createClass(VideoUploadStartRequestManager, [{
    key: 'sendRequest',

    /**
     * Send start request with the given context
     **/
    value: function sendRequest(context) {
      var request,
          response,
          _this6 = this;

      return Promise.resolve().then(function () {
        // Init a VideoUploadRequest and send the request
        request = new VideoUploadRequest(_this6._api);

        request.setParams(_this6.getParamsFromContext(context));

        return request.send([context.accountId, 'advideos']);
      }).then(function (_resp) {
        response = _resp;


        return response;
      });
    }
  }, {
    key: 'getParamsFromContext',
    value: function getParamsFromContext(context) {
      return {
        file_size: context.fileSize,
        upload_phase: 'start'
      };
    }
  }]);
  return VideoUploadStartRequestManager;
}(VideoUploadRequestManager);

var VideoUploadTransferRequestManager = function (_VideoUploadRequestMa2) {
  inherits(VideoUploadTransferRequestManager, _VideoUploadRequestMa2);

  function VideoUploadTransferRequestManager() {
    classCallCheck(this, VideoUploadTransferRequestManager);
    return possibleConstructorReturn(this, (VideoUploadTransferRequestManager.__proto__ || Object.getPrototypeOf(VideoUploadTransferRequestManager)).apply(this, arguments));
  }

  createClass(VideoUploadTransferRequestManager, [{
    key: 'sendRequest',


    /**
     * Send transfer request with the given context
     **/
    value: function sendRequest(context) {
      function _recursive() {
        var _this8 = this;

        if (_this8._startOffset !== _this8._endOffset) {
          return Promise.resolve().then(function () {
            context.startOffset = _this8._startOffset;
            context.endOffset = _this8._endOffset;
            request.setParams(_this8.getParamsFromContext(context), {
              video_file_chunk: fs.createReadStream(context.filePath, {
                start: context.startOffset,
                end: context.endOffset - 1
              })
            });
            // Send the request
            return Promise.resolve().then(function () {
              return request.send([context.accountId, 'advideos']);
            }).then(function (_resp) {
              _response = _resp;


              _this8._startOffset = parseInt(_response['start_offset']);
              _this8._endOffset = parseInt(_response['end_offset']);
            }).catch(function (error) {
              if (numRetry > 0) {
                numRetry = Math.max(numRetry - 1, 0);
                return _recursive();
              }
              fs.close(videoFileDescriptor);
              throw error;
            });
          }).then(function () {
            return _recursive();
          });
        }
      }

      var request,
          filePath,
          fileSize,
          numRetry,
          response,
          videoFileDescriptor,
          _response,
          _this7 = this;

      return Promise.resolve().then(function () {
        // Init a VideoUploadRequest
        request = new VideoUploadRequest(_this7._api);

        _this7._startOffset = context.startOffset;
        _this7._endOffset = context.endOffset;
        filePath = context.filePath;
        fileSize = fs.statSync(filePath).size;

        // Give a chance to retry every 10M, or at least twice

        numRetry = Math.max(fileSize / (1024 * 1024 * 10), 2);
        response = null;
        // While there are still more chunks to send

        videoFileDescriptor = fs.openSync(filePath, 'r');
        return _recursive();
      }).then(function () {
        fs.close(videoFileDescriptor);

        return response;
      });
    }
  }, {
    key: 'getParamsFromContext',
    value: function getParamsFromContext(context) {
      return {
        upload_phase: 'transfer',
        start_offset: context.startOffset,
        upload_session_id: context.sessionId,
        video_file_chunk: context.videoFileChunk
      };
    }
  }]);
  return VideoUploadTransferRequestManager;
}(VideoUploadRequestManager);

var VideoUploadFinishRequestManager = function (_VideoUploadRequestMa3) {
  inherits(VideoUploadFinishRequestManager, _VideoUploadRequestMa3);

  function VideoUploadFinishRequestManager() {
    classCallCheck(this, VideoUploadFinishRequestManager);
    return possibleConstructorReturn(this, (VideoUploadFinishRequestManager.__proto__ || Object.getPrototypeOf(VideoUploadFinishRequestManager)).apply(this, arguments));
  }

  createClass(VideoUploadFinishRequestManager, [{
    key: 'sendRequest',

    /**
     * Send transfer request with the given context
     **/
    value: function sendRequest(context) {
      var request,
          response,
          _this11 = this;

      return Promise.resolve().then(function () {
        // Init a VideoUploadRequest
        request = new VideoUploadRequest(_this11._api);

        // Parse the context

        request.setParams(_this11.getParamsFromContext(context));

        // Sent the request
        return request.send([context.accountId, 'advideos']);
      }).then(function (_resp) {
        response = _resp;


        return response;
      });
    }
  }, {
    key: 'getParamsFromContext',
    value: function getParamsFromContext(context) {
      return {
        upload_phase: 'finish',
        upload_session_id: context.sessionId,
        title: context.fileName
      };
    }
  }]);
  return VideoUploadFinishRequestManager;
}(VideoUploadRequestManager);

/**
 * Upload request context that contains the param data
 **/


var VideoUploadRequestContext = function () {
  function VideoUploadRequestContext() {
    classCallCheck(this, VideoUploadRequestContext);
  }

  createClass(VideoUploadRequestContext, [{
    key: 'accountId',
    get: function get() {
      return this._accountId;
    },
    set: function set(accountId) {
      this._accountId = accountId;
    }
  }, {
    key: 'fileName',
    get: function get() {
      return this._fileName;
    },
    set: function set(fileName) {
      this._fileName = fileName;
    }
  }, {
    key: 'filePath',
    get: function get() {
      return this._filePath;
    },
    set: function set(filePath) {
      this._filePath = filePath;
    }
  }, {
    key: 'fileSize',
    get: function get() {
      return this._fileSize;
    },
    set: function set(fileSize) {
      this._fileSize = fileSize;
    }
  }, {
    key: 'name',
    get: function get() {
      return this._name;
    },
    set: function set(name) {
      this._name = name;
    }
  }, {
    key: 'sessionId',
    get: function get() {
      return this._sessionId;
    },
    set: function set(sessionId) {
      this._sessionId = sessionId;
    }
  }, {
    key: 'startOffset',
    get: function get() {
      return this._startOffset;
    },
    set: function set(startOffset) {
      this._startOffset = startOffset;
    }
  }, {
    key: 'endOffset',
    get: function get() {
      return this._endOffset;
    },
    set: function set(endOffset) {
      this._endOffset = endOffset;
    }
  }, {
    key: 'slideshowSpec',
    get: function get() {
      return this._slideshowSpec;
    },
    set: function set(slideshowSpec) {
      this._slideshowSpec = slideshowSpec;
    }
  }]);
  return VideoUploadRequestContext;
}();

var VideoUploadRequest = function () {
  function VideoUploadRequest(api) {
    classCallCheck(this, VideoUploadRequest);

    this._params = null;
    this._files = null;
    this._api = api;
  }

  /**
   * Send the current request
   **/


  createClass(VideoUploadRequest, [{
    key: 'send',
    value: function send(path$$1) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        _this4._api.call('POST', path$$1, _this4._params, _this4._files, true, // use multipart/form-data
        FacebookAdsApi.GRAPH_VIDEO // override graph.facebook.com
        ).then(function (response) {
          return resolve(JSON.parse(response));
        }).catch(function (error) {
          return reject(error);
        });
      });
    }
  }, {
    key: 'setParams',
    value: function setParams(params) {
      var files = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      this._params = params;
      this._files = files;
    }
  }]);
  return VideoUploadRequest;
}();

function sleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}

var VideoEncodingStatusChecker = function () {
  function VideoEncodingStatusChecker() {
    classCallCheck(this, VideoEncodingStatusChecker);
  }

  createClass(VideoEncodingStatusChecker, null, [{
    key: 'waitUntilReady',
    value: function waitUntilReady(api, videoId, interval, timeout) {
      function _recursive2() {
        var _test;

        _test = true;

        if (_test) {
          status = VideoEncodingStatusChecker.getStatus(api, videoId);
          status = status['video_status'];
        }

        if (_test && status !== 'processing') {
          return _recursive2;
        } else {

          if (_test && startTime + timeout <= new Date().getTime()) {
            throw Error('Video encoding timeout: ' + timeout);
          }

          if (_test) {
            return Promise.resolve().then(function () {
              return sleep(interval);
            }).then(function () {
              return _recursive2();
            });
          }
        }
      }

      var startTime, status;
      return Promise.resolve().then(function () {
        startTime = new Date().getTime();
        status = null;
        return _recursive2();
      }).then(function () {

        if (status !== 'ready') {
          throw Error('Video encoding status ' + status);
        }

        return;
      });
    }
  }, {
    key: 'getStatus',
    value: function getStatus(api, videoId) {
      var result = api.call('GET', [parseInt(videoId)], { fields: 'status' });

      return result['status'];
    }
  }]);
  return VideoEncodingStatusChecker;
}();

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

/**
 * AdVideo
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdVideo = function (_AbstractCrudObject) {
  inherits(AdVideo, _AbstractCrudObject);

  function AdVideo() {
    classCallCheck(this, AdVideo);
    return possibleConstructorReturn(this, (AdVideo.__proto__ || Object.getPrototypeOf(AdVideo)).apply(this, arguments));
  }

  createClass(AdVideo, [{
    key: 'create',


    /**
     * Uploads filepath and creates the AdVideo object from it.
     * It requires 'filepath' property to be defined.
     **/
    value: function create(batch, failureHandler, successHandler) {
      var response = null;

      if (this[AdVideo.Fields.slideshow_spec]) {
        var request = new VideoUploadRequest(this.getApi());

        request.setParams({
          'slideshow_spec[images_urls]': JSON.stringify(this[AdVideo.Fields.slideshow_spec]['images_urls']),
          'slideshow_spec[duration_ms]': this[AdVideo.Fields.slideshow_spec]['duration_ms'],
          'slideshow_spec[transition_ms]': this[AdVideo.Fields.slideshow_spec]['transition_ms']
        });
        response = request.send([this.getParentId(), 'advideos']);
      } else if (this[AdVideo.Fields.filepath]) {
        var videoUploader = new VideoUploader();

        response = videoUploader.upload(this);
      } else {
        throw Error('AdVideo requires a filepath or slideshow_spec to be defined.');
      }

      this.setData(response);

      return response;
    }
  }, {
    key: 'waitUntilEncodingReady',
    value: function waitUntilEncodingReady() {
      var interval = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 30;
      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 600;

      if (!this['id']) {
        throw Error('Invalid Video ID');
      }

      VideoEncodingStatusChecker.waitUntilReady(this.getApi(), this['id'], interval, timeout);
    }

    /**
     *  Returns all the thumbnails associated with the ad video
     */

  }, {
    key: 'getThumbnails',
    value: function getThumbnails(fields, params) {
      return this.getEdge(VideoThumbnail, fields, params, 'thumbnails');
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        filepath: 'filepath',
        id: 'id',
        slideshow_spec: 'slideshow_spec'
      });
    }
  }]);
  return AdVideo;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Group
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Group = function (_AbstractCrudObject) {
  inherits(Group, _AbstractCrudObject);

  function Group() {
    classCallCheck(this, Group);
    return possibleConstructorReturn(this, (Group.__proto__ || Object.getPrototypeOf(Group)).apply(this, arguments));
  }

  createClass(Group, [{
    key: 'deleteAdmins',
    value: function deleteAdmins(params) {
      return get$1(Group.prototype.__proto__ || Object.getPrototypeOf(Group.prototype), 'deleteEdge', this).call(this, '/admins', params);
    }
  }, {
    key: 'createAdmin',
    value: function createAdmin(fields, params) {
      return this.createEdge('/admins', fields, params, Group);
    }
  }, {
    key: 'getAlbums',
    value: function getAlbums(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Album, fields, params, fetchFirstPage, '/albums');
    }
  }, {
    key: 'createAlbum',
    value: function createAlbum(fields, params) {
      return this.createEdge('/albums', fields, params, Album);
    }
  }, {
    key: 'getDocs',
    value: function getDocs(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/docs');
    }
  }, {
    key: 'getEvents',
    value: function getEvents(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Event, fields, params, fetchFirstPage, '/events');
    }
  }, {
    key: 'createFeed',
    value: function createFeed(fields, params) {
      return this.createEdge('/feed', fields, params);
    }
  }, {
    key: 'getGroups',
    value: function getGroups(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Group, fields, params, fetchFirstPage, '/groups');
    }
  }, {
    key: 'createGroup',
    value: function createGroup(fields, params) {
      return this.createEdge('/groups', fields, params, Group);
    }
  }, {
    key: 'getLiveVideos',
    value: function getLiveVideos(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(LiveVideo, fields, params, fetchFirstPage, '/live_videos');
    }
  }, {
    key: 'createLiveVideo',
    value: function createLiveVideo(fields, params) {
      return this.createEdge('/live_videos', fields, params, LiveVideo);
    }
  }, {
    key: 'deleteMembers',
    value: function deleteMembers(params) {
      return get$1(Group.prototype.__proto__ || Object.getPrototypeOf(Group.prototype), 'deleteEdge', this).call(this, '/members', params);
    }
  }, {
    key: 'createMember',
    value: function createMember(fields, params) {
      return this.createEdge('/members', fields, params, Group);
    }
  }, {
    key: 'createOpenGraphActionFeed',
    value: function createOpenGraphActionFeed(fields, params) {
      return this.createEdge('/opengraphactionfeed', fields, params);
    }
  }, {
    key: 'getOptedInMembers',
    value: function getOptedInMembers(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(User, fields, params, fetchFirstPage, '/opted_in_members');
    }
  }, {
    key: 'createPhoto',
    value: function createPhoto(fields, params) {
      return this.createEdge('/photos', fields, params, Photo);
    }
  }, {
    key: 'getPicture',
    value: function getPicture(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProfilePictureSource, fields, params, fetchFirstPage, '/picture');
    }
  }, {
    key: 'getVideos',
    value: function getVideos(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdVideo, fields, params, fetchFirstPage, '/videos');
    }
  }, {
    key: 'createVideo',
    value: function createVideo(fields, params) {
      return this.createEdge('/videos', fields, params, AdVideo);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(Group.prototype.__proto__ || Object.getPrototypeOf(Group.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        archived: 'archived',
        cover: 'cover',
        created_time: 'created_time',
        description: 'description',
        email: 'email',
        icon: 'icon',
        id: 'id',
        link: 'link',
        member_count: 'member_count',
        member_request_count: 'member_request_count',
        name: 'name',
        owner: 'owner',
        parent: 'parent',
        permissions: 'permissions',
        privacy: 'privacy',
        purpose: 'purpose',
        subdomain: 'subdomain',
        updated_time: 'updated_time',
        venue: 'venue'
      });
    }
  }, {
    key: 'JoinSetting',
    get: function get() {
      return Object.freeze({
        admin_only: 'ADMIN_ONLY',
        anyone: 'ANYONE',
        none: 'NONE'
      });
    }
  }, {
    key: 'PostPermissions',
    get: function get() {
      return Object.freeze({
        admin_only: 'ADMIN_ONLY',
        anyone: 'ANYONE',
        none: 'NONE'
      });
    }
  }, {
    key: 'Purpose',
    get: function get() {
      return Object.freeze({
        casual: 'CASUAL',
        close_friends: 'CLOSE_FRIENDS',
        club: 'CLUB',
        couple: 'COUPLE',
        coworkers: 'COWORKERS',
        custom: 'CUSTOM',
        ephemeral: 'EPHEMERAL',
        event_planning: 'EVENT_PLANNING',
        family: 'FAMILY',
        fitness: 'FITNESS',
        for_sale: 'FOR_SALE',
        for_work: 'FOR_WORK',
        fraternity: 'FRATERNITY',
        game: 'GAME',
        health_support: 'HEALTH_SUPPORT',
        high_school_forum: 'HIGH_SCHOOL_FORUM',
        jobs: 'JOBS',
        learning: 'LEARNING',
        meme: 'MEME',
        mentorship: 'MENTORSHIP',
        neighbors: 'NEIGHBORS',
        none: 'NONE',
        parents: 'PARENTS',
        project: 'PROJECT',
        real_world: 'REAL_WORLD',
        real_world_at_work: 'REAL_WORLD_AT_WORK',
        school_class: 'SCHOOL_CLASS',
        sorority: 'SORORITY',
        study_group: 'STUDY_GROUP',
        support: 'SUPPORT',
        teammates: 'TEAMMATES',
        travel_planning: 'TRAVEL_PLANNING',
        work_announcement: 'WORK_ANNOUNCEMENT',
        work_demo_group: 'WORK_DEMO_GROUP',
        work_discussion: 'WORK_DISCUSSION',
        work_ephemeral: 'WORK_EPHEMERAL',
        work_feedback: 'WORK_FEEDBACK',
        work_for_sale: 'WORK_FOR_SALE',
        work_learning: 'WORK_LEARNING',
        work_mentorship: 'WORK_MENTORSHIP',
        work_multi_company: 'WORK_MULTI_COMPANY',
        work_recruiting: 'WORK_RECRUITING',
        work_social: 'WORK_SOCIAL',
        work_team: 'WORK_TEAM',
        work_teamwork: 'WORK_TEAMWORK'
      });
    }
  }, {
    key: 'GroupType',
    get: function get() {
      return Object.freeze({
        casual: 'CASUAL',
        close_friends: 'CLOSE_FRIENDS',
        club: 'CLUB',
        couple: 'COUPLE',
        coworkers: 'COWORKERS',
        custom: 'CUSTOM',
        ephemeral: 'EPHEMERAL',
        event_planning: 'EVENT_PLANNING',
        family: 'FAMILY',
        fitness: 'FITNESS',
        for_sale: 'FOR_SALE',
        for_work: 'FOR_WORK',
        fraternity: 'FRATERNITY',
        game: 'GAME',
        health_support: 'HEALTH_SUPPORT',
        high_school_forum: 'HIGH_SCHOOL_FORUM',
        jobs: 'JOBS',
        learning: 'LEARNING',
        meme: 'MEME',
        mentorship: 'MENTORSHIP',
        neighbors: 'NEIGHBORS',
        none: 'NONE',
        parents: 'PARENTS',
        project: 'PROJECT',
        real_world: 'REAL_WORLD',
        real_world_at_work: 'REAL_WORLD_AT_WORK',
        school_class: 'SCHOOL_CLASS',
        sorority: 'SORORITY',
        study_group: 'STUDY_GROUP',
        support: 'SUPPORT',
        teammates: 'TEAMMATES',
        travel_planning: 'TRAVEL_PLANNING',
        work_announcement: 'WORK_ANNOUNCEMENT',
        work_demo_group: 'WORK_DEMO_GROUP',
        work_discussion: 'WORK_DISCUSSION',
        work_ephemeral: 'WORK_EPHEMERAL',
        work_feedback: 'WORK_FEEDBACK',
        work_for_sale: 'WORK_FOR_SALE',
        work_learning: 'WORK_LEARNING',
        work_mentorship: 'WORK_MENTORSHIP',
        work_multi_company: 'WORK_MULTI_COMPANY',
        work_recruiting: 'WORK_RECRUITING',
        work_social: 'WORK_SOCIAL',
        work_team: 'WORK_TEAM',
        work_teamwork: 'WORK_TEAMWORK'
      });
    }
  }, {
    key: 'SuggestionCategory',
    get: function get() {
      return Object.freeze({
        close_friends: 'CLOSE_FRIENDS',
        close_friends_generic: 'CLOSE_FRIENDS_GENERIC',
        current_city: 'CURRENT_CITY',
        event: 'EVENT',
        family: 'FAMILY',
        friend_list: 'FRIEND_LIST',
        games: 'GAMES',
        life_event: 'LIFE_EVENT',
        messenger: 'MESSENGER',
        messenger_thread: 'MESSENGER_THREAD',
        nearby_friends: 'NEARBY_FRIENDS',
        page_admin: 'PAGE_ADMIN',
        school: 'SCHOOL',
        school_generic: 'SCHOOL_GENERIC',
        top_page: 'TOP_PAGE',
        work: 'WORK',
        workplace: 'WORKPLACE',
        workplace_1_1: 'WORKPLACE_1_1',
        workplace_manager: 'WORKPLACE_MANAGER',
        work_generic: 'WORK_GENERIC'
      });
    }
  }]);
  return Group;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * UserIDForApp
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var UserIDForApp = function (_AbstractCrudObject) {
  inherits(UserIDForApp, _AbstractCrudObject);

  function UserIDForApp() {
    classCallCheck(this, UserIDForApp);
    return possibleConstructorReturn(this, (UserIDForApp.__proto__ || Object.getPrototypeOf(UserIDForApp)).apply(this, arguments));
  }

  createClass(UserIDForApp, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        app: 'app',
        id: 'id'
      });
    }
  }]);
  return UserIDForApp;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * UserIDForPage
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var UserIDForPage = function (_AbstractCrudObject) {
  inherits(UserIDForPage, _AbstractCrudObject);

  function UserIDForPage() {
    classCallCheck(this, UserIDForPage);
    return possibleConstructorReturn(this, (UserIDForPage.__proto__ || Object.getPrototypeOf(UserIDForPage)).apply(this, arguments));
  }

  createClass(UserIDForPage, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        id: 'id',
        page: 'page'
      });
    }
  }]);
  return UserIDForPage;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * LiveEncoder
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var LiveEncoder = function (_AbstractCrudObject) {
  inherits(LiveEncoder, _AbstractCrudObject);

  function LiveEncoder() {
    classCallCheck(this, LiveEncoder);
    return possibleConstructorReturn(this, (LiveEncoder.__proto__ || Object.getPrototypeOf(LiveEncoder)).apply(this, arguments));
  }

  createClass(LiveEncoder, [{
    key: 'createTelemetry',
    value: function createTelemetry(fields, params) {
      return this.createEdge('/telemetry', fields, params, LiveEncoder);
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(LiveEncoder.prototype.__proto__ || Object.getPrototypeOf(LiveEncoder.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(LiveEncoder.prototype.__proto__ || Object.getPrototypeOf(LiveEncoder.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        brand: 'brand',
        creation_time: 'creation_time',
        current_broadcast: 'current_broadcast',
        current_input_stream: 'current_input_stream',
        device_id: 'device_id',
        id: 'id',
        last_heartbeat_time: 'last_heartbeat_time',
        model: 'model',
        name: 'name',
        status: 'status',
        version: 'version'
      });
    }
  }, {
    key: 'Status',
    get: function get() {
      return Object.freeze({
        capture: 'CAPTURE',
        live: 'LIVE',
        none: 'NONE',
        preview: 'PREVIEW',
        ready: 'READY',
        register: 'REGISTER'
      });
    }
  }]);
  return LiveEncoder;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Permission
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Permission = function (_AbstractCrudObject) {
  inherits(Permission, _AbstractCrudObject);

  function Permission() {
    classCallCheck(this, Permission);
    return possibleConstructorReturn(this, (Permission.__proto__ || Object.getPrototypeOf(Permission)).apply(this, arguments));
  }

  createClass(Permission, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        permission: 'permission',
        status: 'status'
      });
    }
  }, {
    key: 'Status',
    get: function get() {
      return Object.freeze({
        declined: 'declined',
        granted: 'granted'
      });
    }
  }]);
  return Permission;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Domain
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Domain = function (_AbstractCrudObject) {
  inherits(Domain, _AbstractCrudObject);

  function Domain() {
    classCallCheck(this, Domain);
    return possibleConstructorReturn(this, (Domain.__proto__ || Object.getPrototypeOf(Domain)).apply(this, arguments));
  }

  createClass(Domain, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        id: 'id',
        name: 'name',
        url: 'url'
      });
    }
  }]);
  return Domain;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * RequestHistory
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var RequestHistory = function (_AbstractCrudObject) {
  inherits(RequestHistory, _AbstractCrudObject);

  function RequestHistory() {
    classCallCheck(this, RequestHistory);
    return possibleConstructorReturn(this, (RequestHistory.__proto__ || Object.getPrototypeOf(RequestHistory)).apply(this, arguments));
  }

  createClass(RequestHistory, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        api_version: 'api_version',
        created_time: 'created_time',
        error_code: 'error_code',
        graph_path: 'graph_path',
        http_method: 'http_method',
        post_params: 'post_params',
        query_params: 'query_params'
      });
    }
  }, {
    key: 'HttpMethod',
    get: function get() {
      return Object.freeze({
        delete: 'DELETE',
        get: 'GET',
        post: 'POST'
      });
    }
  }]);
  return RequestHistory;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * UserTaggableFriend
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var UserTaggableFriend = function (_AbstractCrudObject) {
  inherits(UserTaggableFriend, _AbstractCrudObject);

  function UserTaggableFriend() {
    classCallCheck(this, UserTaggableFriend);
    return possibleConstructorReturn(this, (UserTaggableFriend.__proto__ || Object.getPrototypeOf(UserTaggableFriend)).apply(this, arguments));
  }

  createClass(UserTaggableFriend, [{
    key: 'getPicture',
    value: function getPicture(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProfilePictureSource, fields, params, fetchFirstPage, '/picture');
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        first_name: 'first_name',
        id: 'id',
        last_name: 'last_name',
        middle_name: 'middle_name',
        name: 'name'
      });
    }
  }]);
  return UserTaggableFriend;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * User
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var User = function (_AbstractCrudObject) {
  inherits(User, _AbstractCrudObject);

  function User() {
    classCallCheck(this, User);
    return possibleConstructorReturn(this, (User.__proto__ || Object.getPrototypeOf(User)).apply(this, arguments));
  }

  createClass(User, [{
    key: 'createAccessToken',
    value: function createAccessToken(fields, params) {
      return this.createEdge('/access_tokens', fields, params, User);
    }
  }, {
    key: 'deleteAccessTokens',
    value: function deleteAccessTokens(params) {
      return get$1(User.prototype.__proto__ || Object.getPrototypeOf(User.prototype), 'deleteEdge', this).call(this, '/accesstokens', params);
    }
  }, {
    key: 'getAccounts',
    value: function getAccounts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Page, fields, params, fetchFirstPage, '/accounts');
    }
  }, {
    key: 'createAccount',
    value: function createAccount(fields, params) {
      return this.createEdge('/accounts', fields, params, Page);
    }
  }, {
    key: 'createAchievement',
    value: function createAchievement(fields, params) {
      return this.createEdge('/achievements', fields, params);
    }
  }, {
    key: 'getAdStudies',
    value: function getAdStudies(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdStudy, fields, params, fetchFirstPage, '/ad_studies');
    }
  }, {
    key: 'getAdAccounts',
    value: function getAdAccounts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAccount, fields, params, fetchFirstPage, '/adaccounts');
    }
  }, {
    key: 'getAlbums',
    value: function getAlbums(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Album, fields, params, fetchFirstPage, '/albums');
    }
  }, {
    key: 'createApplication',
    value: function createApplication(fields, params) {
      return this.createEdge('/applications', fields, params, User);
    }
  }, {
    key: 'getAppRequestFormerRecipients',
    value: function getAppRequestFormerRecipients(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AppRequestFormerRecipient, fields, params, fetchFirstPage, '/apprequestformerrecipients');
    }
  }, {
    key: 'getAppRequests',
    value: function getAppRequests(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AppRequest, fields, params, fetchFirstPage, '/apprequests');
    }
  }, {
    key: 'getAssignedAdAccounts',
    value: function getAssignedAdAccounts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAccount, fields, params, fetchFirstPage, '/assigned_ad_accounts');
    }
  }, {
    key: 'getAssignedPages',
    value: function getAssignedPages(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Page, fields, params, fetchFirstPage, '/assigned_pages');
    }
  }, {
    key: 'getAssignedProductCatalogs',
    value: function getAssignedProductCatalogs(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProductCatalog, fields, params, fetchFirstPage, '/assigned_product_catalogs');
    }
  }, {
    key: 'getBooks',
    value: function getBooks(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Page, fields, params, fetchFirstPage, '/books');
    }
  }, {
    key: 'getBusinessUsers',
    value: function getBusinessUsers(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(BusinessUser, fields, params, fetchFirstPage, '/business_users');
    }
  }, {
    key: 'deleteBusinesses',
    value: function deleteBusinesses(params) {
      return get$1(User.prototype.__proto__ || Object.getPrototypeOf(User.prototype), 'deleteEdge', this).call(this, '/businesses', params);
    }
  }, {
    key: 'getBusinesses',
    value: function getBusinesses(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Business, fields, params, fetchFirstPage, '/businesses');
    }
  }, {
    key: 'getConversations',
    value: function getConversations(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(UnifiedThread, fields, params, fetchFirstPage, '/conversations');
    }
  }, {
    key: 'getEvents',
    value: function getEvents(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Event, fields, params, fetchFirstPage, '/events');
    }
  }, {
    key: 'getFamily',
    value: function getFamily(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(User, fields, params, fetchFirstPage, '/family');
    }
  }, {
    key: 'getFavoriteRequests',
    value: function getFavoriteRequests(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/favorite_requests');
    }
  }, {
    key: 'createFeed',
    value: function createFeed(fields, params) {
      return this.createEdge('/feed', fields, params);
    }
  }, {
    key: 'getFriendLists',
    value: function getFriendLists(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(FriendList, fields, params, fetchFirstPage, '/friendlists');
    }
  }, {
    key: 'getFriends',
    value: function getFriends(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(User, fields, params, fetchFirstPage, '/friends');
    }
  }, {
    key: 'createGameItem',
    value: function createGameItem(fields, params) {
      return this.createEdge('/game_items', fields, params);
    }
  }, {
    key: 'createGameTime',
    value: function createGameTime(fields, params) {
      return this.createEdge('/game_times', fields, params);
    }
  }, {
    key: 'getGames',
    value: function getGames(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Page, fields, params, fetchFirstPage, '/games');
    }
  }, {
    key: 'createGamesAchieve',
    value: function createGamesAchieve(fields, params) {
      return this.createEdge('/games.achieves', fields, params);
    }
  }, {
    key: 'createGamesStat',
    value: function createGamesStat(fields, params) {
      return this.createEdge('/games_stats', fields, params);
    }
  }, {
    key: 'createGamesPlay',
    value: function createGamesPlay(fields, params) {
      return this.createEdge('/gamesplays', fields, params);
    }
  }, {
    key: 'getGroups',
    value: function getGroups(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Group, fields, params, fetchFirstPage, '/groups');
    }
  }, {
    key: 'getIdsForApps',
    value: function getIdsForApps(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(UserIDForApp, fields, params, fetchFirstPage, '/ids_for_apps');
    }
  }, {
    key: 'getIdsForBusiness',
    value: function getIdsForBusiness(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(UserIDForApp, fields, params, fetchFirstPage, '/ids_for_business');
    }
  }, {
    key: 'getIdsForPages',
    value: function getIdsForPages(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(UserIDForPage, fields, params, fetchFirstPage, '/ids_for_pages');
    }
  }, {
    key: 'getLikes',
    value: function getLikes(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Page, fields, params, fetchFirstPage, '/likes');
    }
  }, {
    key: 'getLiveEncoders',
    value: function getLiveEncoders(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(LiveEncoder, fields, params, fetchFirstPage, '/live_encoders');
    }
  }, {
    key: 'createLiveEncoder',
    value: function createLiveEncoder(fields, params) {
      return this.createEdge('/live_encoders', fields, params, LiveEncoder);
    }
  }, {
    key: 'getLiveVideos',
    value: function getLiveVideos(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(LiveVideo, fields, params, fetchFirstPage, '/live_videos');
    }
  }, {
    key: 'createLiveVideo',
    value: function createLiveVideo(fields, params) {
      return this.createEdge('/live_videos', fields, params, LiveVideo);
    }
  }, {
    key: 'createMfsAccountPinReset',
    value: function createMfsAccountPinReset(fields, params) {
      return this.createEdge('/mfs_account_pin_reset', fields, params, User);
    }
  }, {
    key: 'createMomentsLinkInviteConvert',
    value: function createMomentsLinkInviteConvert(fields, params) {
      return this.createEdge('/moments_link_invite_convert', fields, params, User);
    }
  }, {
    key: 'createMomentsUniversalLinkInvite',
    value: function createMomentsUniversalLinkInvite(fields, params) {
      return this.createEdge('/moments_universal_link_invite', fields, params, User);
    }
  }, {
    key: 'getMovies',
    value: function getMovies(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Page, fields, params, fetchFirstPage, '/movies');
    }
  }, {
    key: 'getMusic',
    value: function getMusic(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Page, fields, params, fetchFirstPage, '/music');
    }
  }, {
    key: 'createNotification',
    value: function createNotification(fields, params) {
      return this.createEdge('/notifications', fields, params, User);
    }
  }, {
    key: 'createPaymentCurrency',
    value: function createPaymentCurrency(fields, params) {
      return this.createEdge('/payment_currencies', fields, params, User);
    }
  }, {
    key: 'deletePermissions',
    value: function deletePermissions(params) {
      return get$1(User.prototype.__proto__ || Object.getPrototypeOf(User.prototype), 'deleteEdge', this).call(this, '/permissions', params);
    }
  }, {
    key: 'getPermissions',
    value: function getPermissions(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Permission, fields, params, fetchFirstPage, '/permissions');
    }
  }, {
    key: 'getPersonalAdAccounts',
    value: function getPersonalAdAccounts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAccount, fields, params, fetchFirstPage, '/personal_ad_accounts');
    }
  }, {
    key: 'getPhotos',
    value: function getPhotos(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Photo, fields, params, fetchFirstPage, '/photos');
    }
  }, {
    key: 'createPhoto',
    value: function createPhoto(fields, params) {
      return this.createEdge('/photos', fields, params, Photo);
    }
  }, {
    key: 'getPicture',
    value: function getPicture(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProfilePictureSource, fields, params, fetchFirstPage, '/picture');
    }
  }, {
    key: 'createPlace',
    value: function createPlace(fields, params) {
      return this.createEdge('/places', fields, params);
    }
  }, {
    key: 'getPromotableDomains',
    value: function getPromotableDomains(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Domain, fields, params, fetchFirstPage, '/promotable_domains');
    }
  }, {
    key: 'getPromotableEvents',
    value: function getPromotableEvents(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Event, fields, params, fetchFirstPage, '/promotable_events');
    }
  }, {
    key: 'getRequestHistory',
    value: function getRequestHistory(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(RequestHistory, fields, params, fetchFirstPage, '/request_history');
    }
  }, {
    key: 'createScreenName',
    value: function createScreenName(fields, params) {
      return this.createEdge('/screennames', fields, params, User);
    }
  }, {
    key: 'createStagingResource',
    value: function createStagingResource(fields, params) {
      return this.createEdge('/staging_resources', fields, params, User);
    }
  }, {
    key: 'getTaggableFriends',
    value: function getTaggableFriends(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(UserTaggableFriend, fields, params, fetchFirstPage, '/taggable_friends');
    }
  }, {
    key: 'getTelevision',
    value: function getTelevision(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Page, fields, params, fetchFirstPage, '/television');
    }
  }, {
    key: 'getThreads',
    value: function getThreads(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(UnifiedThread, fields, params, fetchFirstPage, '/threads');
    }
  }, {
    key: 'getVideos',
    value: function getVideos(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdVideo, fields, params, fetchFirstPage, '/videos');
    }
  }, {
    key: 'createVideo',
    value: function createVideo(fields, params) {
      return this.createEdge('/videos', fields, params, AdVideo);
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(User.prototype.__proto__ || Object.getPrototypeOf(User.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(User.prototype.__proto__ || Object.getPrototypeOf(User.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        about: 'about',
        address: 'address',
        admin_notes: 'admin_notes',
        age_range: 'age_range',
        birthday: 'birthday',
        can_review_measurement_request: 'can_review_measurement_request',
        cover: 'cover',
        currency: 'currency',
        devices: 'devices',
        education: 'education',
        email: 'email',
        employee_number: 'employee_number',
        favorite_athletes: 'favorite_athletes',
        favorite_teams: 'favorite_teams',
        first_name: 'first_name',
        gender: 'gender',
        hometown: 'hometown',
        id: 'id',
        inspirational_people: 'inspirational_people',
        install_type: 'install_type',
        installed: 'installed',
        interested_in: 'interested_in',
        is_famedeeplinkinguser: 'is_famedeeplinkinguser',
        is_shared_login: 'is_shared_login',
        is_verified: 'is_verified',
        labels: 'labels',
        languages: 'languages',
        last_name: 'last_name',
        link: 'link',
        local_news_megaphone_dismiss_status: 'local_news_megaphone_dismiss_status',
        local_news_subscription_status: 'local_news_subscription_status',
        locale: 'locale',
        location: 'location',
        meeting_for: 'meeting_for',
        middle_name: 'middle_name',
        name: 'name',
        name_format: 'name_format',
        payment_pricepoints: 'payment_pricepoints',
        political: 'political',
        profile_pic: 'profile_pic',
        public_key: 'public_key',
        quotes: 'quotes',
        relationship_status: 'relationship_status',
        religion: 'religion',
        security_settings: 'security_settings',
        shared_login_upgrade_required_by: 'shared_login_upgrade_required_by',
        short_name: 'short_name',
        significant_other: 'significant_other',
        sports: 'sports',
        test_group: 'test_group',
        third_party_id: 'third_party_id',
        timezone: 'timezone',
        token_for_business: 'token_for_business',
        updated_time: 'updated_time',
        verified: 'verified',
        video_upload_limits: 'video_upload_limits',
        viewer_can_send_gift: 'viewer_can_send_gift',
        website: 'website',
        work: 'work'
      });
    }
  }, {
    key: 'Tasks',
    get: function get() {
      return Object.freeze({
        advertise: 'ADVERTISE',
        analyze: 'ANALYZE',
        create_content: 'CREATE_CONTENT',
        manage: 'MANAGE',
        manage_jobs: 'MANAGE_JOBS',
        moderate: 'MODERATE',
        moderate_community: 'MODERATE_COMMUNITY',
        pages_messaging: 'PAGES_MESSAGING',
        pages_messaging_subscriptions: 'PAGES_MESSAGING_SUBSCRIPTIONS',
        read_page_mailboxes: 'READ_PAGE_MAILBOXES',
        view_monetization_insights: 'VIEW_MONETIZATION_INSIGHTS'
      });
    }
  }, {
    key: 'LocalNewsMegaphoneDismissStatus',
    get: function get() {
      return Object.freeze({
        no: 'NO',
        yes: 'YES'
      });
    }
  }, {
    key: 'LocalNewsSubscriptionStatus',
    get: function get() {
      return Object.freeze({
        status_off: 'STATUS_OFF',
        status_on: 'STATUS_ON'
      });
    }
  }, {
    key: 'ResumeType',
    get: function get() {
      return Object.freeze({
        bot_action: 'BOT_ACTION',
        native: 'NATIVE'
      });
    }
  }, {
    key: 'Filtering',
    get: function get() {
      return Object.freeze({
        ema: 'ema',
        groups: 'groups',
        groups_social: 'groups_social'
      });
    }
  }, {
    key: 'Type',
    get: function get() {
      return Object.freeze({
        content_update: 'content_update',
        generic: 'generic'
      });
    }
  }, {
    key: 'ServiceType',
    get: function get() {
      return Object.freeze({
        aim: 'AIM',
        ask_fm: 'ASK_FM',
        bbm: 'BBM',
        bbm_ppid: 'BBM_PPID',
        cyworld: 'CYWORLD',
        ebuddy: 'EBUDDY',
        foursquare: 'FOURSQUARE',
        gadu: 'GADU',
        github: 'GITHUB',
        groupwise: 'GROUPWISE',
        gtalk: 'GTALK',
        hyves: 'HYVES',
        icloud: 'ICLOUD',
        icq: 'ICQ',
        instagram: 'INSTAGRAM',
        jabber: 'JABBER',
        kakaotalk: 'KAKAOTALK',
        kik: 'KIK',
        line: 'LINE',
        linked_in: 'LINKED_IN',
        mailru: 'MAILRU',
        medium: 'MEDIUM',
        mixi: 'MIXI',
        msn: 'MSN',
        myspace: 'MYSPACE',
        nateon: 'NATEON',
        ok: 'OK',
        orkut: 'ORKUT',
        others: 'OTHERS',
        pinterest: 'PINTEREST',
        qip: 'QIP',
        qq: 'QQ',
        rediff_bol: 'REDIFF_BOL',
        skype: 'SKYPE',
        snapchat: 'SNAPCHAT',
        sound_cloud: 'SOUND_CLOUD',
        spotify: 'SPOTIFY',
        tumblr: 'TUMBLR',
        twitch: 'TWITCH',
        twitter: 'TWITTER',
        vimeo: 'VIMEO',
        vkontakte: 'VKONTAKTE',
        wechat: 'WECHAT',
        whatsapp: 'WHATSAPP',
        yahoo: 'YAHOO',
        yahoo_jp: 'YAHOO_JP',
        you_tube: 'YOU_TUBE'
      });
    }
  }]);
  return User;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * PagePost
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var PagePost = function (_AbstractCrudObject) {
  inherits(PagePost, _AbstractCrudObject);

  function PagePost() {
    classCallCheck(this, PagePost);
    return possibleConstructorReturn(this, (PagePost.__proto__ || Object.getPrototypeOf(PagePost)).apply(this, arguments));
  }

  createClass(PagePost, [{
    key: 'getAttachments',
    value: function getAttachments(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/attachments');
    }
  }, {
    key: 'getComments',
    value: function getComments(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Comment, fields, params, fetchFirstPage, '/comments');
    }
  }, {
    key: 'createComment',
    value: function createComment(fields, params) {
      return this.createEdge('/comments', fields, params, Comment);
    }
  }, {
    key: 'getDynamicPosts',
    value: function getDynamicPosts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(RTBDynamicPost, fields, params, fetchFirstPage, '/dynamic_posts');
    }
  }, {
    key: 'getInsights',
    value: function getInsights(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(InsightsResult, fields, params, fetchFirstPage, '/insights');
    }
  }, {
    key: 'deleteLikes',
    value: function deleteLikes(params) {
      return get$1(PagePost.prototype.__proto__ || Object.getPrototypeOf(PagePost.prototype), 'deleteEdge', this).call(this, '/likes', params);
    }
  }, {
    key: 'getLikes',
    value: function getLikes(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Profile, fields, params, fetchFirstPage, '/likes');
    }
  }, {
    key: 'createLike',
    value: function createLike(fields, params) {
      return this.createEdge('/likes', fields, params, PagePost);
    }
  }, {
    key: 'getReactions',
    value: function getReactions(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Profile, fields, params, fetchFirstPage, '/reactions');
    }
  }, {
    key: 'getSeen',
    value: function getSeen(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(User, fields, params, fetchFirstPage, '/seen');
    }
  }, {
    key: 'getSharedPosts',
    value: function getSharedPosts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Post, fields, params, fetchFirstPage, '/sharedposts');
    }
  }, {
    key: 'getTo',
    value: function getTo(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Profile, fields, params, fetchFirstPage, '/to');
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(PagePost.prototype.__proto__ || Object.getPrototypeOf(PagePost.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(PagePost.prototype.__proto__ || Object.getPrototypeOf(PagePost.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        actions: 'actions',
        admin_creator: 'admin_creator',
        allowed_advertising_objectives: 'allowed_advertising_objectives',
        application: 'application',
        backdated_time: 'backdated_time',
        call_to_action: 'call_to_action',
        can_reply_privately: 'can_reply_privately',
        child_attachments: 'child_attachments',
        comments_mirroring_domain: 'comments_mirroring_domain',
        coordinates: 'coordinates',
        created_time: 'created_time',
        event: 'event',
        expanded_height: 'expanded_height',
        expanded_width: 'expanded_width',
        feed_targeting: 'feed_targeting',
        from: 'from',
        full_picture: 'full_picture',
        height: 'height',
        icon: 'icon',
        id: 'id',
        instagram_eligibility: 'instagram_eligibility',
        is_app_share: 'is_app_share',
        is_eligible_for_promotion: 'is_eligible_for_promotion',
        is_expired: 'is_expired',
        is_hidden: 'is_hidden',
        is_instagram_eligible: 'is_instagram_eligible',
        is_popular: 'is_popular',
        is_published: 'is_published',
        is_spherical: 'is_spherical',
        message: 'message',
        message_tags: 'message_tags',
        multi_share_end_card: 'multi_share_end_card',
        multi_share_optimized: 'multi_share_optimized',
        parent_id: 'parent_id',
        permalink_url: 'permalink_url',
        picture: 'picture',
        place: 'place',
        privacy: 'privacy',
        promotable_id: 'promotable_id',
        promotion_status: 'promotion_status',
        properties: 'properties',
        scheduled_publish_time: 'scheduled_publish_time',
        shares: 'shares',
        status_type: 'status_type',
        story: 'story',
        story_tags: 'story_tags',
        subscribed: 'subscribed',
        target: 'target',
        targeting: 'targeting',
        timeline_visibility: 'timeline_visibility',
        updated_time: 'updated_time',
        via: 'via',
        video_buying_eligibility: 'video_buying_eligibility',
        width: 'width'
      });
    }
  }, {
    key: 'BackdatedTimeGranularity',
    get: function get() {
      return Object.freeze({
        day: 'day',
        hour: 'hour',
        min: 'min',
        month: 'month',
        none: 'none',
        year: 'year'
      });
    }
  }, {
    key: 'CheckinEntryPoint',
    get: function get() {
      return Object.freeze({
        branding_checkin: 'BRANDING_CHECKIN',
        branding_other: 'BRANDING_OTHER',
        branding_photo: 'BRANDING_PHOTO',
        branding_status: 'BRANDING_STATUS'
      });
    }
  }, {
    key: 'Formatting',
    get: function get() {
      return Object.freeze({
        markdown: 'MARKDOWN',
        plaintext: 'PLAINTEXT'
      });
    }
  }, {
    key: 'PlaceAttachmentSetting',
    get: function get() {
      return Object.freeze({
        value_1: '1',
        value_2: '2'
      });
    }
  }, {
    key: 'PostSurfacesBlacklist',
    get: function get() {
      return Object.freeze({
        value_1: '1',
        value_2: '2',
        value_3: '3',
        value_4: '4',
        value_5: '5'
      });
    }
  }, {
    key: 'PostingToRedspace',
    get: function get() {
      return Object.freeze({
        disabled: 'disabled',
        enabled: 'enabled'
      });
    }
  }, {
    key: 'TargetSurface',
    get: function get() {
      return Object.freeze({
        story: 'STORY',
        timeline: 'TIMELINE'
      });
    }
  }, {
    key: 'UnpublishedContentType',
    get: function get() {
      return Object.freeze({
        ads_post: 'ADS_POST',
        draft: 'DRAFT',
        inline_created: 'INLINE_CREATED',
        published: 'PUBLISHED',
        scheduled: 'SCHEDULED'
      });
    }
  }, {
    key: 'With',
    get: function get() {
      return Object.freeze({
        location: 'LOCATION'
      });
    }
  }, {
    key: 'FeedStoryVisibility',
    get: function get() {
      return Object.freeze({
        hidden: 'hidden',
        visible: 'visible'
      });
    }
  }, {
    key: 'TimelineVisibility',
    get: function get() {
      return Object.freeze({
        forced_allow: 'forced_allow',
        hidden: 'hidden',
        normal: 'normal'
      });
    }
  }]);
  return PagePost;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AudioCopyright
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AudioCopyright = function (_AbstractCrudObject) {
  inherits(AudioCopyright, _AbstractCrudObject);

  function AudioCopyright() {
    classCallCheck(this, AudioCopyright);
    return possibleConstructorReturn(this, (AudioCopyright.__proto__ || Object.getPrototypeOf(AudioCopyright)).apply(this, arguments));
  }

  createClass(AudioCopyright, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        creation_time: 'creation_time',
        displayed_matches_count: 'displayed_matches_count',
        id: 'id',
        in_conflict: 'in_conflict',
        isrc: 'isrc',
        ownership_countries: 'ownership_countries',
        reference_file_status: 'reference_file_status',
        ridge_monitoring_status: 'ridge_monitoring_status',
        update_time: 'update_time',
        whitelisted_fb_users: 'whitelisted_fb_users',
        whitelisted_ig_users: 'whitelisted_ig_users'
      });
    }
  }]);
  return AudioCopyright;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * OpenGraphObject
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var OpenGraphObject = function (_AbstractCrudObject) {
  inherits(OpenGraphObject, _AbstractCrudObject);

  function OpenGraphObject() {
    classCallCheck(this, OpenGraphObject);
    return possibleConstructorReturn(this, (OpenGraphObject.__proto__ || Object.getPrototypeOf(OpenGraphObject)).apply(this, arguments));
  }

  createClass(OpenGraphObject, [{
    key: 'getPicture',
    value: function getPicture(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProfilePictureSource, fields, params, fetchFirstPage, '/picture');
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        admins: 'admins',
        application: 'application',
        audio: 'audio',
        context: 'context',
        created_time: 'created_time',
        description: 'description',
        determiner: 'determiner',
        engagement: 'engagement',
        id: 'id',
        image: 'image',
        is_scraped: 'is_scraped',
        locale: 'locale',
        location: 'location',
        post_action_id: 'post_action_id',
        profile_id: 'profile_id',
        restrictions: 'restrictions',
        see_also: 'see_also',
        site_name: 'site_name',
        title: 'title',
        type: 'type',
        updated_time: 'updated_time',
        video: 'video'
      });
    }
  }]);
  return OpenGraphObject;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Application
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Application = function (_AbstractCrudObject) {
  inherits(Application, _AbstractCrudObject);

  function Application() {
    classCallCheck(this, Application);
    return possibleConstructorReturn(this, (Application.__proto__ || Object.getPrototypeOf(Application)).apply(this, arguments));
  }

  createClass(Application, [{
    key: 'deleteAccounts',
    value: function deleteAccounts(params) {
      return get$1(Application.prototype.__proto__ || Object.getPrototypeOf(Application.prototype), 'deleteEdge', this).call(this, '/accounts', params);
    }
  }, {
    key: 'getAccounts',
    value: function getAccounts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/accounts');
    }
  }, {
    key: 'createAccount',
    value: function createAccount(fields, params) {
      return this.createEdge('/accounts', fields, params);
    }
  }, {
    key: 'createActivity',
    value: function createActivity(fields, params) {
      return this.createEdge('/activities', fields, params);
    }
  }, {
    key: 'getAdNetworkAnalytics',
    value: function getAdNetworkAnalytics(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdNetworkAnalyticsSyncQueryResult, fields, params, fetchFirstPage, '/adnetworkanalytics');
    }
  }, {
    key: 'createAdNetworkAnalytic',
    value: function createAdNetworkAnalytic(fields, params) {
      return this.createEdge('/adnetworkanalytics', fields, params, Application);
    }
  }, {
    key: 'getAdNetworkAnalyticsResults',
    value: function getAdNetworkAnalyticsResults(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdNetworkAnalyticsAsyncQueryResult, fields, params, fetchFirstPage, '/adnetworkanalytics_results');
    }
  }, {
    key: 'getAppEventTypes',
    value: function getAppEventTypes(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/app_event_types');
    }
  }, {
    key: 'createAppIndexing',
    value: function createAppIndexing(fields, params) {
      return this.createEdge('/app_indexing', fields, params, Application);
    }
  }, {
    key: 'createAppIndexingSession',
    value: function createAppIndexingSession(fields, params) {
      return this.createEdge('/app_indexing_session', fields, params, Application);
    }
  }, {
    key: 'getAppInstalledGroups',
    value: function getAppInstalledGroups(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Group, fields, params, fetchFirstPage, '/app_installed_groups');
    }
  }, {
    key: 'createAppPushDeviceToken',
    value: function createAppPushDeviceToken(fields, params) {
      return this.createEdge('/app_push_device_token', fields, params, Application);
    }
  }, {
    key: 'getAppAssets',
    value: function getAppAssets(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/appassets');
    }
  }, {
    key: 'createAsset',
    value: function createAsset(fields, params) {
      return this.createEdge('/assets', fields, params, Application);
    }
  }, {
    key: 'getAuthorizedAdAccounts',
    value: function getAuthorizedAdAccounts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAccount, fields, params, fetchFirstPage, '/authorized_adaccounts');
    }
  }, {
    key: 'getBanned',
    value: function getBanned(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(User, fields, params, fetchFirstPage, '/banned');
    }
  }, {
    key: 'getButtonAutoDetectionDeviceSelection',
    value: function getButtonAutoDetectionDeviceSelection(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/button_auto_detection_device_selection');
    }
  }, {
    key: 'createButtonIndexing',
    value: function createButtonIndexing(fields, params) {
      return this.createEdge('/button_indexing', fields, params, Application);
    }
  }, {
    key: 'createCodelessEventBinding',
    value: function createCodelessEventBinding(fields, params) {
      return this.createEdge('/codeless_event_bindings', fields, params, Application);
    }
  }, {
    key: 'createCodelessEventMapping',
    value: function createCodelessEventMapping(fields, params) {
      return this.createEdge('/codeless_event_mappings', fields, params, Application);
    }
  }, {
    key: 'getCustomAudienceThirdPartyId',
    value: function getCustomAudienceThirdPartyId(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/custom_audience_third_party_id');
    }
  }, {
    key: 'getDaChecks',
    value: function getDaChecks(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(DACheck, fields, params, fetchFirstPage, '/da_checks');
    }
  }, {
    key: 'getEvents',
    value: function getEvents(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Event, fields, params, fetchFirstPage, '/events');
    }
  }, {
    key: 'getFullAppIndexingInfos',
    value: function getFullAppIndexingInfos(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/full_app_indexing_infos');
    }
  }, {
    key: 'createFullAppIndexingInfo',
    value: function createFullAppIndexingInfo(fields, params) {
      return this.createEdge('/full_app_indexing_infos', fields, params);
    }
  }, {
    key: 'getIosDialogConfigs',
    value: function getIosDialogConfigs(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/ios_dialog_configs');
    }
  }, {
    key: 'createLeaderboardsCreate',
    value: function createLeaderboardsCreate(fields, params) {
      return this.createEdge('/leaderboards_create', fields, params, Application);
    }
  }, {
    key: 'createLeaderboardsDeleteEntry',
    value: function createLeaderboardsDeleteEntry(fields, params) {
      return this.createEdge('/leaderboards_delete_entry', fields, params, Application);
    }
  }, {
    key: 'createLeaderboardsReset',
    value: function createLeaderboardsReset(fields, params) {
      return this.createEdge('/leaderboards_reset', fields, params, Application);
    }
  }, {
    key: 'createLeaderboardsSetScore',
    value: function createLeaderboardsSetScore(fields, params) {
      return this.createEdge('/leaderboards_set_score', fields, params, Application);
    }
  }, {
    key: 'createMmpAuditing',
    value: function createMmpAuditing(fields, params) {
      return this.createEdge('/mmp_auditing', fields, params);
    }
  }, {
    key: 'getMobileSdkGk',
    value: function getMobileSdkGk(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/mobile_sdk_gk');
    }
  }, {
    key: 'getMoodsForApplication',
    value: function getMoodsForApplication(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/moods_for_application');
    }
  }, {
    key: 'getObjects',
    value: function getObjects(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(OpenGraphObject, fields, params, fetchFirstPage, '/objects');
    }
  }, {
    key: 'createObject',
    value: function createObject(fields, params) {
      return this.createEdge('/objects', fields, params, OpenGraphObject);
    }
  }, {
    key: 'createOccludesPopup',
    value: function createOccludesPopup(fields, params) {
      return this.createEdge('/occludespopups', fields, params);
    }
  }, {
    key: 'createOzoneRelease',
    value: function createOzoneRelease(fields, params) {
      return this.createEdge('/ozone_release', fields, params);
    }
  }, {
    key: 'createPageActivity',
    value: function createPageActivity(fields, params) {
      return this.createEdge('/page_activities', fields, params, Application);
    }
  }, {
    key: 'deletePaymentCurrencies',
    value: function deletePaymentCurrencies(params) {
      return get$1(Application.prototype.__proto__ || Object.getPrototypeOf(Application.prototype), 'deleteEdge', this).call(this, '/payment_currencies', params);
    }
  }, {
    key: 'createPaymentCurrency',
    value: function createPaymentCurrency(fields, params) {
      return this.createEdge('/payment_currencies', fields, params, Application);
    }
  }, {
    key: 'getPermissions',
    value: function getPermissions(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/permissions');
    }
  }, {
    key: 'getProducts',
    value: function getProducts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/products');
    }
  }, {
    key: 'getPurchases',
    value: function getPurchases(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/purchases');
    }
  }, {
    key: 'getRoles',
    value: function getRoles(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/roles');
    }
  }, {
    key: 'createStagingResource',
    value: function createStagingResource(fields, params) {
      return this.createEdge('/staging_resources', fields, params, Application);
    }
  }, {
    key: 'getSubscribedDomains',
    value: function getSubscribedDomains(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/subscribed_domains');
    }
  }, {
    key: 'createSubscribedDomain',
    value: function createSubscribedDomain(fields, params) {
      return this.createEdge('/subscribed_domains', fields, params, Application);
    }
  }, {
    key: 'getSubscribedDomainsPhishing',
    value: function getSubscribedDomainsPhishing(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/subscribed_domains_phishing');
    }
  }, {
    key: 'createSubscribedDomainsPhishing',
    value: function createSubscribedDomainsPhishing(fields, params) {
      return this.createEdge('/subscribed_domains_phishing', fields, params, Application);
    }
  }, {
    key: 'deleteSubscriptions',
    value: function deleteSubscriptions(params) {
      return get$1(Application.prototype.__proto__ || Object.getPrototypeOf(Application.prototype), 'deleteEdge', this).call(this, '/subscriptions', params);
    }
  }, {
    key: 'createSubscription',
    value: function createSubscription(fields, params) {
      return this.createEdge('/subscriptions', fields, params);
    }
  }, {
    key: 'createSubscriptionsSample',
    value: function createSubscriptionsSample(fields, params) {
      return this.createEdge('/subscriptions_sample', fields, params, Application);
    }
  }, {
    key: 'createUserProperty',
    value: function createUserProperty(fields, params) {
      return this.createEdge('/user_properties', fields, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(Application.prototype.__proto__ || Object.getPrototypeOf(Application.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        an_ad_space_limit: 'an_ad_space_limit',
        an_platforms: 'an_platforms',
        android_key_hash: 'android_key_hash',
        android_sdk_error_categories: 'android_sdk_error_categories',
        app_domains: 'app_domains',
        app_events_feature_bitmask: 'app_events_feature_bitmask',
        app_events_session_timeout: 'app_events_session_timeout',
        app_install_tracked: 'app_install_tracked',
        app_name: 'app_name',
        app_signals_binding_ios: 'app_signals_binding_ios',
        app_type: 'app_type',
        auth_dialog_data_help_url: 'auth_dialog_data_help_url',
        auth_dialog_headline: 'auth_dialog_headline',
        auth_dialog_perms_explanation: 'auth_dialog_perms_explanation',
        auth_referral_default_activity_privacy: 'auth_referral_default_activity_privacy',
        auth_referral_enabled: 'auth_referral_enabled',
        auth_referral_extended_perms: 'auth_referral_extended_perms',
        auth_referral_friend_perms: 'auth_referral_friend_perms',
        auth_referral_response_type: 'auth_referral_response_type',
        auth_referral_user_perms: 'auth_referral_user_perms',
        auto_event_mapping_android: 'auto_event_mapping_android',
        auto_event_mapping_ios: 'auto_event_mapping_ios',
        auto_event_setup_enabled: 'auto_event_setup_enabled',
        canvas_fluid_height: 'canvas_fluid_height',
        canvas_fluid_width: 'canvas_fluid_width',
        canvas_url: 'canvas_url',
        category: 'category',
        client_config: 'client_config',
        company: 'company',
        configured_ios_sso: 'configured_ios_sso',
        contact_email: 'contact_email',
        created_time: 'created_time',
        creator_uid: 'creator_uid',
        daily_active_users: 'daily_active_users',
        daily_active_users_rank: 'daily_active_users_rank',
        deauth_callback_url: 'deauth_callback_url',
        default_share_mode: 'default_share_mode',
        description: 'description',
        financial_id: 'financial_id',
        gdpv4_chrome_custom_tabs_enabled: 'gdpv4_chrome_custom_tabs_enabled',
        gdpv4_enabled: 'gdpv4_enabled',
        gdpv4_nux_content: 'gdpv4_nux_content',
        gdpv4_nux_enabled: 'gdpv4_nux_enabled',
        has_messenger_product: 'has_messenger_product',
        hosting_url: 'hosting_url',
        icon_url: 'icon_url',
        id: 'id',
        ios_bundle_id: 'ios_bundle_id',
        ios_sdk_dialog_flows: 'ios_sdk_dialog_flows',
        ios_sdk_error_categories: 'ios_sdk_error_categories',
        ios_sfvc_attr: 'ios_sfvc_attr',
        ios_supports_native_proxy_auth_flow: 'ios_supports_native_proxy_auth_flow',
        ios_supports_system_auth: 'ios_supports_system_auth',
        ipad_app_store_id: 'ipad_app_store_id',
        iphone_app_store_id: 'iphone_app_store_id',
        is_viewer_admin: 'is_viewer_admin',
        latest_sdk_version: 'latest_sdk_version',
        link: 'link',
        logging_token: 'logging_token',
        login_secret: 'login_secret',
        logo_url: 'logo_url',
        migrations: 'migrations',
        mobile_profile_section_url: 'mobile_profile_section_url',
        mobile_web_url: 'mobile_web_url',
        monthly_active_users: 'monthly_active_users',
        monthly_active_users_rank: 'monthly_active_users_rank',
        name: 'name',
        namespace: 'namespace',
        object_store_urls: 'object_store_urls',
        page_tab_default_name: 'page_tab_default_name',
        page_tab_url: 'page_tab_url',
        photo_url: 'photo_url',
        privacy_policy_url: 'privacy_policy_url',
        profile_section_url: 'profile_section_url',
        property_id: 'property_id',
        real_time_mode_devices: 'real_time_mode_devices',
        restrictions: 'restrictions',
        restrictive_data_filter_rules: 'restrictive_data_filter_rules',
        sdk_update_message: 'sdk_update_message',
        seamless_login: 'seamless_login',
        secure_canvas_url: 'secure_canvas_url',
        secure_page_tab_url: 'secure_page_tab_url',
        server_ip_whitelist: 'server_ip_whitelist',
        smart_login_bookmark_icon_url: 'smart_login_bookmark_icon_url',
        smart_login_menu_icon_url: 'smart_login_menu_icon_url',
        social_discovery: 'social_discovery',
        subcategory: 'subcategory',
        supported_platforms: 'supported_platforms',
        supports_apprequests_fast_app_switch: 'supports_apprequests_fast_app_switch',
        supports_attribution: 'supports_attribution',
        supports_implicit_sdk_logging: 'supports_implicit_sdk_logging',
        suppress_native_ios_gdp: 'suppress_native_ios_gdp',
        terms_of_service_url: 'terms_of_service_url',
        url_scheme_suffix: 'url_scheme_suffix',
        user_support_email: 'user_support_email',
        user_support_url: 'user_support_url',
        website_url: 'website_url',
        weekly_active_users: 'weekly_active_users'
      });
    }
  }, {
    key: 'SupportedPlatforms',
    get: function get() {
      return Object.freeze({
        amazon: 'AMAZON',
        android: 'ANDROID',
        canvas: 'CANVAS',
        gameroom: 'GAMEROOM',
        instant_game: 'INSTANT_GAME',
        ipad: 'IPAD',
        iphone: 'IPHONE',
        mobile_web: 'MOBILE_WEB',
        supplementary_images: 'SUPPLEMENTARY_IMAGES',
        web: 'WEB',
        windows: 'WINDOWS'
      });
    }
  }, {
    key: 'AnPlatforms',
    get: function get() {
      return Object.freeze({
        android: 'ANDROID',
        desktop: 'DESKTOP',
        instant_articles: 'INSTANT_ARTICLES',
        ios: 'IOS',
        mobile_web: 'MOBILE_WEB',
        unknown: 'UNKNOWN'
      });
    }
  }, {
    key: 'Platform',
    get: function get() {
      return Object.freeze({
        android: 'ANDROID',
        ios: 'IOS'
      });
    }
  }, {
    key: 'RequestType',
    get: function get() {
      return Object.freeze({
        app_indexing: 'APP_INDEXING',
        button_sampling: 'BUTTON_SAMPLING',
        plugin: 'PLUGIN'
      });
    }
  }, {
    key: 'MutationMethod',
    get: function get() {
      return Object.freeze({
        add: 'ADD',
        delete: 'DELETE',
        replace: 'REPLACE'
      });
    }
  }, {
    key: 'PostMethod',
    get: function get() {
      return Object.freeze({
        codeless: 'CODELESS',
        eymt: 'EYMT'
      });
    }
  }, {
    key: 'ScoreType',
    get: function get() {
      return Object.freeze({
        custom: 'CUSTOM',
        numeric: 'NUMERIC',
        time: 'TIME'
      });
    }
  }, {
    key: 'SortOrder',
    get: function get() {
      return Object.freeze({
        higher_is_better: 'HIGHER_IS_BETTER',
        lower_is_better: 'LOWER_IS_BETTER'
      });
    }
  }, {
    key: 'LoggingSource',
    get: function get() {
      return Object.freeze({
        messenger_bot: 'MESSENGER_BOT'
      });
    }
  }, {
    key: 'LoggingTarget',
    get: function get() {
      return Object.freeze({
        app: 'APP',
        app_and_page: 'APP_AND_PAGE',
        page: 'PAGE'
      });
    }
  }]);
  return Application;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * BusinessProject
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var BusinessProject = function (_AbstractCrudObject) {
  inherits(BusinessProject, _AbstractCrudObject);

  function BusinessProject() {
    classCallCheck(this, BusinessProject);
    return possibleConstructorReturn(this, (BusinessProject.__proto__ || Object.getPrototypeOf(BusinessProject)).apply(this, arguments));
  }

  createClass(BusinessProject, [{
    key: 'deleteAdAccounts',
    value: function deleteAdAccounts(params) {
      return get$1(BusinessProject.prototype.__proto__ || Object.getPrototypeOf(BusinessProject.prototype), 'deleteEdge', this).call(this, '/adaccounts', params);
    }
  }, {
    key: 'getAdAccounts',
    value: function getAdAccounts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAccount, fields, params, fetchFirstPage, '/adaccounts');
    }
  }, {
    key: 'createAdAccount',
    value: function createAdAccount(fields, params) {
      return this.createEdge('/adaccounts', fields, params, BusinessProject);
    }
  }, {
    key: 'deleteApps',
    value: function deleteApps(params) {
      return get$1(BusinessProject.prototype.__proto__ || Object.getPrototypeOf(BusinessProject.prototype), 'deleteEdge', this).call(this, '/apps', params);
    }
  }, {
    key: 'getApps',
    value: function getApps(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Application, fields, params, fetchFirstPage, '/apps');
    }
  }, {
    key: 'createApp',
    value: function createApp(fields, params) {
      return this.createEdge('/apps', fields, params, BusinessProject);
    }
  }, {
    key: 'deleteAssets',
    value: function deleteAssets(params) {
      return get$1(BusinessProject.prototype.__proto__ || Object.getPrototypeOf(BusinessProject.prototype), 'deleteEdge', this).call(this, '/assets', params);
    }
  }, {
    key: 'createAsset',
    value: function createAsset(fields, params) {
      return this.createEdge('/assets', fields, params, BusinessProject);
    }
  }, {
    key: 'deletePages',
    value: function deletePages(params) {
      return get$1(BusinessProject.prototype.__proto__ || Object.getPrototypeOf(BusinessProject.prototype), 'deleteEdge', this).call(this, '/pages', params);
    }
  }, {
    key: 'getPages',
    value: function getPages(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Page, fields, params, fetchFirstPage, '/pages');
    }
  }, {
    key: 'createPage',
    value: function createPage(fields, params) {
      return this.createEdge('/pages', fields, params, BusinessProject);
    }
  }, {
    key: 'deleteProductCatalogs',
    value: function deleteProductCatalogs(params) {
      return get$1(BusinessProject.prototype.__proto__ || Object.getPrototypeOf(BusinessProject.prototype), 'deleteEdge', this).call(this, '/product_catalogs', params);
    }
  }, {
    key: 'getProductCatalogs',
    value: function getProductCatalogs(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProductCatalog, fields, params, fetchFirstPage, '/product_catalogs');
    }
  }, {
    key: 'createProductCatalog',
    value: function createProductCatalog(fields, params) {
      return this.createEdge('/product_catalogs', fields, params, BusinessProject);
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(BusinessProject.prototype.__proto__ || Object.getPrototypeOf(BusinessProject.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(BusinessProject.prototype.__proto__ || Object.getPrototypeOf(BusinessProject.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        business: 'business',
        created_time: 'created_time',
        creator: 'creator',
        id: 'id',
        name: 'name'
      });
    }
  }]);
  return BusinessProject;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * PageCallToAction
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var PageCallToAction = function (_AbstractCrudObject) {
  inherits(PageCallToAction, _AbstractCrudObject);

  function PageCallToAction() {
    classCallCheck(this, PageCallToAction);
    return possibleConstructorReturn(this, (PageCallToAction.__proto__ || Object.getPrototypeOf(PageCallToAction)).apply(this, arguments));
  }

  createClass(PageCallToAction, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        android_app: 'android_app',
        android_deeplink: 'android_deeplink',
        android_destination_type: 'android_destination_type',
        android_package_name: 'android_package_name',
        android_url: 'android_url',
        created_time: 'created_time',
        email_address: 'email_address',
        from: 'from',
        id: 'id',
        intl_number_with_plus: 'intl_number_with_plus',
        iphone_app: 'iphone_app',
        iphone_deeplink: 'iphone_deeplink',
        iphone_destination_type: 'iphone_destination_type',
        iphone_url: 'iphone_url',
        status: 'status',
        type: 'type',
        updated_time: 'updated_time',
        web_destination_type: 'web_destination_type',
        web_url: 'web_url'
      });
    }
  }, {
    key: 'AndroidDestinationType',
    get: function get() {
      return Object.freeze({
        app_deeplink: 'APP_DEEPLINK',
        email: 'EMAIL',
        facebook_app: 'FACEBOOK_APP',
        messenger: 'MESSENGER',
        none: 'NONE',
        phone_call: 'PHONE_CALL',
        shop_on_facebook: 'SHOP_ON_FACEBOOK',
        website: 'WEBSITE'
      });
    }
  }, {
    key: 'IphoneDestinationType',
    get: function get() {
      return Object.freeze({
        app_deeplink: 'APP_DEEPLINK',
        email: 'EMAIL',
        facebook_app: 'FACEBOOK_APP',
        messenger: 'MESSENGER',
        none: 'NONE',
        phone_call: 'PHONE_CALL',
        shop_on_facebook: 'SHOP_ON_FACEBOOK',
        website: 'WEBSITE'
      });
    }
  }, {
    key: 'Type',
    get: function get() {
      return Object.freeze({
        book_appointment: 'BOOK_APPOINTMENT',
        book_now: 'BOOK_NOW',
        buy_tickets: 'BUY_TICKETS',
        call_now: 'CALL_NOW',
        charity_donate: 'CHARITY_DONATE',
        contact_us: 'CONTACT_US',
        donate_now: 'DONATE_NOW',
        email: 'EMAIL',
        get_directions: 'GET_DIRECTIONS',
        get_offer: 'GET_OFFER',
        get_offer_view: 'GET_OFFER_VIEW',
        interested: 'INTERESTED',
        learn_more: 'LEARN_MORE',
        listen: 'LISTEN',
        local_dev_platform: 'LOCAL_DEV_PLATFORM',
        message: 'MESSAGE',
        open_app: 'OPEN_APP',
        play_music: 'PLAY_MUSIC',
        play_now: 'PLAY_NOW',
        request_appointment: 'REQUEST_APPOINTMENT',
        request_quote: 'REQUEST_QUOTE',
        shop_now: 'SHOP_NOW',
        shop_on_facebook: 'SHOP_ON_FACEBOOK',
        sign_up: 'SIGN_UP',
        visit_group: 'VISIT_GROUP',
        watch_now: 'WATCH_NOW',
        woodhenge_support: 'WOODHENGE_SUPPORT'
      });
    }
  }, {
    key: 'WebDestinationType',
    get: function get() {
      return Object.freeze({
        become_supporter: 'BECOME_SUPPORTER',
        email: 'EMAIL',
        messenger: 'MESSENGER',
        none: 'NONE',
        shop_on_facebook: 'SHOP_ON_FACEBOOK',
        website: 'WEBSITE'
      });
    }
  }]);
  return PageCallToAction;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Canvas
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Canvas = function (_AbstractCrudObject) {
  inherits(Canvas, _AbstractCrudObject);

  function Canvas() {
    classCallCheck(this, Canvas);
    return possibleConstructorReturn(this, (Canvas.__proto__ || Object.getPrototypeOf(Canvas)).apply(this, arguments));
  }

  createClass(Canvas, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(Canvas.prototype.__proto__ || Object.getPrototypeOf(Canvas.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        background_color: 'background_color',
        body_elements: 'body_elements',
        canvas_link: 'canvas_link',
        id: 'id',
        is_hidden: 'is_hidden',
        is_published: 'is_published',
        last_editor: 'last_editor',
        name: 'name',
        owner: 'owner',
        update_time: 'update_time'
      });
    }
  }]);
  return Canvas;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * URL
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var URL = function (_AbstractCrudObject) {
  inherits(URL, _AbstractCrudObject);

  function URL() {
    classCallCheck(this, URL);
    return possibleConstructorReturn(this, (URL.__proto__ || Object.getPrototypeOf(URL)).apply(this, arguments));
  }

  createClass(URL, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(URL.prototype.__proto__ || Object.getPrototypeOf(URL.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        app_links: 'app_links',
        development_instant_article: 'development_instant_article',
        engagement: 'engagement',
        id: 'id',
        instant_article: 'instant_article',
        og_object: 'og_object',
        ownership_permissions: 'ownership_permissions'
      });
    }
  }]);
  return URL;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * PageUserMessageThreadLabel
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var PageUserMessageThreadLabel = function (_AbstractCrudObject) {
  inherits(PageUserMessageThreadLabel, _AbstractCrudObject);

  function PageUserMessageThreadLabel() {
    classCallCheck(this, PageUserMessageThreadLabel);
    return possibleConstructorReturn(this, (PageUserMessageThreadLabel.__proto__ || Object.getPrototypeOf(PageUserMessageThreadLabel)).apply(this, arguments));
  }

  createClass(PageUserMessageThreadLabel, [{
    key: 'deleteLabel',
    value: function deleteLabel(params) {
      return get$1(PageUserMessageThreadLabel.prototype.__proto__ || Object.getPrototypeOf(PageUserMessageThreadLabel.prototype), 'deleteEdge', this).call(this, '/label', params);
    }
  }, {
    key: 'createLabel',
    value: function createLabel(fields, params) {
      return this.createEdge('/label', fields, params, PageUserMessageThreadLabel);
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(PageUserMessageThreadLabel.prototype.__proto__ || Object.getPrototypeOf(PageUserMessageThreadLabel.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        id: 'id',
        name: 'name'
      });
    }
  }]);
  return PageUserMessageThreadLabel;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * PageInsightsAsyncExportRun
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var PageInsightsAsyncExportRun = function (_AbstractCrudObject) {
  inherits(PageInsightsAsyncExportRun, _AbstractCrudObject);

  function PageInsightsAsyncExportRun() {
    classCallCheck(this, PageInsightsAsyncExportRun);
    return possibleConstructorReturn(this, (PageInsightsAsyncExportRun.__proto__ || Object.getPrototypeOf(PageInsightsAsyncExportRun)).apply(this, arguments));
  }

  createClass(PageInsightsAsyncExportRun, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        data_level: 'data_level',
        filters: 'filters',
        format: 'format',
        gen_report_date: 'gen_report_date',
        id: 'id',
        report_end_date: 'report_end_date',
        report_start_date: 'report_start_date',
        sorters: 'sorters',
        status: 'status'
      });
    }
  }]);
  return PageInsightsAsyncExportRun;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * InstagramUser
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var InstagramUser = function (_AbstractCrudObject) {
  inherits(InstagramUser, _AbstractCrudObject);

  function InstagramUser() {
    classCallCheck(this, InstagramUser);
    return possibleConstructorReturn(this, (InstagramUser.__proto__ || Object.getPrototypeOf(InstagramUser)).apply(this, arguments));
  }

  createClass(InstagramUser, [{
    key: 'deleteAgencies',
    value: function deleteAgencies(params) {
      return get$1(InstagramUser.prototype.__proto__ || Object.getPrototypeOf(InstagramUser.prototype), 'deleteEdge', this).call(this, '/agencies', params);
    }
  }, {
    key: 'getAgencies',
    value: function getAgencies(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Business, fields, params, fetchFirstPage, '/agencies');
    }
  }, {
    key: 'deleteAuthorizedAdAccounts',
    value: function deleteAuthorizedAdAccounts(params) {
      return get$1(InstagramUser.prototype.__proto__ || Object.getPrototypeOf(InstagramUser.prototype), 'deleteEdge', this).call(this, '/authorized_adaccounts', params);
    }
  }, {
    key: 'getAuthorizedAdAccounts',
    value: function getAuthorizedAdAccounts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAccount, fields, params, fetchFirstPage, '/authorized_adaccounts');
    }
  }, {
    key: 'createAuthorizedAdAccount',
    value: function createAuthorizedAdAccount(fields, params) {
      return this.createEdge('/authorized_adaccounts', fields, params, InstagramUser);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        follow_count: 'follow_count',
        followed_by_count: 'followed_by_count',
        has_profile_picture: 'has_profile_picture',
        id: 'id',
        is_private: 'is_private',
        is_published: 'is_published',
        media_count: 'media_count',
        profile_pic: 'profile_pic',
        username: 'username'
      });
    }
  }]);
  return InstagramUser;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * InstantArticleInsightsQueryResult
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var InstantArticleInsightsQueryResult = function (_AbstractCrudObject) {
  inherits(InstantArticleInsightsQueryResult, _AbstractCrudObject);

  function InstantArticleInsightsQueryResult() {
    classCallCheck(this, InstantArticleInsightsQueryResult);
    return possibleConstructorReturn(this, (InstantArticleInsightsQueryResult.__proto__ || Object.getPrototypeOf(InstantArticleInsightsQueryResult)).apply(this, arguments));
  }

  createClass(InstantArticleInsightsQueryResult, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        breakdowns: 'breakdowns',
        name: 'name',
        time: 'time',
        value: 'value'
      });
    }
  }, {
    key: 'Breakdown',
    get: function get() {
      return Object.freeze({
        age: 'age',
        country: 'country',
        gender: 'gender',
        gender_and_age: 'gender_and_age',
        is_organic: 'is_organic',
        is_shared_by_ia_owner: 'is_shared_by_ia_owner',
        no_breakdown: 'no_breakdown',
        platform: 'platform',
        region: 'region'
      });
    }
  }, {
    key: 'Period',
    get: function get() {
      return Object.freeze({
        day: 'day',
        days_28: 'days_28',
        lifetime: 'lifetime',
        month: 'month',
        week: 'week'
      });
    }
  }]);
  return InstantArticleInsightsQueryResult;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * InstantArticle
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var InstantArticle = function (_AbstractCrudObject) {
  inherits(InstantArticle, _AbstractCrudObject);

  function InstantArticle() {
    classCallCheck(this, InstantArticle);
    return possibleConstructorReturn(this, (InstantArticle.__proto__ || Object.getPrototypeOf(InstantArticle)).apply(this, arguments));
  }

  createClass(InstantArticle, [{
    key: 'getInsights',
    value: function getInsights(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(InstantArticleInsightsQueryResult, fields, params, fetchFirstPage, '/insights');
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(InstantArticle.prototype.__proto__ || Object.getPrototypeOf(InstantArticle.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        canonical_url: 'canonical_url',
        development_mode: 'development_mode',
        html_source: 'html_source',
        id: 'id',
        most_recent_import_status: 'most_recent_import_status',
        photos: 'photos',
        publish_status: 'publish_status',
        published: 'published',
        videos: 'videos'
      });
    }
  }]);
  return InstantArticle;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * LeadgenForm
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var LeadgenForm = function (_AbstractCrudObject) {
  inherits(LeadgenForm, _AbstractCrudObject);

  function LeadgenForm() {
    classCallCheck(this, LeadgenForm);
    return possibleConstructorReturn(this, (LeadgenForm.__proto__ || Object.getPrototypeOf(LeadgenForm)).apply(this, arguments));
  }

  createClass(LeadgenForm, [{
    key: 'getLeads',
    value: function getLeads(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Lead, fields, params, fetchFirstPage, '/leads');
    }
  }, {
    key: 'getTestLeads',
    value: function getTestLeads(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Lead, fields, params, fetchFirstPage, '/test_leads');
    }
  }, {
    key: 'createTestLead',
    value: function createTestLead(fields, params) {
      return this.createEdge('/test_leads', fields, params, Lead);
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(LeadgenForm.prototype.__proto__ || Object.getPrototypeOf(LeadgenForm.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(LeadgenForm.prototype.__proto__ || Object.getPrototypeOf(LeadgenForm.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        allow_organic_lead: 'allow_organic_lead',
        block_display_for_non_targeted_viewer: 'block_display_for_non_targeted_viewer',
        created_time: 'created_time',
        creator: 'creator',
        creator_id: 'creator_id',
        cusomized_tcpa_content: 'cusomized_tcpa_content',
        expired_leads_count: 'expired_leads_count',
        extra_details: 'extra_details',
        follow_up_action_text: 'follow_up_action_text',
        follow_up_action_url: 'follow_up_action_url',
        id: 'id',
        is_optimized_for_quality: 'is_optimized_for_quality',
        leadgen_export_csv_url: 'leadgen_export_csv_url',
        leads_count: 'leads_count',
        locale: 'locale',
        messenger_welcome_message: 'messenger_welcome_message',
        name: 'name',
        organic_leads_count: 'organic_leads_count',
        page: 'page',
        page_id: 'page_id',
        privacy_policy_url: 'privacy_policy_url',
        qualifiers: 'qualifiers',
        question_page_custom_headline: 'question_page_custom_headline',
        questions: 'questions',
        status: 'status',
        tcpa_compliance: 'tcpa_compliance',
        tracking_parameters: 'tracking_parameters'
      });
    }
  }, {
    key: 'Status',
    get: function get() {
      return Object.freeze({
        active: 'ACTIVE',
        archived: 'ARCHIVED',
        deleted: 'DELETED',
        draft: 'DRAFT'
      });
    }
  }, {
    key: 'Locale',
    get: function get() {
      return Object.freeze({
        ar_ar: 'AR_AR',
        cs_cz: 'CS_CZ',
        da_dk: 'DA_DK',
        de_de: 'DE_DE',
        en_gb: 'EN_GB',
        en_us: 'EN_US',
        es_es: 'ES_ES',
        es_la: 'ES_LA',
        fi_fi: 'FI_FI',
        fr_fr: 'FR_FR',
        he_il: 'HE_IL',
        hi_in: 'HI_IN',
        hu_hu: 'HU_HU',
        id_id: 'ID_ID',
        it_it: 'IT_IT',
        ja_jp: 'JA_JP',
        ko_kr: 'KO_KR',
        nb_no: 'NB_NO',
        nl_nl: 'NL_NL',
        pl_pl: 'PL_PL',
        pt_br: 'PT_BR',
        pt_pt: 'PT_PT',
        ro_ro: 'RO_RO',
        ru_ru: 'RU_RU',
        sv_se: 'SV_SE',
        th_th: 'TH_TH',
        tr_tr: 'TR_TR',
        vi_vn: 'VI_VN',
        zh_cn: 'ZH_CN',
        zh_hk: 'ZH_HK',
        zh_tw: 'ZH_TW'
      });
    }
  }]);
  return LeadgenForm;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * MediaFingerprint
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var MediaFingerprint = function (_AbstractCrudObject) {
  inherits(MediaFingerprint, _AbstractCrudObject);

  function MediaFingerprint() {
    classCallCheck(this, MediaFingerprint);
    return possibleConstructorReturn(this, (MediaFingerprint.__proto__ || Object.getPrototypeOf(MediaFingerprint)).apply(this, arguments));
  }

  createClass(MediaFingerprint, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(MediaFingerprint.prototype.__proto__ || Object.getPrototypeOf(MediaFingerprint.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        duration_in_sec: 'duration_in_sec',
        expiration_time: 'expiration_time',
        fingerprint_content_type: 'fingerprint_content_type',
        fingerprint_type: 'fingerprint_type',
        fingerprint_validity: 'fingerprint_validity',
        id: 'id',
        metadata: 'metadata',
        title: 'title',
        universal_content_id: 'universal_content_id'
      });
    }
  }, {
    key: 'FingerprintContentType',
    get: function get() {
      return Object.freeze({
        am_songtrack: 'AM_SONGTRACK',
        episode: 'EPISODE',
        movie: 'MOVIE',
        other: 'OTHER',
        songtrack: 'SONGTRACK'
      });
    }
  }]);
  return MediaFingerprint;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * MessagingFeatureReview
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var MessagingFeatureReview = function (_AbstractCrudObject) {
  inherits(MessagingFeatureReview, _AbstractCrudObject);

  function MessagingFeatureReview() {
    classCallCheck(this, MessagingFeatureReview);
    return possibleConstructorReturn(this, (MessagingFeatureReview.__proto__ || Object.getPrototypeOf(MessagingFeatureReview)).apply(this, arguments));
  }

  createClass(MessagingFeatureReview, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        feature: 'feature',
        status: 'status'
      });
    }
  }]);
  return MessagingFeatureReview;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * MessengerDestinationPageWelcomeMessage
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var MessengerDestinationPageWelcomeMessage = function (_AbstractCrudObject) {
  inherits(MessengerDestinationPageWelcomeMessage, _AbstractCrudObject);

  function MessengerDestinationPageWelcomeMessage() {
    classCallCheck(this, MessengerDestinationPageWelcomeMessage);
    return possibleConstructorReturn(this, (MessengerDestinationPageWelcomeMessage.__proto__ || Object.getPrototypeOf(MessengerDestinationPageWelcomeMessage)).apply(this, arguments));
  }

  createClass(MessengerDestinationPageWelcomeMessage, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        id: 'id',
        page_welcome_message_body: 'page_welcome_message_body',
        page_welcome_message_type: 'page_welcome_message_type',
        template_name: 'template_name',
        time_created: 'time_created',
        time_last_used: 'time_last_used'
      });
    }
  }]);
  return MessengerDestinationPageWelcomeMessage;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * MessengerProfile
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var MessengerProfile = function (_AbstractCrudObject) {
  inherits(MessengerProfile, _AbstractCrudObject);

  function MessengerProfile() {
    classCallCheck(this, MessengerProfile);
    return possibleConstructorReturn(this, (MessengerProfile.__proto__ || Object.getPrototypeOf(MessengerProfile)).apply(this, arguments));
  }

  createClass(MessengerProfile, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        account_linking_url: 'account_linking_url',
        get_started: 'get_started',
        greeting: 'greeting',
        home_url: 'home_url',
        payment_settings: 'payment_settings',
        persistent_menu: 'persistent_menu',
        target_audience: 'target_audience',
        whitelisted_domains: 'whitelisted_domains'
      });
    }
  }]);
  return MessengerProfile;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * NativeOffer
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var NativeOffer = function (_AbstractCrudObject) {
  inherits(NativeOffer, _AbstractCrudObject);

  function NativeOffer() {
    classCallCheck(this, NativeOffer);
    return possibleConstructorReturn(this, (NativeOffer.__proto__ || Object.getPrototypeOf(NativeOffer)).apply(this, arguments));
  }

  createClass(NativeOffer, [{
    key: 'createNativeOfferView',
    value: function createNativeOfferView(fields, params) {
      return this.createEdge('/nativeofferviews', fields, params, NativeOffer);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        barcode_photo: 'barcode_photo',
        barcode_photo_uri: 'barcode_photo_uri',
        barcode_type: 'barcode_type',
        barcode_value: 'barcode_value',
        block_reshares: 'block_reshares',
        details: 'details',
        disable_location: 'disable_location',
        discounts: 'discounts',
        expiration_time: 'expiration_time',
        id: 'id',
        instore_code: 'instore_code',
        location_type: 'location_type',
        max_save_count: 'max_save_count',
        online_code: 'online_code',
        page: 'page',
        page_set_id: 'page_set_id',
        redemption_code: 'redemption_code',
        redemption_link: 'redemption_link',
        save_count: 'save_count',
        terms: 'terms',
        title: 'title',
        total_unique_codes: 'total_unique_codes',
        unique_codes: 'unique_codes',
        unique_codes_file_code_type: 'unique_codes_file_code_type',
        unique_codes_file_name: 'unique_codes_file_name',
        unique_codes_file_upload_status: 'unique_codes_file_upload_status'
      });
    }
  }, {
    key: 'BarcodeType',
    get: function get() {
      return Object.freeze({
        code128: 'CODE128',
        code128b: 'CODE128B',
        code93: 'CODE93',
        databar: 'DATABAR',
        databar_expanded: 'DATABAR_EXPANDED',
        databar_expanded_stacked: 'DATABAR_EXPANDED_STACKED',
        databar_limited: 'DATABAR_LIMITED',
        datamatrix: 'DATAMATRIX',
        ean: 'EAN',
        pdf417: 'PDF417',
        qr: 'QR',
        upc_a: 'UPC_A',
        upc_e: 'UPC_E'
      });
    }
  }, {
    key: 'LocationType',
    get: function get() {
      return Object.freeze({
        both: 'both',
        offline: 'offline',
        online: 'online'
      });
    }
  }]);
  return NativeOffer;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Persona
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Persona = function (_AbstractCrudObject) {
  inherits(Persona, _AbstractCrudObject);

  function Persona() {
    classCallCheck(this, Persona);
    return possibleConstructorReturn(this, (Persona.__proto__ || Object.getPrototypeOf(Persona)).apply(this, arguments));
  }

  createClass(Persona, [{
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(Persona.prototype.__proto__ || Object.getPrototypeOf(Persona.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        id: 'id',
        name: 'name',
        profile_picture_url: 'profile_picture_url'
      });
    }
  }]);
  return Persona;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Recommendation
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Recommendation = function (_AbstractCrudObject) {
  inherits(Recommendation, _AbstractCrudObject);

  function Recommendation() {
    classCallCheck(this, Recommendation);
    return possibleConstructorReturn(this, (Recommendation.__proto__ || Object.getPrototypeOf(Recommendation)).apply(this, arguments));
  }

  createClass(Recommendation, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        created_time: 'created_time',
        has_rating: 'has_rating',
        has_review: 'has_review',
        open_graph_story: 'open_graph_story',
        rating: 'rating',
        recommendation_type: 'recommendation_type',
        review_text: 'review_text',
        reviewer: 'reviewer'
      });
    }
  }]);
  return Recommendation;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * PageSettings
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var PageSettings = function (_AbstractCrudObject) {
  inherits(PageSettings, _AbstractCrudObject);

  function PageSettings() {
    classCallCheck(this, PageSettings);
    return possibleConstructorReturn(this, (PageSettings.__proto__ || Object.getPrototypeOf(PageSettings)).apply(this, arguments));
  }

  createClass(PageSettings, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        setting: 'setting',
        value: 'value'
      });
    }
  }]);
  return PageSettings;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Tab
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Tab = function (_AbstractCrudObject) {
  inherits(Tab, _AbstractCrudObject);

  function Tab() {
    classCallCheck(this, Tab);
    return possibleConstructorReturn(this, (Tab.__proto__ || Object.getPrototypeOf(Tab)).apply(this, arguments));
  }

  createClass(Tab, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        application: 'application',
        custom_image_url: 'custom_image_url',
        custom_name: 'custom_name',
        id: 'id',
        image_url: 'image_url',
        is_non_connection_landing_tab: 'is_non_connection_landing_tab',
        is_permanent: 'is_permanent',
        link: 'link',
        name: 'name',
        position: 'position'
      });
    }
  }]);
  return Tab;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * PageThreadOwner
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var PageThreadOwner = function (_AbstractCrudObject) {
  inherits(PageThreadOwner, _AbstractCrudObject);

  function PageThreadOwner() {
    classCallCheck(this, PageThreadOwner);
    return possibleConstructorReturn(this, (PageThreadOwner.__proto__ || Object.getPrototypeOf(PageThreadOwner)).apply(this, arguments));
  }

  createClass(PageThreadOwner, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        thread_owner: 'thread_owner'
      });
    }
  }]);
  return PageThreadOwner;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * EventTour
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var EventTour = function (_AbstractCrudObject) {
  inherits(EventTour, _AbstractCrudObject);

  function EventTour() {
    classCallCheck(this, EventTour);
    return possibleConstructorReturn(this, (EventTour.__proto__ || Object.getPrototypeOf(EventTour)).apply(this, arguments));
  }

  createClass(EventTour, [{
    key: 'getEvents',
    value: function getEvents(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Event, fields, params, fetchFirstPage, '/events');
    }
  }, {
    key: 'getPages',
    value: function getPages(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Page, fields, params, fetchFirstPage, '/pages');
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        description: 'description',
        dominant_color: 'dominant_color',
        end_time: 'end_time',
        id: 'id',
        is_past: 'is_past',
        last_event_timestamp: 'last_event_timestamp',
        name: 'name',
        num_events: 'num_events',
        photo: 'photo',
        publishing_state: 'publishing_state',
        scheduled_publish_timestamp: 'scheduled_publish_timestamp',
        start_time: 'start_time',
        ticketing_uri: 'ticketing_uri',
        video: 'video'
      });
    }
  }]);
  return EventTour;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * VideoCopyrightRule
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var VideoCopyrightRule = function (_AbstractCrudObject) {
  inherits(VideoCopyrightRule, _AbstractCrudObject);

  function VideoCopyrightRule() {
    classCallCheck(this, VideoCopyrightRule);
    return possibleConstructorReturn(this, (VideoCopyrightRule.__proto__ || Object.getPrototypeOf(VideoCopyrightRule)).apply(this, arguments));
  }

  createClass(VideoCopyrightRule, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        condition_groups: 'condition_groups',
        copyrights: 'copyrights',
        created_date: 'created_date',
        creator: 'creator',
        id: 'id',
        is_in_migration: 'is_in_migration',
        name: 'name'
      });
    }
  }, {
    key: 'Source',
    get: function get() {
      return Object.freeze({
        match_settings_dialog: 'MATCH_SETTINGS_DIALOG',
        rules_selector: 'RULES_SELECTOR',
        rules_tab: 'RULES_TAB'
      });
    }
  }]);
  return VideoCopyrightRule;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * VideoCopyright
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var VideoCopyright = function (_AbstractCrudObject) {
  inherits(VideoCopyright, _AbstractCrudObject);

  function VideoCopyright() {
    classCallCheck(this, VideoCopyright);
    return possibleConstructorReturn(this, (VideoCopyright.__proto__ || Object.getPrototypeOf(VideoCopyright)).apply(this, arguments));
  }

  createClass(VideoCopyright, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(VideoCopyright.prototype.__proto__ || Object.getPrototypeOf(VideoCopyright.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        content_category: 'content_category',
        copyright_content_id: 'copyright_content_id',
        creator: 'creator',
        excluded_ownership_segments: 'excluded_ownership_segments',
        id: 'id',
        in_conflict: 'in_conflict',
        monitoring_status: 'monitoring_status',
        monitoring_type: 'monitoring_type',
        ownership_countries: 'ownership_countries',
        reference_file: 'reference_file',
        reference_file_disabled: 'reference_file_disabled',
        reference_file_disabled_by_ops: 'reference_file_disabled_by_ops',
        reference_file_expired: 'reference_file_expired',
        reference_owner_id: 'reference_owner_id',
        rule_ids: 'rule_ids',
        whitelisted_ids: 'whitelisted_ids'
      });
    }
  }, {
    key: 'ContentCategory',
    get: function get() {
      return Object.freeze({
        episode: 'episode',
        movie: 'movie',
        web: 'web'
      });
    }
  }, {
    key: 'MonitoringType',
    get: function get() {
      return Object.freeze({
        audio_only: 'AUDIO_ONLY',
        video_and_audio: 'VIDEO_AND_AUDIO',
        video_only: 'VIDEO_ONLY'
      });
    }
  }]);
  return VideoCopyright;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * VideoList
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var VideoList = function (_AbstractCrudObject) {
  inherits(VideoList, _AbstractCrudObject);

  function VideoList() {
    classCallCheck(this, VideoList);
    return possibleConstructorReturn(this, (VideoList.__proto__ || Object.getPrototypeOf(VideoList)).apply(this, arguments));
  }

  createClass(VideoList, [{
    key: 'getVideos',
    value: function getVideos(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdVideo, fields, params, fetchFirstPage, '/videos');
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        creation_time: 'creation_time',
        description: 'description',
        id: 'id',
        last_modified: 'last_modified',
        owner: 'owner',
        season_number: 'season_number',
        thumbnail: 'thumbnail',
        title: 'title',
        videos_count: 'videos_count'
      });
    }
  }]);
  return VideoList;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Page
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Page = function (_AbstractCrudObject) {
  inherits(Page, _AbstractCrudObject);

  function Page() {
    classCallCheck(this, Page);
    return possibleConstructorReturn(this, (Page.__proto__ || Object.getPrototypeOf(Page)).apply(this, arguments));
  }

  createClass(Page, [{
    key: 'getAdminNotes',
    value: function getAdminNotes(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(PageAdminNote, fields, params, fetchFirstPage, '/admin_notes');
    }
  }, {
    key: 'createAdminSetting',
    value: function createAdminSetting(fields, params) {
      return this.createEdge('/admin_settings', fields, params, Page);
    }
  }, {
    key: 'deleteAdmins',
    value: function deleteAdmins(params) {
      return get$1(Page.prototype.__proto__ || Object.getPrototypeOf(Page.prototype), 'deleteEdge', this).call(this, '/admins', params);
    }
  }, {
    key: 'createAdmin',
    value: function createAdmin(fields, params) {
      return this.createEdge('/admins', fields, params, User);
    }
  }, {
    key: 'getAdsPosts',
    value: function getAdsPosts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(PagePost, fields, params, fetchFirstPage, '/ads_posts');
    }
  }, {
    key: 'deleteAgencies',
    value: function deleteAgencies(params) {
      return get$1(Page.prototype.__proto__ || Object.getPrototypeOf(Page.prototype), 'deleteEdge', this).call(this, '/agencies', params);
    }
  }, {
    key: 'getAgencies',
    value: function getAgencies(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Business, fields, params, fetchFirstPage, '/agencies');
    }
  }, {
    key: 'createAgency',
    value: function createAgency(fields, params) {
      return this.createEdge('/agencies', fields, params, Page);
    }
  }, {
    key: 'getAlbums',
    value: function getAlbums(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Album, fields, params, fetchFirstPage, '/albums');
    }
  }, {
    key: 'createAlbum',
    value: function createAlbum(fields, params) {
      return this.createEdge('/albums', fields, params, Album);
    }
  }, {
    key: 'deleteAssignedUsers',
    value: function deleteAssignedUsers(params) {
      return get$1(Page.prototype.__proto__ || Object.getPrototypeOf(Page.prototype), 'deleteEdge', this).call(this, '/assigned_users', params);
    }
  }, {
    key: 'getAssignedUsers',
    value: function getAssignedUsers(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AssignedUser, fields, params, fetchFirstPage, '/assigned_users');
    }
  }, {
    key: 'createAssignedUser',
    value: function createAssignedUser(fields, params) {
      return this.createEdge('/assigned_users', fields, params, Page);
    }
  }, {
    key: 'getAudioMediaCopyrights',
    value: function getAudioMediaCopyrights(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AudioCopyright, fields, params, fetchFirstPage, '/audio_media_copyrights');
    }
  }, {
    key: 'deleteBlocked',
    value: function deleteBlocked(params) {
      return get$1(Page.prototype.__proto__ || Object.getPrototypeOf(Page.prototype), 'deleteEdge', this).call(this, '/blocked', params);
    }
  }, {
    key: 'getBlocked',
    value: function getBlocked(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Profile, fields, params, fetchFirstPage, '/blocked');
    }
  }, {
    key: 'createBlocked',
    value: function createBlocked(fields, params) {
      return this.createEdge('/blocked', fields, params);
    }
  }, {
    key: 'createBroadcastMessage',
    value: function createBroadcastMessage(fields, params) {
      return this.createEdge('/broadcast_messages', fields, params, Page);
    }
  }, {
    key: 'createBroadcastReachEstimation',
    value: function createBroadcastReachEstimation(fields, params) {
      return this.createEdge('/broadcast_reach_estimations', fields, params, Page);
    }
  }, {
    key: 'getBusinessProjects',
    value: function getBusinessProjects(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(BusinessProject, fields, params, fetchFirstPage, '/businessprojects');
    }
  }, {
    key: 'createCallToAction',
    value: function createCallToAction(fields, params) {
      return this.createEdge('/call_to_actions', fields, params, PageCallToAction);
    }
  }, {
    key: 'createCanvasElement',
    value: function createCanvasElement(fields, params) {
      return this.createEdge('/canvas_elements', fields, params);
    }
  }, {
    key: 'getCanvases',
    value: function getCanvases(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Canvas, fields, params, fetchFirstPage, '/canvases');
    }
  }, {
    key: 'createCanvase',
    value: function createCanvase(fields, params) {
      return this.createEdge('/canvases', fields, params, Canvas);
    }
  }, {
    key: 'deleteClaimedUrls',
    value: function deleteClaimedUrls(params) {
      return get$1(Page.prototype.__proto__ || Object.getPrototypeOf(Page.prototype), 'deleteEdge', this).call(this, '/claimed_urls', params);
    }
  }, {
    key: 'getClaimedUrls',
    value: function getClaimedUrls(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(URL, fields, params, fetchFirstPage, '/claimed_urls');
    }
  }, {
    key: 'createClaimedUrl',
    value: function createClaimedUrl(fields, params) {
      return this.createEdge('/claimed_urls', fields, params, Page);
    }
  }, {
    key: 'getConversations',
    value: function getConversations(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(UnifiedThread, fields, params, fetchFirstPage, '/conversations');
    }
  }, {
    key: 'createCopyrightManualClaim',
    value: function createCopyrightManualClaim(fields, params) {
      return this.createEdge('/copyright_manual_claims', fields, params);
    }
  }, {
    key: 'deleteCopyrightWhitelistedIgPartners',
    value: function deleteCopyrightWhitelistedIgPartners(params) {
      return get$1(Page.prototype.__proto__ || Object.getPrototypeOf(Page.prototype), 'deleteEdge', this).call(this, '/copyright_whitelisted_ig_partners', params);
    }
  }, {
    key: 'createCopyrightWhitelistedIgPartner',
    value: function createCopyrightWhitelistedIgPartner(fields, params) {
      return this.createEdge('/copyright_whitelisted_ig_partners', fields, params);
    }
  }, {
    key: 'getCopyrightWhitelistedPartners',
    value: function getCopyrightWhitelistedPartners(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Profile, fields, params, fetchFirstPage, '/copyright_whitelisted_partners');
    }
  }, {
    key: 'createCustomLabel',
    value: function createCustomLabel(fields, params) {
      return this.createEdge('/custom_labels', fields, params, PageUserMessageThreadLabel);
    }
  }, {
    key: 'getEvents',
    value: function getEvents(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Event, fields, params, fetchFirstPage, '/events');
    }
  }, {
    key: 'getFeed',
    value: function getFeed(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(PagePost, fields, params, fetchFirstPage, '/feed');
    }
  }, {
    key: 'createFeed',
    value: function createFeed(fields, params) {
      return this.createEdge('/feed', fields, params, PagePost);
    }
  }, {
    key: 'getGlobalBrandChildren',
    value: function getGlobalBrandChildren(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Page, fields, params, fetchFirstPage, '/global_brand_children');
    }
  }, {
    key: 'getIndexedVideos',
    value: function getIndexedVideos(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdVideo, fields, params, fetchFirstPage, '/indexed_videos');
    }
  }, {
    key: 'getInsights',
    value: function getInsights(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(InsightsResult, fields, params, fetchFirstPage, '/insights');
    }
  }, {
    key: 'getInsightsExports',
    value: function getInsightsExports(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(PageInsightsAsyncExportRun, fields, params, fetchFirstPage, '/insights_exports');
    }
  }, {
    key: 'getInstagramAccounts',
    value: function getInstagramAccounts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(InstagramUser, fields, params, fetchFirstPage, '/instagram_accounts');
    }
  }, {
    key: 'getInstantArticles',
    value: function getInstantArticles(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(InstantArticle, fields, params, fetchFirstPage, '/instant_articles');
    }
  }, {
    key: 'createInstantArticle',
    value: function createInstantArticle(fields, params) {
      return this.createEdge('/instant_articles', fields, params, InstantArticle);
    }
  }, {
    key: 'getInstantArticlesInsights',
    value: function getInstantArticlesInsights(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(InstantArticleInsightsQueryResult, fields, params, fetchFirstPage, '/instant_articles_insights');
    }
  }, {
    key: 'createInstantArticlesPublish',
    value: function createInstantArticlesPublish(fields, params) {
      return this.createEdge('/instant_articles_publish', fields, params, Page);
    }
  }, {
    key: 'getLeadGenForms',
    value: function getLeadGenForms(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(LeadgenForm, fields, params, fetchFirstPage, '/leadgen_forms');
    }
  }, {
    key: 'createLeadGenForm',
    value: function createLeadGenForm(fields, params) {
      return this.createEdge('/leadgen_forms', fields, params, LeadgenForm);
    }
  }, {
    key: 'getLikes',
    value: function getLikes(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Page, fields, params, fetchFirstPage, '/likes');
    }
  }, {
    key: 'getLiveEncoders',
    value: function getLiveEncoders(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(LiveEncoder, fields, params, fetchFirstPage, '/live_encoders');
    }
  }, {
    key: 'createLiveEncoder',
    value: function createLiveEncoder(fields, params) {
      return this.createEdge('/live_encoders', fields, params, LiveEncoder);
    }
  }, {
    key: 'getLiveVideos',
    value: function getLiveVideos(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(LiveVideo, fields, params, fetchFirstPage, '/live_videos');
    }
  }, {
    key: 'createLiveVideo',
    value: function createLiveVideo(fields, params) {
      return this.createEdge('/live_videos', fields, params, LiveVideo);
    }
  }, {
    key: 'deleteLocations',
    value: function deleteLocations(params) {
      return get$1(Page.prototype.__proto__ || Object.getPrototypeOf(Page.prototype), 'deleteEdge', this).call(this, '/locations', params);
    }
  }, {
    key: 'getLocations',
    value: function getLocations(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Page, fields, params, fetchFirstPage, '/locations');
    }
  }, {
    key: 'createLocation',
    value: function createLocation(fields, params) {
      return this.createEdge('/locations', fields, params, Page);
    }
  }, {
    key: 'createMediaFingerprint',
    value: function createMediaFingerprint(fields, params) {
      return this.createEdge('/media_fingerprints', fields, params, MediaFingerprint);
    }
  }, {
    key: 'createMessageAttachment',
    value: function createMessageAttachment(fields, params) {
      return this.createEdge('/message_attachments', fields, params);
    }
  }, {
    key: 'createMessageCreative',
    value: function createMessageCreative(fields, params) {
      return this.createEdge('/message_creatives', fields, params, Page);
    }
  }, {
    key: 'createMessage',
    value: function createMessage(fields, params) {
      return this.createEdge('/messages', fields, params, Page);
    }
  }, {
    key: 'getMessagingFeatureReview',
    value: function getMessagingFeatureReview(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(MessagingFeatureReview, fields, params, fetchFirstPage, '/messaging_feature_review');
    }
  }, {
    key: 'getMessengerAdsPageWelcomeMessages',
    value: function getMessengerAdsPageWelcomeMessages(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(MessengerDestinationPageWelcomeMessage, fields, params, fetchFirstPage, '/messenger_ads_page_welcome_messages');
    }
  }, {
    key: 'createMessengerCode',
    value: function createMessengerCode(fields, params) {
      return this.createEdge('/messenger_codes', fields, params, Page);
    }
  }, {
    key: 'deleteMessengerProfile',
    value: function deleteMessengerProfile(params) {
      return get$1(Page.prototype.__proto__ || Object.getPrototypeOf(Page.prototype), 'deleteEdge', this).call(this, '/messenger_profile', params);
    }
  }, {
    key: 'getMessengerProfile',
    value: function getMessengerProfile(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(MessengerProfile, fields, params, fetchFirstPage, '/messenger_profile');
    }
  }, {
    key: 'createMessengerProfile',
    value: function createMessengerProfile(fields, params) {
      return this.createEdge('/messenger_profile', fields, params, Page);
    }
  }, {
    key: 'getNativeOffers',
    value: function getNativeOffers(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(NativeOffer, fields, params, fetchFirstPage, '/nativeoffers');
    }
  }, {
    key: 'createNativeOffer',
    value: function createNativeOffer(fields, params) {
      return this.createEdge('/nativeoffers', fields, params, NativeOffer);
    }
  }, {
    key: 'createNlpConfig',
    value: function createNlpConfig(fields, params) {
      return this.createEdge('/nlp_configs', fields, params, Page);
    }
  }, {
    key: 'createPageAboutStory',
    value: function createPageAboutStory(fields, params) {
      return this.createEdge('/page_about_story', fields, params, Page);
    }
  }, {
    key: 'getPageBackedInstagramAccounts',
    value: function getPageBackedInstagramAccounts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(InstagramUser, fields, params, fetchFirstPage, '/page_backed_instagram_accounts');
    }
  }, {
    key: 'createPageBackedInstagramAccount',
    value: function createPageBackedInstagramAccount(fields, params) {
      return this.createEdge('/page_backed_instagram_accounts', fields, params, InstagramUser);
    }
  }, {
    key: 'createPassThreadControl',
    value: function createPassThreadControl(fields, params) {
      return this.createEdge('/pass_thread_control', fields, params, Page);
    }
  }, {
    key: 'getPersonas',
    value: function getPersonas(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Persona, fields, params, fetchFirstPage, '/personas');
    }
  }, {
    key: 'createPersona',
    value: function createPersona(fields, params) {
      return this.createEdge('/personas', fields, params, Persona);
    }
  }, {
    key: 'getPhotos',
    value: function getPhotos(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Photo, fields, params, fetchFirstPage, '/photos');
    }
  }, {
    key: 'createPhoto',
    value: function createPhoto(fields, params) {
      return this.createEdge('/photos', fields, params, Photo);
    }
  }, {
    key: 'getPicture',
    value: function getPicture(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProfilePictureSource, fields, params, fetchFirstPage, '/picture');
    }
  }, {
    key: 'createPicture',
    value: function createPicture(fields, params) {
      return this.createEdge('/picture', fields, params, ProfilePictureSource);
    }
  }, {
    key: 'getPosts',
    value: function getPosts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(PagePost, fields, params, fetchFirstPage, '/posts');
    }
  }, {
    key: 'createPromotion',
    value: function createPromotion(fields, params) {
      return this.createEdge('/promotions', fields, params);
    }
  }, {
    key: 'getPublishedPosts',
    value: function getPublishedPosts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(PagePost, fields, params, fetchFirstPage, '/published_posts');
    }
  }, {
    key: 'getRatings',
    value: function getRatings(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Recommendation, fields, params, fetchFirstPage, '/ratings');
    }
  }, {
    key: 'createRequestThreadControl',
    value: function createRequestThreadControl(fields, params) {
      return this.createEdge('/request_thread_control', fields, params, Page);
    }
  }, {
    key: 'getRtbDynamicPosts',
    value: function getRtbDynamicPosts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(RTBDynamicPost, fields, params, fetchFirstPage, '/rtb_dynamic_posts');
    }
  }, {
    key: 'getScheduledPosts',
    value: function getScheduledPosts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(PagePost, fields, params, fetchFirstPage, '/scheduled_posts');
    }
  }, {
    key: 'getSecondaryReceivers',
    value: function getSecondaryReceivers(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Application, fields, params, fetchFirstPage, '/secondary_receivers');
    }
  }, {
    key: 'getSettings',
    value: function getSettings(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(PageSettings, fields, params, fetchFirstPage, '/settings');
    }
  }, {
    key: 'createSetting',
    value: function createSetting(fields, params) {
      return this.createEdge('/settings', fields, params, Page);
    }
  }, {
    key: 'deleteSubscribedApps',
    value: function deleteSubscribedApps(params) {
      return get$1(Page.prototype.__proto__ || Object.getPrototypeOf(Page.prototype), 'deleteEdge', this).call(this, '/subscribed_apps', params);
    }
  }, {
    key: 'getSubscribedApps',
    value: function getSubscribedApps(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Application, fields, params, fetchFirstPage, '/subscribed_apps');
    }
  }, {
    key: 'createSubscribedApp',
    value: function createSubscribedApp(fields, params) {
      return this.createEdge('/subscribed_apps', fields, params, Page);
    }
  }, {
    key: 'deleteTabs',
    value: function deleteTabs(params) {
      return get$1(Page.prototype.__proto__ || Object.getPrototypeOf(Page.prototype), 'deleteEdge', this).call(this, '/tabs', params);
    }
  }, {
    key: 'getTabs',
    value: function getTabs(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Tab, fields, params, fetchFirstPage, '/tabs');
    }
  }, {
    key: 'getTagged',
    value: function getTagged(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(PagePost, fields, params, fetchFirstPage, '/tagged');
    }
  }, {
    key: 'createTakeThreadControl',
    value: function createTakeThreadControl(fields, params) {
      return this.createEdge('/take_thread_control', fields, params, Page);
    }
  }, {
    key: 'getThreadOwner',
    value: function getThreadOwner(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(PageThreadOwner, fields, params, fetchFirstPage, '/thread_owner');
    }
  }, {
    key: 'deleteThreadSettings',
    value: function deleteThreadSettings(params) {
      return get$1(Page.prototype.__proto__ || Object.getPrototypeOf(Page.prototype), 'deleteEdge', this).call(this, '/thread_settings', params);
    }
  }, {
    key: 'getThreadSettings',
    value: function getThreadSettings(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/thread_settings');
    }
  }, {
    key: 'createThreadSetting',
    value: function createThreadSetting(fields, params) {
      return this.createEdge('/thread_settings', fields, params, Page);
    }
  }, {
    key: 'getThreads',
    value: function getThreads(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(UnifiedThread, fields, params, fetchFirstPage, '/threads');
    }
  }, {
    key: 'getTours',
    value: function getTours(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(EventTour, fields, params, fetchFirstPage, '/tours');
    }
  }, {
    key: 'createUnlinkAccount',
    value: function createUnlinkAccount(fields, params) {
      return this.createEdge('/unlink_accounts', fields, params, Page);
    }
  }, {
    key: 'getVideoCopyrightRules',
    value: function getVideoCopyrightRules(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(VideoCopyrightRule, fields, params, fetchFirstPage, '/video_copyright_rules');
    }
  }, {
    key: 'createVideoCopyright',
    value: function createVideoCopyright(fields, params) {
      return this.createEdge('/video_copyrights', fields, params, VideoCopyright);
    }
  }, {
    key: 'getVideoLists',
    value: function getVideoLists(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(VideoList, fields, params, fetchFirstPage, '/video_lists');
    }
  }, {
    key: 'getVideos',
    value: function getVideos(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdVideo, fields, params, fetchFirstPage, '/videos');
    }
  }, {
    key: 'createVideo',
    value: function createVideo(fields, params) {
      return this.createEdge('/videos', fields, params, AdVideo);
    }
  }, {
    key: 'getVisitorPosts',
    value: function getVisitorPosts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(PagePost, fields, params, fetchFirstPage, '/visitor_posts');
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(Page.prototype.__proto__ || Object.getPrototypeOf(Page.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        about: 'about',
        access_token: 'access_token',
        ad_campaign: 'ad_campaign',
        affiliation: 'affiliation',
        app_id: 'app_id',
        app_links: 'app_links',
        artists_we_like: 'artists_we_like',
        attire: 'attire',
        awards: 'awards',
        band_interests: 'band_interests',
        band_members: 'band_members',
        best_page: 'best_page',
        bio: 'bio',
        birthday: 'birthday',
        booking_agent: 'booking_agent',
        built: 'built',
        business: 'business',
        can_checkin: 'can_checkin',
        can_post: 'can_post',
        category: 'category',
        category_list: 'category_list',
        checkins: 'checkins',
        company_overview: 'company_overview',
        connected_instagram_account: 'connected_instagram_account',
        contact_address: 'contact_address',
        copyright_attribution_insights: 'copyright_attribution_insights',
        copyright_whitelisted_ig_partners: 'copyright_whitelisted_ig_partners',
        country_page_likes: 'country_page_likes',
        cover: 'cover',
        culinary_team: 'culinary_team',
        current_location: 'current_location',
        description: 'description',
        description_html: 'description_html',
        directed_by: 'directed_by',
        display_subtext: 'display_subtext',
        displayed_message_response_time: 'displayed_message_response_time',
        emails: 'emails',
        engagement: 'engagement',
        fan_count: 'fan_count',
        featured_video: 'featured_video',
        features: 'features',
        food_styles: 'food_styles',
        founded: 'founded',
        general_info: 'general_info',
        general_manager: 'general_manager',
        genre: 'genre',
        global_brand_page_name: 'global_brand_page_name',
        global_brand_root_id: 'global_brand_root_id',
        has_added_app: 'has_added_app',
        has_whatsapp_business_number: 'has_whatsapp_business_number',
        has_whatsapp_number: 'has_whatsapp_number',
        hometown: 'hometown',
        hours: 'hours',
        id: 'id',
        impressum: 'impressum',
        influences: 'influences',
        instagram_business_account: 'instagram_business_account',
        instant_articles_review_status: 'instant_articles_review_status',
        is_always_open: 'is_always_open',
        is_chain: 'is_chain',
        is_community_page: 'is_community_page',
        is_eligible_for_branded_content: 'is_eligible_for_branded_content',
        is_messenger_bot_get_started_enabled: 'is_messenger_bot_get_started_enabled',
        is_messenger_platform_bot: 'is_messenger_platform_bot',
        is_owned: 'is_owned',
        is_permanently_closed: 'is_permanently_closed',
        is_published: 'is_published',
        is_unclaimed: 'is_unclaimed',
        is_verified: 'is_verified',
        is_webhooks_subscribed: 'is_webhooks_subscribed',
        keywords: 'keywords',
        leadgen_form_preview_details: 'leadgen_form_preview_details',
        leadgen_has_crm_integration: 'leadgen_has_crm_integration',
        leadgen_has_fat_ping_crm_integration: 'leadgen_has_fat_ping_crm_integration',
        leadgen_tos_acceptance_time: 'leadgen_tos_acceptance_time',
        leadgen_tos_accepted: 'leadgen_tos_accepted',
        leadgen_tos_accepting_user: 'leadgen_tos_accepting_user',
        link: 'link',
        location: 'location',
        members: 'members',
        merchant_id: 'merchant_id',
        merchant_review_status: 'merchant_review_status',
        messenger_ads_default_icebreakers: 'messenger_ads_default_icebreakers',
        messenger_ads_default_page_welcome_message: 'messenger_ads_default_page_welcome_message',
        messenger_ads_default_quick_replies: 'messenger_ads_default_quick_replies',
        messenger_ads_quick_replies_type: 'messenger_ads_quick_replies_type',
        mission: 'mission',
        mpg: 'mpg',
        name: 'name',
        name_with_location_descriptor: 'name_with_location_descriptor',
        network: 'network',
        new_like_count: 'new_like_count',
        offer_eligible: 'offer_eligible',
        overall_star_rating: 'overall_star_rating',
        page_about_story: 'page_about_story',
        page_token: 'page_token',
        parent_page: 'parent_page',
        parking: 'parking',
        payment_options: 'payment_options',
        personal_info: 'personal_info',
        personal_interests: 'personal_interests',
        pharma_safety_info: 'pharma_safety_info',
        phone: 'phone',
        place_type: 'place_type',
        plot_outline: 'plot_outline',
        preferred_audience: 'preferred_audience',
        press_contact: 'press_contact',
        price_range: 'price_range',
        privacy_info_url: 'privacy_info_url',
        produced_by: 'produced_by',
        products: 'products',
        promotion_eligible: 'promotion_eligible',
        promotion_ineligible_reason: 'promotion_ineligible_reason',
        public_transit: 'public_transit',
        rating_count: 'rating_count',
        recipient: 'recipient',
        record_label: 'record_label',
        release_date: 'release_date',
        restaurant_services: 'restaurant_services',
        restaurant_specialties: 'restaurant_specialties',
        schedule: 'schedule',
        screenplay_by: 'screenplay_by',
        season: 'season',
        single_line_address: 'single_line_address',
        starring: 'starring',
        start_info: 'start_info',
        store_code: 'store_code',
        store_location_descriptor: 'store_location_descriptor',
        store_number: 'store_number',
        studio: 'studio',
        supports_instant_articles: 'supports_instant_articles',
        talking_about_count: 'talking_about_count',
        unread_message_count: 'unread_message_count',
        unread_notif_count: 'unread_notif_count',
        unseen_message_count: 'unseen_message_count',
        username: 'username',
        verification_status: 'verification_status',
        voip_info: 'voip_info',
        website: 'website',
        were_here_count: 'were_here_count',
        whatsapp_number: 'whatsapp_number',
        written_by: 'written_by'
      });
    }
  }, {
    key: 'Attire',
    get: function get() {
      return Object.freeze({
        casual: 'Casual',
        dressy: 'Dressy',
        unspecified: 'Unspecified'
      });
    }
  }, {
    key: 'FoodStyles',
    get: function get() {
      return Object.freeze({
        afghani: 'Afghani',
        american_new_: 'American (New)',
        american_traditional_: 'American (Traditional)',
        asian_fusion: 'Asian Fusion',
        barbeque: 'Barbeque',
        brazilian: 'Brazilian',
        breakfast: 'Breakfast',
        british: 'British',
        brunch: 'Brunch',
        buffets: 'Buffets',
        burgers: 'Burgers',
        burmese: 'Burmese',
        cajun_creole: 'Cajun/Creole',
        caribbean: 'Caribbean',
        chinese: 'Chinese',
        creperies: 'Creperies',
        cuban: 'Cuban',
        delis: 'Delis',
        diners: 'Diners',
        ethiopian: 'Ethiopian',
        fast_food: 'Fast Food',
        filipino: 'Filipino',
        fondue: 'Fondue',
        food_stands: 'Food Stands',
        french: 'French',
        german: 'German',
        greek_and_mediterranean: 'Greek and Mediterranean',
        hawaiian: 'Hawaiian',
        himalayan_nepalese: 'Himalayan/Nepalese',
        hot_dogs: 'Hot Dogs',
        indian_pakistani: 'Indian/Pakistani',
        irish: 'Irish',
        italian: 'Italian',
        japanese: 'Japanese',
        korean: 'Korean',
        latin_american: 'Latin American',
        mexican: 'Mexican',
        middle_eastern: 'Middle Eastern',
        moroccan: 'Moroccan',
        pizza: 'Pizza',
        russian: 'Russian',
        sandwiches: 'Sandwiches',
        seafood: 'Seafood',
        singaporean: 'Singaporean',
        soul_food: 'Soul Food',
        southern: 'Southern',
        spanish_basque: 'Spanish/Basque',
        steakhouses: 'Steakhouses',
        sushi_bars: 'Sushi Bars',
        taiwanese: 'Taiwanese',
        tapas_bars: 'Tapas Bars',
        tex_mex: 'Tex-Mex',
        thai: 'Thai',
        turkish: 'Turkish',
        vegan: 'Vegan',
        vegetarian: 'Vegetarian',
        vietnamese: 'Vietnamese'
      });
    }
  }, {
    key: 'Setting',
    get: function get() {
      return Object.freeze({
        email_notif: 'EMAIL_NOTIF',
        mobile_notif: 'MOBILE_NOTIF',
        post_as_self: 'POST_AS_SELF'
      });
    }
  }, {
    key: 'PermittedTasks',
    get: function get() {
      return Object.freeze({
        advertise: 'ADVERTISE',
        analyze: 'ANALYZE',
        create_content: 'CREATE_CONTENT',
        manage: 'MANAGE',
        manage_jobs: 'MANAGE_JOBS',
        moderate: 'MODERATE',
        moderate_community: 'MODERATE_COMMUNITY',
        pages_messaging: 'PAGES_MESSAGING',
        pages_messaging_subscriptions: 'PAGES_MESSAGING_SUBSCRIPTIONS',
        read_page_mailboxes: 'READ_PAGE_MAILBOXES',
        view_monetization_insights: 'VIEW_MONETIZATION_INSIGHTS'
      });
    }
  }, {
    key: 'Tasks',
    get: function get() {
      return Object.freeze({
        advertise: 'ADVERTISE',
        analyze: 'ANALYZE',
        create_content: 'CREATE_CONTENT',
        manage: 'MANAGE',
        manage_jobs: 'MANAGE_JOBS',
        moderate: 'MODERATE',
        moderate_community: 'MODERATE_COMMUNITY',
        pages_messaging: 'PAGES_MESSAGING',
        pages_messaging_subscriptions: 'PAGES_MESSAGING_SUBSCRIPTIONS',
        read_page_mailboxes: 'READ_PAGE_MAILBOXES',
        view_monetization_insights: 'VIEW_MONETIZATION_INSIGHTS'
      });
    }
  }, {
    key: 'MessagingType',
    get: function get() {
      return Object.freeze({
        message_tag: 'MESSAGE_TAG',
        response: 'RESPONSE',
        update: 'UPDATE'
      });
    }
  }, {
    key: 'NotificationType',
    get: function get() {
      return Object.freeze({
        no_push: 'NO_PUSH',
        regular: 'REGULAR',
        silent_push: 'SILENT_PUSH'
      });
    }
  }, {
    key: 'PublishStatus',
    get: function get() {
      return Object.freeze({
        draft: 'DRAFT',
        live: 'LIVE'
      });
    }
  }, {
    key: 'SenderAction',
    get: function get() {
      return Object.freeze({
        mark_seen: 'MARK_SEEN',
        typing_off: 'TYPING_OFF',
        typing_on: 'TYPING_ON'
      });
    }
  }, {
    key: 'Type',
    get: function get() {
      return Object.freeze({
        ref: 'REF',
        standard: 'STANDARD'
      });
    }
  }, {
    key: 'Model',
    get: function get() {
      return Object.freeze({
        arabic: 'ARABIC',
        chinese: 'CHINESE',
        croatian: 'CROATIAN',
        custom: 'CUSTOM',
        danish: 'DANISH',
        dutch: 'DUTCH',
        english: 'ENGLISH',
        french_standard: 'FRENCH_STANDARD',
        georgian: 'GEORGIAN',
        german_standard: 'GERMAN_STANDARD',
        greek: 'GREEK',
        hebrew: 'HEBREW',
        hungarian: 'HUNGARIAN',
        irish: 'IRISH',
        italian_standard: 'ITALIAN_STANDARD',
        korean: 'KOREAN',
        norwegian_bokmal: 'NORWEGIAN_BOKMAL',
        polish: 'POLISH',
        portuguese: 'PORTUGUESE',
        romanian: 'ROMANIAN',
        spanish: 'SPANISH',
        swedish: 'SWEDISH',
        vietnamese: 'VIETNAMESE'
      });
    }
  }, {
    key: 'SubscribedFields',
    get: function get() {
      return Object.freeze({
        affiliation: 'affiliation',
        attire: 'attire',
        awards: 'awards',
        bio: 'bio',
        birthday: 'birthday',
        branded_camera: 'branded_camera',
        category: 'category',
        checkins: 'checkins',
        company_overview: 'company_overview',
        conversations: 'conversations',
        culinary_team: 'culinary_team',
        current_location: 'current_location',
        description: 'description',
        email: 'email',
        feature_access_list: 'feature_access_list',
        feed: 'feed',
        founded: 'founded',
        general_info: 'general_info',
        general_manager: 'general_manager',
        hometown: 'hometown',
        hours: 'hours',
        leadgen: 'leadgen',
        leadgen_fat: 'leadgen_fat',
        live_videos: 'live_videos',
        location: 'location',
        members: 'members',
        mention: 'mention',
        merchant_review: 'merchant_review',
        message_deliveries: 'message_deliveries',
        message_echoes: 'message_echoes',
        message_reads: 'message_reads',
        messages: 'messages',
        messaging_account_linking: 'messaging_account_linking',
        messaging_appointments: 'messaging_appointments',
        messaging_checkout_updates: 'messaging_checkout_updates',
        messaging_direct_sends: 'messaging_direct_sends',
        messaging_game_plays: 'messaging_game_plays',
        messaging_handovers: 'messaging_handovers',
        messaging_optins: 'messaging_optins',
        messaging_optouts: 'messaging_optouts',
        messaging_page_feedback: 'messaging_page_feedback',
        messaging_payments: 'messaging_payments',
        messaging_policy_enforcement: 'messaging_policy_enforcement',
        messaging_postbacks: 'messaging_postbacks',
        messaging_pre_checkouts: 'messaging_pre_checkouts',
        messaging_referrals: 'messaging_referrals',
        mission: 'mission',
        name: 'name',
        page_about_story: 'page_about_story',
        page_change_proposal: 'page_change_proposal',
        page_upcoming_change: 'page_upcoming_change',
        parking: 'parking',
        payment_options: 'payment_options',
        personal_info: 'personal_info',
        personal_interests: 'personal_interests',
        phone: 'phone',
        picture: 'picture',
        price_range: 'price_range',
        product_review: 'product_review',
        products: 'products',
        public_transit: 'public_transit',
        publisher_subscriptions: 'publisher_subscriptions',
        ratings: 'ratings',
        registration: 'registration',
        standby: 'standby',
        videos: 'videos',
        website: 'website'
      });
    }
  }, {
    key: 'DomainActionType',
    get: function get() {
      return Object.freeze({
        add: 'ADD',
        remove: 'REMOVE'
      });
    }
  }, {
    key: 'PaymentDevModeAction',
    get: function get() {
      return Object.freeze({
        add: 'ADD',
        remove: 'REMOVE'
      });
    }
  }, {
    key: 'SettingType',
    get: function get() {
      return Object.freeze({
        account_linking: 'ACCOUNT_LINKING',
        call_to_actions: 'CALL_TO_ACTIONS',
        domain_whitelisting: 'DOMAIN_WHITELISTING',
        greeting: 'GREETING',
        payment: 'PAYMENT'
      });
    }
  }, {
    key: 'ThreadState',
    get: function get() {
      return Object.freeze({
        existing_thread: 'EXISTING_THREAD',
        new_thread: 'NEW_THREAD'
      });
    }
  }]);
  return Page;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * BusinessUser
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var BusinessUser = function (_AbstractCrudObject) {
  inherits(BusinessUser, _AbstractCrudObject);

  function BusinessUser() {
    classCallCheck(this, BusinessUser);
    return possibleConstructorReturn(this, (BusinessUser.__proto__ || Object.getPrototypeOf(BusinessUser)).apply(this, arguments));
  }

  createClass(BusinessUser, [{
    key: 'getAssignedAdAccounts',
    value: function getAssignedAdAccounts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAccount, fields, params, fetchFirstPage, '/assigned_ad_accounts');
    }
  }, {
    key: 'getAssignedPages',
    value: function getAssignedPages(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Page, fields, params, fetchFirstPage, '/assigned_pages');
    }
  }, {
    key: 'getAssignedProductCatalogs',
    value: function getAssignedProductCatalogs(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProductCatalog, fields, params, fetchFirstPage, '/assigned_product_catalogs');
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(BusinessUser.prototype.__proto__ || Object.getPrototypeOf(BusinessUser.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(BusinessUser.prototype.__proto__ || Object.getPrototypeOf(BusinessUser.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        business: 'business',
        email: 'email',
        finance_permission: 'finance_permission',
        first_name: 'first_name',
        id: 'id',
        ip_permission: 'ip_permission',
        last_name: 'last_name',
        marked_for_removal: 'marked_for_removal',
        name: 'name',
        pending_email: 'pending_email',
        role: 'role',
        title: 'title',
        two_fac_status: 'two_fac_status'
      });
    }
  }, {
    key: 'Role',
    get: function get() {
      return Object.freeze({
        admin: 'ADMIN',
        ads_rights_reviewer: 'ADS_RIGHTS_REVIEWER',
        employee: 'EMPLOYEE',
        finance_analyst: 'FINANCE_ANALYST',
        finance_editor: 'FINANCE_EDITOR'
      });
    }
  }]);
  return BusinessUser;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * CustomConversionStatsResult
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var CustomConversionStatsResult = function (_AbstractCrudObject) {
  inherits(CustomConversionStatsResult, _AbstractCrudObject);

  function CustomConversionStatsResult() {
    classCallCheck(this, CustomConversionStatsResult);
    return possibleConstructorReturn(this, (CustomConversionStatsResult.__proto__ || Object.getPrototypeOf(CustomConversionStatsResult)).apply(this, arguments));
  }

  createClass(CustomConversionStatsResult, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        aggregation: 'aggregation',
        data: 'data',
        timestamp: 'timestamp'
      });
    }
  }, {
    key: 'Aggregation',
    get: function get() {
      return Object.freeze({
        count: 'count',
        device_type: 'device_type',
        host: 'host',
        pixel_fire: 'pixel_fire',
        unmatched_count: 'unmatched_count',
        unmatched_usd_amount: 'unmatched_usd_amount',
        url: 'url',
        usd_amount: 'usd_amount'
      });
    }
  }]);
  return CustomConversionStatsResult;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * CustomConversion
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var CustomConversion = function (_AbstractCrudObject) {
  inherits(CustomConversion, _AbstractCrudObject);

  function CustomConversion() {
    classCallCheck(this, CustomConversion);
    return possibleConstructorReturn(this, (CustomConversion.__proto__ || Object.getPrototypeOf(CustomConversion)).apply(this, arguments));
  }

  createClass(CustomConversion, [{
    key: 'deleteAdAccounts',
    value: function deleteAdAccounts(params) {
      return get$1(CustomConversion.prototype.__proto__ || Object.getPrototypeOf(CustomConversion.prototype), 'deleteEdge', this).call(this, '/adaccounts', params);
    }
  }, {
    key: 'getStats',
    value: function getStats(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(CustomConversionStatsResult, fields, params, fetchFirstPage, '/stats');
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(CustomConversion.prototype.__proto__ || Object.getPrototypeOf(CustomConversion.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(CustomConversion.prototype.__proto__ || Object.getPrototypeOf(CustomConversion.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        aggregation_rule: 'aggregation_rule',
        business: 'business',
        creation_time: 'creation_time',
        custom_event_type: 'custom_event_type',
        data_sources: 'data_sources',
        default_conversion_value: 'default_conversion_value',
        description: 'description',
        event_source_type: 'event_source_type',
        first_fired_time: 'first_fired_time',
        id: 'id',
        is_archived: 'is_archived',
        is_unavailable: 'is_unavailable',
        last_fired_time: 'last_fired_time',
        name: 'name',
        offline_conversion_data_set: 'offline_conversion_data_set',
        pixel: 'pixel',
        retention_days: 'retention_days',
        rule: 'rule'
      });
    }
  }, {
    key: 'CustomEventType',
    get: function get() {
      return Object.freeze({
        add_payment_info: 'ADD_PAYMENT_INFO',
        add_to_cart: 'ADD_TO_CART',
        add_to_wishlist: 'ADD_TO_WISHLIST',
        complete_registration: 'COMPLETE_REGISTRATION',
        contact: 'CONTACT',
        content_view: 'CONTENT_VIEW',
        customize_product: 'CUSTOMIZE_PRODUCT',
        donate: 'DONATE',
        find_location: 'FIND_LOCATION',
        initiated_checkout: 'INITIATED_CHECKOUT',
        lead: 'LEAD',
        listing_interaction: 'LISTING_INTERACTION',
        other: 'OTHER',
        purchase: 'PURCHASE',
        schedule: 'SCHEDULE',
        search: 'SEARCH',
        start_trial: 'START_TRIAL',
        submit_application: 'SUBMIT_APPLICATION',
        subscribe: 'SUBSCRIBE'
      });
    }
  }]);
  return CustomConversion;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * DirectDeal
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var DirectDeal = function (_AbstractCrudObject) {
  inherits(DirectDeal, _AbstractCrudObject);

  function DirectDeal() {
    classCallCheck(this, DirectDeal);
    return possibleConstructorReturn(this, (DirectDeal.__proto__ || Object.getPrototypeOf(DirectDeal)).apply(this, arguments));
  }

  createClass(DirectDeal, [{
    key: 'getApplications',
    value: function getApplications(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Application, fields, params, fetchFirstPage, '/applications');
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        adbreaks_enabled: 'adbreaks_enabled',
        adset: 'adset',
        advertiser: 'advertiser',
        advertiser_lead_email: 'advertiser_lead_email',
        advertiser_page: 'advertiser_page',
        cpe_amount: 'cpe_amount',
        cpe_currency: 'cpe_currency',
        end_time: 'end_time',
        id: 'id',
        lifetime_budget_amount: 'lifetime_budget_amount',
        lifetime_budget_currency: 'lifetime_budget_currency',
        lifetime_impressions: 'lifetime_impressions',
        name: 'name',
        pages: 'pages',
        placements: 'placements',
        priced_by: 'priced_by',
        publisher_name: 'publisher_name',
        review_requirement: 'review_requirement',
        sales_lead_email: 'sales_lead_email',
        start_time: 'start_time',
        status: 'status',
        targeting: 'targeting',
        third_party_ids: 'third_party_ids',
        third_party_integrated_deal: 'third_party_integrated_deal'
      });
    }
  }, {
    key: 'Status',
    get: function get() {
      return Object.freeze({
        value_0: '0',
        value_1: '1',
        value_2: '2',
        value_3: '3',
        value_4: '4',
        value_5: '5',
        value_6: '6'
      });
    }
  }]);
  return DirectDeal;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * EventSourceGroup
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var EventSourceGroup = function (_AbstractCrudObject) {
  inherits(EventSourceGroup, _AbstractCrudObject);

  function EventSourceGroup() {
    classCallCheck(this, EventSourceGroup);
    return possibleConstructorReturn(this, (EventSourceGroup.__proto__ || Object.getPrototypeOf(EventSourceGroup)).apply(this, arguments));
  }

  createClass(EventSourceGroup, [{
    key: 'getSharedAccounts',
    value: function getSharedAccounts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAccount, fields, params, fetchFirstPage, '/shared_accounts');
    }
  }, {
    key: 'createSharedAccount',
    value: function createSharedAccount(fields, params) {
      return this.createEdge('/shared_accounts', fields, params, EventSourceGroup);
    }
  }, {
    key: 'deleteUserPermissions',
    value: function deleteUserPermissions(params) {
      return get$1(EventSourceGroup.prototype.__proto__ || Object.getPrototypeOf(EventSourceGroup.prototype), 'deleteEdge', this).call(this, '/userpermissions', params);
    }
  }, {
    key: 'getUserPermissions',
    value: function getUserPermissions(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/userpermissions');
    }
  }, {
    key: 'createUserPermission',
    value: function createUserPermission(fields, params) {
      return this.createEdge('/userpermissions', fields, params, EventSourceGroup);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(EventSourceGroup.prototype.__proto__ || Object.getPrototypeOf(EventSourceGroup.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        business: 'business',
        event_sources: 'event_sources',
        id: 'id',
        name: 'name'
      });
    }
  }, {
    key: 'Tasks',
    get: function get() {
      return Object.freeze({
        analyze: 'ANALYZE',
        analyze_with_limitations: 'ANALYZE_WITH_LIMITATIONS'
      });
    }
  }]);
  return EventSourceGroup;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ExtendedCreditInvoiceGroup
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ExtendedCreditInvoiceGroup = function (_AbstractCrudObject) {
  inherits(ExtendedCreditInvoiceGroup, _AbstractCrudObject);

  function ExtendedCreditInvoiceGroup() {
    classCallCheck(this, ExtendedCreditInvoiceGroup);
    return possibleConstructorReturn(this, (ExtendedCreditInvoiceGroup.__proto__ || Object.getPrototypeOf(ExtendedCreditInvoiceGroup)).apply(this, arguments));
  }

  createClass(ExtendedCreditInvoiceGroup, [{
    key: 'deleteAdAccounts',
    value: function deleteAdAccounts(params) {
      return get$1(ExtendedCreditInvoiceGroup.prototype.__proto__ || Object.getPrototypeOf(ExtendedCreditInvoiceGroup.prototype), 'deleteEdge', this).call(this, '/ad_accounts', params);
    }
  }, {
    key: 'getAdAccounts',
    value: function getAdAccounts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAccount, fields, params, fetchFirstPage, '/ad_accounts');
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(ExtendedCreditInvoiceGroup.prototype.__proto__ || Object.getPrototypeOf(ExtendedCreditInvoiceGroup.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(ExtendedCreditInvoiceGroup.prototype.__proto__ || Object.getPrototypeOf(ExtendedCreditInvoiceGroup.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        auto_enroll: 'auto_enroll',
        customer_po_number: 'customer_po_number',
        email: 'email',
        emails: 'emails',
        id: 'id',
        name: 'name'
      });
    }
  }]);
  return ExtendedCreditInvoiceGroup;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ExtendedCreditAllocationConfig
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ExtendedCreditAllocationConfig = function (_AbstractCrudObject) {
  inherits(ExtendedCreditAllocationConfig, _AbstractCrudObject);

  function ExtendedCreditAllocationConfig() {
    classCallCheck(this, ExtendedCreditAllocationConfig);
    return possibleConstructorReturn(this, (ExtendedCreditAllocationConfig.__proto__ || Object.getPrototypeOf(ExtendedCreditAllocationConfig)).apply(this, arguments));
  }

  createClass(ExtendedCreditAllocationConfig, [{
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(ExtendedCreditAllocationConfig.prototype.__proto__ || Object.getPrototypeOf(ExtendedCreditAllocationConfig.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        currency_amount: 'currency_amount',
        id: 'id',
        liability_type: 'liability_type',
        owning_business: 'owning_business',
        owning_credential: 'owning_credential',
        partition_type: 'partition_type',
        receiving_business: 'receiving_business',
        receiving_credential: 'receiving_credential',
        request_status: 'request_status',
        send_bill_to: 'send_bill_to'
      });
    }
  }, {
    key: 'LiabilityType',
    get: function get() {
      return Object.freeze({
        msa: 'MSA',
        normal: 'Normal',
        sequential: 'Sequential'
      });
    }
  }, {
    key: 'PartitionType',
    get: function get() {
      return Object.freeze({
        auth: 'AUTH',
        fixed: 'FIXED'
      });
    }
  }, {
    key: 'SendBillTo',
    get: function get() {
      return Object.freeze({
        advertiser: 'Advertiser',
        agency: 'Agency'
      });
    }
  }]);
  return ExtendedCreditAllocationConfig;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ExtendedCredit
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ExtendedCredit = function (_AbstractCrudObject) {
  inherits(ExtendedCredit, _AbstractCrudObject);

  function ExtendedCredit() {
    classCallCheck(this, ExtendedCredit);
    return possibleConstructorReturn(this, (ExtendedCredit.__proto__ || Object.getPrototypeOf(ExtendedCredit)).apply(this, arguments));
  }

  createClass(ExtendedCredit, [{
    key: 'getExtendedCreditInvoiceGroups',
    value: function getExtendedCreditInvoiceGroups(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ExtendedCreditInvoiceGroup, fields, params, fetchFirstPage, '/extended_credit_invoice_groups');
    }
  }, {
    key: 'createExtendedCreditInvoiceGroup',
    value: function createExtendedCreditInvoiceGroup(fields, params) {
      return this.createEdge('/extended_credit_invoice_groups', fields, params, ExtendedCreditInvoiceGroup);
    }
  }, {
    key: 'getOwningCreditAllocationConfigs',
    value: function getOwningCreditAllocationConfigs(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ExtendedCreditAllocationConfig, fields, params, fetchFirstPage, '/owning_credit_allocation_configs');
    }
  }, {
    key: 'createOwningCreditAllocationConfig',
    value: function createOwningCreditAllocationConfig(fields, params) {
      return this.createEdge('/owning_credit_allocation_configs', fields, params, ExtendedCreditAllocationConfig);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        allocated_amount: 'allocated_amount',
        balance: 'balance',
        credit_available: 'credit_available',
        credit_type: 'credit_type',
        id: 'id',
        is_access_revoked: 'is_access_revoked',
        is_automated_experience: 'is_automated_experience',
        last_payment_time: 'last_payment_time',
        legal_entity_name: 'legal_entity_name',
        liable_biz_name: 'liable_biz_name',
        max_balance: 'max_balance',
        online_max_balance: 'online_max_balance',
        owner_business: 'owner_business',
        owner_business_name: 'owner_business_name',
        partition_from: 'partition_from',
        receiving_credit_allocation_config: 'receiving_credit_allocation_config',
        send_bill_to_biz_name: 'send_bill_to_biz_name'
      });
    }
  }]);
  return ExtendedCredit;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * BusinessAgreement
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var BusinessAgreement = function (_AbstractCrudObject) {
  inherits(BusinessAgreement, _AbstractCrudObject);

  function BusinessAgreement() {
    classCallCheck(this, BusinessAgreement);
    return possibleConstructorReturn(this, (BusinessAgreement.__proto__ || Object.getPrototypeOf(BusinessAgreement)).apply(this, arguments));
  }

  createClass(BusinessAgreement, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(BusinessAgreement.prototype.__proto__ || Object.getPrototypeOf(BusinessAgreement.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        id: 'id',
        request_status: 'request_status'
      });
    }
  }, {
    key: 'RequestStatus',
    get: function get() {
      return Object.freeze({
        approve: 'APPROVE',
        decline: 'DECLINE',
        expired: 'EXPIRED',
        in_progress: 'IN_PROGRESS'
      });
    }
  }]);
  return BusinessAgreement;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * MeasurementReport
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var MeasurementReport = function (_AbstractCrudObject) {
  inherits(MeasurementReport, _AbstractCrudObject);

  function MeasurementReport() {
    classCallCheck(this, MeasurementReport);
    return possibleConstructorReturn(this, (MeasurementReport.__proto__ || Object.getPrototypeOf(MeasurementReport)).apply(this, arguments));
  }

  createClass(MeasurementReport, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(MeasurementReport.prototype.__proto__ || Object.getPrototypeOf(MeasurementReport.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        download_urls: 'download_urls',
        id: 'id',
        metadata: 'metadata',
        report_type: 'report_type',
        status: 'status',
        upload_urls: 'upload_urls'
      });
    }
  }, {
    key: 'ReportType',
    get: function get() {
      return Object.freeze({
        fruit_rollup_report: 'fruit_rollup_report',
        mmm_report: 'mmm_report',
        multi_channel_report: 'multi_channel_report',
        partner_lift_study_report: 'partner_lift_study_report',
        third_party_mta_report: 'third_party_mta_report',
        video_metrics_report: 'video_metrics_report'
      });
    }
  }]);
  return MeasurementReport;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * OfflineConversionDataSet
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var OfflineConversionDataSet = function (_AbstractCrudObject) {
  inherits(OfflineConversionDataSet, _AbstractCrudObject);

  function OfflineConversionDataSet() {
    classCallCheck(this, OfflineConversionDataSet);
    return possibleConstructorReturn(this, (OfflineConversionDataSet.__proto__ || Object.getPrototypeOf(OfflineConversionDataSet)).apply(this, arguments));
  }

  createClass(OfflineConversionDataSet, [{
    key: 'getAdAccounts',
    value: function getAdAccounts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAccount, fields, params, fetchFirstPage, '/adaccounts');
    }
  }, {
    key: 'createAdAccount',
    value: function createAdAccount(fields, params) {
      return this.createEdge('/adaccounts', fields, params, OfflineConversionDataSet);
    }
  }, {
    key: 'deleteAgencies',
    value: function deleteAgencies(params) {
      return get$1(OfflineConversionDataSet.prototype.__proto__ || Object.getPrototypeOf(OfflineConversionDataSet.prototype), 'deleteEdge', this).call(this, '/agencies', params);
    }
  }, {
    key: 'getAgencies',
    value: function getAgencies(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Business, fields, params, fetchFirstPage, '/agencies');
    }
  }, {
    key: 'createAgency',
    value: function createAgency(fields, params) {
      return this.createEdge('/agencies', fields, params, OfflineConversionDataSet);
    }
  }, {
    key: 'getAudiences',
    value: function getAudiences(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(CustomAudience, fields, params, fetchFirstPage, '/audiences');
    }
  }, {
    key: 'getCustomConversions',
    value: function getCustomConversions(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(CustomConversion, fields, params, fetchFirstPage, '/customconversions');
    }
  }, {
    key: 'createEvent',
    value: function createEvent(fields, params) {
      return this.createEdge('/events', fields, params);
    }
  }, {
    key: 'getStats',
    value: function getStats(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/stats');
    }
  }, {
    key: 'getUploads',
    value: function getUploads(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/uploads');
    }
  }, {
    key: 'createUpload',
    value: function createUpload(fields, params) {
      return this.createEdge('/uploads', fields, params);
    }
  }, {
    key: 'createUser',
    value: function createUser(fields, params) {
      return this.createEdge('/users', fields, params, OfflineConversionDataSet);
    }
  }, {
    key: 'createValidate',
    value: function createValidate(fields, params) {
      return this.createEdge('/validate', fields, params, OfflineConversionDataSet);
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(OfflineConversionDataSet.prototype.__proto__ || Object.getPrototypeOf(OfflineConversionDataSet.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(OfflineConversionDataSet.prototype.__proto__ || Object.getPrototypeOf(OfflineConversionDataSet.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        business: 'business',
        config: 'config',
        creation_time: 'creation_time',
        description: 'description',
        duplicate_entries: 'duplicate_entries',
        enable_auto_assign_to_accounts: 'enable_auto_assign_to_accounts',
        event_stats: 'event_stats',
        event_time_max: 'event_time_max',
        event_time_min: 'event_time_min',
        id: 'id',
        is_mta_use: 'is_mta_use',
        is_restricted_use: 'is_restricted_use',
        last_upload_app: 'last_upload_app',
        last_upload_app_changed_time: 'last_upload_app_changed_time',
        match_rate_approx: 'match_rate_approx',
        matched_entries: 'matched_entries',
        name: 'name',
        usage: 'usage',
        valid_entries: 'valid_entries'
      });
    }
  }, {
    key: 'PermittedRoles',
    get: function get() {
      return Object.freeze({
        admin: 'ADMIN',
        advertiser: 'ADVERTISER',
        uploader: 'UPLOADER'
      });
    }
  }, {
    key: 'RelationshipType',
    get: function get() {
      return Object.freeze({
        ad_manager: 'AD_MANAGER',
        agency: 'AGENCY',
        audience_manager: 'AUDIENCE_MANAGER',
        other: 'OTHER'
      });
    }
  }]);
  return OfflineConversionDataSet;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * OfflineTermsOfService
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var OfflineTermsOfService = function (_AbstractCrudObject) {
  inherits(OfflineTermsOfService, _AbstractCrudObject);

  function OfflineTermsOfService() {
    classCallCheck(this, OfflineTermsOfService);
    return possibleConstructorReturn(this, (OfflineTermsOfService.__proto__ || Object.getPrototypeOf(OfflineTermsOfService)).apply(this, arguments));
  }

  createClass(OfflineTermsOfService, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        accept_time: 'accept_time',
        id: 'id',
        signed_by_user: 'signed_by_user'
      });
    }
  }]);
  return OfflineTermsOfService;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * BusinessAdAccountRequest
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var BusinessAdAccountRequest = function (_AbstractCrudObject) {
  inherits(BusinessAdAccountRequest, _AbstractCrudObject);

  function BusinessAdAccountRequest() {
    classCallCheck(this, BusinessAdAccountRequest);
    return possibleConstructorReturn(this, (BusinessAdAccountRequest.__proto__ || Object.getPrototypeOf(BusinessAdAccountRequest)).apply(this, arguments));
  }

  createClass(BusinessAdAccountRequest, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        ad_account: 'ad_account',
        id: 'id'
      });
    }
  }]);
  return BusinessAdAccountRequest;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * BusinessApplicationRequest
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var BusinessApplicationRequest = function (_AbstractCrudObject) {
  inherits(BusinessApplicationRequest, _AbstractCrudObject);

  function BusinessApplicationRequest() {
    classCallCheck(this, BusinessApplicationRequest);
    return possibleConstructorReturn(this, (BusinessApplicationRequest.__proto__ || Object.getPrototypeOf(BusinessApplicationRequest)).apply(this, arguments));
  }

  createClass(BusinessApplicationRequest, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        application: 'application',
        id: 'id'
      });
    }
  }]);
  return BusinessApplicationRequest;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * BusinessPageRequest
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var BusinessPageRequest = function (_AbstractCrudObject) {
  inherits(BusinessPageRequest, _AbstractCrudObject);

  function BusinessPageRequest() {
    classCallCheck(this, BusinessPageRequest);
    return possibleConstructorReturn(this, (BusinessPageRequest.__proto__ || Object.getPrototypeOf(BusinessPageRequest)).apply(this, arguments));
  }

  createClass(BusinessPageRequest, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        id: 'id',
        page: 'page'
      });
    }
  }]);
  return BusinessPageRequest;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * BusinessRoleRequest
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var BusinessRoleRequest = function (_AbstractCrudObject) {
  inherits(BusinessRoleRequest, _AbstractCrudObject);

  function BusinessRoleRequest() {
    classCallCheck(this, BusinessRoleRequest);
    return possibleConstructorReturn(this, (BusinessRoleRequest.__proto__ || Object.getPrototypeOf(BusinessRoleRequest)).apply(this, arguments));
  }

  createClass(BusinessRoleRequest, [{
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(BusinessRoleRequest.prototype.__proto__ || Object.getPrototypeOf(BusinessRoleRequest.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(BusinessRoleRequest.prototype.__proto__ || Object.getPrototypeOf(BusinessRoleRequest.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        created_by: 'created_by',
        created_time: 'created_time',
        email: 'email',
        expiration_time: 'expiration_time',
        expiry_time: 'expiry_time',
        finance_role: 'finance_role',
        id: 'id',
        invite_link: 'invite_link',
        ip_role: 'ip_role',
        owner: 'owner',
        role: 'role',
        status: 'status',
        updated_by: 'updated_by',
        updated_time: 'updated_time'
      });
    }
  }, {
    key: 'Role',
    get: function get() {
      return Object.freeze({
        admin: 'ADMIN',
        ads_rights_reviewer: 'ADS_RIGHTS_REVIEWER',
        employee: 'EMPLOYEE',
        finance_analyst: 'FINANCE_ANALYST',
        finance_editor: 'FINANCE_EDITOR'
      });
    }
  }]);
  return BusinessRoleRequest;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AudiencePermission
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AudiencePermission = function (_AbstractCrudObject) {
  inherits(AudiencePermission, _AbstractCrudObject);

  function AudiencePermission() {
    classCallCheck(this, AudiencePermission);
    return possibleConstructorReturn(this, (AudiencePermission.__proto__ || Object.getPrototypeOf(AudiencePermission)).apply(this, arguments));
  }

  createClass(AudiencePermission, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        audience: 'audience',
        share_account_id: 'share_account_id',
        share_account_name: 'share_account_name'
      });
    }
  }]);
  return AudiencePermission;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * BusinessOwnedObjectOnBehalfOfRequest
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var BusinessOwnedObjectOnBehalfOfRequest = function (_AbstractCrudObject) {
  inherits(BusinessOwnedObjectOnBehalfOfRequest, _AbstractCrudObject);

  function BusinessOwnedObjectOnBehalfOfRequest() {
    classCallCheck(this, BusinessOwnedObjectOnBehalfOfRequest);
    return possibleConstructorReturn(this, (BusinessOwnedObjectOnBehalfOfRequest.__proto__ || Object.getPrototypeOf(BusinessOwnedObjectOnBehalfOfRequest)).apply(this, arguments));
  }

  createClass(BusinessOwnedObjectOnBehalfOfRequest, [{
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(BusinessOwnedObjectOnBehalfOfRequest.prototype.__proto__ || Object.getPrototypeOf(BusinessOwnedObjectOnBehalfOfRequest.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        business_owned_object: 'business_owned_object',
        id: 'id',
        receiving_business: 'receiving_business',
        requesting_business: 'requesting_business',
        status: 'status'
      });
    }
  }, {
    key: 'Status',
    get: function get() {
      return Object.freeze({
        approve: 'APPROVE',
        decline: 'DECLINE',
        expired: 'EXPIRED',
        in_progress: 'IN_PROGRESS'
      });
    }
  }]);
  return BusinessOwnedObjectOnBehalfOfRequest;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * SystemUser
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var SystemUser = function (_AbstractCrudObject) {
  inherits(SystemUser, _AbstractCrudObject);

  function SystemUser() {
    classCallCheck(this, SystemUser);
    return possibleConstructorReturn(this, (SystemUser.__proto__ || Object.getPrototypeOf(SystemUser)).apply(this, arguments));
  }

  createClass(SystemUser, [{
    key: 'getAssignedAdAccounts',
    value: function getAssignedAdAccounts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAccount, fields, params, fetchFirstPage, '/assigned_ad_accounts');
    }
  }, {
    key: 'getAssignedPages',
    value: function getAssignedPages(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Page, fields, params, fetchFirstPage, '/assigned_pages');
    }
  }, {
    key: 'getAssignedProductCatalogs',
    value: function getAssignedProductCatalogs(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProductCatalog, fields, params, fetchFirstPage, '/assigned_product_catalogs');
    }
  }, {
    key: 'getUpdatedBy',
    value: function getUpdatedBy(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(User, fields, params, fetchFirstPage, '/updated_by');
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        created_by: 'created_by',
        created_time: 'created_time',
        finance_permission: 'finance_permission',
        id: 'id',
        ip_permission: 'ip_permission',
        name: 'name'
      });
    }
  }, {
    key: 'Role',
    get: function get() {
      return Object.freeze({
        admin: 'ADMIN',
        ads_rights_reviewer: 'ADS_RIGHTS_REVIEWER',
        employee: 'EMPLOYEE',
        finance_analyst: 'FINANCE_ANALYST',
        finance_editor: 'FINANCE_EDITOR'
      });
    }
  }]);
  return SystemUser;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ThirdPartyMeasurementReportDataset
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ThirdPartyMeasurementReportDataset = function (_AbstractCrudObject) {
  inherits(ThirdPartyMeasurementReportDataset, _AbstractCrudObject);

  function ThirdPartyMeasurementReportDataset() {
    classCallCheck(this, ThirdPartyMeasurementReportDataset);
    return possibleConstructorReturn(this, (ThirdPartyMeasurementReportDataset.__proto__ || Object.getPrototypeOf(ThirdPartyMeasurementReportDataset)).apply(this, arguments));
  }

  createClass(ThirdPartyMeasurementReportDataset, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        category: 'category',
        id: 'id',
        partner: 'partner',
        product: 'product',
        schema: 'schema'
      });
    }
  }, {
    key: 'Category',
    get: function get() {
      return Object.freeze({
        mta: 'MTA'
      });
    }
  }, {
    key: 'Product',
    get: function get() {
      return Object.freeze({
        custom: 'CUSTOM',
        mta: 'MTA',
        viewability: 'VIEWABILITY'
      });
    }
  }]);
  return ThirdPartyMeasurementReportDataset;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * MeasurementUploadEvent
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var MeasurementUploadEvent = function (_AbstractCrudObject) {
  inherits(MeasurementUploadEvent, _AbstractCrudObject);

  function MeasurementUploadEvent() {
    classCallCheck(this, MeasurementUploadEvent);
    return possibleConstructorReturn(this, (MeasurementUploadEvent.__proto__ || Object.getPrototypeOf(MeasurementUploadEvent)).apply(this, arguments));
  }

  createClass(MeasurementUploadEvent, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(MeasurementUploadEvent.prototype.__proto__ || Object.getPrototypeOf(MeasurementUploadEvent.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        aggregation_level: 'aggregation_level',
        conversion_end_date: 'conversion_end_date',
        conversion_start_date: 'conversion_start_date',
        event_status: 'event_status',
        id: 'id',
        lookback_window: 'lookback_window',
        match_universe: 'match_universe',
        partner: 'partner',
        timezone: 'timezone',
        upload_tag: 'upload_tag'
      });
    }
  }, {
    key: 'AggregationLevel',
    get: function get() {
      return Object.freeze({
        daily: 'DAILY',
        none: 'NONE',
        weekly: 'WEEKLY'
      });
    }
  }, {
    key: 'EventStatus',
    get: function get() {
      return Object.freeze({
        cancelcompleted: 'CANCELCOMPLETED',
        canceled: 'CANCELED',
        completed: 'COMPLETED',
        failed: 'FAILED',
        started: 'STARTED',
        uploaded: 'UPLOADED'
      });
    }
  }, {
    key: 'LookbackWindow',
    get: function get() {
      return Object.freeze({
        days30: 'DAYS30',
        days45: 'DAYS45',
        days60: 'DAYS60',
        days90: 'DAYS90'
      });
    }
  }, {
    key: 'MatchUniverse',
    get: function get() {
      return Object.freeze({
        full: 'FULL',
        pii: 'PII',
        pixel: 'PIXEL'
      });
    }
  }, {
    key: 'Timezone',
    get: function get() {
      return Object.freeze({
        tz_africa_accra: 'TZ_AFRICA_ACCRA',
        tz_africa_cairo: 'TZ_AFRICA_CAIRO',
        tz_africa_casablanca: 'TZ_AFRICA_CASABLANCA',
        tz_africa_johannesburg: 'TZ_AFRICA_JOHANNESBURG',
        tz_africa_lagos: 'TZ_AFRICA_LAGOS',
        tz_africa_nairobi: 'TZ_AFRICA_NAIROBI',
        tz_africa_tunis: 'TZ_AFRICA_TUNIS',
        tz_america_anchorage: 'TZ_AMERICA_ANCHORAGE',
        tz_america_argentina_buenos_aires: 'TZ_AMERICA_ARGENTINA_BUENOS_AIRES',
        tz_america_argentina_salta: 'TZ_AMERICA_ARGENTINA_SALTA',
        tz_america_argentina_san_luis: 'TZ_AMERICA_ARGENTINA_SAN_LUIS',
        tz_america_asuncion: 'TZ_AMERICA_ASUNCION',
        tz_america_atikokan: 'TZ_AMERICA_ATIKOKAN',
        tz_america_belem: 'TZ_AMERICA_BELEM',
        tz_america_blanc_sablon: 'TZ_AMERICA_BLANC_SABLON',
        tz_america_bogota: 'TZ_AMERICA_BOGOTA',
        tz_america_campo_grande: 'TZ_AMERICA_CAMPO_GRANDE',
        tz_america_caracas: 'TZ_AMERICA_CARACAS',
        tz_america_chicago: 'TZ_AMERICA_CHICAGO',
        tz_america_costa_rica: 'TZ_AMERICA_COSTA_RICA',
        tz_america_dawson: 'TZ_AMERICA_DAWSON',
        tz_america_dawson_creek: 'TZ_AMERICA_DAWSON_CREEK',
        tz_america_denver: 'TZ_AMERICA_DENVER',
        tz_america_detroit: 'TZ_AMERICA_DETROIT',
        tz_america_edmonton: 'TZ_AMERICA_EDMONTON',
        tz_america_el_salvador: 'TZ_AMERICA_EL_SALVADOR',
        tz_america_guatemala: 'TZ_AMERICA_GUATEMALA',
        tz_america_guayaquil: 'TZ_AMERICA_GUAYAQUIL',
        tz_america_halifax: 'TZ_AMERICA_HALIFAX',
        tz_america_hermosillo: 'TZ_AMERICA_HERMOSILLO',
        tz_america_iqaluit: 'TZ_AMERICA_IQALUIT',
        tz_america_jamaica: 'TZ_AMERICA_JAMAICA',
        tz_america_la_paz: 'TZ_AMERICA_LA_PAZ',
        tz_america_lima: 'TZ_AMERICA_LIMA',
        tz_america_los_angeles: 'TZ_AMERICA_LOS_ANGELES',
        tz_america_managua: 'TZ_AMERICA_MANAGUA',
        tz_america_mazatlan: 'TZ_AMERICA_MAZATLAN',
        tz_america_mexico_city: 'TZ_AMERICA_MEXICO_CITY',
        tz_america_montevideo: 'TZ_AMERICA_MONTEVIDEO',
        tz_america_nassau: 'TZ_AMERICA_NASSAU',
        tz_america_new_york: 'TZ_AMERICA_NEW_YORK',
        tz_america_noronha: 'TZ_AMERICA_NORONHA',
        tz_america_panama: 'TZ_AMERICA_PANAMA',
        tz_america_phoenix: 'TZ_AMERICA_PHOENIX',
        tz_america_port_of_spain: 'TZ_AMERICA_PORT_OF_SPAIN',
        tz_america_puerto_rico: 'TZ_AMERICA_PUERTO_RICO',
        tz_america_rainy_river: 'TZ_AMERICA_RAINY_RIVER',
        tz_america_regina: 'TZ_AMERICA_REGINA',
        tz_america_santiago: 'TZ_AMERICA_SANTIAGO',
        tz_america_santo_domingo: 'TZ_AMERICA_SANTO_DOMINGO',
        tz_america_sao_paulo: 'TZ_AMERICA_SAO_PAULO',
        tz_america_st_johns: 'TZ_AMERICA_ST_JOHNS',
        tz_america_tegucigalpa: 'TZ_AMERICA_TEGUCIGALPA',
        tz_america_tijuana: 'TZ_AMERICA_TIJUANA',
        tz_america_toronto: 'TZ_AMERICA_TORONTO',
        tz_america_vancouver: 'TZ_AMERICA_VANCOUVER',
        tz_america_winnipeg: 'TZ_AMERICA_WINNIPEG',
        tz_asia_amman: 'TZ_ASIA_AMMAN',
        tz_asia_baghdad: 'TZ_ASIA_BAGHDAD',
        tz_asia_bahrain: 'TZ_ASIA_BAHRAIN',
        tz_asia_bangkok: 'TZ_ASIA_BANGKOK',
        tz_asia_beirut: 'TZ_ASIA_BEIRUT',
        tz_asia_colombo: 'TZ_ASIA_COLOMBO',
        tz_asia_dhaka: 'TZ_ASIA_DHAKA',
        tz_asia_dubai: 'TZ_ASIA_DUBAI',
        tz_asia_gaza: 'TZ_ASIA_GAZA',
        tz_asia_hong_kong: 'TZ_ASIA_HONG_KONG',
        tz_asia_ho_chi_minh: 'TZ_ASIA_HO_CHI_MINH',
        tz_asia_irkutsk: 'TZ_ASIA_IRKUTSK',
        tz_asia_jakarta: 'TZ_ASIA_JAKARTA',
        tz_asia_jayapura: 'TZ_ASIA_JAYAPURA',
        tz_asia_jerusalem: 'TZ_ASIA_JERUSALEM',
        tz_asia_kamchatka: 'TZ_ASIA_KAMCHATKA',
        tz_asia_karachi: 'TZ_ASIA_KARACHI',
        tz_asia_kathmandu: 'TZ_ASIA_KATHMANDU',
        tz_asia_kolkata: 'TZ_ASIA_KOLKATA',
        tz_asia_krasnoyarsk: 'TZ_ASIA_KRASNOYARSK',
        tz_asia_kuala_lumpur: 'TZ_ASIA_KUALA_LUMPUR',
        tz_asia_kuwait: 'TZ_ASIA_KUWAIT',
        tz_asia_magadan: 'TZ_ASIA_MAGADAN',
        tz_asia_makassar: 'TZ_ASIA_MAKASSAR',
        tz_asia_manila: 'TZ_ASIA_MANILA',
        tz_asia_muscat: 'TZ_ASIA_MUSCAT',
        tz_asia_nicosia: 'TZ_ASIA_NICOSIA',
        tz_asia_omsk: 'TZ_ASIA_OMSK',
        tz_asia_qatar: 'TZ_ASIA_QATAR',
        tz_asia_riyadh: 'TZ_ASIA_RIYADH',
        tz_asia_seoul: 'TZ_ASIA_SEOUL',
        tz_asia_shanghai: 'TZ_ASIA_SHANGHAI',
        tz_asia_singapore: 'TZ_ASIA_SINGAPORE',
        tz_asia_taipei: 'TZ_ASIA_TAIPEI',
        tz_asia_tokyo: 'TZ_ASIA_TOKYO',
        tz_asia_vladivostok: 'TZ_ASIA_VLADIVOSTOK',
        tz_asia_yakutsk: 'TZ_ASIA_YAKUTSK',
        tz_asia_yekaterinburg: 'TZ_ASIA_YEKATERINBURG',
        tz_atlantic_azores: 'TZ_ATLANTIC_AZORES',
        tz_atlantic_canary: 'TZ_ATLANTIC_CANARY',
        tz_atlantic_reykjavik: 'TZ_ATLANTIC_REYKJAVIK',
        tz_australia_broken_hill: 'TZ_AUSTRALIA_BROKEN_HILL',
        tz_australia_melbourne: 'TZ_AUSTRALIA_MELBOURNE',
        tz_australia_perth: 'TZ_AUSTRALIA_PERTH',
        tz_australia_sydney: 'TZ_AUSTRALIA_SYDNEY',
        tz_europe_amsterdam: 'TZ_EUROPE_AMSTERDAM',
        tz_europe_athens: 'TZ_EUROPE_ATHENS',
        tz_europe_belgrade: 'TZ_EUROPE_BELGRADE',
        tz_europe_berlin: 'TZ_EUROPE_BERLIN',
        tz_europe_bratislava: 'TZ_EUROPE_BRATISLAVA',
        tz_europe_brussels: 'TZ_EUROPE_BRUSSELS',
        tz_europe_bucharest: 'TZ_EUROPE_BUCHAREST',
        tz_europe_budapest: 'TZ_EUROPE_BUDAPEST',
        tz_europe_copenhagen: 'TZ_EUROPE_COPENHAGEN',
        tz_europe_dublin: 'TZ_EUROPE_DUBLIN',
        tz_europe_helsinki: 'TZ_EUROPE_HELSINKI',
        tz_europe_istanbul: 'TZ_EUROPE_ISTANBUL',
        tz_europe_kaliningrad: 'TZ_EUROPE_KALININGRAD',
        tz_europe_kiev: 'TZ_EUROPE_KIEV',
        tz_europe_lisbon: 'TZ_EUROPE_LISBON',
        tz_europe_ljubljana: 'TZ_EUROPE_LJUBLJANA',
        tz_europe_london: 'TZ_EUROPE_LONDON',
        tz_europe_luxembourg: 'TZ_EUROPE_LUXEMBOURG',
        tz_europe_madrid: 'TZ_EUROPE_MADRID',
        tz_europe_malta: 'TZ_EUROPE_MALTA',
        tz_europe_moscow: 'TZ_EUROPE_MOSCOW',
        tz_europe_oslo: 'TZ_EUROPE_OSLO',
        tz_europe_paris: 'TZ_EUROPE_PARIS',
        tz_europe_prague: 'TZ_EUROPE_PRAGUE',
        tz_europe_riga: 'TZ_EUROPE_RIGA',
        tz_europe_rome: 'TZ_EUROPE_ROME',
        tz_europe_samara: 'TZ_EUROPE_SAMARA',
        tz_europe_sarajevo: 'TZ_EUROPE_SARAJEVO',
        tz_europe_skopje: 'TZ_EUROPE_SKOPJE',
        tz_europe_sofia: 'TZ_EUROPE_SOFIA',
        tz_europe_stockholm: 'TZ_EUROPE_STOCKHOLM',
        tz_europe_tallinn: 'TZ_EUROPE_TALLINN',
        tz_europe_vienna: 'TZ_EUROPE_VIENNA',
        tz_europe_vilnius: 'TZ_EUROPE_VILNIUS',
        tz_europe_warsaw: 'TZ_EUROPE_WARSAW',
        tz_europe_zagreb: 'TZ_EUROPE_ZAGREB',
        tz_europe_zurich: 'TZ_EUROPE_ZURICH',
        tz_indian_maldives: 'TZ_INDIAN_MALDIVES',
        tz_indian_mauritius: 'TZ_INDIAN_MAURITIUS',
        tz_num_timezones: 'TZ_NUM_TIMEZONES',
        tz_pacific_auckland: 'TZ_PACIFIC_AUCKLAND',
        tz_pacific_easter: 'TZ_PACIFIC_EASTER',
        tz_pacific_galapagos: 'TZ_PACIFIC_GALAPAGOS',
        tz_pacific_honolulu: 'TZ_PACIFIC_HONOLULU'
      });
    }
  }]);
  return MeasurementUploadEvent;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Business
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Business = function (_AbstractCrudObject) {
  inherits(Business, _AbstractCrudObject);

  function Business() {
    classCallCheck(this, Business);
    return possibleConstructorReturn(this, (Business.__proto__ || Object.getPrototypeOf(Business)).apply(this, arguments));
  }

  createClass(Business, [{
    key: 'createAccessToken',
    value: function createAccessToken(fields, params) {
      return this.createEdge('/access_token', fields, params, Business);
    }
  }, {
    key: 'getAdStudies',
    value: function getAdStudies(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdStudy, fields, params, fetchFirstPage, '/ad_studies');
    }
  }, {
    key: 'createAdStudy',
    value: function createAdStudy(fields, params) {
      return this.createEdge('/ad_studies', fields, params, AdStudy);
    }
  }, {
    key: 'createAdAccount',
    value: function createAdAccount(fields, params) {
      return this.createEdge('/adaccount', fields, params, AdAccount);
    }
  }, {
    key: 'createAdAccountCreationRequest',
    value: function createAdAccountCreationRequest(fields, params) {
      return this.createEdge('/adaccountcreationrequests', fields, params, AdAccountCreationRequest);
    }
  }, {
    key: 'deleteAdAccounts',
    value: function deleteAdAccounts(params) {
      return get$1(Business.prototype.__proto__ || Object.getPrototypeOf(Business.prototype), 'deleteEdge', this).call(this, '/adaccounts', params);
    }
  }, {
    key: 'getAdNetworkAnalytics',
    value: function getAdNetworkAnalytics(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdNetworkAnalyticsSyncQueryResult, fields, params, fetchFirstPage, '/adnetworkanalytics');
    }
  }, {
    key: 'createAdNetworkAnalytic',
    value: function createAdNetworkAnalytic(fields, params) {
      return this.createEdge('/adnetworkanalytics', fields, params, Business);
    }
  }, {
    key: 'getAdNetworkAnalyticsResults',
    value: function getAdNetworkAnalyticsResults(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdNetworkAnalyticsAsyncQueryResult, fields, params, fetchFirstPage, '/adnetworkanalytics_results');
    }
  }, {
    key: 'getAdsPixels',
    value: function getAdsPixels(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdsPixel, fields, params, fetchFirstPage, '/adspixels');
    }
  }, {
    key: 'createAdsPixel',
    value: function createAdsPixel(fields, params) {
      return this.createEdge('/adspixels', fields, params, AdsPixel);
    }
  }, {
    key: 'getAdvertisableApplications',
    value: function getAdvertisableApplications(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(BusinessAdvertisableApplicationsResult, fields, params, fetchFirstPage, '/advertisable_applications');
    }
  }, {
    key: 'deleteAgencies',
    value: function deleteAgencies(params) {
      return get$1(Business.prototype.__proto__ || Object.getPrototypeOf(Business.prototype), 'deleteEdge', this).call(this, '/agencies', params);
    }
  }, {
    key: 'getAgencies',
    value: function getAgencies(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Business, fields, params, fetchFirstPage, '/agencies');
    }
  }, {
    key: 'getAnPlacements',
    value: function getAnPlacements(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdPlacement, fields, params, fetchFirstPage, '/an_placements');
    }
  }, {
    key: 'createBlockListDraft',
    value: function createBlockListDraft(fields, params) {
      return this.createEdge('/block_list_drafts', fields, params, Business);
    }
  }, {
    key: 'getBusinessInvoices',
    value: function getBusinessInvoices(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(OracleTransaction, fields, params, fetchFirstPage, '/business_invoices');
    }
  }, {
    key: 'getBusinessUsers',
    value: function getBusinessUsers(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(BusinessUser, fields, params, fetchFirstPage, '/business_users');
    }
  }, {
    key: 'createBusinessUser',
    value: function createBusinessUser(fields, params) {
      return this.createEdge('/business_users', fields, params, BusinessUser);
    }
  }, {
    key: 'getBusinessProjects',
    value: function getBusinessProjects(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(BusinessProject, fields, params, fetchFirstPage, '/businessprojects');
    }
  }, {
    key: 'createBusinessProject',
    value: function createBusinessProject(fields, params) {
      return this.createEdge('/businessprojects', fields, params, BusinessProject);
    }
  }, {
    key: 'createCatalogSegmentProducerTo',
    value: function createCatalogSegmentProducerTo(fields, params) {
      return this.createEdge('/catalog_segment_producer_tos', fields, params, Business);
    }
  }, {
    key: 'createClaimCustomConversion',
    value: function createClaimCustomConversion(fields, params) {
      return this.createEdge('/claim_custom_conversions', fields, params, CustomConversion);
    }
  }, {
    key: 'getClientAdAccounts',
    value: function getClientAdAccounts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAccount, fields, params, fetchFirstPage, '/client_ad_accounts');
    }
  }, {
    key: 'createClientAdAccount',
    value: function createClientAdAccount(fields, params) {
      return this.createEdge('/client_ad_accounts', fields, params, Business);
    }
  }, {
    key: 'getClientApps',
    value: function getClientApps(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Application, fields, params, fetchFirstPage, '/client_apps');
    }
  }, {
    key: 'createClientApp',
    value: function createClientApp(fields, params) {
      return this.createEdge('/client_apps', fields, params, Business);
    }
  }, {
    key: 'getClientPages',
    value: function getClientPages(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Page, fields, params, fetchFirstPage, '/client_pages');
    }
  }, {
    key: 'createClientPage',
    value: function createClientPage(fields, params) {
      return this.createEdge('/client_pages', fields, params, Business);
    }
  }, {
    key: 'getClientPixels',
    value: function getClientPixels(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdsPixel, fields, params, fetchFirstPage, '/client_pixels');
    }
  }, {
    key: 'getClientProductCatalogs',
    value: function getClientProductCatalogs(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProductCatalog, fields, params, fetchFirstPage, '/client_product_catalogs');
    }
  }, {
    key: 'deleteClients',
    value: function deleteClients(params) {
      return get$1(Business.prototype.__proto__ || Object.getPrototypeOf(Business.prototype), 'deleteEdge', this).call(this, '/clients', params);
    }
  }, {
    key: 'getClients',
    value: function getClients(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Business, fields, params, fetchFirstPage, '/clients');
    }
  }, {
    key: 'getCustomConversions',
    value: function getCustomConversions(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(CustomConversion, fields, params, fetchFirstPage, '/customconversions');
    }
  }, {
    key: 'createCustomConversion',
    value: function createCustomConversion(fields, params) {
      return this.createEdge('/customconversions', fields, params, CustomConversion);
    }
  }, {
    key: 'getDealShowsPages',
    value: function getDealShowsPages(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Page, fields, params, fetchFirstPage, '/deal_shows_pages');
    }
  }, {
    key: 'getDirectDeals',
    value: function getDirectDeals(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(DirectDeal, fields, params, fetchFirstPage, '/direct_deals');
    }
  }, {
    key: 'getEventSourceGroups',
    value: function getEventSourceGroups(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(EventSourceGroup, fields, params, fetchFirstPage, '/event_source_groups');
    }
  }, {
    key: 'createEventSourceGroup',
    value: function createEventSourceGroup(fields, params) {
      return this.createEdge('/event_source_groups', fields, params, EventSourceGroup);
    }
  }, {
    key: 'getExtendedCredits',
    value: function getExtendedCredits(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ExtendedCredit, fields, params, fetchFirstPage, '/extendedcredits');
    }
  }, {
    key: 'getInitiatedAudienceSharingRequests',
    value: function getInitiatedAudienceSharingRequests(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/initiated_audience_sharing_requests');
    }
  }, {
    key: 'getInitiatedSharingAgreements',
    value: function getInitiatedSharingAgreements(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(BusinessAgreement, fields, params, fetchFirstPage, '/initiated_sharing_agreements');
    }
  }, {
    key: 'deleteInstagramAccounts',
    value: function deleteInstagramAccounts(params) {
      return get$1(Business.prototype.__proto__ || Object.getPrototypeOf(Business.prototype), 'deleteEdge', this).call(this, '/instagram_accounts', params);
    }
  }, {
    key: 'getInstagramAccounts',
    value: function getInstagramAccounts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(InstagramUser, fields, params, fetchFirstPage, '/instagram_accounts');
    }
  }, {
    key: 'createManagedBusiness',
    value: function createManagedBusiness(fields, params) {
      return this.createEdge('/managed_businesses', fields, params, Business);
    }
  }, {
    key: 'getMeasurementReports',
    value: function getMeasurementReports(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(MeasurementReport, fields, params, fetchFirstPage, '/measurement_reports');
    }
  }, {
    key: 'getOfflineConversionDataSets',
    value: function getOfflineConversionDataSets(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(OfflineConversionDataSet, fields, params, fetchFirstPage, '/offline_conversion_data_sets');
    }
  }, {
    key: 'createOfflineConversionDataSet',
    value: function createOfflineConversionDataSet(fields, params) {
      return this.createEdge('/offline_conversion_data_sets', fields, params, OfflineConversionDataSet);
    }
  }, {
    key: 'getOfflineTermsOfService',
    value: function getOfflineTermsOfService(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(OfflineTermsOfService, fields, params, fetchFirstPage, '/offline_terms_of_service');
    }
  }, {
    key: 'getOwnedAdAccounts',
    value: function getOwnedAdAccounts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAccount, fields, params, fetchFirstPage, '/owned_ad_accounts');
    }
  }, {
    key: 'createOwnedAdAccount',
    value: function createOwnedAdAccount(fields, params) {
      return this.createEdge('/owned_ad_accounts', fields, params, Business);
    }
  }, {
    key: 'getOwnedApps',
    value: function getOwnedApps(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Application, fields, params, fetchFirstPage, '/owned_apps');
    }
  }, {
    key: 'createOwnedApp',
    value: function createOwnedApp(fields, params) {
      return this.createEdge('/owned_apps', fields, params, Business);
    }
  }, {
    key: 'deleteOwnedBusinesses',
    value: function deleteOwnedBusinesses(params) {
      return get$1(Business.prototype.__proto__ || Object.getPrototypeOf(Business.prototype), 'deleteEdge', this).call(this, '/owned_businesses', params);
    }
  }, {
    key: 'getOwnedBusinesses',
    value: function getOwnedBusinesses(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Business, fields, params, fetchFirstPage, '/owned_businesses');
    }
  }, {
    key: 'createOwnedBusiness',
    value: function createOwnedBusiness(fields, params) {
      return this.createEdge('/owned_businesses', fields, params, Business);
    }
  }, {
    key: 'getOwnedDomains',
    value: function getOwnedDomains(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/owned_domains');
    }
  }, {
    key: 'createOwnedDomain',
    value: function createOwnedDomain(fields, params) {
      return this.createEdge('/owned_domains', fields, params);
    }
  }, {
    key: 'getOwnedInstagramAccounts',
    value: function getOwnedInstagramAccounts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(InstagramUser, fields, params, fetchFirstPage, '/owned_instagram_accounts');
    }
  }, {
    key: 'getOwnedPages',
    value: function getOwnedPages(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Page, fields, params, fetchFirstPage, '/owned_pages');
    }
  }, {
    key: 'createOwnedPage',
    value: function createOwnedPage(fields, params) {
      return this.createEdge('/owned_pages', fields, params, Business);
    }
  }, {
    key: 'getOwnedPixels',
    value: function getOwnedPixels(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdsPixel, fields, params, fetchFirstPage, '/owned_pixels');
    }
  }, {
    key: 'getOwnedProductCatalogs',
    value: function getOwnedProductCatalogs(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProductCatalog, fields, params, fetchFirstPage, '/owned_product_catalogs');
    }
  }, {
    key: 'createOwnedProductCatalog',
    value: function createOwnedProductCatalog(fields, params) {
      return this.createEdge('/owned_product_catalogs', fields, params, ProductCatalog);
    }
  }, {
    key: 'deletePages',
    value: function deletePages(params) {
      return get$1(Business.prototype.__proto__ || Object.getPrototypeOf(Business.prototype), 'deleteEdge', this).call(this, '/pages', params);
    }
  }, {
    key: 'getPartners',
    value: function getPartners(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Business, fields, params, fetchFirstPage, '/partners');
    }
  }, {
    key: 'getPendingClientAdAccounts',
    value: function getPendingClientAdAccounts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(BusinessAdAccountRequest, fields, params, fetchFirstPage, '/pending_client_ad_accounts');
    }
  }, {
    key: 'getPendingClientApps',
    value: function getPendingClientApps(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(BusinessApplicationRequest, fields, params, fetchFirstPage, '/pending_client_apps');
    }
  }, {
    key: 'getPendingClientPages',
    value: function getPendingClientPages(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(BusinessPageRequest, fields, params, fetchFirstPage, '/pending_client_pages');
    }
  }, {
    key: 'getPendingOfflineConversionDataSets',
    value: function getPendingOfflineConversionDataSets(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(OfflineConversionDataSet, fields, params, fetchFirstPage, '/pending_offline_conversion_data_sets');
    }
  }, {
    key: 'getPendingOwnedAdAccounts',
    value: function getPendingOwnedAdAccounts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(BusinessAdAccountRequest, fields, params, fetchFirstPage, '/pending_owned_ad_accounts');
    }
  }, {
    key: 'getPendingOwnedPages',
    value: function getPendingOwnedPages(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(BusinessPageRequest, fields, params, fetchFirstPage, '/pending_owned_pages');
    }
  }, {
    key: 'getPendingSharedPixels',
    value: function getPendingSharedPixels(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdsPixel, fields, params, fetchFirstPage, '/pending_shared_pixels');
    }
  }, {
    key: 'getPendingUsers',
    value: function getPendingUsers(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(BusinessRoleRequest, fields, params, fetchFirstPage, '/pending_users');
    }
  }, {
    key: 'getPicture',
    value: function getPicture(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ProfilePictureSource, fields, params, fetchFirstPage, '/picture');
    }
  }, {
    key: 'getReceivedAudiencePermissions',
    value: function getReceivedAudiencePermissions(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AudiencePermission, fields, params, fetchFirstPage, '/received_audience_permissions');
    }
  }, {
    key: 'getReceivedAudienceSharingRequests',
    value: function getReceivedAudienceSharingRequests(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/received_audience_sharing_requests');
    }
  }, {
    key: 'getReceivedInprogressOnBehalfRequests',
    value: function getReceivedInprogressOnBehalfRequests(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(BusinessOwnedObjectOnBehalfOfRequest, fields, params, fetchFirstPage, '/received_inprogress_onbehalf_requests');
    }
  }, {
    key: 'getReceivedSharingAgreements',
    value: function getReceivedSharingAgreements(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(BusinessAgreement, fields, params, fetchFirstPage, '/received_sharing_agreements');
    }
  }, {
    key: 'getSentInprogressOnBehalfRequests',
    value: function getSentInprogressOnBehalfRequests(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(BusinessOwnedObjectOnBehalfOfRequest, fields, params, fetchFirstPage, '/sent_inprogress_onbehalf_requests');
    }
  }, {
    key: 'createSentInprogressOnBehalfRequest',
    value: function createSentInprogressOnBehalfRequest(fields, params) {
      return this.createEdge('/sent_inprogress_onbehalf_requests', fields, params, BusinessOwnedObjectOnBehalfOfRequest);
    }
  }, {
    key: 'getSharedAudiencePermissions',
    value: function getSharedAudiencePermissions(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AudiencePermission, fields, params, fetchFirstPage, '/shared_audience_permissions');
    }
  }, {
    key: 'getSystemUsers',
    value: function getSystemUsers(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(SystemUser, fields, params, fetchFirstPage, '/system_users');
    }
  }, {
    key: 'createSystemUser',
    value: function createSystemUser(fields, params) {
      return this.createEdge('/system_users', fields, params, SystemUser);
    }
  }, {
    key: 'getThirdPartyMeasurementReportDataset',
    value: function getThirdPartyMeasurementReportDataset(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ThirdPartyMeasurementReportDataset, fields, params, fetchFirstPage, '/third_party_measurement_report_dataset');
    }
  }, {
    key: 'createThirdPartyMeasurementReportDataset',
    value: function createThirdPartyMeasurementReportDataset(fields, params) {
      return this.createEdge('/third_party_measurement_report_dataset', fields, params, ThirdPartyMeasurementReportDataset);
    }
  }, {
    key: 'createUploadEvent',
    value: function createUploadEvent(fields, params) {
      return this.createEdge('/upload_event', fields, params, MeasurementUploadEvent);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(Business.prototype.__proto__ || Object.getPrototypeOf(Business.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        block_offline_analytics: 'block_offline_analytics',
        created_by: 'created_by',
        created_time: 'created_time',
        extended_updated_time: 'extended_updated_time',
        id: 'id',
        is_hidden: 'is_hidden',
        is_instagram_enabled_in_fb_analytics: 'is_instagram_enabled_in_fb_analytics',
        link: 'link',
        name: 'name',
        payment_account_id: 'payment_account_id',
        primary_page: 'primary_page',
        profile_picture_uri: 'profile_picture_uri',
        timezone_id: 'timezone_id',
        two_factor_type: 'two_factor_type',
        updated_by: 'updated_by',
        updated_time: 'updated_time',
        verification_status: 'verification_status',
        vertical: 'vertical',
        vertical_id: 'vertical_id'
      });
    }
  }, {
    key: 'TwoFactorType',
    get: function get() {
      return Object.freeze({
        admin_required: 'admin_required',
        all_required: 'all_required',
        none: 'none'
      });
    }
  }, {
    key: 'Vertical',
    get: function get() {
      return Object.freeze({
        advertising: 'ADVERTISING',
        automotive: 'AUTOMOTIVE',
        consumer_packaged_goods: 'CONSUMER_PACKAGED_GOODS',
        ecommerce: 'ECOMMERCE',
        education: 'EDUCATION',
        energy_and_utilities: 'ENERGY_AND_UTILITIES',
        entertainment_and_media: 'ENTERTAINMENT_AND_MEDIA',
        financial_services: 'FINANCIAL_SERVICES',
        gaming: 'GAMING',
        government_and_politics: 'GOVERNMENT_AND_POLITICS',
        health: 'HEALTH',
        luxury: 'LUXURY',
        marketing: 'MARKETING',
        non_profit: 'NON_PROFIT',
        organizations_and_associations: 'ORGANIZATIONS_AND_ASSOCIATIONS',
        other: 'OTHER',
        professional_services: 'PROFESSIONAL_SERVICES',
        restaurant: 'RESTAURANT',
        retail: 'RETAIL',
        technology: 'TECHNOLOGY',
        telecom: 'TELECOM',
        travel: 'TRAVEL'
      });
    }
  }, {
    key: 'PermittedTasks',
    get: function get() {
      return Object.freeze({
        advertise: 'ADVERTISE',
        analyze: 'ANALYZE',
        manage: 'MANAGE'
      });
    }
  }, {
    key: 'SurveyBusinessType',
    get: function get() {
      return Object.freeze({
        advertiser: 'ADVERTISER',
        agency: 'AGENCY',
        app_developer: 'APP_DEVELOPER',
        publisher: 'PUBLISHER'
      });
    }
  }, {
    key: 'PagePermittedTasks',
    get: function get() {
      return Object.freeze({
        advertise: 'ADVERTISE',
        analyze: 'ANALYZE',
        create_content: 'CREATE_CONTENT',
        manage: 'MANAGE',
        manage_jobs: 'MANAGE_JOBS',
        moderate: 'MODERATE',
        moderate_community: 'MODERATE_COMMUNITY',
        pages_messaging: 'PAGES_MESSAGING',
        pages_messaging_subscriptions: 'PAGES_MESSAGING_SUBSCRIPTIONS',
        read_page_mailboxes: 'READ_PAGE_MAILBOXES',
        view_monetization_insights: 'VIEW_MONETIZATION_INSIGHTS'
      });
    }
  }]);
  return Business;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdsPixelStatsResult
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdsPixelStatsResult = function (_AbstractCrudObject) {
  inherits(AdsPixelStatsResult, _AbstractCrudObject);

  function AdsPixelStatsResult() {
    classCallCheck(this, AdsPixelStatsResult);
    return possibleConstructorReturn(this, (AdsPixelStatsResult.__proto__ || Object.getPrototypeOf(AdsPixelStatsResult)).apply(this, arguments));
  }

  createClass(AdsPixelStatsResult, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        aggregation: 'aggregation',
        data: 'data',
        start_time: 'start_time'
      });
    }
  }, {
    key: 'Aggregation',
    get: function get() {
      return Object.freeze({
        browser_type: 'browser_type',
        custom_data_field: 'custom_data_field',
        device_os: 'device_os',
        device_type: 'device_type',
        event: 'event',
        event_detection_method: 'event_detection_method',
        event_processing_results: 'event_processing_results',
        event_source: 'event_source',
        event_total_counts: 'event_total_counts',
        event_value_count: 'event_value_count',
        host: 'host',
        people_reached: 'people_reached',
        pii_keys: 'pii_keys',
        pii_lift: 'pii_lift',
        pixel_fire: 'pixel_fire',
        url: 'url',
        url_by_rule: 'url_by_rule'
      });
    }
  }]);
  return AdsPixelStatsResult;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdsPixel
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdsPixel = function (_AbstractCrudObject) {
  inherits(AdsPixel, _AbstractCrudObject);

  function AdsPixel() {
    classCallCheck(this, AdsPixel);
    return possibleConstructorReturn(this, (AdsPixel.__proto__ || Object.getPrototypeOf(AdsPixel)).apply(this, arguments));
  }

  createClass(AdsPixel, [{
    key: 'deleteAssignedUsers',
    value: function deleteAssignedUsers(params) {
      return get$1(AdsPixel.prototype.__proto__ || Object.getPrototypeOf(AdsPixel.prototype), 'deleteEdge', this).call(this, '/assigned_users', params);
    }
  }, {
    key: 'getAssignedUsers',
    value: function getAssignedUsers(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AssignedUser, fields, params, fetchFirstPage, '/assigned_users');
    }
  }, {
    key: 'createAssignedUser',
    value: function createAssignedUser(fields, params) {
      return this.createEdge('/assigned_users', fields, params, AdsPixel);
    }
  }, {
    key: 'getAudiences',
    value: function getAudiences(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(CustomAudience, fields, params, fetchFirstPage, '/audiences');
    }
  }, {
    key: 'getDaChecks',
    value: function getDaChecks(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(DACheck, fields, params, fetchFirstPage, '/da_checks');
    }
  }, {
    key: 'deleteSharedAccounts',
    value: function deleteSharedAccounts(params) {
      return get$1(AdsPixel.prototype.__proto__ || Object.getPrototypeOf(AdsPixel.prototype), 'deleteEdge', this).call(this, '/shared_accounts', params);
    }
  }, {
    key: 'getSharedAccounts',
    value: function getSharedAccounts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAccount, fields, params, fetchFirstPage, '/shared_accounts');
    }
  }, {
    key: 'createSharedAccount',
    value: function createSharedAccount(fields, params) {
      return this.createEdge('/shared_accounts', fields, params, AdsPixel);
    }
  }, {
    key: 'getSharedAgencies',
    value: function getSharedAgencies(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Business, fields, params, fetchFirstPage, '/shared_agencies');
    }
  }, {
    key: 'getStats',
    value: function getStats(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdsPixelStatsResult, fields, params, fetchFirstPage, '/stats');
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(AdsPixel.prototype.__proto__ || Object.getPrototypeOf(AdsPixel.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        automatic_matching_fields: 'automatic_matching_fields',
        can_proxy: 'can_proxy',
        code: 'code',
        creation_time: 'creation_time',
        creator: 'creator',
        data_use_setting: 'data_use_setting',
        enable_automatic_matching: 'enable_automatic_matching',
        first_party_cookie_status: 'first_party_cookie_status',
        id: 'id',
        is_created_by_business: 'is_created_by_business',
        last_fired_time: 'last_fired_time',
        name: 'name',
        owner_ad_account: 'owner_ad_account',
        owner_business: 'owner_business'
      });
    }
  }, {
    key: 'SortBy',
    get: function get() {
      return Object.freeze({
        last_fired_time: 'LAST_FIRED_TIME',
        name: 'NAME'
      });
    }
  }, {
    key: 'AutomaticMatchingFields',
    get: function get() {
      return Object.freeze({
        ct: 'ct',
        em: 'em',
        fn: 'fn',
        ge: 'ge',
        ln: 'ln',
        ph: 'ph',
        st: 'st',
        zp: 'zp'
      });
    }
  }, {
    key: 'DataUseSetting',
    get: function get() {
      return Object.freeze({
        advertising_and_analytics: 'ADVERTISING_AND_ANALYTICS',
        analytics_only: 'ANALYTICS_ONLY',
        empty: 'EMPTY'
      });
    }
  }, {
    key: 'FirstPartyCookieStatus',
    get: function get() {
      return Object.freeze({
        empty: 'EMPTY',
        first_party_cookie_disabled: 'FIRST_PARTY_COOKIE_DISABLED',
        first_party_cookie_enabled: 'FIRST_PARTY_COOKIE_ENABLED'
      });
    }
  }, {
    key: 'Tasks',
    get: function get() {
      return Object.freeze({
        analyze: 'ANALYZE',
        edit: 'EDIT'
      });
    }
  }]);
  return AdsPixel;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * OffsitePixel
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var OffsitePixel = function (_AbstractCrudObject) {
  inherits(OffsitePixel, _AbstractCrudObject);

  function OffsitePixel() {
    classCallCheck(this, OffsitePixel);
    return possibleConstructorReturn(this, (OffsitePixel.__proto__ || Object.getPrototypeOf(OffsitePixel)).apply(this, arguments));
  }

  createClass(OffsitePixel, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        creator: 'creator',
        id: 'id',
        js_pixel: 'js_pixel',
        last_firing_time: 'last_firing_time',
        name: 'name',
        tag: 'tag'
      });
    }
  }]);
  return OffsitePixel;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdStudyObjective
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdStudyObjective = function (_AbstractCrudObject) {
  inherits(AdStudyObjective, _AbstractCrudObject);

  function AdStudyObjective() {
    classCallCheck(this, AdStudyObjective);
    return possibleConstructorReturn(this, (AdStudyObjective.__proto__ || Object.getPrototypeOf(AdStudyObjective)).apply(this, arguments));
  }

  createClass(AdStudyObjective, [{
    key: 'getAdPlacePageSets',
    value: function getAdPlacePageSets(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdPlacePageSet, fields, params, fetchFirstPage, '/ad_place_page_sets');
    }
  }, {
    key: 'getAdsPixels',
    value: function getAdsPixels(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdsPixel, fields, params, fetchFirstPage, '/adspixels');
    }
  }, {
    key: 'getApplications',
    value: function getApplications(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Application, fields, params, fetchFirstPage, '/applications');
    }
  }, {
    key: 'getCustomConversions',
    value: function getCustomConversions(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(CustomConversion, fields, params, fetchFirstPage, '/customconversions');
    }
  }, {
    key: 'getOfflineConversionDataSets',
    value: function getOfflineConversionDataSets(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(OfflineConversionDataSet, fields, params, fetchFirstPage, '/offline_conversion_data_sets');
    }
  }, {
    key: 'getOffsitePixels',
    value: function getOffsitePixels(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(OffsitePixel, fields, params, fetchFirstPage, '/offsitepixels');
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(AdStudyObjective.prototype.__proto__ || Object.getPrototypeOf(AdStudyObjective.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(AdStudyObjective.prototype.__proto__ || Object.getPrototypeOf(AdStudyObjective.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        custom_attributes: 'custom_attributes',
        id: 'id',
        is_primary: 'is_primary',
        last_updated_results: 'last_updated_results',
        name: 'name',
        results: 'results',
        type: 'type'
      });
    }
  }, {
    key: 'Type',
    get: function get() {
      return Object.freeze({
        brand: 'BRAND',
        brandlift: 'BRANDLIFT',
        ftl: 'FTL',
        mae: 'MAE',
        mai: 'MAI',
        nonsales: 'NONSALES',
        partner: 'PARTNER',
        sales: 'SALES',
        telco: 'TELCO'
      });
    }
  }]);
  return AdStudyObjective;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdStudy
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdStudy = function (_AbstractCrudObject) {
  inherits(AdStudy, _AbstractCrudObject);

  function AdStudy() {
    classCallCheck(this, AdStudy);
    return possibleConstructorReturn(this, (AdStudy.__proto__ || Object.getPrototypeOf(AdStudy)).apply(this, arguments));
  }

  createClass(AdStudy, [{
    key: 'getCells',
    value: function getCells(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdStudyCell, fields, params, fetchFirstPage, '/cells');
    }
  }, {
    key: 'createCustomAudience',
    value: function createCustomAudience(fields, params) {
      return this.createEdge('/customaudiences', fields, params, AdStudy);
    }
  }, {
    key: 'getHealthCheckErrors',
    value: function getHealthCheckErrors(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdsTALHealthCheckError, fields, params, fetchFirstPage, '/health_check_errors');
    }
  }, {
    key: 'getObjectives',
    value: function getObjectives(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdStudyObjective, fields, params, fetchFirstPage, '/objectives');
    }
  }, {
    key: 'createObjective',
    value: function createObjective(fields, params) {
      return this.createEdge('/objectives', fields, params, AdStudyObjective);
    }
  }, {
    key: 'getViewers',
    value: function getViewers(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(User, fields, params, fetchFirstPage, '/viewers');
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(AdStudy.prototype.__proto__ || Object.getPrototypeOf(AdStudy.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(AdStudy.prototype.__proto__ || Object.getPrototypeOf(AdStudy.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        business: 'business',
        canceled_time: 'canceled_time',
        cooldown_start_time: 'cooldown_start_time',
        created_by: 'created_by',
        created_time: 'created_time',
        description: 'description',
        end_time: 'end_time',
        id: 'id',
        name: 'name',
        observation_end_time: 'observation_end_time',
        results_first_available_date: 'results_first_available_date',
        start_time: 'start_time',
        type: 'type',
        updated_by: 'updated_by',
        updated_time: 'updated_time'
      });
    }
  }, {
    key: 'AudienceType',
    get: function get() {
      return Object.freeze({
        most_responsive: 'MOST_RESPONSIVE',
        not_most_responsive: 'NOT_MOST_RESPONSIVE'
      });
    }
  }, {
    key: 'Type',
    get: function get() {
      return Object.freeze({
        continuous_lift_config: 'CONTINUOUS_LIFT_CONFIG',
        lift: 'LIFT',
        split_test: 'SPLIT_TEST'
      });
    }
  }]);
  return AdStudy;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdContract
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdContract = function (_AbstractCrudObject) {
  inherits(AdContract, _AbstractCrudObject);

  function AdContract() {
    classCallCheck(this, AdContract);
    return possibleConstructorReturn(this, (AdContract.__proto__ || Object.getPrototypeOf(AdContract)).apply(this, arguments));
  }

  createClass(AdContract, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        account_mgr_fbid: 'account_mgr_fbid',
        account_mgr_name: 'account_mgr_name',
        adops_person_name: 'adops_person_name',
        advertiser_address_fbid: 'advertiser_address_fbid',
        advertiser_fbid: 'advertiser_fbid',
        advertiser_name: 'advertiser_name',
        agency_discount: 'agency_discount',
        agency_name: 'agency_name',
        bill_to_address_fbid: 'bill_to_address_fbid',
        bill_to_fbid: 'bill_to_fbid',
        campaign_name: 'campaign_name',
        created_by: 'created_by',
        created_date: 'created_date',
        customer_io: 'customer_io',
        io_number: 'io_number',
        io_terms: 'io_terms',
        io_type: 'io_type',
        last_updated_by: 'last_updated_by',
        last_updated_date: 'last_updated_date',
        max_end_date: 'max_end_date',
        mdc_fbid: 'mdc_fbid',
        media_plan_number: 'media_plan_number',
        min_start_date: 'min_start_date',
        msa_contract: 'msa_contract',
        payment_terms: 'payment_terms',
        rev_hold_flag: 'rev_hold_flag',
        rev_hold_released_by: 'rev_hold_released_by',
        rev_hold_released_on: 'rev_hold_released_on',
        salesrep_fbid: 'salesrep_fbid',
        salesrep_name: 'salesrep_name',
        sold_to_address_fbid: 'sold_to_address_fbid',
        sold_to_fbid: 'sold_to_fbid',
        status: 'status',
        subvertical: 'subvertical',
        thirdparty_billed: 'thirdparty_billed',
        thirdparty_password: 'thirdparty_password',
        thirdparty_uid: 'thirdparty_uid',
        thirdparty_url: 'thirdparty_url',
        vat_country: 'vat_country',
        version: 'version',
        vertical: 'vertical'
      });
    }
  }]);
  return AdContract;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdImage
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdImage = function (_AbstractCrudObject) {
  inherits(AdImage, _AbstractCrudObject);

  function AdImage() {
    classCallCheck(this, AdImage);
    return possibleConstructorReturn(this, (AdImage.__proto__ || Object.getPrototypeOf(AdImage)).apply(this, arguments));
  }

  createClass(AdImage, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        created_time: 'created_time',
        creatives: 'creatives',
        hash: 'hash',
        height: 'height',
        id: 'id',
        is_associated_creatives_in_adgroups: 'is_associated_creatives_in_adgroups',
        name: 'name',
        original_height: 'original_height',
        original_width: 'original_width',
        permalink_url: 'permalink_url',
        status: 'status',
        updated_time: 'updated_time',
        url: 'url',
        url_128: 'url_128',
        width: 'width'
      });
    }
  }, {
    key: 'Status',
    get: function get() {
      return Object.freeze({
        active: 'ACTIVE',
        deleted: 'DELETED'
      });
    }
  }]);
  return AdImage;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdLabel
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdLabel = function (_AbstractCrudObject) {
  inherits(AdLabel, _AbstractCrudObject);

  function AdLabel() {
    classCallCheck(this, AdLabel);
    return possibleConstructorReturn(this, (AdLabel.__proto__ || Object.getPrototypeOf(AdLabel)).apply(this, arguments));
  }

  createClass(AdLabel, [{
    key: 'getAdCreatives',
    value: function getAdCreatives(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdCreative, fields, params, fetchFirstPage, '/adcreatives');
    }
  }, {
    key: 'getAds',
    value: function getAds(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Ad, fields, params, fetchFirstPage, '/ads');
    }
  }, {
    key: 'getAdSets',
    value: function getAdSets(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdSet, fields, params, fetchFirstPage, '/adsets');
    }
  }, {
    key: 'getCampaigns',
    value: function getCampaigns(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Campaign, fields, params, fetchFirstPage, '/campaigns');
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(AdLabel.prototype.__proto__ || Object.getPrototypeOf(AdLabel.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(AdLabel.prototype.__proto__ || Object.getPrototypeOf(AdLabel.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        account: 'account',
        created_time: 'created_time',
        id: 'id',
        name: 'name',
        updated_time: 'updated_time'
      });
    }
  }]);
  return AdLabel;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * PlayableContent
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var PlayableContent = function (_AbstractCrudObject) {
  inherits(PlayableContent, _AbstractCrudObject);

  function PlayableContent() {
    classCallCheck(this, PlayableContent);
    return possibleConstructorReturn(this, (PlayableContent.__proto__ || Object.getPrototypeOf(PlayableContent)).apply(this, arguments));
  }

  createClass(PlayableContent, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        id: 'id',
        name: 'name',
        owner: 'owner'
      });
    }
  }]);
  return PlayableContent;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdReportSpec
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdReportSpec = function (_AbstractCrudObject) {
  inherits(AdReportSpec, _AbstractCrudObject);

  function AdReportSpec() {
    classCallCheck(this, AdReportSpec);
    return possibleConstructorReturn(this, (AdReportSpec.__proto__ || Object.getPrototypeOf(AdReportSpec)).apply(this, arguments));
  }

  createClass(AdReportSpec, [{
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(AdReportSpec.prototype.__proto__ || Object.getPrototypeOf(AdReportSpec.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(AdReportSpec.prototype.__proto__ || Object.getPrototypeOf(AdReportSpec.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        actions_group_by: 'actions_group_by',
        creation_source: 'creation_source',
        data_columns: 'data_columns',
        date_preset: 'date_preset',
        export_columns: 'export_columns',
        filters: 'filters',
        format_version: 'format_version',
        id: 'id',
        insights_section: 'insights_section',
        name: 'name',
        report_schedule: 'report_schedule',
        report_schedule_id: 'report_schedule_id',
        sort_by: 'sort_by',
        sort_dir: 'sort_dir',
        time_increment: 'time_increment',
        time_interval: 'time_interval',
        time_ranges: 'time_ranges'
      });
    }
  }, {
    key: 'ActionsGroupBy',
    get: function get() {
      return Object.freeze({
        action_canvas_component_id: 'action_canvas_component_id',
        action_canvas_component_name: 'action_canvas_component_name',
        action_carousel_card_id: 'action_carousel_card_id',
        action_carousel_card_name: 'action_carousel_card_name',
        action_converted_product_id: 'action_converted_product_id',
        action_destination: 'action_destination',
        action_device: 'action_device',
        action_event_channel: 'action_event_channel',
        action_target_id: 'action_target_id',
        action_type: 'action_type',
        action_video_sound: 'action_video_sound',
        action_video_type: 'action_video_type',
        interactive_component_sticker_id: 'interactive_component_sticker_id',
        interactive_component_sticker_response: 'interactive_component_sticker_response'
      });
    }
  }, {
    key: 'CreationSource',
    get: function get() {
      return Object.freeze({
        adsexceladdin: 'adsExcelAddin',
        adsmanagerreporting: 'adsManagerReporting',
        newadsmanager: 'newAdsManager'
      });
    }
  }, {
    key: 'DatePreset',
    get: function get() {
      return Object.freeze({
        last_14d: 'last_14d',
        last_28d: 'last_28d',
        last_30d: 'last_30d',
        last_3d: 'last_3d',
        last_7d: 'last_7d',
        last_90d: 'last_90d',
        last_month: 'last_month',
        last_quarter: 'last_quarter',
        last_week_mon_sun: 'last_week_mon_sun',
        last_week_sun_sat: 'last_week_sun_sat',
        last_year: 'last_year',
        lifetime: 'lifetime',
        this_month: 'this_month',
        this_quarter: 'this_quarter',
        this_week_mon_today: 'this_week_mon_today',
        this_week_sun_today: 'this_week_sun_today',
        this_year: 'this_year',
        today: 'today',
        yesterday: 'yesterday'
      });
    }
  }, {
    key: 'Format',
    get: function get() {
      return Object.freeze({
        csv: 'CSV',
        json: 'JSON',
        xls: 'XLS',
        xlsx: 'XLSX'
      });
    }
  }]);
  return AdReportSpec;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdAccountAdRulesHistory
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdAccountAdRulesHistory = function (_AbstractCrudObject) {
  inherits(AdAccountAdRulesHistory, _AbstractCrudObject);

  function AdAccountAdRulesHistory() {
    classCallCheck(this, AdAccountAdRulesHistory);
    return possibleConstructorReturn(this, (AdAccountAdRulesHistory.__proto__ || Object.getPrototypeOf(AdAccountAdRulesHistory)).apply(this, arguments));
  }

  createClass(AdAccountAdRulesHistory, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        evaluation_spec: 'evaluation_spec',
        exception_code: 'exception_code',
        exception_message: 'exception_message',
        execution_spec: 'execution_spec',
        is_manual: 'is_manual',
        results: 'results',
        rule_id: 'rule_id',
        schedule_spec: 'schedule_spec',
        timestamp: 'timestamp'
      });
    }
  }, {
    key: 'Action',
    get: function get() {
      return Object.freeze({
        budget_not_redistributed: 'BUDGET_NOT_REDISTRIBUTED',
        changed_bid: 'CHANGED_BID',
        changed_budget: 'CHANGED_BUDGET',
        email: 'EMAIL',
        endpoint_pinged: 'ENDPOINT_PINGED',
        error: 'ERROR',
        facebook_notification_sent: 'FACEBOOK_NOTIFICATION_SENT',
        message_sent: 'MESSAGE_SENT',
        not_changed: 'NOT_CHANGED',
        paused: 'PAUSED',
        unpaused: 'UNPAUSED'
      });
    }
  }, {
    key: 'EvaluationType',
    get: function get() {
      return Object.freeze({
        schedule: 'SCHEDULE',
        trigger: 'TRIGGER'
      });
    }
  }]);
  return AdAccountAdRulesHistory;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdToplineDetail
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdToplineDetail = function (_AbstractCrudObject) {
  inherits(AdToplineDetail, _AbstractCrudObject);

  function AdToplineDetail() {
    classCallCheck(this, AdToplineDetail);
    return possibleConstructorReturn(this, (AdToplineDetail.__proto__ || Object.getPrototypeOf(AdToplineDetail)).apply(this, arguments));
  }

  createClass(AdToplineDetail, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        active_status: 'active_status',
        ad_account_id: 'ad_account_id',
        flight_end_date: 'flight_end_date',
        flight_start_date: 'flight_start_date',
        id: 'id',
        io_number: 'io_number',
        line_number: 'line_number',
        price: 'price',
        quantity: 'quantity',
        sf_detail_line_id: 'sf_detail_line_id',
        subline_id: 'subline_id',
        targets: 'targets',
        time_created: 'time_created',
        time_updated: 'time_updated',
        topline_id: 'topline_id'
      });
    }
  }]);
  return AdToplineDetail;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdTopline
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdTopline = function (_AbstractCrudObject) {
  inherits(AdTopline, _AbstractCrudObject);

  function AdTopline() {
    classCallCheck(this, AdTopline);
    return possibleConstructorReturn(this, (AdTopline.__proto__ || Object.getPrototypeOf(AdTopline)).apply(this, arguments));
  }

  createClass(AdTopline, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        client_approval_date: 'client_approval_date',
        created_by: 'created_by',
        created_date: 'created_date',
        description: 'description',
        flight_end_date: 'flight_end_date',
        flight_start_date: 'flight_start_date',
        func_cap_amount: 'func_cap_amount',
        func_cap_amount_with_offset: 'func_cap_amount_with_offset',
        func_line_amount: 'func_line_amount',
        func_line_amount_with_offset: 'func_line_amount_with_offset',
        func_price: 'func_price',
        func_price_with_offset: 'func_price_with_offset',
        gender: 'gender',
        id: 'id',
        impressions: 'impressions',
        io_number: 'io_number',
        is_bonus_line: 'is_bonus_line',
        keywords: 'keywords',
        last_updated_by: 'last_updated_by',
        last_updated_date: 'last_updated_date',
        line_number: 'line_number',
        line_position: 'line_position',
        line_type: 'line_type',
        location: 'location',
        max_age: 'max_age',
        max_budget: 'max_budget',
        min_age: 'min_age',
        price_per_trp: 'price_per_trp',
        product_type: 'product_type',
        rev_assurance_approval_date: 'rev_assurance_approval_date',
        targets: 'targets',
        trp_updated_time: 'trp_updated_time',
        trp_value: 'trp_value',
        uom: 'uom'
      });
    }
  }]);
  return AdTopline;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AsyncRequest
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AsyncRequest = function (_AbstractCrudObject) {
  inherits(AsyncRequest, _AbstractCrudObject);

  function AsyncRequest() {
    classCallCheck(this, AsyncRequest);
    return possibleConstructorReturn(this, (AsyncRequest.__proto__ || Object.getPrototypeOf(AsyncRequest)).apply(this, arguments));
  }

  createClass(AsyncRequest, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        id: 'id',
        result: 'result',
        status: 'status',
        type: 'type'
      });
    }
  }, {
    key: 'Status',
    get: function get() {
      return Object.freeze({
        error: 'ERROR',
        executing: 'EXECUTING',
        finished: 'FINISHED',
        initialized: 'INITIALIZED'
      });
    }
  }, {
    key: 'Type',
    get: function get() {
      return Object.freeze({
        async_adgroup_creation: 'ASYNC_ADGROUP_CREATION',
        batch_api: 'BATCH_API',
        drafts: 'DRAFTS'
      });
    }
  }]);
  return AsyncRequest;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdAsyncRequest
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdAsyncRequest = function (_AbstractCrudObject) {
  inherits(AdAsyncRequest, _AbstractCrudObject);

  function AdAsyncRequest() {
    classCallCheck(this, AdAsyncRequest);
    return possibleConstructorReturn(this, (AdAsyncRequest.__proto__ || Object.getPrototypeOf(AdAsyncRequest)).apply(this, arguments));
  }

  createClass(AdAsyncRequest, [{
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(AdAsyncRequest.prototype.__proto__ || Object.getPrototypeOf(AdAsyncRequest.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        async_request_set: 'async_request_set',
        created_time: 'created_time',
        id: 'id',
        input: 'input',
        result: 'result',
        scope_object_id: 'scope_object_id',
        status: 'status',
        type: 'type',
        updated_time: 'updated_time'
      });
    }
  }, {
    key: 'Statuses',
    get: function get() {
      return Object.freeze({
        canceled: 'CANCELED',
        canceled_dependency: 'CANCELED_DEPENDENCY',
        error: 'ERROR',
        error_conflicts: 'ERROR_CONFLICTS',
        error_dependency: 'ERROR_DEPENDENCY',
        initial: 'INITIAL',
        in_progress: 'IN_PROGRESS',
        pending_dependency: 'PENDING_DEPENDENCY',
        success: 'SUCCESS'
      });
    }
  }]);
  return AdAsyncRequest;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdAsyncRequestSet
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdAsyncRequestSet = function (_AbstractCrudObject) {
  inherits(AdAsyncRequestSet, _AbstractCrudObject);

  function AdAsyncRequestSet() {
    classCallCheck(this, AdAsyncRequestSet);
    return possibleConstructorReturn(this, (AdAsyncRequestSet.__proto__ || Object.getPrototypeOf(AdAsyncRequestSet)).apply(this, arguments));
  }

  createClass(AdAsyncRequestSet, [{
    key: 'getRequests',
    value: function getRequests(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAsyncRequest, fields, params, fetchFirstPage, '/requests');
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(AdAsyncRequestSet.prototype.__proto__ || Object.getPrototypeOf(AdAsyncRequestSet.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(AdAsyncRequestSet.prototype.__proto__ || Object.getPrototypeOf(AdAsyncRequestSet.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        canceled_count: 'canceled_count',
        created_time: 'created_time',
        error_count: 'error_count',
        id: 'id',
        in_progress_count: 'in_progress_count',
        initial_count: 'initial_count',
        is_completed: 'is_completed',
        name: 'name',
        notification_mode: 'notification_mode',
        notification_result: 'notification_result',
        notification_status: 'notification_status',
        notification_uri: 'notification_uri',
        owner_id: 'owner_id',
        success_count: 'success_count',
        total_count: 'total_count',
        updated_time: 'updated_time'
      });
    }
  }, {
    key: 'NotificationMode',
    get: function get() {
      return Object.freeze({
        off: 'OFF',
        on_complete: 'ON_COMPLETE'
      });
    }
  }, {
    key: 'NotificationStatus',
    get: function get() {
      return Object.freeze({
        not_sent: 'NOT_SENT',
        sending: 'SENDING',
        sent: 'SENT'
      });
    }
  }]);
  return AdAsyncRequestSet;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * BroadTargetingCategories
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var BroadTargetingCategories = function (_AbstractCrudObject) {
  inherits(BroadTargetingCategories, _AbstractCrudObject);

  function BroadTargetingCategories() {
    classCallCheck(this, BroadTargetingCategories);
    return possibleConstructorReturn(this, (BroadTargetingCategories.__proto__ || Object.getPrototypeOf(BroadTargetingCategories)).apply(this, arguments));
  }

  createClass(BroadTargetingCategories, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        category_description: 'category_description',
        id: 'id',
        name: 'name',
        parent_category: 'parent_category',
        path: 'path',
        size: 'size',
        source: 'source',
        type: 'type',
        type_name: 'type_name',
        untranslated_name: 'untranslated_name',
        untranslated_parent_name: 'untranslated_parent_name'
      });
    }
  }]);
  return BroadTargetingCategories;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * CustomAudiencesTOS
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var CustomAudiencesTOS = function (_AbstractCrudObject) {
  inherits(CustomAudiencesTOS, _AbstractCrudObject);

  function CustomAudiencesTOS() {
    classCallCheck(this, CustomAudiencesTOS);
    return possibleConstructorReturn(this, (CustomAudiencesTOS.__proto__ || Object.getPrototypeOf(CustomAudiencesTOS)).apply(this, arguments));
  }

  createClass(CustomAudiencesTOS, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        content: 'content',
        id: 'id',
        type: 'type'
      });
    }
  }]);
  return CustomAudiencesTOS;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdAccountDeliveryEstimate
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdAccountDeliveryEstimate = function (_AbstractCrudObject) {
  inherits(AdAccountDeliveryEstimate, _AbstractCrudObject);

  function AdAccountDeliveryEstimate() {
    classCallCheck(this, AdAccountDeliveryEstimate);
    return possibleConstructorReturn(this, (AdAccountDeliveryEstimate.__proto__ || Object.getPrototypeOf(AdAccountDeliveryEstimate)).apply(this, arguments));
  }

  createClass(AdAccountDeliveryEstimate, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        daily_outcomes_curve: 'daily_outcomes_curve',
        estimate_dau: 'estimate_dau',
        estimate_mau: 'estimate_mau',
        estimate_ready: 'estimate_ready'
      });
    }
  }, {
    key: 'OptimizationGoal',
    get: function get() {
      return Object.freeze({
        ad_recall_lift: 'AD_RECALL_LIFT',
        app_downloads: 'APP_DOWNLOADS',
        app_installs: 'APP_INSTALLS',
        brand_awareness: 'BRAND_AWARENESS',
        clicks: 'CLICKS',
        derived_events: 'DERIVED_EVENTS',
        engaged_users: 'ENGAGED_USERS',
        event_responses: 'EVENT_RESPONSES',
        impressions: 'IMPRESSIONS',
        landing_page_views: 'LANDING_PAGE_VIEWS',
        lead_generation: 'LEAD_GENERATION',
        link_clicks: 'LINK_CLICKS',
        none: 'NONE',
        offer_claims: 'OFFER_CLAIMS',
        offsite_conversions: 'OFFSITE_CONVERSIONS',
        page_engagement: 'PAGE_ENGAGEMENT',
        page_likes: 'PAGE_LIKES',
        post_engagement: 'POST_ENGAGEMENT',
        reach: 'REACH',
        replies: 'REPLIES',
        social_impressions: 'SOCIAL_IMPRESSIONS',
        thruplay: 'THRUPLAY',
        two_second_continuous_video_views: 'TWO_SECOND_CONTINUOUS_VIDEO_VIEWS',
        value: 'VALUE',
        video_views: 'VIDEO_VIEWS'
      });
    }
  }]);
  return AdAccountDeliveryEstimate;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdAccountMatchedSearchApplicationsEdgeData
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdAccountMatchedSearchApplicationsEdgeData = function (_AbstractCrudObject) {
  inherits(AdAccountMatchedSearchApplicationsEdgeData, _AbstractCrudObject);

  function AdAccountMatchedSearchApplicationsEdgeData() {
    classCallCheck(this, AdAccountMatchedSearchApplicationsEdgeData);
    return possibleConstructorReturn(this, (AdAccountMatchedSearchApplicationsEdgeData.__proto__ || Object.getPrototypeOf(AdAccountMatchedSearchApplicationsEdgeData)).apply(this, arguments));
  }

  createClass(AdAccountMatchedSearchApplicationsEdgeData, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        app_id: 'app_id',
        icon_url: 'icon_url',
        name: 'name',
        search_source_store: 'search_source_store',
        store: 'store',
        unique_id: 'unique_id',
        url: 'url'
      });
    }
  }, {
    key: 'AppStore',
    get: function get() {
      return Object.freeze({
        amazon_app_store: 'AMAZON_APP_STORE',
        does_not_exist: 'DOES_NOT_EXIST',
        fb_android_store: 'FB_ANDROID_STORE',
        fb_canvas: 'FB_CANVAS',
        fb_gameroom: 'FB_GAMEROOM',
        google_play: 'GOOGLE_PLAY',
        instant_game: 'INSTANT_GAME',
        itunes: 'ITUNES',
        itunes_ipad: 'ITUNES_IPAD',
        roku_store: 'ROKU_STORE',
        windows_10_store: 'WINDOWS_10_STORE',
        windows_store: 'WINDOWS_STORE'
      });
    }
  }]);
  return AdAccountMatchedSearchApplicationsEdgeData;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdAccountMaxBid
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdAccountMaxBid = function (_AbstractCrudObject) {
  inherits(AdAccountMaxBid, _AbstractCrudObject);

  function AdAccountMaxBid() {
    classCallCheck(this, AdAccountMaxBid);
    return possibleConstructorReturn(this, (AdAccountMaxBid.__proto__ || Object.getPrototypeOf(AdAccountMaxBid)).apply(this, arguments));
  }

  createClass(AdAccountMaxBid, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        max_bid: 'max_bid'
      });
    }
  }]);
  return AdAccountMaxBid;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * MinimumBudget
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var MinimumBudget = function (_AbstractCrudObject) {
  inherits(MinimumBudget, _AbstractCrudObject);

  function MinimumBudget() {
    classCallCheck(this, MinimumBudget);
    return possibleConstructorReturn(this, (MinimumBudget.__proto__ || Object.getPrototypeOf(MinimumBudget)).apply(this, arguments));
  }

  createClass(MinimumBudget, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        currency: 'currency',
        min_daily_budget_high_freq: 'min_daily_budget_high_freq',
        min_daily_budget_imp: 'min_daily_budget_imp',
        min_daily_budget_low_freq: 'min_daily_budget_low_freq',
        min_daily_budget_video_views: 'min_daily_budget_video_views'
      });
    }
  }]);
  return MinimumBudget;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * PublisherBlockList
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var PublisherBlockList = function (_AbstractCrudObject) {
  inherits(PublisherBlockList, _AbstractCrudObject);

  function PublisherBlockList() {
    classCallCheck(this, PublisherBlockList);
    return possibleConstructorReturn(this, (PublisherBlockList.__proto__ || Object.getPrototypeOf(PublisherBlockList)).apply(this, arguments));
  }

  createClass(PublisherBlockList, [{
    key: 'getPagedAppPublishers',
    value: function getPagedAppPublishers(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/paged_app_publishers');
    }
  }, {
    key: 'getPagedWebPublishers',
    value: function getPagedWebPublishers(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/paged_web_publishers');
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(PublisherBlockList.prototype.__proto__ || Object.getPrototypeOf(PublisherBlockList.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(PublisherBlockList.prototype.__proto__ || Object.getPrototypeOf(PublisherBlockList.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        app_publishers: 'app_publishers',
        business_owner_id: 'business_owner_id',
        id: 'id',
        is_auto_blocking_on: 'is_auto_blocking_on',
        is_eligible_at_campaign_level: 'is_eligible_at_campaign_level',
        last_update_time: 'last_update_time',
        last_update_user: 'last_update_user',
        name: 'name',
        owner_ad_account_id: 'owner_ad_account_id',
        web_publishers: 'web_publishers'
      });
    }
  }]);
  return PublisherBlockList;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ReachEstimate
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ReachEstimate = function (_AbstractCrudObject) {
  inherits(ReachEstimate, _AbstractCrudObject);

  function ReachEstimate() {
    classCallCheck(this, ReachEstimate);
    return possibleConstructorReturn(this, (ReachEstimate.__proto__ || Object.getPrototypeOf(ReachEstimate)).apply(this, arguments));
  }

  createClass(ReachEstimate, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        estimate_ready: 'estimate_ready',
        unsupported: 'unsupported',
        users: 'users'
      });
    }
  }]);
  return ReachEstimate;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ReachFrequencyPrediction
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ReachFrequencyPrediction = function (_AbstractCrudObject) {
  inherits(ReachFrequencyPrediction, _AbstractCrudObject);

  function ReachFrequencyPrediction() {
    classCallCheck(this, ReachFrequencyPrediction);
    return possibleConstructorReturn(this, (ReachFrequencyPrediction.__proto__ || Object.getPrototypeOf(ReachFrequencyPrediction)).apply(this, arguments));
  }

  createClass(ReachFrequencyPrediction, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        activity_status: 'activity_status',
        ad_formats: 'ad_formats',
        auction_entry_option_index: 'auction_entry_option_index',
        business_id: 'business_id',
        buying_type: 'buying_type',
        campaign_group_id: 'campaign_group_id',
        campaign_id: 'campaign_id',
        campaign_time_start: 'campaign_time_start',
        campaign_time_stop: 'campaign_time_stop',
        currency: 'currency',
        curve_budget_reach: 'curve_budget_reach',
        curve_reach: 'curve_reach',
        daily_grp_curve: 'daily_grp_curve',
        daily_impression_curve: 'daily_impression_curve',
        daily_impression_curve_map: 'daily_impression_curve_map',
        day_parting_schedule: 'day_parting_schedule',
        demo_breakdown: 'demo_breakdown',
        destination_id: 'destination_id',
        end_time: 'end_time',
        expiration_time: 'expiration_time',
        external_budget: 'external_budget',
        external_impression: 'external_impression',
        external_maximum_budget: 'external_maximum_budget',
        external_maximum_impression: 'external_maximum_impression',
        external_maximum_reach: 'external_maximum_reach',
        external_minimum_budget: 'external_minimum_budget',
        external_minimum_impression: 'external_minimum_impression',
        external_minimum_reach: 'external_minimum_reach',
        external_reach: 'external_reach',
        external_values_breakdown: 'external_values_breakdown',
        feed_ratio_0000: 'feed_ratio_0000',
        frequency_cap: 'frequency_cap',
        frequency_distribution: 'frequency_distribution',
        frequency_distribution_map: 'frequency_distribution_map',
        frequency_distribution_map_agg: 'frequency_distribution_map_agg',
        grp_audience_size: 'grp_audience_size',
        grp_avg_probability_map: 'grp_avg_probability_map',
        grp_country_audience_size: 'grp_country_audience_size',
        grp_curve: 'grp_curve',
        grp_dmas_audience_size: 'grp_dmas_audience_size',
        grp_filtering_threshold_00: 'grp_filtering_threshold_00',
        grp_points: 'grp_points',
        grp_ratio: 'grp_ratio',
        grp_reach_ratio: 'grp_reach_ratio',
        grp_status: 'grp_status',
        holdout_percentage: 'holdout_percentage',
        id: 'id',
        impression_curve: 'impression_curve',
        instagram_destination_id: 'instagram_destination_id',
        instream_packages: 'instream_packages',
        interval_frequency_cap: 'interval_frequency_cap',
        interval_frequency_cap_reset_period: 'interval_frequency_cap_reset_period',
        is_bonus_media: 'is_bonus_media',
        is_conversion_goal: 'is_conversion_goal',
        is_higher_average_frequency: 'is_higher_average_frequency',
        is_io: 'is_io',
        is_reserved_buying: 'is_reserved_buying',
        is_trp: 'is_trp',
        name: 'name',
        objective: 'objective',
        objective_name: 'objective_name',
        pause_periods: 'pause_periods',
        placement_breakdown: 'placement_breakdown',
        placement_breakdown_map: 'placement_breakdown_map',
        plan_name: 'plan_name',
        plan_type: 'plan_type',
        prediction_mode: 'prediction_mode',
        prediction_progress: 'prediction_progress',
        reference_id: 'reference_id',
        reservation_status: 'reservation_status',
        start_time: 'start_time',
        status: 'status',
        story_event_type: 'story_event_type',
        target_audience_size: 'target_audience_size',
        target_cpm: 'target_cpm',
        target_spec: 'target_spec',
        time_created: 'time_created',
        time_updated: 'time_updated',
        timezone_id: 'timezone_id',
        timezone_name: 'timezone_name',
        topline_id: 'topline_id',
        tv_viewer_cluster_map: 'tv_viewer_cluster_map',
        video_view_benchmark_map: 'video_view_benchmark_map',
        video_view_length_constraint: 'video_view_length_constraint',
        viewtag: 'viewtag'
      });
    }
  }, {
    key: 'Action',
    get: function get() {
      return Object.freeze({
        cancel: 'cancel',
        quote: 'quote',
        reserve: 'reserve'
      });
    }
  }, {
    key: 'BuyingType',
    get: function get() {
      return Object.freeze({
        auction: 'AUCTION',
        deprecated_reach_block: 'DEPRECATED_REACH_BLOCK',
        fixed_cpm: 'FIXED_CPM',
        mixed: 'MIXED',
        reachblock: 'REACHBLOCK',
        research_poll: 'RESEARCH_POLL',
        reserved: 'RESERVED'
      });
    }
  }, {
    key: 'InstreamPackages',
    get: function get() {
      return Object.freeze({
        beauty: 'BEAUTY',
        entertainment: 'ENTERTAINMENT',
        food: 'FOOD',
        normal: 'NORMAL',
        premium: 'PREMIUM',
        regular_animals_pets: 'REGULAR_ANIMALS_PETS',
        regular_food: 'REGULAR_FOOD',
        regular_games: 'REGULAR_GAMES',
        regular_politics: 'REGULAR_POLITICS',
        regular_sports: 'REGULAR_SPORTS',
        regular_style: 'REGULAR_STYLE',
        regular_tv_movies: 'REGULAR_TV_MOVIES',
        sports: 'SPORTS'
      });
    }
  }]);
  return ReachFrequencyPrediction;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdAccountRoas
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdAccountRoas = function (_AbstractCrudObject) {
  inherits(AdAccountRoas, _AbstractCrudObject);

  function AdAccountRoas() {
    classCallCheck(this, AdAccountRoas);
    return possibleConstructorReturn(this, (AdAccountRoas.__proto__ || Object.getPrototypeOf(AdAccountRoas)).apply(this, arguments));
  }

  createClass(AdAccountRoas, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        adgroup_id: 'adgroup_id',
        arpu_180d: 'arpu_180d',
        arpu_1d: 'arpu_1d',
        arpu_30d: 'arpu_30d',
        arpu_365d: 'arpu_365d',
        arpu_3d: 'arpu_3d',
        arpu_7d: 'arpu_7d',
        arpu_90d: 'arpu_90d',
        campaign_group_id: 'campaign_group_id',
        campaign_id: 'campaign_id',
        date_start: 'date_start',
        date_stop: 'date_stop',
        installs: 'installs',
        revenue: 'revenue',
        revenue_180d: 'revenue_180d',
        revenue_1d: 'revenue_1d',
        revenue_30d: 'revenue_30d',
        revenue_365d: 'revenue_365d',
        revenue_3d: 'revenue_3d',
        revenue_7d: 'revenue_7d',
        revenue_90d: 'revenue_90d',
        spend: 'spend',
        yield_180d: 'yield_180d',
        yield_1d: 'yield_1d',
        yield_30d: 'yield_30d',
        yield_365d: 'yield_365d',
        yield_3d: 'yield_3d',
        yield_7d: 'yield_7d',
        yield_90d: 'yield_90d'
      });
    }
  }]);
  return AdAccountRoas;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * SavedAudience
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var SavedAudience = function (_AbstractCrudObject) {
  inherits(SavedAudience, _AbstractCrudObject);

  function SavedAudience() {
    classCallCheck(this, SavedAudience);
    return possibleConstructorReturn(this, (SavedAudience.__proto__ || Object.getPrototypeOf(SavedAudience)).apply(this, arguments));
  }

  createClass(SavedAudience, [{
    key: 'getAdSets',
    value: function getAdSets(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdSet, fields, params, fetchFirstPage, '/adsets');
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(SavedAudience.prototype.__proto__ || Object.getPrototypeOf(SavedAudience.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        account: 'account',
        approximate_count: 'approximate_count',
        description: 'description',
        id: 'id',
        name: 'name',
        permission_for_actions: 'permission_for_actions',
        run_status: 'run_status',
        sentence_lines: 'sentence_lines',
        targeting: 'targeting',
        time_created: 'time_created',
        time_updated: 'time_updated'
      });
    }
  }]);
  return SavedAudience;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdAccountTargetingUnified
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdAccountTargetingUnified = function (_AbstractCrudObject) {
  inherits(AdAccountTargetingUnified, _AbstractCrudObject);

  function AdAccountTargetingUnified() {
    classCallCheck(this, AdAccountTargetingUnified);
    return possibleConstructorReturn(this, (AdAccountTargetingUnified.__proto__ || Object.getPrototypeOf(AdAccountTargetingUnified)).apply(this, arguments));
  }

  createClass(AdAccountTargetingUnified, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        audience_size: 'audience_size',
        conversion_lift: 'conversion_lift',
        description: 'description',
        id: 'id',
        img: 'img',
        info: 'info',
        info_title: 'info_title',
        is_recommendation: 'is_recommendation',
        key: 'key',
        link: 'link',
        name: 'name',
        parent: 'parent',
        partner: 'partner',
        path: 'path',
        performance_rating: 'performance_rating',
        raw_name: 'raw_name',
        recommendation_model: 'recommendation_model',
        search_interest_id: 'search_interest_id',
        source: 'source',
        spend: 'spend',
        type: 'type',
        valid: 'valid'
      });
    }
  }, {
    key: 'LimitType',
    get: function get() {
      return Object.freeze({
        behaviors: 'behaviors',
        college_years: 'college_years',
        education_majors: 'education_majors',
        education_schools: 'education_schools',
        education_statuses: 'education_statuses',
        ethnic_affinity: 'ethnic_affinity',
        family_statuses: 'family_statuses',
        generation: 'generation',
        home_ownership: 'home_ownership',
        home_type: 'home_type',
        home_value: 'home_value',
        household_composition: 'household_composition',
        income: 'income',
        industries: 'industries',
        interested_in: 'interested_in',
        interests: 'interests',
        life_events: 'life_events',
        location_categories: 'location_categories',
        moms: 'moms',
        net_worth: 'net_worth',
        office_type: 'office_type',
        politics: 'politics',
        relationship_statuses: 'relationship_statuses',
        user_adclusters: 'user_adclusters',
        work_employers: 'work_employers',
        work_positions: 'work_positions'
      });
    }
  }, {
    key: 'WhitelistedTypes',
    get: function get() {
      return Object.freeze({
        adgroup_id: 'adgroup_id',
        age_max: 'age_max',
        age_min: 'age_min',
        alternate_auto_targeting_option: 'alternate_auto_targeting_option',
        app_install_state: 'app_install_state',
        audience_network_positions: 'audience_network_positions',
        behaviors: 'behaviors',
        brand_safety_content_filter_levels: 'brand_safety_content_filter_levels',
        brand_safety_content_severity_levels: 'brand_safety_content_severity_levels',
        catalog_based_targeting: 'catalog_based_targeting',
        cities: 'cities',
        college_years: 'college_years',
        conjunctive_user_adclusters: 'conjunctive_user_adclusters',
        connections: 'connections',
        contextual_targeting_categories: 'contextual_targeting_categories',
        countries: 'countries',
        country: 'country',
        country_groups: 'country_groups',
        custom_audiences: 'custom_audiences',
        device_platforms: 'device_platforms',
        direct_install_devices: 'direct_install_devices',
        dynamic_audience_ids: 'dynamic_audience_ids',
        education_majors: 'education_majors',
        education_schools: 'education_schools',
        education_statuses: 'education_statuses',
        effective_audience_network_positions: 'effective_audience_network_positions',
        effective_device_platforms: 'effective_device_platforms',
        effective_facebook_positions: 'effective_facebook_positions',
        effective_instagram_positions: 'effective_instagram_positions',
        effective_messenger_positions: 'effective_messenger_positions',
        effective_publisher_platforms: 'effective_publisher_platforms',
        effective_whatsapp_positions: 'effective_whatsapp_positions',
        engagement_specs: 'engagement_specs',
        ethnic_affinity: 'ethnic_affinity',
        exclude_previous_days: 'exclude_previous_days',
        exclude_reached_since: 'exclude_reached_since',
        excluded_connections: 'excluded_connections',
        excluded_custom_audiences: 'excluded_custom_audiences',
        excluded_dynamic_audience_ids: 'excluded_dynamic_audience_ids',
        excluded_engagement_specs: 'excluded_engagement_specs',
        excluded_geo_locations: 'excluded_geo_locations',
        excluded_mobile_device_model: 'excluded_mobile_device_model',
        excluded_product_audience_specs: 'excluded_product_audience_specs',
        excluded_publisher_categories: 'excluded_publisher_categories',
        excluded_publisher_list_ids: 'excluded_publisher_list_ids',
        excluded_user_adclusters: 'excluded_user_adclusters',
        excluded_user_device: 'excluded_user_device',
        exclusions: 'exclusions',
        facebook_positions: 'facebook_positions',
        family_statuses: 'family_statuses',
        fb_deal_id: 'fb_deal_id',
        flexible_spec: 'flexible_spec',
        follow_profiles: 'follow_profiles',
        follow_profiles_negative: 'follow_profiles_negative',
        format: 'format',
        friends_of_connections: 'friends_of_connections',
        gatekeepers: 'gatekeepers',
        genders: 'genders',
        generation: 'generation',
        geo_locations: 'geo_locations',
        home_ownership: 'home_ownership',
        home_type: 'home_type',
        home_value: 'home_value',
        household_composition: 'household_composition',
        income: 'income',
        industries: 'industries',
        instagram_positions: 'instagram_positions',
        instream_video_sponsorship_placements: 'instream_video_sponsorship_placements',
        interest_defaults_source: 'interest_defaults_source',
        interested_in: 'interested_in',
        interests: 'interests',
        is_whatsapp_destination_ad: 'is_whatsapp_destination_ad',
        keywords: 'keywords',
        life_events: 'life_events',
        locales: 'locales',
        location_categories: 'location_categories',
        location_cluster_ids: 'location_cluster_ids',
        location_expansion: 'location_expansion',
        marketplace_product_categories: 'marketplace_product_categories',
        messenger_positions: 'messenger_positions',
        mobile_device_model: 'mobile_device_model',
        moms: 'moms',
        net_worth: 'net_worth',
        office_type: 'office_type',
        page_types: 'page_types',
        place_page_set_ids: 'place_page_set_ids',
        political_views: 'political_views',
        politics: 'politics',
        product_audience_specs: 'product_audience_specs',
        prospecting_audience: 'prospecting_audience',
        publisher_platforms: 'publisher_platforms',
        publisher_visibility_categories: 'publisher_visibility_categories',
        radius: 'radius',
        regions: 'regions',
        relationship_statuses: 'relationship_statuses',
        rtb_flag: 'rtb_flag',
        site_category: 'site_category',
        targeting_optimization: 'targeting_optimization',
        timezones: 'timezones',
        topic: 'topic',
        trending: 'trending',
        user_adclusters: 'user_adclusters',
        user_device: 'user_device',
        user_event: 'user_event',
        user_os: 'user_os',
        user_page_threads: 'user_page_threads',
        user_page_threads_excluded: 'user_page_threads_excluded',
        whatsapp_positions: 'whatsapp_positions',
        wireless_carrier: 'wireless_carrier',
        work_employers: 'work_employers',
        work_positions: 'work_positions',
        zips: 'zips'
      });
    }
  }, {
    key: 'Mode',
    get: function get() {
      return Object.freeze({
        best_performing: 'best_performing',
        recently_used: 'recently_used',
        related: 'related',
        suggestions: 'suggestions'
      });
    }
  }, {
    key: 'Objective',
    get: function get() {
      return Object.freeze({
        app_installs: 'APP_INSTALLS',
        brand_awareness: 'BRAND_AWARENESS',
        conversions: 'CONVERSIONS',
        event_responses: 'EVENT_RESPONSES',
        lead_generation: 'LEAD_GENERATION',
        link_clicks: 'LINK_CLICKS',
        local_awareness: 'LOCAL_AWARENESS',
        messages: 'MESSAGES',
        offer_claims: 'OFFER_CLAIMS',
        page_likes: 'PAGE_LIKES',
        post_engagement: 'POST_ENGAGEMENT',
        product_catalog_sales: 'PRODUCT_CATALOG_SALES',
        reach: 'REACH',
        video_views: 'VIDEO_VIEWS'
      });
    }
  }]);
  return AdAccountTargetingUnified;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdAccountTrackingData
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdAccountTrackingData = function (_AbstractCrudObject) {
  inherits(AdAccountTrackingData, _AbstractCrudObject);

  function AdAccountTrackingData() {
    classCallCheck(this, AdAccountTrackingData);
    return possibleConstructorReturn(this, (AdAccountTrackingData.__proto__ || Object.getPrototypeOf(AdAccountTrackingData)).apply(this, arguments));
  }

  createClass(AdAccountTrackingData, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        tracking_specs: 'tracking_specs'
      });
    }
  }]);
  return AdAccountTrackingData;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdAccountUser
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdAccountUser = function (_AbstractCrudObject) {
  inherits(AdAccountUser, _AbstractCrudObject);

  function AdAccountUser() {
    classCallCheck(this, AdAccountUser);
    return possibleConstructorReturn(this, (AdAccountUser.__proto__ || Object.getPrototypeOf(AdAccountUser)).apply(this, arguments));
  }

  createClass(AdAccountUser, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        id: 'id',
        name: 'name',
        tasks: 'tasks'
      });
    }
  }]);
  return AdAccountUser;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdAccount
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdAccount = function (_AbstractCrudObject) {
  inherits(AdAccount, _AbstractCrudObject);

  function AdAccount() {
    classCallCheck(this, AdAccount);
    return possibleConstructorReturn(this, (AdAccount.__proto__ || Object.getPrototypeOf(AdAccount)).apply(this, arguments));
  }

  createClass(AdAccount, [{
    key: 'getActivities',
    value: function getActivities(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdActivity, fields, params, fetchFirstPage, '/activities');
    }
  }, {
    key: 'getAdPlacePageSets',
    value: function getAdPlacePageSets(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdPlacePageSet, fields, params, fetchFirstPage, '/ad_place_page_sets');
    }
  }, {
    key: 'createAdPlacePageSet',
    value: function createAdPlacePageSet(fields, params) {
      return this.createEdge('/ad_place_page_sets', fields, params, AdPlacePageSet);
    }
  }, {
    key: 'getAdStudies',
    value: function getAdStudies(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdStudy, fields, params, fetchFirstPage, '/ad_studies');
    }
  }, {
    key: 'getAdContracts',
    value: function getAdContracts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdContract, fields, params, fetchFirstPage, '/adcontracts');
    }
  }, {
    key: 'getAdCreatives',
    value: function getAdCreatives(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdCreative, fields, params, fetchFirstPage, '/adcreatives');
    }
  }, {
    key: 'createAdCreative',
    value: function createAdCreative(fields, params) {
      return this.createEdge('/adcreatives', fields, params, AdCreative);
    }
  }, {
    key: 'getAdCreativesByLabels',
    value: function getAdCreativesByLabels(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdCreative, fields, params, fetchFirstPage, '/adcreativesbylabels');
    }
  }, {
    key: 'deleteAdImages',
    value: function deleteAdImages(params) {
      return get$1(AdAccount.prototype.__proto__ || Object.getPrototypeOf(AdAccount.prototype), 'deleteEdge', this).call(this, '/adimages', params);
    }
  }, {
    key: 'getAdImages',
    value: function getAdImages(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdImage, fields, params, fetchFirstPage, '/adimages');
    }
  }, {
    key: 'createAdImage',
    value: function createAdImage(fields, params) {
      return this.createEdge('/adimages', fields, params, AdImage);
    }
  }, {
    key: 'getAdLabels',
    value: function getAdLabels(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdLabel, fields, params, fetchFirstPage, '/adlabels');
    }
  }, {
    key: 'createAdLabel',
    value: function createAdLabel(fields, params) {
      return this.createEdge('/adlabels', fields, params, AdLabel);
    }
  }, {
    key: 'getAdPlayables',
    value: function getAdPlayables(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(PlayableContent, fields, params, fetchFirstPage, '/adplayables');
    }
  }, {
    key: 'createAdPlayable',
    value: function createAdPlayable(fields, params) {
      return this.createEdge('/adplayables', fields, params, PlayableContent);
    }
  }, {
    key: 'deleteAdReportRuns',
    value: function deleteAdReportRuns(params) {
      return get$1(AdAccount.prototype.__proto__ || Object.getPrototypeOf(AdAccount.prototype), 'deleteEdge', this).call(this, '/adreportruns', params);
    }
  }, {
    key: 'getAdReportRuns',
    value: function getAdReportRuns(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdReportRun, fields, params, fetchFirstPage, '/adreportruns');
    }
  }, {
    key: 'getAdReportSchedules',
    value: function getAdReportSchedules(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/adreportschedules');
    }
  }, {
    key: 'createAdReportSchedule',
    value: function createAdReportSchedule(fields, params) {
      return this.createEdge('/adreportschedules', fields, params);
    }
  }, {
    key: 'createAdReportSpec',
    value: function createAdReportSpec(fields, params) {
      return this.createEdge('/adreportspecs', fields, params, AdReportSpec);
    }
  }, {
    key: 'getAdRulesHistory',
    value: function getAdRulesHistory(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAccountAdRulesHistory, fields, params, fetchFirstPage, '/adrules_history');
    }
  }, {
    key: 'getAdRulesLibrary',
    value: function getAdRulesLibrary(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdRule, fields, params, fetchFirstPage, '/adrules_library');
    }
  }, {
    key: 'createAdRulesLibrary',
    value: function createAdRulesLibrary(fields, params) {
      return this.createEdge('/adrules_library', fields, params, AdRule);
    }
  }, {
    key: 'deleteAds',
    value: function deleteAds(params) {
      return get$1(AdAccount.prototype.__proto__ || Object.getPrototypeOf(AdAccount.prototype), 'deleteEdge', this).call(this, '/ads', params);
    }
  }, {
    key: 'getAds',
    value: function getAds(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Ad, fields, params, fetchFirstPage, '/ads');
    }
  }, {
    key: 'createAd',
    value: function createAd(fields, params) {
      return this.createEdge('/ads', fields, params, Ad);
    }
  }, {
    key: 'getAdsByLabels',
    value: function getAdsByLabels(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Ad, fields, params, fetchFirstPage, '/adsbylabels');
    }
  }, {
    key: 'deleteAdSets',
    value: function deleteAdSets(params) {
      return get$1(AdAccount.prototype.__proto__ || Object.getPrototypeOf(AdAccount.prototype), 'deleteEdge', this).call(this, '/adsets', params);
    }
  }, {
    key: 'getAdSets',
    value: function getAdSets(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdSet, fields, params, fetchFirstPage, '/adsets');
    }
  }, {
    key: 'createAdSet',
    value: function createAdSet(fields, params) {
      return this.createEdge('/adsets', fields, params, AdSet);
    }
  }, {
    key: 'getAdSetsByLabels',
    value: function getAdSetsByLabels(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdSet, fields, params, fetchFirstPage, '/adsetsbylabels');
    }
  }, {
    key: 'getAdsPixels',
    value: function getAdsPixels(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdsPixel, fields, params, fetchFirstPage, '/adspixels');
    }
  }, {
    key: 'createAdsPixel',
    value: function createAdsPixel(fields, params) {
      return this.createEdge('/adspixels', fields, params, AdsPixel);
    }
  }, {
    key: 'getAdToplineDetails',
    value: function getAdToplineDetails(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdToplineDetail, fields, params, fetchFirstPage, '/adtoplinedetails');
    }
  }, {
    key: 'getAdTopLines',
    value: function getAdTopLines(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdTopline, fields, params, fetchFirstPage, '/adtoplines');
    }
  }, {
    key: 'getAdvertisableApplications',
    value: function getAdvertisableApplications(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Application, fields, params, fetchFirstPage, '/advertisable_applications');
    }
  }, {
    key: 'deleteAdVideos',
    value: function deleteAdVideos(params) {
      return get$1(AdAccount.prototype.__proto__ || Object.getPrototypeOf(AdAccount.prototype), 'deleteEdge', this).call(this, '/advideos', params);
    }
  }, {
    key: 'getAdVideos',
    value: function getAdVideos(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdVideo, fields, params, fetchFirstPage, '/advideos');
    }
  }, {
    key: 'createAdVideo',
    value: function createAdVideo(fields, params) {
      return this.createEdge('/advideos', fields, params, AdVideo);
    }
  }, {
    key: 'deleteAgencies',
    value: function deleteAgencies(params) {
      return get$1(AdAccount.prototype.__proto__ || Object.getPrototypeOf(AdAccount.prototype), 'deleteEdge', this).call(this, '/agencies', params);
    }
  }, {
    key: 'getAgencies',
    value: function getAgencies(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Business, fields, params, fetchFirstPage, '/agencies');
    }
  }, {
    key: 'createAgency',
    value: function createAgency(fields, params) {
      return this.createEdge('/agencies', fields, params, AdAccount);
    }
  }, {
    key: 'getApplications',
    value: function getApplications(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Application, fields, params, fetchFirstPage, '/applications');
    }
  }, {
    key: 'deleteAssignedUsers',
    value: function deleteAssignedUsers(params) {
      return get$1(AdAccount.prototype.__proto__ || Object.getPrototypeOf(AdAccount.prototype), 'deleteEdge', this).call(this, '/assigned_users', params);
    }
  }, {
    key: 'getAssignedUsers',
    value: function getAssignedUsers(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AssignedUser, fields, params, fetchFirstPage, '/assigned_users');
    }
  }, {
    key: 'createAssignedUser',
    value: function createAssignedUser(fields, params) {
      return this.createEdge('/assigned_users', fields, params, AdAccount);
    }
  }, {
    key: 'createAsyncBatchRequest',
    value: function createAsyncBatchRequest(fields, params) {
      return this.createEdge('/async_batch_requests', fields, params, Campaign);
    }
  }, {
    key: 'getAsyncRequests',
    value: function getAsyncRequests(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AsyncRequest, fields, params, fetchFirstPage, '/async_requests');
    }
  }, {
    key: 'getAsyncAdRequestSets',
    value: function getAsyncAdRequestSets(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAsyncRequestSet, fields, params, fetchFirstPage, '/asyncadrequestsets');
    }
  }, {
    key: 'createAsyncAdRequestSet',
    value: function createAsyncAdRequestSet(fields, params) {
      return this.createEdge('/asyncadrequestsets', fields, params, AdAsyncRequestSet);
    }
  }, {
    key: 'createAudienceReplace',
    value: function createAudienceReplace(fields, params) {
      return this.createEdge('/audiencereplace', fields, params);
    }
  }, {
    key: 'createBatchReplace',
    value: function createBatchReplace(fields, params) {
      return this.createEdge('/batchreplace', fields, params);
    }
  }, {
    key: 'createBatchUpload',
    value: function createBatchUpload(fields, params) {
      return this.createEdge('/batchupload', fields, params);
    }
  }, {
    key: 'createBlockListDraft',
    value: function createBlockListDraft(fields, params) {
      return this.createEdge('/block_list_drafts', fields, params, AdAccount);
    }
  }, {
    key: 'createBrandAudience',
    value: function createBrandAudience(fields, params) {
      return this.createEdge('/brand_audiences', fields, params);
    }
  }, {
    key: 'getBroadTargetingCategories',
    value: function getBroadTargetingCategories(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(BroadTargetingCategories, fields, params, fetchFirstPage, '/broadtargetingcategories');
    }
  }, {
    key: 'getBusinessProjects',
    value: function getBusinessProjects(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(BusinessProject, fields, params, fetchFirstPage, '/businessprojects');
    }
  }, {
    key: 'deleteCampaigns',
    value: function deleteCampaigns(params) {
      return get$1(AdAccount.prototype.__proto__ || Object.getPrototypeOf(AdAccount.prototype), 'deleteEdge', this).call(this, '/campaigns', params);
    }
  }, {
    key: 'getCampaigns',
    value: function getCampaigns(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Campaign, fields, params, fetchFirstPage, '/campaigns');
    }
  }, {
    key: 'createCampaign',
    value: function createCampaign(fields, params) {
      return this.createEdge('/campaigns', fields, params, Campaign);
    }
  }, {
    key: 'getCampaignsByLabels',
    value: function getCampaignsByLabels(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Campaign, fields, params, fetchFirstPage, '/campaignsbylabels');
    }
  }, {
    key: 'getCustomAudiences',
    value: function getCustomAudiences(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(CustomAudience, fields, params, fetchFirstPage, '/customaudiences');
    }
  }, {
    key: 'createCustomAudience',
    value: function createCustomAudience(fields, params) {
      return this.createEdge('/customaudiences', fields, params, CustomAudience);
    }
  }, {
    key: 'getCustomAudiencesTos',
    value: function getCustomAudiencesTos(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(CustomAudiencesTOS, fields, params, fetchFirstPage, '/customaudiencestos');
    }
  }, {
    key: 'createCustomAudiencesTo',
    value: function createCustomAudiencesTo(fields, params) {
      return this.createEdge('/customaudiencestos', fields, params, AdAccount);
    }
  }, {
    key: 'getCustomConversions',
    value: function getCustomConversions(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(CustomConversion, fields, params, fetchFirstPage, '/customconversions');
    }
  }, {
    key: 'createCustomConversion',
    value: function createCustomConversion(fields, params) {
      return this.createEdge('/customconversions', fields, params, CustomConversion);
    }
  }, {
    key: 'createDeactivate',
    value: function createDeactivate(fields, params) {
      return this.createEdge('/deactivate', fields, params, AdAccount);
    }
  }, {
    key: 'getDeliveryEstimate',
    value: function getDeliveryEstimate(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAccountDeliveryEstimate, fields, params, fetchFirstPage, '/delivery_estimate');
    }
  }, {
    key: 'getDeprecatedTargetingAdSets',
    value: function getDeprecatedTargetingAdSets(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdSet, fields, params, fetchFirstPage, '/deprecatedtargetingadsets');
    }
  }, {
    key: 'getGeneratePreviews',
    value: function getGeneratePreviews(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdPreview, fields, params, fetchFirstPage, '/generatepreviews');
    }
  }, {
    key: 'getImpactingAdStudies',
    value: function getImpactingAdStudies(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdStudy, fields, params, fetchFirstPage, '/impacting_ad_studies');
    }
  }, {
    key: 'getInsights',
    value: function getInsights(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdsInsights, fields, params, fetchFirstPage, '/insights');
    }
  }, {
    key: 'getInsightsAsync',
    value: function getInsightsAsync(fields, params) {
      return this.createEdge('/insights', fields, params, AdReportRun);
    }
  }, {
    key: 'getInstagramAccounts',
    value: function getInstagramAccounts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(InstagramUser, fields, params, fetchFirstPage, '/instagram_accounts');
    }
  }, {
    key: 'getLeadGenForms',
    value: function getLeadGenForms(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(LeadgenForm, fields, params, fetchFirstPage, '/leadgen_forms');
    }
  }, {
    key: 'getMatchedSearchApplications',
    value: function getMatchedSearchApplications(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAccountMatchedSearchApplicationsEdgeData, fields, params, fetchFirstPage, '/matched_search_applications');
    }
  }, {
    key: 'getMaxBid',
    value: function getMaxBid(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAccountMaxBid, fields, params, fetchFirstPage, '/max_bid');
    }
  }, {
    key: 'getMinimumBudgets',
    value: function getMinimumBudgets(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(MinimumBudget, fields, params, fetchFirstPage, '/minimum_budgets');
    }
  }, {
    key: 'getOfflineConversionDataSets',
    value: function getOfflineConversionDataSets(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(OfflineConversionDataSet, fields, params, fetchFirstPage, '/offline_conversion_data_sets');
    }
  }, {
    key: 'getOnBehalfRequests',
    value: function getOnBehalfRequests(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(BusinessOwnedObjectOnBehalfOfRequest, fields, params, fetchFirstPage, '/onbehalf_requests');
    }
  }, {
    key: 'createPartnerRequest',
    value: function createPartnerRequest(fields, params) {
      return this.createEdge('/partnerrequests', fields, params);
    }
  }, {
    key: 'createProductAudience',
    value: function createProductAudience(fields, params) {
      return this.createEdge('/product_audiences', fields, params, CustomAudience);
    }
  }, {
    key: 'getPromotePages',
    value: function getPromotePages(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Page, fields, params, fetchFirstPage, '/promote_pages');
    }
  }, {
    key: 'getPublisherBlockLists',
    value: function getPublisherBlockLists(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(PublisherBlockList, fields, params, fetchFirstPage, '/publisher_block_lists');
    }
  }, {
    key: 'createPublisherBlockList',
    value: function createPublisherBlockList(fields, params) {
      return this.createEdge('/publisher_block_lists', fields, params, PublisherBlockList);
    }
  }, {
    key: 'getReachEstimate',
    value: function getReachEstimate(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ReachEstimate, fields, params, fetchFirstPage, '/reachestimate');
    }
  }, {
    key: 'getReachFrequencyPredictions',
    value: function getReachFrequencyPredictions(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(ReachFrequencyPrediction, fields, params, fetchFirstPage, '/reachfrequencypredictions');
    }
  }, {
    key: 'createReachFrequencyPrediction',
    value: function createReachFrequencyPrediction(fields, params) {
      return this.createEdge('/reachfrequencypredictions', fields, params, ReachFrequencyPrediction);
    }
  }, {
    key: 'getRoas',
    value: function getRoas(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAccountRoas, fields, params, fetchFirstPage, '/roas');
    }
  }, {
    key: 'getSavedAudiences',
    value: function getSavedAudiences(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(SavedAudience, fields, params, fetchFirstPage, '/saved_audiences');
    }
  }, {
    key: 'createSponsoredMessageAd',
    value: function createSponsoredMessageAd(fields, params) {
      return this.createEdge('/sponsored_message_ads', fields, params);
    }
  }, {
    key: 'getTargetingBrowse',
    value: function getTargetingBrowse(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAccountTargetingUnified, fields, params, fetchFirstPage, '/targetingbrowse');
    }
  }, {
    key: 'getTargetingSearch',
    value: function getTargetingSearch(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAccountTargetingUnified, fields, params, fetchFirstPage, '/targetingsearch');
    }
  }, {
    key: 'getTargetingSentenceLines',
    value: function getTargetingSentenceLines(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(TargetingSentenceLine, fields, params, fetchFirstPage, '/targetingsentencelines');
    }
  }, {
    key: 'getTargetingSuggestions',
    value: function getTargetingSuggestions(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAccountTargetingUnified, fields, params, fetchFirstPage, '/targetingsuggestions');
    }
  }, {
    key: 'getTargetingValidation',
    value: function getTargetingValidation(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAccountTargetingUnified, fields, params, fetchFirstPage, '/targetingvalidation');
    }
  }, {
    key: 'deleteTracking',
    value: function deleteTracking(params) {
      return get$1(AdAccount.prototype.__proto__ || Object.getPrototypeOf(AdAccount.prototype), 'deleteEdge', this).call(this, '/tracking', params);
    }
  }, {
    key: 'getTracking',
    value: function getTracking(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAccountTrackingData, fields, params, fetchFirstPage, '/tracking');
    }
  }, {
    key: 'createTracking',
    value: function createTracking(fields, params) {
      return this.createEdge('/tracking', fields, params, AdAccount);
    }
  }, {
    key: 'deleteUsers',
    value: function deleteUsers(params) {
      return get$1(AdAccount.prototype.__proto__ || Object.getPrototypeOf(AdAccount.prototype), 'deleteEdge', this).call(this, '/users', params);
    }
  }, {
    key: 'getUsers',
    value: function getUsers(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdAccountUser, fields, params, fetchFirstPage, '/users');
    }
  }, {
    key: 'createUser',
    value: function createUser(fields, params) {
      return this.createEdge('/users', fields, params, AdAccount);
    }
  }, {
    key: 'deleteUsersOfAnyAudience',
    value: function deleteUsersOfAnyAudience(params) {
      return get$1(AdAccount.prototype.__proto__ || Object.getPrototypeOf(AdAccount.prototype), 'deleteEdge', this).call(this, '/usersofanyaudience', params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(AdAccount.prototype.__proto__ || Object.getPrototypeOf(AdAccount.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        account_status: 'account_status',
        ad_account_creation_request: 'ad_account_creation_request',
        ad_account_promotable_objects: 'ad_account_promotable_objects',
        age: 'age',
        agency_client_declaration: 'agency_client_declaration',
        amount_spent: 'amount_spent',
        attribution_spec: 'attribution_spec',
        balance: 'balance',
        business: 'business',
        business_city: 'business_city',
        business_country_code: 'business_country_code',
        business_name: 'business_name',
        business_state: 'business_state',
        business_street: 'business_street',
        business_street2: 'business_street2',
        business_zip: 'business_zip',
        can_create_brand_lift_study: 'can_create_brand_lift_study',
        capabilities: 'capabilities',
        created_time: 'created_time',
        currency: 'currency',
        disable_reason: 'disable_reason',
        end_advertiser: 'end_advertiser',
        end_advertiser_name: 'end_advertiser_name',
        failed_delivery_checks: 'failed_delivery_checks',
        fb_entity: 'fb_entity',
        funding_source: 'funding_source',
        funding_source_details: 'funding_source_details',
        has_migrated_permissions: 'has_migrated_permissions',
        has_page_authorized_adaccount: 'has_page_authorized_adaccount',
        id: 'id',
        io_number: 'io_number',
        is_attribution_spec_system_default: 'is_attribution_spec_system_default',
        is_direct_deals_enabled: 'is_direct_deals_enabled',
        is_in_3ds_authorization_enabled_market: 'is_in_3ds_authorization_enabled_market',
        is_in_middle_of_local_entity_migration: 'is_in_middle_of_local_entity_migration',
        is_notifications_enabled: 'is_notifications_enabled',
        is_personal: 'is_personal',
        is_prepay_account: 'is_prepay_account',
        is_tax_id_required: 'is_tax_id_required',
        line_numbers: 'line_numbers',
        media_agency: 'media_agency',
        min_campaign_group_spend_cap: 'min_campaign_group_spend_cap',
        min_daily_budget: 'min_daily_budget',
        name: 'name',
        offsite_pixels_tos_accepted: 'offsite_pixels_tos_accepted',
        owner: 'owner',
        partner: 'partner',
        rf_spec: 'rf_spec',
        show_checkout_experience: 'show_checkout_experience',
        spend_cap: 'spend_cap',
        tax_id: 'tax_id',
        tax_id_status: 'tax_id_status',
        tax_id_type: 'tax_id_type',
        timezone_id: 'timezone_id',
        timezone_name: 'timezone_name',
        timezone_offset_hours_utc: 'timezone_offset_hours_utc',
        tos_accepted: 'tos_accepted',
        user_role: 'user_role',
        user_tos_accepted: 'user_tos_accepted'
      });
    }
  }, {
    key: 'Currency',
    get: function get() {
      return Object.freeze({
        aed: 'AED',
        ars: 'ARS',
        aud: 'AUD',
        bdt: 'BDT',
        bob: 'BOB',
        brl: 'BRL',
        cad: 'CAD',
        chf: 'CHF',
        clp: 'CLP',
        cny: 'CNY',
        cop: 'COP',
        crc: 'CRC',
        czk: 'CZK',
        dkk: 'DKK',
        dzd: 'DZD',
        egp: 'EGP',
        eur: 'EUR',
        gbp: 'GBP',
        gtq: 'GTQ',
        hkd: 'HKD',
        hnl: 'HNL',
        huf: 'HUF',
        idr: 'IDR',
        ils: 'ILS',
        inr: 'INR',
        isk: 'ISK',
        jpy: 'JPY',
        kes: 'KES',
        krw: 'KRW',
        mop: 'MOP',
        mxn: 'MXN',
        myr: 'MYR',
        ngn: 'NGN',
        nio: 'NIO',
        nok: 'NOK',
        nzd: 'NZD',
        pen: 'PEN',
        php: 'PHP',
        pkr: 'PKR',
        pln: 'PLN',
        pyg: 'PYG',
        qar: 'QAR',
        ron: 'RON',
        rub: 'RUB',
        sar: 'SAR',
        sek: 'SEK',
        sgd: 'SGD',
        thb: 'THB',
        try: 'TRY',
        twd: 'TWD',
        usd: 'USD',
        uyu: 'UYU',
        vnd: 'VND',
        zar: 'ZAR'
      });
    }
  }, {
    key: 'PermittedTasks',
    get: function get() {
      return Object.freeze({
        advertise: 'ADVERTISE',
        analyze: 'ANALYZE',
        manage: 'MANAGE'
      });
    }
  }, {
    key: 'Tasks',
    get: function get() {
      return Object.freeze({
        advertise: 'ADVERTISE',
        analyze: 'ANALYZE',
        manage: 'MANAGE'
      });
    }
  }, {
    key: 'ClaimObjective',
    get: function get() {
      return Object.freeze({
        automotive_model: 'AUTOMOTIVE_MODEL',
        collaborative_ads: 'COLLABORATIVE_ADS',
        home_listing: 'HOME_LISTING',
        media_title: 'MEDIA_TITLE',
        product: 'PRODUCT',
        travel: 'TRAVEL',
        vehicle: 'VEHICLE',
        vehicle_offer: 'VEHICLE_OFFER'
      });
    }
  }, {
    key: 'ContentType',
    get: function get() {
      return Object.freeze({
        automotive_model: 'AUTOMOTIVE_MODEL',
        destination: 'DESTINATION',
        flight: 'FLIGHT',
        home_listing: 'HOME_LISTING',
        hotel: 'HOTEL',
        media_title: 'MEDIA_TITLE',
        product: 'PRODUCT',
        vehicle: 'VEHICLE',
        vehicle_offer: 'VEHICLE_OFFER'
      });
    }
  }, {
    key: 'Subtype',
    get: function get() {
      return Object.freeze({
        app: 'APP',
        bag_of_accounts: 'BAG_OF_ACCOUNTS',
        claim: 'CLAIM',
        custom: 'CUSTOM',
        engagement: 'ENGAGEMENT',
        fox: 'FOX',
        lookalike: 'LOOKALIKE',
        managed: 'MANAGED',
        measurement: 'MEASUREMENT',
        offline_conversion: 'OFFLINE_CONVERSION',
        partner: 'PARTNER',
        regulated_categories_audience: 'REGULATED_CATEGORIES_AUDIENCE',
        study_rule_audience: 'STUDY_RULE_AUDIENCE',
        video: 'VIDEO',
        website: 'WEBSITE'
      });
    }
  }]);
  return AdAccount;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdAccountActivity
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdAccountActivity = function (_AbstractCrudObject) {
  inherits(AdAccountActivity, _AbstractCrudObject);

  function AdAccountActivity() {
    classCallCheck(this, AdAccountActivity);
    return possibleConstructorReturn(this, (AdAccountActivity.__proto__ || Object.getPrototypeOf(AdAccountActivity)).apply(this, arguments));
  }

  createClass(AdAccountActivity, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        billing_address_new: 'billing_address_new',
        billing_address_old: 'billing_address_old',
        created_by: 'created_by',
        created_time: 'created_time',
        credit_new: 'credit_new',
        credit_old: 'credit_old',
        credit_status_new: 'credit_status_new',
        credit_status_old: 'credit_status_old',
        currency_new: 'currency_new',
        currency_old: 'currency_old',
        daily_spend_limit_new: 'daily_spend_limit_new',
        daily_spend_limit_old: 'daily_spend_limit_old',
        event_time: 'event_time',
        event_type: 'event_type',
        funding_id_new: 'funding_id_new',
        funding_id_old: 'funding_id_old',
        grace_period_time_new: 'grace_period_time_new',
        grace_period_time_old: 'grace_period_time_old',
        id: 'id',
        manager_id_new: 'manager_id_new',
        manager_id_old: 'manager_id_old',
        name_new: 'name_new',
        name_old: 'name_old',
        spend_cap_new: 'spend_cap_new',
        spend_cap_old: 'spend_cap_old',
        status_new: 'status_new',
        status_old: 'status_old',
        terms_new: 'terms_new',
        terms_old: 'terms_old',
        tier_new: 'tier_new',
        tier_old: 'tier_old',
        time_updated_new: 'time_updated_new',
        time_updated_old: 'time_updated_old'
      });
    }
  }]);
  return AdAccountActivity;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdAccountDefaultDestination
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdAccountDefaultDestination = function (_AbstractCrudObject) {
  inherits(AdAccountDefaultDestination, _AbstractCrudObject);

  function AdAccountDefaultDestination() {
    classCallCheck(this, AdAccountDefaultDestination);
    return possibleConstructorReturn(this, (AdAccountDefaultDestination.__proto__ || Object.getPrototypeOf(AdAccountDefaultDestination)).apply(this, arguments));
  }

  createClass(AdAccountDefaultDestination, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        destination_id: 'destination_id',
        destination_url: 'destination_url'
      });
    }
  }]);
  return AdAccountDefaultDestination;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdAccountDefaultObjective
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdAccountDefaultObjective = function (_AbstractCrudObject) {
  inherits(AdAccountDefaultObjective, _AbstractCrudObject);

  function AdAccountDefaultObjective() {
    classCallCheck(this, AdAccountDefaultObjective);
    return possibleConstructorReturn(this, (AdAccountDefaultObjective.__proto__ || Object.getPrototypeOf(AdAccountDefaultObjective)).apply(this, arguments));
  }

  createClass(AdAccountDefaultObjective, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        default_objective_for_user: 'default_objective_for_user',
        objective_for_level: 'objective_for_level'
      });
    }
  }, {
    key: 'DefaultObjectiveForUser',
    get: function get() {
      return Object.freeze({
        app_installs: 'APP_INSTALLS',
        brand_awareness: 'BRAND_AWARENESS',
        canvas_app_engagement: 'CANVAS_APP_ENGAGEMENT',
        canvas_app_installs: 'CANVAS_APP_INSTALLS',
        event_responses: 'EVENT_RESPONSES',
        lead_generation: 'LEAD_GENERATION',
        link_clicks: 'LINK_CLICKS',
        local_awareness: 'LOCAL_AWARENESS',
        messages: 'MESSAGES',
        mobile_app_engagement: 'MOBILE_APP_ENGAGEMENT',
        mobile_app_installs: 'MOBILE_APP_INSTALLS',
        none: 'NONE',
        offer_claims: 'OFFER_CLAIMS',
        page_likes: 'PAGE_LIKES',
        post_engagement: 'POST_ENGAGEMENT',
        product_catalog_sales: 'PRODUCT_CATALOG_SALES',
        video_views: 'VIDEO_VIEWS',
        website_conversions: 'WEBSITE_CONVERSIONS'
      });
    }
  }, {
    key: 'ObjectiveForLevel',
    get: function get() {
      return Object.freeze({
        app_installs: 'APP_INSTALLS',
        brand_awareness: 'BRAND_AWARENESS',
        canvas_app_engagement: 'CANVAS_APP_ENGAGEMENT',
        canvas_app_installs: 'CANVAS_APP_INSTALLS',
        event_responses: 'EVENT_RESPONSES',
        lead_generation: 'LEAD_GENERATION',
        link_clicks: 'LINK_CLICKS',
        local_awareness: 'LOCAL_AWARENESS',
        messages: 'MESSAGES',
        mobile_app_engagement: 'MOBILE_APP_ENGAGEMENT',
        mobile_app_installs: 'MOBILE_APP_INSTALLS',
        none: 'NONE',
        offer_claims: 'OFFER_CLAIMS',
        page_likes: 'PAGE_LIKES',
        post_engagement: 'POST_ENGAGEMENT',
        product_catalog_sales: 'PRODUCT_CATALOG_SALES',
        video_views: 'VIDEO_VIEWS',
        website_conversions: 'WEBSITE_CONVERSIONS'
      });
    }
  }]);
  return AdAccountDefaultObjective;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdAccountPromotableObjects
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdAccountPromotableObjects = function (_AbstractCrudObject) {
  inherits(AdAccountPromotableObjects, _AbstractCrudObject);

  function AdAccountPromotableObjects() {
    classCallCheck(this, AdAccountPromotableObjects);
    return possibleConstructorReturn(this, (AdAccountPromotableObjects.__proto__ || Object.getPrototypeOf(AdAccountPromotableObjects)).apply(this, arguments));
  }

  createClass(AdAccountPromotableObjects, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        promotable_app_ids: 'promotable_app_ids',
        promotable_page_ids: 'promotable_page_ids',
        promotable_urls: 'promotable_urls'
      });
    }
  }]);
  return AdAccountPromotableObjects;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdAccountRecommendedCamapaignBudget
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdAccountRecommendedCamapaignBudget = function (_AbstractCrudObject) {
  inherits(AdAccountRecommendedCamapaignBudget, _AbstractCrudObject);

  function AdAccountRecommendedCamapaignBudget() {
    classCallCheck(this, AdAccountRecommendedCamapaignBudget);
    return possibleConstructorReturn(this, (AdAccountRecommendedCamapaignBudget.__proto__ || Object.getPrototypeOf(AdAccountRecommendedCamapaignBudget)).apply(this, arguments));
  }

  createClass(AdAccountRecommendedCamapaignBudget, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        daily: 'daily',
        lifetime: 'lifetime',
        objective: 'objective'
      });
    }
  }]);
  return AdAccountRecommendedCamapaignBudget;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdAssetFeedSpec
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdAssetFeedSpec = function (_AbstractCrudObject) {
  inherits(AdAssetFeedSpec, _AbstractCrudObject);

  function AdAssetFeedSpec() {
    classCallCheck(this, AdAssetFeedSpec);
    return possibleConstructorReturn(this, (AdAssetFeedSpec.__proto__ || Object.getPrototypeOf(AdAssetFeedSpec)).apply(this, arguments));
  }

  createClass(AdAssetFeedSpec, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        ad_formats: 'ad_formats',
        additional_data: 'additional_data',
        asset_customization_rules: 'asset_customization_rules',
        autotranslate: 'autotranslate',
        bodies: 'bodies',
        call_to_action_types: 'call_to_action_types',
        captions: 'captions',
        descriptions: 'descriptions',
        groups: 'groups',
        images: 'images',
        link_urls: 'link_urls',
        optimization_type: 'optimization_type',
        titles: 'titles',
        videos: 'videos'
      });
    }
  }, {
    key: 'CallToActionTypes',
    get: function get() {
      return Object.freeze({
        add_to_cart: 'ADD_TO_CART',
        apply_now: 'APPLY_NOW',
        book_travel: 'BOOK_TRAVEL',
        buy: 'BUY',
        buy_now: 'BUY_NOW',
        buy_tickets: 'BUY_TICKETS',
        call: 'CALL',
        call_me: 'CALL_ME',
        contact: 'CONTACT',
        contact_us: 'CONTACT_US',
        donate: 'DONATE',
        donate_now: 'DONATE_NOW',
        download: 'DOWNLOAD',
        event_rsvp: 'EVENT_RSVP',
        find_a_group: 'FIND_A_GROUP',
        find_your_groups: 'FIND_YOUR_GROUPS',
        follow_news_storyline: 'FOLLOW_NEWS_STORYLINE',
        get_directions: 'GET_DIRECTIONS',
        get_offer: 'GET_OFFER',
        get_offer_view: 'GET_OFFER_VIEW',
        get_quote: 'GET_QUOTE',
        get_showtimes: 'GET_SHOWTIMES',
        install_app: 'INSTALL_APP',
        install_mobile_app: 'INSTALL_MOBILE_APP',
        learn_more: 'LEARN_MORE',
        like_page: 'LIKE_PAGE',
        listen_music: 'LISTEN_MUSIC',
        listen_now: 'LISTEN_NOW',
        message_page: 'MESSAGE_PAGE',
        mobile_download: 'MOBILE_DOWNLOAD',
        moments: 'MOMENTS',
        no_button: 'NO_BUTTON',
        open_link: 'OPEN_LINK',
        order_now: 'ORDER_NOW',
        play_game: 'PLAY_GAME',
        record_now: 'RECORD_NOW',
        say_thanks: 'SAY_THANKS',
        see_more: 'SEE_MORE',
        sell_now: 'SELL_NOW',
        share: 'SHARE',
        shop_now: 'SHOP_NOW',
        sign_up: 'SIGN_UP',
        sotto_subscribe: 'SOTTO_SUBSCRIBE',
        subscribe: 'SUBSCRIBE',
        update_app: 'UPDATE_APP',
        use_app: 'USE_APP',
        use_mobile_app: 'USE_MOBILE_APP',
        video_annotation: 'VIDEO_ANNOTATION',
        visit_pages_feed: 'VISIT_PAGES_FEED',
        watch_more: 'WATCH_MORE',
        watch_video: 'WATCH_VIDEO',
        whatsapp_message: 'WHATSAPP_MESSAGE',
        woodhenge_support: 'WOODHENGE_SUPPORT'
      });
    }
  }]);
  return AdAssetFeedSpec;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdAssetFeedSpecAssetLabel
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdAssetFeedSpecAssetLabel = function (_AbstractCrudObject) {
  inherits(AdAssetFeedSpecAssetLabel, _AbstractCrudObject);

  function AdAssetFeedSpecAssetLabel() {
    classCallCheck(this, AdAssetFeedSpecAssetLabel);
    return possibleConstructorReturn(this, (AdAssetFeedSpecAssetLabel.__proto__ || Object.getPrototypeOf(AdAssetFeedSpecAssetLabel)).apply(this, arguments));
  }

  createClass(AdAssetFeedSpecAssetLabel, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        id: 'id',
        name: 'name'
      });
    }
  }]);
  return AdAssetFeedSpecAssetLabel;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdAssetFeedSpecBody
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdAssetFeedSpecBody = function (_AbstractCrudObject) {
  inherits(AdAssetFeedSpecBody, _AbstractCrudObject);

  function AdAssetFeedSpecBody() {
    classCallCheck(this, AdAssetFeedSpecBody);
    return possibleConstructorReturn(this, (AdAssetFeedSpecBody.__proto__ || Object.getPrototypeOf(AdAssetFeedSpecBody)).apply(this, arguments));
  }

  createClass(AdAssetFeedSpecBody, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        adlabels: 'adlabels',
        text: 'text',
        url_tags: 'url_tags'
      });
    }
  }]);
  return AdAssetFeedSpecBody;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdAssetFeedSpecCaption
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdAssetFeedSpecCaption = function (_AbstractCrudObject) {
  inherits(AdAssetFeedSpecCaption, _AbstractCrudObject);

  function AdAssetFeedSpecCaption() {
    classCallCheck(this, AdAssetFeedSpecCaption);
    return possibleConstructorReturn(this, (AdAssetFeedSpecCaption.__proto__ || Object.getPrototypeOf(AdAssetFeedSpecCaption)).apply(this, arguments));
  }

  createClass(AdAssetFeedSpecCaption, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        adlabels: 'adlabels',
        text: 'text',
        url_tags: 'url_tags'
      });
    }
  }]);
  return AdAssetFeedSpecCaption;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdAssetFeedSpecDescription
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdAssetFeedSpecDescription = function (_AbstractCrudObject) {
  inherits(AdAssetFeedSpecDescription, _AbstractCrudObject);

  function AdAssetFeedSpecDescription() {
    classCallCheck(this, AdAssetFeedSpecDescription);
    return possibleConstructorReturn(this, (AdAssetFeedSpecDescription.__proto__ || Object.getPrototypeOf(AdAssetFeedSpecDescription)).apply(this, arguments));
  }

  createClass(AdAssetFeedSpecDescription, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        adlabels: 'adlabels',
        text: 'text',
        url_tags: 'url_tags'
      });
    }
  }]);
  return AdAssetFeedSpecDescription;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdAssetFeedSpecGroupRule
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdAssetFeedSpecGroupRule = function (_AbstractCrudObject) {
  inherits(AdAssetFeedSpecGroupRule, _AbstractCrudObject);

  function AdAssetFeedSpecGroupRule() {
    classCallCheck(this, AdAssetFeedSpecGroupRule);
    return possibleConstructorReturn(this, (AdAssetFeedSpecGroupRule.__proto__ || Object.getPrototypeOf(AdAssetFeedSpecGroupRule)).apply(this, arguments));
  }

  createClass(AdAssetFeedSpecGroupRule, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        body_label: 'body_label',
        caption_label: 'caption_label',
        description_label: 'description_label',
        image_label: 'image_label',
        link_url_label: 'link_url_label',
        title_label: 'title_label',
        video_label: 'video_label'
      });
    }
  }]);
  return AdAssetFeedSpecGroupRule;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdAssetFeedSpecImage
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdAssetFeedSpecImage = function (_AbstractCrudObject) {
  inherits(AdAssetFeedSpecImage, _AbstractCrudObject);

  function AdAssetFeedSpecImage() {
    classCallCheck(this, AdAssetFeedSpecImage);
    return possibleConstructorReturn(this, (AdAssetFeedSpecImage.__proto__ || Object.getPrototypeOf(AdAssetFeedSpecImage)).apply(this, arguments));
  }

  createClass(AdAssetFeedSpecImage, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        adlabels: 'adlabels',
        hash: 'hash',
        image_crops: 'image_crops',
        url: 'url',
        url_tags: 'url_tags'
      });
    }
  }]);
  return AdAssetFeedSpecImage;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdAssetFeedSpecLinkURL
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdAssetFeedSpecLinkURL = function (_AbstractCrudObject) {
  inherits(AdAssetFeedSpecLinkURL, _AbstractCrudObject);

  function AdAssetFeedSpecLinkURL() {
    classCallCheck(this, AdAssetFeedSpecLinkURL);
    return possibleConstructorReturn(this, (AdAssetFeedSpecLinkURL.__proto__ || Object.getPrototypeOf(AdAssetFeedSpecLinkURL)).apply(this, arguments));
  }

  createClass(AdAssetFeedSpecLinkURL, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        adlabels: 'adlabels',
        carousel_see_more_url: 'carousel_see_more_url',
        deeplink_url: 'deeplink_url',
        display_url: 'display_url',
        url_tags: 'url_tags',
        website_url: 'website_url'
      });
    }
  }]);
  return AdAssetFeedSpecLinkURL;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdAssetFeedSpecTitle
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdAssetFeedSpecTitle = function (_AbstractCrudObject) {
  inherits(AdAssetFeedSpecTitle, _AbstractCrudObject);

  function AdAssetFeedSpecTitle() {
    classCallCheck(this, AdAssetFeedSpecTitle);
    return possibleConstructorReturn(this, (AdAssetFeedSpecTitle.__proto__ || Object.getPrototypeOf(AdAssetFeedSpecTitle)).apply(this, arguments));
  }

  createClass(AdAssetFeedSpecTitle, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        adlabels: 'adlabels',
        text: 'text',
        url_tags: 'url_tags'
      });
    }
  }]);
  return AdAssetFeedSpecTitle;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdAssetFeedSpecVideo
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdAssetFeedSpecVideo = function (_AbstractCrudObject) {
  inherits(AdAssetFeedSpecVideo, _AbstractCrudObject);

  function AdAssetFeedSpecVideo() {
    classCallCheck(this, AdAssetFeedSpecVideo);
    return possibleConstructorReturn(this, (AdAssetFeedSpecVideo.__proto__ || Object.getPrototypeOf(AdAssetFeedSpecVideo)).apply(this, arguments));
  }

  createClass(AdAssetFeedSpecVideo, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        adlabels: 'adlabels',
        caption_ids: 'caption_ids',
        thumbnail_hash: 'thumbnail_hash',
        thumbnail_url: 'thumbnail_url',
        url_tags: 'url_tags',
        video_id: 'video_id'
      });
    }
  }]);
  return AdAssetFeedSpecVideo;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdAsyncRequestSetNotificationResult
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdAsyncRequestSetNotificationResult = function (_AbstractCrudObject) {
  inherits(AdAsyncRequestSetNotificationResult, _AbstractCrudObject);

  function AdAsyncRequestSetNotificationResult() {
    classCallCheck(this, AdAsyncRequestSetNotificationResult);
    return possibleConstructorReturn(this, (AdAsyncRequestSetNotificationResult.__proto__ || Object.getPrototypeOf(AdAsyncRequestSetNotificationResult)).apply(this, arguments));
  }

  createClass(AdAsyncRequestSetNotificationResult, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        response: 'response',
        status: 'status'
      });
    }
  }]);
  return AdAsyncRequestSetNotificationResult;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdBidAdjustments
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdBidAdjustments = function (_AbstractCrudObject) {
  inherits(AdBidAdjustments, _AbstractCrudObject);

  function AdBidAdjustments() {
    classCallCheck(this, AdBidAdjustments);
    return possibleConstructorReturn(this, (AdBidAdjustments.__proto__ || Object.getPrototypeOf(AdBidAdjustments)).apply(this, arguments));
  }

  createClass(AdBidAdjustments, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        age_range: 'age_range',
        page_types: 'page_types',
        user_groups: 'user_groups'
      });
    }
  }]);
  return AdBidAdjustments;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCampaignActivity
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCampaignActivity = function (_AbstractCrudObject) {
  inherits(AdCampaignActivity, _AbstractCrudObject);

  function AdCampaignActivity() {
    classCallCheck(this, AdCampaignActivity);
    return possibleConstructorReturn(this, (AdCampaignActivity.__proto__ || Object.getPrototypeOf(AdCampaignActivity)).apply(this, arguments));
  }

  createClass(AdCampaignActivity, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        auto_create_lookalike_new: 'auto_create_lookalike_new',
        auto_create_lookalike_old: 'auto_create_lookalike_old',
        bid_adjustments_spec_new: 'bid_adjustments_spec_new',
        bid_adjustments_spec_old: 'bid_adjustments_spec_old',
        bid_amount_new: 'bid_amount_new',
        bid_amount_old: 'bid_amount_old',
        bid_constraints_new: 'bid_constraints_new',
        bid_constraints_old: 'bid_constraints_old',
        bid_info_new: 'bid_info_new',
        bid_info_old: 'bid_info_old',
        bid_strategy_new: 'bid_strategy_new',
        bid_strategy_old: 'bid_strategy_old',
        bid_type_new: 'bid_type_new',
        bid_type_old: 'bid_type_old',
        billing_event_new: 'billing_event_new',
        billing_event_old: 'billing_event_old',
        brande_audience_id_new: 'brande_audience_id_new',
        brande_audience_id_old: 'brande_audience_id_old',
        budget_limit_new: 'budget_limit_new',
        budget_limit_old: 'budget_limit_old',
        created_time: 'created_time',
        daily_impressions_new: 'daily_impressions_new',
        daily_impressions_old: 'daily_impressions_old',
        dco_mode_new: 'dco_mode_new',
        dco_mode_old: 'dco_mode_old',
        delivery_behavior_new: 'delivery_behavior_new',
        delivery_behavior_old: 'delivery_behavior_old',
        destination_type_new: 'destination_type_new',
        destination_type_old: 'destination_type_old',
        event_time: 'event_time',
        event_type: 'event_type',
        id: 'id',
        invoicing_limit_new: 'invoicing_limit_new',
        invoicing_limit_old: 'invoicing_limit_old',
        min_spend_target_new: 'min_spend_target_new',
        min_spend_target_old: 'min_spend_target_old',
        name_new: 'name_new',
        name_old: 'name_old',
        optimization_goal_new: 'optimization_goal_new',
        optimization_goal_old: 'optimization_goal_old',
        pacing_type_new: 'pacing_type_new',
        pacing_type_old: 'pacing_type_old',
        run_status_new: 'run_status_new',
        run_status_old: 'run_status_old',
        schedule_new: 'schedule_new',
        schedule_old: 'schedule_old',
        spend_cap_new: 'spend_cap_new',
        spend_cap_old: 'spend_cap_old',
        start_time_new: 'start_time_new',
        start_time_old: 'start_time_old',
        stop_time_new: 'stop_time_new',
        stop_time_old: 'stop_time_old',
        targeting_expansion_new: 'targeting_expansion_new',
        targeting_expansion_old: 'targeting_expansion_old',
        updated_time_new: 'updated_time_new',
        updated_time_old: 'updated_time_old'
      });
    }
  }, {
    key: 'BidStrategyNew',
    get: function get() {
      return Object.freeze({
        lowest_cost_without_cap: 'LOWEST_COST_WITHOUT_CAP',
        lowest_cost_with_bid_cap: 'LOWEST_COST_WITH_BID_CAP',
        target_cost: 'TARGET_COST'
      });
    }
  }, {
    key: 'BidStrategyOld',
    get: function get() {
      return Object.freeze({
        lowest_cost_without_cap: 'LOWEST_COST_WITHOUT_CAP',
        lowest_cost_with_bid_cap: 'LOWEST_COST_WITH_BID_CAP',
        target_cost: 'TARGET_COST'
      });
    }
  }, {
    key: 'BillingEventNew',
    get: function get() {
      return Object.freeze({
        app_installs: 'APP_INSTALLS',
        clicks: 'CLICKS',
        impressions: 'IMPRESSIONS',
        link_clicks: 'LINK_CLICKS',
        none: 'NONE',
        offer_claims: 'OFFER_CLAIMS',
        page_likes: 'PAGE_LIKES',
        post_engagement: 'POST_ENGAGEMENT',
        thruplay: 'THRUPLAY',
        video_views: 'VIDEO_VIEWS'
      });
    }
  }, {
    key: 'BillingEventOld',
    get: function get() {
      return Object.freeze({
        app_installs: 'APP_INSTALLS',
        clicks: 'CLICKS',
        impressions: 'IMPRESSIONS',
        link_clicks: 'LINK_CLICKS',
        none: 'NONE',
        offer_claims: 'OFFER_CLAIMS',
        page_likes: 'PAGE_LIKES',
        post_engagement: 'POST_ENGAGEMENT',
        thruplay: 'THRUPLAY',
        video_views: 'VIDEO_VIEWS'
      });
    }
  }, {
    key: 'OptimizationGoalNew',
    get: function get() {
      return Object.freeze({
        ad_recall_lift: 'AD_RECALL_LIFT',
        app_downloads: 'APP_DOWNLOADS',
        app_installs: 'APP_INSTALLS',
        brand_awareness: 'BRAND_AWARENESS',
        clicks: 'CLICKS',
        derived_events: 'DERIVED_EVENTS',
        engaged_users: 'ENGAGED_USERS',
        event_responses: 'EVENT_RESPONSES',
        impressions: 'IMPRESSIONS',
        landing_page_views: 'LANDING_PAGE_VIEWS',
        lead_generation: 'LEAD_GENERATION',
        link_clicks: 'LINK_CLICKS',
        none: 'NONE',
        offer_claims: 'OFFER_CLAIMS',
        offsite_conversions: 'OFFSITE_CONVERSIONS',
        page_engagement: 'PAGE_ENGAGEMENT',
        page_likes: 'PAGE_LIKES',
        post_engagement: 'POST_ENGAGEMENT',
        reach: 'REACH',
        replies: 'REPLIES',
        social_impressions: 'SOCIAL_IMPRESSIONS',
        thruplay: 'THRUPLAY',
        two_second_continuous_video_views: 'TWO_SECOND_CONTINUOUS_VIDEO_VIEWS',
        value: 'VALUE',
        video_views: 'VIDEO_VIEWS'
      });
    }
  }, {
    key: 'OptimizationGoalOld',
    get: function get() {
      return Object.freeze({
        ad_recall_lift: 'AD_RECALL_LIFT',
        app_downloads: 'APP_DOWNLOADS',
        app_installs: 'APP_INSTALLS',
        brand_awareness: 'BRAND_AWARENESS',
        clicks: 'CLICKS',
        derived_events: 'DERIVED_EVENTS',
        engaged_users: 'ENGAGED_USERS',
        event_responses: 'EVENT_RESPONSES',
        impressions: 'IMPRESSIONS',
        landing_page_views: 'LANDING_PAGE_VIEWS',
        lead_generation: 'LEAD_GENERATION',
        link_clicks: 'LINK_CLICKS',
        none: 'NONE',
        offer_claims: 'OFFER_CLAIMS',
        offsite_conversions: 'OFFSITE_CONVERSIONS',
        page_engagement: 'PAGE_ENGAGEMENT',
        page_likes: 'PAGE_LIKES',
        post_engagement: 'POST_ENGAGEMENT',
        reach: 'REACH',
        replies: 'REPLIES',
        social_impressions: 'SOCIAL_IMPRESSIONS',
        thruplay: 'THRUPLAY',
        two_second_continuous_video_views: 'TWO_SECOND_CONTINUOUS_VIDEO_VIEWS',
        value: 'VALUE',
        video_views: 'VIDEO_VIEWS'
      });
    }
  }]);
  return AdCampaignActivity;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCampaignBidConstraint
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCampaignBidConstraint = function (_AbstractCrudObject) {
  inherits(AdCampaignBidConstraint, _AbstractCrudObject);

  function AdCampaignBidConstraint() {
    classCallCheck(this, AdCampaignBidConstraint);
    return possibleConstructorReturn(this, (AdCampaignBidConstraint.__proto__ || Object.getPrototypeOf(AdCampaignBidConstraint)).apply(this, arguments));
  }

  createClass(AdCampaignBidConstraint, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        roas_average_floor: 'roas_average_floor'
      });
    }
  }]);
  return AdCampaignBidConstraint;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCampaignDeliveryStatsUnsupportedReasons
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCampaignDeliveryStatsUnsupportedReasons = function (_AbstractCrudObject) {
  inherits(AdCampaignDeliveryStatsUnsupportedReasons, _AbstractCrudObject);

  function AdCampaignDeliveryStatsUnsupportedReasons() {
    classCallCheck(this, AdCampaignDeliveryStatsUnsupportedReasons);
    return possibleConstructorReturn(this, (AdCampaignDeliveryStatsUnsupportedReasons.__proto__ || Object.getPrototypeOf(AdCampaignDeliveryStatsUnsupportedReasons)).apply(this, arguments));
  }

  createClass(AdCampaignDeliveryStatsUnsupportedReasons, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        reason_data: 'reason_data',
        reason_type: 'reason_type'
      });
    }
  }]);
  return AdCampaignDeliveryStatsUnsupportedReasons;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCampaignFrequencyControlSpecs
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCampaignFrequencyControlSpecs = function (_AbstractCrudObject) {
  inherits(AdCampaignFrequencyControlSpecs, _AbstractCrudObject);

  function AdCampaignFrequencyControlSpecs() {
    classCallCheck(this, AdCampaignFrequencyControlSpecs);
    return possibleConstructorReturn(this, (AdCampaignFrequencyControlSpecs.__proto__ || Object.getPrototypeOf(AdCampaignFrequencyControlSpecs)).apply(this, arguments));
  }

  createClass(AdCampaignFrequencyControlSpecs, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        event: 'event',
        interval_days: 'interval_days',
        max_frequency: 'max_frequency'
      });
    }
  }]);
  return AdCampaignFrequencyControlSpecs;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCampaignGroupActivity
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCampaignGroupActivity = function (_AbstractCrudObject) {
  inherits(AdCampaignGroupActivity, _AbstractCrudObject);

  function AdCampaignGroupActivity() {
    classCallCheck(this, AdCampaignGroupActivity);
    return possibleConstructorReturn(this, (AdCampaignGroupActivity.__proto__ || Object.getPrototypeOf(AdCampaignGroupActivity)).apply(this, arguments));
  }

  createClass(AdCampaignGroupActivity, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        budget_limit_new: 'budget_limit_new',
        budget_limit_old: 'budget_limit_old',
        buying_type_new: 'buying_type_new',
        buying_type_old: 'buying_type_old',
        event_time: 'event_time',
        event_type: 'event_type',
        id: 'id',
        is_autobid_new: 'is_autobid_new',
        is_autobid_old: 'is_autobid_old',
        is_average_price_pacing_new: 'is_average_price_pacing_new',
        is_average_price_pacing_old: 'is_average_price_pacing_old',
        name_new: 'name_new',
        name_old: 'name_old',
        objective_new: 'objective_new',
        objective_old: 'objective_old',
        pacing_type: 'pacing_type',
        run_status_new: 'run_status_new',
        run_status_old: 'run_status_old',
        spend_cap_new: 'spend_cap_new',
        spend_cap_old: 'spend_cap_old',
        time_created: 'time_created',
        time_updated_new: 'time_updated_new',
        time_updated_old: 'time_updated_old'
      });
    }
  }, {
    key: 'ObjectiveNew',
    get: function get() {
      return Object.freeze({
        app_installs: 'APP_INSTALLS',
        brand_awareness: 'BRAND_AWARENESS',
        canvas_app_engagement: 'CANVAS_APP_ENGAGEMENT',
        canvas_app_installs: 'CANVAS_APP_INSTALLS',
        event_responses: 'EVENT_RESPONSES',
        lead_generation: 'LEAD_GENERATION',
        link_clicks: 'LINK_CLICKS',
        local_awareness: 'LOCAL_AWARENESS',
        messages: 'MESSAGES',
        mobile_app_engagement: 'MOBILE_APP_ENGAGEMENT',
        mobile_app_installs: 'MOBILE_APP_INSTALLS',
        none: 'NONE',
        offer_claims: 'OFFER_CLAIMS',
        page_likes: 'PAGE_LIKES',
        post_engagement: 'POST_ENGAGEMENT',
        product_catalog_sales: 'PRODUCT_CATALOG_SALES',
        video_views: 'VIDEO_VIEWS',
        website_conversions: 'WEBSITE_CONVERSIONS'
      });
    }
  }, {
    key: 'ObjectiveOld',
    get: function get() {
      return Object.freeze({
        app_installs: 'APP_INSTALLS',
        brand_awareness: 'BRAND_AWARENESS',
        canvas_app_engagement: 'CANVAS_APP_ENGAGEMENT',
        canvas_app_installs: 'CANVAS_APP_INSTALLS',
        event_responses: 'EVENT_RESPONSES',
        lead_generation: 'LEAD_GENERATION',
        link_clicks: 'LINK_CLICKS',
        local_awareness: 'LOCAL_AWARENESS',
        messages: 'MESSAGES',
        mobile_app_engagement: 'MOBILE_APP_ENGAGEMENT',
        mobile_app_installs: 'MOBILE_APP_INSTALLS',
        none: 'NONE',
        offer_claims: 'OFFER_CLAIMS',
        page_likes: 'PAGE_LIKES',
        post_engagement: 'POST_ENGAGEMENT',
        product_catalog_sales: 'PRODUCT_CATALOG_SALES',
        video_views: 'VIDEO_VIEWS',
        website_conversions: 'WEBSITE_CONVERSIONS'
      });
    }
  }]);
  return AdCampaignGroupActivity;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCampaignIssuesInfo
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCampaignIssuesInfo = function (_AbstractCrudObject) {
  inherits(AdCampaignIssuesInfo, _AbstractCrudObject);

  function AdCampaignIssuesInfo() {
    classCallCheck(this, AdCampaignIssuesInfo);
    return possibleConstructorReturn(this, (AdCampaignIssuesInfo.__proto__ || Object.getPrototypeOf(AdCampaignIssuesInfo)).apply(this, arguments));
  }

  createClass(AdCampaignIssuesInfo, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        error_code: 'error_code',
        error_message: 'error_message',
        error_summary: 'error_summary',
        level: 'level'
      });
    }
  }]);
  return AdCampaignIssuesInfo;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCampaignLearningStageInfo
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCampaignLearningStageInfo = function (_AbstractCrudObject) {
  inherits(AdCampaignLearningStageInfo, _AbstractCrudObject);

  function AdCampaignLearningStageInfo() {
    classCallCheck(this, AdCampaignLearningStageInfo);
    return possibleConstructorReturn(this, (AdCampaignLearningStageInfo.__proto__ || Object.getPrototypeOf(AdCampaignLearningStageInfo)).apply(this, arguments));
  }

  createClass(AdCampaignLearningStageInfo, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        attribution_windows: 'attribution_windows',
        conversions: 'conversions',
        exit_reason: 'exit_reason',
        last_sig_edit_ts: 'last_sig_edit_ts',
        status: 'status',
        types: 'types'
      });
    }
  }]);
  return AdCampaignLearningStageInfo;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCampaignOptimizationEvent
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCampaignOptimizationEvent = function (_AbstractCrudObject) {
  inherits(AdCampaignOptimizationEvent, _AbstractCrudObject);

  function AdCampaignOptimizationEvent() {
    classCallCheck(this, AdCampaignOptimizationEvent);
    return possibleConstructorReturn(this, (AdCampaignOptimizationEvent.__proto__ || Object.getPrototypeOf(AdCampaignOptimizationEvent)).apply(this, arguments));
  }

  createClass(AdCampaignOptimizationEvent, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        custom_conversion_id: 'custom_conversion_id',
        event_sequence: 'event_sequence',
        event_type: 'event_type'
      });
    }
  }]);
  return AdCampaignOptimizationEvent;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCampaignPacedBidInfo
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCampaignPacedBidInfo = function (_AbstractCrudObject) {
  inherits(AdCampaignPacedBidInfo, _AbstractCrudObject);

  function AdCampaignPacedBidInfo() {
    classCallCheck(this, AdCampaignPacedBidInfo);
    return possibleConstructorReturn(this, (AdCampaignPacedBidInfo.__proto__ || Object.getPrototypeOf(AdCampaignPacedBidInfo)).apply(this, arguments));
  }

  createClass(AdCampaignPacedBidInfo, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        bidding_status: 'bidding_status'
      });
    }
  }]);
  return AdCampaignPacedBidInfo;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCreativeCollectionThumbnailInfo
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCreativeCollectionThumbnailInfo = function (_AbstractCrudObject) {
  inherits(AdCreativeCollectionThumbnailInfo, _AbstractCrudObject);

  function AdCreativeCollectionThumbnailInfo() {
    classCallCheck(this, AdCreativeCollectionThumbnailInfo);
    return possibleConstructorReturn(this, (AdCreativeCollectionThumbnailInfo.__proto__ || Object.getPrototypeOf(AdCreativeCollectionThumbnailInfo)).apply(this, arguments));
  }

  createClass(AdCreativeCollectionThumbnailInfo, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        element_child_index: 'element_child_index',
        element_crops: 'element_crops',
        element_id: 'element_id'
      });
    }
  }]);
  return AdCreativeCollectionThumbnailInfo;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCreativeDegreesOfFreedomSpec
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCreativeDegreesOfFreedomSpec = function (_AbstractCrudObject) {
  inherits(AdCreativeDegreesOfFreedomSpec, _AbstractCrudObject);

  function AdCreativeDegreesOfFreedomSpec() {
    classCallCheck(this, AdCreativeDegreesOfFreedomSpec);
    return possibleConstructorReturn(this, (AdCreativeDegreesOfFreedomSpec.__proto__ || Object.getPrototypeOf(AdCreativeDegreesOfFreedomSpec)).apply(this, arguments));
  }

  createClass(AdCreativeDegreesOfFreedomSpec, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        degrees_of_freedom_type: 'degrees_of_freedom_type'
      });
    }
  }]);
  return AdCreativeDegreesOfFreedomSpec;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCreativeInteractiveComponentsSpec
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCreativeInteractiveComponentsSpec = function (_AbstractCrudObject) {
  inherits(AdCreativeInteractiveComponentsSpec, _AbstractCrudObject);

  function AdCreativeInteractiveComponentsSpec() {
    classCallCheck(this, AdCreativeInteractiveComponentsSpec);
    return possibleConstructorReturn(this, (AdCreativeInteractiveComponentsSpec.__proto__ || Object.getPrototypeOf(AdCreativeInteractiveComponentsSpec)).apply(this, arguments));
  }

  createClass(AdCreativeInteractiveComponentsSpec, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        components: 'components'
      });
    }
  }]);
  return AdCreativeInteractiveComponentsSpec;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCreativeLinkData
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCreativeLinkData = function (_AbstractCrudObject) {
  inherits(AdCreativeLinkData, _AbstractCrudObject);

  function AdCreativeLinkData() {
    classCallCheck(this, AdCreativeLinkData);
    return possibleConstructorReturn(this, (AdCreativeLinkData.__proto__ || Object.getPrototypeOf(AdCreativeLinkData)).apply(this, arguments));
  }

  createClass(AdCreativeLinkData, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        additional_image_index: 'additional_image_index',
        app_link_spec: 'app_link_spec',
        attachment_style: 'attachment_style',
        branded_content_shared_to_sponsor_status: 'branded_content_shared_to_sponsor_status',
        branded_content_sponsor_page_id: 'branded_content_sponsor_page_id',
        branded_content_sponsor_relationship: 'branded_content_sponsor_relationship',
        call_to_action: 'call_to_action',
        caption: 'caption',
        child_attachments: 'child_attachments',
        collection_thumbnails: 'collection_thumbnails',
        customization_rules_spec: 'customization_rules_spec',
        description: 'description',
        event_id: 'event_id',
        force_single_link: 'force_single_link',
        format_option: 'format_option',
        image_crops: 'image_crops',
        image_hash: 'image_hash',
        image_layer_specs: 'image_layer_specs',
        image_overlay_spec: 'image_overlay_spec',
        link: 'link',
        message: 'message',
        multi_share_end_card: 'multi_share_end_card',
        multi_share_optimized: 'multi_share_optimized',
        name: 'name',
        offer_id: 'offer_id',
        page_welcome_message: 'page_welcome_message',
        picture: 'picture',
        post_click_configuration: 'post_click_configuration',
        preferred_image_tags: 'preferred_image_tags',
        retailer_item_ids: 'retailer_item_ids',
        show_multiple_images: 'show_multiple_images',
        static_fallback_spec: 'static_fallback_spec',
        use_flexible_image_aspect_ratio: 'use_flexible_image_aspect_ratio'
      });
    }
  }, {
    key: 'AttachmentStyle',
    get: function get() {
      return Object.freeze({
        default: 'default',
        link: 'link'
      });
    }
  }, {
    key: 'FormatOption',
    get: function get() {
      return Object.freeze({
        carousel_images_multi_items: 'carousel_images_multi_items',
        carousel_images_single_item: 'carousel_images_single_item',
        carousel_slideshows: 'carousel_slideshows',
        single_image: 'single_image'
      });
    }
  }]);
  return AdCreativeLinkData;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCreativeLinkDataAppLinkSpec
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCreativeLinkDataAppLinkSpec = function (_AbstractCrudObject) {
  inherits(AdCreativeLinkDataAppLinkSpec, _AbstractCrudObject);

  function AdCreativeLinkDataAppLinkSpec() {
    classCallCheck(this, AdCreativeLinkDataAppLinkSpec);
    return possibleConstructorReturn(this, (AdCreativeLinkDataAppLinkSpec.__proto__ || Object.getPrototypeOf(AdCreativeLinkDataAppLinkSpec)).apply(this, arguments));
  }

  createClass(AdCreativeLinkDataAppLinkSpec, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        android: 'android',
        ios: 'ios',
        ipad: 'ipad',
        iphone: 'iphone'
      });
    }
  }]);
  return AdCreativeLinkDataAppLinkSpec;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCreativeLinkDataCallToAction
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCreativeLinkDataCallToAction = function (_AbstractCrudObject) {
  inherits(AdCreativeLinkDataCallToAction, _AbstractCrudObject);

  function AdCreativeLinkDataCallToAction() {
    classCallCheck(this, AdCreativeLinkDataCallToAction);
    return possibleConstructorReturn(this, (AdCreativeLinkDataCallToAction.__proto__ || Object.getPrototypeOf(AdCreativeLinkDataCallToAction)).apply(this, arguments));
  }

  createClass(AdCreativeLinkDataCallToAction, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        type: 'type',
        value: 'value'
      });
    }
  }, {
    key: 'Type',
    get: function get() {
      return Object.freeze({
        add_to_cart: 'ADD_TO_CART',
        apply_now: 'APPLY_NOW',
        book_travel: 'BOOK_TRAVEL',
        buy: 'BUY',
        buy_now: 'BUY_NOW',
        buy_tickets: 'BUY_TICKETS',
        call: 'CALL',
        call_me: 'CALL_ME',
        contact: 'CONTACT',
        contact_us: 'CONTACT_US',
        donate: 'DONATE',
        donate_now: 'DONATE_NOW',
        download: 'DOWNLOAD',
        event_rsvp: 'EVENT_RSVP',
        find_a_group: 'FIND_A_GROUP',
        find_your_groups: 'FIND_YOUR_GROUPS',
        follow_news_storyline: 'FOLLOW_NEWS_STORYLINE',
        get_directions: 'GET_DIRECTIONS',
        get_offer: 'GET_OFFER',
        get_offer_view: 'GET_OFFER_VIEW',
        get_quote: 'GET_QUOTE',
        get_showtimes: 'GET_SHOWTIMES',
        install_app: 'INSTALL_APP',
        install_mobile_app: 'INSTALL_MOBILE_APP',
        learn_more: 'LEARN_MORE',
        like_page: 'LIKE_PAGE',
        listen_music: 'LISTEN_MUSIC',
        listen_now: 'LISTEN_NOW',
        message_page: 'MESSAGE_PAGE',
        mobile_download: 'MOBILE_DOWNLOAD',
        moments: 'MOMENTS',
        no_button: 'NO_BUTTON',
        open_link: 'OPEN_LINK',
        order_now: 'ORDER_NOW',
        play_game: 'PLAY_GAME',
        record_now: 'RECORD_NOW',
        say_thanks: 'SAY_THANKS',
        see_more: 'SEE_MORE',
        sell_now: 'SELL_NOW',
        share: 'SHARE',
        shop_now: 'SHOP_NOW',
        sign_up: 'SIGN_UP',
        sotto_subscribe: 'SOTTO_SUBSCRIBE',
        subscribe: 'SUBSCRIBE',
        update_app: 'UPDATE_APP',
        use_app: 'USE_APP',
        use_mobile_app: 'USE_MOBILE_APP',
        video_annotation: 'VIDEO_ANNOTATION',
        visit_pages_feed: 'VISIT_PAGES_FEED',
        watch_more: 'WATCH_MORE',
        watch_video: 'WATCH_VIDEO',
        whatsapp_message: 'WHATSAPP_MESSAGE',
        woodhenge_support: 'WOODHENGE_SUPPORT'
      });
    }
  }]);
  return AdCreativeLinkDataCallToAction;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCreativeLinkDataCallToActionValue
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCreativeLinkDataCallToActionValue = function (_AbstractCrudObject) {
  inherits(AdCreativeLinkDataCallToActionValue, _AbstractCrudObject);

  function AdCreativeLinkDataCallToActionValue() {
    classCallCheck(this, AdCreativeLinkDataCallToActionValue);
    return possibleConstructorReturn(this, (AdCreativeLinkDataCallToActionValue.__proto__ || Object.getPrototypeOf(AdCreativeLinkDataCallToActionValue)).apply(this, arguments));
  }

  createClass(AdCreativeLinkDataCallToActionValue, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        app_destination: 'app_destination',
        app_link: 'app_link',
        application: 'application',
        event_id: 'event_id',
        lead_gen_form_id: 'lead_gen_form_id',
        link: 'link',
        link_caption: 'link_caption',
        link_format: 'link_format',
        page: 'page',
        product_link: 'product_link',
        whatsapp_number: 'whatsapp_number'
      });
    }
  }]);
  return AdCreativeLinkDataCallToActionValue;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCreativeLinkDataChildAttachment
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCreativeLinkDataChildAttachment = function (_AbstractCrudObject) {
  inherits(AdCreativeLinkDataChildAttachment, _AbstractCrudObject);

  function AdCreativeLinkDataChildAttachment() {
    classCallCheck(this, AdCreativeLinkDataChildAttachment);
    return possibleConstructorReturn(this, (AdCreativeLinkDataChildAttachment.__proto__ || Object.getPrototypeOf(AdCreativeLinkDataChildAttachment)).apply(this, arguments));
  }

  createClass(AdCreativeLinkDataChildAttachment, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        call_to_action: 'call_to_action',
        caption: 'caption',
        description: 'description',
        image_crops: 'image_crops',
        image_hash: 'image_hash',
        link: 'link',
        name: 'name',
        picture: 'picture',
        place_data: 'place_data',
        referral_id: 'referral_id',
        static_card: 'static_card',
        video_id: 'video_id'
      });
    }
  }]);
  return AdCreativeLinkDataChildAttachment;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCreativeLinkDataImageLayerSpec
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCreativeLinkDataImageLayerSpec = function (_AbstractCrudObject) {
  inherits(AdCreativeLinkDataImageLayerSpec, _AbstractCrudObject);

  function AdCreativeLinkDataImageLayerSpec() {
    classCallCheck(this, AdCreativeLinkDataImageLayerSpec);
    return possibleConstructorReturn(this, (AdCreativeLinkDataImageLayerSpec.__proto__ || Object.getPrototypeOf(AdCreativeLinkDataImageLayerSpec)).apply(this, arguments));
  }

  createClass(AdCreativeLinkDataImageLayerSpec, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        blending_mode: 'blending_mode',
        content: 'content',
        frame_image_hash: 'frame_image_hash',
        frame_source: 'frame_source',
        image_source: 'image_source',
        layer_type: 'layer_type',
        opacity: 'opacity',
        overlay_position: 'overlay_position',
        overlay_shape: 'overlay_shape',
        scale: 'scale',
        shape_color: 'shape_color',
        text_color: 'text_color',
        text_font: 'text_font'
      });
    }
  }, {
    key: 'BlendingMode',
    get: function get() {
      return Object.freeze({
        lighten: 'lighten',
        multiply: 'multiply',
        normal: 'normal'
      });
    }
  }, {
    key: 'FrameSource',
    get: function get() {
      return Object.freeze({
        custom: 'custom'
      });
    }
  }, {
    key: 'ImageSource',
    get: function get() {
      return Object.freeze({
        catalog: 'catalog'
      });
    }
  }, {
    key: 'LayerType',
    get: function get() {
      return Object.freeze({
        frame_overlay: 'frame_overlay',
        image: 'image',
        text_overlay: 'text_overlay'
      });
    }
  }, {
    key: 'OverlayPosition',
    get: function get() {
      return Object.freeze({
        bottom: 'bottom',
        bottom_left: 'bottom_left',
        bottom_right: 'bottom_right',
        center: 'center',
        left: 'left',
        right: 'right',
        top: 'top',
        top_left: 'top_left',
        top_right: 'top_right'
      });
    }
  }, {
    key: 'OverlayShape',
    get: function get() {
      return Object.freeze({
        circle: 'circle',
        none: 'none',
        pill: 'pill',
        rectangle: 'rectangle',
        triangle: 'triangle'
      });
    }
  }, {
    key: 'TextFont',
    get: function get() {
      return Object.freeze({
        droid_serif_regular: 'droid_serif_regular',
        lato_regular: 'lato_regular',
        noto_sans_regular: 'noto_sans_regular',
        nunito_sans_bold: 'nunito_sans_bold',
        open_sans_bold: 'open_sans_bold',
        open_sans_condensed_bold: 'open_sans_condensed_bold',
        pt_serif_bold: 'pt_serif_bold',
        roboto_condensed_regular: 'roboto_condensed_regular',
        roboto_medium: 'roboto_medium'
      });
    }
  }]);
  return AdCreativeLinkDataImageLayerSpec;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCreativeLinkDataImageOverlaySpec
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCreativeLinkDataImageOverlaySpec = function (_AbstractCrudObject) {
  inherits(AdCreativeLinkDataImageOverlaySpec, _AbstractCrudObject);

  function AdCreativeLinkDataImageOverlaySpec() {
    classCallCheck(this, AdCreativeLinkDataImageOverlaySpec);
    return possibleConstructorReturn(this, (AdCreativeLinkDataImageOverlaySpec.__proto__ || Object.getPrototypeOf(AdCreativeLinkDataImageOverlaySpec)).apply(this, arguments));
  }

  createClass(AdCreativeLinkDataImageOverlaySpec, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        custom_text_type: 'custom_text_type',
        float_with_margin: 'float_with_margin',
        overlay_template: 'overlay_template',
        position: 'position',
        text_font: 'text_font',
        text_template_tags: 'text_template_tags',
        text_type: 'text_type',
        theme_color: 'theme_color'
      });
    }
  }, {
    key: 'CustomTextType',
    get: function get() {
      return Object.freeze({
        free_shipping: 'free_shipping'
      });
    }
  }, {
    key: 'OverlayTemplate',
    get: function get() {
      return Object.freeze({
        circle_with_text: 'circle_with_text',
        pill_with_text: 'pill_with_text',
        triangle_with_text: 'triangle_with_text'
      });
    }
  }, {
    key: 'Position',
    get: function get() {
      return Object.freeze({
        bottom_left: 'bottom_left',
        bottom_right: 'bottom_right',
        top_left: 'top_left',
        top_right: 'top_right'
      });
    }
  }, {
    key: 'TextFont',
    get: function get() {
      return Object.freeze({
        droid_serif_regular: 'droid_serif_regular',
        dynads_hybrid_bold: 'dynads_hybrid_bold',
        lato_regular: 'lato_regular',
        noto_sans_regular: 'noto_sans_regular',
        nunito_sans_bold: 'nunito_sans_bold',
        open_sans_bold: 'open_sans_bold',
        open_sans_condensed_bold: 'open_sans_condensed_bold',
        pt_serif_bold: 'pt_serif_bold',
        roboto_condensed_regular: 'roboto_condensed_regular',
        roboto_medium: 'roboto_medium'
      });
    }
  }, {
    key: 'TextType',
    get: function get() {
      return Object.freeze({
        custom: 'custom',
        disclaimer: 'disclaimer',
        from_price: 'from_price',
        percentage_off: 'percentage_off',
        price: 'price',
        strikethrough_price: 'strikethrough_price'
      });
    }
  }, {
    key: 'ThemeColor',
    get: function get() {
      return Object.freeze({
        background_000000_text_ffffff: 'background_000000_text_ffffff',
        background_0090ff_text_ffffff: 'background_0090ff_text_ffffff',
        background_00af4c_text_ffffff: 'background_00af4c_text_ffffff',
        background_595959_text_ffffff: 'background_595959_text_ffffff',
        background_755dde_text_ffffff: 'background_755dde_text_ffffff',
        background_e50900_text_ffffff: 'background_e50900_text_ffffff',
        background_f23474_text_ffffff: 'background_f23474_text_ffffff',
        background_f78400_text_ffffff: 'background_f78400_text_ffffff',
        background_ffffff_text_000000: 'background_ffffff_text_000000',
        background_ffffff_text_007ad0: 'background_ffffff_text_007ad0',
        background_ffffff_text_009c2a: 'background_ffffff_text_009c2a',
        background_ffffff_text_646464: 'background_ffffff_text_646464',
        background_ffffff_text_755dde: 'background_ffffff_text_755dde',
        background_ffffff_text_c91b00: 'background_ffffff_text_c91b00',
        background_ffffff_text_f23474: 'background_ffffff_text_f23474',
        background_ffffff_text_f78400: 'background_ffffff_text_f78400'
      });
    }
  }]);
  return AdCreativeLinkDataImageOverlaySpec;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCreativeLinkDataSponsorshipInfoSpec
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCreativeLinkDataSponsorshipInfoSpec = function (_AbstractCrudObject) {
  inherits(AdCreativeLinkDataSponsorshipInfoSpec, _AbstractCrudObject);

  function AdCreativeLinkDataSponsorshipInfoSpec() {
    classCallCheck(this, AdCreativeLinkDataSponsorshipInfoSpec);
    return possibleConstructorReturn(this, (AdCreativeLinkDataSponsorshipInfoSpec.__proto__ || Object.getPrototypeOf(AdCreativeLinkDataSponsorshipInfoSpec)).apply(this, arguments));
  }

  createClass(AdCreativeLinkDataSponsorshipInfoSpec, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        sponsor_image_url: 'sponsor_image_url',
        sponsor_name: 'sponsor_name'
      });
    }
  }]);
  return AdCreativeLinkDataSponsorshipInfoSpec;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCreativeLinkDataTemplateVideoSpec
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCreativeLinkDataTemplateVideoSpec = function (_AbstractCrudObject) {
  inherits(AdCreativeLinkDataTemplateVideoSpec, _AbstractCrudObject);

  function AdCreativeLinkDataTemplateVideoSpec() {
    classCallCheck(this, AdCreativeLinkDataTemplateVideoSpec);
    return possibleConstructorReturn(this, (AdCreativeLinkDataTemplateVideoSpec.__proto__ || Object.getPrototypeOf(AdCreativeLinkDataTemplateVideoSpec)).apply(this, arguments));
  }

  createClass(AdCreativeLinkDataTemplateVideoSpec, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        categorization_criteria: 'categorization_criteria',
        customization: 'customization',
        template_id: 'template_id'
      });
    }
  }]);
  return AdCreativeLinkDataTemplateVideoSpec;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCreativeObjectStorySpec
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCreativeObjectStorySpec = function (_AbstractCrudObject) {
  inherits(AdCreativeObjectStorySpec, _AbstractCrudObject);

  function AdCreativeObjectStorySpec() {
    classCallCheck(this, AdCreativeObjectStorySpec);
    return possibleConstructorReturn(this, (AdCreativeObjectStorySpec.__proto__ || Object.getPrototypeOf(AdCreativeObjectStorySpec)).apply(this, arguments));
  }

  createClass(AdCreativeObjectStorySpec, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        instagram_actor_id: 'instagram_actor_id',
        link_data: 'link_data',
        page_id: 'page_id',
        photo_data: 'photo_data',
        template_data: 'template_data',
        text_data: 'text_data',
        video_data: 'video_data'
      });
    }
  }]);
  return AdCreativeObjectStorySpec;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCreativeOptimizationSpec
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCreativeOptimizationSpec = function (_AbstractCrudObject) {
  inherits(AdCreativeOptimizationSpec, _AbstractCrudObject);

  function AdCreativeOptimizationSpec() {
    classCallCheck(this, AdCreativeOptimizationSpec);
    return possibleConstructorReturn(this, (AdCreativeOptimizationSpec.__proto__ || Object.getPrototypeOf(AdCreativeOptimizationSpec)).apply(this, arguments));
  }

  createClass(AdCreativeOptimizationSpec, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        bodies: 'bodies',
        descriptions: 'descriptions',
        titles: 'titles'
      });
    }
  }]);
  return AdCreativeOptimizationSpec;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCreativePhotoData
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCreativePhotoData = function (_AbstractCrudObject) {
  inherits(AdCreativePhotoData, _AbstractCrudObject);

  function AdCreativePhotoData() {
    classCallCheck(this, AdCreativePhotoData);
    return possibleConstructorReturn(this, (AdCreativePhotoData.__proto__ || Object.getPrototypeOf(AdCreativePhotoData)).apply(this, arguments));
  }

  createClass(AdCreativePhotoData, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        branded_content_shared_to_sponsor_status: 'branded_content_shared_to_sponsor_status',
        branded_content_sponsor_page_id: 'branded_content_sponsor_page_id',
        branded_content_sponsor_relationship: 'branded_content_sponsor_relationship',
        caption: 'caption',
        image_hash: 'image_hash',
        page_welcome_message: 'page_welcome_message',
        url: 'url'
      });
    }
  }]);
  return AdCreativePhotoData;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCreativePlaceData
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCreativePlaceData = function (_AbstractCrudObject) {
  inherits(AdCreativePlaceData, _AbstractCrudObject);

  function AdCreativePlaceData() {
    classCallCheck(this, AdCreativePlaceData);
    return possibleConstructorReturn(this, (AdCreativePlaceData.__proto__ || Object.getPrototypeOf(AdCreativePlaceData)).apply(this, arguments));
  }

  createClass(AdCreativePlaceData, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        address_string: 'address_string',
        label: 'label',
        latitude: 'latitude',
        location_source_id: 'location_source_id',
        longitude: 'longitude',
        type: 'type'
      });
    }
  }]);
  return AdCreativePlaceData;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCreativePlatformCustomization
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCreativePlatformCustomization = function (_AbstractCrudObject) {
  inherits(AdCreativePlatformCustomization, _AbstractCrudObject);

  function AdCreativePlatformCustomization() {
    classCallCheck(this, AdCreativePlatformCustomization);
    return possibleConstructorReturn(this, (AdCreativePlatformCustomization.__proto__ || Object.getPrototypeOf(AdCreativePlatformCustomization)).apply(this, arguments));
  }

  createClass(AdCreativePlatformCustomization, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        instagram: 'instagram'
      });
    }
  }]);
  return AdCreativePlatformCustomization;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCreativePortraitCustomizations
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCreativePortraitCustomizations = function (_AbstractCrudObject) {
  inherits(AdCreativePortraitCustomizations, _AbstractCrudObject);

  function AdCreativePortraitCustomizations() {
    classCallCheck(this, AdCreativePortraitCustomizations);
    return possibleConstructorReturn(this, (AdCreativePortraitCustomizations.__proto__ || Object.getPrototypeOf(AdCreativePortraitCustomizations)).apply(this, arguments));
  }

  createClass(AdCreativePortraitCustomizations, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        specifications: 'specifications'
      });
    }
  }]);
  return AdCreativePortraitCustomizations;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCreativePostClickConfiguration
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCreativePostClickConfiguration = function (_AbstractCrudObject) {
  inherits(AdCreativePostClickConfiguration, _AbstractCrudObject);

  function AdCreativePostClickConfiguration() {
    classCallCheck(this, AdCreativePostClickConfiguration);
    return possibleConstructorReturn(this, (AdCreativePostClickConfiguration.__proto__ || Object.getPrototypeOf(AdCreativePostClickConfiguration)).apply(this, arguments));
  }

  createClass(AdCreativePostClickConfiguration, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        post_click_item_description: 'post_click_item_description',
        post_click_item_headline: 'post_click_item_headline'
      });
    }
  }]);
  return AdCreativePostClickConfiguration;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCreativeRecommenderSettings
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCreativeRecommenderSettings = function (_AbstractCrudObject) {
  inherits(AdCreativeRecommenderSettings, _AbstractCrudObject);

  function AdCreativeRecommenderSettings() {
    classCallCheck(this, AdCreativeRecommenderSettings);
    return possibleConstructorReturn(this, (AdCreativeRecommenderSettings.__proto__ || Object.getPrototypeOf(AdCreativeRecommenderSettings)).apply(this, arguments));
  }

  createClass(AdCreativeRecommenderSettings, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        preferred_events: 'preferred_events',
        product_sales_channel: 'product_sales_channel'
      });
    }
  }]);
  return AdCreativeRecommenderSettings;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCreativeStaticFallbackSpec
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCreativeStaticFallbackSpec = function (_AbstractCrudObject) {
  inherits(AdCreativeStaticFallbackSpec, _AbstractCrudObject);

  function AdCreativeStaticFallbackSpec() {
    classCallCheck(this, AdCreativeStaticFallbackSpec);
    return possibleConstructorReturn(this, (AdCreativeStaticFallbackSpec.__proto__ || Object.getPrototypeOf(AdCreativeStaticFallbackSpec)).apply(this, arguments));
  }

  createClass(AdCreativeStaticFallbackSpec, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        call_to_action: 'call_to_action',
        description: 'description',
        image_hash: 'image_hash',
        link: 'link',
        message: 'message',
        name: 'name'
      });
    }
  }]);
  return AdCreativeStaticFallbackSpec;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCreativeTemplateURLSpec
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCreativeTemplateURLSpec = function (_AbstractCrudObject) {
  inherits(AdCreativeTemplateURLSpec, _AbstractCrudObject);

  function AdCreativeTemplateURLSpec() {
    classCallCheck(this, AdCreativeTemplateURLSpec);
    return possibleConstructorReturn(this, (AdCreativeTemplateURLSpec.__proto__ || Object.getPrototypeOf(AdCreativeTemplateURLSpec)).apply(this, arguments));
  }

  createClass(AdCreativeTemplateURLSpec, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        android: 'android',
        config: 'config',
        ios: 'ios',
        ipad: 'ipad',
        iphone: 'iphone',
        web: 'web',
        windows_phone: 'windows_phone'
      });
    }
  }]);
  return AdCreativeTemplateURLSpec;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCreativeTextData
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCreativeTextData = function (_AbstractCrudObject) {
  inherits(AdCreativeTextData, _AbstractCrudObject);

  function AdCreativeTextData() {
    classCallCheck(this, AdCreativeTextData);
    return possibleConstructorReturn(this, (AdCreativeTextData.__proto__ || Object.getPrototypeOf(AdCreativeTextData)).apply(this, arguments));
  }

  createClass(AdCreativeTextData, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        message: 'message'
      });
    }
  }]);
  return AdCreativeTextData;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCreativeVideoData
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCreativeVideoData = function (_AbstractCrudObject) {
  inherits(AdCreativeVideoData, _AbstractCrudObject);

  function AdCreativeVideoData() {
    classCallCheck(this, AdCreativeVideoData);
    return possibleConstructorReturn(this, (AdCreativeVideoData.__proto__ || Object.getPrototypeOf(AdCreativeVideoData)).apply(this, arguments));
  }

  createClass(AdCreativeVideoData, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        additional_image_index: 'additional_image_index',
        branded_content_shared_to_sponsor_status: 'branded_content_shared_to_sponsor_status',
        branded_content_sponsor_page_id: 'branded_content_sponsor_page_id',
        branded_content_sponsor_relationship: 'branded_content_sponsor_relationship',
        call_to_action: 'call_to_action',
        collection_thumbnails: 'collection_thumbnails',
        image_hash: 'image_hash',
        image_url: 'image_url',
        link_description: 'link_description',
        message: 'message',
        offer_id: 'offer_id',
        page_welcome_message: 'page_welcome_message',
        post_click_configuration: 'post_click_configuration',
        retailer_item_ids: 'retailer_item_ids',
        targeting: 'targeting',
        title: 'title',
        video_id: 'video_id'
      });
    }
  }]);
  return AdCreativeVideoData;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdCustomizationRuleSpec
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdCustomizationRuleSpec = function (_AbstractCrudObject) {
  inherits(AdCustomizationRuleSpec, _AbstractCrudObject);

  function AdCustomizationRuleSpec() {
    classCallCheck(this, AdCustomizationRuleSpec);
    return possibleConstructorReturn(this, (AdCustomizationRuleSpec.__proto__ || Object.getPrototypeOf(AdCustomizationRuleSpec)).apply(this, arguments));
  }

  createClass(AdCustomizationRuleSpec, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        caption: 'caption',
        customization_spec: 'customization_spec',
        description: 'description',
        link: 'link',
        message: 'message',
        name: 'name',
        priority: 'priority',
        template_url_spec: 'template_url_spec'
      });
    }
  }]);
  return AdCustomizationRuleSpec;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdDynamicCreative
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdDynamicCreative = function (_AbstractCrudObject) {
  inherits(AdDynamicCreative, _AbstractCrudObject);

  function AdDynamicCreative() {
    classCallCheck(this, AdDynamicCreative);
    return possibleConstructorReturn(this, (AdDynamicCreative.__proto__ || Object.getPrototypeOf(AdDynamicCreative)).apply(this, arguments));
  }

  createClass(AdDynamicCreative, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        preview_url: 'preview_url'
      });
    }
  }]);
  return AdDynamicCreative;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdEntityTargetSpend
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdEntityTargetSpend = function (_AbstractCrudObject) {
  inherits(AdEntityTargetSpend, _AbstractCrudObject);

  function AdEntityTargetSpend() {
    classCallCheck(this, AdEntityTargetSpend);
    return possibleConstructorReturn(this, (AdEntityTargetSpend.__proto__ || Object.getPrototypeOf(AdEntityTargetSpend)).apply(this, arguments));
  }

  createClass(AdEntityTargetSpend, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        amount: 'amount',
        has_error: 'has_error',
        is_accurate: 'is_accurate',
        is_prorated: 'is_prorated',
        is_updating: 'is_updating'
      });
    }
  }]);
  return AdEntityTargetSpend;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdKeywords
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdKeywords = function (_AbstractCrudObject) {
  inherits(AdKeywords, _AbstractCrudObject);

  function AdKeywords() {
    classCallCheck(this, AdKeywords);
    return possibleConstructorReturn(this, (AdKeywords.__proto__ || Object.getPrototypeOf(AdKeywords)).apply(this, arguments));
  }

  createClass(AdKeywords, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        brands: 'brands',
        product_categories: 'product_categories',
        product_names: 'product_names',
        search_terms: 'search_terms'
      });
    }
  }]);
  return AdKeywords;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdMonetizationProperty
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdMonetizationProperty = function (_AbstractCrudObject) {
  inherits(AdMonetizationProperty, _AbstractCrudObject);

  function AdMonetizationProperty() {
    classCallCheck(this, AdMonetizationProperty);
    return possibleConstructorReturn(this, (AdMonetizationProperty.__proto__ || Object.getPrototypeOf(AdMonetizationProperty)).apply(this, arguments));
  }

  createClass(AdMonetizationProperty, [{
    key: 'getAdNetworkAnalytics',
    value: function getAdNetworkAnalytics(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdNetworkAnalyticsSyncQueryResult, fields, params, fetchFirstPage, '/adnetworkanalytics');
    }
  }, {
    key: 'createAdNetworkAnalytic',
    value: function createAdNetworkAnalytic(fields, params) {
      return this.createEdge('/adnetworkanalytics', fields, params, AdMonetizationProperty);
    }
  }, {
    key: 'getAdNetworkAnalyticsResults',
    value: function getAdNetworkAnalyticsResults(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AdNetworkAnalyticsAsyncQueryResult, fields, params, fetchFirstPage, '/adnetworkanalytics_results');
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        id: 'id'
      });
    }
  }]);
  return AdMonetizationProperty;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdPlacePageSetMetadata
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdPlacePageSetMetadata = function (_AbstractCrudObject) {
  inherits(AdPlacePageSetMetadata, _AbstractCrudObject);

  function AdPlacePageSetMetadata() {
    classCallCheck(this, AdPlacePageSetMetadata);
    return possibleConstructorReturn(this, (AdPlacePageSetMetadata.__proto__ || Object.getPrototypeOf(AdPlacePageSetMetadata)).apply(this, arguments));
  }

  createClass(AdPlacePageSetMetadata, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        audience: 'audience',
        extra_data: 'extra_data',
        fixed_radius: 'fixed_radius'
      });
    }
  }]);
  return AdPlacePageSetMetadata;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdPromotedObject
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdPromotedObject = function (_AbstractCrudObject) {
  inherits(AdPromotedObject, _AbstractCrudObject);

  function AdPromotedObject() {
    classCallCheck(this, AdPromotedObject);
    return possibleConstructorReturn(this, (AdPromotedObject.__proto__ || Object.getPrototypeOf(AdPromotedObject)).apply(this, arguments));
  }

  createClass(AdPromotedObject, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        application_id: 'application_id',
        custom_conversion_id: 'custom_conversion_id',
        custom_event_type: 'custom_event_type',
        event_id: 'event_id',
        fundraiser_campaign_id: 'fundraiser_campaign_id',
        object_store_url: 'object_store_url',
        offer_id: 'offer_id',
        offline_conversion_data_set_id: 'offline_conversion_data_set_id',
        page_id: 'page_id',
        pixel_aggregation_rule: 'pixel_aggregation_rule',
        pixel_id: 'pixel_id',
        pixel_rule: 'pixel_rule',
        place_page_set_id: 'place_page_set_id',
        product_catalog_id: 'product_catalog_id',
        product_item_id: 'product_item_id',
        product_set_id: 'product_set_id',
        retention_days: 'retention_days'
      });
    }
  }, {
    key: 'CustomEventType',
    get: function get() {
      return Object.freeze({
        achievement_unlocked: 'ACHIEVEMENT_UNLOCKED',
        add_payment_info: 'ADD_PAYMENT_INFO',
        add_to_cart: 'ADD_TO_CART',
        add_to_wishlist: 'ADD_TO_WISHLIST',
        complete_registration: 'COMPLETE_REGISTRATION',
        contact: 'CONTACT',
        content_view: 'CONTENT_VIEW',
        customize_product: 'CUSTOMIZE_PRODUCT',
        d2_retention: 'D2_RETENTION',
        d7_retention: 'D7_RETENTION',
        donate: 'DONATE',
        find_location: 'FIND_LOCATION',
        initiated_checkout: 'INITIATED_CHECKOUT',
        lead: 'LEAD',
        level_achieved: 'LEVEL_ACHIEVED',
        listing_interaction: 'LISTING_INTERACTION',
        messaging_conversation_started_7d: 'MESSAGING_CONVERSATION_STARTED_7D',
        other: 'OTHER',
        purchase: 'PURCHASE',
        rate: 'RATE',
        schedule: 'SCHEDULE',
        search: 'SEARCH',
        service_booking_request: 'SERVICE_BOOKING_REQUEST',
        spent_credits: 'SPENT_CREDITS',
        start_trial: 'START_TRIAL',
        submit_application: 'SUBMIT_APPLICATION',
        subscribe: 'SUBSCRIBE',
        tutorial_completion: 'TUTORIAL_COMPLETION'
      });
    }
  }]);
  return AdPromotedObject;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdRecommendation
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdRecommendation = function (_AbstractCrudObject) {
  inherits(AdRecommendation, _AbstractCrudObject);

  function AdRecommendation() {
    classCallCheck(this, AdRecommendation);
    return possibleConstructorReturn(this, (AdRecommendation.__proto__ || Object.getPrototypeOf(AdRecommendation)).apply(this, arguments));
  }

  createClass(AdRecommendation, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        blame_field: 'blame_field',
        code: 'code',
        confidence: 'confidence',
        importance: 'importance',
        message: 'message',
        recommendation_data: 'recommendation_data',
        title: 'title'
      });
    }
  }, {
    key: 'Confidence',
    get: function get() {
      return Object.freeze({
        high: 'HIGH',
        low: 'LOW',
        medium: 'MEDIUM'
      });
    }
  }, {
    key: 'Importance',
    get: function get() {
      return Object.freeze({
        high: 'HIGH',
        low: 'LOW',
        medium: 'MEDIUM'
      });
    }
  }]);
  return AdRecommendation;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdRecommendationData
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdRecommendationData = function (_AbstractCrudObject) {
  inherits(AdRecommendationData, _AbstractCrudObject);

  function AdRecommendationData() {
    classCallCheck(this, AdRecommendationData);
    return possibleConstructorReturn(this, (AdRecommendationData.__proto__ || Object.getPrototypeOf(AdRecommendationData)).apply(this, arguments));
  }

  createClass(AdRecommendationData, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        link: 'link'
      });
    }
  }]);
  return AdRecommendationData;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdRuleEvaluationSpec
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdRuleEvaluationSpec = function (_AbstractCrudObject) {
  inherits(AdRuleEvaluationSpec, _AbstractCrudObject);

  function AdRuleEvaluationSpec() {
    classCallCheck(this, AdRuleEvaluationSpec);
    return possibleConstructorReturn(this, (AdRuleEvaluationSpec.__proto__ || Object.getPrototypeOf(AdRuleEvaluationSpec)).apply(this, arguments));
  }

  createClass(AdRuleEvaluationSpec, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        evaluation_type: 'evaluation_type',
        filters: 'filters',
        trigger: 'trigger'
      });
    }
  }, {
    key: 'EvaluationType',
    get: function get() {
      return Object.freeze({
        schedule: 'SCHEDULE',
        trigger: 'TRIGGER'
      });
    }
  }]);
  return AdRuleEvaluationSpec;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdRuleExecutionOptions
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdRuleExecutionOptions = function (_AbstractCrudObject) {
  inherits(AdRuleExecutionOptions, _AbstractCrudObject);

  function AdRuleExecutionOptions() {
    classCallCheck(this, AdRuleExecutionOptions);
    return possibleConstructorReturn(this, (AdRuleExecutionOptions.__proto__ || Object.getPrototypeOf(AdRuleExecutionOptions)).apply(this, arguments));
  }

  createClass(AdRuleExecutionOptions, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        field: 'field',
        operator: 'operator',
        value: 'value'
      });
    }
  }, {
    key: 'Operator',
    get: function get() {
      return Object.freeze({
        equal: 'EQUAL',
        in: 'IN'
      });
    }
  }]);
  return AdRuleExecutionOptions;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdRuleExecutionSpec
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdRuleExecutionSpec = function (_AbstractCrudObject) {
  inherits(AdRuleExecutionSpec, _AbstractCrudObject);

  function AdRuleExecutionSpec() {
    classCallCheck(this, AdRuleExecutionSpec);
    return possibleConstructorReturn(this, (AdRuleExecutionSpec.__proto__ || Object.getPrototypeOf(AdRuleExecutionSpec)).apply(this, arguments));
  }

  createClass(AdRuleExecutionSpec, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        execution_options: 'execution_options',
        execution_type: 'execution_type'
      });
    }
  }, {
    key: 'ExecutionType',
    get: function get() {
      return Object.freeze({
        change_bid: 'CHANGE_BID',
        change_budget: 'CHANGE_BUDGET',
        notification: 'NOTIFICATION',
        pause: 'PAUSE',
        ping_endpoint: 'PING_ENDPOINT',
        rebalance_budget: 'REBALANCE_BUDGET',
        rotate: 'ROTATE',
        unpause: 'UNPAUSE'
      });
    }
  }]);
  return AdRuleExecutionSpec;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdRuleFilters
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdRuleFilters = function (_AbstractCrudObject) {
  inherits(AdRuleFilters, _AbstractCrudObject);

  function AdRuleFilters() {
    classCallCheck(this, AdRuleFilters);
    return possibleConstructorReturn(this, (AdRuleFilters.__proto__ || Object.getPrototypeOf(AdRuleFilters)).apply(this, arguments));
  }

  createClass(AdRuleFilters, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        field: 'field',
        operator: 'operator',
        value: 'value'
      });
    }
  }, {
    key: 'Operator',
    get: function get() {
      return Object.freeze({
        all: 'ALL',
        any: 'ANY',
        contain: 'CONTAIN',
        equal: 'EQUAL',
        greater_than: 'GREATER_THAN',
        in: 'IN',
        in_range: 'IN_RANGE',
        less_than: 'LESS_THAN',
        none: 'NONE',
        not_contain: 'NOT_CONTAIN',
        not_equal: 'NOT_EQUAL',
        not_in: 'NOT_IN',
        not_in_range: 'NOT_IN_RANGE'
      });
    }
  }]);
  return AdRuleFilters;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdRuleHistoryResult
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdRuleHistoryResult = function (_AbstractCrudObject) {
  inherits(AdRuleHistoryResult, _AbstractCrudObject);

  function AdRuleHistoryResult() {
    classCallCheck(this, AdRuleHistoryResult);
    return possibleConstructorReturn(this, (AdRuleHistoryResult.__proto__ || Object.getPrototypeOf(AdRuleHistoryResult)).apply(this, arguments));
  }

  createClass(AdRuleHistoryResult, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        actions: 'actions',
        object_id: 'object_id',
        object_type: 'object_type'
      });
    }
  }, {
    key: 'ObjectType',
    get: function get() {
      return Object.freeze({
        ad: 'AD',
        adset: 'ADSET',
        campaign: 'CAMPAIGN'
      });
    }
  }]);
  return AdRuleHistoryResult;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdRuleHistoryResultAction
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdRuleHistoryResultAction = function (_AbstractCrudObject) {
  inherits(AdRuleHistoryResultAction, _AbstractCrudObject);

  function AdRuleHistoryResultAction() {
    classCallCheck(this, AdRuleHistoryResultAction);
    return possibleConstructorReturn(this, (AdRuleHistoryResultAction.__proto__ || Object.getPrototypeOf(AdRuleHistoryResultAction)).apply(this, arguments));
  }

  createClass(AdRuleHistoryResultAction, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        action: 'action',
        field: 'field',
        new_value: 'new_value',
        old_value: 'old_value'
      });
    }
  }]);
  return AdRuleHistoryResultAction;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdRuleSchedule
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdRuleSchedule = function (_AbstractCrudObject) {
  inherits(AdRuleSchedule, _AbstractCrudObject);

  function AdRuleSchedule() {
    classCallCheck(this, AdRuleSchedule);
    return possibleConstructorReturn(this, (AdRuleSchedule.__proto__ || Object.getPrototypeOf(AdRuleSchedule)).apply(this, arguments));
  }

  createClass(AdRuleSchedule, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        days: 'days',
        end_minute: 'end_minute',
        start_minute: 'start_minute'
      });
    }
  }]);
  return AdRuleSchedule;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdRuleScheduleSpec
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdRuleScheduleSpec = function (_AbstractCrudObject) {
  inherits(AdRuleScheduleSpec, _AbstractCrudObject);

  function AdRuleScheduleSpec() {
    classCallCheck(this, AdRuleScheduleSpec);
    return possibleConstructorReturn(this, (AdRuleScheduleSpec.__proto__ || Object.getPrototypeOf(AdRuleScheduleSpec)).apply(this, arguments));
  }

  createClass(AdRuleScheduleSpec, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        schedule: 'schedule',
        schedule_type: 'schedule_type'
      });
    }
  }]);
  return AdRuleScheduleSpec;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdRuleTrigger
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdRuleTrigger = function (_AbstractCrudObject) {
  inherits(AdRuleTrigger, _AbstractCrudObject);

  function AdRuleTrigger() {
    classCallCheck(this, AdRuleTrigger);
    return possibleConstructorReturn(this, (AdRuleTrigger.__proto__ || Object.getPrototypeOf(AdRuleTrigger)).apply(this, arguments));
  }

  createClass(AdRuleTrigger, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        field: 'field',
        operator: 'operator',
        type: 'type',
        value: 'value'
      });
    }
  }, {
    key: 'Operator',
    get: function get() {
      return Object.freeze({
        all: 'ALL',
        any: 'ANY',
        contain: 'CONTAIN',
        equal: 'EQUAL',
        greater_than: 'GREATER_THAN',
        in: 'IN',
        in_range: 'IN_RANGE',
        less_than: 'LESS_THAN',
        none: 'NONE',
        not_contain: 'NOT_CONTAIN',
        not_equal: 'NOT_EQUAL',
        not_in: 'NOT_IN',
        not_in_range: 'NOT_IN_RANGE'
      });
    }
  }, {
    key: 'Type',
    get: function get() {
      return Object.freeze({
        delivery_insights_change: 'DELIVERY_INSIGHTS_CHANGE',
        metadata_creation: 'METADATA_CREATION',
        metadata_update: 'METADATA_UPDATE',
        stats_change: 'STATS_CHANGE',
        stats_milestone: 'STATS_MILESTONE'
      });
    }
  }]);
  return AdRuleTrigger;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdStudyObjectiveID
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdStudyObjectiveID = function (_AbstractCrudObject) {
  inherits(AdStudyObjectiveID, _AbstractCrudObject);

  function AdStudyObjectiveID() {
    classCallCheck(this, AdStudyObjectiveID);
    return possibleConstructorReturn(this, (AdStudyObjectiveID.__proto__ || Object.getPrototypeOf(AdStudyObjectiveID)).apply(this, arguments));
  }

  createClass(AdStudyObjectiveID, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        event_names: 'event_names',
        id: 'id',
        type: 'type'
      });
    }
  }]);
  return AdStudyObjectiveID;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdgroupActivity
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdgroupActivity = function (_AbstractCrudObject) {
  inherits(AdgroupActivity, _AbstractCrudObject);

  function AdgroupActivity() {
    classCallCheck(this, AdgroupActivity);
    return possibleConstructorReturn(this, (AdgroupActivity.__proto__ || Object.getPrototypeOf(AdgroupActivity)).apply(this, arguments));
  }

  createClass(AdgroupActivity, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        ad_creative_id_new: 'ad_creative_id_new',
        ad_creative_id_old: 'ad_creative_id_old',
        asset_feed_id_new: 'asset_feed_id_new',
        asset_feed_id_old: 'asset_feed_id_old',
        bid_amount_new: 'bid_amount_new',
        bid_amount_old: 'bid_amount_old',
        bid_info_new: 'bid_info_new',
        bid_info_old: 'bid_info_old',
        bid_type_new: 'bid_type_new',
        bid_type_old: 'bid_type_old',
        conversion_specs_new: 'conversion_specs_new',
        conversion_specs_old: 'conversion_specs_old',
        created_time: 'created_time',
        display_sequence_new: 'display_sequence_new',
        display_sequence_old: 'display_sequence_old',
        engagement_audience_new: 'engagement_audience_new',
        engagement_audience_old: 'engagement_audience_old',
        event_time: 'event_time',
        event_type: 'event_type',
        force_run_status_new: 'force_run_status_new',
        force_run_status_old: 'force_run_status_old',
        friendly_name_new: 'friendly_name_new',
        friendly_name_old: 'friendly_name_old',
        id: 'id',
        is_reviewer_admin_new: 'is_reviewer_admin_new',
        is_reviewer_admin_old: 'is_reviewer_admin_old',
        objective_new: 'objective_new',
        objective_old: 'objective_old',
        objective_source_new: 'objective_source_new',
        objective_source_old: 'objective_source_old',
        priority_new: 'priority_new',
        priority_old: 'priority_old',
        reason_new: 'reason_new',
        reason_old: 'reason_old',
        run_status_new: 'run_status_new',
        run_status_old: 'run_status_old',
        source_adgroup_id_new: 'source_adgroup_id_new',
        source_adgroup_id_old: 'source_adgroup_id_old',
        start_time_new: 'start_time_new',
        start_time_old: 'start_time_old',
        stop_time_new: 'stop_time_new',
        stop_time_old: 'stop_time_old',
        target_spec_id_new: 'target_spec_id_new',
        target_spec_id_old: 'target_spec_id_old',
        tracking_pixel_ids_new: 'tracking_pixel_ids_new',
        tracking_pixel_ids_old: 'tracking_pixel_ids_old',
        tracking_specs_new: 'tracking_specs_new',
        tracking_specs_old: 'tracking_specs_old',
        update_time_new: 'update_time_new',
        update_time_old: 'update_time_old',
        view_tags_new: 'view_tags_new',
        view_tags_old: 'view_tags_old'
      });
    }
  }, {
    key: 'ObjectiveNew',
    get: function get() {
      return Object.freeze({
        app_installs: 'APP_INSTALLS',
        brand_awareness: 'BRAND_AWARENESS',
        canvas_app_engagement: 'CANVAS_APP_ENGAGEMENT',
        canvas_app_installs: 'CANVAS_APP_INSTALLS',
        event_responses: 'EVENT_RESPONSES',
        lead_generation: 'LEAD_GENERATION',
        link_clicks: 'LINK_CLICKS',
        local_awareness: 'LOCAL_AWARENESS',
        messages: 'MESSAGES',
        mobile_app_engagement: 'MOBILE_APP_ENGAGEMENT',
        mobile_app_installs: 'MOBILE_APP_INSTALLS',
        none: 'NONE',
        offer_claims: 'OFFER_CLAIMS',
        page_likes: 'PAGE_LIKES',
        post_engagement: 'POST_ENGAGEMENT',
        product_catalog_sales: 'PRODUCT_CATALOG_SALES',
        video_views: 'VIDEO_VIEWS',
        website_conversions: 'WEBSITE_CONVERSIONS'
      });
    }
  }, {
    key: 'ObjectiveOld',
    get: function get() {
      return Object.freeze({
        app_installs: 'APP_INSTALLS',
        brand_awareness: 'BRAND_AWARENESS',
        canvas_app_engagement: 'CANVAS_APP_ENGAGEMENT',
        canvas_app_installs: 'CANVAS_APP_INSTALLS',
        event_responses: 'EVENT_RESPONSES',
        lead_generation: 'LEAD_GENERATION',
        link_clicks: 'LINK_CLICKS',
        local_awareness: 'LOCAL_AWARENESS',
        messages: 'MESSAGES',
        mobile_app_engagement: 'MOBILE_APP_ENGAGEMENT',
        mobile_app_installs: 'MOBILE_APP_INSTALLS',
        none: 'NONE',
        offer_claims: 'OFFER_CLAIMS',
        page_likes: 'PAGE_LIKES',
        post_engagement: 'POST_ENGAGEMENT',
        product_catalog_sales: 'PRODUCT_CATALOG_SALES',
        video_views: 'VIDEO_VIEWS',
        website_conversions: 'WEBSITE_CONVERSIONS'
      });
    }
  }]);
  return AdgroupActivity;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdgroupIssuesInfo
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdgroupIssuesInfo = function (_AbstractCrudObject) {
  inherits(AdgroupIssuesInfo, _AbstractCrudObject);

  function AdgroupIssuesInfo() {
    classCallCheck(this, AdgroupIssuesInfo);
    return possibleConstructorReturn(this, (AdgroupIssuesInfo.__proto__ || Object.getPrototypeOf(AdgroupIssuesInfo)).apply(this, arguments));
  }

  createClass(AdgroupIssuesInfo, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        error_code: 'error_code',
        error_message: 'error_message',
        error_summary: 'error_summary',
        level: 'level'
      });
    }
  }]);
  return AdgroupIssuesInfo;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdgroupPlacementSpecificReviewFeedback
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdgroupPlacementSpecificReviewFeedback = function (_AbstractCrudObject) {
  inherits(AdgroupPlacementSpecificReviewFeedback, _AbstractCrudObject);

  function AdgroupPlacementSpecificReviewFeedback() {
    classCallCheck(this, AdgroupPlacementSpecificReviewFeedback);
    return possibleConstructorReturn(this, (AdgroupPlacementSpecificReviewFeedback.__proto__ || Object.getPrototypeOf(AdgroupPlacementSpecificReviewFeedback)).apply(this, arguments));
  }

  createClass(AdgroupPlacementSpecificReviewFeedback, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        account_admin: 'account_admin',
        ad: 'ad',
        b2c: 'b2c',
        bsg: 'bsg',
        city_community: 'city_community',
        daily_deals: 'daily_deals',
        daily_deals_legacy: 'daily_deals_legacy',
        dpa: 'dpa',
        facebook: 'facebook',
        instagram: 'instagram',
        instagram_shop: 'instagram_shop',
        marketplace: 'marketplace',
        marketplace_home_rentals: 'marketplace_home_rentals',
        marketplace_home_sales: 'marketplace_home_sales',
        marketplace_motors: 'marketplace_motors',
        max_review_placements: 'max_review_placements',
        page_admin: 'page_admin',
        product: 'product',
        product_service: 'product_service',
        profile: 'profile',
        seller: 'seller',
        shops: 'shops',
        whatsapp: 'whatsapp'
      });
    }
  }]);
  return AdgroupPlacementSpecificReviewFeedback;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdgroupRelevanceScore
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdgroupRelevanceScore = function (_AbstractCrudObject) {
  inherits(AdgroupRelevanceScore, _AbstractCrudObject);

  function AdgroupRelevanceScore() {
    classCallCheck(this, AdgroupRelevanceScore);
    return possibleConstructorReturn(this, (AdgroupRelevanceScore.__proto__ || Object.getPrototypeOf(AdgroupRelevanceScore)).apply(this, arguments));
  }

  createClass(AdgroupRelevanceScore, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        negative_feedback: 'negative_feedback',
        positive_feedback: 'positive_feedback',
        score: 'score',
        status: 'status'
      });
    }
  }]);
  return AdgroupRelevanceScore;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdgroupReviewFeedback
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdgroupReviewFeedback = function (_AbstractCrudObject) {
  inherits(AdgroupReviewFeedback, _AbstractCrudObject);

  function AdgroupReviewFeedback() {
    classCallCheck(this, AdgroupReviewFeedback);
    return possibleConstructorReturn(this, (AdgroupReviewFeedback.__proto__ || Object.getPrototypeOf(AdgroupReviewFeedback)).apply(this, arguments));
  }

  createClass(AdgroupReviewFeedback, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        global: 'global',
        placement_specific: 'placement_specific'
      });
    }
  }]);
  return AdgroupReviewFeedback;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdsActionStats
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdsActionStats = function (_AbstractCrudObject) {
  inherits(AdsActionStats, _AbstractCrudObject);

  function AdsActionStats() {
    classCallCheck(this, AdsActionStats);
    return possibleConstructorReturn(this, (AdsActionStats.__proto__ || Object.getPrototypeOf(AdsActionStats)).apply(this, arguments));
  }

  createClass(AdsActionStats, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        value_1d_click: '1d_click',
        value_1d_view: '1d_view',
        value_28d_click: '28d_click',
        value_28d_view: '28d_view',
        value_7d_click: '7d_click',
        value_7d_view: '7d_view',
        action_canvas_component_id: 'action_canvas_component_id',
        action_canvas_component_name: 'action_canvas_component_name',
        action_carousel_card_id: 'action_carousel_card_id',
        action_carousel_card_name: 'action_carousel_card_name',
        action_converted_product_id: 'action_converted_product_id',
        action_destination: 'action_destination',
        action_device: 'action_device',
        action_event_channel: 'action_event_channel',
        action_link_click_destination: 'action_link_click_destination',
        action_location_code: 'action_location_code',
        action_reaction: 'action_reaction',
        action_target_id: 'action_target_id',
        action_type: 'action_type',
        action_video_asset_id: 'action_video_asset_id',
        action_video_sound: 'action_video_sound',
        action_video_type: 'action_video_type',
        inline: 'inline',
        interactive_component_sticker_id: 'interactive_component_sticker_id',
        interactive_component_sticker_response: 'interactive_component_sticker_response',
        value: 'value'
      });
    }
  }]);
  return AdsActionStats;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdsImageCrops
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdsImageCrops = function (_AbstractCrudObject) {
  inherits(AdsImageCrops, _AbstractCrudObject);

  function AdsImageCrops() {
    classCallCheck(this, AdsImageCrops);
    return possibleConstructorReturn(this, (AdsImageCrops.__proto__ || Object.getPrototypeOf(AdsImageCrops)).apply(this, arguments));
  }

  createClass(AdsImageCrops, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        value_100x100: '100x100',
        value_100x72: '100x72',
        value_191x100: '191x100',
        value_400x150: '400x150',
        value_400x500: '400x500',
        value_600x360: '600x360',
        value_90x160: '90x160'
      });
    }
  }]);
  return AdsImageCrops;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdsOptimalDeliveryGrowthOpportunity
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdsOptimalDeliveryGrowthOpportunity = function (_AbstractCrudObject) {
  inherits(AdsOptimalDeliveryGrowthOpportunity, _AbstractCrudObject);

  function AdsOptimalDeliveryGrowthOpportunity() {
    classCallCheck(this, AdsOptimalDeliveryGrowthOpportunity);
    return possibleConstructorReturn(this, (AdsOptimalDeliveryGrowthOpportunity.__proto__ || Object.getPrototypeOf(AdsOptimalDeliveryGrowthOpportunity)).apply(this, arguments));
  }

  createClass(AdsOptimalDeliveryGrowthOpportunity, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        child_metadata: 'child_metadata',
        metadata: 'metadata',
        optimization_type: 'optimization_type'
      });
    }
  }]);
  return AdsOptimalDeliveryGrowthOpportunity;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AdsPixelStats
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AdsPixelStats = function (_AbstractCrudObject) {
  inherits(AdsPixelStats, _AbstractCrudObject);

  function AdsPixelStats() {
    classCallCheck(this, AdsPixelStats);
    return possibleConstructorReturn(this, (AdsPixelStats.__proto__ || Object.getPrototypeOf(AdsPixelStats)).apply(this, arguments));
  }

  createClass(AdsPixelStats, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        count: 'count',
        diagnostics_hourly_last_timestamp: 'diagnostics_hourly_last_timestamp',
        event: 'event',
        value: 'value'
      });
    }
  }]);
  return AdsPixelStats;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AgeRange
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AgeRange = function (_AbstractCrudObject) {
  inherits(AgeRange, _AbstractCrudObject);

  function AgeRange() {
    classCallCheck(this, AgeRange);
    return possibleConstructorReturn(this, (AgeRange.__proto__ || Object.getPrototypeOf(AgeRange)).apply(this, arguments));
  }

  createClass(AgeRange, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        max: 'max',
        min: 'min'
      });
    }
  }]);
  return AgeRange;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AgencyClientDeclaration
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AgencyClientDeclaration = function (_AbstractCrudObject) {
  inherits(AgencyClientDeclaration, _AbstractCrudObject);

  function AgencyClientDeclaration() {
    classCallCheck(this, AgencyClientDeclaration);
    return possibleConstructorReturn(this, (AgencyClientDeclaration.__proto__ || Object.getPrototypeOf(AgencyClientDeclaration)).apply(this, arguments));
  }

  createClass(AgencyClientDeclaration, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        agency_representing_client: 'agency_representing_client',
        client_based_in_france: 'client_based_in_france',
        client_city: 'client_city',
        client_country_code: 'client_country_code',
        client_email_address: 'client_email_address',
        client_name: 'client_name',
        client_postal_code: 'client_postal_code',
        client_province: 'client_province',
        client_street: 'client_street',
        client_street2: 'client_street2',
        has_written_mandate_from_advertiser: 'has_written_mandate_from_advertiser',
        is_client_paying_invoices: 'is_client_paying_invoices'
      });
    }
  }]);
  return AgencyClientDeclaration;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AndroidAppLink
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AndroidAppLink = function (_AbstractCrudObject) {
  inherits(AndroidAppLink, _AbstractCrudObject);

  function AndroidAppLink() {
    classCallCheck(this, AndroidAppLink);
    return possibleConstructorReturn(this, (AndroidAppLink.__proto__ || Object.getPrototypeOf(AndroidAppLink)).apply(this, arguments));
  }

  createClass(AndroidAppLink, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        app_name: 'app_name',
        class: 'class',
        package: 'package',
        url: 'url'
      });
    }
  }]);
  return AndroidAppLink;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AppLinks
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AppLinks = function (_AbstractCrudObject) {
  inherits(AppLinks, _AbstractCrudObject);

  function AppLinks() {
    classCallCheck(this, AppLinks);
    return possibleConstructorReturn(this, (AppLinks.__proto__ || Object.getPrototypeOf(AppLinks)).apply(this, arguments));
  }

  createClass(AppLinks, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        android: 'android',
        id: 'id',
        ios: 'ios',
        ipad: 'ipad',
        iphone: 'iphone',
        web: 'web',
        windows: 'windows',
        windows_phone: 'windows_phone',
        windows_universal: 'windows_universal'
      });
    }
  }]);
  return AppLinks;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AsyncSession
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AsyncSession = function (_AbstractCrudObject) {
  inherits(AsyncSession, _AbstractCrudObject);

  function AsyncSession() {
    classCallCheck(this, AsyncSession);
    return possibleConstructorReturn(this, (AsyncSession.__proto__ || Object.getPrototypeOf(AsyncSession)).apply(this, arguments));
  }

  createClass(AsyncSession, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        app: 'app',
        complete_time: 'complete_time',
        error_code: 'error_code',
        exception: 'exception',
        id: 'id',
        method: 'method',
        name: 'name',
        page: 'page',
        percent_completed: 'percent_completed',
        platform_version: 'platform_version',
        result: 'result',
        start_time: 'start_time',
        status: 'status',
        uri: 'uri',
        user: 'user'
      });
    }
  }]);
  return AsyncSession;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AttributionSpec
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AttributionSpec = function (_AbstractCrudObject) {
  inherits(AttributionSpec, _AbstractCrudObject);

  function AttributionSpec() {
    classCallCheck(this, AttributionSpec);
    return possibleConstructorReturn(this, (AttributionSpec.__proto__ || Object.getPrototypeOf(AttributionSpec)).apply(this, arguments));
  }

  createClass(AttributionSpec, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        event_type: 'event_type',
        window_days: 'window_days'
      });
    }
  }]);
  return AttributionSpec;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AudienceInsightsStudySpec
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AudienceInsightsStudySpec = function (_AbstractCrudObject) {
  inherits(AudienceInsightsStudySpec, _AbstractCrudObject);

  function AudienceInsightsStudySpec() {
    classCallCheck(this, AudienceInsightsStudySpec);
    return possibleConstructorReturn(this, (AudienceInsightsStudySpec.__proto__ || Object.getPrototypeOf(AudienceInsightsStudySpec)).apply(this, arguments));
  }

  createClass(AudienceInsightsStudySpec, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        audience_definition: 'audience_definition',
        author_info: 'author_info',
        creation_time: 'creation_time',
        end_time: 'end_time',
        excluded_rules: 'excluded_rules',
        included_rules: 'included_rules',
        start_time: 'start_time',
        status: 'status'
      });
    }
  }]);
  return AudienceInsightsStudySpec;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * AudiencePermissionForActions
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var AudiencePermissionForActions = function (_AbstractCrudObject) {
  inherits(AudiencePermissionForActions, _AbstractCrudObject);

  function AudiencePermissionForActions() {
    classCallCheck(this, AudiencePermissionForActions);
    return possibleConstructorReturn(this, (AudiencePermissionForActions.__proto__ || Object.getPrototypeOf(AudiencePermissionForActions)).apply(this, arguments));
  }

  createClass(AudiencePermissionForActions, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        can_edit: 'can_edit',
        can_see_insight: 'can_see_insight',
        can_share: 'can_share',
        subtype_supports_lookalike: 'subtype_supports_lookalike',
        supports_recipient_lookalike: 'supports_recipient_lookalike'
      });
    }
  }]);
  return AudiencePermissionForActions;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * BilledAmountDetails
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var BilledAmountDetails = function (_AbstractCrudObject) {
  inherits(BilledAmountDetails, _AbstractCrudObject);

  function BilledAmountDetails() {
    classCallCheck(this, BilledAmountDetails);
    return possibleConstructorReturn(this, (BilledAmountDetails.__proto__ || Object.getPrototypeOf(BilledAmountDetails)).apply(this, arguments));
  }

  createClass(BilledAmountDetails, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        currency: 'currency',
        net_amount: 'net_amount',
        tax_amount: 'tax_amount',
        total_amount: 'total_amount'
      });
    }
  }]);
  return BilledAmountDetails;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * BrandSafetyBlockListUsage
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var BrandSafetyBlockListUsage = function (_AbstractCrudObject) {
  inherits(BrandSafetyBlockListUsage, _AbstractCrudObject);

  function BrandSafetyBlockListUsage() {
    classCallCheck(this, BrandSafetyBlockListUsage);
    return possibleConstructorReturn(this, (BrandSafetyBlockListUsage.__proto__ || Object.getPrototypeOf(BrandSafetyBlockListUsage)).apply(this, arguments));
  }

  createClass(BrandSafetyBlockListUsage, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        current_usage: 'current_usage',
        new_usage: 'new_usage',
        platform: 'platform',
        position: 'position',
        threshold: 'threshold'
      });
    }
  }]);
  return BrandSafetyBlockListUsage;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * BusinessUnit
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var BusinessUnit = function (_AbstractCrudObject) {
  inherits(BusinessUnit, _AbstractCrudObject);

  function BusinessUnit() {
    classCallCheck(this, BusinessUnit);
    return possibleConstructorReturn(this, (BusinessUnit.__proto__ || Object.getPrototypeOf(BusinessUnit)).apply(this, arguments));
  }

  createClass(BusinessUnit, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        business: 'business',
        creation_time: 'creation_time',
        id: 'id',
        name: 'name'
      });
    }
  }]);
  return BusinessUnit;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * CPASParentCatalogSettings
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var CPASParentCatalogSettings = function (_AbstractCrudObject) {
  inherits(CPASParentCatalogSettings, _AbstractCrudObject);

  function CPASParentCatalogSettings() {
    classCallCheck(this, CPASParentCatalogSettings);
    return possibleConstructorReturn(this, (CPASParentCatalogSettings.__proto__ || Object.getPrototypeOf(CPASParentCatalogSettings)).apply(this, arguments));
  }

  createClass(CPASParentCatalogSettings, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(CPASParentCatalogSettings.prototype.__proto__ || Object.getPrototypeOf(CPASParentCatalogSettings.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        attribution_windows: 'attribution_windows',
        default_currency: 'default_currency',
        id: 'id'
      });
    }
  }, {
    key: 'AttributionWindows',
    get: function get() {
      return Object.freeze({
        default: 'DEFAULT',
        x1d_click: 'X1D_CLICK',
        x1d_view: 'X1D_VIEW',
        x28d_click: 'X28D_CLICK',
        x28d_view: 'X28D_VIEW',
        x7d_click: 'X7D_CLICK',
        x7d_view: 'X7D_VIEW'
      });
    }
  }]);
  return CPASParentCatalogSettings;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * CampaignGroupBrandConfiguration
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var CampaignGroupBrandConfiguration = function (_AbstractCrudObject) {
  inherits(CampaignGroupBrandConfiguration, _AbstractCrudObject);

  function CampaignGroupBrandConfiguration() {
    classCallCheck(this, CampaignGroupBrandConfiguration);
    return possibleConstructorReturn(this, (CampaignGroupBrandConfiguration.__proto__ || Object.getPrototypeOf(CampaignGroupBrandConfiguration)).apply(this, arguments));
  }

  createClass(CampaignGroupBrandConfiguration, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        brand_product_name: 'brand_product_name',
        locale: 'locale',
        vertical: 'vertical'
      });
    }
  }]);
  return CampaignGroupBrandConfiguration;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * CanvasAdSettings
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var CanvasAdSettings = function (_AbstractCrudObject) {
  inherits(CanvasAdSettings, _AbstractCrudObject);

  function CanvasAdSettings() {
    classCallCheck(this, CanvasAdSettings);
    return possibleConstructorReturn(this, (CanvasAdSettings.__proto__ || Object.getPrototypeOf(CanvasAdSettings)).apply(this, arguments));
  }

  createClass(CanvasAdSettings, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        is_canvas_collection_eligible: 'is_canvas_collection_eligible',
        lead_form_created_time: 'lead_form_created_time',
        lead_form_name: 'lead_form_name',
        lead_gen_form_id: 'lead_gen_form_id',
        leads_count: 'leads_count',
        product_set_id: 'product_set_id',
        use_retailer_item_ids: 'use_retailer_item_ids'
      });
    }
  }]);
  return CanvasAdSettings;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * CanvasCollectionThumbnail
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var CanvasCollectionThumbnail = function (_AbstractCrudObject) {
  inherits(CanvasCollectionThumbnail, _AbstractCrudObject);

  function CanvasCollectionThumbnail() {
    classCallCheck(this, CanvasCollectionThumbnail);
    return possibleConstructorReturn(this, (CanvasCollectionThumbnail.__proto__ || Object.getPrototypeOf(CanvasCollectionThumbnail)).apply(this, arguments));
  }

  createClass(CanvasCollectionThumbnail, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        element_child_index: 'element_child_index',
        element_id: 'element_id',
        photo: 'photo'
      });
    }
  }]);
  return CanvasCollectionThumbnail;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * CatalogBasedTargeting
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var CatalogBasedTargeting = function (_AbstractCrudObject) {
  inherits(CatalogBasedTargeting, _AbstractCrudObject);

  function CatalogBasedTargeting() {
    classCallCheck(this, CatalogBasedTargeting);
    return possibleConstructorReturn(this, (CatalogBasedTargeting.__proto__ || Object.getPrototypeOf(CatalogBasedTargeting)).apply(this, arguments));
  }

  createClass(CatalogBasedTargeting, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        geo_targeting_type: 'geo_targeting_type'
      });
    }
  }]);
  return CatalogBasedTargeting;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ChildEvent
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ChildEvent = function (_AbstractCrudObject) {
  inherits(ChildEvent, _AbstractCrudObject);

  function ChildEvent() {
    classCallCheck(this, ChildEvent);
    return possibleConstructorReturn(this, (ChildEvent.__proto__ || Object.getPrototypeOf(ChildEvent)).apply(this, arguments));
  }

  createClass(ChildEvent, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        end_time: 'end_time',
        id: 'id',
        start_time: 'start_time',
        ticket_uri: 'ticket_uri'
      });
    }
  }]);
  return ChildEvent;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ClientTransparencyStatus
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ClientTransparencyStatus = function (_AbstractCrudObject) {
  inherits(ClientTransparencyStatus, _AbstractCrudObject);

  function ClientTransparencyStatus() {
    classCallCheck(this, ClientTransparencyStatus);
    return possibleConstructorReturn(this, (ClientTransparencyStatus.__proto__ || Object.getPrototypeOf(ClientTransparencyStatus)).apply(this, arguments));
  }

  createClass(ClientTransparencyStatus, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        grace_period_expiration_date: 'grace_period_expiration_date',
        has_owning_business: 'has_owning_business',
        is_satisfied: 'is_satisfied',
        owning_business_requirements: 'owning_business_requirements'
      });
    }
  }]);
  return ClientTransparencyStatus;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * CommerceSettings
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var CommerceSettings = function (_AbstractCrudObject) {
  inherits(CommerceSettings, _AbstractCrudObject);

  function CommerceSettings() {
    classCallCheck(this, CommerceSettings);
    return possibleConstructorReturn(this, (CommerceSettings.__proto__ || Object.getPrototypeOf(CommerceSettings)).apply(this, arguments));
  }

  createClass(CommerceSettings, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        inventory: 'inventory',
        total_inventory: 'total_inventory'
      });
    }
  }]);
  return CommerceSettings;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ConversionActionQuery
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ConversionActionQuery = function (_AbstractCrudObject) {
  inherits(ConversionActionQuery, _AbstractCrudObject);

  function ConversionActionQuery() {
    classCallCheck(this, ConversionActionQuery);
    return possibleConstructorReturn(this, (ConversionActionQuery.__proto__ || Object.getPrototypeOf(ConversionActionQuery)).apply(this, arguments));
  }

  createClass(ConversionActionQuery, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        action_type: 'action.type',
        application: 'application',
        conversion_id: 'conversion_id',
        creative: 'creative',
        dataset: 'dataset',
        event: 'event',
        event_creator: 'event.creator',
        event_type: 'event_type',
        fb_pixel: 'fb_pixel',
        fb_pixel_event: 'fb_pixel_event',
        leadgen: 'leadgen',
        object: 'object',
        object_domain: 'object.domain',
        offer: 'offer',
        offer_creator: 'offer.creator',
        offsite_pixel: 'offsite_pixel',
        page: 'page',
        page_parent: 'page.parent',
        post: 'post',
        post_object: 'post.object',
        post_object_wall: 'post.object.wall',
        post_wall: 'post.wall',
        question: 'question',
        question_creator: 'question.creator',
        response: 'response',
        subtype: 'subtype'
      });
    }
  }]);
  return ConversionActionQuery;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * CopyrightAttributionInsights
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var CopyrightAttributionInsights = function (_AbstractCrudObject) {
  inherits(CopyrightAttributionInsights, _AbstractCrudObject);

  function CopyrightAttributionInsights() {
    classCallCheck(this, CopyrightAttributionInsights);
    return possibleConstructorReturn(this, (CopyrightAttributionInsights.__proto__ || Object.getPrototypeOf(CopyrightAttributionInsights)).apply(this, arguments));
  }

  createClass(CopyrightAttributionInsights, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        l7_attribution_page_view: 'l7_attribution_page_view',
        l7_attribution_page_view_delta: 'l7_attribution_page_view_delta',
        l7_attribution_video_view: 'l7_attribution_video_view',
        l7_attribution_video_view_delta: 'l7_attribution_video_view_delta',
        metrics_ending_date: 'metrics_ending_date'
      });
    }
  }]);
  return CopyrightAttributionInsights;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * CopyrightReferenceContainer
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var CopyrightReferenceContainer = function (_AbstractCrudObject) {
  inherits(CopyrightReferenceContainer, _AbstractCrudObject);

  function CopyrightReferenceContainer() {
    classCallCheck(this, CopyrightReferenceContainer);
    return possibleConstructorReturn(this, (CopyrightReferenceContainer.__proto__ || Object.getPrototypeOf(CopyrightReferenceContainer)).apply(this, arguments));
  }

  createClass(CopyrightReferenceContainer, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        content_type: 'content_type',
        copyright_creation_time: 'copyright_creation_time',
        download_hd_url: 'download_hd_url',
        duration_in_sec: 'duration_in_sec',
        fingerprint_validity: 'fingerprint_validity',
        id: 'id',
        iswc: 'iswc',
        metadata: 'metadata',
        published_time: 'published_time',
        thumbnail_url: 'thumbnail_url',
        title: 'title',
        universal_content_id: 'universal_content_id',
        writer_names: 'writer_names'
      });
    }
  }]);
  return CopyrightReferenceContainer;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * CoverPhoto
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var CoverPhoto = function (_AbstractCrudObject) {
  inherits(CoverPhoto, _AbstractCrudObject);

  function CoverPhoto() {
    classCallCheck(this, CoverPhoto);
    return possibleConstructorReturn(this, (CoverPhoto.__proto__ || Object.getPrototypeOf(CoverPhoto)).apply(this, arguments));
  }

  createClass(CoverPhoto, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        cover_id: 'cover_id',
        id: 'id',
        offset_x: 'offset_x',
        offset_y: 'offset_y',
        source: 'source'
      });
    }
  }]);
  return CoverPhoto;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * CreativeHistory
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var CreativeHistory = function (_AbstractCrudObject) {
  inherits(CreativeHistory, _AbstractCrudObject);

  function CreativeHistory() {
    classCallCheck(this, CreativeHistory);
    return possibleConstructorReturn(this, (CreativeHistory.__proto__ || Object.getPrototypeOf(CreativeHistory)).apply(this, arguments));
  }

  createClass(CreativeHistory, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        creative_fingerprint: 'creative_fingerprint',
        time_ranges: 'time_ranges'
      });
    }
  }]);
  return CreativeHistory;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * CreditPartitionActionOptions
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var CreditPartitionActionOptions = function (_AbstractCrudObject) {
  inherits(CreditPartitionActionOptions, _AbstractCrudObject);

  function CreditPartitionActionOptions() {
    classCallCheck(this, CreditPartitionActionOptions);
    return possibleConstructorReturn(this, (CreditPartitionActionOptions.__proto__ || Object.getPrototypeOf(CreditPartitionActionOptions)).apply(this, arguments));
  }

  createClass(CreditPartitionActionOptions, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        liability_type: 'liability_type',
        partition_type: 'partition_type',
        send_bill_to: 'send_bill_to'
      });
    }
  }]);
  return CreditPartitionActionOptions;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Currency
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Currency = function (_AbstractCrudObject) {
  inherits(Currency, _AbstractCrudObject);

  function Currency() {
    classCallCheck(this, Currency);
    return possibleConstructorReturn(this, (Currency.__proto__ || Object.getPrototypeOf(Currency)).apply(this, arguments));
  }

  createClass(Currency, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        currency_offset: 'currency_offset',
        usd_exchange: 'usd_exchange',
        usd_exchange_inverse: 'usd_exchange_inverse',
        user_currency: 'user_currency'
      });
    }
  }]);
  return Currency;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * CurrencyAmount
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var CurrencyAmount = function (_AbstractCrudObject) {
  inherits(CurrencyAmount, _AbstractCrudObject);

  function CurrencyAmount() {
    classCallCheck(this, CurrencyAmount);
    return possibleConstructorReturn(this, (CurrencyAmount.__proto__ || Object.getPrototypeOf(CurrencyAmount)).apply(this, arguments));
  }

  createClass(CurrencyAmount, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        amount: 'amount',
        amount_in_hundredths: 'amount_in_hundredths',
        currency: 'currency',
        offsetted_amount: 'offsetted_amount'
      });
    }
  }]);
  return CurrencyAmount;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * CustomAudienceAdAccount
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var CustomAudienceAdAccount = function (_AbstractCrudObject) {
  inherits(CustomAudienceAdAccount, _AbstractCrudObject);

  function CustomAudienceAdAccount() {
    classCallCheck(this, CustomAudienceAdAccount);
    return possibleConstructorReturn(this, (CustomAudienceAdAccount.__proto__ || Object.getPrototypeOf(CustomAudienceAdAccount)).apply(this, arguments));
  }

  createClass(CustomAudienceAdAccount, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        id: 'id'
      });
    }
  }]);
  return CustomAudienceAdAccount;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * CustomAudienceDataSource
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var CustomAudienceDataSource = function (_AbstractCrudObject) {
  inherits(CustomAudienceDataSource, _AbstractCrudObject);

  function CustomAudienceDataSource() {
    classCallCheck(this, CustomAudienceDataSource);
    return possibleConstructorReturn(this, (CustomAudienceDataSource.__proto__ || Object.getPrototypeOf(CustomAudienceDataSource)).apply(this, arguments));
  }

  createClass(CustomAudienceDataSource, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        creation_params: 'creation_params',
        sub_type: 'sub_type',
        type: 'type'
      });
    }
  }, {
    key: 'SubType',
    get: function get() {
      return Object.freeze({
        anything: 'ANYTHING',
        app_users: 'APP_USERS',
        campaign_conversions: 'CAMPAIGN_CONVERSIONS',
        combination_custom_audience_users: 'COMBINATION_CUSTOM_AUDIENCE_USERS',
        constant_contacts_email_hashes: 'CONSTANT_CONTACTS_EMAIL_HASHES',
        contact_importer: 'CONTACT_IMPORTER',
        conversion_pixel_hits: 'CONVERSION_PIXEL_HITS',
        copy_paste_email_hashes: 'COPY_PASTE_EMAIL_HASHES',
        custom_audience_users: 'CUSTOM_AUDIENCE_USERS',
        data_file: 'DATA_FILE',
        dynamic_rule: 'DYNAMIC_RULE',
        engagement_event_users: 'ENGAGEMENT_EVENT_USERS',
        expanded_audience: 'EXPANDED_AUDIENCE',
        external_ids: 'EXTERNAL_IDS',
        external_ids_mix: 'EXTERNAL_IDS_MIX',
        fb_event_signals: 'FB_EVENT_SIGNALS',
        fb_pixel_hits: 'FB_PIXEL_HITS',
        hashes: 'HASHES',
        hashes_or_user_ids: 'HASHES_OR_USER_IDS',
        household_expansion: 'HOUSEHOLD_EXPANSION',
        ig_business_events: 'IG_BUSINESS_EVENTS',
        ig_promoted_post: 'IG_PROMOTED_POST',
        instant_article_events: 'INSTANT_ARTICLE_EVENTS',
        lookalike_platform: 'LOOKALIKE_PLATFORM',
        mail_chimp_email_hashes: 'MAIL_CHIMP_EMAIL_HASHES',
        mobile_advertiser_ids: 'MOBILE_ADVERTISER_IDS',
        mobile_app_combination_events: 'MOBILE_APP_COMBINATION_EVENTS',
        mobile_app_custom_audience_users: 'MOBILE_APP_CUSTOM_AUDIENCE_USERS',
        mobile_app_events: 'MOBILE_APP_EVENTS',
        multicountry_combination: 'MULTICOUNTRY_COMBINATION',
        multi_data_events: 'MULTI_DATA_EVENTS',
        multi_event_source: 'MULTI_EVENT_SOURCE',
        multi_hashes: 'MULTI_HASHES',
        nothing: 'NOTHING',
        offline_event_users: 'OFFLINE_EVENT_USERS',
        page_fans: 'PAGE_FANS',
        page_smart_audience: 'PAGE_SMART_AUDIENCE',
        partner_category_users: 'PARTNER_CATEGORY_USERS',
        place_visits: 'PLACE_VISITS',
        platform: 'PLATFORM',
        platform_users: 'PLATFORM_USERS',
        seed_list: 'SEED_LIST',
        smart_audience: 'SMART_AUDIENCE',
        store_visit_events: 'STORE_VISIT_EVENTS',
        s_expr: 'S_EXPR',
        tokens: 'TOKENS',
        user_ids: 'USER_IDS',
        video_events: 'VIDEO_EVENTS',
        video_event_users: 'VIDEO_EVENT_USERS',
        web_pixel_combination_events: 'WEB_PIXEL_COMBINATION_EVENTS',
        web_pixel_hits: 'WEB_PIXEL_HITS',
        web_pixel_hits_custom_audience_users: 'WEB_PIXEL_HITS_CUSTOM_AUDIENCE_USERS'
      });
    }
  }, {
    key: 'Type',
    get: function get() {
      return Object.freeze({
        contact_importer: 'CONTACT_IMPORTER',
        copy_paste: 'COPY_PASTE',
        event_based: 'EVENT_BASED',
        file_imported: 'FILE_IMPORTED',
        household_audience: 'HOUSEHOLD_AUDIENCE',
        seed_based: 'SEED_BASED',
        third_party_imported: 'THIRD_PARTY_IMPORTED',
        unknown: 'UNKNOWN'
      });
    }
  }]);
  return CustomAudienceDataSource;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * CustomAudienceSharingStatus
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var CustomAudienceSharingStatus = function (_AbstractCrudObject) {
  inherits(CustomAudienceSharingStatus, _AbstractCrudObject);

  function CustomAudienceSharingStatus() {
    classCallCheck(this, CustomAudienceSharingStatus);
    return possibleConstructorReturn(this, (CustomAudienceSharingStatus.__proto__ || Object.getPrototypeOf(CustomAudienceSharingStatus)).apply(this, arguments));
  }

  createClass(CustomAudienceSharingStatus, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        sharing_relationship_id: 'sharing_relationship_id',
        status: 'status'
      });
    }
  }]);
  return CustomAudienceSharingStatus;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * CustomAudienceStatus
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var CustomAudienceStatus = function (_AbstractCrudObject) {
  inherits(CustomAudienceStatus, _AbstractCrudObject);

  function CustomAudienceStatus() {
    classCallCheck(this, CustomAudienceStatus);
    return possibleConstructorReturn(this, (CustomAudienceStatus.__proto__ || Object.getPrototypeOf(CustomAudienceStatus)).apply(this, arguments));
  }

  createClass(CustomAudienceStatus, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        code: 'code',
        description: 'description'
      });
    }
  }]);
  return CustomAudienceStatus;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * DayPart
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var DayPart = function (_AbstractCrudObject) {
  inherits(DayPart, _AbstractCrudObject);

  function DayPart() {
    classCallCheck(this, DayPart);
    return possibleConstructorReturn(this, (DayPart.__proto__ || Object.getPrototypeOf(DayPart)).apply(this, arguments));
  }

  createClass(DayPart, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        days: 'days',
        end_minute: 'end_minute',
        start_minute: 'start_minute',
        timezone_type: 'timezone_type'
      });
    }
  }]);
  return DayPart;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * DeliveryCheck
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var DeliveryCheck = function (_AbstractCrudObject) {
  inherits(DeliveryCheck, _AbstractCrudObject);

  function DeliveryCheck() {
    classCallCheck(this, DeliveryCheck);
    return possibleConstructorReturn(this, (DeliveryCheck.__proto__ || Object.getPrototypeOf(DeliveryCheck)).apply(this, arguments));
  }

  createClass(DeliveryCheck, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        check_name: 'check_name',
        description: 'description',
        extra_info: 'extra_info',
        summary: 'summary'
      });
    }
  }]);
  return DeliveryCheck;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * DeliveryCheckExtraInfo
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var DeliveryCheckExtraInfo = function (_AbstractCrudObject) {
  inherits(DeliveryCheckExtraInfo, _AbstractCrudObject);

  function DeliveryCheckExtraInfo() {
    classCallCheck(this, DeliveryCheckExtraInfo);
    return possibleConstructorReturn(this, (DeliveryCheckExtraInfo.__proto__ || Object.getPrototypeOf(DeliveryCheckExtraInfo)).apply(this, arguments));
  }

  createClass(DeliveryCheckExtraInfo, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        adgroup_ids: 'adgroup_ids',
        campaign_ids: 'campaign_ids',
        countries: 'countries'
      });
    }
  }]);
  return DeliveryCheckExtraInfo;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * DestinationCatalogSettings
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var DestinationCatalogSettings = function (_AbstractCrudObject) {
  inherits(DestinationCatalogSettings, _AbstractCrudObject);

  function DestinationCatalogSettings() {
    classCallCheck(this, DestinationCatalogSettings);
    return possibleConstructorReturn(this, (DestinationCatalogSettings.__proto__ || Object.getPrototypeOf(DestinationCatalogSettings)).apply(this, arguments));
  }

  createClass(DestinationCatalogSettings, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        generate_items_from_pages: 'generate_items_from_pages',
        id: 'id'
      });
    }
  }]);
  return DestinationCatalogSettings;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * DynamicContentSet
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var DynamicContentSet = function (_AbstractCrudObject) {
  inherits(DynamicContentSet, _AbstractCrudObject);

  function DynamicContentSet() {
    classCallCheck(this, DynamicContentSet);
    return possibleConstructorReturn(this, (DynamicContentSet.__proto__ || Object.getPrototypeOf(DynamicContentSet)).apply(this, arguments));
  }

  createClass(DynamicContentSet, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        business_id: 'business_id',
        id: 'id',
        name: 'name'
      });
    }
  }]);
  return DynamicContentSet;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * DynamicPostChildAttachment
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var DynamicPostChildAttachment = function (_AbstractCrudObject) {
  inherits(DynamicPostChildAttachment, _AbstractCrudObject);

  function DynamicPostChildAttachment() {
    classCallCheck(this, DynamicPostChildAttachment);
    return possibleConstructorReturn(this, (DynamicPostChildAttachment.__proto__ || Object.getPrototypeOf(DynamicPostChildAttachment)).apply(this, arguments));
  }

  createClass(DynamicPostChildAttachment, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        description: 'description',
        image_url: 'image_url',
        link: 'link',
        place_id: 'place_id',
        product_id: 'product_id',
        title: 'title'
      });
    }
  }]);
  return DynamicPostChildAttachment;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Engagement
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Engagement = function (_AbstractCrudObject) {
  inherits(Engagement, _AbstractCrudObject);

  function Engagement() {
    classCallCheck(this, Engagement);
    return possibleConstructorReturn(this, (Engagement.__proto__ || Object.getPrototypeOf(Engagement)).apply(this, arguments));
  }

  createClass(Engagement, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        count: 'count',
        count_string: 'count_string',
        count_string_with_like: 'count_string_with_like',
        count_string_without_like: 'count_string_without_like',
        social_sentence: 'social_sentence',
        social_sentence_with_like: 'social_sentence_with_like',
        social_sentence_without_like: 'social_sentence_without_like'
      });
    }
  }]);
  return Engagement;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * EntityAtTextRange
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var EntityAtTextRange = function (_AbstractCrudObject) {
  inherits(EntityAtTextRange, _AbstractCrudObject);

  function EntityAtTextRange() {
    classCallCheck(this, EntityAtTextRange);
    return possibleConstructorReturn(this, (EntityAtTextRange.__proto__ || Object.getPrototypeOf(EntityAtTextRange)).apply(this, arguments));
  }

  createClass(EntityAtTextRange, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        id: 'id',
        length: 'length',
        name: 'name',
        object: 'object',
        offset: 'offset',
        type: 'type'
      });
    }
  }, {
    key: 'Type',
    get: function get() {
      return Object.freeze({
        application: 'application',
        event: 'event',
        group: 'group',
        page: 'page',
        user: 'user'
      });
    }
  }]);
  return EntityAtTextRange;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Experience
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Experience = function (_AbstractCrudObject) {
  inherits(Experience, _AbstractCrudObject);

  function Experience() {
    classCallCheck(this, Experience);
    return possibleConstructorReturn(this, (Experience.__proto__ || Object.getPrototypeOf(Experience)).apply(this, arguments));
  }

  createClass(Experience, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        description: 'description',
        from: 'from',
        id: 'id',
        name: 'name',
        with: 'with'
      });
    }
  }]);
  return Experience;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * FAMEExportConfig
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var FAMEExportConfig = function (_AbstractCrudObject) {
  inherits(FAMEExportConfig, _AbstractCrudObject);

  function FAMEExportConfig() {
    classCallCheck(this, FAMEExportConfig);
    return possibleConstructorReturn(this, (FAMEExportConfig.__proto__ || Object.getPrototypeOf(FAMEExportConfig)).apply(this, arguments));
  }

  createClass(FAMEExportConfig, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        can_edit: 'can_edit',
        column_id: 'column_id',
        display_name: 'display_name',
        format: 'format'
      });
    }
  }]);
  return FAMEExportConfig;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * FlexibleTargeting
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var FlexibleTargeting = function (_AbstractCrudObject) {
  inherits(FlexibleTargeting, _AbstractCrudObject);

  function FlexibleTargeting() {
    classCallCheck(this, FlexibleTargeting);
    return possibleConstructorReturn(this, (FlexibleTargeting.__proto__ || Object.getPrototypeOf(FlexibleTargeting)).apply(this, arguments));
  }

  createClass(FlexibleTargeting, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        behaviors: 'behaviors',
        college_years: 'college_years',
        connections: 'connections',
        custom_audiences: 'custom_audiences',
        education_majors: 'education_majors',
        education_schools: 'education_schools',
        education_statuses: 'education_statuses',
        ethnic_affinity: 'ethnic_affinity',
        family_statuses: 'family_statuses',
        friends_of_connections: 'friends_of_connections',
        generation: 'generation',
        home_ownership: 'home_ownership',
        home_type: 'home_type',
        home_value: 'home_value',
        household_composition: 'household_composition',
        income: 'income',
        industries: 'industries',
        interested_in: 'interested_in',
        interests: 'interests',
        life_events: 'life_events',
        moms: 'moms',
        net_worth: 'net_worth',
        office_type: 'office_type',
        politics: 'politics',
        relationship_statuses: 'relationship_statuses',
        user_adclusters: 'user_adclusters',
        work_employers: 'work_employers',
        work_positions: 'work_positions'
      });
    }
  }]);
  return FlexibleTargeting;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * FoodDrinkOrder
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var FoodDrinkOrder = function (_AbstractCrudObject) {
  inherits(FoodDrinkOrder, _AbstractCrudObject);

  function FoodDrinkOrder() {
    classCallCheck(this, FoodDrinkOrder);
    return possibleConstructorReturn(this, (FoodDrinkOrder.__proto__ || Object.getPrototypeOf(FoodDrinkOrder)).apply(this, arguments));
  }

  createClass(FoodDrinkOrder, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(FoodDrinkOrder.prototype.__proto__ || Object.getPrototypeOf(FoodDrinkOrder.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        admin_note: 'admin_note',
        creation_time: 'creation_time',
        customer_name: 'customer_name',
        customer_phone_number: 'customer_phone_number',
        id: 'id',
        note: 'note',
        order_details: 'order_details',
        state: 'state',
        update_time: 'update_time'
      });
    }
  }, {
    key: 'State',
    get: function get() {
      return Object.freeze({
        cancelled: 'CANCELLED',
        confirmed: 'CONFIRMED',
        draft: 'DRAFT',
        expired: 'EXPIRED',
        on_delivery: 'ON_DELIVERY',
        pending: 'PENDING',
        ready_for_pickup: 'READY_FOR_PICKUP',
        serving: 'SERVING'
      });
    }
  }]);
  return FoodDrinkOrder;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * FundingSourceDetails
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var FundingSourceDetails = function (_AbstractCrudObject) {
  inherits(FundingSourceDetails, _AbstractCrudObject);

  function FundingSourceDetails() {
    classCallCheck(this, FundingSourceDetails);
    return possibleConstructorReturn(this, (FundingSourceDetails.__proto__ || Object.getPrototypeOf(FundingSourceDetails)).apply(this, arguments));
  }

  createClass(FundingSourceDetails, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        coupon: 'coupon',
        display_string: 'display_string',
        id: 'id',
        type: 'type'
      });
    }
  }]);
  return FundingSourceDetails;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * FundingSourceDetailsCoupon
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var FundingSourceDetailsCoupon = function (_AbstractCrudObject) {
  inherits(FundingSourceDetailsCoupon, _AbstractCrudObject);

  function FundingSourceDetailsCoupon() {
    classCallCheck(this, FundingSourceDetailsCoupon);
    return possibleConstructorReturn(this, (FundingSourceDetailsCoupon.__proto__ || Object.getPrototypeOf(FundingSourceDetailsCoupon)).apply(this, arguments));
  }

  createClass(FundingSourceDetailsCoupon, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        amount: 'amount',
        currency: 'currency',
        display_amount: 'display_amount',
        expiration: 'expiration'
      });
    }
  }]);
  return FundingSourceDetailsCoupon;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * IDName
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var IDName = function (_AbstractCrudObject) {
  inherits(IDName, _AbstractCrudObject);

  function IDName() {
    classCallCheck(this, IDName);
    return possibleConstructorReturn(this, (IDName.__proto__ || Object.getPrototypeOf(IDName)).apply(this, arguments));
  }

  createClass(IDName, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        id: 'id',
        name: 'name'
      });
    }
  }]);
  return IDName;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * IGComment
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var IGComment = function (_AbstractCrudObject) {
  inherits(IGComment, _AbstractCrudObject);

  function IGComment() {
    classCallCheck(this, IGComment);
    return possibleConstructorReturn(this, (IGComment.__proto__ || Object.getPrototypeOf(IGComment)).apply(this, arguments));
  }

  createClass(IGComment, [{
    key: 'getReplies',
    value: function getReplies(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(IGComment, fields, params, fetchFirstPage, '/replies');
    }
  }, {
    key: 'createReply',
    value: function createReply(fields, params) {
      return this.createEdge('/replies', fields, params, IGComment);
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(IGComment.prototype.__proto__ || Object.getPrototypeOf(IGComment.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(IGComment.prototype.__proto__ || Object.getPrototypeOf(IGComment.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        hidden: 'hidden',
        id: 'id',
        like_count: 'like_count',
        media: 'media',
        text: 'text',
        timestamp: 'timestamp',
        user: 'user',
        username: 'username'
      });
    }
  }]);
  return IGComment;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * InstagramInsightsResult
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var InstagramInsightsResult = function (_AbstractCrudObject) {
  inherits(InstagramInsightsResult, _AbstractCrudObject);

  function InstagramInsightsResult() {
    classCallCheck(this, InstagramInsightsResult);
    return possibleConstructorReturn(this, (InstagramInsightsResult.__proto__ || Object.getPrototypeOf(InstagramInsightsResult)).apply(this, arguments));
  }

  createClass(InstagramInsightsResult, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        description: 'description',
        id: 'id',
        name: 'name',
        period: 'period',
        title: 'title',
        values: 'values'
      });
    }
  }, {
    key: 'Metric',
    get: function get() {
      return Object.freeze({
        carousel_album_engagement: 'carousel_album_engagement',
        carousel_album_impressions: 'carousel_album_impressions',
        carousel_album_reach: 'carousel_album_reach',
        carousel_album_saved: 'carousel_album_saved',
        carousel_album_video_views: 'carousel_album_video_views',
        engagement: 'engagement',
        exits: 'exits',
        impressions: 'impressions',
        reach: 'reach',
        replies: 'replies',
        saved: 'saved',
        taps_back: 'taps_back',
        taps_forward: 'taps_forward',
        video_views: 'video_views'
      });
    }
  }, {
    key: 'Period',
    get: function get() {
      return Object.freeze({
        day: 'day',
        days_28: 'days_28',
        lifetime: 'lifetime',
        month: 'month',
        week: 'week'
      });
    }
  }]);
  return InstagramInsightsResult;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * IGMedia
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var IGMedia = function (_AbstractCrudObject) {
  inherits(IGMedia, _AbstractCrudObject);

  function IGMedia() {
    classCallCheck(this, IGMedia);
    return possibleConstructorReturn(this, (IGMedia.__proto__ || Object.getPrototypeOf(IGMedia)).apply(this, arguments));
  }

  createClass(IGMedia, [{
    key: 'getChildren',
    value: function getChildren(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(IGMedia, fields, params, fetchFirstPage, '/children');
    }
  }, {
    key: 'getComments',
    value: function getComments(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(IGComment, fields, params, fetchFirstPage, '/comments');
    }
  }, {
    key: 'createComment',
    value: function createComment(fields, params) {
      return this.createEdge('/comments', fields, params, IGComment);
    }
  }, {
    key: 'getInsights',
    value: function getInsights(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(InstagramInsightsResult, fields, params, fetchFirstPage, '/insights');
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(IGMedia.prototype.__proto__ || Object.getPrototypeOf(IGMedia.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        caption: 'caption',
        comments_count: 'comments_count',
        id: 'id',
        ig_id: 'ig_id',
        is_comment_enabled: 'is_comment_enabled',
        like_count: 'like_count',
        media_type: 'media_type',
        media_url: 'media_url',
        owner: 'owner',
        permalink: 'permalink',
        shortcode: 'shortcode',
        thumbnail_url: 'thumbnail_url',
        timestamp: 'timestamp',
        username: 'username'
      });
    }
  }]);
  return IGMedia;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * IGUser
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var IGUser = function (_AbstractCrudObject) {
  inherits(IGUser, _AbstractCrudObject);

  function IGUser() {
    classCallCheck(this, IGUser);
    return possibleConstructorReturn(this, (IGUser.__proto__ || Object.getPrototypeOf(IGUser)).apply(this, arguments));
  }

  createClass(IGUser, [{
    key: 'getInsights',
    value: function getInsights(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(InstagramInsightsResult, fields, params, fetchFirstPage, '/insights');
    }
  }, {
    key: 'getMedia',
    value: function getMedia(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(IGMedia, fields, params, fetchFirstPage, '/media');
    }
  }, {
    key: 'createMedia',
    value: function createMedia(fields, params) {
      return this.createEdge('/media', fields, params, IGMedia);
    }
  }, {
    key: 'createMediaPublish',
    value: function createMediaPublish(fields, params) {
      return this.createEdge('/media_publish', fields, params, IGMedia);
    }
  }, {
    key: 'createMention',
    value: function createMention(fields, params) {
      return this.createEdge('/mentions', fields, params);
    }
  }, {
    key: 'getRecentlySearchedHashtags',
    value: function getRecentlySearchedHashtags(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/recently_searched_hashtags');
    }
  }, {
    key: 'getStories',
    value: function getStories(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(IGMedia, fields, params, fetchFirstPage, '/stories');
    }
  }, {
    key: 'getTags',
    value: function getTags(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(IGMedia, fields, params, fetchFirstPage, '/tags');
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        biography: 'biography',
        business_discovery: 'business_discovery',
        followers_count: 'followers_count',
        follows_count: 'follows_count',
        id: 'id',
        ig_id: 'ig_id',
        media_count: 'media_count',
        mentioned_comment: 'mentioned_comment',
        mentioned_media: 'mentioned_media',
        name: 'name',
        profile_picture_url: 'profile_picture_url',
        username: 'username',
        website: 'website'
      });
    }
  }]);
  return IGUser;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * InstagramInsightsValue
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var InstagramInsightsValue = function (_AbstractCrudObject) {
  inherits(InstagramInsightsValue, _AbstractCrudObject);

  function InstagramInsightsValue() {
    classCallCheck(this, InstagramInsightsValue);
    return possibleConstructorReturn(this, (InstagramInsightsValue.__proto__ || Object.getPrototypeOf(InstagramInsightsValue)).apply(this, arguments));
  }

  createClass(InstagramInsightsValue, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        end_time: 'end_time',
        value: 'value'
      });
    }
  }]);
  return InstagramInsightsValue;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * IosAppLink
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var IosAppLink = function (_AbstractCrudObject) {
  inherits(IosAppLink, _AbstractCrudObject);

  function IosAppLink() {
    classCallCheck(this, IosAppLink);
    return possibleConstructorReturn(this, (IosAppLink.__proto__ || Object.getPrototypeOf(IosAppLink)).apply(this, arguments));
  }

  createClass(IosAppLink, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        app_name: 'app_name',
        app_store_id: 'app_store_id',
        url: 'url'
      });
    }
  }]);
  return IosAppLink;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * IterativeSplitTestConfig
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var IterativeSplitTestConfig = function (_AbstractCrudObject) {
  inherits(IterativeSplitTestConfig, _AbstractCrudObject);

  function IterativeSplitTestConfig() {
    classCallCheck(this, IterativeSplitTestConfig);
    return possibleConstructorReturn(this, (IterativeSplitTestConfig.__proto__ || Object.getPrototypeOf(IterativeSplitTestConfig)).apply(this, arguments));
  }

  createClass(IterativeSplitTestConfig, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        budget: 'budget',
        end_time: 'end_time',
        guidance: 'guidance',
        id: 'id',
        iterative_split_test_original_variant_id: 'iterative_split_test_original_variant_id',
        iterative_split_test_variant_to_split_mapping: 'iterative_split_test_variant_to_split_mapping',
        results_window: 'results_window',
        splits: 'splits',
        start_time: 'start_time'
      });
    }
  }]);
  return IterativeSplitTestConfig;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * KeyValue
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var KeyValue = function (_AbstractCrudObject) {
  inherits(KeyValue, _AbstractCrudObject);

  function KeyValue() {
    classCallCheck(this, KeyValue);
    return possibleConstructorReturn(this, (KeyValue.__proto__ || Object.getPrototypeOf(KeyValue)).apply(this, arguments));
  }

  createClass(KeyValue, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        key: 'key',
        value: 'value'
      });
    }
  }]);
  return KeyValue;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * LeadGenAppointmentBookingInfo
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var LeadGenAppointmentBookingInfo = function (_AbstractCrudObject) {
  inherits(LeadGenAppointmentBookingInfo, _AbstractCrudObject);

  function LeadGenAppointmentBookingInfo() {
    classCallCheck(this, LeadGenAppointmentBookingInfo);
    return possibleConstructorReturn(this, (LeadGenAppointmentBookingInfo.__proto__ || Object.getPrototypeOf(LeadGenAppointmentBookingInfo)).apply(this, arguments));
  }

  createClass(LeadGenAppointmentBookingInfo, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        advertiser_timezone_offset: 'advertiser_timezone_offset',
        appointment_durations: 'appointment_durations',
        appointment_slots_by_day: 'appointment_slots_by_day'
      });
    }
  }]);
  return LeadGenAppointmentBookingInfo;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * LeadGenConditionalQuestionsGroupChoices
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var LeadGenConditionalQuestionsGroupChoices = function (_AbstractCrudObject) {
  inherits(LeadGenConditionalQuestionsGroupChoices, _AbstractCrudObject);

  function LeadGenConditionalQuestionsGroupChoices() {
    classCallCheck(this, LeadGenConditionalQuestionsGroupChoices);
    return possibleConstructorReturn(this, (LeadGenConditionalQuestionsGroupChoices.__proto__ || Object.getPrototypeOf(LeadGenConditionalQuestionsGroupChoices)).apply(this, arguments));
  }

  createClass(LeadGenConditionalQuestionsGroupChoices, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        customized_token: 'customized_token',
        next_question_choices: 'next_question_choices',
        value: 'value'
      });
    }
  }]);
  return LeadGenConditionalQuestionsGroupChoices;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * LeadGenConditionalQuestionsGroupQuestions
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var LeadGenConditionalQuestionsGroupQuestions = function (_AbstractCrudObject) {
  inherits(LeadGenConditionalQuestionsGroupQuestions, _AbstractCrudObject);

  function LeadGenConditionalQuestionsGroupQuestions() {
    classCallCheck(this, LeadGenConditionalQuestionsGroupQuestions);
    return possibleConstructorReturn(this, (LeadGenConditionalQuestionsGroupQuestions.__proto__ || Object.getPrototypeOf(LeadGenConditionalQuestionsGroupQuestions)).apply(this, arguments));
  }

  createClass(LeadGenConditionalQuestionsGroupQuestions, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        field_key: 'field_key',
        input_type: 'input_type',
        name: 'name'
      });
    }
  }]);
  return LeadGenConditionalQuestionsGroupQuestions;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * LeadGenDraftQuestion
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var LeadGenDraftQuestion = function (_AbstractCrudObject) {
  inherits(LeadGenDraftQuestion, _AbstractCrudObject);

  function LeadGenDraftQuestion() {
    classCallCheck(this, LeadGenDraftQuestion);
    return possibleConstructorReturn(this, (LeadGenDraftQuestion.__proto__ || Object.getPrototypeOf(LeadGenDraftQuestion)).apply(this, arguments));
  }

  createClass(LeadGenDraftQuestion, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        conditional_questions_choices: 'conditional_questions_choices',
        conditional_questions_group_id: 'conditional_questions_group_id',
        dependent_conditional_questions: 'dependent_conditional_questions',
        inline_context: 'inline_context',
        key: 'key',
        label: 'label',
        options: 'options',
        type: 'type'
      });
    }
  }]);
  return LeadGenDraftQuestion;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * LeadGenFormPreviewDetails
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var LeadGenFormPreviewDetails = function (_AbstractCrudObject) {
  inherits(LeadGenFormPreviewDetails, _AbstractCrudObject);

  function LeadGenFormPreviewDetails() {
    classCallCheck(this, LeadGenFormPreviewDetails);
    return possibleConstructorReturn(this, (LeadGenFormPreviewDetails.__proto__ || Object.getPrototypeOf(LeadGenFormPreviewDetails)).apply(this, arguments));
  }

  createClass(LeadGenFormPreviewDetails, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        call_to_action_title: 'call_to_action_title',
        default_appointment_scheduling_inline_context: 'default_appointment_scheduling_inline_context',
        default_thank_you_page: 'default_thank_you_page',
        edit_text: 'edit_text',
        email_inline_context_text: 'email_inline_context_text',
        next_button_text: 'next_button_text',
        personal_info_text: 'personal_info_text',
        phone_number_inline_context_text: 'phone_number_inline_context_text',
        review_your_info_text: 'review_your_info_text',
        secure_sharing_text: 'secure_sharing_text',
        slide_to_submit_text: 'slide_to_submit_text',
        submit_button_text: 'submit_button_text'
      });
    }
  }]);
  return LeadGenFormPreviewDetails;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * LeadGenQuestion
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var LeadGenQuestion = function (_AbstractCrudObject) {
  inherits(LeadGenQuestion, _AbstractCrudObject);

  function LeadGenQuestion() {
    classCallCheck(this, LeadGenQuestion);
    return possibleConstructorReturn(this, (LeadGenQuestion.__proto__ || Object.getPrototypeOf(LeadGenQuestion)).apply(this, arguments));
  }

  createClass(LeadGenQuestion, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        conditional_questions_choices: 'conditional_questions_choices',
        conditional_questions_group_id: 'conditional_questions_group_id',
        dependent_conditional_questions: 'dependent_conditional_questions',
        id: 'id',
        inline_context: 'inline_context',
        key: 'key',
        label: 'label',
        options: 'options',
        type: 'type'
      });
    }
  }]);
  return LeadGenQuestion;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * LeadGenQuestionOption
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var LeadGenQuestionOption = function (_AbstractCrudObject) {
  inherits(LeadGenQuestionOption, _AbstractCrudObject);

  function LeadGenQuestionOption() {
    classCallCheck(this, LeadGenQuestionOption);
    return possibleConstructorReturn(this, (LeadGenQuestionOption.__proto__ || Object.getPrototypeOf(LeadGenQuestionOption)).apply(this, arguments));
  }

  createClass(LeadGenQuestionOption, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        key: 'key',
        value: 'value'
      });
    }
  }]);
  return LeadGenQuestionOption;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * LifeEvent
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var LifeEvent = function (_AbstractCrudObject) {
  inherits(LifeEvent, _AbstractCrudObject);

  function LifeEvent() {
    classCallCheck(this, LifeEvent);
    return possibleConstructorReturn(this, (LifeEvent.__proto__ || Object.getPrototypeOf(LifeEvent)).apply(this, arguments));
  }

  createClass(LifeEvent, [{
    key: 'getComments',
    value: function getComments(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Comment, fields, params, fetchFirstPage, '/comments');
    }
  }, {
    key: 'getLikes',
    value: function getLikes(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Profile, fields, params, fetchFirstPage, '/likes');
    }
  }, {
    key: 'getPhotos',
    value: function getPhotos(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Photo, fields, params, fetchFirstPage, '/photos');
    }
  }, {
    key: 'getSharedPosts',
    value: function getSharedPosts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Post, fields, params, fetchFirstPage, '/sharedposts');
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        created_time: 'created_time',
        description: 'description',
        end_time: 'end_time',
        from: 'from',
        id: 'id',
        is_hidden: 'is_hidden',
        start_time: 'start_time',
        title: 'title',
        updated_time: 'updated_time'
      });
    }
  }]);
  return LifeEvent;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Link
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Link = function (_AbstractCrudObject) {
  inherits(Link, _AbstractCrudObject);

  function Link() {
    classCallCheck(this, Link);
    return possibleConstructorReturn(this, (Link.__proto__ || Object.getPrototypeOf(Link)).apply(this, arguments));
  }

  createClass(Link, [{
    key: 'createComment',
    value: function createComment(fields, params) {
      return this.createEdge('/comments', fields, params, Comment);
    }
  }, {
    key: 'getSharedPosts',
    value: function getSharedPosts(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Post, fields, params, fetchFirstPage, '/sharedposts');
    }
  }, {
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(Link.prototype.__proto__ || Object.getPrototypeOf(Link.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        caption: 'caption',
        created_time: 'created_time',
        description: 'description',
        from: 'from',
        icon: 'icon',
        id: 'id',
        link: 'link',
        message: 'message',
        multi_share_optimized: 'multi_share_optimized',
        name: 'name',
        privacy: 'privacy',
        via: 'via'
      });
    }
  }]);
  return Link;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * LiveVideoAdBreakConfig
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var LiveVideoAdBreakConfig = function (_AbstractCrudObject) {
  inherits(LiveVideoAdBreakConfig, _AbstractCrudObject);

  function LiveVideoAdBreakConfig() {
    classCallCheck(this, LiveVideoAdBreakConfig);
    return possibleConstructorReturn(this, (LiveVideoAdBreakConfig.__proto__ || Object.getPrototypeOf(LiveVideoAdBreakConfig)).apply(this, arguments));
  }

  createClass(LiveVideoAdBreakConfig, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        default_ad_break_duration: 'default_ad_break_duration',
        failure_reason_polling_interval: 'failure_reason_polling_interval',
        first_break_eligible_secs: 'first_break_eligible_secs',
        guide_url: 'guide_url',
        is_eligible_to_onboard: 'is_eligible_to_onboard',
        is_enabled: 'is_enabled',
        onboarding_url: 'onboarding_url',
        preparing_duration: 'preparing_duration',
        time_between_ad_breaks_secs: 'time_between_ad_breaks_secs',
        viewer_count_threshold: 'viewer_count_threshold'
      });
    }
  }]);
  return LiveVideoAdBreakConfig;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * LiveVideoInputStream
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var LiveVideoInputStream = function (_AbstractCrudObject) {
  inherits(LiveVideoInputStream, _AbstractCrudObject);

  function LiveVideoInputStream() {
    classCallCheck(this, LiveVideoInputStream);
    return possibleConstructorReturn(this, (LiveVideoInputStream.__proto__ || Object.getPrototypeOf(LiveVideoInputStream)).apply(this, arguments));
  }

  createClass(LiveVideoInputStream, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        dash_ingest_url: 'dash_ingest_url',
        dash_preview_url: 'dash_preview_url',
        id: 'id',
        is_master: 'is_master',
        live_encoder: 'live_encoder',
        secure_stream_url: 'secure_stream_url',
        stream_health: 'stream_health',
        stream_id: 'stream_id',
        stream_url: 'stream_url'
      });
    }
  }]);
  return LiveVideoInputStream;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * LiveVideoTargeting
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var LiveVideoTargeting = function (_AbstractCrudObject) {
  inherits(LiveVideoTargeting, _AbstractCrudObject);

  function LiveVideoTargeting() {
    classCallCheck(this, LiveVideoTargeting);
    return possibleConstructorReturn(this, (LiveVideoTargeting.__proto__ || Object.getPrototypeOf(LiveVideoTargeting)).apply(this, arguments));
  }

  createClass(LiveVideoTargeting, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        age_max: 'age_max',
        age_min: 'age_min',
        excluded_countries: 'excluded_countries',
        geo_locations: 'geo_locations'
      });
    }
  }]);
  return LiveVideoTargeting;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Location
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Location = function (_AbstractCrudObject) {
  inherits(Location, _AbstractCrudObject);

  function Location() {
    classCallCheck(this, Location);
    return possibleConstructorReturn(this, (Location.__proto__ || Object.getPrototypeOf(Location)).apply(this, arguments));
  }

  createClass(Location, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        city: 'city',
        city_id: 'city_id',
        country: 'country',
        country_code: 'country_code',
        latitude: 'latitude',
        located_in: 'located_in',
        longitude: 'longitude',
        name: 'name',
        region: 'region',
        region_id: 'region_id',
        state: 'state',
        street: 'street',
        zip: 'zip'
      });
    }
  }]);
  return Location;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * LookalikeSpec
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var LookalikeSpec = function (_AbstractCrudObject) {
  inherits(LookalikeSpec, _AbstractCrudObject);

  function LookalikeSpec() {
    classCallCheck(this, LookalikeSpec);
    return possibleConstructorReturn(this, (LookalikeSpec.__proto__ || Object.getPrototypeOf(LookalikeSpec)).apply(this, arguments));
  }

  createClass(LookalikeSpec, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        country: 'country',
        is_financial_service: 'is_financial_service',
        origin: 'origin',
        origin_event_name: 'origin_event_name',
        origin_event_source_name: 'origin_event_source_name',
        origin_event_source_type: 'origin_event_source_type',
        product_set_name: 'product_set_name',
        ratio: 'ratio',
        starting_ratio: 'starting_ratio',
        target_countries: 'target_countries',
        target_country_names: 'target_country_names',
        type: 'type'
      });
    }
  }]);
  return LookalikeSpec;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * MailingAddress
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var MailingAddress = function (_AbstractCrudObject) {
  inherits(MailingAddress, _AbstractCrudObject);

  function MailingAddress() {
    classCallCheck(this, MailingAddress);
    return possibleConstructorReturn(this, (MailingAddress.__proto__ || Object.getPrototypeOf(MailingAddress)).apply(this, arguments));
  }

  createClass(MailingAddress, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        city: 'city',
        city_page: 'city_page',
        country: 'country',
        id: 'id',
        postal_code: 'postal_code',
        region: 'region',
        street1: 'street1',
        street2: 'street2'
      });
    }
  }]);
  return MailingAddress;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * MessengerPlatformReferral
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var MessengerPlatformReferral = function (_AbstractCrudObject) {
  inherits(MessengerPlatformReferral, _AbstractCrudObject);

  function MessengerPlatformReferral() {
    classCallCheck(this, MessengerPlatformReferral);
    return possibleConstructorReturn(this, (MessengerPlatformReferral.__proto__ || Object.getPrototypeOf(MessengerPlatformReferral)).apply(this, arguments));
  }

  createClass(MessengerPlatformReferral, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        ad_id: 'ad_id',
        id: 'id',
        ref: 'ref',
        source: 'source',
        type: 'type'
      });
    }
  }]);
  return MessengerPlatformReferral;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * MusicVideoCopyright
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var MusicVideoCopyright = function (_AbstractCrudObject) {
  inherits(MusicVideoCopyright, _AbstractCrudObject);

  function MusicVideoCopyright() {
    classCallCheck(this, MusicVideoCopyright);
    return possibleConstructorReturn(this, (MusicVideoCopyright.__proto__ || Object.getPrototypeOf(MusicVideoCopyright)).apply(this, arguments));
  }

  createClass(MusicVideoCopyright, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        creation_time: 'creation_time',
        displayed_matches_count: 'displayed_matches_count',
        id: 'id',
        in_conflict: 'in_conflict',
        isrc: 'isrc',
        ownership_countries: 'ownership_countries',
        reference_file_status: 'reference_file_status',
        ridge_monitoring_status: 'ridge_monitoring_status',
        update_time: 'update_time',
        video_asset: 'video_asset',
        whitelisted_fb_users: 'whitelisted_fb_users',
        whitelisted_ig_users: 'whitelisted_ig_users'
      });
    }
  }]);
  return MusicVideoCopyright;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * NativeOfferDiscount
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var NativeOfferDiscount = function (_AbstractCrudObject) {
  inherits(NativeOfferDiscount, _AbstractCrudObject);

  function NativeOfferDiscount() {
    classCallCheck(this, NativeOfferDiscount);
    return possibleConstructorReturn(this, (NativeOfferDiscount.__proto__ || Object.getPrototypeOf(NativeOfferDiscount)).apply(this, arguments));
  }

  createClass(NativeOfferDiscount, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        currency: 'currency',
        override: 'override',
        text: 'text',
        type: 'type',
        value1: 'value1',
        value2: 'value2'
      });
    }
  }]);
  return NativeOfferDiscount;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * NativeOfferView
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var NativeOfferView = function (_AbstractCrudObject) {
  inherits(NativeOfferView, _AbstractCrudObject);

  function NativeOfferView() {
    classCallCheck(this, NativeOfferView);
    return possibleConstructorReturn(this, (NativeOfferView.__proto__ || Object.getPrototypeOf(NativeOfferView)).apply(this, arguments));
  }

  createClass(NativeOfferView, [{
    key: 'getPhotos',
    value: function getPhotos(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(Photo, fields, params, fetchFirstPage, '/photos');
    }
  }, {
    key: 'createPhoto',
    value: function createPhoto(fields, params) {
      return this.createEdge('/photos', fields, params, NativeOfferView);
    }
  }, {
    key: 'createVideo',
    value: function createVideo(fields, params) {
      return this.createEdge('/videos', fields, params, NativeOfferView);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(NativeOfferView.prototype.__proto__ || Object.getPrototypeOf(NativeOfferView.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        id: 'id',
        offer: 'offer',
        save_count: 'save_count'
      });
    }
  }]);
  return NativeOfferView;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * OpenGraphContext
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var OpenGraphContext = function (_AbstractCrudObject) {
  inherits(OpenGraphContext, _AbstractCrudObject);

  function OpenGraphContext() {
    classCallCheck(this, OpenGraphContext);
    return possibleConstructorReturn(this, (OpenGraphContext.__proto__ || Object.getPrototypeOf(OpenGraphContext)).apply(this, arguments));
  }

  createClass(OpenGraphContext, [{
    key: 'getFriendsTaggedAt',
    value: function getFriendsTaggedAt(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(User, fields, params, fetchFirstPage, '/friends_tagged_at');
    }
  }, {
    key: 'getMusicListenFriends',
    value: function getMusicListenFriends(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(User, fields, params, fetchFirstPage, '/music_listen_friends');
    }
  }, {
    key: 'getVideoWatchFriends',
    value: function getVideoWatchFriends(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(User, fields, params, fetchFirstPage, '/video_watch_friends');
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        id: 'id'
      });
    }
  }]);
  return OpenGraphContext;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * OutcomePredictionPoint
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var OutcomePredictionPoint = function (_AbstractCrudObject) {
  inherits(OutcomePredictionPoint, _AbstractCrudObject);

  function OutcomePredictionPoint() {
    classCallCheck(this, OutcomePredictionPoint);
    return possibleConstructorReturn(this, (OutcomePredictionPoint.__proto__ || Object.getPrototypeOf(OutcomePredictionPoint)).apply(this, arguments));
  }

  createClass(OutcomePredictionPoint, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        actions: 'actions',
        impressions: 'impressions',
        reach: 'reach',
        spend: 'spend'
      });
    }
  }]);
  return OutcomePredictionPoint;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * PageAboutStory
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var PageAboutStory = function (_AbstractCrudObject) {
  inherits(PageAboutStory, _AbstractCrudObject);

  function PageAboutStory() {
    classCallCheck(this, PageAboutStory);
    return possibleConstructorReturn(this, (PageAboutStory.__proto__ || Object.getPrototypeOf(PageAboutStory)).apply(this, arguments));
  }

  createClass(PageAboutStory, [{
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(PageAboutStory.prototype.__proto__ || Object.getPrototypeOf(PageAboutStory.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(PageAboutStory.prototype.__proto__ || Object.getPrototypeOf(PageAboutStory.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        composed_text: 'composed_text',
        cover_photo: 'cover_photo',
        entity_map: 'entity_map',
        id: 'id',
        is_published: 'is_published',
        page_id: 'page_id',
        title: 'title'
      });
    }
  }]);
  return PageAboutStory;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * PageBroadcast
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var PageBroadcast = function (_AbstractCrudObject) {
  inherits(PageBroadcast, _AbstractCrudObject);

  function PageBroadcast() {
    classCallCheck(this, PageBroadcast);
    return possibleConstructorReturn(this, (PageBroadcast.__proto__ || Object.getPrototypeOf(PageBroadcast)).apply(this, arguments));
  }

  createClass(PageBroadcast, [{
    key: 'getInsights',
    value: function getInsights(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(InsightsResult, fields, params, fetchFirstPage, '/insights');
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(PageBroadcast.prototype.__proto__ || Object.getPrototypeOf(PageBroadcast.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        id: 'id',
        scheduled_time: 'scheduled_time',
        status: 'status'
      });
    }
  }, {
    key: 'Operation',
    get: function get() {
      return Object.freeze({
        cancel: 'CANCEL'
      });
    }
  }]);
  return PageBroadcast;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * PageCategory
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var PageCategory = function (_AbstractCrudObject) {
  inherits(PageCategory, _AbstractCrudObject);

  function PageCategory() {
    classCallCheck(this, PageCategory);
    return possibleConstructorReturn(this, (PageCategory.__proto__ || Object.getPrototypeOf(PageCategory)).apply(this, arguments));
  }

  createClass(PageCategory, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        api_enum: 'api_enum',
        fb_page_categories: 'fb_page_categories',
        id: 'id',
        name: 'name'
      });
    }
  }]);
  return PageCategory;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * PageChangeProposal
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var PageChangeProposal = function (_AbstractCrudObject) {
  inherits(PageChangeProposal, _AbstractCrudObject);

  function PageChangeProposal() {
    classCallCheck(this, PageChangeProposal);
    return possibleConstructorReturn(this, (PageChangeProposal.__proto__ || Object.getPrototypeOf(PageChangeProposal)).apply(this, arguments));
  }

  createClass(PageChangeProposal, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(PageChangeProposal.prototype.__proto__ || Object.getPrototypeOf(PageChangeProposal.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        acceptance_status: 'acceptance_status',
        category: 'category',
        current_value: 'current_value',
        id: 'id',
        proposed_value: 'proposed_value',
        upcoming_change_info: 'upcoming_change_info'
      });
    }
  }]);
  return PageChangeProposal;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * PageLabel
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var PageLabel = function (_AbstractCrudObject) {
  inherits(PageLabel, _AbstractCrudObject);

  function PageLabel() {
    classCallCheck(this, PageLabel);
    return possibleConstructorReturn(this, (PageLabel.__proto__ || Object.getPrototypeOf(PageLabel)).apply(this, arguments));
  }

  createClass(PageLabel, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        creation_time: 'creation_time',
        creator_id: 'creator_id',
        from: 'from',
        id: 'id',
        name: 'name'
      });
    }
  }]);
  return PageLabel;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * PageParking
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var PageParking = function (_AbstractCrudObject) {
  inherits(PageParking, _AbstractCrudObject);

  function PageParking() {
    classCallCheck(this, PageParking);
    return possibleConstructorReturn(this, (PageParking.__proto__ || Object.getPrototypeOf(PageParking)).apply(this, arguments));
  }

  createClass(PageParking, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        lot: 'lot',
        street: 'street',
        valet: 'valet'
      });
    }
  }]);
  return PageParking;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * PagePaymentOptions
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var PagePaymentOptions = function (_AbstractCrudObject) {
  inherits(PagePaymentOptions, _AbstractCrudObject);

  function PagePaymentOptions() {
    classCallCheck(this, PagePaymentOptions);
    return possibleConstructorReturn(this, (PagePaymentOptions.__proto__ || Object.getPrototypeOf(PagePaymentOptions)).apply(this, arguments));
  }

  createClass(PagePaymentOptions, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        amex: 'amex',
        cash_only: 'cash_only',
        discover: 'discover',
        mastercard: 'mastercard',
        visa: 'visa'
      });
    }
  }]);
  return PagePaymentOptions;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * PageRestaurantServices
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var PageRestaurantServices = function (_AbstractCrudObject) {
  inherits(PageRestaurantServices, _AbstractCrudObject);

  function PageRestaurantServices() {
    classCallCheck(this, PageRestaurantServices);
    return possibleConstructorReturn(this, (PageRestaurantServices.__proto__ || Object.getPrototypeOf(PageRestaurantServices)).apply(this, arguments));
  }

  createClass(PageRestaurantServices, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        catering: 'catering',
        delivery: 'delivery',
        groups: 'groups',
        kids: 'kids',
        outdoor: 'outdoor',
        pickup: 'pickup',
        reserve: 'reserve',
        takeout: 'takeout',
        waiter: 'waiter',
        walkins: 'walkins'
      });
    }
  }]);
  return PageRestaurantServices;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * PageRestaurantSpecialties
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var PageRestaurantSpecialties = function (_AbstractCrudObject) {
  inherits(PageRestaurantSpecialties, _AbstractCrudObject);

  function PageRestaurantSpecialties() {
    classCallCheck(this, PageRestaurantSpecialties);
    return possibleConstructorReturn(this, (PageRestaurantSpecialties.__proto__ || Object.getPrototypeOf(PageRestaurantSpecialties)).apply(this, arguments));
  }

  createClass(PageRestaurantSpecialties, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        breakfast: 'breakfast',
        coffee: 'coffee',
        dinner: 'dinner',
        drinks: 'drinks',
        lunch: 'lunch'
      });
    }
  }]);
  return PageRestaurantSpecialties;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * PageSavedFilter
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var PageSavedFilter = function (_AbstractCrudObject) {
  inherits(PageSavedFilter, _AbstractCrudObject);

  function PageSavedFilter() {
    classCallCheck(this, PageSavedFilter);
    return possibleConstructorReturn(this, (PageSavedFilter.__proto__ || Object.getPrototypeOf(PageSavedFilter)).apply(this, arguments));
  }

  createClass(PageSavedFilter, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        display_name: 'display_name',
        filters: 'filters',
        id: 'id',
        page_id: 'page_id',
        section: 'section',
        time_created: 'time_created',
        time_updated: 'time_updated'
      });
    }
  }]);
  return PageSavedFilter;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * PageStartInfo
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var PageStartInfo = function (_AbstractCrudObject) {
  inherits(PageStartInfo, _AbstractCrudObject);

  function PageStartInfo() {
    classCallCheck(this, PageStartInfo);
    return possibleConstructorReturn(this, (PageStartInfo.__proto__ || Object.getPrototypeOf(PageStartInfo)).apply(this, arguments));
  }

  createClass(PageStartInfo, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        date: 'date',
        type: 'type'
      });
    }
  }]);
  return PageStartInfo;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * PageUpcomingChange
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var PageUpcomingChange = function (_AbstractCrudObject) {
  inherits(PageUpcomingChange, _AbstractCrudObject);

  function PageUpcomingChange() {
    classCallCheck(this, PageUpcomingChange);
    return possibleConstructorReturn(this, (PageUpcomingChange.__proto__ || Object.getPrototypeOf(PageUpcomingChange)).apply(this, arguments));
  }

  createClass(PageUpcomingChange, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(PageUpcomingChange.prototype.__proto__ || Object.getPrototypeOf(PageUpcomingChange.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        change_type: 'change_type',
        effective_time: 'effective_time',
        id: 'id',
        page: 'page',
        proposal: 'proposal',
        timer_status: 'timer_status'
      });
    }
  }]);
  return PageUpcomingChange;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * PaymentPricepoints
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var PaymentPricepoints = function (_AbstractCrudObject) {
  inherits(PaymentPricepoints, _AbstractCrudObject);

  function PaymentPricepoints() {
    classCallCheck(this, PaymentPricepoints);
    return possibleConstructorReturn(this, (PaymentPricepoints.__proto__ || Object.getPrototypeOf(PaymentPricepoints)).apply(this, arguments));
  }

  createClass(PaymentPricepoints, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        mobile: 'mobile'
      });
    }
  }]);
  return PaymentPricepoints;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Place
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Place = function (_AbstractCrudObject) {
  inherits(Place, _AbstractCrudObject);

  function Place() {
    classCallCheck(this, Place);
    return possibleConstructorReturn(this, (Place.__proto__ || Object.getPrototypeOf(Place)).apply(this, arguments));
  }

  createClass(Place, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        id: 'id',
        location: 'location',
        name: 'name',
        overall_rating: 'overall_rating'
      });
    }
  }]);
  return Place;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * PlaceTopic
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var PlaceTopic = function (_AbstractCrudObject) {
  inherits(PlaceTopic, _AbstractCrudObject);

  function PlaceTopic() {
    classCallCheck(this, PlaceTopic);
    return possibleConstructorReturn(this, (PlaceTopic.__proto__ || Object.getPrototypeOf(PlaceTopic)).apply(this, arguments));
  }

  createClass(PlaceTopic, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        count: 'count',
        has_children: 'has_children',
        icon_url: 'icon_url',
        id: 'id',
        name: 'name',
        parent_ids: 'parent_ids',
        plural_name: 'plural_name',
        top_subtopic_names: 'top_subtopic_names'
      });
    }
  }]);
  return PlaceTopic;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * PlatformImageSource
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var PlatformImageSource = function (_AbstractCrudObject) {
  inherits(PlatformImageSource, _AbstractCrudObject);

  function PlatformImageSource() {
    classCallCheck(this, PlatformImageSource);
    return possibleConstructorReturn(this, (PlatformImageSource.__proto__ || Object.getPrototypeOf(PlatformImageSource)).apply(this, arguments));
  }

  createClass(PlatformImageSource, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        height: 'height',
        source: 'source',
        width: 'width'
      });
    }
  }]);
  return PlatformImageSource;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Privacy
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Privacy = function (_AbstractCrudObject) {
  inherits(Privacy, _AbstractCrudObject);

  function Privacy() {
    classCallCheck(this, Privacy);
    return possibleConstructorReturn(this, (Privacy.__proto__ || Object.getPrototypeOf(Privacy)).apply(this, arguments));
  }

  createClass(Privacy, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        allow: 'allow',
        deny: 'deny',
        description: 'description',
        friends: 'friends',
        networks: 'networks',
        value: 'value'
      });
    }
  }]);
  return Privacy;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ProductCatalogImageSettings
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ProductCatalogImageSettings = function (_AbstractCrudObject) {
  inherits(ProductCatalogImageSettings, _AbstractCrudObject);

  function ProductCatalogImageSettings() {
    classCallCheck(this, ProductCatalogImageSettings);
    return possibleConstructorReturn(this, (ProductCatalogImageSettings.__proto__ || Object.getPrototypeOf(ProductCatalogImageSettings)).apply(this, arguments));
  }

  createClass(ProductCatalogImageSettings, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        carousel_ad: 'carousel_ad',
        single_ad: 'single_ad'
      });
    }
  }]);
  return ProductCatalogImageSettings;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ProductCatalogImageSettingsOperation
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ProductCatalogImageSettingsOperation = function (_AbstractCrudObject) {
  inherits(ProductCatalogImageSettingsOperation, _AbstractCrudObject);

  function ProductCatalogImageSettingsOperation() {
    classCallCheck(this, ProductCatalogImageSettingsOperation);
    return possibleConstructorReturn(this, (ProductCatalogImageSettingsOperation.__proto__ || Object.getPrototypeOf(ProductCatalogImageSettingsOperation)).apply(this, arguments));
  }

  createClass(ProductCatalogImageSettingsOperation, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        transformation_type: 'transformation_type'
      });
    }
  }]);
  return ProductCatalogImageSettingsOperation;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ProductFeedMissingFeedItemReplacement
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ProductFeedMissingFeedItemReplacement = function (_AbstractCrudObject) {
  inherits(ProductFeedMissingFeedItemReplacement, _AbstractCrudObject);

  function ProductFeedMissingFeedItemReplacement() {
    classCallCheck(this, ProductFeedMissingFeedItemReplacement);
    return possibleConstructorReturn(this, (ProductFeedMissingFeedItemReplacement.__proto__ || Object.getPrototypeOf(ProductFeedMissingFeedItemReplacement)).apply(this, arguments));
  }

  createClass(ProductFeedMissingFeedItemReplacement, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        home_listing: 'home_listing',
        product_item: 'product_item',
        store_product_item: 'store_product_item',
        vehicle: 'vehicle'
      });
    }
  }]);
  return ProductFeedMissingFeedItemReplacement;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ProductFeedSchedule
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ProductFeedSchedule = function (_AbstractCrudObject) {
  inherits(ProductFeedSchedule, _AbstractCrudObject);

  function ProductFeedSchedule() {
    classCallCheck(this, ProductFeedSchedule);
    return possibleConstructorReturn(this, (ProductFeedSchedule.__proto__ || Object.getPrototypeOf(ProductFeedSchedule)).apply(this, arguments));
  }

  createClass(ProductFeedSchedule, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        day_of_month: 'day_of_month',
        day_of_week: 'day_of_week',
        hour: 'hour',
        interval: 'interval',
        interval_count: 'interval_count',
        minute: 'minute',
        timezone: 'timezone',
        url: 'url',
        username: 'username'
      });
    }
  }, {
    key: 'DayOfWeek',
    get: function get() {
      return Object.freeze({
        friday: 'FRIDAY',
        monday: 'MONDAY',
        saturday: 'SATURDAY',
        sunday: 'SUNDAY',
        thursday: 'THURSDAY',
        tuesday: 'TUESDAY',
        wednesday: 'WEDNESDAY'
      });
    }
  }, {
    key: 'Interval',
    get: function get() {
      return Object.freeze({
        daily: 'DAILY',
        hourly: 'HOURLY',
        monthly: 'MONTHLY',
        weekly: 'WEEKLY'
      });
    }
  }]);
  return ProductFeedSchedule;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ProductFeedUploadErrorReport
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ProductFeedUploadErrorReport = function (_AbstractCrudObject) {
  inherits(ProductFeedUploadErrorReport, _AbstractCrudObject);

  function ProductFeedUploadErrorReport() {
    classCallCheck(this, ProductFeedUploadErrorReport);
    return possibleConstructorReturn(this, (ProductFeedUploadErrorReport.__proto__ || Object.getPrototypeOf(ProductFeedUploadErrorReport)).apply(this, arguments));
  }

  createClass(ProductFeedUploadErrorReport, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        file_handle: 'file_handle',
        report_status: 'report_status'
      });
    }
  }]);
  return ProductFeedUploadErrorReport;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ProductItemCommerceInsights
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ProductItemCommerceInsights = function (_AbstractCrudObject) {
  inherits(ProductItemCommerceInsights, _AbstractCrudObject);

  function ProductItemCommerceInsights() {
    classCallCheck(this, ProductItemCommerceInsights);
    return possibleConstructorReturn(this, (ProductItemCommerceInsights.__proto__ || Object.getPrototypeOf(ProductItemCommerceInsights)).apply(this, arguments));
  }

  createClass(ProductItemCommerceInsights, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        message_sends: 'message_sends',
        organic_impressions: 'organic_impressions',
        paid_impressions: 'paid_impressions'
      });
    }
  }]);
  return ProductItemCommerceInsights;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ProductVariant
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ProductVariant = function (_AbstractCrudObject) {
  inherits(ProductVariant, _AbstractCrudObject);

  function ProductVariant() {
    classCallCheck(this, ProductVariant);
    return possibleConstructorReturn(this, (ProductVariant.__proto__ || Object.getPrototypeOf(ProductVariant)).apply(this, arguments));
  }

  createClass(ProductVariant, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        label: 'label',
        options: 'options',
        product_field: 'product_field'
      });
    }
  }]);
  return ProductVariant;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * RawCustomAudience
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var RawCustomAudience = function (_AbstractCrudObject) {
  inherits(RawCustomAudience, _AbstractCrudObject);

  function RawCustomAudience() {
    classCallCheck(this, RawCustomAudience);
    return possibleConstructorReturn(this, (RawCustomAudience.__proto__ || Object.getPrototypeOf(RawCustomAudience)).apply(this, arguments));
  }

  createClass(RawCustomAudience, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        id: 'id',
        name: 'name'
      });
    }
  }]);
  return RawCustomAudience;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ReachFrequencyActivity
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ReachFrequencyActivity = function (_AbstractCrudObject) {
  inherits(ReachFrequencyActivity, _AbstractCrudObject);

  function ReachFrequencyActivity() {
    classCallCheck(this, ReachFrequencyActivity);
    return possibleConstructorReturn(this, (ReachFrequencyActivity.__proto__ || Object.getPrototypeOf(ReachFrequencyActivity)).apply(this, arguments));
  }

  createClass(ReachFrequencyActivity, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        campaign_active: 'campaign_active',
        campaign_started: 'campaign_started',
        creative_uploaded: 'creative_uploaded',
        delivered_budget: 'delivered_budget',
        delivered_daily_grp: 'delivered_daily_grp',
        delivered_daily_impression: 'delivered_daily_impression',
        delivered_impression: 'delivered_impression',
        delivered_reach: 'delivered_reach',
        delivered_total_impression: 'delivered_total_impression',
        io_approved: 'io_approved',
        sf_link: 'sf_link'
      });
    }
  }]);
  return ReachFrequencyActivity;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ReachFrequencyAdFormat
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ReachFrequencyAdFormat = function (_AbstractCrudObject) {
  inherits(ReachFrequencyAdFormat, _AbstractCrudObject);

  function ReachFrequencyAdFormat() {
    classCallCheck(this, ReachFrequencyAdFormat);
    return possibleConstructorReturn(this, (ReachFrequencyAdFormat.__proto__ || Object.getPrototypeOf(ReachFrequencyAdFormat)).apply(this, arguments));
  }

  createClass(ReachFrequencyAdFormat, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        details: 'details',
        type: 'type'
      });
    }
  }]);
  return ReachFrequencyAdFormat;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ReachFrequencyCurveLowerConfidenceRange
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ReachFrequencyCurveLowerConfidenceRange = function (_AbstractCrudObject) {
  inherits(ReachFrequencyCurveLowerConfidenceRange, _AbstractCrudObject);

  function ReachFrequencyCurveLowerConfidenceRange() {
    classCallCheck(this, ReachFrequencyCurveLowerConfidenceRange);
    return possibleConstructorReturn(this, (ReachFrequencyCurveLowerConfidenceRange.__proto__ || Object.getPrototypeOf(ReachFrequencyCurveLowerConfidenceRange)).apply(this, arguments));
  }

  createClass(ReachFrequencyCurveLowerConfidenceRange, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        impression_lower: 'impression_lower',
        num_points: 'num_points',
        reach: 'reach',
        reach_lower: 'reach_lower',
        uniq_video_views_2s_lower: 'uniq_video_views_2s_lower',
        video_views_2s_lower: 'video_views_2s_lower'
      });
    }
  }]);
  return ReachFrequencyCurveLowerConfidenceRange;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ReachFrequencyCurveUpperConfidenceRange
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ReachFrequencyCurveUpperConfidenceRange = function (_AbstractCrudObject) {
  inherits(ReachFrequencyCurveUpperConfidenceRange, _AbstractCrudObject);

  function ReachFrequencyCurveUpperConfidenceRange() {
    classCallCheck(this, ReachFrequencyCurveUpperConfidenceRange);
    return possibleConstructorReturn(this, (ReachFrequencyCurveUpperConfidenceRange.__proto__ || Object.getPrototypeOf(ReachFrequencyCurveUpperConfidenceRange)).apply(this, arguments));
  }

  createClass(ReachFrequencyCurveUpperConfidenceRange, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        impression_upper: 'impression_upper',
        num_points: 'num_points',
        reach: 'reach',
        reach_upper: 'reach_upper',
        uniq_video_views_2s_upper: 'uniq_video_views_2s_upper',
        video_views_2s_upper: 'video_views_2s_upper'
      });
    }
  }]);
  return ReachFrequencyCurveUpperConfidenceRange;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ReachFrequencyDayPart
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ReachFrequencyDayPart = function (_AbstractCrudObject) {
  inherits(ReachFrequencyDayPart, _AbstractCrudObject);

  function ReachFrequencyDayPart() {
    classCallCheck(this, ReachFrequencyDayPart);
    return possibleConstructorReturn(this, (ReachFrequencyDayPart.__proto__ || Object.getPrototypeOf(ReachFrequencyDayPart)).apply(this, arguments));
  }

  createClass(ReachFrequencyDayPart, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        days: 'days',
        end_minute: 'end_minute',
        start_minute: 'start_minute'
      });
    }
  }]);
  return ReachFrequencyDayPart;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ReachFrequencyEstimatesCurve
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ReachFrequencyEstimatesCurve = function (_AbstractCrudObject) {
  inherits(ReachFrequencyEstimatesCurve, _AbstractCrudObject);

  function ReachFrequencyEstimatesCurve() {
    classCallCheck(this, ReachFrequencyEstimatesCurve);
    return possibleConstructorReturn(this, (ReachFrequencyEstimatesCurve.__proto__ || Object.getPrototypeOf(ReachFrequencyEstimatesCurve)).apply(this, arguments));
  }

  createClass(ReachFrequencyEstimatesCurve, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        budget: 'budget',
        click: 'click',
        conversion: 'conversion',
        impression: 'impression',
        interpolated_reach: 'interpolated_reach',
        num_points: 'num_points',
        raw_impression: 'raw_impression',
        raw_reach: 'raw_reach',
        reach: 'reach'
      });
    }
  }]);
  return ReachFrequencyEstimatesCurve;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ReachFrequencyEstimatesDemoBreakdown
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ReachFrequencyEstimatesDemoBreakdown = function (_AbstractCrudObject) {
  inherits(ReachFrequencyEstimatesDemoBreakdown, _AbstractCrudObject);

  function ReachFrequencyEstimatesDemoBreakdown() {
    classCallCheck(this, ReachFrequencyEstimatesDemoBreakdown);
    return possibleConstructorReturn(this, (ReachFrequencyEstimatesDemoBreakdown.__proto__ || Object.getPrototypeOf(ReachFrequencyEstimatesDemoBreakdown)).apply(this, arguments));
  }

  createClass(ReachFrequencyEstimatesDemoBreakdown, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        female: 'female',
        male: 'male'
      });
    }
  }]);
  return ReachFrequencyEstimatesDemoBreakdown;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ReachFrequencyEstimatesPlacementBreakdown
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ReachFrequencyEstimatesPlacementBreakdown = function (_AbstractCrudObject) {
  inherits(ReachFrequencyEstimatesPlacementBreakdown, _AbstractCrudObject);

  function ReachFrequencyEstimatesPlacementBreakdown() {
    classCallCheck(this, ReachFrequencyEstimatesPlacementBreakdown);
    return possibleConstructorReturn(this, (ReachFrequencyEstimatesPlacementBreakdown.__proto__ || Object.getPrototypeOf(ReachFrequencyEstimatesPlacementBreakdown)).apply(this, arguments));
  }

  createClass(ReachFrequencyEstimatesPlacementBreakdown, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        android: 'android',
        audience_network: 'audience_network',
        desktop: 'desktop',
        ig_android: 'ig_android',
        ig_ios: 'ig_ios',
        ig_other: 'ig_other',
        ig_story: 'ig_story',
        instant_articles: 'instant_articles',
        instream_videos: 'instream_videos',
        ios: 'ios',
        msite: 'msite',
        suggested_videos: 'suggested_videos'
      });
    }
  }]);
  return ReachFrequencyEstimatesPlacementBreakdown;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ReachFrequencySpec
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ReachFrequencySpec = function (_AbstractCrudObject) {
  inherits(ReachFrequencySpec, _AbstractCrudObject);

  function ReachFrequencySpec() {
    classCallCheck(this, ReachFrequencySpec);
    return possibleConstructorReturn(this, (ReachFrequencySpec.__proto__ || Object.getPrototypeOf(ReachFrequencySpec)).apply(this, arguments));
  }

  createClass(ReachFrequencySpec, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        countries: 'countries',
        default_creation_data: 'default_creation_data',
        global_io_max_campaign_duration: 'global_io_max_campaign_duration',
        max_campaign_duration: 'max_campaign_duration',
        max_days_to_finish: 'max_days_to_finish',
        max_pause_without_prediction_rerun: 'max_pause_without_prediction_rerun',
        min_campaign_duration: 'min_campaign_duration',
        min_reach_limits: 'min_reach_limits',
        supports_video_view_benchmark_per_country: 'supports_video_view_benchmark_per_country'
      });
    }
  }]);
  return ReachFrequencySpec;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ReadOnlyAnalyticsUserPropertyConfig
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ReadOnlyAnalyticsUserPropertyConfig = function (_AbstractCrudObject) {
  inherits(ReadOnlyAnalyticsUserPropertyConfig, _AbstractCrudObject);

  function ReadOnlyAnalyticsUserPropertyConfig() {
    classCallCheck(this, ReadOnlyAnalyticsUserPropertyConfig);
    return possibleConstructorReturn(this, (ReadOnlyAnalyticsUserPropertyConfig.__proto__ || Object.getPrototypeOf(ReadOnlyAnalyticsUserPropertyConfig)).apply(this, arguments));
  }

  createClass(ReadOnlyAnalyticsUserPropertyConfig, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        active_properties: 'active_properties',
        id: 'id'
      });
    }
  }]);
  return ReadOnlyAnalyticsUserPropertyConfig;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Referral
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Referral = function (_AbstractCrudObject) {
  inherits(Referral, _AbstractCrudObject);

  function Referral() {
    classCallCheck(this, Referral);
    return possibleConstructorReturn(this, (Referral.__proto__ || Object.getPrototypeOf(Referral)).apply(this, arguments));
  }

  createClass(Referral, [{
    key: 'delete',
    value: function _delete(fields, params) {
      return get$1(Referral.prototype.__proto__ || Object.getPrototypeOf(Referral.prototype), 'delete', this).call(this, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(Referral.prototype.__proto__ || Object.getPrototypeOf(Referral.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        id: 'id',
        invite_limit: 'invite_limit',
        messenger_cta: 'messenger_cta',
        messenger_promotion_text: 'messenger_promotion_text',
        namespace: 'namespace',
        need_promo_code: 'need_promo_code',
        offer_origin: 'offer_origin',
        promotion_text: 'promotion_text',
        receiver_benefits_text: 'receiver_benefits_text',
        referral_link_uri: 'referral_link_uri',
        sender_benefits_text: 'sender_benefits_text'
      });
    }
  }]);
  return Referral;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * RevSharePolicy
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var RevSharePolicy = function (_AbstractCrudObject) {
  inherits(RevSharePolicy, _AbstractCrudObject);

  function RevSharePolicy() {
    classCallCheck(this, RevSharePolicy);
    return possibleConstructorReturn(this, (RevSharePolicy.__proto__ || Object.getPrototypeOf(RevSharePolicy)).apply(this, arguments));
  }

  createClass(RevSharePolicy, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        policy_id: 'policy_id',
        policy_name: 'policy_name'
      });
    }
  }]);
  return RevSharePolicy;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * RichMediaElement
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var RichMediaElement = function (_AbstractCrudObject) {
  inherits(RichMediaElement, _AbstractCrudObject);

  function RichMediaElement() {
    classCallCheck(this, RichMediaElement);
    return possibleConstructorReturn(this, (RichMediaElement.__proto__ || Object.getPrototypeOf(RichMediaElement)).apply(this, arguments));
  }

  createClass(RichMediaElement, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        element: 'element',
        element_type: 'element_type',
        name: 'name'
      });
    }
  }]);
  return RichMediaElement;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * SavedMessageResponse
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var SavedMessageResponse = function (_AbstractCrudObject) {
  inherits(SavedMessageResponse, _AbstractCrudObject);

  function SavedMessageResponse() {
    classCallCheck(this, SavedMessageResponse);
    return possibleConstructorReturn(this, (SavedMessageResponse.__proto__ || Object.getPrototypeOf(SavedMessageResponse)).apply(this, arguments));
  }

  createClass(SavedMessageResponse, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        category: 'category',
        id: 'id',
        image: 'image',
        is_enabled: 'is_enabled',
        message: 'message',
        title: 'title'
      });
    }
  }]);
  return SavedMessageResponse;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * SecuritySettings
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var SecuritySettings = function (_AbstractCrudObject) {
  inherits(SecuritySettings, _AbstractCrudObject);

  function SecuritySettings() {
    classCallCheck(this, SecuritySettings);
    return possibleConstructorReturn(this, (SecuritySettings.__proto__ || Object.getPrototypeOf(SecuritySettings)).apply(this, arguments));
  }

  createClass(SecuritySettings, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        secure_browsing: 'secure_browsing'
      });
    }
  }]);
  return SecuritySettings;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * SplitTestConfig
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var SplitTestConfig = function (_AbstractCrudObject) {
  inherits(SplitTestConfig, _AbstractCrudObject);

  function SplitTestConfig() {
    classCallCheck(this, SplitTestConfig);
    return possibleConstructorReturn(this, (SplitTestConfig.__proto__ || Object.getPrototypeOf(SplitTestConfig)).apply(this, arguments));
  }

  createClass(SplitTestConfig, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        budget: 'budget',
        early_winner_declaration_enabled: 'early_winner_declaration_enabled',
        end_time: 'end_time',
        splits: 'splits',
        start_time: 'start_time',
        test_variable: 'test_variable',
        id: 'id'
      });
    }
  }]);
  return SplitTestConfig;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * SplitTestWinner
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var SplitTestWinner = function (_AbstractCrudObject) {
  inherits(SplitTestWinner, _AbstractCrudObject);

  function SplitTestWinner() {
    classCallCheck(this, SplitTestWinner);
    return possibleConstructorReturn(this, (SplitTestWinner.__proto__ || Object.getPrototypeOf(SplitTestWinner)).apply(this, arguments));
  }

  createClass(SplitTestWinner, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        ad_object_level: 'ad_object_level',
        confidences: 'confidences',
        winner_ad_object_id: 'winner_ad_object_id'
      });
    }
  }]);
  return SplitTestWinner;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * StreamingReaction
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var StreamingReaction = function (_AbstractCrudObject) {
  inherits(StreamingReaction, _AbstractCrudObject);

  function StreamingReaction() {
    classCallCheck(this, StreamingReaction);
    return possibleConstructorReturn(this, (StreamingReaction.__proto__ || Object.getPrototypeOf(StreamingReaction)).apply(this, arguments));
  }

  createClass(StreamingReaction, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        count: 'count',
        reaction_type: 'reaction_type'
      });
    }
  }, {
    key: 'ReactionType',
    get: function get() {
      return Object.freeze({
        angry: 'ANGRY',
        haha: 'HAHA',
        like: 'LIKE',
        love: 'LOVE',
        none: 'NONE',
        pride: 'PRIDE',
        sad: 'SAD',
        thankful: 'THANKFUL',
        wow: 'WOW'
      });
    }
  }]);
  return StreamingReaction;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * Targeting
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var Targeting = function (_AbstractCrudObject) {
  inherits(Targeting, _AbstractCrudObject);

  function Targeting() {
    classCallCheck(this, Targeting);
    return possibleConstructorReturn(this, (Targeting.__proto__ || Object.getPrototypeOf(Targeting)).apply(this, arguments));
  }

  createClass(Targeting, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        adgroup_id: 'adgroup_id',
        age_max: 'age_max',
        age_min: 'age_min',
        alternate_auto_targeting_option: 'alternate_auto_targeting_option',
        app_install_state: 'app_install_state',
        audience_network_positions: 'audience_network_positions',
        behaviors: 'behaviors',
        brand_safety_content_filter_levels: 'brand_safety_content_filter_levels',
        catalog_based_targeting: 'catalog_based_targeting',
        cities: 'cities',
        college_years: 'college_years',
        connections: 'connections',
        contextual_targeting_categories: 'contextual_targeting_categories',
        countries: 'countries',
        country: 'country',
        country_groups: 'country_groups',
        custom_audiences: 'custom_audiences',
        device_platforms: 'device_platforms',
        direct_install_devices: 'direct_install_devices',
        dynamic_audience_ids: 'dynamic_audience_ids',
        education_majors: 'education_majors',
        education_schools: 'education_schools',
        education_statuses: 'education_statuses',
        effective_audience_network_positions: 'effective_audience_network_positions',
        effective_device_platforms: 'effective_device_platforms',
        effective_facebook_positions: 'effective_facebook_positions',
        effective_instagram_positions: 'effective_instagram_positions',
        effective_messenger_positions: 'effective_messenger_positions',
        effective_publisher_platforms: 'effective_publisher_platforms',
        engagement_specs: 'engagement_specs',
        ethnic_affinity: 'ethnic_affinity',
        exclude_reached_since: 'exclude_reached_since',
        excluded_connections: 'excluded_connections',
        excluded_custom_audiences: 'excluded_custom_audiences',
        excluded_dynamic_audience_ids: 'excluded_dynamic_audience_ids',
        excluded_engagement_specs: 'excluded_engagement_specs',
        excluded_geo_locations: 'excluded_geo_locations',
        excluded_mobile_device_model: 'excluded_mobile_device_model',
        excluded_product_audience_specs: 'excluded_product_audience_specs',
        excluded_publisher_categories: 'excluded_publisher_categories',
        excluded_publisher_list_ids: 'excluded_publisher_list_ids',
        excluded_user_device: 'excluded_user_device',
        exclusions: 'exclusions',
        facebook_positions: 'facebook_positions',
        family_statuses: 'family_statuses',
        fb_deal_id: 'fb_deal_id',
        flexible_spec: 'flexible_spec',
        friends_of_connections: 'friends_of_connections',
        genders: 'genders',
        generation: 'generation',
        geo_locations: 'geo_locations',
        home_ownership: 'home_ownership',
        home_type: 'home_type',
        home_value: 'home_value',
        household_composition: 'household_composition',
        income: 'income',
        industries: 'industries',
        instagram_positions: 'instagram_positions',
        instream_video_sponsorship_placements: 'instream_video_sponsorship_placements',
        interested_in: 'interested_in',
        interests: 'interests',
        is_whatsapp_destination_ad: 'is_whatsapp_destination_ad',
        keywords: 'keywords',
        life_events: 'life_events',
        locales: 'locales',
        messenger_positions: 'messenger_positions',
        moms: 'moms',
        net_worth: 'net_worth',
        office_type: 'office_type',
        place_page_set_ids: 'place_page_set_ids',
        political_views: 'political_views',
        politics: 'politics',
        product_audience_specs: 'product_audience_specs',
        prospecting_audience: 'prospecting_audience',
        publisher_platforms: 'publisher_platforms',
        publisher_visibility_categories: 'publisher_visibility_categories',
        radius: 'radius',
        regions: 'regions',
        relationship_statuses: 'relationship_statuses',
        site_category: 'site_category',
        targeting_optimization: 'targeting_optimization',
        user_adclusters: 'user_adclusters',
        user_device: 'user_device',
        user_event: 'user_event',
        user_os: 'user_os',
        wireless_carrier: 'wireless_carrier',
        work_employers: 'work_employers',
        work_positions: 'work_positions',
        zips: 'zips'
      });
    }
  }, {
    key: 'DevicePlatforms',
    get: function get() {
      return Object.freeze({
        connected_tv: 'connected_tv',
        desktop: 'desktop',
        mobile: 'mobile'
      });
    }
  }, {
    key: 'EffectiveDevicePlatforms',
    get: function get() {
      return Object.freeze({
        connected_tv: 'connected_tv',
        desktop: 'desktop',
        mobile: 'mobile'
      });
    }
  }]);
  return Targeting;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * TargetingDynamicRule
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var TargetingDynamicRule = function (_AbstractCrudObject) {
  inherits(TargetingDynamicRule, _AbstractCrudObject);

  function TargetingDynamicRule() {
    classCallCheck(this, TargetingDynamicRule);
    return possibleConstructorReturn(this, (TargetingDynamicRule.__proto__ || Object.getPrototypeOf(TargetingDynamicRule)).apply(this, arguments));
  }

  createClass(TargetingDynamicRule, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        action_type: 'action.type',
        ad_group_id: 'ad_group_id',
        campaign_group_id: 'campaign_group_id',
        campaign_id: 'campaign_id',
        impression_count: 'impression_count',
        page_id: 'page_id',
        post: 'post',
        retention_seconds: 'retention_seconds'
      });
    }
  }]);
  return TargetingDynamicRule;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * TargetingGeoLocation
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var TargetingGeoLocation = function (_AbstractCrudObject) {
  inherits(TargetingGeoLocation, _AbstractCrudObject);

  function TargetingGeoLocation() {
    classCallCheck(this, TargetingGeoLocation);
    return possibleConstructorReturn(this, (TargetingGeoLocation.__proto__ || Object.getPrototypeOf(TargetingGeoLocation)).apply(this, arguments));
  }

  createClass(TargetingGeoLocation, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        cities: 'cities',
        countries: 'countries',
        country_groups: 'country_groups',
        custom_locations: 'custom_locations',
        electoral_districts: 'electoral_districts',
        geo_markets: 'geo_markets',
        large_geo_areas: 'large_geo_areas',
        location_cluster_ids: 'location_cluster_ids',
        location_set_ids: 'location_set_ids',
        location_types: 'location_types',
        medium_geo_areas: 'medium_geo_areas',
        metro_areas: 'metro_areas',
        neighborhoods: 'neighborhoods',
        places: 'places',
        political_districts: 'political_districts',
        regions: 'regions',
        small_geo_areas: 'small_geo_areas',
        subcities: 'subcities',
        subneighborhoods: 'subneighborhoods',
        zips: 'zips'
      });
    }
  }]);
  return TargetingGeoLocation;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * TargetingGeoLocationCity
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var TargetingGeoLocationCity = function (_AbstractCrudObject) {
  inherits(TargetingGeoLocationCity, _AbstractCrudObject);

  function TargetingGeoLocationCity() {
    classCallCheck(this, TargetingGeoLocationCity);
    return possibleConstructorReturn(this, (TargetingGeoLocationCity.__proto__ || Object.getPrototypeOf(TargetingGeoLocationCity)).apply(this, arguments));
  }

  createClass(TargetingGeoLocationCity, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        country: 'country',
        distance_unit: 'distance_unit',
        key: 'key',
        name: 'name',
        radius: 'radius',
        region: 'region',
        region_id: 'region_id'
      });
    }
  }]);
  return TargetingGeoLocationCity;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * TargetingGeoLocationCustomLocation
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var TargetingGeoLocationCustomLocation = function (_AbstractCrudObject) {
  inherits(TargetingGeoLocationCustomLocation, _AbstractCrudObject);

  function TargetingGeoLocationCustomLocation() {
    classCallCheck(this, TargetingGeoLocationCustomLocation);
    return possibleConstructorReturn(this, (TargetingGeoLocationCustomLocation.__proto__ || Object.getPrototypeOf(TargetingGeoLocationCustomLocation)).apply(this, arguments));
  }

  createClass(TargetingGeoLocationCustomLocation, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        address_string: 'address_string',
        country: 'country',
        country_group: 'country_group',
        custom_type: 'custom_type',
        distance_unit: 'distance_unit',
        key: 'key',
        latitude: 'latitude',
        longitude: 'longitude',
        max_population: 'max_population',
        min_population: 'min_population',
        name: 'name',
        primary_city_id: 'primary_city_id',
        radius: 'radius',
        region_id: 'region_id'
      });
    }
  }]);
  return TargetingGeoLocationCustomLocation;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * TargetingGeoLocationElectoralDistrict
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var TargetingGeoLocationElectoralDistrict = function (_AbstractCrudObject) {
  inherits(TargetingGeoLocationElectoralDistrict, _AbstractCrudObject);

  function TargetingGeoLocationElectoralDistrict() {
    classCallCheck(this, TargetingGeoLocationElectoralDistrict);
    return possibleConstructorReturn(this, (TargetingGeoLocationElectoralDistrict.__proto__ || Object.getPrototypeOf(TargetingGeoLocationElectoralDistrict)).apply(this, arguments));
  }

  createClass(TargetingGeoLocationElectoralDistrict, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        country: 'country',
        electoral_district: 'electoral_district',
        key: 'key',
        name: 'name'
      });
    }
  }]);
  return TargetingGeoLocationElectoralDistrict;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * TargetingGeoLocationGeoEntities
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var TargetingGeoLocationGeoEntities = function (_AbstractCrudObject) {
  inherits(TargetingGeoLocationGeoEntities, _AbstractCrudObject);

  function TargetingGeoLocationGeoEntities() {
    classCallCheck(this, TargetingGeoLocationGeoEntities);
    return possibleConstructorReturn(this, (TargetingGeoLocationGeoEntities.__proto__ || Object.getPrototypeOf(TargetingGeoLocationGeoEntities)).apply(this, arguments));
  }

  createClass(TargetingGeoLocationGeoEntities, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        country: 'country',
        key: 'key',
        name: 'name',
        region: 'region',
        region_id: 'region_id'
      });
    }
  }]);
  return TargetingGeoLocationGeoEntities;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * TargetingGeoLocationLocationCluster
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var TargetingGeoLocationLocationCluster = function (_AbstractCrudObject) {
  inherits(TargetingGeoLocationLocationCluster, _AbstractCrudObject);

  function TargetingGeoLocationLocationCluster() {
    classCallCheck(this, TargetingGeoLocationLocationCluster);
    return possibleConstructorReturn(this, (TargetingGeoLocationLocationCluster.__proto__ || Object.getPrototypeOf(TargetingGeoLocationLocationCluster)).apply(this, arguments));
  }

  createClass(TargetingGeoLocationLocationCluster, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        key: 'key'
      });
    }
  }]);
  return TargetingGeoLocationLocationCluster;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * TargetingGeoLocationMarket
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var TargetingGeoLocationMarket = function (_AbstractCrudObject) {
  inherits(TargetingGeoLocationMarket, _AbstractCrudObject);

  function TargetingGeoLocationMarket() {
    classCallCheck(this, TargetingGeoLocationMarket);
    return possibleConstructorReturn(this, (TargetingGeoLocationMarket.__proto__ || Object.getPrototypeOf(TargetingGeoLocationMarket)).apply(this, arguments));
  }

  createClass(TargetingGeoLocationMarket, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        country: 'country',
        key: 'key',
        market_type: 'market_type',
        name: 'name'
      });
    }
  }]);
  return TargetingGeoLocationMarket;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * TargetingGeoLocationPlace
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var TargetingGeoLocationPlace = function (_AbstractCrudObject) {
  inherits(TargetingGeoLocationPlace, _AbstractCrudObject);

  function TargetingGeoLocationPlace() {
    classCallCheck(this, TargetingGeoLocationPlace);
    return possibleConstructorReturn(this, (TargetingGeoLocationPlace.__proto__ || Object.getPrototypeOf(TargetingGeoLocationPlace)).apply(this, arguments));
  }

  createClass(TargetingGeoLocationPlace, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        country: 'country',
        distance_unit: 'distance_unit',
        key: 'key',
        latitude: 'latitude',
        longitude: 'longitude',
        name: 'name',
        primary_city_id: 'primary_city_id',
        radius: 'radius',
        region_id: 'region_id'
      });
    }
  }]);
  return TargetingGeoLocationPlace;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * TargetingGeoLocationPoliticalDistrict
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var TargetingGeoLocationPoliticalDistrict = function (_AbstractCrudObject) {
  inherits(TargetingGeoLocationPoliticalDistrict, _AbstractCrudObject);

  function TargetingGeoLocationPoliticalDistrict() {
    classCallCheck(this, TargetingGeoLocationPoliticalDistrict);
    return possibleConstructorReturn(this, (TargetingGeoLocationPoliticalDistrict.__proto__ || Object.getPrototypeOf(TargetingGeoLocationPoliticalDistrict)).apply(this, arguments));
  }

  createClass(TargetingGeoLocationPoliticalDistrict, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        country: 'country',
        key: 'key',
        name: 'name',
        political_district: 'political_district'
      });
    }
  }]);
  return TargetingGeoLocationPoliticalDistrict;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * TargetingGeoLocationRegion
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var TargetingGeoLocationRegion = function (_AbstractCrudObject) {
  inherits(TargetingGeoLocationRegion, _AbstractCrudObject);

  function TargetingGeoLocationRegion() {
    classCallCheck(this, TargetingGeoLocationRegion);
    return possibleConstructorReturn(this, (TargetingGeoLocationRegion.__proto__ || Object.getPrototypeOf(TargetingGeoLocationRegion)).apply(this, arguments));
  }

  createClass(TargetingGeoLocationRegion, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        country: 'country',
        key: 'key',
        name: 'name'
      });
    }
  }]);
  return TargetingGeoLocationRegion;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * TargetingGeoLocationZip
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var TargetingGeoLocationZip = function (_AbstractCrudObject) {
  inherits(TargetingGeoLocationZip, _AbstractCrudObject);

  function TargetingGeoLocationZip() {
    classCallCheck(this, TargetingGeoLocationZip);
    return possibleConstructorReturn(this, (TargetingGeoLocationZip.__proto__ || Object.getPrototypeOf(TargetingGeoLocationZip)).apply(this, arguments));
  }

  createClass(TargetingGeoLocationZip, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        country: 'country',
        key: 'key',
        name: 'name',
        primary_city_id: 'primary_city_id',
        region_id: 'region_id'
      });
    }
  }]);
  return TargetingGeoLocationZip;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * TargetingProductAudienceSpec
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var TargetingProductAudienceSpec = function (_AbstractCrudObject) {
  inherits(TargetingProductAudienceSpec, _AbstractCrudObject);

  function TargetingProductAudienceSpec() {
    classCallCheck(this, TargetingProductAudienceSpec);
    return possibleConstructorReturn(this, (TargetingProductAudienceSpec.__proto__ || Object.getPrototypeOf(TargetingProductAudienceSpec)).apply(this, arguments));
  }

  createClass(TargetingProductAudienceSpec, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        exclusions: 'exclusions',
        inclusions: 'inclusions',
        product_set_id: 'product_set_id'
      });
    }
  }]);
  return TargetingProductAudienceSpec;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * TargetingProductAudienceSubSpec
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var TargetingProductAudienceSubSpec = function (_AbstractCrudObject) {
  inherits(TargetingProductAudienceSubSpec, _AbstractCrudObject);

  function TargetingProductAudienceSubSpec() {
    classCallCheck(this, TargetingProductAudienceSubSpec);
    return possibleConstructorReturn(this, (TargetingProductAudienceSubSpec.__proto__ || Object.getPrototypeOf(TargetingProductAudienceSubSpec)).apply(this, arguments));
  }

  createClass(TargetingProductAudienceSubSpec, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        retention_seconds: 'retention_seconds',
        rule: 'rule'
      });
    }
  }]);
  return TargetingProductAudienceSubSpec;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * TargetingProspectingAudience
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var TargetingProspectingAudience = function (_AbstractCrudObject) {
  inherits(TargetingProspectingAudience, _AbstractCrudObject);

  function TargetingProspectingAudience() {
    classCallCheck(this, TargetingProspectingAudience);
    return possibleConstructorReturn(this, (TargetingProspectingAudience.__proto__ || Object.getPrototypeOf(TargetingProspectingAudience)).apply(this, arguments));
  }

  createClass(TargetingProspectingAudience, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        sources: 'sources'
      });
    }
  }]);
  return TargetingProspectingAudience;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * TrackingAndConversionWithDefaults
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var TrackingAndConversionWithDefaults = function (_AbstractCrudObject) {
  inherits(TrackingAndConversionWithDefaults, _AbstractCrudObject);

  function TrackingAndConversionWithDefaults() {
    classCallCheck(this, TrackingAndConversionWithDefaults);
    return possibleConstructorReturn(this, (TrackingAndConversionWithDefaults.__proto__ || Object.getPrototypeOf(TrackingAndConversionWithDefaults)).apply(this, arguments));
  }

  createClass(TrackingAndConversionWithDefaults, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        custom_conversion: 'custom_conversion',
        custom_tracking: 'custom_tracking',
        default_conversion: 'default_conversion',
        default_tracking: 'default_tracking'
      });
    }
  }]);
  return TrackingAndConversionWithDefaults;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * UserCoverPhoto
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var UserCoverPhoto = function (_AbstractCrudObject) {
  inherits(UserCoverPhoto, _AbstractCrudObject);

  function UserCoverPhoto() {
    classCallCheck(this, UserCoverPhoto);
    return possibleConstructorReturn(this, (UserCoverPhoto.__proto__ || Object.getPrototypeOf(UserCoverPhoto)).apply(this, arguments));
  }

  createClass(UserCoverPhoto, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        offset_x: 'offset_x',
        offset_y: 'offset_y',
        source: 'source'
      });
    }
  }]);
  return UserCoverPhoto;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * UserDevice
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var UserDevice = function (_AbstractCrudObject) {
  inherits(UserDevice, _AbstractCrudObject);

  function UserDevice() {
    classCallCheck(this, UserDevice);
    return possibleConstructorReturn(this, (UserDevice.__proto__ || Object.getPrototypeOf(UserDevice)).apply(this, arguments));
  }

  createClass(UserDevice, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        hardware: 'hardware',
        os: 'os'
      });
    }
  }]);
  return UserDevice;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * UserInfluence
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var UserInfluence = function (_AbstractCrudObject) {
  inherits(UserInfluence, _AbstractCrudObject);

  function UserInfluence() {
    classCallCheck(this, UserInfluence);
    return possibleConstructorReturn(this, (UserInfluence.__proto__ || Object.getPrototypeOf(UserInfluence)).apply(this, arguments));
  }

  createClass(UserInfluence, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        trust: 'trust',
        trust_code: 'trust_code',
        version: 'version'
      });
    }
  }]);
  return UserInfluence;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * UserLeadGenDisclaimerResponse
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var UserLeadGenDisclaimerResponse = function (_AbstractCrudObject) {
  inherits(UserLeadGenDisclaimerResponse, _AbstractCrudObject);

  function UserLeadGenDisclaimerResponse() {
    classCallCheck(this, UserLeadGenDisclaimerResponse);
    return possibleConstructorReturn(this, (UserLeadGenDisclaimerResponse.__proto__ || Object.getPrototypeOf(UserLeadGenDisclaimerResponse)).apply(this, arguments));
  }

  createClass(UserLeadGenDisclaimerResponse, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        checkbox_key: 'checkbox_key',
        is_checked: 'is_checked'
      });
    }
  }]);
  return UserLeadGenDisclaimerResponse;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * UserLeadGenFieldData
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var UserLeadGenFieldData = function (_AbstractCrudObject) {
  inherits(UserLeadGenFieldData, _AbstractCrudObject);

  function UserLeadGenFieldData() {
    classCallCheck(this, UserLeadGenFieldData);
    return possibleConstructorReturn(this, (UserLeadGenFieldData.__proto__ || Object.getPrototypeOf(UserLeadGenFieldData)).apply(this, arguments));
  }

  createClass(UserLeadGenFieldData, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        name: 'name',
        values: 'values'
      });
    }
  }]);
  return UserLeadGenFieldData;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * UserPaymentMethodsInfo
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var UserPaymentMethodsInfo = function (_AbstractCrudObject) {
  inherits(UserPaymentMethodsInfo, _AbstractCrudObject);

  function UserPaymentMethodsInfo() {
    classCallCheck(this, UserPaymentMethodsInfo);
    return possibleConstructorReturn(this, (UserPaymentMethodsInfo.__proto__ || Object.getPrototypeOf(UserPaymentMethodsInfo)).apply(this, arguments));
  }

  createClass(UserPaymentMethodsInfo, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        available_card_types: 'available_card_types',
        available_payment_methods: 'available_payment_methods',
        available_payment_methods_details: 'available_payment_methods_details',
        country: 'country',
        currency: 'currency',
        existing_payment_methods: 'existing_payment_methods'
      });
    }
  }]);
  return UserPaymentMethodsInfo;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * UserPaymentMobilePricepoints
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var UserPaymentMobilePricepoints = function (_AbstractCrudObject) {
  inherits(UserPaymentMobilePricepoints, _AbstractCrudObject);

  function UserPaymentMobilePricepoints() {
    classCallCheck(this, UserPaymentMobilePricepoints);
    return possibleConstructorReturn(this, (UserPaymentMobilePricepoints.__proto__ || Object.getPrototypeOf(UserPaymentMobilePricepoints)).apply(this, arguments));
  }

  createClass(UserPaymentMobilePricepoints, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        mobile_country: 'mobile_country',
        phone_number_last4: 'phone_number_last4',
        pricepoints: 'pricepoints',
        user_currency: 'user_currency'
      });
    }
  }]);
  return UserPaymentMobilePricepoints;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * UserPaymentModulesOptions
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var UserPaymentModulesOptions = function (_AbstractCrudObject) {
  inherits(UserPaymentModulesOptions, _AbstractCrudObject);

  function UserPaymentModulesOptions() {
    classCallCheck(this, UserPaymentModulesOptions);
    return possibleConstructorReturn(this, (UserPaymentModulesOptions.__proto__ || Object.getPrototypeOf(UserPaymentModulesOptions)).apply(this, arguments));
  }

  createClass(UserPaymentModulesOptions, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        available_payment_options: 'available_payment_options',
        country: 'country',
        currency: 'currency'
      });
    }
  }]);
  return UserPaymentModulesOptions;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * ValueBasedEligibleSource
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var ValueBasedEligibleSource = function (_AbstractCrudObject) {
  inherits(ValueBasedEligibleSource, _AbstractCrudObject);

  function ValueBasedEligibleSource() {
    classCallCheck(this, ValueBasedEligibleSource);
    return possibleConstructorReturn(this, (ValueBasedEligibleSource.__proto__ || Object.getPrototypeOf(ValueBasedEligibleSource)).apply(this, arguments));
  }

  createClass(ValueBasedEligibleSource, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        id: 'id',
        title: 'title',
        type: 'type'
      });
    }
  }]);
  return ValueBasedEligibleSource;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * VaultDeletedImage
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var VaultDeletedImage = function (_AbstractCrudObject) {
  inherits(VaultDeletedImage, _AbstractCrudObject);

  function VaultDeletedImage() {
    classCallCheck(this, VaultDeletedImage);
    return possibleConstructorReturn(this, (VaultDeletedImage.__proto__ || Object.getPrototypeOf(VaultDeletedImage)).apply(this, arguments));
  }

  createClass(VaultDeletedImage, [{
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        client_image_hash: 'client_image_hash',
        date_taken: 'date_taken',
        id: 'id',
        owner: 'owner',
        remote_id: 'remote_id'
      });
    }
  }]);
  return VaultDeletedImage;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * VideoCopyrightConditionGroup
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var VideoCopyrightConditionGroup = function (_AbstractCrudObject) {
  inherits(VideoCopyrightConditionGroup, _AbstractCrudObject);

  function VideoCopyrightConditionGroup() {
    classCallCheck(this, VideoCopyrightConditionGroup);
    return possibleConstructorReturn(this, (VideoCopyrightConditionGroup.__proto__ || Object.getPrototypeOf(VideoCopyrightConditionGroup)).apply(this, arguments));
  }

  createClass(VideoCopyrightConditionGroup, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        action: 'action',
        conditions: 'conditions',
        validity_status: 'validity_status'
      });
    }
  }]);
  return VideoCopyrightConditionGroup;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * VideoCopyrightGeoGate
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var VideoCopyrightGeoGate = function (_AbstractCrudObject) {
  inherits(VideoCopyrightGeoGate, _AbstractCrudObject);

  function VideoCopyrightGeoGate() {
    classCallCheck(this, VideoCopyrightGeoGate);
    return possibleConstructorReturn(this, (VideoCopyrightGeoGate.__proto__ || Object.getPrototypeOf(VideoCopyrightGeoGate)).apply(this, arguments));
  }

  createClass(VideoCopyrightGeoGate, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        excluded_countries: 'excluded_countries',
        included_countries: 'included_countries'
      });
    }
  }]);
  return VideoCopyrightGeoGate;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * VideoCopyrightSegment
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var VideoCopyrightSegment = function (_AbstractCrudObject) {
  inherits(VideoCopyrightSegment, _AbstractCrudObject);

  function VideoCopyrightSegment() {
    classCallCheck(this, VideoCopyrightSegment);
    return possibleConstructorReturn(this, (VideoCopyrightSegment.__proto__ || Object.getPrototypeOf(VideoCopyrightSegment)).apply(this, arguments));
  }

  createClass(VideoCopyrightSegment, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        duration_in_sec: 'duration_in_sec',
        media_type: 'media_type',
        start_time_in_sec: 'start_time_in_sec'
      });
    }
  }]);
  return VideoCopyrightSegment;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * VideoGameShow
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var VideoGameShow = function (_AbstractCrudObject) {
  inherits(VideoGameShow, _AbstractCrudObject);

  function VideoGameShow() {
    classCallCheck(this, VideoGameShow);
    return possibleConstructorReturn(this, (VideoGameShow.__proto__ || Object.getPrototypeOf(VideoGameShow)).apply(this, arguments));
  }

  createClass(VideoGameShow, [{
    key: 'getQuestions',
    value: function getQuestions(fields, params) {
      var fetchFirstPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.getEdge(AbstractObject, fields, params, fetchFirstPage, '/questions');
    }
  }, {
    key: 'createQuestion',
    value: function createQuestion(fields, params) {
      return this.createEdge('/questions', fields, params);
    }
  }, {
    key: 'get',
    value: function get(fields, params) {
      return this.read(fields, params);
    }
  }, {
    key: 'update',
    value: function update(fields, params) {
      return get$1(VideoGameShow.prototype.__proto__ || Object.getPrototypeOf(VideoGameShow.prototype), 'update', this).call(this, params);
    }
  }], [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        end_time: 'end_time',
        game_status: 'game_status',
        game_type: 'game_type',
        id: 'id',
        start_time: 'start_time'
      });
    }
  }, {
    key: 'Action',
    get: function get() {
      return Object.freeze({
        end_game: 'END_GAME',
        start_game: 'START_GAME'
      });
    }
  }]);
  return VideoGameShow;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * VideoUploadLimits
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var VideoUploadLimits = function (_AbstractCrudObject) {
  inherits(VideoUploadLimits, _AbstractCrudObject);

  function VideoUploadLimits() {
    classCallCheck(this, VideoUploadLimits);
    return possibleConstructorReturn(this, (VideoUploadLimits.__proto__ || Object.getPrototypeOf(VideoUploadLimits)).apply(this, arguments));
  }

  createClass(VideoUploadLimits, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        length: 'length',
        size: 'size'
      });
    }
  }]);
  return VideoUploadLimits;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * VoipInfo
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var VoipInfo = function (_AbstractCrudObject) {
  inherits(VoipInfo, _AbstractCrudObject);

  function VoipInfo() {
    classCallCheck(this, VoipInfo);
    return possibleConstructorReturn(this, (VoipInfo.__proto__ || Object.getPrototypeOf(VoipInfo)).apply(this, arguments));
  }

  createClass(VoipInfo, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        has_mobile_app: 'has_mobile_app',
        has_permission: 'has_permission',
        is_callable: 'is_callable',
        is_callable_webrtc: 'is_callable_webrtc',
        is_pushable: 'is_pushable',
        reason_code: 'reason_code',
        reason_description: 'reason_description'
      });
    }
  }]);
  return VoipInfo;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * WebAppLink
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var WebAppLink = function (_AbstractCrudObject) {
  inherits(WebAppLink, _AbstractCrudObject);

  function WebAppLink() {
    classCallCheck(this, WebAppLink);
    return possibleConstructorReturn(this, (WebAppLink.__proto__ || Object.getPrototypeOf(WebAppLink)).apply(this, arguments));
  }

  createClass(WebAppLink, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        should_fallback: 'should_fallback',
        url: 'url'
      });
    }
  }]);
  return WebAppLink;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * WindowsAppLink
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var WindowsAppLink = function (_AbstractCrudObject) {
  inherits(WindowsAppLink, _AbstractCrudObject);

  function WindowsAppLink() {
    classCallCheck(this, WindowsAppLink);
    return possibleConstructorReturn(this, (WindowsAppLink.__proto__ || Object.getPrototypeOf(WindowsAppLink)).apply(this, arguments));
  }

  createClass(WindowsAppLink, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        app_id: 'app_id',
        app_name: 'app_name',
        package_family_name: 'package_family_name',
        url: 'url'
      });
    }
  }]);
  return WindowsAppLink;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */
/**
 * WindowsPhoneAppLink
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */

var WindowsPhoneAppLink = function (_AbstractCrudObject) {
  inherits(WindowsPhoneAppLink, _AbstractCrudObject);

  function WindowsPhoneAppLink() {
    classCallCheck(this, WindowsPhoneAppLink);
    return possibleConstructorReturn(this, (WindowsPhoneAppLink.__proto__ || Object.getPrototypeOf(WindowsPhoneAppLink)).apply(this, arguments));
  }

  createClass(WindowsPhoneAppLink, null, [{
    key: 'Fields',
    get: function get() {
      return Object.freeze({
        app_id: 'app_id',
        app_name: 'app_name',
        url: 'url'
      });
    }
  }]);
  return WindowsPhoneAppLink;
}(AbstractCrudObject);

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

exports.FacebookAdsApi = FacebookAdsApi;
exports.FacebookAdsApiBatch = FacebookAdsApiBatch;
exports.APIRequest = APIRequest;
exports.APIResponse = APIResponse;
exports.Ad = Ad;
exports.AdAccount = AdAccount;
exports.AdAccountActivity = AdAccountActivity;
exports.AdAccountAdRulesHistory = AdAccountAdRulesHistory;
exports.AdAccountCreationRequest = AdAccountCreationRequest;
exports.AdAccountDefaultDestination = AdAccountDefaultDestination;
exports.AdAccountDefaultObjective = AdAccountDefaultObjective;
exports.AdAccountDeliveryEstimate = AdAccountDeliveryEstimate;
exports.AdAccountMatchedSearchApplicationsEdgeData = AdAccountMatchedSearchApplicationsEdgeData;
exports.AdAccountMaxBid = AdAccountMaxBid;
exports.AdAccountPromotableObjects = AdAccountPromotableObjects;
exports.AdAccountRecommendedCamapaignBudget = AdAccountRecommendedCamapaignBudget;
exports.AdAccountRoas = AdAccountRoas;
exports.AdAccountTargetingUnified = AdAccountTargetingUnified;
exports.AdAccountTrackingData = AdAccountTrackingData;
exports.AdAccountUser = AdAccountUser;
exports.AdActivity = AdActivity;
exports.AdAssetFeedSpec = AdAssetFeedSpec;
exports.AdAssetFeedSpecAssetLabel = AdAssetFeedSpecAssetLabel;
exports.AdAssetFeedSpecBody = AdAssetFeedSpecBody;
exports.AdAssetFeedSpecCaption = AdAssetFeedSpecCaption;
exports.AdAssetFeedSpecDescription = AdAssetFeedSpecDescription;
exports.AdAssetFeedSpecGroupRule = AdAssetFeedSpecGroupRule;
exports.AdAssetFeedSpecImage = AdAssetFeedSpecImage;
exports.AdAssetFeedSpecLinkURL = AdAssetFeedSpecLinkURL;
exports.AdAssetFeedSpecTitle = AdAssetFeedSpecTitle;
exports.AdAssetFeedSpecVideo = AdAssetFeedSpecVideo;
exports.AdAsyncRequest = AdAsyncRequest;
exports.AdAsyncRequestSet = AdAsyncRequestSet;
exports.AdAsyncRequestSetNotificationResult = AdAsyncRequestSetNotificationResult;
exports.AdBidAdjustments = AdBidAdjustments;
exports.AdCampaignActivity = AdCampaignActivity;
exports.AdCampaignBidConstraint = AdCampaignBidConstraint;
exports.AdCampaignDeliveryEstimate = AdCampaignDeliveryEstimate;
exports.AdCampaignDeliveryStatsUnsupportedReasons = AdCampaignDeliveryStatsUnsupportedReasons;
exports.AdCampaignFrequencyControlSpecs = AdCampaignFrequencyControlSpecs;
exports.AdCampaignGroupActivity = AdCampaignGroupActivity;
exports.AdCampaignIssuesInfo = AdCampaignIssuesInfo;
exports.AdCampaignLearningStageInfo = AdCampaignLearningStageInfo;
exports.AdCampaignOptimizationEvent = AdCampaignOptimizationEvent;
exports.AdCampaignPacedBidInfo = AdCampaignPacedBidInfo;
exports.AdContract = AdContract;
exports.AdCreative = AdCreative;
exports.AdCreativeCollectionThumbnailInfo = AdCreativeCollectionThumbnailInfo;
exports.AdCreativeDegreesOfFreedomSpec = AdCreativeDegreesOfFreedomSpec;
exports.AdCreativeInteractiveComponentsSpec = AdCreativeInteractiveComponentsSpec;
exports.AdCreativeLinkData = AdCreativeLinkData;
exports.AdCreativeLinkDataAppLinkSpec = AdCreativeLinkDataAppLinkSpec;
exports.AdCreativeLinkDataCallToAction = AdCreativeLinkDataCallToAction;
exports.AdCreativeLinkDataCallToActionValue = AdCreativeLinkDataCallToActionValue;
exports.AdCreativeLinkDataChildAttachment = AdCreativeLinkDataChildAttachment;
exports.AdCreativeLinkDataImageLayerSpec = AdCreativeLinkDataImageLayerSpec;
exports.AdCreativeLinkDataImageOverlaySpec = AdCreativeLinkDataImageOverlaySpec;
exports.AdCreativeLinkDataSponsorshipInfoSpec = AdCreativeLinkDataSponsorshipInfoSpec;
exports.AdCreativeLinkDataTemplateVideoSpec = AdCreativeLinkDataTemplateVideoSpec;
exports.AdCreativeObjectStorySpec = AdCreativeObjectStorySpec;
exports.AdCreativeOptimizationSpec = AdCreativeOptimizationSpec;
exports.AdCreativePhotoData = AdCreativePhotoData;
exports.AdCreativePlaceData = AdCreativePlaceData;
exports.AdCreativePlatformCustomization = AdCreativePlatformCustomization;
exports.AdCreativePortraitCustomizations = AdCreativePortraitCustomizations;
exports.AdCreativePostClickConfiguration = AdCreativePostClickConfiguration;
exports.AdCreativeRecommenderSettings = AdCreativeRecommenderSettings;
exports.AdCreativeStaticFallbackSpec = AdCreativeStaticFallbackSpec;
exports.AdCreativeTemplateURLSpec = AdCreativeTemplateURLSpec;
exports.AdCreativeTextData = AdCreativeTextData;
exports.AdCreativeVideoData = AdCreativeVideoData;
exports.AdCustomizationRuleSpec = AdCustomizationRuleSpec;
exports.AdDynamicCreative = AdDynamicCreative;
exports.AdEntityTargetSpend = AdEntityTargetSpend;
exports.AdImage = AdImage;
exports.AdKeywordStats = AdKeywordStats;
exports.AdKeywords = AdKeywords;
exports.AdLabel = AdLabel;
exports.AdMonetizationProperty = AdMonetizationProperty;
exports.AdNetworkAnalyticsAsyncQueryResult = AdNetworkAnalyticsAsyncQueryResult;
exports.AdNetworkAnalyticsSyncQueryResult = AdNetworkAnalyticsSyncQueryResult;
exports.AdPlacePageSet = AdPlacePageSet;
exports.AdPlacePageSetMetadata = AdPlacePageSetMetadata;
exports.AdPlacement = AdPlacement;
exports.AdPreview = AdPreview;
exports.AdPromotedObject = AdPromotedObject;
exports.AdRecommendation = AdRecommendation;
exports.AdRecommendationData = AdRecommendationData;
exports.AdReportRun = AdReportRun;
exports.AdReportSpec = AdReportSpec;
exports.AdRule = AdRule;
exports.AdRuleEvaluationSpec = AdRuleEvaluationSpec;
exports.AdRuleExecutionOptions = AdRuleExecutionOptions;
exports.AdRuleExecutionSpec = AdRuleExecutionSpec;
exports.AdRuleFilters = AdRuleFilters;
exports.AdRuleHistory = AdRuleHistory;
exports.AdRuleHistoryResult = AdRuleHistoryResult;
exports.AdRuleHistoryResultAction = AdRuleHistoryResultAction;
exports.AdRuleSchedule = AdRuleSchedule;
exports.AdRuleScheduleSpec = AdRuleScheduleSpec;
exports.AdRuleTrigger = AdRuleTrigger;
exports.AdSet = AdSet;
exports.AdStudy = AdStudy;
exports.AdStudyCell = AdStudyCell;
exports.AdStudyObjective = AdStudyObjective;
exports.AdStudyObjectiveID = AdStudyObjectiveID;
exports.AdTopline = AdTopline;
exports.AdToplineDetail = AdToplineDetail;
exports.AdVideo = AdVideo;
exports.AdgroupActivity = AdgroupActivity;
exports.AdgroupIssuesInfo = AdgroupIssuesInfo;
exports.AdgroupPlacementSpecificReviewFeedback = AdgroupPlacementSpecificReviewFeedback;
exports.AdgroupRelevanceScore = AdgroupRelevanceScore;
exports.AdgroupReviewFeedback = AdgroupReviewFeedback;
exports.AdsActionStats = AdsActionStats;
exports.AdsImageCrops = AdsImageCrops;
exports.AdsInsights = AdsInsights;
exports.AdsOptimalDeliveryGrowthOpportunity = AdsOptimalDeliveryGrowthOpportunity;
exports.AdsPixel = AdsPixel;
exports.AdsPixelStats = AdsPixelStats;
exports.AdsPixelStatsResult = AdsPixelStatsResult;
exports.AdsTALHealthCheckError = AdsTALHealthCheckError;
exports.AgeRange = AgeRange;
exports.AgencyClientDeclaration = AgencyClientDeclaration;
exports.Album = Album;
exports.AndroidAppLink = AndroidAppLink;
exports.AppLinks = AppLinks;
exports.AppRequest = AppRequest;
exports.AppRequestFormerRecipient = AppRequestFormerRecipient;
exports.Application = Application;
exports.AssignedUser = AssignedUser;
exports.AsyncRequest = AsyncRequest;
exports.AsyncSession = AsyncSession;
exports.AtlasURL = AtlasURL;
exports.AttributionSpec = AttributionSpec;
exports.AudienceInsightsStudySpec = AudienceInsightsStudySpec;
exports.AudiencePermission = AudiencePermission;
exports.AudiencePermissionForActions = AudiencePermissionForActions;
exports.AudioCopyright = AudioCopyright;
exports.AutomotiveModel = AutomotiveModel;
exports.BilledAmountDetails = BilledAmountDetails;
exports.BrandSafetyBlockListUsage = BrandSafetyBlockListUsage;
exports.BroadTargetingCategories = BroadTargetingCategories;
exports.Business = Business;
exports.BusinessAdAccountRequest = BusinessAdAccountRequest;
exports.BusinessAdvertisableApplicationsResult = BusinessAdvertisableApplicationsResult;
exports.BusinessAgreement = BusinessAgreement;
exports.BusinessApplicationRequest = BusinessApplicationRequest;
exports.BusinessOwnedObjectOnBehalfOfRequest = BusinessOwnedObjectOnBehalfOfRequest;
exports.BusinessPageRequest = BusinessPageRequest;
exports.BusinessProject = BusinessProject;
exports.BusinessRoleRequest = BusinessRoleRequest;
exports.BusinessUnit = BusinessUnit;
exports.BusinessUser = BusinessUser;
exports.CPASParentCatalogSettings = CPASParentCatalogSettings;
exports.Campaign = Campaign;
exports.CampaignGroupBrandConfiguration = CampaignGroupBrandConfiguration;
exports.Canvas = Canvas;
exports.CanvasAdSettings = CanvasAdSettings;
exports.CanvasCollectionThumbnail = CanvasCollectionThumbnail;
exports.CatalogBasedTargeting = CatalogBasedTargeting;
exports.CheckBatchRequestStatus = CheckBatchRequestStatus;
exports.ChildEvent = ChildEvent;
exports.ClientTransparencyStatus = ClientTransparencyStatus;
exports.Comment = Comment;
exports.CommerceSettings = CommerceSettings;
exports.ConversionActionQuery = ConversionActionQuery;
exports.CopyrightAttributionInsights = CopyrightAttributionInsights;
exports.CopyrightReferenceContainer = CopyrightReferenceContainer;
exports.CoverPhoto = CoverPhoto;
exports.CreativeHistory = CreativeHistory;
exports.CreditPartitionActionOptions = CreditPartitionActionOptions;
exports.Currency = Currency;
exports.CurrencyAmount = CurrencyAmount;
exports.CustomAudience = CustomAudience;
exports.CustomAudienceAdAccount = CustomAudienceAdAccount;
exports.CustomAudienceDataSource = CustomAudienceDataSource;
exports.CustomAudiencePrefillState = CustomAudiencePrefillState;
exports.CustomAudienceSession = CustomAudienceSession;
exports.CustomAudienceSharingStatus = CustomAudienceSharingStatus;
exports.CustomAudienceStatus = CustomAudienceStatus;
exports.CustomAudiencesTOS = CustomAudiencesTOS;
exports.CustomAudiencesharedAccountInfo = CustomAudiencesharedAccountInfo;
exports.CustomConversion = CustomConversion;
exports.CustomConversionStatsResult = CustomConversionStatsResult;
exports.DACheck = DACheck;
exports.DayPart = DayPart;
exports.DeliveryCheck = DeliveryCheck;
exports.DeliveryCheckExtraInfo = DeliveryCheckExtraInfo;
exports.Destination = Destination;
exports.DestinationCatalogSettings = DestinationCatalogSettings;
exports.DirectDeal = DirectDeal;
exports.Domain = Domain;
exports.DynamicContentSet = DynamicContentSet;
exports.DynamicItemDisplayBundle = DynamicItemDisplayBundle;
exports.DynamicItemDisplayBundleFolder = DynamicItemDisplayBundleFolder;
exports.DynamicPostChildAttachment = DynamicPostChildAttachment;
exports.DynamicPriceConfigByDate = DynamicPriceConfigByDate;
exports.Engagement = Engagement;
exports.EntityAtTextRange = EntityAtTextRange;
exports.Event = Event;
exports.EventSourceGroup = EventSourceGroup;
exports.EventTour = EventTour;
exports.Experience = Experience;
exports.ExtendedCredit = ExtendedCredit;
exports.ExtendedCreditAllocationConfig = ExtendedCreditAllocationConfig;
exports.ExtendedCreditInvoiceGroup = ExtendedCreditInvoiceGroup;
exports.ExternalEventSource = ExternalEventSource;
exports.FAMEExportConfig = FAMEExportConfig;
exports.FlexibleTargeting = FlexibleTargeting;
exports.Flight = Flight;
exports.FoodDrinkOrder = FoodDrinkOrder;
exports.FriendList = FriendList;
exports.FundingSourceDetails = FundingSourceDetails;
exports.FundingSourceDetailsCoupon = FundingSourceDetailsCoupon;
exports.Group = Group;
exports.HomeListing = HomeListing;
exports.Hotel = Hotel;
exports.HotelRoom = HotelRoom;
exports.IDName = IDName;
exports.IGComment = IGComment;
exports.IGMedia = IGMedia;
exports.IGUser = IGUser;
exports.InsightsResult = InsightsResult;
exports.InstagramComment = InstagramComment;
exports.InstagramInsightsResult = InstagramInsightsResult;
exports.InstagramInsightsValue = InstagramInsightsValue;
exports.InstagramUser = InstagramUser;
exports.InstantArticle = InstantArticle;
exports.InstantArticleInsightsQueryResult = InstantArticleInsightsQueryResult;
exports.IosAppLink = IosAppLink;
exports.IterativeSplitTestConfig = IterativeSplitTestConfig;
exports.KeyValue = KeyValue;
exports.Lead = Lead;
exports.LeadGenAppointmentBookingInfo = LeadGenAppointmentBookingInfo;
exports.LeadGenConditionalQuestionsGroupChoices = LeadGenConditionalQuestionsGroupChoices;
exports.LeadGenConditionalQuestionsGroupQuestions = LeadGenConditionalQuestionsGroupQuestions;
exports.LeadGenDraftQuestion = LeadGenDraftQuestion;
exports.LeadGenFormPreviewDetails = LeadGenFormPreviewDetails;
exports.LeadGenQuestion = LeadGenQuestion;
exports.LeadGenQuestionOption = LeadGenQuestionOption;
exports.LeadgenForm = LeadgenForm;
exports.LifeEvent = LifeEvent;
exports.Link = Link;
exports.LiveEncoder = LiveEncoder;
exports.LiveVideo = LiveVideo;
exports.LiveVideoAdBreakConfig = LiveVideoAdBreakConfig;
exports.LiveVideoError = LiveVideoError;
exports.LiveVideoInputStream = LiveVideoInputStream;
exports.LiveVideoTargeting = LiveVideoTargeting;
exports.Location = Location;
exports.LookalikeSpec = LookalikeSpec;
exports.MailingAddress = MailingAddress;
exports.MeasurementReport = MeasurementReport;
exports.MeasurementUploadEvent = MeasurementUploadEvent;
exports.MediaFingerprint = MediaFingerprint;
exports.MessagingFeatureReview = MessagingFeatureReview;
exports.MessengerDestinationPageWelcomeMessage = MessengerDestinationPageWelcomeMessage;
exports.MessengerPlatformReferral = MessengerPlatformReferral;
exports.MessengerProfile = MessengerProfile;
exports.MinimumBudget = MinimumBudget;
exports.MusicVideoCopyright = MusicVideoCopyright;
exports.NativeOffer = NativeOffer;
exports.NativeOfferDiscount = NativeOfferDiscount;
exports.NativeOfferView = NativeOfferView;
exports.NullNode = NullNode;
exports.OfflineConversionDataSet = OfflineConversionDataSet;
exports.OfflineTermsOfService = OfflineTermsOfService;
exports.OffsitePixel = OffsitePixel;
exports.OpenGraphContext = OpenGraphContext;
exports.OpenGraphObject = OpenGraphObject;
exports.OracleTransaction = OracleTransaction;
exports.OutcomePredictionPoint = OutcomePredictionPoint;
exports.Page = Page;
exports.PageAboutStory = PageAboutStory;
exports.PageAdminNote = PageAdminNote;
exports.PageBroadcast = PageBroadcast;
exports.PageCallToAction = PageCallToAction;
exports.PageCategory = PageCategory;
exports.PageChangeProposal = PageChangeProposal;
exports.PageInsightsAsyncExportRun = PageInsightsAsyncExportRun;
exports.PageLabel = PageLabel;
exports.PageParking = PageParking;
exports.PagePaymentOptions = PagePaymentOptions;
exports.PagePost = PagePost;
exports.PageRestaurantServices = PageRestaurantServices;
exports.PageRestaurantSpecialties = PageRestaurantSpecialties;
exports.PageSavedFilter = PageSavedFilter;
exports.PageSettings = PageSettings;
exports.PageStartInfo = PageStartInfo;
exports.PageThreadOwner = PageThreadOwner;
exports.PageUpcomingChange = PageUpcomingChange;
exports.PageUserMessageThreadLabel = PageUserMessageThreadLabel;
exports.PaymentPricepoints = PaymentPricepoints;
exports.Permission = Permission;
exports.Persona = Persona;
exports.Photo = Photo;
exports.Place = Place;
exports.PlaceTopic = PlaceTopic;
exports.PlatformImageSource = PlatformImageSource;
exports.PlayableContent = PlayableContent;
exports.Post = Post;
exports.Privacy = Privacy;
exports.ProductCatalog = ProductCatalog;
exports.ProductCatalogCategory = ProductCatalogCategory;
exports.ProductCatalogHotelRoomsBatch = ProductCatalogHotelRoomsBatch;
exports.ProductCatalogImageSettings = ProductCatalogImageSettings;
exports.ProductCatalogImageSettingsOperation = ProductCatalogImageSettingsOperation;
exports.ProductCatalogPricingVariablesBatch = ProductCatalogPricingVariablesBatch;
exports.ProductCatalogProductSetsBatch = ProductCatalogProductSetsBatch;
exports.ProductEventStat = ProductEventStat;
exports.ProductFeed = ProductFeed;
exports.ProductFeedMissingFeedItemReplacement = ProductFeedMissingFeedItemReplacement;
exports.ProductFeedRule = ProductFeedRule;
exports.ProductFeedRuleSuggestion = ProductFeedRuleSuggestion;
exports.ProductFeedSchedule = ProductFeedSchedule;
exports.ProductFeedUpload = ProductFeedUpload;
exports.ProductFeedUploadError = ProductFeedUploadError;
exports.ProductFeedUploadErrorReport = ProductFeedUploadErrorReport;
exports.ProductFeedUploadErrorSample = ProductFeedUploadErrorSample;
exports.ProductGroup = ProductGroup;
exports.ProductItem = ProductItem;
exports.ProductItemCommerceInsights = ProductItemCommerceInsights;
exports.ProductSet = ProductSet;
exports.ProductVariant = ProductVariant;
exports.Profile = Profile;
exports.ProfilePictureSource = ProfilePictureSource;
exports.PublisherBlockList = PublisherBlockList;
exports.RTBDynamicPost = RTBDynamicPost;
exports.RawCustomAudience = RawCustomAudience;
exports.ReachEstimate = ReachEstimate;
exports.ReachFrequencyActivity = ReachFrequencyActivity;
exports.ReachFrequencyAdFormat = ReachFrequencyAdFormat;
exports.ReachFrequencyCurveLowerConfidenceRange = ReachFrequencyCurveLowerConfidenceRange;
exports.ReachFrequencyCurveUpperConfidenceRange = ReachFrequencyCurveUpperConfidenceRange;
exports.ReachFrequencyDayPart = ReachFrequencyDayPart;
exports.ReachFrequencyEstimatesCurve = ReachFrequencyEstimatesCurve;
exports.ReachFrequencyEstimatesDemoBreakdown = ReachFrequencyEstimatesDemoBreakdown;
exports.ReachFrequencyEstimatesPlacementBreakdown = ReachFrequencyEstimatesPlacementBreakdown;
exports.ReachFrequencyPrediction = ReachFrequencyPrediction;
exports.ReachFrequencySpec = ReachFrequencySpec;
exports.ReadOnlyAnalyticsUserPropertyConfig = ReadOnlyAnalyticsUserPropertyConfig;
exports.Recommendation = Recommendation;
exports.Referral = Referral;
exports.RequestHistory = RequestHistory;
exports.RevSharePolicy = RevSharePolicy;
exports.RichMediaElement = RichMediaElement;
exports.SavedAudience = SavedAudience;
exports.SavedMessageResponse = SavedMessageResponse;
exports.SecuritySettings = SecuritySettings;
exports.SplitTestConfig = SplitTestConfig;
exports.SplitTestWinner = SplitTestWinner;
exports.StreamingReaction = StreamingReaction;
exports.SystemUser = SystemUser;
exports.Tab = Tab;
exports.TaggableSubject = TaggableSubject;
exports.Targeting = Targeting;
exports.TargetingDynamicRule = TargetingDynamicRule;
exports.TargetingGeoLocation = TargetingGeoLocation;
exports.TargetingGeoLocationCity = TargetingGeoLocationCity;
exports.TargetingGeoLocationCustomLocation = TargetingGeoLocationCustomLocation;
exports.TargetingGeoLocationElectoralDistrict = TargetingGeoLocationElectoralDistrict;
exports.TargetingGeoLocationGeoEntities = TargetingGeoLocationGeoEntities;
exports.TargetingGeoLocationLocationCluster = TargetingGeoLocationLocationCluster;
exports.TargetingGeoLocationMarket = TargetingGeoLocationMarket;
exports.TargetingGeoLocationPlace = TargetingGeoLocationPlace;
exports.TargetingGeoLocationPoliticalDistrict = TargetingGeoLocationPoliticalDistrict;
exports.TargetingGeoLocationRegion = TargetingGeoLocationRegion;
exports.TargetingGeoLocationZip = TargetingGeoLocationZip;
exports.TargetingProductAudienceSpec = TargetingProductAudienceSpec;
exports.TargetingProductAudienceSubSpec = TargetingProductAudienceSubSpec;
exports.TargetingProspectingAudience = TargetingProspectingAudience;
exports.TargetingSentenceLine = TargetingSentenceLine;
exports.ThirdPartyMeasurementReportDataset = ThirdPartyMeasurementReportDataset;
exports.TrackingAndConversionWithDefaults = TrackingAndConversionWithDefaults;
exports.URL = URL;
exports.UnifiedThread = UnifiedThread;
exports.User = User;
exports.UserCoverPhoto = UserCoverPhoto;
exports.UserDevice = UserDevice;
exports.UserIDForApp = UserIDForApp;
exports.UserIDForPage = UserIDForPage;
exports.UserInfluence = UserInfluence;
exports.UserLeadGenDisclaimerResponse = UserLeadGenDisclaimerResponse;
exports.UserLeadGenFieldData = UserLeadGenFieldData;
exports.UserPaymentMethodsInfo = UserPaymentMethodsInfo;
exports.UserPaymentMobilePricepoints = UserPaymentMobilePricepoints;
exports.UserPaymentModulesOptions = UserPaymentModulesOptions;
exports.UserTaggableFriend = UserTaggableFriend;
exports.ValueBasedEligibleSource = ValueBasedEligibleSource;
exports.VaultDeletedImage = VaultDeletedImage;
exports.Vehicle = Vehicle;
exports.VideoCopyright = VideoCopyright;
exports.VideoCopyrightConditionGroup = VideoCopyrightConditionGroup;
exports.VideoCopyrightGeoGate = VideoCopyrightGeoGate;
exports.VideoCopyrightRule = VideoCopyrightRule;
exports.VideoCopyrightSegment = VideoCopyrightSegment;
exports.VideoGameShow = VideoGameShow;
exports.VideoList = VideoList;
exports.VideoPoll = VideoPoll;
exports.VideoThumbnail = VideoThumbnail;
exports.VideoUploadLimits = VideoUploadLimits;
exports.VoipInfo = VoipInfo;
exports.WebAppLink = WebAppLink;
exports.WindowsAppLink = WindowsAppLink;
exports.WindowsPhoneAppLink = WindowsPhoneAppLink;

Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=umd.js.map
