// ResumeAnalyzer.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, RefreshCw, Brain, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_BASE_URL from "../config/api";

const ResumeAnalyzer = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [jobData, setJobData] = useState({
    companyName: '',
    jobTitle: '',
    notes: '',
    appliedDate: new Date().toISOString().split('T')[0],
  });
  const [addLoading, setAddLoading] = useState(false);

  // Handle form changes in modal
  const handleJobDataChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  // Handle adding job to tracker
  const handleAddToTracker = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/jobs`,
        {
          companyName: jobData.companyName,
          jobTitle: jobData.jobTitle,
          jobDescription: jobDescription,
          matchScore: results.matchScore,
          appliedDate: jobData.appliedDate,
          notes: jobData.notes,
          status: 'Saved',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Job added to tracker!');
      navigate('/tracker');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add job. Please try again.');
    } finally {
      setAddLoading(false);
      setShowModal(false);
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setFile(null);
      setError('Please select a valid PDF file.');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setFile(null);
      setError('File size exceeds 5MB.');
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  // Handle resume analysis
  // Handle resume analysis
  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file || !jobDescription.trim()) {
      setError('Both resume PDF and Job Description are required.');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      // inside handleAnalyze
      const res = await axios.post(
        `${API_BASE_URL}/api/analyze`, // <--- no /analyze here
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setResults(res.data);
      toast.success('Resume analyzed successfully!');
    } catch (err) {
      console.error('Resume analysis error:', err.response || err);
      setError(err.response?.data?.msg || 'Error analyzing resume. Please try again.');
      toast.error(err.response?.data?.msg || 'Error analyzing resume.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full bg-gray-50/30 min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-display">AI Resume Analyzer</h1>
        <p className="text-gray-500 mt-2 text-lg">Upload your resume and paste the job description to see your match score.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl p-6 lg:p-8 border border-gray-100 h-fit transition-all">
          <form onSubmit={handleAnalyze} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Resume (PDF)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-xl hover:border-brand-500 hover:bg-brand-50/30 transition-all bg-gray-50/50 group">
                <div className="space-y-2 text-center">
                  <div className="mx-auto h-12 w-12 text-brand-200 group-hover:text-brand-500 transition-colors flex items-center justify-center bg-white rounded-full shadow-sm ring-1 ring-gray-100">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div className="flex text-sm text-gray-600 justify-center mt-4">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-semibold text-brand-600 hover:text-brand-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept=".pdf"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-400">PDF up to 5MB</p>
                </div>
              </div>
              {file && (
                <div className="mt-3 flex items-center text-sm text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100 font-medium">
                  <FileText className="h-4 w-4 mr-2" />
                  {file.name} attached successfully
                </div>
              )}
            </div>

            {/* Job Description */}
            <div>
              <label htmlFor="jobDescription" className="block text-sm font-semibold text-gray-900 mb-2">
                Job Description
              </label>
              <div className="mt-1">
                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  rows={8}
                  className="block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6 transition-all bg-gray-50/50 focus:bg-white resize-y"
                  placeholder="Paste the target job description here to compare against your resume..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-50 p-4 border border-red-100">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !file || !jobDescription.trim()}
              className={`w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold transition-all active:scale-[0.98] ${loading || !file || !jobDescription.trim()
                ? 'bg-gray-200 cursor-not-allowed text-gray-500 shadow-none'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/30 shadow-lg'
                }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Analyzing...
                </>
              ) : (
                'Analyze Match'
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl p-6 lg:p-8 border border-gray-100 h-full">
          {results ? (
            <div className="space-y-8 animate-fade-in-up">
              {/* Match Score */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-6 font-display">Analysis Results</h3>
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-40 h-40 transform -rotate-90 drop-shadow-sm">
                    <circle
                      className="text-gray-100"
                      strokeWidth="12"
                      stroke="currentColor"
                      fill="transparent"
                      r="70"
                      cx="80"
                      cy="80"
                    />
                    <circle
                      className={`${results.matchScore >= 75
                        ? 'text-emerald-500'
                        : results.matchScore >= 50
                          ? 'text-amber-500'
                          : 'text-red-500'
                        } transition-all duration-1000 ease-out`}
                      strokeWidth="12"
                      strokeDasharray={440}
                      strokeDashoffset={440 - (440 * results.matchScore) / 100}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="70"
                      cx="80"
                      cy="80"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-gray-900 tracking-tight">{results.matchScore}<span className="text-2xl text-gray-400">%</span></span>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">Match</span>
                  </div>
                </div>
                <p className="mt-6 text-base text-gray-600 max-w-sm mx-auto bg-gray-50 rounded-xl p-4 border border-gray-100">
                  {results.matchScore >= 75
                    ? 'Outstanding match! Your resume is highly tailored for this role.'
                    : results.matchScore >= 50
                      ? 'Fair match. Consider integrating some of the missing keywords.'
                      : 'Low match. Significant tailoring is recommended before applying.'}
                </p>
              </div>

              <hr className="border-gray-100" />

              {/* Skills Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Matched Skills */}
                <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100 transition-all hover:shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="bg-emerald-100 p-1.5 rounded-lg mr-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 font-display">Matched Skills</h4>
                  </div>
                  {results.matchedSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {results.matchedSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold bg-white text-emerald-700 border border-emerald-200 shadow-sm shadow-emerald-100"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-emerald-700">No major skills matched.</p>
                  )}
                </div>

                {/* Missing Skills */}
                <div className="bg-rose-50/50 rounded-xl p-5 border border-rose-100 transition-all hover:shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="bg-rose-100 p-1.5 rounded-lg mr-3">
                      <XCircle className="h-5 w-5 text-rose-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 font-display">Missing Skills</h4>
                  </div>
                  {results.missingSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {results.missingSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold bg-white text-rose-700 border border-rose-200 shadow-sm shadow-rose-100"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-rose-700 font-medium">You matched almost everything! Excellent.</p>
                  )}
                </div>
              </div>

              {/* Add to Job Tracker Button */}
              <div className="mt-8 pt-6">
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full flex justify-center items-center py-3.5 px-4 border border-emerald-200 shadow-[0_4px_14px_0_rgb(16,185,129,39%)] rounded-xl text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all active:scale-[0.98]"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Save to Job Tracker
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-12 text-center">
              <div className="bg-gray-50 p-6 rounded-full mb-6 ring-1 ring-gray-100 shadow-inner">
                <Brain className="h-16 w-16 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 font-display mb-2">Ready to Analyze</h3>
              <p className="text-sm text-gray-500 max-w-sm">Upload your resume and the job description to reveal your match score and missing keywords.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Job Modal */}
      {showModal && results && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
              onClick={() => setShowModal(false)}
              aria-hidden="true"
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-2xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-8 border border-gray-100">
              <h3 className="text-xl leading-6 font-bold text-gray-900 font-display">Save to Job Tracker</h3>
              <p className="text-sm text-gray-500 mt-2 border-b border-gray-100 pb-4">Instantly track this opportunity with your match score attached.</p>

              <form onSubmit={handleAddToTracker} className="mt-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    value={jobData.companyName}
                    onChange={handleJobDataChange}
                    className="mt-1 block w-full border border-gray-200 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-gray-50/50 focus:bg-white transition-colors"
                    placeholder="e.g. Google"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Job Title</label>
                  <input
                    type="text"
                    name="jobTitle"
                    required
                    value={jobData.jobTitle}
                    onChange={handleJobDataChange}
                    className="mt-1 block w-full border border-gray-200 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-gray-50/50 focus:bg-white transition-colors"
                    placeholder="e.g. Frontend Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
                  <textarea
                    name="notes"
                    rows={3}
                    value={jobData.notes}
                    onChange={handleJobDataChange}
                    className="mt-1 block w-full border border-gray-200 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-gray-50/50 focus:bg-white transition-colors resize-none"
                    placeholder="Any additional context..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Application Date</label>
                  <input
                    type="date"
                    name="appliedDate"
                    value={jobData.appliedDate}
                    onChange={handleJobDataChange}
                    className="mt-1 block w-full border border-gray-200 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-gray-50/50 focus:bg-white transition-colors"
                  />
                </div>

                <div className="bg-brand-50/50 p-4 rounded-xl text-sm border border-brand-100 flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Status</p>
                    <p className="font-bold text-gray-900">Saved</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">AI Match Score</p>
                    <p className="font-black text-brand-600 text-lg">{results.matchScore}%</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={addLoading}
                    className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-semibold text-white hover:bg-indigo-500 focus:outline-none transition-all active:scale-[0.98] sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-200 disabled:text-gray-500"
                  >
                    {addLoading ? 'Saving...' : 'Save Job'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 transition-all focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;