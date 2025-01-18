"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BsArrowRight, BsCopy } from "react-icons/bs";
import { GrPowerCycle } from "react-icons/gr";

const BASE_URL: string =
  process.env.NODE_ENV == "production"
    ? "https://twitter-post-genai.vercel.app/"
    : "http://localhost:3000";

const InteractiveForm = () => {
  const [description, setDescription] = useState<string>("");
  const [tweetIdeas, setTweetIdeas] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log(BASE_URL);
    console.log(process.env.NODE_ENV, process.env.NEXT_PUBLIC_BASE_URL);

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
        JSON.stringify({ description }),
        { withCredentials: true }
      );
      console.log(BASE_URL + "/api/submit");
      if (response.status !== 200) {
        throw new Error("Failed to fetch tweet ideas");
      }

      const data = await response.data;

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
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching tweet ideas:", error);
      toast.error("Failed to generate tweet ideas. Please try again.");
    }
  };

  if (!mounted) return null;

  return (
    <div className="w-full  max-w-2xl bg-inherit relative">
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col justify-center items-center relative"
      >
        <textarea
          name="description"
          id="description"
          rows={8}
          placeholder="Write your thoughts here..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full block bg-transparent border-2 border-gray-800 rounded-lg p-2.5 text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-gray-800 placeholder:text-gray-500 caret-gray-300 transition-colors duration-500 ease-in mb-4"
        />
        <button
          type="submit"
          className="absolute bottom-6 right-2 flex items-center bg-transparent rounded-full p-2 text-gray-200 font-medium border-2 border-gray-200 hover:bg-gray-900 hover:text-gray-100 transition-all duration-300 ease-in-out hover:scale-105"
          disabled={loading}
        >
          <BsArrowRight size={20} className="" />
        </button>
      </form>

      {loading && (
        <div className="absolute -bottom-8 left-0 right-0 bg-gray-950 bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-300"></div>
        </div>
      )}

      {tweetIdeas && (
        <div className="relative border-2 border-gray-900 bg-transparent mt-2 p-2 rounded-lg  h-auto overflow-y-auto">
          <div className="w-full p-2 pr-24 max-w-2xl bg-inherit">
            <div className="w-full flex flex-col justify-center items-center text-wrap text-base text-gray-100">
              {tweetIdeas}
            </div>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(tweetIdeas);
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
          </button>
          <button
            onClick={() => {
              toast.promise(fetchTweetIdeas(), {
                loading: "Regenerating...",
                success: <b> Regenerated successfully!</b>,
                error: <b> Could not regenerate.</b>,
              });
            }}
            className="text-[12px] flex items-center gap-1 bg-green-500 text-gray-100 px-2 py-2 rounded-full hover:bg-green-600 absolute right-4 bottom-1"
          >
            <GrPowerCycle size={15} />
          </button>
          <Toaster position="top-center" reverseOrder={false} />
        </div>
      )}
    </div>
  );
};

export default InteractiveForm;
