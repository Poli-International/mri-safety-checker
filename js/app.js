/**
 * MRI Preparation Guide: Application Logic
 * Poli International | V2
 *
 * Patient-safety focused, 100% client-side, zero external dependencies.
 */

'use strict';

(function() {
  // ─── State Management ─────────────────────────────────────────────
  const state = {
    activeTab: 'checklist',
    materialFilter: 'all',
    searchQuery: '',
    cardScanLang: 'en',
    patientName: '',
    scanDate: '',
    scanRegion: '',
    checklist: [
      // Each entry: { id, siteKey, checked, qty, materialId, removable, retainer, notes }
    ]
  };

  const SITES_CONFIG = [
    { id: 'ears', key: 'checklist.site_ears', defaultMaterial: 'titanium_f136' },
    { id: 'nostril', key: 'checklist.site_nostril', defaultMaterial: 'titanium_f136' },
    { id: 'septum', key: 'checklist.site_septum', defaultMaterial: 'titanium_f136' },
    { id: 'lip', key: 'checklist.site_lip', defaultMaterial: 'titanium_f136' },
    { id: 'tongue', key: 'checklist.site_tongue', defaultMaterial: 'titanium_f136' },
    { id: 'eyebrow', key: 'checklist.site_eyebrow', defaultMaterial: 'titanium_f136' },
    { id: 'nipples', key: 'checklist.site_nipples', defaultMaterial: 'titanium_f136' },
    { id: 'navel', key: 'checklist.site_navel', defaultMaterial: 'titanium_f136' },
    { id: 'genital', key: 'checklist.site_genital', defaultMaterial: 'titanium_f136' },
    { id: 'dermals', key: 'checklist.site_dermals', defaultMaterial: 'titanium_f136', defaultRemovable: 'dermal' },
    { id: 'retainers', key: 'checklist.site_retainers', defaultMaterial: 'bioflex', defaultRetainer: 'fitted' },
    { id: 'closed', key: 'checklist.site_closed', defaultMaterial: 'unknown' }
  ];

  // ─── DOM References ───────────────────────────────────────────────
  const navTabs = document.querySelectorAll('.tab-btn');
  const panels = {
    checklist: document.getElementById('checklist-panel'),
    materials: document.getElementById('materials-panel'),
    prep: document.getElementById('prep-panel'),
    dermals: document.getElementById('dermals-panel')
  };

  const toolLangSelect = document.getElementById('tool-lang-select');

  const sitesGridEl = document.getElementById('sites-grid');
  const activeItemsTableBody = document.getElementById('active-items-tbody');
  const activeItemsWrapper = document.getElementById('active-items-wrapper');
  const emptyChecklistNotice = document.getElementById('empty-checklist-notice');

  const cardPatientNameInput = document.getElementById('card-patient-name');
  const cardScanDateInput = document.getElementById('card-scan-date');
  const cardScanRegionInput = document.getElementById('card-scan-region');
  const cardScanLangSelect = document.getElementById('card-scan-lang');
  const printPreviewEl = document.getElementById('printable-card-preview');

  const btnPrintCard = document.getElementById('btn-print-card');
  const btnSaveCard = document.getElementById('btn-save-card');
  const btnClearCard = document.getElementById('btn-clear-card');
  const cardToast = document.getElementById('card-toast');

  const copyScriptBtn = document.getElementById('btn-copy-script');
  const copyToast = document.getElementById('copy-toast');

  const searchInput = document.getElementById('materials-search');
  const filterPills = document.querySelectorAll('.pill-btn');
  const materialsListEl = document.getElementById('materials-list');

  const themeToggleBtn = document.getElementById('btn-theme-toggle');

  // ─── Initialization ───────────────────────────────────────────────
  function init() {
    if (toolLangSelect && window.currentLang) {
      toolLangSelect.value = window.currentLang;
      document.documentElement.lang = window.currentLang;
    }
    const pageTitle = window.t('app.page_title');
    if (pageTitle) {
      document.title = pageTitle;
    }

    applyTranslations();
    bindLanguageSelector();
    bindNavigation();
    renderSitesChecklist();
    bindMaterialsSearch();
    filterAndRenderMaterials();
    bindCardInputs();
    bindPhoneScript();
    bindThemeToggle();
    loadSavedDataIfAny();
    updateCardPreview();
  }

  // ─── Language Selector Handling ───────────────────────────────────
  function bindLanguageSelector() {
    if (!toolLangSelect) return;
    toolLangSelect.value = window.currentLang || 'en';

    toolLangSelect.addEventListener('change', (e) => {
      const newLang = e.target.value;
      if (typeof window.setLanguage === 'function') {
        window.setLanguage(newLang);
      } else {
        window.currentLang = newLang;
        try {
          localStorage.setItem('poli_tools_language', newLang);
        } catch (err) {}
        document.documentElement.lang = newLang;
      }

      const pageTitle = window.t('app.page_title');
      if (pageTitle) {
        document.title = pageTitle;
      }

      applyTranslations();
      renderSitesChecklist();
      filterAndRenderMaterials();
      updateCardPreview();
    });
  }

  // ─── Translation Sweep ────────────────────────────────────────────
  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = window.t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.setAttribute('placeholder', window.t(key));
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria-label');
      el.setAttribute('aria-label', window.t(key));
    });
  }

  // ─── Navigation Tabs ──────────────────────────────────────────────
  function bindNavigation() {
    navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');
        switchTab(target);
      });
    });
  }

  function switchTab(target) {
    state.activeTab = target;
    navTabs.forEach(t => {
      const isActive = t.getAttribute('data-tab') === target;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    Object.keys(panels).forEach(key => {
      if (panels[key]) {
        if (key === target) {
          panels[key].removeAttribute('hidden');
        } else {
          panels[key].setAttribute('hidden', '');
        }
      }
    });
  }

  // ─── Theme Toggle ─────────────────────────────────────────────────
  function bindThemeToggle() {
    if (!themeToggleBtn) return;
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
    });
  }

  // ─── Body Checklist Rendering & Actions ───────────────────────────
  function renderSitesChecklist() {
    if (!sitesGridEl) return;
    sitesGridEl.innerHTML = '';

    SITES_CONFIG.forEach(cfg => {
      const isChecked = state.checklist.some(item => item.id === cfg.id);
      const label = document.createElement('label');
      label.className = 'site-checkbox-label' + (isChecked ? ' checked' : '');

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = isChecked;
      cb.value = cfg.id;

      cb.addEventListener('change', () => {
        toggleSite(cfg, cb.checked);
        label.classList.toggle('checked', cb.checked);
      });

      const span = document.createElement('span');
      span.textContent = window.t(cfg.key);

      label.appendChild(cb);
      label.appendChild(span);
      sitesGridEl.appendChild(label);
    });

    renderActiveItemsTable();
  }

  function toggleSite(cfg, isChecked) {
    if (isChecked) {
      if (!state.checklist.some(i => i.id === cfg.id)) {
        state.checklist.push({
          id: cfg.id,
          siteKey: cfg.key,
          qty: '',
          materialId: cfg.defaultMaterial || 'titanium_f136',
          removable: cfg.defaultRemovable || 'yes',
          retainer: cfg.defaultRetainer || 'none',
          notes: ''
        });
      }
    } else {
      state.checklist = state.checklist.filter(i => i.id !== cfg.id);
    }
    renderActiveItemsTable();
    updateCardPreview();
  }

  function renderActiveItemsTable() {
    if (!activeItemsTableBody || !activeItemsWrapper) return;

    if (state.checklist.length === 0) {
      activeItemsWrapper.setAttribute('hidden', '');
      if (emptyChecklistNotice) emptyChecklistNotice.removeAttribute('hidden');
      activeItemsTableBody.innerHTML = '';
      return;
    }

    activeItemsWrapper.removeAttribute('hidden');
    if (emptyChecklistNotice) emptyChecklistNotice.setAttribute('hidden', '');
    activeItemsTableBody.innerHTML = '';

    state.checklist.forEach((item) => {
      const tr = document.createElement('tr');

      // Col 1: Location Name
      const tdLoc = document.createElement('td');
      tdLoc.className = 'td-location';
      tdLoc.setAttribute('data-label', window.t('checklist.col_location'));
      tdLoc.innerHTML = `<strong>${escapeHTML(window.t(item.siteKey))}</strong>`;
      tr.appendChild(tdLoc);

      // Col 2: Quantity (starts empty, refused if impossible)
      const tdQty = document.createElement('td');
      tdQty.className = 'td-qty';
      tdQty.setAttribute('data-label', window.t('checklist.col_count'));
      const qtyInput = document.createElement('input');
      qtyInput.type = 'number';
      qtyInput.min = '1';
      qtyInput.max = '50';
      qtyInput.value = item.qty === '' ? '' : item.qty;
      qtyInput.placeholder = '—';
      qtyInput.className = 'input-qty';
      qtyInput.setAttribute('aria-label', `${window.t('checklist.col_count')} - ${window.t(item.siteKey)}`);
      qtyInput.addEventListener('change', (e) => {
        const raw = e.target.value.trim();
        if (raw === '') {
          item.qty = '';
          updateCardPreview();
          return;
        }
        const val = parseInt(raw, 10);
        if (isNaN(val) || val < 1 || val > 50 || String(val) !== raw) {
          showToast(cardToast, window.t('val.qty_invalid'));
          e.target.value = item.qty === '' ? '' : item.qty;
          return;
        }
        item.qty = val;
        updateCardPreview();
      });
      tdQty.appendChild(qtyInput);
      tr.appendChild(tdQty);

      // Col 3: Material
      const tdMat = document.createElement('td');
      tdMat.className = 'td-material';
      tdMat.setAttribute('data-label', window.t('checklist.col_material'));
      const matSelect = document.createElement('select');
      matSelect.setAttribute('aria-label', `${window.t('checklist.col_material')} - ${window.t(item.siteKey)}`);
      matSelect.innerHTML = `
        <option value="bioflex">${escapeHTML(window.t('opt.bioflex'))}</option>
        <option value="titanium_f136">${escapeHTML(window.t('opt.titanium'))}</option>
        <option value="implant_steel_f138">${escapeHTML(window.t('opt.steel_implant'))}</option>
        <option value="unspecified_steel">${escapeHTML(window.t('opt.steel_generic'))}</option>
        <option value="niobium">${escapeHTML(window.t('opt.niobium'))}</option>
        <option value="gold_solid">${escapeHTML(window.t('opt.gold'))}</option>
        <option value="silver_sterling">${escapeHTML(window.t('opt.silver'))}</option>
        <option value="borosilicate_glass">${escapeHTML(window.t('opt.glass'))}</option>
        <option value="silicone_medical">${escapeHTML(window.t('opt.silicone'))}</option>
        <option value="ptfe_polymer">${escapeHTML(window.t('opt.ptfe'))}</option>
        <option value="magnets">${escapeHTML(window.t('opt.magnet'))}</option>
        <option value="unknown">${escapeHTML(window.t('opt.unknown'))}</option>
      `;
      matSelect.value = item.materialId;
      matSelect.addEventListener('change', (e) => {
        item.materialId = e.target.value;
        updateCardPreview();
      });
      tdMat.appendChild(matSelect);
      tr.appendChild(tdMat);

      // Col 4: Removable
      const tdRem = document.createElement('td');
      tdRem.className = 'td-removable';
      tdRem.setAttribute('data-label', window.t('checklist.col_removable'));
      const remSelect = document.createElement('select');
      remSelect.setAttribute('aria-label', `${window.t('checklist.col_removable')} - ${window.t(item.siteKey)}`);
      remSelect.innerHTML = `
        <option value="yes">${escapeHTML(window.t('opt.removable_yes'))}</option>
        <option value="no">${escapeHTML(window.t('opt.removable_no'))}</option>
        <option value="piercer">${escapeHTML(window.t('opt.removable_piercer'))}</option>
        <option value="dermal">${escapeHTML(window.t('opt.removable_dermal'))}</option>
      `;
      remSelect.value = item.removable;
      remSelect.addEventListener('change', (e) => {
        item.removable = e.target.value;
        updateCardPreview();
      });
      tdRem.appendChild(remSelect);
      tr.appendChild(tdRem);

      // Col 5: Retainer
      const tdRet = document.createElement('td');
      tdRet.className = 'td-retainer';
      tdRet.setAttribute('data-label', window.t('checklist.col_retainer'));
      const retSelect = document.createElement('select');
      retSelect.setAttribute('aria-label', `${window.t('checklist.col_retainer')} - ${window.t(item.siteKey)}`);
      retSelect.innerHTML = `
        <option value="none">${escapeHTML(window.t('opt.retainer_none'))}</option>
        <option value="fitted">${escapeHTML(window.t('opt.retainer_fitted'))}</option>
        <option value="planned">${escapeHTML(window.t('opt.retainer_planned'))}</option>
      `;
      retSelect.value = item.retainer;
      retSelect.addEventListener('change', (e) => {
        item.retainer = e.target.value;
        updateCardPreview();
      });
      tdRet.appendChild(retSelect);
      tr.appendChild(tdRet);

      // Col 6: Notes
      const tdNotes = document.createElement('td');
      tdNotes.className = 'td-notes';
      tdNotes.setAttribute('data-label', window.t('checklist.col_notes'));
      const notesInput = document.createElement('input');
      notesInput.type = 'text';
      notesInput.placeholder = window.t('checklist.notes_placeholder');
      notesInput.value = item.notes;
      notesInput.setAttribute('aria-label', `${window.t('checklist.col_notes')} - ${window.t(item.siteKey)}`);
      notesInput.addEventListener('input', (e) => {
        item.notes = e.target.value;
        updateCardPreview();
      });
      tdNotes.appendChild(notesInput);
      tr.appendChild(tdNotes);

      // Col 7: Actions (Remove item)
      const tdAct = document.createElement('td');
      tdAct.className = 'td-actions';
      const btnDel = document.createElement('button');
      btnDel.type = 'button';
      btnDel.className = 'btn-delete-item';
      btnDel.setAttribute('aria-label', `${window.t('checklist.remove_aria')} - ${window.t(item.siteKey)}`);
      btnDel.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
      btnDel.addEventListener('click', () => {
        state.checklist = state.checklist.filter(i => i.id !== item.id);
        renderSitesChecklist();
        updateCardPreview();
      });
      tdAct.appendChild(btnDel);
      tr.appendChild(tdAct);

      activeItemsTableBody.appendChild(tr);
    });
  }

  // ─── Card Inputs & Actions ────────────────────────────────────────
  function bindCardInputs() {
    if (cardPatientNameInput) {
      cardPatientNameInput.addEventListener('input', (e) => {
        state.patientName = e.target.value;
        updateCardPreview();
      });
    }

    if (cardScanDateInput) {
      cardScanDateInput.addEventListener('change', (e) => {
        const val = e.target.value.trim();
        if (!val) {
          state.scanDate = '';
          updateCardPreview();
          return;
        }
        const parts = val.split('-');
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month - 1, day);
        if (
          parts.length !== 3 ||
          isNaN(year) || isNaN(month) || isNaN(day) ||
          year < 2000 || year > 2100 ||
          month < 1 || month > 12 ||
          day < 1 || day > 31 ||
          d.getFullYear() !== year ||
          d.getMonth() !== month - 1 ||
          d.getDate() !== day
        ) {
          showToast(cardToast, window.t('val.date_invalid'));
          cardScanDateInput.value = state.scanDate || '';
          return;
        }
        state.scanDate = val;
        updateCardPreview();
      });
    }

    if (cardScanRegionInput) {
      cardScanRegionInput.addEventListener('input', (e) => {
        state.scanRegion = e.target.value;
        updateCardPreview();
      });
    }

    if (cardScanLangSelect) {
      cardScanLangSelect.addEventListener('change', (e) => {
        state.cardScanLang = e.target.value;
        updateCardPreview();
      });
    }

    if (btnPrintCard) {
      btnPrintCard.addEventListener('click', () => {
        window.print();
      });
    }

    if (btnSaveCard) {
      btnSaveCard.addEventListener('click', saveCardLocally);
    }

    if (btnClearCard) {
      btnClearCard.addEventListener('click', clearCardData);
    }
  }

  function saveCardLocally() {
    const payload = {
      patientName: state.patientName,
      scanDate: state.scanDate,
      scanRegion: state.scanRegion,
      cardScanLang: state.cardScanLang,
      checklist: state.checklist
    };
    try {
      localStorage.setItem('poli_mri_disclosure_card', JSON.stringify(payload));
      showToast(cardToast, window.t('card.saved_toast'));
    } catch (err) {
      console.warn('LocalStorage unavailable');
    }
  }

  function clearCardData() {
    state.patientName = '';
    state.scanDate = '';
    state.scanRegion = '';
    state.checklist = [];

    if (cardPatientNameInput) cardPatientNameInput.value = '';
    if (cardScanDateInput) cardScanDateInput.value = '';
    if (cardScanRegionInput) cardScanRegionInput.value = '';

    try {
      localStorage.removeItem('poli_mri_disclosure_card');
    } catch (err) {}

    renderSitesChecklist();
    updateCardPreview();
    showToast(cardToast, window.t('card.cleared_toast'));
  }

  function loadSavedDataIfAny() {
    try {
      const saved = localStorage.getItem('poli_mri_disclosure_card');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.patientName) {
          state.patientName = parsed.patientName;
          if (cardPatientNameInput) cardPatientNameInput.value = parsed.patientName;
        }
        if (parsed.scanDate) {
          state.scanDate = parsed.scanDate;
          if (cardScanDateInput) cardScanDateInput.value = parsed.scanDate;
        }
        if (parsed.scanRegion) {
          state.scanRegion = parsed.scanRegion;
          if (cardScanRegionInput) cardScanRegionInput.value = parsed.scanRegion;
        }
        if (parsed.cardScanLang) {
          state.cardScanLang = parsed.cardScanLang;
          if (cardScanLangSelect) cardScanLangSelect.value = parsed.cardScanLang;
        }
        if (Array.isArray(parsed.checklist)) {
          state.checklist = parsed.checklist;
          renderSitesChecklist();
        }
      }
    } catch (err) {
      console.warn('Failed to parse saved card data');
    }
  }

  // ─── Multi-Language Printable Card Rendering ───────────────────────
  function updateCardPreview() {
    if (!printPreviewEl) return;

    const lang = state.cardScanLang || 'en';
    const tc = (key, params) => window.tCard(key, lang, params);

    const formattedDate = state.scanDate ? escapeHTML(state.scanDate) : '—';
    const nameDisplay = state.patientName ? escapeHTML(state.patientName) : '—';
    const regionDisplay = state.scanRegion ? escapeHTML(state.scanRegion) : '—';

    let rowsHtml = '';
    if (state.checklist.length === 0) {
      rowsHtml = `
        <tr>
          <td colspan="6" class="table-empty-message">
            <em>${escapeHTML(window.t('val.empty_checklist'))}</em>
          </td>
        </tr>`;
    } else {
      state.checklist.forEach(item => {
        let matName = 'Unknown';
        if (typeof MRI_MATERIALS !== 'undefined') {
          const m = MRI_MATERIALS.find(x => x.id === item.materialId);
          if (m) matName = m.nameKey ? window.t(m.nameKey) : m.name;
        }

        const remText = tc('removable_' + item.removable);
        const retText = tc('retainer_' + item.retainer);
        const qtyDisplay = (item.qty !== undefined && item.qty !== null && item.qty !== '') ? escapeHTML(String(item.qty)) : '—';

        rowsHtml += `
          <tr>
            <td><strong>${escapeHTML(window.t(item.siteKey))}</strong></td>
            <td class="text-center">${qtyDisplay}</td>
            <td>${escapeHTML(matName)}</td>
            <td>${escapeHTML(remText)}</td>
            <td>${escapeHTML(retText)}</td>
            <td>${escapeHTML(item.notes || '—')}</td>
          </tr>`;
      });
    }

    printPreviewEl.innerHTML = `
      <div class="card-print-header">
        <h3>${escapeHTML(tc('title'))}</h3>
        <p>${escapeHTML(tc('subtitle'))}</p>
      </div>

      <div class="card-meta-grid">
        <div class="meta-item">
          <span class="meta-item__label">${escapeHTML(tc('patient_name'))}</span>
          <span class="meta-item__value">${nameDisplay}</span>
        </div>
        <div class="meta-item">
          <span class="meta-item__label">${escapeHTML(tc('scan_date'))}</span>
          <span class="meta-item__value">${formattedDate}</span>
        </div>
        <div class="meta-item">
          <span class="meta-item__label">${escapeHTML(tc('scan_region'))}</span>
          <span class="meta-item__value">${regionDisplay}</span>
        </div>
      </div>

      <table class="card-print-table">
        <thead>
          <tr>
            <th>${escapeHTML(tc('col_site'))}</th>
            <th class="th-qty">${escapeHTML(tc('col_qty'))}</th>
            <th>${escapeHTML(tc('col_material'))}</th>
            <th>${escapeHTML(tc('col_removable'))}</th>
            <th>${escapeHTML(tc('col_retainer'))}</th>
            <th>${escapeHTML(tc('col_notes'))}</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div class="card-radiographer-notice">
        <strong>${escapeHTML(tc('notice_title'))}</strong>
        <p>${escapeHTML(tc('notice_text'))}</p>
      </div>

      <div class="card-footer-meta">
        ${escapeHTML(tc('print_meta'))}
      </div>
    `;
  }

  // ─── Phone Script Copy ────────────────────────────────────────────
  function bindPhoneScript() {
    if (!copyScriptBtn) return;
    copyScriptBtn.addEventListener('click', () => {
      const lines = [
        window.t('script.line1'),
        window.t('script.line2'),
        window.t('script.line3'),
        window.t('script.line4'),
        window.t('script.line5')
      ].join('\n\n');

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(lines).then(() => {
          showToast(copyToast, window.t('script.copied'));
        }).catch(() => fallbackCopy(lines));
      } else {
        fallbackCopy(lines);
      }
    });
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.className = 'visually-hidden-clipboard';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast(copyToast, window.t('script.copied'));
    } catch (err) {
      console.warn('Clipboard copy failed');
    }
    document.body.removeChild(ta);
  }

  // ─── Material Reference List ──────────────────────────────────────
  function bindMaterialsSearch() {
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase().trim();
        filterAndRenderMaterials();
      });
    }

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        state.materialFilter = pill.getAttribute('data-filter');
        filterPills.forEach(p => p.classList.toggle('active', p === pill));
        filterAndRenderMaterials();
      });
    });
  }

  function filterAndRenderMaterials() {
    if (!materialsListEl || typeof MRI_MATERIALS === 'undefined') return;

    const filtered = MRI_MATERIALS.filter(m => {
      if (state.materialFilter === 'nonmetal' && m.is_metallic) return false;
      if (state.materialFilter === 'metal' && !m.is_metallic) return false;

      if (state.searchQuery) {
        const q = state.searchQuery;
        const nameVal = (m.nameKey ? window.t(m.nameKey) : m.name) || '';
        const fullNameVal = (m.fullNameKey ? window.t(m.fullNameKey) : m.full_name) || '';
        const notesVal = (m.compositionNotesKey ? window.t(m.compositionNotesKey) : m.composition_notes) || '';
        const aliasesList = m.aliasKeys ? m.aliasKeys.map(k => window.t(k)) : (m.aliases || []);
        const usesList = m.typicalUseKeys ? m.typicalUseKeys.map(k => window.t(k)) : (m.typical_uses || []);

        const matchesName = nameVal.toLowerCase().includes(q) || fullNameVal.toLowerCase().includes(q);
        const matchesAliases = aliasesList.some(a => a.toLowerCase().includes(q));
        const matchesNotes = notesVal.toLowerCase().includes(q);
        const matchesUses = usesList.some(u => u.toLowerCase().includes(q));
        if (!matchesName && !matchesAliases && !matchesNotes && !matchesUses) return false;
      }

      return true;
    });

    materialsListEl.innerHTML = '';

    if (filtered.length === 0) {
      materialsListEl.innerHTML = `
        <div class="info-card empty-search-card">
          <p>${escapeHTML(window.t('materials.no_results'))}</p>
        </div>`;
      return;
    }

    filtered.forEach(mat => {
      const card = document.createElement('div');
      card.className = 'material-card';

      let tagClass = 'material-tag';
      if (!mat.is_metallic) tagClass += ' polymer';
      if (mat.magnetic_type === 'strongly_ferromagnetic') tagClass += ' ferromagnetic';

      const matName = mat.nameKey ? window.t(mat.nameKey) : mat.name;
      const matFullName = mat.fullNameKey ? window.t(mat.fullNameKey) : mat.full_name;
      const matMagLabel = mat.magneticLabelKey ? window.t(mat.magneticLabelKey) : mat.magnetic_label;
      const matCompNotes = mat.compositionNotesKey ? window.t(mat.compositionNotesKey) : mat.composition_notes;
      const matRfHeating = mat.rfHeatingKey ? window.t(mat.rfHeatingKey) : mat.rf_heating;
      const matImgArtifact = mat.imageArtifactKey ? window.t(mat.imageArtifactKey) : mat.image_artifact;
      const matBriefing = mat.briefingAdviceKey ? window.t(mat.briefingAdviceKey) : mat.briefing_advice;

      card.innerHTML = `
        <div class="material-card__header">
          <div>
            <div class="material-card__title">${escapeHTML(matName)}</div>
            <span class="material-card__full-name">${escapeHTML(matFullName)}</span>
          </div>
          <span class="${tagClass}">${escapeHTML(matMagLabel)}</span>
        </div>

        <div class="material-details-grid">
          <div class="detail-item">
            <span class="detail-item__label">${escapeHTML(window.t('mat.composition'))}</span>
            <span class="detail-item__text">${escapeHTML(matCompNotes)}</span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">${escapeHTML(window.t('mat.rf_heating'))}</span>
            <span class="detail-item__text">${escapeHTML(matRfHeating)}</span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">${escapeHTML(window.t('mat.artifact'))}</span>
            <span class="detail-item__text">${escapeHTML(matImgArtifact)}</span>
          </div>
        </div>

        <div class="material-briefing-box">
          <strong>${escapeHTML(window.t('mat.briefing'))}</strong>
          <p>${escapeHTML(matBriefing)}</p>
        </div>
      `;

      materialsListEl.appendChild(card);
    });
  }

  // ─── Helpers ──────────────────────────────────────────────────────
  function showToast(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.removeAttribute('hidden');
    setTimeout(() => {
      el.setAttribute('hidden', '');
    }, 3500);
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
