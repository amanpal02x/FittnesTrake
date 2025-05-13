import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button";
import { UserSignIn } from "../api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/reducers/userSlice";
import { Person, Info } from "@mui/icons-material";

const Container = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 36px;
  position: relative;
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Span = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary + 90};
  margin-top: 8px;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;
  position: relative;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledTextInput = styled(TextInput)``;

const UserTooltip = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.card};
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 280px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 10;

  ${Button}:hover + & {
    opacity: 1;
    visibility: visible;
  }
`;

const TooltipTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TooltipText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
  line-height: 1.5;
`;

const SignIn = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateInputs = () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    setLoading(true);
    setButtonDisabled(true);
    if (validateInputs()) {
      await UserSignIn({ email, password })
        .then((res) => {
          dispatch(loginSuccess(res.data));
          alert("Login Success");
          setLoading(false);
          setButtonDisabled(false);
        })
        .catch((err) => {
          alert(err.response.data.message);
          setLoading(false);
          setButtonDisabled(false);
        });
    }
  };

  return (
    <Container>
      <div>
        <Title>
          <Person size={24} />
          Welcome to Fittrack 👋
        </Title>
        <Span>Please login with your details here</Span>
      </div>
      <InputContainer>
        <InputWrapper>
          <StyledTextInput
            label="Email Address"
            placeholder="Enter your email address"
            value={email}
            handleChange={(e) => setEmail(e.target.value)}
          />
        </InputWrapper>
        <InputWrapper>
          <StyledTextInput
            label="Password"
            placeholder="Enter your password"
            password
            value={password}
            handleChange={(e) => setPassword(e.target.value)}
          />
        </InputWrapper>
        <div style={{ position: 'relative' }}>
          <Button
            text="Sign In"
            onClick={handleSignIn}
            isLoading={loading}
            isDisabled={buttonDisabled}
          />
          <UserTooltip>
            <TooltipTitle>
              <Info />
              Account Information
            </TooltipTitle>
            <TooltipText>
              Sign in to access your personalized dashboard, workout tracking, and fitness goals.
              Your data is securely stored and protected.
            </TooltipText>
          </UserTooltip>
        </div>
      </InputContainer>
    </Container>
  );
};

export default SignIn;
