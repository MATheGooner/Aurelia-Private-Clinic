// @ts-nocheck
/* __next_internal_client_entry_do_not_use__ BookingWizard auto */ import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { departmentPages } from "@/lib/department-data";
import { practitioners } from "@/lib/practitioner-data";
import { treatments } from "@/lib/treatment-data";
const steps = [
    "Department",
    "Reason for visit",
    "Practitioner",
    "Date & time",
    "Your details",
    "Review",
    "Confirmation"
];
export function BookingWizard({ initialDepartment = "", initialTreatment = "", initialPractitioner = "", authenticatedPatient, accountSetupRequired = false }) {
    const [step, setStep] = useState(0);
    const [department, setDepartment] = useState(initialDepartment);
    const [treatment, setTreatment] = useState(initialTreatment);
    const [practitioner, setPractitioner] = useState(initialPractitioner);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [slots, setSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [availabilityError, setAvailabilityError] = useState("");
    const [bookingError, setBookingError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [confirmation, setConfirmation] = useState(null);
    const [details, setDetails] = useState({
        firstName: authenticatedPatient?.firstName ?? "",
        lastName: authenticatedPatient?.lastName ?? "",
        email: authenticatedPatient?.email ?? "",
        phone: authenticatedPatient?.phone ?? "",
        dateOfBirth: authenticatedPatient?.dateOfBirth ?? "",
        patientType: authenticatedPatient ? "EXISTING" : "NEW",
        reason: ""
    });
    const availableTreatments = useMemo(()=>treatments.filter((item)=>item.departmentSlug === department), [
        department
    ]);
    const availablePractitioners = useMemo(()=>practitioners.filter((person)=>person.departmentSlugs.includes(department) && (!treatment || person.treatmentSlugs.includes(treatment))), [
        department,
        treatment
    ]);
    const selectedDepartment = departmentPages.find((item)=>item.slug === department);
    const selectedTreatment = treatments.find((item)=>item.slug === treatment);
    const selectedPractitioner = practitioners.find((item)=>item.slug === (selectedSlot?.practitionerSlug ?? practitioner));
    const hasDetails = authenticatedPatient || Boolean(details.firstName && details.lastName && details.email && details.phone && details.dateOfBirth);
    const canContinue = [
        Boolean(department),
        true,
        true,
        Boolean(selectedSlot),
        Boolean(hasDetails) && !accountSetupRequired,
        true,
        false
    ][step];
    null;
    function chooseDepartment(value) {
        setDepartment(value);
        setTreatment("");
        setPractitioner("");
        setSelectedSlot(null);
    }
    function chooseTreatment(value) {
        setTreatment(value);
        setPractitioner("");
        setSelectedSlot(null);
    }
    function choosePractitioner(value) {
        setPractitioner(value);
        setSelectedSlot(null);
    }
    function updateDetails(field, value) {
        setDetails((current)=>({
                ...current,
                [field]: value
            }));
    }
    async function submitBooking() {
        if (!selectedSlot || submitting) return;
        setSubmitting(true);
        setBookingError("");
        try {
            const response = await fetch("/api/appointments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    department,
                    treatment: treatment || undefined,
                    practitioner: selectedSlot.practitionerSlug,
                    startsAt: selectedSlot.startsAt,
                    firstName: details.firstName,
                    lastName: details.lastName,
                    email: details.email,
                    phone: details.phone,
                    dateOfBirth: details.dateOfBirth,
                    patientType: details.patientType,
                    reason: details.reason
                })
            });
            const body = await response.json();
            if (!response.ok) {
                if (response.status === 409) {
                    setSelectedSlot(null);
                    setStep(3);
                }
                throw new Error(body.error ?? "The appointment could not be requested.");
            }
            setConfirmation(body);
            setStep(6);
        } catch (error) {
            setBookingError(error instanceof Error ? error.message : "The appointment could not be requested.");
        } finally{
            setSubmitting(false);
        }
    }
    return /*#__PURE__*/ _jsxs("div", {
        className: "grid gap-10 lg:grid-cols-[14rem_1fr]",
        children: [
            /*#__PURE__*/ _jsx("nav", {
                "aria-label": "Booking steps",
                children: /*#__PURE__*/ _jsx("ol", {
                    className: "grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4 lg:grid-cols-1",
                    children: steps.map((label, index)=>/*#__PURE__*/ _jsxs("li", {
                            "aria-current": index === step ? "step" : undefined,
                            className: `bg-surface p-3 text-sm ${index === step ? "font-medium text-accent" : index < step ? "text-ink" : "text-muted"}`,
                            children: [
                                /*#__PURE__*/ _jsx("span", {
                                    className: "mr-2 text-xs",
                                    children: String(index + 1).padStart(2, "0")
                                }),
                                label
                            ]
                        }, label))
                })
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: "min-w-0",
                children: [
                    /*#__PURE__*/ _jsxs("p", {
                        className: "eyebrow",
                        children: [
                            "Step ",
                            step + 1,
                            " of ",
                            steps.length
                        ]
                    }),
                    /*#__PURE__*/ _jsx("h2", {
                        className: "mt-3 font-display text-4xl",
                        children: steps[step]
                    }),
                    bookingError ? /*#__PURE__*/ _jsx("p", {
                        role: "alert",
                        className: "mt-5 border-l-2 border-red-700 bg-red-50 px-4 py-3 text-sm text-red-900",
                        children: bookingError
                    }) : null,
                    /*#__PURE__*/ _jsxs("div", {
                        className: "mt-8 min-h-[22rem]",
                        children: [
                            step === 0 && /*#__PURE__*/ _jsx(ChoiceGrid, {
                                children: departmentPages.map((item)=>/*#__PURE__*/ _jsx(Choice, {
                                        selected: department === item.slug,
                                        onClick: ()=>chooseDepartment(item.slug),
                                        title: item.name,
                                        description: item.shortDescription
                                    }, item.slug))
                            }),
                            step === 1 && /*#__PURE__*/ _jsxs(ChoiceGrid, {
                                children: [
                                    /*#__PURE__*/ _jsx(Choice, {
                                        selected: !treatment,
                                        onClick: ()=>chooseTreatment(""),
                                        title: "I’m not sure / General appointment",
                                        description: "Choose from practitioners working in this department."
                                    }),
                                    availableTreatments.map((item)=>/*#__PURE__*/ _jsx(Choice, {
                                            selected: treatment === item.slug,
                                            onClick: ()=>chooseTreatment(item.slug),
                                            title: item.name,
                                            description: item.shortDescription
                                        }, item.slug))
                                ]
                            }),
                            step === 2 && /*#__PURE__*/ _jsxs(ChoiceGrid, {
                                children: [
                                    /*#__PURE__*/ _jsx(Choice, {
                                        selected: !practitioner,
                                        onClick: ()=>choosePractitioner(""),
                                        title: "No preference — earliest available",
                                        description: "We’ll find the earliest suitable appointment and retain the practitioner for your request."
                                    }),
                                    availablePractitioners.map((person)=>/*#__PURE__*/ _jsx(Choice, {
                                            selected: practitioner === person.slug,
                                            onClick: ()=>choosePractitioner(person.slug),
                                            title: person.name,
                                            description: `${person.role} · ${person.interests}`
                                        }, person.slug))
                                ]
                            }),
                            step === 3 && /*#__PURE__*/ _jsx(AvailabilityChoices, {
                                loading: loadingSlots,
                                error: availabilityError,
                                slots: slots,
                                selected: selectedSlot,
                                onSelect: setSelectedSlot
                            }),
                            step === 4 && (accountSetupRequired ? /*#__PURE__*/ _jsxs("div", {
                                role: "alert",
                                className: "border border-border bg-surface p-6",
                                children: [
                                    /*#__PURE__*/ _jsx("h3", {
                                        className: "font-display text-2xl",
                                        children: "Patient profile setup required"
                                    }),
                                    /*#__PURE__*/ _jsx("p", {
                                        className: "mt-3 text-sm leading-6 text-muted",
                                        children: "Your signed-in account is not linked to a patient profile. Please contact the clinic before booking."
                                    })
                                ]
                            }) : /*#__PURE__*/ _jsx(PatientFields, {
                                details: details,
                                onChange: updateDetails,
                                locked: Boolean(authenticatedPatient)
                            })),
                            step === 5 && /*#__PURE__*/ _jsx("dl", {
                                className: "divide-y divide-border border-y border-border",
                                children: [
                                    [
                                        "Department",
                                        selectedDepartment?.name ?? "Not selected"
                                    ],
                                    [
                                        "Treatment / reason",
                                        selectedTreatment?.name ?? "General appointment"
                                    ],
                                    [
                                        "Practitioner",
                                        selectedPractitioner?.name ?? selectedSlot?.practitionerName ?? "Not selected"
                                    ],
                                    [
                                        "Appointment",
                                        selectedSlot ? formatSlot(selectedSlot) : "Not selected"
                                    ],
                                    [
                                        "Patient",
                                        `${details.firstName} ${details.lastName}`.trim() || "Signed-in patient"
                                    ],
                                    [
                                        "Status",
                                        "Requested — awaiting clinic confirmation"
                                    ]
                                ].map(([term, value])=>/*#__PURE__*/ _jsxs("div", {
                                        className: "grid gap-2 py-4 sm:grid-cols-[12rem_1fr]",
                                        children: [
                                            /*#__PURE__*/ _jsx("dt", {
                                                className: "text-sm text-muted",
                                                children: term
                                            }),
                                            /*#__PURE__*/ _jsx("dd", {
                                                className: "text-sm font-medium",
                                                children: value
                                            })
                                        ]
                                    }, term))
                            }),
                            step === 6 && confirmation && /*#__PURE__*/ _jsxs("div", {
                                className: "border border-accent bg-accent-soft p-7 sm:p-9",
                                children: [
                                    /*#__PURE__*/ _jsx("p", {
                                        className: "eyebrow",
                                        children: "Request received"
                                    }),
                                    /*#__PURE__*/ _jsxs("h3", {
                                        className: "mt-3 font-display text-3xl",
                                        children: [
                                            "Appointment ",
                                            confirmation.reference
                                        ]
                                    }),
                                    /*#__PURE__*/ _jsx("p", {
                                        className: "mt-4 text-sm leading-6 text-muted",
                                        children: "Your request has been saved. The clinic has not sent an email or taken payment."
                                    }),
                                    /*#__PURE__*/ _jsxs("dl", {
                                        className: "mt-6 grid gap-3 text-sm",
                                        children: [
                                            /*#__PURE__*/ _jsxs("div", {
                                                children: [
                                                    /*#__PURE__*/ _jsx("dt", {
                                                        className: "text-muted",
                                                        children: "Care"
                                                    }),
                                                    /*#__PURE__*/ _jsxs("dd", {
                                                        className: "font-medium",
                                                        children: [
                                                            confirmation.department,
                                                            " \xb7 ",
                                                            confirmation.treatment
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ _jsxs("div", {
                                                children: [
                                                    /*#__PURE__*/ _jsx("dt", {
                                                        className: "text-muted",
                                                        children: "Practitioner"
                                                    }),
                                                    /*#__PURE__*/ _jsx("dd", {
                                                        className: "font-medium",
                                                        children: confirmation.practitioner
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ _jsxs("div", {
                                                children: [
                                                    /*#__PURE__*/ _jsx("dt", {
                                                        className: "text-muted",
                                                        children: "Date and time"
                                                    }),
                                                    /*#__PURE__*/ _jsx("dd", {
                                                        className: "font-medium",
                                                        children: formatDateTime(confirmation.startsAt)
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ _jsxs("div", {
                                                children: [
                                                    /*#__PURE__*/ _jsx("dt", {
                                                        className: "text-muted",
                                                        children: "Status"
                                                    }),
                                                    /*#__PURE__*/ _jsx("dd", {
                                                        className: "font-medium",
                                                        children: confirmation.status
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                    step < 6 ? /*#__PURE__*/ _jsxs("div", {
                        className: "mt-8 flex flex-wrap justify-between gap-3 border-t border-border pt-6",
                        children: [
                            /*#__PURE__*/ _jsx("button", {
                                type: "button",
                                disabled: step === 0 || submitting,
                                onClick: ()=>{
                                    setStep((value)=>Math.max(0, value - 1));
                                    setBookingError("");
                                },
                                className: "min-h-12 border border-border px-5 text-sm disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                                children: "Back"
                            }),
                            step < 5 ? /*#__PURE__*/ _jsx("button", {
                                type: "button",
                                disabled: !canContinue || submitting,
                                onClick: ()=>setStep((value)=>Math.min(5, value + 1)),
                                className: "min-h-12 bg-accent px-5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                                children: "Continue"
                            }) : /*#__PURE__*/ _jsx("button", {
                                type: "button",
                