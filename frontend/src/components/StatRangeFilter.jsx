'use client' 
export function StatRangeFilter ( {hpRange, setHpRange} ) {   
    const getBackgroundSize = () => { 
        const max = 260;
        const startPercent = (hpRange[0] / max) * 100;
        const endPercent = (hpRange[1] / max) * 100;
        return `linear-gradient(to right, 
                #ff0000 ${startPercent}%,
                #17ac67 ${startPercent}%,
                #17ac67 ${endPercent}%,
                #ff0000 ${endPercent}%)`;
    };
  return ( 
    <div className="filter-hp"> 
        <div className="slider-container">
            <input
                type="range"
                min={0}
                max={260}
                value={hpRange[0]}
                onChange={(e) => setHpRange([Math.min(Number(e.target.value), hpRange[1] - 1), hpRange[1]])}
                className="slider"
                style={{ background: getBackgroundSize() }}
            />
            <input
                type="range"
                min={0}
                max={260}
                value={hpRange[1]}
                onChange={(e) => setHpRange([hpRange[0], Math.max(Number(e.target.value), hpRange[0] + 1)])}
                className="slider"
                style={{ background: getBackgroundSize() }}
            />
        </div>
    </div> 
  )
}