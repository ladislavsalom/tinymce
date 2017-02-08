define('ephox.mcagar.api.LegacyUnit', [
  'global!window',
  'ephox.agar.api.Step',
  'ephox.agar.api.Logger',
  'ephox.agar.api.Assertions'
], function (window, Step, Logger, Assertions) {
  var test = function (message, fn) {
    return function (editor) {
      return Logger.t(
        message,
        Step.sync(function () {
          fn(editor);
        })
      );
    };
  };

  var asyncTest = function (message, fn) {
    return function (editor) {
      return Logger.t(
        message,
        Step.async(function (done, die) {
          fn(editor, done, die);
        })
      );
    };
  };

  var createSuite = function () {
    var tests = [];

    return {
      test: function (message, fn) {
        tests.push(test(message, fn));
      },

      asyncTest: function (message, fn) {
        tests.push(asyncTest(message, fn));
      },

      toSteps: function (editor) {
        return tests.map(function (test) {
          return test(editor);
        });
      }
    };
  };

  var execCommand = function execCommand(editor, cmd, ui, obj) {
    if (editor.editorCommands.hasCustomCommand(cmd)) {
      editor.execCommand(cmd, ui, obj);
    }
  };

  var findContainer = function (editor, selector) {
    var container;

    if (typeof selector === 'string') {
      container = editor.dom.select(selector)[0];
    } else {
      container = selector;
    }

    if (container.firstChild) {
      container = container.firstChild;
    }

    return container;
  };

  var setSelection = function (editor, startSelector, startOffset, endSelector, endOffset) {
    var startContainer = findContainer(editor, startSelector);
    var endContainer = findContainer(editor, endSelector ? endSelector : startSelector);
    var rng = editor.dom.createRng();

    var setRange = function (container, offset, start) {
      offset = offset ? offset : 0;

      if (offset === 'after') {
        if (start) {
          rng.setStartAfter(container);
        } else {
          rng.setEndAfter(container);
        }

        return;
      } else if (offset === 'afterNextCharacter') {
        container = container.nextSibling;
        offset = 1;
      }

      if (start) {
        rng.setStart(container, offset);
      } else {
        rng.setEnd(container, offset);
      }
    };

    setRange(startContainer, startOffset, true);
    setRange(endContainer, endSelector ? endOffset : startOffset, false);
    editor.selection.setRng(rng);
  };

  var trimBrs = function (html) {
    return html.toLowerCase().replace(/<br[^>]*>|[\r\n]+/gi, '');
  };

  var equal = function (actual, expected, message) {
    Assertions.assertEq(message ? message : 'No message specified', expected, actual);
  };

  return {
    test: test,
    asyncTest: asyncTest,
    createSuite: createSuite,

    execCommand: execCommand,
    setSelection: setSelection,

    trimBrs: trimBrs,

    equal: equal,
    strictEqual: equal,
    deepEqual: equal
  };
});
