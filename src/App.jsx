import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cloneDeck } from "./data/baseDeck";
import {
  buildMarkdownExport,
  normalizeDeck,
  parseDeckFromText,
  readImportFile,
} from "./utils/deckImport";

const STORAGE_KEY = "vocab2:deckState";

export default function App() {
  const initialState = useMemo(() => {
    if (typeof window === "undefined") {
      return {
        deck: cloneDeck(),
        index: 0,
        revealed: false,
        lastRemoved: null,
      };
    }
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        return {
          deck: cloneDeck(),
          index: 0,
          revealed: false,
          lastRemoved: null,
        };
      }
      const parsed = JSON.parse(saved);
      const deck = Array.isArray(parsed?.deck) ? parsed.deck : cloneDeck();
      const hasDeck = deck.length > 0;
      const index = Number.isFinite(parsed?.index) ? parsed.index : 0;
      return {
        deck,
        index: hasDeck ? Math.min(Math.max(index, 0), deck.length - 1) : 0,
        revealed: Boolean(parsed?.revealed),
        lastRemoved: parsed?.lastRemoved ?? null,
      };
    } catch (error) {
      return {
        deck: cloneDeck(),
        index: 0,
        revealed: false,
        lastRemoved: null,
      };
    }
  }, []);

  const [deck, setDeck] = useState(initialState.deck);
  const [index, setIndex] = useState(initialState.index);
  const [revealed, setRevealed] = useState(initialState.revealed);
  const [lastRemoved, setLastRemoved] = useState(initialState.lastRemoved);
  const [noAnim, setNoAnim] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const [pasteText, setPasteText] = useState("");
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

  const downloadText = (filename, content, type = "text/plain") => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    if (!deck.length) return;
    const content = JSON.stringify(deck, null, 2);
    downloadText("vocab-deck.json", `${content}\n`, "application/json");
  };

  const handleExportMarkdown = () => {
    if (!deck.length) return;
    const content = buildMarkdownExport(deck);
    downloadText("vocab-deck.md", `${content}\n`, "text/markdown");
  };

  const handleImportFile = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const rawText = await readImportFile(file);
        const importedDeck = parseDeckFromText(rawText);
        const normalized = normalizeDeck(importedDeck);
        if (!normalized.length) {
          throw new Error("内容中没有有效的单词。");
        }
        runInstantly(() => {
          setDeck(normalized);
          setIndex(0);
          setRevealed(false);
          setLastRemoved(null);
        });
        setImportMessage(`已导入 ${normalized.length} 个单词。`);
      } catch (error) {
        setImportMessage(
          `导入失败：${error?.message || "无法解析文件内容。"}`
        );
      } finally {
        event.target.value = "";
      }
    },
    [runInstantly]
  );

  const handlePasteImport = useCallback(() => {
    const trimmed = pasteText.trim();
    if (!trimmed) {
      setImportMessage("请先粘贴需要导入的内容。");
      return;
    }
    try {
      const importedDeck = parseDeckFromText(trimmed);
      const normalized = normalizeDeck(importedDeck);
      if (!normalized.length) {
        throw new Error("内容中没有有效的单词。");
      }
      runInstantly(() => {
        setDeck(normalized);
        setIndex(0);
        setRevealed(false);
        setLastRemoved(null);
      });
      setImportMessage(`已导入 ${normalized.length} 个单词。`);
    } catch (error) {
      setImportMessage(
        `导入失败：${error?.message || "无法识别粘贴内容。"}`
      );
    }
  }, [pasteText, runInstantly]);

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const state = {
      deck,
      index,
      revealed,
      lastRemoved,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      return;
    }
  }, [deck, index, revealed, lastRemoved]);

  useEffect(() => {
    if (!guideOpen) return;
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setGuideOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [guideOpen]);

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
            <button type="button" onClick={handleExportJson}>
              Export JSON
            </button>
            <button type="button" onClick={handleExportMarkdown}>
              Export MD
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
          accept=".json,.md,.txt,.doc,.docx,application/json,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
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
              你可以上传 .json/.md/.txt/.docx 文件，或直接粘贴 AI 输出内容。系统会
              自动识别 JSON 数组或 deck 字段。
            </p>
            {/* <div className="prompt-box">
              <pre>{promptText}</pre>
            </div> */}
            <div className="guide-actions">
              <button
                className="primary"
                type="button"
                onClick={handleCopyPrompt}
              >
                复制提示词
              </button>
              <button type="button" onClick={handleImportClick}>
                上传文件
              </button>
              <button type="button" onClick={handleExportJson}>
                Export JSON
              </button>
              <button type="button" onClick={handleExportMarkdown}>
                Export MD
              </button>
            </div>
            <div className="paste-block">
              <label htmlFor="paste-input">直接粘贴 AI 输出</label>
              <textarea
                id="paste-input"
                className="paste-textarea"
                placeholder="粘贴 JSON 数组，或 ```json ...``` 代码块内容。"
                value={pasteText}
                onChange={(event) => setPasteText(event.target.value)}
              />
              <div className="paste-actions">
                <button
                  className="primary"
                  type="button"
                  onClick={handlePasteImport}
                  disabled={!pasteText.trim()}
                >
                  识别并导入
                </button>
                <button type="button" onClick={() => setPasteText("")}>
                  清空
                </button>
              </div>
              <p className="paste-hint">
                支持 JSON 数组、包含 deck 的对象，或代码块包裹的 JSON。
              </p>
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
