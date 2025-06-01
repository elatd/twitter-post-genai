"use client";
import { useEffect, useState } from "react";

interface ScheduledTweet {
  content: string;
  date: string;
  posted: boolean;
}

// Resolve API base URL from environment. When NEXT_PUBLIC_BASE_URL is not set,
// fall back to relative paths so API calls work in any deployment.
const BASE_URL: string = process.env.NEXT_PUBLIC_BASE_URL || "";

const ScheduledTweets = () => {
  const [tweets, setTweets] = useState<ScheduledTweet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const webhook =
          typeof window !== "undefined"
            ? localStorage.getItem("webhookUrl") || ""
            : "";
        const query = webhook ? `?webhookUrl=${encodeURIComponent(webhook)}` : "";
        const response = await fetch(`${BASE_URL}/api/scheduled${query}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTweets(data.tweets || []);
      } catch (error) {
        console.error("Failed to fetch scheduled tweets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTweets();
  }, []);

  if (loading) {
    return <div className="text-gray-300">Loading...</div>;
  }

  if (tweets.length === 0) {
    return <div className="text-gray-300">No scheduled tweets found.</div>;
  }

  return (
    <div className="w-full max-w-2xl flex flex-col gap-2">
      {tweets.map((tweet, idx) => (
        <div
          key={idx}
          className="border-2 border-gray-900 bg-transparent p-2 rounded-lg"
        >
          <p className="text-gray-100 whitespace-pre-wrap">{tweet.content}</p>
          <p className="text-gray-400 text-sm mt-1">
            Date: {tweet.date} {tweet.posted ? "(posted)" : ""}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ScheduledTweets;
