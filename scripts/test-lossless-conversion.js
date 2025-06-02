#!/usr/bin/env node

/**
 * Test Lossless Conversion
 * 
 * This script demonstrates the lossless round-trip conversion between
 * unified schema profiles and Murmurations profiles using the hybrid
 * Lens + Linked Schema URI approach.
 * 
 * It performs the following steps:
 * 1. Converts a unified profile to Murmurations format with profile_source field
 * 2. Converts the Murmurations profile back to unified format by fetching the original
 * 3. Compares the original and round-trip profiles to verify lossless conversion
 * 4. Tests the fallback mechanism by simulating a failed fetch
 */

const fs = require('fs');
const path = require('path');
const { 
  convertUnifiedToMurmurations, 
  convertMurmurationsToUnified,
  slugifyName
} = require('./lossless-conversion');

// Test profiles
const PERSON_PROFILE = path.join(__dirname, '..', 'profiles', 'unified', 'regen-person-dylan-tull.jsonld');
const ORG_PROFILE = path.join(__dirname, '..', 'profiles', 'unified', 'regen-org-global-regenerative-coop.jsonld');

// Output directory for test results
const TEST_OUTPUT_DIR = path.join(__dirname, '..', 'test-output');

/**
 * Compare two objects and report differences
 */
function compareObjects(original, roundTrip, prefix = '') {
  let differences = [];
  
  // Check for keys in original that are missing or different in roundTrip
  for (const key of Object.keys(original)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    
    if (!(key in roundTrip)) {
      differences.push(`Missing key: ${fullPath}`);
      continue;
    }
    
    if (typeof original[key] === 'object' && original[key] !== null && 
        typeof roundTrip[key] === 'object' && roundTrip[key] !== null) {
      // Recursively compare objects
      const nestedDiffs = compareObjects(original[key], roundTrip[key], fullPath);
      differences = differences.concat(nestedDiffs);
    } else if (JSON.stringify(original[key]) !== JSON.stringify(roundTrip[key])) {
      differences.push(`Value mismatch for ${fullPath}:`);
      differences.push(`  Original: ${JSON.stringify(original[key])}`);
      differences.push(`  Round-trip: ${JSON.stringify(roundTrip[key])}`);
    }
  }
  
  // Check for keys in roundTrip that are not in original
  for (const key of Object.keys(roundTrip)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (!(key in original)) {
      differences.push(`Extra key in round-trip: ${fullPath}`);
    }
  }
  
  return differences;
}

/**
 * Test lossless conversion for a profile
 */
async function testLosslessConversion(profilePath) {
  console.log(`\n🔄 Testing lossless conversion for: ${profilePath}`);
  
  try {
    // Create test output directory if it doesn't exist
    if (!fs.existsSync(TEST_OUTPUT_DIR)) {
      fs.mkdirSync(TEST_OUTPUT_DIR, { recursive: true });
    }
    
    // Step 1: Read the unified profile
    console.log('Step 1: Reading unified profile');
    const unifiedProfile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
    
    // Determine profile type
    const isPerson = profilePath.includes('person');
    const profileType = isPerson ? 'person' : 'organization';
    
    // Step 2: Convert to Murmurations format
    console.log('Step 2: Converting Unified → Murmurations');
    const murmurationsProfile = await convertUnifiedToMurmurations(unifiedProfile, profileType);
    
    // Save the Murmurations profile for inspection
    const murmFilePath = path.join(TEST_OUTPUT_DIR, `test-murmurations-${slugifyName(unifiedProfile.name)}.json`);
    fs.writeFileSync(murmFilePath, JSON.stringify(murmurationsProfile, null, 2));
    console.log(`✅ Saved Murmurations profile to: ${murmFilePath}`);
    
    // Step 3: Convert back to unified format
    console.log('Step 3: Converting Murmurations → Unified');
    const roundTripProfile = await convertMurmurationsToUnified(murmurationsProfile);
    
    // Save the round-trip profile for inspection
    const roundTripFilePath = path.join(TEST_OUTPUT_DIR, `test-roundtrip-${slugifyName(unifiedProfile.name)}.json`);
    fs.writeFileSync(roundTripFilePath, JSON.stringify(roundTripProfile, null, 2));
    console.log(`✅ Saved round-trip profile to: ${roundTripFilePath}`);
    
    // Step 4: Compare the original and round-trip profiles
    console.log('Step 4: Comparing original and round-trip profiles');
    const differences = compareObjects(unifiedProfile, roundTripProfile);
    
    if (differences.length === 0) {
      console.log('✅ Round-trip successful: Profiles are identical');
      return true;
    } else {
      console.log(`❌ Round-trip comparison found ${differences.length} differences:`);
      differences.forEach(diff => console.log(`  ${diff}`));
      return false;
    }
  } catch (error) {
    console.error(`❌ Error testing lossless conversion: ${error.message}`);
    return false;
  }
}

