# Regen Mapping - Documentation

This directory contains documentation for the Regen Mapping project, including the interactive visualization website and schema documentation.

## 📚 Documentation Sections

### [Schema Documentation](schemas/README.md)
- **[Schema Mapping and Registration Guide](schemas/schema-mapping-guide.md)** - NEW! Step-by-step guide for registering schemas with Murmurations
- **Schema Comparisons** - Analysis of different schema approaches
- **Transformation Guides** - Converting between schema formats
- **Cambria Integration** - Using Cambria lenses for schema conversion

### Interactive Visualization Website

The interactive force-directed graph visualization for exploring regenerative organizations and people with multi-schema support.

## 🌐 Live Demo

**Website**: https://darrenzal.github.io/RegenMapping

## ✨ Features

### Interactive Force-Directed Graph
- **3D Network Visualization** using d3-force-3d
- **Dynamic Node Expansion** - Click nodes to reveal schema relationships
- **Real-time Schema Switching** between Murmurations, Unified, and Schema.org formats
- **Smooth Animations** and intuitive interactions

### Schema Conversion Visualization
- **Visual Cambria Lenses** - See how data transforms between schemas
- **Live Profile Display** - View profiles in different schema formats
- **Schema Node Connections** - Understand relationships between data formats
- **Interactive Schema Selection** - Switch between formats with visual feedback

### User Experience
- **Responsive Design** - Works on desktop and mobile
- **Intuitive Controls** - Drag nodes, click to explore, smooth navigation
- **Real-time Loading** - Fetches actual profile data from the repository
- **Elegant UI** - Clean, modern interface with smooth transitions

## 🏗️ Technical Architecture

### Frontend Stack
- **HTML5** - Semantic structure and accessibility
- **CSS3** - Modern styling with gradients, animations, and responsive design
- **Vanilla JavaScript** - No framework dependencies for maximum performance
- **d3-force-3d** - 3D force-directed graph visualization library

### Data Flow
```
GitHub Repository → Fetch API → JavaScript App → d3-force-3d → Interactive Graph
     ↓                ↓              ↓              ↓
Profile JSONs → Parse Data → Node/Link Objects → Visual Elements
```

### Key Components

#### 1. **RegenMappingApp Class**
Main application controller that manages:
- Data loading and parsing
- Graph initialization and updates
- User interactions and state management
- Schema conversions and display

#### 2. **Graph Visualization**
- **Nodes**: Represent profiles (people/organizations) and schema types
- **Links**: Show relationships and schema transformations
- **Colors**: Visual encoding for different node types and states
- **Interactions**: Click, drag, hover, and expansion behaviors

#### 3. **Schema Conversion System**
- **Live Conversion**: Real-time transformation between schema formats
- **Visual Representation**: Schema nodes show conversion relationships
- **Data Integrity**: Maintains all data through transformations
- **Format Switching**: Seamless switching between Murmurations, Unified, and Schema.org
- **JSON-LD @reverse Links**: Semantic web linking between profiles for lossless conversion
- **Lossless Round-trip**: Complete preservation of data when converting between formats
- **Fallback Mechanism**: Graceful handling when original profiles can't be fetched

## 📁 File Structure

```
website/
├── index.html          # Main HTML page with structure and styling
├── app.js             # JavaScript application logic
├── _config.yml        # GitHub Pages configuration
└── README.md          # This documentation file
```

## 🚀 Local Development

### Prerequisites
- Python 3.x (for local server)
- Modern web browser with JavaScript enabled

### Running Locally
```bash
# From the project root
npm run serve

# Or manually from website directory
cd website
python3 -m http.server 8000

# Visit http://localhost:8000
```

### Development Workflow
1. **Edit Files** - Modify HTML, CSS, or JavaScript
2. **Test Locally** - Use local server to test changes
3. **Commit Changes** - Push to GitHub for automatic deployment
4. **View Live** - Changes appear on GitHub Pages within minutes

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#007bff` - Interactive elements and highlights
- **Success Green**: `#2ecc71` - Unified schema nodes
- **Warning Orange**: `#f39c12` - Expanded/active nodes
- **Danger Red**: `#e74c3c` - Murmurations schema nodes
- **Info Blue**: `#3498db` - Schema.org nodes and accents
- **Purple**: `#9b59b6` - Profile nodes
- **Gradients**: Blue-to-purple background for depth

### Typography
- **Primary Font**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Headings**: Bold weights with proper hierarchy
- **Body Text**: Regular weight with good contrast
- **Interactive Elements**: Medium weight for emphasis

### Layout
- **Flexbox Layout** - Responsive graph container and sidebar
- **Sidebar Panel** - 400px width with smooth slide animations
- **Responsive Design** - Adapts to different screen sizes
- **Z-index Management** - Proper layering for overlays and panels

## 🔧 Configuration

### GitHub Pages Setup
The `_config.yml` file configures GitHub Pages deployment:
- **Theme**: Minima for clean documentation
- **Plugins**: Jekyll feed and sitemap generation
- **URL Structure**: Proper baseurl for GitHub Pages
- **File Exclusions**: Prevents processing of development files

