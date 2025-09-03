"use client"
import { use } from "react";

export default function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="text-center p-6">
      <h1 className="text-2xl font-bold">Driver Details</h1>
      <p>👤 Driver ID: {id}</p>
      <p>🚗 Vehicle: {id === "1" ? "Toyota Corolla" : "Honda Civic"}</p>
      <p>📄 License: {id === "1" ? "ABC-1234" : "XYZ-5678"}</p>
    </div>
  );
}
