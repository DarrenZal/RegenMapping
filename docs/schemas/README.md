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

### Murmurations Integration Strategy ✅ WORKING
Our unified schemas are successfully integrated with the Murmurations Index. By including Murmurations' base schemas (e.g., `people_schema-v0.1.0`, `organizations_schema-v1.0.0`) in the `linked_schemas` array of our profiles, we ensure:
- **Validation**: ✅ Profiles validate against both our comprehensive unified schemas and the Murmurations base schemas
- **Discoverability**: ✅ Profiles created using our unified schemas are discoverable when queried through the Murmurations Index using standard base schemas
- **Live Testing**: ✅ 3 test profiles successfully indexed and discoverable via Murmurations test network
- **Automated Pipeline**: ✅ Complete scripts for schema conversion, profile validation, and submission

**Live Test Results:**
- **People Schema Discovery**: ✅ Both person profiles discoverable via `people_schema-v0.1.0` queries
- **Organization Schema**: ✅ Organization profile validated and indexed via `organizations_schema-v1.0.0`
- **GitHub Hosting**: ✅ All profiles accessible via GitHub raw URLs for reliable hosting

### Transformation Capabilities

**Bidirectional Transformations** between:
- **Schema.org** format (web standards compliance)
- **Murmurations** format (regenerative economy discovery)  
- **Unified** schema format (optimized for mapping and visualization)

**Supported Entity Types**:
- **Organizations** - Companies, nonprofits, DAOs, cooperatives, communities
- **People** - Individuals engaged in regenerative economy activities

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
