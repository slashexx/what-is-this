"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Users, ArrowUpRight, Globe2, Languages } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

const UserActivitySummary = ({ totalUsers, totalRequests, uniqueLanguages, uniqueLocations }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Total Users</p>
            <h3 className="text-2xl font-bold tracking-tight">{totalUsers}</h3>
          </div>
          <div className="p-2 bg-primary/10 rounded-full">
            <Users className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-muted-foreground">
          <ArrowUpRight className="h-4 w-4 mr-1 text-green-500" />
          <span className="text-green-500 font-medium">12%</span>
          <span className="ml-1">from last month</span>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
            <h3 className="text-2xl font-bold tracking-tight">{totalRequests}</h3>
          </div>
          <div className="p-2 bg-blue-100 rounded-full">
            <ArrowUpRight className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-muted-foreground">
          <ArrowUpRight className="h-4 w-4 mr-1 text-green-500" />
          <span className="text-green-500 font-medium">8%</span>
          <span className="ml-1">from last week</span>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Languages</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {uniqueLanguages.slice(0, 3).map((lang, index) => (
                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {lang}
                </span>
              ))}
              {uniqueLanguages.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{uniqueLanguages.length - 3} more
                </span>
              )}
            </div>
          </div>
          <div className="p-2 bg-violet-100 rounded-full">
            <Languages className="h-5 w-5 text-violet-600" />
          </div>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Locations</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {uniqueLocations.slice(0, 3).map((location, index) => (
                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {location}
                </span>
              ))}
              {uniqueLocations.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{uniqueLocations.length - 3} more
                </span>
              )}
            </div>
          </div>
          <div className="p-2 bg-emerald-100 rounded-full">
            <Globe2 className="h-5 w-5 text-emerald-600" />
          </div>
        </div>
      </Card>
    </div>
  );
};

const formatDate = (isoString) => {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
};

const formatApiKey = (key) => {
  if (!key) return 'N/A';
  return `${key.slice(0, 10)}...${key.slice(-10)}`;
};

const DashBoard = () => {
  const router = useRouter();
  const [userActivities, setUserActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [timeRange, setTimeRange] = useState("24h");
  const [summaryStats, setSummaryStats] = useState({
    totalUsers: 0,
    totalRequests: 0,
    uniqueLanguages: [],
    uniqueLocations: []
  });
 
  useEffect(() => {
    const fetchUserActivity = async () => {
      try {
        const response = await fetch("/api/userActivity");
        const result = await response.json();
        const activities = result.activities || [];

        const formattedActivities = activities.map(activity => ({
          ...activity,
          lastActivity: activity.lastActivity || activity.updatedAt || 'N/A',
          activityType: activity.activityType || 'inactive',
          totalRequests: activity.totalRequests || 0,
          language: activity.language || 'N/A',
          location: activity.location || 'N/A',
          name: activity.name || 'N/A',
          apiKey: activity.apiKey || 'N/A',
          userId: activity.userId
        }));

        console.log('Formatted Activities:', formattedActivities); // For debugging
        setUserActivities(formattedActivities);
        setSummaryStats({
          totalUsers: formattedActivities.length,
          totalRequests: formattedActivities.reduce((sum, activity) => sum + (activity.totalRequests || 0), 0),
          uniqueLanguages: [...new Set(formattedActivities.map(a => a.language).filter(Boolean))],
          uniqueLocations: [...new Set(formattedActivities.map(a => a.location).filter(Boolean))],
        });
      } catch (error) {
        console.error("Error fetching user activity data:", error);
        setUserActivities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserActivity();
  }, []);

  const formatLocation = (location) => {
    if (!location) return 'N/A';
    if (typeof location === 'string') return location;
    return location.label || 'N/A';
  };

  const formatLanguage = (language) => {
    if (!language) return 'N/A';
    if (typeof language === 'string') return language;
    return language.label || 'N/A';
  };

  const UserDetailsModal = ({ user, onClose }) => {
    if (!user) return null;
  
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <Card className="max-w-md w-full p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">User Details</h2>
            <button 
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ×
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-base">{user.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Location</p>
              <p className="text-base">{user.location}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Language</p>
              <p className="text-base">{user.language}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
              <p className="text-base">{user.totalRequests}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Activity</p>
              <p className="text-base">{formatDate(user.lastActivity)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">API Key</p>
              <div className="mt-1 p-2 bg-muted rounded-md font-mono text-sm break-all">
                {user.apiKey}
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button
              onClick={() => router.push(`/users/users-details?userId=${user.userId}`)}
              className="bg-primary text-white hover:bg-primary/90"
            >
              Details
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col gap-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        {/* <Tabs defaultValue="24h" className="w-full" onValueChange={setTimeRange}>
          <TabsList>
            <TabsTrigger value="24h">Last 24 hours</TabsTrigger>
            <TabsTrigger value="7d">Last Week</TabsTrigger>
            <TabsTrigger value="30d">Last Month</TabsTrigger>
            <TabsTrigger value="1y">Last Year</TabsTrigger>
          </TabsList>
        </Tabs> */}
      </div>

      <UserActivitySummary
        totalUsers={summaryStats.totalUsers}
        totalRequests={summaryStats.totalRequests}
        uniqueLanguages={summaryStats.uniqueLanguages}
        uniqueLocations={summaryStats.uniqueLocations}
      />

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      <Card className="mt-8">
        <div className="rounded-md border">
          <div className="p-4">
            <h2 className="text-xl font-semibold">User Activities</h2>
          </div>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  {["Name", "API Key", "Location", "Language", "Total Requests", "Last Activity", "Activity Type"].map((header) => (
                    <th key={header} className="px-4 py-3 text-left font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {userActivities.length > 0 ? (
                  userActivities.map((activity, index) => (
                    <tr 
                      key={index} 
                      className="hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedUser(activity)}
                    >
                      <td className="px-4 py-3">{activity.name || 'N/A'}</td>
                      <td className="px-4 py-3 font-mono">
                        {formatApiKey(activity.apiKey)}
                      </td>
                      <td className="px-4 py-3">
                        {formatLocation(activity.location)}
                      </td>
                      <td className="px-4 py-3">
                        {formatLanguage(activity.language)}
                      </td>
                      <td className="px-4 py-3">{activity.totalRequests}</td>
                      <td className="px-4 py-3">{formatDate(activity.lastActivity)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          activity.activityType === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {activity.activityType}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      No user activities found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashBoard;