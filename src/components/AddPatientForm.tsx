import React, { useState } from "react";
import { Patient } from "../types/types";

type AddPatientFormProps = {
  onAdd: (patient: Patient) => void;
  onCancel: () => void;
};

export const AddPatientForm = ({ onAdd, onCancel }: AddPatientFormProps) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [riskLevel, setRiskLevel] = useState<"Low" | "Medium" | "High">("Low");

  const handleSubmit = () => {
    if (!name || !age) return;

    onAdd({
      id: crypto.randomUUID(),
      name,
      age: Number(age),
      riskLevel,
    });

    setName("");
    setAge("");
    setRiskLevel("Low");
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6 max-w-md">
      <h2 className="font-semibold mb-3">Add Patient</h2>

      <input
        placeholder="Name"
        className="border p-2 w-full mb-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Age"
        type="number"
        className="border p-2 w-full mb-2"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      <select
        className="border p-2 w-full mb-3"
        value={riskLevel}
        onChange={(e) => setRiskLevel(e.target.value as any)}
      >
        <option value="Low">Low Risk</option>
        <option value="Medium">Medium Risk</option>
        <option value="High">High Risk</option>
      </select>

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};