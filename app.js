const express = require("express");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));

const usuarioPrueba = {
  nombre: "eduardo",
  hash: bcrypt.hashSync("Espe2026!", 10)
};

function pagina(mensaje = "", acceso = false) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ESPE | Laboratorio de Seguridad</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      min-height: 100vh;
      font-family: Arial, sans-serif;
      background: #edf2ee;
      color: #183329;
      display: grid;
      place-items: center;
      padding: 24px;
    }

    .tarjeta {
      width: 100%;
      max-width: 440px;
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 60px #173b2020;
    }

    .franja {
      height: 8px;
      background: linear-gradient(
        to right,
        #17683d 0%,
        #17683d 75%,
        #b52c35 75%,
        #b52c35 100%
      );
    }

    .contenido {
      padding: 36px;
    }

    .escudo {
      display: block;
      width: 210px;
      max-width: 100%;
      height: 120px;
      object-fit: contain;
      margin: 0 auto 24px;
    }

    .etiqueta {
      font-size: 11px;
      font-weight: bold;
      letter-spacing: 2px;
      color: #26734c;
      text-align: center;
    }

    h1 {
      font-size: 28px;
      margin: 12px 0;
      text-align: center;
    }

    .descripcion {
      color: #67756d;
      font-size: 14px;
      line-height: 1.6;
      text-align: center;
      margin-bottom: 28px;
    }

    label {
      display: block;
      font-size: 14px;
      font-weight: bold;
      margin: 18px 0 8px;
    }

    input {
      width: 100%;
      padding: 14px;
      border: 1px solid #ccd7cf;
      border-radius: 9px;
      font-size: 16px;
    }

    input:focus {
      outline: 2px solid #26734c;
      outline-offset: 2px;
    }

    button,
    .volver {
      display: block;
      width: 100%;
      margin-top: 24px;
      padding: 15px;
      background: #17683d;
      color: white;
      border: 0;
      border-radius: 9px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
    }

    button:hover,
    .volver:hover {
      background: #10512e;
    }

    .mensaje {
      padding: 13px;
      margin: 20px 0;
      border-radius: 8px;
      background: ${acceso ? "#e3f3e8" : "#fbeaea"};
      color: ${acceso ? "#17683d" : "#9d2630"};
      font-size: 14px;
      line-height: 1.5;
      text-align: center;
    }

    footer {
      border-top: 1px solid #e4eae6;
      margin-top: 28px;
      padding-top: 20px;
      text-align: center;
      font-size: 13px;
      line-height: 1.8;
      color: #657169;
    }

    .nota {
      display: block;
      margin-top: 8px;
      font-size: 11px;
    }

    @media (max-width: 480px) {
      .contenido {
        padding: 28px 24px;
      }
    }
  </style>
</head>

<body>
  <main class="tarjeta">
    <div class="franja"></div>

    <div class="contenido">
      <img
        class="escudo"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7hOGHCSKNz9o7WmgxxZjM3rUQm1g5aVNBXqT58cs98JUu2F_6bzVhjgQ&amp;s=10"
        alt="Universidad de las Fuerzas Armadas ESPE"
        onerror="this.style.display='none'"
      >

      <div class="etiqueta">
        SEGURIDAD DEL SOFTWARE
      </div>

      <h1>
        ${acceso ? "Acceso correcto" : "Bienvenido"}
      </h1>

      <p class="descripcion">
        Laboratorio académico de autenticación<br>
        Universidad de las Fuerzas Armadas ESPE
      </p>

      ${
        mensaje
          ? `<div class="mensaje" role="alert">${mensaje}</div>`
          : ""
      }

      ${
        acceso
          ? `
            <a class="volver" href="/">
              Volver al inicio
            </a>
          `
          : `
            <form action="/login" method="POST">
              <label for="usuario">Usuario</label>
              <input
                id="usuario"
                name="usuario"
                type="text"
                placeholder="Ingresa tu usuario"
                autocomplete="username"
                maxlength="80"
                required
              >

              <label for="password">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                autocomplete="current-password"
                maxlength="128"
                required
              >

              <button type="submit">
                Iniciar sesión
              </button>
            </form>
          `
      }

      <footer>
        <strong>Eduardo Carrera</strong><br>
        Práctica de ataques y amenazas
        <span class="nota">
          Aplicación de laboratorio.<br>
          Sin vínculo con cuentas institucionales.
        </span>
      </footer>
    </div>
  </main>
</body>
</html>
`;
}

app.get("/", (req, res) => {
  res.send(pagina());
});

app.post("/login", async (req, res, next) => {
  try {
    const { usuario, password } = req.body;

    if (
      typeof usuario !== "string" ||
      typeof password !== "string" ||
      usuario.length > 80 ||
      password.length > 128
    ) {
      return res.status(400).send(
        pagina("Datos no válidos.")
      );
    }

    const coincide = await bcrypt.compare(
      password,
      usuarioPrueba.hash
    );

    if (usuario === usuarioPrueba.nombre && coincide) {
      return res.status(200).send(
        pagina(
          "Credenciales verificadas. Bienvenido, Eduardo.",
          true
        )
      );
    }

    return res.status(401).send(
      pagina("Usuario o contraseña incorrectos.")
    );
  } catch (error) {
    next(error);
  }
});

app.listen(PORT, () => {
  console.log(
    "Laboratorio disponible en http://localhost:" + PORT
  );
});