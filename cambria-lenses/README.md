# Cambria Lenses

This directory contains Cambria lens files for converting between schema formats in the Regen Mapping project.

## Lens Files

### Person Schema Lenses (6 files)
- `murmurations-to-unified-person.lens.yml`
- `unified-to-murmurations-person.lens.yml`
- `schemaorg-to-unified-person.lens.yml`
- `murmurations-to-schemaorg-person.lens.yml`
- `schemaorg-to-murmurations-person.lens.yml`
- `unified-to-schemaorg-person.lens.yml`

### Lossless Bidirectional Lenses
- `lossless-bidirectional-unified-murmurations-person.lens.yml` - Proof-of-concept for single bidirectional lens
- `lossless-bidirectional-unified-murmurations-person-optimized.lens.yml` - Optimized version using direct JSON-LD properties

### Organization Schema Lenses (3 files)
- `unified-to-murmurations-organization.lens.yml`
- `murmurations-to-unified-organization.lens.yml`
- `unified-to-schemaorg-organization.lens.yml`

## Creating Lossless Bidirectional Lenses with Cambria

Based on our research and implementation, here's how to create truly lossless bidirectional conversions using a **single** Cambria lens file:

### Core Principle: Data Preservation, Not Duplication

Cambria's design assumes you **store data once** and use lenses to project different views at read-time. Lossless round-trip comes from preserving source data, not from keeping duplicate copies.

### Two Proven Strategies for Lossless Conversion

#### Strategy 1: Preservation Fields (Our Implementation)
Use special `_preserved_*` fields to store data that doesn't naturally map between schemas:

```yaml
schemaName: Person
lens:
  # Preserve rich context during forward conversion
  - rename:
      source: "@context"
      destination: "_preserved_context"
      
  # Preserve schema-specific fields
  - rename:
      source: "regen:displayHandle"
      destination: "_preserved_display_handle"
  - rename:
      source: "regen:theoryTags"
      destination: "_preserved_theory_tags"
      
  # Standard bidirectional transformations
  - rename:
      source: "regen:currentTitle"
      destination: "current_title"
      
  # Preserve complex structures
  - in:
      name: "murm:relationships"
      lens:
        - map:
            lens:
              - rename:
                  source: "target"
                  destination: "_preserved_target"
              - rename:
                  source: "description"
                  destination: "_preserved_description"
```

**Advantages:**
- Self-contained in one lens file
- No external dependencies
- Works with Cambria's native operations
- Application handles restoration in reverse direction

#### Strategy 2: External Pointer Pattern
Keep a reference to the canonical rich record:

```yaml
schemaName: Invoice
lens:
  - add:
      name: sourceUrl
      type: string
      default: ""
  # Standard conversions...
```

**Use when:**
- Rich representation is huge
- Canonical data lives elsewhere (IPFS, DKG, etc.)
- Network lookup is acceptable

### Best Practices

1. **Prefer preservation fields** when you control both schemas - simpler and self-contained
2. **Use external pointers** only for large datasets or when canonical data exists elsewhere
3. **Write property-based round-trip tests** to verify lossless behavior
4. **Optimize JSON-LD** by using direct properties (`regen:field`) instead of context mappings

### Our Implementation & Results

We implemented **both strategies** in this project:

**Current Production Code** uses the **external pointer pattern**:
- Murmurations profiles include `source_url` field pointing to rich unified profiles
- Application fetches full context when needed for reverse conversion
- Works well for our immutable GitHub-hosted profiles

**Proof-of-Concept** demonstrates the **preservation fields approach**:
- `lossless-bidirectional-unified-murmurations-person.lens.yml` and optimized version
- Achieved **100% lossless conversion** across all test profiles
- **Single bidirectional lens** instead of separate directional lenses  
- **68% reduction** in @context size through direct properties
- **Zero data loss** for complex structures like relationships and rich JSON-LD contexts

The key insight: lossless bidirectional conversion **is possible** with Cambria using either strategy, depending on your architecture needs.

## Usage in Code

These lens files are used by:
- **Browser Implementation**: `docs/cambria-browser.js` for live schema conversions
- **Node.js Scripts**: `scripts/cambria-conversion.js` for command-line transformations
- **Web Application**: `docs/app.js` for the interactive demo
- **Test Scripts**: `scripts/test-lossless-conversion.js` for validation

## Documentation

For detailed documentation on:
- Schema conversion matrix and transformation paths
- Lossless conversion with `source_url` innovation
- Field mappings and usage examples
- Testing and validation approaches

See **[docs/schemas/README.md](../docs/schemas/README.md)**