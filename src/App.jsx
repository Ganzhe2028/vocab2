import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const baseDeck = [
  {
    term: "Vacant",
    syllables: "Va·cant",
    respell: "[VAY-kunt]",
    pos: "adj.",
    meaning: "empty; not occupied",
    meaningZh: "空的；未被占用",
    phrases: ["vacant seat", "vacant position"],
  },
  {
    term: "Proximity",
    syllables: "Prox·im·i·ty",
    respell: "[prok-SIM-ih-tee]",
    pos: "n.",
    meaning: "the state of being near; closeness",
    meaningZh: "接近；邻近",
    phrases: ["close proximity", "in proximity to"],
  },
  {
    term: "Devise",
    syllables: "De·vise",
    respell: "[dih-VYZE]",
    pos: "v.",
    meaning: "to plan or invent something carefully",
    meaningZh: "设计；制定；想出",
    phrases: ["devise a plan", "devise a strategy"],
  },
  {
    term: "Mundane",
    syllables: "Mun·dane",
    respell: "[mun-DAYN]",
    pos: "adj.",
    meaning: "ordinary and not interesting",
    meaningZh: "平凡的；乏味的",
    phrases: ["mundane tasks", "mundane routine"],
  },
  {
    term: "Translucent",
    syllables: "Trans·lu·cent",
    respell: "[trans-LOO-sent]",
    pos: "adj.",
    meaning: "allowing some light to pass through; semi-transparent",
    meaningZh: "半透明的",
    phrases: ["translucent glass", "translucent curtain"],
  },
  {
    term: "Probe",
    syllables: "Probe",
    respell: "[PROHB]",
    pos: "v.",
    meaning: "to investigate or examine closely",
    meaningZh: "调查；探查",
    phrases: ["probe the issue", "probe deeper"],
  },
  {
    term: "Revive",
    syllables: "Re·vive",
    respell: "[rih-VYV]",
    pos: "v.",
    meaning: "to bring back to life or make active again",
    meaningZh: "复苏；恢复；使复活",
    phrases: ["revive interest", "revive the economy"],
  },
  {
    term: "Inhabit",
    syllables: "In·hab·it",
    respell: "[in-HAB-it]",
    pos: "v.",
    meaning: "to live in a place",
    meaningZh: "居住于；栖息于",
    phrases: ["inhabit the island", "inhabit the region"],
  },
  {
    term: "Credibility",
    syllables: "Cred·i·bil·i·ty",
    respell: "[kred-uh-BIL-ih-tee]",
    pos: "n.",
    meaning: "the quality of being believable or trustworthy",
    meaningZh: "可信度；可信性",
    phrases: ["lose credibility", "credibility gap"],
  },
  {
    term: "Lucid",
    syllables: "Lu·cid",
    respell: "[LOO-sid]",
    pos: "adj.",
    meaning: "clear and easy to understand",
    meaningZh: "清晰的；易懂的",
    phrases: ["lucid explanation", "lucid moment"],
  },
  {
    term: "Fatigue",
    syllables: "Fa·tigue",
    respell: "[fuh-TEEG]",
    pos: "n.",
    meaning: "extreme tiredness after long effort",
    meaningZh: "疲劳；疲惫",
    phrases: ["mental fatigue", "fatigue sets in"],
  },
  {
    term: "Impulse",
    syllables: "Im·pulse",
    respell: "[IM-puls]",
    pos: "n.",
    meaning: "a sudden urge to do something without thinking",
    meaningZh: "冲动",
    phrases: ["on impulse", "impulse purchase"],
  },
  {
    term: "Recede",
    syllables: "Re·cede",
    respell: "[rih-SEED]",
    pos: "v.",
    meaning: "to move back; to gradually become smaller or weaker",
    meaningZh: "后退；逐渐减弱",
    phrases: ["recede into the distance", "pain recedes"],
  },
  {
    term: "Distorted",
    syllables: "Dis·tort·ed",
    respell: "[dis-TOR-tid]",
    pos: "adj.",
    meaning: "changed in shape or meaning; twisted or unclear",
    meaningZh: "扭曲的；失真的",
    phrases: ["distorted view", "distorted sound"],
  },
  {
    term: "Deception",
    syllables: "De·cep·tion",
    respell: "[dih-SEP-shun]",
    pos: "n.",
    meaning: "the act of tricking someone by lying or hiding the truth",
    meaningZh: "欺骗；欺诈",
    phrases: ["act of deception", "deception tactics"],
  },
  {
    term: "Prosperous",
    syllables: "Pros·per·ous",
    respell: "[PROS-per-us]",
    pos: "adj.",
    meaning: "successful, wealthy, or doing well",
    meaningZh: "繁荣的；富裕的",
    phrases: ["prosperous economy", "prosperous times"],
  },
  {
    term: "Elusive",
    syllables: "E·lu·sive",
    respell: "[ih-LOO-siv]",
    pos: "adj.",
    meaning: "difficult to find, catch, or understand",
    meaningZh: "难以捉摸的；难以找到的",
    phrases: ["elusive target", "elusive answer"],
  },
  {
    term: "Bloated",
    syllables: "Blo·at·ed",
    respell: "[BLOH-tid]",
    pos: "adj.",
    meaning: "swollen; or made too big with unnecessary parts",
    meaningZh: "肿胀的；膨胀的",
    phrases: ["bloated budget", "bloated stomach"],
  },
  {
    term: "Contempt",
    syllables: "Con·tempt",
    respell: "[kun-TEMPT]",
    pos: "n.",
    meaning: "strong disrespect; the feeling that someone is beneath you",
    meaningZh: "轻蔑；蔑视",
    phrases: ["feel contempt", "open contempt"],
  },
  {
    term: "Centennial",
    syllables: "Cen·ten·ni·al",
    respell: "[sen-TEN-ee-uhl]",
    pos: "adj.",
    meaning: "relating to the 100th anniversary of something",
    meaningZh: "百年纪念的",
    phrases: ["centennial celebration", "centennial anniversary"],
  },
  {
    term: "Atrocity",
    syllables: "A·troc·i·ty",
    respell: "[uh-TROS-ih-tee]",
    pos: "n.",
    meaning: "an extremely cruel or brutal act",
    meaningZh: "暴行；残暴行为",
    phrases: ["commit an atrocity", "war atrocity"],
  },
  {
    term: "Phantoms",
    syllables: "Phan·toms",
    respell: "[FAN-tumz]",
    pos: "n. pl.",
    meaning: "ghosts; shadowy figures (real or imagined)",
    meaningZh: "幻影；幽灵",
    phrases: ["phantom pains", "phantom sounds"],
  },
  {
    term: "Negligence",
    syllables: "Neg·li·gence",
    respell: "[NEG-lih-jens]",
    pos: "n.",
    meaning: "failure to take proper care; carelessness",
    meaningZh: "疏忽；过失",
    phrases: ["gross negligence", "negligence claim"],
  },
  {
    term: "Complicity",
    syllables: "Com·plic·i·ty",
    respell: "[kum-PLIS-ih-tee]",
    pos: "n.",
    meaning:
      "involvement in a wrongful act, especially by helping or allowing it",
    meaningZh: "共谋；同谋",
    phrases: ["complicity in a crime", "silent complicity"],
  },
];

