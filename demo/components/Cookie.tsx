'use client';
import { Badge } from 'primereact/badge';

const Cookie = ({ sentence, date, badgeValue, badgeColor }) => {
    return (
        <>
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <div style={{ position: 'absolute', top: '35%', left: '55%', transform: 'translate(-50%, -50%)', zIndex: 1 }}>{sentence}</div>
                <img src="/demo/images/access/cookie-broken.png" alt="Broken fortune cookie" style={{ width: '90%', height: 'auto' }} />
            </div>
            <div>
                <span>{date}</span>
                <div style={{ marginTop: '.5em' }} className="flex flex-wrap justify-content-center align-items-end gap-2">
                    <Badge value={badgeValue} severity={badgeColor}></Badge>
                </div>
            </div>
        </>
    );
};

export default Cookie;
