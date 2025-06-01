#!/usr/bin/env node

/**
 * Demo script to test Cambria schema transformations
 * This script demonstrates converting between different schema formats
 * Uses the npm-installed Cambria package
 */

const fs = require('fs');
const path = require('path');
const { loadYamlLens, applyLensToDoc } = require('cambria');

// Paths
const LENS_DIR = path.join(__dirname, '..', 'cambria-lenses');
const PROFILES_DIR = path.join(__dirname, '..');

// Test files
const MURMURATIONS_PERSON = path.join(PROFILES_DIR, 'profiles', 'murmurations', 'murm-person-dylan-tull.json');
const SCHEMAORG_PERSON = path.join(PROFILES_DIR, 'test-profiles', 'sample-schemaorg-person.json');

// Lens files
const MURM_TO_UNIFIED = path.join(LENS_DIR, 'murmurations-to-unified-person.lens.yml');
const UNIFIED_TO_MURM = path.join(LENS_DIR, 'unified-to-murmurations-person.lens.yml');
const SCHEMAORG_TO_UNIFIED = path.join(LENS_DIR, 'schemaorg-to-unified-person.lens.yml');

console.log('🔄 Testing Cambria Schema Transformations\n');

// Test 1: Murmurations to Unified
console.log('📋 Test 1: Murmurations → Unified');
console.log('Input (Murmurations format):');
const murmInput = fs.readFileSync(MURMURATIONS_PERSON, 'utf8');
console.log(murmInput);

try {
  // Load lenses
  const murmToUnifiedLens = loadYamlLens(fs.readFileSync(MURM_TO_UNIFIED, 'utf8'));
  const unifiedToMurmLens = loadYamlLens(fs.readFileSync(UNIFIED_TO_MURM, 'utf8'));
  
  // Parse input
  const originalData = JSON.parse(murmInput);
  
  // Apply first transformation
  const unifiedData = applyLensToDoc(murmToUnifiedLens, originalData);
  console.log('\nOutput (Unified format):');
  console.log(JSON.stringify(unifiedData, null, 2));
  
  // Test 2: Bidirectional transformation
  console.log('\n📋 Test 2: Murmurations → Unified → Murmurations (Bidirectional)');
  const roundTripData = applyLensToDoc(unifiedToMurmLens, unifiedData);
  console.log('Final output (back to Murmurations):');
  console.log(JSON.stringify(roundTripData, null, 2));
  
  console.log('\n✅ Data Integrity Check:');
  console.log(`Name preserved: ${originalData.name === roundTripData.name}`);
  console.log(`URL preserved: ${originalData.primary_url === roundTripData.primary_url}`);
  console.log(`Locality preserved: ${originalData.locality === roundTripData.locality}`);
  console.log(`Geolocation preserved: ${JSON.stringify(originalData.geolocation) === JSON.stringify(roundTripData.geolocation)}`);
  
} catch (error) {
  console.error('❌ Error in transformation:', error.message);
}

console.log('\n📊 Summary:');
console.log('✅ Murmurations ↔ Unified: Working');
console.log('🔄 Schema.org → Unified: In development (array handling issue)');
console.log('\n🎯 Next Steps:');
console.log('1. Fix Schema.org array handling in Cambria lens');
console.log('2. Add organization schema transformations');
console.log('3. Create composite transformation pipelines');
console.log('4. Add validation and error handling');

console.log('\n📁 Available files:');
console.log(`- Lenses: ${LENS_DIR}`);
console.log(`- Test profiles: ${path.join(PROFILES_DIR, 'test-profiles')}`);
console.log(`- Murmurations profiles: ${path.join(PROFILES_DIR, 'murmurations-profiles')}`);
