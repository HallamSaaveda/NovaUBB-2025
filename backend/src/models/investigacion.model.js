import { EntitySchema } from "typeorm"

const Investigacion = new EntitySchema({
  name: "Investigacion",
  tableName: "investigaciones",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    titulo: {
      type: "varchar",
      length: 500,
      nullable: false,
    },
    autor: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    coAutor: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    anio: {
      type: "int",
      nullable: false,
    },
    descripcion: {
      type: "text",
      nullable: false,
    },
    // ✅ Campos de archivo integrados directamente
    archivoNombre: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    archivoNombreOriginal: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    archivoRuta: {
      type: "varchar",
      length: 500,
      nullable: true,
    },
    archivoTamaño: {
      type: "int",
      nullable: true,
    },
    archivoTipo: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    createdBy: {
      type: "int",
      nullable: false,
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
    creador: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "createdBy" },
    },
  },
})

export default Investigacion
