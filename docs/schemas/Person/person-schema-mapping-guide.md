# Person Schema Mapping Guide

This guide provides mapping tables and transformation rules for converting between Schema.org, Murmurations, and Dylan Tull's person schemas.

## Quick Reference Mapping Table

| Unified Schema Field | Schema.org | Murmurations | Dylan's Schema |
|---------------------|------------|--------------|----------------|
| **Core Identity** | | | |
| fullName | name | name | fullName |
| givenName | givenName | - | - |
| familyName | familyName | - | - |
| additionalName | additionalName | - | - |
| nickname | alternateName | nickname | - |
| aka | - | - | aka |
| pronouns | - | - | pronouns |
| honorificPrefix | honorificPrefix | - | - |
| image | image | image | - |
| **Professional** | | | |
| jobTitle | jobTitle | - | primaryRole |
| worksFor | worksFor | - | - |
| affiliations | memberOf | - | affiliations |
| skills | skills | tags | - |
| knowsAbout | knowsAbout | - | - |
| **Location** | | | |
| homeLocation | homeLocation | - | - |
| workLocation | workLocation | - | - |
| hqLatitude | - | geolocation.lat | hqLat |
| hqLongitude | - | geolocation.lon | hqLon |
| locality | addressLocality | locality | locality |
| region | addressRegion | region | - |
| country | addressCountry | country_name | - |
| postalCode | postalCode | postal_code | - |
| address | address | street_address | - |
| **Focus Areas** | | | |
| domainTags | - | - | domainTags |
| methodTags | - | - | methodTags |
| sdgTags | - | - | sdgTags |
| tags | keywords | tags | - |
| **Contact** | | | |
| primaryUrl | url | primary_url | - |
| email | email | contact_details.email | - |
| telephone | telephone | telephone | - |
| urls | sameAs | urls | urls |
| **Relationships** | | | |
| colleague | colleague | - | - |
| collaborators | - | - | - |
| mentors | - | - | - |
| memberOf | memberOf | - | - |
| alumniOf | alumniOf | - | - |
| relationships | - | relationships | - |
| **Metrics** | | | |
| followers | - | - | metrics.followers |
| citations | - | - | metrics.citations |
| hIndex | - | - | metrics.hIndex |
| projects | - | - | metrics.projects |
| **Needs/Offers** | | | |
| currentNeeds | - | - | - |
| currentOffers | - | - | - |
| seeks | seeks | - | - |
| makesOffer | makesOffer | - | - |
| **Meta** | | | |
| lastVerified | - | - | lastVerified |
| dataSource | - | - | - |
| confidenceScore | - | - | - |
| languagesSpoken | knowsLanguage | knows_language | - |

## Transformation Rules

### From Murmurations to Unified Schema

```javascript
function murmurationsPersonToUnified(murmData) {
  return {
    "@context": "https://regenmap.org/unified-person-schema.jsonld",
    "@type": ["schema:Person", "regen:RegenerativePerson"],
    
    // Direct mappings
    "schema:name": murmData.name,
    "regen:nickname": murmData.nickname,
    "schema:url": murmData.primary_url,
    "schema:keywords": murmData.tags,
    "schema:description": murmData.description,
    "schema:image": murmData.image,
    "schema:telephone": murmData.telephone,
    "schema:addressLocality": murmData.locality,
    "schema:addressRegion": murmData.region,
    "schema:postalCode": murmData.postal_code,
    "schema:addressCountry": murmData.country_name,
    "schema:knowsLanguage": murmData.knows_language,
    
    // Geolocation conversion
    "geo:lat": murmData.geolocation?.lat,
    "geo:long": murmData.geolocation?.lon,
    
    // URL handling
    "regen:additionalUrls": murmData.urls?.map(urlObj => ({
      "schema:url": urlObj.url,
      "regen:platform": urlObj.name,
      "regen:handle": urlObj.name
    })),
    
    // Contact details conversion
    "schema:email": murmData.contact_details?.email,
    "regen:contactForm": murmData.contact_details?.contact_form,
    
    // Relationship conversion
    "murm:relationships": murmData.relationships?.map(rel => ({
      "murm:predicate_url": rel.predicate_url,
      "murm:object_url": rel.object_url
    })),
    
    // Address composition
    "regen:streetAddress": murmData.street_address,
    
    // Additional images
    "regen:additionalImages": murmData.images?.map(img => ({
      "schema:url": img.url,
      "schema:name": img.name
    })),
    
    // Metadata
    "regen:lastVerified": new Date().toISOString(),
    "regen:dataSource": ["Murmurations Network"],
    "regen:confidenceScore": 0.8
  };
}
```

