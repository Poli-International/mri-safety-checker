/*
  MRI Safety Checker — UI Logic
  Poli International | 2026
*/

'use strict';

// ─── Condition config ─────────────────────────────────────────────
const CONDITION_CONFIG = {
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
};

// ─── XSS protection ───────────────────────────────────────────────
function escHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Tab switching ────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tab);
      b.setAttribute('aria-selected', b.dataset.tab === tab ? 'true' : 'false');
    });
    document.querySelectorAll('.tab-panel').forEach(p => {
      p.classList.toggle('active', p.id === 'panel-' + tab);
    });
    if (tab === 'browse') renderBrowse();
  });
});

// ─── Search tab ───────────────────────────────────────────────────
const searchInput = document.getElementById('search-input');
const searchBtn   = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');

function runSearch() {
  const q = (searchInput.value || '').trim();
  if (!q) {
    searchResults.innerHTML = '';
    return;
  }
  const material = findMaterialByQuery(q);
  if (material) {
    searchResults.innerHTML = buildMaterialCard(material, q, true);
  } else {
    searchResults.innerHTML = buildNotFoundCard(q);
  }
  // auto-expand single result
  const card = searchResults.querySelector('.result-card');
  if (card && !card.classList.contains('expanded')) {
    card.classList.add('expanded');
  }
}

searchBtn.addEventListener('click', runSearch);
searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') runSearch(); });

// ─── Browse tab ───────────────────────────────────────────────────
const browseContainer = document.getElementById('browse-container');
let browseRendered = false;

function renderBrowse() {
  if (browseRendered) return;
  browseRendered = true;

  const groups = [
    { condition: 'safe',        title: 'MR Safe',        subtitle: 'No known hazards in any MR environment' },
    { condition: 'conditional', title: 'MR Conditional',  subtitle: 'Safe under specified field strength / SAR limits' },
    { condition: 'unsafe',      title: 'MR Unsafe',       subtitle: 'Must be removed before MRI scan' },
    { condition: 'check',       title: 'Verify Grade',    subtitle: 'Composition-dependent — check with manufacturer' },
  ];

  let html = '';
  groups.forEach(group => {
    const materials = MRI_MATERIALS.filter(m => m.mri_condition === group.condition);
    if (!materials.length) return;
    const cfg = CONDITION_CONFIG[group.condition];
    html += `
      <section class="browse-group browse-group--${cfg.cls}" aria-label="${escHtml(group.title)}">
        <div class="browse-group__header">
          <span class="browse-group__icon">${cfg.icon}</span>
          <div>
            <h2 class="browse-group__title">${escHtml(group.title)}</h2>
            <p class="browse-group__sub">${escHtml(group.subtitle)}</p>
          </div>
          <span class="badge ${cfg.badgeCls} browse-group__count">${materials.length}</span>
        </div>
        <div class="browse-list">
          ${materials.map(m => buildMaterialCard(m, null, false)).join('')}
        </div>
      </section>`;
  });

  browseContainer.innerHTML = html;
}

