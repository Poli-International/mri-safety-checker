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

---

## Architecture Overview

### Technology Stack

- **HTML5**, Semantic markup with ARIA roles for accessibility
- **CSS3**, Single stylesheet (`/tools/mri-safety-checker/css/style.css`)
- **Vanilla JavaScript (ES6)**, No frameworks, no dependencies, no external libraries
- **Open Graph / Twitter Card meta tags**, Social sharing support

### File Structure

```
/tools/mri-safety-checker/
├── index.html          # Main tool page (standalone, self-contained)
├── css/
│   └── style.css       # All visual styling
└── js/
    ├── mri-data.js     # Material dataset (17 materials) + search index
    └── app.js          # UI logic, tab switching, search, card rendering
```

### Component / Logic Breakdown

| Component | File | Responsibility |
|---|---|---|
| **Material Dataset** | `mri-data.js` | Defines `MRI_MATERIALS` array, `MRI_INDEX` search index, `findMaterialByQuery()` lookup function |
| **Condition Config** | `app.js` | `CONDITION_CONFIG` object mapping condition keys to display properties (icon, CSS class, label, description) |
| **Tab System** | `app.js` | Two-tab interface: Search and Browse. Event listeners toggle `.tab-btn` and `.tab-panel` classes |
| **Search Engine** | `app.js` | `runSearch()` reads input, calls `findMaterialByQuery()`, renders result or "not found" card |
| **Browse View** | `app.js` | `renderBrowse()` groups materials by `mri_condition` and renders all cards in sections |
| **Card Builder** | `app.js` | `buildMaterialCard()` generates full HTML for a single material result card |
| **Accordion** | `app.js` | `toggleCard()` expands/collapses card body on header click; keyboard accessible |

---

## Data Schemas

### `CONDITION_CONFIG` (in `app.js`)

A static lookup object mapping condition keys to display metadata:

```javascript
{
  safe: {
    icon: '✅',
    cls: 'safe',
    label: 'MR Safe',
    badgeCls: 'badge--safe',
    desc: 'No known hazards in any MR environment.'
  },
  conditional: {
    icon: '⚠️',
    cls: 'conditional',
    label: 'MR Conditional',
    badgeCls: 'badge--conditional',
    desc: 'No known hazards under specified conditions.'
  },
  unsafe: {
    icon: '🚫',
    cls: 'unsafe',
    label: 'MR Unsafe',
    badgeCls: 'badge--unsafe',
    desc: 'Must be removed before MRI scan.'
  },
  check: {
    icon: '🔍',
    cls: 'check',
    label: 'Verify Grade',
    badgeCls: 'badge--check',
    desc: 'Composition-dependent, verify with manufacturer.'
  }
}
```

### `MRI_MATERIALS` Array (in `mri-data.js`)

Each entry is an object with the following fields. Example for `BioFlex®`:

```javascript
{
  id: 'bioflex',                          // string, unique identifier
  name: 'BioFlex®',                       // string, short display name
  full_name: 'BioFlex® Medical-Grade PTCA-PP Polymer', // string, full description
  category: 'polymer',                    // string: 'polymer' | 'metal' | 'other'
  mri_condition: 'safe',                  // string: 'safe' | 'conditional' | 'unsafe' | 'check'
  mri_label: 'MR Safe',                   // string, human-readable label
  astm_class: 'MR Safe',                  // string, ASTM F2503 classification text
  field_strength_limit: null,             // string or null, e.g. '3T', '1.5T'
  sar_limit: null,                        // string or null, e.g. '4 W/kg', '2 W/kg'
  notes: 'BioFlex® is a proprietary...',  // string, detailed description
  clinical_note: 'Ideal MRI retainer...', // string, clinical guidance
  also_known_as: [                        // array of strings, aliases
    'BioFlex retainer',
    'PTCA polymer bar',
    'PP-R body jewelry'
  ],
  common_uses: [                          // array of strings
    'piercing retainers',
    'tongue bars',
    'navel bars',
    'labret posts',
    'ear cartilage retainers'
  ],
  manufacturer: 'Poli International',     // string or null
  iso_reference: 'ISO 10993-6',           // string or null
  poli_url: 'https://poliinternational.com/bioflex/' // string or null, product link
}
```

The dataset contains **17 materials** across four condition groups:

