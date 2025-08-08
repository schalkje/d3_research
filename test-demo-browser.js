#!/usr/bin/env node

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Browser-based Demo Test Runner
 * 
 * This script uses Playwright to test the demos in a real browser environment,
 * verifying that they load correctly and render nodes without errors.
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

class BrowserDemoTester {
    constructor() {
        this.results = {
            total: 0,
            passed: 0,
            failed: 0,
            details: []
        };
        this.browser = null;
        this.page = null;
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    async initialize() {
        this.log('Starting browser...', 'info');
        this.browser = await chromium.launch({ 
            headless: false, // Set to true for CI/CD
            slowMo: 1000 // Slow down for debugging
        });
        this.page = await this.browser.newPage();
        
        // Set viewport
        await this.page.setViewportSize({ width: 1200, height: 800 });
        
        this.log('Browser started successfully', 'success');
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
            this.log('Browser closed', 'info');
        }
    }

    async testDemo(nodeType, demoName = 'basic') {
        const category = categoryMap[nodeType];
        const demoPath = path.join(category, `01_${demoName}`);
        const htmlPath = path.join(demoPath, `${demoName}.html`);
        
        this.log(`Testing ${nodeType} demo: ${htmlPath}`, 'info');
        
        try {
            // Navigate to the demo page using HTTP server
            const httpUrl = `http://localhost:8000/${htmlPath.replace(/\\/g, '/')}`;
            await this.page.goto(httpUrl, { waitUntil: 'networkidle' });
            
            // Wait for the dashboard to initialize
            await this.page.waitForSelector('#graph', { timeout: 10000 });
            
            // Collect console errors and logs
            const errors = [];
            const logs = [];
            
            this.page.on('console', msg => {
                if (msg.type() === 'error') {
                    errors.push(msg.text());
                } else if (msg.type() === 'log') {
                    logs.push(msg.text());
                }
            });
            
            // Wait for any initial errors
            await this.page.waitForTimeout(1000);
            
            // Wait a bit for any potential errors to appear
            await this.page.waitForTimeout(3000);
            
            // Check if nodes are rendered
            const nodeCount = await this.page.evaluate(() => {
                const nodes = document.querySelectorAll('.node');
                return nodes.length;
            });
            
            // Check if the dashboard initialized properly
            const dashboardInitialized = await this.page.evaluate(() => {
                return window.flowdash && typeof window.flowdash.initialize === 'function';
            });
            
            // Check for specific error patterns
            const hasUnknownNodeTypeError = errors.some(error => 
                error.includes('Unknown node type') || 
                error.includes('Cannot read properties of null') ||
                error.includes('Cannot read properties of undefined')
            );
            
            // Check for specific node type rendering
            const nodeTypeRendered = await this.page.evaluate((type) => {
                const nodes = document.querySelectorAll('.node');
                return nodes.length > 0; // Basic check - nodes exist
            }, nodeType);
            
            // Check if the demo data is loaded correctly
            const demoDataLoaded = await this.page.evaluate(() => {
                return window.demoData && window.demoData.nodes && window.demoData.nodes.length > 0;
            });
            
            // Check the actual node type in the data
            const actualNodeType = await this.page.evaluate(() => {
                if (window.demoData && window.demoData.nodes && window.demoData.nodes.length > 0) {
                    return window.demoData.nodes[0].type;
                }
                return null;
            });
            
            const hasErrors = errors.length > 0;
            const passed = !hasUnknownNodeTypeError && dashboardInitialized && nodeTypeRendered && demoDataLoaded;
            
            if (passed) {
                this.results.passed++;
                this.log(`✅ ${nodeType} demo: Loaded successfully, ${nodeCount} nodes rendered`, 'success');
                if (actualNodeType) {
                    this.log(`  Node type in data: ${actualNodeType}`, 'info');
                }
            } else {
                this.results.failed++;
                this.log(`❌ ${nodeType} demo: Failed to load properly`, 'error');
                
                if (hasUnknownNodeTypeError) {
                    this.log(`  ❌ Unknown node type error detected`, 'error');
                    errors.forEach(error => {
                        if (error.includes('Unknown node type') || 
                            error.includes('Cannot read properties of null') ||
                            error.includes('Cannot read properties of undefined')) {
                            this.log(`    Error: ${error}`, 'error');
                        }
                    });
                }
                
                if (!dashboardInitialized) {
                    this.log(`  ❌ Dashboard not initialized`, 'error');
                }
                
                if (!nodeTypeRendered) {
                    this.log(`  ❌ No nodes rendered`, 'error');
                }
                
                if (!demoDataLoaded) {
                    this.log(`  ❌ Demo data not loaded`, 'error');
                }
                
                if (actualNodeType) {
                    this.log(`  Node type in data: ${actualNodeType}`, 'info');
                }
                
                // Log all errors for debugging
                if (errors.length > 0) {
                    this.log(`  Console errors (${errors.length}):`, 'error');
                    errors.forEach(error => this.log(`    ${error}`, 'error'));
                }
                
                // Log console logs for debugging
                if (logs.length > 0) {
                    this.log(`  Console logs (${logs.length}):`, 'info');
                    logs.forEach(log => this.log(`    ${log}`, 'info'));
                }
            }
            
            this.results.total++;
            this.results.details.push({
                nodeType,
                demoPath,
                passed,
                nodeCount,
                errors: errors.length,
                dashboardInitialized,
                nodeTypeRendered,
                demoDataLoaded,
                actualNodeType,
                errorDetails: errors
            });
            
            return passed;
            
        } catch (error) {
            this.results.failed++;
            this.results.total++;
            this.log(`❌ ${nodeType} demo: Error during testing - ${error.message}`, 'error');
            
            this.results.details.push({
                nodeType,
                demoPath,
                passed: false,
                error: error.message
            });
            
            return false;
        }
    }

