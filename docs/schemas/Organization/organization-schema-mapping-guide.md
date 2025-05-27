# Schema Mapping Guide

This guide provides mapping tables and transformation rules for converting between Schema.org, Murmurations, and Dylan Tull's organization schemas.

## Quick Reference Mapping Table

| Unified Schema Field | Schema.org | Murmurations | Dylan's Schema |
|---------------------|------------|--------------|----------------|
| name | name | name | orgName |
| legalName | legalName | - | - |
| nickname | - | nickname | - |
| aka | alternateName | - | aka |
| legalType | - | - | legalType |
| logo | logo | image | brandLogo |
| tagline | slogan | - | tagline |
| mission | - | mission | missionStmt |
| vision | - | - | visionStmt |
| coreValues | - | - | coreValues |
| description | description | description | - |
| tags | - | tags | - |
| keywords | keywords | - | - |
| industryCodes | naics | - | industryCodes |
| geolocation | - | geolocation | {hqLat, hqLon} |
| address | address | - | - |
| fullAddress | - | full_address | - |
| countryCode | - | country_iso_3166 | - |
| geographicScope | - | geographic_scope | regionScope |
| areaServed | areaServed | - | - |
| relationships | - | relationships | - |
| memberOf | memberOf | - | - |
| parentOrganization | parentOrganization | - | parentOrgId |
| subOrganization | subOrganization | - | subsidiaryIds |
| status | - | status | - |
| foundingDate | foundingDate | - | - |
| dissolutionDate | dissolutionDate | - | - |
| startsAt | - | starts_at | - |
| endsAt | - | ends_at | - |
| employeeRange | - | - | employeeRange |
| numberOfEmployees | numberOfEmployees | - | - |
| revenueRange | - | - | revenueRangeUSD |
| volunteerCount | - | - | volunteerCount |
| impactKPIs | - | - | impactKPIs |
| sdgContribution | - | - | sdgContribution |
| hasCertification | hasCertification | - | - |
| bcorpScore | - | - | bcorpScore |
| nonprofitStatus | nonprofitStatus | - | - |
| fundingRounds | - | - | fundingRounds |
| funding | funding | - | - |
| funder | funder | - | - |
| taxID | taxID | - | - |
| primaryUrl | - | primary_url | - |
| url | url | - | urls[0] |
| urls | - | urls | urls |
| rss | - | rss | - |
| socialMedia | - | - | {followersX, followersLinkedIn} |
| email | email | - | - |
| telephone | telephone | telephone | - |
| contactPoint | contactPoint | - | - |
| contactDetails | - | contact_details | - |
| knowsAbout | knowsAbout | - | - |
| skills | skills | - | - |
| openSourceRepos | - | - | openSourceRepos |
| partnerOrganizations | - | - | partnerOrganizations |
| collaborators | - | - | collaborators |
| investors | - | - | investors |
| investees | - | - | investees |
| grantors | - | - | grantors |
| grantees | - | - | grantees |
| suppliers | - | - | suppliers |
| customers | - | - | customers |
| competitorOrgs | - | - | competitorOrgs |
| alliedOrgs | - | - | alliedOrgs |
| currentNeeds | - | - | currentNeeds |
| currentOffers | - | - | currentOffers |
| seeking | - | - | seeking |
| providing | - | - | providing |
| degreeCentrality | - | - | degreeCentrality |
| betweennessCentrality | - | - | betweennessCentrality |
| clusterId | - | - | clusterId |
| bridgingScore | - | - | bridgingScore |
| influenceScore | - | - | influenceScore |
| dataSources | - | - | dataSources |
| lastUpdated | - | - | lastScraped |
| confidenceScore | - | - | confidenceScore |

## Transformation Rules

### From Murmurations to Unified Schema