| Condition | Count | Materials |
|---|---|---|
| MR Safe | 3 | BioFlex®, PTFE, Nylon/Acrylic |
| MR Conditional | 6 | Implant-Grade Titanium, Niobium, Implant-Grade Steel, Gold (14k/18k), Platinum, Anodised Titanium |
| MR Unsafe | 5 | Ferromagnetic Steel, Magnetic/Carbon Steel, Silver, Nickel Silver, Magnetic Jewelry |
| Verify Grade | 1 | "Surgical Steel" (unspecified grade) |

### `MRI_INDEX` (in `mri-data.js`)

A flat array of search index entries built at load time:

```javascript
[
  { key: 'bioflex', entry: <material object> },
  { key: 'bioflexmedicalgradepctapppolymer', entry: <material object> },
  { key: 'bioflexretainer', entry: <material object> },
  { key: 'ptcapolymerbar', entry: <material object> },
  { key: 'pprbodyjewelry', entry: <material object> },
  // ... all materials and their aliases
]
```

Keys are normalized by `normalizeMriName()`: lowercase, stripped of `®™\s\-_\/()` characters.

---

## Calculation / Logic Algorithms

### `normalizeMriName(s)` (in `mri-data.js`)

**Purpose:** Normalize a string for case-insensitive, punctuation-insensitive matching.

**Algorithm:**
1. Convert input to string (or empty string if null/undefined)
2. Convert to lowercase
3. Remove all occurrences of `®`, `™`, whitespace, hyphens, underscores, slashes, and parentheses via regex `/[®™\s\-_\/()]+/g`
4. Return normalized string

**Example:** `"BioFlex® Retainer"` → `"bioflexretainer"`

### `findMaterialByQuery(query)` (in `mri-data.js`)

**Purpose:** Search the material dataset by user input.

**Algorithm:**
1. If `query` is falsy, return `null`
2. Normalize `query` using `normalizeMriName()` → `q`
3. **Exact match:** Search `MRI_INDEX` for an entry where `key === q`. If found, return `entry`
4. **Partial match:** If no exact match, search `MRI_INDEX` for an entry where `key.includes(q)` AND `q.length >= 4`. If found, return `entry`
5. If neither match, return `null`

**Note:** Partial matches require a minimum query length of 4 characters to avoid overly broad results.

### `runSearch()` (in `app.js`)

**Purpose:** Execute a search and render results.

**Algorithm:**
1. Read and trim `searchInput.value`
2. If empty, clear `searchResults.innerHTML` and return
3. Call `findMaterialByQuery(q)` to get a material object or `null`
4. If material found: call `buildMaterialCard(material, q, true)` and set as `searchResults.innerHTML`
5. If not found: call `buildNotFoundCard(q)` and set as `searchResults.innerHTML`
6. Auto-expand the single result card by adding `expanded` class

### `renderBrowse()` (in `app.js`)

**Purpose:** Render the "Browse all materials" tab content.

**Algorithm:**
1. Check `browseRendered` flag; if already rendered, return (render once)
2. Set `browseRendered = true`
3. Define 4 groups: `safe`, `conditional`, `unsafe`, `check`, each with title and subtitle
4. For each group:
   - Filter `MRI_MATERIALS` where `m.mri_condition === group.condition`
   - Skip if empty
   - Look up `CONDITION_CONFIG[group.condition]` for icon and badge class
   - Build HTML: section with header (icon, title, subtitle, count badge) and list of material cards
5. Set `browseContainer.innerHTML` to assembled HTML

### `buildMaterialCard(m, query, autoId)` (in `app.js`)

**Purpose:** Generate HTML for a single material result card.

**Algorithm:**
1. Look up `CONDITION_CONFIG[m.mri_condition]` (fallback to `check`)
2. Build card ID: `'result-card-main'` if `autoId`, else `'card-' + escaped m.id`
3. Conditionally build:
   - `fieldBadge`: if `m.field_strength_limit` exists, render `≤ {value}` badge
   - `sarBadge`: if `m.sar_limit` exists, render `SAR ≤ {value}` badge
   - `poliHighlight`: if `m.manufacturer === 'Poli International'`, render branded highlight block
   - `alsoKnownAs`: if array non-empty, render tag list
   - `commonUses`: if array non-empty, render tag list
   - `actionLinks`: if `m.poli_url` exists, render product link; if `m.iso_reference` exists, render reference
   - `matchNote`: if `query` differs from `m.name`, show "Matched: {query}"
