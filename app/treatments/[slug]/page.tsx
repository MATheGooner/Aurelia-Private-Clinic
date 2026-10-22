// @ts-nocheck
import { jsx as _jsx } from "react/jsx-runtime";
import { notFound } from "next/navigation";
import { TreatmentPage } from "@/components/treatment-page";
import { treatmentBySlug, treatments } from "@/lib/treatment-data";
export function generateStaticParams() {
    return treatments.map(({ slug })=>({
            slug
        }));
}
export function generateMetadata({ params }) {
    const treatment = treatmentBySlug[params.slug];
    return treatment ? {
        title: treatment.name,
        description: treatment.shortDescription
    } : {};
}
export default function TreatmentRoute({ params }) {
    const treatment = treatmentBySlug[params.slug];
    if (!treatment) notFound();
    return /*#__PURE__*/ _jsx(TreatmentPage, {
        treatment: treatment
    });
}
