import React, { useState } from 'react'

import Card from '../UI/Card'
import './IngredientForm.css'

const IngredientForm = React.memo((props) => {
  //useState always return an array with two elem: first is curret state snapshot, the second is funcion allows update the state:
const inputState = useState({title: '', amount: ''}, )

	const submitHandler = (event) => {
		event.preventDefault()
		// ...
	}

	return (
		<section className='ingredient-form'>
			<Card>
				<form onSubmit={submitHandler}>
					<div className='form-control'>
						<label htmlFor='title'>Name</label>
						<input type='text' id='title' />
					</div>
					<div className='form-control'>
						<label htmlFor='amount'>Amount</label>
						<input type='number' id='amount' />
					</div>
					<div className='ingredient-form__actions'>
						<button type='submit'>Add Ingredient</button>
					</div>
				</form>
			</Card>
		</section>
	)
})

export default IngredientForm
