import styled from "styled-components";

export const Container = styled.div`
  padding: 90px 0;
  margin: 0 auto;
  width: 70%;
`;

export const BlackSection = styled.div`
    position: absolute;
    top:0;
    letf:0;
    background-color: #B4B4B8;
    opacity: 75%;
    width: 100%;
    height: 100vh;
`

export const SurveyModal = styled.div`
  position: absolute;
  top: 30%;
  left: 33%;
  transform: translate(-%50, -%50);
  width: 30%;
  background-color: white;
  border: 1px solid #dedede;
  box-shadow: 10px 10px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  height: 400px;
  padding: 2rem 2rem;
  text-align: center; 
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
  margin-top: 1rem;
`;

export const Input = styled.input`
  line-height: 1rem;
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

export const Textarea = styled.textarea`
  line-height: 1rem;
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
    background-color: #1964ff;
    border: 1px solid #1964ff;
    padding: 1rem 2rem;
    border-radius: 1rem;
    font-size: 1rem;
    color: #fff;
    cursor: pointer;
    transition: 0.3s ease-in-out;
    &:hover{
        background-color: #1964ff;
        color: #fff;
    }
`
export const RelativeDiv = styled.div`
    position: relative;
`

export const Header = styled.div`
  border-bottom: 1px solid #eee;
  box-shadow: 2px 0px 10px 4px #ddd;
`

export const Span = styled.span`
  color: #686D76;
`
export const TextCenter = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 50px 0;
`

export const Card = styled.div`
  border: 1px solid #ddd;
  padding: .5rem 1rem;
  margin: 1rem;
  border-radius: 1.5rem;
`
export const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const CardContainer = styled.dìv`
  width: 50%;
  height: 500px;
  background-color: red;

`