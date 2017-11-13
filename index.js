
const fs = require('fs');
const DevtoolsTimelineModel = require('devtools-timeline-model');

const { sortEvents, cleanEvents } = require('./utils/trace')
const analyzeProfiling = require('./analyzers/profiling')
const analyzeRendering = require('./analyzers/rendering')

module.exports = function init(filename) {
  try {
    var trace = fs.readFileSync(filename, 'utf8');
  } catch(e) {
    console.error("Could not find file: " + filename);
    return;
  }

  if(trace) {
    
    var parsedTrace = JSON.parse(trace);
    
    var data = parsedTrace.traceEvents || parsedTrace;
    
    if(!data.length > 0) {
      console.error("No trace data found in file");
      return
    }
    
    var events = sortEvents(cleanEvents(data));

    var model = new DevtoolsTimelineModel(events);

    return {
      profiling: analyzeProfiling(model, events),
      rendering: analyzeRendering(model, events)
    }
    
  } else {
    console.error("Trace file has no content");
  }
}