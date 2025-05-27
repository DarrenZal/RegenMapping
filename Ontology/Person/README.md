# Person Schemas

Comprehensive person schemas for regenerative economy mapping, combining Schema.org standards, Murmurations network discovery, and visualization optimization.

## Files in This Directory

### Core Schema Files
- **`unified-person-schema.jsonld`** - Primary unified person schema combining all approaches
- **`regen-person-shapes.ttl`** - SHACL validation shapes for data quality assurance
- **`example-person-profile.jsonld`** - Complete examples demonstrating schema usage

### Source Schema Directories
- **`Dylan/`** - Dylan Tull's visualization-optimized person schema
- **`Murmurations/`** - Murmurations network discovery schemas for people
- **`SchemaOrg/`** - Schema.org Person class extracts

## Unified Schema Overview

The unified person schema provides 9 property clusters optimized for regenerative economy mapping:

1. **Core Identity** - Names, pronouns, profile images, aliases
2. **Professional & Affiliation** - Job titles, organizations, skills, expertise
3. **Location** - Geographic coordinates, addresses for globe visualization
4. **Movement Focus** - Regenerative domain tags, methodological approaches, SDG alignment
5. **Outputs & Influence** - Publications, key works, impact metrics
6. **Contact & Media** - URLs, email, social media profiles
7. **Needs & Offers** - Resource matching for collaboration
8. **Relationships** - Collaborations, mentorships, organizational connections
9. **Network Metrics** - Graph analysis data for visualization algorithms

## Key Features

### Regenerative Economy Categorization
- **Domain Tags**: Focus areas like "Regenerative Agriculture", "Biodiversity", "Post-capitalist Finance"
- **Method Tags**: Approaches like "Permaculture", "Doughnut Economics", "Web3/DAO"
- **SDG Alignment**: UN Sustainable Development Goals mapping
- **Theory Tags**: Frameworks like "Complexity Science", "Integral Theory", "Game B"

### Sophisticated Relationship Modeling
- **Collaboration** - Project partnerships with temporal and strength data
- **Employment/Affiliation** - Organizational relationships with roles and time periods
- **Mentorship** - Knowledge transfer relationships
- **Event Participation** - Conference and gathering involvement
- **Board Positions** - Governance and advisory roles
- **Publication Co-authorship** - Academic and intellectual collaboration

### Visualization Optimization
- **Globe Rendering** - Precise coordinates for 3D globe positioning
- **Force-Directed Graphs** - Network metrics for physics simulations
- **Visual Encoding** - Properties optimized for color, size, and clustering algorithms

## SHACL Validation

The `regen-person-shapes.ttl` file provides comprehensive validation including:

- **Required Fields**: Name, primary URL, geographic coordinates
- **Format Validation**: Email patterns, coordinate ranges, SDG format
- **Controlled Vocabularies**: Domain/method tag validation against predefined lists
- **Relationship Constraints**: Proper edge type definitions and required fields
- **Data Quality**: Confidence scoring and provenance tracking

## Usage Examples

See `example-person-profile.jsonld` for complete implementations of:
- **Dr. Karen O'Brien** - Climate researcher and transformation expert
- **Dylan Tull** - Regenerative finance and mapping innovator

Both examples demonstrate the full range of schema capabilities including complex relationships, categorization, and metadata.

## Related Documentation

- **[Unified Person Schema Comparison](../../docs/schemas/Person/unified-person-schema-comparison.md)** - Detailed analysis of how the three approaches were synthesized
- **[Person Schema Mapping Guide](../../docs/schemas/Person/person-schema-mapping-guide.md)** - Transformation functions and conversion utilities
- **[Project Specifications](../../docs/project-specifications.md)** - Complete project context and implementation guidelines