import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material";
import styled from "styled-components";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Authentication from "./pages/Authentication";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Footer from "./components/Footer";
import Blog from "./pages/Blog";
import ContactUs from "./pages/ContactUs";
import { ThemeProvider } from "./context/ThemeContext";
import { useTheme } from "./context/ThemeContext";
import { darkTheme } from "./utils/Themes";

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  transition: all 0.2s ease;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 40px;
`;

const PageContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const AppContent = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useTheme();

  // Create Material-UI theme
  const muiTheme = createTheme({
    palette: {
      mode: theme === darkTheme ? 'dark' : 'light',
      primary: {
        main: theme.primary,
      },
      secondary: {
        main: theme.secondary,
      },
      text: {
        primary: theme.text_primary,
        secondary: theme.text_secondary,
      },
      background: {
        default: theme.bg,
        paper: theme.card,
      },
    },
    typography: {
      fontFamily: "'Poppins', sans-serif",
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '8px',
          },
        },
      },
    },
  });

  return (
    <MuiThemeProvider theme={muiTheme}>
      <StyledThemeProvider theme={theme}>
        <BrowserRouter>
          <Container>
            {currentUser ? (
              <>
                <Navbar currentUser={currentUser} />
                <MainContent>
                  <PageContainer>
                    <Routes>
                      <Route path="/" element={<Authentication />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/workouts" element={<Workouts />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/contact" element={<ContactUs />} />
                    </Routes>
                  </PageContainer>
                </MainContent>
                <Footer />
              </>
            ) : (
              <Authentication />
            )}
          </Container>
        </BrowserRouter>
      </StyledThemeProvider>
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
