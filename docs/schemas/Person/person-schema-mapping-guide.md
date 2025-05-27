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
| colleague | colleague | - | colleagues |
| collaborators | - | - | collaborators |
| mentors | - | - | mentors |
| mentees | - | - | mentees |
| memberOf | memberOf | - | - |
| alumniOf | alumniOf | - | - |
| relationships | - | relationships | - |
| eventParticipation | - | - | eventParticipation |
| boardPositions | - | - | boardPositions |
| coauthorships | - | - | coauthorships |
| **Metrics** | | | |
| followers | - | - | metrics.followers |
| citations | - | - | metrics.citations |
| hIndex | - | - | metrics.hIndex |
| projects | - | - | metrics.projects |
| **Needs/Offers** | | | |
| currentNeeds | - | - | needs |
| currentOffers | - | - | offers |
| seeks | seeks | - | - |
| makesOffer | makesOffer | - | - |
| **Meta** | | | |
| lastVerified | - | - | lastVerified |
| dataSource | - | - | - |
| confidenceScore | - | - | - |
| languagesSpoken | knowsLanguage | knows_language | - |
| **Network Metrics** | | | |
| degreeCentrality | - | - | degreeCentrality |
| betweennessCentrality | - | - | betweennessCentrality |
| clusterId | - | - | clusterId |
| bridgingScore | - | - | bridgingScore |

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
    
    // Relationships and network
    "regen:mentors": dylansData.mentors,
    "regen:mentees": dylansData.mentees,
    "regen:collaborators": dylansData.collaborators,
    "schema:colleague": dylansData.colleagues,
    "regen:eventParticipation": dylansData.eventParticipation,
    "regen:boardPositions": dylansData.boardPositions,
    "regen:coauthorships": dylansData.coauthorships,
    
    // Needs and offers
    "regen:currentNeeds": dylansData.needs,
    "regen:currentOffers": dylansData.offers,
    
    // Network metrics
    "regen:degreeCentrality": dylansData.degreeCentrality,
    "regen:betweennessCentrality": dylansData.betweennessCentrality,
    "regen:clusterId": dylansData.clusterId,
    "regen:bridgingScore": dylansData.bridgingScore,
    
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

## Edge Type Transformations

A critical aspect of the unified schema is its sophisticated edge type system for modeling relationships. Here's how to transform relationship data between schema formats.

### Edge Type Mapping Overview

| Unified Edge Type | Schema.org Equivalent | Murmurations | Dylan's Schema | Transformation Notes |
|------------------|----------------------|--------------|----------------|---------------------|
| `regen:Collaboration` | `schema:colleague` | - | ✓ Full support | Rich metadata for projects |
| `regen:EmploymentAffiliation` | `schema:worksFor` | Limited via `relationships` | ✓ Full support | Temporal and role data |
| `regen:MentorAdvisor` | - | - | ✓ Full support | Unidirectional knowledge transfer |
| `regen:PublicationCoauthorship` | `schema:colleague` | - | ✓ Full support | Publication-specific metadata |
| `regen:EventParticipation` | - | - | ✓ Full support | Event and role details |
| `regen:SharedBoardSeat` | `schema:memberOf` | Limited via `relationships` | ✓ Full support | Governance connections |

### Extracting Edge Types from Dylan's Schema

```javascript
function extractEdgeTypesFromDylans(dylansData) {
  const relationships = {
    collaborations: [],
    employmentAffiliations: [],
    mentorships: [],
    coauthorships: [],
    eventParticipations: [],
    boardPositions: []
  };

  // Extract collaboration edges
  if (dylansData.collaborations) {
    relationships.collaborations = dylansData.collaborations.map(collab => ({
      "@type": "regen:Collaboration",
      "regen:targetEntity": { "@id": collab.partnerId },
      "regen:projectName": collab.projectName,
      "schema:startDate": collab.since,
      "schema:endDate": collab.until,
      "regen:weight": collab.weight,
      "regen:fundingUSD": collab.fundingUSD
    }));
  }

  // Extract employment affiliations
  if (dylansData.affiliations) {
    relationships.employmentAffiliations = dylansData.affiliations.map(aff => ({
      "@type": "regen:EmploymentAffiliation",
      "regen:targetOrganization": { "@id": aff.orgId },
      "schema:roleName": aff.role,
      "schema:startDate": aff.start,
      "schema:endDate": aff.end,
      "regen:ftePercentage": aff.fte || 100
    }));
  }

  // Extract event participation
  if (dylansData.eventParticipation) {
    relationships.eventParticipations = dylansData.eventParticipation.map(event => ({
      "@type": "regen:EventParticipation",
      "regen:targetOrganization": { "@id": event.organizerId },
      "regen:eventId": event.eventId,
      "regen:participationRole": event.role,
      "schema:startDate": event.date
    }));
  }

  // Extract board positions
  if (dylansData.boardPositions) {
    relationships.boardPositions = dylansData.boardPositions.map(board => ({
      "@type": "regen:SharedBoardSeat",
      "regen:targetOrganization": { "@id": board.orgId },
      "regen:boardRole": board.position,
      "schema:startDate": board.since,
      "schema:endDate": board.until
    }));
  }

  // Extract publication coauthorships
  if (dylansData.coauthorships) {
    relationships.coauthorships = dylansData.coauthorships.map(coauth => ({
      "@type": "regen:PublicationCoauthorship",
      "regen:targetPerson": { "@id": coauth.coauthorId },
      "regen:workId": coauth.workId,
      "regen:citationCount": coauth.citations
    }));
  }

  return relationships;
}
```

