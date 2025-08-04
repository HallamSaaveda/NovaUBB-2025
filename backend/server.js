import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import express, { json, urlencoded } from "express"
import passport from "passport"
import session from "express-session"
import indexRoutes from "./src/routes/index.routes.js"
import { connectDB } from "./src/config/configDB.js"
import { cookieKey, PORT, HOST } from "./src/config/configEnv.js"
import { passportJWTSetup } from "./src/auth/passport.auth.js"
import { createUsers } from "./src/utils/initialSetup.js"
import { createSuperAdminIfNotExists } from "./src/services/auth.service.js"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function setupServer() {
  try {
    const app = express()

    app.disable("x-powered-by")

    app.use(
      cors({
        origin: true,
        credentials: true,
      }),
    )

    app.use(
      urlencoded({
        extended: true,
        limit: "1mb",
      }),
    )

    app.use(
      json({
        limit: "1mb",
      }),
    )

    app.use(cookieParser())

    app.use(morgan("dev"))

    //si no existiera la carpeta upload, la creamos.
    const uploadDir = path.join(__dirname, "src", "upload")
    fs.mkdirSync(uploadDir, { recursive: true })

    // Configurar la ruta estática para servir archivos subidos.
    app.use("/src/upload", express.static(uploadDir))

    app.use(
      session({
        secret: cookieKey,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false,
          httpOnly: true,
          sameSite: "strict",
        },
      }),
    )

    app.use(passport.initialize())

    app.use(passport.session())

    passportJWTSetup()

    app.use("/api/", indexRoutes)
    app.use("/src/upload", express.static(uploadDir))

    app.listen(PORT, () => {
      console.log(`Server running on: http://${HOST}:${PORT}/api`)
    })
  } catch (error) {
    console.log("Error starting the server -> setupServer(). Error: ", error)
  }
}

async function setupAPI() {
  try {
    await connectDB()
    await createUsers()
    await createSuperAdminIfNotExists() // Crear superadmin automáticamente
    await setupServer()
  } catch (error) {
    console.log("Error starting the API -> setupAPI(). Error: ", error)
  }
}

setupAPI()
  .then(() => console.log("=> API started successfully"))
  .catch((error) => console.log("Error starting the API: ", error))
