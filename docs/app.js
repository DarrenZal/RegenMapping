// Regen Mapping - Interactive Schema Visualization
// Uses 3d-force-graph for the network visualization

class RegenMappingApp {
    constructor() {
        this.graph = null;
        this.currentProfile = null;
        this.currentSchema = 'unified';
        this.expandedNode = null;
        this.profiles = {};
        this.schemaNodes = [];
        this.activeSchemaNode = null;
        this.cambria = new CambriaBrowser();
        this.cambriaReady = false;
        
        this.init();
    }

    async init() {
        try {
            // Initialize Cambria lenses first
            console.log('🎯 Initializing Cambria lenses...');
            this.cambriaReady = await this.cambria.initializeLenses();
            
            await this.loadProfiles();
            this.setupGraph();
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

        // If no profiles loaded from Murmurations, try GitHub URLs as fallback
        if (Object.keys(this.profiles).length === 0) {
            console.log('📁 No profiles from Murmurations index, loading from GitHub...');
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
            'https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/murmurations/murm-org-global-regenerative-coop.json',
            // Also include the old URLs in case they're still indexed
            'https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/murmurations-profiles/person-dylan-tull.json',
            'https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/murmurations-profiles/person-dr-karen-obrien.json',
            'https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/murmurations-profiles/org-global-regenerative-cooperative.json'
        ];

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
                                    
                                    this.profiles[id] = {
                                        murmurations: profile,
                                        unified: await this.convertToUnified(profile),
                                        schemaorg: await this.convertToSchemaOrg(profile)
                                    };
                                    console.log(`✅ Loaded from Murmurations: ${profile.name}`);
                                }
                            } catch (profileError) {
                                console.warn(`Failed to load individual profile:`, profileError);
                            }
                        }
                    }
                }
            } catch (error) {
                console.warn(`Failed to query Murmurations for ${queryUrl}:`, error);
            }
        }
        
        console.log(`🎉 Total profiles loaded: ${Object.keys(this.profiles).length}`);
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
                    const id = this.extractProfileId(url);
                    this.profiles[id] = {
                        murmurations: profile,
                        unified: await this.convertToUnified(profile),
                        schemaorg: await this.convertToSchemaOrg(profile)
                    };
                    console.log(`✅ Loaded from GitHub: ${profile.name}`);
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

    async convertToUnified(murmProfile) {
        if (!this.cambriaReady) {
            throw new Error('Cambria lenses not loaded - cannot convert to unified format');
        }
        
        console.log('🎯 Using Cambria for Murmurations → Unified conversion');
        return this.cambria.convertSchema(murmProfile, 'murmurations', 'unified');
    }

    async convertToSchemaOrg(murmProfile) {
        if (!this.cambriaReady) {
            throw new Error('Cambria lenses not loaded - cannot convert to Schema.org format');
        }
        
        console.log('🎯 Using Cambria for Murmurations → Schema.org conversion');
        return this.cambria.convertSchema(murmProfile, 'murmurations', 'schemaorg');
    }



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
                // Find the target profile by name
                const targetProfileId = Object.keys(this.profiles).find(id => 
                    this.profiles[id].murmurations.name === rel.target
                );
                
                if (targetProfileId) {
                    // Create a unique key for this relationship to avoid duplicates
                    const relationshipKey = [profileId, targetProfileId].sort().join('-');
                    
                    if (!processedRelationships.has(relationshipKey)) {
                        processedRelationships.add(relationshipKey);
                        
                        links.push({
                            source: profileId,
                            target: targetProfileId,
                            type: rel.type,
                            description: rel.description,
                            label: `${rel.type}: ${rel.description}`
                        });
                    }
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
        
        // Set the default active schema to unified
        this.activeSchemaNode = `${node.id}-unified`;
        
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
        
        if (data.locality) {
            html += this.renderField('Location', `${data.locality}, ${data.region || ''} ${data.country_name || ''}`.trim());
        }
        
        if (data.tags && data.tags.length > 0) {
            html += this.renderField('Tags', data.tags.join(', '));
        }
        
        if (data.geolocation) {
            html += this.renderField('Coordinates', `${data.geolocation.lat}, ${data.geolocation.lon}`);
        }

        if (data.relationships && data.relationships.length > 0) {
            const relationshipsHtml = data.relationships.map((rel, index) => 
                `<div class="relationship-item">
                    <strong>${rel.type}</strong>: <a href="#" class="profile-link" data-target="${rel.target}">${rel.target}</a>
                    <br><em>${rel.description}</em>
                </div>`
            ).join('');
            html += this.renderField('Relationships', relationshipsHtml);
        }

        // Add profile source link
        html += this.renderProfileSource(data.name);

        return html;
    }

    renderUnifiedFields(data) {
        let html = '';
        
        if (data['murm:primary_url']) {
            html += this.renderField('Primary URL', `<a href="${data['murm:primary_url']}" target="_blank">${data['murm:primary_url']}</a>`);
        }
        
        if (data['regen:locality']) {
            html += this.renderField('Locality', data['regen:locality']);
        }
        
        if (data['regen:domainTags'] && data['regen:domainTags'].length > 0) {
            html += this.renderField('Domain Tags', data['regen:domainTags'].join(', '));
        }
        
        if (data['@type']) {
            html += this.renderField('Type', Array.isArray(data['@type']) ? data['@type'].join(', ') : data['@type']);
        }

        if (data['regen:relationships'] && data['regen:relationships'].length > 0) {
            const relationshipsHtml = data['regen:relationships'].map(rel => 
                `<div class="relationship-item">
                    <strong>${rel.type}</strong>: <a href="#" class="profile-link" data-target="${rel.target}">${rel.target}</a>
                    <br><em>${rel.description}</em>
                </div>`
            ).join('');
            html += this.renderField('Relationships', relationshipsHtml);
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
        
        // Handle both homeLocation (Person) and location (Organization)
        const locationData = data.homeLocation || data.location;
        if (locationData) {
            const locationStr = [
                locationData.addressLocality,
                locationData.addressRegion,
                locationData.addressCountry
            ].filter(Boolean).join(', ');
            const locationLabel = data['@type'] === 'Organization' ? 'Location' : 'Home Location';
            html += this.renderField(locationLabel, locationStr);
        }
        
        if (data['@type']) {
            html += this.renderField('Schema Type', data['@type']);
        }

        // Add profile source link
        html += this.renderProfileSource(data.name);

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
        
        // Find the profile by name
        const profileId = Object.keys(this.profiles).find(id => 
            this.profiles[id].murmurations.name === profileName
        );
        
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
        const loading = document.querySelector('.loading');
        if (loading) {
            loading.style.display = 'none';
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
});
