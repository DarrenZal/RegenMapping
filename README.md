# Regen Mapping Project

A comprehensive knowledge graph and visualization platform for mapping regenerative organizations, people, and relationships across the globe.

## 🌱 Project Vision

The Regen Mapping project aims to create an interactive 3D globe and force-directed network graph that visualizes the regenerative economy ecosystem. By mapping organizations, individuals, and their relationships, we're building a living directory that helps:

- **Discover** regenerative organizations and changemakers
- **Connect** complementary projects and people
- **Visualize** the network topology of the regenerative movement
- **Track** the growth and evolution of regenerative initiatives
- **Facilitate** collaboration and resource sharing

## 🎯 Key Features

### Dual Visualization Modes
- **3D Globe View**: Geographic positioning showing real-world distribution of regenerative initiatives
- **Force-Directed Graph**: Relationship-focused network visualization revealing connections and influence patterns

### Rich Data Integration
- **Multi-Schema Support**: Unified approach combining Schema.org standards, Murmurations discovery features, and custom regenerative categorization
- **Comprehensive Profiles**: Organizations and individuals with detailed metadata, impact metrics, and relationship mapping
- **Live Matching**: AI-powered suggestions connecting complementary needs and offers

### Interactive Discovery
- **Smart Filtering**: By domain, method, geographic scope, activity level, and relationship type
- **Temporal Views**: Timeline slider showing network evolution over time
- **Cluster Analysis**: Automatic detection of communities and influence hubs

## 📁 Project Structure

```
/RegenMapping/
├── README.md                                    # This file
├── .gitignore                                   # Git ignore patterns
│
├── docs/                                        # Documentation
│   ├── project-specifications.md               # Detailed project specs and UI mockups
│   ├── seed-organizations.md                   # Organizations from Cascadia Conference
│   └── schemas/                                 # Schema documentation (organized by entity type)
│       ├── Organization/                        # Organization schema documentation
│       │   ├── unified-organization-schema-comparison.md  # Organization schema analysis
│       │   └── organization-schema-mapping-guide.md       # Organization transformation rules
│       ├── Person/                              # Person schema documentation
│       │   ├── unified-person-schema-comparison.md        # Person schema analysis
│       │   └── person-schema-mapping-guide.md             # Person transformation rules
│       └── README.md                            # Schema documentation overview
│
└── Ontology/                                   # Schema definitions (organized by entity type)
    ├── Person/                                  # Person schemas and examples
    │   ├── unified-person-schema.jsonld        # Primary unified person schema
    │   ├── example-person-profile.jsonld       # Person usage examples
    │   ├── Dylan/
    │   │   └── person-schema-dylantull.jsonld  # Dylan's visualization-optimized person schema
    │   ├── Murmurations/
    │   │   ├── murmurationspeople_schema-v0.1.0.jsonld         # People schema (basic)
    │   │   └── murmurationspeople_schema-v0.1.0-complete.jsonld # People schema (complete)
    │   └── SchemaOrg/
    │       ├── person-schema-basic.jsonld      # Essential 28 Person properties
    │       └── person-schema-complete.jsonld   # All 67 Person properties
    ├── Organization/                            # Organization schemas and examples
    │   ├── unified-organization-schema.jsonld  # Primary unified organization schema
    │   ├── example-organization-profile.jsonld # Organization usage examples
    │   ├── Dylan/
    │   │   └── organization-schema-dylantull.jsonld # Dylan's visualization-optimized org schema
    │   ├── Murmurations/
    │   │   ├── murmurationsorganizations_schema-v1.0.0.jsonld         # Organizations (basic)
    │   │   └── murmurationsorganizations_schema-v1.0.0-complete.jsonld # Organizations (complete)
    │   └── SchemaOrg/
    │       ├── organization-schema-basic.jsonld # Essential Organization properties
    │       └── organization-schema-complete.jsonld # Complete Organization properties
    └── Reference/                               # Reference vocabularies
        └── schemaorg-current-https.jsonld      # Full Schema.org vocabulary
```

## 📚 Documentation

### Core Documentation
- **[Project Specifications](docs/project-specifications.md)** - Detailed technical specifications, UI mockups, and implementation guidelines
- **[Seed Organizations](docs/seed-organizations.md)** - Initial dataset from Cascadia Bioregional Financing Conference

