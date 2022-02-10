import React, { useEffect } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { IUser, userState } from "../atoms";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

const Container = styled.div`
  background: black;
  padding-bottom: 200px;
`;
const Cards = styled.div`
  height: 80vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const Card = styled.div`
  padding: 40px 0;
  max-width: 950px;
  margin: 0 auto;
  text-align: center;
`;
const HomeText = styled.h2`
  font-size: 3rem;
  font-weight: 600;
  width: 650px;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  width: 800px;
`;
const Input = styled.input`
  padding: 15px;
  margin: 5px 20px;
  &:last-child {
    background-color: ${(props) => props.theme.red};
    color: white;
    border: none;
    cursor: pointer;
  }
`;

const Home = () => {
  const { register, handleSubmit, setValue } = useForm<IUser>();
  const [user, setUser] = useRecoilState(userState);
  const navigate = useNavigate();
  const onValid = (data: IUser) => {
    setUser({ ...data });

    localStorage.setItem("userEmail", JSON.stringify(data.email));
    if (data) {
      navigate("browse");
    }
  };
  useEffect(() => {
    if (user.email) {
      navigate("browse");
    }
  }, [user, navigate]);
  return (
    <Container>
      <Cards>
        <Card>
          <HomeText>
            규플렉스에 오신것을 환영합니다. 로그인 하는척만ㅜㅜ
          </HomeText>
          <Form onSubmit={handleSubmit(onValid)}>
            <Input
              {...register("email", { required: true })}
              placeholder="email address"
              type="text"
            />
            <Input
              {...register("password", { required: true })}
              placeholder="password"
              type="text"
            />

            <Input type="submit" value="Sing In" />
          </Form>
        </Card>
      </Cards>
    </Container>
  );
};

export default Home;
