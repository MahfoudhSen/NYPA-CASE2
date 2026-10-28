# NYISO Energy Mix & Emissions Analyzer

Interactive educational dashboard for exploring New York's electricity generation and understanding energy sources.

![Dashboard Preview](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8?logo=tailwindcss)

## Overview

**Student-friendly dashboard** designed to help learners understand:
- Where New York's electricity comes from
- How different energy sources impact emissions
- Patterns in energy demand and generation
- The relationship between clean/fossil fuel energy

## Features

### Interactive Visualizations
- **Energy Generation Chart** - Stacked bar chart showing all energy sources over time
- **Emissions Timeline** - Line graph tracking CO2 output
- **Fuel Mix Breakdown** - Pie chart of energy source distribution
- **Clean vs Fossil Comparison** - Visual split between renewable and fossil energy
- **24-Hour Pattern Analysis** - Radar chart showing demand cycles

### Time Range Selection
- Last 24 hours
- Last week
- Last month

### View Modes
- **Energy View** - Focus on power generation (MW)
- **Emissions View** - Focus on CO2 output (metric tons)

### Key Metrics Display
- Average clean energy percentage
- Total emissions
- Top energy source
- Cleanest time period

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Recharts** - Interactive charts and graphs
- **Tailwind CSS** - Modern styling
- **date-fns** - Date utilities
- **Lucide React** - Icons

## Getting Started

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to explore the dashboard.

### Production Build

```bash
npm run build
npm start
```

## How It Works

### Data Generation

The app simulates realistic NYISO (New York Independent System Operator) fuel mix data:

**Typical New York Energy Mix:**
- Nuclear: ~30% (always on, baseload power)
- Natural Gas: ~40% (flexible, responds to demand)
- Hydro: ~20% (varies by season, higher in spring)
- Wind/Solar/Renewables: ~10% (varies by time and weather)

### Daily Patterns
- **Peak hours**: 2-6 PM (highest demand)
- **Night hours**: Lower overall demand
- **Solar**: Only during daylight, peaks at noon
- **Wind**: Higher at night and in winter

### Seasonal Variations
- **Summer**: Higher AC demand
- **Winter**: Higher heating demand
- **Spring**: Maximum hydro generation

## Educational Value

### Learning Objectives

Students can:
1. **Analyze energy sources** - Compare renewable vs fossil fuels
2. **Understand emissions** - See how fuel mix affects CO2 output
3. **Identify patterns** - Discover daily and seasonal demand cycles
4. **Make connections** - Link energy choices to environmental impact

### Key Findings Section

Automated insights help students:
- Identify the dominant energy source
- Calculate clean energy percentage
- Evaluate progress toward decarbonization
- Understand real-world energy systems

## Visualizations Explained

### Stacked Bar Chart (Energy View)
Shows how different energy sources contribute to total generation at each time point.

### Line Chart (Emissions View)
Tracks CO2 emissions over time alongside clean energy percentage.

### Pie Charts
- **Energy Source Distribution**: Proportions of each fuel type
- **Clean vs Fossil**: Simple two-way comparison

### Radar Chart
Displays 24-hour patterns for demand and clean energy availability.

## Use Cases

- **Classroom projects** - Energy and environment education
- **Research assignments** - Data analysis practice
- **Science fairs** - Interactive demonstration
- **Policy exploration** - Understanding energy transitions
- **STEM learning** - Real-world data science

## Future Features

- [ ] Compare different states/regions
- [ ] Historical trend analysis
- [ ] Quiz mode for learning
- [ ] Custom scenario modeling
- [ ] Print-friendly reports
- [ ] Data export for projects

## Contributing

We welcome contributions! Ideas for improvements:
- Add more educational content
- Create guided tours
- Build quiz questions
- Improve visualizations
- Add accessibility features

## License

MIT

## Acknowledgments

- NYISO for data structure inspiration
- EPA for emission factor standards
- New York Power Authority (NYPA)
- PowerHack organizers

---

Built for PowerHack - Making energy data accessible to students everywhere!
