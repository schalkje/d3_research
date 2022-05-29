
// keys are generated using the MD5 hashing algorithm on the the name
// https://www.onlinewebtoolkit.com/hash-generator
export const getNetwork = ({productKey}) => [
  {
    key: '986ab27ca7fac1521932c73c7666508b',
    title: 'Credit Model',
    version: '1.7',
    owner: ['John Bradley'],
    team: 'DM-Strada',
    SME_technical: ['Kit Harington'],
    SME_business: [{name:'Blake Lively', email:'b.lively@thefirm.com'}],
    type: 'Domain Model',
    language: ['NL'],
    description: '',
    created: '5-3-2021',
    last_update: '11-5-2022',
    documentation_link: 'https://thefirm.visualstudio.com/SCDM/_git/Project-DM-PreventiveMaintenance',
    repo: 'https://thefirm.visualstudio.com/SCDM/_git/Project-DM-PreventiveMaintenance'
  }
]

export const getNetworkEntities = ({productKey}) => [
  {key: "scdm_curated_credit.client_overdue", name: "Client Overdue", layer: "Curated", notebook_path: "/databricks/notebooks/40.Curated/nbCreateClientOverdue.py"
  },
  {key: "scdm_curated_credit.credit_signal", name: "Credit Signal", layer: "Curated", notebook_path: "/databricks/notebooks/40.Curated/nbCreateCreditSignal.py"
  },
  {key: "scdm_curated_credit.credit_signal_kredieten", name: "Credit Signal Kredieten", layer: "Curated", notebook_path: "/databricks/notebooks/40.Curated/nbCreateCreditSignalKredieten.py"
  },
  {key: "scdm_curated_credit.credit_signal_vermogenskredieten", name: "Credit Signal Vermogenskredieten", layer: "Curated", notebook_path: "/databricks/notebooks/40.Curated/nbCreateCreditSignalVermogenskredieten.py"
  },
  {key: "scdm_curated_credit.pledged_securities_account_overdraft", name: "Pledged Securities Account Overdraft", layer: "Curated", notebook_path: "/databricks/notebooks/40.Curated/nbCreatePledgedSecuritiesAccountOverdraft.py"
  },
  {key: "scdm_curated_credit.pledged_securities_krc", name: "Pledged Securities KRC", layer: "Curated", notebook_path: "/databricks/notebooks/40.Curated/nbCreatePledgedSecuritiesKRC.py"
  },
  {key: "scdm_curated_credit.pledged_securities_loans", name: "Pledged Securities Loans", layer: "Curated", notebook_path: "/databricks/notebooks/40.Curated/nbCreatePledgedSecuritiesLoans.py"
  },
  {key: "scdm_enriched_credit.account", name: "Account", layer: "Enriched", notebook_path: "/databricks/notebooks/30.Enriched/nbCreateAccount.py"
  },
  {key: "scdm_enriched_credit.branch", name: "Branch", layer: "Enriched", notebook_path: "/databricks/notebooks/30.Enriched/nbCreateBranch.py"
  },
  {key: "scdm_enriched_credit.client", name: "Client", layer: "Enriched", notebook_path: "/databricks/notebooks/30.Enriched/nbCreateClient.py"
  },
  {key: "scdm_enriched_credit.client_overdue", name: "Client Overdue", layer: "Enriched", notebook_path: "/databricks/notebooks/30.Enriched/nbCreateClientOverdue.py"
  },
  {key: "scdm_enriched_credit.client_portfolio", name: "Client Portfolio", layer: "Enriched", notebook_path: "/databricks/notebooks/30.Enriched/nbCreateClientPortfolio.py"
  },
  {key: "scdm_enriched_credit.insurances", name: "Insurances", layer: "Enriched", notebook_path: "/databricks/notebooks/30.Enriched/nbCreateInsurances.py"
  },
  {key: "scdm_enriched_credit.loan", name: "Loan", layer: "Enriched", notebook_path: "/databricks/notebooks/30.Enriched/nbCreateLoan.py"
  },
  {key: "scdm_enriched_credit.loan_interest_components", name: "Loan Interest Components", layer: "Enriched", notebook_path: "/databricks/notebooks/30.Enriched/nbCreateLoanInterestComponents.py"
  },
  {key: "scdm_enriched_credit.metadata", name: "Metadata", layer: "Enriched", notebook_path: "/databricks/notebooks/30.Enriched/nbCreateMetadata.py"
  },
  {key: "scdm_enriched_credit.other_collateral", name: "Other Collateral", layer: "Enriched", notebook_path: "/databricks/notebooks/30.Enriched/nbCreateOtherCollateral.py"
  },
  {key: "scdm_enriched_credit.pledged_securities", name: "Pledged Securities", layer: "Enriched", notebook_path: "/databricks/notebooks/30.Enriched/nbCreatePledgedSecurities.py"
  },
  {key: "scdm_enriched_credit.realEstate", name: "RealEstate", layer: "Enriched", notebook_path: "/databricks/notebooks/30.Enriched/nbCreateRealEstate.py"
  },
  {key: "scdm_enriched_credit.securities", name: "Securities", layer: "Enriched", notebook_path: "/databricks/notebooks/30.Enriched/nbCreateSecurities.py"
  },
  {key: "scdm_enriched_credit.securities_account", name: "Securities Account", layer: "Enriched", notebook_path: "/databricks/notebooks/30.Enriched/nbCreateSecuritiesAccount.py"
  },
  {key: "scdm_enriched_credit.thefirm_guaranty", name: "thefirm Guaranty", layer: "Enriched", notebook_path: "/databricks/notebooks/30.Enriched/nbCreatethefirmGuaranty.py"
  },
]

