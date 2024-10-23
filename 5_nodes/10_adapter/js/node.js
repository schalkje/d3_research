import AdapterNode from "./nodeAdapter.js";
import GroupNode from "./nodeGroup.js";


  
// Function to create nodes with positioning and drag behavior
export function createNode(node, container)
{
    console.log("Creating Node:", node);
    switch (node.type) {
        case "group":
            const groupRootNode = new GroupNode(node, container);
            groupRootNode.render();
    
            break;
        case "adapter":
            const rootNode = new AdapterNode(node, container);
            rootNode.render();
            break;
        default:
            console.log("Unknown node type !!!!!");
    }
}
