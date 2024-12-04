import React from 'react';
import { Card, TextCenter } from '../../style';
import { Link, useParams } from 'react-router-dom';

function ResponseSurveyCard({ title, id }) {


  return (
    <Card>
      <div>
        <h3>Anonymous</h3>
        <p>completed <strong>{title}</strong></p>
      </div>
      <Link 
        to={`/response/${id}`}
        state={{ title: title}}
        style={{ border: "1px solid #ddd", padding: "10px", margin: "8px", borderRadius: "8px", color: "#1964ff" }}
      >
        View
      </Link>
    </Card>
  );
}

export default ResponseSurveyCard;
