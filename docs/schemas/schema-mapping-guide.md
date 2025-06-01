# Schema Mapping and Registration Guide

This guide provides detailed instructions for working with our unified schemas, registering them with Murmurations, and implementing schema transformations using Cambria lenses.

> **Related Documentation:**
> - For detailed field-by-field mappings for Person schemas, see [Person Schema Mapping Guide](Person/person-schema-mapping-guide.md)
> - For detailed field-by-field mappings for Organization schemas, see [Organization Schema Mapping Guide](Organization/organization-schema-mapping-guide.md)
> - For Cambria lens implementation details, see [Cambria Integration](../cambria-integration.md)

## Table of Contents
1. [Schema Ecosystem Overview](#schema-ecosystem-overview)
2. [Registering Schemas with Murmurations](#registering-schemas-with-murmurations)
3. [Profile Creation and Validation](#profile-creation-and-validation)
4. [Schema Transformation with Cambria](#schema-transformation-with-cambria)
5. [Deployment Strategy](#deployment-strategy)

## Schema Ecosystem Overview

Our project uses three primary schema types:

1. **Unified Schemas** (Our comprehensive format)
   - Format: JSON-LD with multiple namespaces
   - Location: `Ontology/Person/unified-person-schema.jsonld` and `Ontology/Organization/unified-organization-schema.jsonld`
   - Purpose: Rich data model optimized for visualization and analysis
   - Namespaces: `schema:`, `regen:`, `murm:`, `geo:`, etc.

2. **Murmurations Schemas** (Network discovery format)
   - Format: Simple JSON with Murmurations fields
   - Base Schemas: `people_schema-v0.1.0` and `organizations_schema-v1.0.0`
   - Purpose: Interoperability with Murmurations network
   - Location: `Ontology/Person/Murmurations/` and `Ontology/Organization/Murmurations/`

3. **Schema.org** (Web standards format)
   - Format: Standard Schema.org JSON-LD
   - Purpose: SEO, web standards compliance
   - Example: `test-profiles/sample-schemaorg-person.json`

## Registering Schemas with Murmurations

### Current Status

Currently, our profiles are indexed in Murmurations using only the base schemas:
- Person profiles use: `"linked_schemas": ["people_schema-v0.1.0"]`
- Organization profiles use: `"linked_schemas": ["organizations_schema-v1.0.0"]`

### Registration Process

To register our unified schemas with Murmurations:

1. **Prepare Schema Files**
   - Our converted schemas are in `schemas-for-upload/`
   - Ensure they follow JSON Schema Draft-07 format
   - Verify required fields are properly marked

2. **Submit via GitHub PR**
   - Fork the [Murmurations library repo](https://github.com/MurmurationsNetwork/library)
   - Create a new branch with our schema name
   - Add schema files to the `/schemas/` directory
   - Create a PR to the `test` branch
   - Include clear documentation in the PR description

3. **Testing After Approval**
   - Once merged to test branch, schemas will be available in test environment
   - Validate test profiles against the new schemas
   - Verify discoverability in the test index

4. **Production Deployment**
   - After successful testing, schemas will be merged to main branch
   - Update production profiles to reference the new schemas

### Dual Schema Strategy

The key to our approach is using **both** base and unified schemas in the `linked_schemas` array:

```json
"linked_schemas": [
  "people_schema-v0.1.0",
  "regen-person-schema-v1.0.0"
]
```

This ensures:
- Profiles are discoverable via queries for either schema
- Applications using base schemas can still find our profiles
- Applications using our unified schemas get enhanced data
- No need to maintain duplicate profiles

## Profile Creation and Validation

### Creating Unified Schema Profiles

1. **Start with Template**
   - Use examples in `Ontology/Person/example-person-profile.jsonld` or `Ontology/Organization/example-organization-profile.jsonld`
   - Ensure all required fields are completed

2. **Validate JSON-LD Structure**
   - Use [JSON-LD Playground](https://json-ld.org/playground/) to verify syntax
   - Check that all namespaces are properly defined

3. **Add Murmurations Compatibility**
   - Include `linked_schemas` array with appropriate schema references
   - Ensure all required Murmurations fields are present

### Converting to Murmurations Format

Until our unified schemas are registered with Murmurations, we need to convert profiles to base schema format:

1. **Using Cambria Lenses**
   - Use `cambria-lenses/unified-to-murmurations-person.lens.yml` for conversion
   - Command: `node scripts/convert-schema.js --input=path/to/unified.jsonld --output=path/to/murmurations.json --lens=unified-to-murmurations-person`

2. **Manual Conversion**
   - Ensure all required Murmurations fields are present
   - Remove fields not in the base schema
   - Flatten nested structures as needed

3. **Validation**
   - Test against Murmurations validation API
   - Command: `node scripts/upload-profiles.js --validate-only`

## Schema Transformation with Cambria

### Cambria Lens Overview

[Cambria](https://github.com/cambria-project/cambria) is our tool for schema transformations:

- **Lens Files**: YAML files defining transformation rules
- **Operations**: rename, remove, add, etc.
- **Bidirectional**: Forward and reverse transformations

### Available Lenses

| Source Format | Target Format | Lens File |
|---------------|--------------|-----------|
| Murmurations | Unified | `murmurations-to-unified-person.lens.yml` |
| Unified | Murmurations | `unified-to-murmurations-person.lens.yml` |
| Schema.org | Unified | `schemaorg-to-unified-person.lens.yml` |

### Using Cambria CLI

```bash
# Convert Murmurations to Unified
cat murmurations-profiles/person-dylan-tull.json | \
  node /path/to/cambria/dist/cli.js \
  -l cambria-lenses/murmurations-to-unified-person.lens.yml > unified-output.jsonld

# Convert Unified to Murmurations
cat Ontology/Person/example-person-profile.jsonld | \
  node /path/to/cambria/dist/cli.js \
  -l cambria-lenses/unified-to-murmurations-person.lens.yml > murmurations-output.json
```

### Using Browser Implementation

Our website includes a browser-compatible Cambria implementation:
- Live demo: https://darrenzal.github.io/RegenMapping
- Source: `docs/cambria-browser.js`
- Usage: See `docs/app.js` for implementation details

## Deployment Strategy

### Profile Hosting

For maximum flexibility and interoperability:

1. **Primary Profiles (Unified Schema)**
   - Host on GitHub Pages: `https://darrenzal.github.io/RegenMapping/profiles/unified/`
   - Format: Full JSON-LD with all namespaces
   - Naming: `person-{name}.jsonld`, `org-{name}.jsonld`

2. **Derived Profiles (Murmurations Compatible)**
   - Host on GitHub Pages: `https://darrenzal.github.io/RegenMapping/profiles/murmurations/`
   - Format: Simple JSON with Murmurations fields
   - Naming: `person-{name}.json`, `org-{name}.json`

### Automation

To maintain consistency between versions:

1. **Conversion Script**
   - Use `scripts/convert-schema.js` for one-time conversions
   - Parameters: `--input`, `--output`, `--lens`

2. **GitHub Actions** (Future Enhancement)
   - Automatically convert unified profiles to Murmurations format
   - Trigger on changes to unified profiles
   - Validate before deployment

3. **Validation Hooks**
   - Pre-commit hooks to validate schema compliance
   - Automated tests for bidirectional conversion integrity

## Conclusion

By following this guide, you can:
1. Register our unified schemas with Murmurations
2. Create profiles compatible with multiple schema ecosystems
3. Transform between different schema formats using Cambria
4. Deploy profiles for maximum discoverability and interoperability

This approach ensures our data is both rich enough for advanced visualization and analysis while remaining discoverable through the Murmurations network.
