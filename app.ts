import express from 'express';

const app = express();

const port = 3000;

app.get('/', (req, res) => {
	res.status(200).json({ message: 'Welcome to nature api', owner: 'Silas'})
})
app.post('/', (req, res) => {
	res.status(200).send('You can post to this url')
})
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})