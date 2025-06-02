#!/usr/bin/env node

/**
 * Lossless Conversion Utility for Regen Mapping
 * 
 * This script provides utilities for lossless round-trip conversion between
 * unified schema profiles and Murmurations profiles using the hybrid Lens + Linked Schema URI approach.
 * 
 * Key features:
 * 1. Converts unified profiles to Murmurations format with profile_source field
 * 2. Fetches the original unified profile when converting back from Murmurations
 * 3. Handles both person and organization profiles
 * 4. Provides both CLI and programmatic interfaces
 */

const fs = require('fs');
const path = require('path');
const { loadYamlLens, applyLensToDoc } = require('cambria');
const fetch = require('node-fetch');

// Paths
const LENS_DIR = path.join(__dirname, '..', 'cambria-lenses');
const PROFILES_DIR = path.join(__dirname, '..');
const UNIFIED_DIR = path.join(PROFILES_DIR, 'profiles', 'unified');
const MURMURATIONS_DIR = path.join(PROFILES_DIR, 'profiles', 'murmurations');

// Lens files
const UNIFIED_TO_MURM_PERSON = path.join(LENS_DIR, 'unified-to-murmurations-person.lens.yml');
const UNIFIED_TO_MURM_ORG = path.join(LENS_DIR, 'unified-to-murmurations-organization.lens.yml');

/**
 * Add required relationship properties to Murmurations profiles
 */
function addRelationshipProperties(profile) {
  if (!profile.relationships || !Array.isArray(profile.relationships)) {
    return profile;
  }

  profile.relationships = profile.relationships.map(rel => {
    // Skip if already has required properties
    if (rel.predicate_url && rel.object_url) {
      return rel;
    }

    // Add required properties
    const updatedRel = { ...rel };
    
    // Set predicate_url based on relationship type
    switch (rel.type) {
      case 'member':
        updatedRel.predicate_url = 'https://schema.org/memberOf';
        break;
      case 'advisor':
        updatedRel.predicate_url = 'https://schema.org/advisorTo';
        break;
      case 'collaboration':
        updatedRel.predicate_url = 'https://schema.org/collaboratesWith';
        break;
      default:
        updatedRel.predicate_url = `https://schema.org/${rel.type}`;
    }

    // Set object_url to target_url if available, otherwise use a placeholder
    updatedRel.object_url = rel.target_url || `https://example.com/${rel.target.toLowerCase().replace(/\s+/g, '-')}`;

    return updatedRel;
  });

  return profile;
}

/**
 * Generate a slugified version of a name for use in profile_source URLs
 */
function slugifyName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Convert a unified profile to Murmurations format with profile_source field
 */
