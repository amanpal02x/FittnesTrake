import React, { useState } from 'react';
import styled from "styled-components";
import { TextField, Button, Snackbar, Alert } from '@mui/material';
import { Email, Phone, LocationOn } from '@mui/icons-material';

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 1200px;
  display: flex;
  gap: 32px;
  padding: 20px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h1`
  font-size: 32px;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 12px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.text_secondary};
  line-height: 1.5;
  margin-bottom: 24px;
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const ContactText = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.text_primary};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.card};
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setSnackbar({
      open: true,
      message: 'Thank you for your message! We will get back to you soon.',
      severity: 'success'
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container>
      <Wrapper>
        <Left>
          <Title>Get in Touch</Title>
          <Subtitle>
            Have questions about our fitness tracking platform? Want to give feedback?
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </Subtitle>
          
          <ContactInfo>
            <Email sx={{ color: 'primary.main' }} />
            <ContactText>support@fittrack.com</ContactText>
          </ContactInfo>
          
          <ContactInfo>
            <Phone sx={{ color: 'primary.main' }} />
            <ContactText>+1 (555) 123-4567</ContactText>
          </ContactInfo>
          
          <ContactInfo>
            <LocationOn sx={{ color: 'primary.main' }} />
            <ContactText>123 Fitness Street, Health City, FC 12345</ContactText>
          </ContactInfo>
        </Left>

        <Right>
          <Form onSubmit={handleSubmit}>
            <TextField
              name="name"
              label="Your Name"
              variant="outlined"
              fullWidth
              required
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              name="email"
              label="Email Address"
              variant="outlined"
              fullWidth
              required
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              name="subject"
              label="Subject"
              variant="outlined"
              fullWidth
              required
              value={formData.subject}
              onChange={handleChange}
            />
            <TextField
              name="message"
              label="Message"
              variant="outlined"
              fullWidth
              required
              multiline
              rows={4}
              value={formData.message}
              onChange={handleChange}
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              sx={{ height: '50px' }}
            >
              Send Message
            </Button>
          </Form>
        </Right>
      </Wrapper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContactUs; 