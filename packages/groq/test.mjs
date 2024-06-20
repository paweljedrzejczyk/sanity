/* eslint-disable no-console */
import groq, {defineQuery} from 'groq'

console.log(groq`*[_type == "movie"]{title, releaseDate} | order(releaseDate asc)`)
console.log(defineQuery(`*[_type == "movie"]{title, releaseDate} | order(releaseDate asc)`))
