class Cookie{

    static async validateUser(req){
        let {cookies} = req;

        if('lc_username' in cookies){
            return {"code": 200, username: cookies.lc_username, "message": "valid."};
        }else{
            return {"code": 404, "message": "No username found."};
        }
    }

    static async setUser(username, res){
        let expireDate = new Date();
        expireDate.setTime(expireDate.getTime() + (30 * 24 * 60 * 60 * 1000)); //1 month
        res.cookie("lc_username", username, {expires: expireDate});
    }
}

module.exports = Cookie;