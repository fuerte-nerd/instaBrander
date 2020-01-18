const path = require('path')

module.exports = (logo)=>{
    return new Promise((res, rej)=>{
        logo.mv(path.join('./temp/logo', logo.name), (err)=>{
            if(err) rej(err)
            res()
        })
    })
}