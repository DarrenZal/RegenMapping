# Cambria Lenses

This directory contains Cambria lens files for converting between schema formats in the Regen Mapping project.

## Lens Files

### Person Schema Lenses (6 files)
- `murmurations-to-unified-person.lens.yml`
- `unified-to-murmurations-person.lens.yml`
- `schemaorg-to-unified-person.lens.yml`
- `murmurations-to-schemaorg-person.lens.yml`
- `schemaorg-to-murmurations-person.lens.yml`
- `unified-to-schemaorg-person.lens.yml`

### Organization Schema Lenses (3 files)
- `unified-to-murmurations-organization.lens.yml`
- `murmurations-to-unified-organization.lens.yml`
- `unified-to-schemaorg-organization.lens.yml`

## Usage in Code

These lens files are used by:
- **Browser Implementation**: `docs/cambria-browser.js` for live schema conversions
- **Node.js Scripts**: `scripts/cambria-conversion.js` for command-line transformations
- **Web Application**: `docs/app.js` for the interactive demo
- **Test Scripts**: `scripts/test-lossless-conversion.js` for validation

## Documentation

For detailed documentation on:
- Schema conversion matrix and transformation paths
- Lossless conversion with `source_url` innovation
- Field mappings and usage examples
- Testing and validation approaches

See **[docs/schemas/README.md](../docs/schemas/README.md)**