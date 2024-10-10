export function computeLayers(dashboard, dag) {
    // Extract layers after the layout is applied
    const layers = {};
  
    // Use dag.nodes() to get all the nodes in the DAG and group them by layer
    dag.nodes().forEach((node) => {
        console.log("computeLayers - node", node, node.y);
        const yCoord = Math.round(node.y); // Round y-coordinate to avoid floating-point precision issues
  
        // Determine the layerId: use node.layer if it exists, otherwise use the y-coordinate as a string
        const layerId = node.layer || yCoord.toString();
  
        // Create or access the layer by layerId
        if (!layers[layerId]) {
            layers[layerId] = {
                id: layerId,  // Set the id for the layer
                label: node.layer || "",  // Set the label for the layer
                // x: Infinity,     // Initialize to find the minimum x value later
                // y: Infinity,       // Set the Y-coordinate for the layer's Y
                nodes: []        // Store the nodes in this layer
            };
        }
  
        // Add the node to the layer
        layers[layerId].nodes.push(node);
    });
  
    // Now compute width and height for each layer after collecting all nodes
    Object.values(layers).forEach(layer => {
      layer.x = Infinity;
      layer.y = Infinity;
      layer.maxX = -Infinity;
      layer.maxY = -Infinity;
  
        // Iterate over the nodes in the layer to compute x, width, y, and height
        if (dashboard.layout.horizontal) {
          layer.nodes.forEach(node => {
              // Update the layer's y to the minimum y value of the nodes
              layer.x = Math.min(layer.x, node.y);
              layer.y = Math.min(layer.y, node.x);
  
              // Compute the rightmost edge (maxX)
              layer.maxX = Math.max(layer.maxX, node.y + node.data.width);
  
              // Update the maximum bottom edge for height computation
              layer.maxY = Math.max(layer.maxY, node.x + node.data.height);
          });
        }
        else {
          layer.nodes.forEach(node => {
              // Update the layer's x to the minimum x value of the nodes
              layer.x = Math.min(layer.x, node.x);
              layer.y = Math.min(layer.y, node.y);
  
              // Compute the rightmost edge (maxX)
              layer.maxX = Math.max(layer.maxX, node.x + node.data.width);
  
              // Update the maximum bottom edge for height computation
              layer.maxY = Math.max(layer.maxY, node.y + node.data.height);
          });
      }
  
      if (dashboard.layout.horizontal) {
        // Set the width and height of the layer
        layer.width = layer.maxX - layer.x;
        layer.height = layer.maxY - layer.y;
      }else {      
        // Set the width and height of the layer
        layer.width = layer.maxX - layer.x;
        layer.height = layer.maxY - layer.y;
      }
    });
  
    console.log("computeLayers - layersObject", layers);
  
    // Convert layers object to an array if needed
    const layersArray = Object.values(layers);

    // relabel layers when layer.label is empty
    let layerIndex = 1;
    layersArray.forEach(layer => {
      if (layer.label === "") {
        layer.label = "Layer " + layerIndex;
        layerIndex++;
      }
    });
  
    // Now you have an array of layers with label, x, y, width, height, and nodes
    console.log("computeLayers - layers", layersArray);
  
    // Assign the computed layers to the dashboard object
    dashboard.layers = layersArray;

    OptimizeLayers(dashboard);
    console.log("computeLayers - optimized layers", dashboard.layers);
}


// Function to compute the total width and height of the layout
function computeTotalDimensions(layers) {
    const minX = Math.min(...layers.map(layer => layer.x));
    const maxX = Math.max(...layers.map(layer => layer.x + layer.width));
    const minY = Math.min(...layers.map(layer => layer.y));
    const maxY = Math.max(...layers.map(layer => layer.y + layer.height));

    return {
        totalWidth: maxX - minX,
        totalHeight: maxY - minY
    };
}

// Function to get the longest column (widest layer) and its metadata
function getLongestLayer(layers) {
    if (!layers.length) return null;

    // Find the longest layer based on height
    const longestLayer = layers.reduce((longest, layer) => 
        layer.height > longest.height ? layer : longest, layers[0]
    );

    // Filter the layers by the longest layer's id
    const longestLayers = layers.filter(layer => layer.id === longestLayer.id);

    const { splitCount, maxHeight: maxSplitHeight, totalHeight, totalY } = longestLayers.reduce((acc, layer) => {
        acc.splitCount = Math.max(acc.splitCount, layer.splitNumber || 1);
        acc.maxSplitHeight = Math.max(acc.maxHeight, layer.height);
        acc.totalHeight += layer.height;
        acc.totalY += layer.y;
        return acc;
    }, { splitCount: 1, maxHeight: 0, totalHeight: 0, totalY: 0 });

    const result = {
        layer: longestLayer,
        splitLayers: longestLayers,
        splitCount: splitCount,
        maxSplitHeight: maxSplitHeight,
        totalHeight: totalHeight,
        totalY: totalY
    };
    console.log("getLongestColumn", result, layers);
    return result;
}

