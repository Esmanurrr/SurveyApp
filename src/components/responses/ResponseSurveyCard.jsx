import React from 'react';
import { Card } from '../../style';

function ResponseSurveyCard({ title }) {
  return (
    <Card style={{ border: "1px solid #ddd", padding: "16px", margin: "8px", borderRadius: "8px" }}>
      <h3>{title}</h3>
      <p>Yanıtlanma Tarihi: {title}</p>
    </Card>
  );
}

export default ResponseSurveyCard;
