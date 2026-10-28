# Building Energy Prediction System

Student-friendly dashboard for predicting building energy consumption using historical data.

![Dashboard Preview](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8?logo=tailwindcss)

## Overview

**Educational project** where students learn to predict energy consumption by:
- Using historical building data
- Calculating average energy per square foot
- Making predictions for new buildings
- Comparing predicted vs actual consumption

### Main Question

**Can we use information from existing buildings to estimate how much energy another building might consume?**

## Features

### Simple Prediction Method
- Calculate average energy usage per square foot from historical building records
- Use this average to estimate another building's consumption
- Compare the estimate with actual usage

### Interactive Dashboard
- **Building Type Filter** - Filter predictions by Office, Residential, Retail, School, or Hospital
- **Key Metrics Display** - Average energy/sqft, overall accuracy, training/test split
- **Prediction Explanation** - Step-by-step breakdown of the prediction method
- **Comparison Chart** - Visual comparison of predicted vs actual consumption
- **Detailed Results Table** - Individual building predictions with accuracy scores
- **Training Data Table** - View all historical buildings used for calculations

### Educational Value

Students learn:
1. **Data-driven prediction** - Using historical patterns to forecast future values
2. **Statistical concepts** - Averages, accuracy metrics, train/test splits
3. **Real-world application** - Building energy efficiency and sustainability
4. **Critical thinking** - Evaluating prediction accuracy and limitations

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Recharts** - Interactive data visualizations
- **Tailwind CSS** - Modern styling
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

### Prediction Method

**Step 1:** Calculate average energy per square foot
```
Average Energy/Sq Ft = Total Energy from All Buildings / Total Square Feet
```

**Step 2:** Predict new building consumption
```
Predicted Energy = Building Size (sq ft) × Average Energy/Sq Ft
```

**Step 3:** Evaluate accuracy
```
Accuracy = 100 - (|Predicted - Actual| / Actual × 100)
```

### Dataset

The dashboard includes 13 NYC buildings across 5 types:

**Building Types:**
- **Office** - ~17.5 kWh/sqft/year (corporate towers, tech hubs)
- **Residential** - ~12.0 kWh/sqft/year (apartments, condos)
- **Retail** - ~22.0 kWh/sqft/year (shopping centers, malls)
- **School** - ~15.0 kWh/sqft/year (educational institutions)
- **Hospital** - ~30.0 kWh/sqft/year (medical centers, 24/7 operation)

**Dataset includes:**
- Building ID
- Building name
- Building type
- Size (square feet)
- Number of floors
- Year built
- Annual energy consumption (kWh)
- Energy consumption per square foot (kWh/sqft)

### Data Split

- **70% Training Data** - Historical buildings used to calculate average
- **30% Test Data** - Buildings used to test prediction accuracy

## Deliverables

This project includes:

✓ **One simple prediction method** - Average energy per square foot
✓ **Predictions for test buildings** - 30% of dataset held out for testing
✓ **Comparison between predicted and actual** - Side-by-side bar chart
✓ **Chart displaying results** - Interactive visualizations
✓ **Brief explanation of findings** - Step-by-step prediction breakdown

## Implementation Levels

### Minimum (Current)
- Simple Building Energy Predictor
- Calculate average energy usage per square foot
- Estimate consumption and compare with actual usage

### Intermediate (Future)
- Add simple linear regression model
- Compare regression vs average method
- Show which method performs better

### Advanced (Future)
- Include additional building characteristics (age, floors, etc.)
- Compare multiple prediction methods
- Evaluate accuracy with different metrics
- Export data to CSV

## Use Cases

- **Classroom projects** - Data science and statistics education
- **Energy efficiency** - Understanding building consumption patterns
- **Sustainability** - Identifying high-energy buildings
- **Urban planning** - Estimating energy needs for new construction
- **STEM learning** - Real-world math and science application

## Learning Outcomes

After using this dashboard, students should be able to:

1. Explain how historical data can predict future outcomes
2. Calculate and interpret averages
3. Evaluate prediction accuracy
4. Understand factors affecting building energy consumption
5. Apply simple statistical methods to real-world problems

## Future Enhancements

- [ ] Add linear regression prediction method
- [ ] Include building age and floor count in predictions
- [ ] Compare prediction methods side-by-side
- [ ] Export predictions to CSV
- [ ] Add more building types
- [ ] Include seasonal energy variations
- [ ] Real NYC building data integration

## Dataset Notes

The current dataset uses realistic but simulated data based on:
- NYC typical energy consumption patterns
- EPA building energy benchmarks
- Industry-standard kWh/sqft values by building type
- Building age efficiency factors (older buildings less efficient)

For production use, replace with actual building energy data from:
- NYC Building Energy Benchmarking
- Energy Star Portfolio Manager
- Local utility company records

## Contributing

Contributions welcome! Ideas for improvements:
- Add more prediction methods
- Include more building characteristics
- Create guided tutorials
- Add quiz questions
- Improve visualizations

## License

MIT

## Acknowledgments

- NYPA PowerHack for project inspiration
- NYC Building Energy Benchmarking program
- Energy Star for building energy standards

---

Built for PowerHack - Teaching students data-driven energy prediction!
