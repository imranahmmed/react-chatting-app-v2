import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs'
import Div from './Div';

const CustomDropdown = ({ children }) => {
    const [isDropDownOpen, setDropDownIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');

    const handleToggle = () => {
        setDropDownIsOpen(!isDropDownOpen);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setDropDownIsOpen(false);
    };

    return (
        <div className="dropdown">
            <BsThreeDotsVertical onClick={handleToggle} style={{ fontSize: "24px" }} />
            {isDropDownOpen && (
                <Div className="dropdown-list">
                    {children}

                    {/* <li onClick={() => handleOptionClick('Option 1')}>Option 1</li>
                    <li onClick={() => handleOptionClick('Option 2')}>Option 2</li>
                    <li onClick={() => handleOptionClick('Option 3')}>Option 3</li> */}
                </Div>
            )}
        </div>
    );
};

export default CustomDropdown