'use client';
import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { FortuneService } from '../../../../demo/service/FortuneService';
import { CookieService } from '../../../../demo/service/CookieService';
import { InputText } from 'primereact/inputtext';

const EmptyPage = () => {
    const [fortune, setFortune] = useState(null);
    const [words, setWords] = useState([]);
    const [cookie, setCookie] = useState([]);

    const body = {
        fortuneId: 0,
        words: []
    };

    useEffect(() => {
        FortuneService.getFortune().then((data) => setFortune(data as any));
    }, []);

    const [submitted, setSubmitted] = useState(false);

    const onInputChange = (index, value) => {
        const updatedWords = [...words];
        updatedWords[index] = value;
        setWords(updatedWords);
    };

    const saveCookie = () => {
        setSubmitted(true);
        if (words.length === fortune.neededWords.length) {
            const wordsData = words.map((word) => word.trim()).filter(Boolean);

            const isAnyInputEmpty = wordsData.some((word) => !word);
            if (isAnyInputEmpty) {
                return;
            }

            body.fortuneId = fortune.id;
            body.words = wordsData;

            CookieService.createPersonalCookies(body).then((data) => {
                setCookie(data);
            });
        }
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Fortune</h5>
                    {fortune && !submitted ? (
                        <>
                            {fortune.neededWords.map((word, index) => (
                                <div key={index} className="field">
                                    <label htmlFor={`word-${index}`}>
                                        {word.descriptor} ({word.wordType})
                                    </label>
                                    <InputText id={`word-${index}`} onChange={(e) => onInputChange(index, e.target.value)} required autoFocus />
                                </div>
                            ))}{' '}
                            <div className="field">
                                <Button label="Save" icon="pi pi-check" text onClick={saveCookie} />
                            </div>
                            <div className="field">{submitted && words.length !== fortune.neededWords.length && <small className="p-invalid">All words need to be filled.</small>}</div>
                        </>
                    ) : (
                        <>
                            {cookie && submitted && (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ position: 'relative', display: 'inline-block' }}>
                                        <div style={{ position: 'absolute', top: '35%', left: '55%', transform: 'translate(-50%, -50%)', zIndex: 1 }}>{cookie.fortuneCookieSentence}</div>
                                        <img src="/demo/images/access/cookie-broken.png" alt="Broken fortune cookie" style={{ width: '90%', height: 'auto' }} />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmptyPage;
