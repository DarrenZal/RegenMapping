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
        
        this.init();
    }

    async init() {
        try {
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

        // If no profiles loaded from Murmurations, try GitHub URLs
        if (Object.keys(this.profiles).length === 0) {
            await this.loadFromGitHub();
        }

        // If still no profiles, use mock data
        if (Object.keys(this.profiles).length === 0) {
            this.loadMockData();
        }
    }

    async loadFromMurmurationsIndex() {
        // Query the Murmurations test index for our profiles
        const queries = [
            'https://test-index.murmurations.network/v2/nodes?schema=people_schema-v0.1.0&name=Dylan%20Tull',
            'https://test-index.murmurations.network/v2/nodes?schema=people_schema-v0.1.0&name=Dr.%20Karen%20O%27Brien',
            'https://test-index.murmurations.network/v2/nodes?schema=organizations_schema-v1.0.0&name=Global%20Regenerative%20Cooperative'
        ];

        for (const queryUrl of queries) {
            try {
                const response = await fetch(queryUrl);
                if (response.ok) {
                    const result = await response.json();
                    if (result.data && result.data.length > 0) {
                        // Get the profile URL from the first result
                        const profileUrl = result.data[0].profile_url;
                        const profileResponse = await fetch(profileUrl);
                        if (profileResponse.ok) {
                            const profile = await profileResponse.json();
                            const id = this.generateProfileId(profile.name);
                            this.profiles[id] = {
                                murmurations: profile,
                                unified: await this.convertToUnified(profile),
                                schemaorg: await this.convertToSchemaOrg(profile)
                            };
                            console.log(`✅ Loaded from Murmurations: ${profile.name}`);
                        }
                    }
                }
            } catch (error) {
                console.warn(`Failed to query Murmurations for ${queryUrl}:`, error);
            }
        }
    }

    async loadFromGitHub() {
        // Fallback: Load the Murmurations profiles from the repository
        const profileUrls = [
            'https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/murmurations-profiles/person-dylan-tull.json',
            'https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/murmurations-profiles/person-dr-karen-obrien.json',
            'https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/murmurations-profiles/org-global-regenerative-cooperative.json'
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
        // Detect if this is a person or organization profile
        const isOrganization = murmProfile.linked_schemas && 
            murmProfile.linked_schemas.some(schema => schema.includes('organizations_schema'));
        
        const baseContext = {
            "@version": 1.1,
            "@vocab": "https://schema.org/",
            "schema": "https://schema.org/",
            "murm": "https://murmurations.network/schemas/",
            "regen": "https://regen-map.org/schema/"
        };

        if (isOrganization) {
            return {
                "@context": baseContext,
                "@type": ["schema:Organization", "regen:RegenerativeOrganization"],
                "schema:name": murmProfile.name,
                "murm:primary_url": murmProfile.primary_url,
                "regen:locality": murmProfile.locality,
                "regen:geolocation": murmProfile.geolocation,
                "regen:domainTags": murmProfile.tags || [],
                "schema:location": {
                    "@type": "schema:Place",
                    "schema:addressLocality": murmProfile.locality,
                    "schema:addressRegion": murmProfile.region,
                    "schema:addressCountry": murmProfile.country_name
                }
            };
        } else {
            return {
                "@context": baseContext,
                "@type": ["schema:Person", "regen:RegenerativePerson"],
                "schema:name": murmProfile.name,
                "murm:primary_url": murmProfile.primary_url,
                "regen:locality": murmProfile.locality,
                "regen:geolocation": murmProfile.geolocation,
                "regen:domainTags": murmProfile.tags || [],
                "schema:homeLocation": {
                    "@type": "schema:Place",
                    "schema:addressLocality": murmProfile.locality,
                    "schema:addressRegion": murmProfile.region,
                    "schema:addressCountry": murmProfile.country_name
                }
            };
        }
    }

    async convertToSchemaOrg(murmProfile) {
        // Detect if this is a person or organization profile
        const isOrganization = murmProfile.linked_schemas && 
            murmProfile.linked_schemas.some(schema => schema.includes('organizations_schema'));
        
        if (isOrganization) {
            return {
                "@context": "https://schema.org/",
                "@type": "Organization",
                "name": murmProfile.name,
                "url": murmProfile.primary_url,
                "location": {
                    "@type": "Place",
                    "addressLocality": murmProfile.locality,
                    "addressRegion": murmProfile.region,
                    "addressCountry": murmProfile.country_name
                }
            };
        } else {
            return {
                "@context": "https://schema.org/",
                "@type": "Person",
                "name": murmProfile.name,
                "url": murmProfile.primary_url,
                "homeLocation": {
                    "@type": "Place",
                    "addressLocality": murmProfile.locality,
                    "addressRegion": murmProfile.region,
                    "addressCountry": murmProfile.country_name
                }
            };
        }
    }

    loadMockData() {
        // Mock data for demonstration
        this.profiles = {
            'dylan-tull': {
                murmurations: {
                    name: "Dylan Tull",
                    primary_url: "https://dylantull.com",
                    locality: "Traverse City",
                    region: "Michigan",
                    country_name: "United States",
                    tags: ["Regenerative Design", "Post-capitalist Finance", "Cooperative Economics"],
                    geolocation: { lat: 45.7108, lon: -85.9846 },
                    relationships: [
                        {
                            type: "member",
                            target: "Global Regenerative Cooperative",
                            target_url: "https://global-regenerative.coop",
                            description: "Co-founder and strategic advisor"
                        },
                        {
                            type: "collaboration",
                            target: "Dr. Karen O'Brien",
                            target_url: "https://karenmobrien.com",
                            description: "Research collaboration on regenerative systems"
                        }
                    ]
                },
                unified: {
                    "@type": ["schema:Person", "regen:RegenerativePerson"],
                    "schema:name": "Dylan Tull",
                    "murm:primary_url": "https://dylantull.com",
                    "regen:locality": "Traverse City, Michigan",
                    "regen:domainTags": ["Regenerative Design", "Post-capitalist Finance"]
                },
                schemaorg: {
                    "@type": "Person",
                    "name": "Dylan Tull",
                    "url": "https://dylantull.com",
                    "homeLocation": {
                        "@type": "Place",
                        "addressLocality": "Traverse City",
                        "addressRegion": "Michigan"
                    }
                }
            },
            'dr-karen-o-brien': {
                murmurations: {
                    name: "Dr. Karen O'Brien",
                    primary_url: "https://karenmobrien.com",
                    locality: "Oslo",
                    region: "Oslo",
                    country_name: "Norway",
                    tags: ["climate change", "social transformation", "resilience", "human geography", "sustainability science"],
                    geolocation: { lat: 59.91, lon: 10.75 },
                    relationships: [
                        {
                            type: "advisor",
                            target: "Global Regenerative Cooperative",
                            target_url: "https://global-regenerative.coop",
                            description: "Climate resilience research advisor"
                        },
                        {
                            type: "collaboration",
                            target: "Dylan Tull",
                            target_url: "https://dylantull.com",
                            description: "Research collaboration on regenerative systems"
                        }
                    ]
                },
                unified: {
                    "@type": ["schema:Person", "regen:RegenerativePerson"],
                    "schema:name": "Dr. Karen O'Brien",
                    "murm:primary_url": "https://karenmobrien.com",
                    "regen:locality": "Oslo, Norway",
                    "regen:domainTags": ["Climate Change Research", "Human Geography"]
                },
                schemaorg: {
                    "@type": "Person",
                    "name": "Dr. Karen O'Brien",
                    "url": "https://karenmobrien.com",
                    "homeLocation": {
                        "@type": "Place",
                        "addressLocality": "Oslo",
                        "addressCountry": "Norway"
                    }
                }
            },
            'global-regenerative-cooperative': {
                murmurations: {
                    name: "Global Regenerative Cooperative",
                    primary_url: "https://global-regenerative.coop",
                    locality: "Global",
                    region: "Worldwide",
                    country_name: "International",
                    tags: ["regenerative agriculture", "worker cooperative", "renewable energy", "permaculture", "community resilience", "bioregional", "social enterprise"],
                    linked_schemas: ["organizations_schema-v1.0.0"],
                    geolocation: { lat: 0, lon: 0 },
                    relationships: [
                        {
                            type: "member",
                            target: "Dylan Tull",
                            target_url: "https://dylantull.com",
                            description: "Co-founder and strategic advisor"
                        },
                        {
                            type: "advisor",
                            target: "Dr. Karen O'Brien",
                            target_url: "https://karenmobrien.com",
                            description: "Climate resilience research advisor"
                        }
                    ]
                },
                unified: {
                    "@type": ["schema:Organization", "regen:RegenerativeOrganization"],
                    "schema:name": "Global Regenerative Cooperative",
                    "murm:primary_url": "https://globalregenerativecooperative.com",
                    "regen:locality": "Global, Worldwide",
                    "regen:domainTags": ["Cooperative Economics", "Regenerative Systems", "Global Network"]
                },
                schemaorg: {
                    "@type": "Organization",
                    "name": "Global Regenerative Cooperative",
                    "url": "https://globalregenerativecooperative.com",
                    "location": {
                        "@type": "Place",
                        "addressLocality": "Global",
                        "addressRegion": "Worldwide",
                        "addressCountry": "International"
                    }
                }
            }
        };
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
            .linkDirectionalArrowLength(link => link.type && link.type !== 'schema-link' && link.type !== 'lens' ? 4 : 0)
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
                    links.push({
                        source: profileId,
                        target: targetProfileId,
                        type: rel.type,
                        description: rel.description,
                        label: `${rel.type}: ${rel.description}`
                    });
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
        
        if (node.id === this.expandedNode) {
            return '#f39c12'; // Orange for expanded node
        }
        
        return '#9b59b6'; // Purple for profile nodes
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

        // Create links between schema nodes (representing Cambria lenses)
        const lensLinks = [
            { source: `${node.id}-murmurations`, target: `${node.id}-unified`, type: 'lens' },
            { source: `${node.id}-unified`, target: `${node.id}-schemaorg`, type: 'lens' },
            { source: `${node.id}-murmurations`, target: `${node.id}-schemaorg`, type: 'lens' }
        ];

        // Update graph data
        const currentData = this.graph.graphData();
        this.graph.graphData({
            nodes: [...currentData.nodes, ...this.schemaNodes],
            links: [...currentData.links, ...schemaLinks, ...lensLinks]
        });
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
        return data.name || data['schema:name'] || 'Unknown';
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

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new RegenMappingApp();
});
