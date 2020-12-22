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
    limits: { fileSize: 5 * 1024 * 1024 }   // 5MB
})

// router.post('/img', upload.single('field'), (req, res) => {
//     res.status(200).json({
//         code: 1,
//         message: "Single image successfully uploaded.",
//         data: {
//             image: req.file.path
//         }
//     })
// })

// router.post('/imgs', upload.array('field'), (req, res) => {
//     let images = []

//     for (var idx in req.files) {
//         images.push(req.files[idx].path)
//     }

//     res.status(200).json({
//         code: 1,
//         message: "Multiple images successfully uploaded.",
//         data: {
//             images: images
//         }
//     })
// })

router.post('/post', upload.array('field'), (req, res) => {
    let images = []

    for (var idx in req.files) {
        images.push(req.files[idx].path)
    }

    console.log(req.body['content'])

    res.status(200).json({
        code: 1,
        message: "Post successfully created.",
        data: {
            images: images
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

router.post('/', (req, res) => {
    console.log('Hello World!!!!~!!~')
    res.status(233).json({
        "result": "result"
    })
})

module.exports = router