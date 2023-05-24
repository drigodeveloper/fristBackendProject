const { Router } = require("express")

const UsersController = require("../controllers/usersController")

const usersRoutes = Router()


function myMiddleware(request, response, next) {
    console.log("Você passou pelo Middleware")
    if(!request.body.isAdimin) {
        return response.json({ message: "user anauthorized" })
    }
    next()
}


const usersController = new UsersController()

usersRoutes.post("/", myMiddleware, usersController.create)
usersRoutes.put("/:id", usersController.update)

module.exports = usersRoutes;