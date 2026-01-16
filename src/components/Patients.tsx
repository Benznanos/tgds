import React, { useState } from "react";
import { Patient } from "../types/types";
import { AddPatientForm } from "./AddPatientForm";

type PatientsProps = {
  patients: Patient[];
  addPatient: (p: Patient) => void;
};

export const Patients = ({ patients, addPatient }: PatientsProps) => {
  const [showForm, setShowForm] = useState(false);

  const handleAddPatient = (patient: Patient) => {
    addPatient(patient);
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold">Patients</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Patient
        </button>
      </div>

      {showForm && (
        <AddPatientForm
          onAdd={handleAddPatient}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="bg-white rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Age</th>
              <th className="p-3 text-left">Risk</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  No patients yet
                </td>
              </tr>
            ) : (
              patients.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.age}</td>
                  <td className="p-3">{p.riskLevel}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};