### From Schema.org to Unified Schema

```javascript
function schemaOrgPersonToUnified(schemaData) {
  return {
    "@context": "https://regenmap.org/unified-person-schema.jsonld",
    "@type": ["schema:Person", "regen:RegenerativePerson"],
    
    // Direct mappings
    "schema:name": schemaData.name,
    "schema:givenName": schemaData.givenName,
    "schema:familyName": schemaData.familyName,
    "schema:additionalName": schemaData.additionalName,
    "schema:alternateName": schemaData.alternateName,
    "schema:honorificPrefix": schemaData.honorificPrefix,
    "schema:jobTitle": schemaData.jobTitle,
    "schema:worksFor": schemaData.worksFor,
    "schema:memberOf": schemaData.memberOf,
    "schema:email": schemaData.email,
    "schema:telephone": schemaData.telephone,
    "schema:address": schemaData.address,
    "schema:homeLocation": schemaData.homeLocation,
    "schema:workLocation": schemaData.workLocation,
    "schema:url": schemaData.url,
    "schema:image": schemaData.image,
    "schema:birthDate": schemaData.birthDate,
    "schema:deathDate": schemaData.deathDate,
    "schema:gender": schemaData.gender,
    "schema:nationality": schemaData.nationality,
    "schema:alumniOf": schemaData.alumniOf,
    "schema:colleague": schemaData.colleague,
    "schema:knows": schemaData.knows,
    "schema:spouse": schemaData.spouse,
    "schema:children": schemaData.children,
    "schema:parent": schemaData.parent,
    "schema:sibling": schemaData.sibling,
    "schema:award": schemaData.award,
    "schema:hasOccupation": schemaData.hasOccupation,
    "schema:knowsAbout": schemaData.knowsAbout,
    "schema:knowsLanguage": schemaData.knowsLanguage,
    "schema:skills": schemaData.skills,
    "schema:seeks": schemaData.seeks,
    "schema:makesOffer": schemaData.makesOffer,
    
    // Array handling
    "schema:sameAs": Array.isArray(schemaData.sameAs) ? 
      schemaData.sameAs : [schemaData.sameAs].filter(Boolean),
    
    // Derived fields for regenerative mapping
    "regen:primaryUrl": schemaData.url,
    "regen:lastVerified": new Date().toISOString(),
    "regen:dataSource": ["Schema.org"],
    "regen:confidenceScore": 0.9
  };
}
```

### From Dylan's Schema to Unified Schema

```javascript
function dylansPersonToUnified(dylansData) {
  return {
    "@context": "https://regenmap.org/unified-person-schema.jsonld",
    "@type": ["schema:Person", "regen:RegenerativePerson"],
    
    // Identity mappings
    "schema:name": dylansData.fullName,
    "regen:alsoKnownAs": dylansData.aka,
    "regen:pronouns": dylansData.pronouns,
    
    // Professional mappings
    "schema:jobTitle": dylansData.primaryRole,
    "regen:affiliations": dylansData.affiliations?.map(aff => ({
      "schema:memberOf": { "@id": aff.orgId },
      "schema:roleName": aff.role,
      "schema:startDate": aff.start,
      "schema:endDate": aff.end
    })),
    
    // Location mappings
    "geo:lat": dylansData.hqLat,
    "geo:long": dylansData.hqLon,
    "regen:locality": dylansData.locality,
    
    // Regenerative focus mappings
    "regen:domainTags": dylansData.domainTags,
    "regen:methodTags": dylansData.methodTags,
    "regen:sdgAlignment": dylansData.sdgTags,
    
    // Outputs and influence
    "regen:keyWorks": dylansData.keyWorks?.map(work => ({
      "schema:name": work.title,
      "schema:datePublished": work.year,
      "schema:url": work.uri,
      "schema:additionalType": work.type
    })),
    
    // Metrics conversion
    "regen:influenceMetrics": {
      "@type": "schema:PropertyValue",
      "regen:socialMediaFollowers": dylansData.metrics?.followers,
      "regen:citationCount": dylansData.metrics?.citations,
      "regen:hIndex": dylansData.metrics?.hIndex,
      "regen:projectCount": dylansData.metrics?.projects
    },
    
    // Contact and media
    "schema:url": dylansData.urls?.[0],
    "regen:additionalUrls": dylansData.urls?.map(url => ({
      "schema:url": url,
      "regen:platform": "Unknown"
    })),
    
    // Meta information
    "regen:lastVerified": dylansData.lastVerified,
    "regen:dataSource": ["Dylan Tull Schema"],
    "regen:confidenceScore": 0.95
  };
}
```

