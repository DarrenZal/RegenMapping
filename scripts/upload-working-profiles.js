#!/usr/bin/env node

/**
 * Submit working profiles (with source_url) from the profiles/murmurations-working directory to Murmurations test network
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
  console.log('🚀 Testing and submitting working profiles (with source_url) to Murmurations...\n');

  try {
    // Check if working profiles directory exists
    const profilesDir = path.join(__dirname, '../profiles/murmurations-working');
    if (!fs.existsSync(profilesDir)) {
      throw new Error(`Directory not found: ${profilesDir}`);
    }

    // Get all JSON files in the working profiles directory
    const profileFiles = fs.readdirSync(profilesDir)
      .filter(file => file.endsWith('.json'));

    if (profileFiles.length === 0) {
      throw new Error('No profile files found in profiles/murmurations-working/');
    }

    console.log(`📁 Found ${profileFiles.length} working profile files\n`);

    const profileUrls = [];

    // Process each profile file
    for (const file of profileFiles) {
      const filePath = path.join(profilesDir, file);
      const profile = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const profileName = profile.name || path.basename(file, '.json');

      console.log(`📄 Processing: ${profileName} (${file})`);
      console.log(`   Contains source_url: ${'source_url' in profile}`);
      if (profile.source_url) {
        console.log(`   source_url: ${profile.source_url}`);
      }

      // Validate profile
      try {
        await validateProfile(profile, profileName);
      } catch (error) {
        console.log(`  ⚠️  Validation failed: ${error.message}`);
        continue;
      }

      // Generate GitHub raw URL for the working profile
      const profileUrl = `${GITHUB_RAW_BASE}/profiles/murmurations-working/${file}`;
      profileUrls.push({ name: profileName, url: profileUrl });
      
      console.log(`  🌐 URL: ${profileUrl}`);
    }

    // Submit profile URLs to test index
    console.log('\n📤 Submitting working profile URLs to Murmurations test index...');
    for (const profile of profileUrls) {
      try {
        await submitProfileUrl(profile.url, profile.name);
      } catch (error) {
        console.log(`  ⚠️  Submission failed for ${profile.name}: ${error.message}`);
      }
    }

    console.log('\n✅ Working profile processing completed!');
    console.log('\n📋 Summary:');
    console.log(`  • Processed ${profileUrls.length} working profiles with source_url field`);
    console.log(`  • Validated profiles using test API`);
    console.log(`  • Submitted profile URLs to test index`);
    
    console.log('\n🔗 Working Profile URLs:');
    profileUrls.forEach(profile => {
      console.log(`  • ${profile.name}: ${profile.url}`);
    });

    console.log('\n📝 Next steps:');
    console.log('1. Wait a few minutes for indexing to complete');
    console.log('2. Test lossless conversion with the uploaded working profiles');
    console.log('3. Verify web app shows full data for all schema formats');

  } catch (error) {
    console.error('\n❌ Error during working profile processing:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { validateProfile, submitProfileUrl };