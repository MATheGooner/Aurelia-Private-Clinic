// @ts-nocheck
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Link from "next/link";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { departmentPages } from "@/lib/department-data";
import { treatmentsByDepartment } from "@/lib/treatment-data";
export const metadata = {
    title: "Fees",
    description: "View illustrative portfolio-demo pricing for private appointments and treatments at Aurelia Private Clinic."
};
export default function FeesPage() {
    return /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            /*#__PURE__*/ _jsx(SiteHeader, {}),
            /*#__PURE__*/ _jsxs("main", {
                children: [
                    /*#__PURE__*/ _jsx("section", {
                        className: "border-b border-border bg-surface",
                        children: /*#__PURE__*/ _jsxs(Container, {
                            className: "grid gap-10 py-20 sm:py-28 lg:grid-cols-[.8fr_1.2fr] lg:items-end",
                            children: [
                                /*#__PURE__*/ _jsxs("div", {
                                    children: [
                                        /*#__PURE__*/ _jsx("p", {
                                            className: "eyebrow",
                                            children: "Illustrative portfolio-demo pricing"
                                        }),
                                        /*#__PURE__*/ _jsx("h1", {
                                            className: "mt-5 font-display text-5xl leading-tight sm:text-7xl",
                                            children: "Clear fees, before care begins."
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    children: [
                                        /*#__PURE__*/ _jsx("p", {
                                            className: "max-w-xl text-lg leading-8 text-muted",
                                            children: "The prices below come directly from Aurelia’s canonical treatment catalogue. They illustrate how transparent pricing could be presented for this fictional clinic."
                                        }),
                                        /*#__PURE__*/ _jsx("p", {
                                            className: "mt-4 max-w-xl text-sm leading-6 text-muted",
                                            children: "Some treatments require a consultation first. Final costs may depend on clinical assessment and complex treatment plans may vary."
                                        })
                                    ]
                                })
                            ]
                        })
                    }),
                    departmentPages.map((department, index)=>{
                        const priced = (treatmentsByDepartment[department.slug] ?? []).filter((item)=>item.price);
                        return /*#__PURE__*/ _jsx(Section, {
                            className: index % 2 ? "bg-surface" : "",
                            children: /*#__PURE__*/ _jsxs(Container, {
                                className: "grid gap-10 lg:grid-cols-[.6fr_1.4fr]",
                                children: [
                                    /*#__PURE__*/ _jsxs("div", {
                                        children: [
                                            /*#__PURE__*/ _jsxs("p", {
                                                className: "text-xs font-semibold uppercase tracking-[.16em] text-accent",
                                                children: [
                                                    "0",
                                                    index + 1
                                                ]
                                            }),
                                            /*#__PURE__*/ _jsx("h2", {
                                                className: "mt-4 font-display text-4xl",
                                                children: department.name
                                            }),
                                            /*#__PURE__*/ _jsx(Link, {
                                                href: `/services/${department.slug}`,
                                                className: "mt-5 inline-block text-sm text-accent hover:underline",
                                                children: "View department →"
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ _jsx("div", {
                                        className: "divide-y divide-border border-y border-border",
                                        children: priced.length ? priced.map((treatment)=>/*#__PURE__*/ _jsxs(Link, {
                                                href: `/treatments/${treatment.slug}`,
                                                className: "grid gap-2 py-5 sm:grid-cols-[1fr_auto]",
                                                children: [
                                                    /*#__PURE__*/ _jsx("span", {
                                                        className: "text-sm font-medium",
                                                        children: treatment.name
                                                    }),
                                                    /*#__PURE__*/ _jsx("span", {
                                                        className: "text-sm text-accent",
                                                        children: treatment.price
                                                    })
                                                ]
                                            }, treatment.slug)) : /*#__PURE__*/ _jsx("p", {
                                            className: "py-5 text-sm text-muted",
                                            children: "Pricing is confirmed after an appropriate consultation."
                                        })
                                    })
                                ]
                            })
                        }, department.slug);
                    }),
                    /*#__PURE__*/ _jsx("section", {
                        className: "bg-accent py-20 text-white",
                        children: /*#__PURE__*/ _jsxs(Container, {
                            className: "flex flex-col justify-between gap-8 md:flex-row md:items-end",
                            children: [
                                /*#__PURE__*/ _jsxs("div", {
                                    children: [
                                        /*#__PURE__*/ _jsx("p", {
                                            className: "eyebrow text-white/70",
                                            children: "Ready to take the next step?"
                                        }),
                                        /*#__PURE__*/ _jsx("h2", {
                                            className: "mt-4 font-display text-5xl",
                                            children: "Request an appointment."
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsx(Button, {
                                    href: "/book",
                                    children: "Book an Appointment"
                                })
                            ]
                        })
                    })
                ]
            }),
            /*#__PURE__*/ _jsx(SiteFooter, {})
        ]
    });
}
