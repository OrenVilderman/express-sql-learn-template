const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
  sort(tests) {
    const copyTests = Array.from(tests);
    copyTests.sort((testA, testB) => (testA.path > testB.path ? 1 : -1));
    copyTests.forEach(function(test,i){
      if(test.path.includes('~')){
        copyTests.splice(i, 1);
        copyTests.push(test);
      }
    });
    return copyTests;
  }
}

module.exports = CustomSequencer;