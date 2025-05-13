import React, { useState } from "react";
import styled from "styled-components";
import LogoImg from "../utils/Images/Logo.png";
import { Link as LinkR, NavLink } from "react-router-dom";
import { 
  MenuRounded, 
  ExitToApp, 
  Dashboard, 
  FitnessCenter, 
  Article, 
  ContactSupport,
  DarkMode,
  LightMode
} from "@mui/icons-material";
import { Avatar, Badge, IconButton, Tooltip } from "@mui/material";
import { useDispatch } from "react-redux";
import { logout } from "../redux/reducers/userSlice";
import { useTheme } from "../context/ThemeContext";

const Nav = styled.div`
  background-color: ${({ theme }) => theme.bg};
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(8px);
  background: ${({ theme }) => `linear-gradient(to bottom, ${theme.bg}, ${theme.bg}E6)`};
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid ${({ theme }) => theme.text_secondary + 10};
`;

const NavContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 0 24px;
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
`;

const NavLogo = styled(LinkR)`
  width: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 6px;
  font-weight: 700;
  font-size: 20px;
  text-decoration: none;
  color: ${({ theme }) => theme.text_primary};
  transition: all 0.3s ease;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
    transform: translateY(-1px);
  }
`;

const Logo = styled.img`
  height: 46px;
  transition: all 0.3s ease;
  
  ${NavLogo}:hover & {
    transform: scale(1.05) rotate(-5deg);
  }
`;

const Mobileicon = styled.div`
  color: ${({ theme }) => theme.text_primary};
  display: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 50%;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.primary + '10'};
  }
  
  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const NavItems = styled.ul`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 0 6px;
  list-style: none;
  margin: 0;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 15px;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.primary + '10'};
    transform: translateY(-2px);
  }
  
  &.active {
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.primary + '20'};
    font-weight: 600;
  }

  svg {
    font-size: 20px;
  }
`;

const UserContainer = styled.div`
  width: auto;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  align-items: center;
  padding: 0 6px;
  color: ${({ theme }) => theme.primary};
  position: relative;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.primary + '10'};
    transform: translateY(-2px);
  }

  .MuiAvatar-root {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    background: ${({ theme }) => theme.primary};
    border: 2px solid ${({ theme }) => theme.primary + '30'};
    transition: all 0.3s ease;

    &:hover {
      border-color: ${({ theme }) => theme.primary};
    }
  }
`;

const UserDetails = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${({ theme }) => theme.card};
  border-radius: 16px;
  padding: 16px;
  min-width: 240px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
  opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
  transform: ${({ isOpen }) => (isOpen ? "translateY(0)" : "translateY(-10px)")};
  transition: all 0.3s ease;
  border: 1px solid ${({ theme }) => theme.text_secondary + '20'};

  &:before {
    content: '';
    position: absolute;
    top: -6px;
    right: 20px;
    width: 12px;
    height: 12px;
    background: ${({ theme }) => theme.card};
    transform: rotate(45deg);
    border-left: 1px solid ${({ theme }) => theme.text_secondary + '20'};
    border-top: 1px solid ${({ theme }) => theme.text_secondary + '20'};
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.text_secondary + '20'};

  .MuiAvatar-root {
    width: 45px;
    height: 45px;
    font-size: 1.3rem;
    background: ${({ theme }) => theme.primary};
    border: 2px solid ${({ theme }) => theme.primary + '30'};
  }
`;

const UserName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  font-size: 15px;
`;

const UserEmail = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text_secondary};
`;

const LogoutButton = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.text_secondary};
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  
  &:hover {
    color: #e74c3c;
    background: rgba(231, 76, 60, 0.1);
  }

  svg {
    font-size: 20px;
  }
`;

const MobileMenu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 16px;
  padding: 20px;
  background: ${({ theme }) => theme.bg};
  position: absolute;
  top: 80px;
  right: 0;
  width: 280px;
  transition: all 0.3s ease-in-out;
  transform: ${({ isOpen }) => isOpen ? "translateX(0)" : "translateX(100%)"};
  border-radius: 0 0 20px 20px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  opacity: ${({ isOpen }) => (isOpen ? "100%" : "0")};
  z-index: ${({ isOpen }) => (isOpen ? "1000" : "-1000")};
  border: 1px solid ${({ theme }) => theme.text_secondary + '20'};
  border-top: none;
`;

const ThemeButton = styled(IconButton)`
  color: ${({ theme }) => theme.text_primary};
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.primary + '20'};
    color: ${({ theme }) => theme.primary};
  }
`;

const menuItems = [
  {
    link: "/dashboard",
    icon: <Dashboard />,
    text: "Dashboard",
  },
  {
    link: "/workouts",
    icon: <FitnessCenter />,
    text: "Workouts",
  },
  {
    link: "/blog",
    icon: <Article />,
    text: "Blog",
  },
  {
    link: "/contact",
    icon: <ContactSupport />,
    text: "Contact Us",
  },
];

const Navbar = ({ currentUser }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  
  const handleMobileMenuClick = () => {
    setIsOpen(false);
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileOpen(false);
  };

  const renderNavLink = (item, index) => (
    <StyledNavLink
      key={index}
      to={item.link}
      onClick={handleMobileMenuClick}
    >
      {item.icon}
      <span>{item.text}</span>
    </StyledNavLink>
  );

  return (
    <Nav>
      <NavContainer>
        <Mobileicon onClick={() => setIsOpen(!isOpen)}>
          <MenuRounded sx={{ fontSize: "28px" }} />
        </Mobileicon>
        <NavLogo to="/dashboard" onClick={handleMobileMenuClick}>
          <Logo src={LogoImg} />
          FitTrack
        </NavLogo>

        <MobileMenu isOpen={isOpen}>
          {menuItems.map(renderNavLink)}
        </MobileMenu>

        <NavItems>
          {menuItems.map(renderNavLink)}
        </NavItems>

        <UserContainer>
          <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <ThemeButton onClick={toggleTheme}>
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </ThemeButton>
          </Tooltip>
          <UserProfile onClick={handleProfileClick}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              color="success"
            >
              <Avatar src={currentUser?.img}>{currentUser?.name[0]}</Avatar>
            </Badge>
          </UserProfile>
          <UserDetails isOpen={isProfileOpen}>
            <UserInfo>
              <Avatar src={currentUser?.img}>{currentUser?.name[0]}</Avatar>
              <div>
                <UserName>{currentUser?.name}</UserName>
                <UserEmail>{currentUser?.email}</UserEmail>
              </div>
            </UserInfo>
            <LogoutButton onClick={handleLogout}>
              <ExitToApp />
              Sign Out
            </LogoutButton>
          </UserDetails>
        </UserContainer>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
