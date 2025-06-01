#!/usr/bin/env node

/**
 * Patch for to-json-schema helpers.js file to fix array handling
 */

const fs = require('fs');
const path = require('path');

// Path to the to-json-schema helpers.js file
const helpersPath = path.join(__dirname, '..', 'node_modules', 'to-json-schema', 'lib', 'helpers.js');

// Read the current content
console.log(`Reading file: ${helpersPath}`);
const originalContent = fs.readFileSync(helpersPath, 'utf8');

// Create a backup
const backupPath = `${helpersPath}.bak`;
console.log(`Creating backup: ${backupPath}`);
fs.writeFileSync(backupPath, originalContent);

// Find the problematic code
const problematicCode = `  mergeSchemaObjs: function mergeSchemaObjs(schema1, schema2) {
    var schema1Keys = keys(schema1);
    var schema2Keys = keys(schema2);

    if (!isEqual(schema1Keys, schema2Keys)) {
      if (schema1.type === 'array' && schema2.type === 'array') {
        // TODO optimize???
        if (isEqual(xor(schema1Keys, schema2Keys), ['items'])) {
          var schemaWithoutItems = schema1Keys.length > schema2Keys.length ? schema2 : schema1;
          var schemaWithItems = schema1Keys.length > schema2Keys.length ? schema1 : schema2;
          var isSame = keys(schemaWithoutItems).reduce(function (acc, current) {
            return isEqual(schemaWithoutItems[current], schemaWithItems[current]) && acc;
          }, true);

          if (isSame) {
            return schemaWithoutItems;
          }
        }
      }

      if (schema1.type !== 'object' || schema2.type !== 'object') {
        return null;
      }
    }`;

// Replace with fixed code
const fixedCode = `  mergeSchemaObjs: function mergeSchemaObjs(schema1, schema2) {
    // Fix for "Cannot read properties of null (reading 'type')" error
    if (!schema1 || !schema2) {
      return schema1 || schema2 || null;
    }
    
    var schema1Keys = keys(schema1);
    var schema2Keys = keys(schema2);

    if (!isEqual(schema1Keys, schema2Keys)) {
      if (schema1.type === 'array' && schema2.type === 'array') {
        // TODO optimize???
        if (isEqual(xor(schema1Keys, schema2Keys), ['items'])) {
          var schemaWithoutItems = schema1Keys.length > schema2Keys.length ? schema2 : schema1;
          var schemaWithItems = schema1Keys.length > schema2Keys.length ? schema1 : schema2;
          var isSame = keys(schemaWithoutItems).reduce(function (acc, current) {
            return isEqual(schemaWithoutItems[current], schemaWithItems[current]) && acc;
          }, true);

          if (isSame) {
            return schemaWithoutItems;
          }
        }
      }

      if (schema1.type !== 'object' || schema2.type !== 'object') {
        return null;
      }
    }`;

// Replace the problematic code with the fixed code
const patchedContent = originalContent.replace(problematicCode, fixedCode);

// Write the patched file
console.log(`Writing patched file: ${helpersPath}`);
fs.writeFileSync(helpersPath, patchedContent);

console.log('Patch applied successfully!');
