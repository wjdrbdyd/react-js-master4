import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

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
const SSlider = styled.div`
  position: relative;
  top: -100px;
  width: 100%;
  &:hover {
    ${ArrowIcon} {
      opacity: 1;
    }
  }
`;
const Slider = () => {
  return <div></div>;
};

export default Slider;
