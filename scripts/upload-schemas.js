#!/usr/bin/env node

/**
 * Generate Murmurations-compatible schemas from our unified schemas
 * 
 * NOTE: Based on Murmurations documentation, custom schemas need to be submitted
 * to the production library via GitHub, not uploaded via API. This script generates
 * the converted schemas for manual submission and focuses on testing with existing
 * base schemas.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Murmurations test library endpoints
const MURMURATIONS_TEST_BASE = 'https://test-library.murmurations.network';
const SCHEMA_UPLOAD_ENDPOINT = `${MURMURATIONS_TEST_BASE}/v2/schemas`;

/**
 * Convert JSON-LD schema to Murmurations JSON Schema format
 */
function convertToMurmurationsSchema(jsonldSchema, schemaId, schemaName) {
  // Extract properties from the JSON-LD schema
  const graph = jsonldSchema['@graph'];
  const schemaDefinition = graph.find(item => item['@type'] === 'rdfs:Class');
  
  if (!schemaDefinition || !schemaDefinition['schema:properties']) {
    throw new Error('Invalid schema structure');
  }

  const properties = {};
  const required = [];

  // Process each property from the unified schema
  schemaDefinition['schema:properties'].forEach(prop => {
    const propId = prop['@id'];
    const propName = propId.split(':').pop() || propId.split('/').pop();
    
    // Skip if it's a nested property object
    if (typeof prop === 'object' && prop['schema:properties']) {
      return;
    }

    properties[propName] = {
      title: prop['rdfs:label'] || propName,
      description: prop['rdfs:comment'] || '',
      type: getJsonSchemaType(prop['@type'] || prop['rangeIncludes'])
    };

    // Add to required if marked as required
    if (prop['schema:required'] === true || prop.required === true) {
      required.push(propName);
    }
  });

  // Ensure linked_schemas is always required
  if (!required.includes('linked_schemas')) {
    required.push('linked_schemas');
  }

  // Add linked_schemas property if not present
  if (!properties.linked_schemas) {
    properties.linked_schemas = {
      title: "Linked Schemas",
      description: "A list of schemas against which a profile must be validated",
      type: "array",
      items: {
        type: "string"
      }
    };
  }

  return {
    "$schema": "https://json-schema.org/draft-07/schema#",
    "$id": `${MURMURATIONS_TEST_BASE}/v2/schemas/${schemaId}`,
    "title": schemaName,
    "description": jsonldSchema['@graph'][0]['schema:description'] || `${schemaName} for regenerative economy mapping`,
    "type": "object",
    "properties": properties,
    "required": required,
    "metadata": {
      "creator": {
        "name": "Regen Mapping Project",
        "url": "https://regen-map.org/"
      },
      "schema": {
        "name": schemaId,
        "purpose": `Enhanced ${schemaName.toLowerCase()} schema for regenerative economy visualization and network discovery`,
        "url": "https://regen-map.org"
      }
    }
  };
}

/**
 * Convert JSON-LD type to JSON Schema type
 */
function getJsonSchemaType(type) {
  if (!type) return 'string';
  
  const typeStr = typeof type === 'string' ? type : type.toString();
  
  if (typeStr.includes('Text') || typeStr.includes('string')) return 'string';
  if (typeStr.includes('Number') || typeStr.includes('Integer')) return 'number';
  if (typeStr.includes('Boolean')) return 'boolean';
  if (typeStr.includes('Date')) return 'string';
  if (typeStr.includes('URL')) return 'string';
  if (typeStr.includes('Array') || typeStr.includes('set')) return 'array';
  
  return 'string'; // default
}

/**
 * Upload schema to Murmurations test library
 */
async function uploadSchema(schema, schemaId) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(schema);
    
    const options = {
      hostname: 'test-library.murmurations.network',
      port: 443,
      path: `/v2/schemas/${schemaId}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`✅ Successfully uploaded schema: ${schemaId}`);
          resolve({ statusCode: res.statusCode, data: responseData });
        } else {
          console.error(`❌ Failed to upload schema: ${schemaId}`);
          console.error(`Status: ${res.statusCode}`);
          console.error(`Response: ${responseData}`);
          reject(new Error(`Upload failed with status ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Error uploading schema ${schemaId}:`, error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Generating Murmurations-compatible schemas...\n');
  console.log('ℹ️  Note: Custom schemas must be submitted to Murmurations via GitHub.');
  console.log('   This script generates the converted schemas for reference.\n');

  try {
    // Load and convert Person schema
    console.log('📄 Processing Person schema...');
    const personSchemaPath = path.join(__dirname, '../Ontology/Person/unified-person-schema.jsonld');
    const personSchema = JSON.parse(fs.readFileSync(personSchemaPath, 'utf8'));
    const personMurmSchema = convertToMurmurationsSchema(
      personSchema, 
      'regen-person-schema-v1.0.0',
      'Regenerative Person Schema'
    );
    
    // Save converted schema for reference
    fs.writeFileSync(
      path.join(__dirname, '../schemas-for-upload/regen-person-schema-v1.0.0.json'),
      JSON.stringify(personMurmSchema, null, 2)
    );
    console.log('✅ Generated: regen-person-schema-v1.0.0.json');

    // Load and convert Organization schema
    console.log('📄 Processing Organization schema...');
    const orgSchemaPath = path.join(__dirname, '../Ontology/Organization/unified-organization-schema.jsonld');
    const orgSchema = JSON.parse(fs.readFileSync(orgSchemaPath, 'utf8'));
    const orgMurmSchema = convertToMurmurationsSchema(
      orgSchema,
      'regen-organization-schema-v1.0.0', 
      'Regenerative Organization Schema'
    );
    
    // Save converted schema for reference
    fs.writeFileSync(
      path.join(__dirname, '../schemas-for-upload/regen-organization-schema-v1.0.0.json'),
      JSON.stringify(orgMurmSchema, null, 2)
    );
    console.log('✅ Generated: regen-organization-schema-v1.0.0.json');

    console.log('\n✅ Schema conversion completed!');
    console.log('\n📁 Generated schemas saved to: schemas-for-upload/');
    console.log('\nNext steps:');
    console.log('1. Submit schemas to Murmurations via GitHub (for production use)');
    console.log('2. Run: node scripts/upload-profiles.js (test with base schemas)');
    console.log('3. Run: node scripts/test-queries.js');

  } catch (error) {
    console.error('\n❌ Error during schema conversion:', error);
    process.exit(1);
  }
}

// Create output directory
const outputDir = path.join(__dirname, '../schemas-for-upload');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { convertToMurmurationsSchema, uploadSchema };
