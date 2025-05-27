# Organization Schemas

Comprehensive organization schemas for regenerative economy mapping, combining Schema.org standards, Murmurations network discovery, and visualization optimization.

## Files in This Directory

### Core Schema Files
- **`unified-organization-schema.jsonld`** - Primary unified organization schema combining all approaches
- **`regen-org-shapes.ttl`** - SHACL validation shapes for data quality assurance
- **`example-organization-profile.jsonld`** - Complete examples demonstrating schema usage

### Source Schema Directories
- **`Dylan/`** - Dylan Tull's visualization-optimized organization schema
- **`Murmurations/`** - Murmurations network discovery schemas for organizations
- **`SchemaOrg/`** - Schema.org Organization class extracts

## Unified Schema Overview

The unified organization schema provides comprehensive coverage for all types of regenerative organizations including companies, nonprofits, DAOs, cooperatives, and communities.

### Key Organization Types Supported
- **For-profit Companies** - B-Corps, benefit corporations, social enterprises
- **Nonprofit Organizations** - 501(c)(3)s, foundations, advocacy groups
- **Cooperatives** - Worker, consumer, and multi-stakeholder cooperatives
- **DAOs & Web3** - Decentralized autonomous organizations and blockchain entities
- **Communities** - Intentional communities, ecovillages, bioregional groups
- **Networks** - Umbrella organizations, consortiums, collaborative networks

## Schema Clusters

### 1. Identity & Branding
- Names, logos, descriptions, mission statements
- Legal structure and registration details
- Brand assets and visual identity

### 2. Geographic & Scope
- Headquarters and operational locations
- Geographic scope (local, regional, national, international)
- Service areas and bioregional alignment

### 3. Network & Relationships
- Partnerships, memberships, subsidiaries
- Funding relationships and investment flows
- Collaborative networks and ecosystem position

### 4. Status & Lifecycle
- Operational status (active, planning, completed)
- Founding and dissolution dates
- Growth stage and maturity indicators

### 5. Scale & Finance
- Employee counts and revenue ranges
- Funding models and financial sustainability
- Impact metrics and key performance indicators

### 6. Impact & Certifications
- SDG alignment and impact measurements
- B-Corp certification and other credentials
- Environmental and social impact data

### 7. Contact & Web Presence
- Websites, social media, contact information
- Digital presence and online engagement
- Communication channels and accessibility

### 8. Offerings & Focus
- Products, services, and program areas
- Target beneficiaries and stakeholder groups
- Market positioning and value propositions

## Regenerative Economy Features

### Mission Alignment
- **SDG Mapping** - UN Sustainable Development Goals alignment
- **Domain Tags** - Focus areas like "Regenerative Agriculture", "Circular Economy"
- **Method Tags** - Approaches like "Permaculture", "Doughnut Economics"
- **Impact Measurement** - Quantified regenerative outcomes

### Network Discovery
- **Murmurations Compatible** - Enables automatic discovery in regenerative networks
- **Relationship Modeling** - Partnership, funding, and collaboration connections
- **Geographic Clustering** - Bioregional and ecosystem mapping

### Visualization Optimization
- **Globe Rendering** - Optimized coordinate data for 3D mapping
- **Force-Directed Graphs** - Network metrics for relationship visualization
- **Multi-Scale Support** - From local to international scope representation

## SHACL Validation

The `regen-org-shapes.ttl` file provides comprehensive validation including:

- **Identity Requirements** - Organization name and basic identification
- **Geographic Validation** - Coordinate ranges and address formatting
- **Status Constraints** - Valid lifecycle stages and operational status
- **Financial Validation** - Employee ranges and revenue formatting
- **Contact Validation** - Email patterns and URL formatting
- **Impact Validation** - Certification and KPI data quality

## Usage Examples

See `example-organization-profile.jsonld` for complete implementations demonstrating:
- Various organization types (nonprofit, for-profit, cooperative, DAO)
- Complex relationship modeling
- Geographic and scope specifications
- Impact measurement and certification data

## Related Documentation

- **[Unified Organization Schema Comparison](../../docs/schemas/Organization/unified-organization-schema-comparison.md)** - Detailed analysis of schema synthesis
- **[Organization Schema Mapping Guide](../../docs/schemas/Organization/organization-schema-mapping-guide.md)** - Transformation functions and utilities
- **[Project Specifications](../../docs/project-specifications.md)** - Complete project context and implementation guidelines