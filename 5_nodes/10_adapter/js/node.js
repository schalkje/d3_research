import AdapterNode from "./nodeAdapter.js";
import ParentNode from "./nodeParent.js";

// Function to create nodes with positioning and drag behavior
export function createNode(node, container)
{
    // create a switch base on: dataModel[0]
    console.log("Creating Node:", node);
    switch (node.type) {
        case "group":
            const groupRootNode = new ParentNode(node, container);
            groupRootNode.render();
    
            break;
        case "adapter":
            const rootNode = new AdapterNode(node, container);
            rootNode.render();

            // Center coordinates for the root node
            const centerX = 400;
            const centerY = 300;
            // Set initial position of the root node to the center of the canvas
            container.select(`[data-id='${node.id}']`).attr('transform', `translate(${centerX}, ${centerY})`);

            break;
        default:
            console.log("Unknown node type !!!!!");
    }
}
