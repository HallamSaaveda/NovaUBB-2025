import { EntitySchema } from "typeorm"

const ProyectoTitulo = new EntitySchema({
  name: "ProyectoTitulo",
  tableName: "proyectos_titulo",
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
    estudiante1: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    estudiante2: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    nivelAcademico: {
      type: "enum",
      enum: ["pregrado", "postgrado", "magister"],
      default: "pregrado",
      nullable: false,
    },
    profesorGuia: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    profesorCoGuia: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    carrera: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    anio: {
      type: "int",
      nullable: false,
    },
    semestre: {
      type: "enum",
      enum: ["1", "2"],
      nullable: false,
    },
    resumen: {
      type: "text",
      nullable: false,
    },
    palabrasClave: {
      type: "varchar",
      length: 500,
      nullable: true,
    },
    // Campos de archivo integrados directamente
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

export default ProyectoTitulo
