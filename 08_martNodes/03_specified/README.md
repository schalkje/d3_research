# MartNode - Explicit Children Test Suite

## Overview

This directory contains a comprehensive test suite for **martNode with explicitly defined children**. Unlike the auto-generated children in other test suites, these tests provide full control over child node properties, states, and relationships for mart-specific data workflows.

## 🎯 Key Features

- ✅ **Explicit Child Definitions**: Full control over `load` and `report` child nodes
- ✅ **Orientation Support**: All 4 orientations (horizontal, vertical, rotate90, rotate270)
- ✅ **Display Mode Coverage**: Both `full` and `role` display modes
- ✅ **Custom State Management**: Mart-specific states like `Loading`, `Generating`, `Published`
- ✅ **Enhanced Properties**: Volume, frequency, format, schedule attributes
- ✅ **Comprehensive Testing**: Enhanced validation for mart-specific behaviors

## 📁 Directory Structure

```
03_specified/
├── 01_full_horizontal/     # Full display, horizontal orientation
├── 02_full_vertical/       # Full display, vertical orientation  
├── 03_full_rotate90/       # Full display, 90° rotation
├── 04_full_rotate270/      # Full display, 270° rotation
├── 05_role_horizontal/     # Role display, horizontal orientation
├── 06_role_vertical/       # Role display, vertical orientation
├── 07_role_rotate90/       # Role display, 90° rotation
├── 08_role_rotate270/      # Role display, 270° rotation
└── README.md              # This documentation
```

## 🧩 Test Matrix

| Test | Display Mode | Orientation | Children | Key Features |
|------|-------------|-------------|----------|--------------|
| **01** | full | horizontal | load, report | Standard horizontal layout |
| **02** | full | vertical | load, report | Vertical stacking |
| **03** | full | rotate90 | load, report | 90° clockwise rotation |
| **04** | full | rotate270 | load, report | 270° clockwise rotation |
| **05** | role | horizontal | load, report | Fixed-width role labels |
| **06** | role | vertical | load, report | Vertical role stacking |
| **07** | role | rotate90 | load, report | Rotated role labels |
| **08** | role | rotate270 | load, report | Counter-rotated roles |

## 🔧 MartNode Child Structure

### Standard Child Node Properties
```javascript
{
    id: "load-node-*",
    label: "MART.LOAD_*",
    type: "Node",
    role: "load",
    category: "Load",
    state: "Loading|Loaded|Batching",
    volume: "medium|high",
    frequency: "daily|hourly|real-time",
    // Additional mart-specific properties...
}
```

### Load Node States
- `Loading`: Active data loading process
- `Loaded`: Data successfully loaded
- `Batching`: Processing in batch mode
- `High-Volume-Loading`: High throughput loading
- `Multi-Source-Loading`: Loading from multiple sources

### Report Node States  
- `Generating`: Active report generation
- `Published`: Report successfully published
- `Analyzing`: Analytical processing
- `Auto-Generating`: Automated report generation

## 🎨 Visual Features

### State-Based Styling
- **Loading Animation**: Horizontal sliding effect for active loading
- **Generating Animation**: Opacity pulsing for report generation
- **Volume Indicators**: Box shadows for high-volume processing
- **Format Icons**: Dashboard and real-time dashboard indicators

### Orientation-Specific Features
- **Horizontal**: Standard left-to-right flow
- **Vertical**: Top-to-bottom stacking
- **Rotate90**: 90° clockwise rotation with adjusted layouts
- **Rotate270**: 270° clockwise rotation for alternative views

## 📊 Mart-Specific Scenarios

### Data Loading Patterns
1. **Batch Loading** (Daily/Hourly): Scheduled data ingestion
2. **Real-time Loading** (Streaming): Continuous data flow
3. **High-Volume Loading** (Big Data): Large dataset processing
4. **Incremental Loading** (Delta): Only changed data

### Report Generation Types
1. **Dashboard Reports** (Interactive): Real-time dashboards
2. **Analytical Reports** (Insights): Deep analysis reports
3. **Scheduled Reports** (Automated): Regular report generation
4. **Ad-hoc Reports** (On-demand): User-requested reports

## 🧪 Testing Features

