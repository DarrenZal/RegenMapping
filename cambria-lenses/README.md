# Cambria Lenses for Schema Conversion

This directory contains Cambria lenses for converting between different schema formats used in the Regen Mapping project.

## Available Lenses

### Person Schema Conversions

1. **murmurations-to-unified-person.lens.yml**
   - Converts from Murmurations Person format to Unified Person format
   - Maps basic fields like name, primary_url, locality, geolocation
   - Adds schema prefixes and regen-specific fields
   - Preserves linked_schemas for Murmurations compatibility

2. **unified-to-murmurations-person.lens.yml**
   - Converts from Unified Person format back to Murmurations Person format
   - Reverse transformation of the above lens
   - Strips unified-specific fields and removes prefixes
   - Transforms geolocation structure (latitude/longitude to lat/lon)

3. **schemaorg-to-unified-person.lens.yml**
   - Converts from Schema.org Person format to Unified Person format
   - Maps standard Schema.org properties to unified schema
   - Handles nested objects like homeLocation, worksFor, etc.

### Organization Schema Conversions

4. **unified-to-murmurations-organization.lens.yml**
   - Converts from Unified Organization format to Murmurations Organization format
   - Maps organization-specific fields like mission, tagline, legalType
   - Transforms geolocation structure (latitude/longitude to lat/lon)
   - Preserves organization-specific fields like sdgFocus and keyActivities

## Usage Examples

### Using Cambria CLI

```bash
# Convert Murmurations to Unified
cat murmurations-profile.json | node /path/to/cambria/dist/cli.js -l murmurations-to-unified-person.lens.yml

# Convert back from Unified to Murmurations
cat unified-profile.json | node /path/to/cambria/dist/cli.js -l unified-to-murmurations-person.lens.yml

# Bidirectional transformation test
cat murmurations-profile.json | \
  node /path/to/cambria/dist/cli.js -l murmurations-to-unified-person.lens.yml | \
  node /path/to/cambria/dist/cli.js -l unified-to-murmurations-person.lens.yml
```

### Test Files

- `../test-profiles/sample-schemaorg-person.json` - Example Schema.org person
- `../murmurations-profiles/person-dylan-tull.json` - Example Murmurations person

## Schema Mappings

### Murmurations → Unified
- `name` → `schema:name`
- `primary_url` → `murm:primary_url`
- `locality` → `regen:locality`
- `geolocation` → `regen:geolocation`
- `tags` → `regen:domainTags`

### Schema.org → Unified
- `name` → `schema:name`
- `givenName` → `schema:givenName`
- `familyName` → `schema:familyName`
- `jobTitle` → `schema:jobTitle`
- `knowsAbout` → `regen:domainTags`
- Preserves nested objects like `homeLocation`, `worksFor`

## Testing

The lenses have been tested with:
- ✅ Murmurations ↔ Unified bidirectional conversion
- 🔄 Schema.org → Unified (in progress)

## Future Enhancements

1. Add organization schema conversions
2. Create more comprehensive field mappings
3. Add validation and error handling
4. Create composite lenses for multi-step transformations
