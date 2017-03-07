const oneDay = 24 * 60 * 60 * 1000;

function oneYearAgo(now) {
  const oneYear = 365 * oneDay;
  return now - oneYear;
}

const promiseAllSync = function promiseAllSync(promiseFunctionArray, index, resultArray) {
  index = index || 0;
  resultArray = resultArray || [];
  const currPromiseFunction = promiseFunctionArray[index];
  return currPromiseFunction()
  .then((result) => {
    resultArray.push(result);
    const nextIndex = index + 1;
    if (nextIndex === promiseFunctionArray.length) {
      return resultArray;
    } else {
      return promiseAllSync(promiseFunctionArray, nextIndex, resultArray);
    }
  });
};

module.exports = {
  generatePressures() {
    const pressures = [];
    const now = Date.now() - oneDay;
    const then = oneYearAgo(now);
    for (let time = then; time <= now; time = time + oneDay) {
      pressures.push({
        date: time,
        systolic: Math.floor(140 + Math.random() * 10 - Math.random() * 10),
        diastolic: Math.floor(80 + Math.random() * 10 - Math.random() * 10)
      });
    }
    return pressures;
  },
  promiseAllSync
};