import React, { useState } from 'react'
import IngredientForm from './IngredientForm'
import Search from './Search'
import IngredientList from './IngredientList'

function Ingredients() {
	const [ingredients, setIngredients] = useState([])
	const addIngredient = (ing) => {
		setIngredients((prevIngredients) => [...prevIngredients, {id: Math.random().toString(), ...ing}])
  }
  
  const removeItemHandler = (id) =>{
    const newIngredients = ingredients.filter(ing=> ing.id !== id)
    setIngredients(newIngredients)
  }

	return (
		<div className='App'>
			<IngredientForm onAdd={addIngredient}/>

			<section>
				<Search />
				{/* Need to add list here! */}
				<IngredientList ingredients={ingredients}  onRemoveItem = {removeItemHandler} />
			</section>
		</div>
	)
}

export default Ingredients
