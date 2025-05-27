# Unified Organization Schema Comparison

This document compares the three approaches to modeling organizations in the regenerative economy ecosystem and explains how they were synthesized into our unified schema.

## Overview

The unified organization schema combines the best elements from three different approaches:

1. **Schema.org Organization** - Web standards compliance and semantic interoperability
2. **Murmurations Organizations Schema** - Network discovery and regenerative economy focus  
3. **Dylan Tull's Visualization Schema** - Optimized for 3D globe and force-directed graph visualization

## Schema Comparison Matrix

### Core Identity Fields

| Field | Schema.org | Murmurations | Dylan Tull | Unified Schema | Purpose |
|-------|------------|--------------|------------|----------------|---------|
| Organization Name | `schema:name` | `name` (required) | `orgName` | `schema:name` | Primary identifier |
| Legal Name | `schema:legalName` | - | - | `schema:legalName` | Official legal name |
| Nickname | - | `nickname` | - | `murm:nickname` | Informal names |
| Aliases | `schema:alternateName` | - | `aka[]` | `schema:alternateName[]` | Search optimization |
| Legal Type | - | - | `legalType` | `ex:legalType` | Governance analysis |
| Logo | `schema:logo` | `image` | `brandLogo` | `schema:logo` | Visual identification |

### Mission & Purpose

| Field | Schema.org | Murmurations | Dylan Tull | Unified Schema | Purpose |
|-------|------------|--------------|------------|----------------|---------|
| Tagline | `schema:slogan` | - | `tagline` | `schema:slogan` | Quick descriptor |
| Mission | - | `mission` | `missionStmt` | `murm:mission` | Purpose statement |
| Vision | - | - | `visionStmt` | `ex:visionStatement` | Future goals |
| Core Values | - | - | `coreValues[]` | `ex:coreValues[]` | Cultural compatibility |
| Description | `schema:description` | `description` | - | `schema:description` | General description |

### Geographic Information

| Field | Schema.org | Murmurations | Dylan Tull | Unified Schema | Purpose |
|-------|------------|--------------|------------|----------------|---------|
| Address | `schema:address` | `full_address` | - | `schema:address` | Complete address |
| Coordinates | - | `geolocation.lat/lon` | `hqLat`, `hqLon` | `murm:geolocation` | Globe positioning |
| Locality | `schema:addressLocality` | - | `locality` | `schema:addressLocality` | Display name |
| Country Code | - | `country_iso_3166` | - | `murm:country_iso_3166` | Geographic context |
| Geographic Scope | `schema:areaServed` | `geographic_scope` | `regionScope` | `murm:geographic_scope` | Operation scale |

### Categorization & Discovery

| Field | Schema.org | Murmurations | Dylan Tull | Unified Schema | Purpose |
|-------|------------|--------------|------------|----------------|---------|
| Tags | `schema:keywords` | `tags[]` (required) | - | `murm:tags[]` | Search keywords |
| Industry Codes | `schema:naics` | - | `industryCodes[]` | `schema:naics[]` | Sector classification |
| Keywords | `schema:keywords` | - | - | `schema:keywords[]` | General keywords |

### Relationships & Network

| Field | Schema.org | Murmurations | Dylan Tull | Unified Schema | Purpose |
|-------|------------|--------------|------------|----------------|---------|
| Parent Organization | `schema:parentOrganization` | - | `parentOrgId` | `schema:parentOrganization` | Corporate hierarchy |
| Sub Organizations | `schema:subOrganization` | - | `subsidiaryIds[]` | `schema:subOrganization[]` | Corporate structure |
| Formal Relationships | - | `relationships[]` | - | `murm:relationships[]` | Network discovery |
| Member Of | `schema:memberOf` | - | - | `schema:memberOf` | Membership affiliations |
| Partner Organizations | - | - | `partnerOrganizations[]` | `ex:partnerOrgs[]` | Partnership network |
| Collaborators | - | - | `collaborators[]` | `ex:collaborators[]` | Active partnerships |
| Investors | - | - | `investors[]` | `ex:investors[]` | Capital relationships |
| Investees | - | - | `investees[]` | `ex:investees[]` | Investment portfolio |
| Grantors | - | - | `grantors[]` | `ex:grantors[]` | Funding sources |
| Grantees | - | - | `grantees[]` | `ex:grantees[]` | Grant recipients |

