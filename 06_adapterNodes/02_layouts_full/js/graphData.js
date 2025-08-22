//////////////////////////////////////////////////////////////
//
// Test Page: Multiple Adapter Layouts
// Node Type: adapter (multiple instances)
// Features: Comprehensive layout testing with all arrangements and modes
// Test Status: Ready for Testing
//

export const multipleLayoutsData = {
    // Test metadata
    metadata: {
        name: "multiple-adapter-layouts",
        nodeType: "adapter",
        features: [
            "Multiple adapter nodes",
            "All 5 layout arrangements",
            "Different adapter modes",
            "Comprehensive layout testing",
            "Zone system validation"
        ],
        description: "Multiple adapter nodes showcasing all layout arrangements and modes",
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
    
    // Node definitions - showcasing different arrangements
    nodes: [
        // Arrangement 1: Archive-focused (full mode)
        {
            id: "adapter-arr1",
            label: "Arrangement 1",
            code: "AR1",
            type: "adapter",
            x: 100,
            y: 100,
            layout: {
                mode: "full",
                arrangement: 1,
                displayMode: "full"
            },
            status: "active"
        },
        
        // Arrangement 2: Transform-focused (full mode)
        {
            id: "adapter-arr2", 
            label: "Arrangement 2",
            code: "AR2",
            type: "adapter",
            x: 500,
            y: 100,
            layout: {
                mode: "full",
                arrangement: 2,
                displayMode: "full"
            },
            status: "active"
        },
        
        // Arrangement 3: Staging-focused (full mode)
        {
            id: "adapter-arr3",
            label: "Arrangement 3", 
            code: "AR3",
            type: "adapter",
            x: 100,
            y: 300,
            layout: {
                mode: "full",
                arrangement: 3,
                displayMode: "full"
            },
            status: "active"
        },
        
        // Arrangement 4: Staging-Archive mode
        {
            id: "adapter-stg-arc",
            label: "Staging-Archive",
            code: "SA",
            type: "adapter",
            x: 500,
            y: 300,
            layout: {
                mode: "staging-archive",
                arrangement: 4,
                displayMode: "full"
            },
            status: "active"
        },
        
        // Arrangement 4: Staging-Transform mode
        {
            id: "adapter-stg-tfm",
            label: "Staging-Transform",
            code: "ST", 
            type: "adapter",
            x: 100,
            y: 500,
            layout: {
                mode: "staging-transform",
                arrangement: 4,
                displayMode: "full"
            },
            status: "active"
        },
        
        // Arrangement 5: Archive-only mode
        {
            id: "adapter-arc-only",
            label: "Archive Only",
            code: "AO",
            type: "adapter",
            x: 500,
            y: 500,
            layout: {
                mode: "archive-only",
                arrangement: 5,
                displayMode: "full"
            },
            status: "active"
        }
    ],
    
    // Edge definitions (internal edges created automatically)
    edges: []
};

// Layout Variation 1: All Full Mode Arrangements
export const allFullArrangements = {
    ...multipleLayoutsData,
    metadata: {
        ...multipleLayoutsData.metadata,
        name: "all-full-arrangements",
        description: "All 3 full mode arrangements (1, 2, 3)"
    },
    nodes: [
        {
            id: "full-arr1",
            label: "Full Arrangement 1",
            code: "F1",
            type: "adapter",
            x: 100,
            y: 150,
            layout: { mode: "full", arrangement: 1, displayMode: "full" },
            status: "active"
        },
        {
            id: "full-arr2",
            label: "Full Arrangement 2", 
            code: "F2",
            type: "adapter",
            x: 400,
            y: 150,
            layout: { mode: "full", arrangement: 2, displayMode: "full" },
            status: "active"
        },
        {
            id: "full-arr3",
            label: "Full Arrangement 3",
            code: "F3", 
            type: "adapter",
            x: 700,
            y: 150,
            layout: { mode: "full", arrangement: 3, displayMode: "full" },
            status: "active"
        }
    ]
};

// Layout Variation 2: Two-Node Modes
export const twoNodeModes = {
    ...multipleLayoutsData,
    metadata: {
        ...multipleLayoutsData.metadata,
        name: "two-node-modes",
        description: "Staging-archive and staging-transform modes"
    },
    nodes: [
        {
            id: "two-stg-arc",
            label: "Staging-Archive",
            code: "SA",
            type: "adapter",
            x: 200,
            y: 200,
            layout: { mode: "staging-archive", arrangement: 4, displayMode: "full" },
            status: "active"
        },
        {
            id: "two-stg-tfm", 
            label: "Staging-Transform",
            code: "ST",
            type: "adapter",
            x: 500,
            y: 200,
            layout: { mode: "staging-transform", arrangement: 4, displayMode: "full" },
            status: "active"
        }
    ]
};

// Layout Variation 3: Single Node Mode
export const singleNodeMode = {
    ...multipleLayoutsData,
    metadata: {
        ...multipleLayoutsData.metadata,
        name: "single-node-mode",
        description: "Archive-only mode demonstration"
    },
    nodes: [
        {
            id: "single-arc-1",
            label: "Archive Only 1",
            code: "A1",
            type: "adapter",
            x: 200,
            y: 150,
            layout: { mode: "archive-only", arrangement: 5, displayMode: "full" },
            status: "active"
        },
        {
            id: "single-arc-2",
            label: "Archive Only 2", 
            code: "A2",
            type: "adapter",
            x: 500,
            y: 150,
            layout: { mode: "archive-only", arrangement: 5, displayMode: "full" },
            status: "active"
        }
    ]
};

// Layout Variation 4: Mixed Display Modes
export const mixedDisplayModes = {
    ...multipleLayoutsData,
    metadata: {
        ...multipleLayoutsData.metadata,
        name: "mixed-display-modes",
        description: "Different display modes (full, role)"
    },
    nodes: [
        {
            id: "mixed-full",
            label: "Full Display Mode",
            code: "FDM",
            type: "adapter",
            x: 150,
            y: 150,
            layout: { mode: "full", arrangement: 3, displayMode: "full" },
            status: "active"
        },
        {
            id: "mixed-role",
            label: "Role Display Mode",
            code: "RDM", 
            type: "adapter",
            x: 500,
            y: 150,
            layout: { mode: "full", arrangement: 3, displayMode: "role" },
            status: "active"
        }
    ]
};

// Layout Variation 5: Comprehensive Grid
export const comprehensiveGrid = {
    ...multipleLayoutsData,
    metadata: {
        ...multipleLayoutsData.metadata,
        name: "comprehensive-grid",
        description: "Grid layout showcasing all major combinations"
    },
    nodes: [
        // Top row: Full arrangements
        {
            id: "grid-f1",
            label: "F-Arr1",
            code: "F1",
            type: "adapter",
            x: 100,
            y: 100,
            layout: { mode: "full", arrangement: 1, displayMode: "full" },
            status: "active"
        },
        {
            id: "grid-f2",
            label: "F-Arr2",
            code: "F2", 
            type: "adapter",
            x: 350,
            y: 100,
            layout: { mode: "full", arrangement: 2, displayMode: "full" },
            status: "active"
        },
        {
            id: "grid-f3",
            label: "F-Arr3",
            code: "F3",
            type: "adapter",
            x: 600,
            y: 100,
            layout: { mode: "full", arrangement: 3, displayMode: "full" },
            status: "active"
        },
        
        // Bottom row: Specialized modes
        {
            id: "grid-sa",
            label: "Stg-Arc",
            code: "SA",
            type: "adapter",
            x: 150,
            y: 350,
            layout: { mode: "staging-archive", arrangement: 4, displayMode: "full" },
            status: "active"
        },
        {
            id: "grid-st",
            label: "Stg-Tfm",
            code: "ST",
            type: "adapter",
            x: 400,
            y: 350,
            layout: { mode: "staging-transform", arrangement: 4, displayMode: "full" },
            status: "active"
        },
        {
            id: "grid-ao",
            label: "Arc-Only",
            code: "AO",
            type: "adapter",
            x: 650,
            y: 350,
            layout: { mode: "archive-only", arrangement: 5, displayMode: "full" },
            status: "active"
        }
    ]
};

// Export all layout variations for cycling and testing
export const layoutVariations = {
    default: multipleLayoutsData,
    allFull: allFullArrangements,
    twoNode: twoNodeModes,
    singleNode: singleNodeMode,
    mixedDisplay: mixedDisplayModes,
    comprehensive: comprehensiveGrid
};

// Export layout metadata for documentation and testing
export const layoutMetadata = {
    arrangements: {
        1: {
            name: "Archive-focused",
            description: "Staging bottom-left, archive top-right, transform bottom-right",
            mode: "full",
            nodes: ["staging", "archive", "transform"]
        },
        2: {
            name: "Transform-focused", 
            description: "Staging/archive top row, transform bottom spanning",
            mode: "full",
            nodes: ["staging", "archive", "transform"]
        },
        3: {
            name: "Staging-focused",
            description: "Staging left spanning, archive/transform stacked right", 
            mode: "full",
            nodes: ["staging", "archive", "transform"]
        },
        4: {
            name: "Two-node horizontal",
            description: "Linear arrangement for two-node modes",
            mode: ["staging-archive", "staging-transform"],
            nodes: ["varies by mode"]
        },
        5: {
            name: "Single node centered",
            description: "Archive node centered in container",
            mode: "archive-only",
            nodes: ["archive"]
        }
    },
    modes: {
        "full": {
            description: "Complete adapter with staging, archive, and transform nodes",
            arrangements: [1, 2, 3],
            defaultArrangement: 1
        },
        "staging-archive": {
            description: "Two-node adapter with staging and archive only",
            arrangements: [4],
            defaultArrangement: 4
        },
        "staging-transform": {
            description: "Two-node adapter with staging and transform only", 
            arrangements: [4],
            defaultArrangement: 4
        },
        "archive-only": {
            description: "Single-node adapter with archive only",
            arrangements: [5],
            defaultArrangement: 5
        }
    }
};
