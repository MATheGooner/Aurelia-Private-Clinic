// @ts-nocheck
import { jsx as _jsx } from "react/jsx-runtime";
import { notFound } from "next/navigation";
import { DepartmentPage } from "@/components/department-page";
import { departmentBySlug, departmentPages } from "@/lib/department-data";
export function generateStaticParams() {
    return departmentPages.map(({ slug })=>({
            slug
        }));
}
export function generateMetadata({ params }) {
    const department = departmentBySlug[params.slug];
    return department ? {
        title: department.name,
        description: department.shortDescription
    } : {};
}
export default function ServicePage({ params }) {
    const department = departmentBySlug[params.slug];
    if (!department) notFound();
    return /*#__PURE__*/ _jsx(DepartmentPage, {
        department: department
    });
}