### Status & Temporal

| Field | Schema.org | Murmurations | Dylan Tull | Unified Schema | Purpose |
|-------|------------|--------------|------------|----------------|---------|
| Status | - | `status` | - | `murm:status` | Operational status |
| Founding Date | `schema:foundingDate` | - | - | `schema:foundingDate` | Creation date |
| Dissolution Date | `schema:dissolutionDate` | - | - | `schema:dissolutionDate` | End date |
| Starts At | - | `starts_at` (Unix) | - | `murm:starts_at` | Unix timestamp |
| Ends At | - | `ends_at` (Unix) | - | `murm:ends_at` | Unix timestamp |

### Operational Scale

| Field | Schema.org | Murmurations | Dylan Tull | Unified Schema | Purpose |
|-------|------------|--------------|------------|----------------|---------|
| Employee Count | `schema:numberOfEmployees` | - | - | `schema:numberOfEmployees` | Exact count |
| Employee Range | - | - | `employeeRange` | `ex:employeeRange` | Size category |
| Revenue Range | - | - | `revenueRangeUSD` | `ex:revenueRangeUSD` | Financial scale |
| Volunteer Count | - | - | `volunteerCount` | `ex:volunteerCount` | Community engagement |

### Impact & Certifications

| Field | Schema.org | Murmurations | Dylan Tull | Unified Schema | Purpose |
|-------|------------|--------------|------------|----------------|---------|
| Impact KPIs | - | - | `impactKPIs[]` | `ex:impactKPIs[]` | Measurable impact |
| SDG Contribution | - | - | `sdgContribution[]` | `ex:sdgContribution[]` | UN goal alignment |
| Certifications | `schema:hasCertification` | - | - | `schema:hasCertification[]` | Third-party validation |
| B-Corp Score | - | - | `bcorpScore` | `ex:bcorpScore` | B-Corp assessment |
| Nonprofit Status | `schema:nonprofitStatus` | - | - | `schema:nonprofitStatus` | Tax classification |

### Financial Information

| Field | Schema.org | Murmurations | Dylan Tull | Unified Schema | Purpose |
|-------|------------|--------------|------------|----------------|---------|
| Funding Rounds | - | - | `fundingRounds[]` | `ex:fundingRounds[]` | Investment history |
| Funding | `schema:funding` | - | - | `schema:funding` | General funding |
| Funder | `schema:funder` | - | - | `schema:funder` | Funding source |
| Tax ID | `schema:taxID` | - | - | `schema:taxID` | Legal identifier |

### Digital Presence

| Field | Schema.org | Murmurations | Dylan Tull | Unified Schema | Purpose |
|-------|------------|--------------|------------|----------------|---------|
| Primary URL | `schema:url` | `primary_url` (required) | - | `murm:primary_url` | Main website |
| Additional URLs | `schema:sameAs` | `urls[]` | `urls[]` | `murm:urls[]` | Social media, etc. |
| RSS Feed | - | `rss` | - | `murm:rss` | Content syndication |
| Social Media | - | - | `followersX`, `followersLinkedIn` | `ex:socialMedia[]` | Social presence |

### Contact Information

| Field | Schema.org | Murmurations | Dylan Tull | Unified Schema | Purpose |
|-------|------------|--------------|------------|----------------|---------|
| Email | `schema:email` | - | - | `schema:email` | Direct contact |
| Telephone | `schema:telephone` | `telephone` | - | `schema:telephone` | Phone contact |
| Contact Point | `schema:contactPoint` | - | - | `schema:contactPoint` | Structured contact |
| Contact Details | - | `contact_details` | - | `murm:contact_details` | General contact |

### Innovation & Resources

| Field | Schema.org | Murmurations | Dylan Tull | Unified Schema | Purpose |
|-------|------------|--------------|------------|----------------|---------|
| Expertise Areas | `schema:knowsAbout` | - | - | `schema:knowsAbout[]` | Knowledge domains |
| Skills | `schema:skills` | - | - | `schema:skills[]` | Organizational capabilities |
| Open Source Repos | - | - | `openSourceRepos[]` | `ex:openSourceRepos[]` | Innovation sharing |

