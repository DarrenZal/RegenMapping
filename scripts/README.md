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

### 2. `patch-cambria-json-schema.js`
Patches the Cambria library to fix array handling issues.

```bash
node scripts/patch-cambria-json-schema.js
```

**What it does:**
- Creates a backup of the original json-schema.ts file
- Adds null checks and error handling to the updateSchema function
- Fixes "Cannot read properties of null (reading 'type')" errors
- Applies the patch to the local Cambria fork

### 3. `patch-to-json-schema-helpers.js`
Patches the to-json-schema library used by Cambria to fix array handling.

```bash
node scripts/patch-to-json-schema-helpers.js
```

**What it does:**
- Creates a backup of the original helpers.js file
- Adds null checks to the mergeSchemaObjs function
- Fixes array handling issues in schema generation
- Applies the patch to the local node_modules

### 4. `push-cambria-patch-to-github.js`
Pushes the Cambria patch to the GitHub fork.

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
node scripts/update-and-publish-profiles.js
```

**What it does:**
- Runs `convert-unified-to-murmurations.js` to convert unified profiles to Murmurations format
- Runs `upload-profiles-new.js` to validate and submit profiles to Murmurations
- Runs `test-queries.js` to verify that profiles are discoverable

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

### The `linked_schemas` Approach

Our integration uses Murmurations' `linked_schemas` property to ensure profiles are discoverable through multiple schema queries:

```json
{
  "linked_schemas": [
    "people_schema-v0.1.0",           // Base Murmurations schema
    "regen-person-schema-v1.0.0"     // Our unified schema (when available)
  ],
  "name": "Dr. Karen O'Brien",
  "primary_url": "https://karenmobrien.com",
  // ... rich profile data
}
```

**Benefits:**
- **Backward Compatibility**: Works with existing Murmurations tooling
- **Enhanced Discovery**: Rich profiles discoverable through standard queries
- **Schema Evolution**: Ability to extend base schemas while maintaining compatibility
- **Network Effects**: Participation in broader regenerative discovery network

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

This integration enables the Regen Mapping project to participate in the broader Murmurations ecosystem while maintaining the rich, detailed profile structure needed for network visualization and analysis.
