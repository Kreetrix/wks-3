import express from 'express';
const app = express();
const port = 3000;

app.use('/public', express.static('public'));

app.get('/api/v1/cat', (req, res) => {
    console.log('query params object', req.query);
    const myData = {
        cat_id: 1,
        name: 'Dog',
        birthdate: '100 BC',
        weight: 100,
        owner: 'Pekka',
        iamge: 'https://loremflickr.com/320/240/cat'

    };
    res.json(myData);
});

//some stuff

app.listen(port, () => {
  console.log(`Server running`);
});
