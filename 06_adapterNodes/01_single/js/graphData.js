//////////////////////////////////////////////////////////////
//
// Test Page: Single Adapter Node
// Node Type: adapter
// Features: Comprehensive single adapter testing with all child nodes
// Test Status: Ready for Testing
//

export const singleAdapter = {
    // Test metadata
    metadata: {
        name: "single-adapter",
        nodeType: "adapter", 
        features: [
            "Single adapter node",
            "Arrangement 3 (staging-focused)",
            "Full mode with all child nodes",
            "Internal edge connections",
            "Zone system integration"
        ],
        description: "Single adapter node with staging, archive, and transform nodes for comprehensive testing",
        testStatus: "Ready for Testing",
        version: "1.0.0"
    },
    
    // Dashboard settings
    settings: {
        // Display settings
        showCenterMark: false,
        showGrid: false,
        showGroupLabels: true,
        showGroupTitles: true,
        
        // Edge settings
        showGhostlines: false,
        curved: false,
        
        // Node settings
        showConnectionPoints: false,
        
        // Test-specific settings
        demoMode: true,
        enableTesting: true,
        debugMode: false
    },
    
    // Node definitions
    nodes: [
        {
            id: "bankview",
            label: "Bankview",
            code: "BNV",
            type: "adapter",
            
            // Layout configuration for arrangement 3 (staging-focused)
            layout: {
                mode: "full",           // Full adapter with all nodes
                arrangement: 3,         // Staging-focused layout
                displayMode: "full"     // Full display mode
            },
            
            // Node properties
            status: "active",
            state: "ready",
            
            // Auto-generated children (staging, archive, transform)
            // These will be created automatically by the AdapterNode class
            children: []
        }
    ],
    
    // Edge definitions (internal edges created automatically)
    edges: []
};

// Additional test data variations for different test scenarios
export const singleAdapterArrangement1 = {
    ...singleAdapter,
    metadata: {
        ...singleAdapter.metadata,
        name: "single-adapter-arrangement-1",
        description: "Single adapter with arrangement 1 (archive-focused)"
    },
    nodes: [
        {
            ...singleAdapter.nodes[0],
            id: "adapter-arr1",
            layout: {
                mode: "full",
                arrangement: 1,
                displayMode: "full"
            }
        }
    ]
};

export const singleAdapterArrangement2 = {
    ...singleAdapter,
    metadata: {
        ...singleAdapter.metadata,
        name: "single-adapter-arrangement-2", 
        description: "Single adapter with arrangement 2 (transform-focused)"
    },
    nodes: [
        {
            ...singleAdapter.nodes[0],
            id: "adapter-arr2",
            layout: {
                mode: "full",
                arrangement: 2,
                displayMode: "full"
            }
        }
    ]
};

export const singleAdapterStagingArchive = {
    ...singleAdapter,
    metadata: {
        ...singleAdapter.metadata,
        name: "single-adapter-staging-archive",
        description: "Single adapter with staging-archive mode"
    },
    nodes: [
        {
            ...singleAdapter.nodes[0],
            id: "adapter-stg-arc",
            layout: {
                mode: "staging-archive",
                arrangement: 4,
                displayMode: "full"
            }
        }
    ]
};

export const singleAdapterStagingTransform = {
    ...singleAdapter,
    metadata: {
        ...singleAdapter.metadata,
        name: "single-adapter-staging-transform",
        description: "Single adapter with staging-transform mode"
    },
    nodes: [
        {
            ...singleAdapter.nodes[0],
            id: "adapter-stg-tfm",
            layout: {
                mode: "staging-transform",
                arrangement: 4,
                displayMode: "full"
            }
        }
    ]
};

export const singleAdapterArchiveOnly = {
    ...singleAdapter,
    metadata: {
        ...singleAdapter.metadata,
        name: "single-adapter-archive-only",
        description: "Single adapter with archive-only mode"
    },
    nodes: [
        {
            ...singleAdapter.nodes[0],
            id: "adapter-arc-only",
            layout: {
                mode: "archive-only",
                arrangement: 5,
                displayMode: "full"
            }
        }
    ]
};

// Export all variations for comprehensive testing
export const allSingleAdapterVariations = {
    arrangement1: singleAdapterArrangement1,
    arrangement2: singleAdapterArrangement2,
    arrangement3: singleAdapter,
    stagingArchive: singleAdapterStagingArchive,
    stagingTransform: singleAdapterStagingTransform,
    archiveOnly: singleAdapterArchiveOnly
};

// Legacy exports for test-data-generator compatibility
export const layoutsRole = singleAdapter;  // Role-based layout (same as single for now)
export const singleAdapterData = singleAdapter;  // Backward compatibility
