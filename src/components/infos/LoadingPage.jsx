import { BaseBackground, Container, Flex, Loader } from '../../style';

function LoadingPage() {
  return (
    <BaseBackground>
      <Container>
      <Flex>
        <Loader/>
      </Flex>
    </Container>
    </BaseBackground>
  )
}

export default LoadingPage;