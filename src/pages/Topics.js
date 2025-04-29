import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTopics, updateProblemStatus } from '../services/topicApiCall';
import toast from 'react-hot-toast';

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const [expandedTopic, setExpandedTopic] = useState(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await getTopics();
      setTopics(response.data);
    } catch (error) {
      toast.error('Failed to fetch topics');
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProblemStatusUpdate = async (problemId, status) => {
    try {
      await updateProblemStatus(problemId, status);
      toast.success('Progress updated successfully');
      fetchTopics();
    } catch (error) {
      toast.error('Failed to update progress');
      console.error('Error updating problem status:', error);
    }
  };

  const TopicHeader = ({ topic, isExpanded, onClick }) => (
    <div
      className={`flex items-center justify-between p-4 cursor-pointer transition-all duration-300 ${
        isExpanded ? 'bg-blue-600 text-white shadow-md' : 'bg-cyan-500 text-white hover:bg-cyan-600'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold">{topic.title}</span>
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-white text-blue-600 shadow-sm">
          {topic.status}
        </span>
      </div>
      <span className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
        ▼
      </span>
    </div>
  );

  const SubTopicsTable = ({ problems }) => (
    <div className="overflow-x-auto rounded-lg shadow-sm">
      <table className="w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="w-10 px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Problem</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Leetcode</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Youtube</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Article</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Level</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Progress</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {problems.map((problem) => (
            <tr key={problem._id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={problem.status === 'Completed'}
                  onChange={(e) => handleProblemStatusUpdate(problem._id, e.target.checked ? 'Completed' : 'Pending')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{problem.title}</td>
              <td className="px-4 py-3">
                {problem.leetcodeLink && (
                  <a href={problem.leetcodeLink} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                    Practice
                  </a>
                )}
              </td>
              <td className="px-4 py-3">
                {problem.youtubeLink && (
                  <a href={problem.youtubeLink} target="_blank" rel="noopener noreferrer"
                     className="text-red-600 hover:text-red-800 transition-colors duration-200">
                    Watch
                  </a>
                )}
              </td>
              <td className="px-4 py-3">
                {problem.articleLink && (
                  <a href={problem.articleLink} target="_blank" rel="noopener noreferrer"
                     className="text-green-600 hover:text-green-800 transition-colors duration-200">
                    Read
                  </a>
                )}
              </td>
              <td className={`px-4 py-3 text-sm font-medium ${
                problem.level === 'EASY' ? 'text-green-600' :
                problem.level === 'MEDIUM' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {problem.level}
              </td>
              <td className="px-4 py-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  problem.status === 'Completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {problem.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Topics</h1>
        <p className="text-lg text-gray-600">Explore and master these essential topics</p>
      </div>
      
      <div className="space-y-6">
        {topics.map((topic) => (
          <div key={topic._id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <TopicHeader
              topic={topic}
              isExpanded={expandedTopic === topic._id}
              onClick={() => setExpandedTopic(expandedTopic === topic._id ? null : topic._id)}
            />
            {expandedTopic === topic._id && (
              <div className="p-6 bg-gray-50">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Problems</h3>
                <SubTopicsTable problems={topic.problems} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Topics;