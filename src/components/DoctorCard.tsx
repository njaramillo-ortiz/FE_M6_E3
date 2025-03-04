import React from "react";

const images = import.meta.glob("/src/assets/img/*", { eager: true });

interface Doctor {
  nombre: string;
  imagen: string;
  especialidad: string;
  resumen: string;
  años_experiencia: number;
}

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const imagePath = images[`/src/assets/img/${doctor.imagen}`] as { default: string } | undefined;

  return (
    <div className="card mt-4">
      <img
        src={imagePath ? imagePath.default : "/assets/img/placeholder.jpg"} 
        alt={`Foto de ${doctor.nombre}`}
        className="card-img-top img-fluid"
      />
      <div className="card-body">
        <h2 className="card-title">{doctor.nombre}</h2>
        <div className="card-info">
          <h5 style={{ color: "#13628f" }}>
            <strong>Especialidad:</strong> {doctor.especialidad}
          </h5>
          <p>
            <strong>Resumen:</strong> {doctor.resumen}
          </p>
          <p>
            <strong>Años de experiencia:</strong> {doctor.años_experiencia}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