export const getNetworkRelations= ({ productKey }) => [
  { source: "thefirm_dwh_dwh.dwh_product", target: "scdm_enriched_credit.account" },
  { source: "thefirm_dwh_dwh.dwh_product_waarde", target: "scdm_enriched_credit.account" },
  { source: "thefirm_dwh_dwh.dwh_relatie", target: "scdm_enriched_credit.account" },
  { source: "thefirm_dwh_dwh.dwh_valuta_product", target: "scdm_enriched_credit.account" },
  { source: "scdm_enriched_reference.organization_hierarchy", target: "scdm_enriched_credit.branch" },
  { source: "thefirm_dwh_dwh.dwh_kantoor", target: "scdm_enriched_credit.branch" },
  { source: "thefirm_dwh_dwh.dwh_kantoor", target: "scdm_enriched_credit.client" },
  { source: "thefirm_dwh_dwh.dwh_persoon", target: "scdm_enriched_credit.client" },
  { source: "scdm_enriched_credit.client_overdue", target: "scdm_enriched_credit.client_overdue" },
  { source: "thefirm_dwh_dwh.dwh_persoon", target: "scdm_enriched_credit.client_overdue" },
  { source: "thefirm_dwh_dwh.dwh_persoon_relatie_rol", target: "scdm_enriched_credit.client_overdue" },
  { source: "thefirm_dwh_dwh.dwh_product", target: "scdm_enriched_credit.client_overdue" },
  { source: "thefirm_dwh_dwh.dwh_relatie", target: "scdm_enriched_credit.client_overdue" },
  { source: "thefirm_dwh_dwh.dwh_relatie_overstand", target: "scdm_enriched_credit.client_overdue" },
  { source: "thefirm_dwh_dwh.dwh_valuta_limiet", target: "scdm_enriched_credit.client_overdue" },
  { source: "thefirm_dwh_dwh.dwh_valuta_positie", target: "scdm_enriched_credit.client_overdue" },
  { source: "thefirm_dwh_dwh.dwh_valuta_product", target: "scdm_enriched_credit.client_overdue" },
  { source: "thefirm_dwh_stg_archive_bbt.bbt_tbldossier", target: "scdm_enriched_credit.client_overdue" },
  { source: "thefirm_dwh_stg_archive_stater.std_beheer_lening_seq", target: "scdm_enriched_credit.client_overdue" },
  { source: "scdm_curated_credit.client_overdue", target: "scdm_curated_credit.client_overdue" },
  { source: "scdm_enriched_credit.client_overdue", target: "scdm_curated_credit.client_overdue" },
  { source: "scdm_enriched_credit.client_portfolio", target: "scdm_curated_credit.client_overdue" },
  { source: "thefirm_dwh_dwh.dwh_klantbediening", target: "scdm_enriched_credit.client_portfolio" },
  { source: "thefirm_dwh_dwh.dwh_persoon", target: "scdm_enriched_credit.client_portfolio" },
  { source: "thefirm_dwh_dwh.dwh_persoon_klantbediening", target: "scdm_enriched_credit.client_portfolio" },
  { source: "thefirm_dwh_dwh.dwh_persoon_relatie_rol", target: "scdm_enriched_credit.client_portfolio" },
  { source: "thefirm_dwh_dwh.dwh_product", target: "scdm_enriched_credit.client_portfolio" },
  { source: "thefirm_dwh_dwh.dwh_relatie", target: "scdm_enriched_credit.client_portfolio" },
  { source: "thefirm_dwh_reference.ref_codestelsel", target: "scdm_enriched_credit.client_portfolio" },
  { source: "scdm_enriched_credit.client_portfolio", target: "scdm_curated_credit.credit_signal" },
  { source: "scdm_enriched_credit.loan", target: "scdm_curated_credit.credit_signal" },
  { source: "scdm_curated_credit.credit_signal_kredieten", target: "scdm_curated_credit.credit_signal_kredieten" },
  { source: "scdm_enriched_credit.client_portfolio", target: "scdm_curated_credit.credit_signal_kredieten" },
  { source: "scdm_enriched_credit.pledged_securities", target: "scdm_curated_credit.credit_signal_kredieten" },
  { source: "scdm_enriched_credit.securities_account", target: "scdm_curated_credit.credit_signal_kredieten" },
  { source: "scdm_curated_credit.credit_signal_vermogenskredieten", target: "scdm_curated_credit.credit_signal_vermogenskredieten" },
  { source: "scdm_enriched_credit.account", target: "scdm_curated_credit.credit_signal_vermogenskredieten" },
  { source: "scdm_enriched_credit.client_portfolio", target: "scdm_curated_credit.credit_signal_vermogenskredieten" },
  { source: "scdm_enriched_credit.pledged_securities", target: "scdm_curated_credit.credit_signal_vermogenskredieten" },
  { source: "scdm_enriched_credit.securities_account", target: "scdm_curated_credit.credit_signal_vermogenskredieten" },
  { source: "thefirm_dwh_dwh.dwh_onderpand_waardering", target: "scdm_enriched_credit.insurances" },
  { source: "thefirm_dwh_dwh.dwh_relatie", target: "scdm_enriched_credit.insurances" },
  { source: "thefirm_dwh_dwh.dwh_zekerheid", target: "scdm_enriched_credit.insurances" },
  { source: "thefirm_dwh_dwh.dwh_zekerheid_kenmerk", target: "scdm_enriched_credit.insurances" },
  { source: "thefirm_dwh_dwh.dwh_zekerheid_onderpand", target: "scdm_enriched_credit.insurances" },
  { source: "thefirm_dwh_stg_archive_stater.std_beheer_polis_seq", target: "scdm_enriched_credit.insurances" },
  { source: "thefirm_dwh_dwh.dwh_product", target: "scdm_enriched_credit.loan" },
  { source: "thefirm_dwh_dwh.dwh_relatie", target: "scdm_enriched_credit.loan" },
  { source: "thefirm_dwh_dwh.dwh_valuta_positie", target: "scdm_enriched_credit.loan" },
  { source: "thefirm_dwh_dwh.dwh_valuta_product", target: "scdm_enriched_credit.loan" },
  { source: "thefirm_dwh_dwh.dwh_valuta_rente", target: "scdm_enriched_credit.loan" },
  { source: "thefirm_dwh_reference.ref_codestelsel", target: "scdm_enriched_credit.loan" },
  { source: "thefirm_dwh_reference.trn_translatie_product", target: "scdm_enriched_credit.loan" },
  { source: "thefirm_dwh_stg_archive_bankview.bvw_krediet_aflossing", target: "scdm_enriched_credit.loan" },
  { source: "thefirm_dwh_stg_archive_bankview.bvw_krediet_rente", target: "scdm_enriched_credit.loan" },
  { source: "thefirm_dwh_stg_archive_stater.stm_ld_mutaties_csv", target: "scdm_enriched_credit.loan" },
  { source: "thefirm_dwh_dwh.dwh_product", target: "scdm_enriched_credit.loan_interest_components" },
  { source: "thefirm_dwh_dwh.dwh_valuta_product", target: "scdm_enriched_credit.loan_interest_components" },
  { source: "thefirm_dwh_dwh.dwh_valuta_rente_opbouw", target: "scdm_enriched_credit.loan_interest_components" },
  { source: "thefirm_dwh_reference.ref_codestelsel", target: "scdm_enriched_credit.loan_interest_components" },
  { source: "scdm_enriched_credit.client", target: "scdm_enriched_credit.metadata" },
  { source: "thefirm_dwh_dwh.dwh_relatie", target: "scdm_enriched_credit.metadata" },
  { source: "scdm_enriched_credit.other_collateral", target: "scdm_enriched_credit.other_collateral" },
  { source: "thefirm_dwh_dwh.dwh_relatie", target: "scdm_enriched_credit.other_collateral" },
  { source: "thefirm_dwh_dwh.dwh_zekerheid", target: "scdm_enriched_credit.other_collateral" },
  { source: "thefirm_dwh_dwh.dwh_zekerheid_onderpand", target: "scdm_enriched_credit.other_collateral" },
  { source: "thefirm_dwh_reference.ref_codestelsel", target: "scdm_enriched_credit.other_collateral" },
  { source: "bankview_securities.kmdbankview", target: "scdm_enriched_credit.pledged_securities" },
  { source: "scdm_enriched_credit.pledged_securities", target: "scdm_enriched_credit.pledged_securities" },
  { source: "thefirm_dwh_dwh.dwh_onderpand_waardering", target: "scdm_enriched_credit.pledged_securities" },
  { source: "thefirm_dwh_dwh.dwh_product", target: "scdm_enriched_credit.pledged_securities" },
  { source: "thefirm_dwh_dwh.dwh_product_waarde", target: "scdm_enriched_credit.pledged_securities" },
  { source: "thefirm_dwh_dwh.dwh_relatie", target: "scdm_enriched_credit.pledged_securities" },
  { source: "thefirm_dwh_dwh.dwh_zekerheid", target: "scdm_enriched_credit.pledged_securities" },
  { source: "thefirm_dwh_dwh.dwh_zekerheid_onderpand", target: "scdm_enriched_credit.pledged_securities" },
  { source: "thefirm_dwh_reference.ref_codestelsel", target: "scdm_enriched_credit.pledged_securities" },
  { source: "thefirm_dwh_stg_archive_krs.krs_zfthefirmzek", target: "scdm_enriched_credit.pledged_securities" },
  { source: "thefirm_dwh_stg_archive_vdz_belgie.vdb_zfthefirmzek", target: "scdm_enriched_credit.pledged_securities" },
  { source: "scdm_enriched_credit.account", target: "scdm_curated_credit.pledged_securities_account_overdraft" },
  { source: "scdm_enriched_credit.client_portfolio", target: "scdm_curated_credit.pledged_securities_account_overdraft" },
  { source: "scdm_enriched_credit.pledged_securities", target: "scdm_curated_credit.pledged_securities_account_overdraft" },
  { source: "scdm_enriched_credit.securities", target: "scdm_curated_credit.pledged_securities_account_overdraft" },
  { source: "scdm_enriched_credit.account", target: "scdm_curated_credit.pledged_securities_krc" },
  { source: "scdm_enriched_credit.client_portfolio", target: "scdm_curated_credit.pledged_securities_krc" },
  { source: "scdm_enriched_credit.pledged_securities", target: "scdm_curated_credit.pledged_securities_krc" },
  { source: "scdm_enriched_credit.securities_account", target: "scdm_curated_credit.pledged_securities_krc" },
  { source: "scdm_enriched_credit.client_portfolio", target: "scdm_curated_credit.pledged_securities_loans" },
  { source: "scdm_enriched_credit.pledged_securities", target: "scdm_curated_credit.pledged_securities_loans" },
  { source: "thefirm_dwh_dwh.dwh_onderpand_waardering", target: "scdm_enriched_credit.realEstate" },
  { source: "thefirm_dwh_dwh.dwh_relatie", target: "scdm_enriched_credit.realEstate" },
  { source: "thefirm_dwh_dwh.dwh_zekerheid", target: "scdm_enriched_credit.realEstate" },
  { source: "thefirm_dwh_dwh.dwh_zekerheid_onderpand", target: "scdm_enriched_credit.realEstate" },
  { source: "thefirm_dwh_dwh.dwh_instrument", target: "scdm_enriched_credit.securities" },
  { source: "thefirm_dwh_dwh.dwh_instrument_koers", target: "scdm_enriched_credit.securities" },
  { source: "thefirm_dwh_dwh.dwh_instrument_positie", target: "scdm_enriched_credit.securities" },
  { source: "thefirm_dwh_dwh.dwh_product", target: "scdm_enriched_credit.securities" },
  { source: "thefirm_dwh_dwh.dwh_relatie", target: "scdm_enriched_credit.securities" },
  { source: "thefirm_dwh_dwh.dwh_valuta_koers", target: "scdm_enriched_credit.securities" },
  { source: "thefirm_dwh_dwh.dwh_valuta_positie", target: "scdm_enriched_credit.securities" },
  { source: "thefirm_dwh_dwh.dwh_valuta_product", target: "scdm_enriched_credit.securities" },
  { source: "scdm_enriched_credit.securities_account", target: "scdm_enriched_credit.securities_account" },
  { source: "thefirm_dwh_dwh.dwh_instrument", target: "scdm_enriched_credit.securities_account" },
  { source: "thefirm_dwh_dwh.dwh_instrument_koers", target: "scdm_enriched_credit.securities_account" },
  { source: "thefirm_dwh_dwh.dwh_instrument_positie", target: "scdm_enriched_credit.securities_account" },
  { source: "thefirm_dwh_dwh.dwh_onderpand_waardering", target: "scdm_enriched_credit.securities_account" },
  { source: "thefirm_dwh_dwh.dwh_product", target: "scdm_enriched_credit.securities_account" },
  { source: "thefirm_dwh_dwh.dwh_product_waarde", target: "scdm_enriched_credit.securities_account" },
  { source: "thefirm_dwh_dwh.dwh_relatie", target: "scdm_enriched_credit.securities_account" },
  { source: "thefirm_dwh_dwh.dwh_valuta_koers", target: "scdm_enriched_credit.securities_account" },
  { source: "thefirm_dwh_dwh.dwh_zekerheid_onderpand", target: "scdm_enriched_credit.securities_account" },
  { source: "thefirm_dwh_reference.ref_codestelsel", target: "scdm_enriched_credit.securities_account" },
  { source: "scdm_enriched_credit.account", target: "scdm_enriched_credit.thefirm_guaranty" },
  { source: "scdm_enriched_credit.thefirm_guaranty", target: "scdm_enriched_credit.thefirm_guaranty" },
  { source: "thefirm_dwh_dwh.dwh_product", target: "scdm_enriched_credit.thefirm_guaranty" },
  { source: "thefirm_dwh_dwh.dwh_relatie", target: "scdm_enriched_credit.thefirm_guaranty" },
  { source: "thefirm_dwh_dwh.dwh_valuta_product", target: "scdm_enriched_credit.thefirm_guaranty" },
  { source: "thefirm_dwh_reference.ref_codestelsel", target: "scdm_enriched_credit.thefirm_guaranty" },
  { source: "thefirm_dwh_reference.trn_translatie_product", target: "scdm_enriched_credit.thefirm_guaranty" },
]


