"use client";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
    const { data: session, status: sessionStatus, update } = useSession();
}
