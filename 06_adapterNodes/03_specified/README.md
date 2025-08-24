# Adapter Nodes - Explicit Children Test Suite

## Overview

This directory contains a comprehensive test suite for **adapter nodes with explicitly defined children**. Unlike the auto-generated children in other test suites, these tests provide full control over child node properties, states, relationships, and behaviors.

## 🎯 Key Features

- ✅ **Explicit Child Definitions**: Full control over child node properties
- ✅ **Custom State Management**: Individual states for each child node
- ✅ **Enhanced Role Assignment**: Clear role-based child categorization
- ✅ **Custom Data Relationships**: Explicit edge definitions between children
- ✅ **Advanced Testing**: Comprehensive validation for explicit children
- ✅ **Real-world Scenarios**: Based on actual data pipeline patterns

## 📁 Directory Structure

```
03_specified/
├── 01_full_arr1/           # Full mode, arrangement 1 (archive-focused)
├── 02_full_arr2/           # Full mode, arrangement 2 (transform-focused)
├── 03_full_arr3/           # Full mode, arrangement 3 (staging-focused)
├── 04_staging_archive/     # Staging-archive mode (2-node layout)
├── 05_staging_transform/   # Staging-transform mode (2-node layout)
├── 06_archive_only/        # Archive-only mode (single-node layout)
├── 07_role_arr1/           # Role display mode, arrangement 1
├── 08_role_arr2/           # Role display mode, arrangement 2
├── 09_role_arr3/           # Role display mode, arrangement 3
└── README.md              # This documentation
```

## 🧩 Layout Combinations Matrix

| Test | Mode | Arrangement | Display | Children | Focus | Key Features |
|------|------|-------------|---------|----------|-------|--------------|
| **01** | full | 1 | full | 3 | Archive | Archive-focused with custom states |
| **02** | full | 2 | full | 3 | Transform | Transform-focused with ML emphasis |
| **03** | full | 3 | full | 3 | Staging | Staging-focused with volume handling |
| **04** | staging-archive | 4 | full | 2 | Storage | Direct staging → archive flow |
| **05** | staging-transform | 4 | full | 2 | Processing | Real-time stream processing |
| **06** | archive-only | 5 | full | 1 | Archive | Single archive vault |
| **07** | full | 1 | role | 3 | Roles | Role-based rendering (arr 1) |
| **08** | full | 2 | role | 3 | Roles | Role-based rendering (arr 2) |
| **09** | full | 3 | role | 3 | Roles | Role-based rendering (arr 3) |

## 🔧 Explicit Children Structure

### Standard Child Node Properties
```javascript
{
    id: "unique-child-id",
    label: "DWH.CHILD_NAME",
    description: "Detailed description of child function",
    type: "node",
    datasetId: 123,
    category: "Staging|Archive|Transform",
    layout: null,
    children: [],
    state: "Custom-State",
    role: "staging|archive|transform",
    // Additional custom properties...
}
```

### State Management Examples

**Full Mode States:**
- `Updated`, `Ready`, `Processing` (Arrangement 1)
- `Active`, `Idle`, `Running` (Arrangement 2)
- `Ingesting`, `Storing`, `Cleaning` (Arrangement 3)

**Specialized Mode States:**
- `Collecting`, `Archiving`, `Compressing` (Staging-Archive)
- `Streaming`, `Transforming`, `High-Throughput` (Staging-Transform)
- `Storing`, `Compressed` (Archive-Only)

## 🚀 Quick Start Guide

### 1. Browse Individual Tests
Navigate to any numbered subdirectory and open the HTML file:
```
06_adapterNodes/03_specified/01_full_arr1/01_full_arr1.html
```

### 2. Compare Arrangements
Open multiple tests in different browser tabs to compare layouts:
- **Arrangement 1**: Archive emphasis
- **Arrangement 2**: Transform emphasis  
- **Arrangement 3**: Staging emphasis

### 3. Test Role Display Mode
Compare full display vs role display:
- `01_full_arr1` (full display)
- `07_role_arr1` (role display)

## 🧪 Testing Features

### Enhanced Test Suites
Each test includes:
- ✅ **Basic Validation**: Dashboard initialization, rendering
- ✅ **Layout Verification**: Mode, arrangement, display validation
- ✅ **Explicit Children Tests**: Count, roles, states verification
- ✅ **Custom Property Tests**: Volume, compression, latency checks
- ✅ **Data Flow Tests**: Edge relationships and priorities

