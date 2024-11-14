import React, { useState, useRef, useEffect } from 'react';
import { translateTexts } from 'utils/TranslationService';

import translateIcon from 'assets/translate-icon.png'; // 번역하기 아이콘
import restoreIcon from 'assets/original-icon.png'; // 원본 복구 아이콘
import englishIcon from 'assets/english-icon.png'; // 영어 아이콘
import koreanIcon from 'assets/korean-icon.png'; // 한국어 아이콘
import frenchIcon from 'assets/french-icon.png'; // 프랑스어 아이콘
import spanishIcon from 'assets/spanish-icon.png'; // 스페인어 아이콘
import japaneseIcon from 'assets/japanese-icon.png'; // 일본어 아이콘
import chineseIcon from 'assets/chinese-icon.png'; // 중국어 아이콘 (간체자)
import upArrowIcon from 'assets/up-arrow-icon.png'; // 맨 위로 이동 아이콘

const TranslatePage = () => {
    const [isTranslated, setIsTranslated] = useState(false);
    const [originalTexts, setOriginalTexts] = useState([]);
    const [showLanguageOptions, setShowLanguageOptions] = useState(false);
    const hideTimeoutRef = useRef(null);

    const languages = [
        { code: 'en', alt: 'English', icon: englishIcon },
        { code: 'ko', alt: '한국어', icon: koreanIcon },
        { code: 'fr', alt: 'Français', icon: frenchIcon },
        { code: 'es', alt: 'Español', icon: spanishIcon },
        { code: 'ja', alt: '日本語', icon: japaneseIcon },
        { code: 'zh-CN', alt: '中文', icon: chineseIcon },
    ];

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // 부드럽게 맨 위로 스크롤
    };

    const handleMouseLeave = () => {
        hideTimeoutRef.current = setTimeout(() => setShowLanguageOptions(false), 200);
    };

    const handleMouseEnter = () => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
        }
        setShowLanguageOptions(true);
    };

    const handleTranslate = async (targetLanguage) => {
        const textNodes = findTextNodes(document.body);
        const textsToTranslate = [];
        const originals = [];

        textNodes.forEach((node) => {
            originals.push(node.nodeValue);
            textsToTranslate.push(node.nodeValue);
        });

        setOriginalTexts(originals);

        if (textsToTranslate.length > 0) {
            const translatedTexts = await translateTexts(textsToTranslate, targetLanguage);
            translatedTexts.forEach((translatedText, i) => {
                textNodes[i].nodeValue = translatedText;
            });
        }

        setIsTranslated(false);
        setShowLanguageOptions(false);
    };

    const handleRestore = () => {
        const textNodes = findTextNodes(document.body);
        originalTexts.forEach((originalText, i) => {
            textNodes[i].nodeValue = originalText;
        });
        setIsTranslated(false);
    };

    const findTextNodes = (node) => {
        let textNodes = [];
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '') {
            textNodes.push(node);
        } else {
            node.childNodes.forEach((child) => {
                textNodes = textNodes.concat(findTextNodes(child));
            });
        }
        return textNodes;
    };

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                position: 'fixed',
                bottom: '200px',
                right: '7%',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column-reverse',
                zIndex: 1000,
            }}
        >
            <img
                src={isTranslated ? restoreIcon : translateIcon}
                alt={isTranslated ? '원본으로 복구' : '번역하기'}
                onClick={isTranslated ? handleRestore : null}
                style={{
                    cursor: 'pointer',
                    width: '65px',
                    height: '60px',
                    marginTop: '100px',
                }}
            />

            {/* 맨 위로 이동 버튼 */}
            <img
                src={upArrowIcon}
                alt="맨 위로 이동"
                onClick={scrollToTop}
                style={{
                    cursor: 'pointer',
                    width: '50px',
                    height: '50p',
                    marginBottom: '-240px',
                }}
            />

            {/* 언어 선택 버튼들 */}
            {showLanguageOptions && !isTranslated && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: '70px',
                        display: 'flex',
                        flexDirection: 'column-reverse',
                        backgroundColor: 'white',
                        padding: '10px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    {languages.map(({ code, alt, icon }) => (
                        <img
                            key={code}
                            src={icon}
                            alt={alt}
                            onClick={() => handleTranslate(code)}
                            style={{
                                cursor: 'pointer',
                                width: '55px',
                                height: '20px',
                                margin: '5px',
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TranslatePage;
