# Unified Person Schema Comparison

This document compares the three approaches to modeling people in the regenerative economy ecosystem and explains how they were synthesized into our unified schema.

## Overview

The unified person schema combines the best elements from three different approaches:

1. **Schema.org Person** - Web standards compliance and semantic interoperability
2. **Murmurations People Schema** - Network discovery and regenerative economy focus  
3. **Dylan Tull's Visualization Schema** - Optimized for 3D globe and force-directed graph visualization

## Schema Comparison Matrix

### Core Identity Fields

| Field | Schema.org | Murmurations | Dylan Tull | Unified Schema | Purpose |
|-------|------------|--------------|------------|----------------|---------|
| Full Name | `schema:name` | `name` (required) | `fullName` | `schema:name` | Primary identifier |
| Given/Family Name | `schema:givenName`, `schema:familyName` | - | - | `schema:givenName`, `schema:familyName` | Name components |
| Nickname | `schema:alternateName` | `nickname` | - | `schema:alternateName` | Informal names |
| Aliases | - | - | `aka[]` | `regen:alsoKnownAs[]` | Search optimization |
| Display Handle | - | - | `displayHandle` | `regen:displayHandle` | Social media mentions |
| Headline | - | - | `headline` | `regen:headline` | Professional summary |
| Birth Year | `schema:birthDate` | - | `birthYear` | `regen:birthYear` | Demographics |
| Citizenship | `schema:nationality` | - | `citizenship` | `regen:citizenship` | Global context |
| Time Zone | - | - | `timeZone` | `regen:timeZone` | Coordination |
| Pronouns | - | - | `pronouns` | `regen:pronouns` | Inclusive UX |
| Profile Image | `schema:image` | `image` | - | `schema:image` | Visual identification |

### Professional Information

| Field | Schema.org | Murmurations | Dylan Tull | Unified Schema | Purpose |
|-------|------------|--------------|------------|----------------|---------|
| Job Title | `schema:jobTitle` | - | `primaryRole` | `schema:jobTitle` | Professional identity |
| Current Title | `schema:jobTitle` | - | `currentTitle` | `regen:currentTitle` | Current position |
| Current Org | `schema:worksFor` | - | `currentOrgId` | `schema:worksFor` | Primary affiliation |
| Work History | - | - | `workHistory[]` | `regen:workHistory[]` | Career trajectory |
| Education | `schema:educationalCredential` | - | `education[]` | `regen:education[]` | Academic background |
| Certifications | `schema:hasCredential` | - | `certifications[]` | `regen:certifications[]` | Professional credentials |
| Affiliations | `schema:memberOf` | - | `affiliations[]` | `regen:affiliations[]` | Time-sliced relationships |
| Skills | `schema:skills` | `tags` (required) | `skills[]` | `schema:skills` | Competencies |
| Languages | `schema:knowsLanguage` | `knows_language[]` | `languages[]` | `schema:knowsLanguage` | Communication abilities |
| Expertise | `schema:knowsAbout` | - | - | `schema:knowsAbout` | Knowledge domains |

### Location Data

| Field | Schema.org | Murmurations | Dylan Tull | Unified Schema | Purpose |
|-------|------------|--------------|------------|----------------|---------|
| Address | `schema:address` | `street_address`, `locality`, etc. | - | `schema:address` | Complete address |
| Coordinates | - | `geolocation.lat/lon` | `hqLat`, `hqLon` | `geo:lat`, `geo:long` | Globe positioning |
| Locality | `schema:addressLocality` | `locality` | `locality` | `schema:addressLocality` | Display name |
| Country | `schema:addressCountry` | `country_name`, `country_iso_3166` | - | `schema:addressCountry` | Geographic context |

### Regenerative Focus (Unique to Dylan/Unified)

| Field | Schema.org | Murmurations | Dylan Tull | Unified Schema | Purpose |
|-------|------------|--------------|------------|----------------|---------|
| Domain Tags | - | - | `domainTags[]` | `regen:domainTags[]` | Work focus areas |
| Method Tags | - | - | `methodTags[]` | `regen:methodTags[]` | Methodological approaches |
| SDG Alignment | - | - | `sdgTags[]` | `regen:sdgAlignment[]` | UN goal mapping |
| Theory Tags | - | - | - | `regen:theoreticalFrameworks[]` | Theoretical lenses |

