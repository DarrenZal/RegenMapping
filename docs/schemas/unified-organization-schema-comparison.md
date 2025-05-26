# Unified Organization Schema Comparison & Proposal

## Overview

This document provides a comprehensive comparison of three RDF schemas for organizations with a focus on mapping regenerative organizations. It includes:

1. **Schema.org Organization Schema** - Industry standard vocabulary
2. **Murmurations Organizations Schema v1.0.0** - Purpose-built for regenerative economy
3. **Dylan Tull's Organization Schema** - Custom schema for mapping and visualization

## Detailed Schema Analysis

### 1. Schema.org Organization Schema

**Strengths:**
- Industry standard with wide adoption
- Comprehensive property coverage (60+ properties)
- Strong semantic relationships
- Well-documented and maintained

**Key Properties:**
- **Identity**: name, legalName, alternateName, logo
- **Contact**: email, telephone, faxNumber, address, contactPoint
- **Structure**: parentOrganization, subOrganization, department, member
- **Financial**: taxID, vatID, leiCode, duns, globalLocationNumber
- **Certifications**: hasCertification, award, iso6523Code
- **Social**: review, aggregateRating, slogan, brand
- **Governance**: founder, employee, legalRepresentative
- **Publishing**: publishingPrinciples, ethicsPolicy, diversityPolicy

### 2. Murmurations Organizations Schema v1.0.0

**Strengths:**
- Simple and focused on discovery
- Built for regenerative economy organizations
- Network-oriented with relationship mapping
- Includes temporal data

**Complete Field Definitions:**

#### Core Fields:
- **linked_schemas** (required): Array of schema names for validation
- **name** (required): Organization name (max 200 chars)
- **nickname**: Familiar name
- **primary_url**: Definitive website URL

#### Discovery Fields:
- **tags**: Keywords for categorization (array, max 100 items)
  - Used for searchability in Murmurations index
  - Maps to schema:keywords

#### Relationship Fields:
- **relationships**: Array of subject-predicate-object relationships
  ```json
  {
    "predicate_url": "https://schema.org/member",
    "object_url": "https://other-org.com"
  }
  ```

#### Location Fields:
- **geolocation**: Object with lat/lon coordinates
- **full_address**: Complete address as single text field
- **country_iso_3166**: Two-letter country code
- **geographic_scope**: Enum ["local", "regional", "national", "international"]

#### Status & Time:
- **status**: Enum ["active", "completed", "cancelled", "on_hold", "in_planning"]
- **starts_at**: Unix timestamp for creation date
- **ends_at**: Unix timestamp for dissolution date

#### Content Fields:
- **description**: Short description
- **mission**: Mission/purpose statement
- **image**: Logo URL
- **header_image**: Banner image URL
- **images**: Array of additional image URLs
- **rss**: RSS feed URL

#### Contact:
- **contact_details**: Contact information
- **telephone**: Phone number
- **urls**: Array of other website/social media URLs

### 3. Dylan Tull's Organization Schema

**Strengths:**
- Highly organized into thematic clusters
- Rich metadata for visualization
- Comprehensive impact tracking
- Innovation and IP tracking

**Thematic Clusters:**

1. **Identity Cluster**
   - orgName, aka, legalType, brandLogo

2. **Mission, Vision, Values Cluster**
   - tagline, missionStmt, visionStmt, coreValues

3. **Sector & Scope Cluster**
   - industryCodes (NAICS), regionScope

4. **Operational Scale Cluster**
   - employeeRange, revenueRangeUSD, assetsUSD, volunteerCount

5. **Financial Lineage Cluster**
   - fundingRounds, grantsReceived, grantsGiven

6. **Impact Metrics Cluster**
   - impactKPIs, sdgContribution

7. **Certifications Cluster**
   - bcorpScore, iso14k, fairTrade, scienceBasedTargets

8. **Programs & Products Cluster**
   - flagshipProjects

9. **Org Structure Cluster**
   - parentOrgId, subsidiaryIds, daoTokenContract, boardMembers, execTeam

10. **Community Presence Cluster**
    - followersX, followersLinkedIn, newsletterSubs, eventSeries

11. **Repositories & IP Cluster**
    - openSourceRepos, patentIds, datasets

12. **Contact & Channels Cluster**
    - hqLat, hqLon, locality, urls

13. **Meta Cluster**
    - dataSources, lastScraped, confidenceScore

## Unified Schema Proposal

Based on the analysis, here's a unified schema that combines the best of all three approaches:

