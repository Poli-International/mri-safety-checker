/**
 * MRI Preparation Guide: Body Jewelry Materials Reference Dataset
 * Poli International | V2
 *
 * Stated as material composition and physical behavior ONLY.
 * NEVER assigns MR Safe, MR Conditional, or MR Unsafe labels.
 * ASTM F2503 markings belong exclusively to specific tested manufactured devices.
 * All prose is keyed and routed through the translation dictionary (window.t).
 */

'use strict';

const MRI_MATERIALS = [
  {
    "id": "bioflex",
    "nameKey": "mat.bioflex.name",
    "fullNameKey": "mat.bioflex.full_name",
    "category": "polymer",
    "is_metallic": false,
    "magnetic_type": "non_magnetic",
    "magneticLabelKey": "mat.bioflex.magnetic_label",
    "rfHeatingKey": "mat.bioflex.rf_heating",
    "imageArtifactKey": "mat.bioflex.image_artifact",
    "compositionNotesKey": "mat.bioflex.composition_notes",
    "briefingAdviceKey": "mat.bioflex.briefing_advice",
    "aliasKeys": [
      "mat.bioflex.alias.0",
      "mat.bioflex.alias.1",
      "mat.bioflex.alias.2",
      "mat.bioflex.alias.3"
    ],
    "typicalUseKeys": [
      "mat.bioflex.use.0",
      "mat.bioflex.use.1",
      "mat.bioflex.use.2",
      "mat.bioflex.use.3",
      "mat.bioflex.use.4"
    ]
  },
  {
    "id": "titanium_f136",
    "nameKey": "mat.titanium_f136.name",
    "fullNameKey": "mat.titanium_f136.full_name",
    "category": "metal",
    "is_metallic": true,
    "magnetic_type": "paramagnetic",
    "magneticLabelKey": "mat.titanium_f136.magnetic_label",
    "rfHeatingKey": "mat.titanium_f136.rf_heating",
    "imageArtifactKey": "mat.titanium_f136.image_artifact",
    "compositionNotesKey": "mat.titanium_f136.composition_notes",
    "briefingAdviceKey": "mat.titanium_f136.briefing_advice",
    "aliasKeys": [
      "mat.titanium_f136.alias.0",
      "mat.titanium_f136.alias.1",
      "mat.titanium_f136.alias.2",
      "mat.titanium_f136.alias.3",
      "mat.titanium_f136.alias.4"
    ],
    "typicalUseKeys": [
      "mat.titanium_f136.use.0",
      "mat.titanium_f136.use.1",
      "mat.titanium_f136.use.2",
      "mat.titanium_f136.use.3"
    ]
  },
  {
    "id": "titanium_f67",
    "nameKey": "mat.titanium_f67.name",
    "fullNameKey": "mat.titanium_f67.full_name",
    "category": "metal",
    "is_metallic": true,
    "magnetic_type": "paramagnetic",
    "magneticLabelKey": "mat.titanium_f67.magnetic_label",
    "rfHeatingKey": "mat.titanium_f67.rf_heating",
    "imageArtifactKey": "mat.titanium_f67.image_artifact",
    "compositionNotesKey": "mat.titanium_f67.composition_notes",
    "briefingAdviceKey": "mat.titanium_f67.briefing_advice",
    "aliasKeys": [
      "mat.titanium_f67.alias.0",
      "mat.titanium_f67.alias.1",
      "mat.titanium_f67.alias.2",
      "mat.titanium_f67.alias.3"
    ],
    "typicalUseKeys": [
      "mat.titanium_f67.use.0",
      "mat.titanium_f67.use.1"
    ]
  },
  {
    "id": "implant_steel_f138",
    "nameKey": "mat.implant_steel_f138.name",
    "fullNameKey": "mat.implant_steel_f138.full_name",
    "category": "metal",
    "is_metallic": true,
    "magnetic_type": "weakly_paramagnetic",
    "magneticLabelKey": "mat.implant_steel_f138.magnetic_label",
    "rfHeatingKey": "mat.implant_steel_f138.rf_heating",
    "imageArtifactKey": "mat.implant_steel_f138.image_artifact",
    "compositionNotesKey": "mat.implant_steel_f138.composition_notes",
    "briefingAdviceKey": "mat.implant_steel_f138.briefing_advice",
    "aliasKeys": [
      "mat.implant_steel_f138.alias.0",
      "mat.implant_steel_f138.alias.1",
      "mat.implant_steel_f138.alias.2",
      "mat.implant_steel_f138.alias.3"
    ],
    "typicalUseKeys": [
      "mat.implant_steel_f138.use.0",
      "mat.implant_steel_f138.use.1",
      "mat.implant_steel_f138.use.2"
    ]
  },
  {
    "id": "unspecified_steel",
    "nameKey": "mat.unspecified_steel.name",
    "fullNameKey": "mat.unspecified_steel.full_name",
    "category": "metal",
    "is_metallic": true,
    "magnetic_type": "ferromagnetic_risk",
    "magneticLabelKey": "mat.unspecified_steel.magnetic_label",
    "rfHeatingKey": "mat.unspecified_steel.rf_heating",
    "imageArtifactKey": "mat.unspecified_steel.image_artifact",
    "compositionNotesKey": "mat.unspecified_steel.composition_notes",
    "briefingAdviceKey": "mat.unspecified_steel.briefing_advice",
    "aliasKeys": [
      "mat.unspecified_steel.alias.0",
      "mat.unspecified_steel.alias.1",
      "mat.unspecified_steel.alias.2",
      "mat.unspecified_steel.alias.3"
    ],
    "typicalUseKeys": [
      "mat.unspecified_steel.use.0",
      "mat.unspecified_steel.use.1",
      "mat.unspecified_steel.use.2"
    ]
  },
  {
    "id": "niobium",
    "nameKey": "mat.niobium.name",
    "fullNameKey": "mat.niobium.full_name",
    "category": "metal",
    "is_metallic": true,
    "magnetic_type": "paramagnetic",
    "magneticLabelKey": "mat.niobium.magnetic_label",
    "rfHeatingKey": "mat.niobium.rf_heating",
    "imageArtifactKey": "mat.niobium.image_artifact",
    "compositionNotesKey": "mat.niobium.composition_notes",
    "briefingAdviceKey": "mat.niobium.briefing_advice",
    "aliasKeys": [
      "mat.niobium.alias.0",
      "mat.niobium.alias.1",
      "mat.niobium.alias.2"
    ],
    "typicalUseKeys": [
      "mat.niobium.use.0",
      "mat.niobium.use.1",
      "mat.niobium.use.2"
    ]
  },
  {
    "id": "gold_solid",
    "nameKey": "mat.gold_solid.name",
    "fullNameKey": "mat.gold_solid.full_name",
    "category": "metal",
    "is_metallic": true,
    "magnetic_type": "diamagnetic_alloy",
    "magneticLabelKey": "mat.gold_solid.magnetic_label",
    "rfHeatingKey": "mat.gold_solid.rf_heating",
    "imageArtifactKey": "mat.gold_solid.image_artifact",
    "compositionNotesKey": "mat.gold_solid.composition_notes",
    "briefingAdviceKey": "mat.gold_solid.briefing_advice",
    "aliasKeys": [
      "mat.gold_solid.alias.0",
      "mat.gold_solid.alias.1",
      "mat.gold_solid.alias.2",
      "mat.gold_solid.alias.3",
      "mat.gold_solid.alias.4"
    ],
    "typicalUseKeys": [
      "mat.gold_solid.use.0",
      "mat.gold_solid.use.1",
      "mat.gold_solid.use.2"
    ]
  },
  {
    "id": "platinum",
    "nameKey": "mat.platinum.name",
    "fullNameKey": "mat.platinum.full_name",
    "category": "metal",
    "is_metallic": true,
    "magnetic_type": "paramagnetic",
    "magneticLabelKey": "mat.platinum.magnetic_label",
    "rfHeatingKey": "mat.platinum.rf_heating",
    "imageArtifactKey": "mat.platinum.image_artifact",
    "compositionNotesKey": "mat.platinum.composition_notes",
    "briefingAdviceKey": "mat.platinum.briefing_advice",
    "aliasKeys": [
      "mat.platinum.alias.0",
      "mat.platinum.alias.1",
      "mat.platinum.alias.2"
    ],
    "typicalUseKeys": [
      "mat.platinum.use.0",
      "mat.platinum.use.1"
    ]
  },
  {
    "id": "silver_sterling",
    "nameKey": "mat.silver_sterling.name",
    "fullNameKey": "mat.silver_sterling.full_name",
    "category": "metal",
    "is_metallic": true,
    "magnetic_type": "diamagnetic_conductive",
    "magneticLabelKey": "mat.silver_sterling.magnetic_label",
    "rfHeatingKey": "mat.silver_sterling.rf_heating",
    "imageArtifactKey": "mat.silver_sterling.image_artifact",
    "compositionNotesKey": "mat.silver_sterling.composition_notes",
    "briefingAdviceKey": "mat.silver_sterling.briefing_advice",
    "aliasKeys": [
      "mat.silver_sterling.alias.0",
      "mat.silver_sterling.alias.1",
      "mat.silver_sterling.alias.2"
    ],
    "typicalUseKeys": [
      "mat.silver_sterling.use.0",
      "mat.silver_sterling.use.1"
    ]
  },
  {
    "id": "nickel_silver",
    "nameKey": "mat.nickel_silver.name",
    "fullNameKey": "mat.nickel_silver.full_name",
    "category": "metal",
    "is_metallic": true,
    "magnetic_type": "ferromagnetic_risk",
    "magneticLabelKey": "mat.nickel_silver.magnetic_label",
    "rfHeatingKey": "mat.nickel_silver.rf_heating",
    "imageArtifactKey": "mat.nickel_silver.image_artifact",
    "compositionNotesKey": "mat.nickel_silver.composition_notes",
    "briefingAdviceKey": "mat.nickel_silver.briefing_advice",
    "aliasKeys": [
      "mat.nickel_silver.alias.0",
      "mat.nickel_silver.alias.1",
      "mat.nickel_silver.alias.2"
    ],
    "typicalUseKeys": [
      "mat.nickel_silver.use.0",
      "mat.nickel_silver.use.1"
    ]
  },
  {
    "id": "magnets",
    "nameKey": "mat.magnets.name",
    "fullNameKey": "mat.magnets.full_name",
    "category": "ferromagnetic_device",
    "is_metallic": true,
    "magnetic_type": "strongly_ferromagnetic",
    "magneticLabelKey": "mat.magnets.magnetic_label",
    "rfHeatingKey": "mat.magnets.rf_heating",
    "imageArtifactKey": "mat.magnets.image_artifact",
    "compositionNotesKey": "mat.magnets.composition_notes",
    "briefingAdviceKey": "mat.magnets.briefing_advice",
    "aliasKeys": [
      "mat.magnets.alias.0",
      "mat.magnets.alias.1",
      "mat.magnets.alias.2"
    ],
    "typicalUseKeys": [
      "mat.magnets.use.0",
      "mat.magnets.use.1"
    ]
  },
  {
    "id": "borosilicate_glass",
    "nameKey": "mat.borosilicate_glass.name",
    "fullNameKey": "mat.borosilicate_glass.full_name",
    "category": "glass",
    "is_metallic": false,
    "magnetic_type": "non_magnetic",
    "magneticLabelKey": "mat.borosilicate_glass.magnetic_label",
    "rfHeatingKey": "mat.borosilicate_glass.rf_heating",
    "imageArtifactKey": "mat.borosilicate_glass.image_artifact",
    "compositionNotesKey": "mat.borosilicate_glass.composition_notes",
    "briefingAdviceKey": "mat.borosilicate_glass.briefing_advice",
    "aliasKeys": [
      "mat.borosilicate_glass.alias.0",
      "mat.borosilicate_glass.alias.1",
      "mat.borosilicate_glass.alias.2"
    ],
    "typicalUseKeys": [
      "mat.borosilicate_glass.use.0",
      "mat.borosilicate_glass.use.1",
      "mat.borosilicate_glass.use.2"
    ]
  },
  {
    "id": "ptfe_polymer",
    "nameKey": "mat.ptfe_polymer.name",
    "fullNameKey": "mat.ptfe_polymer.full_name",
    "category": "polymer",
    "is_metallic": false,
    "magnetic_type": "non_magnetic",
    "magneticLabelKey": "mat.ptfe_polymer.magnetic_label",
    "rfHeatingKey": "mat.ptfe_polymer.rf_heating",
    "imageArtifactKey": "mat.ptfe_polymer.image_artifact",
    "compositionNotesKey": "mat.ptfe_polymer.composition_notes",
    "briefingAdviceKey": "mat.ptfe_polymer.briefing_advice",
    "aliasKeys": [
      "mat.ptfe_polymer.alias.0",
      "mat.ptfe_polymer.alias.1",
      "mat.ptfe_polymer.alias.2"
    ],
    "typicalUseKeys": [
      "mat.ptfe_polymer.use.0",
      "mat.ptfe_polymer.use.1"
    ]
  },
  {
    "id": "silicone_medical",
    "nameKey": "mat.silicone_medical.name",
    "fullNameKey": "mat.silicone_medical.full_name",
    "category": "polymer",
    "is_metallic": false,
    "magnetic_type": "non_magnetic",
    "magneticLabelKey": "mat.silicone_medical.magnetic_label",
    "rfHeatingKey": "mat.silicone_medical.rf_heating",
    "imageArtifactKey": "mat.silicone_medical.image_artifact",
    "compositionNotesKey": "mat.silicone_medical.composition_notes",
    "briefingAdviceKey": "mat.silicone_medical.briefing_advice",
    "aliasKeys": [
      "mat.silicone_medical.alias.0",
      "mat.silicone_medical.alias.1",
      "mat.silicone_medical.alias.2"
    ],
    "typicalUseKeys": [
      "mat.silicone_medical.use.0"
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MRI_MATERIALS };
}
