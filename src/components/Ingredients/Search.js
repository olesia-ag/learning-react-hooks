import React, { useState, useEffect, useRef } from 'react'
import Card from '../UI/Card'
import './Search.css'
import useHttp from '../../hook/http'
import ErrorModal from '../UI/ErrorModal'

const Search = React.memo((props) => {
	//object destructuring:
	const { onLoadIngredients } = props
	const [enteredFilter, setEnteredFilter] = useState('')
	const inputRef = useRef()
	const { isLoading, data, error, sendRequest, clear } = useHttp()

	useEffect(
		() => {
			const timer = setTimeout(() => {
				//enteredfilter will not be the current value but the old one, 500mlsec ago:
				//if current value (because inputRef defined outside of the closure) is the same as it was when we set the timer
				if (enteredFilter === inputRef.current.value) {
					const query =
						enteredFilter.length === 0
							? ''
							: `?orderBy="title"&equalTo="${enteredFilter}"`
					sendRequest(
						'https://react-hooks-olesia.firebaseio.com/ingredients.json' +
							query,
						'GET'
					)
					// fetch(
					// 	'https://react-hooks-olesia.firebaseio.com/ingredients.json' + query
					// )
					// .then((res) => res.json())
					// .then((responseData) => {
				}
			}, 500)
			//this function will run before same useEffect runs again
			//(if the effect runs once ([]) the cleanup function will only run when component unmounted
			return () => {
				clearTimeout(timer)
			}
		},
		//in JS, functions are objects and and behave like any other value, therefore, they can change:
		[enteredFilter, sendRequest, inputRef]
	)

	useEffect(() => {
		if (!isLoading && !error && data) {
			const loadedIngredients = []
			for (const key in data) {
				loadedIngredients.push({
					id: key,
					title: data[key].title,
					amount: data[key].amount,
				})
			}
			onLoadIngredients(loadedIngredients)
		}
	}, [data, isLoading, error, onLoadIngredients])

	return (
		<section className='search'>
      {error && <ErrorModal onClose ={clear}>{error}</ErrorModal>}
			<Card>
				<div className='search-input'>
					<label>Filter by Title</label>
          {isLoading && <span>Loading ...</span>}
					<input
						ref={inputRef}
						type='text'
						value={enteredFilter}
						onChange={(event) => setEnteredFilter(event.target.value)}
					/>
				</div>
			</Card>
		</section>
	)
})

export default Search
