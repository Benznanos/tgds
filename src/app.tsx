import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { Patients } from "./components/Patients";
import { AiInsight } from "./components/AiInsight";
import { Patient } from "./types/types";

export default function App() {
  const [patients, setPatients] = useState<Patient[]>([]);

  const addPatient = (patient: Patient) => {
    setPatients((prev) => [...prev, patient]);
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-64 flex-1 min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Dashboard totalPatients={patients.length} />} />
          <Route
            path="/patients"
            element={<Patients patients={patients} addPatient={addPatient} />}
          />
          <Route path="/ai" element={<AiInsight patients={patients} />} />
        </Routes>
      </div>
    </div>
  );
}