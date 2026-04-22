export interface Tier1Option {
  id: string;
  label: string;
}

export interface Tier2Option {
  id: string;
  label: string;
  tier1Ids: string[];
}

export const tier1Options: Tier1Option[] = [
  { id: 'BUSINESS_AUTO',       label: 'Verslo procesų automatizavimas' },
  { id: 'CUSTOMER_SUPPORT_AI', label: 'Klientų aptarnavimo AI' },
  { id: 'SALES_AI',            label: 'Pardavimų AI' },
  { id: 'SOCIAL_GROWTH',       label: 'Soc. tinklų augimo automatizacija' },
  { id: 'CONTENT_PROD',        label: 'Turinio gamyba ir repurposing' },
  { id: 'ADS_CREATIVE',        label: 'Reklamų kūryba ir optimizacija' },
  { id: 'ECOMMERCE_AI',        label: 'E-commerce AI' },
  { id: 'KNOWLEDGE_RAG',       label: 'Vidinių žinių asistentai (RAG)' },
  { id: 'OCR_DATA',            label: 'OCR ir duomenų ištraukimas' },
  { id: 'DATA_ANALYTICS',      label: 'Duomenų analitika / BI' },
  { id: 'CUSTOM_DEV',          label: 'Individualus AI programavimas' },
  { id: 'AI_GOVERNANCE',       label: 'AI diegimo valdymas' },
  { id: 'COMPLIANCE',          label: 'AI privatumas ir etika' },
  { id: 'WEB_TO_AI_MIGRATION', label: 'LLM Optimizacija (LLMO)' },
];

export const tier2Options: Tier2Option[] = [
  {
    id: 'WORKFLOW_AUTO',
    label: 'Workflow automatizacija',
    tier1Ids: ['BUSINESS_AUTO', 'SALES_AI', 'OCR_DATA'],
  },
  {
    id: 'API_INTEGRATIONS',
    label: 'API integracijos',
    tier1Ids: ['BUSINESS_AUTO', 'ECOMMERCE_AI', 'CUSTOM_DEV'],
  },
  {
    id: 'BACKEND_DB',
    label: 'Backend ir duomenų bazės',
    tier1Ids: ['BUSINESS_AUTO', 'ECOMMERCE_AI', 'OCR_DATA', 'DATA_ANALYTICS', 'CUSTOM_DEV'],
  },
  {
    id: 'RAG_SYSTEMS',
    label: 'RAG sistemos',
    tier1Ids: ['CUSTOMER_SUPPORT_AI', 'KNOWLEDGE_RAG'],
  },
  {
    id: 'AI_AGENTS',
    label: 'Autonominiai AI agentai',
    tier1Ids: ['CUSTOMER_SUPPORT_AI'],
  },
  {
    id: 'ENGAGEMENT_TRIAGE',
    label: 'Engagement klasifikacija',
    tier1Ids: ['CUSTOMER_SUPPORT_AI', 'SOCIAL_GROWTH'],
  },
  {
    id: 'VECTOR_DB',
    label: 'Vektorinės duomenų bazės',
    tier1Ids: ['CUSTOMER_SUPPORT_AI', 'KNOWLEDGE_RAG'],
  },
  {
    id: 'CRM_DATA',
    label: 'CRM ir duomenų praturtinimas',
    tier1Ids: ['SALES_AI'],
  },
  {
    id: 'CONTENT_REPURPOSING',
    label: 'Turinio transformavimas',
    tier1Ids: ['SALES_AI', 'SOCIAL_GROWTH', 'CONTENT_PROD', 'ADS_CREATIVE'],
  },
  {
    id: 'SOCIAL_SCHEDULING',
    label: 'Socialinių tinklų automatizacija',
    tier1Ids: ['SOCIAL_GROWTH'],
  },
  {
    id: 'VIDEO_PIPELINE',
    label: 'Video gamybos pipeline',
    tier1Ids: ['CONTENT_PROD', 'ADS_CREATIVE'],
  },
  {
    id: 'ADS_GEN',
    label: 'Reklamų kūryba (AI)',
    tier1Ids: ['CONTENT_PROD', 'ADS_CREATIVE'],
  },
  {
    id: 'SEMANTIC_DATA',
    label: 'Semantiniai duomenų modeliai',
    tier1Ids: ['ECOMMERCE_AI', 'WEB_TO_AI_MIGRATION'],
  },
  {
    id: 'OCR_GENERATION',
    label: 'OCR ir dokumentų generavimas',
    tier1Ids: ['OCR_DATA'],
  },
  {
    id: 'BI_FORECASTING',
    label: 'BI ir prognozavimas',
    tier1Ids: ['DATA_ANALYTICS'],
  },
  {
    id: 'WEB_APPS',
    label: 'Web aplikacijų kūrimas',
    tier1Ids: ['CUSTOM_DEV', 'WEB_TO_AI_MIGRATION'],
  },
  {
    id: 'CLOUD_DEPLOY',
    label: 'Cloud diegimas ir DevOps',
    tier1Ids: ['CUSTOM_DEV'],
  },
  {
    id: 'PROMPT_GUARDRAILS',
    label: 'AI saugumo ir kontrolės sistemos',
    tier1Ids: ['AI_GOVERNANCE', 'COMPLIANCE'],
  },
  {
    id: 'AGENT_PROTOCOLS',
    label: 'AI agentų protokolai',
    tier1Ids: ['AI_GOVERNANCE', 'WEB_TO_AI_MIGRATION'],
  },
  {
    id: 'GDPR_COMPLIANCE',
    label: 'GDPR ir AI atitiktis',
    tier1Ids: ['COMPLIANCE'],
  },
  {
    id: 'VECTOR_READY',
    label: 'Turinio vektorizacijos paruošimas',
    tier1Ids: ['KNOWLEDGE_RAG'],
  },
];

export function getTier2ForTier1(tier1Id: string): Tier2Option[] {
  return tier2Options.filter(t2 => t2.tier1Ids.includes(tier1Id));
}
