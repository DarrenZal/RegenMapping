#!/usr/bin/env node

/**
 * Convert Unified profiles to Murmurations profiles using Cambria lenses
 * 
 * This script:
 * 1. Reads unified profiles from profiles/unified
 * 2. Applies Cambria lenses to convert them to Murmurations format
 * 3. Adds required relationship properties
 * 4. Saves the converted profiles to profiles/murmurations
 */

const fs = require('fs');
const path = require('path');
const { loadYamlLens, applyLensToDoc } = require('cambria');

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
 * Convert a unified profile to Murmurations format
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
    
    console.log('Generated schema:', JSON.stringify(inputSchema, null, 2));
    
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
    console.log('Lens content:', lensContent);
    
    const lens = loadYamlLens(lensContent);
    console.log('Loaded lens:', lens);
    
    // Apply the lens to convert from unified to Murmurations format
    console.log('Applying lens to document...');
    let murmurationsProfile = applyLensToDoc(lens, simplifiedProfile, inputSchema);
    console.log('Conversion result:', murmurationsProfile);
    
    // Add required relationship properties
    murmurationsProfile = addRelationshipProperties(murmurationsProfile);
    
    // Set the linked_schemas based on profile type
    if (profileType === 'person') {
      murmurationsProfile.linked_schemas = ['people_schema-v0.1.0'];
    } else {
      murmurationsProfile.linked_schemas = ['organizations_schema-v1.0.0'];
    }
    
    return murmurationsProfile;
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
 * Main execution function
 */
async function main() {
  console.log('🔄 Converting Unified profiles to Murmurations format...\n');

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
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { convertUnifiedToMurmurations, addRelationshipProperties };
