import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../assets/css/form.css";
import { openDatabase, addAppointment, getAppointments } from "../utils/indexedDbUtils";

interface AppointmentValues {
  patientName: string;
  doctor: string;
  appointmentDate: string;
}

const AppointmentForm: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentValues[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  // Cargar citas almacenadas en IndexedDB
  useEffect(() => {
    openDatabase()
      .then(() => {
        getAppointments()
          .then((appointments) => setAppointments(appointments)) // Mostrar todas las citas al cargar la página
          .catch((error) => console.error("Error al obtener citas desde IndexedDB", error));
      })
      .catch((error) => console.error("Error al abrir la base de datos", error));
  }, []);

  // Cargar doctores desde el archivo JSON
  useEffect(() => {
    fetch("public/equipo.json")
      .then((response) => response.json())
      .then((data) => setDoctors(data))
      .catch((error) => console.error("Error al cargar los datos de los doctores:", error));
  }, []);

  const validationSchema = Yup.object({
    patientName: Yup.string().required("El nombre del paciente es obligatorio"),
    doctor: Yup.string().required("Seleccionar un doctor es obligatorio"),
    appointmentDate: Yup.string().required("La fecha de la cita es obligatoria"),
  });

  // Función para agregar una nueva cita
  const submitAppointment = (values: AppointmentValues) => {
    const newAppointment: AppointmentValues = { ...values };

    addAppointment(newAppointment)
      .then(() => {
        // Obtener todas las citas después de agregar una nueva
        getAppointments()
          .then((appointments) => setAppointments(appointments)) // Actualizar todas las citas
          .catch((error) => console.error("Error al obtener citas después de agregar una nueva", error));
      })
      .catch((error) => console.error("Error al agregar cita a IndexedDB", error));
  };

  return (
    <div className="formContainer">
      {/* Formulario de agendar cita */}
      <h2 style={{ marginTop: 40, padding: 20, color: "#5f6061" }}>Agendar Cita</h2>
      <Formik
        initialValues={{
          patientName: "",
          doctor: "",
          appointmentDate: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          submitAppointment(values);
          resetForm(); // Limpiar el formulario después de enviar
        }}
      >
        {({ isSubmitting }) => (
          <Form className="appointmentForm">
            <div>
              <label className="titleLabel" htmlFor="patientName">
                Nombre del Paciente
              </label>
              <Field type="text" id="patientName" name="patientName" placeholder="Nombre completo" />
              <ErrorMessage name="patientName" component="div" className="errorMessage" />
            </div>

            <div>
              <label className="titleLabel" htmlFor="doctor">
                Seleccionar Doctor
              </label>
              <Field as="select" id="doctor" name="doctor">
                <option value="">Seleccionar doctor</option>
                {doctors.map((doc, index) => (
                  <option key={index} value={doc.nombre}>
                    {doc.nombre} ({doc.especialidad})
                  </option>
                ))}
              </Field>
              <ErrorMessage name="doctor" component="div" className="errorMessage" />
            </div>

            <div>
              <label className="titleLabel" htmlFor="appointmentDate">
                Fecha de la Cita
              </label>
              <Field type="date" id="appointmentDate" name="appointmentDate" />
              <ErrorMessage name="appointmentDate" component="div" className="errorMessage" />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Agendar"}
            </button>
          </Form>
        )}
      </Formik>
      <h3 className="mt-3">Citas Agendadas</h3>
      <ul>
        {appointments.length > 0 ? (
          appointments.map((appt, index) => (
            <li key={index}>
              {appt.patientName} - {appt.doctor} - {appt.appointmentDate}
            </li>
          ))
        ) : (
          <li>No hay citas agendadas.</li>
        )}
      </ul>
    </div>
  );
};

export default AppointmentForm;
