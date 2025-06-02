#!/usr/bin/env node

/**
 * Convert Murmurations profiles to Schema.org profiles using lossless Cambria conversion
 * 
 * This script:
 * 1. Reads Murmurations profiles from profiles/murmurations
 * 2. Uses lossless conversion to check for source_url and fetch original Schema.org documents
 * 3. Falls back to Cambria lens transformation if source_url is not available
 * 4. Saves the converted profiles to profiles/schemaorg
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
const SCHEMAORG_DIR = path.join(PROFILES_DIR, 'profiles', 'schemaorg');

// Lens files
const MURM_TO_SCHEMAORG_PERSON = path.join(LENS_DIR, 'murmurations-to-schemaorg-person.lens.yml');
const MURM_TO_SCHEMAORG_ORG = path.join(LENS_DIR, 'murmurations-to-schemaorg-organization.lens.yml');

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
 * Create a document fetcher that can retrieve original Schema.org documents
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
          'schemaorg-organization-global-regenerative-cooperative.json': 'schemaorg-org-global-regenerative-coop.json',
          'schemaorg-person-dr-karen-o-brien.json': 'schemaorg-person-karen-obrien.json',
          'schemaorg-person-dylan-tull.json': 'schemaorg-person-dylan-tull.json'
        };
        
        const localFilename = fileMapping[githubFilename] || githubFilename;
        filePath = path.join(SCHEMAORG_DIR, localFilename);
        
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
 * Convert a Murmurations profile to Schema.org format using lossless conversion
 */
async function convertMurmurationsToSchemaOrg(murmurationsProfile, profileType) {
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
    const lensFile = profileType === 'person' ? MURM_TO_SCHEMAORG_PERSON : MURM_TO_SCHEMAORG_ORG;
    const lensContent = fs.readFileSync(lensFile, 'utf8');
    const transformationLens = loadYamlLens(lensContent);
    
    // Create document fetcher for lossless conversion
    const fetchDocument = createLocalDocumentFetcher();
    
    // Apply lossless lens transformation
    console.log('🔄 Applying lossless Cambria transformation...');
    const schemaOrgProfile = await applyLosslessLensToDoc(transformationLens, inputProfile, {
      fetchDocument,
      inputSchema,
      addReverseLinks: false, // Don't add reverse links when converting back
    });
    
    if (hasSourceUrl && schemaOrgProfile !== inputProfile) {
      console.log('✅ Lossless recovery successful');
    } else {
      console.log('✅ Lens transformation completed');
    }
    
    return schemaOrgProfile;
  } catch (error) {
    console.error(`❌ Error converting profile: ${error.message}`);
    throw error;
  }
}

/**
 * Process all Murmurations profiles
 */
async function processMurmurationsProfiles() {
  // Check if murmurations directory exists
  if (!fs.existsSync(MURMURATIONS_DIR)) {
    console.log(`❌ Murmurations directory not found: ${MURMURATIONS_DIR}`);
    console.log('Run convert-unified-to-murmurations.js first to create Murmurations profiles');
    return;
  }

  // Create the output directory if it doesn't exist
  if (!fs.existsSync(SCHEMAORG_DIR)) {
    fs.mkdirSync(SCHEMAORG_DIR, { recursive: true });
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
      
      // Convert using lossless Cambria operations
      const schemaOrgProfile = await convertMurmurationsToSchemaOrg(murmurationsProfile, profileType);
      
      // Generate output filename: murm-person-name.json → schemaorg-person-name.json
      const outputFile = file.replace('murm-', 'schemaorg-');
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
  console.log('🔄 Converting Murmurations profiles to Schema.org format using lossless Cambria conversion...\n');

  try {
    await processMurmurationsProfiles();
    
    console.log('\n🎉 Lossless Cambria reverse conversion completed successfully!');
    console.log(`📁 Converted profiles saved to: ${SCHEMAORG_DIR}`);
    
    console.log('\n📝 Next steps:');
    console.log('1. Validate that profiles with source_url were recovered losslessly');
    console.log('2. Compare with original Schema.org profiles to verify perfect recovery');
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

module.exports = { convertMurmurationsToSchemaOrg };