#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Node Demo Test Runner
 * 
 * This script systematically tests all generated node demos to validate:
 * - File structure and completeness
 * - Data structure validity
 * - HTML structure compliance
 * - CSS file presence
 * - README documentation
 * - Test data files
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

class NodeDemoTester {
    constructor() {
        this.results = {
            total: 0,
            passed: 0,
            failed: 0,
            details: []
        };
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    testFileExists(filePath, description) {
        const exists = fs.existsSync(filePath);
        if (!exists) {
            this.log(`Missing file: ${filePath}`, 'error');
        }
        return exists;
    }

    testFileContent(filePath, validator, description) {
        if (!this.testFileExists(filePath, description)) {
            return false;
        }

        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const isValid = validator(content);
            
            if (!isValid) {
                this.log(`Invalid content in ${filePath}: ${description}`, 'error');
            }
            
            return isValid;
        } catch (error) {
            this.log(`Error reading ${filePath}: ${error.message}`, 'error');
            return false;
        }
    }

    testHtmlStructure(content) {
        const requiredElements = [
            '<!DOCTYPE html>',
            '<html lang="en">',
            '<head>',
            '<meta charset="UTF-8">',
            '<title>',
            '<link rel="stylesheet" href="../../dashboard/flowdash.css">',
'<script src="../../dashboard/libs/d3.min.js">',
            '<body>',
            '<svg id="graph" class="canvas">',
            '<script type="module">',
            'import { demoData } from',
            'import flowDashboard from',
            'new flowDashboard.Dashboard(demoData)',
            'flowdash.initialize'
        ];

        return requiredElements.every(element => content.includes(element));
    }

    testJsDataStructure(content) {
        const requiredElements = [
            'export const demoData = {',
            'metadata: {',
            'name:',
            'nodeType:',
            'settings: {',
            'nodes: [',
            'edges: ['
        ];

        return requiredElements.every(element => content.includes(element));
    }

    testCssStructure(content) {
        // Basic CSS validation - should contain some CSS rules
        return content.trim().length > 0 && (content.includes('{') || content.includes('/*'));
    }

    testReadmeStructure(content) {
        const requiredElements = [
            '# ',
            '## Description',
            '## Features',
            '## Usage',
            '## Testing'
        ];

        return requiredElements.every(element => content.includes(element));
    }

    testTestDataStructure(content) {
        try {
            const data = JSON.parse(content);
            return data && typeof data === 'object';
        } catch (error) {
            return false;
        }
    }

    testDemoStructure(nodeType, demoName = 'basic') {
        const category = categoryMap[nodeType];
        const demoPath = path.join(category, `01_${demoName}`);
        
        this.log(`Testing ${nodeType} demo in ${demoPath}`, 'info');
        
        const tests = [
            {
                name: 'HTML file exists and is valid',
                test: () => this.testFileContent(
                    path.join(demoPath, `${demoName}.html`),
                    this.testHtmlStructure,
                    'HTML structure validation'
                )
            },
            {
                name: 'JavaScript data file exists and is valid',
                test: () => this.testFileContent(
                    path.join(demoPath, 'js', 'graphData.js'),
                    this.testJsDataStructure,
                    'JavaScript data structure validation'
                )
            },
            {
                name: 'CSS file exists',
                test: () => this.testFileExists(
                    path.join(demoPath, 'css', 'demo.css'),
                    'CSS file presence'
                )
            },
            {
                name: 'README file exists and is valid',
                test: () => this.testFileContent(
                    path.join(demoPath, 'README.md'),
                    this.testReadmeStructure,
                    'README structure validation'
                )
            },
            {
                name: 'Test data file exists and is valid JSON',
                test: () => this.testFileContent(
                    path.join(demoPath, 'test-data.json'),
                    this.testTestDataStructure,
                    'Test data JSON validation'
                )
            }
        ];

        let passed = 0;
        const results = [];

        tests.forEach(test => {
            const result = test.test();
            results.push({
                name: test.name,
                passed: result
            });
            
            if (result) {
                passed++;
                this.log(`  ✅ ${test.name}`, 'success');
            } else {
                this.log(`  ❌ ${test.name}`, 'error');
            }
        });

        const allPassed = passed === tests.length;
        
        this.results.total++;
        if (allPassed) {
            this.results.passed++;
            this.log(`✅ ${nodeType} demo: ${passed}/${tests.length} tests passed`, 'success');
        } else {
            this.results.failed++;
            this.log(`❌ ${nodeType} demo: ${passed}/${tests.length} tests passed`, 'error');
        }

        this.results.details.push({
            nodeType,
            demoPath,
            passed,
            total: tests.length,
            allPassed,
            results
        });

        return allPassed;
    }

    runAllTests() {
        this.log('Starting comprehensive node demo testing...', 'info');
        this.log(`Testing ${nodeTypes.length} node types: ${nodeTypes.join(', ')}`, 'info');
        
        console.log('\n' + '='.repeat(60));
        
        nodeTypes.forEach(nodeType => {
            this.testDemoStructure(nodeType);
            console.log('-'.repeat(40));
        });

        this.printSummary();
    }

    printSummary() {
        console.log('\n' + '='.repeat(60));
        this.log('TESTING SUMMARY', 'info');
        console.log('='.repeat(60));
        
        this.log(`Total demos tested: ${this.results.total}`, 'info');
        this.log(`Passed: ${this.results.passed}`, 'success');
        this.log(`Failed: ${this.results.failed}`, this.results.failed > 0 ? 'error' : 'info');
        
        if (this.results.failed > 0) {
            console.log('\nFailed demos:');
            this.results.details
                .filter(detail => !detail.allPassed)
                .forEach(detail => {
                    this.log(`  - ${detail.nodeType}: ${detail.passed}/${detail.total} tests passed`, 'error');
                });
        }
        
        console.log('\n' + '='.repeat(60));
        
        if (this.results.failed === 0) {
            this.log('🎉 All node demos passed validation!', 'success');
        } else {
            this.log(`⚠️  ${this.results.failed} demo(s) need attention`, 'error');
        }
    }
}

// CLI handling
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const tester = new NodeDemoTester();
    tester.runAllTests();
}

export { NodeDemoTester };