## Bidirectional Transformations

### From Unified Schema to Source Schemas

#### To Murmurations Format
```javascript
function unifiedToMurmurations(unifiedData) {
  return {
    linked_schemas: ["people_schema-v0.1.0"],
    name: unifiedData["schema:name"],
    nickname: unifiedData["regen:nickname"],
    primary_url: unifiedData["schema:url"],
    tags: unifiedData["schema:keywords"] || [],
    description: unifiedData["schema:description"],
    image: unifiedData["schema:image"],
    telephone: unifiedData["schema:telephone"],
    
    // Contact details object
    contact_details: {
      email: unifiedData["schema:email"],
      contact_form: unifiedData["regen:contactForm"]
    },
    
    // Address fields
    street_address: unifiedData["regen:streetAddress"],
    locality: unifiedData["schema:addressLocality"],
    region: unifiedData["schema:addressRegion"],
    postal_code: unifiedData["schema:postalCode"],
    country_name: unifiedData["schema:addressCountry"],
    
    // Geolocation object
    geolocation: {
      lat: unifiedData["geo:lat"],
      lon: unifiedData["geo:long"]
    },
    
    // Languages array
    knows_language: unifiedData["schema:knowsLanguage"],
    
    // URLs array
    urls: unifiedData["regen:additionalUrls"]?.map(urlObj => ({
      name: urlObj["regen:platform"],
      url: urlObj["schema:url"]
    })),
    
    // Relationships array
    relationships: unifiedData["murm:relationships"]?.map(rel => ({
      predicate_url: rel["murm:predicate_url"],
      object_url: rel["murm:object_url"]
    }))
  };
}
```

#### To Schema.org Format
```javascript
function unifiedToSchemaOrg(unifiedData) {
  return {
    "@context": "https://schema.org/",
    "@type": "Person",
    
    // Direct mappings
    name: unifiedData["schema:name"],
    givenName: unifiedData["schema:givenName"],
    familyName: unifiedData["schema:familyName"],
    additionalName: unifiedData["schema:additionalName"],
    alternateName: unifiedData["schema:alternateName"],
    honorificPrefix: unifiedData["schema:honorificPrefix"],
    jobTitle: unifiedData["schema:jobTitle"],
    worksFor: unifiedData["schema:worksFor"],
    memberOf: unifiedData["schema:memberOf"],
    email: unifiedData["schema:email"],
    telephone: unifiedData["schema:telephone"],
    address: unifiedData["schema:address"],
    homeLocation: unifiedData["schema:homeLocation"],
    workLocation: unifiedData["schema:workLocation"],
    url: unifiedData["schema:url"],
    image: unifiedData["schema:image"],
    colleague: unifiedData["schema:colleague"],
    knows: unifiedData["schema:knows"],
    alumniOf: unifiedData["schema:alumniOf"],
    knowsAbout: unifiedData["schema:knowsAbout"],
    knowsLanguage: unifiedData["schema:knowsLanguage"],
    skills: unifiedData["schema:skills"],
    seeks: unifiedData["schema:seeks"],
    makesOffer: unifiedData["schema:makesOffer"],
    
    // Array fields
    sameAs: unifiedData["regen:additionalUrls"]?.map(urlObj => urlObj["schema:url"])
  };
}
```

## Validation Considerations

### Required Fields by Schema

**Murmurations Required:**
- linked_schemas
- name
- primary_url
- tags

**Schema.org Recommended:**
- name
- url or sameAs
- jobTitle or description

**Dylan's Schema Core:**
- fullName
- At least one location identifier (hqLat/hqLon or locality)

**Unified Schema Required:**
- schema:name
- schema:url
- geo:lat and geo:long (for mapping)

### Data Type Conversions

1. **Geolocation**
   - Murmurations: `{lat: number, lon: number}`
   - Dylan's: separate `hqLat`, `hqLon` fields
   - Schema.org: `GeoCoordinates` object
   - Unified: uses geo vocabulary with decimal values

