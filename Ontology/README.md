# Ontology

Schema definitions and ontologies for the regenerative economy mapping platform, organized by entity type for easy navigation.

## Directory Structure

```
Ontology/
├── Person/                          # All person-related schemas
│   ├── unified-person-schema.jsonld          # Primary unified person schema
│   ├── regen-person-shapes.ttl               # SHACL validation shapes for person data
│   ├── example-person-profile.jsonld         # Person usage examples
│   ├── Dylan/
│   │   └── person-schema-dylantull.jsonld    # Dylan's visualization-optimized person schema
│   ├── Murmurations/
│   │   ├── murmurationspeople_schema-v0.1.0.jsonld         # People schema (basic)
│   │   └── murmurationspeople_schema-v0.1.0-complete.jsonld # People schema (complete)
│   └── SchemaOrg/
│       ├── person-schema-basic.jsonld        # Essential 28 Person properties
│       └── person-schema-complete.jsonld     # All 67 Person properties
├── Organization/                    # All organization-related schemas
│   ├── unified-organization-schema.jsonld    # Primary unified organization schema
│   ├── regen-org-shapes.ttl                  # SHACL validation shapes for organization data
│   ├── example-organization-profile.jsonld   # Organization usage examples
│   ├── Dylan/
│   │   └── organization-schema-dylantull.jsonld # Dylan's visualization-optimized org schema
│   ├── Murmurations/
│   │   ├── murmurationsorganizations_schema-v1.0.0.jsonld         # Organizations (basic)
│   │   └── murmurationsorganizations_schema-v1.0.0-complete.jsonld # Organizations (complete)
│   └── SchemaOrg/
│       ├── organization-schema-basic.jsonld   # Essential Organization properties
│       └── organization-schema-complete.jsonld # Complete Organization properties
└── Reference/                       # Reference vocabularies
    └── schemaorg-current-https.jsonld        # Full Schema.org vocabulary
```

## Schema Synthesis Approach

The unified schemas combine three complementary approaches:

### 1. Schema.org Foundation
- **Web standards compliance** - Ensures semantic interoperability and SEO benefits
- **Rich vocabulary** - 67 Person properties and comprehensive Organization coverage
- **Established patterns** - Proven approaches for name, address, contact, relationship modeling

### 2. Murmurations Network Discovery
- **Regenerative economy focus** - Purpose-built for sustainable and regenerative initiatives
- **Network effects** - Relationship modeling for discovery and collaboration
- **Geographic indexing** - Standardized location data for mapping applications
- **Required field validation** - Quality assurance through schema compliance

### 3. Dylan Tull's Visualization Optimization
- **Mapping-specific fields** - Coordinates, locality data optimized for globe rendering
- **Categorization taxonomy** - Domain tags, method tags, SDG alignment for filtering
- **Graph analysis support** - Metrics and properties for force-directed layout algorithms
- **Visual encoding guidance** - Specifications for how data maps to visual elements

## Entity Types

### Person (`Person/`)
Individuals engaged in regenerative economy activities with enhanced properties for:
- **Network discovery** - Tags, skills, needs/offers matching
- **Geographic mapping** - Precise location data for globe visualization  
- **Relationship tracking** - Collaboration, mentorship, organizational connections
- **Influence measurement** - Metrics for graph layout and community analysis

**Key Files:**
- `unified-person-schema.jsonld` - Complete unified schema with 9 property clusters
- `example-person-profile.jsonld` - Examples of Dr. Karen O'Brien and Dylan Tull
- Source schemas from Dylan, Murmurations, and Schema.org in respective subdirectories

### Organization (`Organization/`)
Companies, nonprofits, DAOs, cooperatives, and communities with properties for:
- **Mission alignment** - SDG mapping, regenerative categorization, impact metrics
- **Operational context** - Legal structure, scope, funding model, lifecycle stage
- **Network position** - Partnerships, member organizations, ecosystem relationships
- **Geographic presence** - Multi-location support with headquarters emphasis

**Key Files:**
- `unified-organization-schema.jsonld` - Complete unified schema with organizational clusters
- `example-organization-profile.jsonld` - Real-world organization examples
- Source schemas from Dylan, Murmurations, and Schema.org in respective subdirectories

## Enhanced Relationship Types

