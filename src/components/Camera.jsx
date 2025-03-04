import { useRef, useState } from "react";

const Camera = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null); // Imagen en Base64
  const [location, setLocation] = useState(null); // Coordenadas

  // Iniciar la cámara
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (error) {
      console.error("Error al acceder a la cámara:", error);
    }
  };

  // Detener la cámara
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Obtener ubicación
  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
          setLocation("No disponible");
        }
      );
    } else {
      setLocation("Geolocalización no soportada");
    }
  };

  // Capturar foto y obtener coordenadas
  const takePhoto = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (videoRef.current) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);
      const imageUrl = canvas.toDataURL("image/png"); // Convierte a Base64
      setPhoto(imageUrl); // Guarda la imagen en el estado
      stopCamera();
      getLocation(); // Obtener la ubicación al tomar la foto
    }
  };

  return (
    <div>
      <h2>Uso periférico Cámara y Geolocalización</h2>
      <video ref={videoRef} autoPlay playsInline style={{ width: "50%" }} />
      <br />
      <button className="btn btn-primary mx-3" onClick={startCamera}>Iniciar Cámara</button>
      <button className="btn btn-primary" onClick={takePhoto}>Tomar Foto</button>

      {photo && (
        <div>
          <h3>📍 Imágen Capturada en {location && (
        <div>
          ubicación:
          {typeof location === "string" ? (
            <p>{location}</p>
          ) : (
            <p>{location.lat}, {location.lng}</p>
          )}
        </div>
      )}</h3>
          <img src={photo} alt="Captura" style={{ width: "50%" }} />
        </div>
      )}

      
    </div>
  );
};

export default Camera;
