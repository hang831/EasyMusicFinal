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
})({"js/jqBootstrapValidation.js":[function(require,module,exports) {
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function ($) {
  var createdElements = [];
  var defaults = {
    options: {
      prependExistingHelpBlock: false,
      sniffHtml: true,
      // sniff for 'required', 'maxlength', etc
      preventSubmit: true,
      // stop the form submit event from firing if validation fails
      submitError: false,
      // function called if there is an error when trying to submit
      submitSuccess: false,
      // function called just before a successful submit event is sent to the server
      semanticallyStrict: false,
      // set to true to tidy up generated HTML output
      autoAdd: {
        helpBlocks: true
      },
      filter: function filter() {
        // return $(this).is(":visible"); // only validate elements you can see
        return true; // validate everything
      }
    },
    methods: {
      init: function init(options) {
        var settings = $.extend(true, {}, defaults);
        settings.options = $.extend(true, settings.options, options);
        var $siblingElements = this;
        var uniqueForms = $.unique($siblingElements.map(function () {
          return $(this).parents("form")[0];
        }).toArray());
        $(uniqueForms).bind("submit", function (e) {
          var $form = $(this);
          var warningsFound = 0;
          var $inputs = $form.find("input,textarea,select").not("[type=submit],[type=image]").filter(settings.options.filter);
          $inputs.trigger("submit.validation").trigger("validationLostFocus.validation");
          $inputs.each(function (i, el) {
            var $this = $(el),
                $controlGroup = $this.parents(".form-group").first();

            if ($controlGroup.hasClass("warning")) {
              $controlGroup.removeClass("warning").addClass("error");
              warningsFound++;
            }
          });
          $inputs.trigger("validationLostFocus.validation");

          if (warningsFound) {
            if (settings.options.preventSubmit) {
              e.preventDefault();
            }

            $form.addClass("error");

            if ($.isFunction(settings.options.submitError)) {
              settings.options.submitError($form, e, $inputs.jqBootstrapValidation("collectErrors", true));
            }
          } else {
            $form.removeClass("error");

            if ($.isFunction(settings.options.submitSuccess)) {
              settings.options.submitSuccess($form, e);
            }
          }
        });
        return this.each(function () {
          // Get references to everything we're interested in
          var $this = $(this),
              $controlGroup = $this.parents(".form-group").first(),
              $helpBlock = $controlGroup.find(".help-block").first(),
              $form = $this.parents("form").first(),
              validatorNames = []; // create message container if not exists

          if (!$helpBlock.length && settings.options.autoAdd && settings.options.autoAdd.helpBlocks) {
            $helpBlock = $('<div class="help-block" />');
            $controlGroup.find('.controls').append($helpBlock);
            createdElements.push($helpBlock[0]);
          } // =============================================================
          //                                     SNIFF HTML FOR VALIDATORS
          // =============================================================
          // *snort sniff snuffle*


          if (settings.options.sniffHtml) {
            var message = ""; // ---------------------------------------------------------
            //                                                   PATTERN
            // ---------------------------------------------------------

            if ($this.attr("pattern") !== undefined) {
              message = "Not in the expected format<!-- data-validation-pattern-message to override -->";

              if ($this.data("validationPatternMessage")) {
                message = $this.data("validationPatternMessage");
              }

              $this.data("validationPatternMessage", message);
              $this.data("validationPatternRegex", $this.attr("pattern"));
            } // ---------------------------------------------------------
            //                                                       MAX
            // ---------------------------------------------------------


            if ($this.attr("max") !== undefined || $this.attr("aria-valuemax") !== undefined) {
              var max = $this.attr("max") !== undefined ? $this.attr("max") : $this.attr("aria-valuemax");
              message = "Too high: Maximum of '" + max + "'<!-- data-validation-max-message to override -->";

              if ($this.data("validationMaxMessage")) {
                message = $this.data("validationMaxMessage");
              }

              $this.data("validationMaxMessage", message);
              $this.data("validationMaxMax", max);
            } // ---------------------------------------------------------
            //                                                       MIN
            // ---------------------------------------------------------


            if ($this.attr("min") !== undefined || $this.attr("aria-valuemin") !== undefined) {
              var min = $this.attr("min") !== undefined ? $this.attr("min") : $this.attr("aria-valuemin");
              message = "Too low: Minimum of '" + min + "'<!-- data-validation-min-message to override -->";

              if ($this.data("validationMinMessage")) {
                message = $this.data("validationMinMessage");
              }

              $this.data("validationMinMessage", message);
              $this.data("validationMinMin", min);
            } // ---------------------------------------------------------
            //                                                 MAXLENGTH
            // ---------------------------------------------------------


            if ($this.attr("maxlength") !== undefined) {
              message = "Too long: Maximum of '" + $this.attr("maxlength") + "' characters<!-- data-validation-maxlength-message to override -->";

              if ($this.data("validationMaxlengthMessage")) {
                message = $this.data("validationMaxlengthMessage");
              }

              $this.data("validationMaxlengthMessage", message);
              $this.data("validationMaxlengthMaxlength", $this.attr("maxlength"));
            } // ---------------------------------------------------------
            //                                                 MINLENGTH
            // ---------------------------------------------------------


            if ($this.attr("minlength") !== undefined) {
              message = "Too short: Minimum of '" + $this.attr("minlength") + "' characters<!-- data-validation-minlength-message to override -->";

              if ($this.data("validationMinlengthMessage")) {
                message = $this.data("validationMinlengthMessage");
              }

              $this.data("validationMinlengthMessage", message);
              $this.data("validationMinlengthMinlength", $this.attr("minlength"));
            } // ---------------------------------------------------------
            //                                                  REQUIRED
            // ---------------------------------------------------------


            if ($this.attr("required") !== undefined || $this.attr("aria-required") !== undefined) {
              message = settings.builtInValidators.required.message;

              if ($this.data("validationRequiredMessage")) {
                message = $this.data("validationRequiredMessage");
              }

              $this.data("validationRequiredMessage", message);
            } // ---------------------------------------------------------
            //                                                    NUMBER
            // ---------------------------------------------------------


            if ($this.attr("type") !== undefined && $this.attr("type").toLowerCase() === "number") {
              message = settings.builtInValidators.number.message;

              if ($this.data("validationNumberMessage")) {
                message = $this.data("validationNumberMessage");
              }

              $this.data("validationNumberMessage", message);
            } // ---------------------------------------------------------
            //                                                     EMAIL
            // ---------------------------------------------------------


            if ($this.attr("type") !== undefined && $this.attr("type").toLowerCase() === "email") {
              message = "Not a valid email address<!-- data-validator-validemail-message to override -->";

              if ($this.data("validationValidemailMessage")) {
                message = $this.data("validationValidemailMessage");
              } else if ($this.data("validationEmailMessage")) {
                message = $this.data("validationEmailMessage");
              }

              $this.data("validationValidemailMessage", message);
            } // ---------------------------------------------------------
            //                                                MINCHECKED
            // ---------------------------------------------------------


            if ($this.attr("minchecked") !== undefined) {
              message = "Not enough options checked; Minimum of '" + $this.attr("minchecked") + "' required<!-- data-validation-minchecked-message to override -->";

              if ($this.data("validationMincheckedMessage")) {
                message = $this.data("validationMincheckedMessage");
              }

              $this.data("validationMincheckedMessage", message);
              $this.data("validationMincheckedMinchecked", $this.attr("minchecked"));
            } // ---------------------------------------------------------
            //                                                MAXCHECKED
            // ---------------------------------------------------------


            if ($this.attr("maxchecked") !== undefined) {
              message = "Too many options checked; Maximum of '" + $this.attr("maxchecked") + "' required<!-- data-validation-maxchecked-message to override -->";

              if ($this.data("validationMaxcheckedMessage")) {
                message = $this.data("validationMaxcheckedMessage");
              }

              $this.data("validationMaxcheckedMessage", message);
              $this.data("validationMaxcheckedMaxchecked", $this.attr("maxchecked"));
            }
          } // =============================================================
          //                                       COLLECT VALIDATOR NAMES
          // =============================================================
          // Get named validators


          if ($this.data("validation") !== undefined) {
            validatorNames = $this.data("validation").split(",");
          } // Get extra ones defined on the element's data attributes


          $.each($this.data(), function (i, el) {
            var parts = i.replace(/([A-Z])/g, ",$1").split(",");

            if (parts[0] === "validation" && parts[1]) {
              validatorNames.push(parts[1]);
            }
          }); // =============================================================
          //                                     NORMALISE VALIDATOR NAMES
          // =============================================================

          var validatorNamesToInspect = validatorNames;
          var newValidatorNamesToInspect = [];

          do // repeatedly expand 'shortcut' validators into their real validators
          {
            // Uppercase only the first letter of each name
            $.each(validatorNames, function (i, el) {
              validatorNames[i] = formatValidatorName(el);
            }); // Remove duplicate validator names

            validatorNames = $.unique(validatorNames); // Pull out the new validator names from each shortcut

            newValidatorNamesToInspect = [];
            $.each(validatorNamesToInspect, function (i, el) {
              if ($this.data("validation" + el + "Shortcut") !== undefined) {
                // Are these custom validators?
                // Pull them out!
                $.each($this.data("validation" + el + "Shortcut").split(","), function (i2, el2) {
                  newValidatorNamesToInspect.push(el2);
                });
              } else if (settings.builtInValidators[el.toLowerCase()]) {
                // Is this a recognised built-in?
                // Pull it out!
                var validator = settings.builtInValidators[el.toLowerCase()];

                if (validator.type.toLowerCase() === "shortcut") {
                  $.each(validator.shortcut.split(","), function (i, el) {
                    el = formatValidatorName(el);
                    newValidatorNamesToInspect.push(el);
                    validatorNames.push(el);
                  });
                }
              }
            });
            validatorNamesToInspect = newValidatorNamesToInspect;
          } while (validatorNamesToInspect.length > 0); // =============================================================
          //                                       SET UP VALIDATOR ARRAYS
          // =============================================================


          var validators = {};
          $.each(validatorNames, function (i, el) {
            // Set up the 'override' message
            var message = $this.data("validation" + el + "Message");
            var hasOverrideMessage = message !== undefined;
            var foundValidator = false;
            message = message ? message : "'" + el + "' validation failed <!-- Add attribute 'data-validation-" + el.toLowerCase() + "-message' to input to change this message -->";
            $.each(settings.validatorTypes, function (validatorType, validatorTemplate) {
              if (validators[validatorType] === undefined) {
                validators[validatorType] = [];
              }

              if (!foundValidator && $this.data("validation" + el + formatValidatorName(validatorTemplate.name)) !== undefined) {
                validators[validatorType].push($.extend(true, {
                  name: formatValidatorName(validatorTemplate.name),
                  message: message
                }, validatorTemplate.init($this, el)));
                foundValidator = true;
              }
            });

            if (!foundValidator && settings.builtInValidators[el.toLowerCase()]) {
              var validator = $.extend(true, {}, settings.builtInValidators[el.toLowerCase()]);

              if (hasOverrideMessage) {
                validator.message = message;
              }

              var validatorType = validator.type.toLowerCase();

              if (validatorType === "shortcut") {
                foundValidator = true;
              } else {
                $.each(settings.validatorTypes, function (validatorTemplateType, validatorTemplate) {
                  if (validators[validatorTemplateType] === undefined) {
                    validators[validatorTemplateType] = [];
                  }

                  if (!foundValidator && validatorType === validatorTemplateType.toLowerCase()) {
                    $this.data("validation" + el + formatValidatorName(validatorTemplate.name), validator[validatorTemplate.name.toLowerCase()]);
                    validators[validatorType].push($.extend(validator, validatorTemplate.init($this, el)));
                    foundValidator = true;
                  }
                });
              }
            }

            if (!foundValidator) {
              $.error("Cannot find validation info for '" + el + "'");
            }
          }); // =============================================================
          //                                         STORE FALLBACK VALUES
          // =============================================================

          $helpBlock.data("original-contents", $helpBlock.data("original-contents") ? $helpBlock.data("original-contents") : $helpBlock.html());
          $helpBlock.data("original-role", $helpBlock.data("original-role") ? $helpBlock.data("original-role") : $helpBlock.attr("role"));
          $controlGroup.data("original-classes", $controlGroup.data("original-clases") ? $controlGroup.data("original-classes") : $controlGroup.attr("class"));
          $this.data("original-aria-invalid", $this.data("original-aria-invalid") ? $this.data("original-aria-invalid") : $this.attr("aria-invalid")); // =============================================================
          //                                                    VALIDATION
          // =============================================================

          $this.bind("validation.validation", function (event, params) {
            var value = getValue($this); // Get a list of the errors to apply

            var errorsFound = [];
            $.each(validators, function (validatorType, validatorTypeArray) {
              if (value || value.length || params && params.includeEmpty || !!settings.validatorTypes[validatorType].blockSubmit && params && !!params.submitting) {
                $.each(validatorTypeArray, function (i, validator) {
                  if (settings.validatorTypes[validatorType].validate($this, value, validator)) {
                    errorsFound.push(validator.message);
                  }
                });
              }
            });
            return errorsFound;
          });
          $this.bind("getValidators.validation", function () {
            return validators;
          }); // =============================================================
          //                                             WATCH FOR CHANGES
          // =============================================================

          $this.bind("submit.validation", function () {
            return $this.triggerHandler("change.validation", {
              submitting: true
            });
          });
          $this.bind(["keyup", "focus", "blur", "click", "keydown", "keypress", "change"].join(".validation ") + ".validation", function (e, params) {
            var value = getValue($this);
            var errorsFound = [];
            $controlGroup.find("input,textarea,select").each(function (i, el) {
              var oldCount = errorsFound.length;
              $.each($(el).triggerHandler("validation.validation", params), function (j, message) {
                errorsFound.push(message);
              });

              if (errorsFound.length > oldCount) {
                $(el).attr("aria-invalid", "true");
              } else {
                var original = $this.data("original-aria-invalid");
                $(el).attr("aria-invalid", original !== undefined ? original : false);
              }
            });
            $form.find("input,select,textarea").not($this).not("[name=\"" + $this.attr("name") + "\"]").trigger("validationLostFocus.validation");
            errorsFound = $.unique(errorsFound.sort()); // Were there any errors?

            if (errorsFound.length) {
              // Better flag it up as a warning.
              $controlGroup.removeClass("success error").addClass("warning"); // How many errors did we find?

              if (settings.options.semanticallyStrict && errorsFound.length === 1) {
                // Only one? Being strict? Just output it.
                $helpBlock.html(errorsFound[0] + (settings.options.prependExistingHelpBlock ? $helpBlock.data("original-contents") : ""));
              } else {
                // Multiple? Being sloppy? Glue them together into an UL.
                $helpBlock.html("<ul role=\"alert\"><li>" + errorsFound.join("</li><li>") + "</li></ul>" + (settings.options.prependExistingHelpBlock ? $helpBlock.data("original-contents") : ""));
              }
            } else {
              $controlGroup.removeClass("warning error success");

              if (value.length > 0) {
                $controlGroup.addClass("success");
              }

              $helpBlock.html($helpBlock.data("original-contents"));
            }

            if (e.type === "blur") {
              $controlGroup.removeClass("success");
            }
          });
          $this.bind("validationLostFocus.validation", function () {
            $controlGroup.removeClass("success");
          });
        });
      },
      destroy: function destroy() {
        return this.each(function () {
          var $this = $(this),
              $controlGroup = $this.parents(".form-group").first(),
              $helpBlock = $controlGroup.find(".help-block").first(); // remove our events

          $this.unbind('.validation'); // events are namespaced.
          // reset help text

          $helpBlock.html($helpBlock.data("original-contents")); // reset classes

          $controlGroup.attr("class", $controlGroup.data("original-classes")); // reset aria

          $this.attr("aria-invalid", $this.data("original-aria-invalid")); // reset role

          $helpBlock.attr("role", $this.data("original-role")); // remove all elements we created

          if (createdElements.indexOf($helpBlock[0]) > -1) {
            $helpBlock.remove();
          }
        });
      },
      collectErrors: function collectErrors(includeEmpty) {
        var errorMessages = {};
        this.each(function (i, el) {
          var $el = $(el);
          var name = $el.attr("name");
          var errors = $el.triggerHandler("validation.validation", {
            includeEmpty: true
          });
          errorMessages[name] = $.extend(true, errors, errorMessages[name]);
        });
        $.each(errorMessages, function (i, el) {
          if (el.length === 0) {
            delete errorMessages[i];
          }
        });
        return errorMessages;
      },
      hasErrors: function hasErrors() {
        var errorMessages = [];
        this.each(function (i, el) {
          errorMessages = errorMessages.concat($(el).triggerHandler("getValidators.validation") ? $(el).triggerHandler("validation.validation", {
            submitting: true
          }) : []);
        });
        return errorMessages.length > 0;
      },
      override: function override(newDefaults) {
        defaults = $.extend(true, defaults, newDefaults);
      }
    },
    validatorTypes: {
      callback: {
        name: "callback",
        init: function init($this, name) {
          return {
            validatorName: name,
            callback: $this.data("validation" + name + "Callback"),
            lastValue: $this.val(),
            lastValid: true,
            lastFinished: true
          };
        },
        validate: function validate($this, value, validator) {
          if (validator.lastValue === value && validator.lastFinished) {
            return !validator.lastValid;
          }

          if (validator.lastFinished === true) {
            validator.lastValue = value;
            validator.lastValid = true;
            validator.lastFinished = false;
            var rrjqbvValidator = validator;
            var rrjqbvThis = $this;
            executeFunctionByName(validator.callback, window, $this, value, function (data) {
              if (rrjqbvValidator.lastValue === data.value) {
                rrjqbvValidator.lastValid = data.valid;

                if (data.message) {
                  rrjqbvValidator.message = data.message;
                }

                rrjqbvValidator.lastFinished = true;
                rrjqbvThis.data("validation" + rrjqbvValidator.validatorName + "Message", rrjqbvValidator.message); // Timeout is set to avoid problems with the events being considered 'already fired'

                setTimeout(function () {
                  rrjqbvThis.trigger("change.validation");
                }, 1); // doesn't need a long timeout, just long enough for the event bubble to burst
              }
            });
          }

          return false;
        }
      },
      ajax: {
        name: "ajax",
        init: function init($this, name) {
          return {
            validatorName: name,
            url: $this.data("validation" + name + "Ajax"),
            lastValue: $this.val(),
            lastValid: true,
            lastFinished: true
          };
        },
        validate: function validate($this, value, validator) {
          if ("" + validator.lastValue === "" + value && validator.lastFinished === true) {
            return validator.lastValid === false;
          }

          if (validator.lastFinished === true) {
            validator.lastValue = value;
            validator.lastValid = true;
            validator.lastFinished = false;
            $.ajax({
              url: validator.url,
              data: "value=" + value + "&field=" + $this.attr("name"),
              dataType: "json",
              success: function success(data) {
                if ("" + validator.lastValue === "" + data.value) {
                  validator.lastValid = !!data.valid;

                  if (data.message) {
                    validator.message = data.message;
                  }

                  validator.lastFinished = true;
                  $this.data("validation" + validator.validatorName + "Message", validator.message); // Timeout is set to avoid problems with the events being considered 'already fired'

                  setTimeout(function () {
                    $this.trigger("change.validation");
                  }, 1); // doesn't need a long timeout, just long enough for the event bubble to burst
                }
              },
              failure: function failure() {
                validator.lastValid = true;
                validator.message = "ajax call failed";
                validator.lastFinished = true;
                $this.data("validation" + validator.validatorName + "Message", validator.message); // Timeout is set to avoid problems with the events being considered 'already fired'

                setTimeout(function () {
                  $this.trigger("change.validation");
                }, 1); // doesn't need a long timeout, just long enough for the event bubble to burst
              }
            });
          }

          return false;
        }
      },
      regex: {
        name: "regex",
        init: function init($this, name) {
          return {
            regex: regexFromString($this.data("validation" + name + "Regex"))
          };
        },
        validate: function validate($this, value, validator) {
          return !validator.regex.test(value) && !validator.negative || validator.regex.test(value) && validator.negative;
        }
      },
      required: {
        name: "required",
        init: function init($this, name) {
          return {};
        },
        validate: function validate($this, value, validator) {
          return !!(value.length === 0 && !validator.negative) || !!(value.length > 0 && validator.negative);
        },
        blockSubmit: true
      },
      match: {
        name: "match",
        init: function init($this, name) {
          var element = $this.parents("form").first().find("[name=\"" + $this.data("validation" + name + "Match") + "\"]").first();
          element.bind("validation.validation", function () {
            $this.trigger("change.validation", {
              submitting: true
            });
          });
          return {
            "element": element
          };
        },
        validate: function validate($this, value, validator) {
          return value !== validator.element.val() && !validator.negative || value === validator.element.val() && validator.negative;
        },
        blockSubmit: true
      },
      max: {
        name: "max",
        init: function init($this, name) {
          return {
            max: $this.data("validation" + name + "Max")
          };
        },
        validate: function validate($this, value, validator) {
          return parseFloat(value, 10) > parseFloat(validator.max, 10) && !validator.negative || parseFloat(value, 10) <= parseFloat(validator.max, 10) && validator.negative;
        }
      },
      min: {
        name: "min",
        init: function init($this, name) {
          return {
            min: $this.data("validation" + name + "Min")
          };
        },
        validate: function validate($this, value, validator) {
          return parseFloat(value) < parseFloat(validator.min) && !validator.negative || parseFloat(value) >= parseFloat(validator.min) && validator.negative;
        }
      },
      maxlength: {
        name: "maxlength",
        init: function init($this, name) {
          return {
            maxlength: $this.data("validation" + name + "Maxlength")
          };
        },
        validate: function validate($this, value, validator) {
          return value.length > validator.maxlength && !validator.negative || value.length <= validator.maxlength && validator.negative;
        }
      },
      minlength: {
        name: "minlength",
        init: function init($this, name) {
          return {
            minlength: $this.data("validation" + name + "Minlength")
          };
        },
        validate: function validate($this, value, validator) {
          return value.length < validator.minlength && !validator.negative || value.length >= validator.minlength && validator.negative;
        }
      },
      maxchecked: {
        name: "maxchecked",
        init: function init($this, name) {
          var elements = $this.parents("form").first().find("[name=\"" + $this.attr("name") + "\"]");
          elements.bind("click.validation", function () {
            $this.trigger("change.validation", {
              includeEmpty: true
            });
          });
          return {
            maxchecked: $this.data("validation" + name + "Maxchecked"),
            elements: elements
          };
        },
        validate: function validate($this, value, validator) {
          return validator.elements.filter(":checked").length > validator.maxchecked && !validator.negative || validator.elements.filter(":checked").length <= validator.maxchecked && validator.negative;
        },
        blockSubmit: true
      },
      minchecked: {
        name: "minchecked",
        init: function init($this, name) {
          var elements = $this.parents("form").first().find("[name=\"" + $this.attr("name") + "\"]");
          elements.bind("click.validation", function () {
            $this.trigger("change.validation", {
              includeEmpty: true
            });
          });
          return {
            minchecked: $this.data("validation" + name + "Minchecked"),
            elements: elements
          };
        },
        validate: function validate($this, value, validator) {
          return validator.elements.filter(":checked").length < validator.minchecked && !validator.negative || validator.elements.filter(":checked").length >= validator.minchecked && validator.negative;
        },
        blockSubmit: true
      }
    },
    builtInValidators: {
      email: {
        name: "Email",
        type: "shortcut",
        shortcut: "validemail"
      },
      validemail: {
        name: "Validemail",
        type: "regex",
        regex: "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\\.[A-Za-z]{2,4}",
        message: "Not a valid email address<!-- data-validator-validemail-message to override -->"
      },
      passwordagain: {
        name: "Passwordagain",
        type: "match",
        match: "password",
        message: "Does not match the given password<!-- data-validator-paswordagain-message to override -->"
      },
      positive: {
        name: "Positive",
        type: "shortcut",
        shortcut: "number,positivenumber"
      },
      negative: {
        name: "Negative",
        type: "shortcut",
        shortcut: "number,negativenumber"
      },
      number: {
        name: "Number",
        type: "regex",
        regex: "([+-]?\\\d+(\\\.\\\d*)?([eE][+-]?[0-9]+)?)?",
        message: "Must be a number<!-- data-validator-number-message to override -->"
      },
      integer: {
        name: "Integer",
        type: "regex",
        regex: "[+-]?\\\d+",
        message: "No decimal places allowed<!-- data-validator-integer-message to override -->"
      },
      positivenumber: {
        name: "Positivenumber",
        type: "min",
        min: 0,
        message: "Must be a positive number<!-- data-validator-positivenumber-message to override -->"
      },
      negativenumber: {
        name: "Negativenumber",
        type: "max",
        max: 0,
        message: "Must be a negative number<!-- data-validator-negativenumber-message to override -->"
      },
      required: {
        name: "Required",
        type: "required",
        message: "This is required<!-- data-validator-required-message to override -->"
      },
      checkone: {
        name: "Checkone",
        type: "minchecked",
        minchecked: 1,
        message: "Check at least one option<!-- data-validation-checkone-message to override -->"
      }
    }
  };

  var formatValidatorName = function formatValidatorName(name) {
    return name.toLowerCase().replace(/(^|\s)([a-z])/g, function (m, p1, p2) {
      return p1 + p2.toUpperCase();
    });
  };

  var getValue = function getValue($this) {
    // Extract the value we're talking about
    var value = $this.val();
    var type = $this.attr("type");

    if (type === "checkbox") {
      value = $this.is(":checked") ? value : "";
    }

    if (type === "radio") {
      value = $('input[name="' + $this.attr("name") + '"]:checked').length > 0 ? value : "";
    }

    return value;
  };

  function regexFromString(inputstring) {
    return new RegExp("^" + inputstring + "$");
  }
  /**
   * Thanks to Jason Bunting via StackOverflow.com
   *
   * http://stackoverflow.com/questions/359788/how-to-execute-a-javascript-function-when-i-have-its-name-as-a-string#answer-359910
   * Short link: http://tinyurl.com/executeFunctionByName
   **/


  function executeFunctionByName(functionName, context
  /*, args*/
  ) {
    var args = Array.prototype.slice.call(arguments).splice(2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();

    for (var i = 0; i < namespaces.length; i++) {
      context = context[namespaces[i]];
    }

    return context[func].apply(this, args);
  }

  $.fn.jqBootstrapValidation = function (method) {
    if (defaults.methods[method]) {
      return defaults.methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (_typeof(method) === 'object' || !method) {
      return defaults.methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.jqBootstrapValidation');
      return null;
    }
  };

  $.jqBootstrapValidation = function (options) {
    $(":input").not("[type=image],[type=submit]").jqBootstrapValidation.apply(this, arguments);
  };
})(jQuery);
},{}],"../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
},{}]},{},["../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/jqBootstrapValidation.js"], null)
//# sourceMappingURL=/jqBootstrapValidation.9b01809b.js.map