'use strict'

var expectedFrequencyCalls = function(playbackTime, seriesLength) {
	var out = []
	for (var i = 0; i <= seriesLength - 1; i++) {
		out.push([21])
	}
	return out
}


var BaseFakeDataWrapper = (function() {
	function BaseFakeDataWrapper() {}

	BaseFakeDataWrapper.prototype.numSeries = function() {
		return 1
	}

	BaseFakeDataWrapper.prototype.seriesNames = function() {
		return ['Test']
	}

	BaseFakeDataWrapper.prototype.seriesValue = function(series, index) {
		return 42
	}

	return BaseFakeDataWrapper
})()


var ShortFakeDataWrapper = (function() {
	function ShortFakeDataWrapper() {
		return BaseFakeDataWrapper.call(this, arguments)
	}

	ShortFakeDataWrapper.prototype = Object.create(BaseFakeDataWrapper.prototype)
	ShortFakeDataWrapper.prototype.constructor = ShortFakeDataWrapper

	ShortFakeDataWrapper.prototype.seriesLength = function(series) {
		return 4
	}

	return ShortFakeDataWrapper
})()


var LongFakeDataWrapper = (function() {
	function LongFakeDataWrapper() {
		return BaseFakeDataWrapper.call(this, arguments)
	}

	LongFakeDataWrapper.prototype = Object.create(BaseFakeDataWrapper.prototype)
	LongFakeDataWrapper.prototype.constructor = LongFakeDataWrapper

	LongFakeDataWrapper.prototype.seriesLength = function(series) {
		return 100
	}

	return LongFakeDataWrapper
})()


var FakeMapper = (function() {
	function FakeMapper() {}

	FakeMapper.prototype.map = function(datum) {
		return 21
	}

	return FakeMapper
})()


var FakeSounder = (function() {
	function FakeSounder() {}
	FakeSounder.prototype.frequency = function(frequency) {}
	FakeSounder.prototype.start = function() {}
	FakeSounder.prototype.stop = function() {}
	return FakeSounder
})()