/**
 * Test fallback mechanism when profile_source URL is unavailable
 */
async function testFallbackMechanism(profilePath) {
  console.log(`\n🔄 Testing fallback mechanism for: ${profilePath}`);
  
  try {
    // Step 1: Read the unified profile
    console.log('Step 1: Reading unified profile');
    const unifiedProfile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
    
    // Determine profile type
    const isPerson = profilePath.includes('person');
    const profileType = isPerson ? 'person' : 'organization';
    
    // Step 2: Convert to Murmurations format
    console.log('Step 2: Converting Unified → Murmurations');
    const murmurationsProfile = await convertUnifiedToMurmurations(unifiedProfile, profileType);
    
    // Step 3: Modify the profile_source to an invalid URL
    console.log('Step 3: Modifying profile_source to an invalid URL');
    murmurationsProfile.profile_source = 'https://example.com/nonexistent-profile.jsonld';
    
    // Save the modified Murmurations profile for inspection
    const murmFilePath = path.join(TEST_OUTPUT_DIR, `test-fallback-murmurations-${slugifyName(unifiedProfile.name)}.json`);
    fs.writeFileSync(murmFilePath, JSON.stringify(murmurationsProfile, null, 2));
    console.log(`✅ Saved modified Murmurations profile to: ${murmFilePath}`);
    
    // Step 4: Convert back to unified format (should use fallback mechanism)
    console.log('Step 4: Converting Murmurations → Unified (should use fallback)');
    const fallbackProfile = await convertMurmurationsToUnified(murmurationsProfile);
    
    // Save the fallback profile for inspection
    const fallbackFilePath = path.join(TEST_OUTPUT_DIR, `test-fallback-unified-${slugifyName(unifiedProfile.name)}.json`);
    fs.writeFileSync(fallbackFilePath, JSON.stringify(fallbackProfile, null, 2));
    console.log(`✅ Saved fallback profile to: ${fallbackFilePath}`);
    
    // Step 5: Verify that the fallback profile has the essential fields
    console.log('Step 5: Verifying fallback profile has essential fields');
    const essentialFields = ['name', '@context', '@type', 'primary_url'];
    const missingFields = essentialFields.filter(field => !(field in fallbackProfile));
    
    if (missingFields.length === 0) {
      console.log('✅ Fallback mechanism successful: Essential fields are present');
      return true;
    } else {
      console.log(`❌ Fallback mechanism missing essential fields: ${missingFields.join(', ')}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error testing fallback mechanism: ${error.message}`);
    return false;
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('🧪 Testing Lossless Conversion\n');
  
  let allTestsPassed = true;
  
  // Test lossless conversion for person profile
  const personTestResult = await testLosslessConversion(PERSON_PROFILE);
  allTestsPassed = allTestsPassed && personTestResult;
  
  // Test lossless conversion for organization profile
  const orgTestResult = await testLosslessConversion(ORG_PROFILE);
  allTestsPassed = allTestsPassed && orgTestResult;
  
  // Test fallback mechanism
  const fallbackTestResult = await testFallbackMechanism(PERSON_PROFILE);
  allTestsPassed = allTestsPassed && fallbackTestResult;
  
  // Report overall results
  console.log('\n🧪 Test Results:');
  console.log(`Person Profile Lossless Conversion: ${personTestResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Organization Profile Lossless Conversion: ${orgTestResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Fallback Mechanism: ${fallbackTestResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Overall: ${allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  if (allTestsPassed) {
    console.log('\n🎉 Lossless conversion is working correctly!');
    console.log('You can now use the lossless-conversion.js script to convert your profiles.');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the error messages above.');
  }
  
  process.exit(allTestsPassed ? 0 : 1);
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { testLosslessConversion, testFallbackMechanism };
