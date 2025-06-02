#!/usr/bin/env node

/**
 * Test if schema:isBasedOn field is actually allowed by Murmurations validation
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

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

async function main() {
  console.log('🧪 Testing schema:isBasedOn field with Murmurations validation\n');
  
  try {
    // Test the working version with source_url
    const workingProfilePath = path.join(__dirname, '..', 'profiles', 'murmurations-working', 'murm-person-dylan-tull.json');
    const workingProfile = JSON.parse(fs.readFileSync(workingProfilePath, 'utf8'));
    
    console.log('📋 Testing working profile with source_url field...');
    console.log('Profile contains source_url:', 'source_url' in workingProfile);
    console.log('source_url value:', workingProfile['source_url']);
    
    await validateProfile(workingProfile, 'Dylan Tull (with source_url)');
    console.log('✅ Working profile with source_url validated successfully!');
    
  } catch (error) {
    console.error('❌ Working profile validation failed:', error.message);
    
    // Test the clean version without schema:isBasedOn
    console.log('\n📋 Testing clean profile without source_url field...');
    const cleanProfilePath = path.join(__dirname, '..', 'profiles', 'murmurations', 'murm-person-dylan-tull.json');
    const cleanProfile = JSON.parse(fs.readFileSync(cleanProfilePath, 'utf8'));
    
    console.log('Profile contains source_url:', 'source_url' in cleanProfile);
    
    try {
      await validateProfile(cleanProfile, 'Dylan Tull (clean)');
      console.log('✅ Clean profile validated successfully!');
    } catch (cleanError) {
      console.error('❌ Clean profile validation also failed:', cleanError.message);
    }
  }
}

main();