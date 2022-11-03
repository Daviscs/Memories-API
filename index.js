const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config();
const connectDB = require('./db/connect')
const postRoutes = require('./routes/posts')
const userRoutes = require('./routes/users')

const app = express();


app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))
app.use(cors())
app.use('/posts', postRoutes)
app.use('/user', userRoutes)

app.get('/', (req, res) =>{
  res.send('App is running')
})

const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
      console.log('test consoles');
      await connectDB(process.env.MONGO_URI)
      app.listen(PORT, () =>
        console.log(`Server is listening on port ${PORT}...`)
      );
    } catch (error) {
      console.log(error);
    }
  };
  
  start();

