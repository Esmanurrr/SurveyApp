import styled, { keyframes } from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

export const Container = styled.div`
  padding: 90px 0;
  margin: 0 auto;
  width: 80%;
`;

export const BlackSection = styled.div`
  position: fixed;
  top: 0;
  letf: 0;
  background-color: #b4b4b8;
  opacity: 75%;
  width: 100%;
  min-height: 100vh;
  height: cover;
`;

export const SurveyModal = styled.div`
  position: fixed;
  top: 30%;
  left: 33%;
  transform: translate(-%50, -%50);
  width: 30%;
  min-width: 300px;
  background-color: white;
  border: 1px solid #dedede;
  box-shadow: 10px 10px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  min-height: 400px;
  padding: 2rem 2rem;
  text-align: center;

  @media (max-width: 1020px) {
    width: 40%;
    left: 20%;
    padding: 1.5rem;
  }
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
  margin-top: 1rem;
`;

export const InputRes = styled.input`
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #d2d2d2;
  box-shadow: 0 3px 4px rgba(0, 0, 0, 0.1);
  outline: none;
  width: 100%;
  font-size: 1rem;
  &:focus {
    border-color: #1964ff;
  }
  &::placeholder {
    font-size: 1rem;
  }
`;

export const Textarea = styled.textarea`
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid #d2d2d2;
  box-shadow: 0 3px 4px rgba(0, 0, 0, 0.1);
  outline: none;
  &:focus {
    border-color: #1964ff;
  }
  &::placeholder {
    font-size: 1rem;
  }
`;

export const Button = styled.button`
  background-color: #4a9dec;
  border: 1px solid #4a9dec;
  padding: 1rem 2rem;
  border-radius: 1rem;
  font-size: 1rem;
  color: #fff;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  &:hover {
    background-color: #1964ff;
    color: #fff;
  }
`;
export const RelativeDiv = styled.div`
  position: relative;
`;

export const Header = styled.div`
  border-bottom: 1px solid #eee;
  box-shadow: 0px 5px 10px -5px #d2d2d2;
  background-color: white;
`;

export const Span = styled.span`
  color: #686d76;
`;
export const TextCenter = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 50px 0;
`;

export const Card = styled.div`
  display: flex;
  justify-content: space-between;
  border: 1px solid #ddd;
  padding: 1rem 2rem;
  margin: 0.5rem;
  border-radius: 0.5rem;
  background-color: #fff;
  height: cover;
  a {
    text-decoration: none;
  }
  h2 {
    color: rgb(0, 0, 0);
  }
  span {
    color: #8d9cad;
    font-size: 14px;
    font-weight: 500;
  }
  @media (min-width: 920px) {
    width: 80%;
  }
  @media (max-width: 920px) {
    width: 100%;
  }
`;

export const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  @media (max-width: 920px) {
    flex-direction: column;
  }
`;

export const CardContainer = styled.div`
  max-width: 800px;
  min-height: 300px;
  width: 100%;
  height: cover;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  padding: 2rem;
`;

export const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const LabelDiv = styled.div`
  display: block;
  margin-bottom: 0.5rem;
  color: #686d76;
`;

export const Flex = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  align-items: center;
`;

export const DropdownWrapper = styled.div`
  width: 50%;
  margin: 1.5rem 0;
`;

export const Dropdown = styled.select`
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid rgb(212, 230, 248);
  box-shadow: 0 3px 4px rgba(0, 0, 0, 0.1);
  outline: none;
  width: 100%;
  font-size: 1rem;
  &:focus {
    border-color: #1964ff;
  }
  &::placeholder {
    font-size: 1rem;
  }
`;

export const AddOptionsButton = styled.button`
  padding: 0.5rem;
  color: white;
  background-color: #1964ff;
  border: 1px solid #1964ff;
  border-radius: 0.5rem;
  cursor: pointer;
`;

export const DeleteButton = styled.button`
  padding: 1rem;
  background-color: #fdf2f2;
  border: 1px solid #f1d4d4;
  color: #ff313e;
  border-radius: 9px;
  box-shadow: 0px 7px 12px rgba(0, 0, 0, 0.03);
  cursor: pointer;
`;

export const EditButton = styled.button`
  padding: 1rem;
  border: 1px solid #ececf4;
  border-radius: 9px;
  background-color: #fff;
  box-shadow: 0px 7px 12px rgba(0, 0, 0, 0.03);
  margin-right: 1rem;
  cursor: pointer;
