#!/usr/bin/env node

/**
 * Patch for to-json-schema library to fix array handling
 */

const fs = require('fs');
const path = require('path');

// Path to the to-json-schema index.js file
const toJsonSchemaPath = path.join(__dirname, '..', 'node_modules', 'to-json-schema', 'lib', 'index.js');

// Read the current content
console.log(`Reading file: ${toJsonSchemaPath}`);
const originalContent = fs.readFileSync(toJsonSchemaPath, 'utf8');

// Create a backup
const backupPath = `${toJsonSchemaPath}.bak`;
console.log(`Creating backup: ${backupPath}`);
fs.writeFileSync(backupPath, originalContent);

// Find the problematic code
const problematicCode = `return schemas.reduce(function (acc, current) {
        return helpers.mergeSchemaObjs(acc, current);
      }, schemas.pop());`;

// Replace with fixed code
const fixedCode = `// Fix for "Cannot read properties of null (reading 'type')" error
      if (schemas.length === 0) {
        return null;
      }
      
      // Save the last schema before popping it
      const lastSchema = schemas[schemas.length - 1];
      schemas.pop();
      
      // If there are no more schemas to reduce, return the last schema
      if (schemas.length === 0) {
        return lastSchema;
      }
      
      // Otherwise, reduce the remaining schemas with the last schema as the initial value
      return schemas.reduce(function (acc, current) {
        return helpers.mergeSchemaObjs(acc, current);
      }, lastSchema);`;

// Replace the problematic code with the fixed code
const patchedContent = originalContent.replace(problematicCode, fixedCode);

// Write the patched file
console.log(`Writing patched file: ${toJsonSchemaPath}`);
fs.writeFileSync(toJsonSchemaPath, patchedContent);

console.log('Patch applied successfully!');
