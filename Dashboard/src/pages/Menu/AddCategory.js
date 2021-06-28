import React, {  useState } from 'react'

import { 
    TextField, 
    Button
} from '@material-ui/core';

import MenuCategoryDataService from '../../services/menuCategory.service';

export default function AddCategory() {
    const [menuCategory, setMenuCategory] = useState("");

    const handleInputChange = event => {
        const { value } = event.target;
        setMenuCategory(value);
    };

    const saveMenuCategory = () => {
        MenuCategoryDataService.create(menuCategory);
    };

    return (
        <div>
            <div>
                <TextField name="menuCategory" label="Name" onChange={handleInputChange} />
            </div>
            <div>
                <Button variant="contained" color="primary" onClick={saveMenuCategory}>Add</Button>
            </div>
        </div>
    )
}

