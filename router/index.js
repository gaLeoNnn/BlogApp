const Router = require("express").Router;
const { registerValidator, loginValidator, postCreateValidator } = require("../validation/auth.js");
const checkAuth = require("../utils/checkAuth.js");

const router = new Router();
const { register, login, checkMe } = require("../controllers/UserControllers.js");
const { create, getAll, getOne, removeOne, update } = require("../controllers/PostController.js");

router.post("/registration", registerValidator, register);
router.post("/login", loginValidator, login);
router.get("/me", checkAuth, checkMe);
//posts
router.get("/posts", getAll);
router.get("/posts/:id", getOne);
router.post("/posts", checkAuth, postCreateValidator, create);
router.delete("/posts/:id", checkAuth, removeOne);
router.patch("/posts/:id", checkAuth, update);

module.exports = router;
