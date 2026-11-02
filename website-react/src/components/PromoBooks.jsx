import { useEffect, useRef } from "react";
import { COVERS, FIELD_DEFAULTS, drawCover } from "../lib/coverTemplates.js";

// Five live-drawn covers for the home-page cover maker banner. This file pulls in the whole cover
// template library, so it is only downloaded when the banner is about to scroll into view.
const PICKS = ["noir-0", "realm-0", "bloom-0", "neon-0", "stack-0"].map((id) => COVERS.find((c) => c.id === id));

function Mini({ cover, i }) {
  const ref = useRef(null);
  useEffect(() => {
    // Draw once the fonts are available so the titles render in their real typefaces.
    let off = false;
    const paint = () => !off && ref.current && drawCover(ref.current, 260, 390, cover.tpl, { ...cover.palette, ...FIELD_DEFAULTS, font: cover.font, ...cover.deco });
    paint();
    document.fonts?.ready.then(paint);
    return () => { off = true; };
  }, [cover]);
  return <canvas ref={ref} className={"cmp-book cmp-book--" + i} width="260" height="390" aria-hidden="true" />;
}

export default function PromoBooks() {
  return PICKS.map((c, i) => <Mini key={c.id} cover={c} i={i} />);
}
