import { EntitySchema } from "typeorm"

const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    rut: {
      type: "varchar",
      length: 12,
      nullable: false,
      unique: true,
    },
    email: {
      type: "varchar",
      length: 255,
      nullable: false,
      unique: true,
    },
    password: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    role: {
      type: "enum",
      // ✅ Roles consistentes
      enum: ["alumno", "profesor", "admin", "superadmin"],
      default: "alumno",
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
})

export default User
