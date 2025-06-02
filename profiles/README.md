# Regen Mapping Profiles

This directory contains profiles for people and organizations in the regenerative economy ecosystem, organized by schema type.

## Directory Structure

```
profiles/
  ├── murmurations/                    # Base Murmurations format profiles
  │   ├── murm-person-dylan-tull.json
  │   ├── murm-person-karen-obrien.json
  │   └── murm-org-global-regenerative-coop.json
  │
  └── unified/                         # Regen unified schema profiles
      ├── regen-person-dylan-tull.jsonld
      ├── regen-person-karen-obrien.jsonld
      └── regen-org-global-regenerative-coop.jsonld
```

## Naming Convention

Profiles follow a consistent naming pattern:

- `{schema-prefix}-{entity-type}-{entity-name}.{format}`

Where:
- `schema-prefix` indicates which schema the profile uses:
  - `murm-` for Murmurations base schema profiles
  - `regen-` for unified Regen schema profiles
- `entity-type` is either `person` or `org`
- `entity-name` is a hyphenated version of the entity's name
- `format` is either `.json` for Murmurations profiles or `.jsonld` for unified schema profiles

## Schema Usage

### Murmurations Profiles

Murmurations profiles use the base Murmurations schemas:
- `people_schema-v0.1.0` for person profiles
- `organizations_schema-v1.0.0` for organization profiles

These profiles can be indexed in the Murmurations network and discovered through the Murmurations API.

#### JSON-LD @reverse Links

Murmurations profiles now include JSON-LD @reverse links to their source unified profiles:

```json
{
  "name": "Dylan Tull",
  "primary_url": "https://dylantull.com",
  "@id": "https://murmurations.network/profile/dylan-tull",
  "@reverse": {
    "schema:isBasedOn": {
      "@id": "https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/unified/regen-person-dylan-tull.jsonld"
    }
  },
  "profile_source": "https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/unified/regen-person-dylan-tull.jsonld"
}
```

This approach:
- Follows semantic web best practices for linking resources
- Enables lossless round-trip conversion between formats
- Maintains backward compatibility with the `profile_source` field
- Provides a fallback mechanism when the original profile can't be fetched

### Unified Profiles

Unified profiles use both the base Murmurations schemas and our extended Regen schemas:
- `linked_schemas` includes both the base schema and our extended schema
- Additional fields from our extended schema provide richer data for visualization and analysis

## GitHub Pages Hosting

All profiles are hosted on GitHub Pages at:
- `https://darrenzal.github.io/RegenMapping/profiles/{schema-type}/{filename}`

This provides consistent, reliable URLs for profiles that can be accessed by both humans and machines.

## Cambria Lens Integration

The Cambria lenses in the `cambria-lenses/` directory can be used to convert between different schema formats:
- `murmurations-to-unified-person.lens.yml`: Convert from Murmurations to unified person schema
- `unified-to-murmurations-person.lens.yml`: Convert from unified to Murmurations person schema
- `schemaorg-to-unified-person.lens.yml`: Convert from Schema.org to unified person schema

### Automated Conversion

The project includes scripts to automatically convert between formats:

```bash
# Standard conversion (without @reverse links)
node scripts/convert-unified-to-murmurations.js

# Lossless conversion with @reverse links
node scripts/lossless-conversion.js convert-all

# Test lossless round-trip conversion
node scripts/test-lossless.js
```

#### Standard Conversion Script

The `convert-unified-to-murmurations.js` script:
1. Reads unified profiles from `profiles/unified/`
2. Applies Cambria lenses to convert them to Murmurations format
3. Adds required relationship properties
4. Saves the converted profiles to `profiles/murmurations/`

#### Lossless Conversion Script

The `lossless-conversion.js` script:
1. Reads unified profiles from `profiles/unified/`
2. Applies Cambria lenses to convert them to Murmurations format
3. Adds a JSON-LD `@id` field to identify the Murmurations profile
4. Adds a JSON-LD `@reverse` link with `schema:isBasedOn` pointing to the original unified profile
5. Adds a `profile_source` field for backward compatibility
6. Saves the converted profiles to `profiles/murmurations/`

This allows you to maintain the unified profiles as the source of truth and automatically generate the Murmurations profiles for indexing, while ensuring lossless round-trip conversion.
