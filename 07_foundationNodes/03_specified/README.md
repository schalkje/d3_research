# FoundationNode - Explicit Children Test Suite

## Overview

This directory contains a comprehensive test suite for **foundationNode with explicitly defined children**. Unlike the auto-generated children in other test suites, these tests provide full control over child node properties, states, and relationships for foundational data layer workflows.

## 🎯 Key Features

- ✅ **Explicit Child Definitions**: Full control over `raw` and `base` child nodes
- ✅ **Orientation Support**: All 4 orientations (horizontal, vertical, rotate90, rotate270)
- ✅ **Display Mode Coverage**: Both `full` and `role` display modes
- ✅ **Custom State Management**: Foundation-specific states like `Ingesting`, `Structuring`, `Validated`
- ✅ **Enhanced Properties**: Source, format, schema, quality attributes
- ✅ **Comprehensive Testing**: Enhanced validation for foundation-specific behaviors

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
| **01** | full | horizontal | raw, base | Standard horizontal layout |
| **02** | full | vertical | raw, base | Vertical stacking |
| **03** | full | rotate90 | raw, base | 90° clockwise rotation |
| **04** | full | rotate270 | raw, base | 270° clockwise rotation |
| **05** | role | horizontal | raw, base | Fixed-width role labels |
| **06** | role | vertical | raw, base | Vertical role stacking |
| **07** | role | rotate90 | raw, base | Rotated role labels |
| **08** | role | rotate270 | raw, base | Counter-rotated roles |

## 🔧 FoundationNode Child Structure

### Standard Child Node Properties
```javascript
{
    id: "raw-node-*",
    label: "FOUND.RAW_*",
    type: "node",
    role: "raw",
    category: "Raw",
    state: "Ingesting|Validated|Processing",
    source: "external|internal|multi-source",
    format: "json|csv|parquet|mixed",
    // Additional foundation-specific properties...
}
```

### Raw Node States
- `Ingesting`: Active data ingestion from sources
- `Validated`: Data quality validation completed
- `Processing`: Raw data processing in progress
- `Multi-Source-Ingesting`: Ingesting from multiple sources
- `Harmonizing`: Standardizing data from different sources

### Base Node States  
- `Structuring`: Creating foundational data structures
- `Optimized`: Performance optimization completed
- `Normalized`: Data normalization applied
- `Indexed`: Database indexing completed
- `Quality-Checked`: Data quality validation

## 🎨 Visual Features

### State-Based Styling
- **Ingesting Animation**: Data flow animation for active ingestion
- **Structuring Animation**: Building blocks effect for structuring
- **Quality Indicators**: Color-coded quality levels
- **Source Icons**: Different icons for source types

### Orientation-Specific Features
- **Horizontal**: Standard left-to-right flow (raw → base)
- **Vertical**: Top-to-bottom stacking (raw above base)
- **Rotate90**: 90° clockwise rotation with adjusted layouts
- **Rotate270**: 270° clockwise rotation for alternative views

## 📊 Foundation-Specific Scenarios

### Data Ingestion Patterns
1. **Single Source** (Simple): One data source ingestion
2. **Multi-Source** (Complex): Multiple heterogeneous sources
3. **External APIs** (Integration): Third-party data integration
4. **Real-time Streams** (Continuous): Streaming data ingestion

### Base Layer Types
1. **Normalized Schema** (OLTP): Traditional normalized structures
2. **Star Schema** (OLAP): Dimensional modeling for analytics
3. **Data Vault** (Enterprise): Enterprise data warehouse patterns
4. **Unified Schema** (Modern): Single source of truth approach

## 🧪 Testing Features

### Enhanced Test Suites
Each test includes:
- ✅ **Basic Validation**: Dashboard initialization, rendering
- ✅ **FoundationNode Verification**: Node type and layout validation
- ✅ **Orientation Tests**: Correct orientation configuration
- ✅ **Explicit Children Tests**: Raw and base child validation
- ✅ **State Management Tests**: Foundation-specific state verification

### Key Test Cases
1. **FoundationNode Type Test**: Verifies node type is 'foundation'
2. **Children Count Test**: Validates exactly 2 children (raw, base)
3. **Role Assignment Test**: Confirms raw and base roles
4. **Orientation Test**: Validates correct orientation setting
5. **Quality Test**: Verifies data quality attributes

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
// Quality-focused scenario
demoDataWithQuality

// Multi-source ingestion
demoDataMultiSource
```

## 🔗 Comparison with Auto-Generated

| Aspect | Auto-Generated | **Explicit Children** |
|--------|----------------|----------------------|
| **Control** | Limited | Full control |
| **States** | Default only | Foundation-specific states |
| **Properties** | Standard | Source, format, schema, quality |
| **Relationships** | Auto-connected | No inner edges (lesson learned) |
| **Testing** | Basic | Foundation-focused validation |
| **Scenarios** | Generic | Data foundation patterns |

## 🛠️ Development Guide

### Adding New Tests
1. **Create directory**: `mkdir 09_new_test`
2. **Copy template**: Use existing test as template
3. **Modify orientation**: Update layout.orientation
4. **Customize states**: Add foundation-specific states
5. **Update documentation**: Add to this README

### Custom Properties for FoundationNode Children
```javascript
// Raw node properties
{
    source: "external|internal|multi-source|api",
    format: "json|csv|parquet|xml|mixed",
    quality: "high|medium|low|unknown",
    volume: "small|medium|large|very-large"
}

// Base node properties  
{
    schema: "normalized|star|vault|unified",
    quality: "validated|optimized|indexed",
    performance: "fast|medium|slow",
    consistency: "strong|eventual|weak"
}
```

## 📋 Test Checklist

When creating new foundationNode explicit children tests:

- [ ] **Unique child IDs**: Raw and base nodes have unique identifiers
- [ ] **Role assignment**: Children have proper 'raw' and 'base' roles
- [ ] **State definition**: Custom foundation-specific states
- [ ] **No inner edges**: Empty edges array (lesson learned)
- [ ] **Orientation setting**: Correct orientation configuration
- [ ] **Visual styling**: CSS for states and custom properties
- [ ] **Test validation**: Tests for foundation-specific behavior
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

- [MartNode Explicit Tests](../../08_martNodes/03_specified/README.md) - Mart explicit children
- [AdapterNode Explicit Tests](../../06_adapterNodes/03_specified/README.md) - Adapter explicit children
- [FoundationNode Simple Tests](../01_simple-tests/README.md) - Auto-generated children
- [Dashboard Implementation](../../dashboard/readme.md) - Core system

---

**💡 Pro Tip**: FoundationNodes represent the foundational data layer where raw data is ingested and structured into base layers. Use explicit children to model specific ingestion patterns and base layer architectures with full control over data quality and schema design.
