# Schema Documentation

Documentation for schema transformation, mapping, and interoperability between different entity data formats in the regenerative economy mapping platform.

## Directory Structure

```
schemas/
├── Organization/
│   ├── organization-schema-mapping-guide.md       # Organization transformation functions
│   └── unified-organization-schema-comparison.md  # Organization schema analysis
├── Person/
│   ├── person-schema-mapping-guide.md            # Person transformation functions
│   └── unified-person-schema-comparison.md       # Person schema analysis
└── README.md                                      # This file
```

## Documentation Overview

### Schema Registration and Transformation

This documentation provides comprehensive guidance for working with our unified schemas, registering them with Murmurations, and implementing schema transformations using Cambria lenses.

#### Registration Process

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

#### Schema Registration with Murmurations

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

### Entity Schema Analysis
Compare and understand the different approaches to modeling entities in the regenerative economy:

#### Organization Schemas
- **[unified-organization-schema-comparison.md](Organization/unified-organization-schema-comparison.md)** - Comprehensive analysis of Schema.org, Murmurations, and Dylan Tull's organization modeling approaches
- **Purpose**: Understand design decisions, strengths, and synthesis approach for organization data

#### Person Schemas  
- **[unified-person-schema-comparison.md](Person/unified-person-schema-comparison.md)** - Comprehensive analysis of Schema.org, Murmurations, and Dylan Tull's person modeling approaches
- **Purpose**: Understand design decisions, strengths, and synthesis approach for person data

### Implementation Guides
Practical transformation functions and mapping tables for developers:

#### Organization Transformations
- **[organization-schema-mapping-guide.md](Organization/organization-schema-mapping-guide.md)** - Complete transformation rules and JavaScript functions for converting between Schema.org, Murmurations, and unified organization schemas

#### Person Transformations
- **[person-schema-mapping-guide.md](Person/person-schema-mapping-guide.md)** - Complete transformation rules and JavaScript functions for converting between Schema.org, Murmurations, and unified person schemas

## Schema Interoperability Framework

This documentation provides comprehensive tools and guidance for working with multiple schema formats across both organizations and people in the regenerative economy ecosystem.

### Namespace Priority Strategy

Our unified schemas use a strategic namespace hierarchy to maximize discoverability and interoperability across multiple ecosystems:

#### **1. Schema.org First Priority** 🌐
```json
"telephone": "schema:telephone",
"name": "schema:name",
"description": "schema:description"
```
**Benefits:**
- ✅ **Google/Search Engine** recognition and rich snippets
- ✅ **Existing Business Tools** (CRMs, APIs) automatic compatibility
- ✅ **JSON-LD Processors** built-in support
- ✅ **Linked Data Web** connectivity to billions of web pages

#### **2. Murmurations Second Priority** 🌱
```json
"nickname": "murm:nickname",
"primary_url": "murm:primary_url",
"linked_schemas": "murm:linked_schemas"
```
**Benefits:**
- ✅ **Regenerative Network** discovery and validation
- ✅ **Community Tools** built for regenerative economy
- ✅ **Base Schema Compatibility** for Murmurations Index

#### **3. Custom Domain-Specific Third Priority** 🎯
```json
"domainTags": "regen:domainTags",
"methodTags": "regen:methodTags",
"influenceMetrics": "regen:influenceMetrics"
```
**Benefits:**
- ✅ **Regenerative-Specific** categorization and analysis
- ✅ **Visualization Optimization** for mapping platforms
- ✅ **Domain Innovation** without namespace conflicts

#### **Multi-Ecosystem Compatibility Result**
This strategy enables profiles that work seamlessly across:
- **Web Search** (Schema.org recognition)
- **Regenerative Discovery** (Murmurations compatibility)
- **Business Integration** (CRM/contact system compatibility)
- **Rich Applications** (Full unified schema data)

**Example Impact:** A contact field using `schema:telephone` gets automatically recognized by Google for rich snippets, imported by CRM systems, mapped by Murmurations for regenerative discovery, AND provides full data for visualization platforms.

### Murmurations Integration Strategy

#### Current Status ⚠️ PARTIAL
Our profiles are currently indexed in Murmurations using only the base schemas:
- **Person Profiles**: Using `people_schema-v0.1.0` only
- **Organization Profiles**: Using `organizations_schema-v1.0.0` only
- **GitHub Hosting**: ✅ All profiles accessible via GitHub raw URLs for reliable hosting

#### Registering Unified Schemas with Murmurations 🚀
To fully register our unified schemas with Murmurations, we need to:

