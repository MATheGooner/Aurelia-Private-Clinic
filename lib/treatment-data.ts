import type { Practitioner } from './practitioner-data';

export type Treatment = {
  slug: string; name: string; departmentSlug: string; department: string; category: string;
  shortDescription: string; introduction: string; heroImage: string; concerns: string[];
  suitability: string[]; process: { title: string; description: string }[]; price: string;
  durationNote: string; bookingTitle: string; bookingLabel: string; urgentGuidance?: string;
  faq: { question: string; answer: string }[]; relatedSlugs: string[];
};

const images: Record<string, string> = {
  'general-practice': 'https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=1600&q=85',
  dentistry: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1600&q=85',
  dermatology: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1600&q=85',
  physiotherapy: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=85',
  'womens-health': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1600&q=85',
  'health-screening': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=85',
};
const departments: Record<string, string> = {
  'general-practice': 'General Practice', dentistry: 'Dentistry', dermatology: 'Dermatology',
  physiotherapy: 'Physiotherapy', 'womens-health': "Women's Health", 'health-screening': 'Health Screening & Diagnostics',
};
const definitions: Array<[string, string, string, string, string]> = [
  ['private-gp-consultation','Private GP Consultation','general-practice','General Practice','from £95'],
  ['health-review','Health Review','general-practice','Preventive care','from £145'],
  ['general-health-concern','General Health Concern','general-practice','General Practice','from £95'],
  ['gp-follow-up','GP Follow-up','general-practice','General Practice','from £75'],
  ['routine-health-check','Routine Health Check','health-screening','Health screening','from £195'],
  ['preventive-health-assessment','Preventive Health Assessment','health-screening','Health screening','from £295'],
  ['private-health-check','Private Health Check','health-screening','Health screening','from £295'],
  ['results-review','Results Review','health-screening','Diagnostics','from £75'],
  ['screening-support','Screening Support','health-screening','Diagnostics','from £95'],
  ['dental-examination','Dental Examination','dentistry','Preventive dentistry','from £65'],
  ['emergency-dental-appointment','Emergency Dental Appointment','dentistry','Emergency dentistry','from £95'],
  ['dental-hygiene','Dental Hygiene','dentistry','Preventive dentistry','from £75'],
  ['fillings','Dental Fillings','dentistry','Restorative dentistry','from £145'],
  ['crowns','Dental Crowns','dentistry','Restorative dentistry','from £695'],
  ['root-canal-treatment','Root Canal Treatment','dentistry','Restorative dentistry','from £650'],
  ['dental-implants','Dental Implants','dentistry','Implant dentistry','from £120'],
  ['clear-aligner-consultation','Clear Aligner Consultation','dentistry','Cosmetic dentistry','from £95'],
  ['teeth-whitening','Teeth Whitening','dentistry','Cosmetic dentistry','from £350'],
  ['veneers','Dental Veneers','dentistry','Cosmetic dentistry','from £750'],
  ['dermatology-consultation','Dermatology Consultation','dermatology','General dermatology','from £180'],
  ['acne-consultation','Acne Consultation','dermatology','Medical dermatology','from £180'],
  ['eczema-consultation','Eczema Consultation','dermatology','Medical dermatology','from £180'],
  ['mole-consultation','Mole Consultation','dermatology','Skin assessment','from £180'],
  ['hair-scalp-consultation','Hair & Scalp Consultation','dermatology','Hair and scalp','from £180'],
  ['physiotherapy-assessment','Physiotherapy Assessment','physiotherapy','Assessment','from £85'],
  ['back-pain-assessment','Back Pain Assessment','physiotherapy','Musculoskeletal care','from £85'],
  ['sports-injury-consultation','Sports Injury Consultation','physiotherapy','Sports rehabilitation','from £85'],
  ['joint-pain-assessment','Joint Pain Assessment','physiotherapy','Musculoskeletal care','from £85'],
  ['rehabilitation-session','Rehabilitation Session','physiotherapy','Rehabilitation','from £75'],
  ['womens-health-consultation',"Women's Health Consultation",'womens-health',"Women's health",'from £130'],
  ['menstrual-health-consultation','Menstrual Health Consultation','womens-health',"Women's health",'from £130'],
  ['menopause-consultation','Menopause Consultation','womens-health','Menopause care','from £150'],
  ['reproductive-health-consultation','Reproductive Health Consultation','womens-health','Reproductive health','from £130'],
];

export const treatments: Treatment[] = definitions.map(([slug, name, departmentSlug, category, price], index, all) => ({
  slug, name, departmentSlug, department: departments[departmentSlug], category, price,
  shortDescription: `Private ${name.toLowerCase()} with careful assessment and clear next steps.`,
  introduction: `Your appointment begins with time to understand your concerns, priorities and relevant health history before appropriate options are discussed.`,
  heroImage: images[departmentSlug],
  concerns: ['A new or changing concern', 'Symptoms affecting day-to-day life', 'A need for considered specialist advice'],
  suitability: ['Patients seeking a private clinical assessment', 'People who value clear explanations and a proportionate plan'],
  process: [
    { title: 'Conversation', description: 'We listen to your concerns and relevant history.' },
    { title: 'Assessment', description: 'Your clinician carries out an appropriate examination or review.' },
    { title: 'Plan', description: 'Findings and suitable next steps are explained clearly.' },
    { title: 'Follow-up', description: 'Further care is arranged where it is clinically useful.' },
  ],
  durationNote: 'Appointment length depends on the assessment and treatment required.',
  bookingTitle: `Book a ${name.toLowerCase()}`, bookingLabel: `Book ${name}`,
  urgentGuidance: slug === 'emergency-dental-appointment' ? 'Severe swelling, breathing difficulty or uncontrolled bleeding requires urgent emergency care.' : undefined,
  faq: [
    { question: 'What should I bring?', answer: 'Bring relevant medication details, previous results and any questions you would like to discuss.' },
    { question: 'Will treatment happen immediately?', answer: 'Your clinician will assess suitability and explain timing before treatment is agreed.' },
  ],
  relatedSlugs: all.filter(item => item[2] === departmentSlug && item[0] !== slug).slice(0, 3).map(item => item[0]),
}));

export const treatmentBySlug = Object.fromEntries(treatments.map(item => [item.slug, item])) as Record<string, Treatment>;
export const treatmentsByDepartment = Object.fromEntries(Object.keys(departments).map(slug => [slug, treatments.filter(item => item.departmentSlug === slug)])) as Record<string, Treatment[]>;
export function treatmentPractitioners(treatment: Treatment, practitioners: Practitioner[]) {
  return practitioners.filter(practitioner => practitioner.treatmentSlugs.includes(treatment.slug));
}
