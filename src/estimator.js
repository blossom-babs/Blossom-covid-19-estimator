const covid19ImpactEstimator = (data) => {
  const input = data;

  const timeElapsed = (periodType, timeToElapse) => {
    if (periodType === 'days') {
      return Math.trunc(timeToElapse / 3);
    }
    if (periodType === 'weeks') {
      return Math.trunc((timeToElapse * 7) / 3);
    }
    if (periodType === 'months') {
      return Math.trunc((timeToElapse * 30) / 3);
    }
    return null;
  };


  const income = Math.trunc(0.65 * (data.population / data.avgDailyIncomePopulation));
  const currentlyInfected = data.reportedCases * 10;

  const infectionsByRequestedTime = currentlyInfected * (2 ** (timeElapsed('days', 38)));
  const severeCasesByRequestedTime = 0.15 * infectionsByRequestedTime;
  const availableBeds = 0.35 * data.totalHospitalBeds;

  const estimate = [];

  const impact = {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime: data.totalHospitalBeds - severeCasesByRequestedTime,
    casesForICUByRequestedTime: Math.trunc(availableBeds * infectionsByRequestedTime),
    casesForVentilatorsByRequestedTime: Math.trunc(0.02 * infectionsByRequestedTime),
    dollarsInFight: (infectionsByRequestedTime * income * data.avgDailyIncomeInUSD) / 30

  };

  const siCurrentlyInfected = data.reportedCases * 50;
  const siInfectionsByRequestedTime = siCurrentlyInfected * (2 ** (timeElapsed('days', 38)));
  const siSevereCasesByRequestedTime = 0.15 * siInfectionsByRequestedTime;

  const severeImpact = {
    currentlyInfected: siCurrentlyInfected,
    infectionsByRequestedTime: siInfectionsByRequestedTime,
    severeCasesByRequestedTime: siSevereCasesByRequestedTime,
    hospitalBedsByRequestedTime: Math.trunc(availableBeds - siSevereCasesByRequestedTime),
    casesForICUByRequestedTime: 0.05 * siInfectionsByRequestedTime,
    casesForVentilatorsByRequestedTime: 0.02 * siInfectionsByRequestedTime,
    dollarsInFight: (siInfectionsByRequestedTime * income * data.avgDailyIncomeInUSD) / 30
  };

  estimate.push({ impact, severeImpact });

  return {
    data: JSON.stringify(input),
    impact: JSON.stringify(impact),
    severeImpact: JSON.stringify(severeImpact)

  };
};

const data = {
  region: {
    name: 'Africa',
    avgAge: 19.7,
    avgDailyIncomeInUSD: 4,
    avgDailyIncomePopulation: 0.73
  },
  periodType: 'days',
  timeToElapse: 38,
  reportedCases: 2747,
  population: 92931687,
  totalHospitalBeds: 678874
};

covid19ImpactEstimator(data);
export default covid19ImpactEstimator;
