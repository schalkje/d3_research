#!/usr/bin/env node

/**
 * Test Data Generator for Playwright Tests
 * 
 * This script extracts test data from existing HTML test pages and converts them
 * to JSON files that can be used by Playwright tests.
 * 
 * Usage: node test-data-generator.js
 */

const fs = require('fs');
const path = require('path');

// Define the test scenarios to extract
const testScenarios = [
  // Edge scenarios
  {
    name: 'edge-simple',
    source: '../4_edges/40_edges/js/graphData.js',
    export: 'testDashboard1',
    description: 'Simple edge between two nodes'
  },
  {
    name: 'edge-nodes',
    source: '../4_edges/40_edges/js/graphData.js',
    export: 'testDashboard2',
    description: 'Edge connecting different node types'
  },
  {
    name: 'edge-demo',
    source: '../4_edges/40_edges/js/graphData.js',
    export: 'edgeDemo',
    description: 'Edge demo layouts'
  },
  {
    name: 'edge-curved',
    source: '../4_edges/40_edges/js/graphData.js',
    export: 'curvedEdgeDemo',
    description: 'Curved edge rendering'
  },
  {
    name: 'edge-columns',
    source: '../4_edges/40_edges/js/graphData.js',
    export: 'columnEdgeDemo',
    description: 'Edges in column layouts'
  },
  {
    name: 'edge-adapter-columns',
    source: '../4_edges/40_edges/js/graphData.js',
    export: 'adaptedColumnEdgeDemo',
    description: 'Edges connecting adapter nodes in columns'
  },
  {
    name: 'edge-columns-lane',
    source: '../4_edges/40_edges/js/graphData.js',
    export: 'columnsWithLane1',
    description: 'Edges in mixed column-lane layouts'
  },

  // Node scenarios
  {
    name: 'node-adapter-single',
    source: '../06_adapterNodes/01_single/js/graphData.js',
    export: 'singleAdapter',
    description: 'Single adapter node'
  },
  {
    name: 'node-adapter-layouts',
    source: '../06_adapterNodes/02_layouts_full/js/graphData.js',
    export: 'multipleLayoutsData',
    description: 'Adapter nodes with full layouts'
  },
  {
    name: 'node-adapter-role',
    source: '../06_adapterNodes/01_single/js/graphData.js',
    export: 'layoutsRole',
    description: 'Adapter nodes with role layouts'
  },
  {
    name: 'node-foundation-single',
    source: '../5_nodes/11_foundation/js/graphData.js',
    export: 'singleFoundation',
    description: 'Single foundation node'
  },
  {
    name: 'node-foundation-multiple',
    source: '../5_nodes/11_foundation/js/graphData.js',
    export: 'multipleFoundation',
    description: 'Multiple foundation nodes'
  },

  // Group scenarios
  {
    name: 'group-simple',
    source: '../6_groups/60_grouping/js/graphData.js',
    export: 'simple',
    description: 'Simple group with child nodes'
  },
  {
    name: 'group-nested',
    source: '../6_groups/60_grouping/js/graphData.js',
    export: 'nested',
    description: 'Nested groups'
  },
  {
    name: 'lane-simple',
    source: '../6_groups/61_lane/js/graphData.js',
    export: 'simpleLane',
    description: 'Simple lane layout'
  },
  {
    name: 'lane-adapters',
    source: '../6_groups/61_lane/js/graphData.js',
    export: 'threeAdapters',
    description: 'Multiple adapters in lane'
  },
  {
    name: 'columns-simple',
    source: '../6_groups/62_columns/js/graphData.js',
    export: 'simpleColumns',
    description: 'Simple column layout'
  },
  {
    name: 'columns-adapters',
    source: '../6_groups/62_columns/js/graphData.js',
    export: 'adaptersInColumns',
    description: 'Adapters in columns'
  }
];

// Create output directory
const outputDir = path.join(__dirname, '../data/test-scenarios');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Extract JavaScript module and convert to JSON
 */