export const getNetworkBlockLayers = ({productKey}) => [
  {
    "id": "source",
    "layer": "Source",
    "type": "normal"
  },
  {
    "id": "raw",
    "layer": "RAW",
    "type": "normal"
  },
  {
    "id": "base",
    "layer": "BASE",
    "type": "normal"
  },
  {
    "id": "enriched",
    "layer": "Enriched",
    "type": "normal"
  },
  {
    "id": "curated",
    "layer": "Curated",
    "type": "normal"
  },
  {
    "id": "delivery",
    "layer": "Delivery",
    "type": "normal"
  },
]

export const getNetworkBlocks = ({productKey}) => [
  {
      "id": "dwh_dwh",
      "name": "DWH",
      "system": "dwh",
      "subsystem": "dwh",
      "layer": "source",
      "type": "source"
  },
  {
      "id": "cdm_enriched_credit",
      "name": "Enriched Credit Data",
      "system": "cdm",
      "subsystem": "enriched_credit",
      "layer": "enriched",
      "type": "block"
  },
  {
      "id": "cdm_enriched_reference",
      "name": "Reference",
      "system": "cdm",
      "subsystem": "enriched",
      "layer": "enriched",
      "type": "block"
  },
  {
      "id": "dwh_stg_archive_bbt",
      "name": "Bijzonder Beheer Tool",
      "system": "dwh",
      "subsystem": "stg_archive_bbt",
      "layer": "source",
      "type": "source"
  },
  {
      "id": "dwh_stg_archive_stater",
      "name": "Stater",
      "system": "dwh",
      "subsystem": "stg_archive_stater",
      "layer": "source",
      "type": "source"
  },
  {
      "id": "cdm_curated_credit",
      "name": "Credit Model",
      "system": "cdm",
      "subsystem": "curated",
      "layer": "curated",
      "type": "block"
  },
  {
      "id": "dwh_reference",
      "name": "Reference",
      "system": "dwh",
      "subsystem": "dwh",
      "layer": "source",
      "type": "source"
  },
  {
      "id": "dwh_stg_archive_bankview",
      "name": "Bankview",
      "system": "dwh",
      "subsystem": "stg_archive_bankview",
      "layer": "source",
      "type": "source"
  },
  {
      "id": "bankview_securities",
      "name": "Bankview Securities",
      "system": "bankview",
      "subsystem": "securities",
      "layer": "source",
      "type": "source"
  },
  {
      "id": "dwh_stg_archive_krs",
      "name": "VDZ Nederland",
      "system": "dwh",
      "subsystem": "stg_archive_krs",
      "layer": "source",
      "type": "source"
  },
  {
      "id": "dwh_stg_archive_vdz_belgie",
      "name": "VDZ Belgie",
      "system": "dwh",
      "subsystem": "stg_archive_vdz_belgie",
      "layer": "source",
      "type": "source"
  },
  {
      "id": "credit_baseliv",
      "name": "Basel IV",
      "system": "dwh",
      "subsystem": "stg_archive_vdz_belgie",
      "layer": "delivery",
      "type": "database"
  },
  {
      "id": "credit_clientcenter",
      "name": "Client Center",
      "system": "dwh",
      "subsystem": "client_center",
      "layer": "delivery",
      "type": "api"
  }
]


