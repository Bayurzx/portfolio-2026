"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseVoiceOptions {
    onResult?: (transcript: string) => void;
    onError?: (error: string) => void;
    language?: string;
}

export interface UseVoiceReturn {
    isListening: boolean;
    isSupported: boolean;
    isSpeaking: boolean;
    transcript: string;
    startListening: () => void;
    stopListening: () => void;
    speak: (text: string) => void;
    stopSpeaking: () => void;
    voiceEnabled: boolean;
    setVoiceEnabled: (enabled: boolean) => void;
}

// Get SpeechRecognition constructor (browser-specific)
function getSpeechRecognition(): (new () => SpeechRecognition) | null {
    if (typeof window === "undefined") return null;
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

// Check if Web Speech API is supported
const isSpeechRecognitionSupported = (): boolean => {
    return getSpeechRecognition() !== null;
};

const isSpeechSynthesisSupported = (): boolean => {
    if (typeof window === "undefined") return false;
    return "speechSynthesis" in window;
};

/**
 * Custom hook for voice input (STT) and output (TTS)
 */
export function useVoice(options: UseVoiceOptions = {}): UseVoiceReturn {
    const { onResult, onError, language = "en-US" } = options;

    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [voiceEnabled, setVoiceEnabledState] = useState(false);
    const [isSupported, setIsSupported] = useState(false);

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Check support on mount
    useEffect(() => {
        const supported = isSpeechRecognitionSupported() && isSpeechSynthesisSupported();
        setIsSupported(supported);

        // Load saved preference from localStorage
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("voice-enabled");
            if (saved !== null) {
                setVoiceEnabledState(saved === "true");
            }
        }
    }, []);

    const onResultRef = useRef(onResult);
    const onErrorRef = useRef(onError);

    // Update refs when callbacks change
    useEffect(() => {
        onResultRef.current = onResult;
        onErrorRef.current = onError;
    }, [onResult, onError]);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognitionClass = getSpeechRecognition();
        if (!SpeechRecognitionClass) return;

        const recognition = new SpeechRecognitionClass();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const result = event.results[0][0].transcript;
            setTranscript(result);
            if (onResultRef.current) {
                onResultRef.current(result);
            }
            setIsListening(false);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            // Ignore "aborted" and "no-speech" errors which are common and not critical
            if (event.error === "aborted" || event.error === "no-speech") {
                setIsListening(false);
                return;
            }

            console.error("Speech recognition error:", event.error);
            if (onErrorRef.current) {
                onErrorRef.current(event.error);
            }
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.abort();
        };
    }, [language]); // Removed onResult/onError dependencies to prevent re-init

    // Save voice preference to localStorage
    const setVoiceEnabled = useCallback((enabled: boolean) => {
        setVoiceEnabledState(enabled);
        if (typeof window !== "undefined") {
            localStorage.setItem("voice-enabled", String(enabled));
        }
    }, []);

    // Start listening for voice input
    const startListening = useCallback(() => {
        if (!recognitionRef.current || !voiceEnabled) return;

        try {
            setTranscript("");
            recognitionRef.current.start();
            setIsListening(true);
        } catch (error) {
            // If already started, stop and try again
            if ((error as Error).message?.includes("already started")) {
                recognitionRef.current.stop();
                setTimeout(() => {
                    try {
                        recognitionRef.current?.start();
                        setIsListening(true);
                    } catch {
                        setIsListening(false);
                    }
                }, 100);
            } else {
                setIsListening(false);
            }
        }
    }, [voiceEnabled]);

    // Stop listening
    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, []);

    // Speak text using TTS
    const speak = useCallback((text: string) => {
        if (!isSpeechSynthesisSupported() || !voiceEnabled || !text) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // Try to use a more natural voice if available
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(
            (v) => v.lang.startsWith("en") && v.name.includes("Google")
        ) || voices.find((v) => v.lang.startsWith("en"));

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    }, [voiceEnabled, language]);

    // Stop speaking
    const stopSpeaking = useCallback(() => {
        if (isSpeechSynthesisSupported()) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, []);

    return {
        isListening,
        isSupported,
        isSpeaking,
        transcript,
        startListening,
        stopListening,
        speak,
        stopSpeaking,
        voiceEnabled,
        setVoiceEnabled,
    };
}
