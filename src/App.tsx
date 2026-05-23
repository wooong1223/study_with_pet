import { useState } from "react";

import "./App.css";
import { EvolveOverlay } from "./screens/EvolveOverlay";
import { Home } from "./screens/Home";
import { Onboarding } from "./screens/Onboarding";
import { Result } from "./screens/Result";
import { Studying } from "./screens/Studying";
import type { Animal, StudyData, StudyResult } from "./types/study";
import { formatStudyTime } from "./utils/format";
import { applyStudySession, loadStudyData, saveStudyData, setAnimal } from "./utils/storage";
import { getStage } from "./utils/stageCalc";

type Screen = "onboarding" | "home" | "studying" | "result";

function App() {
  const [data, setData] = useState<StudyData>(() => loadStudyData());
  const [screen, setScreen] = useState<Screen>(() => (loadStudyData().animal ? "home" : "onboarding"));
  const [result, setResult] = useState<StudyResult | null>(null);
  const [showEvolve, setShowEvolve] = useState(false);

  const animal = data.animal ?? "cat";

  function persist(nextData: StudyData) {
    setData(nextData);
    saveStudyData(nextData);
  }

  function handleOnboardingComplete(selectedAnimal: Animal) {
    const nextData = setAnimal(data, selectedAnimal);
    persist(nextData);
    setScreen("home");
  }

  function handleFinishStudy(sessionSeconds: number) {
    const previousStage = getStage(data.totalSeconds, data.sessions);
    const nextData = applyStudySession(data, sessionSeconds);
    const nextStage = getStage(nextData.totalSeconds, nextData.sessions);

    persist(nextData);
    setResult({
      sessionSeconds,
      totalSeconds: nextData.totalSeconds,
      todaySeconds: nextData.todaySeconds,
      previousStage,
      stage: nextStage,
    });
    setShowEvolve(nextStage > previousStage);
    setScreen("result");
  }

  async function handleShare() {
    const text = `공부친구와 오늘 ${formatStudyTime(result?.sessionSeconds ?? 0)} 공부했어요.`;

    if ("share" in navigator) {
      await navigator.share({
        title: "공부친구",
        text,
      });
      return;
    }

    await navigator.clipboard?.writeText(text);
  }

  return (
    <div className="appShell">
      {screen === "onboarding" ? <Onboarding onComplete={handleOnboardingComplete} /> : null}
      {screen === "home" ? <Home data={data} onStart={() => setScreen("studying")} /> : null}
      {screen === "studying" ? <Studying data={data} onFinish={handleFinishStudy} /> : null}
      {screen === "result" && result != null ? (
        <Result
          animal={animal}
          result={result}
          onShare={() => {
            void handleShare();
          }}
          onHome={() => setScreen("home")}
        />
      ) : null}
      {showEvolve ? (
        <EvolveOverlay animal={animal} stage={result?.stage ?? 1} onConfirm={() => setShowEvolve(false)} />
      ) : null}
    </div>
  );
}

export default App;
