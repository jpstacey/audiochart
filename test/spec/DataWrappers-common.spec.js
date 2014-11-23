(function() {
  var data_wrappers_test_core;

  data_wrappers_test_core = function(thing, wrapper1, wrapper2) {
    return describe("" + thing + " (via common interface)", function() {
      describe('when storing positive-valued data', function() {
        var data;
        data = null;
        beforeEach(function() {
          return data = wrapper1;
        });
        it('can get the number of series', function() {
          return expect(data.num_series()).toBe(1);
        });
        it('can get series names', function() {
          return expect(data.series_names()).toEqual(['Test']);
        });
        it('can get the min and max value of data in a series', function() {
          expect(data.series_min(0)).toBe(2);
          return expect(data.series_max(0)).toBe(4);
        });
        it('can get values of data in a series', function() {
          expect(data.series_value(0, 0)).toBe(2);
          expect(data.series_value(0, 1)).toBe(3);
          expect(data.series_value(0, 2)).toBe(3);
          return expect(data.series_value(0, 3)).toBe(4);
        });
        return it('gets the length of a series', function() {
          return expect(data.series_length(0)).toBe(4);
        });
      });
      return describe('when storing negative-valued data', function() {
        var data;
        data = null;
        beforeEach(function() {
          return data = wrapper2;
        });
        it('can get the number of series', function() {
          return expect(data.num_series()).toBe(1);
        });
        it('can get series names', function() {
          return expect(data.series_names()).toEqual(['Test']);
        });
        it('can get the min and max value of data in a series', function() {
          expect(data.series_min(0)).toBe(-90);
          return expect(data.series_max(0)).toBe(20);
        });
        it('can get values of data in a series', function() {
          expect(data.series_value(0, 0)).toBe(20);
          expect(data.series_value(0, 1)).toBe(-10);
          expect(data.series_value(0, 2)).toBe(0);
          expect(data.series_value(0, 3)).toBe(8);
          return expect(data.series_value(0, 4)).toBe(-90);
        });
        return it('gets the length of a series', function() {
          return expect(data.series_length(0)).toBe(5);
        });
      });
    });
  };

  if (typeof exports !== "undefined" && exports !== null) {
    exports.data_wrappers_test_core = data_wrappers_test_core;
  } else {
    this['data_wrappers_test_core'] = data_wrappers_test_core;
  }

}).call(this);