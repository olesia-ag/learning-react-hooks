import React, { useCallback, useReducer, useMemo, useEffect } from 'react'
import IngredientForm from './IngredientForm'
import Search from './Search'
import IngredientList from './IngredientList'
import ErrorModal from '../UI/ErrorModal'
import useHttp from '../../hook/http'

const ingredientReducer = (currentIngredients, action) => {
	switch (action.type) {
		case 'SET':
			return action.ingredients
		case 'ADD':
			return [...currentIngredients, action.ingredient]
		case 'DELETE':
			return currentIngredients.filter((ing) => ing.id !== action.id)
		default:
			throw new Error('should not get there')
	}
}

function Ingredients() {
	const [userIngredients, dispatch] = useReducer(ingredientReducer, [])
	const {
		isLoading,
		data,
		error,
		sendRequest,
		reqExtra,
		reqIdentifier,
	} = useHttp()

	// will listen to the change of the data:
	useEffect(() => {
		if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
			dispatch({ type: 'DELETE', id: reqExtra })
		} else if (!isLoading && !error &&  reqIdentifier === 'ADD_INGREDIENT') {
			dispatch({ type: 'ADD', ingredient: { id: data.name, ...reqExtra } })
		}
	}, [data, reqExtra, reqIdentifier, isLoading, error])

	//useCallback caches it, so that this function will survive render cycles
	const filteredIngredientsHandler = useCallback((filteredIngredients) => {
		// setUserIngredients(filteredIngredients)
		dispatch({ type: 'SET', ingredients: filteredIngredients })
	}, [])

	const addIngredient = useCallback((ingredient) => {
		sendRequest(
			'https://react-hooks-olesia.firebaseio.com/ingredients.json',
			'POST',
			JSON.stringify(ingredient),
			ingredient,
			'ADD_INGREDIENT'
		)
	}, [])

	// dispatchHttp({ type: 'SEND' })
	// fetch('https://react-hooks-olesia.firebaseio.com/ingredients.json', {
	// 	method: 'POST',
	// 	body: JSON.stringify(ing),
	// 	headers: { 'Content-Type': 'application/json' },
	// })
	// .then((response) => {
	// dispatchHttp({ type: 'RESPONSE' })
	// 	return response.json()
	// })
	// .then((responseData) => {
	//firebase specific: 'name' is id
	// setUserIngredients((prevIngredients) => [
	// 	...prevIngredients,
	// 	{ id: responseData.name, ...ing },
	// ])
	// 	dispatch({ type: 'ADD', ingredient: { id: responseData.name, ...ing } })
	// })
	// }, [])

	const removeItemHandler = useCallback(
		(id) => {
			// dispatchHttp({ type: 'SEND' })
			sendRequest(
				`https://react-hooks-olesia.firebaseio.com/ingredients/${id}.json`,
				'DELETE',
				null,
				id,
				'REMOVE_INGREDIENT'
			)
		},
		[sendRequest]
	)

	//this will trigger one render cycle
	const clearError = useCallback(() => {
		// dispatchHttp({ type: 'CLEAR' })
	}, [])

	const ingredientList = useMemo(() => {
		return (
			<IngredientList
				ingredients={userIngredients}
				onRemoveItem={removeItemHandler}
			/>
		)
	}, [userIngredients, removeItemHandler])

	return (
		<div className='App'>
			{error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
			<IngredientForm onAdd={addIngredient} loading={isLoading} />

			<section>
				<Search onLoadIngredients={filteredIngredientsHandler} />
				{ingredientList}
			</section>
		</div>
	)
}

export default Ingredients
