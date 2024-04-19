const express = require("express");
const mongoose = require("mongoose");
const Videos = require("./models/VideoDetails"); 
const User = require("./models/signupdetails");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const middleware = require("./middleware/jwtAuth");
const app = express();




app.use(express.json());
app.use(cors());

const port = 5555;
mongoose.connect("mongodb+srv://pendyalavenkatesh66:venky123@cluster0.iz0b42n.mongodb.net/SynergyWatch?retryWrites=true&w=majority&appName=Cluster0")

.then(()=>{
    console.log("Database connected successfull.....")})
.catch((err)=>{
    console.error(err);
});
app.get('/gettrendingvideos', async (req, res) => {
  try {

      const trendingVideos = await Videos.find().limit(5);

      res.json(trendingVideos);
  } catch (error) {
      console.log(error);
  }
});
app.get('/getgamingvideos', async (req, res) => {
  try {
      const gamingVideos = await Videos.find({ category: 'Gaming' }).limit(6);
      res.json(gamingVideos);
  } catch (error) {
      console.log(error);
  }
});



// api to get saved videos
app.get("/savedvideo", async (req, res) => {
  try {
    const savedVideos = await Videos.find({ savedStatus: "Saved" });
    return res.status(200).json({ savedVideos: savedVideos });
  } catch (error) {
    console.log(error);
  }
});


app.post("/sendvideodetails", async (req,res)=>{
    try {
        const sendVideoDetails = await Videos.create(req.body);
        return res.send(201).json({message : "video details saved successflly", sendVideoDetails})
    } catch (error){
        console.log(error);
    }

});

app.post("/sendsignupdetails", async (req,res)=>{
  try {
      const sendsignupDetails = await User.create(req.body);
      return res.send(201).json({message : "signup details saved successflly", sendsignupDetails})
  } catch (error){
      console.log(error);
  }

});

// api to get the all video details 
app.get("/getvideodetails", async (req, res) => {
  try {
    const videos = await Videos.find({});
    res.status(200).json(videos);
  } catch (error) {
    console.log(error);
  }
})

// api to get individual data
app.get("/individualvideo/:id", async (req, res) => {
  try {
    // const id = req.params.id;
    const { id } = req.params;
    const video = await Videos.findById({ _id: id });
    res.status(200).json(video);

  } catch (error) {
    console.log(error);
  }
})

// sign up api
app.post("/signnup", async (req, res) => {
    try {
      const { email , password} = req.body;
      const checkUser = await User.findOne({ email: email });

      if (checkUser) {
        return res.status(404).json({ message: "user already exists" });
      }
      if (req.body.password !== req.body.confirmpassword) {
        return res.status(404).json({ message: "passwords doesnot match" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      req.body.password = hashedPassword;
      console.log("heloo", password);

        const newUser = new User(req.body)
        await newUser.save();
        res.status(200).json({message : "user signedup success"})

    }catch(error){
        console.log("error")   
       }
       })
       
     //login api
     app.post("/login", async (req, res) => {
        try {
          const { email , password } = req.body;
          const userExist = await User.findOne({ email: email });
           if (!userExist){
          return res.status(406).json({ message: "user doesnot exist" });
           }
           const passwordMatched = await bcrypt.compare(password, userExist.password);
           if (!passwordMatched){
            return res.status(401).send("invalid password")
           }
          const token = jwt.sign({email:userExist.email}, "secretToken", {expiresIn: "1hr"});

           res.status(200).json({token, message : " logedin successfull"})
           }catch (error) {
              console.log(error);
         }

    })

    // api to update the saved status
app.put("/videos/:id/save", async (req, res) => {

  const { id } = req.params;
  console.log(id);
  const { savedStatus } = req.body;
  console.log(savedStatus);
  try {
    const updatedVideo = await Videos.findByIdAndUpdate(
      id,
      { savedStatus },
      { new: true }
    );
    if (!updatedVideo) {
      return res.status(404).json("video not found");
    }

    res.json(updatedVideo);
  } catch (error) {
    console.log(error);
  }
});


app.listen(port, () =>console.log(`server is running at port ${port}`));