2. **Relationships**
   - Murmurations: array of `{predicate_url, object_url}`
   - Schema.org: direct properties (`colleague`, `memberOf`, etc.)
   - Dylan's: specific relationship arrays
   - Unified: combines all approaches with proper typing

3. **Skills and Tags**
   - Murmurations: `tags` array (general purpose)
   - Schema.org: `skills` (structured) and `keywords` (general)
   - Dylan's: categorized tags (`domainTags`, `methodTags`)
   - Unified: preserves all categorizations

4. **Contact Information**
   - Murmurations: `contact_details` object
   - Schema.org: direct properties
   - Dylan's: minimal contact fields
   - Unified: comprehensive contact modeling

## Regenerative-Specific Enhancements

### Domain Categorization
```javascript
const REGENERATIVE_DOMAINS = [
  "Regenerative Agriculture", "Biodiversity", "Water Cycles", 
  "Circular Materials", "Post-capitalist Finance", 
  "Distributed Governance", "Systems Literacy", 
  "Inner Development", "Culture & Story", "Crisis Response", 
  "Tech4Good", "Planetary Health", "Indigenous Stewardship"
];

function categorizePerson(personData) {
  const domains = [];
  const tags = personData["schema:keywords"] || [];
  
  // Auto-categorize based on tags
  tags.forEach(tag => {
    if (tag.includes("agriculture") || tag.includes("farming")) {
      domains.push("Regenerative Agriculture");
    }
    if (tag.includes("biodiversity") || tag.includes("ecosystem")) {
      domains.push("Biodiversity");
    }
    // ... more categorization logic
  });
  
  return {
    ...personData,
    "regen:domainTags": [...new Set(domains)]
  };
}
```

### Network Analysis Integration
```javascript
function calculateNetworkMetrics(personData, networkGraph) {
  const personId = personData["@id"];
  
  return {
    ...personData,
    "regen:networkMetrics": {
      "regen:degreeCentrality": networkGraph.degree(personId),
      "regen:betweennessCentrality": networkGraph.betweenness(personId),
      "regen:clusterId": networkGraph.getCluster(personId),
      "regen:bridgingScore": networkGraph.bridgingScore(personId)
    }
  };
}
```

## Best Practices

1. **Preserve Source Context**
   - Always include `regen:dataSource` array
   - Maintain confidence scores for data quality
   - Include timestamps for freshness tracking

2. **Handle Missing Data Gracefully**
   - Use null for missing optional fields
   - Provide sensible defaults (e.g., empty arrays)
   - Document assumptions in metadata

3. **Relationship Consistency**
   - Ensure all person and organization IDs are resolvable
   - Validate relationship types against schema definitions
   - Maintain bidirectional relationships where appropriate

4. **Geographic Data Quality**
   - Validate latitude/longitude ranges
   - Provide fallback to locality if coordinates missing
   - Support multiple location types (home, work, etc.)

5. **Privacy Considerations**
   - Respect data privacy preferences
   - Hash sensitive information where appropriate
   - Provide opt-out mechanisms for public data

## Example Transformations

### Input (Murmurations Person):
```json
{
  "linked_schemas": ["people_schema-v0.1.0"],
  "name": "Dr. Karen O'Brien",
  "nickname": "Karen",
  "primary_url": "https://karenmobrien.com",
  "tags": ["climate", "adaptation", "transformation"],
  "geolocation": {"lat": 59.91, "lon": 10.75},
  "locality": "Oslo",
  "country_name": "Norway"
}
```

### Output (Unified Schema):
```json
{
  "@context": "https://regenmap.org/unified-person-schema.jsonld",
  "@type": ["schema:Person", "regen:RegenerativePerson"],
  "schema:name": "Dr. Karen O'Brien",
  "regen:nickname": "Karen",
  "schema:url": "https://karenmobrien.com",
  "schema:keywords": ["climate", "adaptation", "transformation"],
  "geo:lat": 59.91,
  "geo:long": 10.75,
  "schema:addressLocality": "Oslo",
  "schema:addressCountry": "Norway",
  "regen:domainTags": ["Climate Adaptation"],
  "regen:lastVerified": "2025-05-26T12:00:00Z",
  "regen:dataSource": ["Murmurations Network"],
  "regen:confidenceScore": 0.8
}
```