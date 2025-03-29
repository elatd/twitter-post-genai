export interface TweetCategory {
    name: string;
    key: string;
    options: string[];
  }

  // Define the tweetCategories array with the correct types and values
const tweetCategories : TweetCategory[] = [
    {
      name: "Trending Topics",
      key: "trending",
      options: [
        "AI & Tech",
        "Politics",
        "Entertainment",
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
      name: "Tweet Length",
      key: "length",
      options: [
        "Short (under 100 chars)",
        "Medium (100-200 chars)",
        "Long (200-280 chars)",
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
    {
      name: "Hashtag Usage",
      key: "hashtags",
      options: [
        "No Hashtags",
        "Trending Hashtags",
        "Custom Hashtags",
        "Industry-Specific Hashtags",
      ],
    },
  ];
  export default tweetCategories;
  