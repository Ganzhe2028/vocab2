import { useCallback, useEffect, useMemo, useState } from "react";

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

const MAX_FILE_SIZE = 200 * 1024;
const MAX_ENTRIES = 500;
const AI_PROMPT = `You are given a list of English words. For each word, generate a vocabulary entry using the exact format below. Use clear, short English definitions and one natural sentence example per word. Output ONLY the formatted entries, separated by a blank line, and nothing else.

Format:
[Word]
- Meaning (EN): short, clear definition
- Sentence: A full sentence that ends with a period.

Rules:
- Replace [Word] with the word in Title Case.
- Keep exactly three lines per entry.
- Add a blank line between entries.
- Use ASCII characters unless a word requires otherwise.`;

const cloneDeck = () => baseDeck.map((item) => ({ ...item }));

const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : "";

const normalizeEntry = (raw) => {
  const term = normalizeString(raw.term || raw.word || raw.title);
  const meaning = normalizeString(raw.meaning || raw.definition);
  const meaningZh = normalizeString(raw.meaningZh || raw.meaning_zh || "");
  const syllables = normalizeString(raw.syllables || "");
  const respell = normalizeString(raw.respell || "");
  const pos = normalizeString(raw.pos || raw.partOfSpeech || "");
  const phrases = Array.isArray(raw.phrases)
    ? raw.phrases.map((item) => normalizeString(item)).filter(Boolean)
    : normalizeString(raw.phrases || raw.sentence)
    ? [normalizeString(raw.phrases || raw.sentence)]
    : [];

  return {
    term,
    syllables,
    respell,
    pos,
    meaning,
    meaningZh,
    phrases,
  };
};

const validateEntry = (entry, index) => {
  const errors = [];
  if (!entry.term) {
    errors.push(`Entry ${index + 1}: missing word/term.`);
  }
  if (!entry.meaning) {
    errors.push(`Entry ${index + 1}: missing meaning/definition.`);
  }
  if (!entry.phrases.length) {
    errors.push(`Entry ${index + 1}: missing sentence or phrases.`);
  }
  return errors;
};

const parseMarkdownDeck = (text) => {
  const blocks = text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
  const entries = [];
  const errors = [];

  blocks.forEach((block, index) => {
    const lines = block.split("\n").map((line) => line.trim());
    const header = lines[0] || "";
    const wordMatch = header.match(/^\[(.+)\]$/);
    if (!wordMatch) {
      errors.push(`Entry ${index + 1}: expected [Word] header.`);
      return;
    }
    const term = wordMatch[1].trim();
    const meaningLine = lines.find((line) => line.startsWith("- Meaning"));
    const sentenceLine = lines.find((line) => line.startsWith("- Sentence"));
    const meaning = meaningLine
      ? meaningLine
          .replace("- Meaning (EN):", "")
          .replace("- Meaning:", "")
          .trim()
      : "";
    const sentence = sentenceLine
      ? sentenceLine.replace("- Sentence:", "").trim()
      : "";

    const entry = normalizeEntry({
      term,
      meaning,
      sentence,
    });
    const entryErrors = validateEntry(entry, index);
    if (entryErrors.length) {
      errors.push(...entryErrors);
      return;
    }
    entries.push(entry);
  });

  return { entries, errors };
};

const parseJsonDeck = (text) => {
  const errors = [];
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    return { entries: [], errors: ["Invalid JSON file."] };
  }

  const items = Array.isArray(parsed) ? parsed : parsed?.entries;
  if (!Array.isArray(items)) {
    return {
      entries: [],
      errors: ["JSON must be an array or an object with an entries array."],
    };
  }

  const entries = [];
  items.forEach((item, index) => {
    const entry = normalizeEntry(item || {});
    const entryErrors = validateEntry(entry, index);
    if (entryErrors.length) {
      errors.push(...entryErrors);
      return;
    }
    entries.push(entry);
  });

  return { entries, errors };
};

const parseUploadedDeck = (fileName, text) => {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".json")) {
    return parseJsonDeck(text);
  }
  return parseMarkdownDeck(text);
};

