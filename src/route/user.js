const express = require('express')
const router = express.Router()

router.use('/user', (req, res) => {
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

module.exports = router
