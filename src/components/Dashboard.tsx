import React from 'react';
import { Users, Clock, AlertTriangle, Activity } from 'lucide-react';
import Header from './Header'; // Import the Header component

type DashboardProps = {
  totalPatients: number;
  todaysPatients?: number;
  totalHighRisk?: number;
  totalActiveTreatment?: number;
};

export const Dashboard = ({ 
  totalPatients, 
  todaysPatients = 123, 
  totalHighRisk = 123, 
  totalActiveTreatment = 123 
}: DashboardProps) => {
  
  const stats = [
    {
      title: 'Total Patients',
      value: totalPatients,
      icon: Users,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12% from last month',
      trend: 'up' as const,
    },
    {
      title: "Today's Patients",
      value: todaysPatients,
      icon: Clock,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      change: 'Walk-in queue',
      trend: 'neutral' as const,
    },
    {
      title: 'Total High Risk',
      value: totalHighRisk,
      icon: AlertTriangle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
      change: 'Needs attention',
      trend: 'down' as const,
    },
    {
      title: 'Total Active Treatment',
      value: totalActiveTreatment,
      icon: Activity,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: 'Ongoing cases',
      trend: 'neutral' as const,
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Header */}
      <Header 
        title="Dashboard" 
        subtitle="Welcome back, Dr. Tolentino" 
      />
      
      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div 
              key={stat.title} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.trend === 'up' ? 'bg-green-50 text-green-700' :
                  stat.trend === 'down' ? 'bg-red-50 text-red-700' :
                  'bg-gray-50 text-gray-700'
                }`}>
                  {stat.change}
                </span>
              </div>
              
              <h2 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h2>
              <p className="text-3xl font-bold text-gray-800 mb-2">{stat.value.toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Additional content sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
              <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">View all</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">New patient registration</span>
                </div>
                <span className="text-sm text-gray-500">10 min ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Appointment completed</span>
                </div>
                <span className="text-sm text-gray-500">30 min ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">Follow-up scheduled</span>
                </div>
                <span className="text-sm text-gray-500">1 hour ago</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Appointments Today</span>
                <span className="font-semibold text-gray-800">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pending Follow-ups</span>
                <span className="font-semibold text-gray-800">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Available Slots</span>
                <span className="font-semibold text-gray-800">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Monthly Revenue</span>
                <span className="font-semibold text-gray-800">$15,240</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};