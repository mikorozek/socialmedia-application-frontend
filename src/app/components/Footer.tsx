"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import { LogOut } from "lucide-react"
import Link from "next/link";


export default function Footer() {
    return (
        <div className="fixed left-1/2 bottom-0 w-full transform -translate-x-1/2 max-w-4xl mx-auto py-4 flex justify-around items-center border-t bg-[rgb(20,20,20)]">
            <button className="text-white text-3xl flex flex-col items-center">
                🏠
            </button>
            <button className="text-white text-3xl rounded-full w-16 h-16 flex items-center justify-center">
                ➕
            </button>
            <Link href="/chats">
                <button className="text-white text-3xl flex rounded-full items-center">
                    💬
                </button>
            </Link>
            <Link href="/profile">
                <button className="text-white text-3xl flex rounded-full items-center">
                    👤
                </button>
            </Link>
        </div>
    );
}
