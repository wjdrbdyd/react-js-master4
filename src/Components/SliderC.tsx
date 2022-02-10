import React, { useEffect, useState } from "react";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import fallback from "../Img/fallback.png";
import {
  getMovieDetail,
  IGetMovieDetailResult,
  IGetMoviesResult,
  IGetPopTvResult,
} from "../api";
import { useQuery } from "react-query";

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
const Slider = styled.div<{ pos: number }>`
  position: relative;
  top: ${(props) => 275 * props.pos - 100}px;
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
interface ISlider {
  data: IGetMoviesResult | IGetPopTvResult;
  pos: number;
  contentType: string;
}
interface IParam {
  paramId: string;
}
const offset = 6;
const SliderC = ({ data, pos, contentType }: ISlider) => {
  const navigate = useNavigate();
  const [back, setBack] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [index, setIndex] = useState(0);

  const { paramId } = useParams() as unknown as IParam;
  console.log(paramId);
  const nextPlease = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalitems = data.results.length;
      const maxIndex = Math.floor(totalitems / offset) - 1;
      setBack(false);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const prevPlease = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalitems = data.results.length;
      const maxIndex = Math.floor(totalitems / offset) - 1;
      setBack(true);
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const onBoxClicked = (itemId: number) => {
    if (contentType === "tv") {
      navigate(`items/tv/${itemId}`);
    } else if (contentType === "movie") {
      navigate(`items/movie/${itemId}`);
    }
  };

  const { data: movieDetail, refetch } = useQuery<IGetMovieDetailResult>(
    ["movieDetail", paramId],
    () => getMovieDetail(+paramId),
    {
      refetchOnWindowFocus: false,
      enabled: false, // needed to handle refetchs manually
    }
  );

  useEffect(() => {
    paramId && refetch();
  }, [paramId, refetch]);

  const toggleLeaving = () => setLeaving((prev) => !prev);

  return (
    <Slider pos={pos}>
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
          key={index}
        >
          {data?.results
            .slice(1)
            .slice(offset * index, offset * (index + 1))
            .map((item) => (
              <Box
                layoutId={item.id + ""}
                variants={boxVariants}
                key={item.id}
                whileHover="hover"
                initial="normal"
                onClick={() => onBoxClicked(item.id)}
                transition={{ type: "tween" }}
                bgphoto={makeImagePath(item.backdrop_path || "", "w500")}
              >
                <Info variants={infoVariants}>
                  <h4>{"title" in item ? item.title : item.name}</h4>
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
  );
};

export default React.memo(SliderC);
