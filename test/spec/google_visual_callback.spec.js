(function() {
  var FakeChart, ac;

  if (typeof exports !== "undefined" && exports !== null) {
    ac = require('../audiochart');
  } else {
    ac = window;
  }

  FakeChart = (function() {
    function FakeChart() {}

    FakeChart.prototype.setSelection = function(selection) {};

    return FakeChart;

  })();

  describe('google_visual_callback', function() {
    var fake_chart, google_visual_callback;
    fake_chart = null;
    google_visual_callback = null;
    beforeEach(function() {
      fake_chart = new FakeChart;
      google_visual_callback = ac._google_visual_callback_maker(fake_chart);
      return spyOn(fake_chart, 'setSelection');
    });
    it('correctly munges its parameters (1a)', function() {
      google_visual_callback(0, 0);
      return expect(fake_chart.setSelection).toHaveBeenCalledWith([
        {
          'row': 0,
          'column': 1
        }
      ]);
    });
    it('correctly munges its parameters (1b)', function() {
      google_visual_callback(0, 1);
      return expect(fake_chart.setSelection).toHaveBeenCalledWith([
        {
          'row': 1,
          'column': 1
        }
      ]);
    });
    it('correctly munges its parameters (1c)', function() {
      google_visual_callback(0, 2);
      return expect(fake_chart.setSelection).toHaveBeenCalledWith([
        {
          'row': 2,
          'column': 1
        }
      ]);
    });
    return it('correctly munges its parameters (2)', function() {
      google_visual_callback(1, 0);
      return expect(fake_chart.setSelection).toHaveBeenCalledWith([
        {
          'row': 0,
          'column': 2
        }
      ]);
    });
  });

}).call(this);