const cloneDeck = () => baseDeck.map((item) => ({ ...item }));

export default function App() {
  const [deck, setDeck] = useState(() => cloneDeck());
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [lastRemoved, setLastRemoved] = useState(null);
  const [noAnim, setNoAnim] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const fileInputRef = useRef(null);
  const guidePanelRef = useRef(null);

  const promptText = `你是英语词汇整理助手。请把用户提供的单词逐个补全为以下字段，并输出为可导入的 JSON 数组：

字段要求（严格遵守）：
- term: 单词，首字母大写
- syllables: 分节写法（用中点分隔）
- respell: 发音重拼（用方括号包裹）
- pos: 词性缩写（如 "n.", "v.", "adj.", "adv."）
- meaning: 英文简明释义
- meaningZh: 中文释义
- phrases: 常用搭配短语数组（2-3 个）

输出格式示例（仅 JSON，不要多余文字）：
[
  {
    "term": "Example",
    "syllables": "Ex·am·ple",
    "respell": "[ig-ZAM-puhl]",
    "pos": "n.",
    "meaning": "a thing that illustrates a rule",
    "meaningZh": "例子；示例",
    "phrases": ["for example", "example sentence"]
  }
]

一定记得需要以代码块的方式输出 JSON 文件以便用户导入。`;

  const runInstantly = useCallback((action) => {
    setNoAnim(true);
    action();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setNoAnim(false);
      });
    });
  }, []);

  const toggleReveal = useCallback(() => {
    if (!deck.length) return;
    setRevealed((prev) => !prev);
  }, [deck.length]);

  const nextCard = useCallback(() => {
    if (!deck.length) return;
    runInstantly(() => {
      setIndex((prev) => (prev + 1) % deck.length);
      setRevealed(false);
    });
  }, [deck.length, runInstantly]);

  const prevCard = useCallback(() => {
    if (!deck.length) return;
    runInstantly(() => {
      setIndex((prev) => (prev - 1 + deck.length) % deck.length);
      setRevealed(false);
    });
  }, [deck.length, runInstantly]);

  const removeCard = useCallback(() => {
    if (!deck.length) return;
    runInstantly(() => {
      setDeck((prev) => {
        if (!prev.length) return prev;
        const next = [...prev];
        const removedIndex = index;
        const [removed] = next.splice(removedIndex, 1);
        setLastRemoved({ item: removed, index: removedIndex });
        let nextIndex = removedIndex;
        if (nextIndex >= next.length) {
          nextIndex = 0;
        }
        setIndex(nextIndex);
        return next;
      });
      setRevealed(false);
    });
  }, [deck.length, index, runInstantly]);

  const undoRemove = useCallback(() => {
    if (!lastRemoved) return;
    runInstantly(() => {
      setDeck((prev) => {
        const next = [...prev];
        const insertIndex = Math.min(lastRemoved.index, next.length);
        next.splice(insertIndex, 0, lastRemoved.item);
        setIndex(insertIndex);
        return next;
      });
      setLastRemoved(null);
      setRevealed(false);
    });
  }, [lastRemoved, runInstantly]);

  const resetDeck = useCallback(() => {
    runInstantly(() => {
      setDeck(cloneDeck());
      setIndex(0);
      setRevealed(false);
      setLastRemoved(null);
    });
  }, [runInstantly]);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImportFile = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const rawText = await file.text();
        const parsed = JSON.parse(rawText);
        const importedDeck = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed?.deck)
          ? parsed.deck
          : null;
        if (!importedDeck || !importedDeck.length) {
          throw new Error("无法识别 JSON 格式。");
        }
        const normalized = importedDeck
          .map((entry) => ({
            term: String(entry.term ?? "").trim(),
            syllables: String(entry.syllables ?? "").trim(),
            respell: String(entry.respell ?? "").trim(),
            pos: String(entry.pos ?? "").trim(),
            meaning: String(entry.meaning ?? "").trim(),
            meaningZh: String(entry.meaningZh ?? "").trim(),
            phrases: Array.isArray(entry.phrases)
              ? entry.phrases
                  .map((phrase) => String(phrase).trim())
                  .filter(Boolean)
              : [],
          }))
          .filter((entry) => entry.term);
        if (!normalized.length) {
          throw new Error("JSON 中没有有效的单词。");
        }
        runInstantly(() => {
          setDeck(normalized);
          setIndex(0);
          setRevealed(false);
          setLastRemoved(null);
        });
        setImportMessage(`已导入 ${normalized.length} 个单词。`);
      } catch (error) {
        setImportMessage(`导入失败：${error.message}`);
      } finally {
        event.target.value = "";
      }
    },
    [runInstantly]
  );

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setImportMessage("提示词已复制到剪贴板。");
    } catch (error) {
      setImportMessage("复制失败，请手动复制提示词。");
    }
  };

  useEffect(() => {
    const handleKeydown = (event) => {
      if (guideOpen) {
        return;
      }
      if (guidePanelRef.current?.contains(document.activeElement)) {
        return;
      }
      if (event.code === "Space") {
        event.preventDefault();
        toggleReveal();
      } else if (event.code === "Tab") {
        event.preventDefault();
        prevCard();
      } else if (event.code === "Enter") {
        event.preventDefault();
        if (revealed) {
          nextCard();
        } else {
          toggleReveal();
        }
      } else if (event.code === "ArrowLeft") {
        event.preventDefault();
        prevCard();
      } else if (event.code === "Delete" || event.code === "Backspace") {
        event.preventDefault();
        removeCard();
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [guideOpen, nextCard, prevCard, removeCard, revealed, toggleReveal]);

  const hasDeck = deck.length > 0;
  const item = hasDeck ? deck[index] : null;
  const term = hasDeck
    ? revealed
      ? item?.syllables || item?.term
      : item?.term
    : "No words loaded";
  const posTag = item?.pos || "";
  const meaningText = item ? `${item.meaning} / ${item.meaningZh}` : "";
  const phrases = item?.phrases ?? [];
  const respell = item?.respell || "";
  const showDetails = revealed && hasDeck;
  const hint = hasDeck
    ? revealed
      ? "Enter for next, Space hides, Tab/<- for previous, Delete removes"
      : "Enter or Space reveals meaning + phrases"
    : "Deck empty. Press Reset to reload.";
  const progress = hasDeck ? (index + 1) / deck.length : 0;

  const cardClassName = useMemo(() => {
    return `card${noAnim ? " no-anim" : ""}`;
  }, [noAnim]);

  return (
    <main className="shell">
      <header>
        <div className="title-row">
          <h1>Vocabulary Loop</h1>
          <div className="header-actions">
            <button type="button" onClick={handleImportClick}>
              Import
            </button>
            <button type="button" onClick={() => setGuideOpen(true)}>
              Guidebook
            </button>
          </div>
        </div>
        <div className="subhead">
          Flashcard flow: Enter reveals, Enter again goes next. Space hides or
          reveals. Tab or &lt;- goes previous. Delete removes. Tap the card if
          you are on mobile.
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          onChange={handleImportFile}
          className="file-input"
        />
        {importMessage ? (
          <div className="import-message">{importMessage}</div>
        ) : null}
      </header>

      {guideOpen ? (
        <div className="guide-overlay" onClick={() => setGuideOpen(false)}>
          <section
            className="guide-panel"
            role="dialog"
            aria-modal="true"
            ref={guidePanelRef}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="guide-header">
              <h2>导入指南</h2>
              <button type="button" onClick={() => setGuideOpen(false)}>
                关闭
              </button>
            </div>
            <p>
              使用下方提示词让 AI 把你的单词整理成可导入的 JSON。完成后保存为
              .json 文件，再点击上传文件即可。
            </p>
            <div className="prompt-box">
              <pre>{promptText}</pre>
            </div>
            <div className="guide-actions">
              <button
                className="primary"
                type="button"
                onClick={handleCopyPrompt}
              >
                复制提示词
              </button>
              <button type="button" onClick={handleImportClick}>
                上传 JSON 文件
              </button>
            </div>
          </section>
        </div>
      ) : null}

      <section
        className={cardClassName}
        aria-live="polite"
        onClick={toggleReveal}
      >
        <div className="hint">{hint}</div>
        <div className="term-row">
          <h2 className="term">{term}</h2>
          <div className={`pronounce${showDetails ? "" : " is-hidden"}`}>
            <div className="pronounce-value">{respell}</div>
          </div>
        </div>
        <p className={`meaning${showDetails ? "" : " is-hidden"}`}>
          {posTag ? <span className="pos-tag">{posTag}</span> : null}
          <span>{meaningText}</span>
        </p>
        <ul
          className={`phrases${showDetails ? "" : " is-hidden"}`}
          aria-label="Common phrases"
        >
          {phrases.map((phrase) => (
            <li key={phrase}>{phrase}</li>
          ))}
        </ul>
      </section>

      <section className="meta">
        <div className="progress">
          <div className="progress-bar">
            <span style={{ transform: `scaleX(${progress})` }}></span>
          </div>
          <div className="count">
            {hasDeck ? `${index + 1} / ${deck.length}` : "0 / 0"}
          </div>
        </div>
        <div className="controls">
          <button className="primary" type="button" onClick={toggleReveal}>
            {revealed ? "Hide (Space)" : "Reveal (Space)"}
          </button>
          <button type="button" onClick={prevCard}>
            Prev (Tab / &lt;-)
          </button>
          <button type="button" onClick={nextCard}>
            Next (Enter)
          </button>
          <button type="button" onClick={removeCard}>
            Remove (Delete)
          </button>
          <button type="button" onClick={undoRemove} disabled={!lastRemoved}>
            Undo Remove
          </button>
          <button type="button" onClick={resetDeck}>
            Reset Deck
          </button>
        </div>
        <div className="loop">Looping deck: on</div>
      </section>

      <div className="footer-note">
        No limits — keep cycling as long as you want.
      </div>
    </main>
  );
}
