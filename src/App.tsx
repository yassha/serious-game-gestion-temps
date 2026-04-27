import { useGame } from "./store";
import { HomeScreen } from "./components/HomeScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { JobSelectionScreen } from "./components/JobSelectionScreen";
import { IntroScreen } from "./components/IntroScreen";
import { GameScreen } from "./components/GameScreen";
import { ResultScreen } from "./components/ResultScreen";
import { TrainerScreen } from "./components/TrainerScreen";

export default function App() {
  const screen = useGame((s) => s.screen);

  switch (screen) {
    case "profile":
      return <ProfileScreen />;
    case "job":
      return <JobSelectionScreen />;
    case "intro":
      return <IntroScreen />;
    case "game":
      return <GameScreen />;
    case "result":
      return <ResultScreen />;
    case "trainer":
      return <TrainerScreen />;
    default:
      return <HomeScreen />;
  }
}
