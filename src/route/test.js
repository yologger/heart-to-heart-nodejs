const express = require('express')
const router = express.Router()
const { User, Post, Session, Hashtag } = require('../../models/index.js')

router.get("/get", (req, res) => {


    console.log(req.body.name)
    console.log(req.body.nation)

    var data = {
        data: "test data",
        method: "get"
    }
    res.status(200).json(data)
})

router.post("/post", (req, res) => {

    console.log(req.headers["content-type"])    // multipart/form-data; boundary=----WebKitFormBoundaryQGuQBj0fNlb8oe96

    var data = {
        name: name,
        nation: nation
    }
    res.json(data)
})

router.post("/token", (req, res) => {
    var data = {
        data: "token",
        method: "token"
    }
    res.status(200).json(data)
})

router.get("/test", (req, res) => {
    var data = {
        data: "test data",
        method: "test"
    }
    res.status(200).json(data)
})

router.get('/test2', async (req, res) => {

    try {

        var user = await User.findOne({ where: { id: 1 } })

        console.log(await user.getSession())		// null

        await user.createSession({
            access_token: "new_access_token_value",
            refresh_token: "new_refresh_token_value",
        })

        console.log(await user.getSession())		// not-null

        var new_session = await Session.create({
            access_token: "new_access_token_value",
            refresh_token: "new_refresh_token_value",
        })

        await user.setSession(new_session)

        var session = await user.getSession()
        console.log(session)		// not-null

    } catch (e) {
        console.log(e)
    }

    var data = {
        data: "test2"
    }
    res.status(200).json(data)
})

module.exports = router