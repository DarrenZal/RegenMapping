#!/usr/bin/env node

/**
 * Convert Unified profiles to Schema.org profiles using pure Cambria lenses
 * 
 * This script:
 * 1. Reads unified profiles from profiles/unified
 * 2. Applies Cambria lenses to convert them to Schema.org format
 * 3. Uses pure Cambria operations for all transformations
 * 4. Saves the converted profiles to a new schemaorg directory
 */

const fs = require('fs');
const path = require('path');
// Use the local modified cambria version
const { loadYamlLens, applyLensToDoc } = require('../cambria-project/dist/index.js');

// Paths
const LENS_DIR = path.join(__dirname, '..', 'cambria-lenses');
const PROFILES_DIR = path.join(__dirname, '..');
const UNIFIED_DIR = path.join(PROFILES_DIR, 'profiles', 'unified');
const SCHEMAORG_DIR = path.join(PROFILES_DIR, 'profiles', 'schemaorg');

// Lens files
const UNIFIED_TO_SCHEMAORG_PERSON = path.join(LENS_DIR, 'unified-to-schemaorg-person.lens.yml');
const UNIFIED_TO_SCHEMAORG_ORG = path.join(LENS_DIR, 'unified-to-schemaorg-organization.lens.yml');

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
 * Convert a unified profile to Schema.org format using pure Cambria
 */
async function convertUnifiedToSchemaOrg(unifiedProfile, profileType) {
  try {
    console.log(`📄 Converting ${profileType} profile: ${unifiedProfile.name}`);
    
    // Use the profile as-is - all transformations handled by lens
    const inputProfile = { ...unifiedProfile };
    
    // Infer schema from the actual profile structure
    const inputSchema = inferSchema(inputProfile);
    console.log('📊 Inferred input schema');
    
    // Load the appropriate transformation lens
    const lensFile = profileType === 'person' ? UNIFIED_TO_SCHEMAORG_PERSON : UNIFIED_TO_SCHEMAORG_ORG;
    const lensContent = fs.readFileSync(lensFile, 'utf8');
    const transformationLens = loadYamlLens(lensContent);
    
    // Apply the transformation lens using ONLY Cambria operations
    console.log('🔄 Applying pure Cambria transformation...');
    const schemaOrgProfile = applyLensToDoc(transformationLens, inputProfile, inputSchema);
    
    console.log('✅ Pure Cambria conversion completed');
    return schemaOrgProfile;
  } catch (error) {
    console.error(`❌ Error converting profile: ${error.message}`);
    throw error;
  }
}

/**
 * Process all unified profiles
 */
async function processUnifiedProfiles() {
  // Create the output directory if it doesn't exist
  if (!fs.existsSync(SCHEMAORG_DIR)) {
    fs.mkdirSync(SCHEMAORG_DIR, { recursive: true });
  }

  // Get all JSON-LD files in the unified directory
  const unifiedFiles = fs.readdirSync(UNIFIED_DIR)
    .filter(file => file.endsWith('.jsonld'));

  console.log(`📁 Found ${unifiedFiles.length} unified profiles to convert`);

  for (const file of unifiedFiles) {
    try {
      const filePath = path.join(UNIFIED_DIR, file);
      const unifiedProfile = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Determine profile type from filename
      const profileType = file.includes('person') ? 'person' : 'organization';
      
      console.log(`\n📋 Processing: ${file} (${profileType})`);
      
      // Convert using pure Cambria operations
      const schemaOrgProfile = await convertUnifiedToSchemaOrg(unifiedProfile, profileType);
      
      // Generate output filename: regen-person-name.jsonld → schemaorg-person-name.json
      const outputFile = file.replace('regen-', 'schemaorg-').replace('.jsonld', '.json');
      const outputPath = path.join(SCHEMAORG_DIR, outputFile);
      
      // Write the converted profile
      fs.writeFileSync(outputPath, JSON.stringify(schemaOrgProfile, null, 2));
      
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
  console.log('🔄 Converting Unified profiles to Schema.org format using pure Cambria...\n');

  try {
    await processUnifiedProfiles();
    
    console.log('\n🎉 Pure Cambria conversion completed successfully!');
    console.log(`📁 Converted profiles saved to: ${SCHEMAORG_DIR}`);
    
    console.log('\n📝 Next steps:');
    console.log('1. Validate the Schema.org profiles conform to standard');
    console.log('2. Test lossless recovery using source_url');
    console.log('3. Use profiles for Schema.org structured data');
  } catch (error) {
    console.error('\n❌ Error during conversion:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { convertUnifiedToSchemaOrg };