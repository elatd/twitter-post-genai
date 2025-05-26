"use client";

import axios, { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {  BsCopy } from "react-icons/bs";
import { RiFileAddLine } from "react-icons/ri";
import { Button } from "./Button";
import PromptForm from "./PromptForm";
import Dropdown from "./Dropdown";
import tweetCategories, { TweetCategory } from "../lib/data";

const BASE_URL: string =
  process.env.NODE_ENV == "production"
    ? "https://twitter-post-genai.vercel.app"
    : "http://localhost:3000";

const InteractiveForm = () => {
  const [description, setDescription] = useState<string>("");
  const [tweetIdeas, setTweetIdeas] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string,string>>(
    tweetCategories.reduce((acc, category) => ({ ...acc, [category.key]: '' }), {})
  );

  const exportTweet = async (tweet: string) => {
    const loadingToast = toast.loading("Saving tweet...");
    try {
      let response;
      
      if (webhookUrl) {
        // Direct webhook request
        response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tweet }),
        });
      } else {
        // Local API route request
        response = await fetch(`${BASE_URL}/api/google-sheets`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tweet }),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    fetchTweetIdeas();
  };

  const fetchTweetIdeas = async () => {
    try {
      const response = await axios.post(
        BASE_URL + "/api/submit",
        { description, selectedOptions, apiKey },
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
      console.log(data);

      const tweets = data.tweet;

      toast(" Generated successfully!", {
        icon: "👏",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      setTweetIdeas(tweets);
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
      setSelectedOptions(tweetCategories.reduce((acc, category) => ({...acc, [category.key]: ''}), {}));
    }
  };

  if (!mounted) return null;

  return (
    <div className="w-full max-w-2xl bg-inherit relative px-2">
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
      <PromptForm handleSubmit={handleSubmit} description={description} loading={loading} setDescription={setDescription}/>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 mb-6">
        {tweetCategories.map((category : TweetCategory) => (
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

      {tweetIdeas.length > 0 && tweetIdeas.map((tweet,idx) => (
        <div key={idx} >
        <div className="relative border-2 border-gray-900 bg-transparent mt-2 p-2 rounded-lg  h-auto overflow-y-auto">
          <div className="w-full p-2 pr-24 max-w-2xl bg-inherit">
            <div className="w-full flex flex-col justify-center items-center text-wrap text-base text-gray-100">
              {tweet}
            </div>
          </div>

          <Button
            onClick={() => {
              navigator.clipboard.writeText(tweet);
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
            onClick={() => exportTweet(tweet)}
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