
class Requests {
    static async get(url) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Veri alınamadı");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    }
  
    static async post(url, data) {
      try {
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify(data),
          headers: { "Content-type": "application/json" },
        });
        if (!response.ok) {
          throw new Error("Hata alındı");
        }
        const responseData = await response.json();
        return responseData;
      } catch (error) {
        throw new Error(error.message);
      }
    }
  
    static async put(url, data) {
      try {
        const response = await fetch(url, {
          method: "PUT",
          body: JSON.stringify(data),
          headers: { "Content-type": "application/json" },
        });
        if (!response.ok) {
          throw new Error("Hata alındı");
        }
        const responseData = await response.json();
        return responseData;
      } catch (error) {
        throw new Error(error.message);
      }
    }
  
    static async delete(url) {
      try {
        const response = await fetch(url, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Veri silinemedi");
        }
        return "Veri silindi";
      } catch (error) {
        throw new Error(error.message);
      }
    }
  }

  export default Requests;