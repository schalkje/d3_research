# Columns and Lane Node Width Computation Fix

## Issue Description

When collapsing child nodes in **ColumnsNode** and **LaneNode**, the parent container was being sized incorrectly - specifically **1 spacer width too small**. This caused visual misalignment and improper spacing.

## Root Cause Analysis

The problem was in the **spacing calculation logic** during size computation:

### Before (Problematic):
```javascript
// Calculate spacing only between non-collapsed children
const nonCollapsedChildren = visibleChildren.filter(node => !node.collapsed);
const totalSpacing = nonCollapsedChildren.length > 1 ? (nonCollapsedChildren.length - 1) * this.nodeSpacing.horizontal : 0;
```

### The Issue:
1. **`visibleChildren`** includes collapsed children (they're still visible, just collapsed)
2. **`nonCollapsedChildren`** excludes collapsed children (because `node.collapsed` is true)
3. **`totalSpacing`** was calculated only between non-collapsed children
4. **But** collapsed children still occupy positions in the layout, so spacing was off by one spacer width

### Example Scenario:
- Parent has 3 children: Left, Middle, Right
- Left child is collapsed
- **Before fix**: Spacing = (2-1) * 20 = 20px (only between Middle and Right)
- **After fix**: Spacing = (3-1) * 20 = 40px (between all three positions)

## Solution Applied

### Fix for ColumnsNode (`dashboard/js/nodeColumns.js`):
```javascript
// Calculate spacing between ALL visible children (including collapsed ones)
// This ensures proper spacing even when some children are collapsed
const totalSpacing = visibleChildren.length > 1 ? (visibleChildren.length - 1) * this.nodeSpacing.horizontal : 0;
```

### Fix for LaneNode (`dashboard/js/nodeLane.js`):
```javascript
// Calculate spacing between ALL visible children (including collapsed ones)
// This ensures proper spacing even when some children are collapsed
const totalSpacing = visibleChildren.length > 1 ? (visibleChildren.length - 1) * this.nodeSpacing.vertical : 0;
```

## Why This Fix Works

1. **Layout Consistency**: Collapsed children still occupy their position in the horizontal/vertical layout
2. **Proper Spacing**: Spacing is calculated between all layout positions, not just content positions
3. **Zone System Integration**: The fix maintains compatibility with the zone system's margin calculations
4. **No Caching Issues**: The fix doesn't introduce any caching or minimum size restrictions

## Files Modified

1. `dashboard/js/nodeColumns.js` - Fixed horizontal spacing calculation
2. `dashboard/js/nodeLane.js` - Fixed vertical spacing calculation

## Testing

The fix should resolve the issue where:
- Left Section (ColumnsNode) collapses correctly
- Parent Columns resizes to proper width
- Child nodes maintain correct spacing
- No more "1 spacer width too small" problem

## Technical Details

- **Zone System**: Uses margin zone calculations with proper margins (left: 8px, right: 8px)
- **No Fixed Values**: All spacing is dynamic based on `nodeSpacing` configuration
- **Recursive Updates**: Parent nodes are properly notified of size changes via `handleDisplayChange()`
- **Collapse State Handling**: Collapsed children report their effective size via `getEffectiveWidth()`/`getEffectiveHeight()`
