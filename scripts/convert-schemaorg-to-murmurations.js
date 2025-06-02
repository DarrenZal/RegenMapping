#!/usr/bin/env node

/**
 * Convert Schema.org profiles to Murmurations profiles using pure Cambria lenses
 * 
 * This script:
 * 1. Reads Schema.org profiles from profiles/schemaorg
 * 2. Applies Cambria lenses to convert them to Murmurations format
 * 3. Uses pure Cambria operations for all transformations
 * 4. Saves the converted profiles to profiles/murmurations
 */

const fs = require('fs');
const path = require('path');
// Use the local modified cambria version
const { loadYamlLens, applyLensToDoc } = require('../cambria-project/dist/index.js');

// Paths
const LENS_DIR = path.join(__dirname, '..', 'cambria-lenses');
const PROFILES_DIR = path.join(__dirname, '..');
const SCHEMAORG_DIR = path.join(PROFILES_DIR, 'profiles', 'schemaorg');
const MURMURATIONS_DIR = path.join(PROFILES_DIR, 'profiles', 'murmurations');

// Lens files
const SCHEMAORG_TO_MURM_PERSON = path.join(LENS_DIR, 'schemaorg-to-murmurations-person.lens.yml');
const SCHEMAORG_TO_MURM_ORG = path.join(LENS_DIR, 'schemaorg-to-murmurations-organization.lens.yml');

/**
 * Simple schema inference for Cambria compatibility
 */
function inferSchema(obj) {
  const schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: {}
  };

  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (Array.isArray(value)) {
      schema.properties[key] = { type: 'array' };
    } else if (typeof value === 'object' && value !== null) {
      schema.properties[key] = { type: 'object' };
    } else {
      schema.properties[key] = { type: typeof value };
    }
  });

  return schema;
}

/**
 * Convert a Schema.org profile to Murmurations format using pure Cambria
 */
async function convertSchemaOrgToMurmurations(schemaOrgProfile, profileType) {
  try {
    console.log(`📄 Converting ${profileType} profile: ${schemaOrgProfile.name}`);
    
    // Use the profile as-is - all transformations handled by lens
    const inputProfile = { ...schemaOrgProfile };
    
    // Infer schema from the actual profile structure
    const inputSchema = inferSchema(inputProfile);
    console.log('📊 Inferred input schema');
    
    // Load the appropriate transformation lens
    const lensFile = profileType === 'person' ? SCHEMAORG_TO_MURM_PERSON : SCHEMAORG_TO_MURM_ORG;
    const lensContent = fs.readFileSync(lensFile, 'utf8');
    const transformationLens = loadYamlLens(lensContent);
    
    // Apply the transformation lens using ONLY Cambria operations
    console.log('🔄 Applying pure Cambria transformation...');
    const murmurationsProfile = applyLensToDoc(transformationLens, inputProfile, inputSchema);
    
    console.log('✅ Pure Cambria conversion completed');
    return murmurationsProfile;
  } catch (error) {
    console.error(`❌ Error converting profile: ${error.message}`);
    throw error;
  }
}

/**
 * Process all Schema.org profiles
 */
async function processSchemaOrgProfiles() {
  // Check if schema.org directory exists
  if (!fs.existsSync(SCHEMAORG_DIR)) {
    console.log(`❌ Schema.org directory not found: ${SCHEMAORG_DIR}`);
    console.log('Run convert-unified-to-schemaorg.js first to create Schema.org profiles');
    return;
  }

  // Create the output directory if it doesn't exist
  if (!fs.existsSync(MURMURATIONS_DIR)) {
    fs.mkdirSync(MURMURATIONS_DIR, { recursive: true });
  }

  // Get all JSON files in the schemaorg directory
  const schemaOrgFiles = fs.readdirSync(SCHEMAORG_DIR)
    .filter(file => file.endsWith('.json'));

  console.log(`📁 Found ${schemaOrgFiles.length} Schema.org profiles to convert`);

  for (const file of schemaOrgFiles) {
    try {
      const filePath = path.join(SCHEMAORG_DIR, file);
      const schemaOrgProfile = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Determine profile type from filename
      const profileType = file.includes('person') ? 'person' : 'organization';
      
      console.log(`\n📋 Processing: ${file} (${profileType})`);
      
      // Convert using pure Cambria operations
      const murmurationsProfile = await convertSchemaOrgToMurmurations(schemaOrgProfile, profileType);
      
      // Generate output filename: schemaorg-person-name.json → murm-person-name.json
      const outputFile = file.replace('schemaorg-', 'murm-');
      const outputPath = path.join(MURMURATIONS_DIR, outputFile);
      
      // Write the converted profile
      fs.writeFileSync(outputPath, JSON.stringify(murmurationsProfile, null, 2));
      
      console.log(`💾 Saved: ${outputFile}`);
    } catch (error) {
      console.error(`❌ Error processing ${file}: ${error.message}`);
    }
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('🔄 Converting Schema.org profiles to Murmurations format using pure Cambria...\n');

  try {
    await processSchemaOrgProfiles();
    
    console.log('\n🎉 Pure Cambria conversion completed successfully!');
    console.log(`📁 Converted profiles saved to: ${MURMURATIONS_DIR}`);
    
    console.log('\n📝 Next steps:');
    console.log('1. Validate the Murmurations profiles conform to schema');
    console.log('2. Test lossless recovery using source_url');
    console.log('3. Submit profiles to Murmurations index');
  } catch (error) {
    console.error('\n❌ Error during conversion:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { convertSchemaOrgToMurmurations };