import React, { useEffect } from 'react'
import { Box, Typography, Divider, Modal, Button, Backdrop } from '@mui/material';
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
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);
  const { movies, selectedMovie, status, error } = useSelector((state) => state.movieState);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMovies());
    }
    if (status === 'loading') {
      setWelcomeModalOpen(true);
    }
    if (status === 'succeeded' || status === 'failed') {
      setWelcomeModalOpen(false);
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

  const handleCloseWelcomeModal = () => {
    setWelcomeModalOpen(false);
  }

  return (
    <>
      {/* Welcome Modal */}
      <Modal
        open={welcomeModalOpen}
        onClose={() => {}}
        aria-labelledby="welcome-modal-title"
        aria-describedby="welcome-modal-description"
        BackdropComponent={Backdrop}
        BackdropProps={{
          sx: {
            backdropFilter: 'blur(6px)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: 320, sm: 400 },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "12px",
            textAlign: "center",
            border: "1px solid rgba(144, 202, 249, 0.2)",
            outline: "none",
          }}
        >
          <Typography 
            id="welcome-modal-title" 
            variant="h5" 
            component="h2"
            sx={{ 
              mb: 2, 
              color: "primary.main",
              fontWeight: "bold"
            }}
          >
            ⚡Powering Up..
          </Typography>
          <Typography 
            id="welcome-modal-description" 
            sx={{
              color: "text.secondary",
              lineHeight: 1.6
            }}
          >
            This may take a while.. We use a free hosting plan where the server sleeps when unused. It's powering up again, thanks for waiting!
          </Typography>
        </Box>
      </Modal>

      <Box sx={{ borderRadius: '10px', marginBottom: 8 }}>
        {status === 'loading' ? (
          <Typography sx={{ padding: '32px', textAlign: 'center', fontSize: '22px' }}>
            Loading movies...
          </Typography>
        ) : (
          <>
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
          </>
        )}
      </Box>
    </>
  )
}

export default Homepage;