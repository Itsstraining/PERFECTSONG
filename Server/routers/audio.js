const app = require("express");
const { async } = require("rxjs");
const router = app.Router();

const audioModel = require("../schemas/audio.schema.js");


router.get("/getAll", async (request, response) => {
    try{
        let audio = await audioModel.find();
        response.send(audio);
    }catch(err){
        console.log(err);
    }

});

router.get("/getDetail/:docId", async (request,response) => {
    try {
        let params = request.params.docId
        let audio = await audioModel.findById(params).populate("authorId");
    response.status(200).send(audio)
    } catch (err) {
        response.status(500).send(err);
    }
    
});

router.post("/add", (request,response) => {
    try{
        let data = request.body.data;
        // console.log(data)
        let temp = new audioModel(data);
        temp.save((err, value) => {
            response.status(200).json({
                message: "Thêm thành công",
                data: value,
            });
        })
        
    }catch(err){
        response.status(404).json({ message: err.toString() })
    }
});

router.put("/updateData", (request,response) => {
    try{
        let body = request.body;
        let data = body.data;
        let docId = body.docId
        console.log(data)
        audioModel.findByIdAndUpdate(docId,data,(err,value,res)=>{
            console.log(err,value,res);
            response.status(200).json({
                message: "sửa thành công",
                // data:value,
            });
        })
    }catch(err){
        response.status(404).json({ message: err.toString() })
    }
    
});

router.delete("/deleteAll", async (request,response) => {
    try {
        let docId = request.body.docId;

        let result = await audioModel.findByIdAndDelete(docId);
        console.log(result)
        if(result == null){
            response.status(400).send({
                message: `Tìm không được id ${docId} này!!!`
            })
        }else{
            response.status(200).send({
                message: "Xoa thanh cong!!!"
            })
        }

    } catch (error) {
        console.log(error);
    }
    
})

module.exports = router;