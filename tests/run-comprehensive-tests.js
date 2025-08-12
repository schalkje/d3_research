#!/usr/bin/env node

/**
 * Comprehensive Test Runner for LaneNodes and ColumnsNodes
 * 
 * This script runs the comprehensive test suites for both node types,
 * testing positioning, sizing, collapsing, and expanding functionality.
 * 
 * Usage:
 *   node tests/run-comprehensive-tests.js
 *   npm run test:comprehensive
 */

import { execSync } from 'child_process';
import path from 'path';

// Test configuration
const testConfig = {
  // Test files to run
  testFiles: [
    'tests/lane-nodes-comprehensive.spec.js',
    'tests/columns-nodes-comprehensive.spec.js'
  ],
  
  // Playwright options
  playwrightOptions: {
    workers: 1,           // Run tests sequentially for stability
    timeout: 60000,       // 60 second timeout per test
    retries: 1,           // Retry failed tests once
    reporter: 'list'      // Use list reporter for clear output
  },
  
  // Test categories
  testCategories: {
    lane: {
      name: 'LaneNode Tests',
      description: 'Vertical stacking container tests',
      testCount: 15
    },
    columns: {
      name: 'ColumnsNode Tests', 
      description: 'Horizontal row container tests',
      testCount: 18
    }
  }
};

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Utility functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(title) {
  const separator = '='.repeat(80);
  log(`\n${separator}`, 'bright');
  log(`  ${title}`, 'bright');
  log(`${separator}`, 'bright');
}

function logSection(title) {
  log(`\n${title}`, 'cyan');
  log('-'.repeat(title.length));
}

function logTestResult(testName, passed, details = '') {
  const status = passed ? 'PASS' : 'FAIL';
  const color = passed ? 'green' : 'red';
  const icon = passed ? '✓' : '✗';
  
  log(`  ${icon} ${testName}: ${status}`, color);
  if (details) {
    log(`    ${details}`, 'yellow');
  }
}

// Test execution functions
function runPlaywrightTests(testFile, options = {}) {
  const defaultOptions = {
    workers: 1,
    timeout: 60000,
    retries: 1,
    reporter: 'list'
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  const args = [
    'test',
    testFile,
    `--workers=${mergedOptions.workers}`,
    `--timeout=${mergedOptions.timeout}`,
    `--retries=${mergedOptions.retries}`,
    `--reporter=${mergedOptions.reporter}`
  ];
  
  try {
    log(`Running: npx playwright ${args.join(' ')}`, 'blue');
    const result = execSync(`npx playwright ${args.join(' ')}`, {
      encoding: 'utf8',
      stdio: 'pipe'
    });
    return { success: true, output: result };
  } catch (error) {
    return { 
      success: false, 
      output: error.stdout || error.message,
      error: error
    };
  }
}

function parseTestResults(output) {
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    duration: 0
  };
  
  // Parse test results from Playwright output
  const lines = output.split('\n');
  
  for (const line of lines) {
    if (line.includes('✓')) {
      results.passed++;
      results.total++;
    } else if (line.includes('✗')) {
      results.failed++;
      results.total++;
    } else if (line.includes('skipped')) {
      results.skipped++;
      results.total++;
    }
    
    // Extract duration if available
    if (line.includes('Duration:')) {
      const match = line.match(/Duration:\s*(\d+\.?\d*)s/);
      if (match) {
        results.duration = parseFloat(match[1]);
      }
    }
  }
  
  return results;
}

