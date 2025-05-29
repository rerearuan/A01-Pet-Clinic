"use client";

import { useSession } from "next-auth/react";
import NonLoginNavbar from "@/components/NonLoginNavbar";
import ClientNavbar from "@/components/ClientNavbar";
import FrontDeskNavbar from "@/components/FrontDeskNavbar";
import DoctorNavbar from "@/components/DoctorNavbar";
import NurseNavbar from "@/components/NurseNavbar";
import { useEffect, useState } from "react";

export default function DynamicNavbar() {

  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "loading") {
      setLoading(false);
    }
  }, [status]);

  if (loading) {
    return <NonLoginNavbar />; // Atau tampilkan loading skeleton
  }

  if (!session) {
    return <NonLoginNavbar />;
  }

  switch (session.user.role) {
    case "individu":
    case "perusahaan":
      return <ClientNavbar />;
    case "front-desk":
      return <FrontDeskNavbar />;
    case "dokter-hewan":
      return <DoctorNavbar />;
    case "perawat-hewan":
      return <NurseNavbar />;
    default:
      return <NonLoginNavbar />;
  }
}