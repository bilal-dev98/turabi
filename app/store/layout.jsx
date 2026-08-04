import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "Janan Fashion - Store Dashboard",
    description: "Janan Fashion - Store Dashboard",
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
