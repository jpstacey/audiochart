// Generated by CoffeeScript 1.7.1
(function() {
  var BaseFakeDataWrapper, FakeMapper, FakeSounder, LongFakeDataWrapper, ShortFakeDataWrapper, ac, mixin_data_wrapper, mixin_data_wrapper_core,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (typeof exports !== "undefined" && exports !== null) {
    ac = require('../audiochart');
  } else {
    ac = window;
  }

  BaseFakeDataWrapper = (function() {
    function BaseFakeDataWrapper() {}

    BaseFakeDataWrapper.prototype.num_series = function() {
      return 1;
    };

    BaseFakeDataWrapper.prototype.series_names = function() {
      return ['Test'];
    };

    BaseFakeDataWrapper.prototype.series_value = function(series, index) {
      return this.fakedata[index];
    };

    return BaseFakeDataWrapper;

  })();

  ShortFakeDataWrapper = (function(_super) {
    __extends(ShortFakeDataWrapper, _super);

    function ShortFakeDataWrapper(data) {
      this.data = data;
      this.fakedata = [2, 3, 3, 4];
    }

    ShortFakeDataWrapper.prototype.series_length = function(series) {
      return 4;
    };

    return ShortFakeDataWrapper;

  })(BaseFakeDataWrapper);

  LongFakeDataWrapper = (function(_super) {
    __extends(LongFakeDataWrapper, _super);

    function LongFakeDataWrapper(data) {
      this.data = data;
      this.fakedata = [2, 3, 3, 4];
    }

    LongFakeDataWrapper.prototype.series_length = function(series) {
      return 100;
    };

    return LongFakeDataWrapper;

  })(BaseFakeDataWrapper);

  FakeMapper = (function() {
    function FakeMapper() {}

    FakeMapper.prototype.map = function() {};

    return FakeMapper;

  })();

  FakeSounder = (function() {
    function FakeSounder() {}

    FakeSounder.prototype.frequency = function(frequency, offset) {};

    FakeSounder.prototype.start = function() {};

    FakeSounder.prototype.stop = function() {};

    return FakeSounder;

  })();

  mixin_data_wrapper_core = function(msg, test_data_class, use_callback, test_interval, test_call_count) {
    return describe(msg, function() {
      var fake_callback, fake_mapper, fake_sounder, player;
      fake_mapper = null;
      fake_sounder = null;
      if (use_callback) {
        fake_callback = null;
      }
      player = null;
      beforeEach(function() {
        fake_mapper = new FakeMapper;
        fake_sounder = new FakeSounder;
        if (use_callback) {
          fake_callback = jasmine.createSpy('fake_callback');
          return player = new ac.Player(new test_data_class, fake_mapper, fake_sounder, fake_callback);
        } else {
          return player = new ac.Player(new test_data_class, fake_mapper, fake_sounder);
        }
      });
      it('works out for how long to sound each datum', function() {
        return expect(player.interval).toBe(test_interval);
      });
      return it('makes calls appropriate to play the sound', function() {
        jasmine.Clock.useMock();
        spyOn(fake_mapper, 'map');
        spyOn(fake_sounder, 'start');
        spyOn(fake_sounder, 'frequency');
        spyOn(fake_sounder, 'stop');
        player.play();
        jasmine.Clock.tick(5000);
        expect(fake_mapper.map.callCount).toBe(test_call_count);
        expect(fake_sounder.start).toHaveBeenCalled();
        expect(fake_sounder.frequency.callCount).toBe(test_call_count);
        expect(fake_sounder.stop).toHaveBeenCalled();
        if (use_callback) {
          return expect(fake_callback.callCount).toBe(test_call_count);
        }
      });
    });
  };

  mixin_data_wrapper = function(msg, test_data_class, test_interval, test_call_count) {
    return describe(msg, function() {
      mixin_data_wrapper_core('when not having a callback', test_data_class, false, test_interval, test_call_count);
      return mixin_data_wrapper_core('when having a callback', test_data_class, true, test_interval, test_call_count);
    });
  };

  describe('Player', function() {
    mixin_data_wrapper('instantiated with short fake data source', ShortFakeDataWrapper, 1250, 4);
    return mixin_data_wrapper('instantiated with long fake data source', LongFakeDataWrapper, 50, 100);
  });

}).call(this);