// Main test execution
async function runComprehensiveTests() {
  logHeader('Comprehensive Node Testing Suite');
  log('Testing LaneNodes and ColumnsNodes for positioning, sizing, collapsing, and expanding functionality.\n');
  
  const overallResults = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    duration: 0
  };
  
  // Run LaneNode tests
  logSection('Running LaneNode Comprehensive Tests');
  log(`Testing ${testConfig.testCategories.lane.description}`);
  
  const laneResults = runPlaywrightTests(testConfig.testFiles[0]);
  
  if (laneResults.success) {
    const parsed = parseTestResults(laneResults.output);
    logTestResult('LaneNode Tests', true, `${parsed.passed}/${parsed.total} tests passed`);
    
    // Update overall results
    overallResults.total += parsed.total;
    overallResults.passed += parsed.passed;
    overallResults.failed += parsed.failed;
    overallResults.skipped += parsed.skipped;
    overallResults.duration += parsed.duration;
  } else {
    logTestResult('LaneNode Tests', false, 'Test execution failed');
    overallResults.failed++;
  }
  
  // Run ColumnsNode tests
  logSection('Running ColumnsNode Comprehensive Tests');
  log(`Testing ${testConfig.testCategories.columns.description}`);
  
  const columnsResults = runPlaywrightTests(testConfig.testFiles[1]);
  
  if (columnsResults.success) {
    const parsed = parseTestResults(columnsResults.output);
    logTestResult('ColumnsNode Tests', true, `${parsed.passed}/${parsed.total} tests passed`);
    
    // Update overall results
    overallResults.total += parsed.total;
    overallResults.passed += parsed.passed;
    overallResults.failed += parsed.failed;
    overallResults.skipped += parsed.skipped;
    overallResults.duration += parsed.duration;
  } else {
    logTestResult('ColumnsNode Tests', false, 'Test execution failed');
    overallResults.failed++;
  }
  
  // Summary
  logSection('Test Summary');
  log(`Total Tests: ${overallResults.total}`, 'bright');
  log(`Passed: ${overallResults.passed}`, 'green');
  log(`Failed: ${overallResults.failed}`, overallResults.failed > 0 ? 'red' : 'green');
  log(`Skipped: ${overallResults.skipped}`, overallResults.skipped > 0 ? 'yellow' : 'reset');
  log(`Duration: ${overallResults.duration.toFixed(2)}s`, 'blue');
  
  // Success/failure determination
  const success = overallResults.failed === 0;
  const status = success ? 'SUCCESS' : 'FAILURE';
  const statusColor = success ? 'green' : 'red';
  
  log(`\nOverall Status: ${status}`, statusColor);
  
  if (success) {
    log('\n🎉 All tests passed! The LaneNodes and ColumnsNodes are working correctly.', 'green');
  } else {
    log('\n❌ Some tests failed. Please review the output above for details.', 'red');
  }
  
  return success;
}

// Command line interface
function showHelp() {
  logHeader('Comprehensive Test Runner Help');
  log('Usage: node tests/run-comprehensive-tests.js [options]\n');
  
  log('Options:', 'cyan');
  log('  --help, -h     Show this help message');
  log('  --verbose, -v  Enable verbose output');
  log('  --quick, -q    Run with reduced timeouts for faster execution');
  log('  --debug, -d    Enable debug mode with additional logging\n');
  
  log('Examples:', 'cyan');
  log('  node tests/run-comprehensive-tests.js');
  log('  node tests/run-comprehensive-tests.js --verbose');
  log('  node tests/run-comprehensive-tests.js --quick\n');
  
  log('Test Coverage:', 'cyan');
  log('  • Basic rendering and positioning');
  log('  • Child node arrangement and spacing');
  log('  • Container sizing calculations');
  log('  • Collapse/expand functionality');
  log('  • Nested container behavior');
  log('  • Dynamic child addition/removal');
  log('  • Performance and edge cases');
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    help: false,
    verbose: false,
    quick: false,
    debug: false
  };
  
  for (const arg of args) {
    switch (arg) {
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
      case '--quick':
      case '-q':
        options.quick = true;
        break;
      case '--debug':
      case '-d':
        options.debug = true;
        break;
      default:
        log(`Unknown option: ${arg}`, 'yellow');
        log('Use --help for available options', 'yellow');
        process.exit(1);
    }
  }
  
  return options;
}

// Main execution
async function main() {
  const options = parseArgs();
  
  if (options.help) {
    showHelp();
    return;
  }
  
  if (options.quick) {
    testConfig.playwrightOptions.timeout = 30000; // Reduce timeout to 30s
    log('Quick mode enabled - reduced timeouts', 'yellow');
  }
  
  if (options.debug) {
    log('Debug mode enabled', 'yellow');
    // Enable additional logging
    process.env.DEBUG = 'playwright:*';
  }
  
  try {
    const success = await runComprehensiveTests();
    process.exit(success ? 0 : 1);
  } catch (error) {
    log(`\n❌ Test execution failed with error: ${error.message}`, 'red');
    if (options.debug) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run if called directly
// Normalize paths for cross-platform compatibility
const currentFileUrl = import.meta.url;
const scriptPath = process.argv[1];
const normalizedScriptPath = scriptPath.replace(/\\/g, '/'); // Convert Windows backslashes to forward slashes
const expectedFileUrl = `file:///${normalizedScriptPath.replace(/^[A-Z]:/, '')}`; // Handle Windows drive letter

if (currentFileUrl === expectedFileUrl) {
  main();
} else {
  // Fallback: check if this is the main module being executed
  if (process.argv[1] && process.argv[1].endsWith('run-comprehensive-tests.js')) {
    main();
  }
}

export {
  runComprehensiveTests,
  runPlaywrightTests,
  parseTestResults
};
