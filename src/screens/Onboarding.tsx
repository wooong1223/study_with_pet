import { useState } from "react";

import { CharacterView } from "../components/CharacterView";
import type { Animal } from "../types/study";
import styles from "./Onboarding.module.css";

interface OnboardingProps {
  onComplete: (animal: Animal) => void;
}

const animals: Array<{ id: Animal; label: string }> = [
  { id: "cat", label: "고양이" },
  { id: "dog", label: "강아지" },
  { id: "rabbit", label: "토끼" },
  { id: "hamster", label: "햄스터" },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [selectedAnimal, setSelectedAnimal] = useState<Animal>("cat");

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
              <CharacterView animal={animal.id} stage={1} size={86} />
              <span>{animal.label}</span>
            </button>
          );
        })}
      </section>

      <button type="button" className="primaryButton" onClick={() => onComplete(selectedAnimal)}>
        선택 완료
      </button>
    </main>
  );
}
