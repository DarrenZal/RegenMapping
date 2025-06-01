# Schemas for Murmurations Upload

This directory contains Murmurations-compatible JSON Schema files that are ready to be submitted to the Murmurations Library.

## Files

- `regen-person-schema-v1.0.0.json`: Extended person schema for regenerative economy visualization and network discovery
- `regen-organization-schema-v1.0.0.json`: Extended organization schema for regenerative economy visualization and network discovery

## Purpose

These schemas extend the base Murmurations schemas (`people_schema-v0.1.0` and `organizations_schema-v1.0.0`) with additional fields that are useful for:

1. Visualizing regenerative economy networks
2. Analyzing relationships between people and organizations
3. Discovering patterns and connections in the regenerative economy
4. Supporting specialized search and filtering

## How These Were Generated

These files were generated from the unified JSON-LD schemas in the `Ontology/` directory using the `scripts/upload-schemas.js` script. The script converts the complex JSON-LD structure to the simpler JSON Schema format required by Murmurations.

## Submitting to Murmurations

To submit these schemas to the Murmurations Library:

1. Fork the [Murmurations Library repository](https://github.com/MurmurationsNetwork/MurmurationsLibrary)
2. Add the schema files to the appropriate directory
3. Submit a pull request

For more details, see the [Murmurations documentation on creating schemas](https://docs.murmurations.network/guides/creating-schemas.html).

## Using These Schemas

Profiles that use these schemas should include them in their `linked_schemas` array, along with the base Murmurations schema:

```json
"linked_schemas": [
  "people_schema-v0.1.0",
  "regen-person-schema-v1.0.0"
]
```

This ensures that:
- Profiles are discoverable via queries for either schema
- Applications using base schemas can still find your profiles
- Applications using your extended schemas get enhanced data

## Schema URLs

Once registered with Murmurations, these schemas will be available at:

- `https://library.murmurations.network/v2/schemas/regen-person-schema-v1.0.0`
- `https://library.murmurations.network/v2/schemas/regen-organization-schema-v1.0.0`

For testing, they are available at:

- `https://test-library.murmurations.network/v2/schemas/regen-person-schema-v1.0.0`
- `https://test-library.murmurations.network/v2/schemas/regen-organization-schema-v1.0.0`
