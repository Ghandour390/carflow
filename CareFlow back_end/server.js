const express = require('express');
// const dotenv= require('dotenv').config();
const app = express();
const port = 3000;
// require les pages de routers
const userRoute = require('./routes/users');
const roleRoute = require('./routes/roles');
// const specialiteRoute = require('./routes/specialites');


const   connectToMongoDB = require('./config/db');



app.use(express.json());
app.use(express.urlencoded({ extended: true }));




connectToMongoDB();

//---------------------- les appelles des routers
app.use('/api', userRoute);
app.use('/api/roles', roleRoute);
// app.use('/api/specialites', specialiteRoute);






app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
});