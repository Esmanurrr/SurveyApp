import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"; // Eğer API'den veri alıyorsanız kullanılır

const FillSurvey = () => {
  const { surveyId } = useParams(); // URL'deki surveyId'yi al
  const [survey, setSurvey] = useState(null); // Anket verisini tutacak state
  const [responses, setResponses] = useState({}); // Yanıtları tutmak için state
  const [loading, setLoading] = useState(true); // Yüklenme durumunu takip et

  useEffect(() => {
    // API veya JSON dosyasından anket verilerini çek
    axios.get(`http://localhost:4000/surveys/${surveyId}`)
      .then((response) => {
        setSurvey(response.data); // Gelen veriyi survey state'ine aktar
        setLoading(false); // Yüklenme durumu tamamlandı
      })
      .catch((error) => {
        console.error("Anket verisi çekilemedi:", error);
        setLoading(false); // Yüklenme durumu tamamlandı, hata durumunda da
      });
  }, [surveyId]);

  // Eğer veriler yükleniyorsa "Loading..." mesajını göster
  if (loading) {
    return <p>Loading survey...</p>;
  }

  // Eğer survey ya da survey.questions undefined ise, hata mesajı göster
  if (!survey || !survey.questions) {
    return <p>Survey data is missing or corrupted.</p>;
  }

  // Her soruya verilen yanıtı güncellemek için kullanılır
  const handleResponseChange = (questionId, value) => {
    setResponses({
      ...responses,
      [questionId]: value,
    });
  };

  // Formu gönderme işlemi
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted responses:", responses);
    // Bu verileri API'ye veya sunucuya göndermek için burada işlem yapılabilir
  };

  return (
    <div className="p-8 border rounded-lg shadow-md max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">{survey.title}</h1>
      <p className="text-gray-600 mb-6">{survey.description}</p>

      <form onSubmit={handleSubmit}>
        {survey.questions.map((question) => (
          <div key={question.id} className="mb-6">
            <label className="block font-semibold mb-2">{question.name}</label>

            {/* Tek seçimli (Single Choice) sorular */}
            {question.type === "Single Choice" && (
              <select
                className="border px-4 py-2 w-full"
                value={responses[question.id] || ""}
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
              >
                <option value="">Bir seçenek seçin</option>
                {question.options
                  .filter((option) => option !== "") // Boş seçenekleri filtrele
                  .map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
            )}

            {/* Çoklu seçimli (Multiple Choice) sorular */}
            {question.type === "Multiple Choice" && (
              <div className="flex flex-col">
                {question.options
                  .filter((option) => option !== "") // Boş seçenekleri filtrele
                  .map((option) => (
                    <label key={option} className="mb-1">
                      <input
                        type="checkbox"
                        value={option}
                        checked={responses[question.id]?.includes(option) || false}
                        className="mr-2"
                        onChange={(e) => {
                          const selectedOptions = responses[question.id] || [];
                          if (e.target.checked) {
                            handleResponseChange(question.id, [
                              ...selectedOptions,
                              option,
                            ]);
                          } else {
                            handleResponseChange(
                              question.id,
                              selectedOptions.filter((v) => v !== option)
                            );
                          }
                        }}
                      />
                      {option}
                    </label>
                  ))}
              </div>
            )}

            {/* Metin yanıtları (Text Response) */}
            {question.type === "Text Response" && (
              <input
                type="text"
                className="border px-4 py-2 w-full"
                placeholder="Cevabınızı girin"
                value={responses[question.id] || ""}
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
              />
            )}

            {/* Uzun metin yanıtları (Long Text Response) */}
            {question.type === "Long Text Response" && (
              <textarea
                className="border px-4 py-2 w-full"
                rows={4}
                placeholder="Cevabınızı yazın"
                value={responses[question.id] || ""}
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
              />
            )}
          </div>
        ))}

        {/* Formu gönderme butonu */}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FillSurvey;
