import { useRef, useState } from "react";
import { CalendarHeart, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate } from "../utils/formatDate";

const ANGLE_STEP = 40;
const RADIUS = 360;

function getCardStyle(index, activeIndex) {
  const offset = index - activeIndex;
  const rad = (offset * ANGLE_STEP * Math.PI) / 180;
  const translateX = Math.sin(rad) * RADIUS;
  const translateZ = Math.cos(rad) * RADIUS - RADIUS;
  const rotateY = offset * ANGLE_STEP;
  const scale = 0.62 + 0.38 * Math.cos(rad);
  const visible = Math.abs(offset) <= 3;
  const opacity = visible ? Math.max(0, Math.cos(rad) * 0.55 + 0.45) : 0;
  const zIndex = 100 - Math.abs(offset);

  return {
    transform: `translate3d(${translateX}px, 0px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
    opacity,
    zIndex,
    pointerEvents: visible ? "auto" : "none",
    transition: "transform 0.55s cubic-bezier(0.23,1,0.32,1), opacity 0.35s ease",
    willChange: "transform",
  };
}

export function MomentWheel3D({ moments, activeMoment, onSpin, onSelect }) {
  const dragStartRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  function handlePointerDown(e) {
    dragStartRef.current = e.clientX;
    setIsDragging(false);
  }

  function handlePointerMove(e) {
    if (dragStartRef.current !== null && Math.abs(e.clientX - dragStartRef.current) > 8) {
      setIsDragging(true);
    }
  }

  function handlePointerUp(e) {
    if (dragStartRef.current === null) return;
    const delta = e.clientX - dragStartRef.current;
    if (Math.abs(delta) > 35) {
      onSpin(delta < 0 ? 1 : -1);
    }
    dragStartRef.current = null;
    setIsDragging(false);
  }

  function handlePointerLeave(e) {
    if (dragStartRef.current !== null) {
      const delta = e.clientX - dragStartRef.current;
      if (Math.abs(delta) > 35) onSpin(delta < 0 ? 1 : -1);
      dragStartRef.current = null;
      setIsDragging(false);
    }
  }

  return (
    <div className="glass-panel relative min-h-[34rem] overflow-hidden p-5 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-gold">Spin wheel</p>
          <p className="mt-1 text-sm text-white/60">Drag, click arrows, or tap a card.</p>
        </div>
        <div className="flex gap-2">
          <button
            className="wheel-control"
            type="button"
            aria-label="Previous moment"
            onClick={() => onSpin(-1)}
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            className="wheel-control"
            type="button"
            aria-label="Next moment"
            onClick={() => onSpin(1)}
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        className="wheel-stage-3d mt-8"
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      >
        <div className="wheel-scene">
          {moments.map((moment, index) => (
            <button
              key={moment.id}
              type="button"
              className="wheel-card-3d"
              data-active={index === activeMoment}
              style={getCardStyle(index, activeMoment)}
              onClick={() => !isDragging && onSelect(index)}
            >
              <img
                className="h-40 w-full object-cover"
                src={moment.image_url || moment.image}
                alt=""
                draggable={false}
              />
              <div className="p-4">
                <span className="inline-flex items-center gap-2 text-xs font-black uppercase text-gold">
                  <CalendarHeart className="size-3.5" aria-hidden="true" />
                  {formatDate(moment.date)}
                </span>
                <h3 className="mt-2 text-base font-black leading-5">{moment.title}</h3>
                <p className="mt-2 line-clamp-3 text-xs leading-5 text-white/70">{moment.impact}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
