/*
  MRI Safety Checker — Body Jewelry Materials Dataset
  Poli International | 2026

  Classification standard: ASTM F2503 (Standard Practice for Marking Medical Devices
  and Other Items for Safety in the Magnetic Resonance Environment)

  MR Conditions:
  - MR Safe      : No known hazards in any MR environment
  - MR Conditional: No known hazards under specified conditions (field strength, SAR, etc.)
  - MR Unsafe    : Known hazards; do not use in MR environment
*/

const MRI_STANDARD = 'ASTM F2503';

// ─── MR condition constants ───────────────────────────────────────
// 'safe'        = MR Safe — no ferromagnetic, no heating, no artifact
// 'conditional' = MR Conditional — safe under defined field/SAR limits
// 'unsafe'      = MR Unsafe — must be removed before MRI scan
// 'remove'      = Always remove before MRI regardless of certification
// 'check'       = Verify with radiographer — composition-dependent

const MRI_MATERIALS = [

  // ─────────────────────────────────────────────────────────────
  // MR SAFE
  // ─────────────────────────────────────────────────────────────

  {
    id: 'bioflex',
    name: 'BioFlex®',
    full_name: 'BioFlex® Medical-Grade PTCA-PP Polymer',
    category: 'polymer',
    mri_condition: 'safe',
    mri_label: 'MR Safe',
    astm_class: 'MR Safe',
    field_strength_limit: null,
    sar_limit: null,
    notes: 'BioFlex® is a proprietary medical-grade polymer (polypropylene random copolymer, PP-R) manufactured by Poli International. Non-ferromagnetic, non-conductive, generates no RF heating and no MRI artifact. ISO 10993-6 and FDA Class IV biocompatibility certified. The gold standard for retainer jewelry during MRI procedures.',
    clinical_note: 'Ideal MRI retainer. Patients can proceed to scan without removal. Confirm with attending radiographer for site protocol.',
    also_known_as: ['BioFlex retainer', 'PTCA polymer bar', 'PP-R body jewelry'],
    common_uses: ['piercing retainers', 'tongue bars', 'navel bars', 'labret posts', 'ear cartilage retainers'],
    manufacturer: 'Poli International',
    iso_reference: 'ISO 10993-6',
    poli_url: 'https://poliinternational.com/bioflex/',
  },
  {
    id: 'ptfe',
    name: 'PTFE',
    full_name: 'Polytetrafluoroethylene (PTFE) / Teflon',
    category: 'polymer',
    mri_condition: 'safe',
    mri_label: 'MR Safe',
    astm_class: 'MR Safe',
    field_strength_limit: null,
    sar_limit: null,
    notes: 'PTFE is non-ferromagnetic, non-conductive, and chemically inert. No known MRI interaction. However, PTFE is not ISO 10993 certified for implantable body jewelry in the same manner as BioFlex®. Some PTFE body jewelry uses industrial rather than medical-grade material.',
    clinical_note: 'MR Safe for scanning purposes. Quality varies by manufacturer.',
    also_known_as: ['Teflon bar', 'PTFE retainer', 'flexible retainer'],
    common_uses: ['piercing retainers', 'pregnancy retainers'],
    manufacturer: null,
    iso_reference: null,
    poli_url: null,
  },
  {
    id: 'nylon',
    name: 'Nylon / Acrylic',
    full_name: 'Nylon (Polyamide) or Acrylic Retainer',
    category: 'polymer',
    mri_condition: 'safe',
    mri_label: 'MR Safe',
    astm_class: 'MR Safe',
    field_strength_limit: null,
    sar_limit: null,
    notes: 'Non-metallic, non-ferromagnetic. MR safe from a physics standpoint. Not recommended for long-term wear due to porous surface and lack of biocompatibility certification.',
    clinical_note: 'MR Safe for scan purposes only.',
    also_known_as: ['acrylic retainer', 'plastic tongue bar'],
    common_uses: ['short-term retainers'],
    manufacturer: null,
    iso_reference: null,
    poli_url: null,
  },

  // ─────────────────────────────────────────────────────────────
  // MR CONDITIONAL — safe under specific conditions
  // ─────────────────────────────────────────────────────────────

  {
    id: 'titanium_astm',
    name: 'Implant-Grade Titanium (ASTM F136)',
    full_name: 'Titanium Alloy Ti-6Al-4V ELI (ASTM F136)',
    category: 'metal',
    mri_condition: 'conditional',
    mri_label: 'MR Conditional',
    astm_class: 'MR Conditional',
    field_strength_limit: '3T',
    sar_limit: '4 W/kg',
    notes: 'Grade 23 (Ti-6Al-4V ELI) titanium alloy. Weakly paramagnetic — very low susceptibility. Classified MR Conditional up to 3T by most device manufacturers. Minimal heating (ΔT < 1°C in standard protocols). Generates mild susceptibility artifact but far less than steel. Widely accepted by MRI facilities for body jewelry.',
    clinical_note: 'Most radiographers accept titanium jewelry. Confirm field strength and facility protocol. Some facilities require removal for head/neck scans.',
    also_known_as: ['implant grade titanium', 'ASTM F136 Ti', 'Grade 23 titanium', 'G23 titanium'],
    common_uses: ['body jewelry', 'piercing bars', 'rings', 'nostril studs'],
    manufacturer: null,
    iso_reference: 'ASTM F136, ISO 5832-3',
    poli_url: null,
  },
  {
    id: 'niobium',
    name: 'Niobium',
    full_name: 'Niobium (Nb)',
    category: 'metal',
    mri_condition: 'conditional',
    mri_label: 'MR Conditional',
    astm_class: 'MR Conditional',
    field_strength_limit: '3T',
    sar_limit: null,
    notes: 'Diamagnetic/paramagnetic metal. No ferromagnetic properties. Low MRI interaction, minimal heating. Less commonly used than titanium but similar safety profile.',
    clinical_note: 'Generally accepted at most MRI facilities.',
    also_known_as: ['Nb', 'niobium jewelry'],
    common_uses: ['earrings', 'rings', 'niche piercing jewelry'],
    manufacturer: null,
    iso_reference: null,
    poli_url: null,
  },
  {
    id: 'implant_steel',
    name: 'Implant-Grade Steel (ASTM F138)',
    full_name: '316LVM Stainless Steel (ASTM F138)',
    category: 'metal',
    mri_condition: 'conditional',
    mri_label: 'MR Conditional',
    astm_class: 'MR Conditional',
    field_strength_limit: '1.5T',
    sar_limit: '2 W/kg',
    notes: 'Austenitic 316LVM stainless steel. Low magnetic susceptibility (paramagnetic, not ferromagnetic). Classified MR Conditional, typically up to 1.5T. Generates susceptibility artifacts. Many MRI sites require removal due to potential heating and image distortion in sensitive scan areas.',
    clinical_note: '⚠ Many radiographers require removal, especially for head/neck/abdominal MRI. Check with facility.',
    also_known_as: ['316LVM steel', 'surgical steel', 'implant steel', 'ASTM F138 steel'],
    common_uses: ['body jewelry', 'captive rings', 'plugs', 'barbells'],
    manufacturer: null,
    iso_reference: 'ASTM F138, ISO 5832-1',
    poli_url: null,
  },
  {
    id: 'gold_14k',
    name: 'Gold (14k / 18k)',
    full_name: 'Gold Alloy — 14 or 18 Karat',
    category: 'metal',
    mri_condition: 'conditional',
    mri_label: 'MR Conditional',
    astm_class: 'MR Conditional',
    field_strength_limit: '3T',
    sar_limit: null,
    notes: 'Pure gold is diamagnetic. 14k and 18k alloys are predominantly MR conditional (the alloying metals — copper, silver, nickel — are weakly paramagnetic). No significant ferromagnetic force. Minimal heating. However, alloy composition varies by manufacturer.',
    clinical_note: 'Generally accepted. Confirm alloy composition contains no ferromagnetic metals.',
    also_known_as: ['14k gold', '18k gold', 'solid gold jewelry', '750 gold', '585 gold'],
    common_uses: ['earrings', 'nose rings', 'body jewelry', 'daith jewelry'],
    manufacturer: null,
    iso_reference: null,
    poli_url: null,
  },
  {
    id: 'platinum',
    name: 'Platinum',
    full_name: 'Platinum (Pt)',
    category: 'metal',
    mri_condition: 'conditional',
    mri_label: 'MR Conditional',
    astm_class: 'MR Conditional',
    field_strength_limit: '3T',
    sar_limit: null,
    notes: 'Paramagnetic metal. Very low susceptibility. Used in some high-end body jewelry. No significant MRI force or heating. Widely considered safe in clinical practice.',
    clinical_note: 'Generally accepted by MRI facilities.',
    also_known_as: ['Pt', 'platinum jewelry'],
    common_uses: ['premium body jewelry', 'ear jewelry'],
    manufacturer: null,
    iso_reference: null,
    poli_url: null,
  },

  // ─────────────────────────────────────────────────────────────
  // MR UNSAFE — must be removed
  // ─────────────────────────────────────────────────────────────

  {
    id: 'ferromagnetic_steel',
    name: 'Ferromagnetic / Non-Implant Steel',
    full_name: 'Non-Implant-Grade Steel (Ferromagnetic)',
    category: 'metal',
    mri_condition: 'unsafe',
    mri_label: 'MR Unsafe',
    astm_class: 'MR Unsafe',
    field_strength_limit: null,
    sar_limit: null,
    notes: 'Non-implant-grade steels (e.g. 316L without the VIM/VAR process, 304 stainless, "surgical steel" of unknown grade) may contain ferromagnetic phases. Can experience significant force in MRI magnetic field, causing displacement, heating, and severe artifact. MUST be removed before MRI.',
    clinical_note: '🚫 MUST be removed before entering MRI suite. Risk of displacement and burns.',
    also_known_as: ['316L steel', 'surgical steel (unknown grade)', 'cheap steel jewelry', 'stainless steel (unspecified)'],
    common_uses: ['budget body jewelry', 'fashion jewelry'],
    manufacturer: null,
    iso_reference: null,
    poli_url: null,
  },
  {
    id: 'magnetic_steel',
    name: 'Magnetic / Carbon Steel',
    full_name: 'Carbon Steel or Ferritic Stainless Steel',
    category: 'metal',
    mri_condition: 'unsafe',
    mri_label: 'MR Unsafe',
    astm_class: 'MR Unsafe',
    field_strength_limit: null,
    sar_limit: null,
    notes: 'Strongly ferromagnetic. Will be attracted to MRI magnet with significant force. Extreme risk of displacement. Never enter MRI suite.',
    clinical_note: '🚫 Immediate removal required. Ferromagnetic — life-threatening if in MRI bore.',
    also_known_as: ['carbon steel', 'ferritic steel', 'magnetic steel'],
    common_uses: ['fashion jewelry', 'cheap rings'],
    manufacturer: null,
    iso_reference: null,
    poli_url: null,
  },
  {
    id: 'silver',
    name: 'Silver (Sterling / Fine)',
    full_name: 'Sterling Silver (925) or Fine Silver',
    category: 'metal',
    mri_condition: 'unsafe',
    mri_label: 'Remove Before MRI',
    astm_class: 'Remove',
    field_strength_limit: null,
    sar_limit: null,
    notes: 'Silver is diamagnetic with very low susceptibility — technically no significant force. However, it can generate RF heating and significant susceptibility artifact in MRI images. Most MRI facilities and radiographers require removal as a precaution. Not certified for MRI use.',
    clinical_note: '⚠ Remove before MRI scan. Susceptibility artifact and potential heating.',
    also_known_as: ['sterling silver', '925 silver', '.925', 'fine silver', 'argentum'],
    common_uses: ['earrings', 'body jewelry', 'rings'],
    manufacturer: null,
    iso_reference: null,
    poli_url: null,
  },
  {
    id: 'nickel_silver',
    name: 'Nickel Silver / Alloy Unknown',
    full_name: 'Nickel Silver (German Silver) or Unknown Alloy',
    category: 'metal',
    mri_condition: 'unsafe',
    mri_label: 'MR Unsafe',
    astm_class: 'MR Unsafe',
    field_strength_limit: null,
    sar_limit: null,
    notes: 'Nickel silver contains no silver — it is a copper-nickel-zinc alloy. Not implant grade, potential nickel leach, and ferromagnetic properties depending on composition. Must be removed.',
    clinical_note: '🚫 Remove. Not implant grade; ferromagnetic risk.',
    also_known_as: ['German silver', 'alpaca', 'nickel alloy', 'white metal'],
    common_uses: ['cheap fashion jewelry'],
    manufacturer: null,
    iso_reference: null,
    poli_url: null,
  },
  {
    id: 'magnetic_clasp',
    name: 'Magnetic Jewelry / Magnets',
    full_name: 'Jewelry with Magnetic Clasps or Embedded Magnets',
    category: 'other',
    mri_condition: 'unsafe',
    mri_label: 'MR Unsafe',
    astm_class: 'MR Unsafe',
    field_strength_limit: null,
    sar_limit: null,
    notes: 'Strongly ferromagnetic. Extreme displacement risk. No exceptions.',
    clinical_note: '🚫 Absolute contraindication. Life-threatening.',
    also_known_as: ['magnetic earrings', 'magnetic nose ring', 'magnet jewelry'],
    common_uses: ['fashion jewelry', 'non-pierced accessories'],
    manufacturer: null,
    iso_reference: null,
    poli_url: null,
  },

  // ─────────────────────────────────────────────────────────────
  // CONDITIONAL / CHECK — situation dependent
  // ─────────────────────────────────────────────────────────────

  {
    id: 'surgical_steel_unknown',
    name: '"Surgical Steel" (unspecified grade)',
    full_name: 'Surgical Steel — Grade Unverified',
    category: 'metal',
    mri_condition: 'check',
    mri_label: 'Verify Grade',
    astm_class: 'Conditional — verify',
    field_strength_limit: null,
    sar_limit: null,
    notes: '"Surgical steel" is a marketing term, not a certified grade. Could refer to ASTM F138 (MR Conditional) or to 304/316L not meeting implant-grade VIM/VAR processing. Without a material certificate, safety cannot be confirmed. When in doubt, replace with BioFlex® or verified titanium retainer.',
    clinical_note: '⚠ Verify with manufacturer certificate. Replace with BioFlex® retainer if grade unknown.',
    also_known_as: ['surgical steel', '316L', 'stainless body jewelry'],
    common_uses: ['generic body jewelry'],
    manufacturer: null,
    iso_reference: null,
    poli_url: null,
  },
  {
    id: 'anodised_titanium',
    name: 'Anodised Titanium',
    full_name: 'Anodised Titanium Body Jewelry',
    category: 'metal',
    mri_condition: 'conditional',
    mri_label: 'MR Conditional',
    astm_class: 'MR Conditional',
    field_strength_limit: '3T',
    sar_limit: '4 W/kg',
    notes: 'Same base metal as implant-grade titanium with an anodised colored oxide surface. The anodising layer does not affect MRI safety — the base metal properties apply.',
    clinical_note: 'Same as implant-grade titanium — MR Conditional.',
    also_known_as: ['colored titanium', 'anodized titanium', 'rainbow titanium'],
    common_uses: ['captive rings', 'curved barbells', 'nose rings'],
    manufacturer: null,
    iso_reference: 'ASTM F136',
    poli_url: null,
  },
];

// ─── Search index ─────────────────────────────────────────────────
function normalizeMriName(s) {
  return String(s || '').toLowerCase().replace(/[®™\s\-_\/()]+/g, '');
}

const MRI_INDEX = (() => {
  const idx = [];
  MRI_MATERIALS.forEach(m => {
    idx.push({ key: normalizeMriName(m.name), entry: m });
    idx.push({ key: normalizeMriName(m.full_name), entry: m });
    (m.also_known_as || []).forEach(a => idx.push({ key: normalizeMriName(a), entry: m }));
  });
  return idx;
})();

function findMaterialByQuery(query) {
  if (!query) return null;
  const q = normalizeMriName(query);
  const exact = MRI_INDEX.find(e => e.key === q);
  if (exact) return exact.entry;
  const partial = MRI_INDEX.find(e => e.key.includes(q) && q.length >= 4);
  if (partial) return partial.entry;
  return null;
}