4. Assemble and return full card HTML string

### `buildNotFoundCard(query)` (in `app.js`)

**Purpose:** Generate HTML for when a search returns no results.

**Algorithm:**
1. Escape the query string
2. Render a card with:
   - Search icon
   - "`{query}` not found" message
   - Advisory text: treat as unverified, consult radiographer, consider BioFlex® retainer

### `toggleCard(headerEl)` (in `app.js`)

**Purpose:** Toggle accordion expansion of a result card.

**Algorithm:**
1. Find parent `.result-card` element
2. Toggle `expanded` class on the card
3. Set `aria-expanded` attribute on the header element to `'true'` or `'false'`

---

## API Reference

### Public Functions

| Function | Location | Parameters | Returns | Description |
|---|---|---|---|---|
| `normalizeMriName(s)` | `mri-data.js` | `s`: string | string | Normalizes a string for matching (lowercase, stripped of special chars) |
| `findMaterialByQuery(query)` | `mri-data.js` | `query`: string | material object or `null` | Searches the material dataset by exact or partial match |
| `runSearch()` | `app.js` | none | void | Reads search input, finds material, renders result |
| `renderBrowse()` | `app.js` | none | void | Renders all materials grouped by condition (runs once) |
| `buildMaterialCard(m, query, autoId)` | `app.js` | `m`: material object, `query`: string or null, `autoId`: boolean | string (HTML) | Builds a complete result card HTML string |
| `buildNotFoundCard(query)` | `app.js` | `query`: string | string (HTML) | Builds a "not found" card HTML string |
| `toggleCard(headerEl)` | `app.js` | `headerEl`: DOM element | void | Toggles accordion expansion on a result card |
| `escHtml(s)` | `app.js` | `s`: any | string | Escapes HTML special characters for XSS prevention |

### Event Handlers (attached in `app.js`)

| Handler | Element | Event | Behavior |
|---|---|---|---|
| Tab click handler | `.tab-btn` | `click` | Switches active tab, updates ARIA attributes, calls `renderBrowse()` if Browse tab selected |
| Search button handler | `#search-btn` | `click` | Calls `runSearch()` |
| Search input handler | `#search-input` | `keydown` | If `Enter` key pressed, calls `runSearch()` |
| Card header handler | `.card-header` | `click` | Calls `toggleCard(this)` |
| Keyboard handler | `document` | `keydown` | If `Enter` on `.card-header`, calls `toggleCard(e.target)` |

### Global Variables

| Variable | File | Type | Description |
|---|---|---|---|
| `CONDITION_CONFIG` | `app.js` | Object | Lookup table for condition display properties |
| `MRI_STANDARD` | `mri-data.js` | string | Constant: `'ASTM F2503'` |
| `MRI_MATERIALS` | `mri-data.js` | Array | Array of 17 material objects |
| `MRI_INDEX` | `mri-data.js` | Array | Flat search index built from materials and aliases |
| `browseRendered` | `app.js` | boolean | Flag to prevent re-rendering the browse view |

---

## Integration Guide

### Standalone Embedding (Iframe)

The tool can be embedded in any web page via an iframe:

```html
<iframe
  src="https://poliinternational.com/tools/mri-safety-checker/"
  width="100%"
  height="800"
  frameborder="0"
  title="MRI Safety Checker, Body Jewelry"
  allow="clipboard-read"
></iframe>
```

The tool detects if it is running in an iframe (`window.self !== window.top`) and:
- Automatically applies a dark theme (`data-theme="dark"`)
- Listens for `postMessage` events of type `poli-theme` to switch between light and dark themes

**Theme control from parent page:**

```javascript
// Send light theme
document.querySelector('iframe').contentWindow.postMessage({
  type: 'poli-theme',
  light: true
}, '*');

// Send dark theme
document.querySelector('iframe').contentWindow.postMessage({
  type: 'poli-theme',
  light: false
}, '*');
```

### Direct URL

The tool is fully functional at its live URL with no additional setup required:

```
https://poliinternational.com/tools/mri-safety-checker/
```

### Dependencies

