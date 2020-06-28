// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/fetch-jsonp/build/fetch-jsonp.js":[function(require,module,exports) {
var define;
var global = arguments[3];
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.fetchJsonp = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  var defaultOptions = {
    timeout: 5000,
    jsonpCallback: 'callback',
    jsonpCallbackFunction: null
  };

  function generateCallbackFunction() {
    return 'jsonp_' + Date.now() + '_' + Math.ceil(Math.random() * 100000);
  }

  function clearFunction(functionName) {
    // IE8 throws an exception when you try to delete a property on window
    // http://stackoverflow.com/a/1824228/751089
    try {
      delete window[functionName];
    } catch (e) {
      window[functionName] = undefined;
    }
  }

  function removeScript(scriptId) {
    var script = document.getElementById(scriptId);
    if (script) {
      document.getElementsByTagName('head')[0].removeChild(script);
    }
  }

  function fetchJsonp(_url) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    // to avoid param reassign
    var url = _url;
    var timeout = options.timeout || defaultOptions.timeout;
    var jsonpCallback = options.jsonpCallback || defaultOptions.jsonpCallback;

    var timeoutId = undefined;

    return new Promise(function (resolve, reject) {
      var callbackFunction = options.jsonpCallbackFunction || generateCallbackFunction();
      var scriptId = jsonpCallback + '_' + callbackFunction;

      window[callbackFunction] = function (response) {
        resolve({
          ok: true,
          // keep consistent with fetch API
          json: function json() {
            return Promise.resolve(response);
          }
        });

        if (timeoutId) clearTimeout(timeoutId);

        removeScript(scriptId);

        clearFunction(callbackFunction);
      };

      // Check if the user set their own params, and if not add a ? to start a list of params
      url += url.indexOf('?') === -1 ? '?' : '&';

      var jsonpScript = document.createElement('script');
      jsonpScript.setAttribute('src', '' + url + jsonpCallback + '=' + callbackFunction);
      if (options.charset) {
        jsonpScript.setAttribute('charset', options.charset);
      }
      jsonpScript.id = scriptId;
      document.getElementsByTagName('head')[0].appendChild(jsonpScript);

      timeoutId = setTimeout(function () {
        reject(new Error('JSONP request to ' + _url + ' timed out'));

        clearFunction(callbackFunction);
        removeScript(scriptId);
        window[callbackFunction] = function () {
          clearFunction(callbackFunction);
        };
      }, timeout);

      // Caught if got 404/500
      jsonpScript.onerror = function () {
        reject(new Error('JSONP request to ' + _url + ' failed'));

        clearFunction(callbackFunction);
        removeScript(scriptId);
        if (timeoutId) clearTimeout(timeoutId);
      };
    });
  }

  // export as global function
  /*
  let local;
  if (typeof global !== 'undefined') {
    local = global;
  } else if (typeof self !== 'undefined') {
    local = self;
  } else {
    try {
      local = Function('return this')();
    } catch (e) {
      throw new Error('polyfill failed because global object is unavailable in this environment');
    }
  }
  local.fetchJsonp = fetchJsonp;
  */

  module.exports = fetchJsonp;
});
},{}],"js/second.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showAlert = showAlert;
exports.showAlert2 = showAlert2;
exports.clearField = clearField;
exports.isValid = isValid;

