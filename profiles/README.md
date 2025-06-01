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

The project includes a script to automatically convert between formats:

```bash
# Convert unified profiles to Murmurations format
node scripts/convert-unified-to-murmurations.js
```

This script:
1. Reads unified profiles from `profiles/unified/`
2. Applies Cambria lenses to convert them to Murmurations format
3. Adds required relationship properties
4. Saves the converted profiles to `profiles/murmurations/`

This allows you to maintain the unified profiles as the source of truth and automatically generate the Murmurations profiles for indexing.
