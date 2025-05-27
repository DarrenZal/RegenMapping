# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a research and documentation project for creating a regenerative organization mapping platform. The repository contains schema definitions, project specifications, and documentation for building a 3D globe and force-directed graph visualization of regenerative organizations, people, and their relationships.

## Repository Structure

The project is organized around schema research and documentation:

- `Ontology/` - JSON-LD schema definitions for organizations and people
- `docs/` - Project specifications, requirements, and guides
- `docs/schemas/` - Schema transformation and mapping documentation

## Key Schema Files

- `Ontology/unified-organization-schema.jsonld` - Primary unified schema combining best elements from multiple approaches
- `Ontology/example-organization-profile.jsonld` - Complete example implementation
- `Ontology/Murmurations/` - Murmurations network discovery schemas
- `Ontology/schmeaorg/` - Schema.org organization extracts

## Data Model Architecture

The unified schema combines three approaches:
1. **Schema.org** - Web standards compliance
2. **Murmurations** - Regenerative economy discovery features  
3. **Dylan Tull's schema** - Rich categorization for mapping/visualization

Core entity types:
- **Person** - Individuals in the regenerative space
- **Organization** - Companies, nonprofits, DAOs, cooperatives, communities

Key relationship types:
- Collaboration, Employment/Affiliation, Funding/Investment, Mentorship, Membership

## Schema Transformation

Use the mapping tables and transformation functions in `docs/schemas/schema-mapping-guide.md` to convert between different schema formats. The guide includes JavaScript functions for bidirectional transformation between Schema.org, Murmurations, and the unified schema.

## Documentation Standards

- All schemas use JSON-LD format with proper @context definitions
- Documentation follows markdown standards with clear headings and examples
- Maintain comprehensive field mappings for schema interoperability
- Include practical examples for all schema implementations

## Visual Design Specifications

The project includes detailed UI/UX specifications in `docs/project-specifications.md` covering:
- 3D globe visualization with geographic positioning
- Force-directed graph for relationship topology
- Interactive side panels with node details
- Comprehensive filtering and search capabilities
- Color encoding and visual design patterns

## Next Development Phase

The repository contains complete specifications for implementing:
- Neo4j graph database with spatial extensions
- React frontend with Three.js/Deck.gl visualizations
- GraphQL API for data access
- Data ingestion pipelines from multiple sources

When working with this repository, focus on schema consistency, documentation clarity, and maintaining the unified approach to organization data modeling.