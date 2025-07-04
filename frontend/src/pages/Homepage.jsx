import React, { useEffect } from 'react'
import { Box, Typography, Divider } from '@mui/material';
import WideMovieCard from '../components/WideMovieCard';
import MovieCarousel from '../components/MovieCarousel/MovieCarousel';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { fetchMovies } from '../store/actions/movies';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [nowShowingMovies, setNowShowingMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const { movies, selectedMovie, status, error } = useSelector((state) => state.movieState);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMovies());
    }
  }, [status, dispatch]);

  useEffect(() => {
    fetchNowshowingMovies();
    fetchUpcomingMovies();
    fetchFeaturedMovie();
  }, []);

  const fetchNowshowingMovies = async () => {
    // fetch upcoming movies
    try {
      const response = await axios.get('/movies/now/showing');
      setNowShowingMovies(response.data.data);
    }
    catch (error) {
      console.log(error);
    }
  }

  const fetchUpcomingMovies = async () => {
    // fetch upcoming movies
    try {
      const response = await axios.get('/movies/now/upcoming');
      setUpcomingMovies(response.data.data);
    }
    catch (error) {
      console.log(error);
    }
  }

  const fetchFeaturedMovie = async () => {
    // fetch upcoming movies
    try {
      const response = await axios.get('/movies/featured/get');
      setFeaturedMovie(response.data.data);
    }
    catch (error) {
      console.log(error);
    }
  }

  const handleWideMovie = () => {
    navigate(`/movie/${featuredMovie._id}`);
  }

  return (
    <Box sx={{ borderRadius: '10px', marginBottom: 8 }}>

      {featuredMovie !== null && (
        <div onClick={handleWideMovie}>
          <WideMovieCard movie={featuredMovie} />
        </div>
      )}

      <Typography sx={{ padding: '16px', fontSize: '22px' }}>Now Showing</Typography>
      <MovieCarousel movies={nowShowingMovies} />

      <Divider sx={{ borderColor: 'none', marginTop: 2, marginBottom: 2 }} />

      <Typography sx={{ padding: '16px', fontSize: '22px' }}>Upcoming Shows</Typography>
      <MovieCarousel movies={upcomingMovies} />
    </Box>
  )
}

export default Homepage