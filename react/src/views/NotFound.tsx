import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 text-white">
            <h1 className="text-9xl font-bold mb-4 animate-bounce">404</h1>
            <p className="text-2xl mb-8 text-center px-4">
                Oops! The page you are looking for does not exist.
            </p>
            <Link
                to="/dashboard"
                className="px-8 py-3 bg-white text-purple-900 font-semibold rounded-lg shadow-lg hover:bg-purple-100 transition-all duration-300 transform hover:scale-105"
            >
                Go to Dashboard
            </Link>
        </div>
    );
};

export default NotFound;