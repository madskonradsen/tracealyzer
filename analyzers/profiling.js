function dumpTree(tree, time) {
  const result = {};
  tree.children.forEach((value, key) => { result[key] = value[time] });
  return result;
}

function analyzeUserFunctions(model) {
  const userFnSignature = /f:(\w+)@/

  const functions = dumpTree(model.bottomUp(), 'selfTime');

  return Object.keys(functions)
    .filter(fnName => fnName.match(userFnSignature))
    .reduce((obj, key) => {
      obj[key] = functions[key];
      return obj;
    }, {});
}

const analyzeProfiling = model => ({
  categories: dumpTree(model.bottomUpGroupBy('Category'), 'totalTime'),
  events: dumpTree(model.bottomUpGroupBy('EventName'), 'totalTime'),
  functions: dumpTree(model.bottomUp(), 'selfTime'),
  userFunctions: analyzeUserFunctions(model)
});

module.exports = analyzeProfiling;
