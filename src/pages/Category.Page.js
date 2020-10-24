import React from 'react';
import AddFormCategory from '../Components/AddFormCategory.Component';
import Category from "../Components/Category.Component";

const CategoryPage = (props) => {
    return(
        <React.Fragment>
            <Category/>
            <AddFormCategory/>
        </React.Fragment>
    );
};

export default CategoryPage;