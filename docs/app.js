// Regen Mapping - Interactive Schema Visualization
// Uses 3d-force-graph for the network visualization

class RegenMappingApp {
    constructor() {
        this.graph = null;
        this.globe = null;
        this.currentView = 'graph';
        this.currentProfile = null;
        this.currentSchema = 'murmurations';
        this.expandedNode = null;
        this.profiles = {};
        this.globePoints = [];
        this.schemaNodes = [];
        this.activeSchemaNode = null;
        this.cambria = new CambriaBrowser();
        this.cambriaReady = false;
        
        this.init();
    }

    async init() {
        try {
            // Note: Cambria lens initialization is optional since we're using pre-converted profiles
            console.log('🎯 Initializing app with pre-converted profiles...');
            this.cambriaReady = await this.cambria.initializeLenses();
            
            await this.loadProfiles();
            this.setupGraph();
            this.setupGlobe();
            this.setupEventListeners();
            this.hideLoading();
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to load data. Please try again later.');
        }
    }

    async loadProfiles() {
        // Try to load from Murmurations index first
        try {
            await this.loadFromMurmurationsIndex();
        } catch (error) {
            console.warn('Failed to load from Murmurations index:', error);
        }

        // Always try to load missing profiles from GitHub as fallback
        const expectedProfiles = ['dylan-tull', 'dr-karen-obrien', 'global-regenerative-cooperative'];
        const loadedProfiles = Object.keys(this.profiles);
        const missingProfiles = expectedProfiles.filter(expected => 
            !loadedProfiles.some(loaded => loaded.includes(expected.replace(/-/g, '')))
        );
        
        if (missingProfiles.length > 0) {
            console.log(`📁 Missing ${missingProfiles.length} profiles from Murmurations, loading from GitHub...`, missingProfiles);
            await this.loadFromGitHub();
        }

        if (Object.keys(this.profiles).length === 0) {
            throw new Error('No profiles could be loaded from any source');
        }
    }

    async loadFromMurmurationsIndex() {
        // Query the Murmurations test index for the basic Murmurations schemas
        const queries = [
            // Get all people profiles using the basic Murmurations people schema
            'https://test-index.murmurations.network/v2/nodes?schema=people_schema-v0.1.0',
            // Get all organization profiles using the basic Murmurations organizations schema
            'https://test-index.murmurations.network/v2/nodes?schema=organizations_schema-v1.0.0'
        ];

        // Our specific profile URLs to filter for
        const ourProfileUrls = [
            'https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/murmurations/murm-person-dylan-tull.json',
            'https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/murmurations/murm-person-karen-obrien.json',
            'https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/murmurations/murm-org-global-regenerative-coop.json'
        ];

        let foundProfiles = 0;
        
        for (const queryUrl of queries) {
            try {
                console.log(`🔍 Querying: ${queryUrl}`);
                const response = await fetch(queryUrl);
                if (response.ok) {
                    const result = await response.json();
                    console.log(`📊 Found ${result.data?.length || 0} profiles in total`);
                    
                    if (result.data && result.data.length > 0) {
                        // Filter for our specific profiles
                        const ourProfiles = result.data.filter(node => 
                            ourProfileUrls.some(url => node.profile_url.includes('DarrenZal/RegenMapping'))
                        );
                        
                        console.log(`📊 Found ${ourProfiles.length} of our profiles`);
                        foundProfiles += ourProfiles.length;
                        
                        // Load our filtered profiles
                        for (const node of ourProfiles) {
                            try {
                                console.log(`🔍 Loading profile from: ${node.profile_url}`);
                                const profileResponse = await fetch(node.profile_url);
                                if (profileResponse.ok) {
                                    const profile = await profileResponse.json();
                                    const id = this.generateProfileId(profile.name);
                                    
                                    // Skip if we already have this profile
                                    if (this.profiles[id]) continue;
                                    
                                    // Load pre-converted profiles instead of doing conversion
                                    const unifiedProfile = await this.loadPreConvertedProfile(profile.name, 'unified');
                                    const schemaOrgProfile = await this.loadPreConvertedProfile(profile.name, 'schemaorg');
                                    
                                    this.profiles[id] = {
                                        murmurations: profile,
                                        unified: unifiedProfile,
                                        schemaorg: schemaOrgProfile
                                    };
                                    
                                    console.log(`✅ Loaded from Murmurations: ${profile.name}`);
                                    console.log(`📊 Profile formats loaded:`, {
                                        murm_name: profile.name,
                                        unified_name: unifiedProfile?.name,
                                        schemaorg_name: schemaOrgProfile?.name
                                    });
                                } else {
                                    console.warn(`❌ Failed to load profile from ${node.profile_url}: ${profileResponse.status} ${profileResponse.statusText}`);
                                }
                            } catch (profileError) {
                                console.warn(`❌ Failed to load individual profile from ${node.profile_url}:`, profileError);
                            }
                        }
                    }
                }
            } catch (error) {
                console.warn(`Failed to query Murmurations for ${queryUrl}:`, error);
            }
        }
        
        if (foundProfiles > 0) {
            this.showSuccessMessage(`🎉 Successfully received ${foundProfiles} profiles from Murmurations index!`);
        }
        
        console.log(`🎉 Total profiles loaded from Murmurations index: ${Object.keys(this.profiles).length}`);
    }

