import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export function Register() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <Activity className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Account Provisioning
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          SmartBed Flow requires authorized administrative provisioning.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <div className="rounded-md bg-blue-50 p-4 mb-6">
            <h3 className="text-sm font-medium text-blue-800">
              Registration is restricted
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                To obtain an account, please contact your System Administrator or Facility Manager. 
                Self-registration is disabled for security and compliance reasons.
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <Link
              to="/login"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