### Collaboration Features (Unified Innovation)

| Field | Schema.org | Murmurations | Dylan Tull | Unified Schema | Purpose |
|-------|------------|--------------|------------|----------------|---------|
| Current Needs | - | - | `currentNeeds[]` | `ex:currentNeeds[]` | Resource requirements |
| Current Offers | - | - | `currentOffers[]` | `ex:currentOffers[]` | Available resources |
| Seeking | `schema:seeks` | - | `seeking[]` | `ex:seeking[]` | Formal demands |
| Providing | - | - | `providing[]` | `ex:providing[]` | Formal offerings |
| Network Metrics | - | - | `degreeCentrality`, etc. | `ex:networkMetrics{}` | Graph analysis |

## Relationship Modeling Approaches

### Schema.org Approach
- Basic organizational hierarchy (`parentOrganization`, `subOrganization`)
- Simple membership (`memberOf`)
- Limited relationship metadata
- No temporal information or relationship strength

### Murmurations Approach
- Formal relationship discovery via `relationships[]` array
- Subject-predicate-object model for network mapping
- Focus on organizational connections for regenerative economy
- Limited to current, formal relationships

### Dylan Tull's Extended Approach
- Comprehensive relationship types for visualization
- Separate arrays for different relationship categories
- Rich metadata for graph analysis and network metrics
- Support for temporal relationships and strength weighting

### Unified Schema Integration
The unified schema combines all approaches:
- Maintains Schema.org compatibility for basic relationships
- Includes Murmurations discovery mechanism
- Extends with Dylan's comprehensive relationship modeling
- Adds network analysis metrics for visualization

## Synthesis Approach

### 1. Standards Compliance First
Built on Schema.org as the foundation to ensure:
- Web standards compliance and semantic interoperability
- SEO and structured data benefits
- Compatibility with existing organizational databases

### 2. Network Discovery Integration
Incorporated Murmurations' network discovery features:
- Required fields for regenerative economy indexing
- Formal relationship modeling for network effects
- Geographic and temporal standardization

### 3. Visualization Optimization
Added Dylan's visualization-specific enhancements:
- Comprehensive relationship categorization
- Network analysis metrics for graph algorithms
- Impact measurement for regenerative economy mapping

### 4. Collaboration Innovation
Extended all approaches with new features:
- Needs/offers matching for resource discovery
- Enhanced relationship metadata for network analysis
- Structured collaboration support

## Implementation Benefits

### For Web Standards
- Full Schema.org compliance for existing tools
- Rich structured data for search engines
- Interoperability with other organization databases

### For Network Discovery
- Murmurations Index compatibility
- Automated relationship detection and mapping
- Geographic clustering and regional analysis

### For Visualization
- Optimized for Three.js/Deck.gl 3D rendering
- Graph analysis algorithm integration
- Multiple representation modes (globe + force-directed)

### For Regenerative Economy
- Comprehensive organizational categorization
- Impact measurement and SDG alignment tracking
- Resource sharing and collaboration features

## Field Mapping Functions

### From Schema.org to Unified
```javascript
function mapSchemaOrgToUnified(schemaOrg) {
  return {
    '@type': ['schema:Organization', 'ex:RegenerativeOrganization'],
    'schema:name': schemaOrg.name,
    'schema:legalName': schemaOrg.legalName,
    'schema:alternateName': schemaOrg.alternateName,
    'schema:logo': schemaOrg.logo,
    'schema:url': schemaOrg.url,
    'schema:email': schemaOrg.email,
    'schema:address': schemaOrg.address,
    'schema:parentOrganization': schemaOrg.parentOrganization,
    // Add regenerative-specific fields
    'murm:tags': [], // Requires manual categorization
    'ex:impactKPIs': [] // Requires impact assessment
  };
}
```

