import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "Chand Jewelry - Admin Panel",
    description: "Chand Jewelry Admin Management Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
