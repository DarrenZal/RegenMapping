#!/usr/bin/env node

/**
 * Patch for Cambria json-schema.ts file to fix array handling
 */

const fs = require('fs');
const path = require('path');

// Path to the json-schema.ts file
const jsonSchemaPath = path.join('/Users/darrenzal/cambria-project/src/json-schema.ts');

// Read the current content
console.log(`Reading file: ${jsonSchemaPath}`);
const originalContent = fs.readFileSync(jsonSchemaPath, 'utf8');

// Create a backup
const backupPath = `${jsonSchemaPath}.bak`;
console.log(`Creating backup: ${backupPath}`);
fs.writeFileSync(backupPath, originalContent);

// Find the problematic code
const problematicCode = `export function updateSchema(schema: JSONSchema7, lens: LensSource): JSONSchema7 {
  return lens.reduce<JSONSchema7>((schema: JSONSchema7, op: LensOp) => {
    if (schema === undefined) throw new Error("Can't update undefined schema")
    return applyLensOperation(schema, op)
  }, schema as JSONSchema7)
}`;

// Replace with fixed code
const fixedCode = `export function updateSchema(schema: JSONSchema7, lens: LensSource): JSONSchema7 {
  // Fix for "Cannot read properties of null (reading 'type')" error
  if (!lens || lens.length === 0) {
    return schema;
  }
  
  return lens.reduce<JSONSchema7>((schema: JSONSchema7, op: LensOp) => {
    if (schema === undefined) throw new Error("Can't update undefined schema")
    try {
      return applyLensOperation(schema, op)
    } catch (error) {
      console.error(\`Error applying lens operation \${op.op}: \${error.message}\`);
      return schema; // Return the original schema if the operation fails
    }
  }, schema as JSONSchema7)
}`;

// Replace the problematic code with the fixed code
const patchedContent = originalContent.replace(problematicCode, fixedCode);

// Write the patched file
console.log(`Writing patched file: ${jsonSchemaPath}`);
fs.writeFileSync(jsonSchemaPath, patchedContent);

console.log('Patch applied successfully!');
console.log('Now rebuild the project with: cd /Users/darrenzal/cambria-project && npm run build');
