"use strict";
import User from "../models/user.model.js";
import { AppDataSource } from "../config/configDB.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function createUsers() {
    try {
        const userRepository = AppDataSource.getRepository(User);

        const count = await userRepository.count();
        if (count > 0) return;

        await Promise.all([
            userRepository.save(
                userRepository.create({
                    name: "superuser",
                    rut: "45.678.912-2",
                    email: "su.user@gmail.cl",
                    password: await encryptPassword("suser2024"),
                    role: "admin"
                })
            ),
        ]);
        console.log("Users created successfully.");
    } catch (error) {
        console.error("An error occurred while creating the users:", error);
    }
};

export { createUsers }; //? Export the createUsers function.