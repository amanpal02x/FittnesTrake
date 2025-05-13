import React from 'react';
import styled from 'styled-components';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const FooterContainer = styled.footer`
  width: 100%;
  padding: 40px 0;
  background: ${({ theme }) => theme.bg};
  border-top: 1px solid ${({ theme }) => theme.text_secondary + '20'};
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FooterTitle = styled.h3`
  color: ${({ theme }) => theme.text_primary};
  font-size: 18px;
  font-weight: 600;
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.text_secondary};
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 8px;
`;

const SocialIcon = styled.a`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 20px;
  transition: color 0.2s ease;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.text_secondary + '20'};
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>About Us</FooterTitle>
          <FooterLink href="#">Our Story</FooterLink>
          <FooterLink href="#">Team</FooterLink>
          <FooterLink href="#">Careers</FooterLink>
        </FooterSection>
        <FooterSection>
          <FooterTitle>Services</FooterTitle>
          <FooterLink href="#">Workout Plans</FooterLink>
          <FooterLink href="#">Nutrition Guide</FooterLink>
          <FooterLink href="#">Personal Training</FooterLink>
        </FooterSection>
        <FooterSection>
          <FooterTitle>Support</FooterTitle>
          <FooterLink href="#">Help Center</FooterLink>
          <FooterLink href="#">Contact Us</FooterLink>
          <FooterLink href="#">Privacy Policy</FooterLink>
        </FooterSection>
        <FooterSection>
          <FooterTitle>Connect With Us</FooterTitle>
          <SocialLinks>
            <SocialIcon href="#"><Facebook /></SocialIcon>
            <SocialIcon href="#"><Twitter /></SocialIcon>
            <SocialIcon href="#"><Instagram /></SocialIcon>
            <SocialIcon href="#"><LinkedIn /></SocialIcon>
          </SocialLinks>
        </FooterSection>
      </FooterContent>
      <Copyright>
        © {new Date().getFullYear()} FitnessTrack. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer; 