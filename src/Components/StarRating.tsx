import React, { useEffect } from "react";
import { Rating } from "@mui/material";

interface IStartRating {
  voteAverage: number;
}

const StarRating = ({ voteAverage }: IStartRating) => {
  return (
    <Rating
      name="rating"
      defaultValue={0}
      value={+(voteAverage / 2).toFixed(2)}
      precision={0.5}
      size="small"
    />
  );
};

export default StarRating;
