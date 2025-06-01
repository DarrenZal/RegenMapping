#!/usr/bin/env node

/**
 * Update and Publish Profiles Workflow
 * 
 * This script combines all the steps needed to update and publish profiles:
 * 1. Convert unified profiles to Murmurations profiles
 * 2. Validate and submit the profiles to Murmurations
 * 3. Test the queries
 */

const { spawn } = require('child_process');
const path = require('path');

// Script paths
const CONVERT_SCRIPT = path.join(__dirname, 'convert-unified-to-murmurations.js');
const UPLOAD_SCRIPT = path.join(__dirname, 'upload-profiles-new.js');
const TEST_SCRIPT = path.join(__dirname, 'test-queries.js');

/**
 * Run a script and return a promise that resolves when the script completes
 */
function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    console.log(`\n🚀 Running: ${path.basename(scriptPath)}\n`);
    
    const child = spawn('node', [scriptPath], { stdio: 'inherit' });
    
    child.on('close', code => {
      if (code === 0) {
        console.log(`\n✅ Script completed: ${path.basename(scriptPath)}\n`);
        resolve();
      } else {
        console.error(`\n❌ Script failed with code ${code}: ${path.basename(scriptPath)}\n`);
        reject(new Error(`Script exited with code ${code}`));
      }
    });
    
    child.on('error', error => {
      console.error(`\n❌ Error running script: ${error.message}\n`);
      reject(error);
    });
  });
}

/**
 * Main workflow function
 */
async function runWorkflow() {
  console.log('🔄 Starting Update and Publish Workflow\n');
  console.log('This workflow will:');
  console.log('1. Convert unified profiles to Murmurations profiles');
  console.log('2. Validate and submit the profiles to Murmurations');
  console.log('3. Test the queries\n');
  
  try {
    // Step 1: Convert unified profiles to Murmurations profiles
    console.log('📋 Step 1: Converting unified profiles to Murmurations profiles');
    await runScript(CONVERT_SCRIPT);
    
    // Step 2: Validate and submit the profiles to Murmurations
    console.log('📋 Step 2: Validating and submitting profiles to Murmurations');
    await runScript(UPLOAD_SCRIPT);
    
    // Step 3: Test the queries
    console.log('📋 Step 3: Testing queries');
    await runScript(TEST_SCRIPT);
    
    console.log('\n🎉 Workflow completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Commit and push changes to GitHub');
    console.log('2. Wait for the profiles to be indexed by Murmurations');
    console.log('3. Check the website to ensure it displays the profiles correctly');
  } catch (error) {
    console.error('\n❌ Workflow failed:', error.message);
    process.exit(1);
  }
}

// Run the workflow
if (require.main === module) {
  runWorkflow();
}

module.exports = { runWorkflow };
