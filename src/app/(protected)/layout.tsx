import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Header />
            <main className="relative pb-20">{children}</main> {/* Add padding for footer */}
        </>
    );
}
