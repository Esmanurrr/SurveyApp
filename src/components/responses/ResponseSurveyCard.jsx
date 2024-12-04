import React from 'react';
import { Card, TextCenter } from '../../style';
import { Link, useParams } from 'react-router-dom';

function ResponseSurveyCard({ title, id }) {


  return (
    <Card style={{ border: "1px solid #ddd", padding: "16px", margin: "8px", borderRadius: "8px" }}>
      <div>
        <h3>Anonymous</h3>
        <p>completed <strong>{title}</strong></p>
      </div>
      <Link 
        to={`/response/${id}`}
        state={{ title: title}}
      >
        View
      </Link>
    </Card>
  );
}

export default ResponseSurveyCard;
