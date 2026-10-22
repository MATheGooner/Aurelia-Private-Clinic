// @ts-nocheck
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./button";
import { Container } from "./container";
import { Section } from "./section";
import { SectionHeading } from "./section-heading";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { departmentBySlug } from "@/lib/department-data";
import { treatmentBySlug } from "@/lib/treatment-data";
export function PractitionerProfile({ practitioner }) {
    const departments = practitioner.departmentSlugs.map((slug)=>departmentBySlug[slug]).filter(Boolean);
    const treatments = practitioner.treatmentSlugs.map((slug)=>treatmentBySlug[slug]).filter(Boolean);
    return /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            /*#__PURE__*/ _jsx(SiteHeader, {}),
            /*#__PURE__*/ _jsxs("main", {
                children: [
                    /*#__PURE__*/ _jsx("div", {
                        className: "border-b border-border bg-surface",
                        children: /*#__PURE__*/ _jsx(Container, {
                            className: "py-4",
                            children: /*#__PURE__*/ _jsxs("nav", {
                                "aria-label": "Breadcrumb",
                                className: "flex flex-wrap items-center gap-2 text-xs text-muted",
                                children: [
                                    /*#__PURE__*/ _jsx(Link, {
                                        href: "/",
                                        className: "hover:text-accent",
                                        children: "Home"
                                    }),
                                    /*#__PURE__*/ _jsx("span", {
                                        "aria-hidden": "true",
                                        children: "/"
                                    }),
                                    /*#__PURE__*/ _jsx(Link, {
                                        href: "/practitioners",
                                        className: "hover:text-accent",
                                        children: "Practitioners"
                                    }),
                                    /*#__PURE__*/ _jsx("span", {
                                        "aria-hidden": "true",
                                        children: "/"
                                    }),
                                    /*#__PURE__*/ _jsx("span", {
                                        "aria-current": "page",
                                        className: "text-ink",
                                        children: practitioner.name
                                    })
                                ]
                            })
                        })
                    }),
                    /*#__PURE__*/ _jsx("section", {
                        className: "bg-surface",
                        children: /*#__PURE__*/ _jsxs(Container, {
                            className: "grid gap-10 py-12 sm:py-16 lg:grid-cols-[.85fr_1.15fr] lg:items-center",
                            children: [
                                /*#__PURE__*/ _jsx("div", {
                                    className: "relative aspect-[4/5] max-h-[43rem] overflow-hidden bg-accent-soft",
                                    children: /*#__PURE__*/ _jsx(Image, {
                                        src: practitioner.image,
                                        alt: practitioner.name,
                                        fill: true,
                                        priority: true,
                                        className: "object-cover",
                                        sizes: "(min-width: 1024px) 42vw, 100vw"
                                    })
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    children: [
                                        /*#__PURE__*/ _jsx("p", {
                                            className: "eyebrow",
                                            children: practitioner.role
                                        }),
                                        /*#__PURE__*/ _jsx("h1", {
                                            className: "mt-5 font-display text-5xl leading-tight sm:text-7xl",
                                            children: practitioner.name
                                        }),
                                        /*#__PURE__*/ _jsx("div", {
                                            className: "mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-accent",
                                            children: departments.map((department)=>/*#__PURE__*/ _jsx(Link, {
                                                    href: `/services/${department.slug}`,
                                                    className: "underline-offset-4 hover:underline",
                                                    children: department.name
                                                }, department.slug))
                                        }),
                                        /*#__PURE__*/ _jsx("p", {
                                            className: "mt-6 max-w-xl text-lg leading-8 text-muted",
                                            children: practitioner.introduction
                                        }),
                                        /*#__PURE__*/ _jsxs("p", {
                                            className: "mt-6 border-l-2 border-accent pl-4 text-sm text-muted",
                                            children: [
                                                practitioner.availability,
                                                ". Static portfolio-demo availability."
                                            ]
                                        }),
                                        /*#__PURE__*/ _jsxs("div", {
                                            className: "mt-8 flex flex-wrap gap-3",
                                            children: [
                                                /*#__PURE__*/ _jsx(Button, {
                                                    href: `/book?practitioner=${practitioner.slug}`,
                                                    children: practitioner.bookingLabel
                                                }),
                                                /*#__PURE__*/ _jsx(Button, {
                                                    href: "#treatments",
                                                    variant: "secondary",
                                                    children: "View Treatments"
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ _jsx(Section, {
                        children: /*#__PURE__*/ _jsxs(Container, {
                            className: "grid gap-12 lg:grid-cols-[.65fr_1.35fr]",
                            children: [
                                /*#__PURE__*/ _jsxs("p", {
                                    className: "eyebrow",
                                    children: [
                                        "About ",
                                        practitioner.name.replace(/^Dr /, "")
                                    ]
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    children: [
                                        /*#__PURE__*/ _jsx("h2", {
                                            className: "font-display text-4xl leading-tight sm:text-5xl",
                                            children: "Professional, personal care."
                                        }),
                                        /*#__PURE__*/ _jsx("p", {
                                            className: "mt-6 max-w-3xl text-lg leading-8 text-muted",
                                            children: practitioner.biography
                                        })
                                    ]
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ _jsx(Section, {
                        className: "bg-accent-soft",
                        children: /*#__PURE__*/ _jsxs(Container, {
                            className: "grid gap-12 md:grid-cols-3",
                            children: [
                                /*#__PURE__*/ _jsxs("div", {
                                    children: [
                                        /*#__PURE__*/ _jsx(SectionHeading, {
                                            eyebrow: "Background",
                                            title: "Qualifications"
                                        }),
                                        /*#__PURE__*/ _jsx("ul", {
                                            className: "mt-7 space-y-3 text-sm text-muted",
                                            children: practitioner.qualifications.map((item)=>/*#__PURE__*/ _jsx("li", {
                                                    className: "border-t border-border pt-3",
                                                    children: item
                                                }, item))
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    children: [
                                        /*#__PURE__*/ _jsx(SectionHeading, {
                                            eyebrow: "Clinical focus",
                                            title: "Special interests"
                                        }),
                                        /*#__PURE__*/ _jsx("ul", {
                                            className: "mt-7 space-y-3 text-sm text-muted",
                                            children: practitioner.specialInterests.map((item)=>/*#__PURE__*/ _jsx("li", {
                                                    className: "border-t border-border pt-3",
                                                    children: item
                                                }, item))
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    children: [
                                        /*#__PURE__*/ _jsx(SectionHeading, {
                                            eyebrow: "Communication",
                                            title: "Languages"
                                        }),
                                        /*#__PURE__*/ _jsx("ul", {
                                            className: "mt-7 space-y-3 text-sm text-muted",
                                            children: practitioner.languages.map((item)=>/*#__PURE__*/ _jsx("li", {
                                                    className: "border-t border-border pt-3",
                                                    children: item
                                                }, item))
                                        })
                                    ]
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ _jsx(Section, {
                        id: "treatments",
                        children: /*#__PURE__*/ _jsxs(Container, {
                            children: [
                                /*#__PURE__*/ _jsx(SectionHeading, {
                                    eyebrow: "Care with this practitioner",
                                    title: "Treatments and consultations",
                                    intro: "Treatment details are resolved from Aurelia’s central treatment catalogue."
                                }),
                                /*#__PURE__*/ _jsx("div", {
                                    className: "mt-10 divide-y divide-border border-y border-border",
                                    children: treatments.map((treatment)=>/*#__PURE__*/ _jsxs("article", {
                                            className: "grid gap-5 py-6 sm:grid-cols-[1fr_auto] sm:items-start",
                                            children: [
                                                /*#__PURE__*/ _jsxs("div", {
                                                    children: [
                                                        /*#__PURE__*/ _jsx("p", {
                                                            className: "text-xs font-semibold uppercase tracking-[.14em] text-accent",
                                                            children: treatment.category
                                                        }),
                                                        /*#__PURE__*/ _jsx("h3", {
                                                            className: "mt-2 font-display text-2xl",
                                                            children: treatment.name
                                                        }),
                                                        /*#__PURE__*/ _jsx("p", {
                                                            className: "mt-2 max-w-2xl text-sm leading-6 text-muted",
                                                            children: treatment.shortDescription
                                                        }),
                                                        treatment.price && /*#__PURE__*/ _jsx("p", {
                                                            className: "mt-3 text-sm font-medium text-accent",
                                                            children: treatment.price
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ _jsx(Link, {
                                                    href: `/treatments/${treatment.slug}`,
                                                    className: "text-sm text-accent underline-offset-4 hover:underline",
                                                    children: "View treatment →"
                                                })
                                            ]
                                        }, treatment.slug))
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ _jsx(Section, {
                        className: "bg-surface",
                        children: /*#__PURE__*/ _jsxs(Container, {
                            className: "grid gap-12 lg:grid-cols-2",
                            children: [
                                /*#__PURE__*/ _jsxs("div", {
                                    children: [
                                        /*#__PURE__*/ _jsx(SectionHeading, {
                                            eyebrow: "Demonstration schedule",
                                            title: "Working days",
                                            intro: "These recurring days are static frontend data and do not represent live appointment availability."
                                        }),
                                        /*#__PURE__*/ _jsx("div", {
                                            className: "mt-7 flex flex-wrap gap-2",
                                            children: practitioner.workingDays.map((day)=>/*#__PURE__*/ _jsx("span", {
                                                    className: "border border-border bg-canvas px-4 py-2 text-sm",
                                                    children: day
                                                }, day))
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    children: [
                                        /*#__PURE__*/ _jsx(SectionHeading, {
                                            eyebrow: "Appointment types",
                                            title: "Ways to consult"
                                        }),
                                        /*#__PURE__*/ _jsx("ul", {
                                            className: "mt-7 divide-y divide-border border-y border-border",
                                            children: practitioner.consultationTypes.map((type)=>/*#__PURE__*/ _jsx("li", {
                                                    className: "py-4 text-sm",
                                                    children: type
                                                }, type))
                                        }),
                                        practitioner.consultationFee && /*#__PURE__*/ _jsxs("p", {
                                            className: "mt-5 text-sm text-muted",
                                            children: [
                                                "Indicative demo fee: ",
                                                /*#__PURE__*/ _jsx("span", {
                                                    className: "font-medium text-accent",
                                                    children: practitioner.consultationFee
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ _jsx("section", {
                        className: "bg-accent py-20 text-white sm:py-24",
                        children: /*#__PURE__*/ _jsxs(Container, {
                            className: "flex flex-col justify-between gap-8 md:flex-row md:items-end",
                            children: [
                                /*#__PURE__*/ _jsxs("div", {
                                    children: [
                                        /*#__PURE__*/ _jsx("p", {
                                            className: "eyebrow text-white/70",
                                            children: "Request an appointment"
                                        }),
                                        /*#__PURE__*/ _jsxs("h2", {
                                            className: "mt-4 max-w-2xl font-display text-5xl leading-tight",
                                            children: [
                                                "Would you like to see ",
                                                practitioner.name,
                                                "?"
                                            ]
                                        }),
                                        /*#__PURE__*/ _jsx("p", {
                                            className: "mt-5 max-w-xl text-lg leading-8 text-white/75",
                                            children: "Send an appointment request and the clinic team will confirm the right consultation and availability."
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    className: "flex flex-wrap gap-3",
                                    children: [
                                        /*#__PURE__*/ _jsx(Button, {
                                            href: `/book?practitioner=${practitioner.slug}`,
                                            children: practitioner.bookingLabel
                                        }),
                                        /*#__PURE__*/ _jsx(Button, {
                                            href: "/contact",
                                            variant: "secondary",
                                            className: "border-white/60 text-white hover:border-white hover:text-white",
                                            children: "Contact the Clinic"
                                        })
                                    ]
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
