import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Brain, LineChart } from 'lucide-react';

const Landing = () => {
    return (
        <div className="bg-white overflow-hidden">
            {/* Hero Section */}
            <div className="relative isolate pt-14 pb-20 sm:pt-24 sm:pb-32 lg:pb-40">
                {/* Background Gradient */}
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#6179db] to-[#aabfee] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        {/* <div className="mb-8 flex justify-center">
                            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 shadow-sm backdrop-blur-sm bg-white/50">
                                Meet your new career co-pilot.{' '}
                                <Link to="/register" className="font-semibold text-brand-600"><span className="absolute inset-0" aria-hidden="true" />Read more <span aria-hidden="true">&rarr;</span></Link>
                            </div>
                        </div> */}

                        <div className="mb-8 flex justify-center">
                            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 shadow-sm backdrop-blur-sm bg-white/50">
                                “Opportunities don’t wait. Neither should you.”{' '}
                                <Link to="/register" className="font-semibold text-brand-600"><span className="absolute inset-0" aria-hidden="true" />Read more <span aria-hidden="true">&rarr;</span></Link>
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl font-display">
                            Supercharge your job search with AI
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600 font-light">
                            Analyze your resume against job descriptions, track your applications in a modern Kanban board, and land your dream job faster.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-y-4 sm:gap-y-0 sm:gap-x-6">
                            <Link
                                to="/register"
                                className="w-full sm:w-auto text-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Get started
                            </Link>
                            <Link
                                to="/login"
                                className="w-full sm:w-auto text-center text-sm rounded-full px-6 py-3 font-semibold leading-6 text-gray-900 bg-gray-200 hover:bg-gray-300 transition-colors shadow-sm"
                            >
                                Log in <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Section */}
            <div className="relative py-24 sm:py-32 overflow-hidden border-t border-gray-100 bg-white shadow-[inset_0_20px_40px_-20px_rgba(0,0,0,0.03)]">
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 -m-48 w-96 h-96 bg-brand-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-semibold leading-7 text-brand-600 uppercase tracking-widest text-xs">Work Smarter</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-display">
                            Everything you need to manage applications
                        </p>
                        <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600 mx-auto">
                            Stop using spreadsheets. Start using an intelligent workspace designed specifically for job seekers.
                        </p>
                    </div>

                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-5xl">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-12 gap-y-16 lg:max-w-none lg:grid-cols-3">
                            {/* Feature 1 */}
                            <div className="flex flex-col items-start bg-white p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="rounded-xl bg-brand-50 p-3 mb-6 ring-1 ring-brand-100">
                                    <Brain className="h-6 w-6 text-brand-600" aria-hidden="true" />
                                </div>
                                <dt className="text-lg font-semibold leading-7 text-gray-900 mb-2 font-display">
                                    AI Resume Analyzer
                                </dt>
                                <dd className="text-base leading-7 text-gray-600">
                                    Instantly match your resume skills against any job description and discover missing keywords before you apply.
                                </dd>
                            </div>

                            {/* Feature 2 */}
                            <div className="flex flex-col items-start bg-white p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="rounded-xl bg-emerald-50 p-3 mb-6 ring-1 ring-emerald-100">
                                    <Briefcase className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                                </div>
                                <dt className="text-lg font-semibold leading-7 text-gray-900 mb-2 font-display">
                                    Kanban Job Tracker
                                </dt>
                                <dd className="text-base leading-7 text-gray-600">
                                    Easily drag and drop your applications through Saved, Applied, Interview, Offer, and Rejected stages.
                                </dd>
                            </div>

                            {/* Feature 3 */}
                            <div className="flex flex-col items-start bg-white p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="rounded-xl bg-amber-50 p-3 mb-6 ring-1 ring-amber-100">
                                    <LineChart className="h-6 w-6 text-amber-600" aria-hidden="true" />
                                </div>
                                <dt className="text-lg font-semibold leading-7 text-gray-900 mb-2 font-display">
                                    Analytics Dashboard
                                </dt>
                                <dd className="text-base leading-7 text-gray-600">
                                    Visualize your application progress with beautiful charts and data insights to keep you motivated.
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            {/* Modern Footer */}
            <footer className="bg-gray-50 border-t border-gray-200 py-12 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-between">
                        {/* Brand */}
                        <div className="flex items-center space-x-2 text-brand-600 font-bold text-xl justify-center md:justify-start">
                            <div className="p-1.5 bg-brand-100 rounded-lg">
                                <Briefcase className="h-5 w-5 text-brand-700" />
                            </div>
                            <span className="font-display tracking-tight text-gray-900">Job<span className="text-brand-600">Sculptor</span></span>
                        </div>

                        {/* Copyright */}
                        <div className="text-center text-sm font-medium text-gray-500">
                            &copy; {new Date().getFullYear()} JobSculptor Assistant. All rights reserved.
                        </div>

                        {/* Social/Links */}
                        <div className="flex justify-center md:justify-end space-x-6">
                            <a href="#" className="text-gray-400 hover:text-brand-600 transition-colors">
                                <span className="sr-only">Twitter</span>
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-brand-600 transition-colors">
                                <span className="sr-only">GitHub</span>
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