export const getNetworkBlockLinks = ({productKey}) => [
    {
        "source": "dwh_dwh",
        "target": "cdm_enriched_credit",
        "type": "flow"
    },
    {
        "source": "cdm_enriched_reference",
        "target": "cdm_enriched_credit",
        "type": "flow"
    },
    {
        "source": "dwh_stg_archive_bbt",
        "target": "cdm_enriched_credit",
        "type": "flow"
    },
    {
        "source": "dwh_stg_archive_stater",
        "target": "cdm_enriched_credit",
        "type": "flow"
    },
    {
        "source": "cdm_enriched_credit",
        "target": "cdm_curated_credit",
        "type": "flow"
    },
    {
        "source": "dwh_reference",
        "target": "cdm_enriched_credit",
        "type": "flow"
    },
    {
        "source": "dwh_stg_archive_bankview",
        "target": "cdm_enriched_credit",
        "type": "flow"
    },
    {
        "source": "bankview_securities",
        "target": "cdm_enriched_credit",
        "type": "flow"
    },
    {
        "source": "dwh_stg_archive_krs",
        "target": "cdm_enriched_credit",
        "type": "flow"
    },
    {
        "source": "dwh_stg_archive_vdz_belgie",
        "target": "cdm_enriched_credit",
        "type": "flow"
    },
    {
        "source": "cdm_curated_credit",
        "target": "credit_baseliv",
        "type": "flow"
    },
    {
        "source": "cdm_curated_credit",
        "target": "credit_clientcenter",
        "type": "flow"
    }



    
  ]