### Schema Documentation
- **[Organization Schema Comparison](docs/schemas/Organization/unified-organization-schema-comparison.md)** - Analysis of organization schema approaches
- **[Person Schema Comparison](docs/schemas/Person/unified-person-schema-comparison.md)** - Analysis of person schema approaches  
- **[Organization Schema Mapping](docs/schemas/Organization/organization-schema-mapping-guide.md)** - Organization transformation rules and conversion utilities
- **[Person Schema Mapping](docs/schemas/Person/person-schema-mapping-guide.md)** - Person transformation rules and conversion utilities

## 🏗️ Work Completed

### Phase 1: Schema Research & Development ✅
- **Organization Schema Development**:
  - Downloaded and extracted Schema.org Organization schemas from official JSON-LD source
  - Analyzed Murmurations organizations_schema-v1.0.0 with full field expansion  
  - Created Dylan Tull's regenerative organization schema with visualization optimizations
  - Built unified organization schema combining best elements of all three approaches
- **Person Schema Development**:
  - Extracted Schema.org Person class with 67 properties for comprehensive coverage
  - Analyzed Murmurations people_schema-v0.1.0 for network discovery features
  - Created Dylan Tull's regenerative person schema optimized for mapping visualization
  - Built unified person schema with collaboration and matchmaking features
- **Schema Integration & Documentation**:
  - Developed transformation guides for converting between schema formats
  - Created comprehensive comparison documents for both organizations and people
  - Built example profiles demonstrating practical implementation

### Phase 2: Implementation Planning ✅
- **Comprehensive data model** with Person and Organization node types
- **Relationship taxonomy** covering collaboration, funding, mentorship, and governance connections
- **Visual encoding specifications** for both globe and graph representations
- **UI/UX wireframes** including side panels, filtering systems, and interaction flows
- **Technical architecture** recommendations (Neo4j, Deck.gl, Three.js)

### Phase 3: Seed Data Collection 🔄
- **Identified 20+ organizations** from various regenerative finance conferences and networks
- **Categorized by focus areas**: Economic Justice, Housing, Food Systems/Land Use, Environmental Justice, Mutual Aid
- **Documented key relationships** and event connections

## 🚀 Next Steps

### Immediate (Next 2-4 weeks)
1. **Set up development environment**
   - Initialize Neo4j graph database
   - Set up data ingestion pipeline
   - Create basic web application framework

2. **Import seed data**
   - Convert regenerative organizations to unified schema
   - Add basic relationship mappings
   - Implement data validation

3. **Build MVP visualization**
   - Basic 3D globe with organization pins
   - Simple force-directed graph
   - Basic filtering and search

### Short-term (1-3 months)
1. **Expand data collection**
   - Automated enrichment from LinkedIn, Crunchbase, GitHub
   - Manual curation and verification workflows
   - Community contribution system

2. **Enhanced visualizations**
   - Interactive side panels with detailed profiles
   - Relationship strength indicators
   - Temporal timeline controls

3. **Smart matching system**
   - Needs/offers analysis
   - Collaboration recommendations
   - Network gap identification

### Long-term (3-12 months)
1. **Platform scaling**
   - Multi-bioregion support
   - Real-time data updates
   - Mobile-responsive design

2. **Community features**
   - User profiles and authentication
   - Direct messaging and introductions
   - Event and project coordination

3. **Analytics and insights**
   - Network health metrics
   - Impact measurement
   - Trend analysis and reporting

## 🛠️ Technical Stack

### Recommended Architecture
- **Database**: Neo4j (graph database with spatial extensions)
- **Backend**: Node.js with GraphQL API
- **Frontend**: React with Three.js for 3D visualizations
- **Globe Rendering**: Deck.gl with ScatterplotLayer and ArcLayer
- **Force Graph**: d3-force-3d or three.js
- **Data Validation**: SHACL shapes engine for knowledge graph quality assurance
- **Hosting**: Cloud platform with CDN for global performance

### Data Pipeline & SHACL Integration

The ETL pipeline implements open-world data ingestion with quality validation using SHACL shapes:

#### 1. **Data Ingestion**
```bash
# Import from various sources (Murmurations, LinkedIn, manual entry)
./scripts/ingest-data.sh --source murmurations --format jsonld
./scripts/ingest-data.sh --source linkedin --format csv  
./scripts/ingest-data.sh --source manual --format jsonld
```

#### 2. **Staging & Validation**
```sparql
# Store raw triples in temporary graph
LOAD <file://./data/raw/organizations-batch-001.ttl> INTO GRAPH <http://staging.regenmap.org/temp>

# Run SHACL validation against shapes
PREFIX sh: <http://www.w3.org/ns/shacl#>
SELECT ?focusNode ?message ?severity ?value WHERE {
  GRAPH <http://staging.regenmap.org/shacl-report> {
    ?result sh:focusNode ?focusNode ;
            sh:resultMessage ?message ;
            sh:resultSeverity ?severity ;
            sh:value ?value .
  }
}
```

