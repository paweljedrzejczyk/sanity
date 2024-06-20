/* eslint-disable no-console */
const groq = require('groq')

const {defineQuery} = groq

console.log(groq`*[_type == "movie"]{title, releaseDate} | order(releaseDate asc)`)
console.log(defineQuery(`*[_type == "movie"]{title, releaseDate} | order(releaseDate asc)`))
