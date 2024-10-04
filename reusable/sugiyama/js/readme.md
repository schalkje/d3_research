# Flow Dashboard

A set of javascript files to visualize a flow network using d3 and d3-dag.


## dashboard
A dashboard is the dataset used internally and returned with the first compute and draw function.

``` javascript
    { 
        layout:{
            horizontal:horizontal,
            lineGenerator:lineGenerator
        },
        main:{
            view:mainView,
            canvas:{
                svg:mainCanvas, 
                width:mainCanvas.width, 
                height:mainCanvas.height
                },
            zoom:zoom
        },
        minimap:{
            view:minimap,
            canvas:{
                svg:minimapCanvas, 
                width:mainCanvas.width, 
                height:mainCanvas.height
            }
        }
    };
```