// @ts-nocheck
import { jsx as _jsx } from "react/jsx-runtime";
import { notFound } from "next/navigation";
import { PractitionerProfile } from "@/components/practitioner-profile";
import { practitionerBySlug, practitioners } from "@/lib/practitioner-data";
export function generateStaticParams() {
    return practitioners.map(({ slug })=>({
            slug
        }));
}
export function generateMetadata({ params }) {
    const practitioner = practitionerBySlug[params.slug];
    return practitioner ? {
        title: `${practitioner.name} | ${practitioner.role}`,
        description: `${practitioner.metadataDescription} Aurelia Private Clinic, Manchester.`
    } : {};
}
export default function PractitionerRoute({ params }) {
    const practitioner = practitionerBySlug[params.slug];
    if (!practitioner) notFound();
    return /*#__PURE__*/ _jsx(PractitionerProfile, {
        practitioner: practitioner
    });
}
