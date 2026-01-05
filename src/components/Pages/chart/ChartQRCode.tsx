import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface ChartQRCodeProps {
  url: string;
}

const QRCode: React.FC<ChartQRCodeProps> = ({ url }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <a href={url} target="_blank" rel="noopener noreferrer">
        <QRCodeSVG value={url} size={160} level="M" bgColor="transparent" />
      </a>
    </div>
  );
};

export default QRCode;