async function convertUnifiedToMurmurations(unifiedProfile, profileType) {
  try {
    console.log('Converting profile:', JSON.stringify(unifiedProfile, null, 2));
    
    // Create a simplified version of the profile without JSON-LD specific properties
    const simplifiedProfile = { ...unifiedProfile };
    delete simplifiedProfile['@context'];
    delete simplifiedProfile['@type'];
    
    console.log('Simplified profile:', JSON.stringify(simplifiedProfile, null, 2));
    
    // Create a schema based on the actual profile properties
    const inputSchema = {
      $schema: 'http://json-schema.org/draft-07/schema',
      type: 'object',
      properties: {}
    };
    
    // Add all properties from the simplified profile to the schema
    Object.keys(simplifiedProfile).forEach(key => {
      const value = simplifiedProfile[key];
      
      if (Array.isArray(value)) {
        inputSchema.properties[key] = {
          type: 'array',
          items: {}
        };
        
        // If array has items, infer schema from first item
        if (value.length > 0) {
          const firstItem = value[0];
          
          if (typeof firstItem === 'object' && firstItem !== null) {
            inputSchema.properties[key].items = {
              type: 'object',
              properties: {}
            };
            
            // Add properties for each key in the object
            Object.keys(firstItem).forEach(itemKey => {
              inputSchema.properties[key].items.properties[itemKey] = {
                type: typeof firstItem[itemKey]
              };
            });
          } else {
            inputSchema.properties[key].items = {
              type: typeof firstItem
            };
          }
        }
      } else if (typeof value === 'object' && value !== null) {
        inputSchema.properties[key] = {
          type: 'object',
          properties: {}
        };
        
        // Add properties for each key in the object
        Object.keys(value).forEach(objKey => {
          inputSchema.properties[key].properties[objKey] = {
            type: typeof value[objKey]
          };
        });
      } else {
        inputSchema.properties[key] = {
          type: typeof value
        };
      }
    });
    
    // Load the appropriate lens
    let lensFile;
    if (profileType === 'person') {
      lensFile = UNIFIED_TO_MURM_PERSON;
    } else {
      // Use the organization lens for organizations
      lensFile = UNIFIED_TO_MURM_ORG;
    }

    console.log('Using lens file:', lensFile);
    const lensContent = fs.readFileSync(lensFile, 'utf8');
    
    const lens = loadYamlLens(lensContent);
    
    // Apply the lens to convert from unified to Murmurations format
    console.log('Applying lens to document...');
    let murmurationsProfile = applyLensToDoc(lens, simplifiedProfile, inputSchema);
    
    // Add required relationship properties
    murmurationsProfile = addRelationshipProperties(murmurationsProfile);
    
    // Set the linked_schemas based on profile type
    if (profileType === 'person') {
      murmurationsProfile.linked_schemas = ['people_schema-v0.1.0'];
    } else {
      murmurationsProfile.linked_schemas = ['organizations_schema-v1.0.0'];
    }
    
    // Add JSON-LD @reverse link to the original unified profile
    const slugName = slugifyName(murmurationsProfile.name);
    const profilePrefix = profileType === 'person' ? 'regen-person-' : 'regen-org-';
    
    // Create a unique ID for this Murmurations profile
    murmurationsProfile['@id'] = `https://murmurations.network/profile/${slugName}`;
    
    // Add @reverse link to the original unified profile
    let sourceUrl;
    
    // Handle special cases
    if (profileType === 'organization' && murmurationsProfile.name === 'Global Regenerative Cooperative') {
      sourceUrl = 'https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/unified/regen-org-global-regenerative-coop.jsonld';
    } else if (profileType === 'person' && murmurationsProfile.name === 'Dr. Karen O\'Brien') {
      sourceUrl = 'https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/unified/regen-person-karen-obrien.jsonld';
    } else {
      sourceUrl = `https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/unified/${profilePrefix}${slugName}.jsonld`;
    }
    
    // Add the @reverse link
    murmurationsProfile['@reverse'] = {
      'schema:isBasedOn': {
        '@id': sourceUrl
      }
    };
    
    // Keep the profile_source field for backward compatibility
    murmurationsProfile.profile_source = sourceUrl;
    
    return murmurationsProfile;
  } catch (error) {
    console.error(`❌ Error converting profile: ${error.message}`);
    throw error;
  }
}

/**
 * Fetch a profile from a URL
 */
