# Single Adapter Node Layouts - Complete Test Suite

## Overview

This directory contains a comprehensive collection of individual test pages for every possible adapter node layout combination. Each numbered subdirectory focuses on a specific layout configuration, allowing for isolated testing and validation.

## 📁 Directory Structure

```
01_single/
├── 01_single.html           # Original single adapter demo (baseline)
├── 02_full_arr1/            # Full mode, arrangement 1 (archive-focused)
├── 03_full_arr2/            # Full mode, arrangement 2 (transform-focused)
├── 04_full_arr3/            # Full mode, arrangement 3 (staging-focused)
├── 05_staging_archive/      # Staging-archive mode, arrangement 4
├── 06_staging_transform/    # Staging-transform mode, arrangement 4
├── 07_archive_only/         # Archive-only mode, arrangement 5
├── 08_role_arr1/            # Role display, arrangement 1
├── 09_role_arr2/            # Role display, arrangement 2
└── 10_role_arr3/            # Role display, arrangement 3
```

## 🎯 Layout Combinations

### Full Mode Layouts (3 Child Nodes)
- **02_full_arr1**: Archive-focused - staging bottom-left, archive top-right, transform bottom-right
- **03_full_arr2**: Transform-focused - staging/archive top row, transform bottom spanning
- **04_full_arr3**: Staging-focused - staging left spanning, archive/transform stacked right

### Specialized Modes (Reduced Child Nodes)
- **05_staging_archive**: Two-node horizontal layout with staging and archive
- **06_staging_transform**: Two-node horizontal layout with staging and transform
- **07_archive_only**: Single-node centered layout with archive only

### Role Display Mode
- **08_role_arr1**: Role display mode with arrangement 1 layout
- **09_role_arr2**: Role display mode with arrangement 2 layout
- **10_role_arr3**: Role display mode with arrangement 3 layout

## 🚀 Quick Start

1. **Browse All Layouts**: Open `../index.html` for a complete navigation interface
2. **Test Individual Layout**: Navigate to any numbered subdirectory and open the HTML file
3. **Compare Layouts**: Use multiple browser tabs to compare different arrangements side-by-side

## 🧪 Testing Features

Each layout demo includes:
- ✅ Interactive demo controls (Update, Reset, Run Tests)
- ✅ Automated test validation
- ✅ Proper layout configuration validation
- ✅ Visual rendering verification
- ✅ Data structure integrity checks

## 📋 Layout Configuration Details

| Demo | Mode | Arrangement | Display | Child Nodes | Description |
|------|------|-------------|---------|-------------|-------------|
| 01 | full | 3 | full | staging, archive, transform | Original baseline |
| 02 | full | 1 | full | staging, archive, transform | Archive-focused |
| 03 | full | 2 | full | staging, archive, transform | Transform-focused |
| 04 | full | 3 | full | staging, archive, transform | Staging-focused |
| 05 | staging-archive | 4 | full | staging, archive | Two-node horizontal |
| 06 | staging-transform | 4 | full | staging, transform | Two-node horizontal |
| 07 | archive-only | 5 | full | archive | Single-node centered |
| 08 | full | 1 | role | staging, archive, transform | Role display - arrangement 1 |
| 09 | full | 2 | role | staging, archive, transform | Role display - arrangement 2 |
| 10 | full | 3 | role | staging, archive, transform | Role display - arrangement 3 |

## 🔧 Development Notes

### File Structure Per Demo
```
XX_demo_name/
├── XX_demo_name.html        # Main demo page
├── css/
│   └── demo.css            # Demo-specific styles
├── js/
│   └── graphData.js        # Layout configuration data
├── README.md               # Demo-specific documentation
└── test-data.json         # Test case definitions
```

### Key Configuration Properties
- **mode**: `full`, `staging-archive`, `staging-transform`, `archive-only`
- **arrangement**: `1`, `2`, `3`, `4`, `5` (specific to mode)
- **displayMode**: `full`, `role` (affects text rendering)

## 🎨 Customization

Each demo can be customized by modifying:
1. **Layout Settings**: Edit `js/graphData.js` to change layout configuration
2. **Visual Styles**: Modify `css/demo.css` for demo-specific styling
3. **Test Cases**: Update `test-data.json` for additional validation

## 🔗 Related Documentation

- [Adapter Node Implementation](../../dashboard/implementation-nodes.md)
- [Dashboard System](../../dashboard/readme.md)
- [Main Navigation](../index.html)

## 📝 Usage Examples

```javascript
// Example: Switching from arrangement 1 to arrangement 2
const demoData = {
    nodes: [{
        id: "adapter-example",
        type: "adapter",
        layout: {
            mode: "full",
            arrangement: 2,  // Changed from 1 to 2
            displayMode: "full"
        }
    }]
};
```

---

**💡 Tip**: Use the main navigation at `../index.html` for easy access to all demos with detailed descriptions and comparison tables.