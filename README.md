# Regen Mapping Project

A comprehensive knowledge graph and visualization platform for mapping regenerative organizations, people, and relationships across the Cascadia bioregion and beyond.

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
│   └── schemas/                                 # Schema documentation
│       ├── unified-organization-schema-comparison.md  # Comprehensive schema analysis
│       └── schema-mapping-guide.md             # Transformation rules between schemas
│
└── Ontology/                                   # Schema definitions (JSON-LD files)
    ├── unified-organization-schema.jsonld          # Practical unified implementation
    ├── example-organization-profile.jsonld         # Complete usage example
    ├── schemaorganizationDyllanTull.jsonld        # Dylan Tull's regenerative schema
    │
    ├── Murmurations/                               # Murmurations Network schemas
    │   ├── murmurationsorganizations_schema-v1.0.0.jsonld
    │   └── murmurationsorganizations_schema-v1.0.0-complete.jsonld
    │
    └── schmeaorg/                                  # Schema.org extracts
        ├── schemaorg-current-https.jsonld
        ├── schemaorganizationschemaorg.jsonld
        └── schemaorganizationschemaorg-complete.jsonld
```

## 📚 Documentation

### Core Documentation
- **[Project Specifications](docs/project-specifications.md)** - Detailed technical specifications, UI mockups, and implementation guidelines
- **[Seed Organizations](docs/seed-organizations.md)** - Initial dataset from Cascadia Bioregional Financing Conference

### Schema Documentation
- **[Schema Comparison](docs/schemas/unified-organization-schema-comparison.md)** - Comprehensive analysis of Schema.org, Murmurations, and Dylan Tull's approaches
- **[Schema Mapping Guide](docs/schemas/schema-mapping-guide.md)** - Transformation rules and conversion utilities between different schema formats

## 🏗️ Work Completed

### Phase 1: Schema Research & Development ✅
- **Downloaded and extracted Schema.org Organization schemas** from the official JSON-LD source
- **Analyzed three major schema approaches**:
  - Schema.org (web standards compliance)
  - Murmurations (regenerative economy discovery)
  - Dylan Tull's schema (rich categorization for mapping/visualization)
- **Created unified schema proposal** combining the best elements of all three approaches
- **Built complete Murmurations schema** with all field definitions expanded inline (no external references)
- **Developed transformation guides** for converting between schema formats

### Phase 2: Implementation Planning ✅
- **Comprehensive data model** with Person and Organization node types
- **Relationship taxonomy** covering collaboration, funding, mentorship, and governance connections
- **Visual encoding specifications** for both globe and graph representations
- **UI/UX wireframes** including side panels, filtering systems, and interaction flows
- **Technical architecture** recommendations (Neo4j, Deck.gl, Three.js)

### Phase 3: Seed Data Collection 🔄
- **Identified 20+ organizations** from Cascadia Bioregional Financing Conference
- **Categorized by focus areas**: Economic Justice, Housing, Food Systems/Land Use, Environmental Justice, Mutual Aid
- **Documented key relationships** and event connections

## 🚀 Next Steps

### Immediate (Next 2-4 weeks)
1. **Set up development environment**
   - Initialize Neo4j graph database
   - Set up data ingestion pipeline
   - Create basic web application framework

2. **Import seed data**
   - Convert Cascadia Conference organizations to unified schema
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
- **Hosting**: Cloud platform with CDN for global performance

### Data Pipeline
1. **Ingestion**: Automated scrapers for public data sources
2. **Processing**: Entity resolution and deduplication
3. **Enrichment**: NLP for tag extraction and relationship inference
4. **Validation**: Manual curation and confidence scoring
5. **Publishing**: Real-time updates to visualization layer

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

This project is part of the broader Cascadia bioregional organizing movement. For collaboration opportunities or questions:

- **GitHub Repository**: https://github.com/DarrenZal/RegenMapping
- **Project Lead**: [Contact information]
- **Technical Lead**: [Contact information]
- **Community Coordinator**: [Contact information]

---

*"We are not going to be able to operate our Spaceship Earth successfully nor for much longer unless we see it as a whole spaceship and our fate as common. It has to be everybody or nobody."* - Buckminster Fuller

The regenerative future is already emerging. Let's map it together.
