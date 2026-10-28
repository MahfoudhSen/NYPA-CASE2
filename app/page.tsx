'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { Lightbulb, TrendingUp, Calendar, BarChart3, PieChartIcon } from 'lucide-react';
import {
  generateSampleData,
  calculateEmissions,
  calculateCleanPercentage,
  type HourlyFuelMix,
} from '@/lib/nyiso-data-generator';

export default function UseCase2Page() {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [selectedView, setSelectedView] = useState<'energy' | 'emissions'>('energy');

  // Generate student-friendly data
  const fuelMixData = useMemo(() => generateSampleData(30), []);

  // Calculate aggregated data based on time range
  const aggregatedData = useMemo(() => {
    const hoursPer = selectedTimeRange === 'day' ? 24 : selectedTimeRange === 'week' ? 168 : 720;
    const latestData = fuelMixData.slice(-hoursPer);

    return latestData.map((record) => ({
      time: format(record.timestamp, selectedTimeRange === 'day' ? 'HH:mm' : 'MMM dd'),
      'Natural Gas': record.natural_gas,
      'Nuclear': record.nuclear,
      'Hydro': record.hydro,
      'Wind': record.wind,
      'Solar': record.solar,
      'Dual Fuel': record.dual_fuel,
      'Other Renewables': record.other_renewables,
      'Other Fossil': record.other_fossil_fuels,
      total: record.total,
      emissions: calculateEmissions(record) / 1000,
      cleanPercentage: calculateCleanPercentage(record),
    }));
  }, [fuelMixData, selectedTimeRange]);

  // Total energy by source
  const totalBySource = useMemo(() => {
    const totals = {
      natural_gas: 0,
      nuclear: 0,
      hydro: 0,
      wind: 0,
      solar: 0,
      dual_fuel: 0,
      other_renewables: 0,
      other_fossil_fuels: 0,
    };

    aggregatedData.forEach((record) => {
      totals.natural_gas += record['Natural Gas'];
      totals.nuclear += record['Nuclear'];
      totals.hydro += record['Hydro'];
      totals.wind += record['Wind'];
      totals.solar += record['Solar'];
      totals.dual_fuel += record['Dual Fuel'];
      totals.other_renewables += record['Other Renewables'];
      totals.other_fossil_fuels += record['Other Fossil'];
    });

    const total = Object.values(totals).reduce((sum, val) => sum + val, 0);

    return [
      { name: 'Natural Gas', value: totals.natural_gas, percentage: (totals.natural_gas / total) * 100, color: '#fbbf24', type: 'fossil' },
      { name: 'Nuclear', value: totals.nuclear, percentage: (totals.nuclear / total) * 100, color: '#8b5cf6', type: 'clean' },
      { name: 'Hydro', value: totals.hydro, percentage: (totals.hydro / total) * 100, color: '#3b82f6', type: 'clean' },
      { name: 'Wind', value: totals.wind, percentage: (totals.wind / total) * 100, color: '#10b981', type: 'clean' },
      { name: 'Solar', value: totals.solar, percentage: (totals.solar / total) * 100, color: '#f59e0b', type: 'clean' },
      { name: 'Dual Fuel', value: totals.dual_fuel, percentage: (totals.dual_fuel / total) * 100, color: '#ef4444', type: 'fossil' },
      { name: 'Other Renewables', value: totals.other_renewables, percentage: (totals.other_renewables / total) * 100, color: '#22c55e', type: 'clean' },
      { name: 'Other Fossil', value: totals.other_fossil_fuels, percentage: (totals.other_fossil_fuels / total) * 100, color: '#6b7280', type: 'fossil' },
    ].filter((item) => item.value > 0);
  }, [aggregatedData]);

  // Clean vs Fossil comparison
  const cleanVsFossil = useMemo(() => {
    const clean = totalBySource.filter(s => s.type === 'clean').reduce((sum, s) => sum + s.value, 0);
    const fossil = totalBySource.filter(s => s.type === 'fossil').reduce((sum, s) => sum + s.value, 0);
    const total = clean + fossil;

    return [
      { name: 'Clean Energy', value: clean, percentage: (clean / total) * 100, color: '#22c55e' },
      { name: 'Fossil Fuels', value: fossil, percentage: (fossil / total) * 100, color: '#ef4444' },
    ];
  }, [totalBySource]);

  // Key findings
  const findings = useMemo(() => {
    const avgClean = aggregatedData.reduce((sum, r) => sum + r.cleanPercentage, 0) / aggregatedData.length;
    const totalEmissions = aggregatedData.reduce((sum, r) => sum + r.emissions, 0);
    const topSource = totalBySource.reduce((max, source) => source.value > max.value ? source : max, totalBySource[0]);
    const cleanestHour = aggregatedData.reduce((max, r) => r.cleanPercentage > max.cleanPercentage ? r : max, aggregatedData[0]);

    return {
      avgClean: avgClean.toFixed(1),
      totalEmissions: totalEmissions.toFixed(0),
      topSource: topSource?.name || 'N/A',
      topSourcePct: topSource?.percentage.toFixed(1) || '0',
      cleanestTime: cleanestHour?.time || 'N/A',
      cleanestPct: cleanestHour?.cleanPercentage.toFixed(1) || '0',
    };
  }, [aggregatedData, totalBySource]);

  // Hourly pattern data (for radar chart)
  const hourlyPattern = useMemo(() => {
    const pattern = Array.from({ length: 24 }, (_, hour) => {
      const hourData = fuelMixData.filter(r => r.timestamp.getHours() === hour);
      if (hourData.length === 0) return { hour: `${hour}:00`, demand: 0, clean: 0, emissions: 0 };

      const avgDemand = hourData.reduce((sum, r) => sum + r.total, 0) / hourData.length;
      const avgClean = hourData.reduce((sum, r) => sum + calculateCleanPercentage(r), 0) / hourData.length;
      const avgEmissions = hourData.reduce((sum, r) => sum + calculateEmissions(r), 0) / hourData.length / 1000;

      return {
        hour: `${hour}:00`,
        demand: Math.round(avgDemand),
        clean: Math.round(avgClean),
        emissions: Math.round(avgEmissions),
      };
    });

    return pattern;
  }, [fuelMixData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Lightbulb className="w-10 h-10 text-yellow-400" />
            Energy Mix & Emissions Analyzer
          </h1>
          <p className="text-slate-300 text-lg">
            Interactive dashboard to explore New York's electricity generation and understand energy sources
          </p>
          <div className="mt-4 bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
            <p className="text-blue-200 text-sm">
              <strong>Student Project:</strong> Analyze electricity generation data to understand where NY's power comes from
              and how different energy sources impact emissions.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedTimeRange('day')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedTimeRange === 'day'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Last 24 Hours
            </button>
            <button
              onClick={() => setSelectedTimeRange('week')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedTimeRange === 'week'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Last Week
            </button>
            <button
              onClick={() => setSelectedTimeRange('month')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedTimeRange === 'month'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Last Month
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSelectedView('energy')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedView === 'energy'
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Energy View
            </button>
            <button
              onClick={() => setSelectedView('emissions')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedView === 'emissions'
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <PieChartIcon className="w-4 h-4 inline mr-2" />
              Emissions View
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Average Clean Energy</h3>
            <p className="text-3xl font-bold text-green-400">{findings.avgClean}%</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Total Emissions</h3>
            <p className="text-3xl font-bold text-red-400">{findings.totalEmissions}</p>
            <p className="text-slate-400 text-xs mt-1">Metric Tons CO2</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Top Energy Source</h3>
            <p className="text-2xl font-bold text-yellow-400">{findings.topSource}</p>
            <p className="text-slate-400 text-sm mt-1">{findings.topSourcePct}% of total</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Cleanest Period</h3>
            <p className="text-2xl font-bold text-green-400">{findings.cleanestPct}%</p>
            <p className="text-slate-400 text-sm mt-1">at {findings.cleanestTime}</p>
          </div>
        </div>

        {/* Main Visualization */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {selectedView === 'energy' ? 'Energy Generation Over Time' : 'Emissions Over Time'}
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            {selectedView === 'energy' ? (
              <BarChart data={aggregatedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" label={{ value: 'MW', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="Natural Gas" stackId="a" fill="#fbbf24" />
                <Bar dataKey="Nuclear" stackId="a" fill="#8b5cf6" />
                <Bar dataKey="Hydro" stackId="a" fill="#3b82f6" />
                <Bar dataKey="Wind" stackId="a" fill="#10b981" />
                <Bar dataKey="Solar" stackId="a" fill="#f59e0b" />
                <Bar dataKey="Dual Fuel" stackId="a" fill="#ef4444" />
                <Bar dataKey="Other Renewables" stackId="a" fill="#22c55e" />
              </BarChart>
            ) : (
              <LineChart data={aggregatedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" label={{ value: 'MT CO2', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="emissions" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="cleanPercentage" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Energy Source Distribution */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Energy Source Distribution</h2>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={totalBySource}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.percentage.toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {totalBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Clean vs Fossil */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Clean vs Fossil Fuel Comparison</h2>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={cleanVsFossil}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}\n${entry.percentage.toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {cleanVsFossil.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {cleanVsFossil.map((item) => (
                <div key={item.name} className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-slate-400 text-xs">{item.name}</p>
                  <p className="text-2xl font-bold" style={{ color: item.color }}>
                    {item.percentage.toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 24-Hour Pattern Analysis */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">24-Hour Demand & Clean Energy Pattern</h2>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={hourlyPattern}>
              <PolarGrid stroke="#475569" />
              <PolarAngleAxis dataKey="hour" stroke="#94a3b8" />
              <PolarRadiusAxis stroke="#94a3b8" />
              <Radar name="Demand (MW)" dataKey="demand" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              <Radar name="Clean %" dataKey="clean" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
              <Legend />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Key Findings Section */}
        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/50 rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            Key Findings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/50 rounded-lg p-4">
              <h3 className="font-semibold text-emerald-400 mb-2">Finding #1: Dominant Energy Source</h3>
              <p className="text-slate-300">
                <strong>{findings.topSource}</strong> is the largest contributor to NY's electricity, generating{' '}
                <strong>{findings.topSourcePct}%</strong> of total power. This shows our reliance on this energy source.
              </p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <h3 className="font-semibold text-emerald-400 mb-2">Finding #2: Clean Energy Performance</h3>
              <p className="text-slate-300">
                On average, <strong>{findings.avgClean}%</strong> of NY's electricity comes from clean sources
                (nuclear, hydro, wind, solar). This indicates {parseFloat(findings.avgClean) > 50 ? 'strong' : 'moderate'} progress
                toward decarbonization goals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
