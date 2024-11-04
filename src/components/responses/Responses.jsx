import { useEffect, useState } from 'react'
import { BaseBackground, Container, FlexContainer, RelativeDiv } from '../../style'
import CreateSurvey from '../dashboard/CreateSurvey'
import CreateSurveyModal from '../dashboard/CreateSurveyModal'
import { createPortal } from 'react-dom'
import ResponseSurveyCard from './ResponseSurveyCard'
import { collection, doc, getDocs, query } from 'firebase/firestore'
import { db } from '../../firebase'
// import { useNavigate } from 'react-router-dom'

function Responses() {
    const [portal, setPortal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [responsesList, setResponsesList] = useState([]);

    useEffect(() => {
      const fetchResponses = async () => {
        try {
          const q = query(collection(db, "responses"));
          const querySnapshot = await getDocs(q);
          const fetchedResponses = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));

          setResponsesList(fetchedResponses);
        } catch (error) {
          console.log("yanıtlar alınamadı: ", error);
        }
      }

      fetchResponses();
    }, []);

    const handlePortal = async () => {
      setLoading(true);
      try {
        setPortal(true);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  
    const closePortal = () => {
      setPortal(false);
    }
  
 
  return (
    <BaseBackground>
        <Container>
          <RelativeDiv>
              {
                !loading && 
                <FlexContainer>
                  <div style={{flexGrow: 1}}>
                    {
                      responsesList.length > 0 ? (
                        responsesList.map((response) => (
                          <ResponseSurveyCard 
                            key={response.id}
                            id={response.id}
                            title={response.title}
                          />
                        ))
                      ) : (
                        <p>Henüz doldurulmuş bir anket bulunmamaktadır</p>
                      )
                    }
                  </div>
                  <div style={{flexShrink: 0, marginTop: "1rem"}}>
                  <CreateSurvey handlePortal={handlePortal} />
                  {portal && createPortal(<CreateSurveyModal closePortal={closePortal}/>, document.body)}
                  </div>
                </FlexContainer>
              }
          </RelativeDiv>
        </Container>
    </BaseBackground>
  )
}

export default Responses