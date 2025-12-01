import React, { useState } from "react";
import { MdOutlineLayers } from "react-icons/md";
import { FaArrowUp, FaArrowDown } from "react-icons/fa6";
import { ACTIVE_COLOR_PRIMARY, ACTIVE_COLOR_SECONDARY, INACTIVE_COLOR } from "../lib/constants";

type LayerControlsProps ={
    onLayerUp: () => void;
    onLayerDown: () => void;
}

export default function LayerControls({
    onLayerUp,
    onLayerDown,
} : LayerControlsProps){
  const [showLayerOptions, setShowLayerOptions] = useState(false);
  const [hover, setHover] = useState(false);

  return(
    <div
      className="relative flex flex-col items-center"
    >
        {showLayerOptions && (
        <button 
          className="layerUp absolute bottom-11 w-10 h-9 bg-white shadow-lg rounded flex items-center justify-center mb-1"
          style={{
            color: ACTIVE_COLOR_PRIMARY
          }}
          onClick={onLayerUp}
        >
            <FaArrowUp />
        </button>
        )}

        <button
          className="layerButton px-1 py-1 flex items-center justify-center rounded transition-colors"
          style={{
            backgroundColor: showLayerOptions 
                ? ACTIVE_COLOR_SECONDARY 
                : hover
                ? "#F3F4F6"
                : "#ffffff",
            color: showLayerOptions ? ACTIVE_COLOR_PRIMARY : INACTIVE_COLOR,
          }}
          onMouseEnter={()=>setHover(true)}
          onMouseLeave={()=>setHover(false)}
          onClick={() => setShowLayerOptions((prev)=> !prev)}
          aria-label="open layer options"
        >
            <MdOutlineLayers size={27} />
        </button>

        {showLayerOptions && (                    
        <button
          className="layerDown absolute top-12 w-10 h-9 bg-white shadow-xl rounded flex items-center justify-center"
          style={{
            color: ACTIVE_COLOR_PRIMARY
          }}
          onClick={onLayerDown}
        >
            <FaArrowDown />
        </button>
        )}
    </div>
  )
}