// Function to compute the impact of splitting the longest column
function computeSplitImpact(layers, targetRatio) {
    const { totalWidth, totalHeight } = computeTotalDimensions(layers);

    // Calculate the current ratio
    const actualRatio = totalWidth / totalHeight;
    console.log(`Current ratio: ${actualRatio}, Target ratio: ${targetRatio}`, totalWidth , totalHeight);

    // Get the longest column details (id, split count, max height)
    const longestLayer = getLongestLayer(layers);
    console.log(`Longest layer: ${longestLayer.layer.id}, Split count: ${longestLayer.splitCount}, Max height: ${longestLayer.maxSplitHeight}` ,longestLayer);

    // JS: todo: do something with a margin between layers
    const layerMargin = 40;
    console.log(`newTotalWidthAfterSplit = `, totalWidth,longestLayer.layer.width,layerMargin);
    const newCanvasWidthAfterSplit = totalWidth + longestLayer.layer.width + layerMargin; // Assuming columns side by side
    // recompute height: sum the height of the columns, divide by the number of columns + 1
    const newCanvasHeightAfterSplit = layers.reduce((height, layer) => {
        if (layer.id === longestLayer.layer.id) {
            return Math.max(height,longestLayer.totalHeight / longestLayer.splitCount + 1);
        } else {
            return Math.max(height, layer.height);
        };
    },0);


    const newActualRatio = newCanvasWidthAfterSplit / newCanvasHeightAfterSplit;
    console.log(`New total width: ${newCanvasWidthAfterSplit}, New total height: ${newCanvasHeightAfterSplit}`);


    console.log(`Current ratio: ${actualRatio}, New ratio: ${newActualRatio}, Target ratio: ${targetRatio}`);
    // Decide whether to split based on the new ratio
    if (Math.abs(newActualRatio - targetRatio) < Math.abs(actualRatio - targetRatio)) {
        return {
            shouldSplit: true,
            longestLayer: longestLayer,
            canvasWidth: newCanvasWidthAfterSplit,
            canvasHeight: newCanvasHeightAfterSplit,
            canvasRatio: newActualRatio
        };
    } else {
        return { shouldSplit: false };
    }
}


// Function to apply the split, including re-splitting previously split columns
function applySplit(layers, viewWidth, viewHeight) {
    const targetRatio = viewWidth / viewHeight;

    // Compute the impact of splitting the longest column
    const splitDecision = computeSplitImpact(layers, targetRatio);

    console.log(`Should split: ${splitDecision.shouldSplit}`, splitDecision);
    // If splitting improves the ratio, apply the split
    if (splitDecision.shouldSplit) {
        console.log(`              --> ${splitDecision.longestLayer.layer.label} (${splitDecision.longestLayer.layer.id})`);

        // We are now re-splitting this column into (splitCount + 1) parts
        const newSplitCount = splitDecision.longestLayer.splitCount + 1;

        const marginX = 40; // JS: todo: do something with a margin between layers
        let currentX = 0;

        // build a new layers array
        console.log(`Building new layers array:`, layers);
        const newLayers = [];

        // 1. copy the layers, until you reach the first split layer
        console.log(`                           - copy first layers`);
        for (let layer of layers) {
            if (layer.id === splitDecision.longestLayer.layer.id) {
                break;
            }
            newLayers.push(layer);
            currentX = layer.x + layer.width;
        }

        // 2. add the new split layers
        // 2.a. recompute the x and y coordinates of the layers
        // 2.b. reposition and redistribute the nodes
        console.log(`                           - add new split layers: ${newSplitCount}, label=${splitDecision.longestLayer.layer.label}`);
        for (let i = 0; i < newSplitCount; i++) {
            const newLayer = {
                id: splitDecision.longestLayer.layer.id, // Reuse the original layer ID
                label: splitDecision.longestLayer.layer.label, // Reuse the original label
                width: splitDecision.longestLayer.layer.width, // Reuse the original width
                nodes: splitDecision.longestLayer.layer.nodes,
                x: currentX + marginX,
                y: splitDecision.longestLayer.totalY / newSplitCount,
                height: splitDecision.longestLayer.totalHeight / newSplitCount, // Recompute the height
                splitNumber: i + 1 // Update the split number
            };
            // Add the new split layer to the new layers array
            newLayers.push(newLayer);

            // Adjust the X position for the next split part
            currentX += splitDecision.longestLayer.layer.width + marginX;
        }

        // 3. copy the remaining layers, but skip the previous split layers
        // 3.a. recompute the x and y coordinates of the layers
        // 3.b. reposition the nodes
        console.log(`                           - copy remaining layers`);
        let skip = true;
        for (let layer of layers) {
            if (layer.id === splitDecision.longestLayer.layer.id) {
                if (skip) {
                    // Skip all split layers of the original column
                    skip = false;
                }
                continue; // Skip already split layers
            } else if(!skip) {
                layer.x = currentX + marginX; // Update the X position
                newLayers.push(layer); // Copy the remaining layers
                currentX += layer.width + marginX; 
                // move all the nodes in the layer
                console.log(`                           - move nodes in layer ${layer.id}`, layer.nodes);
            }
        }        

        


        console.log(`Resplit column ${splitDecision.id} into ${newSplitCount} parts`,newLayers);
        return newLayers;
    }

    return layers;
}

