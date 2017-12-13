[![Build Status](https://travis-ci.org/madskonradsen/tracealyzer.svg?branch=master)](https://travis-ci.org/madskonradsen/tracealyzer)

# Tracealyzer

Tracealyzer is a Chrome trace analyzer and receives trace-files from fx. Chrome Puppeter and returns relevant metrics that for example can be send to Graphite/Elasticsearch or used in a CI E2E testing setup to verify whether or not parts of your webapps has regressed.

## Example output
```
{
    "profiling": {
        "categories": {
            "scripting": 2477.3910000920296,
            "rendering": 440.5760000050068,
            "loading": 261.3550000190735,
            "painting": 83.19600003957748
        },
        "events": {
            "JS Frame": 2014.1029999256134,
            "Recalculate Style": 308.1180000901222,
            "Compile Script": 223.743999928236,
            "Parse HTML": 206.10900002717972,
            "DOM GC": 113.408999979496,
            "Minor GC": 88.0469999909401,
            "Layout": 64.36799997091293,
            "Parse Stylesheet": 55.24599999189377,
            "Update Layer Tree": 53.366999953985214,
            "Paint": 46.88600006699562,
            "Composite Layers": 36.30999997258186,
            "Evaluate Script": 20.951000213623047,
            "Hit Test": 14.72299998998642,
            "Major GC": 9.86200001835823,
            "Run Microtasks": 7.10699999332428,
            "XHR Ready State Change": 0.13700002431869507,
            "XHR Load": 0.03100001811981201
        },
        "functions": {
            "f:send@0": 781.0239999890327,
            "UpdateLayoutTree": 308.1180000901222,
            "v8.compile": 223.743999928236,
            "ParseHTML": 206.10900002717972,
            "f:addSelectors@497": 126.76800009608269,
            "MinorGC": 88.0469999909401,
            "f:insertRule@0": 87.70299994945526,
            "ThreadState::completeSweep": 82.5949999988079,
            "Layout": 64.36799997091293,
            "ParseAuthorStyleSheet": 55.24599999189377,
            "UpdateLayerTree": 53.366999953985214,
            "Paint": 46.88600006699562,
            "f:@479": 37.90599998831749,
            "CompositeLayers": 36.30999997258186,
            "f:GetGlobal@0": 29.496999949216843,
            "f:@499": 27.094000041484833,
            "BlinkGCMarking": 26.229999989271164,
            "f:exec@0": 25.107000023126602,
            "f:@503": 23.692999929189682,
            "f:@536": 23.41399994492531,
            "EvaluateScript": 20.951000213623047,
            "f:Apply@0": 20.906999975442886,
            "f:join@6": 19.371999979019165
        },
        "userFunctions": {
            "f:send@0": 781.0239999890327,
            "f:addSelectors@497": 126.76800009608269,
            "f:insertRule@0": 87.70299994945526,
            "f:GetGlobal@0": 29.496999949216843,
            "f:exec@0": 25.107000023126602,
            "f:Apply@0": 20.906999975442886,
            "f:join@6": 19.371999979019165,
            "f:dispatchOnMessage@487": 15.487000048160553,
            "f:generate@479": 11.16499999165535,
            "f:appendChild@0": 10.810000032186508,
            "f:Z@540": 10.56799989938736,
            "f:getItem@0": 8.602999985218048,
            "f:s@517": 8.28099998831749,
            "f:Ug@521": 8.250999987125397,
            "f:P_@536": 7.683999985456467,
            "f:each@503": 7.172000020742416

        }
    },
    "rendering": {
        "firstPaint": 0.031781,
        "forcedReflowEvents": 82,
        "fps": {
            "mean": 8.94,
            "variance": 1599518.62,
            "sd": 1264.72,
            "lo": 2,
            "hi": 9345.79
        }
    }
}
```

## Example usage using Chrome puppeteer
```
const puppeteer = require('puppeteer');
const tracealyzer = require('tracealyzer');

const TRACE_FILE = 'test/data/trace.json';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.tracing.start({path: TRACE_FILE});
  await page.goto('https://www.wired.com');
  await page.tracing.stop();

  await browser.close();
  
  const metrics = tracealyzer(TRACE_FILE);
  
  // do something with fx. metrics.rendering.fps.mean
})();
```

### Credits

This project is heavily inspired (and some of the code is even copied verbatim) by ngryman/speedracer.
