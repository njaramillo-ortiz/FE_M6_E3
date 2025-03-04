import React from 'react';

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
  return (
    <div className="card mt-4">
      <img
        src={`src/assets/img/${doctor.imagen}`}
        alt={`Foto de ${doctor.nombre}`}
        className="card-img-top img-fluid"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/assets/img/placeholder.jpg'; 
        }}
      />
      <div className="card-body">
        <h2 className="card-title">{doctor.nombre}</h2>
        <div className="card-info">
          <h5 style={{ color: '#13628f' }}>
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