### Contact & Online Presence

| Field | Schema.org | Murmurations | Dylan Tull | Unified Schema | Purpose |
|-------|------------|--------------|------------|----------------|---------|
| Primary URL | `schema:url` | `primary_url` (required) | - | `schema:url` | Main online presence |
| Email | `schema:email` | `contact_details.email` | - | `schema:email` | Direct contact |
| Phone | `schema:telephone` | `telephone` | - | `schema:telephone` | Phone contact |
| Additional URLs | `schema:sameAs` | `urls[]` | `urls[]` | `regen:additionalUrls[]` | Social media, etc. |
| Email Hash | - | - | `emailHash` | `regen:emailHash` | Privacy-preserving contact |
| Public Email | `schema:email` | `contact_details.email` | `publicEmail` | `regen:publicEmail` | Direct contact |
| DM Links | - | - | `dmLinks[]` | `regen:dmLinks[]` | Direct messaging |

### Influence & Content Metrics

| Field | Schema.org | Murmurations | Dylan Tull | Unified Schema | Purpose |
|-------|------------|--------------|------------|----------------|---------|
| Twitter/X Followers | - | - | `followersX` | `regen:followersX` | Social influence |
| LinkedIn Followers | - | - | `followersLinkedIn` | `regen:followersLinkedIn` | Professional reach |
| Newsletter Subscribers | - | - | `newsletterSubs` | `regen:newsletterSubs` | Direct audience |
| H-Index | - | - | `hIndex` | `regen:hIndex` | Academic impact |
| Twitter/X Lists | - | - | `listsOnX` | `regen:listsOnX` | Network curation |
| Engagement Rate | - | - | `twitterEngageRate` | `regen:twitterEngageRate` | Content quality |

### Content & IP

| Field | Schema.org | Murmurations | Dylan Tull | Unified Schema | Purpose |
|-------|------------|--------------|------------|----------------|---------|
| Pinned Tweets | - | - | `pinnedTweets[]` | `regen:pinnedTweets[]` | Thought leadership |
| Top Posts | - | - | `topPosts[]` | `regen:topPosts[]` | Viral content |
| Publications | `schema:author` | - | `publications[]` | `regen:publications[]` | Academic output |
| Repositories | - | - | `repos[]` | `regen:repos[]` | Technical contributions |
| Speaking Events | - | - | `speakingEvents[]` | `regen:speakingEvents[]` | Public speaking |

### Networks & Memberships

| Field | Schema.org | Murmurations | Dylan Tull | Unified Schema | Purpose |
|-------|------------|--------------|------------|----------------|---------|
| LinkedIn Groups | - | - | `groupsLinkedIn[]` | `regen:groupsLinkedIn[]` | Professional networks |
| Facebook Groups | - | - | `fbGroups[]` | `regen:fbGroups[]` | Community engagement |
| DAO Memberships | - | - | `daoMemberships[]` | `regen:daoMemberships[]` | Web3 participation |

### Trust & Verification

| Field | Schema.org | Murmurations | Dylan Tull | Unified Schema | Purpose |
|-------|------------|--------------|------------|----------------|---------|
| Twitter/X Verified | - | - | `blueCheckX` | `regen:blueCheckX` | Credibility indicator |
| LinkedIn Verified | - | - | `credentialedLinkedIn` | `regen:credentialedLinkedIn` | Professional credibility |
| Human ID Proof | - | - | `humanIDProof` | `regen:humanIDProof` | Authenticity verification |

### Network Discovery (Murmurations Focus)

| Field | Schema.org | Murmurations | Dylan Tull | Unified Schema | Purpose |
|-------|------------|--------------|------------|----------------|---------|
| Linked Schemas | - | `linked_schemas` (required) | - | - | Validation requirement |
| Relationships | - | `relationships[]` | - | `murm:relationships[]` | Formal relationships |
| Languages | `schema:knowsLanguage` | `knows_language[]` | - | `schema:knowsLanguage` | Communication |

### Visualization Optimization (Dylan Focus)

