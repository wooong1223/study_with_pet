import { useState } from "react";

import { CharacterView } from "../components/CharacterView";
import type { Animal } from "../types/study";
import styles from "./Onboarding.module.css";

interface OnboardingProps {
  onComplete: (animal: Animal, petName: string) => void;
}

const animals: Array<{ id: Animal; label: string }> = [
  { id: "cat", label: "고양이" },
  { id: "dog", label: "강아지" },
  { id: "rabbit", label: "토끼" },
  { id: "tiger", label: "호랑이" },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<"splash" | "select" | "name">("splash");
  const [selectedAnimal, setSelectedAnimal] = useState<Animal>("cat");
  const [petName, setPetName] = useState("");

  if (step === "splash") {
    return (
      <main className={`${styles.screen} ${styles.splash}`}>
        <section className={styles.friends} aria-label="공부 친구들">
          <CharacterView animal="cat" stage={1} size={132} animate="float" />
          <CharacterView animal="dog" stage={1} size={128} animate="float" />
          <CharacterView animal="rabbit" stage={1} size={132} animate="float" />
          <CharacterView animal="tiger" stage={1} size={126} animate="float" />
        </section>
        <header className={styles.splashText}>
          <h1>공부할수록 자라나는 나만의 공부 친구</h1>
          <p>공부 시간이 쌓일수록 친구가 조금씩 성장해요</p>
        </header>
        <button type="button" className="primaryButton" onClick={() => setStep("select")}>
          시작하기
        </button>
      </main>
    );
  }

  if (step === "name") {
    const trimmedPetName = petName.trim();

    return (
      <main className={`${styles.screen} ${styles.nameScreen}`}>
        <section className={styles.nameHero}>
          <CharacterView animal={selectedAnimal} stage={1} size={250} animate="float" />
          <h1>친구 이름을 지어주세요</h1>
        </section>

        <input
          className={styles.nameInput}
          maxLength={6}
          onChange={(event) => setPetName(event.target.value.slice(0, 6))}
          placeholder="예) 코코, 뭉이, 콩이"
          type="text"
          value={petName}
        />

        <button
          type="button"
          className="primaryButton"
          disabled={trimmedPetName.length === 0}
          onClick={() => onComplete(selectedAnimal, trimmedPetName)}
        >
          완료
        </button>
      </main>
    );
  }

  return (
    <main className={styles.screen}>
      <header className={styles.header}>
        <p className={styles.kicker}>StudyPet</p>
        <h1>함께 공부할 친구를 골라주세요</h1>
        <p>공부 시간이 쌓일수록 친구가 조금씩 성장해요.</p>
      </header>

      <section className={styles.grid} aria-label="동물 선택">
        {animals.map((animal) => {
          const selected = selectedAnimal === animal.id;

          return (
            <button
              type="button"
              className={`${styles.card} ${selected ? styles.selected : ""}`}
              key={animal.id}
              onClick={() => setSelectedAnimal(animal.id)}
              aria-pressed={selected}
            >
              <CharacterView animal={animal.id} stage={1} size={128} />
              <span>{animal.label}</span>
            </button>
          );
        })}
      </section>

      <button type="button" className="primaryButton" onClick={() => setStep("name")}>
        선택 완료
      </button>
    </main>
  );
}
