import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { getProgressReport } from '../services/progressApiCall';

const ProgressBar = ({ percentage, color }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
    <div
      className={`h-2.5 rounded-full ${color}`}
      style={{ width: `${percentage}%` }}
    ></div>
  </div>
);

const DifficultyCard = ({ title, percentage, color, bgColor }) => (
  <div className={`${bgColor} rounded-xl shadow-md p-6 transform transition-all duration-300 hover:scale-105`}>
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <span className={`text-2xl font-bold ${color}`}>{percentage}</span>
      </div>
      <ProgressBar percentage={parseInt(percentage)} color={color} />
      <p className="mt-2 text-sm text-gray-600">Problems Completed</p>
    </div>
  </div>
);

const StatCard = ({ title, value, description, icon }) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold mt-2">{value}</p>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      <div className="text-blue-500">{icon}</div>
    </div>
  </div>
);

const Progress = () => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await getProgressReport();
        if (response.success) {
          setProgressData(response.data);
        } else {
          toast.error(response.message || 'Failed to load progress data');
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
        toast.error('Failed to load progress data');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const difficultyConfig = [
    {
      title: 'Easy',
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      value: progressData?.Easy || '0%'
    },
    {
      title: 'Medium',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      value: progressData?.Medium || '0%'
    },
    {
      title: 'Hard',
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      value: progressData?.Hard || '0%'
    }
  ];

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (!progressData) return 0;
    const percentages = [
      parseInt(progressData.Easy || '0'),
      parseInt(progressData.Medium || '0'),
      parseInt(progressData.Hard || '0')
    ];
    return Math.round(percentages.reduce((a, b) => a + b, 0) / 3);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Progress Report</h1>
          <p className="mt-2 text-gray-600">Track your DSA learning journey</p>
        </div>

        {/* Overall Progress Card */}
        <div className="mb-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-4">Overall Progress</h2>
          <div className="bg-white/20 rounded-full h-3 mb-4">
            <div
              className="bg-white rounded-full h-3 transition-all duration-500"
              style={{ width: `${calculateOverallProgress()}%` }}
            ></div>
          </div>
          <div className="text-3xl font-bold">{calculateOverallProgress()}%</div>
          <p className="text-blue-100 mt-1">Average completion across all difficulties</p>
        </div>

        {/* Difficulty Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {difficultyConfig.map((config) => (
            <DifficultyCard
              key={config.title}
              title={config.title}
              percentage={config.value}
              color={config.color}
              bgColor={config.bgColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Progress; 