| Field | Schema.org | Murmurations | Dylan Tull | Unified Schema | Purpose |
|-------|------------|--------------|------------|----------------|---------|
| Key Works | `schema:subjectOf` | - | `keyWorks[]` | `regen:keyWorks[]` | Impact showcase |
| Influence Metrics | `schema:interactionStatistic` | - | `metrics{}` | `regen:influenceMetrics{}` | Node sizing |
| Network Metrics | - | - | - | `regen:networkMetrics{}` | Graph analysis |

### Collaboration Features (Unified Innovation)

| Field | Schema.org | Murmurations | Dylan Tull | Unified Schema | Purpose |
|-------|------------|--------------|------------|----------------|---------|
| Current Needs | - | - | `needs[]` | `regen:currentNeeds[]` | Matchmaking |
| Current Offers | - | - | `offers[]` | `regen:currentOffers[]` | Resource sharing |
| Collaborators | `schema:colleague` | - | `collaborators[]` | `regen:collaborators[]` | Active partnerships |
| Mentors/Mentees | - | - | `mentors[]`, `mentees[]` | `regen:mentors[]`, `regen:mentees[]` | Knowledge transfer |
| Event Participation | - | - | `eventParticipation[]` | `regen:eventParticipation[]` | Event involvement |
| Board Positions | `schema:memberOf` | - | `boardPositions[]` | `regen:boardPositions[]` | Governance roles |
| Co-authorships | `schema:colleague` | - | `coauthorships[]` | `regen:coauthorships[]` | Joint publications |
| Network Metrics | - | - | `degreeCentrality`, etc. | `regen:networkMetrics{}` | Graph analysis |

## Edge Types and Relationship Modeling

One of the most significant differences between the schemas is how they model relationships between entities. Dylan Tull's schema includes sophisticated edge type definitions that are essential for graph visualization and analysis.

### Edge Type Comparison

| Edge Type | Schema.org | Murmurations | Dylan Tull | Unified Schema | Direction | Purpose |
|-----------|------------|--------------|------------|----------------|-----------|---------|
| **Collaboration** | `schema:colleague` | - | ✓ Defined | `regen:Collaboration` | Bidirectional | Project partnerships |
| **Employment** | `schema:worksFor` | - | ✓ Defined | `regen:EmploymentAffiliation` | Unidirectional | Formal org relationships |
| **Mentorship** | - | - | ✓ Defined | `regen:MentorAdvisor` | Unidirectional | Knowledge transfer |
| **Co-authorship** | `schema:colleague` | - | ✓ Defined | `regen:PublicationCoauthorship` | Bidirectional | Joint publications |
| **Event Participation** | - | - | ✓ Defined | `regen:EventParticipation` | Unidirectional | Event involvement |
| **Board Positions** | `schema:memberOf` | - | ✓ Defined | `regen:SharedBoardSeat` | Bidirectional | Governance connections |

### Schema.org Relationship Approach

Schema.org provides basic relationship properties but lacks the granularity needed for network analysis:

```json
{
  "schema:colleague": [{"@id": "person2"}],
  "schema:worksFor": {"@id": "organization1"},
  "schema:memberOf": [{"@id": "organization2"}]
}
```

**Limitations:**
- No temporal information (when relationships started/ended)
- No role specificity within relationships
- No directionality or relationship strength
- Minimal metadata for network analysis

### Murmurations Relationship Approach

Murmurations focuses on formal organizational relationships for network discovery:

```json
{
  "relationships": [
    {
      "relationship_type": "member",
      "entity_name": "Organization Name",
      "entity_url": "https://example.org"
    }
  ]
}
```

**Strengths:**
- Network discovery optimization
- Clear entity identification via URLs

**Limitations:**
- Limited to organizational relationships
- No person-to-person connections
- No temporal or strength data
- Focused on current relationships only

### Dylan Tull's Edge Type System

Dylan's schema provides comprehensive edge type definitions with rich metadata:

```json
{
  "edgeTypes": {
    "Collaboration": {
      "direction": "bidirectional",
      "applies": ["Person↔Person", "Person↔Organization", "Organization↔Organization"],
      "minimalFields": ["since", "until", "projectName"],
      "optionalFields": ["weight", "fundingUSD"]
    },
    "EventParticipation": {
      "direction": "unidirectional", 
      "applies": ["Person→Organization"],
      "minimalFields": ["eventId", "role", "date"]
    }
  }
}
```

