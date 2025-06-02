# Murmurations Integration Scripts

This directory contains scripts for integrating the Regen Mapping project with the Murmurations network for decentralized discovery and indexing of regenerative organizations and people.

## 🎯 Overview

The Murmurations integration enables:
- **Backward Compatibility**: Profiles discoverable through base Murmurations schemas
- **Rich Data Preservation**: Full unified schema data while maintaining discoverability
- **Network Effects**: Participation in the broader regenerative economy discovery network
- **Validation**: Automated profile validation against Murmurations schemas

## 📁 Scripts

### 1. `upload-schemas.js`
Converts unified JSON-LD schemas to Murmurations JSON Schema format.

```bash
node scripts/upload-schemas.js
```

**What it does:**
- Converts `unified-person-schema.jsonld` and `unified-organization-schema.jsonld` to Murmurations format
- Saves converted schemas to `schemas-for-upload/` directory
- Generates schemas ready for submission to Murmurations library via GitHub

**Note:** Custom schemas must be submitted to Murmurations production library via GitHub, not uploaded via API.

### 2. `patch-cambria-json-schema.js` (DEPRECATED)
Patches the Cambria library to fix array handling issues. This script is no longer needed as the fixes have been permanently integrated into the Cambria library fork.

```bash
node scripts/patch-cambria-json-schema.js
```

**What it does:**
- Creates a backup of the original json-schema.ts file
- Adds null checks and error handling to the updateSchema function
- Fixes "Cannot read properties of null (reading 'type')" errors
- Applies the patch to the local Cambria fork

### 3. `patch-to-json-schema-helpers.js` (DEPRECATED)
Patches the to-json-schema library used by Cambria to fix array handling. This script is no longer needed as the fixes have been permanently integrated into the Cambria library fork.

```bash
node scripts/patch-to-json-schema-helpers.js
```

**What it does:**
- Creates a backup of the original helpers.js file
- Adds null checks to the mergeSchemaObjs function
- Fixes array handling issues in schema generation
- Applies the patch to the local node_modules

### 4. `push-cambria-patch-to-github.js` (DEPRECATED)
Pushes the Cambria patch to the GitHub fork. This script is no longer needed as the fixes have been permanently integrated into the Cambria library fork.

```bash
node scripts/push-cambria-patch-to-github.js
```

**What it does:**
- Creates a new branch for the patch
- Commits the changes to the json-schema.ts file
- Provides instructions for pushing to GitHub
- Enables others to use the fixed version via package.json

### 2. `convert-unified-to-murmurations.js`
Converts unified profiles to Murmurations format using Cambria lenses.

```bash
node scripts/convert-unified-to-murmurations.js
```

**What it does:**
- Reads unified profiles from `profiles/unified/` directory
- Applies Cambria lenses to convert them to Murmurations format
- Adds required relationship properties (predicate_url and object_url)
- Saves the converted profiles to `profiles/murmurations/` directory

**Generated profiles:**
- `murm-person-dylan-tull.json`
- `murm-person-karen-obrien.json`
- `murm-org-global-regenerative-coop.json`

### 3. `upload-profiles-new.js`
Validates and submits Murmurations profiles to the test index.

```bash
node scripts/upload-profiles-new.js
```

**What it does:**
- Reads profiles from `profiles/murmurations/` directory
- Validates profiles using Murmurations test API
- Submits profile URLs to Murmurations test index

### 4. `test-queries.js`
Tests that uploaded profiles are discoverable through Murmurations index queries.

```bash
node scripts/test-queries.js
```

**What it does:**
- Queries base people schema (`people_schema-v0.1.0`)
- Queries base organizations schema (`organizations_schema-v1.0.0`)
- Checks general index for our profiles
- Validates discoverability and reports results

### 5. `update-and-publish-profiles.js`
Combines all the steps needed to update and publish profiles.

```bash
npm run update-and-publish
```

**What it does:**
- Runs `convert-unified-to-murmurations.js` to convert unified profiles to Murmurations format
- Runs `upload-profiles-new.js` to validate and submit profiles to Murmurations
- Runs `test-queries.js` to verify that profiles are discoverable

### 6. `cambria-conversion.js`
Provides utilities for lossless round-trip conversion between unified schema profiles and Murmurations profiles using JSON-LD @reverse links. This script uses the Cambria library directly with our fixes for array handling.

```bash
# Convert all unified profiles to Murmurations format with @reverse links
node scripts/cambria-conversion.js convert-all

# Test round-trip conversion for a specific profile
node scripts/cambria-conversion.js test-roundtrip profiles/unified/regen-person-dylan-tull.jsonld
```

### 7. `lossless-conversion.js` (Legacy)
The original implementation of lossless conversion before the Cambria library fixes. This script is kept for reference but the `cambria-conversion.js` script should be used instead.

```bash
# Convert all unified profiles to Murmurations format with @reverse links
npm run lossless-convert

# Test round-trip conversion for a specific profile
npm run test-roundtrip profiles/unified/regen-person-dylan-tull.jsonld

# Run comprehensive tests for the lossless conversion
npm run test-lossless
```

**What it does:**
- Converts unified profiles to Murmurations format with JSON-LD `@reverse` links
- Adds a JSON-LD `@id` field to identify the Murmurations profile
- Adds a JSON-LD `@reverse` link with `schema:isBasedOn` pointing to the original unified profile
- Maintains the `profile_source` field for backward compatibility
- When converting back from Murmurations to unified, checks for both the `@reverse` link and `profile_source` field
- Fetches the original unified profile if either exists
- Provides a complete lossless round-trip conversion solution
- Handles both person and organization profiles
- Includes testing utilities to verify lossless conversion