**None.** The tool is a self-contained static HTML/CSS/JS application with zero external dependencies. No CDN links, no JavaScript frameworks, no CSS preprocessors.

---

## Customization

### Styling

All visual styles are in `/tools/mri-safety-checker/css/style.css`. The tool uses CSS custom properties for theming. Key customization points:

- **Badge colors:** `.badge--safe`, `.badge--conditional`, `.badge--unsafe`, `.badge--check`, `.badge--poli`, `.badge--info`
- **Card borders:** `.result-card--safe`, `.result-card--conditional`, `.result-card--unsafe`, `.result-card--check`
- **Clinical note backgrounds:** `.clinical-note--safe`, `.clinical-note--conditional`, `.clinical-note--unsafe`, `.clinical-note--check`
- **Browse group headers:** `.browse-group--safe`, `.browse-group--conditional`, `.browse-group--unsafe`, `.browse-group--check`

### Dataset

To add, remove, or modify materials, edit the `MRI_MATERIALS` array in `mri-data.js`. The search index (`MRI_INDEX`) rebuilds automatically on page load. No other files need modification.

### Branding

- **Poli International highlight:** Controlled by `m.manufacturer === 'Poli International'` check in `buildMaterialCard()`. Update the string or logic to change which materials show the branded highlight.
- **BioFlex® product link:** Controlled by `m.poli_url` field. Update the URL or remove the field to hide the link.

---

## Performance

- **Zero network requests** beyond the initial page load (HTML, CSS, JS files)
- **No images**, all icons are Unicode emoji characters
- **No external fonts** or resources
- **Search index** is built once at page load with O(n) complexity (n = number of material entries + aliases)
- **Search algorithm** is O(n) worst-case for partial matches (linear scan of index)
- **Browse view** renders once and caches via `browseRendered` flag
- **No animations, no polling, no timers**

Total payload (approximate):
- HTML: ~5 KB
- CSS: unknown (not provided, but single file)
- JS (both files): ~15 KB combined

---

## Browser Compatibility

The tool uses standard ES6 JavaScript features:

- `const` / `let`
- Arrow functions
- Template literals
- `Array.filter()`, `Array.map()`, `Array.find()`, `Array.forEach()`
- `String.includes()`, `String.replace()` with regex
- `classList.toggle()`, `classList.add()`, `classList.remove()`
- `Element.closest()`
- `window.self`, `window.top`, `postMessage`

**Supported browsers:**
- Chrome 49+
- Firefox 52+
- Safari 10+
- Edge 14+
- Opera 36+

**Not supported:** Internet Explorer 11 and below (no `String.includes()`, no `classList.toggle()` with second argument, no arrow functions).

---

## Security

### Input Handling

- **Search input** is read via `searchInput.value` and trimmed with `.trim()`
- **No user input** is ever written to the DOM without escaping
- **No user input** is stored, transmitted, or processed server-side

### XSS Prevention

The `escHtml()` function escapes all user-controlled strings before rendering:

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
- Search query display in result cards and "not found" cards
- All material field values rendered in cards (name, notes, clinical notes, aliases, etc.)
- All dynamic content from the dataset

### Iframe Security

- The tool sets `<meta name="robots" content="noindex, nofollow">` to prevent search engine indexing of the tool page itself
- The tool detects iframe embedding and applies dark theme automatically
- The tool listens for `postMessage` events only from the parent window (no origin validation, but only accepts messages with `type: 'poli-theme'`)

### Content Security

- No inline event handlers in HTML (all event binding via `addEventListener` in JS)
- No `eval()` or `innerHTML` with unescaped content
- No external scripts or resources

---

## Version History

| Version | Date | Changes |
|---|---|---|
| 1.0.0 | 2026 | Initial release. 17 materials classified under ASTM F2503. Search and browse views. Accordion card UI. Iframe embedding with theme support. |

---

## Support and Contact

For questions, bug reports, or feature requests:

- **Email:** support@poliinternational.com
- **Website:** https://poliinternational.com/
- **Tool URL:** https://poliinternational.com/tools/mri-safety-checker/

**Clinical disclaimer:** This tool is for informational purposes only and does not replace clinical judgement or site-specific MRI safety protocols. Always confirm jewelry material and MR condition with the attending radiographer or MRI safety officer before scanning.
