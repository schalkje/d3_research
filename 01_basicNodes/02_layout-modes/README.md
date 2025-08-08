# BaseNode Layout Modes Demo

This directory contains demonstration pages for the different layout modes supported by BaseNode.

## Layout Modes Overview

BaseNode supports three basic layout modes:

### 1. Default Layout
- **File**: `01_default-layout.html`
- **Description**: Standard positioning and sizing with fixed dimensions
- **Features**: Fixed width/height, standard positioning
- **Use Case**: When you need consistent node sizes

### 2. Auto-Size Layout
- **Files**: 
  - `02_auto-size-small.html` - Small text example
  - `03_auto-size-large.html` - Large text example
- **Description**: Automatically adjust size based on content
- **Features**: Dynamic sizing, content-based dimensions
- **Use Case**: When content varies significantly

### 3. Fixed-Size Layout
- **Files**:
  - `04_fixed-size-small.html` - Small text example
  - `05_fixed-size-large.html` - Large text example
- **Description**: Maintain specific dimensions regardless of content
- **Features**: Fixed dimensions, text truncation
- **Use Case**: When consistent layout is required

## Demo Features

Each demo includes:
- **Interactive Controls**: Toggle between different text sizes
- **Testing Framework**: Built-in tests for validation
- **Visual Feedback**: Real-time updates and status indicators
- **Documentation**: Clear descriptions of layout behavior

## Testing

Each demo includes comprehensive tests:
- Dashboard initialization
- Node rendering
- Layout mode validation
- Text centering verification
- Node positioning checks

## Usage

1. Open any demo HTML file in a web browser
2. Use the "Toggle Text Size" button to see layout behavior
3. Click "Run Tests" to validate functionality
4. Use "Reset" to return to original state

## Layout Mode Comparison

| Mode | Small Text | Large Text | Behavior |
|------|------------|------------|----------|
| Default | Fixed size | Fixed size | Consistent dimensions |
| Auto-Size | Small size | Large size | Adapts to content |
| Fixed-Size | Fixed size | Truncated | Maintains dimensions |

## Implementation Notes

- All demos use the updated dashboard path (`../../dashboard/`)
- Text centering is implemented using `text-anchor: middle` and `dominant-baseline: middle`
- Layout modes are configured via the `layout.layoutMode` property
- Text configuration includes font properties and alignment settings
