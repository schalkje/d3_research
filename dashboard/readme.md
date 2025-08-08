# dashboard

## Overview

This is the main product of the project: a modular, production-ready dashboard built with D3.js. It features advanced node, edge, and group visualizations, and is used in real-world projects.

## Features

- Modular JavaScript architecture
- Real data integration (see `data/`)
- Advanced edge, node, and group rendering
- Interactive features and controls

## How to Use

- Open `flowdash-bundle.html` or `flowdash-js.html` in your browser to view the dashboard.
- See the `data/` folder for example datasets.
- Refer to the JS files in `js/` for extending or customizing the dashboard.

## Implementation Documentation

For detailed information about the dashboard's architecture and implementation, see:

- [Implementation Overview](implementation.md) - Main architecture and design principles
- [Node System](implementation-nodes.md) - Node types and hierarchy
- [Edge System](implementation-edges.md) - Edge management and routing
- [Simulation Engine](implementation-simulation.md) - Force-directed layout
- [Dashboard Core](implementation-dashboard.md) - Main dashboard controller
- [Utilities](implementation-utils.md) - Helper functions and utilities
- [Code Cleanup Plan](implementation-cleanup.md) - DRY principles and refactoring roadmap

## Extending the Dashboard

- Add new data files to `data/`.
- Modify or add JS modules in `js/` for new features.

## Related Component Demos

See the `4_edges/`, `5_nodes/`, and `6_groups/` folders for demos of individual components used in the dashboard.
