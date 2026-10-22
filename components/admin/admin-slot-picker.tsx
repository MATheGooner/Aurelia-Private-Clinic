// @ts-nocheck
/* __next_internal_client_entry_do_not_use__ AdminSlotPicker auto */ import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { departmentPages } from "@/lib/department-data";
import { practitioners } from "@/lib/practitioner-data";
import { treatments } from "@/lib/treatment-data";
export function AdminSlotPicker(param) {
    let { action, patientId, appointmentId, initialDepartment = "", initialTreatment = "" } = param;
    const [department, setDepartment] = useState(initialDepartment);
    const [treatment, setTreatment] = useState(initialTreatment);
    const [practitioner, setPractitioner] = useState("");
    const [date, setDate] = useState(today());
    const [slots, setSlots] = useState([]);
    const [selected, setSelected] = useState();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const availableTreatments = useMemo(()=>treatments.filter((item)=>item.departmentSlug === department), [
        department
    ]);
    const availablePractitioners = useMemo(()=>practitioners.filter((item)=>item.departmentSlugs.includes(department) && (!treatment || item.treatmentSlugs.includes(treatment))), [
        department,
        treatment
    ]);
    useEffect(()=>{
        if (!department || !date) {
            setSlots([]);
            return;
        }
        const controller = new AbortController();
        const query = new URLSearchParams({
            department,
            from: date,
            to: date
        });
        if (treatment) query.set("treatment", treatment);
        if (practitioner) query.set("practitioner", practitioner);
        setLoading(true);
        setError("");
        setSelected(undefined);
        fetch("/api/availability?".concat(query), {
            signal: controller.signal,
            cache: "no-store"
        }).then(async (response)=>{
            const body = await response.json();
            if (!response.ok) throw new Error(body.error);
            var _body_slots;
            setSlots((_body_slots = body.slots) !== null && _body_slots !== void 0 ? _body_slots : []);
        }).catch((reason)=>{
            if (!(reason instanceof DOMException && reason.name === "AbortError")) setError(reason instanceof Error ? reason.message : "Availability could not be loaded.");
        }).finally(()=>setLoading(false));
        return ()=>controller.abort();
    }, [
        date,
        department,
        practitioner,
        treatment
    ]);
    var _selected_practitionerSlug, _selected_startsAt;
    return /*#__PURE__*/ _jsxs("form", {
        action: action,
        className: "mt-5 border border-border bg-surface p-5",
        children: [
            /*#__PURE__*/ _jsx("input", {
                type: "hidden",
                name: "patientId",
                value: patientId
            }),
            /*#__PURE__*/ _jsx("input", {
                type: "hidden",
                name: "appointmentId",
                value: appointmentId
            }),
            /*#__PURE__*/ _jsx("input", {
                type: "hidden",
                name: "practitioner",
                value: (_selected_practitionerSlug = selected === null || selected === void 0 ? void 0 : selected.practitionerSlug) !== null && _selected_practitionerSlug !== void 0 ? _selected_practitionerSlug : ""
            }),
            /*#__PURE__*/ _jsx("input", {
                type: "hidden",
                name: "startsAt",
                value: (_selected_startsAt = selected === null || selected === void 0 ? void 0 : selected.startsAt) !== null && _selected_startsAt !== void 0 ? _selected_startsAt : ""
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: "grid gap-4 md:grid-cols-4",
                children: [
                    /*#__PURE__*/ _jsx(Field, {
                        label: "Department",
                        children: /*#__PURE__*/ _jsxs("select", {
                            required: true,
                            name: "department",
                            className: "auth-field",
                            value: department,
                            onChange: (e)=>{
                                setDepartment(e.target.value);
                                setTreatment("");
                                setPractitioner("");
                            },
                            children: [
                                /*#__PURE__*/ _jsx("option", {
                                    value: "",
                                    children: "Choose"
                                }),
                                departmentPages.map((item)=>/*#__PURE__*/ _jsx("option", {
                                        value: item.slug,
                                        children: item.name
                                    }, item.slug))
                            ]
                        })
                    }),
                    /*#__PURE__*/ _jsx(Field, {
                        label: "Treatment",
                        children: /*#__PURE__*/ _jsxs("select", {
                            name: "treatment",
                            className: "auth-field",
                            value: treatment,
                            onChange: (e)=>setTreatment(e.target.value),
                            children: [
                                /*#__PURE__*/ _jsx("option", {
                                    value: "",
                                    children: "General appointment"
                                }),
                                availableTreatments.map((item)=>/*#__PURE__*/ _jsx("option", {
                                        value: item.slug,
                                        children: item.name
                                    }, item.slug))
                            ]
                        })
                    }),
                    /*#__PURE__*/ _jsx(Field, {
                        label: "Practitioner",
                        children: /*#__PURE__*/ _jsxs("select", {
                            className: "auth-field",
                            value: practitioner,
                            onChange: (e)=>setPractitioner(e.target.value),
                            children: [
                                /*#__PURE__*/ _jsx("option", {
                                    value: "",
                                    children: "Any practitioner"
                                }),
                                availablePractitioners.map((item)=>/*#__PURE__*/ _jsx("option", {
                                        value: item.slug,
                                        children: item.name
                                    }, item.slug))
                            ]
                        })
                    }),
                    /*#__PURE__*/ _jsx(Field, {
                        label: "Date",
                        children: /*#__PURE__*/ _jsx("input", {
                            className: "auth-field",
                            type: "date",
                            min: today(),
                            value: date,
                            onChange: (e)=>setDate(e.target.value)
                        })
                    })
                ]
            }),
            /*#__PURE__*/ _jsx("label", {
                className: "mt-4 block text-sm font-medium",
                htmlFor: "booking-reason",
                children: "Reason for visit"
            }),
            /*#__PURE__*/ _jsx("textarea", {
                id: "booking-reason",
                name: "reason",
                maxLength: 500,
                className: "auth-field mt-2 min-h-20"
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: "mt-5",
                children: [
                    /*#__PURE__*/ _jsx("p", {
                        className: "text-sm font-medium",
                        children: "Available times"
                    }),
                    loading ? /*#__PURE__*/ _jsx("p", {
                        className: "mt-3 text-sm text-muted",
                        children: "Loading availability…"
                    }) : error ? /*#__PURE__*/ _jsx("p", {
                        role: "alert",
                        className: "mt-3 text-sm text-red-800",
                        children: error
                    }) : slots.length ? /*#__PURE__*/ _jsx("div", {
                        className: "mt-3 flex flex-wrap gap-2",
                        children: slots.map((slot)=>/*#__PURE__*/ _jsxs("button", {
                                type: "button",
                                onClick: ()=>setSelected(slot),
                                className: "border px-3 py-2 text-sm ".concat(selected === slot ? "border-accent bg-accent-soft" : "border-border"),
                                children: [
                                    new Intl.DateTimeFormat("en-GB", {
                                        timeZone: "Europe/London",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    }).format(new Date(slot.startsAt)),
                                    " \xb7 ",
                                    slot.practitionerName
                                ]
                            }, "".concat(slot.practitionerId, "-").concat(slot.startsAt)))
                    }) : /*#__PURE__*/ _jsx("p", {
                        className: "mt-3 text-sm text-muted",
                        children: "No available times for this date."
                    })
                ]
            }),
            /*#__PURE__*/ _jsx("button", {
                disabled: !selected,
                className: "mt-6 bg-accent px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40",
                children: appointmentId ? "Save new time" : "Create appointment"
            })
        ]
    });
}
function Field(param) {
    let { label, children } = param;
    return /*#__PURE__*/ _jsxs("label", {
        className: "text-sm font-medium",
        children: [
            label,
            /*#__PURE__*/ _jsx("span", {
                className: "mt-2 block",
                children: children
            })
        ]
    });
}
function today() {
    return new Date().toLocaleDateString("en-CA", {
        timeZone: "Europe/London"
    });
}