**Advantages:**
- Formal directionality specifications
- Rich metadata for graph algorithms
- Temporal relationship tracking
- Multiple entity type support
- Visualization optimization

### Unified Schema Edge Type Integration

The unified schema adopts and extends Dylan's edge type system while maintaining Schema.org compatibility:

```json
{
  "regen:edgeTypes": {
    "schema:hasDefinedTerm": [
      {
        "@id": "regen:Collaboration",
        "@type": "schema:DefinedTerm",
        "rdfs:label": "Collaboration",
        "rdfs:comment": "Project partnerships and joint initiatives",
        "regen:direction": "bidirectional",
        "regen:applies": ["Person↔Person", "Person↔Organization"],
        "regen:minimalFields": ["since", "until", "projectName"],
        "regen:optionalFields": ["weight", "fundingUSD"]
      }
    ]
  }
}
```

### Implementation Benefits of Edge Types

#### For Graph Visualization
- **Force-Directed Layouts**: Edge directionality and weights inform physics simulations
- **Node Clustering**: Relationship types enable community detection algorithms
- **Visual Encoding**: Different edge types can have distinct visual representations
- **Interactive Exploration**: Users can filter by relationship type

#### For Network Analysis
- **Centrality Calculations**: Different edge types contribute differently to influence metrics
- **Path Analysis**: Relationship types affect shortest path calculations
- **Community Detection**: Edge types inform clustering algorithms
- **Influence Propagation**: Models how ideas/resources flow through networks

#### For Data Quality
- **Validation Rules**: Edge types define required fields for relationships
- **Temporal Consistency**: Start/end dates ensure relationship timeline accuracy
- **Relationship Strength**: Quantified connections enable weighted analysis
- **Provenance Tracking**: Source and confidence data for each relationship

### Edge Type Field Mappings

The unified schema provides structured relationship data:

```json
{
  "eventParticipation": [
    {
      "event": {"@id": "event1", "schema:name": "Regenerative Finance Summit"},
      "organizer": {"@id": "org1"},
      "role": "Keynote Speaker",
      "date": "2024-03-15"
    }
  ],
  "coauthorships": [
    {
      "coauthor": {"@id": "person2"},
      "work": {"@id": "paper1", "schema:name": "Regenerative Capital Flows"},
      "citations": 127
    }
  ]
}
```

This structured approach enables sophisticated relationship queries and analysis while maintaining human readability and Schema.org compatibility.

## Synthesis Approach

### 1. Standards Compliance First
We built on Schema.org as the foundation to ensure web standards compliance and semantic interoperability. This provides:
- Established vocabulary for core person attributes
- SEO and structured data benefits
- Compatibility with existing systems

### 2. Network Discovery Integration  
We incorporated Murmurations' network discovery approach:
- Required fields for index participation
- Relationship modeling for network effects
- Geographic and contact standardization

### 3. Visualization Optimization
We added Dylan's visualization-specific enhancements:
- Regenerative economy categorization tags
- Metrics for graph layout algorithms
- Location data optimized for globe rendering

### 4. Collaboration Innovation
We extended all approaches with new collaboration features:
- Needs/offers matching for serendipitous connections
- Network analysis metrics for community insights
- Enhanced relationship modeling

## Implementation Benefits

### For Web Standards
- Full Schema.org compliance for existing tools
- Rich structured data for search engines
- Interoperability with other person databases

### For Network Discovery
- Murmurations Index compatibility
- Automated relationship detection
- Geographic clustering capabilities

### For Visualization
- Optimized for Three.js/Deck.gl rendering
- Graph analysis algorithm integration
- Multiple representation modes (globe + force-directed)

### For Regenerative Economy
- Domain-specific categorization
- SDG alignment tracking
- Method and theory framework mapping
- Community collaboration features

## Field Mapping Functions

### From Schema.org to Unified
```javascript
function mapSchemaOrgToUnified(schemaPerson) {
  return {
    '@type': ['schema:Person', 'regen:RegenerativePerson'],
    'schema:name': schemaPerson.name,
    'schema:givenName': schemaPerson.givenName,
    'schema:familyName': schemaPerson.familyName,
    'schema:jobTitle': schemaPerson.jobTitle,
    'schema:worksFor': schemaPerson.worksFor,
    'schema:email': schemaPerson.email,
    'schema:url': schemaPerson.url,
    // Add regenerative-specific fields as needed
    'regen:domainTags': [], // Manual categorization required
    'regen:methodTags': []
  };
}
```

