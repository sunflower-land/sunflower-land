import { CHAPTERS, ChapterName } from "features/game/types/chapters";
import {
  CHAPTER_TRACKS,
  ChapterTask,
  getTrackMilestonesCrossed,
} from "features/game/types/tracks";
import { gameAnalytics } from "lib/gameAnalytics";

export function handleChapterAnalytics({
  chapter,
  task,
  points,
  previousPoints,
  createdAt,
}: {
  chapter: ChapterName;
  task: ChapterTask;
  points: number;
  previousPoints: number;
  createdAt: number;
}) {
  if (points <= 0) {
    return;
  }

  const chapterTrack = CHAPTER_TRACKS[chapter];
  if (!chapterTrack) {
    return;
  }

  const nextPoints = previousPoints + points;
  const daysSinceStart =
    (createdAt - CHAPTERS[chapter].startDate.getTime()) /
    (24 * 60 * 60 * 1000);

  gameAnalytics.trackTracksPoints({
    chapter,
    source: task,
    points,
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
