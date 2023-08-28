import { useState } from 'react';
import { IGetTvResult, getTvShow } from '../api';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { makeImagePath } from '../utils';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { useNavigate, PathMatch, useMatch } from 'react-router-dom';


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

const BigTv = styled(motion.div)`
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


const offset = 6;

const Tv = () => {
  const { data, isLoading } = useQuery<IGetTvResult>(['tv', 'popular'], getTvShow);
  console.log('tvData => ', data);
  
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [modal, setModal] = useState(0);
  const history = useNavigate()
  const bigTvMatch: PathMatch<string> | null = useMatch('/tv/:tvId');
  const { scrollY } = useScroll();

  const increaseIndex = () => {
    if(data) {
      if(leaving) return;
      toggleLeaving();
      const totalTv = data?.results.length - 1;
      const maxIndex = Math.floor(totalTv / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    };
  };
  
  const toggleLeaving = () => setLeaving((prev) => !prev);

  const onBoxClick = (tvId: number) => {
    history(`/tv/${tvId}`);
    const index = data?.results.findIndex((it) => it.id === tvId);
    setModal(index || 0);
  };

  const onOverlayClick = () => history(`/tv`);

  const clickedTv = bigTvMatch?.params.tvId && data?.results.find((tv) => tv.id === +bigTvMatch.params.tvId!);

  console.log('clickedMovie =>', clickedTv);

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
        <Title>{data?.results[modal].name}</Title>
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
          .map((tv) => (
            <Box 
            layoutId={tv.id + ''}
            onClick={() => onBoxClick(tv.id)}
            key={tv.id} 
            variants={boxVariants}
            bgPhoto={makeImagePath(tv.backdrop_path, 'w500')}
            initial='normal'
            whileHover='hover'
            transition={{type: 'tween'}}
            >
              <Info variants={infoVariants}>
                <h4>{tv.name}</h4>
              </Info>
            </Box>
          ))}
        </Row>
        </AnimatePresence>
      </Slider>
      <AnimatePresence>
        {
          bigTvMatch ? (  
            <>
              <Overlay 
              onClick={onOverlayClick}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              />
              <BigTv 
              style={{
                top: scrollY.get() + 100,
              }}
              layoutId={bigTvMatch.params.tvId}
                >
                  {clickedTv && (
                    <>
                    <BigCover style={{
                      backgroundImage: 
                      `linear-gradient(to top, black, transparent),
                      url(${makeImagePath(clickedTv.poster_path, 'w500')})`
                    }}
                      />
                    <BigTitle>{clickedTv.name}</BigTitle>
                    <BigOverview>{clickedTv.overview}</BigOverview>
                    </>
                  )}
                </BigTv>
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

export default Tv;