### Converting Schema.org to Edge Types

```javascript
function schemaOrgToEdgeTypes(schemaData) {
  const relationships = {
    collaborations: [],
    employmentAffiliations: [],
    boardPositions: []
  };

  // Convert colleague relationships to collaborations
  if (schemaData.colleague) {
    const colleagues = Array.isArray(schemaData.colleague) ? 
      schemaData.colleague : [schemaData.colleague];
    
    relationships.collaborations = colleagues.map(colleague => ({
      "@type": "regen:Collaboration",
      "regen:targetEntity": { "@id": colleague["@id"] || colleague },
      "regen:weight": 1, // Default weight
      "schema:startDate": null, // Unknown timing
      "regen:inferredFrom": "schema:colleague"
    }));
  }

  // Convert worksFor to employment affiliation
  if (schemaData.worksFor) {
    const orgs = Array.isArray(schemaData.worksFor) ? 
      schemaData.worksFor : [schemaData.worksFor];
    
    relationships.employmentAffiliations = orgs.map(org => ({
      "@type": "regen:EmploymentAffiliation",
      "regen:targetOrganization": { "@id": org["@id"] || org },
      "schema:roleName": schemaData.jobTitle || "Employee",
      "regen:isCurrentRole": true,
      "regen:inferredFrom": "schema:worksFor"
    }));
  }

  // Convert memberOf to board positions (if governance-related)
  if (schemaData.memberOf) {
    const memberships = Array.isArray(schemaData.memberOf) ? 
      schemaData.memberOf : [schemaData.memberOf];
    
    relationships.boardPositions = memberships
      .filter(org => org.additionalType?.includes("governance"))
      .map(org => ({
        "@type": "regen:SharedBoardSeat",
        "regen:targetOrganization": { "@id": org["@id"] || org },
        "regen:boardRole": "Member",
        "regen:inferredFrom": "schema:memberOf"
      }));
  }

  return relationships;
}
```

### Converting Murmurations to Edge Types

```javascript
function murmurationsToEdgeTypes(murmData) {
  const relationships = {
    employmentAffiliations: [],
    boardPositions: []
  };

  if (murmData.relationships) {
    murmData.relationships.forEach(rel => {
      // Parse relationship type from predicate URL
      const relType = extractRelationshipType(rel.predicate_url);
      
      switch (relType) {
        case 'member':
        case 'employee':
          relationships.employmentAffiliations.push({
            "@type": "regen:EmploymentAffiliation",
            "regen:targetOrganization": { "@id": rel.object_url },
            "schema:roleName": relType === 'member' ? 'Member' : 'Employee',
            "regen:inferredFrom": "murmurations:relationships"
          });
          break;
          
        case 'board_member':
        case 'advisor':
          relationships.boardPositions.push({
            "@type": "regen:SharedBoardSeat",
            "regen:targetOrganization": { "@id": rel.object_url },
            "regen:boardRole": relType === 'board_member' ? 'Board Member' : 'Advisor',
            "regen:inferredFrom": "murmurations:relationships"
          });
          break;
      }
    });
  }

  return relationships;
}

function extractRelationshipType(predicateUrl) {
  // Extract relationship type from predicate URL
  const pathParts = predicateUrl.split('/');
  return pathParts[pathParts.length - 1];
}
```

### Unified Schema to Neo4j Edge Format