var _fetchJsonp = _interopRequireDefault(require("fetch-jsonp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

var searchForm = document.querySelector('#searchForm');
var searchForm2 = document.querySelector('#searchForm2');
searchForm.addEventListener('submit', fetchMovie);
searchForm2.addEventListener('submit', fetchChannel); // ========First form for movie(fetch)====================================

function fetchMovie(e) {
  e.preventDefault(); // Get User Input

  var movie = document.querySelector('#movie').value;
  var movieNumber = document.querySelector('#movieNumber').value;

  if (movie === '' || movieNumber === '' || !isValid(movieNumber)) {
    showAlert('Please Enter All Fields, or Enter A Valid Number!', 'danger');
    movieNumber = (_readOnlyError("movieNumber"), '0');
  } else {
    clearField();
  } // Fetch Movies


  (0, _fetchJsonp.default)("https://www.googleapis.com/youtube/v3/search?part=snippet&q=".concat(movie, "&key=AIzaSyCf6jaoTv315dPR0C6iSyhsJU3GoG4KlSI&type=video&maxResults=").concat(movieNumber, "&callback=callback"), {
    jsonpCallbackFunction: 'callback'
  }).then(function (res) {
    return res.json();
  }).then(function (data) {
    return showVideo(data.items.map(function (data) {
      return data.id;
    }));
  }) // .then(data => console.log(data))
  .catch(function (err) {
    return console.log(err);
  });
  var Bar = document.querySelector('#myBar'); // 0%

  var Bar2 = document.querySelector('.hide'); //<p>loading</p>

  if (Bar.style.display === "none") {
    Bar.style.display = "block";
    Bar2.style.display = "block";
  }

  move(); //animation bar fnuction

  frame(); //animation bar fnuction
} // =============First form for movie(display)==========================================


function showVideo(data) {
  var output = '<div class="card card-group  mydiv"> ';
  data.forEach(function (id) {
    output += "\n    <div class=\"card-body\">\n    <h3 class=\"card-title\">ID: ".concat(id.videoId, "</h3>\n    <p>https://www.youtube.com/watch?v=").concat(id.videoId, "</p>\n    <a class=\"card-text\" href=\"https://www.youtube.com/watch?v=").concat(id.videoId, "\"><h3>Link<h3></a>\n    \n    <iframe width=\"480\" height=\"315\" src=\"https://www.youtube.com/embed/").concat(id.videoId, "\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>\n    <hr>\n    </div>");
  });
  output += "</div>";
  setTimeout(function () {
    return btnbtn.style.display = "block";
  }, 1500);
  setTimeout(function () {
    return document.getElementById('results').innerHTML = output;
  }, 1000);
} //===============First form for movie display(toggle)=================================
//when click, the display area will show or hide 


document.getElementById("btnbtn").addEventListener("click", function () {
  //console.log("click");
  if (results.style.display === "none") {
    results.style.display = "block";
  } else {
    results.style.display = "none";
  }
}); //prevent many click( 2s per click now) 

$("#btnbtn").click(function () {
  $(this).attr("disabled", true);
  setTimeout(function () {
    $('#btnbtn').removeAttr("disabled");
  }, 2000);
}); //======================second form for channel id(fetch)================================

function fetchChannel(e) {
  e.preventDefault(); // Get User Input

  var channel = document.querySelector('#channel').value;

  if (channel === '') {
    showAlert2('Please Enter All Fields, or Enter A Valid Channel ID!', 'danger');
  } else {
    clearField();
  } // Fetch channel


  (0, _fetchJsonp.default)("https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=".concat(channel, "&key=AIzaSyAU3Ph1_2qQ0lDbFwWJmhIMEexP8TYRln4&callback=callback"), {
    jsonpCallbackFunction: 'callback'
  }).then(function (res) {
    return res.json();
  }).then(function (data) {
    return showplaylist(data.items.map(function (data) {
      return data.contentDetails.relatedPlaylists.uploads;
    }));
  }) //.then(data => console.log(data))
  .catch(function (err) {
    return showAlert2('Please Enter A Valid Channel ID or Enter all Field.', 'danger');
  });
} // =============second form for channel(display)===============================================


function showplaylist(data) {
  var getchannel = data[0]; //console.log( getchannel);

  var count = data.length;

  if (count = 1) {
    //if have result, the data length = 1
    var show = document.querySelector(".none"); //display channel number <p>area

    show.style.display = "block";
    var show2 = document.querySelector(".none2"); //display channel number <input>area

    if (show2.style.display === "none") {
      show2.style.display = "block";
    }

    var content = document.querySelector(".content"); //set default display vh to 30 

    content.style.minHeight = "30vh";
    var coll2 = document.querySelector(".coll");
    coll2.addEventListener("click", function () {
      //when click the toggle, set vh
      content.style.minHeight = "0vh"; //to 0 = display area disappear
    });
  } //check vaild


  var channelNumber = document.getElementById('channelNumber').value;

  if (channelNumber === '' || channelNumber <= 0 || channelNumber > 50) {
    channelNumber = (_readOnlyError("channelNumber"), '');
    showAlert2('Please Enter All Fields, or Enter A Valid Number!', 'danger');
  } else {
    clearField();
  } // Fetch channelplaylists


  (0, _fetchJsonp.default)("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails,status&playlistId=".concat(getchannel, "&key=AIzaSyAU3Ph1_2qQ0lDbFwWJmhIMEexP8TYRln4&maxResults=").concat(channelNumber, "&callback=callback"), {
    jsonpCallbackFunction: 'callback'
  }).then(function (res) {
    return res.json();
  }).then(function (data) {
    return showChannelplaylists(data.items.map(function (data) {
      return data.contentDetails;
    }));
  }).catch(function (err) {
    return showAlert2('Please Enter A Valid Channel Number!', 'danger');
  });
} // ================End of second form for channel playlists==============================================
// ================second form for channel playlists(display)================


function showChannelplaylists(data) {
  showAlert2('Success! Results are in below', 'success');
  var output2 = '<div class=" card card-group text-white bg-danger "> ';
  data.forEach(function (contentDetails) {
    output2 += "\n    <div class=\"card-body\">\n    <h3 class=\"card-title\"> ID: ".concat(contentDetails.videoId, "</h3>\n    <p>https://www.youtube.com/watch?v=").concat(contentDetails.videoId, "</p>\n    <a class=\"card-text\" href=\"https://www.youtube.com/watch?v=").concat(contentDetails.videoId, "\"><h3>Link<h3></a>\n    <p class=\"card-text\"> Published at: ").concat(contentDetails.videoPublishedAt, "</p>\n    <iframe width=\"360\" height=\"215\" src=\"https://www.youtube.com/embed/").concat(contentDetails.videoId, "\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>\n    <hr>\n    </div>");
  });
  output2 += "</div>";
  document.getElementById('results2').innerHTML = output2;
  setTimeout(function () {
    return btnbtn2.style.display = "block";
  }, 1000);
} // ================second form for channel playlists(toggle)===========


document.getElementById("btnbtn2").addEventListener("click", function () {
  //console.log("click");
  if (results2.style.display === "none") {
    results2.style.display = "block";
  } else {
    results2.style.display = "none";
  }
}); //prevent many click( 2s per click now) 

$("#btnbtn2").click(function () {
  $(this).attr("disabled", true);
  setTimeout(function () {
    $('#btnbtn2').removeAttr("disabled");
  }, 2000);
}); //==============Display Alert Message(Global function)===============================

function showAlert(message, className) {
  // Create div
  var div = document.createElement('div'); // Add Classes

  div.className = "alert alert-".concat(className); // Add Text

  div.appendChild(document.createTextNode(message)); // Get Container

  var container = document.querySelector('.jumbotron'); // Get Form

  var form = document.querySelector('#searchForm'); // Insert Alert

  container.insertBefore(div, form);
  setTimeout(function () {
    return document.querySelector('.alert').remove();
  }, 3000);
} //===========Display Alert Message*2*(Global Function)==================================


function showAlert2(message, className) {
  // Create div
  var div = document.createElement('div'); // Add Classes

  div.className = "alert alert-".concat(className); // Add Text

  div.appendChild(document.createTextNode(message)); // Get Container

  var container2 = document.querySelector('.jumbotron2'); // Get Form

  var form = document.querySelector('#searchForm2'); // Insert Alert

  container2.insertBefore(div, form);
  setTimeout(function () {
    return document.querySelector('.alert').remove();
  }, 3500);
}

function clearField() {
  document.querySelector('#movie').value = '';
  document.querySelector('#movieNumber').value = '';
}

function isValid(movieNumber) {
  return /^((?!(0))[0-9]{1})$/.test(movieNumber);
} //=======Here is line123 function, for toggle the display area====================


var coll = document.getElementsByClassName("coll");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active2");
    var content = this.nextElementSibling;

    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
} //====Here is line 34 function, for showing the animation progress bar and message======


var Bar2 = document.querySelector('.hide');
var Bar3 = document.querySelector('.hide2');
var q = 0;
var i = 0;

function move() {
  if (i == 0) {
    i = 1;
    var elem = document.getElementById("myBar");
    var width = 0;
    var id = setInterval(_frame, 15);

    function _frame() {
      if (width >= 100) {
        clearInterval(id);
        i = 0;
        Bar2.style.display = "none";
        Bar3.style.display = "block";
      } else {
        Bar2.style.display = "block";
        Bar3.style.display = "none";
        width++;
        elem.style.width = width + "%";
        elem.innerHTML = width + "%";
      }
    }
  }
}

var btnbtn3 = document.querySelector('.btnbtn3');
btnbtn3.addEventListener("click", function () {
  var userInput = document.getElementById("myText").value;
  var userInput2 = document.getElementById("FileName").value;
  console.log(userInput2); //console.log(userInput);

  var blob = new Blob([userInput], {
    type: "text/plain;charset=utf-8"
  });
  saveAs(blob, userInput2);
});
var btnbtn4 = document.querySelector('.fix2');
var hidehide = document.querySelector('.hidehide');
btnbtn4.addEventListener("click", function () {
  if (hidehide.style.display === "none") {
    hidehide.style.display = "block";
  } else {
    hidehide.style.display = "none";
  }
});

function progress() {
  var check1 = document.getElementById('myText').validity.valid;
  var check2 = document.getElementById('FileName').validity.valid;
  var btnbtn3 = document.getElementById('btnbtn3');

  if (check1 === true || check2 === true) {
    //btnbtn4.addEventListener("click", function(){
    //const filename = document.getElementById('filename').value;
    $(btnbtn3).attr("disabled", true);
  }
}

progress();
document.getElementById("FileName").addEventListener("keydown", function () {
  var check1 = document.getElementById('myText').value;
  var check2 = document.getElementById('FileName').value;

  if (check1 != '' || check2 != '') {
    console.log("yes");
    $(btnbtn3).removeAttr("disabled");
  } else {
    progress();
  }
});
},{"fetch-jsonp":"node_modules/fetch-jsonp/build/fetch-jsonp.js"}],"../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56999" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/second.js"], null)
//# sourceMappingURL=/second.3f8c2825.js.map
