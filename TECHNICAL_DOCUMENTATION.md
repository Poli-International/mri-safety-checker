# MRI Safety Checker, Body Jewelry - Technical Documentation

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Data Schemas](#data-schemas)
3. [Calculation / Logic Algorithms](#calculation--logic-algorithms)
4. [API Reference](#api-reference)
5. [Integration Guide](#integration-guide)
6. [Customization](#customization)
7. [Performance](#performance)
8. [Browser Compatibility](#browser-compatibility)
9. [Security](#security)
10. [Version History](#version-history)
11. [Support and Contact](#support-and-contact)

## Architecture Overview

### Technology Stack

The tool is a standalone, dependency-free static web application built with:

- **HTML5** - Semantic markup with ARIA roles for accessibility
- **CSS3** - Single stylesheet (`/tools/mri-safety-checker/css/style.css`)
- **Vanilla JavaScript (ES6)** - No frameworks, libraries, or build tools
- **No server-side dependencies** - All logic executes client-side

### File Structure

```
/tools/mri-safety-checker/
├── index.html          # Main HTML document (UI structure, meta tags, OG/Twitter cards)
├── css/
│   └── style.css       # All visual styling (referenced, not provided in source)
└── js/
    ├── mri-data.js     # Material dataset (MRI_MATERIALS array), search index, normalization
    └── app.js          # UI logic: tabs, search, browse, accordion, card rendering
```

### Component / Logic Breakdown

| Component | File | Responsibility |
|-----------|------|----------------|
| **HTML Shell** | `index.html` | Page structure, meta tags, Open Graph/Twitter card metadata, tab panels, disclaimer |
| **Data Layer** | `mri-data.js` | `MRI_MATERIALS` array (17 material entries), `MRI_INDEX` search index, `findMaterialByQuery()` |
| **UI Logic** | `app.js` | Tab switching, search execution, browse rendering, accordion toggling, card building |
| **Configuration** | `app.js` | `CONDITION_CONFIG` object mapping MRI condition codes to display properties |
| **Styling** | `style.css` | All visual presentation (file referenced but not provided in source) |

### Data Flow

1. User enters a query or clicks "Browse all materials"
2. `app.js` calls `findMaterialByQuery()` from `mri-data.js`
3. Matching material object is passed to `buildMaterialCard()`
4. Card HTML is rendered into the search results or browse container
5. Accordion behavior is handled by `toggleCard()` on click/keypress

## Data Schemas

### `CONDITION_CONFIG` (app.js)

Configuration object mapping MRI condition codes to display properties:

```javascript
{
  safe: {
    icon: '✅',
    cls: 'safe',
    label: 'MR Safe',
    badgeCls: 'badge--safe',
    desc: 'No known hazards in any MR environment.',
  },
  conditional: {
    icon: '⚠️',
    cls: 'conditional',
    label: 'MR Conditional',
    badgeCls: 'badge--conditional',
    desc: 'No known hazards under specified conditions.',
  },
  unsafe: {
    icon: '🚫',
    cls: 'unsafe',
    label: 'MR Unsafe',
    badgeCls: 'badge--unsafe',
    desc: 'Must be removed before MRI scan.',
  },
  check: {
    icon: '🔍',
    cls: 'check',
    label: 'Verify Grade',
    badgeCls: 'badge--check',
    desc: 'Composition-dependent — verify with manufacturer.',
  },
}
```

### `MRI_MATERIALS` Array (mri-data.js)

Array of 17 material objects. Each object uses the following fields:

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | string | yes | Unique identifier (kebab-case) | `"bioflex"` |
| `name` | string | yes | Short display name | `"BioFlex®"` |
| `full_name` | string | yes | Full descriptive name | `"BioFlex® Medical-Grade PTCA-PP Polymer"` |
| `category` | string | yes | Material category | `"polymer"`, `"metal"`, `"other"` |
| `mri_condition` | string | yes | Condition code | `"safe"`, `"conditional"`, `"unsafe"`, `"check"` |
| `mri_label` | string | yes | Human-readable label | `"MR Safe"`, `"MR Conditional"`, `"MR Unsafe"`, `"Remove Before MRI"`, `"Verify Grade"` |
| `astm_class` | string | yes | ASTM F2503 classification text | `"MR Safe"`, `"MR Conditional"`, `"MR Unsafe"`, `"Remove"`, `"Conditional — verify"` |
| `field_strength_limit` | string or null | yes | Maximum safe field strength | `"3T"`, `"1.5T"`, `null` |
| `sar_limit` | string or null | yes | Maximum specific absorption rate | `"4 W/kg"`, `"2 W/kg"`, `null` |
| `notes` | string | yes | Detailed description | `"BioFlex® is a proprietary medical-grade polymer..."` |
| `clinical_note` | string | yes | Short clinical guidance | `"Ideal MRI retainer..."` |
| `also_known_as` | array of strings | yes | Alternative names/aliases | `["BioFlex retainer", "PTCA polymer bar"]` |
| `common_uses` | array of strings | yes | Typical applications | `["piercing retainers", "tongue bars"]` |
| `manufacturer` | string or null | yes | Manufacturer name | `"Poli International"`, `null` |
| `iso_reference` | string or null | yes | Applicable standard | `"ISO 10993-6"`, `"ASTM F136, ISO 5832-3"`, `null` |
| `poli_url` | string or null | yes | Poli product page URL | `"https://poliinternational.com/bioflex/"`, `null` |

#### Material Distribution by Condition

| Condition | Count | Materials |
|-----------|-------|-----------|
| `safe` | 3 | BioFlex®, PTFE, Nylon/Acrylic |
| `conditional` | 6 | Implant-Grade Titanium, Niobium, Implant-Grade Steel, Gold, Platinum, Anodised Titanium |
| `unsafe` | 6 | Ferromagnetic Steel, Magnetic/Carbon Steel, Silver, Nickel Silver, Magnetic Jewelry |
| `check` | 1 | "Surgical Steel" (unspecified grade) |

### `MRI_INDEX` (mri-data.js)

Precomputed search index array. Each entry:

```javascript
{
  key: string,   // Normalized name (lowercase, stripped of ®™ and special chars)
  entry: object  // Reference to the original MRI_MATERIALS object
}
```

Generated by iterating over each material's `name`, `full_name`, and all `also_known_as` entries.

## Calculation / Logic Algorithms

### `normalizeMriName(s)` (mri-data.js)

**Purpose**: Normalizes a string for fuzzy matching against the search index.

**Algorithm**:
1. Convert input to lowercase string
2. Remove registered trademark symbols (`®`, `™`)
3. Remove whitespace, hyphens, underscores, slashes, and parentheses
4. Return the cleaned string

**Example**: `"BioFlex®"` → `"bioflex"`, `"316LVM Steel"` → `"316lvmsteel"`

### `findMaterialByQuery(query)` (mri-data.js)

**Purpose**: Find a material object matching a user's search query.

**Algorithm**:
1. If query is empty/null, return `null`
2. Normalize query using `normalizeMriName()`
3. **Exact match**: Search `MRI_INDEX` for entry where `key === normalizedQuery`
4. If found, return the associated material object
5. **Partial match**: If exact match fails AND query length >= 4 characters, search for entry where `key.includes(normalizedQuery)`
6. If partial match found, return the associated material object
7. If no match found, return `null`

**Note**: Partial matching only activates for queries of 4+ characters to avoid false positives.

### `buildMaterialCard(m, query, autoId)` (app.js)

**Purpose**: Generate HTML for a material result card.

**Algorithm**:
1. Look up condition configuration from `CONDITION_CONFIG` using `m.mri_condition`
2. Generate card ID: `"result-card-main"` if `autoId` is true, otherwise `"card-{material.id}"`
3. Build optional field strength badge if `m.field_strength_limit` exists
4. Build optional SAR badge if `m.sar_limit` exists
5. Check if manufacturer is "Poli International" to add highlight banner
6. Build "also known as" tags if array is non-empty
7. Build "common uses" tags if array is non-empty
8. Build action links if `m.poli_url` or `m.iso_reference` exist
9. Build match note if query differs from material name
10. Assemble and return complete HTML string

### `buildNotFoundCard(query)` (app.js)

**Purpose**: Generate HTML for a "not found" state when search yields no results.

**Algorithm**:
1. Escape the query string for safe HTML display
2. Return HTML with search icon, query text, and guidance to consult radiographer or switch to BioFlex®

### `toggleCard(headerEl)` (app.js)

**Purpose**: Toggle accordion expansion on a result card.

**Algorithm**:
1. Find parent `.result-card` element from the clicked header
2. Toggle the `expanded` CSS class on the card
3. Update `aria-expanded` attribute on the header element (`"true"` when expanded, `"false"` when collapsed)

### `runSearch()` (app.js)

**Purpose**: Execute a search from the search input field.

**Algorithm**:
1. Read and trim value from `#search-input`
2. If empty, clear `#search-results` and return
3. Call `findMaterialByQuery()` with the query
4. If material found, call `buildMaterialCard()` and inject into `#search-results`
5. If not found, call `buildNotFoundCard()` and inject into `#search-results`
6. Auto-expand the single result card by adding `expanded` class

### `renderBrowse()` (app.js)

**Purpose**: Render the "Browse all materials" view.

**Algorithm**:
1. Check `browseRendered` flag; if already rendered, skip
2. Define 4 groups: `safe`, `conditional`, `unsafe`, `check`
3. For each group, filter `MRI_MATERIALS` by `mri_condition`
4. Skip empty groups
5. Build section with group header (icon, title, subtitle, count badge)
6. Render all materials in the group using `buildMaterialCard()`
7. Set `browseRendered = true`

## API Reference

### Global Functions (mri-data.js)

#### `normalizeMriName(s)`

| Parameter | Type | Description |
|-----------|------|-------------|
| `s` | string | Raw string to normalize |

**Returns**: Normalized lowercase string with special characters removed.

#### `findMaterialByQuery(query)`

| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | string | User search query |

**Returns**: Material object from `MRI_MATERIALS` or `null` if not found.

### Global Functions (app.js)

#### `escHtml(s)`

| Parameter | Type | Description |
|-----------|------|-------------|
| `s` | any | Value to escape |

**Returns**: HTML-safe string with `&`, `<`, `>`, `"` escaped.

#### `buildMaterialCard(m, query, autoId)`

| Parameter | Type | Description |
|-----------|------|-------------|
| `m` | object | Material object from `MRI_MATERIALS` |
| `query` | string or null | Original search query (for match highlighting) |
| `autoId` | boolean | If true, uses fixed ID `"result-card-main"` |

**Returns**: HTML string for a result card.

#### `buildNotFoundCard(query)`

| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | string | The search query that returned no results |

**Returns**: HTML string for a not-found card.

#### `toggleCard(headerEl)`

| Parameter | Type | Description |
|-----------|------|-------------|
| `headerEl` | DOM element | The `.card-header` element that was clicked |

**Returns**: `undefined` (mutates DOM).

#### `runSearch()`

**Parameters**: None (reads from `#search-input`).

**Returns**: `undefined` (mutates DOM).

#### `renderBrowse()`

**Parameters**: None.

**Returns**: `undefined` (mutates DOM).

### Event Handlers (app.js)

| Handler | Element | Event | Behavior |
|---------|---------|-------|----------|
| Tab click | `.tab-btn` | `click` | Switches active tab, updates ARIA attributes, calls `renderBrowse()` if browse tab selected |
| Search button | `#search-btn` | `click` | Calls `runSearch()` |
| Search input | `#search-input` | `keydown` | Calls `runSearch()` if Enter key pressed |
| Card header | `.card-header` | `click` | Calls `toggleCard()` |
| Card header | `.card-header` | `keydown` (Enter) | Calls `toggleCard()` (delegated via document listener) |

### Global Constants

| Constant | File | Value |
|----------|------|-------|
| `MRI_STANDARD` | `mri-data.js` | `'ASTM F2503'` |
| `CONDITION_CONFIG` | `app.js` | Object with 4 condition configurations |
| `MRI_MATERIALS` | `mri-data.js` | Array of 17 material objects |
| `MRI_INDEX` | `mri-data.js` | Precomputed search index array |

## Integration Guide

### Standalone Embedding

The tool is fully self-contained and can be embedded via iframe:

```html
<iframe
  src="https://poliinternational.com/tools/mri-safety-checker/"
  width="100%"
  height="800"
  frameborder="0"
  title="MRI Safety Checker — Body Jewelry"
  loading="lazy"
></iframe>
```

### Iframe Communication

The tool detects if it is running in an iframe (`window.self !== window.top`) and:

1. Automatically applies dark theme (`data-theme="dark"`)
2. Listens for `message` events of type `poli-theme` to toggle between light and dark themes

**Parent page example**:

```javascript
// Send theme preference to the iframe
const iframe = document.querySelector('iframe');
iframe.contentWindow.postMessage({
  type: 'poli-theme',
  light: true   // or false for dark
}, '*');
```

### Dependencies

**Zero external dependencies**. The tool uses only:
- Vanilla HTML5
- Vanilla CSS3
- Vanilla JavaScript ES6

No jQuery, React, Vue, or any third-party libraries are required.

## Customization

### Data Customization

To add, remove, or modify materials, edit the `MRI_MATERIALS` array in `mri-data.js`. Each material object must include all required fields listed in the [Data Schemas](#mri_materials-array-mri-datajs) section.

### Styling Customization

All visual styles are in `style.css`. Key CSS classes for customization:

| Class | Purpose |
|-------|---------|
| `.tool-wrapper` | Main container |
| `.result-card` | Individual result card |
| `.result-card--safe` | MR Safe card styling |
| `.result-card--conditional` | MR Conditional card styling |
| `.result-card--unsafe` | MR Unsafe card styling |
| `.result-card--check` | Verify Grade card styling |
| `.badge--safe` | MR Safe badge |
| `.badge--conditional` | MR Conditional badge |
| `.badge--unsafe` | MR Unsafe badge |
| `.badge--check` | Verify Grade badge |
| `.badge--poli` | Poli International manufacturer badge |
| `.badge--info` | Field strength/SAR info badge |
| `.poli-highlight` | Poli product highlight banner |
| `.clinical-note` | Clinical guidance section |
| `.clinical-note--safe` | Safe clinical note styling |
| `.clinical-note--conditional` | Conditional clinical note styling |
| `.clinical-note--unsafe` | Unsafe clinical note styling |
| `.clinical-note--check` | Check clinical note styling |

### Content Customization

- **Page title**: Edit `<title>` in `index.html`
- **Meta descriptions**: Edit `<meta name="description">`, OG, and Twitter card tags in `index.html`
- **Disclaimer text**: Edit the `.disclaimer` div in `index.html`
- **ASTM note**: Edit the `.astm-note` div in `index.html`

## Performance

### Load Time

- **Total file size**: Approximately 25-30 KB (HTML + CSS + JS)
- **HTTP requests**: 3 (HTML, CSS, JS)
- **No external resources**: Zero external fonts, icons, or libraries

### Rendering

- **Search**: Executes in O(n) where n is the number of index entries (approximately 50 entries)
- **Browse**: Renders all 17 materials grouped by condition; executed once per session (cached via `browseRendered` flag)
- **Card expansion**: Pure CSS class toggle, no re-rendering required

### Memory

- Data is stored in a single global array (`MRI_MATERIALS`) and a precomputed index (`MRI_INDEX`)
- No localStorage, sessionStorage, or IndexedDB usage
- No persistent state between page loads

## Browser Compatibility

The tool uses standard ES6 features and should work in:

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 49+ |
| Firefox | 54+ |
| Safari | 10+ |
| Edge | 14+ |
| Opera | 36+ |
| iOS Safari | 10+ |
| Android Chrome | 49+ |

**Features used**:
- `const` / `let` (ES6)
- Arrow functions (ES6)
- Template literals (ES6)
- `Array.filter()`, `Array.map()`, `Array.find()`, `Array.includes()`
- `classList.toggle()`, `classList.add()`, `classList.remove()`
- `dataset` property
- `querySelectorAll()`, `closest()`
- `forEach()` on NodeList
- `for...of` loops (not used but supported)
- `window.self`, `window.top`, `postMessage`

## Security

### XSS Prevention

All user input is sanitized through the `escHtml()` function before being rendered to the DOM:

```javascript
function escHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
```

This function is applied to:
- Search query text in `buildNotFoundCard()`
- All material field values in `buildMaterialCard()`
- All dynamically generated HTML content

### Input Handling

- Search input has `autocomplete="off"` and `spellcheck="false"`
- No form submission (search is triggered via JavaScript event handlers)
- No user data is stored or transmitted
- No cookies are set

### Iframe Security

- The tool includes `<meta name="robots" content="noindex, nofollow">` to prevent indexing of the tool page
- Iframe communication is restricted to messages of type `poli-theme`
- No sensitive data is exposed via postMessage

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026 | Initial release. 17 materials classified under ASTM F2503. Search, browse, and accordion UI. |

## Support and Contact

For questions, corrections, or data update requests:

- **Email**: support@poliinternational.com
- **Website**: https://poliinternational.com
- **Tool URL**: https://poliinternational.com/tools/mri-safety-checker/

### Reporting Issues

When reporting issues, please include:
1. Browser name and version
2. Operating system
3. Steps to reproduce the issue
4. Expected vs actual behavior
5. Screenshots if applicable

### Data Corrections

If you have verified MRI safety data for a material not currently listed, or if existing data requires correction, please contact support with:
- Material name and full description
- ASTM F2503 classification
- Supporting documentation or references
- Field strength and SAR limits (if MR Conditional)