// Function to reposition the nodes within the split layers
function reshuffelNodes(layers) {
    console.log(`Repositioning nodes in split layers`, layers);
    layers.forEach(layer => {
        const splitNumber = layer.splitNumber || 1; // Determine the split number for the layer
        const moveUp = (splitNumber - 1) * layer.height; // Calculate how much to move up nodes in split layers
        const filterTop = (splitNumber) * layer.height + layer.y; // Calculate the top boundary for filtering nodes
        console.log(`                                   - Layer ${layer.id}, Split number: ${splitNumber}, Move up: ${moveUp}, Filter top: ${filterTop}`,layer.height,layer.y);

        // Filter and reposition the nodes based on their y coordinates and the layer's split
        layer.nodes = layer.nodes.filter(node => {
            // console.log(`                                   - Check Node`, node);
            // Remove nodes from the layer where the nodes' bottom y + height is less than the start of this split section
            if (node.x < moveUp) {
                // console.log(`                                        - Remove bottom Node Y: ${node.x}`, node);
                return false; // Node doesn't belong to this split, remove it
            }

            // Remove nodes where nodes' top y is greater than the end of this split section
            // if (node.x > filterTop) {
                if (node.x > filterTop) {
                    // console.log(`                                        - Remove top    Node Y: ${node.x}, Filter top: ${filterTop}`, node);
                return false; // Node doesn't belong to this split, remove it
            }

            // console.log(`                                        - Keep        Node Y: ${node.x}, Filter top: ${filterTop}`, node);
            // For nodes that remain in this split, reposition them within the split section
            // console.log(`                                   - Reposition    Node ${node.id}, Y: ${node.y}-> ${node.y - moveUp}, X: ${node.x} -> ${layer.y}`);
            // node.x = node.x - moveUp; // Adjust the y position by moving up
            node.y = layer.x; // Set the node's position relative to the new layer's y coordinate
            return true;
        });
    });
}

function repositionLayers(layers) {
    // Reposition the layers based on the highest layer
    let maxHeight = layers.reduce((max, layer) => Math.max(max, layer.height), 0);

    layers.forEach(layer => {
        console.log(`Repositioning layer ${layer.id}, Height: ${layer.height}, Max Height: ${maxHeight}`);
        layer.x = (maxHeight - layer.height) / 2; 
    });
}

function repositionNodes(layers) {
    const marginX = 40; // JS: todo: do something with a margin between layers

    // Reposition the nodes within the layers
    layers.forEach(layer => {
        let currentY = layer.y; // Initialize the current Y position for the nodes
        layer.nodes.forEach(node => {

            node.x = currentY; // Set the node's position relative to the new layer's y coordinate
            currentY += node.data.height + marginX;
        });
    });
}

// Main function to optimize layers based on the viewport ratio
function OptimizeLayers(dashboard) {
    let layers = dashboard.layers;
    const targetRatio = dashboard.main.view.width / dashboard.main.view.height;

    // Apply the optimization and splitting logic iteratively until the layout fits the target ratio
    let iterations = 0;
    let maxIterations = 24; // Limit iterations to prevent infinite loops
    let layoutAdjusted = true;

    while (layoutAdjusted && iterations < maxIterations) {
        console.log(`Iteration: ${iterations + 1}`);
        const initialLayerCount = layers.length;
        
        // Apply the split if necessary
        layers = applySplit(layers, dashboard.main.view.width, dashboard.main.view.height);

        // Check if any layers were split, i.e., if layout was adjusted
        layoutAdjusted = layers.length !== initialLayerCount;
        console.log(`Layout adjusted: `, layoutAdjusted, initialLayerCount, layers.length);

        iterations++;
    }

    reshuffelNodes(layers);
    repositionLayers(layers);
    repositionNodes(layers);

    // Assign the optimized layers back to the dashboard
    dashboard.layers = layers;

    console.log("Layers optimized based on viewport ratio");
}
