"use client";
import { useState } from "react";
import { RiStarFill, RiTwitterXLine } from "react-icons/ri";
import InteractiveForm from "./components/InteractiveForm";
import ScheduledTweets from "./components/ScheduledTweets";

export default function Home() {
  const [tab, setTab] = useState<"generate" | "scheduled">("generate");

  return (
    <div className="flex flex-col items-center  justify-center min-h-screen container mx-auto ">
      <RiTwitterXLine size={50} color="white" className="mb-4" />
      <div className=" w-full flex flex-col items-center  justify-center sm:mx-0">
        <h3 className="text-2xl font-bold text-gray-100 flex items-center text-center">
          Effortless Tweet Inspiration{" "}
          <RiStarFill size={20} className="inline ml-2" />
        </h3>
        <p className="text-gray-400 mb-4 text-center">
          Discover creative and impactful ideas tailored to your needs.
        </p>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab("generate")}
            className={`px-4 py-2 rounded ${tab === "generate" ? "bg-gray-800 text-white" : "bg-gray-700 text-gray-300"}`}
          >
            Generate
          </button>
          <button
            onClick={() => setTab("scheduled")}
            className={`px-4 py-2 rounded ${tab === "scheduled" ? "bg-gray-800 text-white" : "bg-gray-700 text-gray-300"}`}
          >
            Scheduled
          </button>
        </div>

        {tab === "generate" ? <InteractiveForm /> : <ScheduledTweets />}
      </div>
    </div>
  );
}

