import React, { useCallback, useReducer, useMemo } from 'react'
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
			return currentIngredients.filter((ing) => ing.id !== action.id)
		default:
			throw new Error('should not get there')
	}
}

const httpReducer = (curHttpState, action) => {
	switch (action.type) {
		case 'SEND':
			return { loading: true, error: null }
		case 'RESPONSE':
			return { ...curHttpState, loading: false }
		case 'ERROR':
			return { loading: false, error: action.errorMessage }
		case 'CLEAR':
			return { ...curHttpState, error: null }
		default:
			throw new Error('should not get there')
	}
}

function Ingredients() {
	const [userIngredients, dispatch] = useReducer(ingredientReducer, [])
	// const [userIngredients, setUserIngredients] = useState([])
	const [httpState, dispatchHttp] = useReducer(httpReducer, {
		loading: false,
		error: null,
	})
	// const [isLoading, setIsLoading] = useState(false)
	// const [error, setError] = useState()

	//useCallback caches it, so that this function will survive render cycles
	const filteredIngredientsHandler = useCallback((filteredIngredients) => {
		// setUserIngredients(filteredIngredients)
		dispatch({ type: 'SET', ingredients: filteredIngredients })
	}, [])

	const addIngredient = useCallback((ing) => {
		dispatchHttp({ type: 'SEND' })
		fetch('https://react-hooks-olesia.firebaseio.com/ingredients.json', {
			method: 'POST',
			body: JSON.stringify(ing),
			headers: { 'Content-Type': 'application/json' },
		})
			.then((response) => {
				dispatchHttp({ type: 'RESPONSE' })
				return response.json()
			})
			.then((responseData) => {
				//firebase specific: 'name' is id
				// setUserIngredients((prevIngredients) => [
				// 	...prevIngredients,
				// 	{ id: responseData.name, ...ing },
				// ])
				dispatch({ type: 'ADD', ingredient: { id: responseData.name, ...ing } })
			})
	}, [])

	const removeItemHandler = useCallback((id) => {
		dispatchHttp({ type: 'SEND' })
		fetch(`https://react-hooks-olesia.firebaseio.com/ingredients/${id}.json`, {
			method: 'DELETE',
		})
			.then((response) => {
				dispatchHttp({ type: 'RESPONSE' })
				// setUserIngredients((prevIngredients) =>
				// 	prevIngredients.filter((ing) => ing.id !== id)
				// )
				dispatch({ type: 'DELETE', id: id })
			})
			.catch((error) => {
				dispatchHttp({ type: 'ERROR', errorMessage: error.message })
			})
	}, [])

	//this will trigger one render cycle
	const clearError = useCallback(() => {
		dispatchHttp({ type: 'CLEAR' })
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
			{httpState.error && (
				<ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
			)}
			<IngredientForm onAdd={addIngredient} loading={httpState.loading} />

			<section>
				<Search onLoadIngredients={filteredIngredientsHandler} />
				{ingredientList}
			</section>
		</div>
	)
}

export default Ingredients
