const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const { User } = require('../../models')

fs.readdir('uploads', (error) => {
    if (error) {
        fs.mkdirSync('uploads')
    }
})

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, callback) {
            callback(null, 'uploads/')
        },
        filename(req, file, callback) {
            const ext = path.extname(file.originalname)
            callback(null, path.basename(file.originalname, ext) + '_' + new Date().valueOf() + ext)
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }   // 5MB
})


router.post('/avatar', upload.single('field'), async (req, res, next) => {

    let userId = req.body.user_id

    if (!userId) {
        res.status(400).json({
            "code": -1,
            "error_message": "userId does not exist."
        })
    } else {

        try {
            await User.update({
                url: req.file.path
            }, {
                where: { id: userId }
            })

            res.status(200).json({
                "code": 1,
                "message": "Avatar image has been successfully uploaded.",
                "data": {
                    "uri": req.file.path
                }
            })
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

})

router.use('/user', (req, res) => {
    // const userId = req.params.id
    var user = {
        "name": "Ronaldo",
        "age": 35,
        "nation": "Portugal",
        "partner": {
            "name": "Kane",
            "age": "28",
            "nation": "England"
        }
    }
    res.json(user)

    // var users = ["Ronaldo", "Benzema", "Kane"]
    // res.json(users)
})

router.post("/:following/follow", async (req, res, next) => {
    try {
        let follower = req.body["follower_id"]
        let following = req.params["following"]

        const me = await User.findOne({ where: { id: follower } })
        await me.addFollowing(parseInt(following, 10))
        console.log(me)
        res.status(200).json({
            "code": -1,
            "message": "success"
        })
    } catch(e) {
        console.error(e)
        next(e)
    }
})

module.exports = router
