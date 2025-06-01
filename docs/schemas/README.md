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

### 🆕 Schema Registration and Transformation Guide
- **[schema-mapping-guide.md](schema-mapping-guide.md)** - **NEW!** Comprehensive guide for registering schemas with Murmurations and implementing transformations
- **Purpose**: Step-by-step instructions for schema registration, profile creation, and Cambria lens usage

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

#### Dual Schema Discovery Benefit ✨
When our unified schemas are registered and our profiles include both base and unified schemas in their `linked_schemas` array:

- **Broader Discovery**: Profiles will be discoverable by BOTH queries for base schemas AND queries for our unified schemas
- **Enhanced Data**: Applications using our unified schemas will get richer data with regenerative-specific fields
- **Base Compatibility**: Applications using only base Murmurations schemas will still discover and use our profiles
- **No Duplication**: A single profile can serve both ecosystem needs without maintaining separate versions

This approach creates a "superset" relationship where our unified schemas extend the base schemas with additional fields while maintaining full compatibility and discoverability.

### Transformation Capabilities with Cambria Lenses

**Bidirectional Transformations** between:
- **Schema.org** format (web standards compliance)
- **Murmurations** format (regenerative economy discovery)  
- **Unified** schema format (optimized for mapping and visualization)

**Supported Entity Types**:
- **Organizations** - Companies, nonprofits, DAOs, cooperatives, communities
- **People** - Individuals engaged in regenerative economy activities

#### Cambria Lens Implementation ✅
We use [Cambria](https://github.com/cambria-project/cambria) to handle schema transformations:

- **Lens Files**: Located in `/cambria-lenses/` directory
- **Bidirectional Conversion**: Each schema pair has forward and reverse lenses
- **Browser Integration**: Working in-browser implementation for live transformations
- **CLI Support**: Command-line transformation capabilities for automation

**Example Lens Pairs**:
- `murmurations-to-unified-person.lens.yml` / `unified-to-murmurations-person.lens.yml`
- `schemaorg-to-unified-person.lens.yml`

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