async function fetchProfile(url) {
  try {
    console.log(`🔍 Fetching profile from: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`❌ Error fetching profile: ${error.message}`);
    return null;
  }
}

/**
 * Convert a Murmurations profile back to unified format
 * This will attempt to fetch the original unified profile using the profile_source field
 */
async function convertMurmurationsToUnified(murmProfile) {
  try {
    // Check if the profile has a profile_source field
    if (murmProfile.profile_source) {
      try {
        // Attempt to fetch the original unified profile
        console.log(`🔄 Found profile_source: ${murmProfile.profile_source}`);
        const originalProfile = await fetchProfile(murmProfile.profile_source);
        
        if (originalProfile) {
          console.log('✅ Successfully fetched original unified profile');
          return originalProfile;
        } else {
          console.warn('⚠️ Failed to fetch original profile, falling back to lens transformation');
        }
      } catch (fetchError) {
        console.warn(`⚠️ Error fetching original profile: ${fetchError.message}`);
        console.warn('⚠️ Falling back to lens transformation');
      }
    }
    
    // If no profile_source or fetching failed, use lens transformation
    // Load the Murmurations to Unified lens
    const lensFile = path.join(LENS_DIR, 'murmurations-to-unified-person.lens.yml');
    const lensContent = fs.readFileSync(lensFile, 'utf8');
    const lens = loadYamlLens(lensContent);
    
    console.log('🔄 Using lens transformation for Murmurations → Unified conversion');
    let result = applyLensToDoc(lens, murmProfile);
    
    // Add required context and type information
    result['@context'] = {
      "@version": 1.1,
      "@vocab": "https://schema.org/",
      "schema": "https://schema.org/",
      "murm": "https://murmurations.network/schemas/",
      "regen": "https://darrenzal.github.io/RegenMapping/ontology/"
    };
    
    // Determine type based on linked_schemas
    const isOrganization = murmProfile.linked_schemas && 
      murmProfile.linked_schemas.some(schema => schema.includes('organizations_schema'));
    
    result['@type'] = isOrganization ? 
      ["schema:Organization", "regen:RegenerativeOrganization"] :
      ["schema:Person", "regen:RegenerativePerson"];
    
    // Preserve the name property
    result.name = murmProfile.name;
    
    // Map primary_url to murm:primary_url
    if (murmProfile.primary_url) {
      result['murm:primary_url'] = murmProfile.primary_url;
    }
    
    // Add location information
    if (murmProfile.locality) {
      const locationKey = isOrganization ? 'schema:location' : 'schema:homeLocation';
      result[locationKey] = {
        "@type": "schema:Place",
        "schema:addressLocality": murmProfile.locality,
        "schema:addressRegion": murmProfile.region,
        "schema:addressCountry": murmProfile.country_name
      };
    }
    
    // Map tags to domain tags
    if (murmProfile.tags) {
      result['regen:domainTags'] = murmProfile.tags;
    }
    
    // Preserve relationships
    if (murmProfile.relationships) {
      result['regen:relationships'] = murmProfile.relationships;
    }
    
    // Map other fields that might be present
    if (isOrganization) {
      // Organization-specific fields
      if (murmProfile.mission) result.mission = murmProfile.mission;
      if (murmProfile.tagline) result.tagline = murmProfile.tagline;
      if (murmProfile.legal_type) result.legalType = murmProfile.legal_type;
      if (murmProfile.founded_year) result.foundedYear = murmProfile.founded_year;
      if (murmProfile.employee_range) result.employeeRange = murmProfile.employee_range;
      if (murmProfile.sdg_focus) result.sdgFocus = murmProfile.sdg_focus;
      if (murmProfile.key_activities) result.keyActivities = murmProfile.key_activities;
    } else {
      // Person-specific fields
      if (murmProfile.headline) result.headline = murmProfile.headline;
      if (murmProfile.current_title) result.currentTitle = murmProfile.current_title;
      if (murmProfile.current_org_id) result.currentOrgId = murmProfile.current_org_id;
      if (murmProfile.display_handle) result.displayHandle = murmProfile.display_handle;
      if (murmProfile.domain_tags) result.domainTags = murmProfile.domain_tags;
      if (murmProfile.method_tags) result.methodTags = murmProfile.method_tags;
      if (murmProfile.theory_tags) result.theoryTags = murmProfile.theory_tags;
      if (murmProfile.pronouns) result.pronouns = murmProfile.pronouns;
    }
    
    // Common fields
    if (murmProfile.last_updated) result.lastUpdated = murmProfile.last_updated;
    
    return result;
  } catch (error) {
    console.error(`❌ Error converting Murmurations profile to Unified: ${error.message}`);
    throw error;
  }
}

/**
 * Process all unified profiles and convert them to Murmurations format
 */
async function processUnifiedProfiles() {
  // Create the output directory if it doesn't exist
  if (!fs.existsSync(MURMURATIONS_DIR)) {
    fs.mkdirSync(MURMURATIONS_DIR, { recursive: true });
  }

  // Get all JSON-LD files in the unified directory
  const unifiedFiles = fs.readdirSync(UNIFIED_DIR)
    .filter(file => file.endsWith('.jsonld'));

  console.log(`📁 Found ${unifiedFiles.length} unified profiles`);

  for (const file of unifiedFiles) {
    try {
      const filePath = path.join(UNIFIED_DIR, file);
      const unifiedProfile = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Determine profile type (person or organization)
      const isPerson = file.includes('person');
      const profileType = isPerson ? 'person' : 'organization';
      
      console.log(`📄 Processing: ${file} (${profileType})`);
      
      // Convert to Murmurations format
      const murmurationsProfile = await convertUnifiedToMurmurations(unifiedProfile, profileType);
      
      // Generate output filename
      // Convert from regen-person-name.jsonld to murm-person-name.json
      const outputFile = file
        .replace('regen-', 'murm-')
        .replace('.jsonld', '.json');
      
      const outputPath = path.join(MURMURATIONS_DIR, outputFile);
      
      // Write the converted profile
      fs.writeFileSync(outputPath, JSON.stringify(murmurationsProfile, null, 2));
      
      console.log(`✅ Saved: ${outputFile}`);
    } catch (error) {
      console.error(`❌ Error processing ${file}: ${error.message}`);
    }
  }
}

/**
 * Test the round-trip conversion for a specific profile
 */
async function testRoundTripConversion(unifiedFilePath) {
  try {
    console.log(`🔄 Testing round-trip conversion for: ${unifiedFilePath}`);
    
    // Read the unified profile
    const unifiedProfile = JSON.parse(fs.readFileSync(unifiedFilePath, 'utf8'));
    
    // Determine profile type
    const isPerson = unifiedFilePath.includes('person');
    const profileType = isPerson ? 'person' : 'organization';
    
    // Convert to Murmurations format
    console.log('Step 1: Converting Unified → Murmurations');
    const murmurationsProfile = await convertUnifiedToMurmurations(unifiedProfile, profileType);
    
    // Convert back to unified format
    console.log('Step 2: Converting Murmurations → Unified');
    const roundTripProfile = await convertMurmurationsToUnified(murmurationsProfile);
    
    // Compare the original and round-trip profiles
    console.log('Step 3: Comparing original and round-trip profiles');
    
    // Check if the profile_source was used
    if (roundTripProfile._fetchedFromSource) {
      console.log('✅ Round-trip successful: Original profile was fetched using profile_source');
      return true;
    }
    
    // Compare key fields
    const fieldsToCompare = [
      'name',
      '@type',
      'murm:primary_url',
      'regen:locality',
      'regen:domainTags'
    ];
    
    let allFieldsMatch = true;
    
    for (const field of fieldsToCompare) {
      if (JSON.stringify(unifiedProfile[field]) !== JSON.stringify(roundTripProfile[field])) {
        console.log(`❌ Field mismatch: ${field}`);
        console.log(`  Original: ${JSON.stringify(unifiedProfile[field])}`);
        console.log(`  Round-trip: ${JSON.stringify(roundTripProfile[field])}`);
        allFieldsMatch = false;
      }
    }
    
    if (allFieldsMatch) {
      console.log('✅ Round-trip successful: All key fields match');
      return true;
    } else {
      console.log('❌ Round-trip failed: Some fields do not match');
      return false;
    }
  } catch (error) {
    console.error(`❌ Error testing round-trip conversion: ${error.message}`);
    return false;
  }
}

/**
 * Main execution function
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (command === 'convert-all') {
    console.log('🔄 Converting all Unified profiles to Murmurations format...\n');
    
    try {
      await processUnifiedProfiles();
      
      console.log('\n✅ Conversion completed!');
      console.log(`📁 Converted profiles saved to: ${MURMURATIONS_DIR}`);
      
      console.log('\n📝 Next steps:');
      console.log('1. Validate the converted profiles with Murmurations');
      console.log('2. Submit the profiles to the Murmurations index');
      console.log('3. Run: node scripts/test-queries.js');
    } catch (error) {
      console.error('\n❌ Error during conversion:', error);
      process.exit(1);
    }
  } else if (command === 'test-roundtrip') {
    const profilePath = args[1];
    
    if (!profilePath) {
      console.error('❌ Error: Please provide a path to a unified profile');
      console.log('Usage: node scripts/lossless-conversion.js test-roundtrip <path-to-unified-profile>');
      process.exit(1);
    }
    
    try {
      const success = await testRoundTripConversion(profilePath);
      
      if (success) {
        console.log('\n✅ Round-trip test completed successfully!');
        process.exit(0);
      } else {
        console.log('\n❌ Round-trip test failed');
        process.exit(1);
      }
    } catch (error) {
      console.error('\n❌ Error during round-trip test:', error);
      process.exit(1);
    }
  } else {
    console.log('📋 Lossless Conversion Utility');
    console.log('\nUsage:');
    console.log('  node scripts/lossless-conversion.js convert-all');
    console.log('  node scripts/lossless-conversion.js test-roundtrip <path-to-unified-profile>');
    console.log('\nCommands:');
    console.log('  convert-all         Convert all unified profiles to Murmurations format');
    console.log('  test-roundtrip      Test round-trip conversion for a specific profile');
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
}

// Export functions for use in other scripts
module.exports = {
  convertUnifiedToMurmurations,
  convertMurmurationsToUnified,
  testRoundTripConversion,
  processUnifiedProfiles,
  fetchProfile,
  slugifyName
};
