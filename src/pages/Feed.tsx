import { MicroLearningFeed } from "@/features/feed/components/MicroLearningFeed";

interface FeedProps {
  onNavigate: (tab: string) => void;
}

const Feed = ({ onNavigate }: FeedProps) => {
  return <MicroLearningFeed onNavigate={onNavigate} />;
};

export default Feed;
