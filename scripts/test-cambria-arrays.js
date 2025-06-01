#!/usr/bin/env node

/**
 * Detailed test script for Cambria lenses focusing on array handling
 * This script tests different array scenarios to identify issues
 */

const fs = require('fs');
const path = require('path');
const { loadYamlLens, applyLensToDoc } = require('cambria');

// Add debug logging to the to-json-schema library
const toJsonSchemaPath = path.join(__dirname, '..', 'node_modules', 'to-json-schema', 'lib', 'index.js');
const toJsonSchemaContent = fs.readFileSync(toJsonSchemaPath, 'utf8');
const debuggedContent = toJsonSchemaContent.replace(
  'getCommonArrayItemSchema(arr) {',
  'getCommonArrayItemSchema(arr) {\n    console.log("getCommonArrayItemSchema called with:", JSON.stringify(arr));'
).replace(
  'return arr.reduce((schema, item) => {',
  'return arr.reduce((schema, item, index) => {\n      console.log(`Processing array item ${index}:`, JSON.stringify(item));'
).replace(
  'return mergeSchemaObjs(schema, itemSchema);',
  'const result = mergeSchemaObjs(schema, itemSchema);\n      console.log(`Merged schema for item ${index}:`, JSON.stringify(result));\n      return result;'
);

fs.writeFileSync(toJsonSchemaPath + '.bak', toJsonSchemaContent);
fs.writeFileSync(toJsonSchemaPath, debuggedContent);

// Test 1: Simple array of strings
console.log('\n\n🔄 Test 1: Simple array of strings\n');

const simpleArrayInput = {
  "tags": ["tag1", "tag2", "tag3"]
};

const simpleArrayLens = [
  {
    "op": "rename",
    "source": "tags",
    "destination": "keywords"
  }
];

const simpleArraySchema = {
  "$schema": "http://json-schema.org/draft-07/schema",
  "type": "object",
  "properties": {
    "tags": {
      "type": "array",
      "items": { "type": "string" }
    }
  }
};

console.log('Input:', JSON.stringify(simpleArrayInput, null, 2));
console.log('Lens:', JSON.stringify(simpleArrayLens, null, 2));
console.log('Schema:', JSON.stringify(simpleArraySchema, null, 2));

try {
  const output = applyLensToDoc(simpleArrayLens, simpleArrayInput, simpleArraySchema);
  console.log('\nOutput:', JSON.stringify(output, null, 2));
  console.log('\n✅ Test 1 successful!');
} catch (error) {
  console.error('\n❌ Test 1 error:', error.message);
  console.error(error.stack);
}

// Test 2: Array of objects
console.log('\n\n🔄 Test 2: Array of objects\n');

const objectArrayInput = {
  "relationships": [
    {
      "type": "friend",
      "target": "Person 1"
    }
  ]
};

const objectArrayLens = [
  {
    "op": "rename",
    "source": "relationships",
    "destination": "connections"
  }
];

const objectArraySchema = {
  "$schema": "http://json-schema.org/draft-07/schema",
  "type": "object",
  "properties": {
    "relationships": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": { "type": "string" },
          "target": { "type": "string" }
        }
      }
    }
  }
};

console.log('Input:', JSON.stringify(objectArrayInput, null, 2));
console.log('Lens:', JSON.stringify(objectArrayLens, null, 2));
console.log('Schema:', JSON.stringify(objectArraySchema, null, 2));

try {
  const output = applyLensToDoc(objectArrayLens, objectArrayInput, objectArraySchema);
  console.log('\nOutput:', JSON.stringify(output, null, 2));
  console.log('\n✅ Test 2 successful!');
} catch (error) {
  console.error('\n❌ Test 2 error:', error.message);
  console.error(error.stack);
}

// Test 3: Empty array
console.log('\n\n🔄 Test 3: Empty array\n');

const emptyArrayInput = {
  "relationships": []
};

const emptyArrayLens = [
  {
    "op": "rename",
    "source": "relationships",
    "destination": "connections"
  }
];

const emptyArraySchema = {
  "$schema": "http://json-schema.org/draft-07/schema",
  "type": "object",
  "properties": {
    "relationships": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": { "type": "string" },
          "target": { "type": "string" }
        }
      }
    }
  }
};

console.log('Input:', JSON.stringify(emptyArrayInput, null, 2));
console.log('Lens:', JSON.stringify(emptyArrayLens, null, 2));
console.log('Schema:', JSON.stringify(emptyArraySchema, null, 2));

try {
  const output = applyLensToDoc(emptyArrayLens, emptyArrayInput, emptyArraySchema);
  console.log('\nOutput:', JSON.stringify(output, null, 2));
  console.log('\n✅ Test 3 successful!');
} catch (error) {
  console.error('\n❌ Test 3 error:', error.message);
  console.error(error.stack);
}

// Test 4: Array with mixed types
console.log('\n\n🔄 Test 4: Array with mixed types\n');

const mixedArrayInput = {
  "values": ["string", 42, true, { "key": "value" }]
};

const mixedArrayLens = [
  {
    "op": "rename",
    "source": "values",
    "destination": "items"
  }
];

const mixedArraySchema = {
  "$schema": "http://json-schema.org/draft-07/schema",
  "type": "object",
  "properties": {
    "values": {
      "type": "array",
      "items": {}
    }
  }
};

console.log('Input:', JSON.stringify(mixedArrayInput, null, 2));
console.log('Lens:', JSON.stringify(mixedArrayLens, null, 2));
console.log('Schema:', JSON.stringify(mixedArraySchema, null, 2));

try {
  const output = applyLensToDoc(mixedArrayLens, mixedArrayInput, mixedArraySchema);
  console.log('\nOutput:', JSON.stringify(output, null, 2));
  console.log('\n✅ Test 4 successful!');
} catch (error) {
  console.error('\n❌ Test 4 error:', error.message);
  console.error(error.stack);
}

// Test 5: Array with null values
console.log('\n\n🔄 Test 5: Array with null values\n');

const nullArrayInput = {
  "values": ["string", null, "another string"]
};

const nullArrayLens = [
  {
    "op": "rename",
    "source": "values",
    "destination": "items"
  }
];

const nullArraySchema = {
  "$schema": "http://json-schema.org/draft-07/schema",
  "type": "object",
  "properties": {
    "values": {
      "type": "array",
      "items": { "type": ["string", "null"] }
    }
  }
};

console.log('Input:', JSON.stringify(nullArrayInput, null, 2));
console.log('Lens:', JSON.stringify(nullArrayLens, null, 2));
console.log('Schema:', JSON.stringify(nullArraySchema, null, 2));

try {
  const output = applyLensToDoc(nullArrayLens, nullArrayInput, nullArraySchema);
  console.log('\nOutput:', JSON.stringify(output, null, 2));
  console.log('\n✅ Test 5 successful!');
} catch (error) {
  console.error('\n❌ Test 5 error:', error.message);
  console.error(error.stack);
}

// Don't restore the original to-json-schema file
console.log('\n\nKeeping patched to-json-schema file');
