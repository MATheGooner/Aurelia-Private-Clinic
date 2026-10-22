// @ts-nocheck
/* __next_internal_client_entry_do_not_use__ default auto */ import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { EditorialImage } from "@/components/editorial-image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { careConcerns, dentistryCategories, departments, fees, practitioners, testimonials } from "@/lib/site-data";
const facilityImage = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1400&q=85";
export default function HomePage() {
    const [selected, setSelected] = useState(careConcerns[0]);
    return /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            /*#__PURE__*/ _jsx(SiteHeader, {}),
            /*#__PURE__*/ _jsxs("main", {
                children: [
                    /*#__PURE__*/ _jsxs("section", {
                        className: "relative overflow-hidden",
                        children: [
                            /*#__PURE__*/ _jsx("div", {
                                className: "absolute inset-0",
                                children: /*#__PURE__*/ _jsx(EditorialImage, {
                                    src: "https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=2200&q=85",
                                    alt: "Sunlit, calm clinic interior",
                                    fill: true,
                                    priority: true,
                                    className: "object-cover",
                                    sizes: "100vw"
                                })
                            }),
                            /*#__PURE__*/ _jsx("div", {
                                className: "absolute inset-0 bg-[#1d2925]/45"
                            }),
                            /*#__PURE__*/ _jsx(Container, {
                                className: "relative flex min-h-[38rem] items-end py-20 sm:min-h-[44rem] lg:py-28",
                                children: /*#__PURE__*/ _jsxs("div", {
                                    className: "max-w-3xl text-white",
                                    children: [
                                        /*#__PURE__*/ _jsx("p", {
                                            className: "eyebrow text-white/80",
                                            children: "Aurelia Private Clinic \xc2\xb7 Manchester"
                                        }),
                                        /*#__PURE__*/ _jsx("h1", {
                                            className: "mt-5 font-display text-5xl leading-[1.05] sm:text-7xl",
                                            children: "Private healthcare centred around you"
                                        }),
                                        /*#__PURE__*/ _jsx("p", {
                                            className: "mt-6 max-w-xl text-lg leading-8 text-white/85",
                                            children: "Medical, dental and specialist care with experienced clinicians and convenient private appointments."
                                        }),
                                        /*#__PURE__*/ _jsxs("div", {
                                            className: "mt-8 flex flex-wrap gap-3",
                                            children: [
                                                /*#__PURE__*/ _jsx(Button, {
                                                    href: "/book",
                                                    children: "Book an Appointment"
                                                }),
                                                /*#__PURE__*/ _jsx(Button, {
                                                    href: "#services",
                                                    variant: "secondary",
                                                    className: "border-white/70 text-white hover:border-white hover:text-white",
                                                    children: "Explore Services"
                                                })
                                            ]
                                        })
                                    ]
                                })
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsx("section", {
                        className: "border-b border-border bg-surface",
                        children: /*#__PURE__*/ _jsxs(Container, {
                            className: "grid gap-4 py-7 text-sm text-muted sm:grid-cols-2 lg:grid-cols-4",
                            children: [
                                /*#__PURE__*/ _jsx(Trust, {
                                    text: "Experienced clinicians"
                                }),
                                /*#__PURE__*/ _jsx(Trust, {
                                    text: "Same-week appointments"
                                }),
                                /*#__PURE__*/ _jsx(Trust, {
                                    text: "Transparent pricing"
                                }),
                                /*#__PURE__*/ _jsx(Trust, {
                                    text: "Central Manchester"
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ _jsx(Section, {
                        className: "bg-surface",
                        children: /*#__PURE__*/ _jsxs(Container, {
                            children: [
                                /*#__PURE__*/ _jsx(SectionHeading, {
                                    eyebrow: "A clearer starting point",
                                    title: "What can we help you with?",
                                    intro: "Choose the option that feels closest to what you need. We\xe2€™ll point you towards the right part of Aurelia."
                                }),
                                /*#__PURE__*/ _jsx("div", {
                                    className: "mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
                                    children: careConcerns.map((concern)=>/*#__PURE__*/ _jsx("button", {
                                            onClick: ()=>setSelected(concern),
                                            className: `care-option ${selected.label === concern.label ? "care-option-active" : ""}`,
                                            children: concern.label
                                        }, concern.label))
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    className: "mt-8 flex flex-col justify-between gap-6 border border-border bg-canvas p-6 sm:flex-row sm:items-center sm:p-8",
                                    children: [
                                        /*#__PURE__*/ _jsxs("div", {
                                            children: [
                                                /*#__PURE__*/ _jsx("p", {
                                                    className: "text-xs font-semibold uppercase tracking-[0.16em] text-accent",
                                                    children: "We recommend"
                                                }),
                                                /*#__PURE__*/ _jsx("h3", {
                                                    className: "mt-2 font-display text-3xl",
                                                    children: selected.recommendation
                                                }),
                                                /*#__PURE__*/ _jsx("p", {
                                                    className: "mt-2 text-muted",
                                                    children: selected.department
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ _jsxs("div", {
                                            className: "flex flex-wrap gap-3",
                                            children: [
                                                /*#__PURE__*/ _jsxs(Button, {
                                                    href: selected.href,
                                                    children: [
                                                        "View ",
                                                        selected.department
                                                    ]
                                                }),
                                                /*#__PURE__*/ _jsx(Button, {
                                                    href: "/book",
                                                    variant: "secondary",
                                                    children: "Book Appointment"
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ _jsx(Section, {
                        id: "services",
                        children: /*#__PURE__*/ _jsxs(Container, {
                            children: [
                                /*#__PURE__*/ _jsx(SectionHeading, {
                                    eyebrow: "Care, considered",
                                    title: "Our departments",
                                    intro: "A connected approach to private care, with time to understand your needs properly."
                                }),
                                /*#__PURE__*/ _jsx("div", {
                                    className: "mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3",
                                    children: departments.map((department, index)=>/*#__PURE__*/ _jsx("article", {
                                            className: `group ${index === 0 ? "md:col-span-2 lg:col-span-2" : ""}`,
                                            children: /*#__PURE__*/ _jsx(Link, {
                                                href: `/services/${department.slug}`,
                                                children: /*#__PURE__*/ _jsxs("div", {
                                                    className: `relative overflow-hidden ${index === 0 ? "aspect-[16/8]" : "aspect-[4/3]"}`,
                                                    children: [
                                                        /*#__PURE__*/ _jsx(EditorialImage, {
                                                            src: department.image,
                                                            alt: "",
                                                            fill: true,
                                                            className: "object-cover transition duration-500 group-hover:scale-105",
                                                            sizes: "(min-width: 1024px) 50vw, 100vw"
                   