import { EntitySchema } from "typeorm";

const PeriodSchema = new EntitySchema({
    name: "Period",
    tableName: "periods",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        name: { 
            type: "varchar",
            length: 50,
            nullable: false,
            //unique: true,
        },
        startTime: {
            type: "time",
            nullable: true,
        },
        endTime: {
            type: "time",
            nullable: true,
        },
    },relations:{
        schedules: { // Relación con Schedule
            target: "Schedule", 
            type: "one-to-many", 
            inverseSide: "period", 
            onDelete: "CASCADE", 
        },
    }
});

export default PeriodSchema;