### From Murmurations to Unified
```javascript
function mapMurmurationsToUnified(murmOrg) {
  return {
    '@type': ['schema:Organization', 'ex:RegenerativeOrganization'],
    'schema:name': murmOrg.name,
    'murm:nickname': murmOrg.nickname,
    'murm:primary_url': murmOrg.primary_url,
    'murm:tags': murmOrg.tags,
    'schema:description': murmOrg.description,
    'murm:mission': murmOrg.mission,
    'murm:geolocation': murmOrg.geolocation,
    'murm:status': murmOrg.status,
    'murm:relationships': murmOrg.relationships,
    'schema:telephone': murmOrg.telephone,
    'murm:urls': murmOrg.urls
  };
}
```

### From Dylan Tull to Unified
```javascript
function mapDylanTullToUnified(dylanOrg) {
  return {
    '@type': ['schema:Organization', 'ex:RegenerativeOrganization'],
    'schema:name': dylanOrg.orgName,
    'schema:alternateName': dylanOrg.aka,
    'ex:legalType': dylanOrg.legalType,
    'schema:logo': dylanOrg.brandLogo,
    'schema:slogan': dylanOrg.tagline,
    'murm:mission': dylanOrg.missionStmt,
    'ex:visionStatement': dylanOrg.visionStmt,
    'ex:coreValues': dylanOrg.coreValues,
    'schema:naics': dylanOrg.industryCodes,
    'murm:geographic_scope': dylanOrg.regionScope,
    'ex:employeeRange': dylanOrg.employeeRange,
    'ex:revenueRangeUSD': dylanOrg.revenueRangeUSD,
    'ex:impactKPIs': dylanOrg.impactKPIs,
    'ex:bcorpScore': dylanOrg.bcorpScore,
    'schema:parentOrganization': dylanOrg.parentOrgId,
    'schema:subOrganization': dylanOrg.subsidiaryIds,
    // Enhanced relationship fields
    'ex:partnerOrgs': dylanOrg.partnerOrganizations,
    'ex:collaborators': dylanOrg.collaborators,
    'ex:investors': dylanOrg.investors,
    'ex:investees': dylanOrg.investees,
    'ex:grantors': dylanOrg.grantors,
    'ex:grantees': dylanOrg.grantees,
    // Needs and offers
    'ex:currentNeeds': dylanOrg.currentNeeds,
    'ex:currentOffers': dylanOrg.currentOffers,
    // Network metrics
    'ex:networkMetrics': {
      'ex:degreeCentrality': dylanOrg.degreeCentrality,
      'ex:betweennessCentrality': dylanOrg.betweennessCentrality,
      'ex:clusterId': dylanOrg.clusterId,
      'ex:bridgingScore': dylanOrg.bridgingScore,
      'ex:influenceScore': dylanOrg.influenceScore
    },
    // Geographic data
    'murm:geolocation': {
      lat: dylanOrg.hqLat,
      lon: dylanOrg.hqLon
    },
    'schema:addressLocality': dylanOrg.locality
  };
}
```

## Validation and Quality

### Required Fields (Minimum Viable Profile)
- `schema:name` - Organization name for identification
- `murm:primary_url` - Primary online presence
- `murm:geolocation` - Location for mapping
- `murm:tags` - At least one categorization tag

### Recommended Fields (Rich Profile)
- Mission and purpose information
- Contact details and additional URLs
- Organizational relationships and partnerships
- Impact metrics and certifications

### Data Quality Indicators
- `ex:confidenceScore` (0-1) based on source authority
- `ex:lastUpdated` timestamp for freshness
- `ex:dataSources[]` for provenance tracking
- Validation against controlled vocabularies

## Future Extensions

### Planned Enhancements
1. **Supply Chain Mapping** - Detailed supplier and customer relationships
2. **Impact Measurement** - Standardized regenerative impact metrics
3. **Financial Transparency** - Enhanced funding and revenue tracking
4. **Innovation Networks** - Patent and intellectual property connections
5. **Event Integration** - Conference and gathering participation

### Technical Roadmap
1. **GraphQL API** - Query interface for applications
2. **Neo4j Integration** - Graph database optimization
3. **Vector Embeddings** - Semantic search capabilities
4. **Real-time Updates** - Live synchronization across platforms
5. **Privacy Controls** - Granular data sharing permissions

This unified approach provides a comprehensive foundation for mapping the regenerative economy ecosystem while maintaining compatibility with existing standards and enabling innovative visualization and collaboration features.