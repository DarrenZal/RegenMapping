# Documentation

Project specifications, requirements, and guides for the regenerative economy mapping platform covering organizations and people.

## Contents

- `project-specifications.md` - Complete project specifications including UI/UX design, technical architecture, and implementation details
- `seed-organizations.md` - Initial dataset of organizations for testing and development
- `schemas/` - Schema analysis, transformation, and mapping documentation

## Project Overview

This documentation covers the development of a comprehensive 3D globe and force-directed graph visualization platform for mapping the regenerative economy ecosystem, including organizations, people, and their interconnected relationships.

## Key Documentation

### Project Specifications
Comprehensive specifications including:
- **Dual visualization modes** - 3D globe with geographic positioning and force-directed graph for relationship topology
- **Rich data modeling** - Person and organization entities with enhanced relationship tracking
- **Interactive features** - Side panels, filtering systems, temporal controls, and collaboration tools
- **Technical architecture** - Neo4j graph database, React frontend, GraphQL API, and visualization frameworks

### Schema Documentation

#### Entity Schema Analysis
- **[Organization Schema Comparison](schemas/Organization/unified-organization-schema-comparison.md)** - Synthesis of Schema.org, Murmurations, and Dylan Tull's organization modeling approaches
- **[Person Schema Comparison](schemas/Person/unified-person-schema-comparison.md)** - Comprehensive analysis of person schema approaches with visualization optimization

#### Implementation Guides  
- **[Organization Schema Mapping](schemas/Organization/organization-schema-mapping-guide.md)** - Organization transformation rules and conversion utilities between Schema.org, Murmurations, and unified schema formats
- **[Person Schema Mapping](schemas/Person/person-schema-mapping-guide.md)** - Person transformation rules and conversion utilities between Schema.org, Murmurations, and unified schema formats

### Seed Data & Testing
- **Regenerative organizations** - Curated dataset from Cascadia Bioregional Financing Conference for initial platform testing
- **Example profiles** - Complete implementation examples for both organizations and people
- **Relationship mapping** - Initial network connections for testing graph algorithms

## Schema Integration Summary

The platform integrates three complementary schema approaches:

1. **Schema.org Foundation** - Web standards compliance with 67 Person properties and comprehensive Organization coverage
2. **Murmurations Network** - Regenerative economy discovery with required field validation and geographic indexing  
3. **Dylan Tull's Optimization** - Visualization-specific enhancements with categorization taxonomy and graph analysis support

## Implementation Features

### Core Capabilities
- **Entity modeling** - Rich profiles for people and organizations with validation and quality scoring
- **Relationship tracking** - Multi-type connections with strength indicators and temporal data
- **Geographic mapping** - Precise coordinate data optimized for globe rendering and regional clustering
- **Network analysis** - Graph metrics for community detection, influence measurement, and collaboration recommendations

### Collaboration Tools
- **Needs/offers matching** - AI-powered resource sharing and partnership suggestions
- **Network gap analysis** - Identification of missing connections and collaboration opportunities  
- **Introduction facilitation** - Automated relationship suggestions with context and rationale

This documentation provides the foundation for building a comprehensive regenerative economy mapping platform that combines rigorous data modeling with innovative visualization and collaboration features.