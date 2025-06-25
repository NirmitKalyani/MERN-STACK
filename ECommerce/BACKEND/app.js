const express = require("express");
const PORT = 8080;
const cors = require("cors");
const morgan = require("morgan")
const routes = require("./routes/index")

const app = express();

const {connectedDB} = require("./DB/connectDB");

connectedDB();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(routes);

app.listen(PORT,()=>{
    console.log("Server Listening...")
})