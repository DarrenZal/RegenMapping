# Lossless Conversion Implementation

This document summarizes the implementation of lossless round-trip conversion between unified schema profiles and Murmurations profiles using Cambria lenses with the `source_url` field approach.

## 🎯 Overview

The lossless conversion approach solves the problem of data loss when converting between different schema formats. By adding a `source_url` field to Murmurations profiles that points to the original unified schema profile, we can recover the complete original profile when converting back from Murmurations to unified format.

## 🔄 How It Works

1. **Unified → Murmurations**: When converting from unified schema to Murmurations format:
   - We use Cambria lens transformations to convert the core fields
   - We add a `source_url` field pointing to the original unified schema profile URL
   - The script automatically creates both working profiles (with `source_url`) and clean profiles (without it)

2. **Murmurations → Unified**: When converting from Murmurations back to unified format:
   - First, we check for the `source_url` field
   - If found, we fetch the original unified schema profile for true lossless conversion
   - If fetch fails or field is missing, we fall back to Cambria lens transformation
   - We use Cambria's lens transformation system for robust conversion

## 🚨 Murmurations Schema Constraints

**Important**: Murmurations schema validation is extremely strict and only allows fields explicitly defined in their schemas. However, the `source_url` field IS accepted by Murmurations validation, making it perfect for lossless conversion.

**Solution**: We use a dual-file strategy:
- **Working profiles** (`profiles/murmurations/`): Include `source_url` for lossless conversion, uploaded to Murmurations index
- **Clean profiles** (generated internally): Used when `source_url` needs to be omitted for strict compliance

## 📁 Files Modified

### 1. Browser Integration

- **`docs/cambria-browser.js`**: Updated the `convertSchema` method to use `source_url` field for lossless conversion, with fallback to name-based mapping for older profiles.

### 2. Server-Side Scripts

- **`scripts/lossless-conversion.js`**: 
  - Updated to add `source_url` field pointing to the original unified schema profile
  - Added `createCleanMurmurationsProfile()` function to remove fields when needed
  - Modified `convertMurmurationsToUnified()` to check for `source_url` field and fetch original profiles
  - Enhanced conversion process to use Cambria lenses for all transformations

### 3. Test Scripts

- **`scripts/test-lossless-conversion.js`**: Tests continue to work with the updated approach, validating round-trip conversion.

### 4. Documentation

- **`LOSSLESS-CONVERSION.md`**: Updated to document the corrected approach using `source_url` with dual file strategy.

## 🚀 Usage

### Converting Profiles

```bash
# Convert all unified profiles to Murmurations format with source_url field
npm run lossless-convert

# Test round-trip conversion for a specific profile
npm run test-roundtrip profiles/unified/regen-person-dylan-tull.jsonld

# Run comprehensive tests for the lossless conversion
npm run test-lossless
```

### Programmatic Usage

```javascript
const { 
  convertUnifiedToMurmurations, 
  convertMurmurationsToUnified 
} = require('./scripts/lossless-conversion');

// Convert from unified to Murmurations
const murmurationsProfile = await convertUnifiedToMurmurations(unifiedProfile, 'person');

// Convert from Murmurations back to unified
const roundTripProfile = await convertMurmurationsToUnified(murmurationsProfile);
```

## 🧪 Testing

The `test-lossless-conversion.js` script performs comprehensive tests of the lossless conversion:

1. **Person Profile Test**: Tests lossless conversion for a person profile.
2. **Organization Profile Test**: Tests lossless conversion for an organization profile.
3. **Fallback Mechanism Test**: Tests the fallback mechanism when the `source_url` is unavailable.

Run the tests with:

```bash
npm run test-lossless
```

## 📊 Benefits

- **Truly Lossless**: No data is lost in the round-trip conversion.
- **Semantic Web Compatible**: Uses JSON-LD `@reverse` links to express relationships between profiles in a semantically rich way.
- **Backward Compatibility**: Uses the `source_url` field which is accepted by Murmurations validation.
- **Enhanced Discovery**: Profiles discoverable through standard queries and semantic web tools.
- **Schema Evolution**: Ability to extend base schemas while maintaining compatibility.
- **Network Effects**: Participation in broader regenerative discovery network.
- **Robust Fallback**: Falls back to lens transformation if fetching fails.
- **Standards-Based**: Follows JSON-LD and semantic web best practices for linking resources.

## 🔍 Example Profiles

### Working Version (with lossless conversion field)
```json
{
  "linked_schemas": [
    "people_schema-v0.1.0"
  ],
  "name": "Dr. Karen O'Brien",
  "primary_url": "https://karenmobrien.com",
  "tags": [
    "Climate Change",
    "Transformative Adaptation",
    "Social Change"
  ],
  "source_url": "https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/unified/regen-person-karen-obrien.jsonld",
  // ... other Murmurations fields
}
```

### Clean Version (generated when needed)
```json
{
  "linked_schemas": [
    "people_schema-v0.1.0"
  ],
  "name": "Dr. Karen O'Brien",
  "primary_url": "https://karenmobrien.com",
  "tags": [
    "Climate Change",
    "Transformative Adaptation",
    "Social Change"
  ],
  // ... other Murmurations fields
}
```

## 🎯 Next Steps

1. **Deploy the Changes**: Push the changes to GitHub to make the unified profile URLs accessible.
2. **Generate Profiles**: Run `node scripts/lossless-conversion.js convert-all` to generate profiles with source_url.
3. **Submit Profiles**: Submit the profiles (from `profiles/murmurations/`) to the Murmurations index.
4. **Test Lossless Conversion**: Test round-trip conversion using the profiles with source_url fields.
5. **Monitor and Validate**: Monitor the profiles in the Murmurations index and validate the conversion process.
