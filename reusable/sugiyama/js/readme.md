# Flow Dashboard

A set of javascript files to visualize a flow network using d3 and d3-dag.


## dashboard
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
        },
        minimap:{
            view:{ // Minimap.setup, input for Layout.computeAndDraw
                svg:minimapSvg,         
                scale:minimapScale, 
                width:minimapWidth,     
                height:minimapHeight,   
                viewport:viewportRect   // Layout.computeAndDraw --> Minimap.createViewPort
            }
            canvas:{ // Layout.computeAndDraw --> Layout.createMinimap
                svg:minimapCanvas,          
                width:mainCanvas.width, 
                height:mainCanvas.height
            }
        },
        zoom:zoom // Layout.computeAndDraw --> Zoom.initializeZoom
    };
```