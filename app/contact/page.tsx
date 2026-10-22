// @ts-nocheck
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
export const metadata = {
    title: "Frequently Asked Questions",
    description: "Answers to common questions about appointments, fees and visiting Aurelia Private Clinic."
};
const groups = [
    {
        title: "Appointments",
        items: [
            [
                "Do I need a referral?",
                "No referral is needed for most Aurelia appointments. A clinician may recommend another service after assessment."
            ],
            [
                "Can I choose my practitioner?",
                "Yes. You can request a named practitioner, subject to their working pattern and future live availability."
            ],
            [
                "Can I book a same-week appointment?",
                "The clinic is designed to offer convenient access, but availability shown in this portfolio is demonstration data only."
            ],
            [
                "Can I reschedule or cancel?",
                "In a real service, the clinic team would explain the notice policy when confirming your appointment."
            ]
        ]
    },
    {
        title: "New patients",
        items: [
            [
                "Are you accepting new patients?",
                "This fictional clinic journey supports new-patient appointment requests across all six departments."
            ],
            [
                "What should I bring?",
                "Bring any relevant correspondence, a medication list and information your clinician has asked for. Avoid sending sensitive details through demo forms."
            ],
            [
                "How early should I arrive?",
                "Allowing around ten minutes before an appointment would usually provide time to check in comfortably."
            ]
        ]
    },
    {
        title: "Fees",
        items: [
            [
                "When do I pay?",
                "Payment timing would be confirmed with the appointment. No payments are processed by this portfolio website."
            ],
            [
                "Are prices fixed?",
                "Published prices are illustrative starting points. Assessment and treatment complexity may affect the final cost."
            ],
            [
                "Do you accept card payments?",
                "Payment functionality is not implemented in this demo."
            ]
        ]
    },
    {
        title: "Dentistry",
        items: [
            [
                "Do you offer emergency dental appointments?",
                "The demo includes an emergency dental appointment pathway for pain, swelling, damage and lost restorations."
            ],
            [
                "Do you treat nervous patients?",
                "Yes. Patients can mention nervousness when requesting an appointment so the team can plan a calm, explanatory approach."
            ]
        ]
    },
    {
        title: "Clinic and care",
        items: [
            [
                "Can I see more than one department?",
                "Yes. Aurelia’s multidisciplinary model is intended to support connected care where another department may be relevant."
            ],
            [
                "How do follow-up appointments work?",
                "Your clinician will explain whether follow-up is useful and what type of appointment to request."
            ]
        ]
    }
];
export default function FAQPage() {
    return /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            /*#__PURE__*/ _jsx(SiteHeader, {}),
            /*#__PURE__*/ _jsxs("main", {
                children: [
                    /*#__PURE__*/ _jsx("section", {
                        className: "border-b border-border bg-surface",
                        children: /*#__PURE__*/ _jsxs(Container, {
                            className: "max-w-4xl py-20 sm:py-28",
                            children: [
                                /*#__PURE__*/ _jsx("p", {
                                    className: "eyebrow",
                                    children: "Patient information"
                                }),
                                /*#__PURE__*/ _jsx("h1", {
                                    className: "mt-5 font-display text-5xl leading-tight sm:text-7xl",
                                    children: "Frequently asked questions."
                                }),
                                /*#__PURE__*/ _jsx("p", {
                                    className: "mt-6 max-w-2xl text-lg leading-8 text-muted",
                                    children: "Straightforward answers about this fictional clinic experience, appointments and illustrative fees."
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ _jsx(Section, {
                        children: /*#__PURE__*/ _jsx(Container, {
                            className: "space-y-16",
                            children: groups.map((group)=>/*#__PURE__*/ _jsxs("section", {
                                    className: "grid gap-8 lg:grid-cols-[.55fr_1.45fr]",
                                    children: [
                                        /*#__PURE__*/ _jsx("h2", {
                                            className: "font-display text-3xl",
                                            children: group.title
                                        }),
                                        /*#__PURE__*/ _jsx("div", {
                                            className: "divide-y divide-border border-y border-border",
                                            children: group.items.map(([question, answer])=>/*#__PURE__*/ _jsxs("details", {
                                                    className: "group py-5",
                                                    children: [
                                                        /*#__PURE__*/ _jsxs("summary", {
                                                            className: "flex cursor-pointer list-none items-center justify-between gap-5 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                                                            children: [
                                                                /*#__PURE__*/ _jsx("span", {
                                                                    children: question
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
                                                            children: answer
                                                        })
                                                    ]
                                                }, question))
                                        })
                                    ]
                                }, group.title))
                        })
                    }),
                    /*#__PURE__*/ _jsx("section", {
                        className: "bg-[#dfeae4] py-20",
                        children: /*#__PURE__*/ _jsxs(Container, {
                            className: "flex flex-col justify-between gap-8 md:flex-row md:items-end",
                            children: [
                                /*#__PURE__*/ _jsxs("div", {
                                    children: [
                                        /*#__PURE__*/ _jsx("p", {
                                            className: "eyebrow",
                                            children: "Still have a question?"
                                        }),
                                        /*#__PURE__*/ _jsx("h2", {
                                            className: "mt-4 font-display text-5xl",
                                            children: "Speak with the clinic team."
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    className: "flex gap-3",
                                    children: [
                                        /*#__PURE__*/ _jsx(Button, {
                                            href: "/contact",
                                            children: "Contact Us"
                                        }),
                                        /*#__PURE__*/ _jsx(Button, {
                                            href: "/book",
                                            variant: "secondary",
                                            children: "Book an Appointment"
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