1. **Submit schemas via GitHub PR**:
   - Fork the [Murmurations library repo](https://github.com/MurmurationsNetwork/library)
   - Create a new branch including our schema name
   - Add our schema files (`regen-person-schema-v1.0.0.json` and `regen-organization-schema-v1.0.0.json`) to the `/schemas/` directory
   - Create a PR to the `test` branch of the upstream repo
   - Wait for review and approval

2. **After approval and merging to the test branch**:
   - Our schemas will be available in the test environment
   - We can test creating profiles based on these schemas

3. **Update our profiles to use both schemas**:
   ```json
   "linked_schemas": ["people_schema-v0.1.0", "regen-person-schema-v1.0.0"]
   ```

4. **Re-upload our updated profiles**:
   - Use the `upload-profiles.js` script (after modifying it to use our new schemas)
   - Or manually update the profiles in our GitHub repo

#### Dual Schema Strategy

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

#### Dual Schema Discovery Benefit ✨
When our unified schemas are registered and our profiles include both base and unified schemas in their `linked_schemas` array:

- **Broader Discovery**: Profiles will be discoverable by BOTH queries for base schemas AND queries for our unified schemas
- **Enhanced Data**: Applications using our unified schemas will get richer data with regenerative-specific fields
- **Base Compatibility**: Applications using only base Murmurations schemas will still discover and use our profiles
- **No Duplication**: A single profile can serve both ecosystem needs without maintaining separate versions

This approach creates a "superset" relationship where our unified schemas extend the base schemas with additional fields while maintaining full compatibility and discoverability.

### Transformation Capabilities with Cambria Lenses

**Complete Schema Interoperability System** - 12 comprehensive bidirectional transformations:

✅ **All 6 Person Schema Conversions**: Murmurations ↔ Unified ↔ Schema.org (plus direct cross-conversions) \
✅ **All 6 Organization Schema Conversions**: Murmurations ↔ Unified ↔ Schema.org (plus direct cross-conversions)  \
✅ **Lossless Round-trip Conversion**: Preserves semantic meaning across transformation chains \
✅ **Enhanced Relationship Preservation**: Maintains connection types (member, collaboration, etc.) \
✅ **Pure Cambria Implementation**: No external post-processing required 

**Bidirectional Transformations** between:
- **Schema.org** format (web standards compliance)
- **Murmurations** format (regenerative economy discovery)  
- **Unified** schema format (optimized for mapping and visualization)

**Supported Entity Types**:
- **Organizations** - Companies, nonprofits, DAOs, cooperatives, communities
- **People** - Individuals engaged in regenerative economy activities

#### Cambria Lens Implementation ✅
We use an **enhanced version of [Cambria](https://github.com/DarrenZal/cambria-project)** to handle schema transformations:

- **Enhanced Array Transformations**: Custom improvements to support complex field operations within arrays
- **Relationship Preservation**: Advanced `in` and `map` operations for relationship data transformation
- **Lens Files**: Located in `/cambria-lenses/` directory
- **Bidirectional Conversion**: Each schema pair has forward and reverse lenses
- **Browser Integration**: Working in-browser implementation for live transformations
- **CLI Support**: Command-line transformation capabilities for automation
- **Pure Declarative Operations**: All transformations use Cambria lens operations without external post-processing

**Enhanced Cambria Source**: Our improvements are available at [https://github.com/DarrenZal/cambria-project](https://github.com/DarrenZal/cambria-project)

**Complete Lens Matrix**:

We support full bidirectional conversion between all three schema formats with **12 comprehensive lenses**:

```
Unified Schema ←→ Murmurations ←→ Schema.org
     ↓               ↓               ↓
     └───────────────→───────────────┘
```

**Person Schema Conversions (6 lenses)**:

| From | To | Lens File | Purpose |
|------|----|-----------| --------|
| Murmurations | Unified | `murmurations-to-unified-person.lens.yml` | Transform Murmurations person to comprehensive unified format |
| Unified | Murmurations | `unified-to-murmurations-person.lens.yml` | Clean unified person for Murmurations network publishing |
| Schema.org | Unified | `schemaorg-to-unified-person.lens.yml` | Import standard Schema.org person data |
| Unified | Schema.org | `unified-to-schemaorg-person.lens.yml` | Export to clean Schema.org format |
| Murmurations | Schema.org | `murmurations-to-schemaorg-person.lens.yml` | Direct conversion to web standards format |
| Schema.org | Murmurations | `schemaorg-to-murmurations-person.lens.yml` | Convert web data for network discovery |

**Organization Schema Conversions (6 lenses)**:

| From | To | Lens File | Purpose |
|------|----|-----------| --------|
| Murmurations | Unified | `murmurations-to-unified-organization.lens.yml` | Transform Murmurations org to comprehensive unified format |
| Unified | Murmurations | `unified-to-murmurations-organization.lens.yml` | Publish organization to Murmurations network |
| Schema.org | Unified | `schemaorg-to-unified-organization.lens.yml` | Import standard Schema.org organization data |
| Unified | Schema.org | `unified-to-schemaorg-organization.lens.yml` | Export organization to web standards |
| Murmurations | Schema.org | `murmurations-to-schemaorg-organization.lens.yml` | Direct organization conversion to web standards |
| Schema.org | Murmurations | `schemaorg-to-murmurations-organization.lens.yml` | Convert web organization data for network discovery |

**Using Cambria CLI**:

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

**Browser Implementation**:
Our website includes a browser-compatible Cambria implementation:
- Live demo: https://darrenzal.github.io/RegenMapping
- Source: `docs/cambria-browser.js`
- Usage: See `docs/app.js` for implementation details

#### Profile Storage Strategy
For maximum flexibility and interoperability:

1. **Store Primary Profiles**: Store primary profiles using our unified schemas on GitHub Pages
   - Location: `https://darrenzal.github.io/RegenMapping/profiles/unified/`
   - Format: JSON-LD with full unified schema

2. **Generate Derived Profiles**: Use Cambria to generate Murmurations-compatible versions
   - Location: `https://darrenzal.github.io/RegenMapping/profiles/murmurations/`
   - Format: Simple JSON with Murmurations base schema fields
   - Purpose: For Murmurations indexing until our unified schemas are registered

3. **Automated Conversion**: Use scripts to maintain consistency between versions
   - Script: `scripts/convert-schema.js` for one-time conversions
   - Future: Add GitHub Action for automatic synchronization

This approach allows us to maintain a single source of truth (unified schemas) while ensuring compatibility with the Murmurations ecosystem.

#### Source URL Innovation for Lossless Conversion

Our schema conversion system includes a novel `source_url` field innovation for achieving semantic losslessness:

**🧠 The Challenge**: When converting from comprehensive schemas (e.g., Unified) to reduced schemas (e.g., Murmurations or Schema.org), structural schema conversion alone would discard data.

**💡 Our Solution**: Add a `source_url` field to converted documents that:
- Points to the full version when converting to reduced schemas
- Enables re-fetching the original document for 100% fidelity during reverse conversion
- Provides semantic losslessness via external pointer

**✅ Benefits**:
| Feature | Result |
|---------|--------|
| Data fidelity | ✅ Full original preserved |
| Idempotency | ✅ Conversion round-trips to the same output |
| Schema loss mitigation | ✅ Via external pointer |
| Standards compliance | ⚠️ Not standardized, but semantically valid |

**🔬 Innovation Status**: This `source_url` pattern is **not part of any existing W3C or JSON-LD standard** for round-trip schema conversion. It's a novel workaround that could be formalized as:
- `cambria:sourceOfTruth` or 
- `regen:originalDocument` 

in our own vocabulary.

**📚 Related (But Distinct) Practices**:
- **Provenance Metadata** (e.g., `prov:wasDerivedFrom`) - tracks derivation but doesn't enforce recovery
- **JSON-LD Framing** - allows partial views but lacks automatic source linking
- **Schema.org sameAs** - links identity but not for document recovery
- **Named Graphs in RDF** - stores versions but doesn't solve round-tripping outside SPARQL

This approach is functionally similar to lossless image editing via sidecar files or data provenance in digital twins — applied to schema conversion.

**Detailed Lossless Conversion Process**:

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

**Conversion Paths**:

**Direct Conversions (with lenses)**:
- Unified → Murmurations: Uses lens + adds `source_url`
- Unified → Schema.org: Uses lens + adds `source_url`  
- Murmurations ↔ Schema.org: Direct lens transformation

**Lossless Conversions (via source_url)**:
- Murmurations → Unified: Fetch from `source_url` (lossless!)
- Schema.org → Unified: Fetch from `source_url` (lossless!)

**Complete Round-trip Chain**:
```
Unified → Murmurations → Schema.org → Unified
   ↓           ↓             ↓           ↑
  lens      lens        lens        fetch from
+ source_url    transformation   source_url
                                 (lossless!)
```

**Field Mappings**:

**Key Field Transformations**:

| Unified Field | Murmurations | Schema.org | Notes |
|---------------|--------------|------------|--------|
| `name` | `name` | `name` | Core identity field |
| `primary_url` | `primary_url` | `url` | Primary web presence |
| `tags` | `tags` | `knowsAbout` / `keywords` | Domain expertise |
| `headline` | `headline` | `jobTitle` | Professional title |
| `geolocation` | `geolocation` | `addressLocality` + `addressRegion` | Location data |
| `relationships` | *removed* | *removed* | Unified-specific rich relationships |
| `linked_schemas` | *removed* | *removed* | Schema compatibility metadata |

**Unified-Specific Fields (Excluded from Other Formats)**:

These rich semantic fields are preserved only in the unified format:
- `linked_schemas` - Schema compatibility tracking
- `geolocation` - Precise lat/lng coordinates  
- `relationships` - Rich network connections
- `domainTags`, `methodTags`, `theoryTags` - Detailed categorization
- `currentTitle`, `currentOrgId` - Employment details

**Usage Examples**:

**Using the JavaScript/Browser Implementation**:
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

**Direct Lens Testing with Node.js**:
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

**Testing & Validation**:

**Automated Testing**:
- **Lossless round-trip tests**: `scripts/test-lossless-conversion.js`
- **Chain conversion tests**: All conversion paths tested automatically
- **Profile validation**: Ensures Murmurations network compatibility

**Manual Testing**:
1. Start local web server: `python3 -m http.server 8080`
2. Open `http://localhost:8080/docs/`
3. Observe profile data in all three formats
4. Verify lossless conversion via browser console logs

**Integration Points**:

**Murmurations Network**:
- Profiles published to `https://test-index.murmurations.network/`
- Includes `source_url` for lossless data recovery
- Validates against official Murmurations schemas

**Schema.org Web Standards**:
- Clean JSON-LD output for web embedding
- Proper `@context` and `@type` declarations
- Compatible with search engines and semantic web tools

**Unified Semantic Model**:
- Rich ontology supporting regenerative economy concepts
- Comprehensive relationship modeling
- Source of truth for all conversions

See [Cambria Integration](../cambria-integration.md) for detailed implementation information.

### Mapping Features

**Comprehensive Field Mappings** including:
- **Direct mappings** - Equivalent fields across schemas
- **Transformation logic** - Complex conversions and data type handling
- **Format-specific features** - Handling unique capabilities of each schema
- **Regenerative enhancements** - Domain tags, method tags, SDG alignment

**Data Quality Considerations**:
- **Confidence scoring** - Automated assessment based on source reliability
- **Provenance tracking** - Data source documentation and verification
- **Missing data handling** - Graceful degradation and sensible defaults

### Implementation Guidelines

**Best Practices** for:
- **Data integrity** - Maintaining semantic consistency during transformations
- **Schema validation** - Ensuring compliance with target schema requirements
- **Relationship preservation** - Maintaining connections between entities
- **Performance optimization** - Efficient transformation and storage strategies

**Development Support**:
- **Example transformations** - Real-world conversion examples for both entities
- **Error handling patterns** - Robust transformation with graceful failure modes
- **Testing strategies** - Validation approaches for transformation accuracy
- **API integration** - Guidelines for using transformations in applications

### Regenerative Economy Focus

**Domain-Specific Features**:
- **Categorization taxonomy** - Regenerative domains, methods, SDG alignment
- **Network analysis** - Graph metrics for community detection and influence
- **Collaboration tools** - Needs/offers matching and relationship suggestions
- **Impact measurement** - Metrics for tracking regenerative outcomes

**Visualization Optimization**:
- **Geographic mapping** - Coordinate data optimized for globe rendering
- **Force-directed graphs** - Network metrics for layout algorithms
- **Interactive filtering** - Multi-dimensional search and categorization
- **Temporal analysis** - Timeline support for evolution tracking

## Usage Patterns

### For Developers
1. **Start with comparison documents** to understand schema approaches and design decisions
2. **Use mapping guides** for implementing transformations in your application
3. **Reference example transformations** for real-world implementation patterns
4. **Follow best practices** for data integrity and performance

### For Data Architects
1. **Review schema synthesis approach** to understand unified design principles
2. **Examine field mapping matrices** to plan data integration strategies
3. **Consider transformation functions** for ETL pipeline design
4. **Evaluate quality considerations** for data governance frameworks

### For Platform Implementers
1. **Use unified schemas** as primary data model for applications
2. **Implement transformation functions** for multi-source data ingestion
3. **Apply validation patterns** for data quality assurance
4. **Leverage regenerative features** for domain-specific functionality

This documentation serves as the definitive guide for implementing schema interoperability in regenerative economy mapping platforms, ensuring consistency, quality, and semantic richness across all entity types and data sources.
