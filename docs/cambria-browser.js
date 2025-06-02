/**
 * Browser-compatible Cambria lens engine
 * Implements core Cambria functionality for schema transformations
 */

class CambriaBrowser {
    constructor() {
        this.lenses = {};
    }

    /**
     * Load a YAML lens from text content
     */
    loadYamlLens(yamlContent) {
        // Simple YAML parser for our lens format
        const lines = yamlContent.split('\n');
        const lens = { operations: [] };
        let currentOperation = null;
        let inLensSection = false;
        let inValueSection = false;
        let valueLines = [];

        for (let line of lines) {
            const originalLine = line;
            line = line.trim();
            
            if (line === 'lens:') {
                inLensSection = true;
                continue;
            }
            
            if (!inLensSection || line === '' || line.startsWith('#')) continue;

            // Handle multi-line values
            if (inValueSection) {
                if (originalLine.startsWith('  ') && !line.startsWith('-')) {
                    valueLines.push(originalLine);
                    continue;
                } else {
                    // End of value section, parse the collected lines
                    if (currentOperation && valueLines.length > 0) {
                        try {
                            // Simple YAML object parsing for @context values
                            const valueText = valueLines.join('\n');
                            if (valueText.includes('@vocab') || valueText.includes('regen:')) {
                                // Parse as JSON-like structure
                                const cleanValue = valueText
                                    .replace(/"/g, '')
                                    .split('\n')
                                    .filter(l => l.trim())
                                    .reduce((obj, l) => {
                                        const [key, val] = l.split(':').map(s => s.trim());
                                        if (key && val) {
                                            obj[key] = val;
                                        }
                                        return obj;
                                    }, {});
                                currentOperation.value = cleanValue;
                            } else {
                                currentOperation.value = valueText.trim().replace(/"/g, '');
                            }
                        } catch (e) {
                            currentOperation.value = valueLines.join(' ').trim().replace(/"/g, '');
                        }
                    }
                    inValueSection = false;
                    valueLines = [];
                }
            }

            // Parse operations
            if (line.startsWith('- rename:')) {
                currentOperation = { type: 'rename' };
                lens.operations.push(currentOperation);
            } else if (line.startsWith('- optionalRename:')) {
                currentOperation = { type: 'optionalRename' };
                lens.operations.push(currentOperation);
            } else if (line.startsWith('- remove:')) {
                currentOperation = { type: 'remove' };
                lens.operations.push(currentOperation);
            } else if (line.startsWith('- add:')) {
                currentOperation = { type: 'add' };
                lens.operations.push(currentOperation);
            } else if (line.startsWith('- setValue:')) {
                currentOperation = { type: 'setValue' };
                lens.operations.push(currentOperation);
            } else if (line.includes('source:')) {
                if (currentOperation) {
                    currentOperation.source = line.split('source:')[1].trim().replace(/"/g, '');
                }
            } else if (line.includes('destination:')) {
                if (currentOperation) {
                    currentOperation.destination = line.split('destination:')[1].trim().replace(/"/g, '');
                }
            } else if (line.includes('name:')) {
                if (currentOperation) {
                    currentOperation.name = line.split('name:')[1].trim().replace(/"/g, '');
                }
            } else if (line.includes('property:')) {
                if (currentOperation) {
                    currentOperation.name = line.split('property:')[1].trim().replace(/"/g, '');
                }
            } else if (line.includes('value:')) {
                if (currentOperation) {
                    const valueContent = line.split('value:')[1].trim();
                    if (valueContent === '') {
                        // Multi-line value starts on next line
                        inValueSection = true;
                        valueLines = [];
                    } else {
                        currentOperation.value = valueContent.replace(/"/g, '');
                    }
                }
            }
        }

        // Handle any remaining multi-line value
        if (inValueSection && currentOperation && valueLines.length > 0) {
            try {
                const valueText = valueLines.join('\n');
                if (valueText.includes('@vocab') || valueText.includes('regen:')) {
                    const cleanValue = valueText
                        .replace(/"/g, '')
                        .split('\n')
                        .filter(l => l.trim())
                        .reduce((obj, l) => {
                            const [key, val] = l.split(':').map(s => s.trim());
                            if (key && val) {
                                obj[key] = val;
                            }
                            return obj;
                        }, {});
                    currentOperation.value = cleanValue;
                } else {
                    currentOperation.value = valueText.trim().replace(/"/g, '');
                }
            } catch (e) {
                currentOperation.value = valueLines.join(' ').trim().replace(/"/g, '');
            }
        }

        return lens;
    }

    /**
     * Apply a lens to a document
     */
    applyLensToDoc(lens, doc) {
        let result = JSON.parse(JSON.stringify(doc)); // Deep clone

        for (const operation of lens.operations) {
            switch (operation.type) {
                case 'rename':
                    result = this.applyRename(result, operation);
                    break;
                case 'optionalRename':
                    result = this.applyOptionalRename(result, operation);
                    break;
                case 'remove':
                    result = this.applyRemove(result, operation);
                    break;
                case 'add':
                    result = this.applyAdd(result, operation);
                    break;
                case 'setValue':
                    result = this.applySetValue(result, operation);
                    break;
            }
        }

        return result;
    }

    /**
     * Apply rename operation
     */
    applyRename(doc, operation) {
        const { source, destination } = operation;
        
        if (doc.hasOwnProperty(source)) {
            doc[destination] = doc[source];
            delete doc[source];
        }
        
        return doc;
    }

    /**
     * Apply optional rename operation (only if source field exists)
     */
    applyOptionalRename(doc, operation) {
        const { source, destination } = operation;
        
        if (doc.hasOwnProperty(source)) {
            doc[destination] = doc[source];
            delete doc[source];
        }
        
        return doc;
    }

    /**
     * Apply setValue operation
     */
    applySetValue(doc, operation) {
        const { name, value } = operation;
        doc[name] = value;
        return doc;
    }

    /**
     * Apply remove operation
     */
    applyRemove(doc, operation) {
        const { name } = operation;
        
        if (doc.hasOwnProperty(name)) {
            delete doc[name];
        }
        
        return doc;
    }

    /**
     * Apply add operation
     */
    applyAdd(doc, operation) {
        const { name, value } = operation;
        doc[name] = value;
        return doc;
    }

    /**
     * Load lens files from URLs
     */
    async loadLensFromUrl(url) {
        try {
            const response = await fetch(url);
            const yamlContent = await response.text();
            return this.loadYamlLens(yamlContent);
        } catch (error) {
            console.error(`Failed to load lens from ${url}:`, error);
            return null;
        }
    }

    /**
     * Initialize with our lens files
     */
    async initializeLenses() {
        // Use GitHub raw URLs for lens files since they're not in the docs folder
        const baseUrl = 'https://raw.githubusercontent.com/DarrenZal/RegenMapping/main';
        
        try {
            // Load all our lens files from GitHub
            console.log('🔄 Loading Cambria lenses...');
            
            // Person schema lenses
            this.lenses.murmToUnified = await this.loadLensFromUrl(`${baseUrl}/cambria-lenses/murmurations-to-unified-person.lens.yml`);
            this.lenses.unifiedToMurm = await this.loadLensFromUrl(`${baseUrl}/cambria-lenses/unified-to-murmurations-person.lens.yml`);
            this.lenses.schemaOrgToUnified = await this.loadLensFromUrl(`${baseUrl}/cambria-lenses/schemaorg-to-unified-person.lens.yml`);
            this.lenses.unifiedToSchemaOrg = await this.loadLensFromUrl(`${baseUrl}/cambria-lenses/unified-to-schemaorg-person.lens.yml`);
            this.lenses.murmToSchemaOrg = await this.loadLensFromUrl(`${baseUrl}/cambria-lenses/murmurations-to-schemaorg-person.lens.yml`);
            this.lenses.schemaOrgToMurm = await this.loadLensFromUrl(`${baseUrl}/cambria-lenses/schemaorg-to-murmurations-person.lens.yml`);
            
            // Organization schema lenses
            this.lenses.unifiedToMurmOrg = await this.loadLensFromUrl(`${baseUrl}/cambria-lenses/unified-to-murmurations-organization.lens.yml`);
            this.lenses.murmToUnifiedOrg = await this.loadLensFromUrl(`${baseUrl}/cambria-lenses/murmurations-to-unified-organization.lens.yml`);
            this.lenses.unifiedToSchemaOrgOrg = await this.loadLensFromUrl(`${baseUrl}/cambria-lenses/unified-to-schemaorg-organization.lens.yml`);
            this.lenses.schemaOrgToUnifiedOrg = await this.loadLensFromUrl(`${baseUrl}/cambria-lenses/schemaorg-to-unified-organization.lens.yml`);
            this.lenses.murmToSchemaOrgOrg = await this.loadLensFromUrl(`${baseUrl}/cambria-lenses/murmurations-to-schemaorg-organization.lens.yml`);
            this.lenses.schemaOrgToMurmOrg = await this.loadLensFromUrl(`${baseUrl}/cambria-lenses/schemaorg-to-murmurations-organization.lens.yml`);
            
            console.log('🎯 Cambria lenses loaded successfully!');
            console.log('Available lenses:', Object.keys(this.lenses));
            return true;
        } catch (error) {
            console.warn('⚠️ Failed to load Cambria lenses, falling back to manual conversion:', error);
            return false;
        }
    }

    /**
     * Fetch a profile from a URL
     */
    async fetchProfile(url) {
        try {
            console.log(`🔍 Fetching profile from: ${url}`);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch profile: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`❌ Error fetching profile: ${error.message}`);
            return null;
        }
    }

    /**
     * Construct unified URL from source_url pattern
     */
    constructUnifiedUrl(sourceUrl) {
        try {
            // Replace format directory and filename pattern
            let unifiedUrl = sourceUrl;
            
            // Replace directory: murmurations -> unified, schemaorg -> unified
            unifiedUrl = unifiedUrl.replace('/murmurations/', '/unified/');
            unifiedUrl = unifiedUrl.replace('/schemaorg/', '/unified/');
            
            // Replace filename pattern: murm- -> regen-, schemaorg- -> regen-
            unifiedUrl = unifiedUrl.replace('/murm-', '/regen-');
            unifiedUrl = unifiedUrl.replace('/schemaorg-', '/regen-');
            
            // Replace file extension: .json -> .jsonld
            unifiedUrl = unifiedUrl.replace('.json', '.jsonld');
            
            console.log(`🔗 Constructed unified URL: ${sourceUrl} → ${unifiedUrl}`);
            return unifiedUrl;
        } catch (error) {
            console.warn(`Failed to construct unified URL from ${sourceUrl}:`, error);
            return null;
        }
    }

    /**
     * Construct source URL for a profile in a specific format
     */
    constructSourceUrl(profile, format) {
        try {
            const baseUrl = 'https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles';
            const name = profile.name;
            
            // Map names to specific file patterns
            const nameToFile = {
                'Dylan Tull': 'dylan-tull',
                'Dr. Karen O\'Brien': 'karen-obrien', 
                'Global Regenerative Cooperative': 'global-regenerative-coop'
            };
            
            const profileType = profile['@type'] === 'Organization' ? 'org' : 'person';
            const fileBase = nameToFile[name];
            
            if (!fileBase) {
                console.warn(`No file mapping found for profile: ${name}`);
                return null;
            }
            
            let sourceUrl;
            if (format === 'unified') {
                sourceUrl = `${baseUrl}/unified/regen-${profileType}-${fileBase}.jsonld`;
            } else if (format === 'murmurations') {
                sourceUrl = `${baseUrl}/murmurations/murm-${profileType}-${fileBase}.json`;
            } else if (format === 'schemaorg') {
                sourceUrl = `${baseUrl}/schemaorg/schemaorg-${profileType}-${fileBase}.json`;
            }
            
            console.log(`🔗 Constructed ${format} source URL for ${name}: ${sourceUrl}`);
            return sourceUrl;
        } catch (error) {
            console.warn(`Failed to construct source URL:`, error);
            return null;
        }
    }

    /**
     * Convert between schema formats using loaded lenses with lossless conversion support
     */
    async convertSchema(data, fromFormat, toFormat) {
        try {
            console.log(`🔄 Converting ${fromFormat} → ${toFormat} for: ${data.name || 'Unknown'}`);
            
            // Lossless conversion: Check for source_url that points to the target format
            if (data['source_url']) {
                console.log(`🔍 Found source_url: ${data['source_url']}`);
                
                // Determine if source_url points to the format we want
                const isUnifiedUrl = data['source_url'].includes('/unified/') || data['source_url'].includes('regen-');
                const isSchemaOrgUrl = data['source_url'].includes('/schemaorg/') || data['source_url'].includes('schemaorg-');
                const isMurmurationsUrl = data['source_url'].includes('/murmurations/') || data['source_url'].includes('murm-');
                
                // If we have the exact format we want, fetch it
                if ((toFormat === 'unified' && isUnifiedUrl) ||
                    (toFormat === 'schemaorg' && isSchemaOrgUrl) ||
                    (toFormat === 'murmurations' && isMurmurationsUrl)) {
                    
                    const originalProfile = await this.fetchProfile(data['source_url']);
                    if (originalProfile) {
                        console.log('✅ Lossless recovery: fetched original profile from source_url');
                        return originalProfile;
                    }
                }
                
                // If we want unified format and have a source_url to any format, try to get unified
                if (toFormat === 'unified' && !isUnifiedUrl) {
                    // Try to construct unified URL from source_url pattern
                    const unifiedUrl = this.constructUnifiedUrl(data['source_url']);
                    if (unifiedUrl) {
                        const originalProfile = await this.fetchProfile(unifiedUrl);
                        if (originalProfile) {
                            console.log('✅ Lossless recovery: fetched unified profile via URL construction');
                            return originalProfile;
                        }
                    }
                }
            }
            
            // Determine if this is an organization profile
            const isOrganization = data.linked_schemas && 
                data.linked_schemas.some(schema => schema.includes('organizations_schema')) ||
                data['@type'] && (data['@type'].includes('Organization') || data['@type'].includes('schema:Organization'));
            
            // Handle all conversion paths using appropriate lenses
            const personLensMap = {
                'murmurations_unified': 'murmToUnified',
                'unified_murmurations': 'unifiedToMurm', 
                'murmurations_schemaorg': 'murmToSchemaOrg',
                'schemaorg_murmurations': 'schemaOrgToMurm',
                'unified_schemaorg': 'unifiedToSchemaOrg',
                'schemaorg_unified': 'schemaOrgToUnified'
            };
            
            const orgLensMap = {
                'murmurations_unified': 'murmToUnifiedOrg',
                'unified_murmurations': 'unifiedToMurmOrg',
                'murmurations_schemaorg': 'murmToSchemaOrgOrg',
                'schemaorg_murmurations': 'schemaOrgToMurmOrg',
                'unified_schemaorg': 'unifiedToSchemaOrgOrg',
                'schemaorg_unified': 'schemaOrgToUnifiedOrg'
            };
            
            const lensMap = isOrganization ? orgLensMap : personLensMap;
            const lensKey = `${fromFormat}_${toFormat}`;
            const lensName = lensMap[lensKey];
            
            if (lensName && this.lenses[lensName]) {
                console.log(`🔄 Using lens transformation: ${lensName}`);
                let result = this.applyLensToDoc(this.lenses[lensName], data);
                
                // Always preserve source_url for lossless conversion - or add it if converting from unified
                if (data['source_url']) {
                    result['source_url'] = data['source_url'];
                } else if (fromFormat === 'unified' && toFormat !== 'unified') {
                    // Add source_url pointing back to unified format for lossless recovery
                    const unifiedUrl = this.constructSourceUrl(data, 'unified');
                    if (unifiedUrl) {
                        result['source_url'] = unifiedUrl;
                    }
                }
                
                // Add required context and type information for unified format
                if (toFormat === 'unified') {
                    if (!result['@context']) {
                        result['@context'] = {
                            "@version": 1.1,
                            "@vocab": "https://schema.org/",
                            "schema": "https://schema.org/",
                            "murm": "https://murmurations.network/schemas/",
                            "regen": "https://darrenzal.github.io/RegenMapping/ontology/",
                            "geo": "http://www.w3.org/2003/01/geo/wgs84_pos#",
                            "xsd": "http://www.w3.org/2001/XMLSchema#"
                        };
                    }
                    
                    // Determine entity type
                    if (!result['@type']) {
                        const isOrganization = data.linked_schemas && 
                            data.linked_schemas.some(schema => schema.includes('organizations_schema'));
                        result['@type'] = isOrganization ? 'Organization' : 'Person';
                    }
                    
                    // Ensure linked_schemas includes unified schema
                    if (!result.linked_schemas) {
                        result.linked_schemas = [];
                    }
                    const isOrganization = result['@type'] === 'Organization';
                    const unifiedSchema = isOrganization ? 'regen-organization-schema-v1.0.0' : 'regen-person-schema-v1.0.0';
                    if (!result.linked_schemas.includes(unifiedSchema)) {
                        result.linked_schemas.push(unifiedSchema);
                    }
                }
                
                console.log(`✅ Successfully converted using ${lensName}`);
                return result;
            }
            
            // Fallback to name-based mapping for murmurations→unified (backward compatibility)
            if (fromFormat === 'murmurations' && toFormat === 'unified') {
                const nameToUnifiedUrlMap = {
                    'Dylan Tull': 'https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/unified/regen-person-dylan-tull.jsonld',
                    'Dr. Karen O\'Brien': 'https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/unified/regen-person-karen-obrien.jsonld',
                    'Global Regenerative Cooperative': 'https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/unified/regen-org-global-regenerative-coop.jsonld'
                };
                
                const unifiedUrl = nameToUnifiedUrlMap[data.name];
                if (unifiedUrl) {
                    try {
                        console.log(`🔄 Attempting name-based lossless conversion for: ${data.name}`);
                        const originalProfile = await this.fetchProfile(unifiedUrl);
                        if (originalProfile) {
                            console.log('✅ Successfully fetched original unified profile via name mapping');
                            return originalProfile;
                        }
                    } catch (fetchError) {
                        console.warn(`⚠️ Name-based fetch failed: ${fetchError.message}`);
                    }
                }
            }
            
            // Final fallback: simple manual conversion
            console.warn(`⚠️ No lens found for ${fromFormat} → ${toFormat}, using fallback conversion`);
            return this.fallbackConversion(data, fromFormat, toFormat);
            
        } catch (error) {
            console.error('Cambria conversion error:', error);
            return data;
        }
    }
    
    /**
     * Fallback conversion for when lenses are not available
     */
    fallbackConversion(data, fromFormat, toFormat) {
        // Simple field mappings as fallback
        if (toFormat === 'schemaorg') {
            const isOrganization = data.linked_schemas && 
                data.linked_schemas.some(schema => schema.includes('organizations_schema'));
            
            const result = {
                "@context": "https://schema.org/",
                "@type": isOrganization ? "Organization" : "Person",
                "name": data.name || 'Unknown',
                "url": data.primary_url || data['murm:primary_url'] || data.url
            };
            
            // Add location
            if (data.locality || data['regen:locality']) {
                const locationKey = isOrganization ? 'location' : 'homeLocation';
                result[locationKey] = {
                    "@type": "Place",
                    "addressLocality": data.locality || data['regen:locality'],
                    "addressRegion": data.region || data['regen:region'],
                    "addressCountry": data.country_name || data['regen:country']
                };
            }
            
            // Pass through source_url
            if (data['source_url']) {
                result['source_url'] = data['source_url'];
            }
            
            console.log('🔄 Fallback Schema.org conversion result:', result);
            return result;
        }
        
        // For other conversions, return original data
        return data;
    }
}

// Export for use in other scripts
window.CambriaBrowser = CambriaBrowser;
