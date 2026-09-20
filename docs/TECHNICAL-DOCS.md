# Technical Documentation: MRI Preparation Guide: Body Jewelry

**Publisher**: Poli International  
**Architecture**: Pure client-side static web tool (HTML5 / Vanilla ES6+ / CSS3)  
**Security & Privacy**: Zero external network calls, zero third-party CDNs, Content Security Policy enforced (`script-src 'self'`)  
**Persistent Storage**: Optional client-side browser `localStorage` (`poli_mri_disclosure_card`, `poli_tools_language`) solely on user prompt

---

## 1. System Architecture & Standards

- **No Remote Tracking or Telemetry**: Conforms to client-side data isolation. No cookies or external scripts.
- **Content Security Policy (CSP)**: Designed for `default-src 'self'; script-src 'self'; style-src 'self'`. All SVG icons are rendered inline; all stylesheets are locally hosted.
- **ASTM F2503 Design Standard**: The tool strictly refrains from assigning device-level ASTM F2503 classifications ("MR Safe", "MR Conditional", "MR Unsafe") to raw material categories. Material entries represent bulk physical composition, magnetic susceptibility characteristics, and RF heating considerations only.
- **BioFlex® Specification**: Represented accurately as medical-grade polypropylene random copolymer (PP-R). BioFlex® is never conflated with PTFE.

---

## 2. File Organization

```
/
├── index.html                 # Semantic entry point with accessibility attributes and i18n hooks
├── manifest.webmanifest       # Web application manifest (start_url and scope ./)
├── css/
│   ├── style.css              # Custom CSS variables, dark/light themes, @media print layout
│   ├── print.css              # Print stylesheet for high-contrast output
│   └── a11y.css               # Focus visible and motion reduction utilities
├── js/
│   ├── i18n.js                # Synchronous UI dictionary & 7-language Card translation dictionary
│   ├── mri-data.js            # Material composition dataset (no ASTM labels)
│   └── app.js                 # Checklist state manager, search engine, print formatter
├── docs/
│   ├── USER-GUIDE.md          # End-user operational guide (English)
│   ├── USER-GUIDE-fr.md       # French translation
│   ├── USER-GUIDE-it.md       # Italian translation
│   ├── USER-GUIDE-de.md       # German translation
│   ├── USER-GUIDE-es.md       # Spanish translation
│   ├── USER-GUIDE-nl.md       # Dutch translation
│   ├── USER-GUIDE-pt.md       # Portuguese translation
│   └── TECHNICAL-DOCS.md      # Technical architecture documentation
├── README.md                  # Project overview and deployment guide
└── CONTRIBUTING.md            # Guidelines for maintainers
```

---

## 3. Data Schema: `MRI_MATERIALS` (`js/mri-data.js`)

Each material record implements the following schema:

```typescript
interface MriMaterial {
  id: string;                  // Unique identifier (e.g. 'bioflex', 'titanium_f136')
  name: string;                // Primary display name
  full_name: string;           // Technical standard / alloy specification
  category: 'polymer' | 'metal' | 'glass' | 'ferromagnetic_device';
  is_metallic: boolean;        // Electrical conductivity distinction
  magnetic_type: string;       // 'non_magnetic' | 'paramagnetic' | 'diamagnetic' | etc.
  magnetic_label: string;      // Human-readable physical classification
  rf_heating: string;          // Radiofrequency induction and eddy-current risk notes
  image_artifact: string;      // Susceptibility void and artifact profile
  composition_notes: string;   // Metallurgical or chemical composition
  briefing_advice: string;     // Objective statement for radiographer discussion
  aliases: string[];           // Search index keywords
  typical_uses: string[];      // Common piercing jewelry types
}
```

---

## 4. Internationalization Engine (`js/i18n.js`)

1. **Synchronous Execution**: The dictionary loads in document order before `app.js` executes, preventing raw key path flashes or asynchronous race conditions.
2. **Dual Scope**:
   - `window.t(key, params)`: Universal string resolution for main UI views.
   - `window.tCard(key, lang, params)`: Multi-language resolution for the printable disclosure card in English (`en`), German (`de`), Spanish (`es`), French (`fr`), Italian (`it`), Dutch (`nl`), and Portuguese (`pt`).
3. **Token Replacement**: Uses bracketed `{param}` tokens matching JavaScript parameter object properties.

---

## 5. Print Styling Architecture (`@media print`)

When `window.print()` is invoked:
- All navigation headers, rule banners, tabs, action buttons, filter bars, and theme controls are hidden via `display: none !important`.
- The `.printable-card-preview` container unwraps into a full-width high-contrast document styled for standard A4 and US Letter printing.
- Uses high-contrast black text (`#000000`) on white backgrounds with explicit border weights to ensure clear legibility for hospital screening personnel.
