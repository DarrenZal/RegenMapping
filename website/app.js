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
        // Load the Murmurations profiles from the repository
        const profileUrls = [
            '../murmurations-profiles/person-dylan-tull.json',
            '../murmurations-profiles/person-dr-karen-obrien.json',
            '../murmurations-profiles/org-global-regenerative-cooperative.json'
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
                }
            } catch (error) {
                console.warn(`Failed to load profile from ${url}:`, error);
            }
        }

        // If no profiles loaded from files, use mock data
        if (Object.keys(this.profiles).length === 0) {
            this.loadMockData();
        }
    }

    extractProfileId(url) {
        return url.split('/').pop().replace('.json', '');
    }

    async convertToUnified(murmProfile) {
        // Simulate Cambria conversion - in real implementation, this would use the actual Cambria library
        return {
            "@context": {
                "@version": 1.1,
                "@vocab": "https://schema.org/",
                "schema": "https://schema.org/",
                "murm": "https://murmurations.network/schemas/",
                "regen": "https://regen-map.org/schema/"
            },
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

    async convertToSchemaOrg(murmProfile) {
        // Simulate conversion to Schema.org format
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

    loadMockData() {
        // Mock data for demonstration
        this.profiles = {
            'person-dylan-tull': {
                murmurations: {
                    name: "Dylan Tull",
                    primary_url: "https://dylantull.com",
                    locality: "Traverse City",
                    region: "Michigan",
                    country_name: "United States",
                    tags: ["Regenerative Design", "Post-capitalist Finance"],
                    geolocation: { lat: 45.7108, lon: -85.9846 }
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
            'person-dr-karen-obrien': {
                murmurations: {
                    name: "Dr. Karen O'Brien",
                    primary_url: "https://karenmobrien.com",
                    locality: "Oslo",
                    region: "Oslo",
                    country_name: "Norway",
                    tags: ["Climate Change Research", "Human Geography"],
                    geolocation: { lat: 59.91, lon: 10.75 }
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
            .linkColor(() => 'rgba(255, 255, 255, 0.6)')
            .linkWidth(2)
            .backgroundColor('rgba(0,0,0,0)')
            .onNodeClick(this.handleNodeClick.bind(this))
            .onNodeDragEnd(node => {
                node.fx = node.x;
                node.fy = node.y;
                node.fz = node.z;
            });

        // Auto-rotate the graph
        this.graph.cameraPosition({ z: 300 });
        
        // Add some gentle rotation
        let angle = 0;
        setInterval(() => {
            angle += 0.005;
            this.graph.cameraPosition({
                x: 200 * Math.sin(angle),
                z: 200 * Math.cos(angle)
            });
        }, 50);
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

        // Create some example connections
        if (nodes.length >= 2) {
            links.push({
                source: nodes[0].id,
                target: nodes[1].id,
                type: 'collaboration'
            });
        }

        return { nodes, links };
    }

    getNodeColor(node) {
        if (node.type === 'schema') {
            const colors = {
                'murmurations': '#e74c3c',
                'unified': '#2ecc71',
                'schemaorg': '#3498db'
            };
            return colors[node.schema] || '#95a5a6';
        }
        
        if (node.id === this.expandedNode) {
            return '#f39c12'; // Orange for expanded node
        }
        
        return '#9b59b6'; // Purple for profile nodes
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
        this.currentSchema = schemaNode.schema;
        this.updateSchemaButtons();
        
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
            { source: `${node.id}-unified`, target: `${node.id}-schemaorg`, type: 'lens' }
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
        
        if (data.homeLocation) {
            const location = data.homeLocation;
            const locationStr = [
                location.addressLocality,
                location.addressRegion,
                location.addressCountry
            ].filter(Boolean).join(', ');
            html += this.renderField('Home Location', locationStr);
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