### Person ↔ Person
- **Collaboration** - Project partnerships with strength indicators
- **Mentorship** - Knowledge transfer and guidance relationships  
- **Colleague** - Professional connections and working relationships
- **Co-authorship** - Joint publications and intellectual collaboration

### Person ↔ Organization
- **Employment/Affiliation** - Current and historical organizational relationships
- **Membership** - Community and network participation
- **Founder** - Organization creation and leadership
- **Board/Advisory** - Governance and strategic guidance roles

### Organization ↔ Organization  
- **Partnership** - Strategic alliances and collaboration agreements
- **Funding** - Investment, grants, and financial support flows
- **Subsidiary/Parent** - Corporate structure and ownership relationships
- **Network Membership** - Ecosystem and community participation

## Implementation Features

### Data Quality & Validation
- **SHACL Shapes Validation** - Comprehensive validation shapes for both person and organization data
- **Confidence scoring** - Automated quality assessment based on source reliability
- **Provenance tracking** - Data source documentation and verification timestamps
- **Progressive validation** - SHACL shapes for quality improvement over time

#### SHACL Validation Files
- **`Person/regen-person-shapes.ttl`** - Validates unified person schema data including:
  - Core identity requirements (name, URL, coordinates)
  - Professional affiliation constraints
  - Regenerative categorization validation (domain/method tags, SDG alignment)
  - Relationship modeling validation (event participation, board positions, coauthorships)
  - Network metrics validation (centrality measures, influence scores)
  - Contact information format validation (email patterns, URL formats)

- **`Organization/regen-org-shapes.ttl`** - Validates unified organization schema data including:
  - Identity and branding requirements
  - Geographic scope and address validation
  - Status and lifecycle constraints
  - Financial and scale metrics validation
  - Impact measurement and certification requirements
  - Network relationship validation

### Visualization Integration
- **Globe rendering** - Optimized coordinate data and geographic clustering
- **Force-directed graphs** - Network metrics and relationship strength indicators
- **Interactive filtering** - Multi-dimensional categorization and search capabilities

### Collaboration Enhancement
- **Needs/offers matching** - AI-powered recommendation system for resource sharing
- **Network analysis** - Community detection and influence measurement
- **Relationship suggestions** - Gap analysis and introduction facilitation

## Source Schema Details

### Murmurations Network Schemas
- **Purpose**: Regenerative economy network discovery and indexing
- **Organization schema**: v1.0.0 with comprehensive field definitions for regenerative organizations
- **Person schema**: v0.1.0 with focus on individual contributors to regenerative economy
- **Key features**: Required field validation, relationship modeling, geographic indexing

### Schema.org Extracts
- **Purpose**: Web standards compliance and semantic interoperability
- **Organization properties**: Comprehensive coverage of business, nonprofit, and organizational entities
- **Person properties**: 67 properties covering identity, professional, social, and demographic aspects
- **Key features**: Established vocabulary, SEO benefits, wide platform support

### Dylan Tull's Visualization Schemas
- **Purpose**: Optimized for 3D globe and force-directed graph visualization
- **Design focus**: Regenerative economy categorization with mapping-specific enhancements
- **Key features**: Visual encoding specifications, graph analysis metrics, regenerative taxonomy
- **Innovation**: Combines theoretical frameworks with practical visualization requirements

## Schema Integration Benefits

### For Standards Compliance
- Full Schema.org compatibility for existing tools and search engines
- Semantic interoperability with other knowledge graphs and databases
- Rich structured data for improved web presence and discoverability

### for Network Discovery
- Murmurations Index compatibility for regenerative economy participation
- Automated relationship detection and collaboration recommendation
- Geographic clustering and bioregional analysis capabilities

### For Visualization & Analysis
- Optimized data structures for Three.js/Deck.gl rendering performance
- Graph analysis algorithm integration with network metrics
- Multiple representation modes supporting both geographic and topological views

### For Regenerative Economy
- Domain-specific categorization aligned with regenerative principles
- SDG alignment tracking for impact measurement and reporting
- Method and theory framework mapping for movement coherence
- Enhanced collaboration features for community building and resource sharing

All schemas use JSON-LD format with comprehensive @context definitions ensuring semantic interoperability across platforms, applications, and use cases in the regenerative economy ecosystem.