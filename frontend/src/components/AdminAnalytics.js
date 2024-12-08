import React, { useEffect, useState } from "react";
import {
  getActiveUsers,
  getPopularResources,
  getEngagementSummary,
  getTopContributors,
} from "../services/api";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  LinearScale,
  CategoryScale,
  LineElement,
  PointElement,
} from "chart.js";
import AdminSidebar from "./AdminSidebar";

// Register chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  LinearScale,
  CategoryScale,
  LineElement,
  PointElement
);

const AdminAnalytics = ({ navigateTo }) => {
  const [timeframe, setTimeframe] = useState("7d");
  const [activeUsers, setActiveUsers] = useState(0);
  const [popularResources, setPopularResources] = useState([]);
  const [engagementSummary, setEngagementSummary] = useState({
    messageCount: 0,
    resourceCount: 0,
    activeGroups: 0,
  });
  const [topContributors, setTopContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);

        const activeUsersResponse = await getActiveUsers(timeframe);
        const popularResourcesResponse = await getPopularResources();
        const engagementSummaryResponse = await getEngagementSummary();
        const topContributorsResponse = await getTopContributors();

        setActiveUsers(activeUsersResponse.activeUsers);
        setPopularResources(
          Array.isArray(popularResourcesResponse)
            ? popularResourcesResponse
            : []
        );
        setEngagementSummary({
          messageCount: engagementSummaryResponse.messageCount || 0,
          resourceCount: engagementSummaryResponse.resourceCount || 0,
          activeGroups: engagementSummaryResponse.activeGroups || 0,
        });
        setTopContributors(
          Array.isArray(topContributorsResponse)
            ? topContributorsResponse
            : []
        );

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch analytics data:", err);
        if (err.response?.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          navigateTo("login");
        }
        setError("Failed to fetch analytics data.");
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeframe, navigateTo]);

  if (loading) return <p>Loading analytics data...</p>;
  if (error) return <p>{error}</p>;

  // Chart Data
  const activeUsersData = {
    labels: ["Active Users"],
    datasets: [
      {
        label: `Active Users (${timeframe})`,
        data: [activeUsers],
        backgroundColor: "#6c63ff",
        borderColor: "#3f51b5",
        borderWidth: 1,
      },
    ],
  };

  const popularResourcesData = {
    labels: popularResources.map(
      (resource) => resource.title || "Unknown Title"
    ),
    datasets: [
      {
        label: "Resource Views",
        data: popularResources.map((resource) => resource.views || 0),
        backgroundColor: "#4b79a1",
        borderColor: "#283e51",
        borderWidth: 1,
      },
    ],
  };

  const engagementSummaryData = {
    labels: ["Messages", "Resources", "Groups"],
    datasets: [
      {
        label: "Engagement Summary",
        data: [
          engagementSummary.messageCount,
          engagementSummary.resourceCount,
          engagementSummary.activeGroups,
        ],
        backgroundColor: ["#66bb6a", "#ffa726", "#42a5f5"],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const topContributorsData = {
    labels: topContributors.map((contributor) => contributor.fullName),
    datasets: [
      {
        label: "Message Count",
        data: topContributors.map((contributor) => contributor.messageCount),
        backgroundColor: "#6a1b9a",
        borderColor: "#4a148c",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar navigateTo={navigateTo} />
      <div className="dashboard-content">
        <h1>Admin Analytics</h1>

        {/* Timeframe Filter */}
        <div className="timeframe-filter">
          <label htmlFor="timeframe">Select Timeframe:</label>
          <select
            id="timeframe"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>

        {/* Analytics Grid */}
        <div className="analytics-grid">
          {/* Active Users */}
          <div className="analytics-card">
            <h2>Active Users</h2>
            <Bar data={activeUsersData} options={{ responsive: true }} />
          </div>

          {/* Popular Resources */}
          <div className="analytics-card">
            <h2>Popular Resources</h2>
            <Line data={popularResourcesData} options={{ responsive: true }} />
          </div>

          {/* Engagement Summary */}
          <div className="analytics-card">
            <h2>Engagement Summary</h2>
            <Pie data={engagementSummaryData} options={{ responsive: true }} />
          </div>

          {/* Top Contributors */}
          <div className="analytics-card">
            <h2>Top Contributors</h2>
            <Bar data={topContributorsData} options={{ responsive: true }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