```javascript
function murmurationsToUnified(murmData) {
  return {
    "@context": "https://regenmap.org/unified-organization-schema.jsonld",
    "@type": ["schema:Organization", "ex:RegenerativeOrganization"],
    
    // Direct mappings
    name: murmData.name,
    nickname: murmData.nickname,
    primaryUrl: murmData.primary_url,
    tags: murmData.tags,
    urls: murmData.urls,
    description: murmData.description,
    mission: murmData.mission,
    status: murmData.status,
    fullAddress: murmData.full_address,
    countryCode: murmData.country_iso_3166,
    geolocation: murmData.geolocation,
    logo: murmData.image,
    rss: murmData.rss,
    relationships: murmData.relationships,
    telephone: murmData.telephone,
    contactDetails: murmData.contact_details,
    geographicScope: murmData.geographic_scope,
    
    // Timestamp conversions
    startsAt: murmData.starts_at,
    endsAt: murmData.ends_at,
    foundingDate: murmData.starts_at ? 
      new Date(murmData.starts_at * 1000).toISOString().split('T')[0] : null,
    dissolutionDate: murmData.ends_at ? 
      new Date(murmData.ends_at * 1000).toISOString().split('T')[0] : null,
    
    // Additional mappings
    url: murmData.primary_url,
    lastUpdated: new Date().toISOString()
  };
}
```

### From Schema.org to Unified Schema

```javascript
function schemaOrgToUnified(schemaData) {
  return {
    "@context": "https://regenmap.org/unified-organization-schema.jsonld",
    "@type": ["schema:Organization", "ex:RegenerativeOrganization"],
    
    // Direct mappings
    name: schemaData.name,
    legalName: schemaData.legalName,
    aka: Array.isArray(schemaData.alternateName) ? 
      schemaData.alternateName : [schemaData.alternateName].filter(Boolean),
    logo: schemaData.logo,
    tagline: schemaData.slogan,
    description: schemaData.description,
    keywords: schemaData.keywords,
    industryCodes: schemaData.naics,
    address: schemaData.address,
    areaServed: schemaData.areaServed,
    memberOf: schemaData.memberOf,
    parentOrganization: schemaData.parentOrganization,
    subOrganization: schemaData.subOrganization,
    foundingDate: schemaData.foundingDate,
    dissolutionDate: schemaData.dissolutionDate,
    numberOfEmployees: schemaData.numberOfEmployees,
    hasCertification: schemaData.hasCertification,
    nonprofitStatus: schemaData.nonprofitStatus,
    funding: schemaData.funding,
    funder: schemaData.funder,
    taxID: schemaData.taxID,
    url: schemaData.url,
    email: schemaData.email,
    telephone: schemaData.telephone,
    contactPoint: schemaData.contactPoint,
    knowsAbout: schemaData.knowsAbout,
    skills: schemaData.skills,
    
    // Derived fields
    primaryUrl: schemaData.url,
    lastUpdated: new Date().toISOString()
  };
}
```

### From Dylan's Schema to Unified Schema

```javascript
function dylansToUnified(dylansData) {
  return {
    "@context": "https://regenmap.org/unified-organization-schema.jsonld",
    "@type": ["schema:Organization", "ex:RegenerativeOrganization"],
    
    // Direct mappings
    name: dylansData.orgName,
    aka: dylansData.aka,
    legalType: dylansData.legalType,
    logo: dylansData.brandLogo,
    tagline: dylansData.tagline,
    mission: dylansData.missionStmt,
    vision: dylansData.visionStmt,
    coreValues: dylansData.coreValues,
    industryCodes: dylansData.industryCodes,
    geographicScope: dylansData.regionScope,
    employeeRange: dylansData.employeeRange,
    revenueRange: dylansData.revenueRangeUSD,
    volunteerCount: dylansData.volunteerCount,
    impactKPIs: dylansData.impactKPIs,
    sdgContribution: dylansData.sdgContribution,
    bcorpScore: dylansData.bcorpScore,
    fundingRounds: dylansData.fundingRounds,
    parentOrganization: dylansData.parentOrgId,
    subOrganization: dylansData.subsidiaryIds,
    openSourceRepos: dylansData.openSourceRepos,
    dataSources: dylansData.dataSources,
    lastUpdated: dylansData.lastScraped,
    confidenceScore: dylansData.confidenceScore,
    
    // Relationship and network fields
    partnerOrganizations: dylansData.partnerOrganizations,
    collaborators: dylansData.collaborators,
    investors: dylansData.investors,
    investees: dylansData.investees,
    grantors: dylansData.grantors,
    grantees: dylansData.grantees,
    suppliers: dylansData.suppliers,
    customers: dylansData.customers,
    competitorOrgs: dylansData.competitorOrgs,
    alliedOrgs: dylansData.alliedOrgs,
    
    // Needs and offers
    currentNeeds: dylansData.currentNeeds,
    currentOffers: dylansData.currentOffers,
    seeking: dylansData.seeking,
    providing: dylansData.providing,
    
    // Network metrics
    degreeCentrality: dylansData.degreeCentrality,
    betweennessCentrality: dylansData.betweennessCentrality,
    clusterId: dylansData.clusterId,
    bridgingScore: dylansData.bridgingScore,
    influenceScore: dylansData.influenceScore,
    
    // Geolocation conversion
    geolocation: {
      lat: dylansData.hqLat,
      lon: dylansData.hqLon
    },
    
    // URL handling
    primaryUrl: dylansData.urls?.[0],
    urls: dylansData.urls,
    url: dylansData.urls?.[0],
    
    // Social media conversion
    socialMedia: [
      dylansData.followersX && {
        "@type": "ex:SocialMediaAccount",
        platform: "Twitter",
        followers: dylansData.followersX
      },
      dylansData.followersLinkedIn && {
        "@type": "ex:SocialMediaAccount",
        platform: "LinkedIn",
        followers: dylansData.followersLinkedIn
      }
    ].filter(Boolean)
  };
}
```