export default function App() {
  const [deck, setDeck] = useState(() => cloneDeck());
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [lastRemoved, setLastRemoved] = useState(null);
  const [noAnim, setNoAnim] = useState(false);
  const [uploadErrors, setUploadErrors] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [previewItems, setPreviewItems] = useState([]);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");

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

  const loadDeck = useCallback(
    (entries, fileName) => {
      runInstantly(() => {
        setDeck(entries);
        setIndex(0);
        setRevealed(false);
        setLastRemoved(null);
      });
      setUploadedFileName(fileName || "");
      setPreviewItems(entries.slice(0, 5));
      setUploadMessage(
        `Loaded ${entries.length} entries${
          fileName ? ` from ${fileName}` : ""
        }.`
      );
      setUploadErrors([]);
    },
    [runInstantly]
  );

  const handleFileChange = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      setUploadMessage("");
      setUploadedFileName(file.name);
      setPreviewItems([]);
      setUploadErrors([]);

      if (file.size > MAX_FILE_SIZE) {
        setUploadErrors([
          `File too large. Max size is ${Math.round(MAX_FILE_SIZE / 1024)}KB.`,
        ]);
        return;
      }

      let text;
      try {
        text = await file.text();
      } catch (error) {
        setUploadErrors(["Unable to read the file contents."]);
        return;
      }

      const { entries, errors } = parseUploadedDeck(file.name, text);
      if (errors.length) {
        setUploadErrors(errors);
        return;
      }
      if (!entries.length) {
        setUploadErrors(["No valid entries found in the file."]);
        return;
      }
      if (entries.length > MAX_ENTRIES) {
        setUploadErrors([
          `Too many entries. Max supported is ${MAX_ENTRIES}.`,
        ]);
        return;
      }

      loadDeck(entries, file.name);
    },
    [loadDeck]
  );

  const handleCopyPrompt = useCallback(async () => {
    setCopyStatus("");
    try {
      await navigator.clipboard.writeText(AI_PROMPT);
      setCopyStatus("Prompt copied.");
    } catch (error) {
      setCopyStatus("Copy failed. Please copy manually.");
    }
  }, []);

  useEffect(() => {
    const handleKeydown = (event) => {
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
  }, [nextCard, prevCard, removeCard, revealed, toggleReveal]);

  const hasDeck = deck.length > 0;
  const item = hasDeck ? deck[index] : null;
  const term = hasDeck
    ? revealed
      ? item?.syllables || item?.term
      : item?.term
    : "No words loaded";
  const posTag = item?.pos || "";
  const meaningText = item
    ? [item.meaning, item.meaningZh].filter(Boolean).join(" / ")
    : "";
  const phrases = item?.phrases ?? [];
  const respell = item?.respell || "";
  const showDetails = revealed && hasDeck;
  const hint = hasDeck
    ? revealed
      ? "Enter for next, Space hides, Tab/<- for previous, Delete removes"
      : "Enter or Space reveals meaning + phrases"
    : "Deck empty. Upload a vocab file or press Reset to reload.";
  const progress = hasDeck ? (index + 1) / deck.length : 0;

  const cardClassName = useMemo(() => {
    return `card${noAnim ? " no-anim" : ""}`;
  }, [noAnim]);

  return (
    <main className="shell">
      <header>
        <div className="header-top">
          <h1>Vocabulary Loop</h1>
          <div className="header-actions">
            <button type="button" onClick={() => setShowImport(true)}>
              Import
            </button>
            <button type="button" onClick={() => setShowGuide(true)}>
              Guide
            </button>
          </div>
        </div>
        <div className="subhead">
          Flashcard flow: Enter reveals, Enter again goes next. Space hides or
          reveals. Tab or &lt;- goes previous. Delete removes. Tap the card if
          you are on mobile.
        </div>
      </header>

      {showImport ? (
        <section className="modal" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <h2>Import vocab file</h2>
              <button type="button" onClick={() => setShowImport(false)}>
                Close
              </button>
            </div>
            <p className="modal-subhead">
              Supported formats: Markdown (.md/.txt) with [Word] blocks or JSON
              arrays. Each entry must include a word, meaning, and sentence.
            </p>
            <div className="uploader-controls">
              <label className="file-input">
                <span>Select file</span>
                <input
                  type="file"
                  accept=".md,.txt,.json"
                  onChange={handleFileChange}
                />
              </label>
              <div className="uploader-meta">
                <span>
                  Max {Math.round(MAX_FILE_SIZE / 1024)}KB • Up to {MAX_ENTRIES}{" "}
                  entries
                </span>
                {uploadedFileName ? (
                  <span className="file-name">{uploadedFileName}</span>
                ) : null}
              </div>
            </div>
            {uploadMessage ? (
              <div className="uploader-message">{uploadMessage}</div>
            ) : null}
            {uploadErrors.length ? (
              <ul className="uploader-errors">
                {uploadErrors.map((error, idx) => (
                  <li key={`${idx}-${error}`}>{error}</li>
                ))}
              </ul>
            ) : null}
            {previewItems.length ? (
              <div className="uploader-preview">
                <h3>Preview</h3>
                <ul>
                  {previewItems.map((entry, idx) => (
                    <li key={`${entry.term}-${idx}`}>
                      <strong>{entry.term}</strong>
                      <span>{entry.meaning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {showGuide ? (
        <section className="modal" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <h2>Guide</h2>
              <button type="button" onClick={() => setShowGuide(false)}>
                Close
              </button>
            </div>
            <p className="modal-subhead">
              Use this prompt with your AI tool to convert your word list into a
              one-click import file format.
            </p>
            <textarea className="prompt-box" readOnly value={AI_PROMPT} />
            <div className="prompt-actions">
              <button type="button" className="primary" onClick={handleCopyPrompt}>
                Copy prompt
              </button>
              {copyStatus ? <span className="copy-status">{copyStatus}</span> : null}
            </div>
          </div>
        </section>
      ) : null}

      <section className={cardClassName} aria-live="polite" onClick={toggleReveal}>
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

      <div className="footer-note">No limits — keep cycling as long as you want.</div>
    </main>
  );
}
