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
  background-color: #f8fafc;
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
  padding: 3rem 2rem 2rem;
  background-color: #fff;
  border-top: 1px solid rgb(212, 230, 248);
  width: 100%;
`;

export const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  padding: 0 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  p {
    color: #718096;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0;
  }
`;

export const FooterTitle = styled.h3`
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
`;

export const FooterLink = styled(Link)`
  color: #718096;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;

  &:hover {
    color: #4a9dec;
  }
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

export const HorizontalListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 200px);

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

export const HorizontalCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  transition: all 0.3s ease;
  border: 1px solid #eef2f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const CardContent = styled.div`
  flex: 1;
  min-width: 0;
  padding: 1.5rem;
`;

export const CardTitle = styled.h3`
  color: #2d3748;
  font-size: 1.25rem;
  margin: 0;
  margin-bottom: 0.5rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

export const CardDescription = styled.p`
  color: #718096;
  font-size: 0.875rem;
  margin: 0;
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

export const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;

export const CardMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #718096;
  font-size: 0.875rem;

  svg {
    width: 16px;
    height: 16px;
    color: #4a9dec;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    gap: 0.35rem;
  }
`;

export const CardActions = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

export const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    opacity: 0.7;
  }

  svg {
    width: 20px;
    height: 20px;
  }

  ${(props) =>
    props.$primary &&
    `
    background-color: #4a9dec;
    color: white;
    border: none;
    
    &:hover {
      background-color: #1964ff;
    }
  `}

  ${(props) =>
    props.$secondary &&
    `
    background-color: white;
    color: #4a9dec;
    border: 1px solid #4a9dec;
    
    &:hover {
      background-color: #f8fafc;
    }
  `}
  
  ${(props) =>
    props.$danger &&
    `
    background-color: white;
    color: #e53e3e;
    border: 1px solid #e53e3e;
    
    &:hover {
      background-color: #fff5f5;
    }
  `}

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.75rem;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eef2f6;

  h1 {
    margin: 0;
    color: #2d3748;
    font-size: 1.8rem;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const EmptyStateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  text-align: center;
  margin-top: 2rem;

  svg {
    width: 120px;
    height: 120px;
    color: #4a9dec;
    margin-bottom: 2rem;
  }

  h2 {
    color: #2d3748;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  p {
    color: #718096;
    font-size: 1.1rem;
    margin-bottom: 2rem;
    max-width: 500px;
  }
`;

export const CardQuestion = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background: #4a9dec;
  }
`;

export const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

export const QuestionInfo = styled.div`
  flex: 1;
`;

export const QuestionTitle = styled.h3`
  color: #2d3748;
  font-size: 1.1rem;
  margin: 0;
  font-weight: 500;
`;

export const QuestionType = styled.div`
  background: #edf2f7;
  color: #4a5568;
  padding: 0.4rem 0.8rem;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-top: 0.5rem;
  display: inline-block;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const OptionsContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const OptionBadge = styled.span`
  background: #f7fafc;
  color: #4a5568;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.85rem;
`;

export const QuestionListContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  min-height: calc(100vh - 200px);
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;

  h2 {
    color: #2d3748;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  @media (min-width: 768px) {
    padding: 3rem;
    margin: 2rem auto;
  }

  h3 {
    color: #2d3748;
    font-size: 1.25rem;
    margin-bottom: 1rem;
    font-weight: 600;

    @media (min-width: 768px) {
      font-size: 1.5rem;
    }
  }

  p {
    color: #718096;
    margin-bottom: 2rem;
    font-size: 0.9rem;
    line-height: 1.5;

    @media (min-width: 768px) {
      font-size: 1rem;
    }
  }

  img {
    width: 150px;
    height: auto;
    margin-bottom: 1.5rem;

    @media (min-width: 768px) {
      width: 200px;
      margin-bottom: 2rem;
    }
  }
`;

export const QuestionGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const ResponseCard = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
    transform: translateY(-2px);
  }
`;

export const QuestionSection = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: white;
  display: flex;
  align-items: center;
`;

export const QuestionNumber = styled.span`
  color: #4a9dec;
  font-weight: 600;
  margin-right: 0.75rem;
  background: #4a9dec0d;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.9rem;
  border: 1px solid #e2e8f0;
`;

export const QuestionText = styled.span`
  color: #2d3748;
  font-weight: 500;
  font-size: 1.1rem;
`;

export const AnswerSection = styled.div`
  padding: 1.5rem;
  background: #f8fafc;
`;

export const Answer = styled.div`
  color: #4a5568;
  font-size: 1rem;
  line-height: 1.5;

  &.unanswered {
    color: #a0aec0;
    font-style: italic;
  }
`;

export const MultipleAnswer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const AnswerBadge = styled.span`
  background: white;
  color: #4a5568;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #2d3748;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderTitle = styled.div`
  h1 {
    margin: 0;
    margin-bottom: 0.25rem;
  }
`;

export const TimeStamp = styled.div`
  color: #718096;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  min-height: calc(100vh - 200px);
`;
