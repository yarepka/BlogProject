class Server {
  // Get data from the server
  // localhost:8080/posts
  static async get(url, additionalHeaders = {}) {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...additionalHeaders,
        "Content-type": "application/json",
        "Accept": "application/json"
      }
    });
    const data = await response.json();
    return data;
  }

  // Create, saving data in DataBase
  // localhost:8080/posts
  static async post(url, body, additionalHeaders = {}) {
    const headers = {
      ...additionalHeaders,
      "Content-type": "application/json",
      "Accept": "application/json"
    };

    console.log("Headers: ", headers);

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
    });

    console.log("RESPONSE", response);

    // Saved data
    const data = await response.json();

    console.log("DATA", data);
    return data;
  }

  // Update, sending the entire entry to replace the previouse one
  // localhost:8080/posts/:id
  static async put(url, body) {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(body)
    });

    // Updated data
    const data = await response.json();

    return data;
  }

  // Update, sending the peace of data, which needs to be updated, instead of entire entry
  // localhost:8080/posts/:id
  static async patch(url, body) {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(body)
    });

    // Updated data
    const data = await response.json();

    return data;
  }

  // Delete data from database
  // localhost:8080/posts/:id
  static async delete(url) {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json"
      }
    });

    // Deleted object
    const data = response.json();

    return data;
  }
}