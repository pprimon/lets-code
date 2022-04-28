import {Card,Grid, IconButton, Typography} from '@mui/material'

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import messages from '../labels';

const BasicCard = ({currentCard, index, handleDeleteCard, nextCard, previosCard, handleEditCard}) => {
	if(currentCard) {
		return (
			<Card className='card-container'>
				<Grid container 
					justifyContent="space-around"
					alignItems="center"
					className='card-header'
				>
					<Grid xs={10}>
						<Typography className='ellipsis'>{currentCard.titulo}</Typography>
					</Grid>	
					<Grid xs={2}>
						<IconButton onClick={() => handleEditCard(currentCard)}>
							<EditIcon />
						</IconButton>
					</Grid>
				</Grid>
				
				<Grid>
					<p  
						dangerouslySetInnerHTML={{
							__html: currentCard.conteudo,
						}}
					/>
				</Grid>
	
				<Grid
					container 
					justifyContent="space-around"
					alignItems="center"
					className='card-actions'
				>
					<IconButton onClick={() => previosCard(index, currentCard.lista)}>
						<NavigateBeforeIcon />
					</IconButton>
	
					<IconButton onClick={() => handleDeleteCard(currentCard.id, currentCard.lista)}>
						<DeleteIcon />
					</IconButton>
	
					<IconButton onClick={() => nextCard(index, currentCard.lista)} >
						<NavigateNextIcon />
					</IconButton>
				</Grid>
			</Card>
		)
	}
	return <Typography>{messages.noneFindCard}</Typography>
}

export default BasicCard