#!/usr/bin/env node

/**
 * Convert Murmurations profiles to Unified profiles using lossless Cambria conversion
 * 
 * This script:
 * 1. Reads Murmurations profiles from profiles/murmurations
 * 2. Uses lossless conversion to check for source_url and fetch original unified documents
 * 3. Falls back to Cambria lens transformation if source_url is not available
 * 4. Saves the converted profiles to profiles/unified
 * 
 * Lossless conversion provides perfect recovery when source_url is present,
 * ensuring bidirectional schema transformation maintains data integrity.
 */

const fs = require('fs');
const path = require('path');
// Use the local modified cambria version with lossless conversion support
const { loadYamlLens, applyLosslessLensToDoc, createDocumentFetcher } = require('../cambria-project/dist/index.js');

// Paths
const LENS_DIR = path.join(__dirname, '..', 'cambria-lenses');
const PROFILES_DIR = path.join(__dirname, '..');
const MURMURATIONS_DIR = path.join(PROFILES_DIR, 'profiles', 'murmurations');
const UNIFIED_DIR = path.join(PROFILES_DIR, 'profiles', 'unified');

// Lens files
const MURM_TO_UNIFIED_PERSON = path.join(LENS_DIR, 'murmurations-to-unified-person.lens.yml');
const MURM_TO_UNIFIED_ORG = path.join(LENS_DIR, 'murmurations-to-unified-organization.lens.yml');

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
 * Create a document fetcher that can retrieve original unified documents
 */
function createLocalDocumentFetcher() {
  return async (url) => {
    try {
      console.log(`🔗 Attempting lossless recovery from: ${url}`);
      
      let filePath;
      if (url.startsWith('http')) {
        // Extract filename from GitHub URL and map to local file
        const urlParts = url.split('/');
        const githubFilename = urlParts[urlParts.length - 1];
        
        // Map GitHub filenames to local filenames
        const fileMapping = {
          'regen-organization-global-regenerative-cooperative.jsonld': 'regen-org-global-regenerative-coop.jsonld',
          'regen-person-dr-karen-o-brien.jsonld': 'regen-person-karen-obrien.jsonld',
          'regen-person-dylan-tull.jsonld': 'regen-person-dylan-tull.jsonld'
        };
        
        const localFilename = fileMapping[githubFilename] || githubFilename;
        filePath = path.join(UNIFIED_DIR, localFilename);
        
        console.log(`📁 Mapped ${githubFilename} → ${localFilename}`);
      } else {
        // Assume it's a relative path from the project root
        filePath = path.resolve(PROFILES_DIR, url);
      }
      
      if (fs.existsSync(filePath)) {
        const originalDoc = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log('✅ Successfully recovered original document');
        return originalDoc;
      } else {
        console.log(`⚠️  Original document not found at: ${filePath}`);
        return null;
      }
    } catch (error) {
      console.log(`⚠️  Failed to fetch original document: ${error.message}`);
      return null;
    }
  };
}

/**
 * Convert a Murmurations profile to unified format using lossless conversion
 */
async function convertMurmurationsToUnified(murmurationsProfile, profileType) {
  try {
    console.log(`📄 Converting ${profileType} profile: ${murmurationsProfile.name}`);
    
    // Check if profile has a source_url for lossless recovery
    const hasSourceUrl = murmurationsProfile.source_url;
    if (hasSourceUrl) {
      console.log(`🔍 Found source_url: ${hasSourceUrl}`);
    }
    
    // Use the profile as-is - all transformations handled by lens
    const inputProfile = { ...murmurationsProfile };
    
    // Infer schema from the actual profile structure
    const inputSchema = inferSchema(inputProfile);
    console.log('📊 Inferred input schema');
    
    // Load the appropriate transformation lens
    const lensFile = profileType === 'person' ? MURM_TO_UNIFIED_PERSON : MURM_TO_UNIFIED_ORG;
    const lensContent = fs.readFileSync(lensFile, 'utf8');
    const transformationLens = loadYamlLens(lensContent);
    
    // Create document fetcher for lossless conversion
    const fetchDocument = createLocalDocumentFetcher();
    
    // Apply lossless lens transformation
    console.log('🔄 Applying lossless Cambria transformation...');
    const unifiedProfile = await applyLosslessLensToDoc(transformationLens, inputProfile, {
      fetchDocument,
      inputSchema,
      addReverseLinks: false, // Don't add reverse links when converting back
    });
    
    if (hasSourceUrl && unifiedProfile !== inputProfile) {
      console.log('✅ Lossless recovery successful');
    } else {
      console.log('✅ Lens transformation completed');
    }
    
    return unifiedProfile;
  } catch (error) {
    console.error(`❌ Error converting profile: ${error.message}`);
    throw error;
  }
}

/**
 * Process all Murmurations profiles
 */
async function processMurmurationsProfiles() {
  // Create the output directory if it doesn't exist
  if (!fs.existsSync(UNIFIED_DIR)) {
    fs.mkdirSync(UNIFIED_DIR, { recursive: true });
  }

  // Get all JSON files in the murmurations directory
  const murmurationsFiles = fs.readdirSync(MURMURATIONS_DIR)
    .filter(file => file.endsWith('.json'));

  console.log(`📁 Found ${murmurationsFiles.length} Murmurations profiles to convert`);

  for (const file of murmurationsFiles) {
    try {
      const filePath = path.join(MURMURATIONS_DIR, file);
      const murmurationsProfile = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Determine profile type from filename
      const profileType = file.includes('person') ? 'person' : 'organization';
      
      console.log(`\n📋 Processing: ${file} (${profileType})`);
      
      // Convert using pure Cambria operations
      const unifiedProfile = await convertMurmurationsToUnified(murmurationsProfile, profileType);
      
      // Generate output filename: murm-person-name.json → regen-person-name.jsonld
      const outputFile = file.replace('murm-', 'regen-').replace('.json', '.jsonld');
      const outputPath = path.join(UNIFIED_DIR, outputFile);
      
      // Write the converted profile
      fs.writeFileSync(outputPath, JSON.stringify(unifiedProfile, null, 2));
      
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
  console.log('🔄 Converting Murmurations profiles to Unified format using lossless Cambria conversion...\n');

  try {
    await processMurmurationsProfiles();
    
    console.log('\n🎉 Lossless Cambria reverse conversion completed successfully!');
    console.log(`📁 Converted profiles saved to: ${UNIFIED_DIR}`);
    
    console.log('\n📝 Next steps:');
    console.log('1. Validate that profiles with source_url were recovered losslessly');
    console.log('2. Compare with original unified profiles to verify perfect recovery');
    console.log('3. Test that lens fallback works for profiles without source_url');
  } catch (error) {
    console.error('\n❌ Error during conversion:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { convertMurmurationsToUnified };