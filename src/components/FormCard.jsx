import React, { useState } from 'react';
import {Dialog , TextField, Grid, Button, OutlinedInput} from '@mui/material'
import messages from '../labels'

const FormCard = ({currentCard = null, onSubmit, onClose}) => {
	const [title, setTitle] = useState(currentCard && currentCard.titulo? currentCard.titulo : '');

	const [content, setContent] = useState(currentCard && currentCard.conteudo? currentCard.conteudo : '');

	return (
		<Dialog
			open={true}
			onClose={onClose}
			maxWidth="lg"
			width={500}
			transparent={true}
		>
			<Grid container direction='column' className='card-form-container'>
				<TextField
					required
					id="outlined-required"
					label={messages.title}
					className='card-form-input'
					onChange={(e) => setTitle(e.target.value)}
					value={title}
				/>
				<OutlinedInput
					required
					multiline
					className='card-form-input'
					classes={{root: 'outlinedInput'}}
					onChange={(e) => setContent(e.target.value)}
					value={content}
				/>
				<Button className='header-button' onClick={() => onSubmit({...currentCard, titulo: title, conteudo: content}, !currentCard)}>{messages.save}</Button>
			</Grid>
			
    </Dialog>
	)
}

export default FormCard