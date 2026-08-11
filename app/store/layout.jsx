import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "Chand Jewelry - Store Dashboard",
    description: "Chand Jewelry Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