### Enhanced Test Suites
Each test includes:
- ✅ **Basic Validation**: Dashboard initialization, rendering
- ✅ **MartNode Verification**: Node type and layout validation
- ✅ **Orientation Tests**: Correct orientation configuration
- ✅ **Explicit Children Tests**: Load and report child validation
- ✅ **State Management Tests**: Mart-specific state verification

### Key Test Cases
1. **MartNode Type Test**: Verifies node type is 'mart'
2. **Children Count Test**: Validates exactly 2 children (load, report)
3. **Role Assignment Test**: Confirms load and report roles
4. **Orientation Test**: Validates correct orientation setting
5. **State Test**: Verifies mart-specific states

## 🚀 Quick Start Guide

### 1. Browse Orientations
Compare different orientations:
```
01_full_horizontal/01_full_horizontal.html    # Standard horizontal
02_full_vertical/02_full_vertical.html        # Vertical layout
03_full_rotate90/03_full_rotate90.html        # 90° rotation
04_full_rotate270/04_full_rotate270.html      # 270° rotation
```

### 2. Compare Display Modes
Full vs Role display:
```
01_full_horizontal/01_full_horizontal.html    # Full display
05_role_horizontal/05_role_horizontal.html    # Role display
```

### 3. Test Scenarios
```javascript
// High-volume loading scenario
demoDataHighVolume

// Quality-focused processing
demoDataWithStates
```

## 🔗 Comparison with Auto-Generated

| Aspect | Auto-Generated | **Explicit Children** |
|--------|----------------|----------------------|
| **Control** | Limited | Full control |
| **States** | Default only | Mart-specific states |
| **Properties** | Standard | Volume, frequency, format |
| **Relationships** | Auto-connected | No inner edges (lesson learned) |
| **Testing** | Basic | Mart-focused validation |
| **Scenarios** | Generic | Data mart patterns |

## 🛠️ Development Guide

### Adding New Tests
1. **Create directory**: `mkdir 09_new_test`
2. **Copy template**: Use existing test as template
3. **Modify orientation**: Update layout.orientation
4. **Customize states**: Add mart-specific states
5. **Update documentation**: Add to this README

### Custom Properties for MartNode Children
```javascript
// Load node properties
{
    volume: "medium|high|very-high",
    frequency: "daily|hourly|real-time",
    batchType: "full|incremental",
    source: "single|multi-source"
}

// Report node properties  
{
    format: "dashboard|analytical|summary",
    schedule: "hourly|daily|on-demand",
    reportType: "standard|custom|automated",
    distribution: "email|portal|api"
}
```

## 📋 Test Checklist

When creating new martNode explicit children tests:

- [ ] **Unique child IDs**: Load and report nodes have unique identifiers
- [ ] **Role assignment**: Children have proper 'load' and 'report' roles
- [ ] **State definition**: Custom mart-specific states
- [ ] **No inner edges**: Empty edges array (lesson learned)
- [ ] **Orientation setting**: Correct orientation configuration
- [ ] **Visual styling**: CSS for states and custom properties
- [ ] **Test validation**: Tests for mart-specific behavior
- [ ] **Documentation**: README for the specific test

## 🎯 Usage Examples

### Testing Specific Orientations
```bash
# Horizontal layout
open 01_full_horizontal/01_full_horizontal.html

# Vertical layout  
open 02_full_vertical/02_full_vertical.html

# Rotated layouts
open 03_full_rotate90/03_full_rotate90.html
open 04_full_rotate270/04_full_rotate270.html
```

### Comparing Display Modes
```bash
# Full display modes
open 01_full_horizontal/01_full_horizontal.html
open 02_full_vertical/02_full_vertical.html

# Role display modes
open 05_role_horizontal/05_role_horizontal.html
open 06_role_vertical/06_role_vertical.html
```

## 📚 Related Documentation

- [FoundationNode Explicit Tests](../../07_foundationNodes/03_specified/README.md) - Foundation explicit children
- [AdapterNode Explicit Tests](../../06_adapterNodes/03_specified/README.md) - Adapter explicit children
- [MartNode Simple Tests](../01_simple-tests/README.md) - Auto-generated children
- [Dashboard Implementation](../../dashboard/readme.md) - Core system

---

**💡 Pro Tip**: MartNodes represent the final layer in data pipelines where processed data is loaded and reports are generated. Use explicit children to model specific loading patterns and report generation workflows with full control over states and properties.
