import type { Practitioner } from './practitioner-data';
import { treatmentsByDepartment } from './treatment-data';

export type DepartmentPage = {
  slug: string; name: string; eyebrow: string; heroTitle: string; heroSupportingText: string;
  shortDescription: string; introduction: string; heroImage: string; experienceImage: string;
  categories: { title: string; description: string; services: string[] }[];
  concerns: { label: string; action: string; href: string }[];
  featuredTreatments: { name: string; description: string; price: string; href: string }[];
  journey: string[]; benefits: { title: string; description: string }[];
  fees: { label: string; price: string }[]; faq: { question: string; answer: string }[];
  finalTitle: string; finalCopy: string; bookingLabel: string;
};

const base = [
  ['general-practice','General Practice','Thoughtful care for everyday health concerns.','photo-1516841273335-e39b37888115'],
  ['dentistry','Dentistry','Preventive, restorative and cosmetic dental care.','photo-1606811971618-4486d14f3f99'],
  ['dermatology','Dermatology','Specialist assessment for skin, hair and scalp concerns.','photo-1616394584738-fc6e612e71b9'],
  ['physiotherapy','Physiotherapy','Assessment and rehabilitation for confident movement.','photo-1576091160399-112ba8d25d1d'],
  ['womens-health',"Women's Health",'Private, respectful care through changing life stages.','photo-1559839734-2b71ea197ec2'],
  ['health-screening','Health Screening & Diagnostics','A clearer picture of your health and next steps.','photo-1576091160550-2173dba999ef'],
] as const;

export const departmentPages: DepartmentPage[] = base.map(([slug, name, description, image]) => {
  const departmentTreatments = treatmentsByDepartment[slug] ?? [];
  return {
    slug, name, eyebrow: 'Aurelia Private Clinic', heroTitle: name, heroSupportingText: description,
    shortDescription: description, introduction: `${description} Appointments allow time for careful assessment, questions and an understandable plan.`,
    heroImage: `https://images.unsplash.com/${image}?auto=format&fit=crop&w=1800&q=85`,
    experienceImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1400&q=85',
    categories: [{ title: 'Consultation and assessment', description: 'Start with an individual clinical assessment.', services: departmentTreatments.slice(0, 6).map(item => item.name) }],
    concerns: departmentTreatments.slice(0, 4).map(item => ({ label: item.name, action: 'Explore treatment', href: `/treatments/${item.slug}` })),
    featuredTreatments: departmentTreatments.slice(0, 6).map(item => ({ name: item.name, description: item.shortDescription, price: item.price, href: `/treatments/${item.slug}` })),
    journey: ['Choose your appointment', 'Meet your clinician', 'Understand your options', 'Plan any follow-up'],
    benefits: [
      { title: 'Time to be heard', description: 'Appointments are structured around careful listening and assessment.' },
      { title: 'Clear next steps', description: 'Options and costs are explained before further care is agreed.' },
    ],
    fees: departmentTreatments.slice(0, 5).map(item => ({ label: item.name, price: item.price })),
    faq: [
      { question: 'Do I need a referral?', answer: 'Most appointments can be booked directly. We will explain if supporting information is useful.' },
      { question: 'What happens after my appointment?', answer: 'Your clinician will explain findings and arrange proportionate follow-up where needed.' },
    ],
    finalTitle: `Ready to discuss your ${name.toLowerCase()} needs?`, finalCopy: 'Choose an appointment or contact our care team for guidance.', bookingLabel: `Book ${name}`,
  };
});

export const departmentBySlug = Object.fromEntries(departmentPages.map(item => [item.slug, item])) as Record<string, DepartmentPage>;
export function departmentPractitioners(department: DepartmentPage, practitioners: Practitioner[]) {
  return practitioners.filter(practitioner => practitioner.departmentSlugs.includes(department.slug));
}