### Test Categories
1. **Structural Tests**: Verify correct child count and types
2. **State Tests**: Validate custom states and transitions
3. **Role Tests**: Confirm role assignments and behaviors
4. **Layout Tests**: Ensure proper arrangement rendering
5. **Flow Tests**: Validate data flow patterns

## 🎨 Visual Features

### State-Based Styling
- **Color-coded borders**: Different colors for each state
- **Animations**: Ingesting, running, archiving animations
- **Volume indicators**: Glow effects for high-volume processing
- **Role styling**: Background colors based on node roles

### Layout-Specific Features
- **Arrangement 1**: Archive node prominence
- **Arrangement 2**: Transform node highlighting with animations
- **Arrangement 3**: Staging node emphasis with volume scaling
- **Two-node modes**: Horizontal layouts with direct flow
- **Single-node mode**: Centered layout with vault styling

## 📊 Real-World Scenarios

### Data Pipeline Patterns
1. **ETL Pipeline** (Full Arr 1): Extract → Archive → Transform
2. **Stream Processing** (Full Arr 2): Staging → Transform → Archive
3. **Data Ingestion** (Full Arr 3): High-volume staging with fan-out
4. **Batch Storage** (Staging-Archive): Direct staging to archive
5. **Real-time Analytics** (Staging-Transform): Stream processing
6. **Data Vault** (Archive-Only): Long-term storage only

### State Scenarios
- **Production**: Active processing with multiple states
- **High Volume**: 10M+ records/hour with performance indicators
- **Compression**: Ultra-high compression for storage optimization
- **Real-time**: Low-latency streaming with throughput monitoring

## 🔗 Comparison with Auto-Generated

| Aspect | Auto-Generated | **Explicit Children** |
|--------|----------------|----------------------|
| **Control** | Limited | Full control |
| **States** | Default only | Custom states |
| **Properties** | Standard | Enhanced properties |
| **Relationships** | Auto-connected | Explicit edges |
| **Testing** | Basic | Comprehensive |
| **Scenarios** | Generic | Real-world patterns |
| **Customization** | Minimal | Extensive |

## 🛠️ Development Guide

### Adding New Tests
1. **Create directory**: `mkdir 10_new_test`
2. **Copy template**: Use existing test as template
3. **Modify data**: Update `js/graphData.js` with explicit children
4. **Customize styling**: Add specific CSS for new features
5. **Update documentation**: Add to this README

### Custom Child Properties
```javascript
children: [{
    // Standard properties
    id: "custom-child",
    label: "Custom Label",
    role: "staging|archive|transform",
    state: "Custom-State",
    
    // Extended properties
    volume: "high|very-high",
    latency: "low|ultra-low",
    compression: "high|ultra",
    retention: "permanent|temporary",
    priority: "primary|secondary",
    // ... add more as needed
}]
```

### Custom Edge Properties
```javascript
edges: [{
    id: "custom-edge",
    source: "source-node-id",
    target: "target-node-id",
    type: "dataflow",
    
    // Extended properties
    flow: "direct|streaming",
    priority: "high|normal",
    throughput: "high|normal",
    latency: "real-time|batch"
}]
```

## 📋 Test Checklist

When creating new explicit children tests:

- [ ] **Unique child IDs**: Each child has unique identifier
- [ ] **Role assignment**: All children have proper roles
- [ ] **State definition**: Custom states appropriate for scenario
- [ ] **Edge relationships**: Explicit data flow definitions
- [ ] **Visual styling**: CSS for states and custom properties
- [ ] **Test validation**: Tests for explicit children behavior
- [ ] **Documentation**: README for the specific test
- [ ] **Real-world relevance**: Based on actual pipeline patterns

## 🎯 Usage Examples

### Testing Specific Scenarios
```bash
# Archive-focused pipeline
open 01_full_arr1/01_full_arr1.html

# High-volume streaming
open 05_staging_transform/05_staging_transform.html

# Role-based rendering
open 07_role_arr1/07_role_arr1.html
```

### Comparing Arrangements
```bash
# Compare all three full arrangements
open 01_full_arr1/01_full_arr1.html
open 02_full_arr2/02_full_arr2.html
open 03_full_arr3/03_full_arr3.html
```

## 📚 Related Documentation

- [Single Adapter Tests](../01_single/README.md) - Auto-generated children
- [Layout Tests](../02_layouts_full/README.md) - Full layout scenarios
- [Dashboard Implementation](../../dashboard/readme.md) - Core system
- [Node Types](../../dashboard/documentation/nodes/) - Node type docs

---

**💡 Pro Tip**: Use explicit children when you need full control over child node properties, states, and relationships. This test suite demonstrates real-world data pipeline patterns with comprehensive state management and custom behaviors.
