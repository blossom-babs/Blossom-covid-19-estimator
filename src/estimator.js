const covid19ImpactEstimator = (data) => {
  const calculateTimeElapsed = (periodType, timeToElapse) => {
    if (periodType === 'days') {
      return timeToElapse;
    }
    if (periodType === 'weeks') {
      return timeToElapse * 7;
    }
    if (periodType === 'months') {
      return timeToElapse * 30;
    }
    return null;
  };
  const timeElapsed = calculateTimeElapsed(data.periodType, data.timeToElapse);

  const factor = Math.trunc(timeElapsed / 3);
  const income = (data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD);
  const currentlyInfected = data.reportedCases * 10;

  const infectionsByRequestedTime = currentlyInfected * (2 ** factor);
  const severeCasesByRequestedTime = Math.trunc(0.15 * infectionsByRequestedTime);
  const availableBeds = 0.35 * data.totalHospitalBeds;

  const impact = {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime: Math.trunc(availableBeds - severeCasesByRequestedTime),
    casesForICUByRequestedTime: Math.trunc(0.05 * infectionsByRequestedTime),
    casesForVentilatorsByRequestedTime: Math.trunc(0.02 * infectionsByRequestedTime),
    dollarsInFight: Math.trunc((infectionsByRequestedTime * income) / timeElapsed)
  };

  const siCurrentlyInfected = data.reportedCases * 50;
  const siInfectionsByRequestedTime = siCurrentlyInfected * (2 ** (factor));
  const siSevereCasesByRequestedTime = Math.trunc(0.15 * siInfectionsByRequestedTime);

  const severeImpact = {
    currentlyInfected: siCurrentlyInfected,
    infectionsByRequestedTime: siInfectionsByRequestedTime,
    severeCasesByRequestedTime: siSevereCasesByRequestedTime,
    hospitalBedsByRequestedTime: Math.trunc(availableBeds - siSevereCasesByRequestedTime),
    casesForICUByRequestedTime: Math.trunc(0.05 * siInfectionsByRequestedTime),
    casesForVentilatorsByRequestedTime: Math.trunc(0.02 * siInfectionsByRequestedTime),
    dollarsInFight: Math.trunc((siInfectionsByRequestedTime * income) / timeElapsed)
  };

  return {
    impact,
    severeImpact
  };
};

// Production
export default covid19ImpactEstimator;

// Development Environment Only
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

JSON.stringify(covid19ImpactEstimator(data), null, 2);
