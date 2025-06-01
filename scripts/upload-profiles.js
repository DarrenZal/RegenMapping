#!/usr/bin/env node

/**
 * Convert, validate, and submit example profiles to Murmurations test network
 * 
 * This script:
 * 1. Converts JSON-LD profiles to Murmurations format
 * 2. Saves them to murmurations-profiles/ for GitHub hosting
 * 3. Validates profiles using Murmurations test API
 * 4. Submits profile URLs to test index for indexing
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// GitHub repository info (update these for your repo)
const GITHUB_USER = 'DarrenZal';
const GITHUB_REPO = 'RegenMapping';
const GITHUB_BRANCH = 'main';
const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${GITHUB_BRANCH}`;

// Murmurations test endpoints
const MURMURATIONS_TEST_BASE = 'https://test-index.murmurations.network';

/**
 * Convert JSON-LD profile to Murmurations profile format
 */
function convertToMurmurationsProfile(jsonldProfile, profileType) {
  const profile = {};
  
  // Handle @graph structure
  let profileData;
  if (jsonldProfile['@graph']) {
    profileData = jsonldProfile['@graph'].find(item => 
      item['@type'] && (item['@type'].includes('Person') || item['@type'].includes('Organization'))
    );
  } else {
    profileData = jsonldProfile;
  }

  if (!profileData) {
    throw new Error('Could not find profile data in JSON-LD');
  }

  // Use only base Murmurations schemas for testing
  if (profileType === 'person') {
    profile.linked_schemas = ['people_schema-v0.1.0'];
  } else {
    profile.linked_schemas = ['organizations_schema-v1.0.0'];
  }

  // Copy basic required fields
  profile.name = profileData['schema:name'] || profileData.name;
  
  if (profileType === 'person') {
    profile.primary_url = profileData['murm:primary_url'] || profileData['schema:url'] || profileData.url || 'https://example.com';
    profile.tags = profileData['schema:keywords'] || profileData.tags || ['regenerative', 'sustainability'];
  } else {
    profile.primary_url = profileData['murm:primary_url'] || profileData.primaryUrl || profileData['schema:url'] || profileData.url || 'https://example.com';
    profile.tags = profileData['murm:tags'] || profileData.tags || profileData.keywords || ['regenerative', 'organization'];
  }

  // Ensure tags is an array
  if (typeof profile.tags === 'string') {
    profile.tags = [profile.tags];
  }

  // Copy optional fields
  if (profileData['schema:description'] || profileData.description) {
    profile.description = profileData['schema:description'] || profileData.description;
  }

  if (profileData['murm:nickname'] || profileData.nickname) {
    profile.nickname = profileData['murm:nickname'] || profileData.nickname;
  }

  // Copy location data if available
  const homeLocation = profileData['schema:homeLocation'] || profileData.homeLocation;
  if (homeLocation) {
    if (homeLocation['geo:lat'] && homeLocation['geo:long']) {
      profile.geolocation = {
        lat: parseFloat(homeLocation['geo:lat']),
        lon: parseFloat(homeLocation['geo:long'])
      };
    }
    if (homeLocation['schema:addressLocality']) {
      profile.locality = homeLocation['schema:addressLocality'];
    }
    if (homeLocation['schema:addressRegion']) {
      profile.region = homeLocation['schema:addressRegion'];
    }
    if (homeLocation['schema:addressCountry']) {
      profile.country_name = homeLocation['schema:addressCountry'];
    }
  }

  // Use coordinates from top-level if available
  if (profileData['regen:hqLatitude'] && profileData['regen:hqLongitude']) {
    profile.geolocation = {
      lat: parseFloat(profileData['regen:hqLatitude']),
      lon: parseFloat(profileData['regen:hqLongitude'])
    };
  }

  // Organization-specific fields
  if (profileType === 'organization') {
    if (profileData.mission || profileData['murm:mission']) {
      profile.mission = profileData.mission || profileData['murm:mission'];
    }
    if (profileData.status || profileData['murm:status']) {
      profile.status = profileData.status || profileData['murm:status'];
    }
    if (profileData.fullAddress || profileData['murm:full_address']) {
      profile.full_address = profileData.fullAddress || profileData['murm:full_address'];
    }
  }

  return profile;
}

/**
 * Validate profile using Murmurations test API
 */