    async runAllTests() {
        this.log('Starting browser-based demo testing...', 'info');
        this.log(`Testing ${nodeTypes.length} node types: ${nodeTypes.join(', ')}`, 'info');
        
        try {
            await this.initialize();
            
            console.log('\n' + '='.repeat(60));
            
            for (const nodeType of nodeTypes) {
                await this.testDemo(nodeType);
                console.log('-'.repeat(40));
            }
            
            this.printSummary();
            
        } catch (error) {
            this.log(`Fatal error during testing: ${error.message}`, 'error');
        } finally {
            await this.cleanup();
        }
    }

    printSummary() {
        console.log('\n' + '='.repeat(60));
        this.log('BROWSER TESTING SUMMARY', 'info');
        console.log('='.repeat(60));
        
        this.log(`Total demos tested: ${this.results.total}`, 'info');
        this.log(`Passed: ${this.results.passed}`, 'success');
        this.log(`Failed: ${this.results.failed}`, this.results.failed > 0 ? 'error' : 'info');
        
        if (this.results.failed > 0) {
            console.log('\nFailed demos:');
            this.results.details
                .filter(detail => !detail.passed)
                .forEach(detail => {
                    this.log(`  - ${detail.nodeType}: ${detail.error || 'Unknown error'}`, 'error');
                    if (detail.actualNodeType) {
                        this.log(`    Data node type: ${detail.actualNodeType}`, 'info');
                    }
                    if (detail.errorDetails && detail.errorDetails.length > 0) {
                        this.log(`    Errors: ${detail.errorDetails.join(', ')}`, 'error');
                    }
                });
        }
        
        console.log('\n' + '='.repeat(60));
        
        if (this.results.failed === 0) {
            this.log('🎉 All node demos passed browser testing!', 'success');
        } else {
            this.log(`⚠️  ${this.results.failed} demo(s) need attention`, 'error');
        }
    }
}

// CLI handling
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const tester = new BrowserDemoTester();
    tester.runAllTests();
}

export { BrowserDemoTester };
