const { freqOf, minOf, maxOf, round, varOf, toSec } = require('../utils/stats');

function analyzeFirstPaint(events) {
  const firstPaint = events.find(e => e.name === 'firstPaint');
  if (!firstPaint) return null;

  const first = events.find(e => e.name === 'TracingStartedInPage');
  return toSec(firstPaint.ts - first.ts);
}

function extractFrames(events) {
  return events
    .filter(e => e.name.includes('DrawFrame'))
    .sort((a, b) => a.ts - b.ts)
    .map(e => toSec(e.ts))
    // Removing first and last frame as they might be messed up
    .slice(1, -1);
}

function analyzeFps(frames) {
  if (frames.length < 2) return null;

  var fpsPerFrames = frames.reduce((fpsPerFrames, f, i, frames) => {
    if (i > 0) {
      const fps = 1 / (f - frames[i - 1]);
      fpsPerFrames.push(fps);
    }
    return fpsPerFrames;
  }, []);
  
  // Compute min
  const lo = round(minOf(fpsPerFrames), 2);
  // Compute max
  const hi = round(maxOf(fpsPerFrames), 2);
  // Compute mean
  const mean = round(freqOf(frames), 2);
  // Compute variance
  const variance = round(varOf(fpsPerFrames, mean), 2);
  // Compute standard deviation
  const sd = round(Math.sqrt(variance), 2);

  return { mean, variance, sd, lo, hi };
}

function reflowEvents(events) {
  const forcedReflowEvents = events
        .filter( e => e.name == 'UpdateLayoutTree' || e.name == 'Layout')
        .filter( e => e.args && e.args.beginData && e.args.beginData.stackTrace && e.args.beginData.stackTrace.length);
  return forcedReflowEvents && forcedReflowEvents.length || 0;
}

const analyzeRendering = (model, events) => ({
  firstPaint: analyzeFirstPaint(events),
  forcedReflowEvents: reflowEvents(events),
  fps: analyzeFps(extractFrames(events))
})

module.exports = analyzeRendering;
