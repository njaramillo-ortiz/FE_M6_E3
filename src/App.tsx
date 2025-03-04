import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import EquipoMedico from "./components/EquipoMedico";
import Testimonios from "./components/Testimonios";
import AppNavbar from "./components/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import AppointmentForm from "./components/AppointmentForm";
import { getFromLocalStorage, saveToLocalStorage } from "./utils/localStorageUtils";

import "./App.css";
import Camera from "./components/Camera";

interface Doctor {
  nombre: string;
  especialidad: string;
}

interface AppointmentValues {
  patientName: string;
  doctor: string;
  appointmentDate: string;
}

function App() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<AppointmentValues[]>([]);

  useEffect(() => {
    fetch("public/equipo.json")
      .then((response) => response.json())
      .then((data) => setDoctors(data))
      .catch((error) => console.error("Error al cargar los doctores:", error));

    // Recuperar citas almacenadas
    const storedAppointments = getFromLocalStorage<AppointmentValues[]>("appointments") || [];
    setAppointments(storedAppointments);
  }, []);

  const handleAppointmentSubmit = (values: AppointmentValues) => {
    const updatedAppointments = [...appointments, values];
    setAppointments(updatedAppointments);
    saveToLocalStorage("appointments", updatedAppointments);
  };

  return (
    <AuthProvider>
      <Router>
        <AppNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/camera" element={<Camera />} />
          <Route path="/testimonios" element={<Testimonios />} />
          <Route
            path="/equipo-medico"
            element={
              <ProtectedRoute requiredRole="admin">
                <EquipoMedico />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citas"
            element={
              <ProtectedRoute requiredRole="admin">
                <div>
                  <ul>
                    {appointments.map((appointment, index) => (
                      <li key={index}>
                        {appointment.patientName} - {appointment.doctor} - {appointment.appointmentDate}
                      </li>
                    ))}
                  </ul>
                  <AppointmentForm doctors={doctors.map(doc => doc.nombre)} onAppointmentSubmit={handleAppointmentSubmit} />
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
