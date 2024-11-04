import React from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { BaseBackground, Container } from '../../style';

function ResponseDetail() {
  const location = useLocation();
  const {title} = location.state ||{}
  // const id = useParams();
  console.log(title);
  return (
    <BaseBackground>
      <Container>
        {title} - 
        response detail cnm
      </Container>
    </BaseBackground>
  )
}

export default ResponseDetail