`;

export const SurveyWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const SurveyDef = styled.div`
  width: 30%;
  float: left;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  background-color: white;
  border-right: 1px solid rgb(212, 230, 248);
  box-shadow: 0px 7px 12px rgb(0 0 0 / 3%);
  padding-inline: 3rem;
  flex-direction: column;
  justify-content: center;
  z-index: 10;
`;

export const Question = styled.div`
  float: left;
  width: 100%;
  font-weight: 500;
  font-size: 17px;
  color: #0a213e;
  margin-block: 0.5rem;
`;

export const BaseWrapper = styled.div`
  background-color: #f0f4f8;
  width: 100%;
  min-height: 100vh;
  height: cover;
  display: flex;
  align-items: center;
  margin-left: 30%;
  padding-left: 2rem;
`;
export const SubmitButton = styled(Button)`
  padding: 0.5rem 1rem;
  margin-top: 2rem;
`;
export const ShortInput = styled(InputRes)`
  width: 70%;
`;
export const ShortTextarea = styled(Textarea)`
  width: 70%;
`;
export const ShortDropdown = styled(Dropdown)`
  width: 70%;
`;

export const NavbarWrapper = styled.div`
  padding-block: 2rem;
  padding-inline: 5rem;
  gap: 10px;
  border-bottom: 1px solid rgb(212, 230, 248);
  background-color: #fff;
  z-index: 11;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  a {
    text-decoration: none;
    color: #8285a5;
    font-weight: 500;
    &:hover {
      color: #1964ff;
    }
  }
  ul {
    display: flex;
    gap: 3rem;
  }
  ul > li {
    list-style: none;
  }
`;

export const BaseBackground = styled.div`
  background-color: #f0f4f8;
  min-height: 80vh;
  height: auto;
`;

export const moving = keyframes`
  50% {
    width: 100%;
  }

  100% {
    width: 0;
    right: 0;
    left: unset;
  }
`;

export const Loader = styled.div`
  display: block;
  --height-of-loader: 4px;
  --loader-color: #0071e2;
  width: 130px;
  height: var(--height-of-loader);
  border-radius: 30px;
  background-color: rgba(0, 0, 0, 0.2);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    background: var(--loader-color);
    top: 0;
    left: 0;
    width: 0%;
    height: 100%;
    border-radius: 30px;
    animation: ${moving} 1s ease-in-out infinite;
  }
`;

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f4f8;
  padding: 1rem;
`;

export const LoginDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  text-align: center;

  h1 {
    margin-bottom: 1.5rem;
    color: #333333;
    font-size: 1.8rem;
  }

  p {
    margin-top: 1rem;
    font-size: 0.9rem;
    color: #666666;

    a {
      color: #0071e2;
      font-weight: bold;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  button {
    margin-top: 1rem;
    width: 100%;
    padding: 0.8rem;
    border: none;
    background-color: #4a9dec;
    color: white;
    font-size: 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #1964ff;
    }
  }
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

export const Input = styled.input`
  border: 2px solid transparent;
  width: 15em;
  height: 2.5em;
  padding-left: 0.8em;
  outline: none;
  overflow: hidden;
  background-color: #f3f3f3;
  border-radius: 10px;
  transition: all 0.5s;

  &:hover,
  &:focus {
    border: 2px solid #0071e2;
    box-shadow: 0px 0px 0px 7px rgba(74, 157, 236, 0.2);
    background-color: white;
  }
`;

export const StyledButton = styled.button`
  background-color: #4a9dec;
  border: 1px solid #4a9dec;
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  border-radius: 1rem;
  font-size: 1rem;
  text-decoration: none;
  color: #fff;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  &:hover {
    background-color: #1964ff;
    color: #fff;
  }
`;

export const LinkButton = styled.a`
  background-color: #4a9dec;
  border: 1px solid #4a9dec;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 1rem;
  text-decoration: none;
  color: #fff;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  &:hover {
    background-color: #1964ff;
    color: #fff;
  }
`;

export const FooterWrapper = styled.div`
  padding-block: 2rem;
  padding-inline: 5rem;
  gap: 10px;
  border-top: 1px solid rgb(212, 230, 248);
  background-color: #fff;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const AuthSubmitButton = styled.button`
  margin-top: 1rem;
  width: 100%;
  padding: 0.8rem;
  border: none;
  background-color: #4a9dec;
  color: white;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1964ff;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const AuthLink = styled(Link)`
  color: #4a9dec;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

export const AuthText = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: #666666;
  font-size: 0.9rem;
`;
