const API_BASE_URL = "http://localhost:5000";

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}
// =====================================================
// LESSON API
// =====================================================

async function getLessonProgress(userId) {
  return await apiRequest(`/api/lessons/progress/${userId}`);
}

async function saveLessonProgress(progressData) {
  return await apiRequest("/api/lessons/progress", {
    method: "POST",
    body: JSON.stringify(progressData)
  });
}