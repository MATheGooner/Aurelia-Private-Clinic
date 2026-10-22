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
import { treatmentBySlug, treatmentPractitioners } from "@/lib/treatment-data";
import { practitioners } from "@/lib/site-data";
export function TreatmentPage({ treatment }) {
    const clinicians = treatmentPractitioners(treatment, practitioners);
    const related = treatment.relatedSlugs.map((slug)=>treatmentBySlug[slug]).filter(Boolean).slice(0, 3);
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
                                        className: "hover:text-accent",
                                        href: "/",
                                        children: "Home"
                                    }),
                                    /*#__PURE__*/ _jsx("span", {
                                        "aria-hidden": "true",
                                        children: "/"
                                    }),
                                    /*#__PURE__*/ _jsx(Link, {
                                        className: "hover:text-accent",
                                        href: `/services/${treatment.departmentSlug}`,
                                        children: treatment.department
                                    }),
                                    /*#__PURE__*/ _jsx("span", {
                                        "aria-hidden": "true",
                                        children: "/"
                                    }),
                                    /*#__PURE__*/ _jsx("span", {
                                        "aria-current": "page",
                                        className: "text-ink",
                                        children: treatment.name
                                    })
                                ]
                            })
                        })
                    }),
                    /*#__PURE__*/ _jsx("section", {
                        className: "bg-surface",
                        children: /*#__PURE__*/ _jsxs(Container, {
                            className: "grid min-h-[34rem] gap-10 py-12 sm:py-16 lg:grid-cols-[.9fr_1.1fr] lg:items-center",
                            children: [
                                /*#__PURE__*/ _jsxs("div", {
                                    children: [
                                        /*#__PURE__*/ _jsxs("p", {
                                            className: "eyebrow",
                                            children: [
                                                treatment.department,
                                                " \xb7 ",
                                                treatment.category
                                            ]
                                        }),
                                        /*#__PURE__*/ _jsx("h1", {
                                            className: "mt-5 font-display text-5xl leading-[1.05] sm:text-7xl",
                                            children: treatment.name
                                        }),
                                        /*#__PURE__*/ _jsx("p", {
                                            className: "mt-6 max-w-xl text-lg leading-8 text-muted",
                                            children: treatment.shortDescription
                                        }),
                                        treatment.durationNote && /*#__PURE__*/ _jsx("p", {
                                            className: "mt-5 border-l-2 border-accent pl-4 text-sm leading-6 text-muted",
                                            children: treatment.durationNote
                                        }),
                                        /*#__PURE__*/ _jsxs("div", {
                                            className: "mt-8 flex flex-wrap gap-3",
                                            children: [
                                                /*#__PURE__*/ _jsx(Button, {
                                                    href: `/book?treatment=${treatment.slug}`,
                                                    children: treatment.bookingLabel
                                                }),
                                                /*#__PURE__*/ _jsxs(Button, {
                                                    href: `/services/${treatment.departmentSlug}`,
                                                    variant: "secondary",
                                                    children: [
                                                        "Explore ",
                                                        treatment.department
                                                    ]
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsx("div", {
                                    className: "relative aspect-[4/3] overflow-hidden lg:aspect-[5/4]",
                                    children: /*#__PURE__*/ _jsx(Image, {
                                        src: treatment.heroImage,
                                        alt: `${treatment.name} consultation at Aurelia Private Clinic`,
                                        fill: true,
                                        priority: true,
                                        className: "object-cover",
                                        sizes: "(min-width: 1024px) 52vw, 100vw"
                                    })
                                })
                            ]
                        })
                    }),
                    treatment.urgentGuidance && /*#__PURE__*/ _jsx("div", {
                        className: "border-y border-[#d5c9b5] bg-[#f2ece2]",
                        children: /*#__PURE__*/ _jsxs(Container, {
                            className: "py-5 text-sm leading-6 text-ink",
                            children: [
                                /*#__PURE__*/ _jsx("strong", {
                                    children: "When to seek urgent medical help:"
                                }),
                                " ",
                                treatment.urgentGuidance
                            ]
                        })
                    }),
                    /*#__PURE__*/ _jsx(Section, {
                        children: /*#__PURE__*/ _jsxs(Container, {
                            className: "grid gap-12 lg:grid-cols-[.65fr_1.35fr]",
                            children: [
                                /*#__PURE__*/ _jsx("p", {
                                    className: "eyebrow",
                                    children: "Treatment overview"
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    children: [
                                        /*#__PURE__*/ _jsx("h2", {
                                            className: "font-display text-4xl leading-tight sm:text-5xl",
                                            children: "A considered first step."
                                        }),
                                        /*#__PURE__*/ _jsx("p", {
                                            className: "mt-6 max-w-3xl text-lg leading-8 text-muted",
                                            children: treatment.introduction
                                        })
                                    ]
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ _jsx(Section, {
                        className: "bg-accent-soft",
                        children: /*#__PURE__*/ _jsxs(Container, {
                            className: "grid gap-12 lg:grid-cols-2",
                            children: [
                                /*#__PURE__*/ _jsxs("div", {
                                    children: [
                                        /*#__PURE__*/ _jsx(SectionHeading, {
                                            eyebrow: "Reasons to enquire",
                                            title: "What might bring you to us"
                                        }),
                                        /*#__PURE__*/ _jsx("ul", {
                                            className: "mt-8 divide-y divide-border border-y border-border",
                                            children: treatment.concerns.map((item)=>/*#__PURE__*/ _jsx("li", {
                                                    className: "py-4 text-sm",
                                                    children: item
                                                }, item))
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    children: [
                                        /*#__PURE__*/ _jsx(SectionHeading, {
                                            eyebrow: "Individual assessment matters",
                                            title: "Who it may be suitable for"
                                        }),
                                        /*#__PURE__*/ _jsx("ul", {
                                            className: "mt-8 space-y-4",
                                            children: treatment.suitability.map((item)=>/*#__PURE__*/ _jsxs("li", {
                                                    className: "flex gap-4 text-sm leading-6 text-muted",
                                                    children: [
                                                        /*#__PURE__*/ _jsx("span", {
                                                            "aria-hidden": "true",
                                                            className: "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                                                        }),
                                                        item
                                                    ]
                                                }, item))
                                        }),
                                        /*#__PURE__*/ _jsx("p", {
                                            className: "mt-7 text-sm leading-6 text-muted",
                                            children: "Suitability is never assumed. Your clinician will assess your circumstances and explain appropriate options."
                                        })
                                    ]
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ _jsx(Section, {
                        children: /*#__PURE__*/ _jsxs(Container, {
                            children: [
                                /*#__PURE__*/ _jsx(SectionHeading, {
                                    eyebrow: "Your appointment and care",
                                    title: "What to expect",
                                    intro: "The exact pathway varies. These stages provide a helpful guide rather than a guaranteed sequence."
                                }),
                                /*#__PURE__*/ _jsx("ol", {
                                    className: `mt-12 grid gap-px overflow-hidden border border-border bg-border ${treatment.process.length > 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2 lg:grid-cols-4"}`,
                                    children: treatment.process.map((step, index)=>/*#__PURE__*/ _jsxs("li", {
                                            className: "bg-surface p-6",
                                            children: [
                                                /*#__PURE__*/ _jsx("span", {
                                                    className: "text-xs font-semibold tracking-widest text-accent",
                                                    children: String(index + 1).padStart(2, "0")
                                                }),
                                                /*#__PURE__*/ _jsx("h3", {
                                                    className: "mt-4 font-display text-2xl",
                                                    children: step.title
                                                }),
                                                /*#__PURE__*/ _jsx("p", {
                                                    className: "mt-3 text-sm leading-6 text-muted",
                                                    children: step.description
                                                })
                                            ]
                                        }, `${index}-${step.title}`))
                                })
                            ]
                        })
                    }),
                    clinicians.length > 0 && /*#__PURE__*/ _jsx(Section, {
                        className: "bg-surface",
                        children: /*#__PURE__*/ _jsxs(Container, {
                            children: [
                                /*#__PURE__*/ _jsxs("div", {
                                    className: "flex flex-col justify-between gap-5 sm:flex-row sm:items-end",
                                    children: [
                                        /*#__PURE__*/ _jsx(SectionHeading, {
                                            eyebrow: "Relevant practitioners",
                                            title: "Your clinical team",
                                            intro: "Practitioner details are referenced from Aurelia’s central team data."
                                        }),
                                        /*#__PURE__*/ _jsx(Button, {
                                            href: "/practitioners",
                                            variant: "text",
                                            children: "View all practitioners →"
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsx("div", {
                                    className: "mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3",
                                    children: clinicians.map((person)=>/*#__PURE__*/ _jsxs("article", {
                                            className: "grid grid-cols-[7rem_1fr] gap-5 border-t border-border pt-5 sm:grid-cols-[9rem_1fr]",
                                            children: [
                                                /*#__PURE__*/ _jsx("div", {
                                                    className: "relative aspect-[4/5] overflow-hidden bg-accent-soft",
                                                    children: /*#__PURE__*/ _jsx(Image, {
                                                        src: person.image,
                                                        alt: person.name,
                                                        fill: true,
                                                        className: "object-cover",
                                                        sizes: "144px"
                                                    })
                                                }),
                                                /*#__PURE__*/ _jsxs("div", {
                                                    children: [
                                                        /*#__PURE__*/ _jsx("p", {
                                                            className: "text-xs font-semibold uppercase tracking-[.14em] text-accent",
                                                            children: person.role
                                                        }),
                                                        /*#__PURE__*/ _jsx("h3", {
                                                            className: "mt-2 font-display text-2xl",
                                                            children: person.name
                                                        }),
                                                        /*#__PURE__*/ _jsx("p", {
                                                            className: "mt-2 text-sm leading-6 text-muted",
                                                            children: person.interests
                                                        }),
                                                        /*#__PURE__*/ _jsx(Link, {
                                                            href: `/practitioners/${person.slug}`,
                                                            className: "mt-4 inline-block text-sm text-accent underline-offset-4 hover:underline",
                                                            children: "View profile →"
                                                        })
                                                    ]
                                                })
                                            ]
                                        }, person.slug))
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ _jsx(Section, {
                        children: /*#__PURE__*/ _jsxs(Container, {
                            className: "grid gap-12 lg:grid-cols-[.8fr_1.2fr]",
                            children: [
                                /*#__PURE__*/ _jsxs("div", {
                                    children: [
                                        /*#__PURE__*/ _jsx("p", {
                                            className: "eyebrow",
                                            children: "Indicative portfolio-demo pricing"
                                        }),
                                        /*#__PURE__*/ _jsx("h2", {
                                            className: "mt-4 font-display text-4xl sm:text-5xl",
                                            children: "Clear about cost."
                                        }),
                                        /*#__PURE__*/ _jsx("p", {
                                            className: "mt-5 text-lg text-accent",
                                            children: treatment.price ?? "Pricing confirmed after assessment"
                                        }),
                                        /*#__PURE__*/ _jsx("p", {
                                            className: "mt-5 max-w-md text-sm leading-6 text-muted",
                                            children: "This is illustrative demo pricing, not a quotation. Complexity and individual needs may affect the final cost, which will be discussed before treatment."
                                        }),
                                        /*#__PURE__*/ _jsx(Button, {
                                            href: "/fees",
                                            variant: "text",
                                            className: "mt-6",
                                            children: "View clinic fees →"
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    children: [
                                        /*#__PURE__*/ _jsx(SectionHeading, {
                                            eyebrow: "Common questions",
                                            title: `${treatment.name} FAQ`
                                        }),
                                        /*#__PURE__*/ _jsx("div", {
                                            className: "mt-8 divide-y divide-border border-y border-border",
                                            children: treatment.faq.map((item)=>/*#__PURE__*/ _jsxs("details", {
                                                    className: "group py-5",
                                                    children: [
                                                        /*#__PURE__*/ _jsxs("summary", {
                                                            className: "flex cursor-pointer list-none items-center justify-between gap-5 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                                                            children: [
                                                                /*#__PURE__*/ _jsx("span", {
                                                                    children: item.question
                                                                }),
                                                                /*#__PURE__*/ _jsx("span", {
                                                                    "aria-hidden": "true",
                                                                    className: "text-xl text-accent group-open:rotate-45",
                                                                    children: "+"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ _jsx("p", {
                                                            className: "max-w-2xl pt-4 text-sm leading-7 text-muted",
                                                            children: item.answer
                                                        })
                                                    ]
                                                }, item.question))
                                        })
                                    ]
                                })
                            ]
                        })
                    }),
                    related.length > 0 && /*#__PURE__*/ _jsx(Section, {
                        className: "border-y border-border bg-surface",
                        children: /*#__PURE__*/ _jsxs(Container, {
                            children: [
                                /*#__PURE__*/ _jsxs("div", {
                                    className: "flex items-end justify-between gap-5",
                                    children: [
                                        /*#__PURE__*/ _jsx(SectionHeading, {
                                            eyebrow: "Continue exploring",
                                            title: "Related treatments"
                                        }),
                                        /*#__PURE__*/ _jsx(Link, {
                                            className: "hidden text-sm text-accent hover:underline sm:block",
                                            href: "/treatments",
                                            children: "All treatments →"
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsx("div", {
                                    className: "mt-10 grid gap-px border border-border bg-border md:grid-cols-3",
                                    children: related.map((item)=>/*#__PURE__*/ _jsxs(Link, {
                                            className: "group bg-surface p-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
                                            href: `/treatments/${item.slug}`,
                                            children: [
                                                /*#__PURE__*/ _jsx("p", {
                                                    className: "text-xs font-semibold uppercase tracking-[.14em] text-accent",
                                                    children: item.category
                                                }),
                                                /*#__PURE__*/ _jsx("h3", {
                                                    className: "mt-3 font-display text-2xl",
                                                    children: item.name
                                                }),
                                                /*#__PURE__*/ _jsx("p", {
                                                    className: "mt-3 text-sm leading-6 text-muted",
                                                    children: item.shortDescription
                                                }),
                                                /*#__PURE__*/ _jsx("span", {
                                                    className: "mt-6 inline-block text-sm text-accent group-hover:underline",
                                                    children: "View treatment →"
                                                })
                                            ]
                                        }, item.slug))
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
                                            children: "Your next step"
                                        }),
                                        /*#__PURE__*/ _jsx("h2", {
                                            className: "mt-4 max-w-2xl font-display text-5xl leading-tight",
                                            children: treatment.bookingTitle
                                        }),
                                        /*#__PURE__*/ _jsx("p", {
                                            className: "mt-5 max-w-xl text-lg leading-8 text-white/75",
                                            children: "Request an appointment with Aurelia. The right consultation and next steps will be confirmed by the clinic team."
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    className: "flex flex-wrap gap-3",
                                    children: [
                                        /*#__PURE__*/ _jsx(Button, {
                                            href: `/book?treatment=${treatment.slug}`,
                                            children: treatment.bookingLabel
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
