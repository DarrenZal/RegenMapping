#!/usr/bin/env node

/**
 * Simple test script for Cambria lenses
 * This script tests a minimal conversion to identify issues
 */

const fs = require('fs');
const path = require('path');
const { loadYamlLens, applyLensToDoc } = require('cambria');

// Create a simple test input
const simpleInput = {
  "name": "Test Person",
  "url": "https://example.com",
  "location": {
    "latitude": 45.0,
    "longitude": -85.0
  }
};

// Create a simple lens
const simpleLens = [
  {
    "op": "rename",
    "source": "name",
    "destination": "fullName"
  },
  {
    "op": "rename",
    "source": "url",
    "destination": "website"
  },
  {
    "op": "in",
    "name": "location",
    "lens": [
      {
        "op": "rename",
        "source": "latitude",
        "destination": "lat"
      },
      {
        "op": "rename",
        "source": "longitude",
        "destination": "lon"
      }
    ]
  }
];

// Create a simple schema
const simpleSchema = {
  "$schema": "http://json-schema.org/draft-07/schema",
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "url": { "type": "string" },
    "location": {
      "type": "object",
      "properties": {
        "latitude": { "type": "number" },
        "longitude": { "type": "number" }
      }
    }
  }
};

console.log('🔄 Testing Cambria with Simple Schema\n');

console.log('Input:', JSON.stringify(simpleInput, null, 2));
console.log('Lens:', JSON.stringify(simpleLens, null, 2));
console.log('Schema:', JSON.stringify(simpleSchema, null, 2));

try {
  // Apply the lens to the input
  const output = applyLensToDoc(simpleLens, simpleInput, simpleSchema);
  console.log('\nOutput:', JSON.stringify(output, null, 2));
  console.log('\n✅ Conversion successful!');
} catch (error) {
  console.error('\n❌ Error in conversion:', error.message);
  console.error(error.stack);
}

// Now try with a more complex input that includes arrays
const complexInput = {
  "name": "Test Person",
  "url": "https://example.com",
  "location": {
    "latitude": 45.0,
    "longitude": -85.0
  },
  "tags": ["tag1", "tag2", "tag3"],
  "relationships": [
    {
      "type": "friend",
      "target": "Another Person",
      "url": "https://example.org"
    }
  ]
};

// Create a more complex lens
const complexLens = [
  ...simpleLens,
  {
    "op": "rename",
    "source": "tags",
    "destination": "keywords"
  },
  {
    "op": "rename",
    "source": "relationships",
    "destination": "connections"
  }
];

// Create a more complex schema
const complexSchema = {
  "$schema": "http://json-schema.org/draft-07/schema",
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "url": { "type": "string" },
    "location": {
      "type": "object",
      "properties": {
        "latitude": { "type": "number" },
        "longitude": { "type": "number" }
      }
    },
    "tags": {
      "type": "array",
      "items": { "type": "string" }
    },
    "relationships": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": { "type": "string" },
          "target": { "type": "string" },
          "url": { "type": "string" }
        }
      }
    }
  }
};

console.log('\n\n🔄 Testing Cambria with Complex Schema\n');

console.log('Input:', JSON.stringify(complexInput, null, 2));
console.log('Lens:', JSON.stringify(complexLens, null, 2));
console.log('Schema:', JSON.stringify(complexSchema, null, 2));

try {
  // Apply the lens to the input
  const output = applyLensToDoc(complexLens, complexInput, complexSchema);
  console.log('\nOutput:', JSON.stringify(output, null, 2));
  console.log('\n✅ Conversion successful!');
} catch (error) {
  console.error('\n❌ Error in conversion:', error.message);
  console.error(error.stack);
}

// Now try with a nested array
const nestedInput = {
  "name": "Test Person",
  "url": "https://example.com",
  "location": {
    "latitude": 45.0,
    "longitude": -85.0
  },
  "relationships": [
    {
      "type": "friend",
      "target": "Another Person",
      "url": "https://example.org",
      "details": [
        { "key": "since", "value": "2020" },
        { "key": "met", "value": "conference" }
      ]
    }
  ]
};

// Create a lens for nested arrays
const nestedLens = [
  ...simpleLens,
  {
    "op": "rename",
    "source": "relationships",
    "destination": "connections"
  }
];

// Create a schema for nested arrays
const nestedSchema = {
  "$schema": "http://json-schema.org/draft-07/schema",
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "url": { "type": "string" },
    "location": {
      "type": "object",
      "properties": {
        "latitude": { "type": "number" },
        "longitude": { "type": "number" }
      }
    },
    "relationships": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": { "type": "string" },
          "target": { "type": "string" },
          "url": { "type": "string" },
          "details": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "key": { "type": "string" },
                "value": { "type": "string" }
              }
            }
          }
        }
      }
    }
  }
};

console.log('\n\n🔄 Testing Cambria with Nested Arrays\n');

console.log('Input:', JSON.stringify(nestedInput, null, 2));
console.log('Lens:', JSON.stringify(nestedLens, null, 2));
console.log('Schema:', JSON.stringify(nestedSchema, null, 2));

try {
  // Apply the lens to the input
  const output = applyLensToDoc(nestedLens, nestedInput, nestedSchema);
  console.log('\nOutput:', JSON.stringify(output, null, 2));
  console.log('\n✅ Conversion successful!');
} catch (error) {
  console.error('\n❌ Error in conversion:', error.message);
  console.error(error.stack);
}
