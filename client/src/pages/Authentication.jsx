import React, { useState } from "react";
import styled from "styled-components";
import LogoImage from "../utils/Images/Logo.png";
import AuthImage from "../utils/Images/AuthImage.jpg";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import Carousel from "../components/Carousel";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${({ theme }) => theme.bg};
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

const Left = styled.div`
  flex: 1;
  position: relative;
  height: calc(100vh - 80px);
  @media (max-width: 700px) {
    height: 300px;
  }
`;

const Logo = styled.img`
  position: absolute;
  width: 70px;
  top: 40px;
  left: 60px;
  z-index: 10;
  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.3));
`;

const Right = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 40px;
  gap: 24px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.bg};
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`;

const Text = styled.div`
  font-size: 16px;
  text-align: center;
  color: ${({ theme }) => theme.text_secondary};
  margin-top: 16px;
  @media (max-width: 400px) {
    font-size: 14px;
  }
`;

const TextButton = styled.span`
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`;

const carouselImages = [
  {
    url: AuthImage,
    alt: "Fitness Motivation 1"
  },
  {
    url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&h=800&fit=crop",
    alt: "Fitness Motivation 2"
  },
  {
    url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=800&fit=crop",
    alt: "Fitness Motivation 3"
  },
  {
    url: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=1200&h=800&fit=crop",
    alt: "Fitness Motivation 4"
  }
];

const Authentication = () => {
  const [login, setLogin] = useState(false);

  return (
    <Container>
      <MainContent>
        <Left>
          <Logo src={LogoImage} />
          <Carousel images={carouselImages} interval={5000} />
        </Left>
        <Right>
          {!login ? (
            <>
              <SignIn />
              <Text>
                Don't have an account?{" "}
                <TextButton onClick={() => setLogin(true)}>Sign Up</TextButton>
              </Text>
            </>
          ) : (
            <>
              <SignUp />
              <Text>
                Already have an account?{" "}
                <TextButton onClick={() => setLogin(false)}>Sign In</TextButton>
              </Text>
            </>
          )}
        </Right>
      </MainContent>
    </Container>
  );
};

export default Authentication;
