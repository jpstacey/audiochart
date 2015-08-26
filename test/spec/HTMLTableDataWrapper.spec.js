(function() {
  var HTML_FILE_NAME, ac, document, dw, fs, headless, html_string, jsdom, run_tests;

  if (typeof exports !== "undefined" && exports !== null) {
    ac = require('../audiochart');
    dw = require('./DataWrappers-common.spec');
    fs = require('fs');
    jsdom = require('jsdom').jsdom;
    headless = true;
  } else {
    ac = window;
    dw = window;
    headless = false;
  }

  HTML_FILE_NAME = 'HTMLTableDataWrapper.fixtures.html';

  run_tests = function(doc) {
    dw.data_wrappers_test_core('HTMLTableDataWrapper', new ac.HTMLTableDataWrapper(doc.getElementById('test_one')), new ac.HTMLTableDataWrapper(doc.getElementById('test_neg')));
    return describe('HTMLTableDataWrapper error-checking', function() {
      return it('Throws when a null table is given', function() {
        return expect(function() {
          return new ac.HTMLTableDataWrapper(doc.getElementById('moo'));
        }).toThrow();
      });
    });
  };

  if (headless) {
    html_string = fs.readFileSync(__dirname + '/' + HTML_FILE_NAME);
    document = jsdom(html_string);
    run_tests(document);
  } else {
    loadFixtures('spec/' + HTML_FILE_NAME);
    run_tests(window.document);
  }

}).call(this);
