export const TooltipText = ({ text, position }: {text:string, position: {x:number, y:number}}) => {

  return (
    <>
        <div 
          className="fixed z-50 select-none px-2 py-1 text-xs bg-gray-800 text-white rounded whitespace-nowrap"
          style={{
            left: `${position.x}px`,
            top: `${position.y-5}px`,
            // transform: 'translateX(-50%)'
          }}
        >
          {text}
          <div className="absolute top-full left-2 w-2 h-2 bg-gray-800 transform -translate-y-1/2 rotate-45" />
        </div>
    </>
  );
};