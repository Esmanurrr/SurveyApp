import React from 'react'
import { BaseBackground, Container, TextCenter } from '../../style'

function NotFound() {
  return (
    <BaseBackground>
        <Container>
            <TextCenter>
                <h1>404 - Sorry! There is nothing here...</h1>
            </TextCenter>
        </Container>
    </BaseBackground>
  )
}

export default NotFound