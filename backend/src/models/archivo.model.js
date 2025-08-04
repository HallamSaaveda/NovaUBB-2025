import { EntitySchema } from "typeorm"

const Archivo = new EntitySchema({
  name: "Archivo",
  tableName: "archivos",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    nombreOriginal: {
      type: "varchar",
      length: 255,
      nullable: false,
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
      nullable: false,
    },
    carpeta: {
      type: "varchar",
      length: 255,
      nullable: true,
      default: "General",
    },
    categoria: {
      type: "enum",
      enum: ["personal", "investigacion"],
      default: "personal",
    },
    esPublico: {
      type: "boolean",
      default: false, // Por defecto privado para investigaciones
    },
    descripcion: {
      type: "text",
      nullable: true,
    },
    version: {
      type: "varchar",
      length: 50,
      nullable: true,
    },
    autor: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    tags: {
      type: "varchar",
      length: 500,
      nullable: true,
    },
    usuarioId: {
      type: "int",
      nullable: false,
    },
    investigacionId: {
      type: "int",
      nullable: true,
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
    usuario: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "usuarioId" },
    },
    investigacion: {
      target: "Investigacion",
      type: "many-to-one",
      joinColumn: { name: "investigacionId" },
    },
  },
})

export default Archivo
