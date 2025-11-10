export async function checkLanguageDetectorAvailability() {
  return await LanguageDetector.availability();
}
export async function detectLanguage(prompt: string, signal: AbortSignal) {
  try {
    if (navigator.userActivation.isActive) {
      const detector = await LanguageDetector.create({
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            console.log(`Downloaded ${e.loaded * 100}%`);
          });
        },

        signal: signal,
      });
      const output = await detector.detect(prompt, { signal });
      detector.destroy();
      return output;
    } else {
      console.error("User activation required to use Language Detector");
      throw new Error("User activation required to use Language Detector");
    }
  } catch (error) {
    throw new Error(error as string);
  }
}

export async function checkTranslatorAvailability(
  source: string,
  target: string
) {
  return await Translator.availability({
    sourceLanguage: source,
    targetLanguage: target,
  });
}
export async function translateText(
  source: string,
  target: string,
  text: string,
  signal: AbortSignal
) {
  try {
    if (navigator.userActivation.isActive) {
      const translator = await Translator.create({
        sourceLanguage: source,
        targetLanguage: target,
        signal: signal,
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            console.log(`Downloaded ${e.loaded * 100}%`);
          });
        },
      });
      const output = await translator.translate(text, { signal });
      translator.destroy();
      return output;
    } else {
      console.error("User activation required to use Translator API");
      throw new Error("User activation required to use Translator API");
    }
  } catch (error) {
    throw new Error(error as string);
  }
}

export async function checkSummarizerAvailability(
  length: string,
  type: string,
  outputLanguage: string
) {
  const options = {
    outputLanguage: outputLanguage,
    type: type as SummarizerType,
    length: length as SummarizerLength,
    format: "markdown",
    expectedInputLanguages: [outputLanguage],
  } as SummarizerCreateOptions;
  return await Summarizer.availability(options);
}
export async function summarizeText(
  length: string,
  type: string,
  text: string,
  outputLanguage: string,
  signal: AbortSignal
) {
  const supportedLangs = ["en", "es", "ja"];
  const language = supportedLangs.includes(outputLanguage)
    ? outputLanguage
    : "en";
  const options = {
    outputLanguage: language,
    expectedInputLanguages: [language],
    type: type as SummarizerType,
    length: length as SummarizerLength,
    format: "markdown",
    signal,
  } as SummarizerCreateOptions;
  try {
    if (navigator.userActivation.isActive) {
      const summarizer = await Summarizer.create({
        ...options,
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            console.log(`Downloaded ${e.loaded * 100}%`);
          });
        },
      });
      const output = await summarizer.summarize(text, { signal });
      summarizer.destroy();
      return output;
    } else {
      console.error("User activation required to use Summarizer API");
      throw new Error("User activation required to use Summarizer API");
    }
  } catch (error) {
    throw new Error(error as string);
  }
}
