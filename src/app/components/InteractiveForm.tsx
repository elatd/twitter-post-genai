"use client";

import axios, { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {  BsCopy } from "react-icons/bs";
import { RiFileAddLine } from "react-icons/ri";
import { Button } from "./Button";
import PromptForm from "./PromptForm";
import Dropdown from "./Dropdown";
import tweetCategories, { 
  TweetCategory, 
  DEFAULT_LENGTH, 
  LONG_LENGTH,
  YOUTUBE_DEFAULT_LENGTH,
  YOUTUBE_LONG_LENGTH,
  youtubeCategories,
  Platform
} from "../lib/data";

// Resolve API base URL from environment. When NEXT_PUBLIC_BASE_URL is not set,
// fall back to relative paths so API calls work in any deployment.
const BASE_URL: string = process.env.NEXT_PUBLIC_BASE_URL || "";

const InteractiveForm = () => {
  const [platform, setPlatform] = useState<Platform>("twitter");
  const [description, setDescription] = useState<string>("");
  const [contentIdeas, setContentIdeas] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [mounted, setMounted] = useState(false);
  const [longerTweet, setLongerTweet] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({
    length: DEFAULT_LENGTH,
    ...tweetCategories.reduce(
      (acc, category) => ({
        ...acc,
        [category.key]: category.key === "trending" ? "Crypto" : "",
      }),
      {}
    ),
  });
  
  const categories = platform === "twitter" ? tweetCategories : youtubeCategories;
  const defaultLength = platform === "twitter" ? DEFAULT_LENGTH : YOUTUBE_DEFAULT_LENGTH;
  const longLength = platform === "twitter" ? LONG_LENGTH : YOUTUBE_LONG_LENGTH;

  const exportTweet = async (tweet: string) => {
    const loadingToast = toast.loading("Saving tweet...");
    try {
    const payload = {
      timestamp_incoming_webhook: new Date().toISOString(),
      tweet,
      tweet_date: selectedDate,
      webhookUrl,
    };
      const response = await fetch(`${BASE_URL}/api/google-sheets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const message = data?.message || `HTTP error! status: ${response.status}`;
        throw new Error(message);
      }
      
      toast.dismiss(loadingToast);
      toast.success("Saved to Google Sheets", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Error exporting tweet:", error);
      
      if (error instanceof Error) {
        toast.error(`Failed to save tweet: ${error.message}`);
      } else {
        toast.error("Failed to save tweet to Google Sheets");
      }
    }
  };

  useEffect(() => {
    const storedWebhook = typeof window !== 'undefined' ? localStorage.getItem('webhookUrl') || '' : '';
    setWebhookUrl(storedWebhook);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (webhookUrl) {
        localStorage.setItem('webhookUrl', webhookUrl);
      } else {
        localStorage.removeItem('webhookUrl');
      }
    }
  }, [webhookUrl]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    fetchTweetIdeas();
  };

  const fetchTweetIdeas = async () => {
    try {
      const response = await axios.post(
        BASE_URL + "/api/submit",
        { description, options: selectedOptions, apiKey, platform },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to fetch tweet ideas");
      }

      const data = await response.data;

      const ideas = data.content;

      toast(" Generated successfully!", {
        icon: "👏",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      setContentIdeas(ideas);
    } catch (error: unknown) {
      console.error("Error fetching tweet ideas:", error);

      if (isAxiosError(error)) {
        if (error.response?.status == 429) {
          toast.error("Rate limit exceeded. Please try again later.");
        } else toast.error("Failed to generate tweet ideas. Please try again.");
      }
    } finally {
      setLoading(false);
      setDescription("");
      setLongerTweet(false);
      setSelectedOptions({
        length: defaultLength,
        ...categories.reduce((acc, category) => ({ ...acc, [category.key]: '' }), {}),
      });
    }
  };

  if (!mounted) return null;

  return (
    <div className="w-full max-w-2xl bg-inherit relative px-2">
      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => {
              setPlatform("twitter");
              setContentIdeas([]);
              setSelectedOptions({
                length: DEFAULT_LENGTH,
                ...tweetCategories.reduce((acc, category) => ({ ...acc, [category.key]: '' }), {}),
              });
            }}
            className={`px-4 py-2 rounded-md ${
              platform === "twitter" ? "bg-gray-700 text-white" : "text-gray-400"
            }`}
          >
            Twitter
          </button>
          <button
            onClick={() => {
              setPlatform("youtube");
              setContentIdeas([]);
              setSelectedOptions({
                length: YOUTUBE_DEFAULT_LENGTH,
                ...youtubeCategories.reduce((acc, category) => ({ ...acc, [category.key]: '' }), {}),
              });
            }}
            className={`px-4 py-2 rounded-md ${
              platform === "youtube" ? "bg-gray-700 text-white" : "text-gray-400"
            }`}
          >
            YouTube
          </button>
        </div>
      </div>
      <div className="mb-4">
        <input
          type="password"
          placeholder="Enter your OpenAI API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full bg-transparent border-2 border-gray-800 rounded-lg p-2.5 text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-gray-800 placeholder:text-gray-500"
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Google Sheets webhook URL (optional)"
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          className="w-full bg-transparent border-2 border-gray-800 rounded-lg p-2.5 text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-gray-800 placeholder:text-gray-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="tweetDate" className="block text-sm font-semibold text-gray-300 mb-1">
          Tweet Date
        </label>
        <input
          type="date"
          id="tweetDate"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full bg-transparent border-2 border-gray-800 rounded-lg p-2.5 text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
      </div>
      <PromptForm handleSubmit={handleSubmit} description={description} loading={loading} setDescription={setDescription}/>

      <div className="mb-4 flex items-center gap-2">
        <input
          id="longerTweet"
          type="checkbox"
          checked={longerTweet}
          onChange={(e) => {
            const checked = e.target.checked;
            setLongerTweet(checked);
            setSelectedOptions((prev) => ({
              ...prev,
              length: checked ? longLength : defaultLength,
            }));
          }}
          className="h-4 w-4 text-gray-800 border-gray-300 rounded focus:ring-gray-800"
        />
        <label htmlFor="longerTweet" className="text-sm text-gray-300">
          {platform === "twitter" ? "Longer tweets" : "Longer videos"}
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 mb-6">
        {categories.map((category : TweetCategory) => (
          <Dropdown
          key={category.key}
          label={category.name}
          options={category.options}
          selectedOption={selectedOptions[category.key]}
          setSelectedOption={(value) =>
            setSelectedOptions((prev) => ({ ...prev, [category.key]: value || '' }))
          }
          />
        ))}
      </div>

      {loading && (
        <div className="absolute -bottom-8 left-0 right-0 bg-gray-950 bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-300"></div>
        </div>
      )}

      {contentIdeas.length > 0 && contentIdeas.map((content, idx) => (
        <div key={idx} >
        <div className="relative border-2 border-gray-900 bg-transparent mt-2 p-2 rounded-lg  h-auto overflow-y-auto">
          <div className="w-full p-2 pr-24 max-w-2xl bg-inherit">
            <div className="w-full flex flex-col justify-center items-center text-wrap text-base text-gray-100">
              {content}
            </div>
          </div>

          <Button
            onClick={() => {
              navigator.clipboard.writeText(content);
              toast("Copied to clipboard", {
                icon: "📋",
                style: {
                  borderRadius: "10px",
                  background: "#333",
                  color: "#fff",
                },
              });
            }}
            className="text-[12px] flex items-center gap-1 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 absolute right-1 top-1"
            >
            <BsCopy size={15} /> Copy
          </Button>
          <Button
            onClick={() => exportTweet(content)}
            className="text-[12px] flex items-center gap-1 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 absolute right-1 bottom-1"
          >
            <RiFileAddLine size={15} /> Send to Sheets
          </Button>
          <Toaster position="top-center" reverseOrder={false} />
        </div>
      </div>
      )) }
    </div>
  );
};

export default InteractiveForm;