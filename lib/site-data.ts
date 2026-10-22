export type Department = { slug: string; name: string; description: string; image: string };
export type CareConcern = { label: string; department: string; recommendation: string; href: string };
export type { Practitioner } from './practitioner-data';
export { practitioners } from './practitioner-data';
export type Testimonial = { quote: string; name: string; context: string };
export type Fee = { label: string; price: string };
export type DentistryCategory = { title: string; description: string };

const image = (id: string, width = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export const departments: Department[] = [
  { slug: 'general-practice', name: 'General Practice', description: 'Thoughtful everyday healthcare, from one-off concerns to ongoing wellbeing.', image: image('photo-1516841273335-e39b37888115') },
  { slug: 'dentistry', name: 'Dentistry', description: 'Preventive, restorative and cosmetic dentistry delivered with a gentle, considered approach.', image: image('photo-1606811971618-4486d14f3f99') },
  { slug: 'dermatology', name: 'Dermatology', description: 'Expert assessment and treatment for skin health, confidence and comfort.', image: image('photo-1616394584738-fc6e612e71b9') },
  { slug: 'physiotherapy', name: 'Physiotherapy', description: 'Personalised support to help you move with more confidence and less discomfort.', image: image('photo-1576091160399-112ba8d25d1d') },
  { slug: 'womens-health', name: "Women's Health", description: 'Private, respectful care across the changing stages of women’s health.', image: image('photo-1559839734-2b71ea197ec2') },
  { slug: 'health-screening', name: 'Health Screening & Diagnostics', description: 'A clearer picture of your health, with time to understand what comes next.', image: image('photo-1576091160550-2173dba999ef') },
];

export const careConcerns: CareConcern[] = [
  { label: 'Tooth pain', department: 'Dentistry', recommendation: 'Emergency Dental Appointment', href: '/services/dentistry' },
  { label: 'Routine health check', department: 'General Practice', recommendation: 'Private GP Consultation', href: '/services/general-practice' },
  { label: 'Skin concern', department: 'Dermatology', recommendation: 'Dermatology Consultation', href: '/services/dermatology' },
  { label: 'Back or joint pain', department: 'Physiotherapy', recommendation: 'Physiotherapy Assessment', href: '/services/physiotherapy' },
  { label: "Women's health", department: "Women's Health", recommendation: "Women's Health Consultation", href: '/services/womens-health' },
  { label: 'Cosmetic dental treatment', department: 'Dentistry', recommendation: 'Cosmetic Dentistry Consultation', href: '/services/dentistry' },
  { label: 'General health concern', department: 'General Practice', recommendation: 'Private GP Consultation', href: '/services/general-practice' },
  { label: 'Not sure', department: 'Our care team', recommendation: 'A conversation about your needs', href: '/contact' },
];

export const dentistryCategories: DentistryCategory[] = [
  { title: 'Preventive Dentistry', description: 'Examinations, hygiene and personalised guidance for long-term oral health.' },
  { title: 'Restorative Dentistry', description: 'Thoughtful care for damaged, worn or missing teeth.' },
  { title: 'Cosmetic Dentistry', description: 'Subtle, natural-looking improvements designed around you.' },
  { title: 'Emergency Dentistry', description: 'Prompt support when pain or an unexpected concern cannot wait.' },
];

export const testimonials: Testimonial[] = [
  { quote: 'I felt listened to from the moment I arrived. The whole appointment was calm and unhurried.', name: 'Sophie M.', context: 'General Practice' },
  { quote: 'The team explained every option clearly and the treatment felt remarkably considered.', name: 'James R.', context: 'Dentistry' },
  { quote: 'My physiotherapy plan was practical, personal and genuinely fitted around my life.', name: 'Priya K.', context: 'Physiotherapy' },
  { quote: 'I appreciated the thoughtful approach and the clarity around what would happen next.', name: 'Amelia T.', context: 'Dermatology' },
];

export const fees: Fee[] = [
  { label: 'Private GP consultation', price: 'from £95' },
  { label: 'Dental examination', price: 'from £65' },
  { label: 'Hygiene appointment', price: 'from £75' },
  { label: 'Teeth whitening', price: 'from £350' },
  { label: 'Dermatology consultation', price: 'from £180' },
];