## Validation Considerations

### Required Fields by Schema

**Murmurations Required:**
- linked_schemas
- name

**Schema.org Recommended:**
- name
- url or sameAs
- description

**Dylan's Schema Core:**
- orgName
- At least one identifier

**Unified Schema Required:**
- name
- primaryUrl or url

### Data Type Conversions

1. **Timestamps**
   - Murmurations uses Unix timestamps (seconds since epoch)
   - Schema.org uses ISO 8601 dates
   - Convert: `new Date(unixTimestamp * 1000).toISOString()`

2. **Geographic Scope**
   - Murmurations: enum ["local", "regional", "national", "international"]
   - Dylan's: regionScope (similar enum)
   - Schema.org: uses areaServed with Place objects

3. **Relationships**
   - Murmurations: array of {predicate_url, object_url}
   - Schema.org: direct properties (memberOf, parentOrganization, etc.)
   - Dylan's: specific ID references

4. **Social Media**
   - Murmurations: part of urls array
   - Schema.org: sameAs property
   - Dylan's: specific follower counts per platform

## Alternative Approaches

### Cambria Project
For more complex schema transformation needs, consider the [Cambria project](https://github.com/inkandswitch/cambria-project) - a JavaScript/TypeScript library for converting JSON data between related schemas using bidirectional "lenses."

**When Cambria might be useful:**
- **Bidirectional transformations**: Need to edit data in the unified format and sync changes back to source schemas
- **Schema evolution**: Managing multiple versions of schemas with backwards compatibility requirements
- **Complex transformation pipelines**: Composing multiple transformation steps
- **API versioning**: Maintaining compatibility across different API versions
- **Database migrations**: Evolving data structures over time

**Current limitations:**
- Still experimental software (not production-ready as of 2024)
- Requires learning lens theory and YAML/JSON lens definitions
- More complex than direct transformation functions for simple use cases

For our current regenerative organization mapping needs, the direct transformation approach documented here is more appropriate, but Cambria could be valuable for future evolution of the unified schema.

## Best Practices

1. **Preserve Original Data**
   - Keep source schema reference in metadata
   - Store original field names in custom properties if needed

2. **Handle Missing Data**
   - Use null for missing optional fields
   - Provide sensible defaults where appropriate
   - Document assumptions in dataSources

3. **Maintain Relationships**
   - Ensure all URLs are absolute
   - Validate relationship targets exist
   - Use consistent identifiers across schemas

4. **Version Control**
   - Track schema version in profiles
   - Include transformation date
   - Document any manual corrections

## Example Transformation

### Input (Murmurations):
```json
{
  "linked_schemas": ["organizations_schema-v1.0.0"],
  "name": "Example Org",
  "primary_url": "https://example.org",
  "tags": ["regenerative", "cooperative"],
  "geolocation": {"lat": 45.5, "lon": -122.6},
  "status": "active"
}
```

### Output (Unified):
```json
{
  "@context": "https://cascadia-mapping.org/unified-organization-schema.jsonld",
  "@type": ["schema:Organization", "ex:RegenerativeOrganization"],
  "name": "Example Org",
  "primaryUrl": "https://example.org",
  "url": "https://example.org",
  "tags": ["regenerative", "cooperative"],
  "geolocation": {"lat": 45.5, "lon": -122.6},
  "status": "active",
  "lastUpdated": "2024-12-15T10:30:00Z"
}
