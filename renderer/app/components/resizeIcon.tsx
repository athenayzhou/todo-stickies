import React from "react";

interface ResizeIconProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
    gridCount?: number;
    spacingFactor?: number;
    onMouseDown?: (e: React.MouseEvent<SVGSVGElement>) => void;
}

const ResizeIcon: React.FC<ResizeIconProps> = ({
    size = 20,
    gridCount = 3,
    spacingFactor = 0.8,
    className = "",
    onMouseDown,
    ...props
}) => {
    const dots=[];
    const step = size/gridCount * spacingFactor;

    for(let y=0; y<gridCount; y++){
        for(let x=0; x<gridCount; x++){
            if(x + y >= gridCount-1){
                dots.push(
                    <circle
                        key={`${y} - ${x}`}
                        cx={x * step + step/2}
                        cy={y * step + step/2}
                        r={step/5}
                        fill='gray'
                    />
                );
            }
        }
    }

    return(
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className={`text-current ${className}`}
            onMouseDown={onMouseDown}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            {dots}
        </svg>
    )
}

export default ResizeIcon;