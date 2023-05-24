const { hash } = require("bcryptjs");
const AppError = require("../utils/appError");
const sqliteConecition = require("../database/sqlite");

class UsersController {
    
    
    async create(request, response) {
        const { name, email, password } = request.body;
        
        const database = await sqliteConecition();
        const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if(checkUserExists) {
            throw new AppError("Este usuário ja esta em uso.")
        }

        const hashedPassword = await hash(password, 8);
        
        await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword])
        
        return response.status(201).json();
    }
    

    async update(request, response) {
        const { name, email } = request.body;
        const { id } = request.params;

        const database = await sqliteConecition();
        const user = await database.get("SELECT * FROM users WHERE ID = (?)", [id]);

        if(!user) {
            throw new AppError("Usuário não encontrado");
        }

        const userWithUpdatedEmail = database.get("SELECT * FROM users WHERE email = (?)", [email])

        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
            throw new AppError("Este e-mail ja esta em uso");
        }

        user.name = name;
        user.email = email;

        await database.run(`
        UPDATE users SET,
        name = ?,
        email = ?,
        updated_at = ?,
        WHERE id = ?`
        [user.name, user.email, new Date(), id]
        );

        return response.json()
        //Esse trecho do código poderia ser response.status(200).json() mas por padrão essa resposta retorna o status 200 então podemos ocultar essa parte
        }
};

module.exports = UsersController
