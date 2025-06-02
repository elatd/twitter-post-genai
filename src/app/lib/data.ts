export interface TweetCategory {
    name: string;
    key: string;
    options: string[];
  }

  // Define the tweetCategories array with the correct types and values
  export const DEFAULT_LENGTH = "Medium (100-200 chars)";
  export const LONG_LENGTH = "Long (200-280 chars)";
  export const YOUTUBE_DEFAULT_LENGTH = "5-10 minutes";
  export const YOUTUBE_LONG_LENGTH = "15-20 minutes";

  export type Platform = "twitter" | "youtube";

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

  export const youtubeCategories: TweetCategory[] = [
    {
      name: "Content Type",
      key: "contentType",
      options: [
        "Tutorial",
        "Review",
        "Vlog",
        "Commentary",
        "Educational",
        "Entertainment",
        "Gaming",
        "Tech Review",
      ],
    },
    {
      name: "Tone",
      key: "tone",
      options: [
        "Professional",
        "Casual",
        "Energetic",
        "Informative",
        "Entertaining",
        "Dramatic",
      ],
    },
    {
      name: "Target Audience",
      key: "audience",
      options: [
        "Beginners",
        "Intermediate",
        "Advanced",
        "General",
        "Tech Enthusiasts",
        "Students",
      ],
    },
  ];
  export default tweetCategories;