### From Murmurations to Unified  
```javascript
function mapMurmurationsToUnified(murmPerson) {
  return {
    '@type': ['schema:Person', 'regen:RegenerativePerson'],
    'schema:name': murmPerson.name,
    'schema:url': murmPerson.primary_url,
    'schema:keywords': murmPerson.tags,
    'schema:description': murmPerson.description,
    'schema:image': murmPerson.image,
    'schema:telephone': murmPerson.telephone,
    'geo:lat': murmPerson.geolocation?.lat,
    'geo:long': murmPerson.geolocation?.lon,
    'regen:additionalUrls': murmPerson.urls,
    'schema:knowsLanguage': murmPerson.knows_language
  };
}
```

### From Dylan Tull to Unified
```javascript  
function mapDyllanTullToUnified(dylanPerson) {
  return {
    '@type': ['schema:Person', 'regen:RegenerativePerson'], 
    'schema:name': dylanPerson.fullName,
    'regen:alsoKnownAs': dylanPerson.aka,
    'regen:pronouns': dylanPerson.pronouns,
    'schema:jobTitle': dylanPerson.primaryRole,
    'regen:affiliations': dylanPerson.affiliations,
    'geo:lat': dylanPerson.hqLat,
    'geo:long': dylanPerson.hqLon,
    'regen:locality': dylanPerson.locality,
    'regen:domainTags': dylanPerson.domainTags,
    'regen:methodTags': dylanPerson.methodTags,
    'regen:sdgAlignment': dylanPerson.sdgTags,
    'regen:keyWorks': dylanPerson.keyWorks,
    'regen:influenceMetrics': dylanPerson.metrics,
    // Enhanced relationship fields
    'regen:mentors': dylanPerson.mentors,
    'regen:mentees': dylanPerson.mentees,
    'regen:collaborators': dylanPerson.collaborators,
    'schema:colleague': dylanPerson.colleagues,
    'regen:eventParticipation': dylanPerson.eventParticipation,
    'regen:boardPositions': dylanPerson.boardPositions,
    'regen:coauthorships': dylanPerson.coauthorships,
    // Needs and offers
    'regen:currentNeeds': dylanPerson.needs,
    'regen:currentOffers': dylanPerson.offers,
    // Network metrics
    'regen:networkMetrics': {
      'regen:degreeCentrality': dylanPerson.degreeCentrality,
      'regen:betweennessCentrality': dylanPerson.betweennessCentrality,
      'regen:clusterId': dylanPerson.clusterId,
      'regen:bridgingScore': dylanPerson.bridgingScore
    }
  };
}
```

## Validation and Quality

### Required Fields (Minimum Viable Profile)
- `schema:name` - Full name for identification
- `schema:url` - Primary online presence
- `geo:lat`, `geo:long` - Location for mapping
- `regen:domainTags` - At least one focus area

### Recommended Fields (Rich Profile)
- Professional information (title, organization)
- Contact details (email, phone)
- Regenerative categorization (method, SDG, theory tags)
- Key works and influence metrics

### Data Quality Indicators
- `regen:confidenceScore` (0-1) based on source authority
- `regen:lastVerified` timestamp for freshness
- `regen:dataSource[]` for provenance tracking
- Validation against controlled vocabularies

## Future Extensions

### Planned Enhancements
1. **Impact Measurement** - Quantified regenerative impact metrics
2. **Learning Pathways** - Educational journey and skill development
3. **Resource Sharing** - Formal resource exchange protocols
4. **Event Integration** - Conference and gathering participation
5. **Publication Network** - Academic and thought leadership connections

### Technical Roadmap
1. **GraphQL API** - Query interface for applications
2. **Neo4j Integration** - Graph database optimization
3. **Vector Embeddings** - Semantic search capabilities
4. **Real-time Updates** - Live synchronization across platforms
5. **Privacy Controls** - Granular data sharing permissions

This unified approach provides a comprehensive foundation for mapping the regenerative economy ecosystem while maintaining compatibility with existing standards and enabling innovative visualization and collaboration features.