```javascript
function unifiedToNeo4jEdges(unifiedPerson) {
  const edges = [];
  const personId = unifiedPerson["@id"];

  // Process collaborations
  if (unifiedPerson["regen:collaborators"]) {
    unifiedPerson["regen:collaborators"].forEach(collab => {
      edges.push({
        source: personId,
        target: collab["regen:targetEntity"]["@id"],
        type: "COLLABORATES_WITH",
        properties: {
          projectName: collab["regen:projectName"],
          since: collab["schema:startDate"],
          until: collab["schema:endDate"],
          weight: collab["regen:weight"] || 1,
          direction: "bidirectional"
        }
      });
    });
  }

  // Process employment affiliations
  if (unifiedPerson["regen:affiliations"]) {
    unifiedPerson["regen:affiliations"].forEach(aff => {
      edges.push({
        source: personId,
        target: aff["schema:memberOf"]["@id"],
        type: "AFFILIATED_WITH",
        properties: {
          role: aff["schema:roleName"],
          startDate: aff["schema:startDate"],
          endDate: aff["schema:endDate"],
          isCurrentRole: aff["regen:isCurrentRole"],
          direction: "unidirectional"
        }
      });
    });
  }

  // Process event participation
  if (unifiedPerson["regen:eventParticipation"]) {
    unifiedPerson["regen:eventParticipation"].forEach(event => {
      edges.push({
        source: personId,
        target: event["regen:eventOrganizer"]["@id"],
        type: "PARTICIPATED_IN_EVENT",
        properties: {
          eventId: event["schema:event"]["@id"],
          role: event["regen:participationRole"],
          date: event["schema:startDate"],
          direction: "unidirectional"
        }
      });
    });
  }

  // Process board positions
  if (unifiedPerson["regen:boardPositions"]) {
    unifiedPerson["regen:boardPositions"].forEach(board => {
      edges.push({
        source: personId,
        target: board["schema:memberOf"]["@id"],
        type: "BOARD_MEMBER_OF",
        properties: {
          position: board["regen:boardRole"],
          since: board["schema:startDate"],
          until: board["schema:endDate"],
          direction: "bidirectional"
        }
      });
    });
  }

  // Process coauthorships
  if (unifiedPerson["regen:coauthorships"]) {
    unifiedPerson["regen:coauthorships"].forEach(coauth => {
      edges.push({
        source: personId,
        target: coauth["regen:coauthor"]["@id"],
        type: "COAUTHORED_WITH",
        properties: {
          workId: coauth["schema:workExample"]["@id"],
          citations: coauth["regen:citationCount"],
          direction: "bidirectional"
        }
      });
    });
  }

  return edges;
}
```

### Edge Type Validation Rules

```javascript
function validateEdgeTypes(relationships) {
  const errors = [];

  relationships.forEach((rel, index) => {
    const edgeType = rel["@type"];
    
    switch (edgeType) {
      case "regen:Collaboration":
        if (!rel["regen:targetEntity"]) {
          errors.push(`Collaboration ${index}: missing targetEntity`);
        }
        if (!rel["schema:startDate"] && !rel["regen:projectName"]) {
          errors.push(`Collaboration ${index}: needs either startDate or projectName`);
        }
        break;
        
      case "regen:EmploymentAffiliation":
        if (!rel["regen:targetOrganization"]) {
          errors.push(`Employment ${index}: missing targetOrganization`);
        }
        if (!rel["schema:roleName"]) {
          errors.push(`Employment ${index}: missing role name`);
        }
        break;
        
      case "regen:EventParticipation":
        if (!rel["regen:eventId"] || !rel["schema:startDate"]) {
          errors.push(`Event ${index}: missing eventId or date`);
        }
        break;
        
      case "regen:SharedBoardSeat":
        if (!rel["regen:targetOrganization"] || !rel["schema:startDate"]) {
          errors.push(`Board ${index}: missing organization or start date`);
        }
        break;
    }
  });

  return errors;
}
```

### Best Practices for Edge Type Transformations

1. **Preserve Directionality**
   ```javascript
   // Always specify direction in metadata
   {
     "@type": "regen:MentorAdvisor",
     "regen:direction": "unidirectional",
     "regen:source": personId,
     "regen:target": menteeId
   }
   ```

2. **Handle Temporal Data**
   ```javascript
   // Support open-ended relationships
   {
     "schema:startDate": "2020-01-15",
     "schema:endDate": null, // Still active
     "regen:isCurrentRole": true
   }
   ```

3. **Maintain Source Attribution**
   ```javascript
   {
     "@type": "regen:Collaboration",
     "regen:inferredFrom": "schema:colleague",
     "regen:confidence": 0.7, // Lower confidence for inferred relationships
     "regen:needsVerification": true
   }
   ```

4. **Support Relationship Weights**
   ```javascript
   {
     "regen:weight": 0.8, // For force-directed graph layout
     "regen:strength": "strong", // Semantic strength
     "regen:frequency": "weekly" // Interaction frequency
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