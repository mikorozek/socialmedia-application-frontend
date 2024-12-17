import Providers from "./providers"
import type { Metadata } from "next"
import "./globals.css"


export const metadata: Metadata = {
    title: "Social Media Application",
    description: "Welcome to social media application",
    icons: {
        icon: "/bullhorn.png"
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
    <html lang="en">
        <body>
            <Providers>
                {children}
            </Providers>
        </body>
    </html>
  );
}
