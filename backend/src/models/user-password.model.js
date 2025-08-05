import { EntitySchema } from "typeorm"

// ✅ Nueva tabla para almacenar contraseñas en texto plano (solo para admin)
const UserPassword = new EntitySchema({
  name: "UserPassword",
  tableName: "user_passwords",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    userId: {
      type: "int",
      nullable: false,
      unique: true,
    },
    plainPassword: {
      type: "varchar",
      length: 50,
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
    user: {
      target: "User",
      type: "one-to-one",
      joinColumn: { name: "userId" },
    },
  },
})

export default UserPassword
