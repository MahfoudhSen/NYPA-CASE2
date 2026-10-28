'use client';

import { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Building2, Calculator, Target, TrendingUp } from 'lucide-react';
import {
  generateBuildingData,
  calculateAverageEnergyPerSqFt,
  predictEnergyConsumption,
  calculateAccuracy,
  splitData,
  type Building,
} from '@/lib/building-energy-data';

export default function BuildingEnergyPredictor() {
  const [selectedBuildingType, setSelectedBuildingType] = useState<Building['type'] | 'All'>('All');

  // Generate building data
  const allBuildings = useMemo(() => generateBuildingData(), []);

  // Split into training and test sets
  const { training, test } = useMemo(() => splitData(allBuildings, 0.3), [allBuildings]);

  // Calculate average energy per sq ft from training data
  const averageEnergyPerSqFt = useMemo(() => {
    return calculateAverageEnergyPerSqFt(
      training,
      selectedBuildingType === 'All' ? undefined : selectedBuildingType
    );
  }, [training, selectedBuildingType]);

  // Make predictions for test buildings
  const predictions = useMemo(() => {
    return test.map((building) => {
      const predicted = predictEnergyConsumption(building.squareFeet, averageEnergyPerSqFt);
      const accuracy = calculateAccuracy(predicted, building.annualEnergyConsumption);

      return {
        building,
        predicted,
        actual: building.annualEnergyConsumption,
        accuracy: accuracy.accuracy,
        error: accuracy.percentageError,
      };
    });
  }, [test, averageEnergyPerSqFt]);

  // Calculate overall accuracy
  const overallAccuracy = useMemo(() => {
    if (predictions.length === 0) return 0;
    const totalAccuracy = predictions.reduce((sum, p) => sum + p.accuracy, 0);
    return totalAccuracy / predictions.length;
  }, [predictions]);

  // Data for comparison chart
  const comparisonData = useMemo(() => {
    return predictions.map((p, idx) => ({
      name: p.building.name.split(' ')[0], // First word of name
      Predicted: Math.round(p.predicted),
      Actual: Math.round(p.actual),
    }));
  }, [predictions]);

  // Building types for filter
  const buildingTypes: Array<Building['type'] | 'All'> = [
    'All',
    'Office',
    'Residential',
    'Retail',
    'School',
    'Hospital',
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Building2 className="w-10 h-10 text-white" />
            Building Energy Prediction System
          </h1>
          <p className="text-gray-400 text-lg">
            Predict building energy consumption using historical data
          </p>
          <div className="mt-4 bg-white/10 border border-white/30 rounded-lg p-4">
            <p className="text-gray-300 text-sm">
              <strong>Student Project:</strong> Use historical building data to estimate energy consumption.
              Calculate average energy per square foot and predict new building consumption.
            </p>
          </div>
        </div>

        {/* Building Type Filter */}
        <div className="mb-6">
          <label className="text-gray-400 text-sm font-medium mb-2 block">
            Filter by Building Type:
          </label>
          <div className="flex flex-wrap gap-2">
            {buildingTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedBuildingType(type)}
                className={`px-4 py-2 rounded-lg transition-all border ${
                  selectedBuildingType === type
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-white border-white/30 hover:bg-white/10'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 border border-white/20 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-5 h-5 text-white" />
              <h3 className="text-gray-400 text-sm font-medium">Avg Energy/Sq Ft</h3>
            </div>
            <p className="text-3xl font-bold text-white">{averageEnergyPerSqFt.toFixed(2)}</p>
            <p className="text-gray-400 text-xs mt-1">kWh/sqft/year</p>
          </div>

          <div className="bg-white/5 border border-white/20 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-white" />
              <h3 className="text-gray-400 text-sm font-medium">Overall Accuracy</h3>
            </div>
            <p className="text-3xl font-bold text-white">{overallAccuracy.toFixed(1)}%</p>
            <p className="text-gray-400 text-xs mt-1">Average prediction accuracy</p>
          </div>

          <div className="bg-white/5 border border-white/20 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Training Buildings</h3>
            <p className="text-3xl font-bold text-white">{training.length}</p>
            <p className="text-gray-400 text-xs mt-1">Historical data</p>
          </div>

          <div className="bg-white/5 border border-white/20 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Test Buildings</h3>
            <p className="text-3xl font-bold text-white">{test.length}</p>
            <p className="text-gray-400 text-xs mt-1">Predictions made</p>
          </div>
        </div>

        {/* Prediction Method Explanation */}
        <div className="bg-white/5 border border-white/20 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-white" />
            How the Prediction Works
          </h2>
          <div className="space-y-3 text-gray-300">
            <p>
              <strong>Step 1:</strong> Calculate average energy consumption per square foot from{' '}
              {training.length} historical buildings
              {selectedBuildingType !== 'All' && ` (filtered to ${selectedBuildingType} only)`}.
            </p>
            <p>
              <strong>Step 2:</strong> For each test building, predict consumption using:
            </p>
            <div className="bg-black/50 border border-white/20 rounded-lg p-4 font-mono text-sm">
              Predicted Energy = Building Size (sq ft) × Average Energy/Sq Ft
            </div>
            <p>
              <strong>Step 3:</strong> Compare predictions with actual consumption to evaluate accuracy.
            </p>
          </div>
        </div>

        {/* Comparison Chart */}
        <div className="bg-white/5 border border-white/20 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Predicted vs Actual Energy Consumption</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis dataKey="name" stroke="#aaa" />
              <YAxis stroke="#aaa" label={{ value: 'kWh/year', angle: -90, position: 'insideLeft', fill: '#aaa' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#000', border: '1px solid #fff', borderRadius: '8px', color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="Predicted" fill="#666" />
              <Bar dataKey="Actual" fill="#fff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Predictions Table */}
        <div className="bg-white/5 border border-white/20 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Detailed Prediction Results</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Building</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Size (sq ft)</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Predicted (kWh)</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Actual (kWh)</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((pred, idx) => (
                  <tr key={idx} className="border-b border-white/10">
                    <td className="py-3 px-4">{pred.building.name}</td>
                    <td className="py-3 px-4">
                      <span className="bg-white/10 text-white px-2 py-1 rounded text-sm border border-white/20">
                        {pred.building.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">{pred.building.squareFeet.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-300 font-semibold">
                      {pred.predicted.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-3 px-4 text-white font-semibold">
                      {pred.actual.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          pred.accuracy >= 90
                            ? 'bg-white/20 text-white border border-white/30'
                            : pred.accuracy >= 80
                            ? 'bg-white/10 text-gray-300 border border-white/20'
                            : 'bg-white/5 text-gray-400 border border-white/10'
                        }`}
                      >
                        {pred.accuracy.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Training Data Reference */}
        <div className="bg-white/5 border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Training Data (Historical Buildings)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-2 px-3 text-gray-400 font-medium">ID</th>
                  <th className="text-left py-2 px-3 text-gray-400 font-medium">Building</th>
                  <th className="text-left py-2 px-3 text-gray-400 font-medium">Type</th>
                  <th className="text-left py-2 px-3 text-gray-400 font-medium">Size</th>
                  <th className="text-left py-2 px-3 text-gray-400 font-medium">Energy/Sq Ft</th>
                  <th className="text-left py-2 px-3 text-gray-400 font-medium">Total Energy</th>
                </tr>
              </thead>
              <tbody>
                {training.map((building) => (
                  <tr key={building.id} className="border-b border-white/10">
                    <td className="py-2 px-3 text-gray-400">{building.id}</td>
                    <td className="py-2 px-3">{building.name}</td>
                    <td className="py-2 px-3">
                      <span className="bg-white/10 text-gray-300 px-2 py-1 rounded text-xs border border-white/20">
                        {building.type}
                      </span>
                    </td>
                    <td className="py-2 px-3">{building.squareFeet.toLocaleString()} sq ft</td>
                    <td className="py-2 px-3">{building.energyPerSqFt.toFixed(2)} kWh/sqft</td>
                    <td className="py-2 px-3">
                      {building.annualEnergyConsumption.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}{' '}
                      kWh
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
