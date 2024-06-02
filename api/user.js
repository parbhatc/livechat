const express = require("express");
const Main = require("../Main");
const Cookie = require("../cookie/Cookie");
const router = express.Router();

router.post("/register", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    let username = req.body.username;

    if(username === undefined){
        return res.json({code: 404, message: "parameter 'username' is required."})
    }
    if(username.length < 1){
        return res.json({code: 403, message: "username length must be higher than 1."})
    }
    if(username.length > 20){
        return res.json({code: 403, message: "username length must be less than 20."})
    }
    if(Main.instance.users.indexOf(username) !== -1){
        return res.json({code: 403, message: "username is taken."})
    }
    Main.instance.users.push(username);
    await Cookie.setUser(username, res);
    return res.json({code: 200, message: "valid."})
})


module.exports = router;