# Dylan Tull's Person Schema

Visualization-optimized person schema designed specifically for 3D globe and force-directed graph rendering in regenerative economy mapping applications.

## Files

- **`person-schema-dylantull.jsonld`** - Complete schema definition optimized for mapping visualization

## Schema Purpose

This schema prioritizes the specific needs of interactive network visualization while maintaining semantic clarity for regenerative economy categorization. It serves as a key source for the unified person schema's visualization-specific features.

## Key Design Principles

### 1. Visualization-First Approach
- **Globe Rendering** - `hqLat`/`hqLon` fields optimized for 3D coordinate positioning
- **Graph Layout** - Metrics and properties that inform force-directed physics simulations
- **Visual Encoding** - Clear specifications for how data maps to visual elements (color, size, connections)

### 2. Regenerative Economy Categorization
- **Domain Tags** - Controlled vocabulary for regenerative focus areas
- **Method Tags** - Standardized approaches and methodologies
- **SDG Alignment** - UN Sustainable Development Goals mapping
- **Theory Frameworks** - Intellectual and theoretical orientations

### 3. Sophisticated Relationship Modeling

#### Edge Type Definitions
The schema includes formal edge type definitions that are crucial for graph visualization:

- **Collaboration** - Bidirectional project partnerships with weight and funding metadata
- **Employment/Affiliation** - Unidirectional organizational relationships with roles and time data
- **Mentor/Advisor** - Unidirectional knowledge transfer with intensity measures
- **Publication Co-authorship** - Bidirectional intellectual collaboration with citation data
- **Event Participation** - Unidirectional event involvement with role and organization details
- **Shared Board Seat** - Bidirectional governance connections

Each edge type specifies:
- **Direction** - Bidirectional or unidirectional flow
- **Applies To** - Valid entity type combinations (Person↔Person, Person→Organization, etc.)
- **Minimal Fields** - Required data for relationship creation
- **Optional Fields** - Additional metadata for rich relationship descriptions

### 4. Network Analysis Integration
- **Centrality Measures** - Properties for degree, betweenness, and other graph metrics
- **Community Detection** - Fields supporting clustering algorithms
- **Influence Scoring** - Combined measures of network position and impact

## Unique Contributions to Unified Schema

### Regenerative Taxonomy
Dylan's schema provides the controlled vocabularies that enable meaningful categorization:

```json
{
  "domainTags": ["Regenerative Agriculture", "Biodiversity", "Post-capitalist Finance"],
  "methodTags": ["Permaculture", "Doughnut Economics", "Web3/DAO"],
  "sdgTags": ["SDG02", "SDG13", "SDG15"],
  "theoryTags": ["Complexity Science", "Integral Theory"]
}
```

### Visualization Metadata
Specific properties that enable sophisticated visual representation:

```json
{
  "hqLat": 47.6062,
  "hqLon": -122.3321,
  "locality": "Seattle",
  "metrics": {
    "followers": 2500,
    "citations": 42,
    "projects": 7,
    "connections": 156
  }
}
```

### Graph Analysis Support
Properties that inform force-directed layout algorithms and network analysis:

```json
{
  "edgeTypes": {
    "Collaboration": {
      "direction": "bidirectional",
      "weight": 0.8,
      "minimalFields": ["since", "until", "projectName"]
    }
  }
}
```

## Integration with Other Schemas

Dylan's schema fills critical gaps in Schema.org and Murmurations approaches:

- **vs Schema.org** - Adds regenerative-specific categorization and visualization optimization
- **vs Murmurations** - Provides detailed edge type definitions and graph analysis support
- **Unified Synthesis** - Contributes the visualization and regenerative taxonomy foundation

## Implementation Notes

### For Developers
- Edge type definitions map directly to graph database relationship modeling
- Coordinate data optimized for Deck.gl ScatterplotLayer rendering
- Categorization tags enable sophisticated filtering and visual encoding

### For Data Curators
- Controlled vocabularies ensure consistent categorization across the network
- Edge type specifications provide clear guidance for relationship documentation
- Visual metadata helps prioritize high-impact network nodes

## Related Files

- **[Unified Person Schema](../unified-person-schema.jsonld)** - See how Dylan's concepts integrate with Schema.org and Murmurations
- **[Person Schema Comparison](../../../docs/schemas/Person/unified-person-schema-comparison.md)** - Analysis of how the three approaches complement each other
- **[Edge Type Transformations](../../../docs/schemas/Person/person-schema-mapping-guide.md#edge-type-transformations)** - Detailed implementation guidance