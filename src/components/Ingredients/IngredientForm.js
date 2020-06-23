import React, { useState } from 'react'

import Card from '../UI/Card'
import './IngredientForm.css'

const IngredientForm = React.memo((props) => {
	//useState always return an array with two elem: first is curret state snapshot, the second is funcion allows update the state:
	const [initState, setNewState] = useState({ title: '', amount: '' })

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
						<input
							type='text'
							id='title'
							value={initState.title}
							onChange={(event) => {
								const newTitle = event.target.value
								//prevInputState will guarantee that we will get the LATEST state even if it was not fully commited by React
								setNewState((prevInputState) => ({
									title: newTitle,
									amount: prevInputState.amount,
								}))
							}}
						/>
					</div>
					<div className='form-control'>
						<label htmlFor='amount'>Amount</label>
						<input
							type='number'
							id='amount'
							value={initState.amount}
							onChange={(event) => {
                const newAmount = event.target.value
								setNewState((prevInputState) => ({
									title: prevInputState.title,
									amount: newAmount,
								}))
              }}
						/>
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
