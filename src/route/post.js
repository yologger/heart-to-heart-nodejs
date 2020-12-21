const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const { verifyAccessToken } = require('../middleware')

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
    // limits: { fileSize: 5 * 1024 * 1024 }
    limits: { fileSize: 1024 * 1024 * 1024 }
})

router.post('/img', upload.single('field'), (req, res) => {
    console.log(`REQ.BODY.EMAIL: ${req.body.email}`)
    console.log(`REQ.BODY.NAME: ${req.body.name}`)
    console.log(`REQ.FILE:`)
    console.log(req.file)
    console.log("############################################################")
    res.json({
        url: `/img/${req.file.filename}`
    })
})

router.post('/imgs', upload.array('field'), (req, res) => {
    console.log(`REQ.BODY.EMAIL: ${req.body.email}`)
    console.log(`REQ.BODY.NAME: ${req.body.name}`)
    console.log(`REQ.FILE:`)
    res.json({
        url: {
            'avatar1': `/imgs/${req.files[0].filename}`,
            'avatar2': `/imgs/${req.files[1].filename}`
        }
    })
})



router.get('/test', verifyAccessToken, (req, res) => {
    res.status(202).json({
        "code": 1,
        "message": 'Success',
        "data": {
            "name": "ronaldo"
            // "posts": [{
            //     "author": "Kane",
            //     "content": "Hello World"
            // }, {
            //     "author": "Ronaldo",
            //     "content": "read madrid is good"
            // }]
        }
    })
})

// router.post('/img', (req, res) => {
//     console.log('Hello World!!!!~!!~')
//     res.json({
//         "result": "result"
//     })
// })

module.exports = router