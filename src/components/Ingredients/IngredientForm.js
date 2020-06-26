import React, { useState } from 'react'

import Card from '../UI/Card'
import './IngredientForm.css'
import LoadingIndicator from '../UI/LoadingIndicator'

const IngredientForm = React.memo((props) => {
	//useState always return an array with two elem: first is curret state snapshot, the second is funcion allows update the state:
	const [title, setTitle] = useState('')
	const [amount, setAmount] = useState('')

	const submitHandler = (event) => {
    event.preventDefault()
    props.onAdd({title: title, amount: amount})
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
							value={title}
							onChange={(event) =>
								// const newTitle = event.target.value
								//prevInputState will guarantee that we will get the LATEST state even if it was not fully commited by React
								setTitle(event.target.value)
							}
						/>
					</div>
					<div className='form-control'>
						<label htmlFor='amount'>Amount</label>
						<input
							type='number'
							id='amount'
							value={amount}
							onChange={(event) => 
								// const newAmount = event.target.value
								setAmount(event.target.value)
							}
						/>
					</div>
					<div className='ingredient-form__actions'>
						<button type='submit'>Add Ingredient</button>
            {props.loading && <LoadingIndicator /> }
					</div>
				</form>
			</Card>
		</section>
	)
})

export default IngredientForm
