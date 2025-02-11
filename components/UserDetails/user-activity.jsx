'use client';

import React, { useEffect, useState } from "react";
import { ArrowUpDown, ClockIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function UserActivity({ user }) {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const fetchUserActivities = async () => {
      if (!user?.userId) return;
      
      try {
        const response = await fetch(`/api/userActivity`);
        const data = await response.json();
        
        // Filter activities for specific user
        const userActivities = data.activities
          .filter(activity => activity.userId === user.userId)
          .flatMap(activity => {
            // If there are no logs, create one entry with default values
            if (!activity.activityLogs || activity.activityLogs.length === 0) {
              return [{
                _id: activity._id,
                requestType: 'API Request',
                timestamp: activity.updatedAt || activity.createdAt,
                // status: 'pending',
                details: '',
                totalRequests: activity.totalRequests
              }];
            }
            
            // Map all activity logs
            return activity.activityLogs.map(log => ({
              _id: `${activity._id}-${log._id}`,
              requestType: log.type || 'API Request',
              timestamp: log.timestamp || activity.updatedAt || activity.createdAt,
            //   status: log.status || 'pending',
              details: log.message || '',
              totalRequests: activity.totalRequests
            }));
          });

        setActivities(userActivities);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserActivities();
  }, [user?.userId]);

  // Filter and sort logic
  const filteredActivities = activities
    .filter(activity => 
      activity.requestType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.details?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const order = sortOrder === "desc" ? -1 : 1;
      return order * (new Date(b.timestamp) - new Date(a.timestamp));
    });

  if (isLoading) return (
    <div className="bg-[#F3EAE7] p-6 rounded-lg">
      <div className="text-center text-gray-500">Loading activities...</div>
    </div>
  );

  return (
    <div className="bg-[#F3EAE7] p-6 rounded-lg">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Activity History</h2>
            <p className="text-sm text-gray-500">
              Total Requests: {activities[0]?.totalRequests || 0}
            </p>
          </div>
          <button 
            onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
            className="flex items-center gap-2 text-sm text-gray-600"
          >
            <ArrowUpDown className="h-4 w-4" />
            Sort {sortOrder === "desc" ? "Newest" : "Oldest"}
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search activities..."
            className="pl-8 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity, index) => (
              <div 
                key={activity._id || index} 
                className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm"
              >
                <div>
                  <p className="font-medium">{activity.requestType}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ClockIcon className="h-4 w-4" />
                    {new Date(activity.timestamp).toLocaleString()}
                  </div>
                  {activity.details && (
                    <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  activity.status === 'success' ? 'bg-green-100 text-green-600' : 
                  activity.status === 'error' ? 'bg-red-100 text-red-600' :
                  'bg-yellow-100 text-yellow-600'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No activities found for this user
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
