const oneDay = 24 * 60 * 60 * 1000;

function fiveYearsAgo(now) {
  const fiveYears = 5 * 365 * oneDay;
  return now - fiveYears;
}


export default {
  generatePressures: function() {
    let systolicPoints = [];
    let diastolicPoints = [];
    const now = Date.now();
    const then = fiveYearsAgo(now);
    for (let time = then; time <= now; time = time + oneDay) {
      systolicPoints.push({
        date: time,
        value: Math.floor(120 + Math.random() * 10 - Math.random() * 10)
      });
      diastolicPoints.push({
        date: time,
        value: Math.floor(80 + Math.random() * 10 - Math.random() * 10)
      });
    }
    return [
      {
        color: 'blue',
        points: systolicPoints
      },
      {
        color: 'purple',
        points: diastolicPoints
      }
    ];
  }
};