    async loadFromGitHub() {
        // Fallback: Load the Murmurations profiles from the repository
        const profileUrls = [
            'https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/murmurations/murm-person-dylan-tull.json',
            'https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/murmurations/murm-person-karen-obrien.json',
            'https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/murmurations/murm-org-global-regenerative-coop.json'
        ];

        for (const url of profileUrls) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const profile = await response.json();
                    const id = this.generateProfileId(profile.name);
                    
                    // Skip if we already have this profile
                    if (this.profiles[id]) {
                        console.log(`⏭️ Skipping duplicate profile: ${profile.name}`);
                        continue;
                    }
                    
                    // Load pre-converted profiles instead of doing conversion
                    const unifiedProfile = await this.loadPreConvertedProfile(profile.name, 'unified');
                    const schemaOrgProfile = await this.loadPreConvertedProfile(profile.name, 'schemaorg');
                    
                    this.profiles[id] = {
                        murmurations: profile,
                        unified: unifiedProfile,
                        schemaorg: schemaOrgProfile
                    };
                    
                    console.log(`✅ Loaded from GitHub: ${profile.name}`);
                    console.log(`📊 Profile formats loaded:`, {
                        murm_name: profile.name,
                        unified_name: unifiedProfile?.name,
                        schemaorg_name: schemaOrgProfile?.name
                    });
                }
            } catch (error) {
                console.warn(`Failed to load profile from ${url}:`, error);
            }
        }
    }

    generateProfileId(name) {
        return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    }

    extractProfileId(url) {
        return url.split('/').pop().replace('.json', '');
    }

    /**
     * Load pre-converted profile from the profiles directory
     */
    async loadPreConvertedProfile(profileName, format) {
        try {
            const baseUrl = 'https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles';
            
            // Map profile names to file patterns
            const nameToFile = {
                'Dylan Tull': 'dylan-tull',
                'Dr. Karen O\'Brien': 'karen-obrien',
                'Global Regenerative Cooperative': 'global-regenerative-coop'
            };
            
            const fileBase = nameToFile[profileName];
            if (!fileBase) {
                console.warn(`No file mapping found for profile: ${profileName}`);
                return null;
            }
            
            // Determine profile type and construct URL
            let profileUrl;
            if (format === 'unified') {
                const profileType = profileName === 'Global Regenerative Cooperative' ? 'org' : 'person';
                profileUrl = `${baseUrl}/unified/regen-${profileType}-${fileBase}.jsonld`;
            } else if (format === 'schemaorg') {
                const profileType = profileName === 'Global Regenerative Cooperative' ? 'org' : 'person';
                profileUrl = `${baseUrl}/schemaorg/schemaorg-${profileType}-${fileBase}.json`;
            } else {
                console.warn(`Unsupported format: ${format}`);
                return null;
            }
            
            console.log(`📥 Loading ${format} profile: ${profileUrl}`);
            const response = await fetch(profileUrl);
            
            if (response.ok) {
                const profile = await response.json();
                console.log(`✅ Loaded ${format} profile for ${profileName}`);
                return profile;
            } else {
                console.warn(`Failed to load ${format} profile for ${profileName}: ${response.status}`);
                return null;
            }
        } catch (error) {
            console.warn(`Error loading ${format} profile for ${profileName}:`, error);
            return null;
        }
    }

    /**
     * Show temporary success message
     */
    showSuccessMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'success-message';
        messageDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #2ecc71;
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 9999;
                font-weight: 500;
                max-width: 400px;
            ">
                ${message}
            </div>
        `;
        
        document.body.appendChild(messageDiv);
        
        // Remove message after 4 seconds
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 4000);
    }

    // Note: Conversion functions removed - now using pre-converted profiles from /profiles directory
    // This provides faster loading and avoids browser compatibility issues with complex Cambria lenses



    setupGraph() {
        const graphData = this.generateGraphData();
        
        this.graph = ForceGraph3D()
            (document.getElementById('graph'))
            .graphData(graphData)
            .nodeLabel('name')
            .nodeColor(node => this.getNodeColor(node))
            .nodeVal(node => node.size || 4)
            .linkColor(link => this.getLinkColor(link))
            .linkWidth(2)
            .linkLabel(link => link.label || '')
            .linkDirectionalArrowLength(link => link.type && link.type !== 'schema-link' && link.type !== 'lens' ? 3 : 0)
            .linkDirectionalArrowRelPos(0.8) // Position arrows closer to target to avoid overlap
            .linkDirectionalArrowColor(() => 'rgba(255, 255, 255, 0.8)')
            .backgroundColor('rgba(0,0,0,0)')
            .onNodeClick(this.handleNodeClick.bind(this))
            .onNodeDragEnd(node => {
                node.fx = node.x;
                node.fy = node.y;
                node.fz = node.z;
            });

        // Set initial camera position (no auto-rotation)
        this.graph.cameraPosition({ z: 300 });
    }

    setupGlobe() {
        // Convert profiles to Globe.gl format
        this.globePoints = this.convertProfilesToGlobeData();
        
        this.globe = Globe()
            .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
            .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
            .backgroundColor('rgba(0,0,0,0)')
            (document.getElementById('globe'));

        // Add profile points
        this.globe
            .pointsData(this.globePoints)
            .pointLat('lat')
            .pointLng('lng')
            .pointAltitude('altitude')
            .pointRadius('radius')
            .pointColor('color')
            .pointLabel(point => `
                <div style="
                    padding: 8px 12px;
                    background: rgba(0,0,0,0.8);
                    color: white;
                    border-radius: 4px;
                    font-family: sans-serif;
                    max-width: 200px;
                ">
                    <strong>${point.name}</strong><br/>
                    ${point.title ? `${point.title}<br/>` : ''}
                    ${point.organization ? `${point.organization}<br/>` : ''}
                    ${point.location ? `📍 ${point.location}` : ''}
                </div>
            `)
            .onPointClick(this.handleGlobePointClick.bind(this));

        // Add relationship arcs
        const arcs = this.generateGlobeArcs();
        this.globe
            .arcsData(arcs)
            .arcStartLat('startLat')
            .arcStartLng('startLng')
            .arcEndLat('endLat')
            .arcEndLng('endLng')
            .arcColor(() => 'rgba(255, 255, 255, 0.4)')
            .arcStroke(1)
            .arcAltitude(0.3)
            .arcLabel('label');

        // Set initial camera position
        this.globe.pointOfView({ lat: 20, lng: 0, altitude: 2 });
    }

    convertProfilesToGlobeData() {
        const globePoints = [];
        
        Object.keys(this.profiles).forEach(profileId => {
            const profile = this.profiles[profileId];
            
            // Convert Murmurations profile to Globe.gl format
            const murmPoint = this.convertMurmurationsToGlobe(profile.murmurations, profileId);
            if (murmPoint && murmPoint.lat && murmPoint.lng) {
                globePoints.push(murmPoint);
            }
        });
        
        return globePoints;
    }

    convertMurmurationsToGlobe(murmProfile, profileId) {
        // Manual conversion based on Cambria lens logic
        if (!murmProfile.geolocation) return null;
        
        const isOrganization = murmProfile.linked_schemas && 
            murmProfile.linked_schemas.some(schema => schema.includes('organizations_schema'));
        
        return {
            lat: murmProfile.geolocation.lat,
            lng: murmProfile.geolocation.lon,
            name: murmProfile.name,
            url: murmProfile.primary_url,
            color: isOrganization ? '#e67e22' : '#3498db', // Orange for orgs, blue for people
            altitude: 0.1,
            radius: isOrganization ? 0.4 : 0.3,
            title: murmProfile.current_title,
            organization: murmProfile.current_org_id,
            location: murmProfile.locality,
            country: murmProfile.country_name,
            bioregion: murmProfile.bioregion,
            type: isOrganization ? 'organization' : 'person',
            schemas: murmProfile.linked_schemas,
            profileId: profileId,
            originalProfile: murmProfile
        };
    }

    generateGlobeArcs() {
        const arcs = [];
        const processedRelationships = new Set();
        
        this.globePoints.forEach(point => {
            const profile = point.originalProfile;
            const relationships = profile.relationships || [];
            
            relationships.forEach(rel => {
                const targetUrl = rel.object_url || rel.target;
                
                // Find target point  
                const targetPoint = this.globePoints.find(p => {
                    const targetProfile = p.originalProfile;
                    return targetProfile.primary_url === targetUrl || 
                           targetProfile.name === targetUrl;
                });
                
                if (targetPoint) {
                    const arcKey = [point.name, targetPoint.name].sort().join('-');
                    if (!processedRelationships.has(arcKey)) {
                        processedRelationships.add(arcKey);
                        
                        // Create a readable label for the relationship
                        const relationType = rel.predicate_url || rel.type || 'connection';
                        const label = this.formatRelationshipLabel(relationType, point.name, targetPoint.name);
                        
                        arcs.push({
                            startLat: point.lat,
                            startLng: point.lng,
                            endLat: targetPoint.lat,
                            endLng: targetPoint.lng,
                            type: relationType,
                            label: label,
                            description: rel.description || ''
                        });
                    }
                }
            });
        });
        
        return arcs;
    }

    formatRelationshipLabel(relationType, sourceName, targetName) {
        // Create human-readable labels for different relationship types
        const relationshipLabels = {
            'member': 'Member of',
            'collaboration': 'Collaborates with',
            'advisor': 'Advises',
            'partnership': 'Partners with',
            'employment': 'Works for',
            'funding': 'Funds',
            'mentorship': 'Mentors',
            'affiliation': 'Affiliated with',
            'connection': 'Connected to'
        };
        
        // Get readable label or fallback to the original type
        const readableType = relationshipLabels[relationType.toLowerCase()] || 
                           relationType.replace(/([A-Z])/g, ' $1').toLowerCase() || 
                           'Connected to';
        
        // For shorter names, show the full relationship
        const shortSource = sourceName.length > 15 ? sourceName.substring(0, 12) + '...' : sourceName;
        const shortTarget = targetName.length > 15 ? targetName.substring(0, 12) + '...' : targetName;
        
        return `${shortSource} → ${readableType} → ${shortTarget}`;
    }

    handleGlobePointClick(point) {
        // Find the full profile data
        const fullProfile = this.profiles[point.profileId];
        if (fullProfile) {
            this.showProfile(fullProfile);
        }
    }

    setCurrentView(view) {
        this.currentView = view;
        
        if (view === 'globe' && this.globe) {
            // Refresh globe when switching to it
            setTimeout(() => {
                this.globe.controls().autoRotate = false;
            }, 100);
        }
    }

    generateGraphData() {
        const nodes = [];
        const links = [];
        const processedRelationships = new Set();

        // Create main profile nodes
        Object.keys(this.profiles).forEach(profileId => {
            const profile = this.profiles[profileId];
            nodes.push({
                id: profileId,
                name: profile.murmurations.name,
                type: 'profile',
                size: 8,
                profile: profile
            });
        });

        // Create links based on relationships in the profiles
        Object.keys(this.profiles).forEach(profileId => {
            const profile = this.profiles[profileId];
            const relationships = profile.murmurations.relationships || [];
            
            relationships.forEach(rel => {
                console.log(`🔍 Processing relationship:`, rel);
                
                // Handle both old format (rel.target) and new format (rel.object_url)
                let targetUrl = rel.object_url || rel.target;
                
                // Find the target profile by matching URL or name
                const targetProfileId = Object.keys(this.profiles).find(id => {
                    const targetProfile = this.profiles[id].murmurations;
                    
                    // Match by primary_url if object_url is a URL
                    if (targetUrl && (targetUrl.startsWith('http://') || targetUrl.startsWith('https://'))) {
                        return targetProfile.primary_url === targetUrl;
                    }
                    
                    // Match by name if object_url is a name
                    return targetProfile.name === targetUrl;
                });
                
                if (targetProfileId) {
                    console.log(`✅ Found relationship target: ${targetUrl} -> ${targetProfileId}`);
                    // Create a unique key for this relationship to avoid duplicates
                    const relationshipKey = [profileId, targetProfileId].sort().join('-');
                    
                    if (!processedRelationships.has(relationshipKey)) {
                        processedRelationships.add(relationshipKey);
                        
                        links.push({
                            source: profileId,
                            target: targetProfileId,
                            type: rel.predicate_url || rel.type || 'connection',
                            description: rel.description || `${rel.predicate_url || rel.type || 'Connected'}`,
                            label: rel.predicate_url || rel.type || 'Connected'
                        });
                        
                        console.log(`✅ Created link: ${profileId} -> ${targetProfileId}`);
                    }
                } else {
                    console.log(`⚠️ Target profile not found for: ${targetUrl} (this is normal for external references)`);
                }
            });
        });

        return { nodes, links };
    }

    getNodeColor(node) {
        if (node.type === 'schema') {
            // Active schema node is green, others are light gray
            if (node.id === this.activeSchemaNode) {
                return '#2ecc71'; // Green for active schema
            } else {
                return '#bdc3c7'; // Light gray for inactive schemas
            }
        }
        
        if (node.type === 'profile') {
            // Determine if this is an organization or person
            const isOrganization = node.profile && node.profile.murmurations.linked_schemas && 
                node.profile.murmurations.linked_schemas.some(schema => schema.includes('organizations_schema'));
            
            if (node.id === this.expandedNode) {
                // Active profile colors - dark blue for both people and organizations
                return '#2980b9'; // Dark blue for active profiles
            } else {
                // Inactive profile colors - light blue for both people and organizations
                return '#85c1e9'; // Light blue for inactive profiles
            }
        }
        
        return '#9b59b6'; // Fallback purple
    }

    getLinkColor(link) {
        // Handle schema transformation flow
        if (link.type === 'lens' && this.activeSchemaNode) {
            // Check if this link connects to the active schema node
            if (link.target.id === this.activeSchemaNode || link.source.id === this.activeSchemaNode) {
                return '#2ecc71'; // Green flow to/from active schema
            }
        }
        
        const colors = {
            'member': '#2ecc71',      // Green for membership
            'advisor': '#3498db',     // Blue for advisory
            'collaboration': '#e67e22', // Orange for collaboration
            'schema-link': 'rgba(255, 255, 255, 0.4)',
            'lens': 'rgba(255, 255, 255, 0.3)' // Dimmer for inactive lens connections
        };
        return colors[link.type] || 'rgba(255, 255, 255, 0.6)';
    }

    handleNodeClick(node) {
        if (node.type === 'schema') {
            this.handleSchemaNodeClick(node);
        } else if (node.type === 'profile') {
            this.handleProfileNodeClick(node);
        }
    }

    handleProfileNodeClick(node) {
        if (this.expandedNode === node.id) {
            // Collapse the node
            this.collapseNode();
        } else {
            // Expand the node
            this.expandNode(node);
        }
        
        this.showProfile(node.profile);
    }

    handleSchemaNodeClick(schemaNode) {
        // Set the active schema node for visual flow effect
        this.activeSchemaNode = schemaNode.id;
        this.currentSchema = schemaNode.schema;
        this.updateSchemaButtons();
        
        // Update the graph colors to show the flow
        this.updateGraphColors();
        
        if (this.currentProfile) {
            this.displayProfile(this.currentProfile, this.currentSchema);
        }
    }

    expandNode(node) {
        // Remove existing schema nodes
        this.collapseNode();
        
        this.expandedNode = node.id;
        
        // Set the default active schema to murmurations
        this.activeSchemaNode = `${node.id}-murmurations`;
        
        // Create schema nodes around the main node
        const schemaTypes = ['murmurations', 'unified', 'schemaorg'];
        const radius = 30;
        
        schemaTypes.forEach((schema, index) => {
            const angle = (index * 2 * Math.PI) / schemaTypes.length;
            const schemaNode = {
                id: `${node.id}-${schema}`,
                name: schema.charAt(0).toUpperCase() + schema.slice(1),
                type: 'schema',
                schema: schema,
                size: 4,
                fx: node.x + radius * Math.cos(angle),
                fy: node.y + radius * Math.sin(angle),
                fz: node.z
            };
            
            this.schemaNodes.push(schemaNode);
        });

        // Create links between main node and schema nodes
        const schemaLinks = this.schemaNodes.map(schemaNode => ({
            source: node.id,
            target: schemaNode.id,
            type: 'schema-link'
        }));

        // Create links between schema nodes (representing Cambria lenses) with descriptive labels
        const lensLinks = [
            { 
                source: `${node.id}-murmurations`, 
                target: `${node.id}-unified`, 
                type: 'lens',
                label: 'lens: murmurations→unified'
            },
            { 
                source: `${node.id}-unified`, 
                target: `${node.id}-schemaorg`, 
                type: 'lens',
                label: 'lens: unified→schemaorg'
            },
            { 
                source: `${node.id}-murmurations`, 
                target: `${node.id}-schemaorg`, 
                type: 'lens',
                label: 'lens: murmurations→schemaorg'
            }
        ];

        // Update graph data
        const currentData = this.graph.graphData();
        this.graph.graphData({
            nodes: [...currentData.nodes, ...this.schemaNodes],
            links: [...currentData.links, ...schemaLinks, ...lensLinks]
        });
        
        // Update colors to show the default active schema
        this.updateGraphColors();
    }

    collapseNode() {
        if (!this.expandedNode) return;
        
        const currentData = this.graph.graphData();
        
        // Remove schema nodes and their links
        const filteredNodes = currentData.nodes.filter(n => 
            !this.schemaNodes.some(sn => sn.id === n.id)
        );
        
        const filteredLinks = currentData.links.filter(l => 
            !this.schemaNodes.some(sn => sn.id === l.source.id || sn.id === l.target.id) &&
            l.type !== 'schema-link' && l.type !== 'lens'
        );
        
        this.graph.graphData({
            nodes: filteredNodes,
            links: filteredLinks
        });
        
        this.schemaNodes = [];
        this.expandedNode = null;
    }

    showProfile(profile) {
        this.currentProfile = profile;
        // Add Globe.gl schema to the profile if it doesn't exist
        if (!profile.globegl) {
            profile.globegl = this.convertMurmurationsToGlobe(profile.murmurations, 'temp-id');
        }
        this.displayProfile(profile, this.currentSchema);
        this.openSidebar();
    }

    displayProfile(profile, schema) {
        const data = profile[schema];
        const content = document.getElementById('profile-content');
        
        let html = `
            <div class="profile-header">
                <h2>${this.getDisplayName(data)}</h2>
                <div class="subtitle">${schema.charAt(0).toUpperCase() + schema.slice(1)} Schema Format</div>
            </div>
        `;

        // Display fields based on schema type
        if (schema === 'murmurations') {
            html += this.renderMurmurationsFields(data);
        } else if (schema === 'unified') {
            html += this.renderUnifiedFields(data);
        } else if (schema === 'schemaorg') {
            html += this.renderSchemaOrgFields(data);
        } else if (schema === 'globegl') {
            html += this.renderGlobeGlFields(data);
        }

        content.innerHTML = html;
    }

    getDisplayName(data) {
        return data.name || 'Unknown';
    }

    renderMurmurationsFields(data) {
        let html = '';
        
        if (data.primary_url) {
            html += this.renderField('Primary URL', `<a href="${data.primary_url}" target="_blank">${data.primary_url}</a>`);
        }
        
        if (data.current_title) {
            html += this.renderField('Current Title', data.current_title);
        }
        
        if (data.current_org_id) {
            html += this.renderField('Current Organization', data.current_org_id);
        }
        
        if (data.locality) {
            html += this.renderField('Location', `${data.locality}, ${data.region || ''} ${data.country_name || ''}`.trim());
        }
        
        if (data.bioregion) {
            html += this.renderField('Bioregion', data.bioregion);
        }
        
        if (data.tags && data.tags.length > 0) {
            html += this.renderField('Tags', data.tags.join(', '));
        }
        
        if (data.method_tags && data.method_tags.length > 0) {
            html += this.renderField('Method Tags', data.method_tags.join(', '));
        }
        
        if (data.domain_tags && data.domain_tags.length > 0) {
            html += this.renderField('Domain Tags', data.domain_tags.join(', '));
        }
        
        if (data.offers && data.offers.length > 0) {
            html += this.renderField('Offers', data.offers.join(', '));
        }
        
        if (data.needs && data.needs.length > 0) {
            html += this.renderField('Needs', data.needs.join(', '));
        }
        
        if (data.skills && data.skills.length > 0) {
            html += this.renderField('Skills', data.skills.join(', '));
        }
        
        // Organization-specific fields
        if (data.key_activities && data.key_activities.length > 0) {
            html += this.renderField('Key Activities', data.key_activities.join(', '));
        }
        
        if (data.sdg_focus && data.sdg_focus.length > 0) {
            html += this.renderField('SDG Focus', data.sdg_focus.join(', '));
        }
        
        if (data.employee_range) {
            html += this.renderField('Employee Range', data.employee_range);
        }
        
        if (data.geolocation) {
            html += this.renderField('Coordinates', `${data.geolocation.lat}, ${data.geolocation.lon}`);
        }
        
        // Schema information
        if (data.linked_schemas && data.linked_schemas.length > 0) {
            html += this.renderField('Linked Schemas', data.linked_schemas.join(', '));
        }

        if (data.relationships && data.relationships.length > 0) {
            const relationshipsHtml = data.relationships.map((rel, index) => {
                const targetUrl = rel.object_url || rel.target || 'Unknown';
                const relationType = rel.predicate_url || rel.type || 'connected to';
                const description = rel.description || '';
                
                // Try to find the display name for the target
                const targetProfile = Object.values(this.profiles).find(p => 
                    p.murmurations.primary_url === targetUrl ||
                    p.murmurations.name === targetUrl ||
                    (targetUrl.startsWith('http') && p.murmurations.primary_url?.replace(/^https?:\/\/(www\.)?/, '') === targetUrl.replace(/^https?:\/\/(www\.)?/, ''))
                );
                const displayName = targetProfile?.murmurations.name || targetUrl;
                
                return `<div class="relationship-item">
                    <strong>${relationType}</strong>: <a href="#" class="profile-link" data-target="${targetUrl}">${displayName}</a>
                    ${description ? `<br><em>${description}</em>` : ''}
                </div>`;
            }).join('');
            html += this.renderField('Relationships', relationshipsHtml);
        }
        
        // Source information
        if (data.source_url) {
            html += this.renderField('Source URL', `<a href="${data.source_url}" target="_blank">${data.source_url}</a>`);
        }

        // Add profile source link
        html += this.renderProfileSource(data.name);

        return html;
    }

    renderUnifiedFields(data) {
        let html = '';
        
        // Handle URL field (unified schema uses primary_url)
        if (data.primary_url) {
            html += this.renderField('Primary URL', `<a href="${data.primary_url}" target="_blank">${data.primary_url}</a>`);
        }
        
        // Location information
        if (data.locality) {
            const location = [data.locality, data.region, data.country_name].filter(Boolean).join(', ');
            html += this.renderField('Location', location);
        }
        
        // Person-specific fields
        if (data.headline) {
            html += this.renderField('Headline', data.headline);
        }
        
        if (data.currentTitle) {
            html += this.renderField('Current Title', data.currentTitle);
        }
        
        if (data.currentOrgId) {
            html += this.renderField('Current Organization', data.currentOrgId);
        }
        
        if (data.displayHandle) {
            html += this.renderField('Handle', data.displayHandle);
        }
        
        // Organization-specific fields
        if (data.tagline) {
            html += this.renderField('Tagline', data.tagline);
        }
        
        if (data.mission) {
            html += this.renderField('Mission', data.mission);
        }
        
        if (data.legalType) {
            html += this.renderField('Legal Type', data.legalType);
        }
        
        if (data.foundedYear) {
            html += this.renderField('Founded', data.foundedYear);
        }
        
        if (data.employeeRange) {
            html += this.renderField('Employee Range', data.employeeRange);
        }
        
        // Tags and categories
        if (data.tags && data.tags.length > 0) {
            html += this.renderField('Tags', data.tags.join(', '));
        }
        
        if (data.domainTags && data.domainTags.length > 0) {
            html += this.renderField('Domain Tags', data.domainTags.join(', '));
        }
        
        if (data.methodTags && data.methodTags.length > 0) {
            html += this.renderField('Method Tags', data.methodTags.join(', '));
        }
        
        if (data.theoryTags && data.theoryTags.length > 0) {
            html += this.renderField('Theory Tags', data.theoryTags.join(', '));
        }
        
        if (data.sdgFocus && data.sdgFocus.length > 0) {
            html += this.renderField('SDG Focus', data.sdgFocus.join(', '));
        }
        
        if (data.keyActivities && data.keyActivities.length > 0) {
            html += this.renderField('Key Activities', data.keyActivities.join(', '));
        }
        
        // Person-specific capability fields
        if (data.offers && data.offers.length > 0) {
            html += this.renderField('Offers', data.offers.join(', '));
        }
        
        if (data.needs && data.needs.length > 0) {
            html += this.renderField('Needs', data.needs.join(', '));
        }
        
        if (data.skills && data.skills.length > 0) {
            html += this.renderField('Skills', data.skills.join(', '));
        }
        
        // Geographic information
        if (data.bioregion) {
            html += this.renderField('Bioregion', data.bioregion);
        }
        if (data.geolocation) {
            html += this.renderField('Coordinates', `${data.geolocation.latitude}, ${data.geolocation.longitude}`);
        }
        
        // Schema information
        if (data['@type']) {
            html += this.renderField('Type', Array.isArray(data['@type']) ? data['@type'].join(', ') : data['@type']);
        }
        
        if (data.linked_schemas && data.linked_schemas.length > 0) {
            html += this.renderField('Linked Schemas', data.linked_schemas.join(', '));
        }
        
        // Relationships
        if (data.relationships && data.relationships.length > 0) {
            const relationshipsHtml = data.relationships.map(rel => {
                const targetUrl = rel.object_url || rel.target || 'Unknown';
                const relationType = rel.predicate_url || rel.type || 'connected to';
                const description = rel.description || '';
                
                // Try to find the display name for the target
                const targetProfile = Object.values(this.profiles).find(p => 
                    p.murmurations.primary_url === targetUrl ||
                    p.murmurations.name === targetUrl ||
                    (targetUrl.startsWith('http') && p.murmurations.primary_url?.replace(/^https?:\/\/(www\.)?/, '') === targetUrl.replace(/^https?:\/\/(www\.)?/, ''))
                );
                const displayName = targetProfile?.murmurations.name || targetUrl;
                
                return `<div class="relationship-item">
                    <strong>${relationType}</strong>: <a href="#" class="profile-link" data-target="${targetUrl}">${displayName}</a>
                    ${description ? `<br><em>${description}</em>` : ''}
                </div>`;
            }).join('');
            html += this.renderField('Relationships', relationshipsHtml);
        }
        
        // Metadata
        if (data.lastUpdated) {
            html += this.renderField('Last Updated', new Date(data.lastUpdated).toLocaleDateString());
        }

        // Add profile source link
        html += this.renderProfileSource(this.getDisplayName(data));

        return html;
    }

    renderSchemaOrgFields(data) {
        let html = '';
        
        if (data.url) {
            html += this.renderField('URL', `<a href="${data.url}" target="_blank">${data.url}</a>`);
        }
        
        // Person-specific fields
        if (data.givenName) {
            html += this.renderField('Given Name', data.givenName);
        }
        
        if (data.familyName) {
            html += this.renderField('Family Name', data.familyName);
        }
        
        if (data.jobTitle) {
            html += this.renderField('Job Title', data.jobTitle);
        }
        
        if (data.email) {
            html += this.renderField('Email', `<a href="mailto:${data.email}">${data.email}</a>`);
        }
        
        // Show extension fields with regen: namespace from unified→schemaorg conversion
        if (data['regen:headline']) {
            html += this.renderField('Headline', data['regen:headline']);
        }
        
        if (data['regen:currentTitle']) {
            html += this.renderField('Current Title', data['regen:currentTitle']);
        }
        
        if (data['regen:tags'] && data['regen:tags'].length > 0) {
            html += this.renderField('Tags', data['regen:tags'].join(', '));
        }
        
        if (data['regen:domainTags'] && data['regen:domainTags'].length > 0) {
            html += this.renderField('Domain Tags', data['regen:domainTags'].join(', '));
        }
        
        if (data['regen:methodTags'] && data['regen:methodTags'].length > 0) {
            html += this.renderField('Method Tags', data['regen:methodTags'].join(', '));
        }
        
        if (data['regen:skills'] && data['regen:skills'].length > 0) {
            html += this.renderField('Skills', data['regen:skills'].join(', '));
        }
        
        if (data['regen:offers'] && data['regen:offers'].length > 0) {
            html += this.renderField('Offers', data['regen:offers'].join(', '));
        }
        
        if (data['regen:needs'] && data['regen:needs'].length > 0) {
            html += this.renderField('Needs', data['regen:needs'].join(', '));
        }
        
        if (data['regen:bioregion']) {
            html += this.renderField('Bioregion', data['regen:bioregion']);
        }
        
        if (data['regen:theoryTags'] && data['regen:theoryTags'].length > 0) {
            html += this.renderField('Theory Tags', data['regen:theoryTags'].join(', '));
        }
        
        if (data['regen:currentOrgId']) {
            html += this.renderField('Current Organization', data['regen:currentOrgId']);
        }
        
        if (data['regen:displayHandle']) {
            html += this.renderField('Handle', data['regen:displayHandle']);
        }
        
        // Standard Schema.org address fields
        if (data.addressLocality || data.addressRegion || data.addressCountry) {
            const address = [data.addressLocality, data.addressRegion, data.addressCountry].filter(Boolean).join(', ');
            html += this.renderField('Address', address);
        }
        
        if (data.knowsAbout && data.knowsAbout.length > 0) {
            html += this.renderField('Knows About', Array.isArray(data.knowsAbout) ? data.knowsAbout.join(', ') : data.knowsAbout);
        }
        
        // Organization-specific fields
        if (data.legalName) {
            html += this.renderField('Legal Name', data.legalName);
        }
        
        if (data.foundingDate) {
            html += this.renderField('Founding Date', data.foundingDate);
        }
        
        if (data.numberOfEmployees) {
            html += this.renderField('Number of Employees', data.numberOfEmployees);
        }
        
        // Geographic information
        if (data['regen:geolocation']) {
            const geo = data['regen:geolocation'];
            html += this.renderField('Coordinates', `${geo.latitude || geo.lat}, ${geo.longitude || geo.lon}`);
        }
        
        // Schema metadata
        if (data['regen:linked_schemas'] && data['regen:linked_schemas'].length > 0) {
            html += this.renderField('Linked Schemas', data['regen:linked_schemas'].join(', '));
        }
        
        // Relationships
        if (data['regen:relationships'] && data['regen:relationships'].length > 0) {
            const relationshipsHtml = data['regen:relationships'].map(rel => {
                const targetUrl = rel.object_url || rel.target_url || rel.target || 'Unknown';
                const relationType = rel.predicate_url || rel.type || 'connected to';
                const description = rel.description || '';
                
                // Try to find the display name for the target
                const targetProfile = Object.values(this.profiles).find(p => 
                    p.murmurations.primary_url === targetUrl ||
                    p.murmurations.name === targetUrl ||
                    (targetUrl.startsWith('http') && p.murmurations.primary_url?.replace(/^https?:\/\/(www\.)?/, '') === targetUrl.replace(/^https?:\/\/(www\.)?/, ''))
                );
                const displayName = targetProfile?.murmurations.name || targetUrl;
                
                return `<div class="relationship-item">
                    <strong>${relationType}</strong>: <a href="#" class="profile-link" data-target="${targetUrl}">${displayName}</a>
                    ${description ? `<br><em>${description}</em>` : ''}
                </div>`;
            }).join('');
            html += this.renderField('Relationships', relationshipsHtml);
        }
        
        // Knowledge/interests
        if (data.knowsAbout && data.knowsAbout.length > 0) {
            html += this.renderField('Knows About', Array.isArray(data.knowsAbout) ? data.knowsAbout.join(', ') : data.knowsAbout);
        }
        
        // Handle both structured (homeLocation/location) and flat (addressLocality) location fields
        const locationData = data.homeLocation || data.location;
        let locationStr = '';
        
        if (locationData) {
            // Structured location object
            locationStr = [
                locationData.addressLocality,
                locationData.addressRegion,
                locationData.addressCountry
            ].filter(Boolean).join(', ');
        } else {
            // Flat location fields from lens conversion
            locationStr = [
                data.addressLocality,
                data.addressRegion,
                data.addressCountry
            ].filter(Boolean).join(', ');
        }
        
        if (locationStr) {
            const locationLabel = data['@type'] === 'Organization' ? 'Location' : 'Home Location';
            html += this.renderField(locationLabel, locationStr);
        }
        
        // Work/affiliation information
        if (data.worksFor) {
            const orgName = typeof data.worksFor === 'object' ? data.worksFor.name : data.worksFor;
            html += this.renderField('Works For', orgName);
        }
        
        if (data.alumniOf) {
            const schoolName = typeof data.alumniOf === 'object' ? data.alumniOf.name : data.alumniOf;
            html += this.renderField('Alumni Of', schoolName);
        }
        
        if (data['@type']) {
            html += this.renderField('Schema Type', data['@type']);
        }
        
        // Show source_url if available (for debugging lossless conversion)
        if (data.source_url) {
            html += this.renderField('Source URL', `<a href="${data.source_url}" target="_blank" style="font-size: 0.8em;">View Original Unified Profile</a>`);
        }

        // Add profile source link
        html += this.renderProfileSource(data.name);

        return html;
    }

    renderGlobeGlFields(data) {
        let html = '';
        
        // Core geographic coordinates (required by Globe.gl)
        if (data.lat !== undefined && data.lng !== undefined) {
            html += this.renderField('Geographic Coordinates', `${data.lat}, ${data.lng}`);
        }
        
        // Essential display information
        if (data.name) {
            html += this.renderField('Name', data.name);
        }
        
        if (data.url) {
            html += this.renderField('URL', `<a href="${data.url}" target="_blank">${data.url}</a>`);
        }
        
        // Visual properties for Globe.gl
        if (data.color) {
            html += this.renderField('Marker Color', `<span style="display:inline-block;width:20px;height:20px;background:${data.color};border-radius:50%;margin-right:8px;vertical-align:middle;"></span>${data.color}`);
        }
        
        if (data.altitude !== undefined) {
            html += this.renderField('Altitude', data.altitude.toString());
        }
        
        if (data.radius !== undefined) {
            html += this.renderField('Marker Radius', data.radius.toString());
        }
        
        // Profile metadata
        if (data.title) {
            html += this.renderField('Title', data.title);
        }
        
        if (data.organization) {
            html += this.renderField('Organization', data.organization);
        }
        
        if (data.location) {
            html += this.renderField('Location', data.location);
        }
        
        if (data.country) {
            html += this.renderField('Country', data.country);
        }
        
        if (data.bioregion) {
            html += this.renderField('Bioregion', data.bioregion);
        }
        
        // Profile type indicator
        if (data.type) {
            const typeIcon = data.type === 'organization' ? '🏢' : '👤';
            html += this.renderField('Type', `${typeIcon} ${data.type.charAt(0).toUpperCase() + data.type.slice(1)}`);
        }
        
        // Schema information
        if (data.schemas && data.schemas.length > 0) {
            html += this.renderField('Source Schemas', data.schemas.join(', '));
        }
        
        // Profile reference
        if (data.profileId) {
            html += this.renderField('Profile Source', data.profileId);
        }
        
        // Technical information
        html += `
            <div class="field-group">
                <div class="field-label">Globe.gl Schema Info</div>
                <div class="field-value" style="font-family: monospace; font-size: 0.9em;">
                    This format is optimized for 3D globe visualization.<br/>
                    • <strong>lat/lng:</strong> Required coordinates<br/>
                    • <strong>color:</strong> Marker appearance<br/>
                    • <strong>altitude/radius:</strong> 3D positioning<br/>
                    • <strong>Interactive:</strong> Click to view full profile
                </div>
            </div>
        `;
        
        // Show conversion source
        const conversionInfo = data.profileId === 'temp-id' ? 
            'Real-time conversion from Murmurations schema' : 
            'Converted via Cambria lens';
        html += this.renderField('Conversion Method', conversionInfo);

        return html;
    }

    renderField(label, value) {
        return `
            <div class="field-group">
                <div class="field-label">${label}</div>
                <div class="field-value">${value}</div>
            </div>
        `;
    }

    renderProfileSource(profileName) {
        console.log(`🔍 renderProfileSource called with name: "${profileName}", schema: ${this.currentSchema}`);
        
        // Handle undefined or null profile names
        if (!profileName) {
            console.log('❌ Profile name is undefined or null');
            return this.renderField('Profile Source', 'Source information not available (no name)');
        }
        
        // Find the current profile by name
        let currentProfileId = null;
        let murmurationsName = null;
        
        // Debug: Log all profiles
        console.log('📋 All profiles:');
        for (const id in this.profiles) {
            const profile = this.profiles[id];
            console.log(`  • ID: ${id}`);
            console.log(`    • Murmurations name: "${profile.murmurations.name}"`);
            console.log(`    • Unified name: "${profile.unified.name}"`);
            console.log(`    • SchemaOrg name: "${profile.schemaorg.name}"`);
            console.log(`    • SchemaOrg profile:`, profile.schemaorg);
        }
        
        // Loop through all profiles to find the current one
        for (const id in this.profiles) {
            const profile = this.profiles[id];
            
            // Check if this is the current profile based on the current schema
            if (this.currentSchema === 'unified' && profile.unified.name === profileName) {
                console.log(`✅ Found matching unified profile: ${id}`);
                currentProfileId = id;
                murmurationsName = profile.murmurations.name;
                break;
            } else if (this.currentSchema === 'murmurations' && profile.murmurations.name === profileName) {
                console.log(`✅ Found matching murmurations profile: ${id}`);
                currentProfileId = id;
                murmurationsName = profile.murmurations.name;
                break;
            } else if (this.currentSchema === 'schemaorg' && profile.schemaorg.name === profileName) {
                console.log(`✅ Found matching schemaorg profile: ${id}`);
                currentProfileId = id;
                murmurationsName = profile.murmurations.name;
                break;
            }
        }
        
        // If we couldn't find the profile, use the name as is
        if (!currentProfileId) {
            console.log(`❌ No matching profile found for name: "${profileName}"`);
            currentProfileId = this.generateProfileId(profileName);
            murmurationsName = profileName;
        }
        
        // Generate GitHub URL based on profile name and current schema
        let githubUrl;
        
        // Different URL patterns based on schema type
        if (this.currentSchema === 'murmurations') {
            // Handle specific cases for Murmurations
            if (murmurationsName === 'Dylan Tull') {
                githubUrl = 'https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/murmurations/murm-person-dylan-tull.json';
            } else if (murmurationsName === 'Dr. Karen O\'Brien') {
                githubUrl = 'https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/murmurations/murm-person-karen-obrien.json';
            } else if (murmurationsName === 'Global Regenerative Cooperative') {
                githubUrl = 'https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/murmurations/murm-org-global-regenerative-coop.json';
            } else {
                // Generic case
                githubUrl = 'https://github.com/DarrenZal/RegenMapping/tree/main/profiles/murmurations/';
            }
        } else if (this.currentSchema === 'unified') {
            // Handle specific cases for Unified
            if (murmurationsName === 'Dylan Tull') {
                githubUrl = 'https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/unified/regen-person-dylan-tull.jsonld';
            } else if (murmurationsName === 'Dr. Karen O\'Brien') {
                githubUrl = 'https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/unified/regen-person-karen-obrien.jsonld';
            } else if (murmurationsName === 'Global Regenerative Cooperative') {
                githubUrl = 'https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/unified/regen-org-global-regenerative-coop.jsonld';
            } else {
                // Generic case
                githubUrl = 'https://github.com/DarrenZal/RegenMapping/tree/main/profiles/unified/';
            }
        } else if (this.currentSchema === 'schemaorg') {
            // For Schema.org, we don't have actual files, so we'll point to the converter
            githubUrl = 'https://github.com/DarrenZal/RegenMapping/blob/main/cambria-lenses/README.md';
            return this.renderField('Profile Source', `<a href="${githubUrl}" target="_blank">View Cambria Conversion Lenses on GitHub</a>`);
        } else {
            return this.renderField('Profile Source', 'Source information not available');
        }
        
        return this.renderField('Profile Source', `<a href="${githubUrl}" target="_blank">View Raw Profile on GitHub</a>`);
    }

    setupEventListeners() {
        // Schema button listeners
        document.querySelectorAll('.schema-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentSchema = e.target.dataset.schema;
                this.updateSchemaButtons();
                
                // Update the active schema node in the graph
                if (this.expandedNode) {
                    this.activeSchemaNode = `${this.expandedNode}-${this.currentSchema}`;
                    this.updateGraphColors();
                }
                
                if (this.currentProfile) {
                    this.displayProfile(this.currentProfile, this.currentSchema);
                }
            });
        });
        
        // Profile link listeners (using event delegation)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('profile-link')) {
                e.preventDefault();
                const targetName = e.target.dataset.target;
                if (targetName) {
                    this.navigateToProfile(targetName);
                }
            }
        });
    }

    updateSchemaButtons() {
        document.querySelectorAll('.schema-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.schema === this.currentSchema);
        });
    }

    updateGraphColors() {
        // Force the graph to re-evaluate node and link colors
        if (this.graph) {
            this.graph
                .nodeColor(node => this.getNodeColor(node))
                .linkColor(link => this.getLinkColor(link));
        }
    }

    openSidebar() {
        document.getElementById('sidebar').classList.add('open');
    }

    navigateToProfile(profileName) {
        console.log(`🔍 Navigating to profile: "${profileName}"`);
        
        // Debug: List all available profile names
        const availableNames = Object.keys(this.profiles).map(id => 
            `${id}: "${this.profiles[id].murmurations.name}"`
        );
        console.log('📋 Available profiles:', availableNames);
        
        // Find the profile by name or URL
        const profileId = Object.keys(this.profiles).find(id => {
            const profile = this.profiles[id].murmurations;
            // Match by exact name
            if (profile.name === profileName) return true;
            // Match by primary URL
            if (profile.primary_url === profileName) return true;
            // Match by URL without protocol/www
            if (profileName.startsWith('http')) {
                const cleanUrl = profileName.replace(/^https?:\/\/(www\.)?/, '');
                const cleanPrimaryUrl = profile.primary_url?.replace(/^https?:\/\/(www\.)?/, '');
                if (cleanUrl === cleanPrimaryUrl) return true;
            }
            return false;
        });
        
        console.log(`🎯 Found profile ID: ${profileId}`);
        
        if (profileId) {
            // Find the node in the graph
            const currentData = this.graph.graphData();
            const targetNode = currentData.nodes.find(node => node.id === profileId);
            
            console.log(`📍 Found target node:`, targetNode ? targetNode.name : 'Not found');
            
            if (targetNode) {
                // Expand the target node and show its profile
                this.expandNode(targetNode);
                this.showProfile(targetNode.profile);
                
                // Focus the camera on the target node
                this.graph.cameraPosition(
                    { x: targetNode.x, y: targetNode.y, z: targetNode.z + 100 }, // position
                    { x: targetNode.x, y: targetNode.y, z: targetNode.z }, // lookAt
                    1000 // transition duration
                );
            } else {
                console.error(`❌ Target node not found for profile ID: ${profileId}`);
            }
        } else {
            console.error(`❌ Profile not found for name: "${profileName}"`);
        }
    }

    hideLoading() {
        const graphLoading = document.querySelector('#graph .loading');
        const globeLoading = document.querySelector('#globe .loading');
        
        if (graphLoading) {
            graphLoading.style.display = 'none';
        }
        if (globeLoading) {
            globeLoading.style.display = 'none';
        }
    }

    showError(message) {
        const graphContainer = document.getElementById('graph');
        graphContainer.innerHTML = `
            <div class="loading">
                <p style="color: #e74c3c;">❌ ${message}</p>
            </div>
        `;
    }
}

// Global functions for HTML event handlers
function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
}

// Global app instance for onclick handlers
let app;

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    app = new RegenMappingApp();
    // Make app globally available for view switching
    window.app = app;
});
