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
import { departmentPractitioners } from "@/lib/department-data";
import { practitioners } from "@/lib/site-data";
export function DepartmentPage({ department }) {
    const featuredPractitioners = departmentPractitioners(department, practitioners);
    const isDentistry = department.slug === "dentistry";
    return /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            /*#__PURE__*/ _jsx(SiteHeader, {}),
            /*#__PURE__*/ _jsxs("main", {
                children: [
                    /*#__PURE__*/ _jsxs("section", {
                        className: "relative min-h-[34rem] overflow-hidden sm:min-h-[42rem]",
                        children: [
                            /*#__PURE__*/ _jsx(Image, {
                                src: department.heroImage,
                                alt: `${department.name} at Aurelia Private Clinic`,
                                fill: true,
                                priority: true,
                                className: "object-cover",
                                sizes: "100vw"
                            }),
                            /*#__PURE__*/ _jsx("div", {
                                className: "absolute inset-0 bg-gradient-to-r from-[#17231f]/85 via-[#17231f]/55 to-transparent"
                            }),
                            /*#__PURE__*/ _jsx(Container, {
                                className: "relative flex min-h-[34rem] items-end py-16 sm:min-h-[42rem] sm:py-24",
                                children: /*#__PURE__*/ _jsxs("div", {
                                    className: "max-w-3xl text-white",
                                    children: [
                                        /*#__PURE__*/ _jsx("p", {
                                            className: "eyebrow text-white/75",
                                            children: department.eyebrow
                                        }),
                                        /*#__PURE__*/ _jsx("h1", {
                                            className: "mt-5 font-display text-5xl leading-[1.05] sm:text-7xl",
                                            children: department.heroTitle
                                        }),
                                        /*#__PURE__*/ _jsx("p", {
                                            className: "mt-6 max-w-2xl text-lg leading-8 text-white/80",
                                            children: department.heroSupportingText
                                        }),
                                        /*#__PURE__*/ _jsxs("div", {
                                            className: "mt-8 flex flex-wrap gap-3",
                                            children: [
                                                /*#__PURE__*/ _jsx(Button, {
                                                    href: "/book",
                                                    children: department.bookingLabel
                                                }),
                                                /*#__PURE__*/ _jsx(Button, {
                                                    href: "#treatments",
                                                    variant: "secondary",
                                                    className: "border-white/70 text-white hover:border-white hover:text-white",
                                                    children: "Explore Treatments"
                                                })
                                            ]
                                        })
                                    ]
                                })
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsx(Section, {
                        className: "bg-surface",
                        children: /*#__PURE__*/ _jsxs(Container, {
                            className: "grid gap-10 lg:grid-cols-[.72fr_1.28fr]",
                            children: [
                                /*#__PURE__*/ _jsx("p", {
                                    className: "eyebrow",
                                    children: "How we can help"
                                }),
                                /*#__PURE__*/ _jsx("p", {
                                    className: "font-display text-3xl leading-relaxed text-ink sm:text-4xl",
                                    children: department.introduction
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ _jsx(Section, {
                        children: /*#__PURE__*/ _jsxs(Container, {
                            children: [
                                /*#__PURE__*/ _jsx(SectionHeading, {
                                    eyebrow: "Care shaped around you",
                                    title: isDentistry ? "Four areas of dental care" : `${department.name}, clearly organised`,
                                    intro: "A considered range of care, explained in straightforward language."
                                }),
                                /*#__PURE__*/ _jsx("div", {
                                    className: "mt-12 divide-y divide-border border-y border-border",
                                    children: department.categories.map((category, index)=>/*#__PURE__*/ _jsxs("article", {
                                            className: "grid gap-6 py-8 sm:grid-cols-[4rem_1fr_1fr] sm:py-10",
                                            children: [
                                                /*#__PURE__*/ _jsxs("span", {
                                                    className: "font-display text-2xl text-accent",
                                                    children: [
                                                        "0",
                                                        index + 1
                                                    ]
                                                }),
                                                /*#__PURE__*/ _jsxs("div", {
                                                    children: [
                                                        /*#__PURE__*/ _jsx("h3", {
                                                            className: "font-display text-3xl",
                                                            children: category.title
                                                        }),
                                                        /*#__PURE__*/ _jsx("p", {
                                                            className: "mt-3 max-w-md text-sm leading-6 text-muted",
                                                            children: category.description
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ _jsx("ul", {
                                                    className: "grid content-start gap-2 text-sm text-muted sm:grid-cols-2",
                                                    children: category.services.map((service)=>/*#__PURE__*/ _jsx("li", {
                                                            className: "border-b border-border py-2",
                                                            children: service
                                                        }, service))
                                                })
                                            ]
                                        }, category.title))
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ _jsx(Section, {
                        className: "bg-accent-soft",
                        children: /*#__PURE__*/ _jsxs(Container, {
                            children: [
                                /*#__PURE__*/ _jsx(SectionHeading, {
                                    eyebrow: "Start with what you are feeling",
                                    title: "Common reasons patients come to us"
                                }),
                                /*#__PURE__*/ _jsx("div", {
                                    className: "mt-10 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4",
                                    children: department.concerns.map((concern)=>/*#__PURE__*/ _jsxs(Link, {
                                            className: "group bg-surface p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
                                            href: concern.href,
                                            children: [
                                                /*#__PURE__*/ _jsx("p", {
                                                    className: "font-display text-xl",
                                                    children: concern.label
                                                }),
                                                /*#__PURE__*/ _jsxs("p", {
                                                    className: "mt-4 text-sm text-accent group-hover:underline",
                                                    children: [
                                                        concern.action,
                                                        " →"
                                                    ]
                                                })
                                            ]
                                        }, concern.label))
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ _jsx(Section, {
                        id: "treatments",
                        children: /*#__PURE__*/ _jsxs(Container, {
                            children: [
                                /*#__PURE__*/ _jsx(SectionHeading, {
                                    eyebrow: "Selected care",
                                    title: "Featured treatments",
                                    intro: "A concise starting point. Your clinician will confirm which option is appropriate after an assessment."
                                }),
                                /*#__PURE__*/ _jsx("div", {
                                    className: "mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3",
                                    children: department.featuredTreatments.map((treatment)=>/*#__PURE__*/ _jsxs("article", {
                                            className: "flex min-h-64 flex-col justify-between border border-border bg-surface p-7",
                                            children: [
                                                /*#__PURE__*/ _jsxs("div", {
                                                    children: [
                                                        /*#__PURE__*/ _jsx("h3", {
                                                            className: "font-display text-2xl",
                                                            children: treatment.name
                                                        }),
                                                        /*#__PURE__*/ _jsx("p", {
                                                            className: "mt-3 text-sm leading-6 text-muted",
                                                            children: treatment.description
                                                        }),
                                                        treatment.price && /*#__PURE__*/ _jsx("p", {
                                                            className: "mt-4 text-sm font-medium text-accent",
                                                            children: treatment.price
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ _jsx(Link, {
                                                    className: "mt-8 text-sm text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                                                    href: `/treatments/${treatment.slug}`,
                                                    children: "View treatment →"
                                                })
                                            ]
                                        }, treatment.slug))
                                })
                            ]
                        })
                    }),
                    featuredPractitioners.length > 0 && /*#__PURE__*/ _jsx(Section, {
                        className: "bg-surface",
                        children: /*#__PURE__*/ _jsxs(Container, {
                            children: [
                                /*#__PURE__*/ _jsxs("div", {
                                    className: "flex flex-col justify-between gap-5 sm:flex-row sm:items-end",
                                    children: [
                                        /*#__PURE__*/ _jsx(SectionHeading, {
                                            eyebrow: "Your clinical team",
                                            title: `Meet our ${department.name.toLowerCase()} practitioners`
                                        }),
                                        /*#__PURE__*/ _jsx(Button, {
                                            href: "/practitioners",
                                            variant: "text",
                                            children: "Meet all practitioners →"
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsx("div", {
                                    className: `mt-12 grid gap-7 ${featuredPractitioners.length > 1 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"}`,
                                    children: featuredPractitioners.map((person)=>/*#__PURE__*/ _jsxs("article", {
                                            children: [
                                                /*#__PURE__*/ _jsx("div", {
                                                    className: "relative aspect-[4/5] overflow-hidden bg-accent-soft",
                                                    children: /*#__PURE__*/ _jsx(Image, {
                                                        src: person.image,
                                                        alt: person.name,
                                                        fill: true,
                                                        className: "object-cover",
                                                        sizes: "(min-width: 768px) 33vw, 100vw"
                                                    })
                                                }),
                                                /*#__PURE__*/ _jsx("p", {
                                                    className: "mt-5 text-xs font-semibold uppercase tracking-[.14em] text-accent",
                                                    children: person.department
                                                }),
                                                /*#__PURE__*/ _jsx("h3", {
                                                    className: "mt-2 font-display text-3xl",
                                                    children: person.name
                                                }),
                                                /*#__PURE__*/ _jsxs("p", {
                                                    className: "mt-1 text-sm text-muted",
                                                    children: [
                                                        person.role,
                                                        " \xb7 ",
                                                        person.interests
                                                    ]
                                                }),
                                                /*#__PURE__*/ _jsx(Link, {
                                                    href: `/practitioners/${person.slug}`,
                                                    className: "mt-4 inline-block text-sm text-accent underline-offset-4 hover:underline",
                                                    children: "View profile →"
                                                })
                                            ]
                                        }, person.slug))
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ _jsx(Section, {
                        children: /*#__PURE__*/ _jsxs(Container, {
                            children: [
                                /*#__PURE__*/ _jsx(SectionHeading, {
                                    eyebrow: "Your visit",
                                    title: isDentistry ? "Your dental care journey" : "What to expect"
                                }),
                                /*#__PURE__*/ _jsx("ol", {
                                    className: "mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4",
                                    children: department.journey.map((step, index)=>/*#__PURE__*/ _jsxs("li", {
                                            className: "border-t border-accent pt-5",
                                            children: [
                                                /*#__PURE__*/ _jsxs("span", {
                                                    className: "text-xs font-semibold tracking-widest text-accent",
                                                    children: [
                                                        "0",
                                                        index + 1
                                                    ]
                                                }),
                                                /*#__PURE__*/ _jsx("p", {
                                                    className: "mt-4 font-display text-2xl",
                                                    children: step
                                                })
                                            ]
                                        }, step))
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ _jsx(Section, {
                        className: "bg-surface",
                        children: /*#__PURE__*/ _jsxs(Container, {
                            className: "grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center",
                            children: [
                                /*#__PURE__*/ _jsx("div", {
                                    className: "relative aspect-[4/3] overflow-hidden",
                                    children: /*#__PURE__*/ _jsx(Image, {
                                        src: department.experienceImage,
                                        alt: `Calm, modern ${department.name.toLowerCase()} environment`,
                                        fill: true,
                                        className: "object-cover",
                                        sizes: "(min-width: 1024px) 55vw, 100vw"
                                    })
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    children: [
                                        /*#__PURE__*/ _jsx(SectionHeading, {
                                            eyebrow: "A calm clinical environment",
                                            title: "Designed around privacy and comfort.",
                                            intro: "Contemporary treatment spaces, a welcoming team and time for questions before any next step is agreed."
                                        }),
                                        /*#__PURE__*/ _jsx("div", {
                                            className: "mt-8 grid gap-5",
                                            children: department.benefits.map((benefit)=>/*#__PURE__*/ _jsxs("div", {
                                                    className: "border-t border-border pt-4",
                                                    children: [
                                                        /*#__PURE__*/ _jsx("h3", {
                                                            className: "font-display text-xl",
                                                            children: benefit.title
                                                        }),
                                                        /*#__PURE__*/ _jsx("p", {
                                                            className: "mt-2 text-sm leading-6 text-muted",
                                                            children: benefit.description
                                                        })
                                                    ]
                                                }, benefit.title))
                                        })
                                    ]
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ _jsx(Section, {
                        children: /*#__PURE__*/ _jsxs(Container, {
                            className: "grid gap-12 lg:grid-cols-[1fr_.8fr]",
                            children: [
                                /*#__PURE__*/ _jsx(SectionHeading, {
                                    eyebrow: "Indicative portfolio-demo pricing",
                                    title: `${department.name} fees`,
                                    intro: "These prices are illustrative only. Your clinician will confirm the appropriate appointment and any costs before treatment."
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    children: [
                                        /*#__PURE__*/ _jsx("div", {
                                            className: "divide-y divide-border border-y border-border",
                                            children: department.fees.map((fee)=>/*#__PURE__*/ _jsxs("div", {
                                                    className: "flex justify-between gap-5 py-5 text-sm",
                                                    children: [
                                                        /*#__PURE__*/ _jsx("span", {
                                                            children: fee.label
                                                        }),
                                                        /*#__PURE__*/ _jsx("span", {
                                                            className: "font-medium text-accent",
                                                            children: fee.price
                                                        })
                                                    ]
                                                }, fee.label))
                                        }),
                                        /*#__PURE__*/ _jsx(Button, {
                                            href: "/fees",
                                            variant: "text",
                                            className: "mt-6",
                                            children: "View all fees →"
                                        })
                                    ]
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ _jsx(Section, {
                        className: "bg-surface",
                        children: /*#__PURE__*/ _jsxs(Container, {
                            className: "grid gap-12 lg:grid-cols-[.7fr_1.3fr]",
                            children: [
                                /*#__PURE__*/ _jsx(SectionHeading, {
                                    eyebrow: "Before you visit",
                                    title: "Frequently asked questions"
                                }),
                                /*#__PURE__*/ _jsx("div", {
                                    className: "divide-y divide-border border-y border-border",
                                    children: department.faq.map((item)=>/*#__PURE__*/ _jsxs("details", {
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
                    }),
                    /*#__PURE__*/ _jsx("section", {
                        className: "bg-[#dfeae4] py-20 sm:py-24",
                        children: /*#__PURE__*/ _jsxs(Container, {
                            className: "flex flex-col justify-between gap-8 md:flex-row md:items-end",
                            children: [
                                /*#__PURE__*/ _jsxs("div", {
                                    children: [
                                        /*#__PURE__*/ _jsx("p", {
                                            className: "eyebrow",
                                            children: "Your next step"
                                        }),
                                        /*#__PURE__*/ _jsx("h2", {
                                            className: "mt-4 max-w-2xl font-display text-5xl leading-tight",
                                            children: department.finalTitle
                                        }),
                                        /*#__PURE__*/ _jsx("p", {
                                            className: "mt-5 max-w-xl text-lg leading-8 text-muted",
                                            children: department.finalCopy
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    className: "flex flex-wrap gap-3",
                                    children: [
                                        /*#__PURE__*/ _jsx(Button, {
                                            href: "/book",
                                            children: department.bookingLabel
                                        }),
                                        /*#__PURE__*/ _jsx(Button, {
                                            href: "/contact",
                                            variant: "secondary",
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
