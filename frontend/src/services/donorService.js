const API_URL = "http://localhost:8080/api/donors";
async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  if (response.status === 204) return null;

  return response.json();
}

export const getDonors = () => request(API_URL);

export const searchDonors = (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value && value.trim()) params.set(key, value.trim());
  });

  const query = params.toString();
  return request(query ? `${API_URL}?${query}` : API_URL);
};

export const createDonor = (donor) =>
  request(API_URL, {
    method: "POST",
    body: JSON.stringify(donor),
  });

export const updateDonor = (id, donor) =>
  request(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(donor),
  });

export const deleteDonor = (id) =>
  request(`${API_URL}/${id}`, {
    method: "DELETE",
  });