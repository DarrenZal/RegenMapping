# Lossless Conversion Implementation

This document summarizes the changes made to implement a lossless round-trip conversion between unified schema profiles and Murmurations profiles using the hybrid Lens + JSON-LD @reverse link approach.

## 🎯 Overview

The lossless conversion approach solves the problem of data loss when converting between different schema formats. By adding a JSON-LD `@reverse` link and a `profile_source` field to the Murmurations profiles that point to the original unified schema profile, we can recover the complete original profile when converting back from Murmurations to unified format.

## 🔄 How It Works

1. **Unified → Murmurations**: When converting from unified schema to Murmurations format:
   - We add a JSON-LD `@id` field to identify the Murmurations profile
   - We add a JSON-LD `@reverse` link with `schema:isBasedOn` pointing to the original unified schema profile
   - We also add a `profile_source` field for backward compatibility

2. **Murmurations → Unified**: When converting from Murmurations back to unified format:
   - First, we check for the `@reverse` link with `schema:isBasedOn`
   - If not found, we check if the `profile_source` field exists (backward compatibility)
   - If either exists, we fetch the original unified schema profile
   - If the fetch fails, we fall back to using the Cambria lens transformation

## 📁 Files Modified

### 1. Cambria Lenses

- **`cambria-lenses/unified-to-murmurations-person.lens.yml`**: Removed hard-coded profile_source field and added a comment explaining that it's added dynamically.
- **`cambria-lenses/unified-to-murmurations-organization.lens.yml`**: Removed hard-coded profile_source field and added a comment explaining that it's added dynamically.

### 2. Browser Integration

- **`docs/cambria-browser.js`**: Updated the `convertSchema` method to check for both the `@reverse` link and the `profile_source` field, with preference given to the `@reverse` link.

### 3. Server-Side Scripts

- **`scripts/lossless-conversion.js`**: Updated to add both a JSON-LD `@id` field and an `@reverse` link with `schema:isBasedOn` pointing to the original unified schema profile, in addition to the `profile_source` field for backward compatibility.
- **`scripts/test-lossless-conversion.js`**: Updated to test the new `@reverse` link approach.

### 4. Documentation

- **`scripts/README.md`**: Updated to document the lossless conversion approach and the new scripts.

### 5. Package Configuration

- **`package.json`**: Added dependencies and scripts for the lossless conversion utility.

## 🚀 Usage

### Converting Profiles

```bash
# Convert all unified profiles to Murmurations format with profile_source field
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
3. **Fallback Mechanism Test**: Tests the fallback mechanism when the `profile_source` URL is unavailable.

Run the tests with:

```bash
npm run test-lossless
```

## 📊 Benefits

- **Truly Lossless**: No data is lost in the round-trip conversion.
- **Semantic Web Compatible**: Uses JSON-LD `@reverse` links to express relationships between profiles in a semantically rich way.
- **Backward Compatibility**: Maintains the `profile_source` field for compatibility with existing tooling.
- **Enhanced Discovery**: Profiles discoverable through standard queries and semantic web tools.
- **Schema Evolution**: Ability to extend base schemas while maintaining compatibility.
- **Network Effects**: Participation in broader regenerative discovery network.
- **Robust Fallback**: Falls back to lens transformation if fetching fails.
- **Standards-Based**: Follows JSON-LD and semantic web best practices for linking resources.

## 🔍 Example Profile

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
  "@id": "https://murmurations.network/profile/karen-obrien",
  "@reverse": {
    "schema:isBasedOn": {
      "@id": "https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/unified/regen-person-karen-obrien.jsonld"
    }
  },
  "profile_source": "https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/unified/regen-person-karen-obrien.jsonld",
  // ... other Murmurations fields
}
```

## 🎯 Next Steps

1. **Deploy the Changes**: Push the changes to GitHub to make the `profile_source` URLs accessible.
2. **Update Existing Profiles**: Run the `lossless-convert` script to update all existing Murmurations profiles.
3. **Submit to Murmurations**: Submit the updated profiles to the Murmurations index.
4. **Monitor and Test**: Monitor the profiles in the Murmurations index and test the round-trip conversion.
