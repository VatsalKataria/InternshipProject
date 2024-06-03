import { useState } from 'react';
import Arrow from "/src/assets/arrowimg.jpg";

const DropDownList = () => {
    const [open, setOpen] = useState(false);
    
    const handleOpen = () => {
    setOpen(!open);
};

    return (
        <>
        <div className='DropDownList'>
            <button className='Dlist-title' onClick={handleOpen}>DigiDrive</button>
            
                <img src={Arrow} alt="ArrowImage" className='ArrowImage'/>            
            {open ? (
                <ul>
                    <li>Micro-Controller</li>
                    <li>Resistor</li>
                    <li>Capacitor</li>
                </ul>
            ) : null}
        </div>
        </>
    )
};

export default DropDownList;
