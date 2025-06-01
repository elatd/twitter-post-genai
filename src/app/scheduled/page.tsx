import Calendar from '../components/Calendar';
import { getScheduledTweets } from '../lib/googleSheets';

export default async function ScheduledPage() {
  const tweets = await getScheduledTweets();
  return (
    <div className="flex flex-col items-center min-h-screen container mx-auto">
      <Calendar tweets={tweets} />
    </div>
  );
}