#### 3. **Quality Monitoring**
- **Violation Reports**: Export SHACL validation results to data quality dashboard
- **Confidence Scoring**: Automatically assign confidence scores based on validation results
- **Progressive Validation**: Tighten constraints over time as data quality improves

#### 4. **Production Publishing**
- **All Data Preserved**: Move validated and non-validated data to production (open-world principle)
- **Quality Metadata**: Tag records with validation status and confidence scores
- **Consumer Filtering**: Allow downstream applications to filter by quality thresholds

### SHACL Configuration

#### Operational Tuning
- **Critical Violations**: Promote core constraints (e.g., malformed URIs) to `sh:Violation` severity
- **Soft Nudges**: Use `sh:Warning` for recommendations like missing descriptions
- **Noise Reduction**: Remove `sh:minCount 1` for optional fields if too noisy
- **Pattern Evolution**: Add `sh:in` lists and regex patterns as data issues emerge

#### Quality Thresholds
```javascript
// Example quality filtering in client applications
const HIGH_QUALITY = 0.8;  // Show only high-confidence records
const MEDIUM_QUALITY = 0.5; // Include with quality warnings
const LOW_QUALITY = 0.2;    // Include but highlight data gaps

function filterByQuality(orgs, threshold = MEDIUM_QUALITY) {
  return orgs.filter(org => 
    org.confidenceScore >= threshold || 
    org.hasManualVerification
  );
}
```

### Data Quality Dashboard

The SHACL validation system powers a real-time data quality dashboard showing:

- **Validation Overview**: Pass/fail rates across all shape constraints
- **Field Completeness**: Percentage of organizations with each property populated  
- **Geographic Coverage**: Data density by region and scope
- **Source Reliability**: Quality metrics per data source
- **Improvement Trends**: Quality metrics over time

### Automated Quality Improvement

```bash
# Weekly data quality reports
./scripts/generate-quality-report.sh --format html --output reports/

# Automated cleanup suggestions
./scripts/suggest-improvements.sh --confidence-threshold 0.3

# Gradual constraint tightening
./scripts/evolve-shapes.sh --analyze-violations --suggest-patterns
```

## 🤝 Contributing

This project welcomes contributions from:
- **Data curators**: Help identify and verify organizations and relationships
- **Developers**: Contribute to visualization and platform development
- **Designers**: Improve user experience and visual design
- **Domain experts**: Provide guidance on regenerative economy categorization

## 📊 Schema Overview

The unified schema combines:

### Core Entity Types
- **Person**: Individuals in the regenerative space
- **Organization**: Companies, nonprofits, DAOs, cooperatives, communities

### Key Relationship Types
- **Collaboration**: Project partnerships and joint initiatives
- **Employment/Affiliation**: Formal organizational relationships
- **Funding/Investment**: Financial flows and support
- **Mentorship**: Knowledge transfer and guidance
- **Membership**: Community and network participation

### Rich Metadata
- **Geographic**: Precise location data for globe visualization
- **Temporal**: Timeline information for evolution tracking
- **Taxonomic**: Domain tags, methods, SDG alignment, theoretical frameworks
- **Metrics**: Impact measurements, influence indicators, activity levels
- **Needs/Offers**: Resource matching for collaboration facilitation

## 🌍 Impact Goals

By creating this comprehensive mapping platform, we aim to:

1. **Accelerate regenerative transitions** by connecting complementary initiatives
2. **Reduce duplication** by revealing existing solutions and resources
3. **Identify gaps** where new initiatives or support are needed
4. **Strengthen networks** through improved visibility and communication
5. **Track progress** toward regenerative economy goals
6. **Inspire action** by showcasing the scale and diversity of the movement

## 📞 Contact & Collaboration

This project is part of the broader regenerative movement. For collaboration opportunities or questions:

- **GitHub Repository**: https://github.com/DarrenZal/RegenMap
- **Project Lead**: [Contact information]
- **Technical Lead**: [Contact information]
- **Community Coordinator**: [Contact information]

---

*"We are not going to be able to operate our Spaceship Earth successfully nor for much longer unless we see it as a whole spaceship and our fate as common. It has to be everybody or nobody."* - Buckminster Fuller

The regenerative future is already emerging. Let's map it together.
