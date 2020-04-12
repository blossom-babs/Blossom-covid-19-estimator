const covid19ImpactEstimator = () => {
  const data = {
    reportedCases: 2747,
    periodType: 'days',
    timeToElapse: 38,
    totalHospitalBeds: 678874,
    avgDailyIncomeInUSD: 4,
    population: 92931687,
    avgDailyIncomePopulation: 0.73
  };

  const timeElapsed = Math.floor(data.timeToElapse / 3);
  const income = Math.floor(0.65 * (data.population / data.avgDailyIncomePopulation));

  const currentlyInfected = data.reportedCases * 10;
  const infectionsByRequestedTime = currentlyInfected * (2 ** timeElapsed);
  const severeCasesByRequestedTime = 0.15 * infectionsByRequestedTime;

  const impact = {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime: data.totalHospitalBeds - severeCasesByRequestedTime,
    casesForICUByRequestedTime: 0.05 * infectionsByRequestedTime,
    casesForVentilatorsByRequestedTime: Math.floor(0.02 * infectionsByRequestedTime),
    dollarsInFight: (infectionsByRequestedTime * income * data.avgDailyIncomeInUSD) / 30

  };

  const siCurrentlyInfected = data.reportedCases * 50;
  const siInfectionsByRequestedTime = siCurrentlyInfected * (2 ** timeElapsed);
  const siSevereCasesByRequestedTime = 0.15 * siInfectionsByRequestedTime;

  const severeImpact = {
    currentlyInfected: siCurrentlyInfected,
    infectionsByRequestedTime: siInfectionsByRequestedTime,
    severeCasesByRequestedTime: siSevereCasesByRequestedTime,
    hospitalBedsByRequestedTime: data.totalHospitalBeds - siSevereCasesByRequestedTime,
    casesForICUByRequestedTime: 0.05 * siInfectionsByRequestedTime,
    casesForVentilatorsByRequestedTime: 0.02 * siInfectionsByRequestedTime,
    dollarsInFight: (siInfectionsByRequestedTime * income * data.avgDailyIncomeInUSD) / 30
  };


  return {
    data: JSON.stringify(data),
    impact: JSON.stringify(impact),
    severeImpact: JSON.stringify(severeImpact)

  };
};

covid19ImpactEstimator();
export default covid19ImpactEstimator;
