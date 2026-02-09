import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
    title: "UniMate | College Mentorship Platform",
    description:
        "Skip the guesswork. Connect with verified college students for 1:1 video sessions to get honest insights about your dream campus and major.",
};

import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning className="scroll-smooth">
                <head>
                    {/* eslint-disable-next-line @next/next/no-page-custom-font */}
                    <link
                        href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
                        rel="stylesheet"
                    />
                    <link
                        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
                        rel="stylesheet"
                    />
                </head>
                <body className="font-sans antialiased transition-colors duration-300">
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem={false}
                        disableTransitionOnChange
                    >
                        {children}
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
