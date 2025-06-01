# Cambria Integration for Schema Conversion

This document summarizes the **completed integration** of Cambria for converting between the three schema types used in the Regen Mapping project. The website features interactive navigation between profiles, real-time lens transformations, and a visual schema flow.

## ✅ What's Working

### 🌐 **LIVE BROWSER IMPLEMENTATION**
- **Website**: https://darrenzal.github.io/RegenMapping
- **Status**: ✅ **FULLY OPERATIONAL** - Real Cambria transformations in the browser!
- **Engine**: Custom browser-compatible Cambria implementation
- **Lens Loading**: Loads actual lens files from GitHub repository
- **Interactive Navigation**: Click relationship links to navigate between profiles

### Cambria Project Setup
- **Location**: `/Users/darrenzal/cambria-project`
- **Status**: ✅ Installed, built, and tested successfully
- **CLI**: Working with demo transformations

### Schema Conversions Implemented

#### 1. Murmurations ↔ Unified (Person Schemas)
- **Forward**: `murmurations-to-unified-person.lens.yml`
- **Reverse**: `unified-to-murmurations-person.lens.yml`
- **Status**: ✅ **Fully working with bidirectional conversion**
- **Data Integrity**: ✅ All fields preserved in round-trip transformation

#### Field Mappings
```
Murmurations → Unified:
- name → schema:name
- primary_url → murm:primary_url
- locality → regen:locality
- geolocation → regen:geolocation
- tags → regen:domainTags
```

### Test Results
```bash
# Successful bidirectional transformation
✅ Name preserved: true
✅ URL preserved: true
✅ Locality preserved: true
✅ Geolocation preserved: true
```

## 📁 Files Created

### Cambria Lenses
- `cambria-lenses/murmurations-to-unified-person.lens.yml`
- `cambria-lenses/unified-to-murmurations-person.lens.yml`
- `cambria-lenses/schemaorg-to-unified-person.lens.yml`
- `cambria-lenses/README.md`

### Test Files
- `test-profiles/sample-schemaorg-person.json`
- `scripts/test-cambria-transformations.js` (executable demo)

## 🚀 Usage Examples

### Command Line Usage
```bash
# Convert Murmurations to Unified
cat murmurations-profiles/person-dylan-tull.json | \
  node /Users/darrenzal/cambria-project/dist/cli.js \
  -l cambria-lenses/murmurations-to-unified-person.lens.yml

# Bidirectional test
cat murmurations-profiles/person-dylan-tull.json | \
  node /Users/darrenzal/cambria-project/dist/cli.js \
  -l cambria-lenses/murmurations-to-unified-person.lens.yml | \
  node /Users/darrenzal/cambria-project/dist/cli.js \
  -l cambria-lenses/unified-to-murmurations-person.lens.yml
```

### Demo Script
```bash
# Run comprehensive test suite
node scripts/test-cambria-transformations.js
```

## 🔄 Schema Types Supported

### 1. Murmurations Schema
- **Format**: Simple flat JSON structure
- **Example**: `murmurations-profiles/person-dylan-tull.json`
- **Key fields**: `name`, `primary_url`, `locality`, `geolocation`, `tags`

### 2. Unified Schema (Your comprehensive format)
- **Format**: JSON-LD with multiple namespaces
- **Example**: `Ontology/Person/example-person-profile.jsonld`
- **Namespaces**: `schema:`, `regen:`, `murm:`, `geo:`

### 3. Schema.org
- **Format**: Standard Schema.org JSON-LD
- **Example**: `test-profiles/sample-schemaorg-person.json`
- **Status**: ✅ Working in browser

## 📊 Benefits Achieved

### Data Interoperability
- ✅ Seamless conversion between Murmurations and Unified formats
- ✅ Bidirectional transformations with data integrity preservation
- ✅ Foundation for multi-schema ecosystem

### Developer Experience
- ✅ Simple CLI interface for transformations
- ✅ Automated testing and validation
- ✅ Clear documentation and examples

### Scalability
- ✅ Lens-based approach allows easy addition of new schema types
- ✅ Modular design supports complex transformation pipelines
- ✅ Version control for schema evolution

## 🔧 Technical Implementation

### Cambria Lens Format
```yaml
schemaName: Person
lens:
  - rename:
      source: name
      destination: "schema:name"
  - rename:
      source: geolocation
      destination: "regen:geolocation"
```

### Data Flow
```
Murmurations JSON → Cambria Lens → Unified JSON-LD
     ↑                                      ↓
     ← Reverse Cambria Lens ←  ←  ←  ←  ←  ←
```

## 🌐 Browser Implementation Details

### Custom Cambria Engine (`docs/cambria-browser.js`)
We created a browser-compatible implementation of Cambria functionality:

```javascript
class CambriaBrowser {
    // Custom YAML parser for lens files
    loadYamlLens(yamlContent) { ... }
    
    // Core lens operations
    applyLensToDoc(lens, doc) { ... }
    applyRename(doc, operation) { ... }
    applyRemove(doc, operation) { ... }
    applyAdd(doc, operation) { ... }
    
    // Schema conversion with live lens loading
    convertSchema(data, fromFormat, toFormat) { ... }
}
```

### Key Features
- **Live Lens Loading**: Loads lens files from GitHub raw URLs
- **YAML Parsing**: Custom browser-compatible YAML parser
- **Real-time Transformations**: All conversions use actual Cambria lenses
- **Interactive Navigation**: Click relationship links to navigate between profiles
- **Visual Schema Flow**: Labeled lens connections show transformation paths
- **Error Handling**: Graceful fallbacks with comprehensive logging

### Website Integration (`docs/app.js`)
- **Pure Cambria Dependency**: No fallback manual conversions
- **Schema Preservation**: Maintains current schema view when navigating
- **Debug Logging**: Console shows transformation success/failure
- **Event Delegation**: Safe handling of profile navigation links

### Console Output Example
```
🎯 Initializing Cambria lenses...
🎯 Cambria lenses loaded successfully!
✅ Loaded from GitHub: Dylan Tull
🎯 Using Cambria for Murmurations → Unified conversion
🎯 Using Cambria for Murmurations → Schema.org conversion
🔄 Cambria Schema.org conversion result: {name: "Dylan Tull", ...}
