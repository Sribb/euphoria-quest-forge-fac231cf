import { motion } from "framer-motion";

interface StoryProgressBarProps {
  segments: number;
  currentSegment: number;
  progress: number;
  isPaused: boolean;
}

const StoryProgressBar = ({ segments, currentSegment, progress, isPaused }: StoryProgressBarProps) => {
  return (
    <div className="flex gap-1 w-full px-2">
      {Array.from({ length: segments }).map((_, index) => (
        <div
          key={index}
          className="flex-1 h-[3px] bg-white/30 rounded-full overflow-hidden"
        >
          {index < currentSegment ? (
            // Completed segment
            <div className="h-full w-full bg-white" />
          ) : index === currentSegment ? (
            // Current segment with animated progress
            <motion.div
              className="h-full bg-white origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progress / 100 }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          ) : (
            // Future segment - empty
            <div className="h-full w-0 bg-white" />
          )}
        </div>
      ))}
    </div>
  );
};

export default StoryProgressBar;
