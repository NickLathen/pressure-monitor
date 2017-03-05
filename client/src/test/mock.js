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
        value: Math.floor(120 + Math.random() * 40 - Math.random() * 30)
      });
      diastolicPoints.push({
        date: time,
        value: Math.floor(80 + Math.random() * 25 - Math.random() * 16)
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