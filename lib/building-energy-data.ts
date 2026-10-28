/**
 * Building Energy Prediction Data Generator
 * Generates realistic NYC building energy consumption data
 */

export interface Building {
  id: string;
  name: string;
  type: 'Office' | 'Residential' | 'Retail' | 'School' | 'Hospital';
  squareFeet: number;
  floors: number;
  yearBuilt: number;
  annualEnergyConsumption: number; // kWh per year
  energyPerSqFt: number; // kWh per sq ft per year
}

/**
 * Generate realistic building energy data for NYC
 */
export function generateBuildingData(): Building[] {
  const buildings: Building[] = [
    // Office Buildings
    {
      id: 'B001',
      name: 'Madison Square Office Tower',
      type: 'Office',
      squareFeet: 250000,
      floors: 30,
      yearBuilt: 2010,
      annualEnergyConsumption: 0,
      energyPerSqFt: 0,
    },
    {
      id: 'B002',
      name: 'Financial District Center',
      type: 'Office',
      squareFeet: 180000,
      floors: 25,
      yearBuilt: 2015,
      annualEnergyConsumption: 0,
      energyPerSqFt: 0,
    },
    {
      id: 'B003',
      name: 'Brooklyn Tech Hub',
      type: 'Office',
      squareFeet: 120000,
      floors: 15,
      yearBuilt: 2018,
      annualEnergyConsumption: 0,
      energyPerSqFt: 0,
    },
    {
      id: 'B004',
      name: 'Midtown Corporate Plaza',
      type: 'Office',
      squareFeet: 300000,
      floors: 35,
      yearBuilt: 2008,
      annualEnergyConsumption: 0,
      energyPerSqFt: 0,
    },

    // Residential Buildings
    {
      id: 'B005',
      name: 'Upper West Residences',
      type: 'Residential',
      squareFeet: 150000,
      floors: 20,
      yearBuilt: 2012,
      annualEnergyConsumption: 0,
      energyPerSqFt: 0,
    },
    {
      id: 'B006',
      name: 'Queens Garden Apartments',
      type: 'Residential',
      squareFeet: 95000,
      floors: 12,
      yearBuilt: 2016,
      annualEnergyConsumption: 0,
      energyPerSqFt: 0,
    },
    {
      id: 'B007',
      name: 'Chelsea Towers',
      type: 'Residential',
      squareFeet: 200000,
      floors: 25,
      yearBuilt: 2019,
      annualEnergyConsumption: 0,
      energyPerSqFt: 0,
    },

    // Retail Buildings
    {
      id: 'B008',
      name: 'SoHo Shopping Center',
      type: 'Retail',
      squareFeet: 80000,
      floors: 4,
      yearBuilt: 2014,
      annualEnergyConsumption: 0,
      energyPerSqFt: 0,
    },
    {
      id: 'B009',
      name: 'Times Square Mall',
      type: 'Retail',
      squareFeet: 150000,
      floors: 6,
      yearBuilt: 2011,
      annualEnergyConsumption: 0,
      energyPerSqFt: 0,
    },

    // Schools
    {
      id: 'B010',
      name: 'Manhattan Science Academy',
      type: 'School',
      squareFeet: 100000,
      floors: 5,
      yearBuilt: 2013,
      annualEnergyConsumption: 0,
      energyPerSqFt: 0,
    },
    {
      id: 'B011',
      name: 'Bronx Technical Institute',
      type: 'School',
      squareFeet: 85000,
      floors: 4,
      yearBuilt: 2017,
      annualEnergyConsumption: 0,
      energyPerSqFt: 0,
    },

    // Hospitals
    {
      id: 'B012',
      name: 'Central Medical Center',
      type: 'Hospital',
      squareFeet: 220000,
      floors: 18,
      yearBuilt: 2009,
      annualEnergyConsumption: 0,
      energyPerSqFt: 0,
    },
    {
      id: 'B013',
      name: 'Brooklyn Health Campus',
      type: 'Hospital',
      squareFeet: 180000,
      floors: 15,
      yearBuilt: 2014,
      annualEnergyConsumption: 0,
      energyPerSqFt: 0,
    },
  ];

  // Typical energy consumption per sq ft per year (kWh/sqft/year) by building type
  const baseEnergyBySqFt: Record<Building['type'], number> = {
    Office: 17.5, // Office buildings use ~15-20 kWh/sqft/year
    Residential: 12.0, // Residential ~10-14 kWh/sqft/year
    Retail: 22.0, // Retail ~20-25 kWh/sqft/year (more lighting, HVAC)
    School: 15.0, // Schools ~13-17 kWh/sqft/year
    Hospital: 30.0, // Hospitals ~28-35 kWh/sqft/year (24/7 operation)
  };

  // Calculate energy consumption for each building
  buildings.forEach((building) => {
    const baseEnergy = baseEnergyBySqFt[building.type];

    // Add variation based on building age (older = less efficient)
    const age = 2024 - building.yearBuilt;
    const ageFactor = 1 + (age * 0.01); // 1% increase per year old

    // Add random variation (±10%)
    const randomFactor = 0.9 + Math.random() * 0.2;

    // Calculate energy per sq ft
    building.energyPerSqFt = baseEnergy * ageFactor * randomFactor;

    // Calculate total annual consumption
    building.annualEnergyConsumption = building.squareFeet * building.energyPerSqFt;
  });

  return buildings;
}

/**
 * Calculate average energy per square foot from historical buildings
 */
export function calculateAverageEnergyPerSqFt(
  buildings: Building[],
  buildingType?: Building['type']
): number {
  const filteredBuildings = buildingType
    ? buildings.filter((b) => b.type === buildingType)
    : buildings;

  if (filteredBuildings.length === 0) return 0;

  const totalEnergyPerSqFt = filteredBuildings.reduce(
    (sum, b) => sum + b.energyPerSqFt,
    0
  );

  return totalEnergyPerSqFt / filteredBuildings.length;
}

/**
 * Predict energy consumption for a building
 */
export function predictEnergyConsumption(
  squareFeet: number,
  averageEnergyPerSqFt: number
): number {
  return squareFeet * averageEnergyPerSqFt;
}

/**
 * Calculate prediction accuracy
 */
export function calculateAccuracy(predicted: number, actual: number): {
  absoluteError: number;
  percentageError: number;
  accuracy: number;
} {
  const absoluteError = Math.abs(predicted - actual);
  const percentageError = (absoluteError / actual) * 100;
  const accuracy = 100 - percentageError;

  return {
    absoluteError,
    percentageError,
    accuracy,
  };
}

/**
 * Split buildings into training and test sets
 */
export function splitData(
  buildings: Building[],
  testPercentage: number = 0.3
): { training: Building[]; test: Building[] } {
  const shuffled = [...buildings].sort(() => Math.random() - 0.5);
  const testSize = Math.floor(buildings.length * testPercentage);

  return {
    training: shuffled.slice(testSize),
    test: shuffled.slice(0, testSize),
  };
}