**Key features:**
- **Lossless Conversion**: No data is lost in the round-trip conversion
- **Semantic Web Compatible**: Uses JSON-LD `@reverse` links to express relationships between profiles
- **Backward Compatibility**: Maintains the `profile_source` field for compatibility with existing tooling
- **Hybrid Approach**: Uses both Cambria lenses and linked schema URIs
- **Automatic Fallback**: Falls back to lens transformation if fetching fails
- **Slugified URLs**: Automatically generates correct GitHub URLs for profiles
- **Standards-Based**: Follows JSON-LD and semantic web best practices for linking resources

## 🚀 Complete Integration Workflow

### Step 1: Generate Schemas
```bash
npm run upload-schemas
```
This creates Murmurations-compatible versions of your unified schemas.

### Step 2: Process and Submit Profiles
```bash
npm run upload-profiles
```
This converts, validates, and submits example profiles to the test index.

### Step 3: Test Discovery
```bash
# Wait a few minutes for indexing, then test
npm run test-queries
```
This validates that profiles are discoverable through base schema queries.

### Step 4: Full Integration Test
```bash
npm run test-integration
```
Runs all steps in sequence with appropriate delays.

## 🔧 Configuration

### GitHub Repository Settings
Update these constants in `upload-profiles.js`:
```javascript
const GITHUB_USER = 'DarrenZal';
const GITHUB_REPO = 'RegenMapping';
const GITHUB_BRANCH = 'main';
```

### Murmurations Endpoints
- **Test Index**: `https://test-index.murmurations.network`
- **Test Validation**: `https://test-index.murmurations.network/v2/validate`
- **Production Library**: `https://library.murmurations.network`

## 📊 Integration Strategy

### The Lossless Conversion Approach

Our integration now uses a hybrid Lens + JSON-LD @reverse link approach for lossless round-trip conversion:

```json
{
  "linked_schemas": [
    "people_schema-v0.1.0"           // Base Murmurations schema
  ],
  "name": "Dr. Karen O'Brien",
  "primary_url": "https://karenmobrien.com",
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

**How it works:**
1. **Unified → Murmurations**: 
   - Convert using Cambria lens
   - Add JSON-LD `@id` field to identify the Murmurations profile
   - Add JSON-LD `@reverse` link with `schema:isBasedOn` pointing to the original unified profile
   - Add `profile_source` field for backward compatibility

2. **Murmurations → Unified**: 
   - First, check for the `@reverse` link with `schema:isBasedOn`
   - If not found, check for the `profile_source` field
   - Fetch original profile using the URL from either source
   - If fetch fails, use Cambria lens transformation as fallback

**Benefits:**
- **Truly Lossless**: No data is lost in the round-trip conversion
- **Semantic Web Compatible**: Uses JSON-LD `@reverse` links to express relationships between profiles
- **Backward Compatibility**: Maintains the `profile_source` field for compatibility with existing tooling
- **Enhanced Discovery**: Profiles discoverable through standard queries and semantic web tools
- **Schema Evolution**: Ability to extend base schemas while maintaining compatibility
- **Network Effects**: Participation in broader regenerative discovery network
- **Standards-Based**: Follows JSON-LD and semantic web best practices for linking resources

### Profile Hosting via GitHub

Profiles are hosted using GitHub raw URLs:
- **Reliable**: GitHub provides stable, fast hosting
- **Versioned**: Full git history of profile changes
- **Accessible**: Public URLs that Murmurations can index
- **Cost-effective**: Free hosting for open source projects

## 🧪 Testing Results

### Expected Outcomes

When working correctly, the integration demonstrates:

1. **Schema Conversion**: ✅ Unified schemas converted to Murmurations format
2. **Profile Validation**: ✅ Profiles validate against base Murmurations schemas
3. **URL Accessibility**: ✅ GitHub-hosted profiles accessible via HTTPS
4. **Index Submission**: ✅ Profile URLs submitted to test index
5. **Query Discovery**: ⏳ Profiles discoverable via schema queries (may take time)

### Troubleshooting

**Profiles not appearing in queries:**
- Indexing can take 5-15 minutes
- Check profile URLs are accessible (HTTP 200)
- Verify profiles validate without errors
- Ensure `linked_schemas` includes base schemas

**Validation errors:**
- Check required fields are present (`name`, `linked_schemas`, `tags`)
- Ensure `tags` array has at least one item
- Verify `primary_url` is a valid URL

**GitHub URL issues:**
- Confirm repository name matches `GITHUB_REPO` constant
- Check files are committed and pushed to main branch
- Test URLs manually with curl or browser

## 🔗 Profile URLs

Current test profiles hosted on GitHub:

- **Dr. Karen O'Brien**: https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/murmurations/murm-person-karen-obrien.json
- **Dylan Tull**: https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/murmurations/murm-person-dylan-tull.json
- **Global Regenerative Cooperative**: https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/murmurations/murm-org-global-regenerative-coop.json

## 📚 Resources

- [Murmurations Documentation](https://docs.murmurations.network/)
- [Murmurations Schema Library](https://library.murmurations.network/)
- [Murmurations Test Environment](https://test-index.murmurations.network/)
- [JSON Schema Specification](https://json-schema.org/)

## 🎉 Success Criteria

The integration is successful when:
- ✅ Profiles validate against base Murmurations schemas
- ✅ Profiles are accessible via GitHub raw URLs
- ✅ Profiles are submitted to test index without errors
- ✅ Profiles appear in schema-based queries within 15 minutes
- ✅ Rich profile data is preserved while maintaining discoverability
- ✅ Round-trip conversion is lossless (original unified profile is recovered)
- ✅ Fallback mechanism works when profile_source URL is unavailable

This integration enables the Regen Mapping project to participate in the broader Murmurations ecosystem while maintaining the rich, detailed profile structure needed for network visualization and analysis.