// ─── Card builder ─────────────────────────────────────────────────
function buildMaterialCard(m, query, autoId) {
  const cfg = CONDITION_CONFIG[m.mri_condition] || CONDITION_CONFIG.check;
  const cardId = autoId ? 'result-card-main' : `card-${escHtml(m.id)}`;

  const fieldBadge = m.field_strength_limit
    ? `<span class="badge badge--info">≤ ${escHtml(m.field_strength_limit)}</span>` : '';
  const sarBadge = m.sar_limit
    ? `<span class="badge badge--info">SAR ≤ ${escHtml(m.sar_limit)}</span>` : '';

  const isPoliProduct = m.manufacturer === 'Poli International';
  const poliHighlight = isPoliProduct
    ? `<div class="poli-highlight">
        <span class="poli-highlight__logo">P</span>
        <span>Made by Poli International — the only body jewelry purpose-built for MRI environments.</span>
       </div>` : '';

  const alsoKnownAs = (m.also_known_as || []).length
    ? `<div class="detail-tags">${m.also_known_as.map(a => `<span class="detail-tag">${escHtml(a)}</span>`).join('')}</div>` : '';

  const commonUses = (m.common_uses || []).length
    ? `<div class="detail-tags">${m.common_uses.map(u => `<span class="detail-tag">${escHtml(u)}</span>`).join('')}</div>` : '';

  const actionLinks = [];
  if (m.poli_url) {
    actionLinks.push(`<a href="${escHtml(m.poli_url)}" target="_blank" rel="noopener noreferrer">🔗 BioFlex® Product Page</a>`);
  }
  if (m.iso_reference) {
    actionLinks.push(`<span class="action-ref">📋 ${escHtml(m.iso_reference)}</span>`);
  }

  const matchNote = query && query !== m.name
    ? `<span class="match-note">Matched: <em>${escHtml(query)}</em></span>` : '';

  return `
    <div id="${cardId}" class="result-card result-card--${cfg.cls}" role="article">
      <div class="card-header" onclick="toggleCard(this)" tabindex="0" aria-expanded="false">
        <span class="card-status-icon" aria-hidden="true">${cfg.icon}</span>
        <div class="card-title-block">
          <div class="card-name">${escHtml(m.name)}</div>
          <div class="card-name-sub">${escHtml(m.full_name)}${matchNote ? ' · ' + matchNote : ''}</div>
        </div>
        <div class="card-badges">
          <span class="badge ${cfg.badgeCls}">${escHtml(cfg.label)}</span>
          ${fieldBadge}
          ${sarBadge}
          ${isPoliProduct ? '<span class="badge badge--poli">Poli International</span>' : ''}
        </div>
        <span class="card-chevron" aria-hidden="true">▼</span>
      </div>
      <div class="card-body">
        ${poliHighlight}
        <p class="card-notes">${escHtml(m.notes)}</p>
        <div class="clinical-note clinical-note--${cfg.cls}">
          <strong>Clinical note:</strong> ${escHtml(m.clinical_note)}
        </div>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">ASTM Classification</span>
            <span class="detail-value">${escHtml(m.astm_class)}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Category</span>
            <span class="detail-value">${escHtml(m.category)}</span>
          </div>
          ${m.field_strength_limit ? `<div class="detail-item">
            <span class="detail-label">Max Field Strength</span>
            <span class="detail-value">${escHtml(m.field_strength_limit)}</span>
          </div>` : ''}
          ${m.sar_limit ? `<div class="detail-item">
            <span class="detail-label">Max SAR</span>
            <span class="detail-value">${escHtml(m.sar_limit)}</span>
          </div>` : ''}
          ${m.manufacturer ? `<div class="detail-item">
            <span class="detail-label">Manufacturer</span>
            <span class="detail-value">${escHtml(m.manufacturer)}</span>
          </div>` : ''}
          ${m.iso_reference ? `<div class="detail-item">
            <span class="detail-label">Standard</span>
            <span class="detail-value"><code>${escHtml(m.iso_reference)}</code></span>
          </div>` : ''}
        </div>
        ${(m.also_known_as || []).length ? `<div class="detail-section"><div class="detail-label">Also known as</div>${alsoKnownAs}</div>` : ''}
        ${(m.common_uses || []).length ? `<div class="detail-section"><div class="detail-label">Common uses</div>${commonUses}</div>` : ''}
        ${actionLinks.length ? `<div class="card-action-row">${actionLinks.join('')}</div>` : ''}
      </div>
    </div>`;
}

function buildNotFoundCard(query) {
  return `
    <div class="not-found-card">
      <span class="nf-icon">🔍</span>
      <div class="nf-text">
        <div class="nf-name">&ldquo;${escHtml(query)}&rdquo; not found</div>
        <div class="nf-sub">
          This material isn&rsquo;t in the dataset. If it contains metal components,
          treat as <strong>unverified</strong> and consult your radiographer before scanning.
          Consider switching to a <a href="https://poliinternational.com/bioflex/" target="_blank" rel="noopener noreferrer">BioFlex® retainer</a> for guaranteed MR Safe status.
        </div>
      </div>
    </div>`;
}

// ─── Accordion ────────────────────────────────────────────────────
function toggleCard(headerEl) {
  const card = headerEl.closest('.result-card');
  const expanded = card.classList.toggle('expanded');
  headerEl.setAttribute('aria-expanded', expanded ? 'true' : 'false');
}

// keyboard support
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.classList.contains('card-header')) {
    toggleCard(e.target);
  }
});

// ─── Idle state ───────────────────────────────────────────────────
searchResults.innerHTML = `
  <div class="idle-state">
    <div class="idle-state__icon">🧲</div>
    <div class="idle-state__text">
      Enter a material name — e.g. <em>BioFlex</em>, <em>titanium</em>, <em>sterling silver</em>
    </div>
  </div>`;
