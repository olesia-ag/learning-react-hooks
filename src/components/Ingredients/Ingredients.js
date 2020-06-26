import React, { useState, useEffect, useCallback } from 'react'
import IngredientForm from './IngredientForm'
import Search from './Search'
import IngredientList from './IngredientList'
import ErrorModal from '../UI/ErrorModal'

function Ingredients() {
	const [userIngredients, setUserIngredients] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState()

	//useCallback caches it, so that this function will survive render cycles
	const filteredIngredientsHandler = useCallback((filteredIngredients) => {
		setUserIngredients(filteredIngredients)
	}, [])

	const addIngredient = (ing) => {
		setIsLoading(true)
		fetch('https://react-hooks-olesia.firebaseio.com/ingredients.json', {
			method: 'POST',
			body: JSON.stringify(ing),
			headers: { 'Content-Type': 'application/json' },
		})
			.then((response) => {
				setIsLoading(false)
				return response.json()
			})
			.then((responseData) => {
				//firebase specific: 'name' is id
				setUserIngredients((prevIngredients) => [
					...prevIngredients,
					{ id: responseData.name, ...ing },
				])
			})
	}

	const removeItemHandler = (id) => {
		setIsLoading(true)
		fetch(`https://react-hooks-olesia.firebaseio.com/ingredients/${id}.json`, {
			method: 'DELETE',
		})
			.then((response) => {
				setIsLoading(false)
				console.log('res:', response)
				setUserIngredients((prevIngredients) =>
					prevIngredients.filter((ing) => ing.id !== id)
				)
			})
			.catch((error) => {
				setError(error.message)
			})
	}

	const clearError = () => {
		setError(null)
		setIsLoading(false)
	}

	return (
		<div className='App'>
			{error && <ErrorModal onClose={clearError}>{error.message}</ErrorModal>}
			<IngredientForm onAdd={addIngredient} loading={isLoading} />

			<section>
				<Search onLoadIngredients={filteredIngredientsHandler} />

				<IngredientList
					ingredients={userIngredients}
					onRemoveItem={removeItemHandler}
				/>
			</section>
		</div>
	)
}

export default Ingredients
