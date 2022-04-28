import {Component} from 'react'
import {loginUser} from '../services/auth'
import {getCards, deleteCard, updateCard, addCard} from '../services/cads'
import {Grid, Button, Typography} from '@mui/material'

import messages from '../labels';
import BasicCard from './Card'
import FormCard from './FormCard'

import './cards.css'

class CardsList extends Component {
    constructor(props) {
      super(props);
      this.state = {
        token: null,
        openFormModal: false,
        editCard: null, 
        lists: {
          todo: [],
          doing: [],
          done: []
        },
        currentCard: {
          todo: null,
          doing: null,
          done: null
        }
      };
      this.handleNextCard = this.handleNextCard.bind(this);
      this.handlePreviosCard = this.handlePreviosCard.bind(this);
      this.handleEditCard = this.handleEditCard.bind(this);
      this.handleDeleteCard = this.handleDeleteCard.bind(this)
    }
  
    async componentDidMount() {
    
      try {
        const token = await this.getToken()
        await this.setState({token})
        this.getCardList()
      } catch (err) {
        console.log(err)
      }
    }

    async getCardList() {
      const {token} = this.state

      const res = await getCards(token)
      const lists =  {
        todo:  res.data.filter((item) => item.lista === 'todo'),
        doing: res.data.filter((item) => item.lista === 'doing'),
        done: res.data.filter((item) => item.lista === 'done')
      }
      
      this.setState({
        lists,
        currentCard: {
          todo: {card: lists.todo[0], index: 0},
          doing: {card: lists.doing[0], index: 0},
          done:  {card: lists.done[0], index: 0}
        },
      })
    }

    async getToken() {
      try {
        const res =  await loginUser()
        return res.data
      } catch (err) {
        console.log(err)
      }
    }
    
    async handleDeleteCard(id) {
      const {token} = this.state
      try {
        await deleteCard(id, token)
        await this.getCardList()
      } catch (err) {
        console.log(err)
      }
      
    }

    handleFormCard = async (card, newCard = true) => {
      const {token} = this.state
      console.log(card, newCard )
      try {
        if(newCard) {
          await addCard({...card, lista: 'todo'}, token)
        } else {
          await updateCard(card, card.id, token)
        }
      } catch (err) {
        console.log(err)
      }
      await this.getCardList()
      this.setState({openFormModal: false, editCard: null})
    }

    handleNextCard(index, key) {
      const {currentCard, lists} = this.state
      const nextIndex = index + 1

      if(lists[key] && lists[key].length -1 < nextIndex) {
        return
      }
         
      this.setState({currentCard: {...currentCard, [key]: {
        card: lists[key][nextIndex],
        index: nextIndex
      }} })
    }

    handlePreviosCard(index, key) {
      const {lists, currentCard} = this.state
      const previosIndex = index - 1
      if((lists[key] && lists[key].length -1 < previosIndex) || (previosIndex >= -1) ) {
        return
      }
      this.setState({currentCard: {...currentCard, [key]: {
        card: lists[key][previosIndex],
        index: previosIndex
      }} })
    } 
    
    toggleFormCardModal() {
      const {openFormModal} = this.state
      this.setState({openFormModal: !openFormModal})
    }

    handleEditCard(card) {
      this.setState({openFormModal: true, editCard: card})
    }

    containerCard(title, key) {
      const {lists, currentCard} = this.state
  
      return (
        <Grid item xs={4} className='list-container'>
          <p  className='list-title'>
            {title}
          </p>
          {lists && lists[key] && lists[key].length > 0  ?
            (<BasicCard 
              currentCard={currentCard[key].card}
              index={currentCard[key].index}
              handleDeleteCard={this.handleDeleteCard}
              handleEditCard={this.handleEditCard}
              nextCard={this.handleNextCard}
              previosCard={this.handlePreviosCard}
            /> 
            ) 
            : <Typography>{messages.loading}</Typography>
          }
        </Grid>
      )
    }
    
    header(){
      return (
        <Grid 
          container direction="row"
          justifyContent="space-around"
          alignItems="center"
          className='header'
        >
          <h1 className='header-title'>
            {messages.taskList}
          </h1>
          <Button className='header-button' onClick={() => this.toggleFormCardModal()}>{messages.addCard}</Button>
        </Grid>
      )
    }

    render() {
      const {openFormModal, editCard} = this.state
      return (
        <div>
          {this.header()}
          <Grid container direction="row"
            justifyContent="space-between"
            className='height100'
          >
            {this.containerCard(messages.todo, 'todo')}
            {this.containerCard(messages.doing, 'doing')}
            {this.containerCard(messages.done, 'done')}
          </Grid>
         {openFormModal && <FormCard currentCard={editCard} onClose={() => this.toggleFormCardModal()} onSubmit={this.handleFormCard}/> }
        </div>
      );
    }
  }

export default CardsList