async function validateProfile(profile, profileName) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(profile);
    
    const options = {
      hostname: 'test-index.murmurations.network',
      port: 443,
      path: '/v2/validate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`✅ Profile validation passed: ${profileName}`);
          try {
            const response = JSON.parse(responseData);
            resolve({ statusCode: res.statusCode, data: response });
          } catch (e) {
            resolve({ statusCode: res.statusCode, data: responseData });
          }
        } else {
          console.error(`❌ Profile validation failed: ${profileName}`);
          console.error(`Status: ${res.statusCode}`);
          console.error(`Response: ${responseData}`);
          reject(new Error(`Validation failed with status ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Error validating profile ${profileName}:`, error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

/**
 * Submit profile URL to Murmurations test index
 */
async function submitProfileUrl(profileUrl, profileName) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ profile_url: profileUrl });
    
    const options = {
      hostname: 'test-index.murmurations.network',
      port: 443,
      path: '/v2/nodes',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`✅ Profile URL submitted: ${profileName}`);
          try {
            const response = JSON.parse(responseData);
            resolve({ statusCode: res.statusCode, data: response });
          } catch (e) {
            resolve({ statusCode: res.statusCode, data: responseData });
          }
        } else {
          console.error(`❌ Profile URL submission failed: ${profileName}`);
          console.error(`Status: ${res.statusCode}`);
          console.error(`Response: ${responseData}`);
          reject(new Error(`Submission failed with status ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Error submitting profile URL ${profileName}:`, error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Converting and testing profiles with Murmurations...\n');

  try {
    // Create output directory for Murmurations profiles
    const outputDir = path.join(__dirname, '../murmurations-profiles');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const profileUrls = [];

    // Process Person profiles
    console.log('👤 Processing Person profiles...');
    const personProfilePath = path.join(__dirname, '../Ontology/Person/example-person-profile.jsonld');
    const personProfiles = JSON.parse(fs.readFileSync(personProfilePath, 'utf8'));
    
    const persons = personProfiles['@graph'] || [personProfiles];
    console.log(`  Found ${persons.length} items in @graph`);
    
    const personEntities = persons.filter(item => {
      const hasPersonType = item['@type'] && (
        (Array.isArray(item['@type']) && (item['@type'].includes('schema:Person') || item['@type'].includes('Person') || item['@type'].includes('RegenerativePerson'))) ||
        (typeof item['@type'] === 'string' && (item['@type'].includes('Person')))
      );
      console.log(`  Item ${item['@id'] || 'unknown'}: type=${JSON.stringify(item['@type'])}, hasPersonType=${hasPersonType}`);
      return hasPersonType;
    });
    
    console.log(`  Found ${personEntities.length} person entities`);

    for (let i = 0; i < personEntities.length; i++) {
      const personData = personEntities[i];
      const personName = personData['schema:name'] || personData.name || `person-${i}`;
      
      console.log(`\n  Converting: ${personName}`);
      const murmProfile = convertToMurmurationsProfile(personData, 'person');
      
      // Save profile for GitHub hosting
      const filename = `person-${personName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.json`;
      const filePath = path.join(outputDir, filename);
      fs.writeFileSync(filePath, JSON.stringify(murmProfile, null, 2));
      
      // Generate GitHub raw URL
      const profileUrl = `${GITHUB_RAW_BASE}/murmurations-profiles/${filename}`;
      profileUrls.push({ name: personName, url: profileUrl, type: 'person' });
      
      console.log(`  📁 Saved: ${filename}`);
      console.log(`  🌐 URL: ${profileUrl}`);
      
      // Validate profile
      try {
        await validateProfile(murmProfile, personName);
      } catch (error) {
        console.log(`  ⚠️  Validation failed: ${error.message}`);
      }
    }

    // Process Organization profiles
    console.log('\n🏢 Processing Organization profiles...');
    const orgProfilePath = path.join(__dirname, '../Ontology/Organization/example-organization-profile.jsonld');
    const orgProfile = JSON.parse(fs.readFileSync(orgProfilePath, 'utf8'));
    
    const orgName = orgProfile.name || 'example-organization';
    console.log(`\n  Converting: ${orgName}`);
    const orgMurmProfile = convertToMurmurationsProfile(orgProfile, 'organization');
    
    // Save profile for GitHub hosting
    const orgFilename = `org-${orgName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.json`;
    const orgFilePath = path.join(outputDir, orgFilename);
    fs.writeFileSync(orgFilePath, JSON.stringify(orgMurmProfile, null, 2));
    
    // Generate GitHub raw URL
    const orgProfileUrl = `${GITHUB_RAW_BASE}/murmurations-profiles/${orgFilename}`;
    profileUrls.push({ name: orgName, url: orgProfileUrl, type: 'organization' });
    
    console.log(`  📁 Saved: ${orgFilename}`);
    console.log(`  🌐 URL: ${orgProfileUrl}`);
    
    // Validate profile
    try {
      await validateProfile(orgMurmProfile, orgName);
    } catch (error) {
      console.log(`  ⚠️  Validation failed: ${error.message}`);
    }

    // Submit profile URLs to test index
    console.log('\n📤 Submitting profile URLs to Murmurations test index...');
    for (const profile of profileUrls) {
      try {
        await submitProfileUrl(profile.url, profile.name);
      } catch (error) {
        console.log(`  ⚠️  Submission failed for ${profile.name}: ${error.message}`);
      }
    }

    console.log('\n✅ Profile processing completed!');
    console.log('\n📋 Summary:');
    console.log(`  • Converted ${profileUrls.length} profiles to Murmurations format`);
    console.log(`  • Saved profiles to: murmurations-profiles/`);
    console.log(`  • Validated profiles using test API`);
    console.log(`  • Submitted profile URLs to test index`);
    
    console.log('\n🔗 Profile URLs:');
    profileUrls.forEach(profile => {
      console.log(`  • ${profile.name}: ${profile.url}`);
    });

    console.log('\n📝 Next steps:');
    console.log('1. Commit and push the murmurations-profiles/ directory to GitHub');
    console.log('2. Wait a few minutes for indexing to complete');
    console.log('3. Run: node scripts/test-queries.js');

  } catch (error) {
    console.error('\n❌ Error during profile processing:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { convertToMurmurationsProfile, validateProfile, submitProfileUrl };