function extractTestData(sourcePath, exportName) {
  try {
    // Read the source file
    const fullPath = path.join(__dirname, sourcePath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`Warning: Source file not found: ${fullPath}`);
      return null;
    }

    const sourceCode = fs.readFileSync(fullPath, 'utf8');
    
    // Simple regex to extract the export
    // This is a basic implementation - in production you might want to use a proper JS parser
    const exportPattern = new RegExp(`export const ${exportName} = ({[\\s\\S]*?});`, 'm');
    const match = sourceCode.match(exportPattern);
    
    if (!match) {
      console.warn(`Warning: Export '${exportName}' not found in ${sourcePath}`);
      return null;
    }

    // Convert the JavaScript object to JSON
    // This is a simplified approach - you might need more sophisticated parsing
    let jsonString = match[1];
    
    // Remove comments
    jsonString = jsonString.replace(/\/\*[\s\S]*?\*\//g, '');
    jsonString = jsonString.replace(/\/\/.*$/gm, '');
    
    // Convert JavaScript object to valid JSON
    jsonString = jsonString
      .replace(/(\w+):/g, '"$1":') // Quote property names
      .replace(/'/g, '"') // Replace single quotes with double quotes
      .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
    
    try {
      const data = JSON.parse(jsonString);
      return data;
    } catch (parseError) {
      console.warn(`Warning: Could not parse JSON for ${exportName}: ${parseError.message}`);
      return null;
    }
  } catch (error) {
    console.error(`Error processing ${sourcePath}: ${error.message}`);
    return null;
  }
}

/**
 * Generate test data files
 */
function generateTestData() {
  console.log('Generating test data files...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const scenario of testScenarios) {
    console.log(`Processing: ${scenario.name} (${scenario.description})`);
    
    const data = extractTestData(scenario.source, scenario.export);
    
    if (data) {
      const outputPath = path.join(outputDir, `${scenario.name}.json`);
      
      try {
        // Add metadata to the JSON
        const testData = {
          _metadata: {
            name: scenario.name,
            description: scenario.description,
            source: scenario.source,
            export: scenario.export,
            generated: new Date().toISOString()
          },
          ...data
        };
        
        fs.writeFileSync(outputPath, JSON.stringify(testData, null, 2));
        console.log(`  ✓ Generated: ${outputPath}`);
        successCount++;
      } catch (writeError) {
        console.error(`  ✗ Error writing file: ${writeError.message}`);
        errorCount++;
      }
    } else {
      console.log(`  ✗ Failed to extract data`);
      errorCount++;
    }
  }
  
  console.log(`\nGeneration complete:`);
  console.log(`  Success: ${successCount}`);
  console.log(`  Errors: ${errorCount}`);
  console.log(`  Output directory: ${outputDir}`);
}

/**
 * Generate a test data index file
 */
function generateIndex() {
  const indexPath = path.join(outputDir, 'index.json');
  
  const index = {
    generated: new Date().toISOString(),
    scenarios: testScenarios.map(scenario => ({
      name: scenario.name,
      description: scenario.description,
      filename: `${scenario.name}.json`,
      source: scenario.source,
      export: scenario.export
    }))
  };
  
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  console.log(`\nGenerated index: ${indexPath}`);
}

/**
 * Generate a README file for the test data
 */
function generateReadme() {
  const readmePath = path.join(outputDir, 'README.md');
  
  let readme = `# Test Data for Playwright Tests

This directory contains test data files generated from existing HTML test scenarios.

## Generated Files

`;
  
  for (const scenario of testScenarios) {
    readme += `### ${scenario.name}.json
- **Description**: ${scenario.description}
- **Source**: \`${scenario.source}\`
- **Export**: \`${scenario.export}\`

`;
  }
  
  readme += `## Usage in Playwright Tests

\`\`\`javascript
// Load test data in Playwright tests
await page.selectOption('#fileSelect', { label: '${testScenarios[0].name}.json' });
await page.waitForSelector('g.node-container');
\`\`\`

## Regeneration

To regenerate these files, run:

\`\`\`bash
node tests/test-data-generator.js
\`\`\`

## Notes

- These files are automatically generated from existing test scenarios
- Each file includes metadata about its source and generation time
- The data structure matches the dashboard's expected format
`;

  fs.writeFileSync(readmePath, readme);
  console.log(`Generated README: ${readmePath}`);
}

// Main execution
if (require.main === module) {
  generateTestData();
  generateIndex();
  generateReadme();
}

module.exports = {
  testScenarios,
  extractTestData,
  generateTestData
}; 