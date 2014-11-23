AudioChart
===========

Allows the user to explore charts on web pages using sound and the keyboard rather than, or in conjunction with, visually and with the mouse.  Thanks to [The Paciello Group](http://paciellogroup.com) for allowing me to share this with you.

AudioChart uses the Web Audio API, which has [increasing support amongst browsers](http://caniuse.com/audio-api), but is not yet supported by Internet Explorer.

Use Cases and Examples
-----------------------

What does it let your users do?

 * Play an auditory version of the data represented by a Google Chart, JSON fragment or HTML table.

What sort of charts/data does it work with?

 * Google Charts line and bar charts.
 * JSON (the format is detailed in the examples gallery).
 * HTML tables.

The [examples gallery](http://matatk.agrip.org.uk/audiochart/example-charts.html) covers using AudioChart with Google Charts, JSON and HTML tables.

"Hello, World" Tutorial (using Google Charts)
----------------------------------------------

You can check out the finished ["hello, world" HTML file](http://matatk.agrip.org.uk/audiochart/hello-world.html).

You can also use AudioChart with JSON and HTML tables (there are examples to demonstrate this), and other chart types may be supported in future.

### Google Charts Bits

More details on this can be found in the [Google Charts documentation](https://developers.google.com/chart/).

 1. Load Google Charts API.

	```html
	<script src="https://www.google.com/jsapi"></script>
	```

 2. Have an element in your document that will contain the chart.

	```html
	<div id="chart"></div>
	```

 3. Instantiate Google Charts API and hook it up to a function to draw the chart when the page has loaded.

	```javascript
	google.load('visualization', '1.0', {'packages':['corechart']});
	google.setOnLoadCallback(draw_chart);

	function draw_chart() {
		. . .
	}
	```

	The rest of the JavaScript code in this section goes inside `draw_chart()`.

 4. Create a Google Charts API `DataTable` and populate it with some data.

	```javascript
	var data = new google.visualization.DataTable();

	data.addColumn('string', 'Top Secret Evil Project');
	data.addColumn('number', 'Watermelons');
	data.addRows([
		['Alpha',   293],
		['Beta',    329],
		['Gamma',   261],
		['Delta',   130],
		['Epsilon', 196],
		['Zeta',    196],
	]);
	```

	Note that there are other ways to add data to `DataTable` objects; the [AudioChart examples](http://matatk.agrip.org.uk/audiochart/example-charts.html) include a sine wave, generated by code, and the [DataTable documentation](https://developers.google.com/chart/interactive/docs/reference#DataTable) gives other approaches.

 6. Prepare chart options and create a Google Charts API chart.

	```javascript
	var chart_options = {
		'title': 'Evil Project Efficacy',
		'width': 800,
		'height': 450,
		'curveType': 'function'
	};

	var chart = new google.visualization.LineChart(document.getElementById('chart'));
	chart.draw(data, chart_options);
	```

### AudioChart Bits

 1. Load AudioChart.

	```html
	<script src="https://raw.githubusercontent.com/matatk/audiochart/gh-pages/build/audiochart.min.js"></script>
	```

 2. Have an element in your document to trigger audio playback.

	```html
	<button id="play">Play</button>
	```

 3. Wire up the button, data table and chart to AudioChart.  The `chart` is passed in so that AudioChart can visually highlight the chart data points during playback (this is optional).

	```javascript
	document.getElementById('play').onclick = function() {
		new AudioChart({
			'type': 'google',      // (see the docs)
			'data': data,          // the GoogleDataTable
			'chart': chart,        // the Google Chart object
			'duration': 5000,      // milliseconds
			'frequency_low': 200,  // Hz
			'frequency_high': 600  // Hz
		});
	}
	```

#### Other Chart Types and Options

The [REFERENCE](REFERENCE.md) details all the options you can pass to AudioChart.

Components
-----------

The following objects are present in AudioChart ([JavaScript code](build/audiochart.js), [CoffeeScript code](audiochart.coffee)).

 * A `DataWrapper` interface wraps third-party chart library/other data sources.
    - `GoogleDataWrapper` wraps Google Charts `DataTable` objects.
	- `JSONDataWrapper` wraps JSON strings or parsed/compatible objects.
	- `HTMLTableWrapper`
 * A `PitchMapper` maps from data values to pitches.
    - `FrequencyPitchMapper` does basic interpolation.
    - `NotePitchMapper` does basic interpolation, then "rounds" this to the nearest musical note (not yet implemented).
 * The `WebAudioSounder` wraps the Web Audio API.
 * The `Player` brings together wrapped data source, mapper and sounder.
 * The `AudioChart` object provides the public-facing interface.

Development
------------

AudioChart is developed in [CoffeeScript](http://coffeescript.org), which is translated into JavaScript as part of the build process.  **You do not need to know CoffeeScript (or have it installed) to use AudioChart, as a built JavaScript version is present in this repository.**  A Makefile is provided to automate the translation and run tests.  [Unit tests can be run in-browser](http://matatk.agrip.org.uk/audiochart/test/) or directly on the code, printing output to the terminal, via jasmine-node.

Development is carried out in a [test-driven](http://en.wikipedia.org/wiki/Test-driven_development) manner.  The `pre-commit` hook can be used to ensure only code that passes tests is committed.  You can make a symlink from the `.git/hooks/` directory to it and it'll be run before you are asked for a commit message.

### Setting up for development

The build process uses [Grunt](http://gruntjs.com) (and therefore [node](https://github.com/joyent/node)).  The following tools/libraries will be installed automatically for you:

 * [CoffeeScript](https://github.com/jashkenas/coffee-script) for translating to JavaScript
 * [jasmine-node](https://github.com/mhevery/jasmine-node) for running the tests.
 * [jsdom](https://github.com/tmpvar/jsdom) for simulating a DOM environment.
 
**Note:** jsdom is apparently tricky to install on Windows, so you may want to skip it and just use the in-browser testing.  You can disable the use of jsdom by removing it from `package.json` and removing the `jasmine_node` task from the Gruntfile.

Development set-up steps for Mac users with [Homebrew](http://brew.sh):

 1. `brew install node` (comes with `npm`).
 2. `npm -g install grunt-cli` in order to be able to conveniently run the grunt command (this will not globally install any other tools/libraries).
 3. `git clone` or otherwise download this repository.
 4. `npm install` in the newly-cloned repository grabs all required tools and libraries and stores them in the local `node_modules` directory.
 5. `grunt` will run the tests using jasmine-node, convert the CoffeeScript code and tests to JavaScript and minify the JavaScript library.

Instructions for Windows are forthcomming (sorry for the wait).

### Hosting the AudioChart Site and Examples Locally

You can use [Jekyll](http://jekyllrb.com) to host the AudioChart site locally and run the in-browser tests.  You can just use `sudo gem install jekyll` on OS X, but this installs Jekyll on top of the system's Ruby; some prefer to install a more local Ruby e.g. via Homebrew, as follows.

 1. `brew install ruby` gives you a local ruby installation.  You may need to close your current terminal session before `/usr/local/bin/ruby` and `/usr/local/bin/gem` will supersede the system ones.
 2. `gem install jekyll` will grab jekyll (you will not need sudo if you're successfully using the Homebrew version).
 3. `jekyll serve --watch` to serve the site locally; the URL will be given in the terminal window.  Changes to files will be reflected when you reload a page in the browser.

Future Work Ideas
------------------

Patches for and feedback on the following are welcome!

 * Play speed/duration.
 * Support [D3.js](http://d3js.org) and SVG charts.
 * Static/Periodic features such as grid/timing beats.
 * Mouse hover "audition" mode.
 * Rendering a visual highlight element for chart APIs that don't provide this (i.e. JSON and HTML tables).
 * Multiple plots/data series per chart.
 * Instruments as different sound types.
 * Support for development on Windows.
 * Create a browser extension to enable AudioChart on charts/tables for sites that don't provide it themselves.
 * Allow modular builds to be created, with only support for data sources relevant to your site/application.