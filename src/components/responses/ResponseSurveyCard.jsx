import React from 'react';
import { Card } from '../../style';
import { Link, useParams } from 'react-router-dom';

function ResponseSurveyCard({ title, id }) {


  return (
    <Card style={{ border: "1px solid #ddd", padding: "16px", margin: "8px", borderRadius: "8px" }}>
      <h3>{title}</h3>
      <Link 
        to={`/response/${id}`}
        state={{ title: title }}
      >
        View
      </Link>
    </Card>
  );
}

export default ResponseSurveyCard;
