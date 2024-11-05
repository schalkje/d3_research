# Flow Dashboard

A set of javascript files to visualize a flow network using d3 and d3-dag.


## Dashboard object
A dashboard is the dataset used internally and returned with the first compute and draw function.

``` javascript
    { 
        layout:{ // manual creation, input for Layout.computeAndDraw
            horizontal:horizontal,
            lineGenerator:lineGenerator,
            isEdgeCurved:isEdgeCurved
        },
        main:{
            view:{  // DrawNetwork.setup, input for Layout.computeAndDraw
                svg:mainView.svg, 
                width:mainView.width, 
                height:mainView.height
                },
            canvas:{ // Layout.computeAndDraw --> Minimap.computeLayoutAndCanvas
                svg:mainCanvas, 
                width:mainCanvas.width, 
                height:mainCanvas.height
                }
            boundingbox:{ // set in ZoomToNode
                    boundingBox: boundingBox,
                    x: boundingBox.x,
                    y: boundingBox.y,
                    width: boundingBox.width,
                    height: boundingBox.height,
                    scale:1 // initialized in Layout.computeAndDraw
            }

        },
        minimap:{
            view:{ // Minimap.setup, input for Layout.computeAndDraw
                svg:minimapSvg,         
                scale:minimapScale, 
                width:minimapWidth,     
                height:minimapHeight,   
            }
            canvas:{ // Layout.computeAndDraw --> Layout.createMinimap
                svg:minimapCanvas,          
                width:mainCanvas.width, 
                height:mainCanvas.height
            }
            viewport: {
                rect:viewportRect,   // Layout.computeAndDraw --> Minimap.createViewPort


            }
        },
        zoom:zoom, // Layout.computeAndDraw --> Zoom.initializeZoom
        layers: {
            label:layerLabel
            minX:minX,
            minY:minY
        }
    };
```

## Layers
A layer is a way of grouping the nodes in columns.

This is a function to split nodes.

Two possible algorigthms:
- cut half way and put next to each other
- keep the order somewhat: take first, mode to split, take 2, put in split 2, take 3, put in split 1 etc

A split layer can be split again, going 1 to 2, 2 to 3, 3 to 4,
So we need to rearrange.

For storage that would mean, we have a hierarchical layout of layers.

Layer parameter can be supplied from the dashboard definition / node definition. Or is created based on the Y position.


# Nodes

Node behavior
- When not selected:
  - On hoover: cursor: pointer
  - Click --> Select, unselect others
  - CTRL-Click --> Select
  - Double-Click --> Zoom to node
- When selected:
  - On hoover: cursor: grab
  - Click and hold --> drag
  - Double-Click --> Zoom to node
- When clicked outside the node --> unselect

```Mermaid
graph TD
    subgraph "Node Behavior"
        A{Not Selected} --> |Hover| B[Cursor: Pointer]
        B --> |Click| C[Select, Unselect Others]
        B --> |CTRL-Click| D[Select]
        B --> |Double-Click| E[Zoom to Node]
        
        F{Selected} --> |Hover| G[Cursor: Grab]
        G --> |Click and Hold| H[Drag]
        H --> |Dragging| I[Dragging...]
        I --> |Release Button| F{Selected}
        G --> |Double-Click| E

        C --> F
        D --> F
    end

    subgraph "Click Outside Node"
        J[Click Outside Node] --> K[Unselect all nodes]
    end
```



# using the modules

## Usage in HTML (bundel)
### Option 1: Import as a Module
For ES module environments:
``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Test</title>
</head>
<body>
    <script type="module">
        import flowDashboard from './dist/flow-dashboard.min.js';

        flowDashboard.initialize();
        flowDashboard.render();
    </script>
</body>
</html>
```

### Option 2: Load as a Global Script
For non-module environments (e.g., if ES modules aren’t supported or you want a quick integration):
``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Test</title>
</head>
<body>
    <script src="./dist/flow-dashboard.min.js"></script>
    <script>
        // `flowDashboard` is available globally
        flowDashboard.initialize();
        flowDashboard.render();
    </script>
</body>
</html>

```

## Usage in HTML Without bundeling (for development)

### Option 1: Import as a Module
``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Test (Unbundled Module)</title>
</head>
<body>
    <script type="module">
        import flowDashboard from './src/index.js';

        // Now you can use `flowDashboard` directly
        flowDashboard.initialize();
        flowDashboard.render();
    </script>
</body>
</html>
```

### Option 2: Load as a Global Script
``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Test (Unbundled Global)</title>
</head>
<body>
    <script src="./src/index.js"></script>
    <script>
        // `flowDashboard` is available globally if using as a non-module script
        flowDashboard.initialize();
        flowDashboard.render();
    </script>
</body>
</html>
```