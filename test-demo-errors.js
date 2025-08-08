#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Demo Error Detection Script
 * 
 * This script helps identify specific errors in the demos by:
 * 1. Checking file structure and content
 * 2. Validating node type registration
 * 3. Testing data structure integrity
 * 4. Providing detailed error reports
 */

const nodeTypes = [
    'node',
    'rect', 
    'circle',
    'lane',
    'columns',
    'adapter',
    'foundation',
    'mart',
    'group',
    'edge-demo'
];

const categoryMap = {
    'node': '01_basicNodes',
    'rect': '02_rectangularNodes',
    'circle': '03_circleNodes',
    'lane': '04_laneNodes',
    'columns': '05_columnsNodes',
    'adapter': '06_adapterNodes',
    'foundation': '07_foundationNodes',
    'mart': '08_martNodes',
    'group': '09_groupNodes',
    'edge-demo': '10_edgeDemoNodes'
};

class DemoErrorDetector {
    constructor() {
        this.results = [];
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    testNodeTypeRegistration(nodeType) {
        this.log(`Testing node type registration: ${nodeType}`, 'info');
        
        // Check if the node type is registered in the dashboard
        const nodeRegistryPath = path.join('7_dashboard', 'js', 'node.js');
        
        if (!fs.existsSync(nodeRegistryPath)) {
            this.log(`Node registry not found: ${nodeRegistryPath}`, 'error');
            return false;
        }
        
        const nodeRegistryContent = fs.readFileSync(nodeRegistryPath, 'utf8');
        const isRegistered = nodeRegistryContent.includes(`registerNodeType('${nodeType}'`);
        
        if (isRegistered) {
            this.log(`✅ Node type '${nodeType}' is registered`, 'success');
        } else {
            this.log(`❌ Node type '${nodeType}' is NOT registered`, 'error');
        }
        
        return isRegistered;
    }

    testDemoDataStructure(nodeType) {
        const category = categoryMap[nodeType];
        const demoPath = path.join(category, '01_basic');
        const dataPath = path.join(demoPath, 'js', 'graphData.js');
        
        this.log(`Testing demo data structure for: ${nodeType}`, 'info');
        
        if (!fs.existsSync(dataPath)) {
            this.log(`❌ Demo data file not found: ${dataPath}`, 'error');
            return false;
        }
        
        try {
            // Read the data file
            const dataContent = fs.readFileSync(dataPath, 'utf8');
            
            // Check if it exports demoData
            if (!dataContent.includes('export const demoData')) {
                this.log(`❌ Demo data file doesn't export demoData`, 'error');
                return false;
            }
            
            // Check if the node type is correctly set
            if (!dataContent.includes(`type: "${nodeType}"`)) {
                this.log(`❌ Node type mismatch in data file`, 'error');
                this.log(`  Expected: "${nodeType}", but data file may have different type`, 'error');
                return false;
            }
            
            this.log(`✅ Demo data structure is valid`, 'success');
            return true;
            
        } catch (error) {
            this.log(`❌ Error reading demo data: ${error.message}`, 'error');
            return false;
        }
    }

    testHtmlStructure(nodeType) {
        const category = categoryMap[nodeType];
        const demoPath = path.join(category, '01_basic');
        const htmlPath = path.join(demoPath, 'basic.html');
        
        this.log(`Testing HTML structure for: ${nodeType}`, 'info');
        
        if (!fs.existsSync(htmlPath)) {
            this.log(`❌ HTML file not found: ${htmlPath}`, 'error');
            return false;
        }
        
        try {
            const htmlContent = fs.readFileSync(htmlPath, 'utf8');
            
            // Check for required elements
            const requiredElements = [
                '<svg id="graph"',
                'import { demoData }',
                'import flowDashboard',
                'new flowDashboard.Dashboard(demoData)',
                'flowdash.initialize'
            ];
            
            const missingElements = requiredElements.filter(element => 
                !htmlContent.includes(element)
            );
            
            if (missingElements.length > 0) {
                this.log(`❌ Missing required elements:`, 'error');
                missingElements.forEach(element => {
                    this.log(`  - ${element}`, 'error');
                });
                return false;
            }
            
            this.log(`✅ HTML structure is valid`, 'success');
            return true;
            
        } catch (error) {
            this.log(`❌ Error reading HTML file: ${error.message}`, 'error');
            return false;
        }
    }

    testDemo(nodeType) {
        this.log(`\n${'='.repeat(50)}`, 'info');
        this.log(`Testing demo: ${nodeType}`, 'info');
        this.log(`${'='.repeat(50)}`, 'info');
        
        const results = {
            nodeType,
            nodeTypeRegistered: this.testNodeTypeRegistration(nodeType),
            dataStructureValid: this.testDemoDataStructure(nodeType),
            htmlStructureValid: this.testHtmlStructure(nodeType)
        };
        
        // Summary for this demo
        const allValid = results.nodeTypeRegistered && results.dataStructureValid && results.htmlStructureValid;
        
        if (allValid) {
            this.log(`✅ ${nodeType} demo: All tests passed`, 'success');
        } else {
            this.log(`❌ ${nodeType} demo: Some tests failed`, 'error');
        }
        
        this.results.push(results);
        
        return allValid;
    }

    runAllTests() {
        this.log('Starting demo error detection...', 'info');
        this.log(`Testing ${nodeTypes.length} node types: ${nodeTypes.join(', ')}`, 'info');
        
        let passed = 0;
        let failed = 0;
        
        nodeTypes.forEach(nodeType => {
            if (this.testDemo(nodeType)) {
                passed++;
            } else {
                failed++;
            }
        });
        
        this.printSummary(passed, failed);
    }

    printSummary(passed, failed) {
        console.log('\n' + '='.repeat(60));
        this.log('DEMO ERROR DETECTION SUMMARY', 'info');
        console.log('='.repeat(60));
        
        this.log(`Total demos tested: ${nodeTypes.length}`, 'info');
        this.log(`Passed: ${passed}`, 'success');
        this.log(`Failed: ${failed}`, failed > 0 ? 'error' : 'info');
        
        if (failed > 0) {
            console.log('\nFailed demos:');
            this.results
                .filter(result => !(result.nodeTypeRegistered && result.dataStructureValid && result.htmlStructureValid))
                .forEach(result => {
                    this.log(`  - ${result.nodeType}:`, 'error');
                    if (!result.nodeTypeRegistered) {
                        this.log(`    ❌ Node type not registered`, 'error');
                    }
                    if (!result.dataStructureValid) {
                        this.log(`    ❌ Data structure invalid`, 'error');
                    }
                    if (!result.htmlStructureValid) {
                        this.log(`    ❌ HTML structure invalid`, 'error');
                    }
                });
        }
        
        console.log('\n' + '='.repeat(60));
        
        if (failed === 0) {
            this.log('🎉 All demos passed validation!', 'success');
        } else {
            this.log(`⚠️  ${failed} demo(s) need attention`, 'error');
            this.log('\nNext steps:', 'info');
            this.log('1. Check the node registry in 7_dashboard/js/node.js', 'info');
            this.log('2. Verify node type names match between data and registry', 'info');
            this.log('3. Test demos manually in browser at http://localhost:8000', 'info');
        }
    }
}

// CLI handling
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const detector = new DemoErrorDetector();
    detector.runAllTests();
}

export { DemoErrorDetector };
