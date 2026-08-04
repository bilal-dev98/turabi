import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "Janan Fashion - Admin",
    description: "Janan Fashion - Admin",
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
