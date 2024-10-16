### Functional Requirements for Network Graph Node Nesting

1. **Hierarchy Representation**:

   - **Parent-Child Relationship**: Nodes need to represent hierarchical relationships, with **parent nodes** acting as containers for **child nodes**. A child can only have one parent. Nesting can be multiple levels, allowing parents to also be children of higher-level nodes.
   - **Expandable/Collapsible Parent Nodes**: Users should be able to **expand** or **collapse** nested nodes to reveal or hide child nodes. When collapsed, the children are hidden and only the label is shown.
   - **Parent Size Adjustment**: Parent nodes should adjust their size dynamically based on the number and positioning of the children they contain. Parent size is adjusted when expanding/collapsing. 
   - **Dynamic canvas**: The entire layout is dynamic, and scales with the necessary room for all the nodes, so it resizes when parents or nodes are expanded or collapsed.

2. **Collision Handling**:

   - **Node-Level Collision**: Detect collisions at both individual node and **container level** to prevent overlap between nested structures and other nodes.
   - **Nested Collisions**: Child nodes should interact only within their container and not collide with nodes outside of their parent, unless there are specific external connections.

3. **Force Simulation Considerations**:

   - **Boundary Constraints**: Enforce both global boundaries for the canvas and **local boundaries** for parent nodes, ensuring children remain within their container.
   - **Force Distribution**: Adapt repulsion, attraction, and linking forces to respect the **nested contexts** and adjust interactions accordingly.

4. **Link Handling**:

   - **Internal vs External Links**: Distinguish between **internal links** (between nodes within the same parent) and **external links** (between nodes in different containers or between a parent and a child).
   - **Link Pathing**: Adapt paths for links that connect nodes across different containers to improve clarity and avoid overlapping boundaries.

5. **User Interaction**:

   - **Dragging and Zooming**: Allow users to **drag parent nodes** along with their children while maintaining relative positioning. Ensure children stay within their parent's boundaries when dragged.
   - **Zoom Behavior**: Adjust zoom to focus on specific areas, centering on a nested group if needed, while scaling nodes proportionally.

6. **Rendering**:

   - **Visual Nesting**: Use **shaded backgrounds** or **borders** to distinguish parent nodes from child nodes, making the containment relationship clear.
   - **Labels and Annotations**: Include labels for parent nodes to indicate their context, while child nodes also have distinct identifiers for better comprehension.

7. **Layout Requirements**
    - Layout within a group can be either dynamic or fixed
    - **Dynamic Layout**: Child nodes within a parent container are free to move and adjust their position based on forces like repulsion and attraction, allowing a flexible and self-organizing structure.
    - **Fixed Layout**: Child nodes maintain a fixed position relative to their parent container, ensuring a consistent and predictable structure. This may be preferable for scenarios where stability and clarity are prioritized over fluidity.
    - **Mixed Mode**: Consider allowing a mix of dynamic and fixed layouts within the same graph, depending on the level of nesting and the user interaction needs.Implementation Flow (High-Level)

### Implementation points

1) **Data Model Adjustments**:
   - Update the data model to include parent-child relationships with properties like `children` or `parentId`.
   - Position child nodes relative to their parent's coordinates.

2) **Collision and Boundary Forces**:
   - Modify existing collision and boundary forces to handle nested nodes and ensure context-aware behavior.

3) **Force Simulation Updates**:
   - Consider separate simulations for parents and children to ensure smooth interactions within and between nodes.

4) **Custom Forces for Nesting**:
   - Implement a **containment force** to keep child nodes within their parent's boundaries.
   - Add an **alignment force** to maintain a neat arrangement of child nodes within their parent.

### Challenges and Considerations

1. **Performance**: The additional forces and calculations due to nesting may impact performance, especially for large graphs. Optimization techniques like **quadtree** can be used to improve efficiency.

2. **Edge Cases**:

   - Handle cyclic relationships carefully to maintain hierarchical integrity.
   - Ensure proper sizing and alignment of nodes in mixed nested and non-nested structures.

3. **User Experience**:

   - Provide clear **visual cues** to differentiate between parent and child nodes.
   - Efficiently manage zoom and pan behaviors to facilitate smooth navigation through nested structures.
