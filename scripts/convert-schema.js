#!/usr/bin/env node

/**
 * Schema conversion utility using Cambria
 * This script uses the npm-installed Cambria package for schema transformations
 */

const fs = require('fs');
const path = require('path');
const { loadYamlLens, applyLensToDoc } = require('cambria');

// Configuration
const LENS_DIR = path.join(__dirname, '..', 'cambria-lenses');
const PROFILES_DIR = path.join(__dirname, '..');

const LENSES = {
  'murm-to-unified': path.join(LENS_DIR, 'murmurations-to-unified-person.lens.yml'),
  'unified-to-murm': path.join(LENS_DIR, 'unified-to-murmurations-person.lens.yml'),
  'schemaorg-to-unified': path.join(LENS_DIR, 'schemaorg-to-unified-person.lens.yml')
};

function showUsage() {
  console.log('Usage: node convert-schema.js <conversion-type> [input-file] [output-file]');
  console.log('');
  console.log('Conversion types:');
  console.log('  murm-to-unified     - Convert Murmurations to Unified format');
  console.log('  unified-to-murm     - Convert Unified to Murmurations format');
  console.log('  schemaorg-to-unified - Convert Schema.org to Unified format');
  console.log('');
  console.log('Examples:');
  console.log('  node convert-schema.js murm-to-unified murmurations-profiles/person-dylan-tull.json');
  console.log('  echo \'{"name": "Test"}\' | node convert-schema.js murm-to-unified');
  console.log('  node convert-schema.js murm-to-unified input.json output.json');
}

async function convertSchema(conversionType, inputFile, outputFile) {
  try {
    // Get the lens file
    const lensFile = LENSES[conversionType];
    if (!lensFile) {
      throw new Error(`Unknown conversion type: ${conversionType}`);
    }

    if (!fs.existsSync(lensFile)) {
      throw new Error(`Lens file not found: ${lensFile}`);
    }

    // Load the lens
    const lensData = fs.readFileSync(lensFile, 'utf-8');
    const lens = loadYamlLens(lensData);

    // Get input data
    let inputData;
    if (inputFile) {
      if (!fs.existsSync(inputFile)) {
        throw new Error(`Input file not found: ${inputFile}`);
      }
      inputData = fs.readFileSync(inputFile, 'utf-8');
    } else {
      // Read from stdin
      inputData = fs.readFileSync(0, 'utf-8');
    }

    // Parse input JSON
    const doc = JSON.parse(inputData);

    // Apply the lens transformation
    const transformedDoc = applyLensToDoc(lens, doc);

    // Output the result
    const output = JSON.stringify(transformedDoc, null, 2);
    
    if (outputFile) {
      fs.writeFileSync(outputFile, output);
      console.log(`✅ Conversion complete: ${inputFile || 'stdin'} → ${outputFile}`);
    } else {
      console.log(output);
    }

  } catch (error) {
    console.error('❌ Conversion failed:', error.message);
    process.exit(1);
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  showUsage();
  process.exit(0);
}

const [conversionType, inputFile, outputFile] = args;
convertSchema(conversionType, inputFile, outputFile);
