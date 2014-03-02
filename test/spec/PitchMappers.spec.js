// Generated by CoffeeScript 1.7.1
(function() {
  var ac, mixin_min_max;

  if (typeof exports !== "undefined" && exports !== null) {
    ac = require('../audiochart');
  } else {
    ac = window;
  }

  mixin_min_max = function(klass, min, max) {
    return describe('Minimum and Maximum data', function() {
      var obj;
      obj = null;
      beforeEach(function() {
        return obj = new klass(min, max);
      });
      it('stores a minimum data value [not intended for public use]', function() {
        return (expect(obj.minimum_datum)).toBe(min);
      });
      it('stores a maximum data value [not intended for public use]', function() {
        return (expect(obj.maximum_datum)).toBe(max);
      });
      return it('will not allow min datum > max datum', function() {
        return expect(function() {
          return new klass(max, min);
        }).toThrow();
      });
    });
  };

  describe('PitchMapper', function() {
    var MAX, MIN;
    MIN = -4;
    MAX = 2;
    return mixin_min_max(ac.PitchMapper, MIN, MAX);
  });

  describe('FrequencyPitchMapper', function() {
    var MAX, MIN;
    MIN = 0;
    MAX = 42;
    mixin_min_max(ac.FrequencyPitchMapper, MIN, MAX);
    it('will not allow min frequency > max frequency', function() {
      return expect(function() {
        return new ac.FrequencyPitchMapper(0, 42, MAX, MIN);
      }).toThrow();
    });
    describe('maps from input data to a frequency', function() {
      it('test range 1', function() {
        var fm;
        fm = new ac.FrequencyPitchMapper(0, 42, 100, 1000);
        (expect(fm.map(0))).toBe(100);
        (expect(fm.map(42))).toBe(1000);
        return (expect(fm.map(21))).toBe(550);
      });
      it('test range 2', function() {
        var fm;
        fm = new ac.FrequencyPitchMapper(0, 100, 0, 100);
        (expect(fm.map(0))).toBe(0);
        (expect(fm.map(21))).toBe(21);
        (expect(fm.map(42))).toBe(42);
        (expect(fm.map(50))).toBe(50);
        (expect(fm.map(70))).toBe(70);
        return (expect(fm.map(100))).toBe(100);
      });
      it('test range 3', function() {
        var fm;
        fm = new ac.FrequencyPitchMapper(0, 100, 1, 101);
        (expect(fm.map(0))).toBe(1);
        (expect(fm.map(21))).toBe(22);
        (expect(fm.map(42))).toBe(43);
        (expect(fm.map(50))).toBe(51);
        (expect(fm.map(70))).toBe(71);
        return (expect(fm.map(100))).toBe(101);
      });
      it('test range 4', function() {
        var fm;
        fm = new ac.FrequencyPitchMapper(-100, 0, 0, 100);
        (expect(fm.map(-100))).toBe(0);
        (expect(fm.map(-70))).toBe(30);
        (expect(fm.map(-50))).toBe(50);
        (expect(fm.map(-20))).toBe(80);
        return (expect(fm.map(0))).toBe(100);
      });
      return it('test range 5', function() {
        var fm;
        fm = new ac.FrequencyPitchMapper(-100, 100, 0, 100);
        (expect(fm.map(-100))).toBe(0);
        (expect(fm.map(-50))).toBe(25);
        (expect(fm.map(0))).toBe(50);
        (expect(fm.map(50))).toBe(75);
        return (expect(fm.map(100))).toBe(100);
      });
    });
    return it('can cope when the data are totally flat', function() {
      var fm;
      fm = new ac.FrequencyPitchMapper(42, 42, 0, 100);
      return (expect(fm.map(42))).toBe(50);
    });
  });

  describe('NotePitchMapper', function() {
    var MAX, MIN;
    MIN = 0;
    MAX = 42;
    return mixin_min_max(ac.NotePitchMapper, MIN, MAX);
  });

}).call(this);
