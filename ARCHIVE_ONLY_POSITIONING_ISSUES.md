# Archive-Only Adapter Node Positioning Issues

## Summary

The tests have confirmed that there are significant positioning issues with the `archive_only` adapter node page (`http://localhost:8000/06_adapterNodes/01_single/07_archive_only/07_archive_only.html`). The current implementation does **NOT** meet the expected requirements.

## Expected Behavior

Based on the test requirements, the archive-only adapter node should:
1. ✅ Have exactly one node (archive only)
2. ❌ **Position the node exactly inside the `rect.zone-innerContainer`**
3. ❌ **Position the rect correctly in the `zoneContainer`**

## Actual Behavior (Issues Found)

### Issue 1: Inner Container Positioning
- **Expected**: Inner container should be centered at `(0, 0)` relative to adapter center
- **Actual**: 
  - Chromium: `x: -84.8046875` (offset: 84.80px)
  - WebKit: `x: -84.25` (offset: 84.25px)
- **Problem**: Inner container is significantly off-center horizontally

### Issue 2: Node Positioning Within Inner Container
- **Expected**: Archive node should be centered at `(0, 0)` within inner container
- **Actual**: Node is at `translate(18, 18)` 
- **Problem**: Node is not centered within the inner container

### Issue 3: Node Sizing
- **Expected**: Node should be smaller than inner container (fit inside with margin)
- **Actual**: 
  - Chromium: Node width = 169.61px, Container width = 169.61px (ratio: 1.000)
  - WebKit: Node width = 168.5px, Container width = 168.5px (ratio: 1.000)
- **Problem**: Node has exactly the same dimensions as the inner container

### Issue 4: Zone Container Positioning
- **Status**: ✅ **PASSING** - Zone container is correctly positioned at `(0, 0)`

## Test Results

```
Positioning Debug Info: {
  innerContainer: { x: -84.8046875, y: 0, width: 169.609375, height: 44 },
  node: { x: 18, y: 18, width: 169.609375, height: 44 },
  zoneContainer: { x: 0, y: 0 },
  nodeTransform: 'translate(18, 18)'
}
```

## Root Cause Analysis

The positioning issues suggest problems in the layout calculation logic:

1. **Inner Container Centering**: The `zone-innerContainer` rect is not being positioned relative to the adapter center
2. **Node Centering**: The archive node is not being centered within the inner container
3. **Node Sizing**: The node is being sized to match the container instead of fitting inside it

## Required Fixes

To meet the expected requirements, the following must be implemented:

1. **Fix Inner Container Positioning**: Ensure `rect.zone-innerContainer` is centered at `(0, 0)` relative to adapter center
2. **Fix Node Centering**: Position the archive node at `translate(0, 0)` within the inner container
3. **Fix Node Sizing**: Size the node to be smaller than the inner container (e.g., 80-90% of container dimensions)

## Test Status

- **Tests Run**: ✅ 4/4 tests executed
- **Tests Passed**: ❌ 0/4 tests passed
- **Issues Identified**: ✅ 3 major positioning issues documented
- **Test Coverage**: ✅ Comprehensive validation of all positioning requirements

## Next Steps

1. **Investigate Layout Logic**: Review the adapter node layout calculation code
2. **Fix Positioning Algorithms**: Correct the centering and sizing calculations
3. **Re-run Tests**: Verify that all positioning issues are resolved
4. **Validate Visual Output**: Confirm the node appears correctly positioned in the browser

## Files Involved

- **Test File**: `tests/adapter-nodes.spec.js` (lines 883-970)
- **Demo Page**: `06_adapterNodes/01_single/07_archive_only/07_archive_only.html`
- **Data File**: `06_adapterNodes/01_single/07_archive_only/js/graphData.js`
- **Layout Logic**: Dashboard adapter node implementation (to be investigated)

