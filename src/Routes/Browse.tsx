import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import {
  getMovies,
  getPopTv,
  IGetMovieDetailResult,
  IGetMoviesResult,
  IGetPopTvResult,
  IGetTvDetailResult,
  IMovie,
} from "../api";

import { useMatch, useNavigate } from "react-router-dom";
import { movieDetailState, tvDetailState, userState } from "../atoms";
import { useRecoilValue } from "recoil";

import SliderC from "../Components/SliderC";
import { makeImagePath } from "../utils";
import { Rating } from "@mui/material";
import StarRating from "../Components/StarRating";
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
  margin: auto;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 1;
`;
const BigMovieWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
`;
const BigMovie = styled(motion.div)`
  position: absolute;
  width: 45vw;
  height: 80vh;
  top: 2em;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.darker};
  z-index: 10;
`;
const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const LogoWrap = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 350px;
`;
const BigLogo = styled.img`
  src: url(${(props) => props.src});
  position: absolute;
  bottom: 10px;
  padding: 10px 30px;
`;
const TitleContainer = styled.div`
  display: flex;
  top: -60px;
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  justify-content: space-between;
  padding: 20px;
`;

const Spans = styled.div`
  width: 200px;
  margin: 7px 0;
  display: flex;
  flex-direction: column;
  padding: 0px 20px;
`;
const Span = styled.span`
  font-size: 13px;
  display: block;
  padding: 2px;
  > label {
    color: ${(props) => props.theme.black.slighter};
  }
`;

const ContentContainer = styled.div`
  position: relative;
  top: -60px;
  width: 100%;
  background-color: ${(props) => props.theme.black.darker};
`;

const BigOverView = styled.p`
  padding: 0 48px;
  line-height: 25px;
  color: ${(props) => props.theme.white.lighter};
`;
const DetailWrap = styled.div``;

const Browse = () => {
  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/browse/items/movie/:paramId");
  const bigTvMatch = useMatch("/browse/items/tv/:paramId");

  const { data: movieData, isLoading: movieLoading } =
    useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);

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

  const clickedItem = bigMovieMatch?.params.paramId
    ? movieData?.results.find(
        (movie) => String(movie.id) === bigMovieMatch?.params.paramId
      )
    : bigTvMatch?.params.paramId &&
      tvData?.results.find(
        (tv) => String(tv.id) === bigTvMatch?.params.paramId
      );
  const detailMovieItem = useRecoilValue(movieDetailState);
  const detailTvItem = useRecoilValue(tvDetailState);
  const [apiItem, setApiItem] = useState<
    IGetMovieDetailResult | IGetTvDetailResult
  >();

  useEffect(() => {
    if (detailMovieItem) {
      setApiItem({ ...detailMovieItem });
    } else if (detailTvItem) {
      setApiItem({ ...detailTvItem });
    }
  }, [detailMovieItem, detailTvItem]);

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
                <BigMovieWrapper>
                  <BigMovie
                    layoutId={
                      bigMovieMatch
                        ? bigMovieMatch.params.paramId
                        : bigTvMatch?.params.paramId
                    }
                  >
                    {apiItem && (
                      <>
                        <BigCover
                          style={{
                            backgroundImage: `linear-gradient(to top,#181818,transparent 50%), url(${makeImagePath(
                              String(apiItem.backdrop_path) || "",
                              "w500"
                            )})`,
                          }}
                        />
                        <LogoWrap>
                          <BigLogo
                            src={`${makeImagePath(
                              apiItem &&
                                apiItem.logos &&
                                apiItem.logos.length > 0
                                ? apiItem?.logos[0].file_path
                                : "",
                              "w300"
                            )}`}
                          ></BigLogo>
                        </LogoWrap>
                        <TitleContainer>
                          <Spans>
                            <Span>
                              <label>상영 시간: </label>
                              {"runtime" in apiItem && apiItem.runtime}분
                            </Span>

                            <Span>
                              <label>개봉일: </label>
                              {"release_date" in apiItem &&
                                apiItem?.release_date}
                            </Span>
                          </Spans>
                          <Spans>
                            <Span>
                              <label>장르: </label>
                              {apiItem.genres &&
                                apiItem.genres!.map((genre, idx) => (
                                  <span key={idx}>
                                    {genre.name}
                                    {`${
                                      idx !== apiItem.genres.length - 1
                                        ? ", "
                                        : ""
                                    }`}
                                  </span>
                                ))}
                            </Span>
                            <Span
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <label>별점:{"  "}</label>
                              <StarRating voteAverage={apiItem?.vote_average} />
                            </Span>
                          </Spans>
                        </TitleContainer>
                        <ContentContainer>
                          <BigOverView>{apiItem.overview}</BigOverView>
                          <DetailWrap></DetailWrap>
                        </ContentContainer>
                      </>
                    )}
                  </BigMovie>
                </BigMovieWrapper>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
};

export default Browse;
