import React, { useEffect, useState } from "react";
import DoctorCard from "./DoctorCard";

interface Doctor {
  nombre: string;
  imagen: string;
  especialidad: string;
  resumen: string;
  años_experiencia: number;
  valor_consulta: number;
  informacion_adicional: {
    horarios_disponibles: string[];
    contacto: {
      telefono: string;
      email: string;
    };
  };
}

const EquipoMedico: React.FC = () => {
  const [equipo, setEquipo] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/awakelab/fe_m6_e3/equipo.json");
        const text = await response.text(); 
        console.log("Respuesta del servidor:", text);
        const data = JSON.parse(text); 
        setEquipo(data);
      } catch (error) {
        console.error("Error al cargar los médicos:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDoctors();
  }, []);

  return (
    <div className="container" style={{ marginBottom: 40 }}>
      <h2 style={{ marginTop: 20, color: "#5f6061" }}>Equipo Médico</h2>
      {loading ? (
        <p>Cargando médicos...</p>
      ) : (
        <div className="row">
          {equipo.map((doctor, index) => (
            <div className="col-md-4" key={index}>
              <DoctorCard doctor={doctor} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EquipoMedico;
