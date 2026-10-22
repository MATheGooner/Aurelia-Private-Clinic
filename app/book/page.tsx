// @ts-nocheck
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { BookingWizard } from "@/components/booking-wizard";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { departmentBySlug } from "@/lib/department-data";
import { practitionerBySlug } from "@/lib/practitioner-data";
import { treatmentBySlug } from "@/lib/treatment-data";
export const metadata = {
    title: "Book an Appointment",
    description: "Explore the frontend demonstration booking journey for Aurelia Private Clinic."
};
export default function BookPage({ searchParams }) {
    const department = searchParams.department && departmentBySlug[searchParams.department] ? searchParams.department : undefined;
    const treatment = searchParams.treatment && treatmentBySlug[searchParams.treatment] ? searchParams.treatment : undefined;
    const practitioner = searchParams.practitioner && practitionerBySlug[searchParams.practitioner] ? searchParams.practitioner : undefined;
    return /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            /*#__PURE__*/ _jsx(SiteHeader, {}),
            /*#__PURE__*/ _jsxs("main", {
                children: [
                    /*#__PURE__*/ _jsx("section", {
                        className: "border-b border-border bg-surface",
                        children: /*#__PURE__*/ _jsxs(Container, {
                            className: "max-w-4xl py-16 sm:py-20",
                            children: [
                                /*#__PURE__*/ _jsx("p", {
                                    className: "eyebrow",
                                    children: "Frontend booking demonstration"
                                }),
                                /*#__PURE__*/ _jsx("h1", {
                                    className: "mt-5 font-display text-5xl leading-tight sm:text-7xl",
                                    children: "Request the right appointment."
                                }),
                                /*#__PURE__*/ _jsx("p", {
                                    className: "mt-6 max-w-2xl text-lg leading-8 text-muted",
                                    children: "Explore how Aurelia’s future booking journey will connect departments, treatments and practitioners. No appointment is created and no data is saved."
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ _jsx(Section, {
                        children: /*#__PURE__*/ _jsx(Container, {
                            children: /*#__PURE__*/ _jsx(BookingWizard, {
                                initialDepartment: department,
                                initialTreatment: treatment,
                                initialPractitioner: practitioner
                            })
                        })
                    })
                ]
            }),
            /*#__PURE__*/ _jsx(SiteFooter, {})
        ]
    });
}
