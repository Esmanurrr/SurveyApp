import { BaseBackground, Container, Flex, Loader } from '../../style';

function LoadingPage() {
  return (
    <BaseBackground style={{height:"100vh"}}>
      <Container>
      <Flex>
        <Loader/>
      </Flex>
    </Container>
    </BaseBackground>
  )
}

export default LoadingPage;