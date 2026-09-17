import React, { useState } from "react";
import "./InteractiveWallet.css";

export interface PaymentCardData {
  id: string;
  type: "stripe" | "wise" | "paypal" | string;
  title: React.ReactNode;
  label: string;
  value: string;
  maskedNumber: string;
  fullNumber: string;
}

export interface InteractiveWalletProps {
  balance?: string;
  balanceLabel?: string;
  cards?: PaymentCardData[];
  onCardSelect?: (card: PaymentCardData) => void;
  className?: string;
  defaultShowBalance?: boolean;
}

const DEFAULT_CARDS: PaymentCardData[] = [
  {
    id: "stripe",
    type: "stripe",
    title: "Stripe",
    label: "Holder",
    value: "ALEX SMITH",
    maskedNumber: "**** 4242",
    fullNumber: "5524 9910 4242",
  },
  {
    id: "wise",
    type: "wise",
    title: "Wise",
    label: "Business",
    value: "STUDIO LLC",
    maskedNumber: "**** 8810",
    fullNumber: "9012 4432 8810",
  },
  {
    id: "paypal",
    type: "paypal",
    title: (
      <>
        Pay<b style={{ color: "#0079C1" }}>Pal</b>
      </>
    ),
    label: "Email",
    value: "hello@work.com",
    maskedNumber: "**** 0094",
    fullNumber: "3312 0045 0094",
  },
];

export default function InteractiveWallet({
  balance = "$12,450.00",
  balanceLabel = "Total Balance",
  cards = DEFAULT_CARDS,
  onCardSelect,
  className = "",
  defaultShowBalance = false,
}: InteractiveWalletProps) {
  const [showRealBalance, setShowRealBalance] = useState(defaultShowBalance);

  const handleEyeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowRealBalance((prev) => !prev);
  };

  return (
    <div className={`interactive-wallet-container ${className}`}>
      <div className={`wallet ${showRealBalance ? "show-real" : ""}`}>
        {/* Wallet Back panel */}
        <div className="wallet-back"></div>

        {/* Dynamic Payment Cards Deck */}
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card ${card.type}`}
            onClick={() => onCardSelect && onCardSelect(card)}
            title={`Click to select ${card.type} card`}
          >
            <div className="card-inner">
              <div className="card-top">
                <span>{card.title}</span>
                <div className="chip"></div>
              </div>
              <div className="card-bottom">
                <div className="card-info">
                  <span className="label">{card.label}</span>
                  <span className="value">{card.value}</span>
                </div>
                <div className="card-number-wrapper">
                  <span className="hidden-stars">{card.maskedNumber}</span>
                  <span className="card-number">{card.fullNumber}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Leather Pocket Front */}
        <div className="pocket">
          <svg className="pocket-svg" viewBox="0 0 280 160" fill="none">
            <path
              d="M 0 20 C 0 10, 5 10, 10 10 C 20 10, 25 25, 40 25 L 240 25 C 255 25, 260 10, 270 10 C 275 10, 280 10, 280 20 L 280 120 C 280 155, 260 160, 240 160 L 40 160 C 20 160, 0 155, 0 120 Z"
              fill="#1e341e"
            ></path>
            <path
              d="M 8 22 C 8 16, 12 16, 15 16 C 23 16, 27 29, 40 29 L 240 29 C 253 29, 257 16, 265 16 C 268 16, 272 16, 272 22 L 272 120 C 272 150, 255 152, 240 152 L 40 152 C 25 152, 8 152, 8 120 Z"
              stroke="#3d5635"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            ></path>
          </svg>
          <div className="pocket-content">
            <div style={{ position: "relative", height: "24px", width: "100%" }}>
              <div className="balance-stars">******</div>
              <div className="balance-real">{balance}</div>
            </div>
            <div style={{ color: "#698263", fontSize: "12px", fontWeight: 500 }}>
              {balanceLabel}
            </div>
            <div
              className="eye-icon-wrapper"
              onClick={handleEyeClick}
              title={showRealBalance ? "Lock/Hide balance" : "Show balance"}
            >
              <svg
                className="eye-icon eye-slash"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
                <line x1="3" y1="3" x2="21" y2="21"></line>
              </svg>
              <svg
                className="eye-icon eye-open"
                style={{ opacity: showRealBalance ? 1 : 0 }}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
