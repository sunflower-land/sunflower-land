import { CHAPTERS, getCurrentChapter } from "features/game/types/chapters";
import {
  CHAPTER_TRACKS,
  ChapterTask,
  getChapterTaskPoints,
  getTrackMilestonesCrossed,
} from "features/game/types/tracks";
import { gameAnalytics } from "lib/gameAnalytics";

export function handleChapterAnalytics({
  task,
  points,
  farmActivity,
  createdAt,
}: {
  task: ChapterTask;
  points: number;
  farmActivity: Record<string, number>;
  createdAt: number;
}) {
  const chapter = getCurrentChapter(createdAt);
  const pointsAwarded = getChapterTaskPoints({ task, points });

  if (pointsAwarded <= 0) {
    return;
  }

  const chapterTrack = CHAPTER_TRACKS[chapter];
  if (!chapterTrack) {
    return;
  }

  const previousPoints = farmActivity[`${chapter} Points Earned`] ?? 0;
  const nextPoints = previousPoints + pointsAwarded;
  const daysSinceStart =
    (createdAt - CHAPTERS[chapter].startDate.getTime()) / (24 * 60 * 60 * 1000);

  gameAnalytics.trackTracksPoints({
    chapter,
    source: task,
    points: pointsAwarded,
  });

  if (previousPoints === 0 && nextPoints > 0) {
    gameAnalytics.trackTracksActivated({
      chapter,
      source: task,
    });
  }

  const crossed = getTrackMilestonesCrossed({
    chapterTrack,
    previousPoints,
    nextPoints,
  });

  crossed.forEach((milestone) => {
    gameAnalytics.trackTracksMilestoneReached({
      chapter,
      milestone,
      daysSinceStart,
    });
  });

  const finalPoints =
    chapterTrack.milestones[chapterTrack.milestones.length - 1]?.points ?? 0;

  if (previousPoints < finalPoints && nextPoints >= finalPoints) {
    gameAnalytics.trackTracksComplete({
      chapter,
      daysSinceStart,
    });
  }
}
