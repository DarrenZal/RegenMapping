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

        for (let line of lines) {
            line = line.trim();
            if (line === 'lens:') {
                inLensSection = true;
                continue;
            }
            
            if (!inLensSection || line === '' || line.startsWith('#')) continue;

            // Parse operations
            if (line.startsWith('- rename:')) {
                currentOperation = { type: 'rename' };
                lens.operations.push(currentOperation);
            } else if (line.startsWith('- remove:')) {
                currentOperation = { type: 'remove' };
                lens.operations.push(currentOperation);
            } else if (line.startsWith('- add:')) {
                currentOperation = { type: 'add' };
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
            } else if (line.includes('value:')) {
                if (currentOperation) {
                    currentOperation.value = line.split('value:')[1].trim().replace(/"/g, '');
                }
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
                case 'remove':
                    result = this.applyRemove(result, operation);
                    break;
                case 'add':
                    result = this.applyAdd(result, operation);
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
     * Convert between schema formats using loaded lenses with lossless conversion support
     */
    async convertSchema(data, fromFormat, toFormat) {
        try {
            console.log(`🔄 Converting ${fromFormat} → ${toFormat} for: ${data.name || 'Unknown'}`);
            
            // Universal lossless conversion check: if any format has source_url, fetch original unified profile
            if (data['source_url'] && toFormat === 'unified') {
                console.log(`🔄 Found source_url: ${data['source_url']}`);
                const originalProfile = await this.fetchProfile(data['source_url']);
                if (originalProfile) {
                    console.log('✅ Successfully fetched original unified profile from source_url');
                    return originalProfile;
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
                // Note: We don't have org-specific Schema.org lenses yet, so they fall back to person lenses
                'murmurations_schemaorg': 'murmToSchemaOrg',
                'schemaorg_murmurations': 'schemaOrgToMurm',
                'unified_schemaorg': 'unifiedToSchemaOrg',
                'schemaorg_unified': 'schemaOrgToUnified'
            };
            
            const lensMap = isOrganization ? orgLensMap : personLensMap;
            const lensKey = `${fromFormat}_${toFormat}`;
            const lensName = lensMap[lensKey];
            
            if (lensName && this.lenses[lensName]) {
                console.log(`🔄 Using lens transformation: ${lensName}`);
                let result = this.applyLensToDoc(this.lenses[lensName], data);
                
                // Ensure source_url is passed through for lossless conversion
                if (data['source_url']) {
                    result['source_url'] = data['source_url'];
                }
                
                // Add required context and type information for unified format
                if (toFormat === 'unified') {
                    result['@context'] = {
                        "@version": 1.1,
                        "@vocab": "https://schema.org/",
                        "schema": "https://schema.org/",
                        "murm": "https://murmurations.network/schemas/",
                        "regen": "https://darrenzal.github.io/RegenMapping/ontology/",
                        "geo": "http://www.w3.org/2003/01/geo/wgs84_pos#",
                        "xsd": "http://www.w3.org/2001/XMLSchema#"
                    };
                    
                    // Determine entity type
                    const isOrganization = data.linked_schemas && 
                        data.linked_schemas.some(schema => schema.includes('organizations_schema'));
                    
                    result['@type'] = isOrganization ? 'Organization' : 'Person';
                    
                    // Ensure linked_schemas includes unified schema
                    if (!result.linked_schemas) {
                        result.linked_schemas = [];
                    }
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
