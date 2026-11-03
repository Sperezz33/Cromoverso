import { useEffect, useState } from "react";
import { useTextos } from "./hooks/useTextos.js";
import "./App.css";
import Navbar from "./components/Navbar";
import ContadorClics from "./components/ContadorClics";
import Cronometro from "./components/Cronometro";
import RecordarNombre from "./components/RecordarNombre";
import PersonajeApi from "./components/PersonajeApi";
import NavegadorPersonajes from "./components/NavegadorPersonajes";

function leerSeccion() {
  return window.location.hash.slice(1) || "inicio";
}

function App() {
  // Idioma por defecto español
  const [idioma, setIdioma] = useState("es");
  const [activo, setActivo] = useState(leerSeccion);
  const [consulta, setConsulta] = useState("");
  const [textoGrande, setTextoGrande] = useState(false);
  const datos = useTextos(idioma);

  const titulo =
    activo === "favoritos"
      ? datos.textos?.navbar.botones.favoritos
      : datos.textos?.navbar.enlaces[activo];

  // Sincroniza el estado del componente con el hash de la URL
  useEffect(() => {
    function actualizar() {
      setActivo(leerSeccion());
      setConsulta("");
    }
    window.addEventListener("hashchange", actualizar);
    return () => window.removeEventListener("hashchange", actualizar);
  }, []);

  // Actualiza el atributo lang del documento cuando cambia el idioma
  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  useEffect(() => {
    document.documentElement.style.fontSize = textoGrande ? "112%" : "";
    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [textoGrande]);

  function buscar(valor) {
    setConsulta(valor);
    setActivo("heroes");
    // window.history da acceso al historial de la pestaña
    window.history.replaceState(null, "", "#heroes");
  }

  return (
    
    <>

    <main className="pagina">
      <header className="pagina-encabezado">
        <h1>taquilla</h1>
            <p>crea tu cuenta o ingresa para comprar tus entradas</p>

      </header>
    <div className="pagina-formulario"></div>

      </main>

    </>
  );
}

/*
    <div className="sitio">
      <Navbar
        {...datos}
        idioma={idioma}
        cambiarIdioma={setIdioma}
        activo={activo}
        onBuscar={buscar}
        textoGrande={textoGrande}
        alternarTexto={() => setTextoGrande((valor) => !valor)}
      />

      <main className="contenedor">
        {titulo && <p className="seccion-activa">{titulo}</p>}
        {consulta && <p className="seccion-activa">Búsqueda: {consulta}</p>}

        <h1>Taller de useEffect</h1>

        <div className="taller">
          <section>
            <h2>1. Contador de clics</h2>
            <ContadorClics />
          </section>

          <section>
            <h2>2. Cronómetro</h2>
            <Cronometro />
          </section>

          <section>
            <h2>3. Recordar nombre</h2>
            <RecordarNombre />
          </section>

          <section>
            <h2>4. Personaje de la API</h2>
            <PersonajeApi />
          </section>

          <section>
            <h2>5. Navegador de personajes</h2>
            <NavegadorPersonajes />
          </section>
        </div>
      </main>
    </div> 
  );
}
*/
export default App;
