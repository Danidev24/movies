import express, { json } from 'express';
import { randomUUID } from 'node:crypto';
import { validateMovie, validatePartialMovie } from './schema/movies.js';
import cors from 'cors';
import movies from './movies.json';
//un endpoint es un path en el que tenemos un recurso

const app = express();
app.use(json());
app.disable('x-powered-by');

app.use(cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS =[
            'http://localhost:8080',
            'http://movies.com',
        ]
  
      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true)
      }
  
      if (!origin) {
        return callback(null, true)
      }
  
      return callback(new Error('Not allowed by CORS'))
    }
  }))

app.get('/',(req,res)=>{
    res.send('Welcome to the Movies Api')
})
//obtener todas las peliculas
app.get('/movies', (req, res)=>{

    const { genre } = req.query
    if (genre) {
        const filteredMovies = movies.filter(
        movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        )
        return res.json(filteredMovies)
    }
    res.json(movies)
});

//obtener pelicula por id
app.get('/movies/:id', (req, res)=>{
    const {id} = req.params;
    const movie = movies.find(movie => movie.id === id)
    if(movie) return res.json(movie)

    res.status(404).send('No se encontró la pelicula')
});


app.post('/movies', (req, res)=>{

    const result = validateMovie(req.body);
    if(result.error){
        return res.status(400).send({error: JSON.parse(result.error.message)})
    }

    const newMovie = {
        id: randomUUID(),
        ...result.data
    }

    movies.push(newMovie);
    res.status(201).json(newMovie);
});

app.patch('/movies/:id',(req,res)=>{

    const result = validatePartialMovie(req.body);
    
    if(!result.success){
        return res.status(400).send({error: JSON.parse(result.error.message)})
    }
    
    const {id} = req.params;
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if(movieIndex < 0){
        return res.status(400).json({message: 'Movie not found'})
    }

    const updateMovie= {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = updateMovie;

    res.json(updateMovie);
})

app.delete('/movies/:id', (req,res)=>{

    const {id} = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if(movieIndex === -1){
        return res.status(404).send('Movie not found')
    }

    movies.splice(movieIndex, 1)
    return res.json('Movie deleted')
})


const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`escuchando en el puerto ${PORT}`)
});