```json
{
  "@context": {
    "schema": "http://schema.org/",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "ex": "https://cascadia-mapping.org/ontology/",
    "murm": "https://murmurations.network/fields/",
    
    /* Core Identity (combines all three) */
    "name": "schema:name",
    "legalName": "schema:legalName",
    "nickname": "murm:nickname",
    "aka": {"@id": "schema:alternateName", "@container": "@set"},
    "legalType": "ex:legalType",
    "logo": {"@id": "schema:logo", "@type": "@id"},
    
    /* Mission & Purpose (Dylan + Murmurations) */
    "tagline": "schema:slogan",
    "mission": "murm:mission",
    "vision": "ex:visionStatement",
    "coreValues": {"@id": "ex:coreValues", "@container": "@set"},
    "description": "schema:description",
    
    /* Discovery & Categorization (Murmurations + Schema.org) */
    "tags": {"@id": "murm:tags", "@container": "@set"},
    "keywords": {"@id": "schema:keywords", "@container": "@set"},
    "industryCodes": {"@id": "schema:naics", "@container": "@set"},
    
    /* Geographic Information (all three) */
    "geolocation": "murm:geolocation",
    "address": "schema:address",
    "fullAddress": "murm:full_address",
    "countryCode": "murm:country_iso_3166",
    "geographicScope": "murm:geographic_scope",
    "areaServed": "schema:areaServed",
    
    /* Relationships & Network (Murmurations + Schema.org) */
    "relationships": {"@id": "murm:relationships", "@container": "@set"},
    "memberOf": {"@id": "schema:memberOf", "@type": "@id"},
    "parentOrganization": {"@id": "schema:parentOrganization", "@type": "@id"},
    "subOrganization": {"@id": "schema:subOrganization", "@type": "@id", "@container": "@set"},
    
    /* Status & Temporal (Murmurations) */
    "status": "murm:status",
    "foundingDate": "schema:foundingDate",
    "dissolutionDate": "schema:dissolutionDate",
    "startsAt": {"@id": "murm:starts_at", "@type": "xsd:integer"},
    "endsAt": {"@id": "murm:ends_at", "@type": "xsd:integer"},
    
    /* Scale & Operations (Dylan) */
    "employeeRange": "ex:employeeRange",
    "numberOfEmployees": "schema:numberOfEmployees",
    "revenueRange": "ex:revenueRangeUSD",
    "volunteerCount": "ex:volunteerCount",
    
    /* Impact & Certifications (Dylan + Schema.org) */
    "impactKPIs": {"@id": "ex:impactKPIs", "@container": "@set"},
    "sdgContribution": {"@id": "ex:sdgContribution", "@container": "@set"},
    "hasCertification": {"@id": "schema:hasCertification", "@container": "@set"},
    "bcorpScore": "ex:bcorpScore",
    "nonprofitStatus": "schema:nonprofitStatus",
    
    /* Financial (Dylan + Schema.org) */
    "fundingRounds": {"@id": "ex:fundingRounds", "@container": "@set"},
    "funding": "schema:funding",
    "funder": "schema:funder",
    "taxID": "schema:taxID",
    
    /* Digital Presence (all three) */
    "primaryUrl": "murm:primary_url",
    "url": {"@id": "schema:url", "@type": "@id"},
    "urls": {"@id": "murm:urls", "@container": "@set"},
    "rss": "murm:rss",
    "socialMedia": {"@id": "ex:socialMedia", "@container": "@set"},
    
    /* Contact (all three) */
    "email": "schema:email",
    "telephone": "schema:telephone",
    "contactPoint": "schema:contactPoint",
    "contactDetails": "murm:contact_details",
    
    /* Innovation & Knowledge (Dylan + Schema.org) */
    "knowsAbout": {"@id": "schema:knowsAbout", "@container": "@set"},
    "skills": {"@id": "schema:skills", "@container": "@set"},
    "openSourceRepos": {"@id": "ex:openSourceRepos", "@container": "@set"},
    
    /* Metadata (Dylan) */
    "dataSources": {"@id": "ex:dataSources", "@container": "@set"},
    "lastUpdated": {"@id": "ex:lastUpdated", "@type": "xsd:dateTime"},
    "confidenceScore": "ex:confidenceScore"
  },
  
  "@type": ["schema:Organization", "ex:RegenerativeOrganization"],
  
  /* Required fields */
  "name": "Organization Name",
  "primaryUrl": "https://example.org"
}
```

## Implementation Recommendations

### 1. Phased Approach

**Phase 1: Core Fields (MVP)**
- name, legalName, nickname
- primaryUrl, urls
- description, mission
- tags, keywords
- geolocation, address
- status
- Basic relationships

**Phase 2: Enhanced Discovery**
- Geographic scope
- Industry codes
- Impact metrics
- Certifications
- Social media presence

**Phase 3: Advanced Features**
- Financial data
- Innovation tracking
- Detailed relationships
- Time-series data

### 2. Data Migration Strategy

**From Murmurations:**
- Direct mapping for most fields
- Expand relationships to use schema.org predicates
- Convert timestamps to ISO dates where appropriate

**From Schema.org:**
- Map to simplified fields where possible
- Preserve all semantic relationships
- Add regenerative-specific extensions

**From Dylan's Schema:**
- Maintain cluster organization for UI
- Preserve all custom fields
- Add Murmurations discovery fields

### 3. Validation Rules

1. **Required Fields:**
   - name (or orgName)
   - At least one URL (primaryUrl or url)
   - At least one schema declaration

2. **Conditional Requirements:**
   - If nonprofit, require nonprofitStatus
   - If has impact metrics, require at least one KPI
   - If has certifications, require issuing details

3. **Data Quality:**
   - URLs must be valid and accessible
   - Geolocation must be valid coordinates
   - Dates must be properly formatted

### 4. Extension Points

The schema is designed to be extensible:

1. **Custom Predicates**: Add domain-specific relationships
2. **Impact Frameworks**: Support various impact measurement standards
3. **Certification Types**: Add new certification schemas
4. **Regional Extensions**: Add locale-specific fields

## Benefits of Unified Approach

1. **Interoperability**: Works with existing tools and standards
2. **Discoverability**: Optimized for Murmurations network
3. **Visualization**: Rich data for mapping and analytics
4. **Flexibility**: Can start simple and add complexity
5. **Future-proof**: Built on established standards

## Next Steps

1. Review and refine field mappings
2. Create JSON-LD context file
3. Build validation schemas
4. Create transformation scripts
5. Test with sample data
6. Document for developers
