import { EntitySchema } from "typeorm"

const ArchivoPersonal = new EntitySchema({
  name: "ArchivoPersonal",
  tableName: "archivos_personales",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false, // Nombre único generado
    },
    nombreOriginal: {
      type: "varchar",
      length: 255,
      nullable: false, // Nombre original del archivo
    },
    ruta: {
      type: "varchar",
      length: 500,
      nullable: false,
    },
    tamaño: {
      type: "int",
      nullable: false,
    },
    tipo: {
      type: "varchar",
      length: 100,
      nullable: false, // MIME type
    },
    descripcion: {
      type: "text",
      nullable: true,
    },
    // ✅ Campos para organización personal
    carpeta: {
      type: "varchar",
      length: 255,
      nullable: true,
      default: "General", // Carpeta virtual para organización
    },
    tags: {
      type: "varchar",
      length: 500,
      nullable: true, // Tags separados por comas
    },
    esFavorito: {
      type: "boolean",
      default: false,
    },
    profesorId: {
      type: "int",
      nullable: false, // Solo profesores pueden tener archivos personales
    },
    createAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    updateAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    profesor: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "profesorId" },
    },
  },
})

export default ArchivoPersonal
