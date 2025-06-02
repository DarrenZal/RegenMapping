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
            // Load our lens files from GitHub
            this.lenses.murmToUnified = await this.loadLensFromUrl(`${baseUrl}/cambria-lenses/murmurations-to-unified-person.lens.yml`);
            this.lenses.unifiedToMurm = await this.loadLensFromUrl(`${baseUrl}/cambria-lenses/unified-to-murmurations-person.lens.yml`);
            this.lenses.schemaorgToUnified = await this.loadLensFromUrl(`${baseUrl}/cambria-lenses/schemaorg-to-unified-person.lens.yml`);
            
            console.log('🎯 Cambria lenses loaded successfully!');
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
     * Convert between schema formats using loaded lenses
     */
    async convertSchema(data, fromFormat, toFormat) {
        try {
            if (fromFormat === 'murmurations' && toFormat === 'unified') {
                // Check if the profile has a JSON-LD @reverse link or profile_source field
                let sourceUrl = null;
                
                // First check for @reverse link (preferred method)
                if (data['@reverse'] && data['@reverse']['schema:isBasedOn'] && data['@reverse']['schema:isBasedOn']['@id']) {
                    sourceUrl = data['@reverse']['schema:isBasedOn']['@id'];
                    console.log(`🔄 Found @reverse link: ${sourceUrl}`);
                } 
                // Fall back to profile_source field (backward compatibility)
                else if (data.profile_source) {
                    sourceUrl = data.profile_source;
                    console.log(`🔄 Found profile_source: ${sourceUrl}`);
                }
                
                // If we found a source URL, try to fetch the original profile
                if (sourceUrl) {
                    try {
                        // Attempt to fetch the original unified profile
                        const originalProfile = await this.fetchProfile(sourceUrl);
                        
                        if (originalProfile) {
                            console.log('✅ Successfully fetched original unified profile');
                            return originalProfile;
                        } else {
                            console.warn('⚠️ Failed to fetch original profile, falling back to lens transformation');
                        }
                    } catch (fetchError) {
                        console.warn(`⚠️ Error fetching original profile: ${fetchError.message}`);
                        console.warn('⚠️ Falling back to lens transformation');
                    }
                }
                
                // If no profile_source or fetching failed, use lens transformation
                if (this.lenses.murmToUnified) {
                    console.log('🔄 Using lens transformation for Murmurations → Unified conversion');
                    let result = this.applyLensToDoc(this.lenses.murmToUnified, data);
                    
                    // Add required context and type information
                    result['@context'] = {
                        "@version": 1.1,
                        "@vocab": "https://schema.org/",
                        "schema": "https://schema.org/",
                        "murm": "https://murmurations.network/schemas/",
                        "regen": "https://darrenzal.github.io/RegenMapping/ontology/"
                    };
                    
                    // Determine type based on linked_schemas
                    const isOrganization = data.linked_schemas && 
                        data.linked_schemas.some(schema => schema.includes('organizations_schema'));
                    
                    result['@type'] = isOrganization ? 
                        ["schema:Organization", "regen:RegenerativeOrganization"] :
                        ["schema:Person", "regen:RegenerativePerson"];
                    
                    // Preserve the name property
                    result.name = data.name;
                    
                    // Map primary_url to murm:primary_url
                    if (data.primary_url) {
                        result['murm:primary_url'] = data.primary_url;
                    }
                    
                    // Add location information
                    if (data.locality) {
                        const locationKey = isOrganization ? 'schema:location' : 'schema:homeLocation';
                        result[locationKey] = {
                            "@type": "schema:Place",
                            "schema:addressLocality": data.locality,
                            "schema:addressRegion": data.region,
                            "schema:addressCountry": data.country_name
                        };
                    }
                    
                    // Map tags to domain tags
                    if (data.tags) {
                        result['regen:domainTags'] = data.tags;
                    }
                    
                    // Preserve relationships
                    if (data.relationships) {
                        result['regen:relationships'] = data.relationships;
                    }
                    
                    // Map other fields that might be present
                    if (isOrganization) {
                        // Organization-specific fields
                        if (data.mission) result.mission = data.mission;
                        if (data.tagline) result.tagline = data.tagline;
                        if (data.legal_type) result.legalType = data.legal_type;
                        if (data.founded_year) result.foundedYear = data.founded_year;
                        if (data.employee_range) result.employeeRange = data.employee_range;
                        if (data.sdg_focus) result.sdgFocus = data.sdg_focus;
                        if (data.key_activities) result.keyActivities = data.key_activities;
                    } else {
                        // Person-specific fields
                        if (data.headline) result.headline = data.headline;
                        if (data.current_title) result.currentTitle = data.current_title;
                        if (data.current_org_id) result.currentOrgId = data.current_org_id;
                        if (data.display_handle) result.displayHandle = data.display_handle;
                        if (data.domain_tags) result.domainTags = data.domain_tags;
                        if (data.method_tags) result.methodTags = data.method_tags;
                        if (data.theory_tags) result.theoryTags = data.theory_tags;
                        if (data.pronouns) result.pronouns = data.pronouns;
                    }
                    
                    // Common fields
                    if (data.last_updated) result.lastUpdated = data.last_updated;
                    
                    return result;
                }
            } else if (fromFormat === 'unified' && toFormat === 'murmurations') {
                if (this.lenses.unifiedToMurm) {
                    return this.applyLensToDoc(this.lenses.unifiedToMurm, data);
                }
            } else if (fromFormat === 'murmurations' && toFormat === 'schemaorg') {
                // Convert via unified format
                const unified = this.convertSchema(data, 'murmurations', 'unified');
                return this.convertSchema(unified, 'unified', 'schemaorg');
            } else if (fromFormat === 'unified' && toFormat === 'schemaorg') {
                // Simple conversion to Schema.org
                const isOrganization = data['@type'] && data['@type'].includes('schema:Organization');
                
                const result = {
                    "@context": "https://schema.org/",
                    "@type": isOrganization ? "Organization" : "Person",
                    "name": data.name || data['schema:name'],
                    "url": data['murm:primary_url']
                };
                
                // Add location
                const locationData = data['schema:location'] || data['schema:homeLocation'];
                if (locationData) {
                    const locationKey = isOrganization ? 'location' : 'homeLocation';
                    result[locationKey] = {
                        "@type": "Place",
                        "addressLocality": locationData['schema:addressLocality'],
                        "addressRegion": locationData['schema:addressRegion'],
                        "addressCountry": locationData['schema:addressCountry']
                    };
                }
                
                console.log('🔄 Cambria Schema.org conversion result:', result);
                return result;
            } else if (fromFormat === 'murmurations' && toFormat === 'schemaorg') {
                // Direct conversion from Murmurations to Schema.org
                const isOrganization = data.linked_schemas && 
                    data.linked_schemas.some(schema => schema.includes('organizations_schema'));
                
                const result = {
                    "@context": "https://schema.org/",
                    "@type": isOrganization ? "Organization" : "Person",
                    "name": data.name,
                    "url": data.primary_url
                };
                
                // Add location
                if (data.locality) {
                    const locationKey = isOrganization ? 'location' : 'homeLocation';
                    result[locationKey] = {
                        "@type": "Place",
                        "addressLocality": data.locality,
                        "addressRegion": data.region,
                        "addressCountry": data.country_name
                    };
                }
                
                console.log('🔄 Cambria direct Murm→Schema.org conversion result:', result);
                return result;
            }
            
            // Fallback: return original data
            return data;
            
        } catch (error) {
            console.error('Cambria conversion error:', error);
            return data;
        }
    }
}

// Export for use in other scripts
window.CambriaBrowser = CambriaBrowser;
