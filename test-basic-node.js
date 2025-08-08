#!/usr/bin/env node

/**
 * Test script for basicNode functionality
 * This script validates the basicNode demo and layout modes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Testing BasicNode Functionality...\n');

// Test 1: Check if basicNode demo exists
const basicNodePath = '01_basicNodes/01_basic/basic.html';
if (fs.existsSync(basicNodePath)) {
    console.log('✅ BasicNode demo file exists');
} else {
    console.log('❌ BasicNode demo file not found');
}

// Test 2: Check if layout modes directory exists
const layoutModesPath = '01_basicNodes/02_layout-modes';
if (fs.existsSync(layoutModesPath)) {
    console.log('✅ Layout modes directory exists');
} else {
    console.log('❌ Layout modes directory not found');
}

// Test 3: Check layout mode demo files
const layoutModeFiles = [
    '01_default-layout.html',
    '02_auto-size-small.html',
    '03_auto-size-large.html',
    '04_fixed-size-small.html',
    '05_fixed-size-large.html'
];

console.log('\nChecking layout mode demo files:');
layoutModeFiles.forEach(file => {
    const filePath = path.join(layoutModesPath, file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${file} exists`);
    } else {
        console.log(`❌ ${file} not found`);
    }
});

// Test 4: Check data files
const dataFiles = [
    'js/graphData.js',
    'js/graphData-auto-size-small.js',
    'js/graphData-auto-size-large.js',
    'js/graphData-fixed-size-small.js',
    'js/graphData-fixed-size-large.js'
];

console.log('\nChecking data files:');
dataFiles.forEach(file => {
    const filePath = path.join(layoutModesPath, file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${file} exists`);
    } else {
        console.log(`❌ ${file} not found`);
    }
});

// Test 5: Check dashboard path references
console.log('\nChecking dashboard path references:');
const htmlFiles = [
    basicNodePath,
    path.join(layoutModesPath, '01_default-layout.html'),
    path.join(layoutModesPath, '02_auto-size-small.html'),
    path.join(layoutModesPath, '03_auto-size-large.html'),
    path.join(layoutModesPath, '04_fixed-size-small.html'),
    path.join(layoutModesPath, '05_fixed-size-large.html')
];

htmlFiles.forEach(file => {
    if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes('../../dashboard/')) {
            console.log(`✅ ${path.basename(file)} uses correct dashboard path`);
        } else {
            console.log(`❌ ${path.basename(file)} uses incorrect dashboard path`);
        }
    }
});

// Test 6: Check README file
const readmePath = path.join(layoutModesPath, 'README.md');
if (fs.existsSync(readmePath)) {
    console.log('✅ README.md exists for layout modes');
} else {
    console.log('❌ README.md not found for layout modes');
}

console.log('\n🎉 BasicNode testing completed!');
console.log('\nTo test the demos:');
console.log('1. Start a local server: python -m http.server 8000');
console.log('2. Open http://localhost:8000/01_basicNodes/01_basic/basic.html');
console.log('3. Test layout modes: http://localhost:8000/01_basicNodes/02_layout-modes/');
