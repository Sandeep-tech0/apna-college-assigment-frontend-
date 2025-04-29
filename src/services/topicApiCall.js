import { apiRequest } from "./apiRequest";

// Get all topics
export const getTopics = async () => {

  const api = await apiRequest({
      url: "/topic",
      method: "get",
      header: true,
  });
  return api.data;
};

// Get topic by id
export const getTopicById = async (topicId) => {
  const api = await apiRequest({
    url: `/topic/${topicId}`,
    method: "get",
    header: true,
  });
  return api.data;
};  

// Get all problems by topic id
export const getProblemsByTopicId = async (topicId) => {
  const api = await apiRequest({
    url: `/topic/${topicId}/problems`,  
    method: "get",
    header: true,
  });
  return api.data;
};  

// Get problem by id
export const getProblemById = async (problemId) => {
  const api = await apiRequest({
    url: `/problem/${problemId}`,
    method: "get",
    header: true,
  }); 
  return api.data;
};

export const updateProblemStatus = async (problemId, status) => {
  const api = await apiRequest({
    url: `/topic/problems/${problemId}/status`,
    method: "put",
    header: true,
    body: { status },
  });
  return api.data;
};