var mixinDataWrapperCore = function(message, TestDataClass, testDuration, testCallCount, testInterval, useVisualCallback) {
	describe(message, function() {
		var fakeData = null
		var fakeMapper = null
		var fakeSounder = null
		var player = null
		var fakeVisualCallback = null  // may not be used

		beforeEach(function() {
			fakeData = new TestDataClass()
			fakeMapper = new FakeMapper()
			fakeSounder = new FakeSounder()
			if (useVisualCallback) {
				fakeVisualCallback = jasmine.createSpy('fakeVisualCallback')
				player = new window.Player(testDuration, fakeData, fakeMapper, fakeSounder, fakeVisualCallback)
			} else {
				player = new window.Player(testDuration, fakeData, fakeMapper, fakeSounder)
			}

			jasmine.clock().install()
		})

		afterEach(function() {
			jasmine.clock().uninstall()
		})

		it('works out for how long to sound each datum', function() {
			expect(player.interval).toBe(testInterval)
		})

		it('starts the sounder', function() {
			spyOn(fakeSounder, 'start')
			player.playPause()
			jasmine.clock().tick(testDuration)
			expect(fakeSounder.start.calls.count()).toBe(1)
		})

		it('stops the sounder', function() {
			spyOn(fakeSounder, 'stop')
			player.playPause()
			jasmine.clock().tick(testDuration)
			expect(fakeSounder.stop.calls.count()).toBe(1)
		})

		it('makes the correct number of map calls', function() {
			spyOn(fakeMapper, 'map')
			player.playPause()
			jasmine.clock().tick(testDuration)
			expect(fakeMapper.map.calls.count()).toBe(testCallCount)
		})

		it('makes the right number of calls to the sounder', function() {
			spyOn(fakeSounder, 'frequency')
			player.playPause()
			jasmine.clock().tick(testDuration)
			expect(fakeSounder.frequency.calls.count()).toBe(testCallCount)
		})

		it('calls the sounder with the correct arguments each time', function() {
			spyOn(fakeSounder, 'frequency')
			player.playPause()
			jasmine.clock().tick(testDuration)
			expect(fakeSounder.frequency.calls.allArgs()).toEqual(expectedFrequencyCalls(testDuration, testCallCount))
		})

		if (useVisualCallback) {
			it('makes the correct number of visual callback calls', function() {
				player.playPause()
				jasmine.clock().tick(testDuration)
				expect(fakeVisualCallback.calls.count()).toBe(testCallCount)
			})
		}

		it('knows it has never played', function() {
			expect(player._state).toBe('ready')
		})

		it('knows when it is playing', function() {
			player.playPause()
			jasmine.clock().tick(testDuration / 2)
			expect(player._state).toBe('playing')
		})

		it('knows when it has finished playing', function() {
			player.playPause()
			jasmine.clock().tick(testDuration)
			expect(player._state).toBe('finished')
		})

		it('[TODO] clears its interval timer when paused', function() {
			// TODO this seems to trigger a Jasmine bug
			// spyOn(window, 'clearInterval').and.callThrough()
			player.playPause()
			jasmine.clock().tick(testDuration / 2)
			expect(player.intervalID).toBeDefined()
			player.playPause()
			jasmine.clock().tick(testDuration / 4)
			// expect(clearInterval).toHaveBeenCalled()
		})

		it('knows when it is paused', function() {
			player.playPause()
			jasmine.clock().tick(testDuration / 2)
			player.playPause()
			expect(player._state).toBe('paused')
		})

		it('continues playing after a pause', function() {
			spyOn(player, '_play').and.callThrough()
			spyOn(player, '_startPlaying').and.callThrough()
			spyOn(player, '_pause').and.callThrough()
			player.playPause()
			jasmine.clock().tick(testDuration / 2)
			player.playPause()
			jasmine.clock().tick(testDuration / 4)
			player.playPause()
			expect(player._play).toHaveBeenCalledTimes(1)
			expect(player._startPlaying).toHaveBeenCalledTimes(2)
			expect(player._pause).toHaveBeenCalledTimes(1)
		})

		it('complains if the state is invalid', function() {
			player._state = 'moo'
			expect(function() {
				player.playPause()
			}).toThrow()
		})

		it('steps backward when requested', function() {
			player.playPause()
			jasmine.clock().tick(testDuration * 0.9)
			var index1 = player.playIndex
			player.stepBackward(2)
			var index2 = player.playIndex
			expect(index2).toBe(index1 - 2)
		})

		it('updates the sound (and visual cursor) when stepped backward whilst paused', function() {
			spyOn(player, '_playCore').and.callThrough()
			player.playPause()
			jasmine.clock().tick(testDuration / 10)
			player.playPause()
			var numberOfTimesPlayCoreCalled = player._playCore.calls.count()
			player.stepBackward()
			var steppedNumberOfTimesPlayCoreCalled = player._playCore.calls.count()
			expect(steppedNumberOfTimesPlayCoreCalled).toBe(
				numberOfTimesPlayCoreCalled + 1)
		})

		it('steps forward when requested', function() {
			player.playPause()
			var index1 = player.playIndex
			player.stepForward(2)
			var index2 = player.playIndex
			expect(index2).toBe(index1 + 2)
		})

		it('updates the sound (and visual cursor) when stepped forward whilst paused', function() {
			spyOn(player, '_playCore').and.callThrough()
			player.playPause()
			jasmine.clock().tick(testDuration / 10)
			player.playPause()
			var numberOfTimesPlayCoreCalled = player._playCore.calls.count()
			player.stepForward()
			var steppedNumberOfTimesPlayCoreCalled = player._playCore.calls.count()
			expect(steppedNumberOfTimesPlayCoreCalled).toBe(
				numberOfTimesPlayCoreCalled + 1)
		})
	})
}


var mixinDataWrapper = function(message, TestDataClass, testDuration, testCallCount, testInterval) {
	describe(message, function() {
		mixinDataWrapperCore('when not having a callback', TestDataClass, testDuration, testCallCount, testInterval, false)
		mixinDataWrapperCore('when having a callback', TestDataClass, testDuration, testCallCount, testInterval, true)
	})
}


describe('Player', function() {
	mixinDataWrapper('instantiated with short fake data source for 5000ms', ShortFakeDataWrapper, 5000, 4, 1250)
	mixinDataWrapper('instantiated with short fake data source for 3000ms', ShortFakeDataWrapper, 3000, 4, 750)
	mixinDataWrapper('instantiated with long fake data source for 5000ms', LongFakeDataWrapper, 5000, 100, 50)
	mixinDataWrapper('instantiated with long fake data source for 2500ms', LongFakeDataWrapper, 2500, 100, 25)
})
