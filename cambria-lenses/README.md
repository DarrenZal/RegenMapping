# Cambria Lenses for Schema Conversion

This directory contains a complete set of Cambria lenses for converting between the three schema formats used in the Regen Mapping project: **Unified**, **Murmurations**, and **Schema.org**.

## Schema Conversion Matrix

We support full bidirectional conversion between all three schema formats:

```
Unified Schema ←→ Murmurations ←→ Schema.org
     ↓               ↓               ↓
     └───────────────→───────────────┘
```

## Available Lenses

### Person Schema Conversions (6 lenses)

| From | To | Lens File | Purpose |
|------|----|-----------| --------|
| Murmurations | Unified | `murmurations-to-unified-person.lens.yml` | Transform Murmurations person to comprehensive unified format |
| Unified | Murmurations | `unified-to-murmurations-person.lens.yml` | Clean unified person for Murmurations network publishing |
| Schema.org | Unified | `schemaorg-to-unified-person.lens.yml` | Import standard Schema.org person data |
| Murmurations | Schema.org | `murmurations-to-schemaorg-person.lens.yml` | Direct conversion to web standards format |
| Schema.org | Murmurations | `schemaorg-to-murmurations-person.lens.yml` | Convert web data for network discovery |
| Unified | Schema.org | `unified-to-schemaorg-person.lens.yml` | Export to clean Schema.org format |

### Organization Schema Conversions (3 lenses)

| From | To | Lens File | Purpose |
|------|----|-----------| --------|
| Unified | Murmurations | `unified-to-murmurations-organization.lens.yml` | Publish organization to Murmurations network |
| Murmurations | Unified | `murmurations-to-unified-organization.lens.yml` | Import Murmurations org to unified format |
| Unified | Schema.org | `unified-to-schemaorg-organization.lens.yml` | Export organization to web standards |

## Lossless Conversion with source_url Field

The key innovation enabling truly lossless conversion is the `source_url` field approach:

### How It Works

1. **Unified as Source of Truth**: The unified schema contains the most comprehensive data model with rich semantic relationships, geolocation, and domain-specific fields.

2. **source_url Field**: When converting FROM unified TO other formats, we add a `source_url` field pointing back to the original unified profile:

```json
{
  "name": "Dylan Tull",
  "primary_url": "https://dylantull.com",
  "tags": ["Regenerative Design", "Post-capitalist Finance"],
  "source_url": "https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/unified/regen-person-dylan-tull.jsonld"
}
```

3. **Lossless Recovery**: When converting FROM other formats BACK to unified, the system:
   - Checks if `source_url` field exists
   - Fetches the original unified profile from that URL
   - Returns the complete original data (truly lossless!)
   - Falls back to lens transformation only if the fetch fails

### Conversion Paths

#### Direct Conversions (with lenses)
- Unified → Murmurations: Uses lens + adds `source_url`
- Unified → Schema.org: Uses lens + adds `source_url`  
- Murmurations ↔ Schema.org: Direct lens transformation

#### Lossless Conversions (via source_url)
- Murmurations → Unified: Fetch from `source_url` (lossless!)
- Schema.org → Unified: Fetch from `source_url` (lossless!)

#### Complete Round-trip Chain
```
Unified → Murmurations → Schema.org → Unified
   ↓           ↓             ↓           ↑
  lens      lens        lens        fetch from
+ source_url    transformation   source_url
                                 (lossless!)
```

## Field Mappings

### Key Field Transformations

| Unified Field | Murmurations | Schema.org | Notes |
|---------------|--------------|------------|--------|
| `name` | `name` | `name` | Core identity field |
| `primary_url` | `primary_url` | `url` | Primary web presence |
| `tags` | `tags` | `knowsAbout` / `keywords` | Domain expertise |
| `headline` | `headline` | `jobTitle` | Professional title |
| `geolocation` | `geolocation` | `addressLocality` + `addressRegion` | Location data |
| `relationships` | *removed* | *removed* | Unified-specific rich relationships |
| `linked_schemas` | *removed* | *removed* | Schema compatibility metadata |

### Unified-Specific Fields (Excluded from Other Formats)

These rich semantic fields are preserved only in the unified format:
- `linked_schemas` - Schema compatibility tracking
- `geolocation` - Precise lat/lng coordinates  
- `relationships` - Rich network connections
- `domainTags`, `methodTags`, `theoryTags` - Detailed categorization
- `currentTitle`, `currentOrgId` - Employment details

## Usage Examples

### Using the JavaScript/Browser Implementation

```javascript
// Load profiles and convert between formats
const app = new RegenMappingApp();
await app.init();

// Get a profile in all three formats
const profiles = app.getAllProfiles();
const dylan = profiles.find(p => p.murmurations.name === 'Dylan Tull');

console.log('Murmurations:', dylan.murmurations);
console.log('Unified:', dylan.unified);        // Lossless via source_url
console.log('Schema.org:', dylan.schemaorg);   // Clean web standards format
```

### Direct Lens Testing with Node.js

```bash
# Test round-trip conversion
cd cambria-lenses

# Murmurations → Unified → Murmurations
echo '{"name":"Test","primary_url":"https://example.com"}' | \
  node ../scripts/cambria-conversion.js murmurations unified | \
  node ../scripts/cambria-conversion.js unified murmurations

# Full three-way conversion
echo '{"name":"Test","url":"https://example.com"}' | \
  node ../scripts/cambria-conversion.js schemaorg unified | \
  node ../scripts/cambria-conversion.js unified murmurations | \
  node ../scripts/cambria-conversion.js murmurations schemaorg
```

## Testing & Validation

### Automated Testing
- **Lossless round-trip tests**: `scripts/test-lossless-conversion.js`
- **Chain conversion tests**: All conversion paths tested automatically
- **Profile validation**: Ensures Murmurations network compatibility

### Manual Testing
1. Start local web server: `python3 -m http.server 8080`
2. Open `http://localhost:8080/docs/`
3. Observe profile data in all three formats
4. Verify lossless conversion via browser console logs

## Integration Points

### Murmurations Network
- Profiles published to `https://test-index.murmurations.network/`
- Includes `source_url` for lossless data recovery
- Validates against official Murmurations schemas

### Schema.org Web Standards  
- Clean JSON-LD output for web embedding
- Proper `@context` and `@type` declarations
- Compatible with search engines and semantic web tools

### Unified Semantic Model
- Rich ontology supporting regenerative economy concepts
- Comprehensive relationship modeling
- Source of truth for all conversions

## Benefits of This Approach

✅ **Truly Lossless**: No data lost in round-trip conversions via source_url  
✅ **Standards Compliant**: Each format follows its respective standards  
✅ **Network Compatible**: Murmurations profiles work with existing discovery tools  
✅ **Web Optimized**: Schema.org output ready for search engines  
✅ **Semantically Rich**: Unified format captures complex regenerative relationships  
✅ **Robust Fallback**: Lens transformations work when source_url fetch fails
