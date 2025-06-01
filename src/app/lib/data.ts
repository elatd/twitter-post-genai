export interface TweetCategory {
    name: string;
    key: string;
    options: string[];
  }

  // Define the tweetCategories array with the correct types and values
  export const DEFAULT_LENGTH = "Medium (100-200 chars)";
  export const LONG_LENGTH = "Long (200-280 chars)";

  const tweetCategories : TweetCategory[] = [
    {
      name: "Trending Topics",
      key: "trending",
      options: [
        "AI & Tech",
        "Politics",
        "Entertainment",
       "Crypto",
        "Sports",
        "Finance & Stocks",
        "Climate Change",
        "Space & Science",
      ],
    },
    {
      name: "Tone",
      key: "tone",
      options: [
        "Informative",
        "Humorous",
        "Sarcastic",
        "Inspirational",
        "Professional",
        "Casual",
      ],
    },
    {
      name: "Purpose",
      key: "purpose",
      options: [
        "Controversial",
        "Humorous",
        "Aggressive",
        "Generic",
        "Persuasive",
        "Thought-Provoking",
      ],
    },
  ];
  export default tweetCategories;
  