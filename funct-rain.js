    const mCanvas = document.getElementById('matrix-canvas');
    const mCtx = mCanvas.getContext('2d');
    mCanvas.width = window.innerWidth; mCanvas.height = window.innerHeight;
    
    const fontSize = 16;
    const columns = Math.floor(mCanvas.width / fontSize);
    const drops = new Array(columns).fill(-1);
    const directiveDrops = new Array(columns).fill(null);
    
    const directives = [
        "LIQUIDITY_MAXIMIZED", "RISK_MITIGATION_ALPHA", "ASSET_BACKED_SECURITY", 
        "PORTFOLIO_OPTIMIZED", "LENDER_CORE_ACTIVE", "EQUITY_SHIELD_V4", 
        "HIGH_YIELD_TARGET", "CREDIT_DEFAULT_SWAP_OFF", "AMORTIZATION_LOCKED", 
        "MARGIN_CALL_PREVENTED", "VOLATILITY_INDEX_LOW", "CAPITAL_ADEQUACY_RATIO",
        "FISCAL_RESERVE_STABLE", "ARBITRAGE_SEEKING", "DERIVATIVE_EXPOSURE_LIMIT",
        "MARKET_NEUTRAL_STRATEGY", "BULL_MARKET_SENTIMENT", "BEAR_THREAT_NEUTRALIZED",
        "LEVERAGE_ADJUSTED", "TRANSACTION_HASH_VERIFIED", "BLOCKCHAIN_LEDGER_SYNC",
        "QUANTITATIVE_ANALYSIS", "ALGORITHMIC_SHELTER", "REVENUE_STREAM_PROTECT",
        "DEBT_TO_EQUITY_NORMAL", "INSOLVENCY_BARRIER_HIGH", "SOLVENCY_CHECK_PASSED",
        "FIAT_LIQUIDITY_POOL", "ASSET_ALLOCATION_FIXED", "CRYPTOGRAPHIC_AUDIT",
        "LENDER_INTERNAL_ONLY", "CONCORD_PROTOCOL_INIT", "VOID_RECONCILIATION"
    ];
    
    let fadingMarks = [];

    function triggerScan() {
        const isFullSweep = Math.random() > 0.1; 
        for (let i = 0; i < drops.length; i++) {
            if (isFullSweep || Math.random() > 0.4) {
                if (drops[i] === -1) {
                    drops[i] = 0;
                    if (Math.random() > 0.45) { 
                        directiveDrops[i] = { 
                            text: directives[Math.floor(Math.random() * directives.length)], 
                            y: 0,
                            speed: Math.random() * 2 + 1.5,
                            flash: false, 
                            hasFlashed: false,
                            ttl: 75 
                        };
                    }
                }
            }
        }
        setTimeout(triggerScan, Math.random() * 3000 + 1000);
    }

    function drawMatrix() {
        mCtx.fillStyle = 'rgba(0, 0, 0, 0.2)'; 
        mCtx.fillRect(0, 0, mCanvas.width, mCanvas.height);

        fadingMarks = fadingMarks.filter(mark => mark.life > 0);
        fadingMarks.forEach(mark => {
            mCtx.font = 'bold 13px Orbitron';
            mCtx.fillStyle = `rgba(168, 65, 0, ${mark.life / 75})`; 
            mCtx.fillText(mark.text, mark.x, mark.y);
            mark.life -= 1; 
        });

        for (let i = 0; i < drops.length; i++) {
            if (drops[i] >= 0) {
                const leadCrimson = '#ff1a1a';
                const trailCrimson = '#3d0405';
                for (let j = 0; j < 5; j++) {
                    const yPos = (drops[i] - j) * fontSize;
                    if (yPos < 0) continue;
                    mCtx.fillStyle = j === 0 ? leadCrimson : trailCrimson;
                    mCtx.font = fontSize + 'px monospace';
                    mCtx.fillText(String.fromCharCode(0x30A0 + Math.random() * 96), i * fontSize, yPos);
                }
                drops[i] += 1.8; 
                if (drops[i] * fontSize > mCanvas.height + 150) drops[i] = -1;
            }

            if (directiveDrops[i]) {
                const d = directiveDrops[i];
                const textX = i * fontSize;
                if (!d.hasFlashed) {
                    d.y = drops[i] > -1 ? drops[i] * fontSize : d.y + d.speed;
                } else {
                    d.y += d.speed;
                }
                if (!d.hasFlashed && drops[i] > 5 && Math.random() > 0.70) {
                    d.flash = true;
                    d.hasFlashed = true;
                    fadingMarks.push({ x: textX, y: d.y, text: d.text, life: 75 });
                }
                mCtx.font = 'bold 12px Orbitron';
                if (d.flash) {
                    mCtx.fillStyle = '#ffffff'; 
                    mCtx.fillText(d.text, textX, d.y);
                    d.flash = false; 
                } else if (!d.hasFlashed) {
                    mCtx.fillStyle = '#3d0405';
                    mCtx.fillText(d.text, textX, d.y);
                } else {
                    mCtx.fillStyle = `rgba(168, 65, 0, ${d.ttl / 75})`;
                    mCtx.fillText(d.text, textX, d.y);
                    d.ttl--;
                    if (d.ttl <= 0 || d.y > mCanvas.height) directiveDrops[i] = null;
                }
            }
        }
    }

    triggerScan();
    setInterval(drawMatrix, 40);