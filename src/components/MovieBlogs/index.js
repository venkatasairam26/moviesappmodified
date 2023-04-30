import {Link} from 'react-router-dom'
import './index.css'

const MovieBlogs = props => {
  const {movieDetails} = props
  const {backdropPath, title, posterPath, id} = movieDetails
  console.log(backdropPath)
  return (
    <Link to={`/movies/${id}`}>
      <li className="movie-item">
        <img src={posterPath} alt={title} className="image-item" />
      </li>
    </Link>
  )
}
export default MovieBlogs
