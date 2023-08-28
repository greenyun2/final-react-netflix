import { getMovies, IGetMoviesResult} from '../api';
import { useQuery } from 'react-query';
import { useNavigate, useMatch, PathMatch } from 'react-router-dom';
import styled from 'styled-components';
import { makeImagePath } from '../utils';
import { useState } from 'react';
import { AnimatePresence, motion, useScroll } from 'framer-motion';

const Wrapper = styled.div`
  background-color: #000;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
`;

const Banner = styled.div<{bgPhoto: string}>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
  width: 100%;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  // position: relative;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  bottom: 0;
  width: 100%;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh; 
  left: 0;
  right: 0;
  margin: 0 auto;
  background-colors: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
  border-radius: 15px;
  over-flow: hidden;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size: 28px;
  padding: 10px;
  position: relative;
  top: -60px;
`;

const BigOverview = styled.p`
  top: -60px;
  position: relative;
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
`;


const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    zIndex: 99,
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: 'tween'
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: 'tween'
    },
  },
};

// 한번에 보여주고 싶은 영화의 수 
const offset = 6;


const Home = () => {

  const history = useNavigate();
  const bigMovieMatch: PathMatch<string> | null = useMatch('/movies/:movieId');
  const { scrollY }  = useScroll();

  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ['movies', 'nowPlaying'], 
    getMovies
    );

  console.log('movieData =>', data);
  console.log('movieLoading =>', isLoading);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [modal, setModal] = useState(0);

  const increaseIndex = () => {
    if(data) {
      if(leaving) return;
      toggleLeaving();
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    };
  };
  
  const toggleLeaving = () => setLeaving((prev) => !prev);

  const onBoxClick = (movieId: number) => {
    history(`/movies/${movieId}`);
    const index = data?.results.findIndex((it) => it.id === movieId);
    setModal(index || 0);
  };

  const onOverlayClick = () => history(`/`);

  const clickedMovie = bigMovieMatch?.params.movieId && data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId!);
  console.log('clickedMovie =>', clickedMovie);
  
  return (
    <Wrapper>
      {isLoading ? (
      <Loader>loading...</Loader>
      ) : (
      <>
        <Banner 
        onClick={increaseIndex}
        bgPhoto={makeImagePath(data?.results[modal].backdrop_path || '')}
        >
        <Title>{data?.results[modal].title}</Title>
        <Overview>{data?.results[modal].overview}</Overview>
      </Banner>
      <Slider>
        <AnimatePresence 
        initial={false} 
        onExitComplete={toggleLeaving}
        >
        <Row 
        key={index}
        variants={rowVariants}
        initial='hidden'
        animate='visible'
        exit='exit'
        transition={{type: 'tween', duration: 1}}
        >
          {data?.results
          .slice(1)
          .slice(offset * index, offset * index + offset)
          .map((movie) => (
            <Box 
            layoutId={movie.id + ''}
            onClick={() => onBoxClick(movie.id)}
            key={movie.id} 
            variants={boxVariants}
            bgPhoto={makeImagePath(movie.backdrop_path, 'w500')}
            initial='normal'
            whileHover='hover'
            transition={{type: 'tween'}}
            >
              <Info variants={infoVariants}>
                <h4>{movie.title}</h4>
              </Info>
            </Box>
          ))}
        </Row>
        </AnimatePresence>
      </Slider>
      <AnimatePresence>
        {
          bigMovieMatch ? (  
            <>
              <Overlay 
              onClick={onOverlayClick}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              />
              <BigMovie 
              style={{
                top: scrollY.get() + 100,
              }}
              layoutId={bigMovieMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                    <BigCover style={{
                      backgroundImage: 
                      `linear-gradient(to top, black, transparent),
                      url(${makeImagePath(clickedMovie.poster_path, 'w500')})`
                    }}
                      />
                    <BigTitle>{clickedMovie.title}</BigTitle>
                    <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
            </>      
            ) : (
              null
            )
        }
      </AnimatePresence>
    </>
    )}
    </Wrapper>
  );
};

export default Home;