### Graph Configuration
Key parameters in `app.js`:
- **Node Sizes**: Profile nodes (8), schema nodes (4)
- **Link Colors**: Semi-transparent white for visibility
- **Camera Position**: Initial 3D positioning and auto-rotation
- **Force Parameters**: Node repulsion, link strength, positioning

## 📊 Data Integration

### Profile Loading
The application attempts to load real profile data from:
1. **Murmurations Profiles** - `../murmurations-profiles/*.json`
2. **Fallback Mock Data** - Built-in examples if files unavailable
3. **Schema Conversion** - Automatic transformation to all three formats

### Schema Formats

#### Murmurations Format with JSON-LD @reverse Links
```json
{
  "name": "Dylan Tull",
  "primary_url": "https://dylantull.com",
  "locality": "Traverse City",
  "tags": ["Regenerative Design", "Post-capitalist Finance"],
  "@id": "https://murmurations.network/profile/dylan-tull",
  "@reverse": {
    "schema:isBasedOn": {
      "@id": "https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/unified/regen-person-dylan-tull.jsonld"
    }
  },
  "profile_source": "https://raw.githubusercontent.com/DarrenZal/RegenMapping/main/profiles/unified/regen-person-dylan-tull.jsonld"
}
```

#### Unified Format (JSON-LD)
```json
{
  "@type": ["schema:Person", "regen:RegenerativePerson"],
  "schema:name": "Dylan Tull",
  "murm:primary_url": "https://dylantull.com",
  "regen:locality": "Traverse City, Michigan"
}
```

#### Schema.org Format
```json
{
  "@type": "Person",
  "name": "Dylan Tull",
  "url": "https://dylantull.com",
  "homeLocation": {
    "@type": "Place",
    "addressLocality": "Traverse City"
  }
}
```

## 🎯 User Interactions

### Primary Actions
1. **Click Profile Node** - Expand to show schema types, open sidebar
2. **Click Schema Node** - Switch profile display format
3. **Drag Nodes** - Reposition in 3D space
4. **Close Sidebar** - Hide profile details panel

### Visual Feedback
- **Node Color Changes** - Indicate selection and expansion states
- **Smooth Animations** - Provide visual continuity
- **Loading States** - Show progress during data fetching
- **Error Handling** - Graceful fallbacks for missing data

## 🔮 Future Enhancements

### Planned Features
1. **Real Cambria Integration** - Use actual Cambria library for conversions
2. **More Profile Types** - Organizations, projects, events
3. **Advanced Filtering** - By location, tags, schema type
4. **Search Functionality** - Find specific profiles quickly
5. **Export Options** - Download profiles in different formats

### Technical Improvements
1. **Performance Optimization** - Lazy loading, virtualization
2. **Accessibility** - Keyboard navigation, screen reader support
3. **Mobile Optimization** - Touch interactions, responsive layout
4. **Progressive Web App** - Offline support, app-like experience

## 🐛 Troubleshooting

### Common Issues

#### Profiles Not Loading
- **Check Network** - Ensure internet connection for GitHub API
- **CORS Issues** - Use local server, not file:// protocol
- **File Paths** - Verify relative paths to profile files

#### Graph Not Rendering
- **JavaScript Errors** - Check browser console for errors
- **Library Loading** - Ensure d3-force-3d loads from CDN
- **Browser Support** - Use modern browser with WebGL support

#### Styling Issues
- **CSS Loading** - Verify all styles are applied
- **Responsive Layout** - Test on different screen sizes
- **Browser Compatibility** - Check for vendor prefixes

### Debug Mode
Add `?debug=true` to URL for additional console logging:
```javascript
// Enable debug logging
const DEBUG = new URLSearchParams(window.location.search).get('debug') === 'true';
if (DEBUG) console.log('Debug info:', data);
```

## 📈 Analytics & Monitoring

### Performance Metrics
- **Load Time** - Time to first interactive graph
- **Data Fetching** - Profile loading success rates
- **User Interactions** - Click patterns and engagement
- **Error Rates** - Failed requests and JavaScript errors

### Usage Tracking
- **Popular Profiles** - Most viewed nodes
- **Schema Preferences** - Which formats users prefer
- **Session Duration** - Time spent exploring
- **Device Types** - Desktop vs mobile usage

## 🤝 Contributing

### Development Guidelines
1. **Code Style** - Use consistent formatting and naming
2. **Comments** - Document complex logic and interactions
3. **Testing** - Test on multiple browsers and devices
4. **Performance** - Optimize for smooth 60fps animations
5. **Accessibility** - Follow WCAG guidelines

### Pull Request Process
1. **Fork Repository** - Create your own copy
2. **Create Branch** - Use descriptive branch names
3. **Make Changes** - Follow coding standards
4. **Test Thoroughly** - Verify all functionality works
5. **Submit PR** - Include clear description of changes

---

This interactive visualization brings the Regen Mapping project to life, making complex schema relationships and data transformations accessible through an intuitive, engaging interface. The combination of 3D graphics, real-time data conversion, and smooth interactions creates a powerful tool for exploring the regenerative ecosystem.
