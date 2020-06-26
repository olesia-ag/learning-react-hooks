import React, { useState, useEffect, useCallback, useReducer } from 'react'
import IngredientForm from './IngredientForm'
import Search from './Search'
import IngredientList from './IngredientList'
import ErrorModal from '../UI/ErrorModal'

const ingredientReducer = (currentIngredients, action) => {
	switch (action.type) {
		case 'SET':
			return action.ingredients
		case 'ADD':
			return [...currentIngredients, action.ingredient]
		case 'DELETE':
			return currentIngredients.filter(ing=>ing.id !== action.id)	
		default:
			throw new Error('should not get there')
	}
}

const httpReducer = (httpState, action) => {
	switch(action.type){
		case 'SEND': 
			return {}
		case 'RESPONSE':
		case 'ERROR':	
		default:
			throw new Error('should not get there')	
	}
}

function Ingredients() {
	const [userIngredients, dispatch] = useReducer(ingredientReducer, [])
	// const [userIngredients, setUserIngredients] = useState([])
	
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState()

	//useCallback caches it, so that this function will survive render cycles
	const filteredIngredientsHandler = useCallback((filteredIngredients) => {
		// setUserIngredients(filteredIngredients)
		dispatch({type: 'SET', ingredients: filteredIngredients})
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
				// setUserIngredients((prevIngredients) => [
				// 	...prevIngredients,
				// 	{ id: responseData.name, ...ing },
				// ])
			dispatch({type: 'ADD', ingredient: { id: responseData.name, ...ing }})	
			})
	}

	const removeItemHandler = (id) => {
		setIsLoading(true)
		fetch(`https://react-hooks-olesia.firebaseio.com/ingredients/${id}.json`, {
			method: 'DELETE',
		})
			.then((response) => {
				setIsLoading(false)
				// setUserIngredients((prevIngredients) =>
				// 	prevIngredients.filter((ing) => ing.id !== id)
				// )
				dispatch({type: 'DELETE', id: id})
			})
			.catch((error) => {
				setError(error.message)
			})
	}
	//this will trigger one render cycle
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
