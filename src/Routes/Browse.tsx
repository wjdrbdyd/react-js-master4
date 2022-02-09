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

import { useMatch, useNavigate } from "react-router-dom";
import { userState } from "../atoms";
import { useRecoilValue } from "recoil";

import SliderC from "../Components/SliderC";
import { makeImagePath } from "../utils";
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

const Browse = () => {
  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/browse/items/movie/:paramId");
  const bigTvMatch = useMatch("/browse/items/tv/:paramId");
  const { scrollY } = useViewportScroll();
  const { data: movieData, isLoading: movieLoading } =
    useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
  // const s = useQuery<IGetPopTvResult>(["tv", "popular"], getPopTv);
  // console.log(s);
  const { data: tvData, isLoading: tvLoading } = useQuery<IGetPopTvResult>(
    ["tv", "popular"],
    getPopTv
  );

  const [randomMovie, setRandomMovie] = useState<IMovie>();

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

  const onOverlayClick = () => navigate("/");

  const clickMovie = bigMovieMatch?.params.paramId
    ? movieData?.results.find(
        (movie) => String(movie.id) === bigMovieMatch?.params.paramId
      )
    : bigTvMatch?.params.paramId &&
      tvData?.results.find(
        (tv) => String(tv.id) === bigTvMatch?.params.paramId
      );

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
          {movieData && (
            <SliderC data={movieData} pos={0} contentType="movie" />
          )}
          {tvData && <SliderC data={tvData} pos={1} contentType="tv" />}
          <AnimatePresence>
            {bigMovieMatch || bigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                ></Overlay>
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={
                    bigMovieMatch
                      ? bigMovieMatch.params.paramId
                      : bigTvMatch?.params.paramId
                  }
                >
                  {clickMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            String(clickMovie.backdrop_path),
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>
                        {"title" in clickMovie
                          ? clickMovie.title
                          : clickMovie.name}
                      </BigTitle>
                      <BigOverView>{clickMovie.overview}</BigOverView>
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
