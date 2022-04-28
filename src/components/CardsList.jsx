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
        list: {
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
      this.handleFormCard = this.handleFormCard.bind(this)
    }
  
    async componentDidMount() {
    
      try {
        const token = await this.getToken()
        const res = await getCards(token)
        const list =  {
          todo:  res.data.filter((item) => item.lista === 'todo'),
          doing: res.data.filter((item) => item.lista === 'doing'),
          done: res.data.filter((item) => item.lista === 'done')
        }
        
        this.setState({
          list,
          currentCard: {
            todo: {card: list.todo[0], index: 0},
            doing: {card: list.doing[0], index: 0},
            done:  {card: list.done[0], index: 0}
          },
          token
        })
      } catch (err) {
        console.log(err)
      }
    }

    async getToken() {
      try {
        const res =  await loginUser()
        return res.data
      } catch (err) {
        console.log(err)
      }
    }
    
    async handleDeleteCard(id, key) {
      const {token, list, currentCard} = this.state
      try {
        
        await deleteCard(id, token)
        const newList =  {...list, [key]: list[key].filter((item) => item.id !== id),}
        this.setState({list: newList, currentCard: {...currentCard, [key]: {card: list[key][0], index: 0}}})
      } catch (err) {
        console.log(err)
      }
      
    }

    handleFormCard = async (card, newCard = true) => {
      const {token, list, currentCard} = this.state
      try {
        if(newCard) {
          const res = await addCard({...card, lista: 'todo'}, token)
          await this.setState({list: {...list, todo: list.todo.concat([res.data])}})
        } else {
          const res = await updateCard(card, card.id, token)
          const index = list[res.data.lista].findIndex((item => item.id === res.data.id))
          list[res.data.lista][index] = res.data
          currentCard[res.data.lista] = {card: res.data, index: index}
          await this.setState({list, currentCard})
        }
      } catch (err) {
        console.log(err)
      }

      this.setState({openFormModal: false, editCard: null})
    }

    handleNextCard(index, key) {
      const {currentCard, list} = this.state
      const nextIndex = index + 1

      if(list[key] && list[key].length -1 < nextIndex) {
        return
      }
         
      this.setState({currentCard: {...currentCard, [key]: {
        card: list[key][nextIndex],
        index: nextIndex
      }} })
    }

    handlePreviosCard(index, key) {
      const {list, currentCard} = this.state
      const previosIndex = index - 1

      if(list[key] && list[key].length -1 < previosIndex || previosIndex <= -1) {
        return
      }
      this.setState({currentCard: {...currentCard, [key]: {
        card: list[key][previosIndex],
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
      const {list, currentCard} = this.state
  
      return (
        <Grid item xs={4} className='list-container'>
          <p  className='list-title'>
            {title}
          </p>
          {list && list[key] && list[key].length > 0  &&
            (<BasicCard 
              currentCard={currentCard[key].card}
              index={currentCard[key].index}
              handleDeleteCard={this.handleDeleteCard}
              handleEditCard={this.handleEditCard}
              nextCard={this.handleNextCard}
              previosCard={this.handlePreviosCard}
            /> 
            ) 
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