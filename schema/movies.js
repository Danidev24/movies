import z from 'zod';

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Movie title must be a string',
        required_error: 'Movie title is require'
    }),
    year: z.number().int().min(1900).max(2024),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10),
    poster: z.string().url({
        invalid_type_error: 'Poster must be a url.'
    }),
    genre: z.array(
        z.enum(['Action', 'Adventure','Crime', 'Comedy', 'Drama', 'Fantasy', 'Horro', 'Thriller', 'Sci-Fi', 'Romance']),
    {
        required_error: 'Genero is required',
    }),
    director: z.string({
        invalid_type_error: 'director must be a string'
    })
})

export function validateMovie(object){
    return movieSchema.safeParse(object)
}

export function validatePartialMovie(object){
    return movieSchema.partial().safeParse(object); 
    //partial significa: que si el usuario que solicita la modificación
    // envía la variable title por ejemplo, se evalúa, si no, no se evalúa
    // hace que todas propiedades sean opcionales
}

