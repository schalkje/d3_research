# Foundation Node - Full Mode Large Titles Demo

## Overview

This demo showcases a foundation node in **full display mode** with **large titles** for enhanced readability. The foundation node displays both raw and base components with internal edges and improved text visibility.

## Features

- **Display Mode**: Full mode - shows all components (raw → base)
- **Large Titles**: Enhanced font size (16px) and styling for better readability
- **Orientation**: Horizontal layout
- **Auto Layout**: Automatic component positioning
- **Internal Edges**: Automatic edge creation between components
- **Enhanced Typography**: Bold font weight and improved color contrast

## Node Configuration

### Foundation Node
- **Type**: `foundation`
- **Display Mode**: `full`
- **Layout Mode**: `auto`
- **Orientation**: `horizontal`
- **Status**: `active`
- **State**: `ready`

### Text Styling
- **Font Size**: 16px (larger than default)
- **Font Family**: Arial, sans-serif
- **Font Weight**: Bold
- **Text Color**: #2c3e50 (dark blue-gray)
- **Text Anchor**: Middle
- **Baseline**: Middle

## Layout Behavior

In full mode, the foundation node:
1. Creates two components: Raw and Base
2. Positions them horizontally with proper spacing
3. Creates internal edges between components
4. Applies large title styling for enhanced visibility
5. Maintains full component layout with proper sizing

## Component Structure

### Raw Component
- **Purpose**: Raw data foundation
- **Position**: Left side of the foundation
- **Connections**: Outgoing edge to base component

### Base Component
- **Purpose**: Processed data foundation
- **Position**: Right side of the foundation
- **Connections**: Incoming edge from raw component

## Use Cases

- **Data Architecture**: Complete foundation layer visualization
- **ETL Processes**: Foundation data processing flows
- **Documentation**: Enhanced readability for technical diagrams
- **Presentations**: Better visibility in large displays
- **Accessibility**: Improved text readability for users

## Testing

The demo includes comprehensive testing for:
- Dashboard initialization
- Node rendering
- Data structure validation
- Large title configuration
- Full mode functionality

## Files

- `full-mode-large-titles.html` - Main demo page
- `js/graphData.js` - Demo data and configuration
- `README.md` - This documentation

## Related Demos

- [Role Mode Large Titles](../03_role-mode-large-titles/) - Role display mode with large titles
- [Full Mode](../01_full-mode/) - Standard full mode without large titles
- [Role Mode](../02_role-mode/) - Standard role mode without large titles


