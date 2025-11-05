import styled from "styled-components";
 
export const StyledNav = styled.nav`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 1rem 0;
  height: 50px;
`;
 
export const NavLink = styled.a`
  text-decoration: none;
  color: white;
  font-size: 1.2rem;
  width: 100px;
  font-weight: 600;
  text-align: center;
  background: rgba(255, 172, 172, 0.6);
  color: rgb(242554, 255, 255);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.3s ease;
  letter-spacing: 1px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.17);

  &:hover {
    opacity: 0.8;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
    color: rgb(0, 247, 255);
  }
`;
