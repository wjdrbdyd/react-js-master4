import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import {
  getMovies,
  getPopTv,
  IGetMoviesResult,
  IGetPopTvResult,
  IMovie,
} from "../api";
import { makeImagePath } from "../utils";
import { useMatch, useNavigate } from "react-router-dom";
import { userState } from "../atoms";
import { useRecoilValue } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import fallback from "../Img/fallback.png";
import { url } from "inspector";
const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;

  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  position: absolute;
  padding: 0 60px;
`;
const ArrowWrap = styled.div<{ position: string }>`
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  left: ${(props) => (props.position === "left" ? 0 : "auto")};
  right: ${(props) => (props.position === "right" ? 0 : "auto")};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 150px;
  cursor: pointer;
`;

const ArrowIcon = styled(FontAwesomeIcon)`
  font-size: 64px;
  font-weight: 400;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
`;
const Slider = styled.div`
  position: relative;
  top: -100px;
  width: 100%;
  &:hover {
    ${ArrowIcon} {
      opacity: 1;
    }
  }
`;
const Slider2 = styled.div`
  position: relative;
  top: 175px;
  width: 100%;
  &:hover {
    ${ArrowIcon} {
      opacity: 1;
    }
  }
`;
const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: ${(props) =>
    props.bgphoto === "" ? `url(${fallback})` : `url(${props.bgphoto})`};
  background-size: cover;
  background-position: center center;
  height: 150px;
  font-size: 66px;
  border-radius: 5px;

  cursor: pointer;
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
  width: 100%;
  top: 148px;
  h4 {
    text-align: center;
    font-size: 16px;
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
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;
const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 350px;
`;
const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 28px;
  position: relative;
  top: -60px;
`;
const BigOverView = styled.p`
  padding: 20px;
  position: relative;
  top: -60px;
  color: ${(props) => props.theme.white.lighter};
`;
const rowVariants = {
  hidden: (isBack: boolean) => ({
    x: isBack ? -window.innerWidth : window.innerWidth,
  }),
  visible: {
    x: 0,
  },
  exit: (isBack: boolean) => ({
    x: isBack ? window.innerWidth : -window.innerWidth,
  }),
};
const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    borderBottomLeftRadius: "0px",
    borderBottomRightRadius: "0px",
    scale: 1.3,
    y: -40,
    transition: { delay: 0.5, duration: 0.3, type: "tween" },
  },
};
const infoVariants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.5, duration: 0.3, type: "tween" },
  },
};

const offset = 6;
const Browse = () => {
  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/browse/movies/:movieId");
  const { scrollY } = useViewportScroll();
  const { data: movieData, isLoading: movieLoading } =
    useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
  // const s = useQuery<IGetPopTvResult>(["tv", "popular"], getPopTv);
  // console.log(s);
  const { data: tvData, isLoading: tvLoading } = useQuery<IGetPopTvResult>(
    ["tv", "popular"],
    getPopTv
  );

  const [tvIndex, setTvIndex] = useState(0);
  const [movieIndex, setMovieIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [randomMovie, setRandomMovie] = useState<IMovie>();
  const [back, setBack] = useState(false);
  useEffect(() => {
    if (user.email === "") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (movieData) {
      const randomIndex = Math.floor(
        Math.random() * (movieData.results.length + 1)
      );
      setRandomMovie(movieData.results[randomIndex]);
    }
  }, [movieData]);

  const nextPlease = () => {
    if (movieData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = movieData.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setBack(false);
      setMovieIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const nextPlease2 = () => {
    if (tvData) {
      if (leaving) return;
      toggleLeaving();
      const totalTv = tvData.results.length;
      const maxIndex = Math.floor(totalTv / offset) - 1;
      setBack(false);
      setTvIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const prevPlease = () => {
    if (movieData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = movieData.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setBack(true);
      setMovieIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const prevPlease2 = () => {
    if (tvData) {
      if (leaving) return;
      toggleLeaving();
      const totalTv = tvData.results.length;
      const maxIndex = Math.floor(totalTv / offset) - 1;
      setBack(true);
      setTvIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    navigate(`movies/${movieId}`);
  };
  const onOverlayClick = () => navigate("/");
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    movieData?.results.find(
      (movie) => String(movie.id) === bigMovieMatch?.params.movieId
    );
  console.log(clickedMovie);
  return (
    <Wrapper>
      {movieLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImagePath(randomMovie?.backdrop_path || "")}>
            <Title>{randomMovie?.title}</Title>
            <Overview>{randomMovie?.overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence
              custom={back}
              initial={false}
              onExitComplete={toggleLeaving}
            >
              <Row
                custom={back}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 0.5 }}
                key={movieIndex}
              >
                {movieData?.results
                  .slice(1)
                  .slice(offset * movieIndex, offset * (movieIndex + 1))
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      variants={boxVariants}
                      key={movie.id}
                      whileHover="hover"
                      initial="normal"
                      onClick={() => onBoxClicked(movie.id)}
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(movie.backdrop_path || "", "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <ArrowWrap position="left" onClick={prevPlease}>
              <ArrowIcon icon={faAngleLeft as IconProp}></ArrowIcon>
            </ArrowWrap>
            <ArrowWrap position="right" onClick={nextPlease}>
              <ArrowIcon icon={faAngleRight as IconProp}></ArrowIcon>
            </ArrowWrap>
          </Slider>
          <Slider2>
            <AnimatePresence
              custom={back}
              initial={false}
              onExitComplete={toggleLeaving}
            >
              <Row
                custom={back}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 0.5 }}
                key={tvIndex}
              >
                {tvData?.results
                  .slice(1)
                  .slice(offset * tvIndex, offset * (tvIndex + 1))
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + ""}
                      variants={boxVariants}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      onClick={() => onBoxClicked(tv.id)}
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(tv.backdrop_path || "", "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <ArrowWrap position="left" onClick={prevPlease2}>
              <ArrowIcon icon={faAngleLeft as IconProp}></ArrowIcon>
            </ArrowWrap>
            <ArrowWrap position="right" onClick={nextPlease2}>
              <ArrowIcon icon={faAngleRight as IconProp}></ArrowIcon>
            </ArrowWrap>
          </Slider2>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                ></Overlay>
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigMovieMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            String(clickedMovie.backdrop_path),
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverView>{clickedMovie.overview}</BigOverView>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
};

export default Browse;
